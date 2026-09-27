import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

console.log("🛠️ [Ahrefs Fixer] Optimizing titles, descriptions, and Twitter tags across all pages...");

const dirs = fs.readdirSync(PUBLIC_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory() && fs.existsSync(path.join(PUBLIC_DIR, d.name, 'index.html')));

let fixedCount = 0;

for (const dir of dirs) {
  const filePath = path.join(PUBLIC_DIR, dir.name, 'index.html');
  let html = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // 1. Fix Title length if > 65 characters
  html = html.replace(/<title>(.*?)<\/title>/i, (match, title) => {
    let clean = title.trim();
    if (clean.length > 65) {
      clean = clean
        .replace(/ \| Verified .* Matches/gi, ' | Mannat')
        .replace(/ \| Verified .* Profiles/gi, ' | Mannat')
        .replace(/ \| Verified .* Guide/gi, ' | Mannat')
        .replace(/ \| Dedicated .* Bureau/gi, ' | Mannat')
        .replace(/Matrimonial Sanctuary in /gi, 'Matrimony ')
        .replace(/Matrimonial Alliance Hub in /gi, 'Matrimony ')
        .replace(/Civil Services & IAS \/ IPS Matrimony/gi, 'IAS & IPS Matrimony')
        .replace(/Remarriage & Second Marriage Matrimony/gi, 'Remarriage Matrimony')
        .replace(/Best Matrimonial Sites in /gi, 'Top Matrimony Sites ')
        .replace(/Top Matrimony Platforms in India \(2026\)/gi, 'Top Matrimony Platforms in India');
      
      if (clean.length > 65) {
        clean = clean.substring(0, 62) + '...';
      }
      modified = true;
    }
    return `<title>${clean}</title>`;
  });

  // 2. Fix Meta Description if > 158 characters
  html = html.replace(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i, (match, desc) => {
    let clean = desc.trim();
    if (clean.length > 158) {
      clean = clean.substring(0, 155).trim() + '...';
      modified = true;
    }
    return `<meta name="description" content="${clean}">`;
  });

  // 3. Inject twitter:card if missing
  if (!html.includes('name="twitter:card"')) {
    html = html.replace('</head>', `  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@mannatmatrimony">
</head>`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, html, 'utf-8');
    fixedCount++;
  }
}

console.log(`✅ Ahrefs Optimization complete! Updated ${fixedCount} pages.`);
