import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const OUTPUT_DIR = '/Users/mac/.gemini/antigravity-ide/brain/6e259cf5-aa16-4a39-b96d-32b94dc7fda4/app_store_screenshots';
const DOWNLOADS_DIR = '/Users/mac/Downloads/Mannat_AppStore_Screenshots';
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(DOWNLOADS_DIR)) fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });

function getBase64Image(relPath) {
  const fullPath = path.join('/Users/mac/Vouch 2.0/public/images/vip', relPath);
  if (fs.existsSync(fullPath)) {
    const data = fs.readFileSync(fullPath);
    return `data:image/jpeg;base64,${data.toString('base64')}`;
  }
  return '';
}

const IMG_BRIDE_1 = getBase64Image('couple_floral_saree.jpg');
const IMG_BRIDE_2 = getBase64Image('couple_silk_saree.jpg');
const IMG_BRIDE_3 = getBase64Image('couple_window_red.jpg');
const IMG_GROOM_1 = getBase64Image('hero_palace_couple.jpg');
const IMG_GROOM_2 = getBase64Image('hero_vip_mansion_couple.jpg');

const SCREENSHOT_CONFIGS = [
  {
    filename: '01_curated_discovery_feed.png',
    scriptTitle: 'At',
    brandTitle: 'MANNAT',
    headline: 'Bespoke Matrimonial Alliances',
    subheadline: 'Curated Introductions for Accomplished Families & Pedigrees',
    renderPhoneUI: () => `
      <div class="mobile-screen">
        <div class="m-header">
          <div class="m-header-left">
            <span class="m-script-at">At</span>
            <span class="m-brand-name">MANNAT</span>
          </div>
          <div class="m-header-right">
            <span class="m-pill-curated">⚡ Top 1% Curated</span>
            <div class="m-icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#560406" stroke-width="2.2"><path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6"/></svg>
            </div>
          </div>
        </div>

        <div class="m-card-feed">
          <div class="m-card-photo" style="background-image: url('${IMG_BRIDE_1}');">
            <div class="m-photo-grad"></div>
            
            <div class="m-badge-row">
              <span class="m-badge-score">✨ 98% Match</span>
              <span class="m-badge-vouched">🛡️ Vouched</span>
              <span class="m-badge-astro">🪐 34/36 Gunas</span>
            </div>

            <div class="m-card-overlay">
              <div class="m-name-row">
                <h2>Ananya Sharma, 26</h2>
                <span class="m-verified-seal">✓ Verified</span>
              </div>
              <p class="m-meta">5'7" · Hindu (Saraswat Brahmin) · South Mumbai</p>
              
              <div class="m-career-pill">💼 VP Investment Banking · Morgan Stanley</div>
              
              <div class="m-tag-cloud">
                <span class="m-tag">🎓 MBA (IIM Ahmedabad)</span>
                <span class="m-tag">🏛️ Industrialist Family</span>
                <span class="m-tag">🌱 Strictly Vegetarian</span>
              </div>
            </div>
          </div>

          <div class="m-actions-row">
            <div class="m-btn m-btn-sec">View Full Bio-Data ↗</div>
            <div class="m-btn m-btn-pri">Express Interest 💌</div>
          </div>
        </div>

        <div class="m-bottom-dock">
          <div class="m-dock-item active">🏠 Discover</div>
          <div class="m-dock-item">👁️ For You</div>
          <div class="m-dock-item">❤️ Alliances</div>
          <div class="m-dock-item">👤 Profile</div>
        </div>
      </div>
    `
  },
  {
    filename: '02_verified_candidate_biodata.png',
    scriptTitle: 'At',
    brandTitle: 'MANNAT',
    headline: 'Verified Candidate Dossiers',
    subheadline: 'In-Depth Pedigree, Family Background & Career Verification',
    renderPhoneUI: () => `
      <div class="mobile-screen bg-warm">
        <div class="m-header">
          <div class="m-back-btn">← Candidate Dossier</div>
          <span class="m-brand-name">MANNAT</span>
          <div class="m-share-text">📤 Share</div>
        </div>

        <div class="m-scroll-fill">
          <!-- Hero Banner -->
          <div class="m-dossier-hero" style="background-image: url('${IMG_BRIDE_2}');">
            <div class="m-photo-grad"></div>
            <div class="m-dossier-hero-text">
              <div class="m-badge-row mb-1">
                <span class="m-badge-green">🛡️ 100% Authenticated</span>
                <span class="m-badge-gold">⭐ Elite Pedigree</span>
              </div>
              <h2>Priya Mehra, 27</h2>
              <p>Senior Product Leader · Microsoft (Seattle & Mumbai)</p>
            </div>
          </div>

          <!-- Quick Stats Grid -->
          <div class="m-stats-grid">
            <div class="m-stat"><span class="m-lbl">Height</span><strong>5'6" (168 cm)</strong></div>
            <div class="m-stat"><span class="m-lbl">Religion</span><strong>Hindu Khatri</strong></div>
            <div class="m-stat"><span class="m-lbl">Location</span><strong>Bandra West</strong></div>
            <div class="m-stat"><span class="m-lbl">Kundli</span><strong class="text-gold">34 / 36 Gunas</strong></div>
          </div>

          <!-- Section 1 -->
          <div class="m-section-card">
            <div class="m-sec-header">
              <h3>🏛️ Family Heritage & Pedigree</h3>
              <span class="m-tag-green">✓ Verified Lineage</span>
            </div>
            <div class="m-info-list">
              <div class="m-info-item"><span class="k">Father:</span><span class="v">Managing Director, Industrial Mfg Group</span></div>
              <div class="m-info-item"><span class="k">Mother:</span><span class="v">Classical Vocalist & Philanthropist</span></div>
              <div class="m-info-item"><span class="k">Grandfather:</span><span class="v">Former Justice, High Court of Bombay</span></div>
              <div class="m-info-item"><span class="k">Ancestral:</span><span class="v">South Mumbai & Civil Lines Delhi</span></div>
            </div>
          </div>

          <!-- Section 2 -->
          <div class="m-section-card">
            <div class="m-sec-header">
              <h3>🎓 Education & Career Standing</h3>
              <span class="m-tag-green">✓ Verified Credentials</span>
            </div>
            <div class="m-info-list">
              <div class="m-info-item"><span class="k">Education:</span><span class="v">B.Tech (IIT Bombay), MS (Stanford)</span></div>
              <div class="m-info-item"><span class="k">Current:</span><span class="v">Lead Product Manager · Big Tech</span></div>
              <div class="m-info-item"><span class="k">Income:</span><span class="v">₹95 Lakhs - ₹1.4 Cr ($180k+ USD)</span></div>
              <div class="m-info-item"><span class="k">Lifestyle:</span><span class="v">Vegetarian · Teetotaler · Non-Smoker</span></div>
            </div>
          </div>

          <!-- Section 3 -->
          <div class="m-section-card">
            <div class="m-sec-header">
              <h3>🛡️ DigiLocker Trust Badges</h3>
              <span class="m-tag-gold">Official Audit</span>
            </div>
            <div class="m-pills-2col">
              <span class="m-trust-badge">✓ Passport / Aadhaar Verified</span>
              <span class="m-trust-badge">✓ Corporate Email Verified</span>
              <span class="m-trust-badge">✓ Degree Authenticated</span>
              <span class="m-trust-badge">✓ Background Clean</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="m-actions-row">
            <div class="m-btn m-btn-sec">Save to Shortlist ⭐</div>
            <div class="m-btn m-btn-pri">Express Mutual Interest 💌</div>
          </div>
        </div>

        <div class="m-bottom-dock">
          <div class="m-dock-item">🏠 Discover</div>
          <div class="m-dock-item active">👁️ For You</div>
          <div class="m-dock-item">❤️ Alliances</div>
          <div class="m-dock-item">👤 Profile</div>
        </div>
      </div>
    `
  },
  {
    filename: '03_blurshield_photo_privacy.png',
    scriptTitle: 'At',
    brandTitle: 'MANNAT',
    headline: 'BlurShield™ Photo Privacy',
    subheadline: '20px Discretion Lock · Unlock Exclusively on Mutual Acceptance',
    renderPhoneUI: () => `
      <div class="mobile-screen">
        <div class="m-header">
          <div class="m-header-left">
            <span class="m-script-at">At</span>
            <span class="m-brand-name">MANNAT</span>
          </div>
          <div class="m-lock-badge">🔒 BlurShield™ Active</div>
        </div>

        <div class="m-scroll-fill">
          <!-- Main Blurred Card -->
          <div class="m-blur-card">
            <div class="m-blur-photo" style="background-image: url('${IMG_BRIDE_3}');">
              <div class="m-blur-overlay">
                <div class="m-shield-center">
                  <div class="m-shield-big-icon">🛡️</div>
                  <h2>BlurShield™ Discretion Lock</h2>
                  <p>Candidate photos are encrypted with a 20px frosted blur to protect family discretion. Unlocked upon mutual acceptance.</p>
                  <div class="m-unlock-pill">Request Photo Unlock Permission 🔑</div>
                </div>
              </div>
            </div>

            <div class="m-blur-footer">
              <div>
                <h3>Candidate #MN-8492</h3>
                <p>26 Yrs · 5'5" · Hindu (Kayastha) · South Delhi</p>
              </div>
              <span class="m-tag-dark">Corporate Lawyer · Tier-1</span>
            </div>
          </div>

          <!-- Privacy Control Center -->
          <div class="m-section-card">
            <div class="m-sec-header">
              <h3>⚙️ Discretion & Privacy Boundaries</h3>
              <span class="m-tag-green">100% Confidential</span>
            </div>
            
            <div class="m-toggle-item">
              <div>
                <strong>Photo Discretion Lock (BlurShield™)</strong>
                <p>Hide photos from general feed; unlock only on mutual approval</p>
              </div>
              <span class="m-status-pill green">ACTIVE</span>
            </div>

            <div class="m-toggle-item">
              <div>
                <strong>Incognito Family Browsing</strong>
                <p>Browse candidates without appearing in viewer logs</p>
              </div>
              <span class="m-status-pill gold">ENABLED</span>
            </div>

            <div class="m-toggle-item">
              <div>
                <strong>Screenshot Prevention & Dynamic Watermarking</strong>
                <p>Cryptographically embeds member ID on all shared profiles</p>
              </div>
              <span class="m-status-pill green">PROTECTED</span>
            </div>

            <div class="m-toggle-item">
              <div>
                <strong>Elder Family Sub-Accounts</strong>
                <p>Read-only dossier review access for parents & elders</p>
              </div>
              <span class="m-status-pill gold">CONFIGURED</span>
            </div>
          </div>
        </div>

        <div class="m-bottom-dock">
          <div class="m-dock-item active">🏠 Discover</div>
          <div class="m-dock-item">👁️ For You</div>
          <div class="m-dock-item">❤️ Alliances</div>
          <div class="m-dock-item">👤 Profile</div>
        </div>
      </div>
    `
  },
  {
    filename: '04_mutual_alliances_matches.png',
    scriptTitle: 'At',
    brandTitle: 'MANNAT',
    headline: 'Intentional Alliances',
    subheadline: 'Mutual Family Approvals & Curated Match Recommendations',
    renderPhoneUI: () => `
      <div class="mobile-screen bg-warm">
        <div class="m-header">
          <div class="m-header-left">
            <span class="m-script-at">At</span>
            <span class="m-brand-name">MANNAT</span>
          </div>
          <span class="m-badge-count">✨ 5 Mutual Alliances</span>
        </div>

        <div class="m-scroll-fill">
          <div class="m-banner-alliances">
            <h4>💍 Approved Matrimonial Alliances</h4>
            <p>Both families have approved credentials, exchanged horoscopes, and granted confidential dialogue permissions.</p>
          </div>

          <div class="m-tabs-row">
            <span class="m-tab-item active">Mutual Alliances (5)</span>
            <span class="m-tab-item">Pending Requests (3)</span>
            <span class="m-tab-item">Shortlist (12)</span>
          </div>

          <div class="m-list-cards">
            <!-- Item 1 -->
            <div class="m-alliance-card">
              <div class="m-avatar" style="background-image: url('${IMG_GROOM_1}');"><span class="m-dot"></span></div>
              <div class="m-alliance-info">
                <div class="m-row-between">
                  <h4>Kavya Singhania, 28</h4>
                  <span class="m-badge-sm">98% Match</span>
                </div>
                <p class="role">Founder & CEO · Ivy League Graduate</p>
                <p class="sub">Brahmin · South Mumbai · Family Approved ✓</p>
              </div>
              <div class="m-btn-chat">Chat 💬</div>
            </div>

            <!-- Item 2 -->
            <div class="m-alliance-card">
              <div class="m-avatar" style="background-image: url('${IMG_BRIDE_1}');"><span class="m-dot"></span></div>
              <div class="m-alliance-info">
                <div class="m-row-between">
                  <h4>Dr. Rhea Verma, 27</h4>
                  <span class="m-badge-sm">96% Match</span>
                </div>
                <p class="role">Cardiologist (MD, AIIMS New Delhi)</p>
                <p class="sub">Khatri · Defence Colony · 34/36 Gunas</p>
              </div>
              <div class="m-btn-chat">Chat 💬</div>
            </div>

            <!-- Item 3 -->
            <div class="m-alliance-card">
              <div class="m-avatar" style="background-image: url('${IMG_GROOM_2}');"><span class="m-dot"></span></div>
              <div class="m-alliance-info">
                <div class="m-row-between">
                  <h4>Aditya Mittal, 30</h4>
                  <span class="m-badge-sm">99% Match</span>
                </div>
                <p class="role">Managing Director · Family Office</p>
                <p class="sub">Marwari (Agarwal) · Nariman Point</p>
              </div>
              <div class="m-btn-chat">Chat 💬</div>
            </div>

            <!-- Item 4 -->
            <div class="m-alliance-card">
              <div class="m-avatar" style="background-image: url('${IMG_BRIDE_2}');"></div>
              <div class="m-alliance-info">
                <div class="m-row-between">
                  <h4>Sanya Kapoor, 26</h4>
                  <span class="m-badge-sm">95% Match</span>
                </div>
                <p class="role">Consultant · McKinsey & Co.</p>
                <p class="sub">Punjabi · Vasant Vihar · Family Introduced</p>
              </div>
              <div class="m-btn-pending">Pending ⏳</div>
            </div>

            <!-- Item 5 -->
            <div class="m-alliance-card">
              <div class="m-avatar" style="background-image: url('${IMG_BRIDE_3}');"></div>
              <div class="m-alliance-info">
                <div class="m-row-between">
                  <h4>Meera Nambiar, 27</h4>
                  <span class="m-badge-sm">94% Match</span>
                </div>
                <p class="role">Architect · Foster + Partners</p>
                <p class="sub">Hindu · Bangalore · New Alliance</p>
              </div>
              <div class="m-btn-review">Review ↗</div>
            </div>
          </div>
        </div>

        <div class="m-bottom-dock">
          <div class="m-dock-item">🏠 Discover</div>
          <div class="m-dock-item">👁️ For You</div>
          <div class="m-dock-item active">❤️ Alliances</div>
          <div class="m-dock-item">👤 Profile</div>
        </div>
      </div>
    `
  },
  {
    filename: '05_private_encrypted_chat.png',
    scriptTitle: 'At',
    brandTitle: 'MANNAT',
    headline: 'Private Encrypted Concierge',
    subheadline: 'Discreet 1-on-1 Dialogue & Family Introduction Coordination',
    renderPhoneUI: () => `
      <div class="mobile-screen bg-warm">
        <div class="m-chat-header">
          <div class="m-chat-user">
            <div class="m-chat-avatar" style="background-image: url('${IMG_BRIDE_1}');"><span class="m-chat-dot"></span></div>
            <div>
              <h3>Ananya Sharma</h3>
              <p class="m-chat-online">🟢 Active Now · Verified Connection</p>
            </div>
          </div>
          <div class="m-chat-enc">🔒 Encrypted</div>
        </div>

        <div class="m-chat-body">
          <div class="m-chat-date">Today · Confidential & Discretion Guarded</div>

          <div class="m-bubble m-bubble-in">
            <p>Namaste Patrick! Delighted to connect. My family reviewed your candidate dossier and was truly impressed with your pedigree.</p>
            <span class="m-time">10:42 AM</span>
          </div>

          <div class="m-bubble m-bubble-out">
            <p>Namaste Ananya. Thank you! Our parents would love to host an informal family high tea in South Mumbai next weekend.</p>
            <span class="m-time">10:45 AM ✓✓</span>
          </div>

          <div class="m-bubble m-bubble-in">
            <p>That sounds wonderful. My father is available Saturday. Let me share our verified family concierge briefing notes with you!</p>
            <span class="m-time">10:46 AM</span>
          </div>

          <!-- Attachment Card -->
          <div class="m-attachment">
            <div class="m-att-icon">📄</div>
            <div class="m-att-info">
              <strong>Sharma_Family_Briefing_Dossier.pdf</strong>
              <span>Verified Matrimonial Bio-Data & Kundli · 2.4 MB</span>
            </div>
            <div class="m-att-btn">View ↗</div>
          </div>

          <div class="m-bubble m-bubble-out">
            <p>Received! I will review this with my parents tonight. We look forward to our family introduction! 🙏</p>
            <span class="m-time">10:48 AM ✓✓</span>
          </div>

          <!-- Audio Voice Note -->
          <div class="m-audio-bubble">
            <div class="m-play-btn">▶</div>
            <div class="m-audio-wave">
              <div class="m-bars">
                <span style="height: 10px;"></span><span style="height: 18px;"></span><span style="height: 26px;"></span>
                <span style="height: 14px;"></span><span style="height: 22px;"></span><span style="height: 28px;"></span>
                <span style="height: 18px;"></span><span style="height: 12px;"></span><span style="height: 20px;"></span>
                <span style="height: 26px;"></span><span style="height: 16px;"></span><span style="height: 10px;"></span>
              </div>
              <span class="m-audio-dur">Concierge Voice Note · 0:42</span>
            </div>
          </div>

          <div class="m-bubble m-bubble-in">
            <p>Perfect. Our family concierge will coordinate location details. Have a wonderful evening!</p>
            <span class="m-time">10:50 AM</span>
          </div>
        </div>

        <div class="m-chat-input-bar">
          <div class="m-btn-add">+</div>
          <div class="m-fake-input">Write a confidential message...</div>
          <div class="m-btn-mic">🎙️</div>
          <div class="m-btn-send">➔</div>
        </div>
      </div>
    `
  },
  {
    filename: '06_ugc_safety_and_block.png',
    scriptTitle: 'At',
    brandTitle: 'MANNAT',
    headline: '100% Safe & Verified Community',
    subheadline: '1-Tap Block, Structured Reporting & 24-Hour Removal SLA',
    renderPhoneUI: () => `
      <div class="mobile-screen bg-warm">
        <div class="m-header">
          <div class="m-header-left">
            <span class="m-script-at">At</span>
            <span class="m-brand-name">MANNAT</span>
          </div>
          <span class="m-tag-green">Apple Guideline 1.2 Compliant</span>
        </div>

        <div class="m-scroll-fill">
          <div class="m-safety-card">
            <div class="m-safety-header">
              <div class="m-shield-big">🛡️</div>
              <h2>Report & Safety Center</h2>
              <p>We maintain a strict zero-tolerance policy against fake credentials, improper conduct, or harassment.</p>
            </div>

            <div class="m-reasons-list">
              <div class="m-reason selected">
                <div class="m-r-icon">🚫</div>
                <div class="m-r-text">
                  <strong>Instant 1-Tap Block</strong>
                  <p>Immediately severs all contact, hides bio-data, and permanently excludes the candidate from your feed.</p>
                </div>
                <span class="m-r-tag">Selected ✓</span>
              </div>

              <div class="m-reason">
                <div class="m-r-icon">🚩</div>
                <div class="m-r-text">
                  <strong>Categorized UGC Content Report</strong>
                  <p>Direct priority escalation to dedicated human moderation team.</p>
                </div>
                <span class="m-r-arrow">›</span>
              </div>

              <div class="m-reason">
                <div class="m-r-icon">⚡</div>
                <div class="m-r-text">
                  <strong>24-Hour Investigation SLA</strong>
                  <p>Guaranteed review and offending account purging within 24 hours.</p>
                </div>
                <span class="m-r-sla">24h SLA</span>
              </div>

              <div class="m-reason">
                <div class="m-r-icon">⚖️</div>
                <div class="m-r-text">
                  <strong>Binding Legal EULA Terms</strong>
                  <p>Mandatory adherence to community decorum and identity authenticity.</p>
                </div>
                <span class="m-r-eula">EULA Enforced</span>
              </div>
            </div>

            <div class="m-safety-note">
              <h4>🔒 Concierge Safety Commitment</h4>
              <p>All reports are confidential. Offending accounts are quarantined immediately upon reporting.</p>
            </div>

            <div class="m-actions-stack">
              <div class="m-btn m-btn-block">🚫 Block Member Immediately</div>
              <div class="m-btn m-btn-report">Submit Confidential Report 🛡️</div>
            </div>
          </div>
        </div>

        <div class="m-bottom-dock">
          <div class="m-dock-item">🏠 Discover</div>
          <div class="m-dock-item">👁️ For You</div>
          <div class="m-dock-item">❤️ Alliances</div>
          <div class="m-dock-item active">👤 Profile</div>
        </div>
      </div>
    `
  },
  {
    filename: '07_verified_profile_scoring.png',
    scriptTitle: 'At',
    brandTitle: 'MANNAT',
    headline: 'Verified Profile Scoring',
    subheadline: 'Multi-Vector Verification for High-Integrity Profiles',
    renderPhoneUI: () => `
      <div class="mobile-screen bg-warm">
        <div class="m-header">
          <div class="m-header-left">
            <span class="m-script-at">At</span>
            <span class="m-brand-name">MANNAT</span>
          </div>
          <span class="m-badge-gold">👑 Elite Verified</span>
        </div>

        <div class="m-scroll-fill">
          <!-- Profile Card -->
          <div class="m-score-user-card">
            <div class="m-score-avatar" style="background-image: url('${IMG_GROOM_1}');"></div>
            <div class="m-score-info">
              <h2>Dr. Aryan Kapoor, 29</h2>
              <p class="role">Cardiothoracic Surgeon · AIIMS & Johns Hopkins</p>
              <span class="m-tag-green">✓ 100% Identity Authenticated</span>
            </div>
          </div>

          <!-- Trust Meter -->
          <div class="m-trust-banner">
            <div class="m-circle-score">
              <span class="num">99</span>
              <span class="den">/ 100</span>
            </div>
            <div class="m-trust-text">
              <h3>Profile Authenticity Index</h3>
              <p>Top 0.5% highest integrity rating on Mannat. All pedigree credentials validated with official records.</p>
            </div>
          </div>

          <!-- Vector Breakdown -->
          <div class="m-section-card">
            <h3>📊 Multi-Vector Verification Breakdown</h3>

            <div class="m-vector-row">
              <div class="m-row-between"><span>🏛️ Heritage & Family Pedigree</span><strong>100% Verified</strong></div>
              <div class="m-track"><div class="m-bar gold" style="width: 100%;"></div></div>
            </div>

            <div class="m-vector-row">
              <div class="m-row-between"><span>🎓 Academic Credentials (AIIMS / JHU)</span><strong>98% Verified</strong></div>
              <div class="m-track"><div class="m-bar burgundy" style="width: 98%;"></div></div>
            </div>

            <div class="m-vector-row">
              <div class="m-row-between"><span>💼 Financial & Career Standing (ITR / MCA)</span><strong>99% Verified</strong></div>
              <div class="m-track"><div class="m-bar burgundy" style="width: 99%;"></div></div>
            </div>

            <div class="m-vector-row">
              <div class="m-row-between"><span>🛡️ Government ID (DigiLocker / Passport)</span><strong>100% Verified</strong></div>
              <div class="m-track"><div class="m-bar gold" style="width: 100%;"></div></div>
            </div>

            <div class="m-vector-row">
              <div class="m-row-between"><span>🪐 Astro & Kundli Compatibility</span><strong>96% (34 / 36 Gunas)</strong></div>
              <div class="m-track"><div class="m-bar gold" style="width: 96%;"></div></div>
            </div>
          </div>

          <!-- Official Audit Log -->
          <div class="m-audit-card">
            <h4>🛡️ Official Verification Trail</h4>
            <div class="m-row-between text-sm"><span>✓ DigiLocker Govt Identity:</span> <strong class="text-green">Verified Sep 2026</strong></div>
            <div class="m-row-between text-sm"><span>✓ Medical Council Registration:</span> <strong class="text-green">Verified (MCI-98421)</strong></div>
            <div class="m-row-between text-sm"><span>✓ Income & Asset Audit:</span> <strong class="text-green">Form 16 / ITR Verified</strong></div>
          </div>

          <!-- Badges -->
          <div class="m-pills-2col">
            <span class="m-trust-badge">🏛️ HNI Heritage Family</span>
            <span class="m-trust-badge">🎓 Top Tier Alma Mater</span>
            <span class="m-trust-badge">✓ Govt ID DigiLocker</span>
            <span class="m-trust-badge">🛡️ Zero Policy Infractions</span>
          </div>
        </div>

        <div class="m-bottom-dock">
          <div class="m-dock-item">🏠 Discover</div>
          <div class="m-dock-item">👁️ For You</div>
          <div class="m-dock-item">❤️ Alliances</div>
          <div class="m-dock-item active">👤 Profile</div>
        </div>
      </div>
    `
  },
  {
    filename: '08_family_share_portal.png',
    scriptTitle: 'At',
    brandTitle: 'MANNAT',
    headline: 'Private Family Share Portal',
    subheadline: 'Share Candidate Briefings Securely with Parents & Elders',
    renderPhoneUI: () => `
      <div class="mobile-screen bg-warm">
        <div class="m-header">
          <div class="m-header-left">
            <span class="m-script-at">At</span>
            <span class="m-brand-name">MANNAT</span>
          </div>
          <span class="m-badge-burgundy">👨‍👩‍👧 Family Portal</span>
        </div>

        <div class="m-scroll-fill">
          <!-- Hero -->
          <div class="m-share-hero" style="background-image: url('${IMG_BRIDE_1}');">
            <div class="m-photo-grad"></div>
            <div class="m-watermark-pill">CONFIDENTIAL · FOR ELDER REVIEW ONLY</div>
            <div class="m-share-hero-text">
              <h2>Candidate Family Briefing</h2>
              <p>Ananya Sharma · South Mumbai Industrial Pedigree</p>
            </div>
          </div>

          <!-- Parent Summary -->
          <div class="m-section-card">
            <h3>🏛️ Parent & Concierge Summary</h3>
            <p class="m-italic-text">"Distinguished Saraswat Brahmin family with multi-generational roots in South Mumbai and New Delhi. Candidate is accomplished, grounded, vegetarian, and deeply values tradition."</p>
          </div>

          <!-- Family Consensus -->
          <div class="m-section-card">
            <h3>👨‍👩‍👧 Family Consensus & Elder Verdicts</h3>
            
            <div class="m-verdict-row">
              <span class="voter">👨 Father's Review:</span>
              <span class="verdict-ok">Approved · Highly Compatible Pedigree ✓</span>
            </div>

            <div class="m-verdict-row">
              <span class="voter">👩 Mother's Review:</span>
              <span class="verdict-ok">Approved · Request Informal High Tea ✓</span>
            </div>

            <div class="m-verdict-row">
              <span class="voter">🧑 Elder Brother:</span>
              <span class="verdict-ok">Approved · Shared Professional Values ✓</span>
            </div>
          </div>

          <!-- Concierge Tip -->
          <div class="m-tip-card">
            <h4>💡 Mannat Concierge Advisory</h4>
            <p>Both families share mutual ties through the Bombay Gymkhana and IIT Alumni network.</p>
          </div>

          <!-- Action Buttons -->
          <div class="m-actions-row">
            <div class="m-btn m-btn-sec">📤 Export PDF Dossier</div>
            <div class="m-btn m-btn-pri">📱 WhatsApp Family Link</div>
          </div>
        </div>

        <div class="m-bottom-dock">
          <div class="m-dock-item">🏠 Discover</div>
          <div class="m-dock-item">👁️ For You</div>
          <div class="m-dock-item">❤️ Alliances</div>
          <div class="m-dock-item active">👤 Profile</div>
        </div>
      </div>
    `
  },
  {
    filename: '09_precision_search_filters.png',
    scriptTitle: 'At',
    brandTitle: 'MANNAT',
    headline: 'Granular Heritage Filters',
    subheadline: 'Filter by Community, Gotra, Profession, Height & Location',
    renderPhoneUI: () => `
      <div class="mobile-screen bg-warm">
        <div class="m-header">
          <div class="m-header-left">
            <span class="m-script-at">At</span>
            <span class="m-brand-name">MANNAT</span>
          </div>
          <span class="m-reset-btn">Reset All</span>
        </div>

        <div class="m-scroll-fill">
          <div class="m-results-banner">
            <span>✨ 4 Active Filter Dimensions</span>
            <strong class="text-burgundy">18 Eligible Matches</strong>
          </div>

          <div class="m-section-card">
            <label class="m-filter-label">Community & Sub-Caste</label>
            <div class="m-tag-wrap">
              <span class="m-filter-tag active">Brahmin (Saraswat) ✓</span>
              <span class="m-filter-tag">Khatri</span>
              <span class="m-filter-tag">Jain (Oswal / Porwal)</span>
              <span class="m-filter-tag">Agarwal / Marwari</span>
              <span class="m-filter-tag">Kayastha</span>
              <span class="m-filter-tag">Rajput</span>
            </div>
          </div>

          <div class="m-section-card">
            <label class="m-filter-label">Educational Pedigree</label>
            <div class="m-tag-wrap">
              <span class="m-filter-tag active">Ivy League / Tier-1 MBA ✓</span>
              <span class="m-filter-tag active">IIT / NIT / BITS ✓</span>
              <span class="m-filter-tag">Medical (MD / MS Specialists)</span>
              <span class="m-filter-tag">CA Rankers / Law</span>
            </div>
          </div>

          <div class="m-section-card">
            <label class="m-filter-label">Annual Income / Family Wealth</label>
            <div class="m-tag-wrap">
              <span class="m-filter-tag active">₹50 Lakhs - ₹1 Cr+ ✓</span>
              <span class="m-filter-tag">₹1 Cr - ₹5 Cr+</span>
              <span class="m-filter-tag">Industrialist / Heritage HNI</span>
            </div>
          </div>

          <div class="m-section-card">
            <label class="m-filter-label">Location & Relocation Preferences</label>
            <div class="m-tag-wrap">
              <span class="m-filter-tag active">Mumbai / South Bombay ✓</span>
              <span class="m-filter-tag">Delhi NCR</span>
              <span class="m-filter-tag">Bangalore</span>
              <span class="m-filter-tag">London / UK</span>
              <span class="m-filter-tag">USA (Bay Area / NYC)</span>
            </div>
          </div>

          <div class="m-section-card">
            <label class="m-filter-label">Lifestyle & Diet</label>
            <div class="m-tag-wrap">
              <span class="m-filter-tag active">Strictly Vegetarian ✓</span>
              <span class="m-filter-tag">Teetotaler / Non-Smoker</span>
            </div>
          </div>

          <div class="m-apply-btn">Apply Curated Filters (18 Matches) ➔</div>
        </div>
      </div>
    `
  },
  {
    filename: '10_apple_signin_and_privacy.png',
    scriptTitle: 'At',
    brandTitle: 'MANNAT',
    headline: 'Discreet VIP Onboarding',
    subheadline: 'One-Tap Sign in with Apple & Instant In-App Data Purge',
    renderPhoneUI: () => `
      <div class="mobile-screen bg-warm auth-flex">
        <!-- Hero Palace Visual with Brand Crest -->
        <div class="m-auth-hero" style="background-image: url('${IMG_GROOM_1}');">
          <div class="m-auth-hero-grad"></div>
          <div class="m-auth-crest">
            <span class="m-script-at-lg">At</span>
            <h1 class="m-brand-lg">MANNAT</h1>
            <p class="m-sub-lg">BESPOKE MATCHMAKING</p>
            <p class="m-tagline">The Exclusive Matrimonial Sanctuary for Discerning Families</p>
          </div>
        </div>

        <div class="m-auth-card-body">
          <div class="m-trust-features">
            <div class="m-trust-feat">
              <span class="icon"></span>
              <div>
                <strong>Sign in with Apple (Guideline 4.8)</strong>
                <p>Private Relay email shielding & biometric Face ID security.</p>
              </div>
            </div>

            <div class="m-trust-feat">
              <span class="icon">🛡️</span>
              <div>
                <strong>100% Authenticated Profiles</strong>
                <p>Multi-vector identity, background, and pedigree verification.</p>
              </div>
            </div>

            <div class="m-trust-feat">
              <span class="icon">🗑️</span>
              <div>
                <strong>Instant Account & Data Purge (Guideline 5.1.1)</strong>
                <p>One-tap complete profile deletion with zero data retention.</p>
              </div>
            </div>
          </div>

          <div class="m-auth-btns">
            <div class="m-btn-apple">
              <span class="apple-logo"></span>
              <span>Continue with Apple</span>
            </div>
            <div class="m-btn-google">
              <span class="google-logo">G</span>
              <span>Continue with Google</span>
            </div>
            <div class="m-btn-email">
              <span>✉️ Sign In with Mobile / Email OTP</span>
            </div>
          </div>

          <div class="m-legal-footer">
            <p>By signing in, you agree to our <span class="link">Terms</span>, <span class="link">EULA</span> & <span class="link">Privacy Policy</span>.</p>
            <p class="m-comp-tag">Apple App Store Compliant · 100% Data Sovereignty</p>
          </div>
        </div>
      </div>
    `
  }
];

async function generateAll() {
  console.log('🚀 Starting Scaled Pixel-Perfect 10-Screenshot Generation (1290 x 2796)...');
  const browser = await chromium.launch({ headless: true });

  for (const config of SCREENSHOT_CONFIGS) {
    console.log(`Rendering: ${config.filename}`);
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1290, height: 2796 });

    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Pinyon+Script&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            width: 1290px;
            height: 2796px;
            background: linear-gradient(180deg, #160102 0%, #2E0306 23%, #FAF7F2 23.1%, #F3ECE1 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            font-family: 'Plus Jakarta Sans', sans-serif;
            overflow: hidden;
            position: relative;
          }
          
          /* Top Marketing Header */
          .header-box {
            height: 600px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 30px 50px 0;
            z-index: 10;
          }
          .brand-script {
            font-family: 'Pinyon Script', cursive;
            font-size: 54px;
            color: #D8B486;
            margin-bottom: -14px;
          }
          .brand-title {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 76px;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: #FFFFFF;
            font-weight: 700;
            line-height: 1.1;
            margin-bottom: 16px;
          }
          .headline {
            font-size: 52px;
            font-weight: 800;
            color: #FFFFFF;
            line-height: 1.15;
            margin-bottom: 10px;
            max-width: 1160px;
            letter-spacing: -0.01em;
          }
          .subheadline {
            font-size: 29px;
            font-weight: 600;
            color: #D8B486;
            letter-spacing: 0.02em;
            max-width: 1000px;
            line-height: 1.35;
          }

          /* iPhone Mockup Frame (1080 x 2180) */
          .device-wrapper {
            width: 1080px;
            height: 2196px;
            background: #000000;
            border-radius: 96px 96px 0 0;
            border: 14px solid #2B2522;
            border-bottom: none;
            box-shadow: 0 -25px 90px rgba(0, 0, 0, 0.5);
            overflow: hidden;
            position: absolute;
            bottom: 0;
            display: flex;
            flex-direction: column;
          }
          .dynamic-island {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 270px;
            height: 58px;
            background: #000000;
            border-radius: 40px;
            z-index: 100;
          }

          /* SCALED MOBILE CONTAINER (430 x 870 scaled by 2.5116 to fit 1080 x 2180) */
          .mobile-container-scale {
            width: 430px;
            height: 870px;
            transform-origin: top left;
            transform: scale(2.5116);
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .mobile-screen {
            width: 100%;
            height: 100%;
            background: #F8F5F0;
            color: #161412;
            display: flex;
            flex-direction: column;
            padding-top: 34px; /* Dynamic island offset */
            position: relative;
          }
          .bg-warm { background: #FAF7F2; }

          /* Mobile Header */
          .m-header {
            padding: 8px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #FFFFFF;
            border-bottom: 1px solid #E8DDD0;
            flex-shrink: 0;
          }
          .m-header-left { display: flex; flex-direction: column; }
          .m-script-at {
            font-family: 'Pinyon Script', cursive;
            font-size: 14px;
            color: #560406;
            margin-bottom: -5px;
          }
          .m-brand-name {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 18px;
            letter-spacing: 0.18em;
            color: #560406;
            font-weight: 700;
          }
          .m-header-right { display: flex; align-items: center; gap: 6px; }
          .m-pill-curated {
            background: #F4ECE1;
            color: #560406;
            font-weight: 700;
            font-size: 9px;
            padding: 4px 8px;
            border-radius: 10px;
            border: 0.5px solid #E3D4C2;
          }
          .m-icon-btn {
            width: 26px;
            height: 26px;
            background: #FFFFFF;
            border: 1px solid #E8DDD0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .m-back-btn {
            background: #F4ECE1;
            color: #560406;
            font-weight: 700;
            font-size: 10px;
            padding: 4px 10px;
            border-radius: 12px;
          }
          .m-share-text { font-size: 10px; font-weight: 700; color: #560406; }
          .m-lock-badge {
            background: #560406;
            color: #F5E6D3;
            font-weight: 700;
            font-size: 9px;
            padding: 4px 8px;
            border-radius: 10px;
          }
          .m-badge-count {
            background: #560406;
            color: #FFFFFF;
            font-size: 9px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 12px;
          }
          .m-badge-burgundy {
            background: #560406;
            color: #F5E6D3;
            font-weight: 700;
            font-size: 9px;
            padding: 4px 10px;
            border-radius: 12px;
          }
          .m-badge-gold {
            background: linear-gradient(135deg, #D8B486 0%, #B88E52 100%);
            color: #1A0304;
            font-weight: 800;
            font-size: 9px;
            padding: 4px 10px;
            border-radius: 12px;
          }
          .m-reset-btn { font-size: 10px; font-weight: 700; color: #560406; text-decoration: underline; }

          /* Mobile Bottom Dock */
          .m-bottom-dock {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            background: #FFFFFF;
            border: 1px solid #E8DDD0;
            border-radius: 20px;
            display: flex;
            justify-content: space-around;
            padding: 8px 10px;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
            z-index: 50;
          }
          .m-dock-item {
            font-size: 10px;
            font-weight: 700;
            color: #6E6864;
            padding: 4px 8px;
            border-radius: 12px;
          }
          .m-dock-item.active {
            background: #560406;
            color: #FFFFFF;
          }

          /* Scroll Container Inside Mobile Screen */
          .m-scroll-fill {
            flex: 1;
            padding: 10px 14px 60px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            overflow: hidden;
          }

          /* Buttons & Common */
          .m-actions-row { display: flex; gap: 8px; margin-top: 2px; }
          .m-actions-stack { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
          .m-btn {
            flex: 1;
            padding: 10px;
            border-radius: 14px;
            text-align: center;
            font-weight: 800;
            font-size: 11px;
          }
          .m-btn-pri { background: #560406; color: #FFFFFF; box-shadow: 0 4px 12px rgba(86,4,6,0.25); }
          .m-btn-sec { background: #F8F4EF; color: #560406; border: 1px solid #E8DDD0; }
          .m-btn-block { background: #560406; color: #FFFFFF; }
          .m-btn-report { background: #F8F4EF; color: #560406; border: 1px solid #E8DDD0; }
          .m-row-between { display: flex; justify-content: space-between; align-items: center; }

          /* Screen 1: Discovery Card */
          .m-card-feed {
            flex: 1;
            margin: 8px 12px 55px;
            background: #FFFFFF;
            border-radius: 24px;
            border: 1px solid #E8DDD0;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 8px 20px rgba(0,0,0,0.06);
          }
          .m-card-photo {
            flex: 1;
            background-size: cover;
            background-position: center top;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 14px;
          }
          .m-photo-grad {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.02) 30%, rgba(0,0,0,0.85) 85%, #0B0102 100%);
          }
          .m-badge-row { display: flex; flex-wrap: wrap; gap: 6px; position: relative; z-index: 10; }
          .m-badge-score { background: #560406; color: #F5E6D3; padding: 5px 10px; border-radius: 14px; font-weight: 800; font-size: 10px; }
          .m-badge-vouched { background: rgba(0,0,0,0.7); backdrop-filter: blur(6px); color: #FFFFFF; padding: 5px 10px; border-radius: 14px; font-weight: 700; font-size: 10px; }
          .m-badge-astro { background: rgba(216, 180, 134, 0.95); color: #2B0204; padding: 5px 10px; border-radius: 14px; font-weight: 800; font-size: 10px; }
          .m-badge-green { background: #2E7D32; color: #FFFFFF; padding: 3px 8px; border-radius: 8px; font-weight: 800; font-size: 9px; }
          .m-badge-gold { background: #D8B486; color: #2B0204; padding: 3px 8px; border-radius: 8px; font-weight: 800; font-size: 9px; }
          .m-card-overlay { position: relative; z-index: 10; color: #FFFFFF; display: flex; flex-direction: column; gap: 4px; }
          .m-name-row { display: flex; align-items: center; gap: 8px; }
          .m-name-row h2 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 26px; font-weight: 700; line-height: 1; }
          .m-verified-seal { background: linear-gradient(135deg, #D8B486 0%, #B88E52 100%); color: #1A0304; font-size: 9px; font-weight: 800; padding: 3px 7px; border-radius: 8px; }
          .m-meta { font-size: 12px; color: #F5E6D3; font-weight: 500; }
          .m-career-pill { align-self: flex-start; background: rgba(255,255,255,0.22); backdrop-filter: blur(8px); padding: 5px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; border: 0.5px solid rgba(255,255,255,0.4); }
          .m-tag-cloud { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 2px; }
          .m-tag { background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); padding: 4px 8px; border-radius: 8px; font-size: 9px; color: #FFFFFF; font-weight: 600; }

          /* Screen 2: Dossier Hero */
          .m-dossier-hero {
            height: 170px;
            border-radius: 18px;
            background-size: cover;
            background-position: center 25%;
            position: relative;
            display: flex;
            align-items: flex-end;
            padding: 12px;
            overflow: hidden;
          }
          .m-dossier-hero-text { position: relative; z-index: 10; color: #FFFFFF; }
          .m-dossier-hero-text h2 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; font-weight: 700; line-height: 1; }
          .m-dossier-hero-text p { font-size: 10px; color: #F5E6D3; }
          .mb-1 { margin-bottom: 4px; }
          .m-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; background: #FFFFFF; border: 1px solid #E8DDD0; border-radius: 14px; padding: 8px 6px; text-align: center; }
          .m-stat { display: flex; flex-direction: column; gap: 2px; }
          .m-lbl { font-size: 8px; color: #7A726D; font-weight: 600; }
          .m-stat strong { font-size: 9.5px; color: #161412; }
          .text-gold { color: #8C5E1E !important; }
          .text-burgundy { color: #560406 !important; }
          .text-green { color: #2E7D32 !important; }
          .text-sm { font-size: 9px; }

          .m-section-card { background: #FFFFFF; border-radius: 14px; border: 1px solid #E8DDD0; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; }
          .m-sec-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #F0E8DD; padding-bottom: 4px; }
          .m-section-card h3 { font-size: 11px; font-weight: 800; color: #560406; }
          .m-tag-green { font-size: 8px; font-weight: 800; color: #2E7D32; background: #E8F5E9; padding: 2px 6px; border-radius: 6px; }
          .m-tag-gold { font-size: 8px; font-weight: 800; color: #8C5E1E; background: #FEF7E6; padding: 2px 6px; border-radius: 6px; }
          .m-info-list { display: flex; flex-direction: column; gap: 4px; }
          .m-info-item { font-size: 10px; display: flex; }
          .m-info-item .k { width: 80px; flex-shrink: 0; font-weight: 700; color: #4A4440; }
          .m-info-item .v { flex: 1; color: #1A1614; font-weight: 600; }
          .m-pills-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
          .m-trust-badge { background: #F8F5F0; border: 1px solid #E3D7C7; padding: 6px 8px; border-radius: 8px; font-size: 9px; font-weight: 700; color: #2B2522; text-align: center; }

          /* Screen 3: BlurShield */
          .m-blur-card { background: #FFFFFF; border: 1px solid #E8DDD0; border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; }
          .m-blur-photo { height: 260px; background-size: cover; background-position: center top; position: relative; }
          .m-blur-overlay { position: absolute; inset: 0; background: rgba(30, 8, 10, 0.78); backdrop-filter: blur(16px); display: flex; align-items: center; justify-content: center; text-align: center; padding: 18px; }
          .m-shield-center { display: flex; flex-direction: column; align-items: center; color: #FFFFFF; }
          .m-shield-big-icon { font-size: 42px; margin-bottom: 6px; }
          .m-shield-center h2 { font-size: 18px; font-weight: 800; color: #D8B486; margin-bottom: 4px; }
          .m-shield-center p { font-size: 10px; line-height: 1.35; color: #FAF4EB; margin-bottom: 12px; max-width: 320px; }
          .m-unlock-pill { background: linear-gradient(135deg, #D8B486 0%, #B88E52 100%); color: #1A0304; font-weight: 800; font-size: 10.5px; padding: 8px 16px; border-radius: 16px; }
          .m-blur-footer { padding: 10px 14px; background: #FFFFFF; border-top: 1px solid #E8DDD0; display: flex; justify-content: space-between; align-items: center; }
          .m-blur-footer h3 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 16px; color: #560406; font-weight: 700; }
          .m-blur-footer p { font-size: 9px; color: #6E6864; font-weight: 600; }
          .m-tag-dark { background: #F4ECE1; color: #560406; padding: 4px 8px; border-radius: 8px; font-weight: 700; font-size: 9px; }
          .m-toggle-item { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
          .m-toggle-item strong { display: block; font-size: 10px; color: #1A1614; }
          .m-toggle-item p { font-size: 8px; color: #6E6864; }
          .m-status-pill { font-size: 8px; font-weight: 800; padding: 3px 6px; border-radius: 6px; white-space: nowrap; }
          .m-status-pill.green { background: #E8F5E9; color: #2E7D32; }
          .m-status-pill.gold { background: #FEF7E6; color: #8C5E1E; }

          /* Screen 4: Alliances List */
          .m-banner-alliances { background: #560406; color: #FFFFFF; border-radius: 14px; padding: 10px 12px; }
          .m-banner-alliances h4 { font-size: 12px; font-weight: 800; color: #F5E6D3; margin-bottom: 2px; }
          .m-banner-alliances p { font-size: 9px; color: #E3D3C1; line-height: 1.3; }
          .m-tabs-row { display: flex; gap: 6px; }
          .m-tab-item { background: #FFFFFF; border: 1px solid #E8DDD0; padding: 5px 10px; border-radius: 10px; font-size: 9px; font-weight: 700; color: #6E6864; }
          .m-tab-item.active { background: #560406; color: #FFFFFF; border-color: #560406; }
          .m-list-cards { display: flex; flex-direction: column; gap: 6px; }
          .m-alliance-card { background: #FFFFFF; border: 1px solid #E8DDD0; border-radius: 14px; padding: 8px 10px; display: flex; align-items: center; gap: 10px; }
          .m-avatar { width: 50px; height: 50px; border-radius: 50%; background-size: cover; background-position: center top; border: 1.5px solid #D8B486; position: relative; flex-shrink: 0; }
          .m-dot { position: absolute; bottom: 0; right: 0; width: 12px; height: 12px; background: #2E7D32; border-radius: 50%; border: 2px solid #FFFFFF; }
          .m-alliance-info { flex: 1; display: flex; flex-direction: column; gap: 1px; }
          .m-alliance-info h4 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 15px; font-weight: 700; color: #1A1614; }
          .m-badge-sm { background: #F4ECE1; color: #560406; font-weight: 800; font-size: 8px; padding: 2px 6px; border-radius: 6px; }
          .m-alliance-info .role { font-size: 9.5px; font-weight: 700; color: #4A4440; }
          .m-alliance-info .sub { font-size: 8.5px; color: #7A726D; }
          .m-btn-chat { background: #560406; color: #FFFFFF; padding: 7px 12px; border-radius: 12px; font-weight: 800; font-size: 10px; }
          .m-btn-pending { background: #F4ECE1; color: #7A726D; border: 1px solid #E8DDD0; padding: 7px 10px; border-radius: 12px; font-weight: 800; font-size: 9.5px; }
          .m-btn-review { background: #D8B486; color: #1A0304; padding: 7px 12px; border-radius: 12px; font-weight: 800; font-size: 10px; }

          /* Screen 5: Encrypted Chat */
          .m-chat-header { padding: 8px 14px; background: #FFFFFF; border-bottom: 1px solid #E8DDD0; display: flex; justify-content: space-between; align-items: center; }
          .m-chat-user { display: flex; align-items: center; gap: 8px; }
          .m-chat-avatar { width: 40px; height: 40px; border-radius: 50%; background-size: cover; border: 1.5px solid #D8B486; position: relative; }
          .m-chat-dot { position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; background: #2E7D32; border-radius: 50%; border: 1.5px solid #FFFFFF; }
          .m-chat-user h3 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 17px; font-weight: 700; color: #1A1614; }
          .m-chat-online { font-size: 9px; color: #2E7D32; font-weight: 600; }
          .m-chat-enc { background: #E8F5E9; color: #2E7D32; font-weight: 800; font-size: 9px; padding: 4px 8px; border-radius: 8px; }
          .m-chat-body { flex: 1; padding: 10px 14px; display: flex; flex-direction: column; gap: 8px; justify-content: space-around; }
          .m-chat-date { text-align: center; font-size: 9px; color: #7A726D; font-weight: 600; }
          .m-bubble { max-width: 85%; padding: 8px 12px; border-radius: 14px; font-size: 10.5px; line-height: 1.35; position: relative; }
          .m-bubble p { margin-bottom: 2px; }
          .m-bubble-in { align-self: flex-start; background: #FFFFFF; color: #1A1614; border: 1px solid #E8DDD0; border-bottom-left-radius: 4px; }
          .m-bubble-out { align-self: flex-end; background: #560406; color: #FFFFFF; border-bottom-right-radius: 4px; }
          .m-time { display: block; text-align: right; font-size: 8px; opacity: 0.75; }
          .m-attachment { align-self: flex-start; background: #FFFFFF; border: 1px solid #D8B486; border-radius: 12px; padding: 8px 10px; display: flex; align-items: center; gap: 8px; max-width: 85%; }
          .m-att-icon { font-size: 20px; }
          .m-att-info strong { display: block; font-size: 9.5px; color: #560406; }
          .m-att-info span { font-size: 8px; color: #7A726D; }
          .m-att-btn { background: #560406; color: #FFFFFF; font-weight: 800; font-size: 8.5px; padding: 4px 8px; border-radius: 8px; }
          .m-audio-bubble { align-self: flex-start; background: #FFFFFF; border: 1px solid #E8DDD0; border-radius: 12px; padding: 6px 10px; display: flex; align-items: center; gap: 8px; width: 75%; }
          .m-play-btn { width: 24px; height: 24px; background: #560406; color: #FFFFFF; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; }
          .m-audio-wave { flex: 1; display: flex; flex-direction: column; gap: 2px; }
          .m-bars { display: flex; align-items: center; gap: 2px; }
          .m-bars span { width: 3px; background: #560406; border-radius: 2px; }
          .m-audio-dur { font-size: 8px; color: #7A726D; font-weight: 600; }
          .m-chat-input-bar { padding: 8px 14px 14px; background: #FFFFFF; border-top: 1px solid #E8DDD0; display: flex; align-items: center; gap: 8px; }
          .m-btn-add { font-size: 16px; font-weight: 700; color: #7A726D; }
          .m-fake-input { flex: 1; background: #F8F5F0; border: 1px solid #E8DDD0; border-radius: 18px; padding: 6px 10px; font-size: 10px; color: #8C847E; }
          .m-btn-mic { font-size: 13px; }
          .m-btn-send { width: 28px; height: 28px; background: #560406; color: #FFFFFF; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; }

          /* Screen 6: Safety Modal */
          .m-safety-card { background: #FFFFFF; border: 1px solid #E8DDD0; border-radius: 18px; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
          .m-safety-header { text-align: center; border-bottom: 1px solid #F0E8DD; padding-bottom: 6px; }
          .m-shield-big { font-size: 32px; margin-bottom: 2px; }
          .m-safety-header h2 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; color: #560406; font-weight: 700; }
          .m-safety-header p { font-size: 9px; color: #6E6864; line-height: 1.3; }
          .m-reasons-list { display: flex; flex-direction: column; gap: 6px; }
          .m-reason { background: #FBF9F5; border: 1px solid #E8DDD0; border-radius: 12px; padding: 8px 10px; display: flex; align-items: center; gap: 8px; }
          .m-reason.selected { border-color: #560406; background: #FFF9F9; }
          .m-r-icon { font-size: 18px; flex-shrink: 0; }
          .m-r-text { flex: 1; }
          .m-r-text strong { display: block; font-size: 10px; color: #1A1614; }
          .m-r-text p { font-size: 8px; color: #6E6864; }
          .m-r-tag { font-size: 8px; color: #560406; font-weight: 800; background: #F8ECEC; padding: 2px 6px; border-radius: 6px; }
          .m-r-arrow { font-size: 14px; color: #A89F98; }
          .m-r-sla { background: #FEF7E6; color: #8C5E1E; font-weight: 800; font-size: 8px; padding: 2px 6px; border-radius: 6px; }
          .m-r-eula { background: #E8F5E9; color: #2E7D32; font-weight: 800; font-size: 8px; padding: 2px 6px; border-radius: 6px; }
          .m-safety-note { background: #F8F4EF; border: 1px solid #E8DDD0; border-radius: 10px; padding: 8px 10px; }
          .m-safety-note h4 { font-size: 9.5px; font-weight: 800; color: #560406; margin-bottom: 2px; }
          .m-safety-note p { font-size: 8.5px; color: #4A4440; line-height: 1.3; }

          /* Screen 7: Profile Score */
          .m-score-user-card { background: #FFFFFF; border: 1px solid #E8DDD0; border-radius: 14px; padding: 10px 12px; display: flex; align-items: center; gap: 10px; }
          .m-score-avatar { width: 50px; height: 50px; border-radius: 50%; background-size: cover; border: 2px solid #D8B486; flex-shrink: 0; }
          .m-score-info h2 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 17px; font-weight: 700; color: #1A1614; }
          .m-score-info .role { font-size: 9px; color: #560406; font-weight: 600; margin: 1px 0 3px; }
          .m-trust-banner { background: linear-gradient(135deg, #280204 0%, #560406 100%); color: #FFFFFF; border-radius: 14px; padding: 10px 12px; display: flex; align-items: center; gap: 10px; }
          .m-circle-score { width: 50px; height: 50px; border-radius: 50%; border: 3px solid #D8B486; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); flex-shrink: 0; }
          .m-circle-score .num { font-size: 19px; font-weight: 900; color: #FFFFFF; line-height: 1; }
          .m-circle-score .den { font-size: 7px; color: #D8B486; font-weight: 700; }
          .m-trust-text h3 { font-size: 12px; font-weight: 800; color: #F5E6D3; margin-bottom: 2px; }
          .m-trust-text p { font-size: 8.5px; color: #E8DDD0; line-height: 1.3; }
          .m-vector-row { display: flex; flex-direction: column; gap: 2px; }
          .m-vector-row span { font-size: 9px; color: #38322E; font-weight: 600; }
          .m-vector-row strong { font-size: 9px; color: #1A1614; }
          .m-track { width: 100%; height: 6px; background: #F0E8DD; border-radius: 4px; overflow: hidden; }
          .m-bar { height: 100%; border-radius: 4px; }
          .m-bar.gold { background: linear-gradient(90deg, #D8B486, #B88E52); }
          .m-bar.burgundy { background: linear-gradient(90deg, #8A1518, #560406); }
          .m-audit-card { background: #FDFBF8; border: 1px solid #E8DDD0; border-radius: 10px; padding: 8px 10px; display: flex; flex-direction: column; gap: 3px; }
          .m-audit-card h4 { font-size: 9px; font-weight: 800; color: #560406; margin-bottom: 1px; }

          /* Screen 8: Share Portal */
          .m-share-hero { height: 180px; border-radius: 16px; background-size: cover; background-position: center top; position: relative; display: flex; flex-direction: column; justify-content: space-between; padding: 12px; overflow: hidden; }
          .m-watermark-pill { align-self: flex-start; position: relative; z-index: 10; background: rgba(86,4,6,0.9); color: #F5E6D3; font-size: 7.5px; font-weight: 800; padding: 3px 7px; border-radius: 6px; }
          .m-share-hero-text { position: relative; z-index: 10; color: #FFFFFF; }
          .m-share-hero-text h2 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 20px; font-weight: 700; }
          .m-share-hero-text p { font-size: 9.5px; color: #F5E6D3; }
          .m-italic-text { font-size: 9px; line-height: 1.35; color: #4A4440; font-style: italic; }
          .m-verdict-row { display: flex; justify-content: space-between; font-size: 8.5px; }
          .m-verdict-row .voter { font-weight: 700; color: #4A4440; }
          .m-verdict-row .verdict-ok { color: #2E7D32; font-weight: 800; }
          .m-tip-card { background: #FDF8F0; border: 1px solid #E8DDD0; border-radius: 10px; padding: 6px 10px; }
          .m-tip-card h4 { font-size: 8.5px; font-weight: 800; color: #8C5E1E; margin-bottom: 1px; }
          .m-tip-card p { font-size: 8px; color: #5A524C; }

          /* Screen 9: Filters */
          .m-results-banner { background: #FFFFFF; border: 1px solid #E8DDD0; border-radius: 10px; padding: 6px 10px; display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; font-weight: 700; }
          .m-filter-label { font-size: 10px; font-weight: 800; color: #560406; }
          .m-tag-wrap { display: flex; flex-wrap: wrap; gap: 4px; }
          .m-filter-tag { background: #F8F5F0; color: #4A4440; border: 1px solid #E3D7C7; padding: 4px 8px; border-radius: 10px; font-size: 8.5px; font-weight: 700; }
          .m-filter-tag.active { background: #560406; color: #FFFFFF; border-color: #560406; }
          .m-apply-btn { background: #560406; color: #FFFFFF; padding: 10px; border-radius: 14px; text-align: center; font-size: 11px; font-weight: 800; box-shadow: 0 4px 14px rgba(86,4,6,0.3); }

          /* Screen 10: Auth Master */
          .auth-flex { padding: 0 !important; display: flex; flex-direction: column; }
          .m-auth-hero { height: 260px; background-size: cover; background-position: center top; position: relative; display: flex; align-items: center; justify-content: center; padding: 40px 16px 14px; flex-shrink: 0; }
          .m-auth-hero-grad { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(22,1,2,0.3) 0%, rgba(46,3,6,0.85) 75%, #FAF7F2 100%); }
          .m-auth-crest { position: relative; z-index: 10; text-align: center; color: #FFFFFF; }
          .m-script-at-lg { font-family: 'Pinyon Script', cursive; font-size: 32px; color: #D8B486; display: block; margin-bottom: -10px; }
          .m-brand-lg { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 40px; letter-spacing: 0.22em; color: #FFFFFF; font-weight: 700; line-height: 1; }
          .m-sub-lg { font-size: 11px; letter-spacing: 0.35em; color: #D8B486; font-weight: 800; margin-top: 4px; }
          .m-tagline { font-size: 10.5px; color: #F8ECE1; font-weight: 600; margin-top: 6px; }
          .m-auth-card-body { flex: 1; padding: 10px 16px 14px; display: flex; flex-direction: column; justify-content: space-around; }
          .m-trust-features { display: flex; flex-direction: column; gap: 6px; }
          .m-trust-feat { background: #FFFFFF; border: 1px solid #E8DDD0; border-radius: 12px; padding: 8px 10px; display: flex; align-items: center; gap: 8px; }
          .m-trust-feat .icon { font-size: 18px; flex-shrink: 0; }
          .m-trust-feat strong { display: block; font-size: 9.5px; color: #1A1614; }
          .m-trust-feat p { font-size: 8px; color: #6E6864; }
          .m-auth-btns { display: flex; flex-direction: column; gap: 6px; }
          .m-btn-apple { background: #000000; color: #FFFFFF; padding: 11px; border-radius: 14px; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 11.5px; font-weight: 800; box-shadow: 0 4px 12px rgba(0,0,0,0.25); }
          .apple-logo { font-size: 14px; }
          .m-btn-google { background: #FFFFFF; color: #1A1614; border: 1px solid #E8DDD0; padding: 9px; border-radius: 14px; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 10.5px; font-weight: 800; }
          .google-logo { font-size: 12px; font-weight: 900; color: #4285F4; }
          .m-btn-email { background: #F8F4EF; color: #560406; border: 1px solid #E8DDD0; padding: 9px; border-radius: 14px; text-align: center; font-size: 10.5px; font-weight: 800; }
          .m-legal-footer { text-align: center; font-size: 8.5px; color: #7A726D; line-height: 1.4; }
          .m-legal-footer .link { color: #560406; font-weight: 700; text-decoration: underline; }
          .m-comp-tag { margin-top: 3px; color: #2E7D32; font-weight: 700; font-size: 8px; }
        </style>
      </head>
      <body>
        <div class="header-box">
          <span class="brand-script">${config.scriptTitle}</span>
          <h1 class="brand-title">${config.brandTitle}</h1>
          <h2 class="headline">${config.headline}</h2>
          <p class="subheadline">${config.subheadline}</p>
        </div>

        <div class="device-wrapper">
          <div class="dynamic-island"></div>
          <div class="mobile-container-scale">
            ${config.renderPhoneUI()}
          </div>
        </div>
      </body>
      </html>
    `;

    await page.setContent(fullHtml, { waitUntil: 'networkidle' });
    
    // Save to artifact directory
    const artifactPath = path.join(OUTPUT_DIR, config.filename);
    await page.screenshot({ path: artifactPath, type: 'png' });

    // Save to user's Downloads directory
    const downloadsPath = path.join(DOWNLOADS_DIR, config.filename);
    await page.screenshot({ path: downloadsPath, type: 'png' });

    console.log(` Saved: ${config.filename}`);
    await page.close();
  }

  await browser.close();
  console.log(' All 10 screenshots generated flawlessly!');
}

generateAll().catch(console.error);
