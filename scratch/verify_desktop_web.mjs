import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();

  // Set session first
  await page.addInitScript(() => {
    localStorage.setItem('mannat_splash_done', 'true');
    localStorage.setItem('mannat_auth_session', JSON.stringify({
      id: 'demo-user-1',
      email: 'aditya.sharma@example.com',
      user_metadata: { full_name: 'Aditya Sharma' }
    }));
  });
  
  await page.goto('http://localhost:5173/app#home', { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);

  // If Auth screen is showing, fill and submit
  const emailInput = page.locator('input[placeholder="name@example.com"]');
  if (await emailInput.isVisible()) {
    await emailInput.fill('aditya@mannat.com');
    await page.getByRole('button', { name: /Sign In with Email/i }).click();
    await page.waitForTimeout(2000);
  }

  // 1. Home Feed (Desktop Grid View)
  await page.screenshot({ path: 'scratch/desktop_app_1_home.png' });
  console.log('Saved scratch/desktop_app_1_home.png');

  // 2. Click "For You"
  const forYouBtn = page.getByRole('button', { name: /For You/i }).first();
  if (await forYouBtn.isVisible()) {
    await forYouBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scratch/desktop_app_2_for_you.png' });
    console.log('Saved scratch/desktop_app_2_for_you.png');
  }

  // 3. Click "Alliances"
  const alliancesBtn = page.getByRole('button', { name: /Alliances/i }).first();
  if (await alliancesBtn.isVisible()) {
    await alliancesBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scratch/desktop_app_3_alliances.png' });
    console.log('Saved scratch/desktop_app_3_alliances.png');
  }

  // 4. Click "My Profile"
  const profileBtn = page.getByRole('button', { name: /My Profile/i }).first();
  if (await profileBtn.isVisible()) {
    await profileBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'scratch/desktop_app_4_profile.png' });
    console.log('Saved scratch/desktop_app_4_profile.png');
  }

  await browser.close();
})();
