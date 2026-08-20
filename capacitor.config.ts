import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'vip.mannat.app',
  appName: 'Mannat',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'mannat'
  },
  ios: {
    contentInset: 'always',
    preferredContentMode: 'mobile',
    scheme: 'Mannat Matrimony'
  }
};

export default config;
