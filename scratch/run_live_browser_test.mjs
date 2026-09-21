import { chromium } from 'playwright';

(async () => {
  console.log('🚀 Starting live browser test on https://www.mannatmatrimony.com/app ...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();

  // 1. Navigate to live production site
  await page.goto('https://www.mannatmatrimony.com/app', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Sign in with demo account
  const emailInput = page.locator('input[placeholder="name@example.com"], input[type="email"]').first();
  if (await emailInput.isVisible()) {
    console.log('Filling email for login...');
    await emailInput.fill('aditya.birla@mannat.com');
    const nameInput = page.locator('input[placeholder*="Rahul"], input[placeholder*="Name"]').first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Aditya Birla');
    }
    await page.getByRole('button', { name: /Sign In with Email/i }).click();
    await page.waitForTimeout(2000);
  }

  // 2. Discover Feed
  console.log('Capturing 1. Discover Feed...');
  await page.screenshot({ path: 'scratch/live_desktop_1_feed.png' });

  // 3. Test Search Filters Modal
  console.log('Testing Filters modal...');
  const filtersBtn = page.getByRole('button', { name: /Filters/i }).first();
  if (await filtersBtn.isVisible()) {
    await filtersBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scratch/live_desktop_filters_modal.png' });
    const closeBtn = page.getByTitle('Go Back').or(page.locator('button:has-text("✕"), button:has-text("Back")')).first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await page.waitForTimeout(500);
    }
  }

  // 4. Test VIP Memberships Modal
  console.log('Testing VIP Memberships modal...');
  const vipBtn = page.getByRole('button', { name: /VIP Memberships/i }).first();
  if (await vipBtn.isVisible()) {
    await vipBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scratch/live_desktop_paywall_modal.png' });
    const closePaywall = page.getByTitle('Close').or(page.getByTitle('Go Back')).first();
    if (await closePaywall.isVisible()) {
      await closePaywall.click();
      await page.waitForTimeout(500);
    }
  }

  // 5. Navigate to For You Tab
  console.log('Testing For You tab...');
  const forYouTab = page.getByRole('button', { name: /For You/i }).first();
  if (await forYouTab.isVisible()) {
    await forYouTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scratch/live_desktop_2_for_you.png' });
  }

  // 6. Navigate to Alliances Tab
  console.log('Testing Alliances tab...');
  const alliancesTab = page.getByRole('button', { name: /Alliances/i }).first();
  if (await alliancesTab.isVisible()) {
    await alliancesTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scratch/live_desktop_3_alliances.png' });
  }

  // 7. Navigate to My Profile Tab
  console.log('Testing My Profile tab...');
  const profileTab = page.getByRole('button', { name: /My Profile/i }).first();
  if (await profileTab.isVisible()) {
    await profileTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scratch/live_desktop_4_profile.png' });
  }

  console.log('✅ Browser tests completed successfully!');
  await browser.close();
})();
