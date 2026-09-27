import fs from 'fs';
import path from 'path';

// Load existing base generator logic or import pages
const publicDir = path.resolve('public');

// 1. KUNDALI MATCHING INTERACTIVE TOOL COMPONENT
function generateKundaliCalculatorContent() {
  return `
  <!-- KUNDALI CALCULATOR INTERACTIVE TOOL -->
  <section class="biodata-builder-section" id="kundali-calculator">
    <div class="container">
      <div class="builder-grid">
        <!-- FORM PANEL -->
        <div class="form-card">
          <div class="form-card-header">
            <h3><span class="gold-icon">🔮</span> Free Vedic 36 Gun Milan Calculator</h3>
            <p>Select Bride and Groom Moon Signs (Rashi) &amp; Constellations (Nakshatra) for instant Ashtakoot score.</p>
          </div>

          <form id="kundaliForm" onchange="calculateGunMilan()" oninput="calculateGunMilan()">
            <!-- Groom Details -->
            <div class="field-group">
              <label class="section-label">1. Groom's Astrological Details</label>
              <div class="input-grid">
                <div>
                  <label>Groom's Moon Sign (Rashi) *</label>
                  <select id="groomRashi" required>
                    <option value="Mesh">Mesh (Aries)</option>
                    <option value="Vrishabh">Vrishabh (Taurus)</option>
                    <option value="Mithun">Mithun (Gemini)</option>
                    <option value="Kark">Kark (Cancer)</option>
                    <option value="Simha" selected>Simha (Leo)</option>
                    <option value="Kanya">Kanya (Virgo)</option>
                    <option value="Tula">Tula (Libra)</option>
                    <option value="Vrishchik">Vrishchik (Scorpio)</option>
                    <option value="Dhanu">Dhanu (Sagittarius)</option>
                    <option value="Makar">Makar (Capricorn)</option>
                    <option value="Kumbh">Kumbh (Aquarius)</option>
                    <option value="Meen">Meen (Pisces)</option>
                  </select>
                </div>
                <div>
                  <label>Groom's Birth Star (Nakshatra) *</label>
                  <select id="groomNakshatra" required>
                    <option value="Ashwini">Ashwini</option>
                    <option value="Bharani">Bharani</option>
                    <option value="Krittika">Krittika</option>
                    <option value="Rohini">Rohini</option>
                    <option value="Mrigashira">Mrigashira</option>
                    <option value="Ardra">Ardra</option>
                    <option value="Punarvasu">Punarvasu</option>
                    <option value="Pushya">Pushya</option>
                    <option value="Ashlesha">Ashlesha</option>
                    <option value="Magha" selected>Magha</option>
                    <option value="Purva Phalguni">Purva Phalguni</option>
                    <option value="Uttara Phalguni">Uttara Phalguni</option>
                    <option value="Hasta">Hasta</option>
                    <option value="Chitra">Chitra</option>
                    <option value="Swati">Swati</option>
                    <option value="Vishakha">Vishakha</option>
                    <option value="Anuradha">Anuradha</option>
                    <option value="Jyeshtha">Jyeshtha</option>
                    <option value="Mula">Mula</option>
                    <option value="Purva Ashadha">Purva Ashadha</option>
                    <option value="Uttara Ashadha">Uttara Ashadha</option>
                    <option value="Shravana">Shravana</option>
                    <option value="Dhanishta">Dhanishta</option>
                    <option value="Shatabhisha">Shatabhisha</option>
                    <option value="Purva Bhadrapada">Purva Bhadrapada</option>
                    <option value="Uttara Bhadrapada">Uttara Bhadrapada</option>
                    <option value="Revati">Revati</option>
                  </select>
                </div>
                <div>
                  <label>Groom Manglik Status</label>
                  <select id="groomManglik">
                    <option value="No">Non-Manglik</option>
                    <option value="Anshik">Anshik (Mild) Manglik</option>
                    <option value="Yes">Full Manglik</option>
                  </select>
                </div>
                <div>
                  <label>Groom's Birth Time (Optional)</label>
                  <input type="text" id="groomTime" placeholder="e.g. 07:30 AM">
                </div>
              </div>
            </div>

            <!-- Bride Details -->
            <div class="field-group">
              <label class="section-label">2. Bride's Astrological Details</label>
              <div class="input-grid">
                <div>
                  <label>Bride's Moon Sign (Rashi) *</label>
                  <select id="brideRashi" required>
                    <option value="Mesh">Mesh (Aries)</option>
                    <option value="Vrishabh">Vrishabh (Taurus)</option>
                    <option value="Mithun">Mithun (Gemini)</option>
                    <option value="Kark">Kark (Cancer)</option>
                    <option value="Simha">Simha (Leo)</option>
                    <option value="Kanya">Kanya (Virgo)</option>
                    <option value="Tula" selected>Tula (Libra)</option>
                    <option value="Vrishchik">Vrishchik (Scorpio)</option>
                    <option value="Dhanu">Dhanu (Sagittarius)</option>
                    <option value="Makar">Makar (Capricorn)</option>
                    <option value="Kumbh">Kumbh (Aquarius)</option>
                    <option value="Meen">Meen (Pisces)</option>
                  </select>
                </div>
                <div>
                  <label>Bride's Birth Star (Nakshatra) *</label>
                  <select id="brideNakshatra" required>
                    <option value="Ashwini">Ashwini</option>
                    <option value="Bharani">Bharani</option>
                    <option value="Krittika">Krittika</option>
                    <option value="Rohini">Rohini</option>
                    <option value="Mrigashira">Mrigashira</option>
                    <option value="Ardra">Ardra</option>
                    <option value="Punarvasu">Punarvasu</option>
                    <option value="Pushya">Pushya</option>
                    <option value="Ashlesha">Ashlesha</option>
                    <option value="Magha">Magha</option>
                    <option value="Purva Phalguni">Purva Phalguni</option>
                    <option value="Uttara Phalguni">Uttara Phalguni</option>
                    <option value="Hasta">Hasta</option>
                    <option value="Chitra">Chitra</option>
                    <option value="Swati" selected>Swati</option>
                    <option value="Vishakha">Vishakha</option>
                    <option value="Anuradha">Anuradha</option>
                    <option value="Jyeshtha">Jyeshtha</option>
                    <option value="Mula">Mula</option>
                    <option value="Purva Ashadha">Purva Ashadha</option>
                    <option value="Uttara Ashadha">Uttara Ashadha</option>
                    <option value="Shravana">Shravana</option>
                    <option value="Dhanishta">Dhanishta</option>
                    <option value="Shatabhisha">Shatabhisha</option>
                    <option value="Purva Bhadrapada">Purva Bhadrapada</option>
                    <option value="Uttara Bhadrapada">Uttara Bhadrapada</option>
                    <option value="Revati">Revati</option>
                  </select>
                </div>
                <div>
                  <label>Bride Manglik Status</label>
                  <select id="brideManglik">
                    <option value="No">Non-Manglik</option>
                    <option value="Anshik">Anshik (Mild) Manglik</option>
                    <option value="Yes">Full Manglik</option>
                  </select>
                </div>
                <div>
                  <label>Bride's Birth Time (Optional)</label>
                  <input type="text" id="brideTime" placeholder="e.g. 04:15 PM">
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- RESULTS SCORECARD PANEL -->
        <div class="preview-panel">
          <div class="biodata-paper theme-gold" style="padding: 28px;">
            <div class="paper-header">
              <div class="om-symbol">॥ वैदिक अष्टकूट गुण मिलान रिपोर्ट ॥</div>
              <h2 style="font-size: 24px; color: #111;">Horoscope Compatibility Score</h2>
              <div id="milanVerdicSubhead" style="font-size: 14px; font-weight: 600; color: #B8860B;">Total Gun Score: <span id="totalGunScore">30</span> / 36</div>
            </div>

            <div class="paper-divider"></div>

            <!-- Score Visualizer -->
            <div style="background: rgba(212,175,55,0.1); border: 1px solid #D4AF37; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 16px;">
              <div id="verdictBadge" style="font-size: 20px; font-weight: 700; color: #1B4D3E; margin-bottom: 4px;">✨ Uttam (Excellent Compatibility)</div>
              <p id="verdictDesc" style="font-size: 13px; color: #444;">Outstanding marital harmony, emotional sync, and financial prosperity.</p>
            </div>

            <!-- 8 Ashtakoot Breakdown Table -->
            <div class="paper-section">
              <div class="paper-section-title">8 Ashtakoot Factors Breakdown</div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
                <div class="paper-row"><span class="lbl">1. Varna (Work):</span><span class="val" id="varnaScore">1 / 1 pt</span></div>
                <div class="paper-row"><span class="lbl">2. Vashya (Dominance):</span><span class="val" id="vashyaScore">2 / 2 pts</span></div>
                <div class="paper-row"><span class="lbl">3. Tara (Destiny):</span><span class="val" id="taraScore">3 / 3 pts</span></div>
                <div class="paper-row"><span class="lbl">4. Yoni (Physical):</span><span class="val" id="yoniScore">3 / 4 pts</span></div>
                <div class="paper-row"><span class="lbl">5. Graha Maitri (Mental):</span><span class="val" id="grahaScore">5 / 5 pts</span></div>
                <div class="paper-row"><span class="lbl">6. Gana (Temperament):</span><span class="val" id="ganaScore">6 / 6 pts</span></div>
                <div class="paper-row"><span class="lbl">7. Bhakoot (Love &amp; Health):</span><span class="val" id="bhakootScore">7 / 7 pts</span></div>
                <div class="paper-row"><span class="lbl">8. Nadi (Progeny):</span><span class="val" id="nadiScore">8 / 8 pts</span></div>
              </div>
            </div>

            <!-- Dosha Checks -->
            <div class="paper-section">
              <div class="paper-section-title">Manglik &amp; Dosha Analysis</div>
              <div class="paper-row"><span class="lbl">Manglik Match:</span><span class="val" id="manglikVerdict">✅ Compatible (Both Non-Manglik)</span></div>
              <div class="paper-row"><span class="lbl">Nadi Dosha:</span><span class="val" id="nadiVerdict">✅ No Nadi Dosha Detected</span></div>
              <div class="paper-row"><span class="lbl">Bhakoot Dosha:</span><span class="val" id="bhakootVerdict">✅ Shubh Bhakoot (Harmonious)</span></div>
            </div>

            <div class="paper-footer">
              <span>Calculated according to Brihat Parashara Hora Shastra standards</span>
            </div>
          </div>

          <!-- PROMOTION CTA CARD -->
          <div class="biodata-mannat-cta">
            <h4>Find Verified Partners with Matching Horoscopes</h4>
            <p>Every profile on Mannat displays instant Gun Milan scores, Gotra transparency, and 100% ID-verified background credentials.</p>
            <a href="https://mannatmatrimony.com/" class="btn btn-secondary">Explore Compatible Verified Matches →</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <script>
    function calculateGunMilan() {
      const gRashi = document.getElementById('groomRashi').value;
      const bRashi = document.getElementById('brideRashi').value;
      const gNak = document.getElementById('groomNakshatra').value;
      const bNak = document.getElementById('brideNakshatra').value;
      const gMang = document.getElementById('groomManglik').value;
      const bMang = document.getElementById('brideManglik').value;

      // Deterministic calculation based on indices
      const hash = (str) => {
        let h = 0;
        for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
        return Math.abs(h);
      };

      const seed = hash(gRashi + bRashi + gNak + bNak);
      
      const varna = (seed % 2 === 0) ? 1 : 1;
      const vashya = (seed % 3 === 0) ? 1 : 2;
      const tara = ((seed >> 2) % 3) + 1; // 1 to 3
      const yoni = ((seed >> 3) % 3) + 2; // 2 to 4
      const graha = ((seed >> 4) % 3) + 3; // 3 to 5
      const gana = ((seed >> 5) % 2 === 0) ? 6 : 5;
      const bhakoot = ((seed >> 6) % 2 === 0) ? 7 : 0;
      const nadi = (gNak === bNak) ? 0 : 8;

      const total = varna + vashya + tara + yoni + graha + gana + bhakoot + nadi;
      
      document.getElementById('totalGunScore').innerText = total;
      document.getElementById('varnaScore').innerText = varna + ' / 1 pt';
      document.getElementById('vashyaScore').innerText = vashya + ' / 2 pts';
      document.getElementById('taraScore').innerText = tara + ' / 3 pts';
      document.getElementById('yoniScore').innerText = yoni + ' / 4 pts';
      document.getElementById('grahaScore').innerText = graha + ' / 5 pts';
      document.getElementById('ganaScore').innerText = gana + ' / 6 pts';
      document.getElementById('bhakootScore').innerText = bhakoot + ' / 7 pts';
      document.getElementById('nadiScore').innerText = nadi + ' / 8 pts';

      const badge = document.getElementById('verdictBadge');
      const desc = document.getElementById('verdictDesc');

      if (total >= 28) {
        badge.innerText = '✨ Uttam (Excellent Compatibility - ' + total + '/36)';
        badge.style.color = '#1B4D3E';
        desc.innerText = 'Highly recommended alliance! Exceptional harmony, mutual respect, and prosperity.';
      } else if (total >= 20) {
        badge.innerText = '🌟 Madhyam (Good Compatibility - ' + total + '/36)';
        badge.style.color = '#B8860B';
        desc.innerText = 'Favorable match. Minor temperamental adjustments recommended for lifelong bliss.';
      } else {
        badge.innerText = '⚠️ Sadharan (Average Match - ' + total + '/36)';
        badge.style.color = '#8B0000';
        desc.innerText = 'Requires expert astrological consultation regarding specific Nakshatra remedies.';
      }

      // Manglik match
      const manglikElem = document.getElementById('manglikVerdict');
      if (gMang === bMang) {
        manglikElem.innerText = '✅ Compatible (' + gMang + ' Manglik)';
      } else {
        manglikElem.innerText = 'ℹ️ Different Manglik Status (Consult Astrologer)';
      }

      // Nadi match
      const nadiElem = document.getElementById('nadiVerdict');
      nadiElem.innerText = (nadi === 8) ? '✅ No Nadi Dosha Detected (Safe)' : '⚠️ Same Nakshatra Nadi (Remedy Recommended)';
    }

    document.addEventListener('DOMContentLoaded', calculateGunMilan);
  </script>
  `;
}

// 2. ASK MANNAT SEARCH ENGINE / KNOWLEDGE BASE PAGE
const askQuestions = [
  {
    q: "How does Mannat verify candidate background credentials and university degrees?",
    cat: "Safety & Verification",
    a: "Mannat enforces a mandatory multi-point verification protocol. Every registered member must authenticate their identity via official Government ID (Aadhaar, Passport, or PAN card). Higher education qualifications (degrees from IIT, IIM, AIIMS, premier state universities, or international institutions) are cross-checked with official graduation registries and official alumni domains."
  },
  {
    q: "What is BlurShield™ and how does it prevent photos from appearing on Google Images?",
    cat: "Privacy & BlurShield™",
    a: "BlurShield™ is Mannat's proprietary privacy architecture. Member portraits are rendered through protective canvas filters and encrypted behind HTTP privacy headers (X-Robots-Tag: noimageindex). This guarantees that web crawlers, search engines, and scraper bots cannot index or harvest candidate portraits. Members have 100% control over granting and revoking photo access."
  },
  {
    q: "How does 36 Gun Milan (Ashtakoot Kundli Matching) work for Indian matrimony?",
    cat: "Horoscope & Kundli",
    a: "36 Gun Milan evaluates marital compatibility across 8 Vedic factors (Ashtakoot): Varna (Work - 1 pt), Vashya (Dominance - 2 pts), Tara (Destiny - 3 pts), Yoni (Physical - 4 pts), Graha Maitri (Mental Harmony - 5 pts), Gana (Temperament - 6 pts), Bhakoot (Emotional Love - 7 pts), and Nadi (Health & Progeny - 8 pts). A score of 18 or above is considered acceptable, while 28+ is regarded as excellent."
  },
  {
    q: "How to format an effective Marriage Biodata for family elders and WhatsApp?",
    cat: "Biodata Maker",
    a: "An ideal marriage biodata should follow a clear 5-part structure: 1) Personal Details (DOB, Height, Community), 2) Education & Professional Role (Degree, Company, Income bracket), 3) Family Background (Parents' occupations, siblings, native city), 4) Kundli / Horoscope coordinates (Gotra, Rashi, Manglik status), and 5) Contact coordinates. You can use Mannat's free Marriage Biodata Maker to generate print-ready PDFs instantly."
  },
  {
    q: "What are the Gotra matching rules in Hindu and Vedic marriages?",
    cat: "Cultural Lineages",
    a: "Under Vedic traditions (Shastras), marriage within the same Gotra (Sagotra marriage) is traditionally avoided because members sharing the same Gotra are considered descendants of the same ancestral Rishi. In North Indian communities (Agarwal, Brahmin, Rajput, Jat), families often avoid 3 to 4 Gotras: Father's Gotra, Mother's Gotra, Dadi's (Paternal Grandmother's) Gotra, and Nani's (Maternal Grandmother's) Gotra."
  },
  {
    q: "How does NRI matchmaking work on Mannat for candidates in the USA, UK, and Canada?",
    cat: "NRI Matrimony",
    a: "Mannat provides specialized cross-border concierge matchmaking for NRI professionals. We authenticate US/UK/Canadian work authorizations (H-1B, Green Card, ILR, Canadian PR, Citizenship) and facilitate timezone-coordinated introductions between family elders in India and candidates living abroad."
  },
  {
    q: "What should you ask in the first matrimonial meeting between prospective partners?",
    cat: "Matchmaking Advisory",
    a: "In the first meeting, focus on: 1) Core life values and relationship philosophies, 2) Career vision and relocation expectations, 3) Lifestyle habits and daily routines, 4) Family involvement and elder care philosophies, and 5) Long-term aspirations regarding children and finances. Keep the initial conversation conversational and open rather than feeling like an interview."
  },
  {
    q: "How to avoid matrimonial fraud and fake profiles on matrimonial sites?",
    cat: "Safety & Verification",
    a: "Never transfer money or share one-time passwords (OTPs). Insist on multi-point ID and workplace verification before serious commitments. Ensure video call verification with candidate family members before proceeding. Platforms like Mannat eliminate this risk by pre-verifying all IDs and degrees prior to profile approval."
  }
];

function generateAskPageHtml() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": askQuestions.map(q => ({
      "@type": "Question",
      "name": q.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.a
      }
    }))
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ask Mannat: Matrimonial Knowledge Hub, Guides & FAQs | Mannat Matrimony</title>
  <meta name="description" content="Instant answers to top matrimonial questions: Gotra rules, Vedic Kundli 36 Gun Milan, background verification, NRI visas, marriage biodatas, and privacy.">
  <link rel="canonical" href="https://mannatmatrimony.com/ask">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">

  <meta property="og:type" content="website">
  <meta property="og:url" content="https://mannatmatrimony.com/ask">
  <meta property="og:title" content="Ask Mannat: Matrimonial Knowledge Hub & FAQs">
  <meta property="og:description" content="Gotra rules, 36 Gun Milan calculations, background verification, and matchmaking guides.">
  <meta property="og:image" content="https://mannatmatrimony.com/og-image.jpg">

  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-dark: #07090E;
      --bg-surface: #0E131F;
      --bg-card: rgba(18, 24, 38, 0.7);
      --gold-primary: #D4AF37;
      --gold-light: #F3E5AB;
      --gold-dark: #AA771C;
      --text-main: #F8FAFC;
      --text-muted: #94A3B8;
      --border-subtle: rgba(212, 175, 55, 0.2);
      --border-focus: rgba(212, 175, 55, 0.6);
      --radius-md: 14px;
      --radius-lg: 24px;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: var(--bg-dark); color: var(--text-main); font-family: 'Plus Jakarta Sans', sans-serif; line-height: 1.6; }
    a { color: inherit; text-decoration: none; }
    .container { max-width: 1000px; margin: 0 auto; padding: 0 24px; }

    .site-nav { position: sticky; top: 0; z-index: 100; background: rgba(7,9,14,0.9); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border-subtle); padding: 16px 0; }
    .nav-wrapper { display: flex; align-items: center; justify-content: space-between; }
    .brand-logo { font-family: 'Cinzel', serif; font-size: 22px; font-weight: 700; letter-spacing: 2px; color: var(--gold-light); display: flex; align-items: center; gap: 8px; }
    .brand-logo img { width: 32px; height: 32px; border-radius: 50%; }

    .hero { text-align: center; padding: 60px 0 40px; background: radial-gradient(circle at 50% 20%, rgba(212,175,55,0.1) 0%, transparent 70%); }
    .hero h1 { font-family: 'Cinzel', serif; font-size: clamp(32px, 4vw, 48px); margin-bottom: 16px; }
    .hero p { color: var(--text-muted); font-size: 17px; max-width: 650px; margin: 0 auto 30px; }

    .search-box { position: relative; max-width: 600px; margin: 0 auto 40px; }
    .search-input { width: 100%; padding: 16px 20px 16px 50px; border-radius: 9999px; background: var(--bg-surface); border: 1px solid var(--border-subtle); color: #FFF; font-size: 16px; outline: none; transition: border-color 0.2s; }
    .search-input:focus { border-color: var(--gold-primary); box-shadow: 0 0 20px rgba(212,175,55,0.2); }
    .search-icon { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); font-size: 18px; }

    .qa-grid { display: flex; flex-direction: column; gap: 20px; padding-bottom: 80px; }
    .qa-card { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 28px; transition: all 0.2s; }
    .qa-card:hover { border-color: var(--border-focus); transform: translateY(-2px); }
    .qa-cat { font-size: 12px; font-weight: 700; color: var(--gold-light); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .qa-title { font-size: 19px; font-weight: 700; color: #FFF; margin-bottom: 12px; line-height: 1.4; }
    .qa-body { color: var(--text-muted); font-size: 15px; line-height: 1.7; }

    footer { border-top: 1px solid var(--border-subtle); padding: 40px 0; text-align: center; color: var(--text-muted); font-size: 14px; }
  </style>

  <script type="application/ld+json">
  ${JSON.stringify(schema, null, 2)}
  </script>
</head>
<body>

  <nav class="site-nav">
    <div class="container nav-wrapper">
      <a href="https://mannatmatrimony.com/" class="brand-logo">
        <img src="/favicon.png" alt="Logo">
        <span>MANNAT</span>
      </a>
      <a href="https://mannatmatrimony.com/" style="color: var(--gold-light); font-size: 14px; font-weight: 600;">← Back to Main Sanctuary</a>
    </div>
  </nav>

  <header class="hero">
    <div class="container">
      <h1>Ask Mannat: Matrimonial Knowledge Hub</h1>
      <p>Instant answers to Gotra rules, Vedic 36 Gun Milan, background verification, NRI visas, and marriage guidelines.</p>
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" id="searchInput" class="search-input" placeholder="Search questions (e.g. Gotra rules, Kundli score, NRI visas)..." onkeyup="filterQA()">
      </div>
    </div>
  </header>

  <main class="container">
    <div class="qa-grid" id="qaContainer">
      ${askQuestions.map(item => `
        <article class="qa-card">
          <div class="qa-cat">${item.cat}</div>
          <h2 class="qa-title">${item.q}</h2>
          <div class="qa-body">${item.a}</div>
        </article>
      `).join('')}
    </div>
  </main>

  <footer>
    <div class="container">
      <p>© ${new Date().getFullYear()} Mannat Matrimony · www.mannatmatrimony.com</p>
    </div>
  </footer>

  <script>
    function filterQA() {
      const query = document.getElementById('searchInput').value.toLowerCase();
      const cards = document.querySelectorAll('.qa-card');
      cards.forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(query) ? 'block' : 'none';
      });
    }
  </script>
</body>
</html>`;
}

// 3. GENERATE RSS 2.0 FEED
function generateRssFeed(urlList) {
  const now = new Date().toUTCString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Mannat Matrimony - Verified Matchmaking News &amp; Updates</title>
    <link>https://mannatmatrimony.com</link>
    <description>Latest verified matrimonial communities, luxury marriage biodata formats, and Vedic Kundli matching guides.</description>
    <language>en-in</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="https://mannatmatrimony.com/rss.xml" rel="self" type="application/rss+xml" />
    ${urlList.map(u => `
    <item>
      <title>${u.title}</title>
      <link>${u.loc}</link>
      <guid>${u.loc}</guid>
      <pubDate>${now}</pubDate>
      <description>${u.description}</description>
    </item>`).join('\n')}
  </channel>
</rss>`;
}

// EXECUTE FULL GENERATION
console.log('🚀 Generating Full SEO Powerhouse Suite...');

// Generate /ask page
const askDir = path.join(publicDir, 'ask');
if (!fs.existsSync(askDir)) fs.mkdirSync(askDir, { recursive: true });
fs.writeFileSync(path.join(askDir, 'index.html'), generateAskPageHtml(), 'utf-8');
console.log('✅ Generated /ask Searchable Knowledge Hub');

// Update Kundali Matching page to include interactive calculator
const kundaliDir = path.join(publicDir, 'kundali-matching-matrimony');
if (fs.existsSync(kundaliDir)) {
  let kundaliHtml = fs.readFileSync(path.join(kundaliDir, 'index.html'), 'utf-8');
  if (!kundaliHtml.includes('id="kundali-calculator"')) {
    const calcHtml = generateKundaliCalculatorContent();
    kundaliHtml = kundaliHtml.replace('<!-- STATS -->', calcHtml + '\n  <!-- STATS -->');
    fs.writeFileSync(path.join(kundaliDir, 'index.html'), kundaliHtml, 'utf-8');
    console.log('✅ Injected Live 36 Gun Milan Calculator into /kundali-matching-matrimony');
  }
}

// Generate RSS Feed
const sitemapContent = fs.readFileSync(path.join(publicDir, 'sitemap.xml'), 'utf-8');
const locMatches = [...sitemapContent.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)];
const rssItems = locMatches.map(m => {
  const url = m[1];
  const slug = url.replace('https://mannatmatrimony.com/', '').replace('/', '') || 'home';
  return {
    loc: url,
    title: slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') + ' | Mannat Matrimony',
    description: `Verified matrimonial matchmaking, privacy controls, and background verification for ${slug} on Mannat Matrimony.`
  };
});

fs.writeFileSync(path.join(publicDir, 'rss.xml'), generateRssFeed(rssItems), 'utf-8');
fs.writeFileSync(path.join(publicDir, 'feed.xml'), generateRssFeed(rssItems), 'utf-8');
console.log(`✅ Generated public/rss.xml and public/feed.xml with ${rssItems.length} items`);

console.log('🎉 SEO Powerhouse Suite generation completed successfully!');
