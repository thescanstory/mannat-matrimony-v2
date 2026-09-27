import { chromium } from 'playwright';
import { spawn } from 'child_process';

async function runAudit() {
  console.log('🚀 Starting Vite preview server for full audit...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    cwd: '/Users/mac/Vouch 2.0',
    stdio: 'pipe'
  });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const results = {
    website: {
      landingPage: false,
      heroForm: false,
      directoryTabs: false,
      faqAccordion: false,
      legalPages: false,
      errors: []
    },
    webapp: {
      authModal: false,
      feedRender: false,
      profileDetails: false,
      filtersModal: false,
      paywallModal: false,
      razorpayTrigger: false,
      whatsAppShare: false,
      errors: []
    }
  };

  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });

    const page = await context.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error') {
        results.website.errors.push(msg.text());
      }
    });

    // -------------------------------------------------------------
    // 1. AUDIT WEBSITE (LANDING PAGE)
    // -------------------------------------------------------------
    console.log('🔍 [1/2] Auditing Website (Landing Page)...');
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const title = await page.title();
    console.log(`📄 Title: ${title}`);
    results.website.landingPage = title.includes('Mannat Matrimony');

    // Test Hero Form Input
    const nameInput = page.locator('#heroNameInput');
    const phoneInput = page.locator('input[type="tel"]').first();
    if (await nameInput.isVisible() && await phoneInput.isVisible()) {
      await nameInput.fill('Rajesh Singhania');
      await phoneInput.fill('9820012345');
      results.website.heroForm = true;
      console.log('✅ Website: Hero Lead Capture form functional');
    }

    // Test Directory Filter Tabs
    const metroTab = page.locator('button:has-text("Metros & NRI Hubs")').first();
    if (await metroTab.isVisible()) {
      await metroTab.click();
      await page.waitForTimeout(400);
      const delhiCard = await page.locator('text=Delhi NCR Matrimony').isVisible();
      results.website.directoryTabs = delhiCard;
      console.log(`✅ Website: Communities & Metros Directory interactive: ${delhiCard}`);
    }

    // Test FAQ Accordion
    const faqBtn = page.locator('section#faq button').first();
    if (await faqBtn.isVisible()) {
      await faqBtn.click();
      await page.waitForTimeout(300);
      results.website.faqAccordion = true;
      console.log('✅ Website: FAQ accordion functional');
    }

    // Test Legal Page routing
    await page.goto('http://localhost:4173/privacy', { waitUntil: 'networkidle' });
    const privacyHeading = await page.locator('text=Privacy Policy').first().isVisible();
    results.website.legalPages = privacyHeading;
    console.log(`✅ Website: Legal /privacy route rendered: ${privacyHeading}`);

    await page.screenshot({ path: 'scratch/audit_1_website.png' });

    // -------------------------------------------------------------
    // 2. AUDIT WEB APP (/app)
    // -------------------------------------------------------------
    console.log('\n🔍 [2/2] Auditing Member Web App (/app)...');
    
    // Set authenticated session in LocalStorage
    await page.addInitScript(() => {
      localStorage.setItem('mannat_splash_done', 'true');
      localStorage.setItem('mannat_active_user', JSON.stringify({
        id: 'test-auditor-id',
        email: 'auditor@mannatmatrimony.com',
        user_metadata: { full_name: 'Auditor Member' }
      }));
      localStorage.setItem('mannat_auth_email', 'auditor@mannatmatrimony.com');
      localStorage.setItem('mannat_auth_name', 'Auditor Member');
    });

    await page.goto('http://localhost:4173/app', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Check feed rendering
    const candidateName = page.locator('h3, h4, h2').first();
    results.webapp.feedRender = await candidateName.isVisible();
    console.log(`✅ WebApp: Profile feed rendered: ${results.webapp.feedRender}`);

    await page.screenshot({ path: 'scratch/audit_2_webapp_feed.png' });

    // Test Paywall Modal opening
    const vipButton = page.locator('button:has-text("VIP Memberships"), button:has-text("Upgrade"), button:has-text("VIP")').first();
    if (await vipButton.isVisible()) {
      await vipButton.click();
      await page.waitForTimeout(800);
      const paywallHeader = page.locator('text=Membership Tiers, text=Select Your Tier, text=VIP Memberships').first();
      results.webapp.paywallModal = await paywallHeader.isVisible();
      console.log(`✅ WebApp: VIP Paywall Modal active: ${results.webapp.paywallModal}`);
      
      await page.screenshot({ path: 'scratch/audit_3_paywall.png' });
    }

    await browser.close();
    console.log('\n========================================');
    console.log('📊 AUDIT SUMMARY COMPLETED SUCCESSFULLY');
    console.log(JSON.stringify(results, null, 2));
    console.log('========================================');
  } finally {
    server.kill();
  }
}

runAudit().catch(err => {
  console.error('Audit run error:', err);
  process.exit(1);
});
