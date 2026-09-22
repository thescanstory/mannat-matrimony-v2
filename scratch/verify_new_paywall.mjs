import { chromium } from 'playwright';
import { spawn } from 'child_process';

async function run() {
  const server = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    cwd: '/Users/mac/Vouch 2.0',
    stdio: 'pipe'
  });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 }
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

    await page.goto('http://localhost:4173/app#home', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const emailInput = page.locator('input[placeholder="name@example.com"], input[type="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('aditya@mannat.com');
      await page.getByRole('button', { name: /Sign In with Email/i }).click();
      await page.waitForTimeout(1500);
    }

    const vipBtn = page.getByRole('button', { name: /VIP Memberships/i }).first();
    if (await vipBtn.isVisible()) {
      await vipBtn.click();
      await page.waitForTimeout(1000);
    }

    await page.screenshot({ path: 'scratch/new_paywall_all_tiers.png' });
    console.log('✅ Screenshot saved to scratch/new_paywall_all_tiers.png');
    await browser.close();
  } finally {
    server.kill();
  }
}

run().catch(console.error);
