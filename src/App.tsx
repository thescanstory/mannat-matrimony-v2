import { LandingPage } from './components/LandingPage';
import { MainApp } from './components/MainApp';
import { App as AdminPortal } from '../admin/src/App';
import { Capacitor } from '@capacitor/core';

export function App() {
  // 1. Native iOS & Android Environment (Capacitor) -> Directly render Member App
  if (Capacitor.isNativePlatform()) {
    return <MainApp />;
  }

  // 2. Dedicated Admin Portal (/admin)
  const isAdminRoute = typeof window !== 'undefined' && (
    window.location.pathname.startsWith('/admin') ||
    window.location.search.includes('admin') ||
    window.location.hash.includes('admin') ||
    window.location.hostname.includes('admin')
  );

  if (isAdminRoute) {
    return <AdminPortal />;
  }

  // 3. OAuth Login Callback in URL Hash (e.g. Google Sign-In redirect with #access_token=...)
  const isAuthCallback = typeof window !== 'undefined' && (
    window.location.hash.includes('access_token') ||
    window.location.hash.includes('id_token') ||
    window.location.hash.includes('accounts.google.com') ||
    window.location.search.includes('code=')
  );

  // 4. Isolated internal app route (/app or ?app=true) or OAuth Redirect
  const isDirectAppRoute = typeof window !== 'undefined' && (
    isAuthCallback ||
    window.location.pathname.startsWith('/app') ||
    window.location.search.includes('app')
  );

  if (isDirectAppRoute) {
    return <MainApp />;
  }

  // 5. Default Website for www.mannatmatrimony.com
  return <LandingPage />;
}

export default App;

