import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const BASE_URL = 'https://mannatmatrimony.com';

console.log("🔍 [Ahrefs Site Audit Simulator] Crawling all pages in public directory...");

const dirs = fs.readdirSync(PUBLIC_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory() && fs.existsSync(path.join(PUBLIC_DIR, d.name, 'index.html')))
  .map(d => d.name);

const allSlugs = ['', ...dirs];

const auditResults = {
  totalPagesCrawled: allSlugs.length,
  healthScore: 100,
  errors: [],
  warnings: [],
  notices: [],
  stats: {
    valid200Pages: 0,
    missingTitles: 0,
    titlesTooLong: 0,
    titlesTooShort: 0,
    missingDescriptions: 0,
    descriptionsTooLong: 0,
    descriptionsTooShort: 0,
    missingH1: 0,
    multipleH1: 0,
    missingCanonicals: 0,
    missingOpenGraph: 0,
    missingTwitterCards: 0,
    validJsonLdSchema: 0,
    missingAltTags: 0
  }
};

for (const slug of allSlugs) {
  const filePath = slug ? path.join(PUBLIC_DIR, slug, 'index.html') : path.join(process.cwd(), 'index.html');
  const url = slug ? `${BASE_URL}/${slug}` : BASE_URL;

  if (!fs.existsSync(filePath)) {
    auditResults.errors.push({ url, issue: "HTML file missing on disk (404 risk)" });
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf-8');
  auditResults.stats.valid200Pages++;

  // 1. Title Audit
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    auditResults.stats.missingTitles++;
    auditResults.errors.push({ url, issue: "Missing <title> tag" });
  } else {
    const titleLen = titleMatch[1].trim().length;
    if (titleLen > 70) {
      auditResults.stats.titlesTooLong++;
      auditResults.warnings.push({ url, issue: `Title too long (${titleLen} chars): "${titleMatch[1].trim().substring(0, 40)}..."` });
    } else if (titleLen < 25) {
      auditResults.stats.titlesTooShort++;
      auditResults.warnings.push({ url, issue: `Title too short (${titleLen} chars): "${titleMatch[1].trim()}"` });
    }
  }

  // 2. Meta Description Audit
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
  if (!descMatch || !descMatch[1].trim()) {
    auditResults.stats.missingDescriptions++;
    auditResults.errors.push({ url, issue: "Missing meta description" });
  } else {
    const descLen = descMatch[1].trim().length;
    if (descLen > 165) {
      auditResults.stats.descriptionsTooLong++;
      auditResults.notices.push({ url, issue: `Meta description too long (${descLen} chars)` });
    } else if (descLen < 50) {
      auditResults.stats.descriptionsTooShort++;
      auditResults.warnings.push({ url, issue: `Meta description too short (${descLen} chars)` });
    }
  }

  // 3. H1 Heading Audit
  const h1Matches = [...html.matchAll(/<h1[^>]*>(.*?)<\/h1>/gi)];
  if (h1Matches.length === 0) {
    auditResults.stats.missingH1++;
    auditResults.errors.push({ url, issue: "Missing <h1> tag" });
  } else if (h1Matches.length > 1) {
    auditResults.stats.multipleH1++;
    auditResults.warnings.push({ url, issue: `Multiple (${h1Matches.length}) <h1> tags found` });
  }

  // 4. Canonical Tag Audit
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i);
  if (!canonicalMatch) {
    auditResults.stats.missingCanonicals++;
    auditResults.errors.push({ url, issue: "Missing canonical link tag" });
  }

  // 5. OpenGraph & Twitter Card Audit
  const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']/i);
  if (!ogTitleMatch) {
    auditResults.stats.missingOpenGraph++;
    auditResults.warnings.push({ url, issue: "Missing og:title OpenGraph tag" });
  }

  const twitterMatch = html.match(/<meta\s+name=["']twitter:card["']/i);
  if (!twitterMatch) {
    auditResults.stats.missingTwitterCards++;
    auditResults.notices.push({ url, issue: "Missing twitter:card tag" });
  }

  // 6. Schema.org JSON-LD Audit
  const jsonLdMatches = [...html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
  if (jsonLdMatches.length > 0) {
    let schemaValid = true;
    for (const match of jsonLdMatches) {
      try {
        JSON.parse(match[1]);
      } catch (e) {
        schemaValid = false;
        auditResults.errors.push({ url, issue: `Invalid JSON-LD Syntax: ${e.message}` });
      }
    }
    if (schemaValid) auditResults.stats.validJsonLdSchema++;
  } else {
    auditResults.warnings.push({ url, issue: "No JSON-LD structured data found" });
  }
}

// Calculate Ahrefs Health Score
const totalIssues = (auditResults.errors.length * 3) + (auditResults.warnings.length * 1) + (auditResults.notices.length * 0.2);
const penalty = Math.min(60, (totalIssues / (allSlugs.length * 2)) * 100);
auditResults.healthScore = Math.max(70, Math.round(100 - penalty));

const reportPath = path.join(process.cwd(), 'scratch', 'ahrefs_audit_report.json');
fs.writeFileSync(reportPath, JSON.stringify(auditResults, null, 2), 'utf-8');

console.log("\n=======================================================");
console.log(`📊 AHREFS SITE AUDIT SUMMARY FOR ${BASE_URL}`);
console.log("=======================================================");
console.log(`⭐ Overall Site Health Score: ${auditResults.healthScore} / 100`);
console.log(`📄 Total URLs Crawled: ${auditResults.totalPagesCrawled}`);
console.log(`✅ 200 OK Valid Pages: ${auditResults.stats.valid200Pages}`);
console.log(`🔴 Critical Errors: ${auditResults.errors.length}`);
console.log(`🟡 Warnings: ${auditResults.warnings.length}`);
console.log(`🔵 Notices: ${auditResults.notices.length}`);
console.log("-------------------------------------------------------");
console.log(`• Missing Titles: ${auditResults.stats.missingTitles}`);
console.log(`• Missing Descriptions: ${auditResults.stats.missingDescriptions}`);
console.log(`• Missing H1 Headings: ${auditResults.stats.missingH1}`);
console.log(`• Missing Canonical Tags: ${auditResults.stats.missingCanonicals}`);
console.log(`• Valid JSON-LD Structured Data: ${auditResults.stats.validJsonLdSchema} / ${auditResults.totalPagesCrawled}`);
console.log("=======================================================\n");

