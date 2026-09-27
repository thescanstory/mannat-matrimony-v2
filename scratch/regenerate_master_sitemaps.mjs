import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const BASE_URL = 'https://mannatmatrimony.com';

const dirs = fs.readdirSync(PUBLIC_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory() && fs.existsSync(path.join(PUBLIC_DIR, d.name, 'index.html')))
  .map(d => d.name);

// Root + directories
const allSlugs = ['', ...dirs.sort()];

console.log(`Found ${allSlugs.length} total indexable routes in public/`);

const now = new Date().toISOString().split('T')[0];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allSlugs.map(slug => {
  const url = slug ? `${BASE_URL}/${slug}` : BASE_URL;
  const priority = slug === '' ? '1.0' : (slug.includes('marriage-biodata') || slug.includes('kundali') ? '0.9' : '0.8');
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
    <image:image>
      <image:loc>${BASE_URL}/og-preview.png</image:loc>
      <image:title>Mannat Matrimony - India's Premier Private Matrimonial Sanctuary</image:title>
    </image:image>
  </url>`;
}).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');

const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Mannat Matrimony Network & Guides</title>
    <link>${BASE_URL}</link>
    <description>Verified Private Matrimonial Sanctuary for Discerning Indian Families.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${allSlugs.slice(0, 100).map(slug => {
  const url = slug ? `${BASE_URL}/${slug}` : BASE_URL;
  const cleanTitle = slug ? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Mannat Matrimony';
  return `    <item>
      <title>${cleanTitle}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
    </item>`;
}).join('\n')}
  </channel>
</rss>`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'rss.xml'), rssXml, 'utf-8');
fs.writeFileSync(path.join(PUBLIC_DIR, 'feed.xml'), rssXml, 'utf-8');

console.log(`✅ Master sitemaps updated successfully with ${allSlugs.length} total URLs!`);
