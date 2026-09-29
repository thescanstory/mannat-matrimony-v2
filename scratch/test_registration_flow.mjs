import { chromium } from 'playwright';
import path from 'path';

async function testRegistrationFlow() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  console.log('Navigating to local dev server...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // 1. Check Landing Page
  await page.screenshot({ path: 'scratch/screen0_landing.png' });

  // 2. Click "Let's Begin" to open Registration Modal Step 1
  console.log('Clicking Let\'s Begin...');
  await page.click('button:has-text("Let\'s Begin")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'scratch/screen1_profile_for.png' });

  // 3. Select "Myself" -> Step 2
  console.log('Selecting Myself...');
  await page.click('button:has-text("Myself")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'scratch/screen2_name_dob.png' });

  // 4. Fill Name and DOB
  console.log('Filling name and DOB...');
  await page.fill('input[placeholder="e.g. Patrick"]', 'Patrick');
  await page.fill('input[placeholder="e.g. Abraham"]', 'Abraham');
  await page.fill('input[placeholder="DD"]', '24');
  await page.fill('input[placeholder="MM"]', '05');
  await page.fill('input[placeholder="YYYY"]', '1995');
  await page.screenshot({ path: 'scratch/screen2_filled.png' });

  // 5. Click Continue -> Step 3
  console.log('Clicking Continue to Step 3...');
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'scratch/screen3_religion_community.png' });

  // 6. Click Continue -> Step 4
  console.log('Clicking Continue to Step 4...');
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'scratch/screen4_email_mobile.png' });

  // 7. Fill Email and Mobile
  console.log('Filling Email and Phone...');
  await page.fill('input[type="email"]', 'patrickabraham.abraham@gmail.com');
  await page.fill('input[placeholder="Mobile no."]', '9876543210');
  await page.screenshot({ path: 'scratch/screen4_filled.png' });

  console.log('All screens captured successfully!');
  await browser.close();
}

testRegistrationFlow().catch(console.error);
