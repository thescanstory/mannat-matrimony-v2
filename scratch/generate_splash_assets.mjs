import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const SPLASH_DIR = '/Users/mac/Vouch 2.0/ios/App/App/Assets.xcassets/Splash.imageset';
const logoBase64 = fs.readFileSync('/Users/mac/Vouch 2.0/public/images/mannat-logo-1024.png').toString('base64');

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Pinyon+Script&family=Plus+Jakarta+Sans:wght@600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 2732px;
      height: 2732px;
      background: #F8F6F2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      position: relative;
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .logo-box {
      width: 380px;
      height: 380px;
      border-radius: 90px;
      overflow: hidden;
      box-shadow: 0 40px 100px rgba(86, 4, 6, 0.25);
      border: 4px solid rgba(161, 123, 94, 0.4);
      margin-bottom: 60px;
      background: #560406;
    }
    .logo-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .at-script {
      font-family: 'Pinyon Script', cursive;
      font-size: 80px;
      color: #560406;
      line-height: 0.8;
      margin-bottom: 10px;
    }
    .brand-name {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 130px;
      font-weight: 700;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #560406;
      line-height: 1.1;
      margin-bottom: 24px;
    }
    .tagline {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 32px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.35em;
      color: #A17B5E;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo-box">
      <img class="logo-img" src="data:image/png;base64,${logoBase64}" alt="Mannat" />
    </div>
    <div class="at-script">At</div>
    <div class="brand-name">MANNAT</div>
    <div class="tagline">Bespoke Matchmaking for Elites</div>
  </div>
</body>
</html>
`;

async function generate() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 2732, height: 2732 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });

  const splash1 = path.join(SPLASH_DIR, 'splash-2732x2732.png');
  const splash2 = path.join(SPLASH_DIR, 'splash-2732x2732-1.png');
  const splash3 = path.join(SPLASH_DIR, 'splash-2732x2732-2.png');

  await page.screenshot({ path: splash1, type: 'png' });
  fs.copyFileSync(splash1, splash2);
  fs.copyFileSync(splash1, splash3);

  console.log('Splash screens generated successfully in Splash.imageset!');
  await browser.close();
}

generate().catch(console.error);
