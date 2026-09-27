import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');

console.log('🚀 Applying AI SEO Agent Recommendations Across Live Pages...');

// =========================================================================
// 1. AGENT 1: APPLY CLICK GAP METADATA OPTIMIZATIONS
// =========================================================================

// 1.1 Marriage Biodata Maker
const biodataMakerDir = path.join(publicDir, 'marriage-biodata-maker');
if (fs.existsSync(biodataMakerDir)) {
  let html = fs.readFileSync(path.join(biodataMakerDir, 'index.html'), 'utf-8');
  html = html.replace(/<title>.*?<\/title>/, '<title>Free Marriage Biodata Maker: Download PDF (No Login) | Mannat</title>');
  html = html.replace(/<meta name="description" content=".*?">/, '<meta name="description" content="Create elegant matrimonial biodatas in 2 minutes. Choose from Royal Gold & Emerald themes, add photo & horoscope, and download instant print-ready PDF free.">');
  html = html.replace(/<meta property="og:title" content=".*?">/, '<meta property="og:title" content="Free Marriage Biodata Maker: Download PDF (No Login) | Mannat">');
  html = html.replace(/<meta property="og:description" content=".*?">/, '<meta property="og:description" content="Create elegant matrimonial biodatas in 2 minutes. Choose from Royal Gold & Emerald themes, add photo & horoscope, and download instant print-ready PDF free.">');
  fs.writeFileSync(path.join(biodataMakerDir, 'index.html'), html, 'utf-8');
  console.log('✅ [Agent 1 Applied]: Optimized Meta Titles & Descriptions for /marriage-biodata-maker');
}

// 1.2 Kundali Matching
const kundaliDir = path.join(publicDir, 'kundali-matching-matrimony');
if (fs.existsSync(kundaliDir)) {
  let html = fs.readFileSync(path.join(kundaliDir, 'index.html'), 'utf-8');
  html = html.replace(/<title>.*?<\/title>/, '<title>Kundali Matching for Marriage: Free 36 Gun Milan Online | Mannat</title>');
  html = html.replace(/<meta name="description" content=".*?">/, '<meta name="description" content="Calculate accurate 36 Gun Milan scores instantly online. Get complete Ashtakoot breakdown (Nadi, Bhakoot, Gana) with Manglik Dosha analysis for free.">');
  html = html.replace(/<meta property="og:title" content=".*?">/, '<meta property="og:title" content="Kundali Matching for Marriage: Free 36 Gun Milan Online | Mannat">');
  html = html.replace(/<meta property="og:description" content=".*?">/, '<meta property="og:description" content="Calculate accurate 36 Gun Milan scores instantly online. Get complete Ashtakoot breakdown (Nadi, Bhakoot, Gana) with Manglik Dosha analysis for free.">');
  fs.writeFileSync(path.join(kundaliDir, 'index.html'), html, 'utf-8');
  console.log('✅ [Agent 1 Applied]: Optimized Meta Titles & Descriptions for /kundali-matching-matrimony');
}

// 1.3 Photo Privacy
const privacyDir = path.join(publicDir, 'photo-privacy-blurshield');
if (fs.existsSync(privacyDir)) {
  let html = fs.readFileSync(path.join(privacyDir, 'index.html'), 'utf-8');
  html = html.replace(/<title>.*?<\/title>/, '<title>Private Matrimony: Blur Photo Protection (BlurShield™) | Mannat</title>');
  html = html.replace(/<meta name="description" content=".*?">/, '<meta name="description" content="Tired of public matrimony sites indexing your photos? BlurShield™ ensures candidate portraits remain blurred until mutual interest is approved. Join free.">');
  html = html.replace(/<meta property="og:title" content=".*?">/, '<meta property="og:title" content="Private Matrimony: Blur Photo Protection (BlurShield™) | Mannat">');
  html = html.replace(/<meta property="og:description" content=".*?">/, '<meta property="og:description" content="Tired of public matrimony sites indexing your photos? BlurShield™ ensures candidate portraits remain blurred until mutual interest is approved. Join free.">');
  fs.writeFileSync(path.join(privacyDir, 'index.html'), html, 'utf-8');
  console.log('✅ [Agent 1 Applied]: Optimized Meta Titles & Descriptions for /photo-privacy-blurshield');
}

// =========================================================================
// 2. AGENT 2: APPLY CONTENT DECAY RECOVERIES
// =========================================================================

// 2.1 Punjabi Matrimony Delhi
const punjabiDelhiDir = path.join(publicDir, 'punjabi-matrimony-delhi');
if (fs.existsSync(punjabiDelhiDir)) {
  let html = fs.readFileSync(path.join(punjabiDelhiDir, 'index.html'), 'utf-8');
  html = html.replace(/<title>.*?<\/title>/, '<title>Verified Punjabi Matrimony Delhi NCR (2026 Directory) | Mannat</title>');
  html = html.replace('</h1>', ' (2026 Verified Directory)</h1>');
  
  const decayRecoveryModule = `
    <!-- 2026 FRESHNESS & DIRECTORY WIDGET -->
    <div style="background: rgba(212,175,55,0.08); border: 1px solid #D4AF37; border-radius: 12px; padding: 24px; margin: 30px auto; max-width: 900px; text-align: left;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
        <span style="font-size: 12px; font-weight: 700; color: #D4AF37; text-transform: uppercase; letter-spacing: 1px;">⚡ 2026 Active Delhi NCR Punjabi Circles</span>
        <span style="font-size: 11px; padding: 4px 10px; background: rgba(27,77,62,0.6); border: 1px solid #2E7D32; border-radius: 9999px; color: #81C784;">Updated Weekly</span>
      </div>
      <p style="font-size: 14px; color: #E2E8F0; margin-bottom: 16px;">Curated profiles verified across South Delhi (GK, Vasant Vihar, Defence Colony), West Delhi (Punjabi Bagh, Rajouri Garden), and Gurgaon Golf Course Road.</p>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <a href="/punjabi-matrimony" style="padding: 6px 14px; background: rgba(7,9,14,0.8); border: 1px solid rgba(212,175,55,0.3); border-radius: 9999px; font-size: 12px; color: #F3E5AB;">Arora Khatri Delhi</a>
        <a href="/sikh-matrimony" style="padding: 6px 14px; background: rgba(7,9,14,0.8); border: 1px solid rgba(212,175,55,0.3); border-radius: 9999px; font-size: 12px; color: #F3E5AB;">Gursikh Delhi NCR</a>
        <a href="https://wa.me/919738397933?text=Hi%20Mannat,%20I%20am%20looking%20for%20Delhi%20Punjabi%20Matchmaking" target="_blank" style="padding: 6px 14px; background: #25D366; color: #000; border-radius: 9999px; font-size: 12px; font-weight: 700; text-decoration: none;">💬 WhatsApp Delhi Concierge</a>
      </div>
    </div>
  `;
  html = html.replace('<main class="container">', '<main class="container">\n' + decayRecoveryModule);
  fs.writeFileSync(path.join(punjabiDelhiDir, 'index.html'), html, 'utf-8');
  console.log('✅ [Agent 2 Applied]: Injected Freshness & WhatsApp Recovery Module into /punjabi-matrimony-delhi');
}

// 2.2 Doctors Matrimony Delhi
const doctorsDelhiDir = path.join(publicDir, 'doctors-matrimony-delhi');
if (fs.existsSync(doctorsDelhiDir)) {
  let html = fs.readFileSync(path.join(doctorsDelhiDir, 'index.html'), 'utf-8');
  html = html.replace(/<title>.*?<\/title>/, '<title>Doctor Matrimony Delhi NCR (AIIMS, MAMC & Medanta) | Mannat</title>');
  
  const medicalSpecialtyModule = `
    <!-- MEDICAL SPECIALTY MODULE -->
    <div style="background: rgba(212,175,55,0.08); border: 1px solid #D4AF37; border-radius: 12px; padding: 24px; margin: 30px auto; max-width: 900px; text-align: left;">
      <h3 style="font-family: 'Cinzel', serif; font-size: 18px; color: #D4AF37; margin-bottom: 12px;">🩺 Delhi NCR Medical Specialty &amp; Hospital Circles</h3>
      <p style="font-size: 14px; color: #E2E8F0; margin-bottom: 16px;">Verified matchmaking for MBBS, MD, MS, DM, and MCh doctors affiliated with AIIMS Delhi, Maulana Azad Medical College (MAMC), Medanta Medicity, Max Healthcare, and Apollo Hospitals.</p>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <a href="/matrimony-for-doctors" style="padding: 6px 14px; background: rgba(7,9,14,0.8); border: 1px solid rgba(212,175,55,0.3); border-radius: 9999px; font-size: 12px; color: #F3E5AB;">Cardiology &amp; Surgery</a>
        <a href="/marriage-biodata-for-doctors-format-example" style="padding: 6px 14px; background: rgba(7,9,14,0.8); border: 1px solid rgba(212,175,55,0.3); border-radius: 9999px; font-size: 12px; color: #F3E5AB;">Doctor Biodata Format</a>
      </div>
    </div>
  `;
  html = html.replace('<main class="container">', '<main class="container">\n' + medicalSpecialtyModule);
  fs.writeFileSync(path.join(doctorsDelhiDir, 'index.html'), html, 'utf-8');
  console.log('✅ [Agent 2 Applied]: Injected Medical Specialty Module into /doctors-matrimony-delhi');
}

// =========================================================================
// 3. AGENT 3B: APPLY COMPETITOR SEMANTIC DEPTH GAP BLUEPRINTS
// =========================================================================

// 3.1 NRI Matrimony Depth Expansion
const nriMatrimonyDir = path.join(publicDir, 'nri-matrimony');
if (fs.existsSync(nriMatrimonyDir)) {
  let html = fs.readFileSync(path.join(nriMatrimonyDir, 'index.html'), 'utf-8');
  
  const nriSemanticExpansion = `
    <!-- AGENT 3B SEMANTIC EXPANSION: NRI VISA & COUNTRY CATEGORIES -->
    <section style="padding: 60px 0; border-top: 1px solid rgba(212,175,55,0.2);">
      <div class="container" style="max-width: 900px; text-align: left;">
        <h2 style="font-family: 'Cinzel', serif; font-size: 26px; color: #D4AF37; margin-bottom: 16px;">NRI Matrimony by Country &amp; Immigration Status (USA, UK, Canada, UAE)</h2>
        <p style="color: #CBD5E1; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
          Mannat's international matrimonial desk provides verified candidate matching across premier global metropolitan corridors. We categorize and verify legal immigration status, employer pedigree, and educational equivalence.
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-bottom: 30px;">
          <div style="background: rgba(18,24,38,0.7); border: 1px solid rgba(212,175,55,0.2); border-radius: 12px; padding: 20px;">
            <h4 style="color: #FFF; font-size: 16px; margin-bottom: 8px;">🇺🇸 USA (H-1B, Green Card, Citizens)</h4>
            <p style="color: #94A3B8; font-size: 13px;">Silicon Valley Tech Leads (FAANG), Wall Street Investment Bankers, and USMLE Residency Physicians across California, NYC, Seattle, and Dallas.</p>
          </div>
          <div style="background: rgba(18,24,38,0.7); border: 1px solid rgba(212,175,55,0.2); border-radius: 12px; padding: 20px;">
            <h4 style="color: #FFF; font-size: 16px; margin-bottom: 8px;">🇬🇧 UK (Skilled Worker &amp; ILR)</h4>
            <p style="color: #94A3B8; font-size: 13px;">NHS Hospital Consultants, Canary Wharf Finance Directors, and Entrepreneurs across London, Birmingham, and Manchester.</p>
          </div>
          <div style="background: rgba(18,24,38,0.7); border: 1px solid rgba(212,175,55,0.2); border-radius: 12px; padding: 20px;">
            <h4 style="color: #FFF; font-size: 16px; margin-bottom: 8px;">🇨🇦 Canada (Express Entry PR)</h4>
            <p style="color: #94A3B8; font-size: 13px;">Permanent Residents and Citizens in Toronto (GTA), Vancouver, and Calgary working in tech, banking, and professional services.</p>
          </div>
          <div style="background: rgba(18,24,38,0.7); border: 1px solid rgba(212,175,55,0.2); border-radius: 12px; padding: 20px;">
            <h4 style="color: #FFF; font-size: 16px; margin-bottom: 8px;">🇦🇪 Dubai &amp; GCC (Golden Visa)</h4>
            <p style="color: #94A3B8; font-size: 13px;">Prominent business families, senior corporate directors, and UAE 10-Year Golden Visa holders in Dubai and Abu Dhabi.</p>
          </div>
        </div>

        <h3 style="font-family: 'Cinzel', serif; font-size: 20px; color: #FFF; margin-bottom: 12px;">Essential Verification Protocol for Global NRI Alliances</h3>
        <p style="color: #CBD5E1; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
          Every registered NRI candidate profile undergoes multi-point background checks: Form I-797 / PR visa document authentication, degree verification from accredited international universities (Stanford, MIT, Harvard, Imperial College London, University of Toronto), and corporate registry validation.
        </p>
      </div>
    </section>
  `;
  html = html.replace('<!-- THREE PILLARS -->', nriSemanticExpansion + '\n  <!-- THREE PILLARS -->');
  fs.writeFileSync(path.join(nriMatrimonyDir, 'index.html'), html, 'utf-8');
  console.log('✅ [Agent 3B Applied]: Injected Semantic Depth Expansion into /nri-matrimony');
}

// 3.2 IIT & IIM Matrimony Depth Expansion
const iitMatrimonyDir = path.join(publicDir, 'iit-iim-matrimony');
if (fs.existsSync(iitMatrimonyDir)) {
  let html = fs.readFileSync(path.join(iitMatrimonyDir, 'index.html'), 'utf-8');
  
  const iitSemanticExpansion = `
    <!-- AGENT 3B SEMANTIC EXPANSION: PREMIER ALUMNI TIERS -->
    <section style="padding: 60px 0; border-top: 1px solid rgba(212,175,55,0.2);">
      <div class="container" style="max-width: 900px; text-align: left;">
        <h2 style="font-family: 'Cinzel', serif; font-size: 26px; color: #D4AF37; margin-bottom: 16px;">Premier Institute Circles: IIT, IIM, BITS Pilani, ISB &amp; Ivy League</h2>
        <p style="color: #CBD5E1; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
          Where intellectual curiosity meets family heritage. Mannat caters to accomplished alumni seeking an equal life partner with shared career ambition, analytical depth, and mutual values.
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-bottom: 30px;">
          <div style="background: rgba(18,24,38,0.7); border: 1px solid rgba(212,175,55,0.2); border-radius: 12px; padding: 20px;">
            <h4 style="color: #FFF; font-size: 16px; margin-bottom: 8px;">🎓 Premier Engineering Alma Maters</h4>
            <p style="color: #94A3B8; font-size: 13px;">IIT Bombay, IIT Delhi, IIT Madras, IIT Kanpur, IIT Kharagpur, and BITS Pilani alumni working in top AI labs, deep tech startups, and quantitative hedge funds.</p>
          </div>
          <div style="background: rgba(18,24,38,0.7); border: 1px solid rgba(212,175,55,0.2); border-radius: 12px; padding: 20px;">
            <h4 style="color: #FFF; font-size: 16px; margin-bottom: 8px;">🏛️ Top Tier Management &amp; Consulting</h4>
            <p style="color: #94A3B8; font-size: 13px;">IIM Ahmedabad, IIM Bangalore, IIM Calcutta, ISB Hyderabad, McKinsey, BCG, Bain partners, and Private Equity directors.</p>
          </div>
        </div>

        <h3 style="font-family: 'Cinzel', serif; font-size: 20px; color: #FFF; margin-bottom: 12px;">Career &amp; Lifestyle Harmony for Ambitious Couples</h3>
        <p style="color: #CBD5E1; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
          Connecting partners who understand fast-paced corporate growth, startup building, and egalitarian home lives. All alumni credentials verified via official alumni domains and degree certificates.
        </p>
      </div>
    </section>
  `;
  html = html.replace('<!-- THREE PILLARS -->', iitSemanticExpansion + '\n  <!-- THREE PILLARS -->');
  fs.writeFileSync(path.join(iitMatrimonyDir, 'index.html'), html, 'utf-8');
  console.log('✅ [Agent 3B Applied]: Injected Semantic Depth Expansion into /iit-iim-matrimony');
}

console.log('🎉 All AI SEO Agent Recommendations Applied Successfully!');
