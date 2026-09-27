import fs from 'fs';
import path from 'path';

const host = 'mannatmatrimony.com';
const key = '6343a4e2360e1f19a0c62d1b12eb32ab';
const keyLocation = `https://${host}/${key}.txt`;

// Read all URLs from sitemap.xml
const sitemapContent = fs.readFileSync(path.resolve('public/sitemap.xml'), 'utf-8');
const locMatches = [...sitemapContent.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)];
const urlList = locMatches.map(m => m[1]);

console.log(`Found ${urlList.length} total URLs to submit.`);

async function submitIndexNow() {
  console.log(`Submitting ${urlList.length} URLs to IndexNow API endpoints...`);
  
  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow'
  ];

  const payload = {
    host: host,
    key: key,
    keyLocation: keyLocation,
    urlList: urlList
  };

  for (const endpoint of endpoints) {
    try {
      console.log(`Pinging ${endpoint}...`);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload)
      });
      console.log(`Response from ${endpoint}: status ${res.status} (${res.statusText})`);
    } catch (err) {
      console.error(`Error pinging ${endpoint}:`, err.message);
    }
  }

  // Ping Google Sitemap
  try {
    const sitemapUrl = `https://${host}/sitemap.xml`;
    console.log(`Pinging Google sitemap endpoint for ${sitemapUrl}...`);
    const googleRes = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
    console.log(`Google ping status: ${googleRes.status}`);
  } catch (err) {
    console.log(`Google ping note:`, err.message);
  }

  console.log('✅ Indexing submission completed successfully!');
}

submitIndexNow();
