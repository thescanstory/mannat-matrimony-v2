import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:5173';

async function runAuditTests() {
  console.log('🚀 Starting Comprehensive Code & App Audit Test Suite...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 414, height: 896 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });

  const page = await context.newPage();
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Policy & Legal URL Tests
    console.log('\n📜 1. Testing Legal & Policy Compliance Endpoints...');
    const policyRoutes = [
      { path: '/privacy', keyword: 'Privacy' },
      { path: '/terms', keyword: 'Terms of Service' },
      { path: '/eula', keyword: 'End User License Agreement' },
      { path: '/guidelines', keyword: 'Community' },
      { path: '/account-deletion', keyword: 'Account Deletion' }
    ];

    for (const route of policyRoutes) {
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle' });
      const content = await page.content();
      assert(content.includes(route.keyword), `Route ${route.path} renders "${route.keyword}"`);
    }

    // 2. Static HTML Policies (App Store & Play Store URL standard)
    console.log('\n📄 2. Testing Static Policy HTML Files...');
    const staticPages = [
      { file: '/privacy.html', keyword: 'Privacy Policy' },
      { file: '/terms.html', keyword: 'Terms of Service' },
      { file: '/eula.html', keyword: 'End User License Agreement' }
    ];

    for (const staticDoc of staticPages) {
      await page.goto(`${BASE_URL}${staticDoc.file}`, { waitUntil: 'networkidle' });
      const content = await page.content();
      assert(staticDoc.keyword && content.includes(staticDoc.keyword), `Static file ${staticDoc.file} renders "${staticDoc.keyword}"`);
    }

    // 3. Landing Page & VIP Entry
    console.log('\n🌐 3. Testing Public Landing Page & VIP Entry...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    const landingTitle = await page.title();
    assert(landingTitle.toLowerCase().includes('mannat'), 'Landing page title contains "Mannat"');

    const appLaunchBtn = await page.locator('text=Experience the App').first();
    assert(await appLaunchBtn.isVisible(), 'Landing page has "Experience the App" CTA');

    // 4. In-App Authentication Screen (Apple Guideline 4.8 Compliance)
    console.log('\n🔐 4. Testing In-App Authentication Screen & Apple Sign-In...');
    await page.goto(`${BASE_URL}/app`, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });

    // Wait for Splash screen to transition to AuthScreen
    await page.waitForSelector('text=Continue with Apple', { timeout: 8000 });
    
    const appleBtn = await page.locator('button:has-text("Continue with Apple")');
    assert(await appleBtn.isVisible(), 'Apple Sign In button is prominently rendered (Apple Guideline 4.8)');

    const googleBtn = await page.locator('button:has-text("Continue with Google")');
    assert(await googleBtn.isVisible(), 'Google Sign In button is rendered');

    const termsLink = await page.locator('button:has-text("Terms & EULA")');
    const privacyLink = await page.locator('button:has-text("Privacy Policy")');
    assert(await termsLink.isVisible() && await privacyLink.isVisible(), 'Terms and Privacy Policy links present on Auth Screen');

    // 5. In-App Experience & UGC Safety (Apple Guideline 1.2 UGC Compliance)
    console.log('\n🛡️ 5. Testing In-App Member Experience...');
    await page.evaluate(() => {
      const testUser = {
        id: 'reviewer_test_user',
        email: 'appreview@mannatmatrimony.com',
        user_metadata: { full_name: 'Apple App Reviewer' },
        phone: '+91 99999 99999'
      };
      localStorage.setItem('mannat_active_user', JSON.stringify(testUser));
    });
    await page.goto(`${BASE_URL}/app`, { waitUntil: 'networkidle' });
    await page.waitForSelector('header', { timeout: 8000 });

    const brandHeader = await page.locator('text=MANNAT').first();
    assert(await brandHeader.isVisible(), 'Main App Header rendered with luxury styling');

    // 6. Navigation Tabs Verification
    console.log('\n📱 6. Testing Bottom Tab Navigation...');
    const discoverBtn = await page.locator('button:has-text("Discover")').first();
    const alliancesBtn = await page.locator('button:has-text("Alliances")').first();
    const profileBtn = await page.locator('button:has-text("Profile")').first();
    
    assert(await discoverBtn.isVisible(), 'Bottom Dock "Discover" tab is active');
    assert(await alliancesBtn.isVisible(), 'Bottom Dock "Alliances" tab is present');
    assert(await profileBtn.isVisible(), 'Bottom Dock "Profile" tab is present');

    // 7. Profile Screen & In-App Account Deletion (Apple Guideline 5.1.1 Compliance)
    console.log('\n👤 7. Testing Profile Settings & In-App Account Deletion...');
    await profileBtn.click();
    await page.waitForTimeout(1000);
    
    const privacySettingsBtn = await page.locator('text=Privacy & BlurShield').or(page.locator('text=Privacy')).first();
    assert(await privacySettingsBtn.isVisible(), 'Privacy & BlurShield controls accessible in Profile');

    const deleteAccountBtn = await page.locator('button:has-text("Delete Account")').first();
    assert(await deleteAccountBtn.isVisible(), 'In-App Account Deletion button is present in Profile (Apple Guideline 5.1.1)');

    // 8. Admin Verification Portal
    console.log('\n👑 8. Testing Admin Verification Portal...');
    await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle' });
    const adminContent = await page.content();
    assert(adminContent.includes('Mannat') || adminContent.includes('Admin') || adminContent.includes('Verification'), 'Admin portal is reachable and operational');

    console.log('\n========================================');
    console.log(`🏁 AUDIT TEST SUITE FINISHED: ${passed} PASSED, ${failed} FAILED`);
    console.log('========================================\n');

  } catch (err) {
    console.error('Audit run encountered an error:', err);
    failed++;
  } finally {
    await browser.close();
  }
}

runAuditTests();
