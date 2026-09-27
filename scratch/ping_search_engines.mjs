import https from 'https';
import http from 'http';

const SITEMAP_URL = encodeURIComponent('https://mannatmatrimony.com/sitemap.xml');
const RSS_URL = encodeURIComponent('https://mannatmatrimony.com/rss.xml');

const pingEndpoints = [
  `https://www.bing.com/ping?sitemap=${SITEMAP_URL}`,
  `https://www.google.com/ping?sitemap=${SITEMAP_URL}`,
  `https://rpc.pingomatic.com/`,
];

console.log('📡 Pinging Search Engines & Aggregators with latest sitemap and RSS...');

for (const url of pingEndpoints) {
  try {
    const req = https.get(url, (res) => {
      console.log(`[PING] ${url} -> Status ${res.statusCode}`);
    });
    req.on('error', (err) => {
      console.log(`[PING ERROR] ${url} -> ${err.message}`);
    });
  } catch (e) {
    console.log(`[EXCEPTION] ${url} -> ${e.message}`);
  }
}
