import fs from 'fs';
import path from 'path';

// 1. New High-Converting Search Clusters
const IAS_IPS_CITIES = [
  { city: "Delhi NCR", slug: "delhi" },
  { city: "Lucknow", slug: "lucknow" },
  { city: "Jaipur", slug: "jaipur" },
  { city: "Chandigarh", slug: "chandigarh" },
  { city: "Patna", slug: "patna" },
  { city: "Hyderabad", slug: "hyderabad" },
  { city: "Bhopal", slug: "bhopal" },
  { city: "Dehradun", slug: "dehradun" },
  { city: "Bangalore", slug: "bangalore" }
];

const JAIN_COMMUNITIES = [
  { name: "Digambar Jain", slug: "digambar-jain" },
  { name: "Shwetambar Jain", slug: "shwetambar-jain" },
  { name: "Oswal Jain", slug: "oswal-jain" },
  { name: "Khandelwal Jain", slug: "khandelwal-jain" },
  { name: "Porwal Jain", slug: "porwal-jain" }
];

const TOP_METROS = [
  { city: "Mumbai", slug: "mumbai" },
  { city: "Delhi NCR", slug: "delhi" },
  { city: "Ahmedabad", slug: "ahmedabad" },
  { city: "Jaipur", slug: "jaipur" },
  { city: "Pune", slug: "pune" },
  { city: "Bangalore", slug: "bangalore" },
  { city: "Indore", slug: "indore" },
  { city: "Surat", slug: "surat" },
  { city: "Kolkata", slug: "kolkata" },
  { city: "Chennai", slug: "chennai" }
];

const REMARRIAGE_CITIES = [
  { city: "Delhi NCR", slug: "delhi" },
  { city: "Mumbai", slug: "mumbai" },
  { city: "Bangalore", slug: "bangalore" },
  { city: "Pune", slug: "pune" },
  { city: "Hyderabad", slug: "hyderabad" },
  { city: "Chandigarh", slug: "chandigarh" },
  { city: "Ahmedabad", slug: "ahmedabad" },
  { city: "Kolkata", slug: "kolkata" },
  { city: "Chennai", slug: "chennai" },
  { city: "USA & Global NRI", slug: "usa" }
];

const NRI_SUPER_HUBS = [
  { title: "NRI Punjabi Matrimony Canada (Toronto & Vancouver)", slug: "nri-punjabi-matrimony-canada-vancouver", region: "Canada (Ontario & British Columbia)" },
  { title: "NRI Telugu Matrimony USA (Bay Area, Dallas & Seattle)", slug: "nri-telugu-matrimony-usa-bay-area", region: "USA (Silicon Valley, Texas & Washington)" },
  { title: "NRI Gujarati Matrimony UK (London & Leicester)", slug: "nri-gujarati-matrimony-uk-london", region: "United Kingdom (London & Midlands)" },
  { title: "NRI Tamil Matrimony Singapore & Malaysia", slug: "nri-tamil-matrimony-singapore-malaysia", region: "Southeast Asia (Singapore & KL)" },
  { title: "NRI Marwari Matrimony UAE (Dubai & Abu Dhabi)", slug: "nri-marwari-matrimony-uae-dubai", region: "UAE & Middle East" },
  { title: "NRI Kerala Matrimony USA & Gulf", slug: "nri-kerala-matrimony-usa-gulf", region: "North America & GCC" }
];

const MORE_GOTRAS = [
  "Singhal", "Mittal", "Goyal", "Kashyap", "Vatsa", "Sandilya", "Mudgala", 
  "Parashar", "Kaushik", "Shandilya", "Atri", "Harita", "Gautam", "Srivatsa"
];

console.log("Generating additional high-intent clusters...");

let createdCount = 0;

function createPage(slug, title, desc, h1, intro, points, faqs) {
  const dir = path.join(process.cwd(), 'public', slug);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const faqJsonLd = faqs.map(f => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": f.a
    }
  }));

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://mannatmatrimony.com/${slug}#webpage`,
        "url": `https://mannatmatrimony.com/${slug}`,
        "name": title,
        "description": desc,
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mannatmatrimony.com" },
            { "@type": "ListItem", "position": 2, "name": title, "item": `https://mannatmatrimony.com/${slug}` }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqJsonLd
      }
    ]
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="https://mannatmatrimony.com/${slug}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="https://mannatmatrimony.com/${slug}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Mannat Matrimony">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${desc}">
  <script type="application/ld+json">
  ${JSON.stringify(schema, null, 2)}
  </script>
  <style>
    :root { --gold: #C5A880; --gold-dark: #9A7B4F; --bg: #0C0A09; --card: #1C1917; --border: #292524; --text: #F5F5F4; --muted: #A8A29E; }
    * { margin:0; padding:0; box-sizing:border-box; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,sans-serif; }
    body { background:var(--bg); color:var(--text); line-height:1.6; padding:0 20px; }
    .container { max-width:960px; margin:0 auto; padding:40px 0; }
    .header { text-align:center; padding:40px 0 20px; }
    .badge { display:inline-block; padding:6px 14px; background:rgba(197,168,128,0.1); border:1px solid var(--gold); color:var(--gold); border-radius:50px; font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:1px; margin-bottom:16px; }
    h1 { font-size:2.4rem; color:#fff; margin-bottom:16px; font-weight:700; line-height:1.2; }
    .intro { font-size:1.15rem; color:var(--muted); max-width:760px; margin:0 auto 30px; }
    .btn { display:inline-block; background:linear-gradient(135deg,var(--gold),var(--gold-dark)); color:#0C0A09; font-weight:700; padding:14px 32px; border-radius:30px; text-decoration:none; margin:10px 6px; transition:transform 0.2s; box-shadow:0 8px 24px rgba(197,168,128,0.25); }
    .btn:hover { transform:scale(1.03); }
    .card-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:20px; margin:40px 0; }
    .card { background:var(--card); border:1px solid var(--border); border-radius:16px; padding:28px; transition:border-color 0.2s; }
    .card:hover { border-color:var(--gold); }
    .card h3 { color:var(--gold); font-size:1.25rem; margin-bottom:12px; }
    .card p { color:var(--muted); font-size:0.95rem; }
    .faq-section { margin:50px 0; background:var(--card); border:1px solid var(--border); border-radius:16px; padding:32px; }
    .faq-item { margin-bottom:24px; border-bottom:1px solid var(--border); padding-bottom:16px; }
    .faq-item:last-child { border-bottom:none; margin-bottom:0; padding-bottom:0; }
    .faq-q { color:#fff; font-weight:600; font-size:1.1rem; margin-bottom:8px; }
    .faq-a { color:var(--muted); font-size:0.95rem; }
    .nav-silo { margin:40px 0; padding:24px; background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:16px; text-align:center; }
    .nav-silo a { color:var(--gold); text-decoration:none; margin:0 12px; font-size:0.9rem; }
    .nav-silo a:hover { text-decoration:underline; }
    .footer { text-align:center; padding:40px 0; color:var(--muted); font-size:0.85rem; border-top:1px solid var(--border); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">100% ID-Verified • Confidential Matches</div>
      <h1>${h1}</h1>
      <p class="intro">${intro}</p>
      <div>
        <a href="/app" class="btn">Explore Verified Candidates</a>
        <a href="/marriage-biodata-maker" class="btn" style="background:transparent; border:1px solid var(--gold); color:var(--gold);">Free Marriage Biodata Maker</a>
      </div>
    </div>

    <div class="card-grid">
      ${points.map(p => `
      <div class="card">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
      </div>`).join('')}
    </div>

    <div class="faq-section">
      <h2 style="color:#fff; margin-bottom:24px; font-size:1.6rem; text-align:center;">Frequently Asked Questions</h2>
      ${faqs.map(f => `
      <div class="faq-item">
        <div class="faq-q">Q: ${f.q}</div>
        <div class="faq-a">${f.a}</div>
      </div>`).join('')}
    </div>

    <div class="nav-silo">
      <p style="color:#fff; font-weight:600; margin-bottom:12px;">Explore Related Matchmaking Hubs</p>
      <a href="/marriage-biodata-maker">Marriage Biodata Maker (Free PDF)</a>
      <a href="/kundali-matching-matrimony">36 Gun Milan Calculator</a>
      <a href="/delhi-matrimony">Delhi Matrimony</a>
      <a href="/mumbai-matrimony">Mumbai Matrimony</a>
      <a href="/bangalore-matrimony">Bangalore Matrimony</a>
      <a href="/ask">Ask Mannat Hub</a>
    </div>

    <div class="footer">
      <p>© 2026 Mannat Matrimony • India's Premier Private Matrimonial Sanctuary.</p>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8');
  createdCount++;
}

// 1. Civil Services / IAS / IPS Pages
IAS_IPS_CITIES.forEach(c => {
  createPage(
    `civil-services-ias-ips-matrimony-${c.slug}`,
    `Civil Services & IAS / IPS Matrimony ${c.city} | Verified Bureaucrats Matchmaking`,
    `Find verified IAS, IPS, IFS, IRS, and Civil Services matrimonial matches in ${c.city}. Confidential background verification, BlurShield™ privacy, and prestigious family alliances on Mannat.`,
    `Civil Services, IAS & IPS Matrimonial Sanctuary in ${c.city}`,
    `Mannat Matrimony connects distinguished Civil Servants, IAS, IPS, IFS, and State Administrative Service officers in ${c.city} with cultured, intellectual, and accomplished families.`,
    [
      { title: "Service Cadre & Batch Verification", desc: "Mandatory civil service ID and service cadre verification ensuring complete authenticity and prestige." },
      { title: "Zero Public Photo Scraping", desc: "Confidentiality guaranteed through proprietary BlurShield™ privacy controls designed for public servants." },
      { title: "Family Background & Values", desc: "Dedicated matchmaking for families valuing civil servant dedication, ethics, and intellectual compatibility." }
    ],
    [
      { q: `How does Mannat verify IAS and IPS profiles in ${c.city}?`, a: "Every bureaucrat profile undergoes manual service credential verification and background confirmation before activation." },
      { q: "Can civil servants keep their photos private on Mannat?", a: "Yes. Photos remain blurred under BlurShield™ and are only revealed with mutual parental and candidate consent." },
      { q: `Is Mannat free to join for Civil Servants in ${c.city}?`, a: "Registration, biodata generation, and profile discovery are completely complimentary for verified candidates." }
    ]
  );
});

// 2. Jain Sect Hubs
JAIN_COMMUNITIES.forEach(j => {
  TOP_METROS.forEach(m => {
    createPage(
      `${j.slug}-matrimony-${m.slug}`,
      `${j.name} Matrimony ${m.city} | Verified Vegetarian Business & Professional Matches`,
      `Exclusive ${j.name} matrimonial matches in ${m.city}. 100% ID-verified profiles, strict vegetarian family values, gotra compatibility, and business family matches on Mannat.`,
      `${j.name} Matrimonial Alliance Hub in ${m.city}`,
      `Discover verified ${j.name} brides and grooms in ${m.city} upholding traditional Jain values, ahimsa, vegetarianism, and modern entrepreneurial success.`,
      [
        { title: "Strict Jain Values & Dietary Harmony", desc: "Filtered exclusively for families practicing vegetarianism, Jain traditions, and cultural ceremonies." },
        { title: "100% Government ID Verified", desc: "Government ID validation on all profiles to protect family trust and eliminate unverified entries." },
        { title: "Gotra & Shakha Alignment", desc: "Granular filters for Jain gotras, business families, CAs, Doctors, and tech executives in ${m.city}." }
      ],
      [
        { q: `Why choose Mannat for ${j.name} matchmaking in ${m.city}?`, a: `Mannat offers a private, secure sanctuary tailored for modern ${j.name} families in ${m.city} without public photo exposure.` },
        { q: "Are gotra and family background filters available?", a: "Yes, you can filter candidates by gotra, parental business background, education, and dietary choices." }
      ]
    );
  });
});

// 3. Remarriage & Second Marriage Pages
REMARRIAGE_CITIES.forEach(r => {
  createPage(
    `remarriage-and-divorcee-matrimony-${r.slug}`,
    `Remarriage & Second Marriage Matrimony ${r.city} | Private & Dignified Matchmaking`,
    `Find dignified, verified remarriage, divorcee, and widowed matrimonial matches in ${r.city}. 100% privacy, legal verification, and compassionate matchmaking on Mannat.`,
    `Dignified Remarriage & Second Marriage Matchmaking in ${r.city}`,
    `Mannat Matrimony provides a supportive, confidential, and highly verified sanctuary for educated professionals and business owners seeking a second chance at lifelong companionship in ${r.city}.`,
    [
      { title: "Legal Status & Custody Transparency", desc: "Clear, verified legal documentation and transparent mutual expectations for complete peace of mind." },
      { title: "Discrete & Confidential Matching", desc: "No public listings. Complete control over profile visibility and photo sharing." },
      { title: "Mature & Cultured Profiles", desc: "Connecting mature professionals, entrepreneurs, and caring partners focused on companionship and shared life goals." }
    ],
    [
      { q: `How does Mannat protect privacy for remarriage profiles in ${r.city}?`, a: "Profiles and portraits are protected under BlurShield™. Your matrimonial profile is never indexed publicly or shown to unverified users." },
      { q: "Are divorce decrees verified?", a: "Yes, our team ensures transparent verification of marital status documentation to maintain absolute community safety." }
    ]
  );
});

// 4. NRI Super Hubs
NRI_SUPER_HUBS.forEach(n => {
  createPage(
    n.slug,
    `${n.title} | Verified Matches`,
    `Exclusive matchmaking for ${n.title}. 100% ID-verified professionals, H-1B, PR, and Citizen background verification on Mannat.`,
    `${n.title}`,
    `Mannat connects established Indian families in ${n.region} with top-tier professionals and business families globally.`,
    [
      { title: "Visa & Status Verification", desc: "Dedicated verification of H-1B, PR, and citizenship credentials." },
      { title: "Global Timezone Matchmaking", desc: "Seamless virtual matchmaking and direct family-to-family introductions." },
      { title: "Cultural & Lifestyle Harmony", desc: "Balancing international professional success with authentic Indian family traditions." }
    ],
    [
      { q: `How do global families connect on Mannat?`, a: "Our platform supports cross-border matchmaking with verified contact sharing and direct WhatsApp dossiers." },
      { q: `Is background check available for NRI profiles in ${n.region}?`, a: "Yes, Mannat performs identity, employment, and education verification on all candidate submissions." }
    ]
  );
});

// 5. Additional Elite Gotras
MORE_GOTRAS.forEach(g => {
  createPage(
    `${g.toLowerCase()}-gotra-matrimony-profiles`,
    `${g} Gotra Matrimony Profiles | Verified Brides & Grooms`,
    `Find verified matrimonial matches belonging to or seeking ${g} Gotra. 100% ID-verified profiles, gotra exogamy validation, and respectful Hindu matchmaking on Mannat.`,
    `${g} Gotra Matrimonial Directory & Profiles`,
    `Explore verified Hindu brides and grooms seeking alliance with or adhering to ${g} Gotra exogamy guidelines on Mannat Matrimony.`,
    [
      { title: "Strict Exogamy Adherence", desc: "Automated filters to ensure candidates avoid same-gotra unions per traditional Hindu norms." },
      { title: "100% Verified Lineage", desc: "Profiles verified with family lineage, parental origins, and educational credentials." },
      { title: "Private Profile Sharing", desc: "Direct WhatsApp biodata dossiers with confidential portrait protection." }
    ],
    [
      { q: `What is the significance of ${g} Gotra in marriage?`, a: `${g} is a venerable Vedic rishi gotra. Adherence to gotra exogamy ensures harmonious genetic and cultural alignment.` },
      { q: `Can I filter matches by ${g} Gotra?`, a: "Yes, Mannat allows you to filter and match according to gotra preferences and astrological compatibility." }
    ]
  );
});

console.log(`✅ Successfully generated ${createdCount} new specialized programmatic SEO pages!`);
