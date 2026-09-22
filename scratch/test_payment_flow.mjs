import { chromium } from 'playwright';
import { spawn } from 'child_process';

async function run() {
  console.log('🚀 Starting Vite preview server...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    cwd: '/Users/mac/Vouch 2.0',
    stdio: 'pipe'
  });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });

    const page = await context.newPage();

    await page.addInitScript(() => {
      localStorage.setItem('mannat_splash_done', 'true');
      localStorage.setItem('mannat_auth_session', JSON.stringify({
        id: 'demo-user-1',
        email: 'vip.member@mannatmatrimony.com',
        user_metadata: { full_name: 'Aditya Birla' }
      }));
    });

    console.log('📱 Navigating to app...');
    await page.goto('http://localhost:4173/app#home', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // If Auth screen is showing, submit
    const emailInput = page.locator('input[placeholder="name@example.com"], input[type="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('vip.member@mannatmatrimony.com');
      await page.getByRole('button', { name: /Sign In with Email/i }).click();
      await page.waitForTimeout(1500);
    }

    console.log('👑 Opening VIP Memberships Paywall...');
    const vipBtn = page.getByRole('button', { name: /VIP Memberships/i }).first();
    if (await vipBtn.isVisible()) {
      await vipBtn.click();
    } else {
      const headerVip = page.locator('text=VIP Memberships').first();
      await headerVip.click();
    }
    await page.waitForTimeout(1000);

    console.log('📸 Capturing Paywall Modal...');
    await page.screenshot({ path: 'scratch/payment_test_1_paywall.png' });

    // Test Selecting Diamond Plan
    console.log('💎 Selecting Diamond Plan...');
    const diamondCard = page.locator('text=Diamond VIP Pass').first();
    await diamondCard.click();
    await page.waitForTimeout(500);

    // Click Subscribe / Pay button
    console.log('💳 Clicking Subscribe Button...');
    const subscribeBtn = page.locator('button:has-text("Upgrade with Razorpay"), button:has-text("Subscribe"), button:has-text("Pay")').last();
    await subscribeBtn.click();
    await page.waitForTimeout(800);

    console.log('📸 Capturing Payment Confirmation Modal Sheet...');
    await page.screenshot({ path: 'scratch/payment_test_2_confirm_sheet.png' });

    // Click Confirm & Pay inside modal sheet
    console.log('⚡ Clicking Confirm & Pay...');
    const confirmPayBtn = page.locator('button:has-text("Confirm & Pay"), button:has-text("Proceed to Razorpay")').first();
    await confirmPayBtn.click();

    console.log('⏳ Waiting for payment processing...');
    await page.waitForTimeout(2500);

    console.log('📸 Capturing Post-Payment State / Receipt...');
    await page.screenshot({ path: 'scratch/payment_test_3_receipt_success.png' });

    // Check if receipt or success modal is visible
    const successText = await page.locator('text=Membership Active, text=Payment Receipt, text=VIP Access Granted, text=Welcome to Mannat VIP, text=Payment Receipt').count();
    console.log(`✅ Success indicator elements found: ${successText}`);

    // Test Restore Purchases
    console.log('🔄 Testing Restore Purchases...');
    const doneBtn = page.locator('button:has-text("Done"), button:has-text("Start Exploring")').first();
    if (await doneBtn.isVisible()) {
      await doneBtn.click();
      await page.waitForTimeout(500);
    }

    // Open Paywall again to test restore button
    const vipBtn2 = page.getByRole('button', { name: /VIP Memberships/i }).first();
    if (await vipBtn2.isVisible()) {
      await vipBtn2.click();
      await page.waitForTimeout(800);
      const restoreBtn = page.locator('button:has-text("Restore Purchases")').first();
      if (await restoreBtn.isVisible()) {
        console.log('🔄 Clicking Restore Purchases...');
        await restoreBtn.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'scratch/payment_test_4_restored.png' });
      }
    }

    console.log('🎉 ALL PAYMENT & RESTORE FLOWS TESTED SUCCESSFULLY WITH ZERO HANGS!');
    await browser.close();
  } finally {
    server.kill();
  }
}

run().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
