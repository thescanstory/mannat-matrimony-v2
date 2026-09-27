import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');

// Base building blocks for programmatic permutations
const communities = [
  { id: 'punjabi', name: 'Punjabi', tag: 'Arora · Khatri · Sikh · Hindu Punjabi', defaultDiet: 'Vegetarian / Non-Veg' },
  { id: 'sikh', name: 'Sikh', tag: 'Jat Sikh · Khatri · Ramgarhia · Gursikh', defaultDiet: 'Vegetarian' },
  { id: 'marwari', name: 'Marwari', tag: 'Agarwal · Maheshwari · Khandelwal · Oswal', defaultDiet: 'Pure Vegetarian' },
  { id: 'agarwal', name: 'Agarwal', tag: 'Mittal · Bansal · Goyal · Singhal · Garg', defaultDiet: 'Pure Vegetarian' },
  { id: 'maheshwari', name: 'Maheshwari', tag: 'Somani · Daga · Kabra · Rathi · Toshniwal', defaultDiet: 'Pure Vegetarian' },
  { id: 'gujarati', name: 'Gujarati', tag: 'Patel · Shah · Vaishnav · Vania', defaultDiet: 'Pure Vegetarian' },
  { id: 'patel', name: 'Patel', tag: 'Leva Patel · Kadva Patidar · 24 Gam', defaultDiet: 'Vegetarian' },
  { id: 'jain', name: 'Jain', tag: 'Shwetambar · Digambar · Oswal · Porwal', defaultDiet: 'Pure Jain Vegetarian' },
  { id: 'brahmin', name: 'Brahmin', tag: 'Gaur · Saraswat · Kanyakubja · Iyer · Iyengar', defaultDiet: 'Vegetarian' },
  { id: 'rajput', name: 'Rajput', tag: 'Rathore · Chauhan · Sisodia · Shekhawat', defaultDiet: 'Non-Veg / Veg' },
  { id: 'maratha', name: 'Maratha', tag: '96 Kuli Maratha · Deshmukh · Patil', defaultDiet: 'Non-Veg / Veg' },
  { id: 'sindhi', name: 'Sindhi', tag: 'Amil · Bhaiband · Sahiti · Larkana', defaultDiet: 'Vegetarian / Non-Veg' },
  { id: 'kayastha', name: 'Kayastha', tag: 'Srivastava · Mathur · Saxena · Bhatnagar', defaultDiet: 'Vegetarian / Non-Veg' },
  { id: 'telugu', name: 'Telugu', tag: 'Reddy · Kamma · Arya Vysya · Brahmin', defaultDiet: 'Vegetarian / Non-Veg' },
  { id: 'reddy', name: 'Reddy', tag: 'Motati · Gudati · Pedakanti · Pakanati', defaultDiet: 'Non-Veg / Veg' },
  { id: 'tamil', name: 'Tamil', tag: 'Iyer · Iyengar · Chettiar · Mudaliar', defaultDiet: 'Vegetarian' },
  { id: 'iyer', name: 'Iyer', tag: 'Vadama · Brahacharanam · Vathima', defaultDiet: 'Pure Vegetarian' },
  { id: 'kannada', name: 'Kannada', tag: 'Brahmin · Lingayat · Vokkaliga · Bunt', defaultDiet: 'Vegetarian' },
  { id: 'malayalam', name: 'Malayalam', tag: 'Nair · Menon · Syrian Christian · Ezhava', defaultDiet: 'Non-Veg / Veg' },
  { id: 'bengali', name: 'Bengali', tag: 'Brahmin · Baidya · Kayastha', defaultDiet: 'Non-Veg / Fish' },
  { id: 'kashmiri-pandit', name: 'Kashmiri Pandit', tag: 'Dhar · Raina · Kaul · Bhat · Tikoo', defaultDiet: 'Non-Veg / Veg' }
];

const cities = [
  { id: 'delhi', name: 'Delhi NCR', region: 'India', locDetails: 'South Delhi, Gurgaon Golf Course Rd, Noida, GK & Vasant Vihar' },
  { id: 'mumbai', name: 'Mumbai', region: 'India', locDetails: 'South Mumbai, Bandra, Juhu, BKC & Powai' },
  { id: 'bangalore', name: 'Bangalore', region: 'India', locDetails: 'Indiranagar, Koramangala, Whitefield & Lavelle Road' },
  { id: 'hyderabad', name: 'Hyderabad', region: 'India', locDetails: 'Jubilee Hills, Banjara Hills, Madhapur & Hitec City' },
  { id: 'pune', name: 'Pune', region: 'India', locDetails: 'Koregaon Park, Prabhat Road, Kalyani Nagar & Baner' },
  { id: 'chandigarh', name: 'Chandigarh', region: 'India', locDetails: 'Sector 8, 9, 10, Mohali & Panchkula' },
  { id: 'kolkata', name: 'Kolkata', region: 'India', locDetails: 'Alipore, Ballygunge, Salt Lake & New Town' },
  { id: 'chennai', name: 'Chennai', region: 'India', locDetails: 'Boat Club, Poes Garden, Adyar & Anna Nagar' },
  { id: 'jaipur', name: 'Jaipur', region: 'India', locDetails: 'C-Scheme, Civil Lines, Raja Park & Mansarovar' },
  { id: 'ahmedabad', name: 'Ahmedabad', region: 'India', locDetails: 'Bodakdev, Satellite, SG Highway & Ambawadi' },
  { id: 'surat', name: 'Surat', region: 'India', locDetails: 'Vesu, City Light, Piplod & Ghod Dod Road' },
  { id: 'lucknow', name: 'Lucknow', region: 'India', locDetails: 'Gomti Nagar, Hazratganj, Mahanagar & Aliganj' },
  { id: 'indore', name: 'Indore', region: 'India', locDetails: 'Vijay Nagar, Saket, Palasia & AB Road' },
  { id: 'usa', name: 'USA', region: 'NRI', locDetails: 'California, New York, Texas, Washington, New Jersey & Chicago' },
  { id: 'uk', name: 'United Kingdom (UK)', region: 'NRI', locDetails: 'London, Birmingham, Leicester, Manchester & Leeds' },
  { id: 'canada', name: 'Canada', region: 'NRI', locDetails: 'Toronto (GTA), Vancouver, Calgary, Ottawa & Edmonton' },
  { id: 'australia', name: 'Australia', region: 'NRI', locDetails: 'Sydney, Melbourne, Brisbane & Perth' },
  { id: 'dubai', name: 'Dubai & UAE', region: 'NRI', locDetails: 'Dubai, Abu Dhabi, Sharjah & Gulf GCC' },
  { id: 'singapore', name: 'Singapore', region: 'NRI', locDetails: 'Singapore Central, Orchard, Tanjong Pagar & East Coast' }
];

const professions = [
  { id: 'doctors', name: 'Doctors & Physicians', tag: 'MBBS · MD · MS · DM · MCh · USMLE · NHS', queryName: 'Doctor Matrimony' },
  { id: 'iit-iim', name: 'IIT & IIM Alumni', tag: 'IIT · IIM · BITS · ISB · Ivy League', queryName: 'IIT IIM Matrimony' },
  { id: 'ca-finance', name: 'Chartered Accountants & Investment Bankers', tag: 'ICAI CA · CFA · PE & VC · Investment Banking', queryName: 'CA Matrimony' },
  { id: 'ias-civil-services', name: 'Civil Servants & IAS/IPS Officers', tag: 'UPSC IAS · IPS · IFS · IRS · Judiciary', queryName: 'Civil Services Matrimony' },
  { id: 'software-tech-founders', name: 'Tech Founders & FAANG Software Architects', tag: 'Founders · Tech Leaders · FAANG / Silicon Valley', queryName: 'Tech Founder Matrimony' }
];

const gotras = [
  'Garg', 'Goyal', 'Mittal', 'Bansal', 'Singhal', 'Jindal', 'Kansal', 'Tayal',
  'Bharadwaj', 'Kashyap', 'Vashishta', 'Kaushik', 'Shandilya', 'Gautam', 'Parashar', 'Vatsa',
  'Rathore', 'Chauhan', 'Sisodia', 'Shekhawat', 'Tomar', 'Parmar', 'Kachwaha',
  'Daga', 'Somani', 'Kabra', 'Rathi', 'Toshniwal', 'Mohta', 'Birla', 'Bangur'
];

const rashiPairs = [
  { r1: 'Mesh (Aries)', r2: 'Simha (Leo)' },
  { r1: 'Mesh (Aries)', r2: 'Dhanu (Sagittarius)' },
  { r1: 'Vrishabh (Taurus)', r2: 'Kanya (Virgo)' },
  { r1: 'Vrishabh (Taurus)', r2: 'Makar (Capricorn)' },
  { r1: 'Mithun (Gemini)', r2: 'Tula (Libra)' },
  { r1: 'Mithun (Gemini)', r2: 'Kumbh (Aquarius)' },
  { r1: 'Kark (Cancer)', r2: 'Vrishchik (Scorpio)' },
  { r1: 'Kark (Cancer)', r2: 'Meen (Pisces)' },
  { r1: 'Simha (Leo)', r2: 'Dhanu (Sagittarius)' },
  { r1: 'Kanya (Virgo)', r2: 'Makar (Capricorn)' },
  { r1: 'Tula (Libra)', r2: 'Kumbh (Aquarius)' },
  { r1: 'Vrishchik (Scorpio)', r2: 'Meen (Pisces)' }
];

// GENERATE 500+ PROGRAMMATIC PAGES
const allGeneratedPages = [];

// 1. Community × City permutations (21 × 19 = 399 pages)
for (const comm of communities) {
  for (const city of cities) {
    const slug = `${comm.id}-matrimony-${city.id}`;
    allGeneratedPages.push({
      slug: slug,
      title: `Verified ${comm.name} Matrimony in ${city.name} | Mannat Matrimony`,
      h1: `Verified ${comm.name} Matrimony in ${city.name}`,
      eyebrow: `${comm.tag} · ${city.name}`,
      description: `Private, verified ${comm.name} matchmaking in ${city.name} (${city.locDetails}). 100% ID-verified biodatas, Kundli Gun Milan, and BlurShield™ privacy.`,
      keywordFocus: `${comm.name} matrimony ${city.name}, verified ${comm.name} profiles ${city.name}, ${comm.name} matchmaking ${city.name}`,
      introText: `Mannat Matrimony connects accomplished ${comm.name} families across ${city.name} (${city.locDetails}). Every candidate profile undergoes multi-point credential, education, and family background vetting.`,
      category: 'Community x Location',
      faqs: [
        { q: `How many verified ${comm.name} profiles are active in ${city.name}?`, a: `Mannat hosts hundreds of verified ${comm.name} candidate profiles residing in ${city.name} and surrounding metropolitan hubs.` },
        { q: `How does Mannat verify candidate background in ${city.name}?`, a: `Every profile is verified through Government ID authentication, educational degree validation, and professional registry cross-referencing.` }
      ]
    });
  }
}

// 2. Profession × City permutations (5 × 14 = 70 pages)
for (const prof of professions) {
  for (const city of cities.slice(0, 14)) {
    const slug = `${prof.id}-matrimony-${city.id}`;
    allGeneratedPages.push({
      slug: slug,
      title: `Verified ${prof.queryName} in ${city.name} | Mannat Matrimony`,
      h1: `Verified Matrimony for ${prof.name} in ${city.name}`,
      eyebrow: `${prof.tag} · ${city.name}`,
      description: `Exclusive matchmaking for ${prof.name} in ${city.name}. 100% verified degrees, company affiliations, and BlurShield™ privacy controls.`,
      keywordFocus: `${prof.queryName} ${city.name}, ${prof.id} matrimony ${city.name}, verified matchmaking ${prof.name}`,
      introText: `Curated matchmaking tailored specifically for ${prof.name} in ${city.name} who seek an intellectually compatible life partner.`,
      category: 'Profession x Location',
      faqs: [
        { q: `How are professional credentials verified for ${prof.name}?`, a: `We authenticate official university diplomas, bar/medical council registrations, and corporate affiliations directly.` }
      ]
    });
  }
}

// 3. Gotra specific pages (31 pages)
for (const gotra of gotras) {
  const slug = `${gotra.toLowerCase()}-gotra-matrimony-profiles`;
  allGeneratedPages.push({
    slug: slug,
    title: `${gotra} Gotra Matrimony Verified Profiles | Mannat Matrimony`,
    h1: `Verified Matrimony Profiles for ${gotra} Gotra`,
    eyebrow: `Vedic Lineage · ${gotra} Gotra Matchmaking`,
    description: `Find verified matrimonial proposals for ${gotra} Gotra. Multi-point background checks, Vedic Kundli Gun Milan, and strict Sagotra rule compliance.`,
    keywordFocus: `${gotra} gotra matrimony, ${gotra} gotra matchmaking, ${gotra} gotra biodatas`,
    introText: `Dedicated matchmaking for families of ${gotra} Gotra across India and the global diaspora, ensuring Vedic Shastra compliance and authentic lineage alignment.`,
    category: 'Gotra Lineages',
    faqs: [
      { q: `Does Mannat filter profiles to avoid Sagotra (same ${gotra} Gotra) marriage?`, a: `Yes. Our platform and relationship managers ensure strict adherence to Gotra compatibility rules based on your family traditions.` }
    ]
  });
}

// 4. Kundali Rashi Compatibility Pages (12 pages)
for (const pair of rashiPairs) {
  const slugSlug = `${pair.r1.split(' ')[0].toLowerCase()}-and-${pair.r2.split(' ')[0].toLowerCase()}-kundali-matching`;
  allGeneratedPages.push({
    slug: slugSlug,
    title: `${pair.r1} and ${pair.r2} Kundali Matching Compatibility | Mannat`,
    h1: `${pair.r1} and ${pair.r2} Horoscope Compatibility & 36 Gun Milan`,
    eyebrow: `Vedic Astrology · Rashi Milan · Ashtakoot Analysis`,
    description: `Detailed Vedic horoscope and Kundali matching analysis between ${pair.r1} and ${pair.r2}. Understand Ashtakoot score, emotional harmony, and marriage compatibility.`,
    keywordFocus: `${pair.r1} and ${pair.r2} kundali matching, horoscope compatibility ${pair.r1} ${pair.r2}, 36 gun milan score`,
    introText: `Evaluating the astrological alliance between ${pair.r1} and ${pair.r2}. Discover detailed Ashtakoot Gun Milan points, planetary lord alignments, and marital guidance.`,
    category: 'Kundali Compatibility',
    faqs: [
      { q: `Are ${pair.r1} and ${pair.r2} compatible for marriage?`, a: `According to Vedic astrology, this combination provides favorable elemental harmony and mutual life support.` }
    ]
  });
}

console.log(`Generated ${allGeneratedPages.length} programmatic pages.`);

// HTML Generator function
function generatePageHtml(p) {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mannatmatrimony.com/" },
        { "@type": "ListItem", "position": 2, "name": p.h1, "item": `https://mannatmatrimony.com/${p.slug}` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": p.faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": p.title,
      "serviceType": "Matrimonial Matchmaking Service",
      "provider": {
        "@type": "Organization",
        "name": "Mannat Matrimony",
        "url": "https://mannatmatrimony.com",
        "logo": "https://mannatmatrimony.com/favicon.png",
        "telephone": "+91-97383-97933"
      },
      "description": p.description,
      "url": `https://mannatmatrimony.com/${p.slug}`
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

  <meta property="og:type" content="website">
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
    body { background-color: var(--bg-dark); color: var(--text-main); font-family: 'Plus Jakarta Sans', sans-serif; line-height: 1.6; }
    a { color: inherit; text-decoration: none; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

    .site-nav { position: sticky; top: 0; z-index: 100; background: rgba(7,9,14,0.9); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border-subtle); padding: 16px 0; }
    .nav-wrapper { display: flex; align-items: center; justify-content: space-between; }
    .brand-logo { font-family: 'Cinzel', serif; font-size: 22px; font-weight: 700; letter-spacing: 2px; color: var(--gold-light); display: flex; align-items: center; gap: 8px; }
    .brand-logo img { width: 32px; height: 32px; border-radius: 50%; }

    .hero { text-align: center; padding: 70px 0 50px; background: radial-gradient(circle at 50% 20%, rgba(212,175,55,0.1) 0%, transparent 70%); }
    .eyebrow { display: inline-block; padding: 6px 16px; background: rgba(212,175,55,0.1); border: 1px solid var(--border-subtle); border-radius: 9999px; font-size: 13px; font-weight: 600; color: var(--gold-light); text-transform: uppercase; margin-bottom: 20px; }
    .hero h1 { font-family: 'Cinzel', serif; font-size: clamp(28px, 4.5vw, 48px); margin-bottom: 16px; color: #FFF; }
    .hero p { color: var(--text-muted); font-size: 17px; max-width: 750px; margin: 0 auto 30px; line-height: 1.7; }

    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 28px; border-radius: 9999px; font-weight: 600; font-size: 14px; cursor: pointer; }
    .btn-primary { background: linear-gradient(135deg, var(--gold-light), var(--gold-primary), var(--gold-dark)); color: #07090E; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3); }

    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin: 60px 0; }
    .card { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 32px; }
    .card h3 { font-family: 'Cinzel', serif; font-size: 20px; color: var(--gold-light); margin-bottom: 10px; }
    .card p { color: var(--text-muted); font-size: 14px; }

    .faq-sec { padding: 60px 0; border-top: 1px solid var(--border-subtle); }
    .faq-sec h2 { font-family: 'Cinzel', serif; font-size: 28px; text-align: center; color: #FFF; margin-bottom: 30px; }
    .faq-item { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px; margin-bottom: 16px; }
    .faq-q { font-weight: 700; color: #FFF; margin-bottom: 6px; }
    .faq-a { color: var(--text-muted); font-size: 14px; }

    footer { border-top: 1px solid var(--border-subtle); padding: 40px 0; text-align: center; color: var(--text-muted); font-size: 13px; }
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
      <a href="https://mannatmatrimony.com/" class="btn btn-primary">Join Verified Sanctuary →</a>
    </div>
  </nav>

  <header class="hero">
    <div class="container">
      <div class="eyebrow">✨ ${p.eyebrow}</div>
      <h1>${p.h1}</h1>
      <p>${p.introText}</p>
      <a href="https://mannatmatrimony.com/" class="btn btn-primary">Explore Verified Profiles Free →</a>
    </div>
  </header>

  <main class="container">
    <div class="grid-3">
      <div class="card">
        <h3>🛡️ 100% ID Verified</h3>
        <p>Government ID and degree authentication before any profile goes live.</p>
      </div>
      <div class="card">
        <h3>🔒 BlurShield™ Security</h3>
        <p>Zero public photo scraping. Candidate portraits are blurred from search engines.</p>
      </div>
      <div class="card">
        <h3>🔮 Kundli Gun Milan</h3>
        <p>Instant Vedic Ashtakoot 36-point compatibility scoring and Gotra transparency.</p>
      </div>
    </div>

    <section class="faq-sec">
      <h2>Frequently Asked Questions</h2>
      ${p.faqs.map(f => `
        <div class="faq-item">
          <div class="faq-q">${f.q}</div>
          <div class="faq-a">${f.a}</div>
        </div>
      `).join('')}
    </section>
  </main>

  <footer>
    <div class="container">
      <p>© ${new Date().getFullYear()} Mannat Matrimony · www.mannatmatrimony.com</p>
    </div>
  </footer>

</body>
</html>`;
}

// 5. WRITE ALL 512+ PAGES TO DISK
console.log('Writing all programmatic pages to public/...');
let writtenCount = 0;
for (const p of allGeneratedPages) {
  const dir = path.join(publicDir, p.slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), generatePageHtml(p), 'utf-8');
  writtenCount++;
}
console.log(`✅ Successfully generated ${writtenCount} static landing pages in public/!`);

// 6. GENERATE SITEMAP WITH ALL 512+ URLS
const nowIso = new Date().toISOString().split('T')[0];
const allUrls = [
  'https://mannatmatrimony.com/',
  'https://mannatmatrimony.com/about',
  'https://mannatmatrimony.com/safety',
  'https://mannatmatrimony.com/privacy',
  'https://mannatmatrimony.com/terms',
  'https://mannatmatrimony.com/marriage-biodata-maker',
  'https://mannatmatrimony.com/kundali-matching-matrimony',
  'https://mannatmatrimony.com/ask',
  'https://mannatmatrimony.com/luxury-marriage-biodata-format-pdf',
  'https://mannatmatrimony.com/marriage-biodata-for-doctors-format-example',
  'https://mannatmatrimony.com/private-matrimonial-app-with-photo-privacy',
  'https://mannatmatrimony.com/4-gotra-rule-in-hindu-marriage-explained',
  'https://mannatmatrimony.com/nri-h1b-marriage-visa-and-background-checklist',
  ...allGeneratedPages.map(p => `https://mannatmatrimony.com/${p.slug}`)
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls.map(u => `  <url>
    <loc>${u}</loc>
    <lastmod>${nowIso}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
    <image:image>
      <image:loc>https://mannatmatrimony.com/og-image.jpg</image:loc>
      <image:title>Mannat Matrimony</image:title>
    </image:image>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
console.log(`✅ Generated public/sitemap.xml with ${allUrls.length} total URLs!`);

// 7. GENERATE RSS XML
const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Mannat Matrimony - Verified Matchmaking Directory</title>
    <link>https://mannatmatrimony.com</link>
    <description>Directory of 500+ verified Indian &amp; NRI matrimonial communities and cities.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://mannatmatrimony.com/rss.xml" rel="self" type="application/rss+xml" />
    ${allUrls.slice(0, 100).map(u => `
    <item>
      <title>${u.replace('https://mannatmatrimony.com/', '').replace('/', '') || 'Home'}</title>
      <link>${u}</link>
      <guid>${u}</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
    </item>`).join('\n')}
  </channel>
</rss>`;

fs.writeFileSync(path.join(publicDir, 'rss.xml'), rssXml, 'utf-8');
fs.writeFileSync(path.join(publicDir, 'feed.xml'), rssXml, 'utf-8');
console.log('✅ Generated public/rss.xml and public/feed.xml');

console.log('🚀 Complete 500+ Page Programmatic SEO Powerhouse Suite Generated Successfully!');
