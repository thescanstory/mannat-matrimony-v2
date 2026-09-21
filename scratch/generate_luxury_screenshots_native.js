import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIRS = [
  '/Users/mac/.gemini/antigravity-ide/brain/6e259cf5-aa16-4a39-b96d-32b94dc7fda4/app_store_screenshots',
  '/Users/mac/Downloads/Mannat_AppStore_Screenshots'
];

OUTPUT_DIRS.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function getBase64Image(relPath) {
  const fullPath = path.join('/Users/mac/Vouch 2.0/public/images/vip', relPath);
  if (fs.existsSync(fullPath)) {
    const data = fs.readFileSync(fullPath);
    return `data:image/jpeg;base64,${data.toString('base64')}`;
  }
  return '';
}

const IMG_COUPLE = getBase64Image('synthetic_couple_royal.jpg');
const IMG_BRIDE_ROYAL = getBase64Image('synthetic_bride_royal.jpg');
const IMG_GROOM_ROYAL = getBase64Image('synthetic_groom_royal.jpg');
const IMG_BRIDE_PASTEL = getBase64Image('synthetic_bride_pastel.jpg');

const IMG_BRIDE_1 = IMG_COUPLE || IMG_BRIDE_ROYAL;
const IMG_BRIDE_2 = IMG_BRIDE_ROYAL;
const IMG_BRIDE_3 = IMG_BRIDE_PASTEL;
const IMG_GROOM_1 = IMG_GROOM_ROYAL;

const screens = [
  {
    id: '01_curated_discovery_feed',
    title: 'Bespoke Matrimonial Alliances',
    subtitle: 'Curated Introductions for Distinguished Families & Pedigrees',
    innerHtml: `
      <!-- Phone Top Bar -->
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 24px 44px; border-bottom: 2px solid rgba(212,175,55,0.25);">
        <div>
          <span style="font-family:'Cinzel', serif; font-size:34px; letter-spacing:6px; color:#D4AF37; font-weight:700;">MANNAT</span>
          <span style="display:block; font-size:17px; letter-spacing:3px; color:#A0907A; font-weight:500;">EXCLUSIVE SANCTUARY</span>
        </div>
        <div style="background:linear-gradient(135deg, #4A0E17, #7A1828); border:2px solid #D4AF37; padding:12px 24px; border-radius:30px; font-size:20px; font-weight:700; color:#F5E6C8; letter-spacing:1px; display:flex; align-items:center; gap:10px;">
          <span>⚡</span> Top 1% Verified
        </div>
      </div>

      <!-- Main Profile Hero Card (Fills height beautifully) -->
      <div style="flex:1; margin:20px 32px 16px; border-radius:44px; overflow:hidden; position:relative; box-shadow:0 30px 80px rgba(0,0,0,0.7); border:2px solid rgba(212,175,55,0.45); display:flex; flex-direction:column; justify-content:flex-end;">
        <img src="${IMG_BRIDE_1}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center top;" />
        <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(15,8,10,0.1) 0%, rgba(20,5,10,0.3) 45%, rgba(10,2,5,0.96) 88%);"></div>

        <!-- Top Badges inside photo -->
        <div style="position:absolute; top:32px; left:32px; right:32px; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; gap:14px;">
            <div style="background:rgba(20,8,12,0.9); backdrop-filter:blur(20px); border:2px solid #D4AF37; padding:12px 24px; border-radius:26px; font-size:21px; font-weight:700; color:#F5E6C8; display:flex; align-items:center; gap:10px;">
              ✨ 98% Compatibility
            </div>
            <div style="background:rgba(20,8,12,0.9); backdrop-filter:blur(20px); border:2px solid rgba(255,255,255,0.3); padding:12px 24px; border-radius:26px; font-size:21px; font-weight:600; color:#E8D8C8;">
              🛡️ DigiLocker Verified
            </div>
          </div>
          <div style="background:rgba(74,14,23,0.95); border:2px solid #D4AF37; padding:12px 24px; border-radius:26px; font-size:20px; font-weight:700; color:#FFDF80;">
            🕉️ 34/36 Gunas
          </div>
        </div>

        <!-- Candidate Details Overlay -->
        <div style="position:relative; z-index:2; padding:36px 36px 32px;">
          <div style="display:flex; align-items:baseline; gap:18px; margin-bottom:10px;">
            <span style="font-family:'Cinzel', serif; font-size:50px; font-weight:700; color:#FFFFFF; letter-spacing:0.5px;">Ananya Sharma, 26</span>
            <span style="background:#22C55E; color:#FFFFFF; font-size:18px; font-weight:800; padding:8px 18px; border-radius:16px; letter-spacing:1px;">✓ VERIFIED</span>
          </div>
          <div style="font-size:26px; color:#F5E6C8; font-weight:500; margin-bottom:20px; display:flex; align-items:center; gap:12px;">
            <span>📍 South Mumbai & London</span>
            <span>•</span>
            <span>Hindu (Saraswat Brahmin)</span>
          </div>

          <!-- Highlight Pill -->
          <div style="background:rgba(255,255,255,0.12); backdrop-filter:blur(24px); border:2px solid rgba(212,175,55,0.45); border-radius:26px; padding:20px 26px; margin-bottom:22px; display:flex; align-items:center; gap:20px;">
            <span style="font-size:36px;">💼</span>
            <div>
              <div style="font-size:24px; font-weight:700; color:#FFFFFF;">VP, Investment Banking · Morgan Stanley</div>
              <div style="font-size:20px; color:#D4AF37; margin-top:3px;">MBA (IIM Ahmedabad) • B.Tech (IIT Bombay)</div>
            </div>
          </div>

          <!-- Tags -->
          <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:26px;">
            <span style="background:rgba(0,0,0,0.65); border:1.5px solid rgba(255,255,255,0.25); padding:12px 22px; border-radius:20px; font-size:20px; color:#E0D0C0;">🏛️ Industrialist Family</span>
            <span style="background:rgba(0,0,0,0.65); border:1.5px solid rgba(255,255,255,0.25); padding:12px 22px; border-radius:20px; font-size:20px; color:#E0D0C0;">🌱 Strictly Vegetarian</span>
            <span style="background:rgba(0,0,0,0.65); border:1.5px solid rgba(255,255,255,0.25); padding:12px 22px; border-radius:20px; font-size:20px; color:#E0D0C0;">🎾 Classical Polo & Tennis</span>
          </div>

          <!-- Action Buttons -->
          <div style="display:grid; grid-template-columns: 1fr 1.3fr; gap:18px;">
            <div style="background:rgba(255,255,255,0.08); border:2px solid rgba(212,175,55,0.5); padding:24px 0; border-radius:26px; text-align:center; font-size:24px; font-weight:700; color:#F5E6C8; display:flex; align-items:center; justify-content:center; gap:12px;">
              <span>Bio-Data</span> ↗
            </div>
            <div style="background:linear-gradient(135deg, #7A1828, #4A0E17); border:2px solid #D4AF37; box-shadow:0 10px 30px rgba(122,24,40,0.6); padding:24px 0; border-radius:26px; text-align:center; font-size:24px; font-weight:800; color:#FFF; display:flex; align-items:center; justify-content:center; gap:12px;">
              <span>Express Interest</span> 💌
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Bar -->
      <div style="background:#0F0508; border-top:2px solid rgba(212,175,55,0.25); padding:24px 56px 34px; display:flex; justify-content:space-between; align-items:center;">
        <div style="text-align:center; color:#D4AF37;">
          <div style="font-size:36px;">🏛️</div>
          <div style="font-size:18px; font-weight:700; margin-top:4px;">Discover</div>
        </div>
        <div style="text-align:center; color:#8A7A70;">
          <div style="font-size:36px;">✨</div>
          <div style="font-size:18px; font-weight:600; margin-top:4px;">For You</div>
        </div>
        <div style="text-align:center; color:#8A7A70;">
          <div style="font-size:36px;">💌</div>
          <div style="font-size:18px; font-weight:600; margin-top:4px;">Alliances</div>
        </div>
        <div style="text-align:center; color:#8A7A70;">
          <div style="font-size:36px;">👤</div>
          <div style="font-size:18px; font-weight:600; margin-top:4px;">Profile</div>
        </div>
      </div>
    `
  },
  {
    id: '02_verified_candidate_biodata',
    title: 'Verified Candidate Dossiers',
    subtitle: 'Comprehensive Lineage, Academic Standing & Government Verification',
    innerHtml: `
      <!-- Phone Top Bar -->
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 24px 44px; border-bottom: 2px solid rgba(212,175,55,0.25);">
        <div style="display:flex; align-items:center; gap:18px;">
          <span style="font-size:32px; color:#D4AF37;">←</span>
          <span style="font-family:'Cinzel', serif; font-size:30px; letter-spacing:3px; color:#FFFFFF; font-weight:700;">CANDIDATE DOSSIER</span>
        </div>
        <div style="background:rgba(212,175,55,0.15); border:2px solid #D4AF37; padding:10px 22px; border-radius:24px; font-size:19px; font-weight:700; color:#FFDF80;">
          ✓ 100% Authenticated
        </div>
      </div>

      <!-- Dossier Content (100% full screen perfectly spanning height) -->
      <div style="flex:1; padding:18px 32px; display:flex; flex-direction:column; gap:16px; justify-content:space-between; overflow:hidden;">
        <!-- Hero Header with Full Photo Banner -->
        <div style="height:860px; border-radius:36px; overflow:hidden; position:relative; border:2px solid rgba(212,175,55,0.45); box-shadow:0 20px 60px rgba(0,0,0,0.6); display:flex; flex-direction:column; justify-content:flex-end;">
          <img src="${IMG_BRIDE_2}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center top;" />
          <div style="position:absolute; inset:0; background:linear-gradient(180deg, transparent 20%, rgba(10,2,5,0.96) 86%);"></div>
          <div style="position:relative; z-index:2; padding:34px 36px;">
            <div style="display:flex; justify-content:space-between; align-items:baseline;">
              <div style="font-family:'Cinzel', serif; font-size:50px; font-weight:700; color:#FFF;">Priya Mehra, 27</div>
              <span style="background:#22C55E; color:#FFF; font-size:19px; font-weight:800; padding:8px 18px; border-radius:14px;">✓ OFFICIAL AUDIT</span>
            </div>
            <div style="font-size:28px; color:#D4AF37; font-weight:600; margin-top:4px;">Lead Product Manager · Big Tech</div>
            <div style="font-size:22px; color:#E0D0C0; margin-top:4px;">Seattle, WA & Bandra West, Mumbai</div>
          </div>
        </div>

        <!-- Quick 4-Grid Metrics -->
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px;">
          <div style="background:rgba(255,255,255,0.06); border:2px solid rgba(212,175,55,0.25); border-radius:20px; padding:20px 8px; text-align:center;">
            <div style="font-size:15px; color:#A09080; font-weight:700; letter-spacing:1px;">HEIGHT</div>
            <div style="font-size:25px; color:#FFF; font-weight:800; margin-top:4px;">5'6" (168cm)</div>
          </div>
          <div style="background:rgba(255,255,255,0.06); border:2px solid rgba(212,175,55,0.25); border-radius:20px; padding:20px 8px; text-align:center;">
            <div style="font-size:15px; color:#A09080; font-weight:700; letter-spacing:1px;">COMMUNITY</div>
            <div style="font-size:25px; color:#FFF; font-weight:800; margin-top:4px;">Khatri</div>
          </div>
          <div style="background:rgba(255,255,255,0.06); border:2px solid rgba(212,175,55,0.25); border-radius:20px; padding:20px 8px; text-align:center;">
            <div style="font-size:15px; color:#A09080; font-weight:700; letter-spacing:1px;">KUNDLI</div>
            <div style="font-size:25px; color:#FFDF80; font-weight:800; margin-top:4px;">34/36</div>
          </div>
          <div style="background:rgba(255,255,255,0.06); border:2px solid rgba(212,175,55,0.25); border-radius:20px; padding:20px 8px; text-align:center;">
            <div style="font-size:15px; color:#A09080; font-weight:700; letter-spacing:1px;">DIET</div>
            <div style="font-size:25px; color:#FFF; font-weight:800; margin-top:4px;">Vegetarian</div>
          </div>
        </div>

        <!-- Section 1: Family Heritage -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:26px; padding:24px 30px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1.5px solid rgba(255,255,255,0.1); padding-bottom:8px;">
            <span style="font-size:24px; font-weight:700; color:#D4AF37; display:flex; align-items:center; gap:10px;">🏛️ Family Heritage & Pedigree</span>
            <span style="font-size:16px; color:#22C55E; font-weight:800; background:rgba(34,197,94,0.15); padding:6px 12px; border-radius:10px;">✓ Verified Lineage</span>
          </div>
          <div style="display:grid; grid-template-columns:140px 1fr; row-gap:6px; font-size:20px;">
            <span style="color:#A09080;">Father:</span>
            <span style="color:#FFF; font-weight:600;">Managing Director, Industrial Mfg Group</span>
            <span style="color:#A09080;">Mother:</span>
            <span style="color:#FFF; font-weight:600;">Classical Vocalist & Philanthropist</span>
            <span style="color:#A09080;">Grandfather:</span>
            <span style="color:#FFF; font-weight:600;">Former Justice, High Court of Bombay</span>
            <span style="color:#A09080;">Ancestral:</span>
            <span style="color:#FFF; font-weight:600;">South Mumbai & Civil Lines Delhi</span>
          </div>
        </div>

        <!-- Section 2: Education & Career Standing -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:26px; padding:24px 30px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1.5px solid rgba(255,255,255,0.1); padding-bottom:8px;">
            <span style="font-size:24px; font-weight:700; color:#D4AF37; display:flex; align-items:center; gap:10px;">🎓 Education & Career Standing</span>
            <span style="font-size:16px; color:#22C55E; font-weight:800; background:rgba(34,197,94,0.15); padding:6px 12px; border-radius:10px;">✓ Form-16 Verified</span>
          </div>
          <div style="display:grid; grid-template-columns:140px 1fr; row-gap:6px; font-size:20px;">
            <span style="color:#A09080;">Education:</span>
            <span style="color:#FFF; font-weight:600;">B.Tech (IIT Bombay), MS (Stanford)</span>
            <span style="color:#A09080;">Current:</span>
            <span style="color:#FFF; font-weight:600;">Lead Product Manager · Big Tech</span>
            <span style="color:#A09080;">Income:</span>
            <span style="color:#FFDF80; font-weight:800;">₹95 Lakhs – ₹1.4 Cr ($180k+ USD)</span>
          </div>
        </div>

        <!-- Section 3: Astrological & Values -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:26px; padding:24px 30px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1.5px solid rgba(255,255,255,0.1); padding-bottom:8px;">
            <span style="font-size:24px; font-weight:700; color:#D4AF37; display:flex; align-items:center; gap:10px;">🕉️ Astrological & Lifestyle Profile</span>
            <span style="font-size:16px; color:#FFDF80; font-weight:800; background:rgba(212,175,55,0.15); padding:6px 12px; border-radius:10px;">Manglik: No</span>
          </div>
          <div style="display:grid; grid-template-columns:140px 1fr; row-gap:6px; font-size:20px;">
            <span style="color:#A09080;">Guna Score:</span>
            <span style="color:#FFF; font-weight:600;">34 / 36 Gunas (Nadi: Madhya, Rashi: Leo)</span>
            <span style="color:#A09080;">Lifestyle:</span>
            <span style="color:#FFF; font-weight:600;">Vegetarian · Non-Smoker · Teetotaler</span>
            <span style="color:#A09080;">Passions:</span>
            <span style="color:#FFF; font-weight:600;">Equestrian Polo, Classical Music</span>
          </div>
        </div>

        <!-- Section 4: DigiLocker Badges -->
        <div style="background:rgba(74,14,23,0.35); border:2px solid rgba(212,175,55,0.4); border-radius:24px; padding:20px 28px;">
          <div style="font-size:21px; font-weight:700; color:#FFDF80; margin-bottom:12px; display:flex; align-items:center; gap:10px;">
            🛡️ Official DigiLocker Trust Badges
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div style="background:rgba(0,0,0,0.6); padding:14px 16px; border-radius:16px; font-size:19px; color:#22C55E; font-weight:700; display:flex; align-items:center; gap:8px;">
              ✓ Passport Verified
            </div>
            <div style="background:rgba(0,0,0,0.6); padding:14px 16px; border-radius:16px; font-size:19px; color:#22C55E; font-weight:700; display:flex; align-items:center; gap:8px;">
              ✓ Aadhaar Verified
            </div>
            <div style="background:rgba(0,0,0,0.6); padding:14px 16px; border-radius:16px; font-size:19px; color:#22C55E; font-weight:700; display:flex; align-items:center; gap:8px;">
              ✓ Corporate Email
            </div>
            <div style="background:rgba(0,0,0,0.6); padding:14px 16px; border-radius:16px; font-size:19px; color:#22C55E; font-weight:700; display:flex; align-items:center; gap:8px;">
              ✓ Degree Authenticated
            </div>
          </div>
        </div>

        <!-- Section 5: Concierge Approval Seal Card -->
        <div style="background:linear-gradient(135deg, rgba(74,14,23,0.5), rgba(20,8,12,0.95)); border:2px solid #D4AF37; border-radius:24px; padding:18px 26px; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:16px;">
            <span style="font-size:36px;">👑</span>
            <div>
              <div style="font-size:20px; font-weight:700; color:#FFDF80;">Concierge Introductions Approved</div>
              <div style="font-size:16px; color:#A09080;">Pre-screened & endorsed by Senior Matchmaker Patrick Abraham</div>
            </div>
          </div>
          <span style="color:#22C55E; font-weight:800; font-size:18px;">PASSED ✓</span>
        </div>
      </div>

      <!-- Bottom Sticky Action -->
      <div style="background:#0F0508; border-top:2px solid rgba(212,175,55,0.25); padding:22px 32px 30px; display:grid; grid-template-columns:1fr 1.3fr; gap:16px;">
        <div style="background:rgba(255,255,255,0.08); border:2px solid rgba(212,175,55,0.4); padding:22px 0; border-radius:24px; text-align:center; font-size:23px; font-weight:700; color:#F5E6C8;">
          Save Shortlist ⭐
        </div>
        <div style="background:linear-gradient(135deg, #7A1828, #4A0E17); border:2px solid #D4AF37; padding:22px 0; border-radius:24px; text-align:center; font-size:23px; font-weight:800; color:#FFF;">
          Express Interest 💌
        </div>
      </div>
    `
  },
  {
    id: '03_blurshield_photo_privacy',
    title: 'BlurShield™ Photo Privacy',
    subtitle: '20px Cryptographic Blur · Photos Unlocked Exclusively on Mutual Acceptance',
    innerHtml: `
      <!-- Phone Top Bar -->
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 24px 44px; border-bottom: 2px solid rgba(212,175,55,0.25);">
        <span style="font-family:'Cinzel', serif; font-size:32px; letter-spacing:4px; color:#D4AF37; font-weight:700;">MANNAT</span>
        <div style="background:rgba(239,68,68,0.15); border:2px solid #EF4444; padding:10px 22px; border-radius:22px; font-size:19px; font-weight:700; color:#FCA5A5;">
          🔒 BlurShield™ Active
        </div>
      </div>

      <!-- Main Blurred Screen Content (Dense & Full Screen) -->
      <div style="flex:1; padding:18px 32px; display:flex; flex-direction:column; gap:16px; justify-content:space-between; overflow:hidden;">
        <!-- Shield Hero Card with 20px Blur -->
        <div style="height:1020px; border-radius:36px; overflow:hidden; border:2.5px solid rgba(212,175,55,0.45); display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:48px; position:relative; box-shadow:0 24px 60px rgba(0,0,0,0.7);">
          <img src="${IMG_BRIDE_3 || IMG_BRIDE_1}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:blur(40px) brightness(0.55);" />
          <div style="position:absolute; inset:0; background:rgba(20,5,10,0.65);"></div>

          <!-- Lock Icon & Message -->
          <div style="position:relative; z-index:2;">
            <div style="width:160px; height:160px; border-radius:50%; background:linear-gradient(135deg, #7A1828, #4A0E17); border:4px solid #D4AF37; margin:0 auto 26px; display:flex; align-items:center; justify-content:center; font-size:76px; box-shadow:0 20px 50px rgba(0,0,0,0.7);">
              🛡️
            </div>
            <div style="font-family:'Cinzel', serif; font-size:48px; font-weight:700; color:#FFF; margin-bottom:18px;">BlurShield™ Discretion Lock</div>
            <div style="font-size:25px; color:#E8D8C8; line-height:1.5; max-width:760px; margin:0 auto 36px;">
              Candidate portraits are cryptographically shielded with 20px frosted blur. High-definition bio-photos unlock exclusively upon mutual family acceptance.
            </div>
            <div style="background:linear-gradient(135deg, #D4AF37, #AA820A); color:#0F0508; font-weight:800; font-size:25px; padding:24px 54px; border-radius:40px; display:inline-flex; align-items:center; gap:16px; box-shadow:0 14px 40px rgba(212,175,55,0.5);">
              <span>Request Photo Unlock Permission</span> 🔑
            </div>
          </div>
        </div>

        <!-- Candidate Preview Brief -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:26px; padding:24px 32px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-family:'Cinzel', serif; font-size:30px; font-weight:700; color:#FFF;">Candidate #MN-8492</div>
            <div style="font-size:22px; color:#D4AF37; margin-top:3px;">26 Yrs · 5'5" · Hindu (Kayastha) · South Delhi</div>
          </div>
          <div style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.25); padding:16px 24px; border-radius:20px; font-size:21px; color:#FFF; font-weight:700;">
            Corporate Lawyer
          </div>
        </div>

        <!-- Discretion & Privacy Boundaries List (5 Full Settings) -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:26px; padding:26px 32px; display:flex; flex-direction:column; gap:18px;">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid rgba(255,255,255,0.1); padding-bottom:10px;">
            <span style="font-size:24px; font-weight:700; color:#D4AF37;">⚙️ Discretion & Sovereign Privacy Controls</span>
            <span style="font-size:17px; color:#22C55E; font-weight:800;">100% Confidential</span>
          </div>
          
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:22px; font-weight:700; color:#FFF;">Photo Discretion Lock (BlurShield™)</div>
              <div style="font-size:16px; color:#A09080; margin-top:2px;">Hide portraits from general feed; unlock on mutual approval</div>
            </div>
            <span style="background:rgba(34,197,94,0.15); color:#22C55E; font-size:16px; font-weight:800; padding:6px 14px; border-radius:10px;">ACTIVE</span>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:22px; font-weight:700; color:#FFF;">Incognito Family Browsing</div>
              <div style="font-size:16px; color:#A09080; margin-top:2px;">Browse candidates without appearing in profile view history</div>
            </div>
            <span style="background:rgba(212,175,55,0.15); color:#FFDF80; font-size:16px; font-weight:800; padding:6px 14px; border-radius:10px;">ENABLED</span>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:22px; font-weight:700; color:#FFF;">Dynamic Watermarking Protection</div>
              <div style="font-size:16px; color:#A09080; margin-top:2px;">Cryptographically embeds viewer ID to prevent screenshots & leaks</div>
            </div>
            <span style="background:rgba(34,197,94,0.15); color:#22C55E; font-size:16px; font-weight:800; padding:6px 14px; border-radius:10px;">PROTECTED</span>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:22px; font-weight:700; color:#FFF;">Biometric Face ID Vault</div>
              <div style="font-size:16px; color:#A09080; margin-top:2px;">Requires local FaceID validation before revealing bio-data</div>
            </div>
            <span style="background:rgba(34,197,94,0.15); color:#22C55E; font-size:16px; font-weight:800; padding:6px 14px; border-radius:10px;">LOCKED</span>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:22px; font-weight:700; color:#FFF;">Sovereign Zero-Data-Broker Guarantee</div>
              <div style="font-size:16px; color:#A09080; margin-top:2px;">Zero ad networks or third-party trackers; 100% private data silo</div>
            </div>
            <span style="background:rgba(34,197,94,0.15); color:#22C55E; font-size:16px; font-weight:800; padding:6px 14px; border-radius:10px;">VERIFIED</span>
          </div>
        </div>

        <!-- Privacy Shield Seal Card -->
        <div style="background:rgba(74,14,23,0.35); border:2px solid rgba(212,175,55,0.4); border-radius:24px; padding:22px 28px; display:flex; align-items:center; justify-content:space-between;">
          <div style="display:flex; align-items:center; gap:16px;">
            <span style="font-size:36px;">🔐</span>
            <div>
              <div style="font-size:21px; font-weight:700; color:#FFDF80;">100% Cryptographic Sovereign Privacy</div>
              <div style="font-size:16px; color:#A09080;">Encrypted at rest · Photos never stored plaintext on client devices</div>
            </div>
          </div>
          <span style="color:#22C55E; font-weight:800; font-size:18px;">SECURED ✓</span>
        </div>
      </div>

      <!-- Navigation Bar -->
      <div style="background:#0F0508; border-top:2px solid rgba(212,175,55,0.25); padding:24px 56px 34px; display:flex; justify-content:space-between; align-items:center;">
        <div style="text-align:center; color:#8A7A70;"><div style="font-size:36px;">🏛️</div><div style="font-size:18px; font-weight:600; margin-top:4px;">Discover</div></div>
        <div style="text-align:center; color:#8A7A70;"><div style="font-size:36px;">✨</div><div style="font-size:18px; font-weight:600; margin-top:4px;">For You</div></div>
        <div style="text-align:center; color:#8A7A70;"><div style="font-size:36px;">💌</div><div style="font-size:18px; font-weight:600; margin-top:4px;">Alliances</div></div>
        <div style="text-align:center; color:#D4AF37;"><div style="font-size:36px;">👤</div><div style="font-size:18px; font-weight:700; margin-top:4px;">Privacy</div></div>
      </div>
    `
  },
  {
    id: '04_mutual_alliances_matches',
    title: 'Mutual Alliances & Matches',
    subtitle: 'Connect Exclusively When Both Families Confirm Mutual Interest',
    innerHtml: `
      <!-- Phone Top Bar -->
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 24px 44px; border-bottom: 2px solid rgba(212,175,55,0.25);">
        <div>
          <span style="font-family:'Cinzel', serif; font-size:32px; letter-spacing:3px; color:#FFFFFF; font-weight:700;">ALLIANCES</span>
          <span style="display:block; font-size:18px; color:#D4AF37; font-weight:600;">5 MUTUAL INTRODUCTIONS</span>
        </div>
        <div style="background:rgba(212,175,55,0.15); border:2px solid #D4AF37; padding:10px 22px; border-radius:24px; font-size:19px; font-weight:700; color:#FFDF80;">
          👑 VIP Active
        </div>
      </div>

      <!-- Segment Tabs -->
      <div style="padding:16px 32px 8px; display:flex; gap:14px;">
        <div style="flex:1; background:linear-gradient(135deg, #7A1828, #4A0E17); border:2px solid #D4AF37; color:#FFF; font-weight:700; font-size:20px; padding:18px 0; border-radius:20px; text-align:center;">
          Mutual Alliances (5)
        </div>
        <div style="flex:1; background:rgba(255,255,255,0.05); border:1.5px solid rgba(255,255,255,0.2); color:#A09080; font-weight:600; font-size:20px; padding:18px 0; border-radius:20px; text-align:center;">
          Pending Review (2)
        </div>
        <div style="flex:1; background:rgba(255,255,255,0.05); border:1.5px solid rgba(255,255,255,0.2); color:#A09080; font-weight:600; font-size:20px; padding:18px 0; border-radius:20px; text-align:center;">
          Shortlisted (8)
        </div>
      </div>

      <!-- Alliances List (5 Dense, Beautiful Cards filling 100% of height) -->
      <div style="flex:1; padding:10px 32px; display:flex; flex-direction:column; gap:14px; overflow:hidden;">
        <!-- Card 1 -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.45); border-radius:28px; padding:22px 26px; display:flex; flex-direction:column; gap:14px;">
          <div style="display:flex; gap:22px; align-items:center;">
            <img src="${IMG_BRIDE_1}" style="width:120px; height:120px; border-radius:26px; object-fit:cover; border:2.5px solid #D4AF37;" />
            <div style="flex:1;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-family:'Cinzel', serif; font-size:30px; font-weight:700; color:#FFF;">Ananya Sharma, 26</span>
                <span style="font-size:16px; color:#22C55E; font-weight:800; background:rgba(34,197,94,0.15); padding:6px 14px; border-radius:10px;">Accepted Today</span>
              </div>
              <div style="font-size:22px; color:#D4AF37; margin-top:2px; font-weight:600;">VP Investment Banking · Morgan Stanley</div>
              <div style="font-size:18px; color:#C0B0A0; margin-top:2px;">South Mumbai • 98% Compatibility • 34/36 Gunas</div>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1.2fr; gap:14px;">
            <div style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(212,175,55,0.4); padding:18px 0; border-radius:20px; text-align:center; font-size:21px; font-weight:700; color:#F5E6C8;">
              View Dossier ↗
            </div>
            <div style="background:linear-gradient(135deg, #7A1828, #4A0E17); border:1.5px solid #D4AF37; padding:18px 0; border-radius:20px; text-align:center; font-size:21px; font-weight:800; color:#FFF;">
              Open Private Chat 💬
            </div>
          </div>
        </div>

        <!-- Card 2 -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:28px; padding:22px 26px; display:flex; flex-direction:column; gap:14px;">
          <div style="display:flex; gap:22px; align-items:center;">
            <img src="${IMG_BRIDE_2}" style="width:120px; height:120px; border-radius:26px; object-fit:cover; border:2.5px solid #D4AF37;" />
            <div style="flex:1;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-family:'Cinzel', serif; font-size:30px; font-weight:700; color:#FFF;">Rhea Singhania, 27</span>
                <span style="font-size:16px; color:#22C55E; font-weight:800; background:rgba(34,197,94,0.15); padding:6px 14px; border-radius:10px;">Accepted Yesterday</span>
              </div>
              <div style="font-size:22px; color:#D4AF37; margin-top:2px; font-weight:600;">Partner · Singhania Capital</div>
              <div style="font-size:18px; color:#C0B0A0; margin-top:2px;">Civil Lines, Delhi • 96% Compatibility • 32/36 Gunas</div>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1.2fr; gap:14px;">
            <div style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(212,175,55,0.4); padding:18px 0; border-radius:20px; text-align:center; font-size:21px; font-weight:700; color:#F5E6C8;">
              View Dossier ↗
            </div>
            <div style="background:linear-gradient(135deg, #7A1828, #4A0E17); border:1.5px solid #D4AF37; padding:18px 0; border-radius:20px; text-align:center; font-size:21px; font-weight:800; color:#FFF;">
              Open Private Chat 💬
            </div>
          </div>
        </div>

        <!-- Card 3 -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:28px; padding:22px 26px; display:flex; flex-direction:column; gap:14px;">
          <div style="display:flex; gap:22px; align-items:center;">
            <img src="${IMG_GROOM_1 || IMG_BRIDE_1}" style="width:120px; height:120px; border-radius:26px; object-fit:cover; border:2.5px solid #D4AF37;" />
            <div style="flex:1;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-family:'Cinzel', serif; font-size:30px; font-weight:700; color:#FFF;">Dr. Rohan Varma, 29</span>
                <span style="font-size:16px; color:#FFDF80; font-weight:800; background:rgba(212,175,55,0.15); padding:6px 14px; border-radius:10px;">Family Reviewing</span>
              </div>
              <div style="font-size:22px; color:#D4AF37; margin-top:2px; font-weight:600;">Cardiologist · AIIMS / Johns Hopkins</div>
              <div style="font-size:18px; color:#C0B0A0; margin-top:2px;">Bandra, Mumbai • 95% Compatibility • 33/36 Gunas</div>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1.2fr; gap:14px;">
            <div style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(212,175,55,0.4); padding:18px 0; border-radius:20px; text-align:center; font-size:21px; font-weight:700; color:#F5E6C8;">
              View Dossier ↗
            </div>
            <div style="background:linear-gradient(135deg, #7A1828, #4A0E17); border:1.5px solid #D4AF37; padding:18px 0; border-radius:20px; text-align:center; font-size:21px; font-weight:800; color:#FFF;">
              Open Private Chat 💬
            </div>
          </div>
        </div>

        <!-- Card 4 -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:28px; padding:22px 26px; display:flex; flex-direction:column; gap:14px;">
          <div style="display:flex; gap:22px; align-items:center;">
            <img src="${IMG_BRIDE_3 || IMG_BRIDE_1}" style="width:120px; height:120px; border-radius:26px; object-fit:cover; border:2.5px solid #D4AF37;" />
            <div style="flex:1;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-family:'Cinzel', serif; font-size:30px; font-weight:700; color:#FFF;">Meera Kapoor, 25</span>
                <span style="font-size:16px; color:#22C55E; font-weight:800; background:rgba(34,197,94,0.15); padding:6px 14px; border-radius:10px;">Accepted Today</span>
              </div>
              <div style="font-size:22px; color:#D4AF37; margin-top:2px; font-weight:600;">Architect & Principal · Studio Kapoor</div>
              <div style="font-size:18px; color:#C0B0A0; margin-top:2px;">Lutyens Delhi • 97% Compatibility • 35/36 Gunas</div>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1.2fr; gap:14px;">
            <div style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(212,175,55,0.4); padding:18px 0; border-radius:20px; text-align:center; font-size:21px; font-weight:700; color:#F5E6C8;">
              View Dossier ↗
            </div>
            <div style="background:linear-gradient(135deg, #7A1828, #4A0E17); border:1.5px solid #D4AF37; padding:18px 0; border-radius:20px; text-align:center; font-size:21px; font-weight:800; color:#FFF;">
              Open Private Chat 💬
            </div>
          </div>
        </div>

        <!-- Card 5 -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:28px; padding:22px 26px; display:flex; flex-direction:column; gap:14px;">
          <div style="display:flex; gap:22px; align-items:center;">
            <img src="${IMG_GROOM_1 || IMG_BRIDE_1}" style="width:120px; height:120px; border-radius:26px; object-fit:cover; border:2.5px solid #D4AF37;" />
            <div style="flex:1;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-family:'Cinzel', serif; font-size:30px; font-weight:700; color:#FFF;">Vikramaditya Birla, 28</span>
                <span style="font-size:16px; color:#22C55E; font-weight:800; background:rgba(34,197,94,0.15); padding:6px 14px; border-radius:10px;">Consensus 100%</span>
              </div>
              <div style="font-size:22px; color:#D4AF37; margin-top:2px; font-weight:600;">Managing Director · Industrial Group</div>
              <div style="font-size:18px; color:#C0B0A0; margin-top:2px;">London & South Mumbai • 97% Compatibility</div>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1.2fr; gap:14px;">
            <div style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(212,175,55,0.4); padding:18px 0; border-radius:20px; text-align:center; font-size:21px; font-weight:700; color:#F5E6C8;">
              View Dossier ↗
            </div>
            <div style="background:linear-gradient(135deg, #7A1828, #4A0E17); border:1.5px solid #D4AF37; padding:18px 0; border-radius:20px; text-align:center; font-size:21px; font-weight:800; color:#FFF;">
              Open Private Chat 💬
            </div>
          </div>
        </div>

        <!-- Concierge Notification Banner -->
        <div style="background:linear-gradient(135deg, rgba(74,14,23,0.5), rgba(20,8,12,0.95)); border:2px solid #D4AF37; border-radius:24px; padding:20px 28px; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:16px;">
            <span style="font-size:36px;">👑</span>
            <div style="font-size:20px; color:#FFDF80; font-weight:700;">
              Concierge will coordinate family high teas for all 5 confirmed alliances
            </div>
          </div>
          <span style="color:#22C55E; font-weight:800; font-size:18px;">COORDINATING ✓</span>
        </div>
      </div>

      <!-- Navigation Bar -->
      <div style="background:#0F0508; border-top:2px solid rgba(212,175,55,0.25); padding:24px 56px 34px; display:flex; justify-content:space-between; align-items:center;">
        <div style="text-align:center; color:#8A7A70;"><div style="font-size:36px;">🏛️</div><div style="font-size:18px; font-weight:600; margin-top:4px;">Discover</div></div>
        <div style="text-align:center; color:#8A7A70;"><div style="font-size:36px;">✨</div><div style="font-size:18px; font-weight:600; margin-top:4px;">For You</div></div>
        <div style="text-align:center; color:#D4AF37;"><div style="font-size:36px;">💌</div><div style="font-size:18px; font-weight:700; margin-top:4px;">Alliances</div></div>
        <div style="text-align:center; color:#8A7A70;"><div style="font-size:36px;">👤</div><div style="font-size:18px; font-weight:600; margin-top:4px;">Profile</div></div>
      </div>
    `
  },
  {
    id: '05_private_encrypted_chat',
    title: 'Private Encrypted Concierge',
    subtitle: 'End-to-End Encrypted Dialogues, Family Briefings & Concierge Audio Notes',
    innerHtml: `
      <!-- Chat Top Bar -->
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 24px 38px; border-bottom: 2px solid rgba(212,175,55,0.25); background:rgba(20,8,12,0.95);">
        <div style="display:flex; align-items:center; gap:18px;">
          <span style="font-size:30px; color:#D4AF37;">←</span>
          <img src="${IMG_BRIDE_1}" style="width:76px; height:76px; border-radius:50%; object-fit:cover; border:3px solid #D4AF37;" />
          <div>
            <div style="font-family:'Cinzel', serif; font-size:28px; font-weight:700; color:#FFF;">Ananya Sharma</div>
            <div style="font-size:17px; color:#22C55E; display:flex; align-items:center; gap:8px; margin-top:2px;">
              <span style="width:10px; height:10px; border-radius:50%; background:#22C55E; display:inline-block;"></span> Active Now · Verified Connection
            </div>
          </div>
        </div>
        <div style="background:rgba(34,197,94,0.15); border:2px solid #22C55E; padding:10px 20px; border-radius:22px; font-size:18px; font-weight:700; color:#86EFAC;">
          🔒 E2E Encrypted
        </div>
      </div>

      <!-- Chat Stream (Full rich conversational flow reaching the input bar) -->
      <div style="flex:1; padding:18px 32px; display:flex; flex-direction:column; gap:16px; justify-content:space-between; overflow:hidden;">
        <div style="text-align:center; font-size:17px; color:#A09080;">
          Today · Confidential & Sovereign Privacy Guarded
        </div>

        <!-- Incoming Message -->
        <div style="align-self:flex-start; max-width:85%; background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.18); border-radius:26px 26px 26px 8px; padding:22px 28px;">
          <div style="font-size:22px; color:#FFF; line-height:1.5;">
            Namaste Patrick! Delighted to connect. My family reviewed your candidate dossier and was truly impressed with your pedigree.
          </div>
          <div style="font-size:16px; color:#A09080; text-align:right; margin-top:4px;">10:42 AM</div>
        </div>

        <!-- Outgoing Message -->
        <div style="align-self:flex-end; max-width:88%; background:linear-gradient(135deg, #7A1828, #4A0E17); border:2px solid rgba(212,175,55,0.45); border-radius:26px 26px 8px 26px; padding:22px 28px;">
          <div style="font-size:22px; color:#FFF; line-height:1.5;">
            Namaste Ananya. Thank you! Our parents would love to host an informal family high tea in South Mumbai next weekend.
          </div>
          <div style="font-size:16px; color:#FFDF80; text-align:right; margin-top:4px;">10:45 AM ✓✓</div>
        </div>

        <!-- Incoming Message -->
        <div style="align-self:flex-start; max-width:85%; background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.18); border-radius:26px 26px 26px 8px; padding:22px 28px;">
          <div style="font-size:22px; color:#FFF; line-height:1.5;">
            That sounds wonderful. Let me share our verified family concierge briefing notes with you!
          </div>
          <div style="font-size:16px; color:#A09080; text-align:right; margin-top:4px;">10:46 AM</div>
        </div>

        <!-- Attachment Card -->
        <div style="align-self:flex-start; width:90%; background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.45); border-radius:24px; padding:20px 26px; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:18px;">
            <span style="font-size:42px;">📄</span>
            <div>
              <div style="font-size:22px; font-weight:700; color:#FFF;">Sharma_Family_Dossier.pdf</div>
              <div style="font-size:17px; color:#D4AF37; margin-top:2px;">Verified Bio-Data & Kundli · 2.4 MB</div>
            </div>
          </div>
          <div style="background:rgba(212,175,55,0.2); border:1.5px solid #D4AF37; padding:12px 20px; border-radius:16px; font-size:18px; font-weight:700; color:#FFDF80;">
            View ↗
          </div>
        </div>

        <!-- Outgoing Voice Note -->
        <div style="align-self:flex-end; width:90%; background:linear-gradient(135deg, #7A1828, #4A0E17); border:2px solid rgba(212,175,55,0.45); border-radius:26px 26px 8px 26px; padding:20px 26px; display:flex; align-items:center; gap:18px;">
          <div style="width:56px; height:56px; border-radius:50%; background:#FFF; display:flex; align-items:center; justify-content:center; color:#7A1828; font-size:24px; font-weight:800;">
            ▶
          </div>
          <div style="flex:1;">
            <div style="font-size:22px; font-weight:700; color:#FFF;">Concierge Voice Note</div>
            <div style="font-size:16px; color:#FFDF80; margin-top:2px;">0:48 • High Fidelity Audio</div>
          </div>
          <div style="font-size:24px; color:#FFF;">ılıılılılılılı</div>
        </div>

        <!-- Incoming Taj Mahal Palace Confirmation -->
        <div style="align-self:flex-start; max-width:85%; background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.18); border-radius:26px 26px 26px 8px; padding:22px 28px;">
          <div style="font-size:22px; color:#FFF; line-height:1.5;">
            Our family concierge coordinated with <strong>The Taj Mahal Palace, Colaba</strong> for Saturday 4 PM. Looking forward to our families meeting! ✨
          </div>
          <div style="font-size:16px; color:#A09080; text-align:right; margin-top:4px;">10:50 AM</div>
        </div>

        <!-- Concierge Booking Card -->
        <div style="align-self:flex-start; width:90%; background:linear-gradient(135deg, rgba(74,14,23,0.4), rgba(20,8,12,0.95)); border:2px solid #D4AF37; border-radius:24px; padding:20px 26px; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:18px;">
            <span style="font-size:40px;">🏨</span>
            <div>
              <div style="font-size:22px; font-weight:700; color:#FFDF80;">Sea Lounge · The Taj Mahal Palace</div>
              <div style="font-size:17px; color:#E0D0C0; margin-top:2px;">Private Table Confirmed · Sat 4:00 PM</div>
            </div>
          </div>
          <div style="background:#22C55E; color:#FFF; font-size:16px; font-weight:800; padding:10px 18px; border-radius:14px;">
            RESERVED
          </div>
        </div>

        <!-- Outgoing Confirmation -->
        <div style="align-self:flex-end; max-width:88%; background:linear-gradient(135deg, #7A1828, #4A0E17); border:2px solid rgba(212,175,55,0.45); border-radius:26px 26px 8px 26px; padding:20px 28px;">
          <div style="font-size:22px; color:#FFF; line-height:1.5;">
            Splendid! My parents and I are looking forward to meeting your family on Saturday. Have a wonderful week!
          </div>
          <div style="font-size:16px; color:#FFDF80; text-align:right; margin-top:4px;">10:52 AM ✓✓</div>
        </div>

        <!-- Incoming Final Greeting -->
        <div style="align-self:flex-start; max-width:80%; background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.18); border-radius:26px 26px 26px 8px; padding:20px 28px;">
          <div style="font-size:22px; color:#FFF; line-height:1.5;">
            Looking forward to meeting you all! See you Saturday! 🙏
          </div>
          <div style="font-size:16px; color:#A09080; text-align:right; margin-top:4px;">10:54 AM</div>
        </div>
      </div>

      <!-- Chat Input Box -->
      <div style="background:#0F0508; border-top:2px solid rgba(212,175,55,0.25); padding:22px 32px 30px; display:flex; align-items:center; gap:18px;">
        <span style="font-size:34px; color:#D4AF37;">+</span>
        <div style="flex:1; background:rgba(255,255,255,0.08); border:1.5px solid rgba(212,175,55,0.35); border-radius:30px; padding:18px 28px; font-size:22px; color:#A09080;">
          Write a confidential message...
        </div>
        <span style="font-size:30px; color:#D4AF37;">🎙️</span>
        <div style="width:58px; height:58px; border-radius:50%; background:linear-gradient(135deg, #7A1828, #4A0E17); border:2px solid #D4AF37; display:flex; align-items:center; justify-content:center; color:#FFF; font-size:24px;">
          ➔
        </div>
      </div>
    `
  },
  {
    id: '06_ugc_safety_and_block',
    title: '100% Safe & Verified Community',
    subtitle: '1-Tap Block, Categorized UGC Reporting & Guaranteed 24-Hour Investigation SLA',
    innerHtml: `
      <!-- Phone Top Bar -->
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 24px 44px; border-bottom: 2px solid rgba(212,175,55,0.25);">
        <div style="display:flex; align-items:center; gap:18px;">
          <span style="font-size:32px; color:#D4AF37;">←</span>
          <span style="font-family:'Cinzel', serif; font-size:30px; letter-spacing:3px; color:#FFFFFF; font-weight:700;">SAFETY & REPORT</span>
        </div>
        <div style="background:rgba(34,197,94,0.15); border:2px solid #22C55E; padding:10px 22px; border-radius:24px; font-size:18px; font-weight:700; color:#86EFAC;">
          Guideline 1.2 Compliant
        </div>
      </div>

      <!-- Main Moderation Panel -->
      <div style="flex:1; padding:20px 32px; display:flex; flex-direction:column; justify-content:space-between; overflow:hidden;">
        <!-- Header Banner -->
        <div style="background:linear-gradient(135deg, rgba(74,14,23,0.6), rgba(20,8,12,0.95)); border:2.5px solid rgba(212,175,55,0.45); border-radius:30px; padding:26px 30px; display:flex; align-items:center; gap:24px;">
          <div style="width:100px; height:100px; border-radius:50%; background:linear-gradient(135deg, #7A1828, #4A0E17); border:3px solid #D4AF37; display:flex; align-items:center; justify-content:center; font-size:50px; flex-shrink:0;">
            🛡️
          </div>
          <div>
            <div style="font-family:'Cinzel', serif; font-size:32px; font-weight:700; color:#FFF;">Zero-Tolerance Safety Protocol</div>
            <div style="font-size:20px; color:#E0D0C0; margin-top:4px; line-height:1.45;">
              Mannat strictly enforces Apple Guideline 1.2. Objectionable content, abusive behavior, and impersonation result in immediate permanent ejection.
            </div>
          </div>
        </div>

        <!-- Target Member Under Report -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:26px; padding:22px 28px; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:18px;">
            <div style="width:72px; height:72px; border-radius:50%; background:#4A0E17; border:2.5px solid #D4AF37; display:flex; align-items:center; justify-content:center; font-size:34px;">👤</div>
            <div>
              <div style="font-size:25px; font-weight:700; color:#FFF;">Candidate #MN-9821</div>
              <div style="font-size:19px; color:#A09080; margin-top:2px;">Active Conversation · Flagged for Pedigree Verification Review</div>
            </div>
          </div>
          <span style="background:rgba(239,68,68,0.2); border:1.5px solid #EF4444; color:#FCA5A5; font-size:18px; font-weight:800; padding:8px 20px; border-radius:14px;">FLAGGED</span>
        </div>

        <!-- Reason Selection Chips -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:26px; padding:24px 28px;">
          <div style="font-size:23px; font-weight:700; color:#D4AF37; margin-bottom:14px;">Select Categorized UGC Violation:</div>
          <div style="display:flex; flex-wrap:wrap; gap:12px;">
            <span style="background:linear-gradient(135deg, #7A1828, #4A0E17); border:2px solid #D4AF37; color:#FFF; font-size:20px; font-weight:700; padding:14px 24px; border-radius:18px;">Inaccurate Pedigree / Bio-Data ✓</span>
            <span style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.2); color:#C0B0A0; font-size:20px; padding:14px 24px; border-radius:18px;">Commercial Broker Solicitation</span>
            <span style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.2); color:#C0B0A0; font-size:20px; padding:14px 24px; border-radius:18px;">Inappropriate / Harassing Language</span>
            <span style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.2); color:#C0B0A0; font-size:20px; padding:14px 24px; border-radius:18px;">Unauthorized Photo Sharing</span>
          </div>
        </div>

        <!-- Feature 1: Instant 1-Tap Block -->
        <div style="background:rgba(20,8,12,0.92); border:2.5px solid #EF4444; border-radius:26px; padding:24px 28px; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:20px;">
            <span style="font-size:44px;">🚫</span>
            <div>
              <div style="font-size:25px; font-weight:700; color:#FFF;">Instant 1-Tap Block Member</div>
              <div style="font-size:19px; color:#A09080; margin-top:3px;">Immediately severs all contact, messages & removes from candidate feed</div>
            </div>
          </div>
          <span style="background:rgba(239,68,68,0.25); color:#FCA5A5; font-size:19px; font-weight:800; padding:8px 20px; border-radius:14px;">SELECTED ✓</span>
        </div>

        <!-- Feature 2: 24-Hour Investigation SLA -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:26px; padding:24px 28px; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:20px;">
            <span style="font-size:44px;">⚡</span>
            <div>
              <div style="font-size:25px; font-weight:700; color:#FFF;">Guaranteed 24-Hour Investigation SLA</div>
              <div style="font-size:19px; color:#A09080; margin-top:3px;">Senior Concierge moderation team audits and purges abusive accounts within 24h</div>
            </div>
          </div>
          <span style="background:rgba(212,175,55,0.2); color:#FFDF80; font-size:19px; font-weight:800; padding:8px 20px; border-radius:14px;">24H SLA</span>
        </div>

        <!-- Feature 3: Binding Legal EULA -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:26px; padding:24px 28px; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:20px;">
            <span style="font-size:44px;">⚖️</span>
            <div>
              <div style="font-size:25px; font-weight:700; color:#FFF;">Binding Legal EULA Terms Enforced</div>
              <div style="font-size:19px; color:#A09080; margin-top:3px;">Zero tolerance for objectionable content or abusive users across all accounts</div>
            </div>
          </div>
          <span style="background:rgba(34,197,94,0.15); color:#86EFAC; font-size:19px; font-weight:800; padding:8px 20px; border-radius:14px;">ENFORCED</span>
        </div>

        <!-- Feature 4: Cryptographic Incident Ticket -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:26px; padding:24px 28px; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:20px;">
            <span style="font-size:44px;">📑</span>
            <div>
              <div style="font-size:25px; font-weight:700; color:#FFF;">Immutable Cryptographic Audit Log</div>
              <div style="font-size:19px; color:#A09080; margin-top:3px;">Ticket #MN-SAFE-9821 timestamped on sovereign moderation ledger</div>
            </div>
          </div>
          <span style="background:rgba(212,175,55,0.15); color:#FFDF80; font-size:19px; font-weight:800; padding:8px 20px; border-radius:14px;">LOGGED</span>
        </div>

        <!-- Priority Line -->
        <div style="background:linear-gradient(135deg, rgba(74,14,23,0.5), rgba(20,8,12,0.95)); border:2px solid #D4AF37; border-radius:26px; padding:24px 28px; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:20px;">
            <span style="font-size:40px;">📞</span>
            <div>
              <div style="font-size:23px; font-weight:700; color:#FFDF80;">24/7 Priority Concierge Emergency Line</div>
              <div style="font-size:18px; color:#A09080; margin-top:2px;">+91 97383 97933 · Immediate human executive escalation & response</div>
            </div>
          </div>
          <span style="color:#22C55E; font-weight:800; font-size:19px;">24/7 LIVE</span>
        </div>
      </div>

      <!-- Bottom Action Buttons -->
      <div style="background:#0F0508; border-top:2px solid rgba(212,175,55,0.25); padding:24px 32px 30px; display:flex; flex-direction:column; gap:16px;">
        <div style="background:linear-gradient(135deg, #991B1B, #7F1D1D); border:2px solid #EF4444; padding:24px 0; border-radius:26px; text-align:center; font-size:24px; font-weight:800; color:#FFF; box-shadow:0 10px 30px rgba(239,68,68,0.3);">
          🚫 Block Member & Sever Connection
        </div>
        <div style="background:rgba(255,255,255,0.08); border:2px solid rgba(212,175,55,0.4); padding:22px 0; border-radius:26px; text-align:center; font-size:23px; font-weight:700; color:#F5E6C8;">
          Submit Confidential Investigation Report 🛡️
        </div>
      </div>
    `
  },
  {
    id: '07_verified_profile_scoring',
    title: 'Trust & Authenticity Scoring',
    subtitle: 'Proprietary 7-Vector Verification Engine with DigiLocker Government Integration',
    innerHtml: `
      <!-- Phone Top Bar -->
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 24px 44px; border-bottom: 2px solid rgba(212,175,55,0.25);">
        <div style="display:flex; align-items:center; gap:18px;">
          <span style="font-size:32px; color:#D4AF37;">←</span>
          <span style="font-family:'Cinzel', serif; font-size:30px; letter-spacing:3px; color:#FFFFFF; font-weight:700;">CREDENTIAL AUDIT</span>
        </div>
        <div style="background:rgba(34,197,94,0.15); border:2px solid #22C55E; padding:10px 22px; border-radius:24px; font-size:18px; font-weight:700; color:#86EFAC;">
          ✓ Official Audit
        </div>
      </div>

      <!-- Main Trust Score Screen Content -->
      <div style="flex:1; padding:20px 32px; display:flex; flex-direction:column; gap:16px; overflow:hidden;">
        <!-- Candidate Overview & Trust Score Hero Card -->
        <div style="background:linear-gradient(135deg, rgba(74,14,23,0.6), rgba(20,8,12,0.95)); border:2.5px solid rgba(212,175,55,0.5); border-radius:32px; padding:28px 32px; display:flex; align-items:center; justify-content:space-between;">
          <div style="flex:1; display:flex; gap:22px; align-items:center;">
            <img src="${IMG_BRIDE_1}" style="width:130px; height:130px; border-radius:28px; object-fit:cover; border:3px solid #D4AF37;" />
            <div>
              <div style="font-size:17px; color:#D4AF37; font-weight:700; letter-spacing:2px; text-transform:uppercase;">SOVEREIGN AUDIT CERTIFICATE</div>
              <div style="font-family:'Cinzel', serif; font-size:38px; font-weight:700; color:#FFF; margin-top:4px;">Ananya Sharma, 26</div>
              <div style="font-size:22px; color:#E0D0C0; margin-top:3px;">ID #MN-2026-AS982 · Saraswat Brahmin</div>
              <div style="display:flex; gap:12px; margin-top:10px;">
                <span style="background:rgba(34,197,94,0.2); border:1.5px solid #22C55E; color:#86EFAC; font-size:17px; font-weight:700; padding:6px 14px; border-radius:12px;">Tier-1 Authenticated</span>
                <span style="background:rgba(212,175,55,0.2); border:1.5px solid #D4AF37; color:#FFDF80; font-size:17px; font-weight:700; padding:6px 14px; border-radius:12px;">DigiLocker Linked</span>
              </div>
            </div>
          </div>

          <div style="width:160px; height:160px; border-radius:50%; border:12px solid #22C55E; border-top-color:#D4AF37; display:flex; flex-direction:column; justify-content:center; align-items:center; box-shadow:0 0 50px rgba(34,197,94,0.4); background:rgba(0,0,0,0.6); flex-shrink:0;">
            <span style="font-size:58px; font-weight:900; color:#FFF; line-height:1;">99</span>
            <span style="font-size:19px; color:#D4AF37; font-weight:700;">/ 100</span>
          </div>
        </div>

        <!-- 7 Verification Vectors Breakdown with Individual Progress Bars -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:28px; padding:28px 32px; display:flex; flex-direction:column; gap:18px;">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid rgba(255,255,255,0.1); padding-bottom:14px;">
            <span style="font-size:26px; font-weight:700; color:#D4AF37;">🛡️ 7-Vector Verification Breakdown</span>
            <span style="font-size:19px; color:#22C55E; font-weight:800; background:rgba(34,197,94,0.15); padding:6px 18px; border-radius:14px;">7 of 7 Vectors Passed</span>
          </div>

          <!-- Vector 1 -->
          <div>
            <div style="display:flex; justify-content:space-between; font-size:22px; font-weight:600; color:#FFF; margin-bottom:6px;">
              <span>🆔 Government Identity (Passport & Aadhaar via DigiLocker)</span>
              <span style="color:#22C55E; font-weight:800;">100% ✓</span>
            </div>
            <div style="height:12px; background:rgba(255,255,255,0.1); border-radius:6px; overflow:hidden;">
              <div style="width:100%; height:100%; background:linear-gradient(90deg, #D4AF37, #22C55E);"></div>
            </div>
          </div>

          <!-- Vector 2 -->
          <div>
            <div style="display:flex; justify-content:space-between; font-size:22px; font-weight:600; color:#FFF; margin-bottom:6px;">
              <span>🎓 Academic Degrees (IIT Bombay B.Tech & IIM-A MBA)</span>
              <span style="color:#22C55E; font-weight:800;">100% ✓</span>
            </div>
            <div style="height:12px; background:rgba(255,255,255,0.1); border-radius:6px; overflow:hidden;">
              <div style="width:100%; height:100%; background:linear-gradient(90deg, #D4AF37, #22C55E);"></div>
            </div>
          </div>

          <!-- Vector 3 -->
          <div>
            <div style="display:flex; justify-content:space-between; font-size:22px; font-weight:600; color:#FFF; margin-bottom:6px;">
              <span>💼 Corporate Standing (VP Morgan Stanley · Form-16 & Work Email)</span>
              <span style="color:#22C55E; font-weight:800;">98% ✓</span>
            </div>
            <div style="height:12px; background:rgba(255,255,255,0.1); border-radius:6px; overflow:hidden;">
              <div style="width:98%; height:100%; background:linear-gradient(90deg, #D4AF37, #22C55E);"></div>
            </div>
          </div>

          <!-- Vector 4 -->
          <div>
            <div style="display:flex; justify-content:space-between; font-size:22px; font-weight:600; color:#FFF; margin-bottom:6px;">
              <span>🏛️ Family Lineage & Concierge Reference Audit</span>
              <span style="color:#22C55E; font-weight:800;">100% ✓</span>
            </div>
            <div style="height:12px; background:rgba(255,255,255,0.1); border-radius:6px; overflow:hidden;">
              <div style="width:100%; height:100%; background:linear-gradient(90deg, #D4AF37, #22C55E);"></div>
            </div>
          </div>

          <!-- Vector 5 -->
          <div>
            <div style="display:flex; justify-content:space-between; font-size:22px; font-weight:600; color:#FFF; margin-bottom:6px;">
              <span>🕉️ Astrological Gunas Certified (34/36 Kundli Match)</span>
              <span style="color:#22C55E; font-weight:800;">100% ✓</span>
            </div>
            <div style="height:12px; background:rgba(255,255,255,0.1); border-radius:6px; overflow:hidden;">
              <div style="width:100%; height:100%; background:linear-gradient(90deg, #D4AF37, #22C55E);"></div>
            </div>
          </div>

          <!-- Vector 6 -->
          <div>
            <div style="display:flex; justify-content:space-between; font-size:22px; font-weight:600; color:#FFF; margin-bottom:6px;">
              <span>📱 Biometric Security & Apple Private Relay</span>
              <span style="color:#22C55E; font-weight:800;">100% ✓</span>
            </div>
            <div style="height:12px; background:rgba(255,255,255,0.1); border-radius:6px; overflow:hidden;">
              <div style="width:100%; height:100%; background:linear-gradient(90deg, #D4AF37, #22C55E);"></div>
            </div>
          </div>

          <!-- Vector 7 -->
          <div>
            <div style="display:flex; justify-content:space-between; font-size:22px; font-weight:600; color:#FFF; margin-bottom:6px;">
              <span>🏦 Family Office CA Net-Worth Attestation</span>
              <span style="color:#22C55E; font-weight:800;">100% ✓</span>
            </div>
            <div style="height:12px; background:rgba(255,255,255,0.1); border-radius:6px; overflow:hidden;">
              <div style="width:100%; height:100%; background:linear-gradient(90deg, #D4AF37, #22C55E);"></div>
            </div>
          </div>
        </div>

        <!-- Official Seal & DigiLocker Badge Card -->
        <div style="background:linear-gradient(135deg, rgba(74,14,23,0.5), rgba(20,8,12,0.95)); border:2px solid #D4AF37; border-radius:26px; padding:24px 30px; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:20px;">
            <span style="font-size:44px;">🏛️</span>
            <div>
              <div style="font-size:24px; font-weight:700; color:#FFDF80;">Mannat Sovereign Verification Seal</div>
              <div style="font-size:18px; color:#A09080; margin-top:2px;">Signed by Chief Verification Officer Patrick Abraham · Valid through 2027</div>
            </div>
          </div>
          <span style="background:rgba(34,197,94,0.15); color:#22C55E; font-weight:800; font-size:19px; padding:8px 20px; border-radius:14px;">CERTIFIED ✓</span>
        </div>

        <!-- Cryptographic Audit Hash -->
        <div style="background:rgba(255,255,255,0.06); border:1.5px solid rgba(212,175,55,0.35); border-radius:24px; padding:20px 26px; display:flex; justify-content:space-between; align-items:center;">
          <div style="font-family:monospace; font-size:18px; color:#FFDF80;">
            SHA-256: 7f8a91bc442a8819ef34d2c88 (Immutable Sovereign Stamp)
          </div>
          <span style="font-size:18px; color:#22C55E; font-weight:800;">VERIFIED</span>
        </div>

        <!-- Download PDF Action -->
        <div style="background:linear-gradient(135deg, #7A1828, #4A0E17); border:2px solid #D4AF37; padding:24px 0; border-radius:28px; text-align:center; font-size:24px; font-weight:800; color:#FFF; display:flex; align-items:center; justify-content:center; gap:14px; box-shadow:0 10px 30px rgba(122,24,40,0.5);">
          <span>📄 Download Official Authenticated Dossier (PDF)</span>
        </div>
      </div>

      <!-- Navigation Bar -->
      <div style="background:#0F0508; border-top:2px solid rgba(212,175,55,0.25); padding:24px 56px 34px; display:flex; justify-content:space-between; align-items:center;">
        <div style="text-align:center; color:#8A7A70;"><div style="font-size:36px;">🏛️</div><div style="font-size:18px; font-weight:600; margin-top:4px;">Discover</div></div>
        <div style="text-align:center; color:#8A7A70;"><div style="font-size:36px;">✨</div><div style="font-size:18px; font-weight:600; margin-top:4px;">For You</div></div>
        <div style="text-align:center; color:#8A7A70;"><div style="font-size:36px;">💌</div><div style="font-size:18px; font-weight:600; margin-top:4px;">Alliances</div></div>
        <div style="text-align:center; color:#D4AF37;"><div style="font-size:36px;">👤</div><div style="font-size:18px; font-weight:700; margin-top:4px;">Audit</div></div>
      </div>
    `
  },
  {
    id: '08_family_share_portal',
    title: 'Family Elder Review Portal',
    subtitle: 'Collaborative Introductions for Parents, Elders & Trusted Family Advisors',
    innerHtml: `
      <!-- Phone Top Bar -->
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 24px 44px; border-bottom: 2px solid rgba(212,175,55,0.25);">
        <div>
          <span style="font-family:'Cinzel', serif; font-size:30px; letter-spacing:3px; color:#FFFFFF; font-weight:700;">FAMILY PORTAL</span>
          <span style="display:block; font-size:18px; color:#D4AF37; font-weight:600;">5 ELDERS REVIEWING · 100% UNANIMOUS CONSENSUS</span>
        </div>
        <div style="background:rgba(212,175,55,0.15); border:2px solid #D4AF37; padding:10px 22px; border-radius:24px; font-size:18px; font-weight:700; color:#FFDF80;">
          🔒 Watermarked
        </div>
      </div>

      <!-- Candidate Under Review & Consensus Content -->
      <div style="flex:1; padding:20px 32px; display:flex; flex-direction:column; gap:16px; overflow:hidden;">
        <!-- Large Candidate Hero Banner -->
        <div style="background:rgba(20,8,12,0.92); border:2.5px solid rgba(212,175,55,0.45); border-radius:32px; padding:28px; display:flex; gap:28px; align-items:center;">
          <img src="${IMG_GROOM_1 || IMG_BRIDE_1}" style="width:160px; height:160px; border-radius:30px; object-fit:cover; border:3px solid #D4AF37;" />
          <div style="flex:1;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-family:'Cinzel', serif; font-size:36px; font-weight:700; color:#FFF;">Vikramaditya Birla, 28</span>
              <span style="background:#22C55E; color:#FFF; font-size:18px; font-weight:800; padding:8px 20px; border-radius:14px;">APPROVED ✓</span>
            </div>
            <div style="font-size:24px; color:#D4AF37; margin-top:4px; font-weight:600;">Managing Director · Industrial Mfg Group</div>
            <div style="font-size:20px; color:#C0B0A0; margin-top:4px;">London & South Mumbai • 34/36 Gunas Vedic Match</div>
            <div style="font-size:18px; color:#FFDF80; margin-top:6px;">🔒 Cryptographic Family Watermark: ID #MN-2026-PAT</div>
          </div>
        </div>

        <!-- Consensus Status Progress Bar Card -->
        <div style="background:linear-gradient(135deg, rgba(74,14,23,0.5), rgba(20,8,12,0.95)); border:2px solid #D4AF37; border-radius:28px; padding:24px 30px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <span style="font-size:23px; font-weight:700; color:#FFDF80;">👨‍👩‍👧 Family Consensus: 5/5 Elders Approved (100%)</span>
            <span style="color:#22C55E; font-weight:800; font-size:20px; background:rgba(34,197,94,0.15); padding:4px 16px; border-radius:12px;">UNANIMOUS</span>
          </div>
          <div style="height:14px; background:rgba(255,255,255,0.15); border-radius:7px; overflow:hidden;">
            <div style="width:100%; height:100%; background:linear-gradient(90deg, #D4AF37, #22C55E);"></div>
          </div>
        </div>

        <!-- 5 Detailed Elder Reviews -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:28px; padding:26px 30px; display:flex; flex-direction:column; gap:18px;">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid rgba(255,255,255,0.1); padding-bottom:12px;">
            <span style="font-size:25px; font-weight:700; color:#D4AF37;">Detailed Elder Evaluations & Endorsements</span>
            <span style="font-size:18px; color:#22C55E; font-weight:800;">5 of 5 Endorsed</span>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:22px; font-weight:700; color:#FFF;">Father (Vijay Abraham)</div>
              <div style="font-size:18px; color:#A09080; margin-top:2px;">"Outstanding generational family values & industrial pedigree"</div>
            </div>
            <span style="color:#FFDF80; font-weight:800; font-size:24px;">⭐⭐⭐⭐⭐</span>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:22px; font-weight:700; color:#FFF;">Mother (Sunita Abraham)</div>
              <div style="font-size:18px; color:#A09080; margin-top:2px;">"Kundli matches 34/36 gunas, wonderful cultural alignment"</div>
            </div>
            <span style="color:#FFDF80; font-weight:800; font-size:24px;">⭐⭐⭐⭐⭐</span>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:22px; font-weight:700; color:#FFF;">Elder Brother (Rahul Abraham, Stanford MBA)</div>
              <div style="font-size:18px; color:#A09080; margin-top:2px;">"Brilliant career trajectory in finance, highly vetted credentials"</div>
            </div>
            <span style="color:#FFDF80; font-weight:800; font-size:24px;">⭐⭐⭐⭐⭐</span>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:22px; font-weight:700; color:#FFF;">Maternal Uncle (Kailash Singhania)</div>
              <div style="font-size:18px; color:#A09080; margin-top:2px;">"Prominent standing, respected across Mumbai industrial circles"</div>
            </div>
            <span style="color:#FFDF80; font-weight:800; font-size:24px;">⭐⭐⭐⭐⭐</span>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:22px; font-weight:700; color:#FFF;">Grandfather (Justice Abraham)</div>
              <div style="font-size:18px; color:#A09080; margin-top:2px;">"Impeccable integrity and distinguished ancestral roots"</div>
            </div>
            <span style="color:#FFDF80; font-weight:800; font-size:24px;">⭐⭐⭐⭐⭐</span>
          </div>
        </div>

        <!-- Family Live Chat Snippet -->
        <div style="background:rgba(255,255,255,0.07); border:1.5px solid rgba(212,175,55,0.35); border-radius:26px; padding:22px 26px; display:flex; flex-direction:column; gap:10px;">
          <div style="font-size:20px; color:#FFDF80; font-weight:700; display:flex; align-items:gap:10px;">
            <span>💬 Family Advisor Live Thread</span>
          </div>
          <div style="font-size:18px; color:#E0D0C0; line-height:1.5;">
            <strong style="color:#FFF;">Vijay:</strong> "Spoke with their family office. They are keen on a private high tea next week in Colaba."<br/>
            <strong style="color:#FFF;">Sunita:</strong> "Agreed! Let's submit our formal consensus to the senior concierge."
          </div>
        </div>

        <!-- Export / WhatsApp Sharing Options -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px;">
          <div style="background:rgba(255,255,255,0.08); border:2px solid rgba(212,175,55,0.4); border-radius:26px; padding:22px; text-align:center;">
            <div style="font-size:40px; margin-bottom:4px;">📄</div>
            <div style="font-size:22px; font-weight:700; color:#FFF;">Export PDF Dossier</div>
            <div style="font-size:17px; color:#A09080; margin-top:2px;">Watermarked & Encrypted</div>
          </div>
          <div style="background:rgba(255,255,255,0.08); border:2px solid rgba(212,175,55,0.4); border-radius:26px; padding:22px; text-align:center;">
            <div style="font-size:40px; margin-bottom:4px;">💬</div>
            <div style="font-size:22px; font-weight:700; color:#FFF;">Share via WhatsApp</div>
            <div style="font-size:17px; color:#A09080; margin-top:2px;">Direct Elder Portal Link</div>
          </div>
        </div>
      </div>

      <!-- Bottom Action CTA -->
      <div style="background:#0F0508; border-top:2px solid rgba(212,175,55,0.25); padding:24px 32px 30px;">
        <div style="background:linear-gradient(135deg, #7A1828, #4A0E17); border:2px solid #D4AF37; padding:24px 0; border-radius:26px; text-align:center; font-size:24px; font-weight:800; color:#FFF; box-shadow:0 10px 30px rgba(122,24,40,0.5);">
          Submit Family Consensus & Unlock Introductions 👍
        </div>
      </div>
    `
  },
  {
    id: '09_precision_search_filters',
    title: 'Precision Heritage & Lifestyle Filters',
    subtitle: 'Filter by Pedigree, Lineage, Astrological Gunas, Wealth & Career Standing',
    innerHtml: `
      <!-- Phone Top Bar -->
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 24px 44px; border-bottom: 2px solid rgba(212,175,55,0.25);">
        <span style="font-family:'Cinzel', serif; font-size:32px; letter-spacing:3px; color:#FFFFFF; font-weight:700;">PRECISION FILTERS</span>
        <span style="font-size:21px; color:#D4AF37; font-weight:700;">Reset All</span>
      </div>

      <!-- Quick Preset Filter Chips Bar -->
      <div style="padding:16px 32px 6px; display:flex; gap:12px; overflow:hidden;">
        <span style="background:linear-gradient(135deg, #7A1828, #4A0E17); border:2px solid #D4AF37; color:#FFF; font-size:19px; font-weight:700; padding:12px 22px; border-radius:18px;">👑 Promoter Families</span>
        <span style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.2); color:#C0B0A0; font-size:19px; padding:12px 22px; border-radius:18px;">🎓 Ivy League & IIT</span>
        <span style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.2); color:#C0B0A0; font-size:19px; padding:12px 22px; border-radius:18px;">🏛️ Civil Services</span>
      </div>

      <!-- Filters List (8 Rich Filter Cards completely filling screen) -->
      <div style="flex:1; padding:10px 32px; display:flex; flex-direction:column; gap:16px; overflow:hidden;">
        <!-- Filter 1: Community -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:26px; padding:22px 26px;">
          <div style="font-size:22px; font-weight:700; color:#D4AF37; margin-bottom:12px;">Community & Gotra Lineage</div>
          <div style="display:flex; flex-wrap:wrap; gap:10px;">
            <span style="background:linear-gradient(135deg, #7A1828, #4A0E17); border:1.5px solid #D4AF37; color:#FFF; font-size:19px; font-weight:700; padding:10px 20px; border-radius:16px;">Saraswat Brahmin ✓</span>
            <span style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.2); color:#C0B0A0; font-size:19px; padding:10px 20px; border-radius:16px;">Khatri</span>
            <span style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.2); color:#C0B0A0; font-size:19px; padding:10px 20px; border-radius:16px;">Jain</span>
            <span style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.2); color:#C0B0A0; font-size:19px; padding:10px 20px; border-radius:16px;">Kayastha</span>
            <span style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.2); color:#C0B0A0; font-size:19px; padding:10px 20px; border-radius:16px;">Agarwal</span>
          </div>
        </div>

        <!-- Filter 2: Education -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:26px; padding:22px 26px;">
          <div style="font-size:22px; font-weight:700; color:#D4AF37; margin-bottom:12px;">Academic Standing & Alma Mater</div>
          <div style="display:flex; flex-wrap:wrap; gap:10px;">
            <span style="background:linear-gradient(135deg, #7A1828, #4A0E17); border:1.5px solid #D4AF37; color:#FFF; font-size:19px; font-weight:700; padding:10px 20px; border-radius:16px;">IIT / IIM / Ivy League ✓</span>
            <span style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.2); color:#C0B0A0; font-size:19px; padding:10px 20px; border-radius:16px;">Doctors & Surgeons</span>
            <span style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.2); color:#C0B0A0; font-size:19px; padding:10px 20px; border-radius:16px;">Investment Banking</span>
            <span style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.2); color:#C0B0A0; font-size:19px; padding:10px 20px; border-radius:16px;">Oxford & Cambridge</span>
          </div>
        </div>

        <!-- Filter 3: Household Wealth -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:26px; padding:22px 26px;">
          <div style="font-size:22px; font-weight:700; color:#D4AF37; margin-bottom:12px;">Household Wealth Standing</div>
          <div style="display:flex; flex-wrap:wrap; gap:10px;">
            <span style="background:linear-gradient(135deg, #7A1828, #4A0E17); border:1.5px solid #D4AF37; color:#FFF; font-size:19px; font-weight:700; padding:10px 20px; border-radius:16px;">₹1 Cr – ₹5 Cr+ ($200k+) ✓</span>
            <span style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.2); color:#C0B0A0; font-size:19px; padding:10px 20px; border-radius:16px;">Ultra HNI / Family Office</span>
            <span style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.2); color:#C0B0A0; font-size:19px; padding:10px 20px; border-radius:16px;">Industrialists & Promoters</span>
          </div>
        </div>

        <!-- Filter 4: Astrological Compatibility -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:26px; padding:22px 26px;">
          <div style="font-size:22px; font-weight:700; color:#D4AF37; margin-bottom:8px;">Astrological (Kundli) Compatibility</div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:21px; color:#FFF;">Minimum Guna Match (28/36 Threshold):</span>
            <span style="background:#22C55E; color:#FFF; font-size:19px; font-weight:800; padding:8px 20px; border-radius:14px;">30+ GUNAS ✓</span>
          </div>
        </div>

        <!-- Filter 5: Location & Residence -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:26px; padding:22px 26px;">
          <div style="font-size:22px; font-weight:700; color:#D4AF37; margin-bottom:12px;">Location & Dual Residence</div>
          <div style="display:flex; flex-wrap:wrap; gap:10px;">
            <span style="background:linear-gradient(135deg, #7A1828, #4A0E17); border:1.5px solid #D4AF37; color:#FFF; font-size:19px; font-weight:700; padding:10px 20px; border-radius:16px;">South Mumbai & Delhi NCR ✓</span>
            <span style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.2); color:#C0B0A0; font-size:19px; padding:10px 20px; border-radius:16px;">London / UK</span>
            <span style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.2); color:#C0B0A0; font-size:19px; padding:10px 20px; border-radius:16px;">New York / Bay Area</span>
            <span style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.2); color:#C0B0A0; font-size:19px; padding:10px 20px; border-radius:16px;">Dubai / UAE</span>
          </div>
        </div>

        <!-- Filter 6: Diet & Habits -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:26px; padding:22px 26px;">
          <div style="font-size:22px; font-weight:700; color:#D4AF37; margin-bottom:12px;">Diet & Lifestyle Habits</div>
          <div style="display:flex; flex-wrap:wrap; gap:10px;">
            <span style="background:linear-gradient(135deg, #7A1828, #4A0E17); border:1.5px solid #D4AF37; color:#FFF; font-size:19px; font-weight:700; padding:10px 20px; border-radius:16px;">Vegetarian Only ✓</span>
            <span style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.2); color:#C0B0A0; font-size:19px; padding:10px 20px; border-radius:16px;">Non-Smoker ✓</span>
            <span style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.2); color:#C0B0A0; font-size:19px; padding:10px 20px; border-radius:16px;">Teetotaler</span>
            <span style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.2); color:#C0B0A0; font-size:19px; padding:10px 20px; border-radius:16px;">Polo & Equestrian</span>
          </div>
        </div>

        <!-- Filter 7: Family Pedigree -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:26px; padding:22px 26px;">
          <div style="font-size:22px; font-weight:700; color:#D4AF37; margin-bottom:12px;">Family Pedigree & Heritage Standing</div>
          <div style="display:flex; flex-wrap:wrap; gap:10px;">
            <span style="background:linear-gradient(135deg, #7A1828, #4A0E17); border:1.5px solid #D4AF37; color:#FFF; font-size:19px; font-weight:700; padding:10px 20px; border-radius:16px;">Industrialists & Promoters ✓</span>
            <span style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.2); color:#C0B0A0; font-size:19px; padding:10px 20px; border-radius:16px;">Judiciary / Civil Services</span>
            <span style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.2); color:#C0B0A0; font-size:19px; padding:10px 20px; border-radius:16px;">Diplomatic Corps</span>
          </div>
        </div>

        <!-- Filter 8: Government DigiLocker Verification -->
        <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:26px; padding:22px 26px;">
          <div style="font-size:22px; font-weight:700; color:#D4AF37; margin-bottom:12px;">Government DigiLocker Authentication</div>
          <div style="display:flex; flex-wrap:wrap; gap:10px;">
            <span style="background:linear-gradient(135deg, #7A1828, #4A0E17); border:1.5px solid #D4AF37; color:#FFF; font-size:19px; font-weight:700; padding:10px 20px; border-radius:16px;">100% DigiLocker Verified ✓</span>
            <span style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.2); color:#C0B0A0; font-size:19px; padding:10px 20px; border-radius:16px;">Form-16 Verified</span>
            <span style="background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.2); color:#C0B0A0; font-size:19px; padding:10px 20px; border-radius:16px;">Passport Authenticated</span>
          </div>
        </div>
      </div>

      <!-- Bottom Apply CTA -->
      <div style="background:#0F0508; border-top:2px solid rgba(212,175,55,0.25); padding:24px 32px 30px;">
        <div style="background:linear-gradient(135deg, #7A1828, #4A0E17); border:2px solid #D4AF37; padding:24px 0; border-radius:26px; text-align:center; font-size:24px; font-weight:800; color:#FFF; box-shadow:0 10px 30px rgba(122,24,40,0.5);">
          Show 48 Verified Matches (Top 1%) 🎯
        </div>
      </div>
    `
  },
  {
    id: '10_apple_signin_and_privacy',
    title: 'Discreet VIP Onboarding',
    subtitle: '1-Tap Sign in with Apple, Biometric Face ID & Instant In-App Data Purge',
    innerHtml: `
      <!-- Top Branding Hero & Content -->
      <div style="flex:1; padding:28px 32px 34px; display:flex; flex-direction:column; justify-content:space-between; align-items:center; text-align:center; overflow:hidden;">
        <div>
          <div style="width:130px; height:130px; border-radius:36px; background:linear-gradient(135deg, #7A1828, #4A0E17); border:3.5px solid #D4AF37; display:flex; align-items:center; justify-content:center; font-size:62px; margin:0 auto 16px; box-shadow:0 20px 50px rgba(0,0,0,0.75);">
            👑
          </div>
          <div style="font-family:'Cinzel', serif; font-size:54px; font-weight:700; color:#D4AF37; letter-spacing:10px;">MANNAT</div>
          <div style="font-size:22px; letter-spacing:5px; color:#E0D0C0; margin-top:4px; font-weight:600;">BESPOKE MATCHMAKING</div>
          <div style="font-size:21px; color:#C0B0A0; margin-top:8px; max-width:760px; line-height:1.4;">
            The Exclusive Matrimonial Sanctuary for Distinguished & Discerning Families
          </div>
        </div>

        <!-- VIP Showcase Photo Hero Card -->
        <div style="width:100%; height:460px; border-radius:32px; overflow:hidden; position:relative; border:2.5px solid rgba(212,175,55,0.45); box-shadow:0 20px 60px rgba(0,0,0,0.7); display:flex; flex-direction:column; justify-content:flex-end;">
          <img src="${IMG_BRIDE_3 || IMG_BRIDE_1}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center top;" />
          <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(15,8,10,0.1) 0%, rgba(20,5,10,0.4) 40%, rgba(10,2,5,0.96) 88%);"></div>
          <div style="position:relative; z-index:2; padding:26px 30px; text-align:left;">
            <div style="background:rgba(74,14,23,0.95); border:1.5px solid #D4AF37; display:inline-flex; align-items:center; gap:8px; padding:6px 16px; border-radius:14px; font-size:17px; font-weight:700; color:#FFDF80; margin-bottom:8px;">
              👑 By Private Invitation Only
            </div>
            <div style="font-family:'Cinzel', serif; font-size:32px; font-weight:700; color:#FFF;">Top 1% Lineage & Pedigrees</div>
            <div style="font-size:18px; color:#E0D0C0; margin-top:2px;">Multi-tier background verification with DigiLocker authentication</div>
          </div>
        </div>

        <!-- VIP Member Privileges Card -->
        <div style="width:100%; background:linear-gradient(135deg, rgba(74,14,23,0.55), rgba(20,8,12,0.95)); border:2.5px solid #D4AF37; border-radius:28px; padding:24px 28px; text-align:left;">
          <div style="font-size:24px; font-weight:700; color:#FFDF80; margin-bottom:8px;">👑 Exclusive VIP Membership Privileges</div>
          <div style="font-size:19px; color:#E8D8C8; line-height:1.5;">
            • Verified Top 1% Families Only &nbsp;•&nbsp; 100% End-to-End Encryption<br/>
            • Dedicated Concierge Matchmaker &nbsp;•&nbsp; BlurShield™ Photo Protection
          </div>
        </div>

        <!-- Compliance & Privacy Badges (5 Cards) -->
        <div style="width:100%; display:flex; flex-direction:column; gap:12px;">
          <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:24px; padding:18px 24px; display:flex; align-items:center; gap:20px; text-align:left;">
            <span style="font-size:38px;"></span>
            <div>
              <div style="font-size:22px; font-weight:700; color:#FFF;">Sign in with Apple (Guideline 4.8)</div>
              <div style="font-size:17px; color:#A09080; margin-top:2px;">Private Relay email shielding & Face ID biometrics</div>
            </div>
          </div>

          <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:24px; padding:18px 24px; display:flex; align-items:center; gap:20px; text-align:left;">
            <span style="font-size:38px;">🛡️</span>
            <div>
              <div style="font-size:22px; font-weight:700; color:#FFF;">100% Authenticated Pedigrees</div>
              <div style="font-size:17px; color:#A09080; margin-top:2px;">Multi-vector DigiLocker government background verification</div>
            </div>
          </div>

          <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:24px; padding:18px 24px; display:flex; align-items:center; gap:20px; text-align:left;">
            <span style="font-size:38px;">🗑️</span>
            <div>
              <div style="font-size:22px; font-weight:700; color:#FFF;">Instant Account & Data Purge (5.1.1)</div>
              <div style="font-size:17px; color:#A09080; margin-top:2px;">One-tap complete profile deletion with zero data retention</div>
            </div>
          </div>

          <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:24px; padding:18px 24px; display:flex; align-items:center; gap:20px; text-align:left;">
            <span style="font-size:38px;">🔐</span>
            <div>
              <div style="font-size:22px; font-weight:700; color:#FFF;">Sovereign Discretion Guarantee</div>
              <div style="font-size:17px; color:#A09080; margin-top:2px;">Zero third-party data tracking, advertising or broker sharing</div>
            </div>
          </div>

          <div style="background:rgba(20,8,12,0.92); border:2px solid rgba(212,175,55,0.35); border-radius:24px; padding:18px 24px; display:flex; align-items:center; gap:20px; text-align:left;">
            <span style="font-size:38px;">🤝</span>
            <div>
              <div style="font-size:22px; font-weight:700; color:#FFF;">Concierge Assisted Introductions</div>
              <div style="font-size:17px; color:#A09080; margin-top:2px;">Discreet high teas arranged exclusively upon mutual family consent</div>
            </div>
          </div>
        </div>

        <!-- Auth Buttons -->
        <div style="width:100%; display:flex; flex-direction:column; gap:16px;">
          <div style="background:#FFFFFF; color:#000; font-size:25px; font-weight:800; padding:24px 0; border-radius:26px; display:flex; align-items:center; justify-content:center; gap:16px; box-shadow:0 12px 35px rgba(255,255,255,0.3);">
            <span style="font-size:32px;"></span> Continue with Apple
          </div>
          <div style="background:rgba(255,255,255,0.08); border:2px solid rgba(212,175,55,0.45); color:#FFF; font-size:23px; font-weight:700; padding:22px 0; border-radius:26px; display:flex; align-items:center; justify-content:center; gap:16px;">
            <span style="font-size:26px;">G</span> Continue with Google
          </div>
        </div>

        <!-- Legal Disclaimer -->
        <div style="font-size:17px; color:#A09080; line-height:1.5;">
          By continuing, you agree to our <span style="color:#D4AF37; text-decoration:underline;">Terms</span>, <span style="color:#D4AF37; text-decoration:underline;">EULA</span> & <span style="color:#D4AF37; text-decoration:underline;">Privacy Policy</span>.<br/>Apple App Store Compliant · 100% Data Sovereignty
        </div>
      </div>
    `
  }
];

function generateHtml(screen) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      width: 1290px;
      height: 2796px;
      background: radial-gradient(circle at 50% 12%, #380C14 0%, #1A050A 45%, #0A0204 100%);
      font-family: 'Outfit', sans-serif;
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 70px 50px 40px;
      overflow: hidden;
      position: relative;
    }

    /* Ambient Luxury Background Elements */
    .glow-top {
      position: absolute;
      top: -200px;
      left: 50%;
      transform: translateX(-50%);
      width: 1100px;
      height: 700px;
      background: radial-gradient(circle, rgba(212,175,55,0.2) 0%, rgba(122,24,40,0.3) 50%, transparent 70%);
      filter: blur(90px);
      pointer-events: none;
    }

    /* Top Editorial Header */
    .editorial-header {
      text-align: center;
      z-index: 10;
      margin-bottom: 36px;
      max-width: 1140px;
    }

    .brand-crest {
      font-family: 'Cinzel', serif;
      font-size: 22px;
      letter-spacing: 10px;
      color: #D4AF37;
      font-weight: 700;
      margin-bottom: 10px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }
    .brand-crest::before, .brand-crest::after {
      content: '';
      width: 80px;
      height: 1.5px;
      background: linear-gradient(90deg, transparent, #D4AF37);
    }
    .brand-crest::after {
      background: linear-gradient(90deg, #D4AF37, transparent);
    }

    .main-title {
      font-family: 'Cinzel', serif;
      font-size: 60px;
      font-weight: 800;
      line-height: 1.15;
      color: #FFFFFF;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
      text-shadow: 0 4px 24px rgba(0,0,0,0.8);
    }

    .main-subtitle {
      font-size: 25px;
      font-weight: 400;
      color: #E2D0C0;
      line-height: 1.4;
      max-width: 1000px;
      margin: 0 auto;
    }

    /* iPhone 16 Pro Max Device Mockup Container */
    .device-wrapper {
      position: relative;
      width: 1060px;
      height: 2180px;
      background: #000000;
      border-radius: 74px;
      padding: 16px;
      box-shadow:
        0 40px 100px rgba(0,0,0,0.95),
        0 0 0 3px #22201D,
        0 0 0 10px #4A4641,
        0 0 0 14px #1A1918;
      display: flex;
      flex-direction: column;
      z-index: 10;
    }

    /* Screen Inside Bezel */
    .device-screen {
      width: 100%;
      height: 100%;
      background: #100407;
      border-radius: 58px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    /* Status Bar with Dynamic Island */
    .status-bar {
      height: 68px;
      padding: 16px 44px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 50;
      background: transparent;
    }

    .time {
      font-size: 23px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.2px;
    }

    .dynamic-island {
      position: absolute;
      left: 50%;
      top: 14px;
      transform: translateX(-50%);
      width: 230px;
      height: 46px;
      background: #000000;
      border-radius: 24px;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.06);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 16px;
    }
    .camera-dot {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background: #090918;
      border: 1.5px solid #1C1C30;
    }

    .status-icons {
      display: flex;
      gap: 10px;
      font-size: 19px;
      font-weight: 700;
      color: #FFFFFF;
      align-items: center;
    }

    /* Home Bar Indicator */
    .home-indicator {
      width: 280px;
      height: 7px;
      background: rgba(255,255,255,0.45);
      border-radius: 4px;
      margin: 8px auto 12px;
    }
  </style>
</head>
<body>
  <div class="glow-top"></div>

  <div class="editorial-header">
    <div class="brand-crest">At MANNAT</div>
    <div class="main-title">${screen.title}</div>
    <div class="main-subtitle">${screen.subtitle}</div>
  </div>

  <div class="device-wrapper">
    <div class="device-screen">
      <!-- Status Bar -->
      <div class="status-bar">
        <div class="time">9:41</div>
        <div class="dynamic-island">
          <div class="camera-dot"></div>
        </div>
        <div class="status-icons">
          <span>5G</span>
          <span>100% 🔋</span>
        </div>
      </div>

      <!-- App Screen Content -->
      ${screen.innerHtml}

      <!-- Home Bar -->
      <div class="home-indicator"></div>
    </div>
  </div>
</body>
</html>`;
}

async function render() {
  console.log('🚀 Starting Precision Native 1290x2796 App Store Screenshot Generation...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({
    viewport: { width: 1290, height: 2796 },
    deviceScaleFactor: 1
  });

  for (const screen of screens) {
    console.log(`Rendering: ${screen.id}.png`);
    const page = await context.newPage();
    const html = generateHtml(screen);
    await page.setContent(html, { waitUntil: 'load' });
    await page.waitForTimeout(400);

    for (const dir of OUTPUT_DIRS) {
      const outPath = path.join(dir, `${screen.id}.png`);
      await page.screenshot({ path: outPath, type: 'png' });
    }
    console.log(` ✅ Finished ${screen.id}.png`);
    await page.close();
  }

  await browser.close();
  console.log('🎉 All 10 screenshots rendered with perfection!');
}

render().catch(console.error);
