import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');

// 1. ULTRA LONG-TAIL LOW-COMPETITION CONTENT PAGES (KD 0 - 10)
const longTailPages = [
  {
    slug: 'luxury-marriage-biodata-format-pdf',
    title: 'Luxury Marriage Biodata Format (Free Word & PDF Download) | Mannat',
    h1: 'Luxury Marriage Biodata Format: Free PDF & Word Templates',
    eyebrow: 'Zero-Cost Tool · Royal Gold & Emerald Themes · Instant Download',
    description: 'Download luxury marriage biodata formats in PDF & Word. Beautiful designs with Ganesh sloka, Gotra, horoscope, education, and family details for bride and groom.',
    keywordFocus: 'luxury marriage biodata format pdf, marriage biodata format word download, royal marriage biodata maker, matrimonial biodata format for elite families',
    content: `
      <h2>The Anatomy of a Luxury Matrimonial Biodata</h2>
      <p>When presenting your background to distinguished business families and cultured lineages, standard black-and-white CV formats fail to create an impact. A luxury matrimonial biodata balances aesthetic elegance, cultural reverence, and crystal-clear background transparency.</p>
      
      <h3>Key Sections Included in Our Royal Templates:</h3>
      <ul>
        <li><strong>Auspicious Header:</strong> Sacred invocation (॥ श्री गणेशाय नमः ॥, Ek Onkar, or Jai Jinendra) with royal filigree borders.</li>
        <li><strong>Candidate Portrait Placement:</strong> High-resolution portrait framed with refined margins.</li>
        <li><strong>Personal & Physical Dimensions:</strong> Name, Age, Exact Date of Birth, Height (ft/cm), Complexion, and Mother Tongue.</li>
        <li><strong>Education & Corporate Pedigree:</strong> University degrees, prestigious alma maters (IIT, IIM, Ivy League, Top Medical Colleges), and current corporate designations with location.</li>
        <li><strong>Family Dynasty & Heritage:</strong> Father’s occupation, Mother’s background, Siblings’ marital status, and native ancestral origin.</li>
        <li><strong>Horoscope & Vedic Details:</strong> Gotra (Self & Maternal), Rashi, Nakshatra, Manglik status, Time & City of Birth.</li>
        <li><strong>Direct Contact Coordinates:</strong> Dedicated elder/parent phone numbers and family correspondence email.</li>
      </ul>

      <div style="margin: 30px 0; padding: 24px; background: rgba(212,175,55,0.1); border: 1px solid #D4AF37; border-radius: 12px; text-align: center;">
        <h3 style="color: #D4AF37; margin-bottom: 8px;">Create Your Royal Biodata in 2 Minutes</h3>
        <p style="margin-bottom: 16px; color: #E2E8F0;">Use our interactive tool to fill your details, choose your luxury color theme, and download an instant A4 PDF.</p>
        <a href="/marriage-biodata-maker" class="btn btn-primary" style="display: inline-block;">Open Free Biodata Maker →</a>
      </div>
    `,
    faqs: [
      { q: 'Is this biodata format suitable for WhatsApp sharing?', a: 'Yes! The generated PDF and high-res image are optimized for crisp viewing on mobile screens and instant WhatsApp forwarding to family elders.' },
      { q: 'Can I customize the color scheme and fonts?', a: 'Yes. You can switch between Royal Gold, Emerald Elite, Rose Blossom, and Minimalist Platinum themes with one click.' }
    ]
  },
  {
    slug: 'marriage-biodata-for-doctors-format-example',
    title: 'Marriage Biodata Format for Doctors (MBBS, MD, MS) | Mannat',
    h1: 'Marriage Biodata Format for Doctors & Medical Specialists',
    eyebrow: 'MBBS · MD · MS · DM · MCh · Medical Council Verified',
    description: 'Specialized marriage biodata formats for doctors, surgeons, and healthcare specialists. Includes clinical specialty, hospital affiliation, and medical lineage details.',
    keywordFocus: 'marriage biodata format for doctors, doctor marriage biodata sample, MBBS doctor matrimony biodata, MD MS matrimonial cv format',
    content: `
      <h2>How Doctors Should Structure Their Matrimonial Biodata</h2>
      <p>Medical professionals have unique career paths, residency timelines, and clinical commitments. A doctor’s marriage biodata must clearly outline medical qualifications, specialization, current hospital affiliations, and future practice plans.</p>

      <h3>Crucial Information for Doctor Biodatas:</h3>
      <ul>
        <li><strong>Medical Qualifications & Registrations:</strong> Clarify MBBS, MD, MS, DNB, or Super-specialty (DM/MCh) degrees along with State Medical Council or NMC registration details.</li>
        <li><strong>Current Clinical Practice:</strong> Mention whether you are a hospital consultant, government medical officer, private practitioner, or pursuing fellowship abroad (e.g. USMLE / NHS).</li>
        <li><strong>Medical Lineage (If Applicable):</strong> Mention if parents or siblings are also physicians or running private healthcare facilities.</li>
        <li><strong>Partner Preference:</strong> State openness to non-medicos, fellow doctors, or specific geographic flexibility.</li>
      </ul>

      <div style="margin: 30px 0; padding: 24px; background: rgba(212,175,55,0.1); border: 1px solid #D4AF37; border-radius: 12px; text-align: center;">
        <h3 style="color: #D4AF37; margin-bottom: 8px;">Explore Verified Doctor Profiles</h3>
        <p style="margin-bottom: 16px; color: #E2E8F0;">Connect with over 1,150+ NMC/GMC verified physicians and surgeons on Mannat Matrimony.</p>
        <a href="/matrimony-for-doctors" class="btn btn-primary" style="display: inline-block;">Browse Doctors Matrimony →</a>
      </div>
    `,
    faqs: [
      { q: 'Should I mention my salary or clinic revenue in the doctor biodata?', a: 'It is recommended to state an annual compensation bracket or clinic turnover range to ensure financial alignment early on.' }
    ]
  },
  {
    slug: 'private-matrimonial-app-with-photo-privacy',
    title: 'Private Matrimonial App with Photo Privacy & BlurShield™ | Mannat',
    h1: 'Private Matrimonial App with Zero Public Photo Indexing',
    eyebrow: 'BlurShield™ Anti-Scraping · Encrypted Contacts · Mutual Consent',
    description: 'Looking for matrimonial matchmaking without publishing your photos to Google? Mannat protects your candidate portraits with BlurShield™ privacy controls.',
    keywordFocus: 'private matrimonial app, matrimony app with photo privacy, matrimonial site without public photos, confidential indian matchmaking app',
    content: `
      <h2>The Problem with Conventional Matrimony Sites and Photo Privacy</h2>
      <p>Traditional matrimonial portals index user profiles publicly on Google Search and Google Images. This exposes candidate portraits to unsolicited screenshots, facial recognition crawlers, and unauthorized circulation in social circles.</p>

      <h3>How Mannat’s BlurShield™ Architecture Protects You:</h3>
      <ul>
        <li><strong>Canvas-Level Dynamic Blurring:</strong> Photos remain protected with high-grade optical blurring for casual visitors and web bots.</li>
        <li><strong>Anti-Scraping HTTP Headers:</strong> Search engines are strictly forbidden from indexing or caching candidate images (` + '`' + `X-Robots-Tag: noimageindex` + '`' + `).</li>
        <li><strong>Mutual Consent Image Unlocking:</strong> Candidate portraits and phone numbers are only visible once both families mutually accept an introduction.</li>
        <li><strong>Instant Revocation:</strong> You can revoke photo viewing access from any profile at any time with one tap.</li>
      </ul>
    `,
    faqs: [
      { q: 'Can my colleagues or relatives see my photo without my permission?', a: 'Never. Your photo remains blurred and can only be revealed when you explicitly approve their profile.' }
    ]
  },
  {
    slug: '4-gotra-rule-in-hindu-marriage-explained',
    title: '4 Gotra Rule in Hindu Marriage Explained (Vedic Shastras) | Mannat',
    h1: 'The 4 Gotra Rule in Hindu Marriage: Complete Guide & Exceptions',
    eyebrow: 'Vedic Gotra System · Sagotra Marriage Rules · Cultural Traditions',
    description: 'Understand the 4 Gotra avoidance rule in Hindu marriages: Father Gotra, Mother Gotra, Dadi Gotra, and Nani Gotra. Learn rules, scientific rationale, and community exceptions.',
    keywordFocus: '4 gotra rule in hindu marriage, gotra rules for marriage, sagotra marriage rules, which gotras to avoid in marriage, agarwal gotra rules',
    content: `
      <h2>What is the 4 Gotra Rule in Hindu Marriages?</h2>
      <p>In traditional Hindu matchmaking across North and Western India (including Agarwal, Brahmin, Rajput, Jat, and Maheshwari communities), families avoid marriages between individuals who share any of four ancestral Gotras.</p>

      <h3>The 4 Gotras That Are Excluded:</h3>
      <ol>
        <li><strong>Self / Father’s Gotra:</strong> Direct paternal lineage.</li>
        <li><strong>Mother’s Maiden Gotra:</strong> Maternal grandfather's (Nana) lineage.</li>
        <li><strong>Paternal Grandmother’s (Dadi) Gotra:</strong> Father's maternal lineage.</li>
        <li><strong>Maternal Grandmother’s (Nani) Gotra:</strong> Mother's maternal lineage.</li>
      </ol>

      <p>While some modern communities follow a <strong>3-Gotra rule</strong> (excluding Father, Mother, and Dadi) or a <strong>1-Gotra rule</strong> (excluding only Self/Father Gotra), adhering to Gotra traditions ensures biological genetic diversity and respects cultural Shastras.</p>
    `,
    faqs: [
      { q: 'Can two people with the same Gotra marry if they live in different countries?', a: 'Traditionally, Sagotra marriages are discouraged regardless of geography because Gotra represents patriarchal lineage from the same Vedic Rishi.' }
    ]
  },
  {
    slug: 'nri-h1b-marriage-visa-and-background-checklist',
    title: 'NRI Matrimony: H-1B, Green Card & Background Checklist | Mannat',
    h1: 'NRI Matrimony Guide: H-1B, Green Card & Visa Verification Checklist',
    eyebrow: 'USA NRI Matchmaking · Visa Due Diligence · Legal Checklist',
    description: 'Essential legal and background verification checklist for NRI marriages. How to verify H-1B status, I-140 approval, Green Card, and US employer credentials.',
    keywordFocus: 'nri marriage background check, h1b matrimony verification, usa nri marriage checklist, green card marriage verification india',
    content: `
      <h2>Essential Checklist Before Finalizing an NRI Matrimonial Alliance</h2>
      <p>Entering an NRI matrimonial alliance requires thorough due diligence regarding legal immigration status, workplace credentials, and residential standing in the host country.</p>

      <h3>Key Documents & Credentials to Verify:</h3>
      <ul>
        <li><strong>Immigration Status:</strong> Verify Form I-797 (H-1B Approval Notice), I-140 Immigrant Petition status, Permanent Resident Card (Green Card), or US/UK/Canadian Passport.</li>
        <li><strong>Employment & Income Authentication:</strong> Verify official company email address, LinkedIn profile longevity, and W-2 / Form 16 wage statements.</li>
        <li><strong>Educational Verification:</strong> Authenticate US / foreign Master’s or Bachelor’s degree diplomas from accredited universities.</li>
        <li><strong>Marital Status Certification:</strong> Ensure single status affidavit or certified divorce decree where applicable.</li>
      </ul>
    `,
    faqs: [
      { q: 'How does Mannat assist with NRI candidate verification?', a: 'Mannat requires government IDs, university diplomas, and corporate email verification for all registered NRI profiles.' }
    ]
  }
];

// Generate HTML for long-tail pages
function generateLongTailHtml(p) {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": p.h1,
      "description": p.description,
      "author": { "@type": "Organization", "name": "Mannat Matrimony Editorial Board", "url": "https://mannatmatrimony.com" },
      "publisher": { "@type": "Organization", "name": "Mannat Matrimony", "logo": { "@type": "ImageObject", "url": "https://mannatmatrimony.com/favicon.png" } },
      "mainEntityOfPage": `https://mannatmatrimony.com/${p.slug}`
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": p.faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      }))
    }
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.title}</title>
  <meta name="description" content="${p.description}">
  <meta name="keywords" content="${p.keywordFocus}">
  <link rel="canonical" href="https://mannatmatrimony.com/${p.slug}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">

  <meta property="og:type" content="article">
  <meta property="og:url" content="https://mannatmatrimony.com/${p.slug}">
  <meta property="og:title" content="${p.title}">
  <meta property="og:description" content="${p.description}">
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
    body { background-color: var(--bg-dark); color: var(--text-main); font-family: 'Plus Jakarta Sans', sans-serif; line-height: 1.7; }
    a { color: var(--gold-light); text-decoration: none; }
    a:hover { text-decoration: underline; }
    .container { max-width: 900px; margin: 0 auto; padding: 0 24px; }

    .site-nav { position: sticky; top: 0; z-index: 100; background: rgba(7,9,14,0.9); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border-subtle); padding: 16px 0; }
    .nav-wrapper { display: flex; align-items: center; justify-content: space-between; }
    .brand-logo { font-family: 'Cinzel', serif; font-size: 22px; font-weight: 700; letter-spacing: 2px; color: var(--gold-light); display: flex; align-items: center; gap: 8px; }
    .brand-logo img { width: 32px; height: 32px; border-radius: 50%; }

    .article-header { padding: 60px 0 30px; text-align: center; border-bottom: 1px solid var(--border-subtle); margin-bottom: 40px; }
    .eyebrow { font-size: 13px; font-weight: 700; color: var(--gold-light); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
    .article-header h1 { font-family: 'Cinzel', serif; font-size: clamp(28px, 4vw, 42px); color: #FFF; line-height: 1.2; margin-bottom: 16px; }

    .article-body { font-size: 16px; color: #CBD5E1; margin-bottom: 60px; }
    .article-body h2 { font-family: 'Cinzel', serif; font-size: 26px; color: var(--gold-light); margin: 36px 0 16px; }
    .article-body h3 { font-family: 'Cinzel', serif; font-size: 20px; color: #FFF; margin: 24px 0 12px; }
    .article-body p { margin-bottom: 18px; }
    .article-body ul, .article-body ol { margin: 16px 0 24px 24px; }
    .article-body li { margin-bottom: 10px; }

    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 28px; border-radius: 9999px; font-weight: 600; font-size: 14px; cursor: pointer; text-decoration: none !important; }
    .btn-primary { background: linear-gradient(135deg, var(--gold-light), var(--gold-primary), var(--gold-dark)); color: #07090E; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3); }

    .faq-box { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 28px; margin-top: 40px; }
    .faq-box h3 { font-family: 'Cinzel', serif; font-size: 22px; color: var(--gold-light); margin-bottom: 20px; }
    .faq-q { font-weight: 700; color: #FFF; margin-bottom: 6px; font-size: 16px; }
    .faq-a { color: var(--text-muted); font-size: 14px; margin-bottom: 20px; }

    footer { border-top: 1px solid var(--border-subtle); padding: 40px 0; text-align: center; color: var(--text-muted); font-size: 14px; }
  </style>

  ${schema.map(s => `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`).join('\n')}
</head>
<body>

  <nav class="site-nav">
    <div class="container nav-wrapper">
      <a href="https://mannatmatrimony.com/" class="brand-logo">
        <img src="/favicon.png" alt="Logo">
        <span>MANNAT</span>
      </a>
      <a href="https://mannatmatrimony.com/" style="color: var(--gold-light); font-size: 14px; font-weight: 600;">← Back to Main Platform</a>
    </div>
  </nav>

  <header class="article-header">
    <div class="container">
      <div class="eyebrow">✨ ${p.eyebrow}</div>
      <h1>${p.h1}</h1>
      <p style="color: var(--text-muted); font-size: 14px;">Published by Mannat Matrimony Editorial Board · Verified Guidelines</p>
    </div>
  </header>

  <main class="container">
    <article class="article-body">
      ${p.content}

      <div class="faq-box">
        <h3>Frequently Asked Questions</h3>
        ${p.faqs.map(f => `
          <div>
            <div class="faq-q">${f.q}</div>
            <div class="faq-a">${f.a}</div>
          </div>
        `).join('')}
      </div>
    </article>
  </main>

  <footer>
    <div class="container">
      <p>© ${new Date().getFullYear()} Mannat Matrimony · Verified Matchmaking Platform</p>
    </div>
  </footer>

</body>
</html>`;
}

// Generate files for long-tail pages
longTailPages.forEach(p => {
  const dir = path.join(publicDir, p.slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), generateLongTailHtml(p), 'utf-8');
  console.log(`✅ Generated Long-Tail SEO Page: /${p.slug}`);
});

// Update sitemap with new pages
const sitemapPath = path.join(publicDir, 'sitemap.xml');
let sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
longTailPages.forEach(p => {
  const url = `https://mannatmatrimony.com/${p.slug}`;
  if (!sitemapContent.includes(url)) {
    const entry = `  <url>\n    <loc>${url}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>\n</urlset>`;
    sitemapContent = sitemapContent.replace('</urlset>', entry);
  }
});
fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');
console.log('✅ Updated sitemap.xml with long-tail pages');

// 2. BACKLINK & STARTUP DIRECTORY SUBMISSION MANIFEST
const backlinkManifest = {
  platformName: "Mannat Matrimony",
  tagline: "India's Premier Private & Verified Matrimonial Sanctuary",
  url: "https://mannatmatrimony.com",
  founderDesk: "+91-97383-97933",
  appStoreUrl: "https://apps.apple.com/app/id6812288373",
  categories: ["Matrimony", "Matchmaking", "Lifestyle", "Privacy Tech", "Social Network"],
  shortDescription: "Mannat is India's private, verified matrimonial matchmaking platform for discerning Indian and NRI families. 100% ID-verified profiles, BlurShield™ privacy controls, and WhatsApp bio-data dossiers.",
  longDescription: "Mannat Matrimony addresses the two biggest pain points in modern Indian matchmaking: fake unverified profiles and intrusive public photo scraping. With mandatory Government ID validation and proprietary BlurShield™ photo protection, candidate portraits remain confidential until mutual interest is approved. Mannat serves accomplished professionals (Doctors, IIT/IIM alumni, Chartered Accountants, Civil Servants) and prestigious business families across Delhi NCR, Mumbai, Bangalore, and global NRI hubs (USA, UK, Canada, UAE).",
  freeTools: [
    { name: "Marriage Biodata Maker", url: "https://mannatmatrimony.com/marriage-biodata-maker" },
    { name: "Vedic 36 Gun Milan Calculator", url: "https://mannatmatrimony.com/kundali-matching-matrimony" },
    { name: "Ask Mannat Knowledge Hub", url: "https://mannatmatrimony.com/ask" }
  ],
  readySubmissions: [
    { directory: "Product Hunt", url: "https://www.producthunt.com/posts/new", status: "Ready to Submit" },
    { directory: "BetaList", url: "https://betalist.com/submit", status: "Ready to Submit" },
    { directory: "Crunchbase", url: "https://www.crunchbase.com/add-new", status: "Ready to Add Profile" },
    { directory: "StartupIndia", url: "https://www.startupindia.gov.in", status: "Ready to Register" },
    { directory: "F6S", url: "https://www.f6s.com/programs/apply", status: "Ready to Submit" },
    { directory: "PRLog Press Release", url: "https://www.prlog.org/pub/", status: "Press Release Draft Ready" },
    { directory: "OpenPR", url: "https://www.openpr.com/submit", status: "Press Release Draft Ready" }
  ],
  pressRelease: {
    headline: "Mannat Matrimony Launches BlurShield™ Technology to Combat Photo Scraping and Fake Profiles in Indian Matchmaking",
    dateline: "NEW DELHI / BANGALORE, INDIA — September 2026",
    body: "Mannat Matrimony today announced the public rollout of its verified matrimonial platform and BlurShield™ privacy architecture, designed specifically to safeguard candidate dignity in modern arranged matchmaking. Unlike traditional portals that index candidate portraits on search engines, Mannat ensures mandatory multi-point government ID verification and mutual consent image reveals. The platform also offers a free, zero-login Luxury Marriage Biodata Maker and Vedic Kundli Matching tool for family elders."
  }
};

fs.writeFileSync(path.resolve('scratch/backlink_submissions_manifest.json'), JSON.stringify(backlinkManifest, null, 2), 'utf-8');
console.log('✅ Generated scratch/backlink_submissions_manifest.json with ready-to-publish copy and press releases');
