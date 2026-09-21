import { chromium } from 'playwright';

(async () => {
  console.log('🚀 Testing local dev server at http://localhost:5173/app ...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();

  await page.addInitScript(() => {
    localStorage.setItem('mannat_splash_done', 'true');
    localStorage.setItem('mannat_auth_session', JSON.stringify({
      id: 'demo-user-1',
      email: 'aditya@mannat.com',
      user_metadata: { full_name: 'Aditya Birla' }
    }));
  });

  await page.goto('http://localhost:5173/app#home', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // If Auth screen is showing, fill and submit
  const emailInput = page.locator('input[placeholder="name@example.com"], input[type="email"]').first();
  if (await emailInput.isVisible()) {
    await emailInput.fill('aditya@mannat.com');
    await page.getByRole('button', { name: /Sign In with Email/i }).click();
    await page.waitForTimeout(1500);
  }

  // 1. Home Feed
  await page.screenshot({ path: 'scratch/local_desktop_1_feed.png' });

  // 2. Search Filters Modal
  const filtersBtn = page.getByRole('button', { name: /Filters/i }).first();
  if (await filtersBtn.isVisible()) {
    await filtersBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'scratch/local_desktop_filters_modal.png' });
    const closeBtn = page.getByTitle('Go Back').or(page.locator('button:has-text("✕"), button:has-text("Back")')).first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await page.waitForTimeout(400);
    }
  }

  // 3. VIP Memberships Modal
  const vipBtn = page.getByRole('button', { name: /VIP Memberships/i }).first();
  if (await vipBtn.isVisible()) {
    await vipBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'scratch/local_desktop_paywall_modal.png' });
    const closePaywall = page.getByTitle('Close').or(page.getByTitle('Go Back')).first();
    if (await closePaywall.isVisible()) {
      await closePaywall.click();
      await page.waitForTimeout(400);
    }
  }

  // 4. For You Tab
  const forYouTab = page.getByRole('button', { name: /For You/i }).first();
  if (await forYouTab.isVisible()) {
    await forYouTab.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'scratch/local_desktop_2_for_you.png' });
  }

  // 5. Alliances Tab
  const alliancesTab = page.getByRole('button', { name: /Alliances/i }).first();
  if (await alliancesTab.isVisible()) {
    await alliancesTab.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'scratch/local_desktop_3_alliances.png' });
  }

  // 6. My Profile Tab
  const profileTab = page.getByRole('button', { name: /My Profile/i }).first();
  if (await profileTab.isVisible()) {
    await profileTab.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'scratch/local_desktop_4_profile.png' });
  }

  console.log('✅ Local test screenshots saved successfully!');
  await browser.close();
})();
