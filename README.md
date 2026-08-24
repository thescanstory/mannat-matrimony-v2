# Mannat - Matrimonial & Connection Platform

A modern matrimonial app connecting verified individuals for meaningful relationships and family matches.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL + Auth)
- **Mobile**: Capacitor (iOS/Android native wrapper)
- **Payments**: Apple StoreKit (In-App Purchases)
- **Linting**: Oxlint
- **Animations**: Framer Motion

## Project Structure

```
├── src/                 # React app source
│   ├── components/      # React components
│   ├── services/        # API & utility services
│   ├── types/           # TypeScript type definitions
│   ├── data/            # Constants & configuration
│   └── App.tsx          # Main app component
├── admin/               # Admin dashboard
├── ios/                 # iOS Capacitor project
├── docs/                # Documentation
└── supabase/            # Database schema
```

## Quick Start

### Development

```bash
npm install
npm run dev
```

Visit http://localhost:5173

### Building

```bash
npm run build
npm run preview
```

### iOS Development

```bash
npm run build
npm run cap:sync ios
npm run cap:open:ios
```

See [iOS Quick Start](docs/iOS_QUICK_START.md) for detailed iOS setup.

## Development Commands

```bash
npm run dev           # Start dev server
npm run build         # Build web assets
npm run lint          # Run linter (Oxlint)
npm run preview       # Preview production build

# iOS
npm run build:ios     # Build & sync for iOS
npm run cap:open:ios  # Open Xcode
npm run cap:sync      # Sync web changes to iOS
```

## Project Features

### User Features
- Profile creation with verification
- Advanced search with filters
- Match discovery feed
- In-app messaging and video calls
- Wave system for connections
- Subscription tiers (Gold, Diamond, Platinum)
- Family sharing and involvement

### Admin Features
- User management dashboard
- Profile verification tools
- Analytics and insights
- Subscription tracking
- Content moderation

## iOS Deployment

### For Development Testing
1. Follow [iOS Quick Start](docs/iOS_QUICK_START.md)
2. Test on physical device or simulator

### For App Store Release
1. Complete [iOS Deployment Checklist](docs/iOS_DEPLOYMENT_CHECKLIST.md)
2. Configure StoreKit in-app purchases
3. Submit through App Store Connect

See [iOS Build Setup](docs/iOS_BUILD_SETUP.md) for complete configuration guide.

## Code Quality

### Linting
```bash
npm run lint
```

Current status: **0 warnings** ✅
- React rules of hooks enforced
- Component export patterns checked
- Impure function calls in render disabled (legitimate React 18 patterns)

### TypeScript
TypeScript compilation is strict with no errors allowed.

## Architecture Decisions

### Capacitor Over React Native
- Maximizes code reuse from existing React web app
- Native features available through plugins
- Faster time to market
- Easier web/mobile sync

### Supabase Over Custom Backend
- Managed authentication
- PostgreSQL database
- Real-time subscriptions
- Built-in role-based access control

### Tailwind CSS for Styling
- Rapid UI development
- Consistent design system
- Mobile-first responsive design
- Smaller bundle size with tree-shaking

## Environment Variables

Create `.env` file with:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## State Management

Currently using React hooks (useState, useContext) for state. Consider Redux Toolkit or Zustand if state complexity increases.

## API Integration

Supabase client configured in `src/services/supabaseClient.ts`:
- Authentication
- User profiles
- Chat messages
- Connections/matches
- Subscription tracking

## In-App Purchases

StoreKit integration with native iOS plugin:
- **Gold**: $19.99/month - Basic features
- **Diamond**: $29.99/month - Premium features + video calls
- **Platinum**: $49.99/month - All features + concierge

See [iapService](src/services/iapService.ts) for implementation.

## Testing

Currently no automated tests configured. Add with:
- Jest for unit tests
- React Testing Library for component tests
- Cypress for E2E tests

## Contributing

1. Create feature branch from `main`
2. Make changes and test locally
3. Run linter: `npm run lint`
4. Create PR with description
5. Get code review
6. Merge and deploy

## Deployment

### Web (Vercel)
Connected to GitHub for automatic deployments on push to main.

### iOS (App Store)
Manual process through Xcode and App Store Connect. See deployment checklist.

## Documentation

- [iOS Quick Start](docs/iOS_QUICK_START.md) - Get iOS building in 5 minutes
- [iOS Build Setup](docs/iOS_BUILD_SETUP.md) - Detailed iOS configuration
- [iOS Deployment Checklist](docs/iOS_DEPLOYMENT_CHECKLIST.md) - Pre-submission preparation

## Performance Notes

- Bundle size: ~1MB (minified + gzipped)
- Consider code-splitting for large modules
- Lazy load heavy components (video, modals)
- Use React.memo for expensive renders

## Common Issues

**Build fails after npm install:**
```bash
npm run build
npm run cap:sync ios
```

**iOS simulator slow:**
- Use latest Xcode version
- Close other apps
- Clear simulator cache: `xcrun simctl erase booted`

**StoreKit purchases not working:**
- Verify product IDs match App Store Connect
- Use TestFlight for sandbox testing
- Check StoreKit plugin integration

## Support

For questions or issues, see documentation in `/docs` or check git history for context.

## License

Proprietary - Mannat Team 2026

---

Last updated: August 2026
