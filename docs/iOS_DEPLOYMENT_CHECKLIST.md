# iOS App Store Deployment Checklist

## Pre-Submission (1-2 weeks before)

### App Setup
- [ ] Apple Developer Account is active and in good standing
- [ ] App created in App Store Connect
- [ ] Bundle ID (`vip.mannat.app`) is reserved in Apple Developer
- [ ] Team ID configured in Xcode signing
- [ ] Provisioning profiles generated for distribution

### Code & Testing
- [ ] All linting warnings resolved (`npm run lint`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] No TypeScript errors
- [ ] Tested on physical iOS device (minimum iOS 12)
- [ ] Tested on latest iPhone and iPad models
- [ ] Tested on both portrait and landscape orientations
- [ ] All features work including StoreKit In-App Purchases

### Compliance
- [ ] Privacy Policy created and published
- [ ] Terms of Service (EULA) created
- [ ] Privacy Manifest updated if collecting user data
- [ ] Data usage disclosures completed in App Store Connect
- [ ] COPPA compliance verified (if under 13 age group targeted)

## Submission Week

### Prepare Assets (Required)
- [ ] App Icon (1024x1024 PNG, no transparency)
- [ ] Screenshots (5-6 per language, 1170x2532 for iPhone)
- [ ] iPad Screenshots (5-6 per language, 2048x2732)
- [ ] App Preview Video (optional but recommended)
- [ ] App Description (max 170 characters)
- [ ] Promotional Text (max 170 characters)
- [ ] Keywords (comma-separated, max 100 characters)
- [ ] Support URL
- [ ] Privacy Policy URL

### App Information
- [ ] Category selected (likely: Lifestyle or Dating)
- [ ] Content Rating Questionnaire completed
- [ ] Age-appropriate rating applied
- [ ] App Clips configured (if applicable)

### Release Information
- [ ] Version number set (e.g., 1.0.0)
- [ ] Build number incremented
- [ ] Release Notes written (what's new)
- [ ] Copyright year updated

### In-App Purchases
- [ ] All three subscription tiers configured:
  - [ ] Gold: $19.99/month (ID: `vip.mannat.sub.gold`)
  - [ ] Diamond: $29.99/month (ID: `vip.mannat.sub.diamond`)
  - [ ] Platinum: $49.99/month (ID: `vip.mannat.sub.platinum`)
- [ ] Pricing tiers set for all regions
- [ ] Subscription descriptions clear about auto-renewal terms
- [ ] Restore Purchases functionality implemented
- [ ] Terms and conditions for subscriptions visible in app

### Build & Upload
- [ ] Run `npm run build` to generate web assets
- [ ] Run `npm run cap:sync ios` to sync to iOS
- [ ] Archive in Xcode: **Product** > **Archive**
- [ ] Validate archive before submission
- [ ] Upload to App Store Connect

### Legal & Compliance Review
- [ ] App does not violate App Store Review Guidelines
- [ ] No personal data collected without user consent
- [ ] No misleading screenshots or descriptions
- [ ] No external links to bypass App Store payments
- [ ] Subscription terms are clear and transparent

## After Submission

### Review Process (3-5 days typical)
- [ ] Monitor App Store Connect for review status
- [ ] Check email for any review rejection feedback
- [ ] If rejected, address issues and resubmit

### Release
- [ ] Set release date (manual or automatic)
- [ ] Notify users via in-app messaging or email
- [ ] Update website/marketing with new availability
- [ ] Monitor crash logs and ratings immediately post-launch

## Post-Launch

### First 48 Hours
- [ ] Monitor crash reports in Xcode
- [ ] Check App Store reviews and ratings
- [ ] Monitor In-App Purchase completion rates
- [ ] Test all features on production app

### Ongoing
- [ ] Set up monitoring for app performance
- [ ] Plan update schedule (monthly or quarterly)
- [ ] Respond to user reviews on App Store
- [ ] Track analytics and conversion metrics

## Important Notes

### iOS Requirements
- **Minimum iOS Version**: 12.0
- **Maximum Bundle Size**: ~500MB (over-the-air limit)
- **StoreKit Version**: Using SKPaymentTransaction (legacy, consider StoreKit 2)

### App Store Review Guidelines (Key Points)
1. **Subscriptions**: Must have clear pricing, terms, and easy cancellation
2. **Payments**: All purchases go through App Store (no direct payments)
3. **Privacy**: Must have privacy policy and honor user choices
4. **Rejections**: Most common reasons:
   - Misleading marketing
   - Buggy functionality
   - Subscription terms not clear
   - Privacy policy missing or inadequate

### Troubleshooting Rejections
- Guideline 3.1.1 (Business): Ensure subscription terms are clearly displayed
- Guideline 5.1.1 (Legal): Complete and accurate privacy policy required
- Guideline 2.1 (Performance): App must not crash on launch

## Support Resources

- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [StoreKit Testing](https://developer.apple.com/documentation/storekit/testing_your_in-app_purchases)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Capacitor Deployment](https://capacitorjs.com/docs/ios/deploying-to-app-store)

## Timeline

```
Week 1: Prepare assets, finalize app
Week 2: Internal testing on devices
Week 3: Final build, submit for review
Week 4: Monitor review, prepare release
Week 5: Launch on App Store
```

---

**Last Updated**: August 2026
**Version**: 1.0
