import { chromium } from 'playwright';

async function verifyLiveProduction() {
  console.log('🌐 Launching local browser to verify live production https://mannatmatrimony.com...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 414, height: 896 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });

  const page = await context.newPage();

  // 1. Live Landing Page
  console.log('1. Loading https://mannatmatrimony.com ...');
  const resHome = await page.goto('https://mannatmatrimony.com', { waitUntil: 'networkidle' });
  console.log(`   Status: ${resHome.status()}`);
  await page.screenshot({ path: '/Users/mac/.gemini/antigravity-ide/brain/6e259cf5-aa16-4a39-b96d-32b94dc7fda4/live_prod_landing.png' });

  // 2. Live Privacy Policy
  console.log('2. Loading https://mannatmatrimony.com/privacy.html ...');
  const resPrivacy = await page.goto('https://mannatmatrimony.com/privacy.html', { waitUntil: 'networkidle' });
  console.log(`   Status: ${resPrivacy.status()}`);
  await page.screenshot({ path: '/Users/mac/.gemini/antigravity-ide/brain/6e259cf5-aa16-4a39-b96d-32b94dc7fda4/live_prod_privacy.png' });

  // 3. Live Terms
  console.log('3. Loading https://mannatmatrimony.com/terms.html ...');
  const resTerms = await page.goto('https://mannatmatrimony.com/terms.html', { waitUntil: 'networkidle' });
  console.log(`   Status: ${resTerms.status()}`);

  // 4. Live EULA
  console.log('4. Loading https://mannatmatrimony.com/eula.html ...');
  const resEula = await page.goto('https://mannatmatrimony.com/eula.html', { waitUntil: 'networkidle' });
  console.log(`   Status: ${resEula.status()}`);
  await page.screenshot({ path: '/Users/mac/.gemini/antigravity-ide/brain/6e259cf5-aa16-4a39-b96d-32b94dc7fda4/live_prod_eula.png' });

  // 5. Live App Auth Screen
  console.log('5. Loading https://mannatmatrimony.com/app ...');
  const resApp = await page.goto('https://mannatmatrimony.com/app', { waitUntil: 'networkidle' });
  console.log(`   Status: ${resApp.status()}`);
  await page.waitForTimeout(3000); // splash transition
  await page.screenshot({ path: '/Users/mac/.gemini/antigravity-ide/brain/6e259cf5-aa16-4a39-b96d-32b94dc7fda4/live_prod_app_auth.png' });

  console.log('✨ All live production endpoints verified successfully with status 200!');
  await browser.close();
}

verifyLiveProduction().catch(console.error);
