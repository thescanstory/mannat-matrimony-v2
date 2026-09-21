import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173/app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click on the first candidate card to open dossier modal
  const card = await page.$('h3:has-text("Meera Kapur")');
  if (card) {
    await card.click();
    await page.waitForTimeout(1000);
  }

  await page.screenshot({ path: '/Users/mac/.gemini/antigravity-ide/brain/3b2168fa-b4d1-4261-9459-847a015a965b/desktop_modal_view.png', fullPage: false });
  await browser.close();
  console.log('✅ Modal screenshot captured');
}

run().catch(console.error);
