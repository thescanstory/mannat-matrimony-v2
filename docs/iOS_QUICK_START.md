# iOS Quick Start

Get the Mannat app building for iOS in 5 minutes.

## 1. Install iOS Dependencies

```bash
cd ios
pod install
cd ..
```

## 2. Build & Sync

```bash
npm run build
npm run cap:sync ios
```

## 3. Open in Xcode

```bash
npm run cap:open:ios
```

## 4. Configure Signing (First Time Only)

1. Select **App** target in Xcode
2. Go to **Signing & Capabilities**
3. Select your Team
4. Update Bundle ID if needed (`vip.mannat.app`)

## 5. Build on Device/Simulator

- Choose device from top-left dropdown
- Press **Run** (or ⌘R)

## 6. Live Reload During Development

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Watch and sync iOS changes
npx cap sync ios --live
```

Then in Xcode, build and run. Changes to web code will reload in the app!

## Common Commands

```bash
npm run build:ios         # Full iOS build
npm run cap:open:ios      # Open in Xcode
npm run cap:sync          # Sync changes
```

## Troubleshooting

**Pod install fails:**
```bash
cd ios && pod repo update && pod install && cd ..
```

**Code signing error:**
- Ensure team is selected in Xcode
- Check provisioning profiles in Apple Developer

**App crashes on launch:**
- Check Xcode console for errors
- Run `npm run build` to ensure web assets are built
- Run `npm run cap:sync ios` to sync latest code

## Full Documentation

See `iOS_BUILD_SETUP.md` for detailed configuration and `iOS_DEPLOYMENT_CHECKLIST.md` for App Store submission.
