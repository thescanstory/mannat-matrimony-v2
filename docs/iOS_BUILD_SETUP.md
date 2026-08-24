# iOS Build Setup Guide for Mannat

## Prerequisites

- macOS 12.0+
- Xcode 14.0+
- CocoaPods installed: `sudo gem install cocoapods`
- Apple Developer Account (required for signing and App Store distribution)

## Initial Setup

### 1. Install Dependencies

```bash
npm install
cd ios && pod install && cd ..
```

### 2. Build Web Assets

```bash
npm run build
```

### 3. Sync to iOS

```bash
npx cap sync ios
```

## Xcode Configuration

### 1. Open Xcode Project

```bash
npm run cap:open:ios
```

This opens `/ios/App/App.xcodeproj` in Xcode.

### 2. Configure Team & Signing

1. In Xcode, select the **App** target
2. Go to **Signing & Capabilities**
3. Select your Team (Apple Developer Account)
4. Update **Bundle Identifier** if needed (currently: `vip.mannat.app`)
5. Enable automatic signing

### 3. Add In-App Purchase Capability

1. In **Signing & Capabilities** tab
2. Click **+ Capability**
3. Search for and add **In-App Purchase**

### 4. Configure App Store Connect

1. Log in to [App Store Connect](https://appstoreconnect.apple.com)
2. Create a new app with:
   - Bundle ID: `vip.mannat.app`
   - Name: `Mannat`
3. Go to **In-App Purchases** section
4. Add the following products:
   - **Gold Subscription**
     - Product ID: `vip.mannat.sub.gold`
     - Type: Auto-Renewable Subscription
     - Price: $19.99/month
   - **Diamond Subscription**
     - Product ID: `vip.mannat.sub.diamond`
     - Type: Auto-Renewable Subscription
     - Price: $29.99/month
   - **Platinum Subscription**
     - Product ID: `vip.mannat.sub.platinum`
     - Type: Auto-Renewable Subscription
     - Price: $49.99/month
   - **Sachet Unlock** (optional)
     - Product ID: `vip.mannat.sachet49`
     - Type: Consumable
     - Price: $0.99

## Building for Testing

### Local Testing

```bash
npm run build:ios
npm run cap:open:ios
```

Then in Xcode:
1. Select a simulator or connected device
2. Click the **Run** button (or ⌘R)

### TestFlight (Beta Testing)

1. In Xcode, select **Product** > **Archive**
2. Sign the archive
3. Upload to App Store Connect
4. Add testers in **TestFlight** section
5. Testers receive invitation via email

## Building for App Store

### 1. Version & Build Number

In Xcode, update in **App** target:
- **Marketing Version** (e.g., `1.0.0`)
- **Current Project Version** (increment by 1)

### 2. Build & Archive

```bash
npm run build
npm run cap:sync ios
```

Then in Xcode:
1. **Product** > **Archive**
2. Sign with distribution certificate
3. Validate archive for submission
4. Submit to App Store

### 3. Review & Release

In App Store Connect:
1. Fill in **App Information**
2. Add **Screenshots** and **Preview Videos**
3. Complete **Pricing and Availability**
4. Set **Release Type** (manual or automatic)
5. Submit for App Store Review

## Troubleshooting

### Pod Install Issues

```bash
cd ios
rm -rf Pods Podfile.lock
pod repo update
pod install
cd ..
```

### Build Fails with "Team ID not configured"

Ensure you've selected a team in Xcode's Signing & Capabilities.

### In-App Purchase Not Working

1. Verify product IDs in App Store Connect match `APPLE_IAP_PRODUCTS` in `src/services/iapService.ts`
2. Use TestFlight to test purchases (sandbox environment)
3. Check Console.app for StoreKit errors

### Code Signing Issues

```bash
# Reset code signing
defaults delete com.apple.dt.Xcode IDESourceTreeDisplayNames
```

## Native Plugin Development

The StoreKit integration is in `/ios/App/App/StoreKitPlugin.swift`. To extend:

1. Add new methods to the plugin class
2. Expose them with `@objc` decorator
3. Call from TypeScript using Capacitor plugin system

## Continuous Deployment

To automate iOS builds, configure GitHub Actions with:
- Code signing certificates
- Provisioning profiles
- App Store Connect credentials

See `.github/workflows` for CI/CD setup (if configured).

## Resources

- [Capacitor iOS Guide](https://capacitorjs.com/docs/ios)
- [StoreKit Documentation](https://developer.apple.com/storekit/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
