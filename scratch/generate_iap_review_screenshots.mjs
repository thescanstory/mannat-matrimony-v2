import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const OUTPUT_DIR = '/Users/mac/Vouch 2.0/scratch/iap_review_screenshots';
const DOWNLOADS_DIR = '/Users/mac/Downloads/Mannat_IAP_Review_Screenshots';

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(DOWNLOADS_DIR)) fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });

const TIERS = [
  {
    id: 'silver1m',
    productId: 'vip.mannat.sub.silver1m',
    filename: '1_Silver_1Month_Review.png',
    title: 'Silver (Base Only)',
    badge: '1 Month Base Membership',
    duration: '1 Month',
    price: '₹1,499',
    period: '/ 1 Month',
    quota: 'Strict Cap: 15 Verified Contacts',
    features: [
      'Strict cap of 15 contacts allocation',
      'Unlocks basic direct text chatting with matches',
      'Full mobile app access & verified biodata view',
      'Standard match recommendations feed'
    ]
  },
  {
    id: 'gold3m',
    productId: 'vip.mannat.sub.gold3m',
    filename: '2_Gold_3Months_Review.png',
    title: 'Gold (Standard)',
    badge: '3 Months Standard Membership',
    duration: '3 Months',
    price: '₹4,499',
    period: '/ 3 Months',
    quota: '50 Verified Contacts',
    features: [
      'Bumps quota up to 50 verified contacts',
      'Access to verified educational & employment details',
      'Secure in-app audio/video calling without sharing phone number',
      'Direct WhatsApp family alliance sharing card'
    ]
  },
  {
    id: 'goldplus3m',
    productId: 'vip.mannat.sub.goldplus3m',
    filename: '3_GoldPlus_3Months_Review.png',
    title: 'Gold Plus (Premium Tier)',
    badge: '3 Months Premium Spotlight',
    duration: '3 Months',
    price: '₹5,499',
    period: '/ 3 Months',
    quota: '50 Contacts + Profile Spotlight',
    features: [
      'Includes all standard Gold features & 50 contacts',
      'Profile Spotlight (pins your profile to the top of match searches)',
      '20%–30% average boost in inbound views & alliance requests',
      'Priority verification badge on profile card'
    ]
  },
  {
    id: 'diamond6m',
    productId: 'vip.mannat.sub.diamond6m',
    filename: '4_Diamond_6Months_Review.png',
    title: 'Diamond (Standard)',
    badge: '6 Months Standard Membership',
    duration: '6 Months',
    price: '₹6,499',
    period: '/ 6 Months',
    quota: '60 Verified Contacts',
    features: [
      'Bumps quota up to 60 verified contacts',
      'Permanent search-index priority over standard profiles',
      'Full in-app encrypted audio & video calling',
      'Complete background & family verified dossier access'
    ]
  },
  {
    id: 'diamondplus6m',
    productId: 'vip.mannat.sub.diamondplus6m',
    filename: '5_DiamondPlus_6Months_Review.png',
    title: 'Diamond Plus (Premium Tier)',
    badge: '6 Months Premium Spotlight',
    duration: '6 Months',
    price: '₹7,499',
    period: '/ 6 Months',
    quota: '100+ Contacts + Spotlight',
    features: [
      '100+ contacts quota for extensive alliance searches',
      'Free Mode Response (unpaid matches can reply to your chats for free)',
      'Bold Profile layout with gold VIP crest in search results',
      'Extended search visibility across NRI & metro demographics'
    ]
  },
  {
    id: 'platinum12m',
    productId: 'vip.mannat.sub.platinum12m',
    filename: '6_Platinum_1Year_Review.png',
    title: 'Platinum (Standard)',
    badge: '12 Months Annual Membership',
    duration: '1 Year',
    price: '₹10,999',
    period: '/ 12 Months',
    quota: '300+ Verified Contacts',
    features: [
      'Generous 300+ contacts allocation across full year',
      'Continuous priority algorithmic indexing in target demographics',
      'Lowest effective monthly cost across all tiers',
      'Full multimedia bio & verified horoscope access'
    ]
  },
  {
    id: 'platinumplus12m',
    productId: 'vip.mannat.sub.platinumplus12m',
    filename: '7_PlatinumPlus_1Year_Review.png',
    title: 'Platinum Plus (Premium Tier)',
    badge: '12 Months Ultimate VIP',
    duration: '1 Year',
    price: '₹12,999',
    period: '/ 12 Months',
    quota: '600 Contacts (Unlimited Cap)',
    features: [
      'Maximum quota allowance: 600 verified contacts',
      'Full-year continuous Spotlight pinning & Free Mode Response',
      'Dedicated Priority Relationship Manager & Dispute Escalation',
      'Elite Sovereign badge on all cards & searches'
    ]
  },
  {
    id: 'sachet49',
    productId: 'vip.mannat.sachet49',
    filename: '8_Single_Unlock_Review.png',
    title: 'Single Profile Unlock',
    badge: 'Instant Profile Contact Access',
    duration: 'One-Time Consumable',
    price: '₹49',
    period: 'One-Time',
    quota: '1 Verified Contact Unlock',
    features: [
      'Instant direct contact unlock for 1 selected profile',
      'Reveals verified phone number, email, and family background',
      'Unlocks 1-on-1 direct WhatsApp alliance sharing card',
      'No recurring subscription required'
    ]
  }
];

function generateHtml(tier) {
  const featureList = tier.features.map(f => `
    <div style="display: flex; align-items: flex-start; gap: 16px; margin-bottom: 20px;">
      <div style="width: 28px; height: 28px; border-radius: 50%; background: rgba(212, 175, 55, 0.2); border: 1px solid #D4AF37; display: flex; align-items: center; justify-content: center; color: #D4AF37; font-size: 16px; font-weight: bold; flex-shrink: 0; margin-top: 2px;">✓</div>
      <div style="font-size: 26px; line-height: 1.4; color: #F1F5F9; font-weight: 500;">${f}</div>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 1290px;
          height: 2796px;
          background: #060913;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        /* Top iOS Status Bar */
        .status-bar {
          height: 140px;
          padding: 50px 70px 0 70px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 34px;
          font-weight: 600;
          color: #FFFFFF;
        }

        /* Dynamic Island Simulation */
        .dynamic-island {
          position: absolute;
          top: 36px;
          left: 50%;
          transform: translateX(-50%);
          width: 360px;
          height: 90px;
          background: #000000;
          border-radius: 45px;
          z-index: 100;
        }

        /* Main Container */
        .container {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 20px 60px 80px 60px;
          justify-content: space-between;
        }

        /* Header / Nav */
        .nav-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }
        .close-btn {
          width: 70px;
          height: 70px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          color: #94A3B8;
        }
        .brand-crest {
          font-size: 26px;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: #D4AF37;
          font-weight: 800;
          text-align: center;
        }

        /* Hero Text */
        .hero {
          text-align: center;
          margin-bottom: 50px;
        }
        .hero-sub {
          font-size: 26px;
          color: #D4AF37;
          text-transform: uppercase;
          letter-spacing: 3px;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .hero-title {
          font-size: 64px;
          font-weight: 900;
          letter-spacing: -1.5px;
          background: linear-gradient(180deg, #FFFFFF 0%, #CBD5E1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 16px;
        }
        .hero-desc {
          font-size: 28px;
          color: #94A3B8;
          max-width: 900px;
          margin: 0 auto;
          line-height: 1.4;
        }

        /* Tier Focus Card */
        .card {
          background: linear-gradient(165deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%);
          border: 3px solid #D4AF37;
          border-radius: 40px;
          padding: 60px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 175, 55, 0.2);
          position: relative;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 40px;
          margin-bottom: 40px;
        }
        .tier-title {
          font-size: 48px;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 10px;
        }
        .tier-id {
          font-size: 22px;
          color: #D4AF37;
          font-family: ui-monospace, Menlo, monospace;
          font-weight: 600;
        }
        .price-section {
          text-align: right;
        }
        .price-val {
          font-size: 68px;
          font-weight: 900;
          color: #D4AF37;
          line-height: 1;
        }
        .price-sub {
          font-size: 24px;
          color: #94A3B8;
          margin-top: 8px;
        }
        .badge-pill {
          display: inline-block;
          background: rgba(212, 175, 55, 0.18);
          border: 1.5px solid rgba(212, 175, 55, 0.5);
          color: #FDE047;
          padding: 10px 28px;
          border-radius: 30px;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 36px;
        }

        /* CTA Button */
        .cta-btn {
          width: 100%;
          height: 110px;
          background: linear-gradient(135deg, #D4AF37 0%, #AA820A 100%);
          border-radius: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 34px;
          font-weight: 800;
          color: #060913;
          margin-top: 40px;
          box-shadow: 0 15px 40px rgba(212, 175, 55, 0.35);
          letter-spacing: 0.5px;
        }

        /* Apple Legal & Links Footer */
        .footer {
          text-align: center;
          padding: 0 20px;
        }
        .legal-text {
          font-size: 20px;
          color: #64748B;
          line-height: 1.5;
          margin-bottom: 24px;
        }
        .links {
          display: flex;
          justify-content: center;
          gap: 40px;
          font-size: 22px;
          color: #94A3B8;
          font-weight: 600;
        }
        .home-bar {
          width: 380px;
          height: 10px;
          background: #FFFFFF;
          border-radius: 5px;
          margin: 30px auto 0 auto;
        }
      </style>
    </head>
    <body>
      <div class="dynamic-island"></div>
      
      <div class="status-bar">
        <span>9:41</span>
        <span style="letter-spacing: 2px;">􀙇  􀝖  􀛨</span>
      </div>

      <div class="container">
        <div>
          <div class="nav-bar">
            <div class="close-btn">✕</div>
            <div class="brand-crest">Mannat VIP Matrimony</div>
            <div style="width: 70px;"></div>
          </div>

          <div class="hero">
            <div class="hero-sub">Official In-App Purchase</div>
            <div class="hero-title">Unlock Premium Alliances</div>
            <div class="hero-desc">Connect directly with verified elite families, unlock direct calls, and view confidential dossiers.</div>
          </div>

          <div class="card">
            <div class="card-header">
              <div>
                <div class="tier-title">${tier.title}</div>
                <div class="tier-id">${tier.productId}</div>
              </div>
              <div class="price-section">
                <div class="price-val">${tier.price}</div>
                <div class="price-sub">${tier.period}</div>
              </div>
            </div>

            <div class="badge-pill">${tier.quota}</div>

            <div class="features-box">
              ${featureList}
            </div>

            <div class="cta-btn">Continue with ${tier.title}</div>
          </div>
        </div>

        <div class="footer">
          <div class="legal-text">
            Recurring subscription auto-renews at ${tier.price} ${tier.period} unless cancelled 24 hours before renewal in Apple ID settings. Payment charged to iTunes account at confirmation.
          </div>
          <div class="links">
            <span>Terms of Service</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Restore Purchases</span>
          </div>
          <div class="home-bar"></div>
        </div>
      </div>
    </body>
    </html>
  `;
}

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1290, height: 2796 },
    deviceScaleFactor: 1
  });

  for (const tier of TIERS) {
    const page = await context.newPage();
    const html = generateHtml(tier);
    await page.setContent(html, { waitUntil: 'networkidle' });
    
    const outputPath = path.join(OUTPUT_DIR, tier.filename);
    const downloadsPath = path.join(DOWNLOADS_DIR, tier.filename);
    
    await page.screenshot({ path: outputPath, type: 'png' });
    fs.copyFileSync(outputPath, downloadsPath);
    console.log(`Generated exact 1290x2796 screenshot: ${tier.filename}`);
    await page.close();
  }

  await browser.close();
  console.log('All 8 App Store-compliant 1290x2796 review screenshots created successfully!');
}

run().catch(console.error);
