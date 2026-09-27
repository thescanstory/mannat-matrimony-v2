import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

const doctorDirs = ['matrimony-for-doctors', 'doctors-matrimony-delhi', 'doctors-matrimony-mumbai', 'doctors-matrimony-bangalore'];

for (const dir of doctorDirs) {
  const indexPath = path.join(PUBLIC_DIR, dir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf-8');
    
    // Inject enhanced doctor-specific semantic block if not present
    if (!html.includes('NMC & State Medical Council Verified')) {
      html = html.replace('</h1>', `</h1>
      <div style="background:rgba(197,168,128,0.1); border:1px solid #C5A880; padding:18px; border-radius:12px; margin:20px 0; text-align:left;">
        <h4 style="color:#C5A880; margin-bottom:8px; font-size:1.1rem;">🩺 Elite Medical Matchmaking Standards (2026)</h4>
        <p style="color:#A8A29E; font-size:0.95rem; margin-bottom:8px;"><strong>1. 100% NMC & State Medical Council Verified:</strong> All MBBS, MD, MS, DM, and MCh qualifications verified before profile activation.</p>
        <p style="color:#A8A29E; font-size:0.95rem; margin-bottom:8px;"><strong>2. Patient-Proof Privacy (BlurShield™):</strong> Complete protection preventing hospital patients, colleagues, and web scrapers from viewing personal portraits.</p>
        <p style="color:#A8A29E; font-size:0.95rem;"><strong>3. Demanding Hospital Schedule Alignment:</strong> Tailored matchmaking respecting on-call shifts, residency demands, and private clinic commitments.</p>
      </div>`);
      fs.writeFileSync(indexPath, html, 'utf-8');
      console.log(`✅ Enhanced doctor semantic depth on /${dir}`);
    }
  }
}
