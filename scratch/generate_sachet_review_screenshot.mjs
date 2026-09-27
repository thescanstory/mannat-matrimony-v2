import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const OUTPUT_DIR = '/Users/mac/Vouch 2.0/scratch/iap_review_screenshots';
const DOWNLOADS_DIR = '/Users/mac/Downloads/Mannat_IAP_Review_Screenshots';

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(DOWNLOADS_DIR)) fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });

function generateSachetHtml() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Pinyon+Script&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 1290px;
          height: 2796px;
          background: #0D0304;
          font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
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

        .container {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 30px 60px 80px 60px;
          justify-content: space-between;
        }

        .nav-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .back-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(86, 4, 6, 0.7);
          border: 2px solid rgba(161, 123, 94, 0.5);
          padding: 14px 28px;
          border-radius: 40px;
          font-size: 26px;
          font-weight: 700;
          color: #D8B486;
        }
        .brand-crest {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 44px;
          letter-spacing: 6px;
          text-transform: uppercase;
          color: #D8B486;
          font-weight: 700;
          text-align: center;
        }

        .sachet-modal-card {
          background: linear-gradient(180deg, #2A0306 0%, #1A0103 100%);
          border: 3px solid #A17B5E;
          border-radius: 56px;
          padding: 60px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.9), 0 0 50px rgba(86,4,6,0.8);
          margin-top: 20px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 36px;
          border-bottom: 2px solid rgba(255,255,255,0.1);
          margin-bottom: 44px;
        }
        .header-title-box {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .zap-badge {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(161, 123, 94, 0.25);
          border: 2px solid #A17B5E;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 38px;
          color: #D8B486;
        }
        .modal-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 52px;
          font-weight: 700;
          color: #FFFFFF;
        }
        .modal-subtitle {
          font-size: 26px;
          color: #A17B5E;
          font-weight: 600;
          margin-top: 4px;
        }

        .profile-preview {
          display: flex;
          align-items: center;
          gap: 30px;
          background: rgba(28, 1, 2, 0.85);
          border: 2px solid rgba(161, 123, 94, 0.4);
          border-radius: 36px;
          padding: 36px;
          margin-bottom: 40px;
        }
        .profile-avatar {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          border: 4px solid #A17B5E;
          object-fit: cover;
          background: #3A0204;
        }
        .profile-info {
          flex: 1;
        }
        .profile-name {
          font-size: 38px;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 8px;
        }
        .profile-sub {
          font-size: 26px;
          color: #CBD5E1;
        }
        .profile-badge {
          display: inline-block;
          margin-top: 12px;
          background: #560406;
          border: 1.5px solid rgba(161, 123, 94, 0.6);
          color: #D8B486;
          padding: 6px 20px;
          border-radius: 20px;
          font-size: 22px;
          font-weight: 700;
        }
        .price-box {
          text-align: right;
        }
        .old-price {
          font-size: 28px;
          color: #94A3B8;
          text-decoration: line-through;
        }
        .current-price {
          font-size: 64px;
          font-weight: 900;
          color: #D8B486;
          line-height: 1.1;
        }

        .benefits-box {
          background: rgba(28, 1, 2, 0.6);
          border: 2px solid rgba(161, 123, 94, 0.3);
          border-radius: 32px;
          padding: 40px;
          margin-bottom: 44px;
        }
        .benefit-row {
          display: flex;
          align-items: center;
          gap: 22px;
          font-size: 28px;
          color: #F1F5F9;
          font-weight: 500;
          margin-bottom: 24px;
        }
        .benefit-row:last-child {
          margin-bottom: 0;
        }
        .check-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(216, 180, 134, 0.2);
          border: 1.5px solid #D8B486;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #D8B486;
          font-size: 20px;
          font-weight: bold;
          flex-shrink: 0;
        }

        .product-meta {
          background: rgba(0,0,0,0.3);
          border-radius: 24px;
          padding: 24px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 24px;
          color: #A17B5E;
          margin-bottom: 44px;
        }
        .product-meta code {
          color: #F5E6D3;
          font-family: ui-monospace, Menlo, monospace;
          font-weight: 700;
        }

        .cta-btn {
          width: 100%;
          height: 110px;
          background: linear-gradient(135deg, #D8B486 0%, #C5A880 50%, #A17B5E 100%);
          border-radius: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 34px;
          font-weight: 800;
          color: #1C0102;
          box-shadow: 0 20px 50px rgba(161, 123, 94, 0.4);
          letter-spacing: 0.5px;
          margin-bottom: 30px;
        }

        .apple-notice {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          font-size: 24px;
          color: #94A3B8;
          font-weight: 600;
        }

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
            <div class="back-pill">‹ Back</div>
            <div class="brand-crest">MANNAT</div>
            <div style="width: 100px;"></div>
          </div>

          <div class="sachet-modal-card">
            <div class="modal-header">
              <div class="header-title-box">
                <div class="zap-badge">⚡</div>
                <div>
                  <div class="modal-title">Single Profile Unlock</div>
                  <div class="modal-subtitle">Instant Profile &amp; Contact Access</div>
                </div>
              </div>
            </div>

            <div class="profile-preview">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face" class="profile-avatar" alt="Avatar" />
              <div class="profile-info">
                <div class="profile-name">Ananya Malhotra</div>
                <div class="profile-sub">27 yrs • Mumbai • Investment Banker</div>
                <div class="profile-badge">⚡ BlurShield™ Unlocked Instantly</div>
              </div>
              <div class="price-box">
                <div class="old-price">₹199</div>
                <div class="current-price">₹49</div>
              </div>
            </div>

            <div class="benefits-box">
              <div class="benefit-row">
                <div class="check-icon">✓</div>
                <span>Reveal Full Name, Company &amp; Specific Salary Bracket</span>
              </div>
              <div class="benefit-row">
                <div class="check-icon">✓</div>
                <span>Unlock Traditional Bio-data &amp; Family Background Card</span>
              </div>
              <div class="benefit-row">
                <div class="check-icon">✓</div>
                <span>Generate Shareable Family WhatsApp Web Portal Link</span>
              </div>
            </div>

            <div class="product-meta">
              <span>Apple In-App Purchase ID:</span>
              <code>vip.mannat.sachet49</code>
            </div>

            <div class="cta-btn">Unlock Profile for ₹49 (One-Time) →</div>

            <div class="apple-notice">
              <span> Apple StoreKit &amp; 256-bit Encrypted Checkout</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <div class="legal-text">
            One-time consumable In-App Purchase charged to your Apple ID Account at confirmation. Unlocks candidate biodata instantly.
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

  const page = await context.newPage();
  const html = generateSachetHtml();
  await page.setContent(html, { waitUntil: 'networkidle' });
  
  const filename = '8_Single_Unlock_Review.png';
  const outputPath = path.join(OUTPUT_DIR, filename);
  const downloadsPath = path.join(DOWNLOADS_DIR, filename);
  
  await page.screenshot({ path: outputPath, type: 'png' });
  fs.copyFileSync(outputPath, downloadsPath);
  console.log(`Successfully generated exact luxury Sachet screenshot at: ${downloadsPath}`);
  
  await browser.close();
}

run().catch(console.error);
