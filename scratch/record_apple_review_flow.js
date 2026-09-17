import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function recordAppleReviewFlow() {
  console.log('🎬 Starting Apple Review Video Recording for Mannat (iPhone Viewport)...');

  const videoDir = path.resolve('./recordings');
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
    recordVideo: {
      dir: videoDir,
      size: { width: 393, height: 852 }
    }
  });

  const page = await context.newPage();

  // Helper for human-like delay
  const wait = (ms) => page.waitForTimeout(ms);

  // Helper for smooth mouse/touch movement
  const smoothScroll = async (deltaY, steps = 10) => {
    for (let i = 0; i < steps; i++) {
      await page.mouse.wheel(0, deltaY / steps);
      await wait(30);
    }
  };

  try {
    // 1. App Launch & Splash Screen
    console.log('📱 1. App Launch & Royal Splash Screen...');
    await page.goto('http://localhost:5174/app', { waitUntil: 'networkidle' });
    await wait(2800); // Allow splash screen animation to complete and transition to Auth

    // 2. Auth Screen & Sign In
    console.log('🔐 2. Showing Sign In Options (Apple & Verified Demo Access)...');
    await wait(1000);

    // Ensure email input has value rahul@mannat.vip
    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.count() > 0) {
      await emailInput.fill('rahul@mannat.vip');
      await wait(500);
    }

    // Tap "Sign In with Email"
    const signInBtn = page.locator('button:has-text("Sign In with Email"), button:has-text("Sign In")').first();
    if (await signInBtn.count() > 0) {
      await signInBtn.click();
    }
    await wait(2000);

    // 3. Home Feed & Profile Browsing
    console.log('🌟 3. Browsing Verified Candidate Profiles & BlurShield...');
    await wait(1500);
    await smoothScroll(400, 15);
    await wait(1000);
    await smoothScroll(400, 15);
    await wait(1200);

    // Open Profile Details Modal
    const viewDetailBtn = page.locator('button:has-text("Full Bio-Data"), button:has-text("View Bio-Data"), button:has-text("View Profile"), button:has-text("Verified Profile")').first();
    if (await viewDetailBtn.count() > 0) {
      await viewDetailBtn.click();
      await wait(1500);
      // Scroll down modal
      await smoothScroll(300, 10);
      await wait(1000);
      // Close detail modal
      const closeBtn = page.locator('button:has-text("Close"), button[aria-label="Close"]').first();
      if (await closeBtn.count() > 0) {
        await closeBtn.click();
      } else {
        await page.mouse.click(20, 50); // top left back
      }
      await wait(800);
    }

    // Send Interest / Mutual Alliance Request
    console.log('💌 4. Sending Mutual Alliance Request...');
    const connectBtn = page.locator('button:has-text("Connect"), button:has-text("Send Request"), button:has-text("Alliance")').first();
    if (await connectBtn.count() > 0) {
      await connectBtn.click();
      await wait(1500);
    }

    // 5. Safety & Content Moderation: Report & Block
    console.log('🛡️ 5. Demonstrating Safety, Reporting & Member Blocking...');
    const reportFlagBtn = page.locator('button:has-text("Report"), button[title*="Report"], button svg.lucide-flag, button svg.lucide-shield-alert').first();
    if (await reportFlagBtn.count() > 0) {
      await reportFlagBtn.click();
      await wait(1200);

      // Report Tab
      const reportTab = page.locator('button:has-text("Report Bio-Data"), button:has-text("Report Candidate"), button:has-text("Report")').first();
      if (await reportTab.count() > 0) {
        await reportTab.click();
        await wait(1000);
        const submitReportBtn = page.locator('button:has-text("Submit Confidential Report"), button:has-text("Submit Report")').first();
        if (await submitReportBtn.count() > 0) {
          await submitReportBtn.click();
          await wait(1800);
        }
      }
    }

    // 6. Concierge & Mutual Alliances (Connections Tab)
    console.log('💬 6. Navigating to Connections & Concierge Messaging...');
    const alliancesTab = page.locator('button:has-text("Alliances"), button:has-text("Connections"), button:has-text("Messages")').first();
    if (await alliancesTab.count() > 0) {
      await alliancesTab.click();
      await wait(1500);

      // Open Concierge Chat if present
      const chatItem = page.locator('div:has-text("Concierge"), div:has-text("Matchmaker"), div:has-text("Alliance")').first();
      if (await chatItem.count() > 0) {
        await chatItem.click();
        await wait(1200);
        const chatInput = page.locator('input[placeholder*="message"], input[placeholder*="Message"], textarea');
        if (await chatInput.count() > 0) {
          await chatInput.fill('Hello, I would like to request an introduction.');
          await wait(500);
          const sendBtn = page.locator('button:has-text("Send"), button svg.lucide-send').first();
          if (await sendBtn.count() > 0) {
            await sendBtn.click();
            await wait(1200);
          }
        }
      }
    }

    // 7. Profile & Account Deletion (Apple Guideline 5.1.1)
    console.log('🗑️ 7. Demonstrating Account & Data Deletion (Guideline 5.1.1)...');
    const profileTab = page.locator('button:has-text("Profile"), button:has-text("Account"), button svg.lucide-user').last();
    if (await profileTab.count() > 0) {
      await profileTab.click();
      await wait(1500);

      // Scroll down to find Delete Account
      await smoothScroll(600, 20);
      await wait(1000);

      const deleteBtn = page.locator('button:has-text("Delete Account"), button:has-text("Delete Account & Data"), button:has-text("Wipe Data")').first();
      if (await deleteBtn.count() > 0) {
        await deleteBtn.click();
        await wait(1500);

        // Confirm Delete modal
        const confirmDeleteBtn = page.locator('button:has-text("Yes, Delete"), button:has-text("Delete Everything"), button:has-text("Confirm Delete"), button:has-text("Delete Account")').last();
        if (await confirmDeleteBtn.count() > 0) {
          await confirmDeleteBtn.click();
          await wait(2500);
        }
      }
    }

    // Wait for clean redirect to Auth screen
    await wait(2000);
    console.log('✅ Full Flow Finished Successfully!');
  } catch (error) {
    console.error('Recording flow encounter error:', error);
  } finally {
    const videoObj = page.video();
    await page.close();
    await context.close();
    await browser.close();

    if (videoObj) {
      const videoPath = await videoObj.path();
      const finalDestination = path.resolve('./mannat_app_review_recording.webm');
      fs.copyFileSync(videoPath, finalDestination);
      console.log(`🎉 Screen recording saved successfully at:\n${finalDestination}`);
    }
  }
}

recordAppleReviewFlow();
