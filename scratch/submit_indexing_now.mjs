// Automated script to ping IndexNow and Search Engines with all sitemap URLs
const host = 'mannatmatrimony.com';
const key = '6343a4e2360e1f19a0c62d1b12eb32ab';
const keyLocation = `https://${host}/${key}.txt`;

const urlList = [
  'https://mannatmatrimony.com/',
  'https://mannatmatrimony.com/about',
  'https://mannatmatrimony.com/safety',
  'https://mannatmatrimony.com/privacy',
  'https://mannatmatrimony.com/terms',
  'https://mannatmatrimony.com/punjabi-matrimony',
  'https://mannatmatrimony.com/marwari-matrimony',
  'https://mannatmatrimony.com/agarwal-matrimony',
  'https://mannatmatrimony.com/gujarati-matrimony',
  'https://mannatmatrimony.com/jain-matrimony',
  'https://mannatmatrimony.com/brahmin-matrimony',
  'https://mannatmatrimony.com/rajput-matrimony',
  'https://mannatmatrimony.com/sindhi-matrimony',
  'https://mannatmatrimony.com/kayastha-matrimony',
  'https://mannatmatrimony.com/delhi-matrimony',
  'https://mannatmatrimony.com/mumbai-matrimony',
  'https://mannatmatrimony.com/matchmaking-bangalore',
  'https://mannatmatrimony.com/hyderabad-matrimony',
  'https://mannatmatrimony.com/pune-matrimony',
  'https://mannatmatrimony.com/nri-matrimony',
  'https://mannatmatrimony.com/elite-matrimony',
  'https://mannatmatrimony.com/matrimony-for-doctors',
  'https://mannatmatrimony.com/iit-iim-matrimony',
  'https://mannatmatrimony.com/verified-matrimony',
  'https://mannatmatrimony.com/photo-privacy-blurshield',
];

async function submitIndexNow() {
  console.log('Submitting ' + urlList.length + ' URLs to IndexNow API...');
  
  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow'
  ];

  const payload = {
    host: host,
    key: key,
    keyLocation: keyLocation,
    urlList: urlList
  };

  for (const endpoint of endpoints) {
    try {
      console.log(`Pinging ${endpoint}...`);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload)
      });
      console.log(`Response from ${endpoint}: status ${res.status} (${res.statusText})`);
    } catch (err) {
      console.error(`Error pinging ${endpoint}:`, err.message);
    }
  }

  // Ping Google Sitemap endpoint
  try {
    const sitemapUrl = `https://${host}/sitemap.xml`;
    console.log(`Pinging Google sitemap for ${sitemapUrl}...`);
    const googleRes = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
    console.log(`Google ping status: ${googleRes.status}`);
  } catch (err) {
    console.log(`Google ping note:`, err.message);
  }

  console.log('✅ Indexing submission completed successfully!');
}

submitIndexNow();
