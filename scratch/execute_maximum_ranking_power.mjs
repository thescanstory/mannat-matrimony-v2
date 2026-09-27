import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const BASE_URL = 'https://mannatmatrimony.com';

console.log("⚡ [MAX RANKING ENGINE] Initiating aggressive top-rank expansion...");

// 1. Specialized Long-Tail Biodata Templates & Cultural Astro Guides
const LONG_TAIL_DOMINATORS = [
  {
    slug: "marriage-biodata-for-engineers-format-pdf",
    title: "Marriage Biodata Format for Software Engineers & Techies (Free PDF) | Mannat",
    desc: "Download free professional marriage biodata format for software engineers, FAANG developers & tech founders. Clean layout, career highlights & instant PDF download.",
    h1: "Marriage Biodata Format for Engineers & Tech Professionals",
    intro: "Specially designed matrimonial biodata layout for Software Engineers, Data Scientists, Product Managers, and Tech Founders. Emphasizes tech stacks, global experience, and family background.",
    points: [
      { title: "Tech Career & Education Layout", desc: "Dedicated sections for B.Tech, M.S., current tech employer, work location (Bangalore, Bay Area, Hyderabad), and compensation bracket." },
      { title: "Clean Modern Minimalist Theme", desc: "Contemporary aesthetic preferred by tech professionals, free from outdated clipart." },
      { title: "Instant WhatsApp & PDF Export", desc: "Download in high-resolution A4 PDF ready for print or direct WhatsApp family sharing in 1 click." }
    ]
  },
  {
    slug: "marriage-biodata-for-chartered-accountants-format-pdf",
    title: "Marriage Biodata Format for Chartered Accountants (CA) & Finance Leaders | Free PDF",
    desc: "Download tailored marriage biodata format for Chartered Accountants (CA), CFA charterholders & Investment Bankers. Professional, elegant & free instant PDF.",
    h1: "Marriage Biodata Format for Chartered Accountants (CA)",
    intro: "Curated matrimonial format highlighting ICAI qualifications, article-ship background, finance leadership roles, and distinguished family heritage.",
    points: [
      { title: "ICAI & Professional Credentials", desc: "Prominently display CA Rank, Big 4 experience, practice vs corporate role, and financial acumen." },
      { title: "Family & Business Alignment", desc: "Structured sections for parental business background, family origins, and gotra lineage." },
      { title: "Instant Unwatermarked PDF", desc: "100% free unwatermarked A4 PDF export with customizable royal gold borders." }
    ]
  },
  {
    slug: "marriage-biodata-for-government-employees-format-pdf",
    title: "Marriage Biodata Format for Government & PSU Employees (Free PDF) | Mannat",
    desc: "Free marriage biodata format for Civil Servants, PSU Officers, Bank Probationary Officers & Government Employees. Formal, respectful & instant PDF export.",
    h1: "Marriage Biodata Format for Government & Public Sector Officers",
    intro: "Structured biodata format tailored for IAS, IPS, State PSC, PSU, and Nationalized Bank officers highlighting service cadre, designation, and family background.",
    points: [
      { title: "Service Cadre & Grade Pay", desc: "Clear fields for Gazetted / Non-Gazetted status, ministry, department, and posting location." },
      { title: "Traditional & Astrological Harmony", desc: "Pre-formatted sections for Rashi, Nakshatra, Gotra, and Kuldevi." },
      { title: "Print & Share Ready", desc: "Designed for standard government-style formal sharing and WhatsApp family circulation." }
    ]
  },
  {
    slug: "hindu-marriage-biodata-format-free-download-pdf",
    title: "Hindu Marriage Biodata Format Free Download PDF (English & Hindi) | Mannat",
    desc: "Create and download traditional Hindu marriage biodata in PDF format. Includes Ganeshji header, Gotra, Rashi, Nakshatra, Manglik status & family details.",
    h1: "Traditional Hindu Marriage Biodata Format (Free PDF Download)",
    intro: "Authentic Hindu marriage biodata templates featuring auspicious Shubh symbols, 4-Gotra lineage details, horoscope compatibility parameters, and parental origins.",
    points: [
      { title: "Auspicious Spiritual Elements", desc: "Optional Om, Shree Ganeshay Namah, and Swastik headers with traditional floral borders." },
      { title: "Full Horoscope & Gotra Lineage", desc: "Detailed fields for Gotra (Self, Mother, Grandmother), Mangal Dosha, Nakshatra, and Charan." },
      { title: "Mobile & WhatsApp Optimized", desc: "Instant high-resolution PDF download with zero watermarks or registration walls." }
    ]
  },
  {
    slug: "jain-marriage-biodata-format-pdf",
    title: "Jain Marriage Biodata Format Free PDF (Digambar & Shwetambar) | Mannat",
    desc: "Free Jain marriage biodata format for Digambar, Shwetambar & Oswal families. Strict vegetarian values, Gotra & business details in print-ready PDF.",
    h1: "Jain Marriage Biodata Format (Digambar & Shwetambar)",
    intro: "Refined matrimonial biodata templates for Jain families highlighting Ahimsa traditions, vegetarian lifestyle, Shakha/Gotra, and family business enterprises.",
    points: [
      { title: "Strict Jain Cultural Focus", desc: "Emphasizes dietary principles, Jain philosophy, and community traditions." },
      { title: "Business & Education Portfolio", desc: "Clean sections for family business lineage, CA/MBA/Engineer qualifications." },
      { title: "Instant Free PDF", desc: "Download in 2 minutes with zero sign-up required." }
    ]
  },
  {
    slug: "sikh-marriage-biodata-format-pdf",
    title: "Sikh Marriage Biodata Format Free PDF (Anand Karaj Ready) | Mannat",
    desc: "Download free Sikh marriage biodata format in PDF. Specially crafted for Jat Sikh, Arora & Khatri Sikh families. Ek Onkar header & instant download.",
    h1: "Sikh Marriage Biodata Format for Anand Karaj",
    intro: "Dignified matrimonial biodata format for Sikh brides and grooms featuring Ek Onkar header, caste/clan details, amritdhari/keshdhari preference, and family background.",
    points: [
      { title: "Ek Onkar & Spiritual Respect", desc: "Sacred Ek Onkar header and dignified royal borders." },
      { title: "Sikh Heritage & Lineage", desc: "Custom fields for Nanake/Dadake village origins, profession, and NRI status." },
      { title: "Free WhatsApp PDF", desc: "High-resolution export formatted for modern Sikh families globally." }
    ]
  },
  {
    slug: "nadi-dosha-cancellation-rules-for-marriage",
    title: "Nadi Dosha Cancellation Rules in Kundali Matching Explained (2026)",
    desc: "Learn the 7 vital Nadi Dosha cancellation rules in Vedic astrology. How to check if Nadi Dosha is cancelled for marriage compatibility.",
    h1: "Nadi Dosha Cancellation Rules in Vedic Kundali Matching",
    intro: "Nadi Dosha carries 8 points in Ashtakoot 36 Gun Milan. Discover the authentic astrological exceptions where Nadi Dosha is completely nullified for a happy married life.",
    points: [
      { title: "Same Rashi Different Nakshatras", desc: "If the bride and groom share the same Moon sign but have different Nakshatras, Nadi Dosha is cancelled." },
      { title: "Same Nakshatra Different Rashis", desc: "When both have the same Nakshatra across different astrological signs, the dosha is nullified." },
      { title: "Rashi Lord Friendship (Graha Maitri)", desc: "Strong friendship between planetary rulers significantly mitigates the physiological effects of Nadi Dosha." }
    ]
  },
  {
    slug: "manglik-dosha-cancellation-rules-in-kundali-matching",
    title: "Manglik Dosha Cancellation Rules in Kundali Matching | Vedic Astrology",
    desc: "Complete guide to Manglik Dosha exceptions and cancellation rules in marriage. How Mars placement in 1st, 4th, 7th, 8th, or 12th house is nullified.",
    h1: "Manglik Dosha Cancellation & Nullification Rules for Marriage",
    intro: "Mangal Dosha (Kuja Dosha) is widely misunderstood. Learn the authentic Vedic astrological conditions under which Manglik Dosha is cancelled or neutralized.",
    points: [
      { title: "Mutual Manglik Balance", desc: "When both partners have Mars in 1st, 4th, 7th, 8th, or 12th houses, the doshas naturally cancel each other out." },
      { title: "Benefic Planetary Conjunctions", desc: "Jupiter (Guru) or Moon conjunction with Mars removes adverse Manglik effects." },
      { title: "Mars in Own or Exalted Signs", desc: "Mars positioned in Aries, Scorpio, or Capricorn nullifies aggressive dosha tendencies." }
    ]
  }
];

// Helper to generate pages
for (const item of LONG_TAIL_DOMINATORS) {
  const dir = path.join(PUBLIC_DIR, item.slug);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${item.title}</title>
  <meta name="description" content="${item.desc}">
  <link rel="canonical" href="https://mannatmatrimony.com/${item.slug}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta property="og:title" content="${item.title}">
  <meta property="og:description" content="${item.desc}">
  <meta property="og:url" content="https://mannatmatrimony.com/${item.slug}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Mannat Matrimony">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${item.title}">
  <meta name="twitter:description" content="${item.desc}">
  
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": "${item.title}",
        "description": "${item.desc}",
        "author": { "@type": "Organization", "name": "Mannat Matrimony Astrological & Career Desk", "url": "https://mannatmatrimony.com" },
        "publisher": { "@type": "Organization", "name": "Mannat Matrimony", "url": "https://mannatmatrimony.com", "logo": { "@type": "ImageObject", "url": "https://mannatmatrimony.com/og-preview.png" } },
        "datePublished": "2026-01-01T00:00:00+05:30",
        "dateModified": "2026-09-28T00:00:00+05:30"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mannatmatrimony.com" },
          { "@type": "ListItem", "position": 2, "name": "${item.h1}", "item": "https://mannatmatrimony.com/${item.slug}" }
        ]
      }
    ]
  }
  </script>

  <style>
    :root { --gold: #C5A880; --gold-dark: #9A7B4F; --bg: #0C0A09; --card: #1C1917; --border: #292524; --text: #F5F5F4; --muted: #A8A29E; }
    * { margin:0; padding:0; box-sizing:border-box; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,sans-serif; }
    body { background:var(--bg); color:var(--text); line-height:1.6; padding:0 20px; }
    .container { max-width:960px; margin:0 auto; padding:40px 0; }
    .header { text-align:center; padding:30px 0; }
    .badge { display:inline-block; padding:6px 14px; background:rgba(197,168,128,0.1); border:1px solid var(--gold); color:var(--gold); border-radius:50px; font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:1px; margin-bottom:16px; }
    h1 { font-size:2.3rem; color:#fff; margin-bottom:14px; }
    .intro { font-size:1.15rem; color:var(--muted); max-width:800px; margin:0 auto 24px; }
    .btn { display:inline-block; background:linear-gradient(135deg,var(--gold),var(--gold-dark)); color:#0C0A09; font-weight:700; padding:14px 32px; border-radius:30px; text-decoration:none; margin:10px 6px; box-shadow:0 8px 24px rgba(197,168,128,0.25); }
    .card-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:20px; margin:30px 0; }
    .card { background:var(--card); border:1px solid var(--border); border-radius:16px; padding:26px; }
    .card h3 { color:var(--gold); font-size:1.2rem; margin-bottom:10px; }
    .card p { color:var(--muted); font-size:0.95rem; }
    .silo-box { background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:16px; padding:24px; text-align:center; margin:40px 0; }
    .silo-box a { color:var(--gold); text-decoration:none; margin:0 10px; font-size:0.9rem; }
    .silo-box a:hover { text-decoration:underline; }
    .footer { text-align:center; padding:40px 0; color:var(--muted); font-size:0.85rem; border-top:1px solid var(--border); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">100% Free • Print-Ready PDF & Instant Share</div>
      <h1>${item.h1}</h1>
      <p class="intro">${item.intro}</p>
      <div>
        <a href="/marriage-biodata-maker" class="btn">Launch Free Biodata Maker</a>
        <a href="/kundali-matching-matrimony" class="btn" style="background:transparent; border:1px solid var(--gold); color:var(--gold);">Kundali 36 Gun Milan</a>
      </div>
    </div>

    <div class="card-grid">
      ${item.points.map(p => `
      <div class="card">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
      </div>`).join('')}
    </div>

    <div class="silo-box">
      <p style="color:#fff; font-weight:600; margin-bottom:12px;">Related Matrimonial Tools & Hubs</p>
      <a href="/marriage-biodata-maker">Marriage Biodata Maker (Free PDF)</a>
      <a href="/kundali-matching-matrimony">36 Gun Milan Calculator</a>
      <a href="/top-matrimony-platforms-in-india">Top Matrimony Platforms in India</a>
      <a href="/best-matrimonial-sites-in-bangalore">Bangalore Matrimony Guide</a>
      <a href="/delhi-matrimony">Delhi Matrimony</a>
      <a href="/mumbai-matrimony">Mumbai Matrimony</a>
    </div>

    <div class="footer">
      <p>© 2026 Mannat Matrimony. India's Premier Private Matrimonial Platform.</p>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8');
  console.log(`✅ Created dominator page: /${item.slug}`);
}

console.log("⚡ Long-tail ranking dominators generated successfully!");
