import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173/app', { waitUntil: 'networkidle0' });

  // Wait a moment for animations
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: 'scratch/desktop_web_app_feed.png' });
  console.log('Saved scratch/desktop_web_app_feed.png');

  await browser.close();
})();
