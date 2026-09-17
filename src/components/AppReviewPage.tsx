import React from 'react';
import { Download, ExternalLink } from 'lucide-react';

export const AppReviewPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#161412] font-sans p-4 sm:p-8 flex flex-col items-center">
      <div className="max-w-3xl w-full space-y-6">
        {/* Header */}
        <div className="text-center pt-4 space-y-2">
          <span className="text-[11px] uppercase tracking-[0.35em] font-extrabold text-[#A17B5E] block">
            Mannat — Bespoke Matrimony
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            App Review &amp; Demo Verification
          </h1>
          <span className="inline-block bg-[#F4EAE0] text-[#560406] border border-[#E8DDD0] px-3.5 py-1 rounded-full text-xs font-bold tracking-wide">
            Apple App Store Review Reference (v1.0 Build 2)
          </span>
        </div>

        {/* Video Card */}
        <div className="bg-white border border-[#E8DDD0] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-[#560406] border-b border-[#E8DDD0] pb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            1. Video Walkthrough (iPhone Viewport)
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6259]">
            Continuous walkthrough starting at clean app launch on an iPhone viewport, covering Sign in with Apple, profile discovery, BlurShield™ photo privacy, mutual alliance requests, concierge messaging, safety reporting &amp; member blocking, and account/data deletion (Guideline 5.1.1).
          </p>

          <div className="rounded-xl overflow-hidden bg-black flex justify-center shadow-lg my-3">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/og-image.jpg"
              className="w-full max-w-sm h-auto rounded-lg"
            >
              <source src="/app-review-demo.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/app-review-demo.webm"
              download="mannat_app_review_recording.webm"
              className="inline-flex items-center gap-2 bg-[#560406] hover:bg-[#3A0204] text-[#FDFBF7] px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs"
            >
              <Download className="w-4 h-4" />
              Download Video (.webm)
            </a>
            <a
              href="/app"
              className="inline-flex items-center gap-2 bg-[#FDFBF7] border border-[#E8DDD0] text-[#560406] hover:bg-[#F4EAE0] px-4 py-2.5 rounded-xl text-xs font-bold transition"
            >
              <ExternalLink className="w-4 h-4 text-[#A17B5E]" />
              Launch Web App
            </a>
          </div>
        </div>

        {/* Demo Credentials Card */}
        <div className="bg-white border border-[#E8DDD0] rounded-2xl p-6 shadow-xs space-y-3">
          <h2 className="text-xl font-bold text-[#560406] border-b border-[#E8DDD0] pb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            2. Demo Login &amp; Reviewer Access
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6259]">
            Reviewers do not require SMS or waiting for concierge verification. A pre-verified account is enabled for instant 1-tap email login on the main launch screen:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-[#FDFBF7] border border-[#E8DDD0] rounded-xl p-3.5">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#A17B5E] block mb-1">Login Method</span>
              <span className="text-xs font-bold text-[#161412]">Email Sign-In (Launch Screen)</span>
            </div>
            <div className="bg-[#FDFBF7] border border-[#E8DDD0] rounded-xl p-3.5">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#A17B5E] block mb-1">Demo Email</span>
              <code className="text-xs font-bold text-[#560406] bg-white px-2 py-0.5 rounded border border-[#E8DDD0]">rahul@mannat.vip</code>
            </div>
            <div className="bg-[#FDFBF7] border border-[#E8DDD0] rounded-xl p-3.5">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#A17B5E] block mb-1">Demo Candidate</span>
              <code className="text-xs font-bold text-[#560406] bg-white px-2 py-0.5 rounded border border-[#E8DDD0]">Rahul Sharma</code>
            </div>
            <div className="bg-[#FDFBF7] border border-[#E8DDD0] rounded-xl p-3.5">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#A17B5E] block mb-1">Password / OTP</span>
              <span className="text-xs font-bold text-emerald-800">None required (Instant Access)</span>
            </div>
          </div>
          <p className="text-[11px] text-[#6E6259] pt-1">
            * Note: Sign in with Apple is also fully functional for any standard Apple ID / sandbox reviewer account.
          </p>
        </div>

        {/* Purpose & Services */}
        <div className="bg-white border border-[#E8DDD0] rounded-2xl p-6 shadow-xs space-y-3">
          <h2 className="text-xl font-bold text-[#560406] border-b border-[#E8DDD0] pb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            3. Purpose &amp; Infrastructure
          </h2>
          <p className="text-xs sm:text-sm text-[#161412] leading-relaxed">
            <strong>Mannat: Elite Matrimony</strong> is a private, intention-first matrimonial matchmaking and family alliance network designed exclusively for marriage-seeking adults (18+) and their families. It provides discreet introductions, BlurShield™ photo privacy protection, and verified biodata exchanges.
          </p>
          <ul className="text-xs sm:text-sm text-[#6E6259] space-y-1.5 list-disc pl-5 pt-2">
            <li><strong>Authentication:</strong> Sign in with Apple, Google Sign-In, and Supabase Auth.</li>
            <li><strong>Backend &amp; Database:</strong> Supabase (PostgreSQL database for real-time messaging, connections, and privacy settings).</li>
            <li><strong>Storage:</strong> Supabase Storage (Encrypted bucket for candidate bio-data &amp; photo uploads).</li>
            <li><strong>Device APIs:</strong> Native Capacitor iOS plugins (Haptics, Status Bar, Splash Screen, Share).</li>
            <li><strong>In-App Purchases:</strong> None active in this build (all features free to access, no gated consumables or StoreKit subscriptions).</li>
            <li><strong>Safety &amp; Moderation (Guideline 1.2):</strong> Profile reporting and blocking with immediate UI removal.</li>
            <li><strong>Account Deletion (Guideline 5.1.1):</strong> Instant account &amp; data wipe available in Profile Settings.</li>
          </ul>
        </div>

        <div className="text-center text-xs text-[#6E6259] pt-4 pb-8">
          &copy; 2026 Mannat Matrimony. Confidential — Prepared for Apple App Review Team.
        </div>
      </div>
    </div>
  );
};
