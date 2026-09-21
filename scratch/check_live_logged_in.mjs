import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://www.mannatmatrimony.com/app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500);

  const emailInput = await page.$('input[type="email"]');
  if (emailInput) {
    await emailInput.fill('member@mannatmatrimony.com');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
  }

  await page.screenshot({ path: '/Users/mac/.gemini/antigravity-ide/brain/3b2168fa-b4d1-4261-9459-847a015a965b/live_prod_logged_in.png', fullPage: false });
  await browser.close();
  console.log('✅ Live production logged in screenshot captured after timeout');
}

run().catch(console.error);
