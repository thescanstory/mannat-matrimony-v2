import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const IPAD_DIR = '/Users/mac/Downloads/Mannat_AppStore_Screenshots/iPad_13_inch_2048x2732';
const ARTIFACT_DIR = '/Users/mac/.gemini/antigravity-ide/brain/6e259cf5-aa16-4a39-b96d-32b94dc7fda4/ipad_screenshots';
[IPAD_DIR, ARTIFACT_DIR].forEach(dir => {
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
const IMG_HERO_MANSION = getBase64Image('hero_vip_mansion_couple.jpg');
const IMG_PALACE = getBase64Image('hero_palace_couple.jpg');
const IMG_FLORAL = getBase64Image('couple_floral_saree.jpg');
const IMG_SILK = getBase64Image('couple_silk_saree.jpg');

const screens = [
  // ==========================================
  // SCREEN 1: Discovery Feed
  // ==========================================
  {
    id: '01_curated_discovery_feed',
    badge: 'CURATED FOR DISTINGUISHED PEDIGREES',
    title: 'Bespoke Matrimonial Alliances',
    subtitle: 'Private introductions matching lineage, academic intellect, and family values.',
    innerHtml: `
      <!-- Top Navigation -->
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 24px 44px; background:linear-gradient(180deg, #2A0B14 0%, #17040B 100%); border-bottom: 2px solid rgba(212,175,55,0.4);">
        <div style="display:flex; align-items:center; gap:20px;">
          <div style="width:60px; height:60px; border-radius:16px; background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:2px solid #D4AF37; display:flex; align-items:center; justify-content:center; font-family:'Cinzel', serif; font-weight:800; font-size:32px; color:#D4AF37; box-shadow:0 6px 20px rgba(0,0,0,0.6);">M</div>
          <div>
            <div style="font-family:'Cinzel', serif; font-size:32px; letter-spacing:6px; color:#F5E6C8; font-weight:800; line-height:1;">MANNAT</div>
            <div style="font-size:14px; letter-spacing:4px; color:#D4AF37; font-weight:700; margin-top:3px;">THE ARISTOCRATIC CIRCLE</div>
          </div>
        </div>
        <div style="display:flex; gap:16px;">
          <div style="background:rgba(34,197,94,0.18); border:1.5px solid #22C55E; padding:10px 24px; border-radius:24px; font-size:18px; font-weight:700; color:#86EFAC; display:flex; align-items:center; gap:8px;">
            <span style="color:#22C55E; font-size:20px;">●</span> 100% Verified Members
          </div>
          <div style="background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:1.5px solid #D4AF37; padding:10px 26px; border-radius:24px; font-size:18px; font-weight:800; color:#FFFFFF; box-shadow:0 6px 20px rgba(139,29,44,0.6);">
            ✨ VIP Concierge Active
          </div>
        </div>
      </div>

      <!-- Main Body Split -->
      <div style="flex:1; display:flex; padding:28px 40px; gap:32px; overflow:hidden;">
        <!-- Left: Grand Hero Candidate Card -->
        <div style="flex:1.1; border-radius:32px; overflow:hidden; position:relative; box-shadow:0 35px 90px rgba(0,0,0,0.95); border:2px solid rgba(212,175,55,0.5); display:flex; flex-direction:column; justify-content:flex-end;">
          <img src="${IMG_BRIDE_ROYAL}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 20%;" />
          <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(15,8,10,0) 0%, rgba(20,5,10,0.2) 30%, rgba(10,2,5,0.98) 75%);"></div>
          
          <div style="position:relative; z-index:2; padding:40px;">
            <div style="display:flex; gap:12px; margin-bottom:14px;">
              <span style="background:rgba(34,197,94,0.3); border:2px solid #22C55E; color:#86EFAC; font-size:16px; font-weight:800; padding:6px 16px; border-radius:16px;">✓ DIGILOCKER VERIFIED</span>
              <span style="background:rgba(212,175,55,0.3); border:2px solid #D4AF37; color:#FDE68A; font-size:16px; font-weight:800; padding:6px 16px; border-radius:16px;">✨ 98% HARMONY</span>
            </div>
            <div style="font-family:'Cinzel', serif; font-size:48px; font-weight:800; color:#FFFFFF; line-height:1.1;">Ananya Singhania, 26</div>
            <div style="font-size:24px; color:#D4AF37; font-weight:700; margin-top:6px;">Vice President — Global Private Equity, Mumbai</div>
            <div style="font-size:19px; color:#E5D5C5; margin-top:8px; line-height:1.45;">Columbia Business School MBA '22 · Prominent Industrialist Lineage · Vedic Horoscope 34/36 Gunas</div>
            <div style="display:flex; gap:10px; margin-top:16px;">
              <span style="background:rgba(255,255,255,0.12); padding:6px 14px; border-radius:12px; font-size:15px; color:#F5E6C8;">5'7" (170 cm)</span>
              <span style="background:rgba(255,255,255,0.12); padding:6px 14px; border-radius:12px; font-size:15px; color:#F5E6C8;">Vegetarian</span>
              <span style="background:rgba(255,255,255,0.12); padding:6px 14px; border-radius:12px; font-size:15px; color:#F5E6C8;">South Mumbai & London</span>
              <span style="background:rgba(255,255,255,0.12); padding:6px 14px; border-radius:12px; font-size:15px; color:#F5E6C8;">Art Patron</span>
            </div>
          </div>
        </div>

        <!-- Right: 4 Rich Pedigree Dossier Cards -->
        <div style="flex:0.9; display:flex; flex-direction:column; gap:18px;">
          <!-- Card 1 -->
          <div style="flex:1; background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(212,175,55,0.4); border-radius:24px; padding:26px 30px; box-shadow:0 10px 28px rgba(0,0,0,0.7); display:flex; flex-direction:column; justify-content:center;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="font-size:15px; letter-spacing:2px; color:#D4AF37; font-weight:800; text-transform:uppercase;">1. Lineage & Family Pedigree</div>
              <span style="font-size:24px;">🏛️</span>
            </div>
            <div style="font-size:24px; font-weight:800; color:#FFFFFF; margin-top:4px;">Prominent Industrialist Family</div>
            <div style="font-size:17px; color:#D1C2B4; margin-top:4px; line-height:1.4;">Father: Group Chairman, Tier-1 Conglomerate · Mother: Trustee & Arts Philanthropist</div>
            <div style="display:flex; gap:10px; margin-top:10px;">
              <span style="background:rgba(212,175,55,0.15); border:1px solid rgba(212,175,55,0.3); padding:4px 12px; border-radius:10px; font-size:14px; color:#F5E6C8;">₹500 Cr+ Family Enterprise</span>
              <span style="background:rgba(212,175,55,0.15); border:1px solid rgba(212,175,55,0.3); padding:4px 12px; border-radius:10px; font-size:14px; color:#F5E6C8;">Established 1968</span>
            </div>
          </div>

          <!-- Card 2 -->
          <div style="flex:1; background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(212,175,55,0.4); border-radius:24px; padding:26px 30px; box-shadow:0 10px 28px rgba(0,0,0,0.7); display:flex; flex-direction:column; justify-content:center;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="font-size:15px; letter-spacing:2px; color:#D4AF37; font-weight:800; text-transform:uppercase;">2. Education & Professional Stature</div>
              <span style="font-size:24px;">🎓</span>
            </div>
            <div style="font-size:24px; font-weight:800; color:#FFFFFF; margin-top:4px;">Columbia Business School MBA '22</div>
            <div style="font-size:17px; color:#D1C2B4; margin-top:4px; line-height:1.4;">B.A. Economics, St. Stephen's College · Vice President at Top Global Private Equity Firm</div>
            <div style="display:flex; gap:10px; margin-top:10px;">
              <span style="background:rgba(34,197,94,0.15); border:1px solid rgba(34,197,94,0.3); padding:4px 12px; border-radius:10px; font-size:14px; color:#86EFAC;">Ivy League Alum</span>
              <span style="background:rgba(34,197,94,0.15); border:1px solid rgba(34,197,94,0.3); padding:4px 12px; border-radius:10px; font-size:14px; color:#86EFAC;">Board Track</span>
            </div>
          </div>

          <!-- Card 3 -->
          <div style="flex:1; background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(212,175,55,0.4); border-radius:24px; padding:26px 30px; box-shadow:0 10px 28px rgba(0,0,0,0.7); display:flex; flex-direction:column; justify-content:center;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="font-size:15px; letter-spacing:2px; color:#D4AF37; font-weight:800; text-transform:uppercase;">3. Kundli & Vedic Astrology</div>
              <span style="font-size:24px;">🔮</span>
            </div>
            <div style="font-size:24px; font-weight:800; color:#FFFFFF; margin-top:4px;">34 / 36 Gunas Vedic Compatibility</div>
            <div style="font-size:17px; color:#D1C2B4; margin-top:4px; line-height:1.4;">Non-Manglik · Nadi: Madhya · Rashi: Taurus · Auspicious Match with Excellent Graha Maitri</div>
            <div style="display:flex; gap:10px; margin-top:10px;">
              <span style="background:rgba(212,175,55,0.15); border:1px solid rgba(212,175,55,0.3); padding:4px 12px; border-radius:10px; font-size:14px; color:#F5E6C8;">Full Astro Verified</span>
              <span style="background:rgba(212,175,55,0.15); border:1px solid rgba(212,175,55,0.3); padding:4px 12px; border-radius:10px; font-size:14px; color:#F5E6C8;">0 Nadi Dosha</span>
            </div>
          </div>

          <!-- Card 4 -->
          <div style="flex:1; background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(212,175,55,0.4); border-radius:24px; padding:26px 30px; box-shadow:0 10px 28px rgba(0,0,0,0.7); display:flex; flex-direction:column; justify-content:center;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="font-size:15px; letter-spacing:2px; color:#D4AF37; font-weight:800; text-transform:uppercase;">4. BlurShield™ Discretion Protection</div>
              <span style="font-size:24px;">🔒</span>
            </div>
            <div style="font-size:24px; font-weight:800; color:#FFFFFF; margin-top:4px;">Confidential Non-Disclosure Active</div>
            <div style="font-size:17px; color:#D1C2B4; margin-top:4px; line-height:1.4;">High-resolution photos & contact details revealed only upon mutual two-way consent.</div>
            <div style="display:flex; gap:10px; margin-top:10px;">
              <span style="background:rgba(34,197,94,0.15); border:1px solid rgba(34,197,94,0.3); padding:4px 12px; border-radius:10px; font-size:14px; color:#86EFAC;">Anti-Screenshot Active</span>
              <span style="background:rgba(34,197,94,0.15); border:1px solid rgba(34,197,94,0.3); padding:4px 12px; border-radius:10px; font-size:14px; color:#86EFAC;">Apple 5.1.1 Compliant</span>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div style="display:flex; gap:16px; margin-top:6px;">
            <div style="flex:1; background:rgba(45,15,25,0.85); border:2px solid rgba(212,175,55,0.4); padding:20px; border-radius:20px; text-align:center; font-size:20px; font-weight:700; color:#E5D5C5;">
              ✕ Pass Discreetly
            </div>
            <div style="flex:2.2; background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:2px solid #D4AF37; padding:20px; border-radius:20px; text-align:center; font-size:20px; font-weight:800; color:#FFFFFF; box-shadow:0 10px 28px rgba(139,29,44,0.7); display:flex; align-items:center; justify-content:center; gap:10px;">
              ✨ Send Alliance Introduction
            </div>
          </div>
        </div>
      </div>
    `
  },

  // ==========================================
  // SCREEN 2: Verified Executive Bio-Data Dossier
  // ==========================================
  {
    id: '02_verified_candidate_biodata',
    badge: 'THE ARISTOCRATIC DOSSIER',
    title: '7-Point Verified Bio-Data',
    subtitle: 'Comprehensive credentials verified via DigiLocker, MCA records, and institutional registries.',
    innerHtml: `
      <!-- Candidate Profile Top Header Bar -->
      <div style="padding: 24px 44px; background:linear-gradient(180deg, #2A0B14 0%, #17040B 100%); border-bottom: 2px solid rgba(212,175,55,0.4); display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:24px;">
          <img src="${IMG_GROOM_ROYAL}" style="width:84px; height:84px; border-radius:50%; object-fit:cover; border:3px solid #D4AF37; box-shadow:0 8px 24px rgba(0,0,0,0.8);" />
          <div>
            <div style="display:flex; align-items:center; gap:14px;">
              <span style="font-family:'Cinzel', serif; font-size:36px; font-weight:800; color:#FFFFFF;">Advait Vikram Oberoi, 28</span>
              <span style="background:rgba(34,197,94,0.25); border:1.5px solid #22C55E; color:#86EFAC; font-size:16px; font-weight:800; padding:6px 14px; border-radius:14px;">✓ 100% VERIFIED</span>
            </div>
            <div style="font-size:20px; color:#D4AF37; font-weight:600; margin-top:4px;">Managing Director, Oberoi Capital · Harvard MBA '21 · New Delhi</div>
          </div>
        </div>
        <div style="background:rgba(212,175,55,0.15); border:2px solid #D4AF37; padding:12px 26px; border-radius:22px; font-size:19px; font-weight:800; color:#F5E6C8;">
          DOSSIER #OB-99201
        </div>
      </div>

      <!-- 3-Column Luxury Dossier Grid -->
      <div style="flex:1; display:flex; padding:28px 40px; gap:26px; overflow:hidden;">
        <!-- Column 1: Family Pedigree & Heritage -->
        <div style="flex:1; background:linear-gradient(180deg, #2A0B14 0%, #150309 100%); border:2px solid rgba(212,175,55,0.4); border-radius:26px; padding:28px 24px; display:flex; flex-direction:column; gap:16px; box-shadow:0 15px 40px rgba(0,0,0,0.8); justify-content:space-between;">
          <div style="border-bottom:1.5px solid rgba(212,175,55,0.3); padding-bottom:14px;">
            <div style="font-size:14px; letter-spacing:2px; color:#D4AF37; font-weight:800; text-transform:uppercase;">SECTION 1</div>
            <div style="font-size:24px; font-weight:800; color:#FFFFFF; margin-top:4px;">Family Lineage & Pedigree</div>
          </div>
          <div style="display:flex; flex-direction:column; gap:14px; flex:1; justify-content:space-around;">
            <div style="background:rgba(0,0,0,0.45); padding:16px; border-radius:16px; border-left:4px solid #D4AF37;">
              <div style="font-size:13px; color:#D4AF37; font-weight:700;">FATHER</div>
              <div style="font-size:20px; font-weight:800; color:#FFFFFF; margin-top:2px;">Rajiv Oberoi</div>
              <div style="font-size:15px; color:#C4B5A5;">Chairman, Oberoi Infrastructure Ltd (NSE Listed)</div>
            </div>
            <div style="background:rgba(0,0,0,0.45); padding:16px; border-radius:16px; border-left:4px solid #D4AF37;">
              <div style="font-size:13px; color:#D4AF37; font-weight:700;">MOTHER</div>
              <div style="font-size:20px; font-weight:800; color:#FFFFFF; margin-top:2px;">Kavita Singhania Oberoi</div>
              <div style="font-size:15px; color:#C4B5A5;">Trustee, Heritage Cultural Foundation & Author</div>
            </div>
            <div style="background:rgba(0,0,0,0.45); padding:16px; border-radius:16px; border-left:4px solid #D4AF37;">
              <div style="font-size:13px; color:#D4AF37; font-weight:700;">ANCESTRAL ORIGIN</div>
              <div style="font-size:20px; font-weight:800; color:#FFFFFF; margin-top:2px;">Lutyens' Delhi & Punjab</div>
              <div style="font-size:15px; color:#C4B5A5;">3-generation established industrial business family</div>
            </div>
            <div style="background:rgba(0,0,0,0.45); padding:16px; border-radius:16px; border-left:4px solid #D4AF37;">
              <div style="font-size:13px; color:#D4AF37; font-weight:700;">SIBLINGS</div>
              <div style="font-size:20px; font-weight:800; color:#FFFFFF; margin-top:2px;">1 Younger Sister (Columbia Alumna)</div>
              <div style="font-size:15px; color:#C4B5A5;">Director at Group Family Office</div>
            </div>
          </div>
        </div>

        <!-- Column 2: Academic & Career Stature -->
        <div style="flex:1; background:linear-gradient(180deg, #2A0B14 0%, #150309 100%); border:2px solid rgba(212,175,55,0.4); border-radius:26px; padding:28px 24px; display:flex; flex-direction:column; gap:16px; box-shadow:0 15px 40px rgba(0,0,0,0.8); justify-content:space-between;">
          <div style="border-bottom:1.5px solid rgba(212,175,55,0.3); padding-bottom:14px;">
            <div style="font-size:14px; letter-spacing:2px; color:#D4AF37; font-weight:800; text-transform:uppercase;">SECTION 2</div>
            <div style="font-size:24px; font-weight:800; color:#FFFFFF; margin-top:4px;">Education & Career</div>
          </div>
          <div style="display:flex; flex-direction:column; gap:14px; flex:1; justify-content:space-around;">
            <div style="background:rgba(0,0,0,0.45); padding:16px; border-radius:16px; border-left:4px solid #22C55E;">
              <div style="font-size:13px; color:#86EFAC; font-weight:700;">POST GRADUATE</div>
              <div style="font-size:20px; font-weight:800; color:#FFFFFF; margin-top:2px;">Harvard Business School</div>
              <div style="font-size:15px; color:#C4B5A5;">MBA, Class of 2021 · Baker Scholar Nominee</div>
            </div>
            <div style="background:rgba(0,0,0,0.45); padding:16px; border-radius:16px; border-left:4px solid #22C55E;">
              <div style="font-size:13px; color:#86EFAC; font-weight:700;">UNDER GRADUATE</div>
              <div style="font-size:20px; font-weight:800; color:#FFFFFF; margin-top:2px;">University of Oxford</div>
              <div style="font-size:15px; color:#C4B5A5;">B.A. (Hons) Philosophy, Politics & Economics (PPE)</div>
            </div>
            <div style="background:rgba(0,0,0,0.45); padding:16px; border-radius:16px; border-left:4px solid #22C55E;">
              <div style="font-size:13px; color:#86EFAC; font-weight:700;">CURRENT DESIGNATION</div>
              <div style="font-size:20px; font-weight:800; color:#FFFFFF; margin-top:2px;">Managing Director</div>
              <div style="font-size:15px; color:#C4B5A5;">Oberoi Capital Ventures ($450M AUM)</div>
            </div>
            <div style="background:rgba(0,0,0,0.45); padding:16px; border-radius:16px; border-left:4px solid #22C55E;">
              <div style="font-size:13px; color:#86EFAC; font-weight:700;">HONORS & AWARDS</div>
              <div style="font-size:20px; font-weight:800; color:#FFFFFF; margin-top:2px;">Forbes 30 Under 30 Alum</div>
              <div style="font-size:15px; color:#C4B5A5;">Young Global Leader Nominee 2024</div>
            </div>
          </div>
        </div>

        <!-- Column 3: Astrological Synergy & Lifestyle -->
        <div style="flex:1; background:linear-gradient(180deg, #2A0B14 0%, #150309 100%); border:2px solid rgba(212,175,55,0.4); border-radius:26px; padding:28px 24px; display:flex; flex-direction:column; gap:16px; box-shadow:0 15px 40px rgba(0,0,0,0.8); justify-content:space-between;">
          <div style="border-bottom:1.5px solid rgba(212,175,55,0.3); padding-bottom:14px;">
            <div style="font-size:14px; letter-spacing:2px; color:#D4AF37; font-weight:800; text-transform:uppercase;">SECTION 3</div>
            <div style="font-size:24px; font-weight:800; color:#FFFFFF; margin-top:4px;">Astro & Lifestyle Quotient</div>
          </div>
          <div style="display:flex; flex-direction:column; gap:14px; flex:1; justify-content:space-around;">
            <div style="background:rgba(0,0,0,0.45); padding:16px; border-radius:16px; border-left:4px solid #D4AF37;">
              <div style="font-size:13px; color:#D4AF37; font-weight:700;">VEDIC HOROSCOPE</div>
              <div style="font-size:20px; font-weight:800; color:#FFFFFF; margin-top:2px;">35 / 36 Gunas Compatible</div>
              <div style="font-size:15px; color:#C4B5A5;">Non-Manglik · Rashi: Leo · Nadi: Antya</div>
            </div>
            <div style="background:rgba(0,0,0,0.45); padding:16px; border-radius:16px; border-left:4px solid #D4AF37;">
              <div style="font-size:13px; color:#D4AF37; font-weight:700;">LIFESTYLE VALUES</div>
              <div style="font-size:20px; font-weight:800; color:#FFFFFF; margin-top:2px;">Teetotaler & Vegetarian</div>
              <div style="font-size:15px; color:#C4B5A5;">Equestrian Polo, Classical Sitar & Art Collector</div>
            </div>
            <div style="background:rgba(0,0,0,0.45); padding:16px; border-radius:16px; border-left:4px solid #D4AF37;">
              <div style="font-size:13px; color:#D4AF37; font-weight:700;">GLOBAL RESIDENCIES</div>
              <div style="font-size:20px; font-weight:800; color:#FFFFFF; margin-top:2px;">Delhi & Mayfair, London</div>
              <div style="font-size:15px; color:#C4B5A5;">Dual residency with frequent travel</div>
            </div>
            <div style="background:rgba(0,0,0,0.45); padding:16px; border-radius:16px; border-left:4px solid #D4AF37;">
              <div style="font-size:13px; color:#D4AF37; font-weight:700;">PARTNER PREFERENCES</div>
              <div style="font-size:20px; font-weight:800; color:#FFFFFF; margin-top:2px;">Intellectual & Cultural Alignment</div>
              <div style="font-size:15px; color:#C4B5A5;">High educational standing & family respect</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Verification Seal Bar -->
      <div style="padding: 22px 44px; background:rgba(20,4,10,0.98); border-top: 2px solid rgba(212,175,55,0.4); display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; gap:16px; align-items:center;">
          <span style="font-size:17px; color:#D4AF37; font-weight:800;">VERIFIED BY:</span>
          <span style="background:rgba(255,255,255,0.08); padding:8px 16px; border-radius:12px; font-size:15px; color:#FFFFFF; font-weight:600;">🏛 DigiLocker Aadhaar</span>
          <span style="background:rgba(255,255,255,0.08); padding:8px 16px; border-radius:12px; font-size:15px; color:#FFFFFF; font-weight:600;">🎓 Harvard Registrar</span>
          <span style="background:rgba(255,255,255,0.08); padding:8px 16px; border-radius:12px; font-size:15px; color:#FFFFFF; font-weight:600;">📊 MCA Directorship</span>
        </div>
        <div style="display:flex; gap:14px;">
          <div style="background:rgba(212,175,55,0.15); border:1.5px solid #D4AF37; padding:14px 24px; border-radius:18px; font-size:18px; font-weight:700; color:#F5E6C8;">
            📥 Download Certified PDF
          </div>
          <div style="background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:2px solid #D4AF37; padding:14px 28px; border-radius:18px; font-size:18px; font-weight:800; color:#FFFFFF; box-shadow:0 8px 24px rgba(139,29,44,0.6);">
            ✨ Propose Family Meeting
          </div>
        </div>
      </div>
    `
  },

  // ==========================================
  // SCREEN 3: BlurShield™ Photo Privacy
  // ==========================================
  {
    id: '03_blurshield_photo_privacy',
    badge: 'MILITARY-GRADE DISCRETION',
    title: 'BlurShield™ Photo Privacy',
    subtitle: 'Zero public search indexing. High-res portraits revealed strictly upon mutual family consent.',
    innerHtml: `
      <!-- Top Title Bar -->
      <div style="padding: 24px 44px; background:linear-gradient(180deg, #2A0B14 0%, #17040B 100%); border-bottom: 2px solid rgba(212,175,55,0.4); display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-family:'Cinzel', serif; font-size:32px; font-weight:800; color:#FFFFFF;">PRIVACY & DISCRETION ARCHITECTURE</div>
          <div style="font-size:17px; color:#D4AF37; font-weight:600; margin-top:2px;">100% Confidential Sanctuary for High-Profile Families</div>
        </div>
        <div style="background:rgba(34,197,94,0.2); border:2px solid #22C55E; color:#86EFAC; padding:10px 22px; border-radius:22px; font-size:17px; font-weight:800; display:flex; align-items:center; gap:8px;">
          🔒 BLURSHIELD™ ACTIVE
        </div>
      </div>

      <!-- Main Body Split -->
      <div style="flex:1; display:flex; padding:28px 40px; gap:32px; overflow:hidden;">
        <!-- Left: Side-by-Side Comparison of Blurred vs Authorized -->
        <div style="flex:1.1; display:flex; gap:20px;">
          <!-- Card A: Blurred State -->
          <div style="flex:1; border-radius:28px; overflow:hidden; position:relative; box-shadow:0 25px 70px rgba(0,0,0,0.9); border:2px solid rgba(212,175,55,0.4); display:flex; flex-direction:column; justify-content:flex-end;">
            <img src="${IMG_BRIDE_PASTEL}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:blur(32px) brightness(0.6);" />
            <div style="position:absolute; inset:0; background:rgba(20,4,10,0.5);"></div>
            
            <div style="position:relative; z-index:2; padding:28px; text-align:center;">
              <div style="width:68px; height:68px; border-radius:50%; background:rgba(212,175,55,0.2); border:2px solid #D4AF37; display:flex; align-items:center; justify-content:center; margin:0 auto 12px; font-size:32px; box-shadow:0 8px 24px rgba(0,0,0,0.8);">🔒</div>
              <div style="font-family:'Cinzel', serif; font-size:24px; font-weight:800; color:#FFFFFF;">Discreet Blurred Mode</div>
              <div style="font-size:15px; color:#D4AF37; font-weight:700; margin-top:2px;">Default Unrevealed State</div>
              <p style="font-size:14px; color:#C4B5A5; margin-top:6px; line-height:1.4;">Face is cryptographically obscured. Send alliance wave to request reveal.</p>
              <div style="margin-top:14px; background:rgba(212,175,55,0.2); border:1.5px solid #D4AF37; padding:10px; border-radius:14px; font-size:15px; font-weight:800; color:#F5E6C8;">
                ✨ Request Photo Access
              </div>
            </div>
          </div>

          <!-- Card B: Authorized Clear State -->
          <div style="flex:1; border-radius:28px; overflow:hidden; position:relative; box-shadow:0 25px 70px rgba(0,0,0,0.9); border:2px solid #22C55E; display:flex; flex-direction:column; justify-content:flex-end;">
            <img src="${IMG_BRIDE_PASTEL}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;" />
            <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(15,8,10,0) 0%, rgba(20,5,10,0.25) 35%, rgba(10,2,5,0.96) 80%);"></div>
            
            <div style="position:relative; z-index:2; padding:28px; text-align:center;">
              <div style="width:68px; height:68px; border-radius:50%; background:rgba(34,197,94,0.25); border:2px solid #22C55E; display:flex; align-items:center; justify-content:center; margin:0 auto 12px; font-size:32px; box-shadow:0 8px 24px rgba(0,0,0,0.8);">✓</div>
              <div style="font-family:'Cinzel', serif; font-size:24px; font-weight:800; color:#FFFFFF;">Authorized Reveal</div>
              <div style="font-size:15px; color:#86EFAC; font-weight:700; margin-top:2px;">Mutual Consent Granted</div>
              <p style="font-size:14px; color:#C4B5A5; margin-top:6px; line-height:1.4;">Crystal-clear high-res photos unlocked exclusively for your verified family.</p>
              <div style="margin-top:14px; background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:1.5px solid #D4AF37; padding:10px; border-radius:14px; font-size:15px; font-weight:800; color:#FFFFFF;">
                💬 Open Direct Chat
              </div>
            </div>
          </div>
        </div>

        <!-- Right: 4 Comprehensive Privacy Control Cards -->
        <div style="flex:0.9; display:flex; flex-direction:column; gap:18px;">
          <div style="flex:1; background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(212,175,55,0.4); border-radius:24px; padding:26px 30px; box-shadow:0 10px 28px rgba(0,0,0,0.7); display:flex; flex-direction:column; justify-content:center;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="font-size:15px; letter-spacing:2px; color:#D4AF37; font-weight:800; text-transform:uppercase;">1. Zero Public Search Indexing</div>
              <span style="font-size:24px;">🛡️</span>
            </div>
            <div style="font-size:22px; font-weight:800; color:#FFFFFF; margin-top:4px;">Anti-Crawler Web Shield</div>
            <p style="font-size:16px; color:#D1C2B4; margin-top:4px; line-height:1.4;">Your bio-data, photographs, and family credentials are never indexed by search engines or public web scrapers.</p>
          </div>

          <div style="flex:1; background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(212,175,55,0.4); border-radius:24px; padding:26px 30px; box-shadow:0 10px 28px rgba(0,0,0,0.7); display:flex; flex-direction:column; justify-content:center;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="font-size:15px; letter-spacing:2px; color:#D4AF37; font-weight:800; text-transform:uppercase;">2. Ephemeral Dynamic Watermarking</div>
              <span style="font-size:24px;">🔐</span>
            </div>
            <div style="font-size:22px; font-weight:800; color:#FFFFFF; margin-top:4px;">Cryptographic Leak Deterrent</div>
            <p style="font-size:16px; color:#D1C2B4; margin-top:4px; line-height:1.4;">Invisible forensic watermarks tied to the viewing member's verified identity actively prevent leaks & screenshots.</p>
          </div>

          <div style="flex:1; background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(212,175,55,0.4); border-radius:24px; padding:26px 30px; box-shadow:0 10px 28px rgba(0,0,0,0.7); display:flex; flex-direction:column; justify-content:center;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="font-size:15px; letter-spacing:2px; color:#D4AF37; font-weight:800; text-transform:uppercase;">3. Dual-Key Family Authorization Gate</div>
              <span style="font-size:24px;">🤝</span>
            </div>
            <div style="font-size:22px; font-weight:800; color:#FFFFFF; margin-top:4px;">Parental & Candidate Consent</div>
            <p style="font-size:16px; color:#D1C2B4; margin-top:4px; line-height:1.4;">Both candidate and registered family elders must authenticate before unblurred biodata dossiers are exchanged.</p>
          </div>

          <div style="flex:1; background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(212,175,55,0.4); border-radius:24px; padding:26px 30px; box-shadow:0 10px 28px rgba(0,0,0,0.7); display:flex; flex-direction:column; justify-content:center;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="font-size:15px; letter-spacing:2px; color:#D4AF37; font-weight:800; text-transform:uppercase;">4. Instant 1-Tap Account Purge (Apple 5.1.1)</div>
              <span style="font-size:24px;">🗑️</span>
            </div>
            <div style="font-size:22px; font-weight:800; color:#FFFFFF; margin-top:4px;">Permanent Cryptographic Wipe</div>
            <p style="font-size:16px; color:#D1C2B4; margin-top:4px; line-height:1.4;">Permanently wipe your account, photos, chat records, and DigiLocker files anytime in 1 tap from settings.</p>
          </div>
        </div>
      </div>
    `
  },

  // ==========================================
  // SCREEN 4: High-Affinity Mutual Alliances Grid (FULL BLEED ZERO VOID)
  // ==========================================
  {
    id: '04_mutual_alliances_matches',
    badge: 'CURATED HARMONY',
    title: 'High-Affinity Mutual Alliances',
    subtitle: 'Daily bespoke recommendations powered by astrological synergy and pedigree compatibility.',
    innerHtml: `
      <!-- Top Filter Pills -->
      <div style="padding: 20px 44px; background:linear-gradient(180deg, #2A0B14 0%, #17040B 100%); border-bottom: 2px solid rgba(212,175,55,0.4); display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; gap:14px;">
          <div style="background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:2px solid #D4AF37; padding:10px 22px; border-radius:22px; font-size:17px; font-weight:800; color:#FFFFFF; box-shadow:0 6px 20px rgba(139,29,44,0.6);">
            ✨ Curated Alliances (4)
          </div>
          <div style="background:rgba(212,175,55,0.15); border:1.5px solid #D4AF37; padding:10px 22px; border-radius:22px; font-size:17px; font-weight:700; color:#F5E6C8;">
            🔮 Kundli 32+ Gunas
          </div>
          <div style="background:rgba(212,175,55,0.15); border:1.5px solid #D4AF37; padding:10px 22px; border-radius:22px; font-size:17px; font-weight:700; color:#F5E6C8;">
            🏛 Ivy League / Tier-1
          </div>
          <div style="background:rgba(212,175,55,0.15); border:1.5px solid #D4AF37; padding:10px 22px; border-radius:22px; font-size:17px; font-weight:700; color:#F5E6C8;">
            👑 Industrialist Pedigree
          </div>
        </div>
        <div style="font-size:18px; color:#D4AF37; font-weight:800;">
          SORT: HIGHEST HARMONY ▼
        </div>
      </div>

      <!-- 2x2 Grand Alliance Match Grid - Full Bleed Rich Cards -->
      <div style="flex:1; display:grid; grid-template-columns:1fr 1fr; grid-template-rows:1fr 1fr; padding:28px 40px; gap:26px; overflow:hidden;">
        <!-- Card 1 -->
        <div style="background:linear-gradient(180deg, #2A0B14 0%, #150309 100%); border:2px solid rgba(212,175,55,0.45); border-radius:28px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 15px 40px rgba(0,0,0,0.85);">
          <div style="flex:1.4; position:relative; overflow:hidden;">
            <img src="${IMG_BRIDE_ROYAL}" style="width:100%; height:100%; object-fit:cover; object-position:center 15%;" />
            <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(20,4,10,0.92) 100%);"></div>
            <div style="position:absolute; top:16px; left:16px; background:rgba(34,197,94,0.3); border:1.5px solid #22C55E; color:#86EFAC; font-size:14px; font-weight:800; padding:6px 14px; border-radius:12px;">✓ 100% VERIFIED</div>
            <div style="position:absolute; top:16px; right:16px; background:rgba(212,175,55,0.3); border:1.5px solid #D4AF37; color:#FDE68A; font-size:14px; font-weight:800; padding:6px 14px; border-radius:12px;">98% MATCH</div>
            <div style="position:absolute; bottom:14px; left:22px; right:22px;">
              <div style="font-family:'Cinzel', serif; font-size:34px; font-weight:800; color:#FFFFFF;">Ananya Singhania, 26</div>
              <div style="font-size:19px; color:#D4AF37; font-weight:700;">Columbia MBA '22 · VP Private Equity</div>
            </div>
          </div>
          <div style="flex:1; padding:20px 24px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="font-size:16px; color:#D1C2B4; line-height:1.4;">Prominent Industrialist Family · Vedic Kundli 34/36 Gunas · South Mumbai</div>
              <div style="display:flex; gap:8px; margin-top:10px;">
                <span style="background:rgba(255,255,255,0.08); padding:5px 12px; border-radius:8px; font-size:14px; color:#E5D5C5;">Ivy League</span>
                <span style="background:rgba(255,255,255,0.08); padding:5px 12px; border-radius:8px; font-size:14px; color:#E5D5C5;">Non-Manglik</span>
                <span style="background:rgba(255,255,255,0.08); padding:5px 12px; border-radius:8px; font-size:14px; color:#E5D5C5;">Vegetarian</span>
                <span style="background:rgba(255,255,255,0.08); padding:5px 12px; border-radius:8px; font-size:14px; color:#E5D5C5;">₹500 Cr+ Lineage</span>
              </div>
            </div>
            <div style="display:flex; gap:12px; margin-top:10px;">
              <div style="flex:1; background:rgba(212,175,55,0.15); border:1.5px solid #D4AF37; padding:14px; border-radius:14px; text-align:center; font-size:17px; font-weight:700; color:#F5E6C8;">
                View Dossier
              </div>
              <div style="flex:1.2; background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:1.5px solid #D4AF37; padding:14px; border-radius:14px; text-align:center; font-size:17px; font-weight:800; color:#FFFFFF;">
                ✨ Send Wave
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2 -->
        <div style="background:linear-gradient(180deg, #2A0B14 0%, #150309 100%); border:2px solid rgba(212,175,55,0.45); border-radius:28px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 15px 40px rgba(0,0,0,0.85);">
          <div style="flex:1.4; position:relative; overflow:hidden;">
            <img src="${IMG_GROOM_ROYAL}" style="width:100%; height:100%; object-fit:cover; object-position:center 15%;" />
            <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(20,4,10,0.92) 100%);"></div>
            <div style="position:absolute; top:16px; left:16px; background:rgba(34,197,94,0.3); border:1.5px solid #22C55E; color:#86EFAC; font-size:14px; font-weight:800; padding:6px 14px; border-radius:12px;">✓ 100% VERIFIED</div>
            <div style="position:absolute; top:16px; right:16px; background:rgba(212,175,55,0.3); border:1.5px solid #D4AF37; color:#FDE68A; font-size:14px; font-weight:800; padding:6px 14px; border-radius:12px;">99% MATCH</div>
            <div style="position:absolute; bottom:14px; left:22px; right:22px;">
              <div style="font-family:'Cinzel', serif; font-size:34px; font-weight:800; color:#FFFFFF;">Advait Oberoi, 28</div>
              <div style="font-size:19px; color:#D4AF37; font-weight:700;">Harvard MBA '21 · MD Venture Capital</div>
            </div>
          </div>
          <div style="flex:1; padding:20px 24px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="font-size:16px; color:#D1C2B4; line-height:1.4;">Infrastructure Lineage · Vedic Kundli 35/36 Gunas · Lutyens' Delhi</div>
              <div style="display:flex; gap:8px; margin-top:10px;">
                <span style="background:rgba(255,255,255,0.08); padding:5px 12px; border-radius:8px; font-size:14px; color:#E5D5C5;">Harvard Alum</span>
                <span style="background:rgba(255,255,255,0.08); padding:5px 12px; border-radius:8px; font-size:14px; color:#E5D5C5;">Teetotaler</span>
                <span style="background:rgba(255,255,255,0.08); padding:5px 12px; border-radius:8px; font-size:14px; color:#E5D5C5;">Equestrian</span>
                <span style="background:rgba(255,255,255,0.08); padding:5px 12px; border-radius:8px; font-size:14px; color:#E5D5C5;">NSE Board</span>
              </div>
            </div>
            <div style="display:flex; gap:12px; margin-top:10px;">
              <div style="flex:1; background:rgba(212,175,55,0.15); border:1.5px solid #D4AF37; padding:14px; border-radius:14px; text-align:center; font-size:17px; font-weight:700; color:#F5E6C8;">
                View Dossier
              </div>
              <div style="flex:1.2; background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:1.5px solid #D4AF37; padding:14px; border-radius:14px; text-align:center; font-size:17px; font-weight:800; color:#FFFFFF;">
                ✨ Send Wave
              </div>
            </div>
          </div>
        </div>

        <!-- Card 3 -->
        <div style="background:linear-gradient(180deg, #2A0B14 0%, #150309 100%); border:2px solid rgba(212,175,55,0.45); border-radius:28px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 15px 40px rgba(0,0,0,0.85);">
          <div style="flex:1.4; position:relative; overflow:hidden;">
            <img src="${IMG_BRIDE_PASTEL}" style="width:100%; height:100%; object-fit:cover; object-position:center 15%;" />
            <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(20,4,10,0.92) 100%);"></div>
            <div style="position:absolute; top:16px; left:16px; background:rgba(34,197,94,0.3); border:1.5px solid #22C55E; color:#86EFAC; font-size:14px; font-weight:800; padding:6px 14px; border-radius:12px;">✓ 100% VERIFIED</div>
            <div style="position:absolute; top:16px; right:16px; background:rgba(212,175,55,0.3); border:1.5px solid #D4AF37; color:#FDE68A; font-size:14px; font-weight:800; padding:6px 14px; border-radius:12px;">96% MATCH</div>
            <div style="position:absolute; bottom:14px; left:22px; right:22px;">
              <div style="font-family:'Cinzel', serif; font-size:34px; font-weight:800; color:#FFFFFF;">Devika Mehra, 27</div>
              <div style="font-size:19px; color:#D4AF37; font-weight:700;">Wharton Finance '20 · Director, Family Office</div>
            </div>
          </div>
          <div style="flex:1; padding:20px 24px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="font-size:16px; color:#D1C2B4; line-height:1.4;">Real Estate Conglomerate · 33/36 Gunas · Bangalore & London</div>
              <div style="display:flex; gap:8px; margin-top:10px;">
                <span style="background:rgba(255,255,255,0.08); padding:5px 12px; border-radius:8px; font-size:14px; color:#E5D5C5;">Wharton Alum</span>
                <span style="background:rgba(255,255,255,0.08); padding:5px 12px; border-radius:8px; font-size:14px; color:#E5D5C5;">Non-Manglik</span>
                <span style="background:rgba(255,255,255,0.08); padding:5px 12px; border-radius:8px; font-size:14px; color:#E5D5C5;">Classical Dance</span>
                <span style="background:rgba(255,255,255,0.08); padding:5px 12px; border-radius:8px; font-size:14px; color:#E5D5C5;">Arts Patron</span>
              </div>
            </div>
            <div style="display:flex; gap:12px; margin-top:10px;">
              <div style="flex:1; background:rgba(212,175,55,0.15); border:1.5px solid #D4AF37; padding:14px; border-radius:14px; text-align:center; font-size:17px; font-weight:700; color:#F5E6C8;">
                View Dossier
              </div>
              <div style="flex:1.2; background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:1.5px solid #D4AF37; padding:14px; border-radius:14px; text-align:center; font-size:17px; font-weight:800; color:#FFFFFF;">
                ✨ Send Wave
              </div>
            </div>
          </div>
        </div>

        <!-- Card 4 -->
        <div style="background:linear-gradient(180deg, #2A0B14 0%, #150309 100%); border:2px solid rgba(212,175,55,0.45); border-radius:28px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 15px 40px rgba(0,0,0,0.85);">
          <div style="flex:1.4; position:relative; overflow:hidden;">
            <img src="${IMG_COUPLE}" style="width:100%; height:100%; object-fit:cover; object-position:center 15%;" />
            <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(20,4,10,0.92) 100%);"></div>
            <div style="position:absolute; top:16px; left:16px; background:rgba(34,197,94,0.3); border:1.5px solid #22C55E; color:#86EFAC; font-size:14px; font-weight:800; padding:6px 14px; border-radius:12px;">✓ 100% VERIFIED</div>
            <div style="position:absolute; top:16px; right:16px; background:rgba(212,175,55,0.3); border:1.5px solid #D4AF37; color:#FDE68A; font-size:14px; font-weight:800; padding:6px 14px; border-radius:12px;">97% MATCH</div>
            <div style="position:absolute; bottom:14px; left:22px; right:22px;">
              <div style="font-family:'Cinzel', serif; font-size:34px; font-weight:800; color:#FFFFFF;">Kabir Singhania, 29</div>
              <div style="font-size:19px; color:#D4AF37; font-weight:700;">Stanford MS '21 · Co-Founder & Tech CEO</div>
            </div>
          </div>
          <div style="flex:1; padding:20px 24px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="font-size:16px; color:#D1C2B4; line-height:1.4;">Automotive Dynasty · 32/36 Gunas · Mumbai & London</div>
              <div style="display:flex; gap:8px; margin-top:10px;">
                <span style="background:rgba(255,255,255,0.08); padding:5px 12px; border-radius:8px; font-size:14px; color:#E5D5C5;">Stanford Alum</span>
                <span style="background:rgba(255,255,255,0.08); padding:5px 12px; border-radius:8px; font-size:14px; color:#E5D5C5;">Founder</span>
                <span style="background:rgba(255,255,255,0.08); padding:5px 12px; border-radius:8px; font-size:14px; color:#E5D5C5;">Aviation</span>
                <span style="background:rgba(255,255,255,0.08); padding:5px 12px; border-radius:8px; font-size:14px; color:#E5D5C5;">Global Tech</span>
              </div>
            </div>
            <div style="display:flex; gap:12px; margin-top:10px;">
              <div style="flex:1; background:rgba(212,175,55,0.15); border:1.5px solid #D4AF37; padding:14px; border-radius:14px; text-align:center; font-size:17px; font-weight:700; color:#F5E6C8;">
                View Dossier
              </div>
              <div style="flex:1.2; background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:1.5px solid #D4AF37; padding:14px; border-radius:14px; text-align:center; font-size:17px; font-weight:800; color:#FFFFFF;">
                ✨ Send Wave
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  // ==========================================
  // SCREEN 5: Private Concierge Messenger (FULL-BLEED 2-PANE CHAT)
  // ==========================================
  {
    id: '05_private_encrypted_chat',
    badge: 'END-TO-END ENCRYPTED',
    title: 'Discreet Concierge Messenger',
    subtitle: 'Private communication with senior matchmakers and prospective alliance families.',
    innerHtml: `
      <!-- Master-Detail 2-Pane Messenger -->
      <div style="flex:1; display:flex; overflow:hidden;">
        <!-- Left Pane: Conversations List (35%) -->
        <div style="flex:0.35; background:linear-gradient(180deg, #240812 0%, #120208 100%); border-right:2px solid rgba(212,175,55,0.35); display:flex; flex-direction:column;">
          <!-- Left Header -->
          <div style="padding:24px 28px; border-bottom:1.5px solid rgba(212,175,55,0.3); display:flex; justify-content:space-between; align-items:center;">
            <div style="font-family:'Cinzel', serif; font-size:26px; font-weight:800; color:#FFFFFF;">ALLIANCES (7)</div>
            <span style="background:rgba(34,197,94,0.2); border:1px solid #22C55E; color:#86EFAC; font-size:13px; font-weight:800; padding:4px 10px; border-radius:10px;">● ENCRYPTED</span>
          </div>

          <!-- List Items - Natural Flow -->
          <div style="flex:1; display:flex; flex-direction:column; justify-content:space-between; padding:8px 0 16px;">
            <!-- Active Item 1 -->
            <div style="padding:18px 24px; background:rgba(139,29,44,0.45); border-left:6px solid #D4AF37; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; gap:16px; align-items:center;">
              <img src="${IMG_BRIDE_ROYAL}" style="width:64px; height:64px; border-radius:50%; object-fit:cover; border:2px solid #D4AF37;" />
              <div style="flex:1;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:20px; font-weight:800; color:#FFFFFF;">Ananya Singhania</span>
                  <span style="font-size:14px; color:#D4AF37; font-weight:700;">10:18 AM</span>
                </div>
                <div style="font-size:15px; color:#86EFAC; font-weight:600; margin-top:2px;">✓ Consultation RSVP'd</div>
                <div style="font-size:14px; color:#D1C2B4; margin-top:2px;">Namaste. We would be delighted...</div>
              </div>
            </div>

            <!-- Item 2 -->
            <div style="padding:18px 24px; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; gap:16px; align-items:center;">
              <div style="width:64px; height:64px; border-radius:50%; background:linear-gradient(135deg, #D4AF37, #8B1D2C); display:flex; align-items:center; justify-content:center; font-size:28px;">👑</div>
              <div style="flex:1;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:20px; font-weight:800; color:#FFFFFF;">VIP Concierge Devika</span>
                  <span style="font-size:14px; color:#A89F91;">Yesterday</span>
                </div>
                <div style="font-size:14px; color:#D1C2B4; margin-top:2px;">Taj Mahal Palace private lounge booked.</div>
              </div>
            </div>

            <!-- Item 3 -->
            <div style="padding:18px 24px; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; gap:16px; align-items:center;">
              <img src="${IMG_GROOM_ROYAL}" style="width:64px; height:64px; border-radius:50%; object-fit:cover; border:2px solid rgba(212,175,55,0.4);" />
              <div style="flex:1;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:20px; font-weight:800; color:#FFFFFF;">Advait Oberoi</span>
                  <span style="font-size:14px; color:#A89F91;">Monday</span>
                </div>
                <div style="font-size:14px; color:#D1C2B4; margin-top:2px;">Horoscope matched at 35 Gunas.</div>
              </div>
            </div>

            <!-- Item 4 -->
            <div style="padding:18px 24px; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; gap:16px; align-items:center;">
              <img src="${IMG_BRIDE_PASTEL}" style="width:64px; height:64px; border-radius:50%; object-fit:cover; border:2px solid rgba(212,175,55,0.4);" />
              <div style="flex:1;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:20px; font-weight:800; color:#FFFFFF;">Devika Mehra</span>
                  <span style="font-size:14px; color:#A89F91;">Sep 12</span>
                </div>
                <div style="font-size:14px; color:#D1C2B4; margin-top:2px;">Shared the updated family biodata docket.</div>
              </div>
            </div>

            <!-- Item 5 -->
            <div style="padding:18px 24px; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; gap:16px; align-items:center;">
              <img src="${IMG_COUPLE}" style="width:64px; height:64px; border-radius:50%; object-fit:cover; border:2px solid rgba(212,175,55,0.4);" />
              <div style="flex:1;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:20px; font-weight:800; color:#FFFFFF;">Kabir Singhania</span>
                  <span style="font-size:14px; color:#A89F91;">Sep 10</span>
                </div>
                <div style="font-size:14px; color:#D1C2B4; margin-top:2px;">Alliance wave accepted mutually.</div>
              </div>
            </div>

            <!-- Item 6 -->
            <div style="padding:18px 24px; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; gap:16px; align-items:center;">
              <img src="${IMG_FLORAL}" style="width:64px; height:64px; border-radius:50%; object-fit:cover; border:2px solid rgba(212,175,55,0.4);" />
              <div style="flex:1;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:20px; font-weight:800; color:#FFFFFF;">Rhea Birla</span>
                  <span style="font-size:14px; color:#A89F91;">Sep 08</span>
                </div>
                <div style="font-size:14px; color:#D1C2B4; margin-top:2px;">Vedic match review completed.</div>
              </div>
            </div>

            <!-- Item 7 -->
            <div style="padding:18px 24px; display:flex; gap:16px; align-items:center;">
              <img src="${IMG_SILK}" style="width:64px; height:64px; border-radius:50%; object-fit:cover; border:2px solid rgba(212,175,55,0.4);" />
              <div style="flex:1;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:20px; font-weight:800; color:#FFFFFF;">Aditi Godrej</span>
                  <span style="font-size:14px; color:#A89F91;">Sep 05</span>
                </div>
                <div style="font-size:14px; color:#D1C2B4; margin-top:2px;">Dossier requested by family elders.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Pane: Active Chat Thread (65%) -->
        <div style="flex:0.65; background:rgba(15,4,8,0.98); display:flex; flex-direction:column; justify-content:space-between;">
          <!-- Chat Top Header -->
          <div style="padding:22px 32px; background:rgba(30,8,16,0.98); border-bottom:1.5px solid rgba(212,175,55,0.3); display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:18px;">
              <img src="${IMG_BRIDE_ROYAL}" style="width:60px; height:60px; border-radius:50%; object-fit:cover; border:2px solid #D4AF37;" />
              <div>
                <div style="font-family:'Cinzel', serif; font-size:26px; font-weight:800; color:#FFFFFF;">Ananya Singhania & Family</div>
                <div style="font-size:15px; color:#86EFAC; font-weight:600;">● Online · End-to-End Encrypted via Signal Protocol</div>
              </div>
            </div>
            <div style="display:flex; gap:12px;">
              <div style="background:rgba(212,175,55,0.15); border:1.5px solid #D4AF37; padding:10px 20px; border-radius:16px; font-size:16px; font-weight:700; color:#F5E6C8;">
                📄 View Dossier
              </div>
            </div>
          </div>

          <!-- Chat Conversation Area - Completely Packed Rich Thread -->
          <div style="flex:1; padding:24px 32px; display:flex; flex-direction:column; gap:16px; justify-content:space-around;">
            <!-- Meeting Invitation Card -->
            <div style="background:linear-gradient(135deg, rgba(48,14,28,0.98) 0%, rgba(26,6,15,0.98) 100%); border:2px solid #D4AF37; border-radius:22px; padding:22px 26px; box-shadow:0 10px 28px rgba(0,0,0,0.8); display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-size:13px; letter-spacing:2px; color:#D4AF37; font-weight:800; text-transform:uppercase;">SCHEDULED FAMILY CONSULTATION</div>
                <div style="font-size:24px; font-weight:800; color:#FFFFFF; margin-top:2px;">The Taj Mahal Palace, Mumbai — Private Sea Lounge</div>
                <div style="font-size:16px; color:#C4B5A5; margin-top:3px;">Sunday, 4:00 PM · Senior Matchmaker Assisted · High-Tea Reserved</div>
              </div>
              <div style="background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:1.5px solid #D4AF37; padding:12px 22px; border-radius:16px; font-size:17px; font-weight:800; color:#FFFFFF;">
                ✓ RSVP Confirmed
              </div>
            </div>

            <!-- Matchmaker Introduction Note Bubble -->
            <div style="align-self:center; background:rgba(212,175,55,0.12); border:1.5px solid rgba(212,175,55,0.4); border-radius:18px; padding:14px 24px; text-align:center; width:92%;">
              <div style="font-size:16px; color:#F5E6C8; font-weight:700;">✨ Senior Matchmaker Devika connected both families on Sep 14</div>
              <div style="font-size:14px; color:#D4AF37; margin-top:2px;">Astrological score: 34/36 Gunas · Both pedigrees pre-verified via DigiLocker</div>
            </div>

            <!-- Biodata Card Attachment -->
            <div style="align-self:flex-start; background:rgba(42,14,24,0.95); border:1.5px solid rgba(212,175,55,0.4); border-radius:20px; padding:16px 22px; display:flex; gap:16px; align-items:center; max-width:75%;">
              <div style="width:48px; height:48px; border-radius:14px; background:rgba(212,175,55,0.2); border:1.5px solid #D4AF37; display:flex; align-items:center; justify-content:center; font-size:24px;">📄</div>
              <div>
                <div style="font-size:17px; font-weight:800; color:#FFFFFF;">Certified_Singhania_Dossier_2026.pdf</div>
                <div style="font-size:13px; color:#86EFAC; margin-top:2px;">✓ 4.2 MB · Cryptographically Signed & Watermarked</div>
              </div>
            </div>

            <!-- Voice Note Bubble -->
            <div style="align-self:flex-start; max-width:75%; background:rgba(42,14,24,0.95); border:1.5px solid rgba(212,175,55,0.4); border-radius:20px; border-top-left-radius:4px; padding:16px 22px; box-shadow:0 6px 20px rgba(0,0,0,0.6);">
              <div style="display:flex; align-items:center; gap:14px;">
                <div style="width:44px; height:44px; border-radius:50%; background:#D4AF37; color:#14040A; display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:800;">▶</div>
                <div style="flex:1;">
                  <div style="font-size:17px; font-weight:800; color:#FFFFFF;">Family Matchmaker Audio Note (0:48)</div>
                  <div style="font-size:13px; color:#D4AF37; margin-top:2px;">"Detailed overview of kundli alignment & family lineage"</div>
                </div>
              </div>
              <div style="font-size:12px; color:#A89F91; text-align:right; margin-top:4px;">10:12 AM · Listened</div>
            </div>

            <!-- Received Message -->
            <div style="align-self:flex-start; max-width:82%; background:rgba(42,14,24,0.95); border:1.5px solid rgba(212,175,55,0.4); border-radius:20px; border-top-left-radius:4px; padding:18px 24px; box-shadow:0 6px 20px rgba(0,0,0,0.6);">
              <p style="font-size:18px; color:#FFFFFF; line-height:1.45; margin:0;">
                Namaste. Our family has reviewed your son's bio-data docket and Vedic horoscope. We find the family values, education, and philanthropic alignment exceptional. We look forward to meeting at the Taj this Sunday.
              </p>
              <div style="font-size:13px; color:#A89F91; text-align:right; margin-top:6px;">10:14 AM · Read</div>
            </div>

            <!-- Sent Message -->
            <div style="align-self:flex-end; max-width:82%; background:linear-gradient(135deg, #7A1828, #4A0E17); border:1.5px solid #D4AF37; border-radius:20px; border-top-right-radius:4px; padding:18px 24px; box-shadow:0 6px 20px rgba(0,0,0,0.7);">
              <p style="font-size:18px; color:#FFFFFF; line-height:1.45; margin:0;">
                Namaste Singhania family. We are equally delighted. Our senior matchmaker Devika will coordinate the private high-tea arrangements and share the calendar invites.
              </p>
              <div style="font-size:13px; color:#F5E6C8; text-align:right; margin-top:6px;">10:18 AM · Sent ✓✓</div>
            </div>
          </div>

          <!-- Bottom Message Input Bar -->
          <div style="padding:22px 32px; background:rgba(30,8,16,0.98); border-top:1.5px solid rgba(212,175,55,0.3); display:flex; gap:14px; align-items:center;">
            <div style="width:48px; height:48px; border-radius:14px; background:rgba(212,175,55,0.15); border:1.5px solid #D4AF37; display:flex; align-items:center; justify-content:center; font-size:22px; color:#D4AF37;">📎</div>
            <div style="width:48px; height:48px; border-radius:14px; background:rgba(212,175,55,0.15); border:1.5px solid #D4AF37; display:flex; align-items:center; justify-content:center; font-size:22px; color:#D4AF37;">🎙️</div>
            <div style="flex:1; background:rgba(15,4,8,0.8); border:1.5px solid rgba(212,175,55,0.4); padding:14px 20px; border-radius:18px; font-size:18px; color:#E5D5C5;">
              Type a confidential message...
            </div>
            <div style="background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:1.5px solid #D4AF37; padding:14px 28px; border-radius:18px; font-size:18px; font-weight:800; color:#FFFFFF; box-shadow:0 6px 20px rgba(139,29,44,0.6);">
              Send ➤
            </div>
          </div>
        </div>
      </div>
    `
  },

  // ==========================================
  // SCREEN 6: UGC Safety & Instant Moderation
  // ==========================================
  {
    id: '06_ugc_safety_and_block',
    badge: 'UNCOMPROMISING TRUST',
    title: 'UGC Safety & Instant Moderation',
    subtitle: 'Zero tolerance for objectionable content. 24/7 human vetting, instant block, and statutory grievance redressal.',
    innerHtml: `
      <!-- Top Title -->
      <div style="padding: 24px 44px; background:linear-gradient(180deg, #2A0B14 0%, #17040B 100%); border-bottom: 2px solid rgba(212,175,55,0.4); display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-family:'Cinzel', serif; font-size:32px; font-weight:800; color:#FFFFFF;">MEMBER SAFETY & TRUST STANDARDS</div>
          <div style="font-size:17px; color:#D4AF37; font-weight:600; margin-top:2px;">Pursuant to Rule 3(2) of India's IT Rules 2021 & Apple Guideline 1.2</div>
        </div>
        <div style="background:rgba(34,197,94,0.2); border:2px solid #22C55E; color:#86EFAC; padding:10px 22px; border-radius:22px; font-size:17px; font-weight:800;">
          🛡️ 24/7 ACTIVE GUARDIAN
        </div>
      </div>

      <!-- Main Body Split -->
      <div style="flex:1; display:flex; padding:28px 40px; gap:32px; overflow:hidden;">
        <!-- Left Column: In-App Report & Block Modal Simulation -->
        <div style="flex:1; background:linear-gradient(180deg, #2A0B14 0%, #17040B 100%); border:2px solid #D4AF37; border-radius:28px; padding:32px; box-shadow:0 25px 70px rgba(0,0,0,0.9); display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="display:flex; align-items:center; gap:16px;">
              <div style="width:60px; height:60px; border-radius:50%; background:rgba(239,68,68,0.2); border:2px solid #EF4444; display:flex; align-items:center; justify-content:center; font-size:28px;">🚫</div>
              <div>
                <div style="font-family:'Cinzel', serif; font-size:26px; font-weight:800; color:#FFFFFF;">Report or Block Member</div>
                <div style="font-size:15px; color:#D4AF37; font-weight:600; margin-top:2px;">Immediate Sanctuary Enforcement</div>
              </div>
            </div>

            <p style="font-size:17px; color:#D1C2B4; margin-top:16px; line-height:1.45;">
              Mannat maintains zero tolerance for harassment, misrepresentation, or commercial solicitation. Select a reason below for immediate review:
            </p>

            <!-- Radio Options -->
            <div style="display:flex; flex-direction:column; gap:12px; margin-top:16px;">
              <div style="background:rgba(0,0,0,0.45); border:1.5px solid rgba(212,175,55,0.4); padding:14px 18px; border-radius:14px; display:flex; align-items:center; gap:12px; font-size:17px; color:#FFFFFF; font-weight:700;">
                <span style="color:#D4AF37; font-size:20px;">◉</span> Misrepresentation of Lineage / Education
              </div>
              <div style="background:rgba(0,0,0,0.45); border:1.5px solid rgba(212,175,55,0.2); padding:14px 18px; border-radius:14px; display:flex; align-items:center; gap:12px; font-size:17px; color:#D1C2B4;">
                <span style="color:#A89F91; font-size:20px;">○</span> Inappropriate or Unsolicited Communication
              </div>
              <div style="background:rgba(0,0,0,0.45); border:1.5px solid rgba(212,175,55,0.2); padding:14px 18px; border-radius:14px; display:flex; align-items:center; gap:12px; font-size:17px; color:#D1C2B4;">
                <span style="color:#A89F91; font-size:20px;">○</span> Commercial / Broker Solicitation
              </div>
              <div style="background:rgba(0,0,0,0.45); border:1.5px solid rgba(212,175,55,0.2); padding:14px 18px; border-radius:14px; display:flex; align-items:center; gap:12px; font-size:17px; color:#D1C2B4;">
                <span style="color:#A89F91; font-size:20px;">○</span> Photo Privacy / Copyright Infringement
              </div>
            </div>
          </div>

          <!-- Modal Action Buttons -->
          <div style="display:flex; gap:14px; margin-top:20px;">
            <div style="flex:1; background:linear-gradient(135deg, #7F1D1D, #991B1B); border:1.5px solid #EF4444; padding:16px; border-radius:16px; text-align:center; font-size:18px; font-weight:800; color:#FFFFFF; box-shadow:0 8px 24px rgba(127,29,29,0.6);">
              🚫 Instant Block & Purge
            </div>
            <div style="flex:1.2; background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:1.5px solid #D4AF37; padding:16px; border-radius:16px; text-align:center; font-size:18px; font-weight:800; color:#FFFFFF; box-shadow:0 8px 24px rgba(139,29,44,0.6);">
              ⚖️ Escalate to Grievance Officer
            </div>
          </div>
        </div>

        <!-- Right Column: 3 Pillar Safety Architecture Cards -->
        <div style="flex:1; display:flex; flex-direction:column; gap:18px;">
          <div style="flex:1; background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(212,175,55,0.4); border-radius:24px; padding:26px 30px; box-shadow:0 10px 28px rgba(0,0,0,0.7); display:flex; flex-direction:column; justify-content:center;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="font-size:14px; letter-spacing:2px; color:#D4AF37; font-weight:800; text-transform:uppercase;">1. 24/7 Human Matchmaker Oversight</div>
              <span style="font-size:24px;">👁️</span>
            </div>
            <div style="font-size:22px; font-weight:800; color:#FFFFFF; margin-top:4px;">100% Pre-Screened Profiles</div>
            <p style="font-size:16px; color:#D1C2B4; margin-top:4px; line-height:1.45;">Every single biodata, photograph, and document is vetted by human trust officers before admission into the circle.</p>
          </div>

          <div style="flex:1; background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(212,175,55,0.4); border-radius:24px; padding:26px 30px; box-shadow:0 10px 28px rgba(0,0,0,0.7); display:flex; flex-direction:column; justify-content:center;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="font-size:14px; letter-spacing:2px; color:#D4AF37; font-weight:800; text-transform:uppercase;">2. Statutory Grievance Redressal</div>
              <span style="font-size:24px;">⚖️</span>
            </div>
            <div style="font-size:22px; font-weight:800; color:#FFFFFF; margin-top:4px;">Named Grievance Officer & 24h SLA</div>
            <p style="font-size:16px; color:#D1C2B4; margin-top:4px; line-height:1.45;">Direct escalation to Ms. Priya Sharma (Head of Member Safety) with 24-hour formal response & statutory resolution.</p>
          </div>

          <div style="flex:1; background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(212,175,55,0.4); border-radius:24px; padding:26px 30px; box-shadow:0 10px 28px rgba(0,0,0,0.7); display:flex; flex-direction:column; justify-content:center;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="font-size:15px; letter-spacing:2px; color:#D4AF37; font-weight:800; text-transform:uppercase;">3. EULA & Hardware-Level Bans</div>
              <span style="font-size:24px;">🔒</span>
            </div>
            <div style="font-size:22px; font-weight:800; color:#FFFFFF; margin-top:4px;">Permanent Device Ban on Violations</div>
            <p style="font-size:16px; color:#D1C2B4; margin-top:4px; line-height:1.45;">Any verified violation triggers immediate expulsion, forfeiture of membership, and device-level hardware blacklist.</p>
          </div>
        </div>
      </div>
    `
  },

  // ==========================================
  // SCREEN 7: Multi-Vector Aristocratic Trust Score
  // ==========================================
  {
    id: '07_verified_profile_scoring',
    badge: 'ELITE ACCREDITATION',
    title: 'Aristocratic Trust Score',
    subtitle: 'Rigorous multi-vector verification covering identity, education, income, and ancestral lineage.',
    innerHtml: `
      <!-- Top Center Trust Dial Hero -->
      <div style="padding: 22px 44px; background:linear-gradient(180deg, #2A0B14 0%, #17040B 100%); border-bottom: 2px solid rgba(212,175,55,0.4); display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:24px;">
          <div style="width:90px; height:90px; border-radius:50%; background:linear-gradient(135deg, #15803D, #22C55E); border:3px solid #D4AF37; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:0 8px 30px rgba(34,197,94,0.5);">
            <span style="font-family:'Cinzel', serif; font-size:36px; font-weight:800; color:#FFFFFF; line-height:1;">99</span>
            <span style="font-size:12px; font-weight:800; color:#FDE68A;">/ 100</span>
          </div>
          <div>
            <div style="font-family:'Cinzel', serif; font-size:30px; font-weight:800; color:#FFFFFF;">TIER-1 ARISTOCRATIC TRUST SCORE</div>
            <div style="font-size:17px; color:#86EFAC; font-weight:700; margin-top:2px;">✓ Platinum Accredited · All 6 Verification Vectors Cryptographically Validated</div>
          </div>
        </div>
        <div style="background:rgba(212,175,55,0.15); border:2px solid #D4AF37; padding:10px 24px; border-radius:20px; font-size:17px; font-weight:800; color:#F5E6C8;">
          CERTIFICATE #TC-88410
        </div>
      </div>

      <!-- 2x3 Verification Vectors Grid -->
      <div style="flex:1; display:grid; grid-template-columns:1fr 1fr; grid-template-rows:1fr 1fr 1fr; padding:28px 40px; gap:22px; overflow:hidden;">
        <!-- Vector 1 -->
        <div style="background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(34,197,94,0.45); border-radius:22px; padding:22px 24px; display:flex; gap:18px; align-items:center;">
          <div style="width:60px; height:60px; border-radius:16px; background:rgba(34,197,94,0.2); border:2px solid #22C55E; display:flex; align-items:center; justify-content:center; font-size:28px;">🏛️</div>
          <div>
            <div style="font-size:13px; color:#86EFAC; font-weight:800; letter-spacing:2px;">VECTOR 1 · 100% PASS</div>
            <div style="font-size:21px; font-weight:800; color:#FFFFFF; margin-top:2px;">Government DigiLocker & Aadhaar</div>
            <div style="font-size:15px; color:#C4B5A5; margin-top:2px;">Biometric & Passport records verified with UIDAI</div>
          </div>
        </div>

        <!-- Vector 2 -->
        <div style="background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(34,197,94,0.45); border-radius:22px; padding:22px 24px; display:flex; gap:18px; align-items:center;">
          <div style="width:60px; height:60px; border-radius:16px; background:rgba(34,197,94,0.2); border:2px solid #22C55E; display:flex; align-items:center; justify-content:center; font-size:28px;">🎓</div>
          <div>
            <div style="font-size:13px; color:#86EFAC; font-weight:800; letter-spacing:2px;">VECTOR 2 · 100% PASS</div>
            <div style="font-size:21px; font-weight:800; color:#FFFFFF; margin-top:2px;">Ivy League & Premier Degrees</div>
            <div style="font-size:15px; color:#C4B5A5; margin-top:2px;">Official registrar degree verification (MBA / MS / CA)</div>
          </div>
        </div>

        <!-- Vector 3 -->
        <div style="background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(34,197,94,0.45); border-radius:22px; padding:22px 24px; display:flex; gap:18px; align-items:center;">
          <div style="width:60px; height:60px; border-radius:16px; background:rgba(34,197,94,0.2); border:2px solid #22C55E; display:flex; align-items:center; justify-content:center; font-size:28px;">💼</div>
          <div>
            <div style="font-size:13px; color:#86EFAC; font-weight:800; letter-spacing:2px;">VECTOR 3 · 100% PASS</div>
            <div style="font-size:21px; font-weight:800; color:#FFFFFF; margin-top:2px;">Corporate Directorship (MCA)</div>
            <div style="font-size:15px; color:#C4B5A5; margin-top:2px;">DIN numbers & executive standing cross-referenced</div>
          </div>
        </div>

        <!-- Vector 4 -->
        <div style="background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(34,197,94,0.45); border-radius:22px; padding:22px 24px; display:flex; gap:18px; align-items:center;">
          <div style="width:60px; height:60px; border-radius:16px; background:rgba(34,197,94,0.2); border:2px solid #22C55E; display:flex; align-items:center; justify-content:center; font-size:28px;">🔮</div>
          <div>
            <div style="font-size:13px; color:#86EFAC; font-weight:800; letter-spacing:2px;">VECTOR 4 · 100% PASS</div>
            <div style="font-size:21px; font-weight:800; color:#FFFFFF; margin-top:2px;">Vedic Horoscope Authenticity</div>
            <div style="font-size:15px; color:#C4B5A5; margin-top:2px;">Birth time, latitude & astronomical charts calculated</div>
          </div>
        </div>

        <!-- Vector 5 -->
        <div style="background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(34,197,94,0.45); border-radius:22px; padding:22px 24px; display:flex; gap:18px; align-items:center;">
          <div style="width:60px; height:60px; border-radius:16px; background:rgba(34,197,94,0.2); border:2px solid #22C55E; display:flex; align-items:center; justify-content:center; font-size:28px;">👑</div>
          <div>
            <div style="font-size:13px; color:#86EFAC; font-weight:800; letter-spacing:2px;">VECTOR 5 · 100% PASS</div>
            <div style="font-size:21px; font-weight:800; color:#FFFFFF; margin-top:2px;">Family Lineage & Reference Checks</div>
            <div style="font-size:15px; color:#C4B5A5; margin-top:2px;">Confidential community vetting by Senior Matchmaker</div>
          </div>
        </div>

        <!-- Vector 6 -->
        <div style="background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(34,197,94,0.45); border-radius:22px; padding:22px 24px; display:flex; gap:18px; align-items:center;">
          <div style="width:60px; height:60px; border-radius:16px; background:rgba(34,197,94,0.2); border:2px solid #22C55E; display:flex; align-items:center; justify-content:center; font-size:28px;">🤳</div>
          <div>
            <div style="font-size:13px; color:#86EFAC; font-weight:800; letter-spacing:2px;">VECTOR 6 · 100% PASS</div>
            <div style="font-size:21px; font-weight:800; color:#FFFFFF; margin-top:2px;">Biometric AI Liveness Match</div>
            <div style="font-size:15px; color:#C4B5A5; margin-top:2px;">Anti-spoof 3D facial mesh matched to passport photos</div>
          </div>
        </div>
      </div>
    `
  },

  // ==========================================
  // SCREEN 8: Family Collaborative Portal
  // ==========================================
  {
    id: '08_family_share_portal',
    badge: 'FAMILY HARMONY',
    title: 'Collaborative Family Portal',
    subtitle: 'Involve parents and siblings in reviewing alliances with shared voting, notes, and consent.',
    innerHtml: `
      <!-- Top Title -->
      <div style="padding: 20px 44px; background:linear-gradient(180deg, #2A0B14 0%, #17040B 100%); border-bottom: 2px solid rgba(212,175,55,0.4); display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-family:'Cinzel', serif; font-size:30px; font-weight:800; color:#FFFFFF;">FAMILY ALLIANCE CIRCLE</div>
          <div style="font-size:16px; color:#D4AF37; font-weight:600; margin-top:2px;">Singhania Family Shared Review Space · 3 Active Reviewers</div>
        </div>
        <div style="background:rgba(34,197,94,0.2); border:2px solid #22C55E; color:#86EFAC; padding:10px 22px; border-radius:22px; font-size:16px; font-weight:800;">
          ✓ UNANIMOUS CONSENSUS (3/3)
        </div>
      </div>

      <!-- Main Body Split -->
      <div style="flex:1; display:flex; padding:28px 40px; gap:32px; overflow:hidden;">
        <!-- Left: Reviewed Candidate Spotlight -->
        <div style="flex:1; border-radius:28px; overflow:hidden; position:relative; box-shadow:0 30px 80px rgba(0,0,0,0.95); border:2px solid rgba(212,175,55,0.5); display:flex; flex-direction:column; justify-content:flex-end;">
          <img src="${IMG_BRIDE_ROYAL}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center 20%;" />
          <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(15,8,10,0) 0%, rgba(20,5,10,0.25) 35%, rgba(10,2,5,0.98) 80%);"></div>
          
          <div style="position:relative; z-index:2; padding:32px;">
            <div style="display:flex; gap:10px; margin-bottom:10px;">
              <span style="background:rgba(34,197,94,0.3); border:1.5px solid #22C55E; color:#86EFAC; font-size:15px; font-weight:800; padding:5px 14px; border-radius:14px;">✓ ALL FAMILY APPROVED</span>
            </div>
            <div style="font-family:'Cinzel', serif; font-size:40px; font-weight:800; color:#FFFFFF;">Ananya Singhania, 26</div>
            <div style="font-size:21px; color:#D4AF37; font-weight:700; margin-top:2px;">Columbia MBA '22 · Industrialist Lineage</div>
            <div style="font-size:17px; color:#E5D5C5; margin-top:2px;">Vedic Horoscope: 34 / 36 Gunas · South Mumbai</div>
          </div>
        </div>

        <!-- Right: 3 Family Member Voting & Note Cards -->
        <div style="flex:1.1; display:flex; flex-direction:column; gap:16px; justify-content:space-between;">
          <!-- Father Review -->
          <div style="flex:1; background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(212,175,55,0.4); border-radius:22px; padding:22px 26px; box-shadow:0 10px 28px rgba(0,0,0,0.7); display:flex; flex-direction:column; justify-content:center;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="display:flex; align-items:center; gap:12px;">
                <div style="width:46px; height:46px; border-radius:50%; background:#D4AF37; color:#14040A; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:800;">👨‍💼</div>
                <div>
                  <div style="font-size:21px; font-weight:800; color:#FFFFFF;">Father (Rajiv Oberoi)</div>
                  <div style="font-size:14px; color:#D4AF37; font-weight:600;">Chairman, Oberoi Infrastructure</div>
                </div>
              </div>
              <span style="background:rgba(34,197,94,0.25); border:1.5px solid #22C55E; color:#86EFAC; font-size:15px; font-weight:800; padding:5px 12px; border-radius:12px;">✓ APPROVED</span>
            </div>
            <div style="background:rgba(0,0,0,0.4); padding:12px 16px; border-radius:14px; margin-top:10px; font-size:16px; color:#E5D5C5; font-style:italic;">
              "The Singhania family pedigree and corporate governance stature are impeccable. Let us arrange a formal tea."
            </div>
          </div>

          <!-- Mother Review -->
          <div style="flex:1; background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(212,175,55,0.4); border-radius:22px; padding:22px 26px; box-shadow:0 10px 28px rgba(0,0,0,0.7); display:flex; flex-direction:column; justify-content:center;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="display:flex; align-items:center; gap:12px;">
                <div style="width:46px; height:46px; border-radius:50%; background:#D4AF37; color:#14040A; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:800;">👩‍💼</div>
                <div>
                  <div style="font-size:21px; font-weight:800; color:#FFFFFF;">Mother (Kavita Oberoi)</div>
                  <div style="font-size:14px; color:#D4AF37; font-weight:600;">Trustee, Cultural Foundation</div>
                </div>
              </div>
              <span style="background:rgba(34,197,94,0.25); border:1.5px solid #22C55E; color:#86EFAC; font-size:15px; font-weight:800; padding:5px 12px; border-radius:12px;">⭐ RECOMMENDED</span>
            </div>
            <div style="background:rgba(0,0,0,0.4); padding:12px 16px; border-radius:14px; margin-top:10px; font-size:16px; color:#E5D5C5; font-style:italic;">
              "Vedic horoscope matched 34 gunas. Beautiful cultural grounding, artistic values, and philanthropic harmony."
            </div>
          </div>

          <!-- Sister Review -->
          <div style="flex:1; background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(212,175,55,0.4); border-radius:22px; padding:22px 26px; box-shadow:0 10px 28px rgba(0,0,0,0.7); display:flex; flex-direction:column; justify-content:center;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="display:flex; align-items:center; gap:12px;">
                <div style="width:46px; height:46px; border-radius:50%; background:#D4AF37; color:#14040A; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:800;">👩‍🎓</div>
                <div>
                  <div style="font-size:21px; font-weight:800; color:#FFFFFF;">Sister (Rhea Oberoi)</div>
                  <div style="font-size:14px; color:#D4AF37; font-weight:600;">Columbia Alumna '24</div>
                </div>
              </div>
              <span style="background:rgba(34,197,94,0.25); border:1.5px solid #22C55E; color:#86EFAC; font-size:15px; font-weight:800; padding:5px 12px; border-radius:12px;">❤️ LIKED</span>
            </div>
            <div style="background:rgba(0,0,0,0.4); padding:12px 16px; border-radius:14px; margin-top:10px; font-size:16px; color:#E5D5C5; font-style:italic;">
              "Her career ambitions, intellect, and worldview align wonderfully with Advait. Great match!"
            </div>
          </div>

          <!-- Action CTA -->
          <div style="background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:2px solid #D4AF37; padding:18px; border-radius:18px; text-align:center; font-size:20px; font-weight:800; color:#FFFFFF; box-shadow:0 10px 30px rgba(139,29,44,0.7);">
            ✨ Initiate Family Meeting Introduction
          </div>
        </div>
      </div>
    `
  },

  // ==========================================
  // SCREEN 9: Precision Search Filters Matrix
  // ==========================================
  {
    id: '09_precision_search_filters',
    badge: 'PRECISION DISCOVERY',
    title: 'Pedigree Search Matrix',
    subtitle: 'Filter candidates by lineage, educational pedigree, net worth bracket, and astrological parameters.',
    innerHtml: `
      <!-- Top Title -->
      <div style="padding: 20px 44px; background:linear-gradient(180deg, #2A0B14 0%, #17040B 100%); border-bottom: 2px solid rgba(212,175,55,0.4); display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-family:'Cinzel', serif; font-size:30px; font-weight:800; color:#FFFFFF;">ADVANCED PEDIGREE FILTERS</div>
          <div style="font-size:16px; color:#D4AF37; font-weight:600; margin-top:2px;">6 Active Filters Selected · 28 Highly Compatible Profiles Found</div>
        </div>
        <div style="background:rgba(212,175,55,0.15); border:1.5px solid #D4AF37; padding:10px 22px; border-radius:18px; font-size:16px; font-weight:700; color:#F5E6C8;">
          Reset Filters
        </div>
      </div>

      <!-- 2-Column Filter Grid -->
      <div style="flex:1; display:flex; padding:28px 40px; gap:32px; overflow:hidden;">
        <!-- Left Filter Column -->
        <div style="flex:1; display:flex; flex-direction:column; gap:16px; justify-content:space-between;">
          <!-- Section 1: Lineage & Community -->
          <div style="background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(212,175,55,0.4); border-radius:22px; padding:24px 28px; box-shadow:0 10px 28px rgba(0,0,0,0.7);">
            <div style="font-size:15px; letter-spacing:2px; color:#D4AF37; font-weight:800; text-transform:uppercase;">1. Ancestral Pedigree & Community</div>
            <div style="display:flex; flex-wrap:wrap; gap:10px; margin-top:14px;">
              <span style="background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:1.5px solid #D4AF37; color:#FFFFFF; font-size:16px; font-weight:800; padding:6px 16px; border-radius:14px;">✓ Industrialist</span>
              <span style="background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:1.5px solid #D4AF37; color:#FFFFFF; font-size:16px; font-weight:800; padding:6px 16px; border-radius:14px;">✓ Marwari Business</span>
              <span style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#D1C2B4; font-size:16px; padding:6px 16px; border-radius:14px;">Punjabi Royal</span>
              <span style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#D1C2B4; font-size:16px; padding:6px 16px; border-radius:14px;">Brahmin Scholar</span>
              <span style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#D1C2B4; font-size:16px; padding:6px 16px; border-radius:14px;">Parsi Elite</span>
            </div>
          </div>

          <!-- Section 2: Education -->
          <div style="background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(212,175,55,0.4); border-radius:22px; padding:24px 28px; box-shadow:0 10px 28px rgba(0,0,0,0.7);">
            <div style="font-size:15px; letter-spacing:2px; color:#D4AF37; font-weight:800; text-transform:uppercase;">2. Academic Institution Calibre</div>
            <div style="display:flex; flex-wrap:wrap; gap:10px; margin-top:14px;">
              <span style="background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:1.5px solid #D4AF37; color:#FFFFFF; font-size:16px; font-weight:800; padding:6px 16px; border-radius:14px;">✓ Ivy League / Top 20 Global</span>
              <span style="background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:1.5px solid #D4AF37; color:#FFFFFF; font-size:16px; font-weight:800; padding:6px 16px; border-radius:14px;">✓ IIT / IIM / BITS</span>
              <span style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#D1C2B4; font-size:16px; padding:6px 16px; border-radius:14px;">Oxbridge (UK)</span>
              <span style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#D1C2B4; font-size:16px; padding:6px 16px; border-radius:14px;">Medical Specialist</span>
            </div>
          </div>

          <!-- Section 3: Family Turnover -->
          <div style="background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(212,175,55,0.4); border-radius:22px; padding:24px 28px; box-shadow:0 10px 28px rgba(0,0,0,0.7);">
            <div style="font-size:15px; letter-spacing:2px; color:#D4AF37; font-weight:800; text-transform:uppercase;">3. Family Enterprise / Turnover Bracket</div>
            <div style="display:flex; flex-wrap:wrap; gap:10px; margin-top:14px;">
              <span style="background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:1.5px solid #D4AF37; color:#FFFFFF; font-size:16px; font-weight:800; padding:6px 16px; border-radius:14px;">✓ ₹100 Cr+ ($15M+) Annual</span>
              <span style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#D1C2B4; font-size:16px; padding:6px 16px; border-radius:14px;">₹500 Cr+ ($65M+)</span>
              <span style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#D1C2B4; font-size:16px; padding:6px 16px; border-radius:14px;">₹1,000 Cr+ Conglomerate</span>
            </div>
          </div>
        </div>

        <!-- Right Filter Column -->
        <div style="flex:1; display:flex; flex-direction:column; gap:16px; justify-content:space-between;">
          <!-- Section 4: Vedic Horoscope -->
          <div style="background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(212,175,55,0.4); border-radius:22px; padding:24px 28px; box-shadow:0 10px 28px rgba(0,0,0,0.7);">
            <div style="font-size:15px; letter-spacing:2px; color:#D4AF37; font-weight:800; text-transform:uppercase;">4. Vedic Horoscope & Kundli Match</div>
            <div style="display:flex; flex-wrap:wrap; gap:10px; margin-top:14px;">
              <span style="background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:1.5px solid #D4AF37; color:#FFFFFF; font-size:16px; font-weight:800; padding:6px 16px; border-radius:14px;">✓ Minimum 30/36 Gunas</span>
              <span style="background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:1.5px solid #D4AF37; color:#FFFFFF; font-size:16px; font-weight:800; padding:6px 16px; border-radius:14px;">✓ Non-Manglik Only</span>
              <span style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#D1C2B4; font-size:16px; padding:6px 16px; border-radius:14px;">Nadi Dosh Exempt</span>
            </div>
          </div>

          <!-- Section 5: Global Residencies -->
          <div style="background:linear-gradient(135deg, rgba(42,14,24,0.98) 0%, rgba(26,7,16,0.98) 100%); border:2px solid rgba(212,175,55,0.4); border-radius:22px; padding:24px 28px; box-shadow:0 10px 28px rgba(0,0,0,0.7);">
            <div style="font-size:15px; letter-spacing:2px; color:#D4AF37; font-weight:800; text-transform:uppercase;">5. Global Residencies & Cities</div>
            <div style="display:flex; flex-wrap:wrap; gap:10px; margin-top:14px;">
              <span style="background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:1.5px solid #D4AF37; color:#FFFFFF; font-size:16px; font-weight:800; padding:6px 16px; border-radius:14px;">✓ Mumbai (South / BKC)</span>
              <span style="background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:1.5px solid #D4AF37; color:#FFFFFF; font-size:16px; font-weight:800; padding:6px 16px; border-radius:14px;">✓ Delhi NCR (Lutyens/Gurugram)</span>
              <span style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#D1C2B4; font-size:16px; padding:6px 16px; border-radius:14px;">London (UK)</span>
              <span style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#D1C2B4; font-size:16px; padding:6px 16px; border-radius:14px;">New York (USA)</span>
            </div>
          </div>

          <!-- Apply Button -->
          <div style="background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:2px solid #D4AF37; padding:20px; border-radius:20px; text-align:center; font-size:20px; font-weight:800; color:#FFFFFF; box-shadow:0 12px 32px rgba(139,29,44,0.7);">
            ✨ Apply 6 Precision Filters (28 Matches)
          </div>
        </div>
      </div>
    `
  },

  // ==========================================
  // SCREEN 10: VIP Onboarding, Sign In with Apple & Account Control
  // ==========================================
  {
    id: '10_apple_signin_and_privacy',
    badge: 'EXCLUSIVE SANCTUARY',
    title: 'Bespoke VIP Onboarding',
    subtitle: 'Sign in with Apple with private relay, military-grade discretion, and complete account control.',
    innerHtml: `
      <!-- Onboarding Grand Center Card -->
      <div style="flex:1; display:flex; align-items:center; justify-content:center; padding:36px; background:radial-gradient(circle at center, rgba(74,14,23,0.7) 0%, rgba(15,4,8,0.98) 80%);">
        <div style="max-width:940px; width:100%; background:linear-gradient(180deg, #2A0B14 0%, #150309 100%); border:2px solid #D4AF37; border-radius:32px; padding:48px 56px; box-shadow:0 35px 100px rgba(0,0,0,0.95); text-align:center;">
          <!-- Crest -->
          <div style="width:90px; height:90px; border-radius:24px; background:linear-gradient(135deg, #8B1D2C, #4A0E17); border:2.5px solid #D4AF37; margin:0 auto 20px; display:flex; align-items:center; justify-content:center; font-family:'Cinzel', serif; font-weight:800; font-size:46px; color:#D4AF37; box-shadow:0 10px 30px rgba(0,0,0,0.8);">M</div>
          
          <div style="font-family:'Cinzel', serif; font-size:40px; letter-spacing:6px; color:#F5E6C8; font-weight:800;">MANNAT</div>
          <div style="font-size:16px; letter-spacing:4px; color:#D4AF37; font-weight:700; margin-top:4px;">THE ARISTOCRATIC CIRCLE</div>
          
          <p style="font-size:20px; color:#D1C2B4; margin-top:16px; line-height:1.45;">
            An invite-only sanctuary dedicated to high-pedigree matrimonial alliances for distinguished business families and global professionals.
          </p>

          <!-- Action Buttons -->
          <div style="margin-top:28px; display:flex; flex-direction:column; gap:16px;">
            <!-- Sign in with Apple -->
            <div style="background:#FFFFFF; color:#000000; border-radius:20px; padding:20px 28px; font-size:22px; font-weight:700; display:flex; align-items:center; justify-content:center; gap:14px; box-shadow:0 8px 24px rgba(255,255,255,0.15);">
              <svg width="26" height="26" viewBox="0 0 170 170" fill="#000000"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.87-12-14.48-6.09-9.34-10.86-20.15-14.3-32.42-3.44-12.28-5.16-23.77-5.16-34.48 0-14.24 3.59-26.06 10.76-35.46 7.18-9.4 16.29-14.19 27.34-14.37 4.9.11 10.33 1.34 16.3 3.69 5.97 2.36 9.87 3.6 11.68 3.73 2.02-.13 6.08-1.42 12.18-3.87 6.1-2.45 11.38-3.6 15.84-3.46 11.75.64 21.05 4.96 27.91 12.98-9.9 5.97-14.74 14.39-14.53 25.26.22 8.48 3.35 15.65 9.4 21.51 6.05 5.87 13.25 9.24 21.6 10.11-2.13 6.74-4.8 13.2-8.01 19.38zM119.22 33.7c0-7.39 2.66-14.28 7.97-20.67 5.32-6.39 11.79-10.4 19.42-12.03.22 1.3.33 2.5.33 3.59 0 7.39-2.77 14.44-8.31 21.14-5.54 6.7-12.11 10.66-19.72 11.88-.11-1.3-.23-2.61-.39-3.91z"/></svg>
              Sign in with Apple (Private Relay)
            </div>

            <!-- DigiLocker Direct -->
            <div style="background:rgba(212,175,55,0.15); border:2px solid #D4AF37; color:#F5E6C8; border-radius:20px; padding:18px 28px; font-size:20px; font-weight:800; display:flex; align-items:center; justify-content:center; gap:12px;">
              🏛 Instant DigiLocker Government ID Login
            </div>
          </div>

          <!-- Privacy & Account Control Box -->
          <div style="margin-top:28px; padding-top:20px; border-top:1.5px solid rgba(212,175,55,0.3); display:flex; justify-content:space-around; text-align:center;">
            <div>
              <div style="font-size:18px; font-weight:800; color:#86EFAC;">🛡️ 100% Verified</div>
              <div style="font-size:13px; color:#C4B5A5; margin-top:2px;">Zero fake profiles</div>
            </div>
            <div>
              <div style="font-size:18px; font-weight:800; color:#D4AF37;">🔒 BlurShield™</div>
              <div style="font-size:13px; color:#C4B5A5; margin-top:2px;">Discreet photo control</div>
            </div>
            <div>
              <div style="font-size:18px; font-weight:800; color:#FFFFFF;">🗑️ Apple 5.1.1 Compliant</div>
              <div style="font-size:13px; color:#C4B5A5; margin-top:2px;">1-Tap in-app deletion</div>
            </div>
          </div>

          <div style="font-size:13px; color:#8E8276; margin-top:16px; line-height:1.4;">
            By continuing, you agree to our <span style="color:#D4AF37; text-decoration:underline;">Terms of Service (EULA)</span> and <span style="color:#D4AF37; text-decoration:underline;">Privacy Policy</span>.
          </div>
        </div>
      </div>
    `
  }
];

function buildHtml(screen) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${screen.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    body {
      width: 2048px;
      height: 2732px;
      background: #080103;
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      color: #F5E6C8;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 44px 40px 40px;
      overflow: hidden;
      position: relative;
    }

    /* Ambient Luxury Crimson & Gold Glows */
    .ambient-glow {
      position: absolute;
      top: -200px;
      left: 50%;
      transform: translateX(-50%);
      width: 1700px;
      height: 900px;
      background: radial-gradient(circle, rgba(139,29,44,0.45) 0%, rgba(74,14,23,0.2) 50%, rgba(0,0,0,0) 80%);
      pointer-events: none;
      z-index: 0;
    }

    /* Top App Store Header Box */
    .header-box {
      position: relative;
      z-index: 1;
      text-align: center;
      margin-bottom: 24px;
      max-width: 1800px;
    }
    .badge {
      display: inline-block;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 4px;
      color: #D4AF37;
      text-transform: uppercase;
      background: rgba(212,175,55,0.14);
      border: 1.5px solid rgba(212,175,55,0.5);
      padding: 7px 26px;
      border-radius: 28px;
      margin-bottom: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }
    .title {
      font-family: 'Cinzel', Georgia, serif;
      font-size: 64px;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: 1px;
      line-height: 1.15;
      text-shadow: 0 4px 30px rgba(0,0,0,0.9);
      margin-bottom: 6px;
    }
    .subtitle {
      font-size: 26px;
      font-weight: 500;
      color: #D8B486;
      letter-spacing: 0.5px;
      line-height: 1.35;
    }

    /* Native iPad Pro 13" Device Frame */
    .ipad-frame {
      width: 1968px;
      height: 2330px;
      background: #0A0204;
      border-radius: 38px;
      border: 12px solid #221C20;
      box-shadow: 0 45px 150px rgba(0,0,0,0.98), inset 0 0 0 2px rgba(255,255,255,0.12);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }

    /* iPad Status Bar */
    .ipad-status-bar {
      height: 48px;
      padding: 0 44px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(20,4,10,0.98);
      font-size: 20px;
      font-weight: 600;
      color: #E2D9D0;
      border-bottom: 1.5px solid rgba(255,255,255,0.08);
    }

    .ipad-content-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #0E0306;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <div class="ambient-glow"></div>

  <div class="header-box">
    <div class="badge">MANNAT • ${screen.badge}</div>
    <h1 class="title">${screen.title}</h1>
    <p class="subtitle">${screen.subtitle}</p>
  </div>

  <div class="ipad-frame">
    <div class="ipad-status-bar">
      <span>9:41 AM  Tue Sep 16</span>
      <div style="display:flex; gap:16px; align-items:center;">
        <span>5G</span>
        <span>100% 🔋</span>
      </div>
    </div>
    <div class="ipad-content-wrapper">
      ${screen.innerHtml}
    </div>
  </div>
</body>
</html>`;
}

async function run() {
  console.log('Rendering 10 ultra-luxury iPad Pro 13" screenshots (2048 x 2732 px)...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 2048, height: 2732 },
    deviceScaleFactor: 1
  });

  for (let i = 0; i < screens.length; i++) {
    const sc = screens[i];
    const html = buildHtml(sc);
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 600));

    const outPath = path.join(IPAD_DIR, `${sc.id}.png`);
    const artPath = path.join(ARTIFACT_DIR, `${sc.id}.png`);
    await page.screenshot({ path: outPath, type: 'png' });
    await page.screenshot({ path: artPath, type: 'png' });
    console.log(`Rendered iPad Screenshot ${i + 1}/10: ${outPath}`);
  }

  await browser.close();
  console.log('Finished rendering all 10 ultra-luxury iPad screenshots!');
}

run().catch(console.error);
