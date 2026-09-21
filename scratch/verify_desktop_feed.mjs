import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();

  // Load sample profiles from localStorage
  await page.addInitScript(() => {
    localStorage.removeItem('mannat_admin_deleted');
    localStorage.setItem('mannat_splash_done', 'true');
    localStorage.setItem('mannat_auth_session', JSON.stringify({
      id: 'demo-user-1',
      email: 'aditya.sharma@example.com',
      user_metadata: { full_name: 'Aditya Sharma' }
    }));
  });
  
  await page.goto('http://localhost:5173/app#home', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Home Feed (Desktop 3-column Grid View)
  await page.screenshot({ path: 'scratch/desktop_app_1_home_with_profiles.png' });
  console.log('Saved scratch/desktop_app_1_home_with_profiles.png');

  await browser.close();
})();
