import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const OUTPUT_DIR = '/Users/mac/.gemini/antigravity-ide/brain/6e259cf5-aa16-4a39-b96d-32b94dc7fda4/app_store_screenshots';
const DOWNLOADS_DIR = '/Users/mac/Downloads/Mannat_AppStore_Screenshots';
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(DOWNLOADS_DIR)) fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });

async function generate10AppStoreScreenshots() {
  console.log('📸 Generating 10 High-Resolution Luxury App Store Screenshots (1290 x 2796)...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 414, height: 896 },
    deviceScaleFactor: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });

  const page = await context.newPage();

  const SAMPLE_PROFILES = [
    {
      id: 'prof_1',
      user_id: 'usr_ananya_sharma',
      display_name: 'Ananya Sharma',
      age: 26,
      height: "5'7\"",
      city: 'South Mumbai',
      religion: 'Hindu',
      community: 'Brahmin',
      sub_community: 'Saraswat',
      occupation: 'Investment Banker (VP)',
      company_name: 'Morgan Stanley',
      salary_bracket: '₹75L - ₹1Cr+',
      education: 'MBA (IIM Ahmedabad), B.Tech (IIT Bombay)',
      bio_text: 'Passionate about international finance, art collecting, and equestrian sports. Looking for an accomplished, progressive life partner with family values.',
      photos: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80'
      ],
      compatibility_score: 98,
      gun_milan_score: 34,
      is_vouched: true,
      is_spotlight: true,
      is_unlocked: true,
      family_background: 'Father: Managing Director (Industrial Conglomerate), Mother: Classical Vocalist & Philanthropist',
      marriage_expectations: 'Mutual intellectual respect, shared ambitions, and grounded family ethics.',
      diet: 'Vegetarian',
      gender: 'female',
      managed_by: 'self'
    },
    {
      id: 'prof_2',
      user_id: 'usr_rohit_kapoor',
      display_name: 'Rohit Kapoor',
      age: 29,
      height: "6'1\"",
      city: 'New Delhi (Lutyens)',
      religion: 'Hindu',
      community: 'Khatri',
      sub_community: 'Kapoor',
      occupation: 'Founder & Managing Director',
      company_name: 'Kapoor Enterprises',
      salary_bracket: '₹2Cr - ₹5Cr+',
      education: 'BSc Economics (London School of Economics)',
      bio_text: 'Third-generation enterprise builder. Avid polo player, contemporary art enthusiast, and avid traveler.',
      photos: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80'
      ],
      compatibility_score: 96,
      gun_milan_score: 32,
      is_vouched: true,
      is_spotlight: true,
      is_unlocked: true,
      family_background: 'Established industrialist family based in New Delhi.',
      marriage_expectations: 'Accomplished companion with strong family roots.',
      diet: 'Eggetarian',
      gender: 'male',
      managed_by: 'self'
    }
  ];

  async function seedAndNavigate(urlPath) {
    await page.goto(`http://localhost:5173${urlPath}`);
    await page.evaluate((profiles) => {
      const testUser = {
        id: 'usr_active_member',
        email: 'priya.sharma@mannat.vip',
        user_metadata: { full_name: 'Priya Sharma' }
      };
      localStorage.setItem('mannat_active_user', JSON.stringify(testUser));
      localStorage.setItem('mannat_custom_profiles', JSON.stringify(profiles));
      localStorage.setItem('mannat_onboarding_completed', 'true');
    }, SAMPLE_PROFILES);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
  }

  async function createPoster(headline, subheadline, filename) {
    console.log(`📸 Rendering: ${headline} -> ${filename}`);
    await page.waitForTimeout(400);
    const appBuffer = await page.screenshot({ fullPage: false });

    const posterPage = await context.newPage();
    await posterPage.setViewportSize({ width: 1290, height: 2796 });
    const base64App = appBuffer.toString('base64');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Pinyon+Script&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            width: 1290px;
            height: 2796px;
            background: linear-gradient(180deg, #180102 0%, #300205 26%, #FAF7F2 26.1%, #F4EFE6 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            font-family: 'Plus Jakarta Sans', sans-serif;
            overflow: hidden;
            position: relative;
          }
          .header-box {
            height: 740px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 70px 60px 30px;
            z-index: 10;
          }
          .brand-script {
            font-family: 'Pinyon Script', cursive;
            font-size: 54px;
            color: #D8B486;
            margin-bottom: -10px;
          }
          .brand-title {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 80px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #FFFFFF;
            font-weight: 700;
            line-height: 1.1;
            margin-bottom: 20px;
          }
          .headline {
            font-size: 56px;
            font-weight: 800;
            color: #FFFFFF;
            line-height: 1.15;
            margin-bottom: 14px;
            max-width: 1100px;
          }
          .subheadline {
            font-size: 32px;
            font-weight: 600;
            color: #D8B486;
            letter-spacing: 0.03em;
            max-width: 980px;
          }
          .device-wrapper {
            width: 1060px;
            height: 2056px;
            background: #000000;
            border-radius: 96px 96px 0 0;
            border: 14px solid #2D2824;
            border-bottom: none;
            box-shadow: 0 -20px 80px rgba(0, 0, 0, 0.45);
            overflow: hidden;
            position: absolute;
            bottom: 0;
            display: flex;
            flex-direction: column;
          }
          .dynamic-island {
            position: absolute;
            top: 24px;
            left: 50%;
            transform: translateX(-50%);
            width: 260px;
            height: 60px;
            background: #000000;
            border-radius: 40px;
            z-index: 50;
          }
          .app-frame {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top;
          }
        </style>
      </head>
      <body>
        <div class="header-box">
          <div class="brand-script">At</div>
          <div class="brand-title">MANNAT</div>
          <div class="headline">${headline}</div>
          <div class="subheadline">${subheadline}</div>
        </div>
        <div class="device-wrapper">
          <div class="dynamic-island"></div>
          <img class="app-frame" src="data:image/png;base64,${base64App}" />
        </div>
      </body>
      </html>
    `;

    await posterPage.setContent(htmlContent);
    await posterPage.waitForTimeout(300);
    const outPath = path.join(OUTPUT_DIR, filename);
    const dlPath = path.join(DOWNLOADS_DIR, filename);
    await posterPage.screenshot({ path: outPath, fullPage: true });
    await posterPage.screenshot({ path: dlPath, fullPage: true });
    await posterPage.close();
  }

  // 1. Curated Discovery Feed
  await seedAndNavigate('/app');
  await createPoster(
    'Bespoke Matrimonial Alliances',
    'Curated Introductions for Accomplished Families & Pedigrees',
    '01_curated_discovery_feed.png'
  );

  // 2. In-Depth Bio-Data & Dossier
  await seedAndNavigate('/app');
  const detailsBtn = await page.locator('text=Bio-Data').or(page.locator('text=View Full')).or(page.locator('button:has(svg.lucide-chevron-down)')).first();
  if (await detailsBtn.isVisible()) await detailsBtn.click();
  await page.waitForTimeout(500);
  await createPoster(
    'Verified Candidate Dossiers',
    'Deep Cultural, Career & Astrological Kundali Alignment',
    '02_verified_candidate_biodata.png'
  );

  // 3. BlurShield™ Photo Privacy Lock
  await seedAndNavigate('/app');
  const lockBtn = await page.locator('button:has(svg.lucide-lock)').or(page.locator('text=Privacy')).first();
  if (await lockBtn.isVisible()) await lockBtn.click();
  await page.waitForTimeout(500);
  await createPoster(
    'BlurShield™ Photo Privacy',
    '20px Discretion Lock · Unlock Exclusively on Mutual Acceptance',
    '03_blurshield_photo_privacy.png'
  );

  // 4. Mutual Alliance Matches
  await seedAndNavigate('/app');
  const alliancesBtn = await page.locator('button:has-text("Alliances")').first();
  if (await alliancesBtn.isVisible()) await alliancesBtn.click();
  await page.waitForTimeout(500);
  await createPoster(
    'Intentional Connections',
    'Mutual Family Approvals & Interest Wave Introductions',
    '04_mutual_alliances_matches.png'
  );

  // 5. 1-on-1 Encrypted Dialogue
  await seedAndNavigate('/app');
  if (await alliancesBtn.isVisible()) await alliancesBtn.click();
  await page.waitForTimeout(300);
  const chatItem = await page.locator('.cursor-pointer').first();
  if (await chatItem.isVisible()) await chatItem.click();
  await page.waitForTimeout(400);
  await createPoster(
    'Private Concierge & Chat',
    'Discreet 1-on-1 Dialogue with Family Coordination',
    '05_private_encrypted_chat.png'
  );

  // 6. Zero-Tolerance Safety Standards
  await page.goto('http://localhost:5173/guidelines', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await createPoster(
    '100% Safe & Verified Community',
    '1-Tap User Block, Direct Reporting & 24-Hr Removal SLA',
    '06_ugc_safety_and_block.png'
  );

  // 7. Verified Profile & Compatibility
  await seedAndNavigate('/app');
  const profileTab = await page.locator('button:has-text("Profile")').first();
  if (await profileTab.isVisible()) await profileTab.click();
  await page.waitForTimeout(500);
  await createPoster(
    'Pedigree & Compatibility Scoring',
    '36 Gun Milan Vedic Astrological Scoring & Verified Badges',
    '07_verified_profile_scoring.png'
  );

  // 8. Family Share & Parent Portal
  await seedAndNavigate('/app');
  const shareBtn = await page.locator('button:has(svg.lucide-share)').or(page.locator('button:has-text("Share")')).first();
  if (await shareBtn.isVisible()) await shareBtn.click();
  await page.waitForTimeout(500);
  await createPoster(
    'Family Share & Parent Portal',
    'Share Candidate Briefings Securely with Parents & Elders',
    '08_family_share_portal.png'
  );

  // 9. Precision Heritage Filters
  await seedAndNavigate('/app');
  const filterBtn = await page.locator('button[title="Search Filters"]').or(page.locator('button:has(svg.lucide-sliders-horizontal)')).first();
  if (await filterBtn.isVisible()) await filterBtn.click();
  await page.waitForTimeout(500);
  await createPoster(
    'Granular Heritage Filters',
    'Filter by Caste, Sub-Community, Gotra, Profession & Income',
    '09_precision_search_filters.png'
  );

  // 10. Apple Sign In & Instant Privacy
  await page.goto('http://localhost:5173/app', { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('text=Continue with Apple', { timeout: 8000 });
  await createPoster(
    'Discreet VIP Onboarding',
    'One-Tap Sign in with Apple & Instant In-App Data Purge',
    '10_apple_signin_and_privacy.png'
  );

  await browser.close();
  console.log('🎉 10 Luxury App Store Posters generated successfully in Downloads folder!');
}

generate10AppStoreScreenshots().catch(console.error);
