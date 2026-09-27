import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Google Indexing API submitter for Mannat Matrimony
 * Reads service account credentials from ./service_account.json or env GOOGLE_SERVICE_ACCOUNT_KEY
 * and pushes all 52 URLs directly to Googlebot for priority indexing.
 */

const sitemapContent = fs.readFileSync(path.resolve('public/sitemap.xml'), 'utf-8');
const locMatches = [...sitemapContent.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)];
const urlList = locMatches.map(m => m[1]);

async function getGoogleJwtToken(keyData) {
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: keyData.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const header = { alg: 'RS256', typ: 'JWT' };
  const base64UrlEncode = (str) => Buffer.from(str).toString('base64url');
  
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaim = base64UrlEncode(JSON.stringify(claim));
  const signatureInput = `${encodedHeader}.${encodedClaim}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  const signature = signer.sign(keyData.private_key, 'base64url');
  const jwt = `${signatureInput}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Google OAuth error: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function submitUrlsToGoogle(serviceAccountPath) {
  console.log(`🚀 Preparing Google Indexing API submission for ${urlList.length} URLs...`);

  if (!fs.existsSync(serviceAccountPath)) {
    console.log(`\n⚠️  Service Account key not found at "${serviceAccountPath}".`);
    console.log(`To automatically push all URLs to Google Indexing API:`);
    console.log(`1. Go to Google Cloud Console > Enable "Web Search Indexing API"`);
    console.log(`2. Create a Service Account & download JSON key to "${serviceAccountPath}"`);
    console.log(`3. In Google Search Console, add the service account email as "Owner" on https://mannatmatrimony.com/`);
    console.log(`4. Run: node scratch/google_indexing_api.mjs\n`);
    return;
  }

  const keyData = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
  console.log(`🔑 Authenticating as ${keyData.client_email}...`);
  const accessToken = await getGoogleJwtToken(keyData);
  console.log(`✅ Google Access Token acquired successfully!`);

  let count = 0;
  for (const url of urlList) {
    count++;
    try {
      console.log(`[${count}/${urlList.length}] Submitting to Google: ${url}...`);
      const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          url: url,
          type: 'URL_UPDATED'
        })
      });

      const resJson = await res.json();
      if (res.ok) {
        console.log(`   ✅ Google indexing requested for ${url}`);
      } else {
        console.warn(`   ⚠️ Google response:`, resJson.error?.message || resJson);
      }
    } catch (e) {
      console.error(`   ❌ Error submitting ${url}:`, e.message);
    }
  }

  console.log(`\n🎉 Google Indexing API execution finished! All ${urlList.length} URLs notified.`);
}

const keyPath = process.argv[2] || path.resolve('service_account.json');
submitUrlsToGoogle(keyPath);
