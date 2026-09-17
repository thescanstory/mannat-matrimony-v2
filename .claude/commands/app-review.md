# /app-review — Apple App Store Guideline 2.1 Resolution & Review Response

Use this command to retrieve all Apple App Review Information, Guideline 2.1 responses, demo credentials, live screen recording URLs, and compliance details for Mannat 1.0 (Build 2).

---

## 📋 Apple Review Reply (Copy & Paste)

```markdown
Hello App Review Team,

Screen recording: https://mannatmatrimony.com/app-review.html (Direct video file: https://mannatmatrimony.com/app-review-demo.webm)
The video demonstrates the complete app walkthrough on an iPhone viewport:
1. App launch, royal splash animation, and Sign in with Apple / 1-Tap verified email access.
2. Browsing verified candidate bio-datas and BlurShield™ photo privacy protection.
3. Sending Mutual Alliance / Interest requests.
4. Verified Concierge messaging and matchmaking assistant.
5. User Safety & Content Moderation: Reporting a profile and Blocking a member (with immediate UI removal).
6. Account Deletion: Navigating to Profile / Settings → Delete Account & Data (with complete data purge).

Purpose & Audience:
Mannat: Elite Matrimony is a private, intention-first matrimonial matchmaking and family alliance network designed exclusively for marriage-seeking adults (18+) and their families. It provides discreet introductions, BlurShield™ photo privacy protection, and verified biodata exchanges.

Demo Account Access:
Reviewers can access all verified features without waiting for manual verification or phone OTP:
- Email: rahul@mannat.vip
- Name: Rahul Sharma
- Password / OTP: Not required (Instant 1-tap authenticated access into a verified account)
- Note: Sign in with Apple is also fully supported and functional for sandbox or live Apple IDs.

External Services:
- Authentication: Sign in with Apple (@capgo/capacitor-social-login), Google Sign-In, Supabase Auth.
- Backend & Database: Supabase (PostgreSQL database for real-time messaging, connections, and privacy preferences).
- Storage: Supabase Storage (Encrypted media bucket for candidate bio-data & photo uploads).
- Device APIs: Native Capacitor iOS plugins (Haptics, Status Bar, Splash Screen, Share).
- Payments / In-App Purchases: None active in this build (no gated digital consumables or StoreKit subscriptions).
- Matchmaking Engine: Client-side algorithmic profile compatibility scoring.

Regional Differences:
The application functions identically across all regions and territories where it is distributed.

Regulated Industry & Licensed Content:
Not applicable. Mannat is a matrimonial matchmaking platform and does not operate in regulated domains (such as banking, healthcare, or gambling), nor does it utilize any copyrighted or licensed third-party content.

This information has also been added to App Review Information → Notes.

Thank you,
Mannat Development Team
```

---

## 🔗 Live Reviewer URLs
- **Webpage:** `https://mannatmatrimony.com/app-review.html`
- **Video Direct (.webm):** `https://mannatmatrimony.com/app-review-demo.webm`
- **Local File:** `mannat_app_review_recording.webm`

## 🛠 Re-record Flow Command
To re-generate the video walkthrough locally at any time:
```bash
node scratch/record_apple_review_flow.js
```
