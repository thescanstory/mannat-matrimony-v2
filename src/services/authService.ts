import { supabase, isSupabaseConfigured } from './supabaseClient';

import { Capacitor } from '@capacitor/core';
import { SocialLogin } from '@capgo/capacitor-social-login';

export interface UserSession {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '53450733585-uj6ltrdggai2146p321tb0ok27fjhi52.apps.googleusercontent.com';
export const GOOGLE_IOS_CLIENT_ID = import.meta.env.VITE_GOOGLE_IOS_CLIENT_ID || '53450733585-6rk0itt9br119844l5tk2d28hl44787i.apps.googleusercontent.com';

let isSocialLoginInitialized = false;
const initNativeSocialLogin = async () => {
  if (isSocialLoginInitialized || !Capacitor.isNativePlatform()) return;
  try {
    await SocialLogin.initialize({
      google: {
        iOSClientId: GOOGLE_IOS_CLIENT_ID,
        iOSServerClientId: GOOGLE_CLIENT_ID,
        webClientId: GOOGLE_CLIENT_ID,
        mode: 'online',
      },
      apple: {},
    });
    isSocialLoginInitialized = true;
  } catch (e) {
    console.warn('SocialLogin initialization failed:', e);
  }
};

function generateSessionUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const authService = {
  // Exchange Google ID Token with Supabase
  signInWithGoogleIdToken: async (idToken: string) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: null };
    }
    localStorage.removeItem('mannat_logged_out');
    return await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });
  },

  // 1-Click Google Sign In (Native 1-Tap on iOS/Android, Web OAuth fallback on browser)
  signInWithGoogle: async (): Promise<{ data: UserSession | null; error: any }> => {
    localStorage.removeItem('mannat_logged_out');

    if (Capacitor.isNativePlatform()) {
      try {
        await initNativeSocialLogin();
        const res = await SocialLogin.login({
          provider: 'google',
          options: {
            scopes: ['email', 'profile'],
          },
        });

        const googleRes = res?.result as any;
        if (googleRes) {
          // If Supabase is configured and an idToken is returned, link session
          if (googleRes.idToken && isSupabaseConfigured()) {
            try {
              const { data } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: googleRes.idToken,
              });
              if (data?.user) {
                const u = authService.setUserSession(
                  data.user.email || googleRes.profile?.email || '',
                  data.user.user_metadata?.full_name || googleRes.profile?.name || googleRes.profile?.givenName,
                  data.user.user_metadata?.avatar_url || googleRes.profile?.imageUrl
                );
                return { data: u, error: null };
              }
            } catch (err) {
              console.warn('Supabase ID Token sign-in warning:', err);
            }
          }

          // Directly activate user session from Google profile info
          if (googleRes.profile?.email) {
            const u = authService.setUserSession(
              googleRes.profile.email,
              googleRes.profile.name || googleRes.profile.givenName || 'Google User',
              googleRes.profile.imageUrl || ''
            );
            return { data: u, error: null };
          }
        }
      } catch (err: any) {
        if (err?.code === 'USER_CANCELLED') {
          return { data: null, error: 'Cancelled' };
        }
        console.warn('Native Google Sign-In error:', err);
        return { data: null, error: err };
      }
    }

    // Web Browser Fallback via Supabase
    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/app` : undefined
        }
      });
      return { data: null, error };
    }

    const fallbackUser = authService.setUserSession('member.google@gmail.com', 'Google Member');
    return { data: fallbackUser, error: null };
  },

  // 1-Click Apple Sign In (Native Face ID/Touch ID on iOS, Web OAuth fallback)
  signInWithApple: async (): Promise<{ data: UserSession | null; error: any }> => {
    localStorage.removeItem('mannat_logged_out');

    if (Capacitor.isNativePlatform()) {
      try {
        await initNativeSocialLogin();
        const res = await SocialLogin.login({
          provider: 'apple',
          options: {
            scopes: ['name', 'email'],
          },
        });

        const appleRes = res?.result as any;
        if (appleRes) {
          if (appleRes.idToken && isSupabaseConfigured()) {
            try {
              const { data } = await supabase.auth.signInWithIdToken({
                provider: 'apple',
                token: appleRes.idToken,
              });
              if (data?.user) {
                const u = authService.setUserSession(
                  data.user.email || appleRes.profile?.email || '',
                  data.user.user_metadata?.full_name || [appleRes.profile?.givenName, appleRes.profile?.familyName].filter(Boolean).join(' ') || 'Apple Member',
                  ''
                );
                return { data: u, error: null };
              }
            } catch (err) {
              console.warn('Supabase Apple ID token sign-in error:', err);
            }
          }

          if (appleRes.profile?.email || appleRes.profile?.user) {
            const email = appleRes.profile?.email || `${appleRes.profile.user}@privaterelay.appleid.com`;
            const name = [appleRes.profile?.givenName, appleRes.profile?.familyName].filter(Boolean).join(' ') || 'Apple Member';
            const u = authService.setUserSession(email, name);
            return { data: u, error: null };
          }
        }
      } catch (err: any) {
        if (err?.code === 'USER_CANCELLED') {
          return { data: null, error: 'Cancelled' };
        }
        console.warn('Native Apple Sign-In error:', err);
        return { data: null, error: err };
      }
    }

    // Web Browser: Direct real OAuth redirect via Supabase Apple Provider
    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/app` : undefined
        }
      });
      return { data: null, error };
    }

    const fallbackUser = authService.setUserSession('member.apple@icloud.com', 'Apple ID Member');
    return { data: fallbackUser, error: null };
  },

  // Passwordless Email Magic Link
  signInWithEmailMagicLink: async (email: string) => {
    localStorage.removeItem('mannat_logged_out');
    return await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
  },

  // Custom User Sign In / Switch Account
  setUserSession: (email: string, name?: string, avatarUrl?: string): UserSession => {
    const formattedEmail = email.trim().toLowerCase();
    const candidateName = name?.trim() || formattedEmail.split('@')[0];
    const user: UserSession = {
      id: generateSessionUUID(),
      email: formattedEmail,
      user_metadata: {
        full_name: candidateName,
        avatar_url: avatarUrl || ''
      }
    };
    try {
      localStorage.removeItem('mannat_logged_out');
      localStorage.setItem('mannat_active_user', JSON.stringify(user));
      
      // Keep in saved accounts list
      const savedStr = localStorage.getItem('mannat_saved_accounts');
      const saved: UserSession[] = savedStr ? JSON.parse(savedStr) : [];
      const updated = [user, ...saved.filter(s => s.email?.toLowerCase() !== formattedEmail)].slice(0, 5);
      localStorage.setItem('mannat_saved_accounts', JSON.stringify(updated));
    } catch {}
    return user;
  },

  // Update current active user data (e.g. edited name or email)
  updateActiveUser: (updates: { email?: string; full_name?: string; avatar_url?: string }): UserSession | null => {
    try {
      const stored = localStorage.getItem('mannat_active_user');
      if (!stored) return null;
      const user = JSON.parse(stored) as UserSession;
      if (updates.email) user.email = updates.email.trim().toLowerCase();
      if (updates.full_name || updates.avatar_url) {
        user.user_metadata = {
          ...user.user_metadata,
          ...(updates.full_name ? { full_name: updates.full_name.trim() } : {}),
          ...(updates.avatar_url ? { avatar_url: updates.avatar_url } : {})
        };
      }
      localStorage.setItem('mannat_active_user', JSON.stringify(user));
      return user;
    } catch {
      return null;
    }
  },

  // Instant Guest Demo User Access
  signInWithDemoUser: (name = 'Guest Candidate', email = 'member@mannat.vip'): UserSession => {
    return authService.setUserSession(email, name);
  },

  // Get Saved Accounts List for 1-Click Switcher
  getSavedAccounts: (): UserSession[] => {
    try {
      const savedStr = localStorage.getItem('mannat_saved_accounts');
      return savedStr ? JSON.parse(savedStr) : [];
    } catch {
      return [];
    }
  },

  // Remove a saved account
  removeSavedAccount: (email: string) => {
    try {
      const savedStr = localStorage.getItem('mannat_saved_accounts');
      if (savedStr) {
        const saved: UserSession[] = JSON.parse(savedStr);
        const filtered = saved.filter(s => s.email?.toLowerCase() !== email.toLowerCase());
        localStorage.setItem('mannat_saved_accounts', JSON.stringify(filtered));
      }
    } catch {}
  },

  // Parse Apple / Google / Supabase OAuth access_token from URL hash callback
  handleOAuthHashCallback: async (): Promise<UserSession | null> => {
    if (typeof window === 'undefined') return null;
    const hash = window.location.hash;
    if (!hash || (!hash.includes('access_token') && !hash.includes('id_token') && !hash.includes('refresh_token'))) return null;

    try {
      localStorage.removeItem('mannat_logged_out');

      // 1. Try Supabase session extraction first (handles Apple, Google, Supabase Auth)
      if (isSupabaseConfigured()) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const u: UserSession = {
            id: session.user.id,
            email: session.user.email,
            user_metadata: session.user.user_metadata,
          };
          try {
            localStorage.setItem('mannat_active_user', JSON.stringify(u));
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch {}
          return u;
        }
      }

      // 2. Direct Google OAuth hash fallback
      const params = new URLSearchParams(hash.replace(/^#/, ''));
      const accessToken = params.get('access_token');
      if (accessToken) {
        try {
          const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          if (res.ok) {
            const profile = await res.json();
            if (profile?.email) {
              const user = authService.setUserSession(
                profile.email,
                profile.name || profile.given_name || 'Google User',
                profile.picture || ''
              );
              try {
                window.history.replaceState({}, document.title, window.location.pathname);
              } catch {}
              return user;
            }
          }
        } catch {}
      }
    } catch (e) {
      console.warn('OAuth hash parse error:', e);
    }
    return null;
  },

  // Get Current Active User
  getCurrentUser: async (): Promise<UserSession | null> => {
    // 1. Check if returning from Google OAuth redirect with hash token
    const oauthUser = await authService.handleOAuthHashCallback();
    if (oauthUser) return oauthUser;

    // If user explicitly logged out, do not restore previous session
    try {
      if (localStorage.getItem('mannat_logged_out') === 'true') {
        return null;
      }
    } catch {}

    if (isSupabaseConfigured()) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const u: UserSession = {
            id: session.user.id,
            email: session.user.email,
            user_metadata: session.user.user_metadata,
          };
          try {
            localStorage.setItem('mannat_active_user', JSON.stringify(u));
          } catch {}
          return u;
        }
      } catch {}
    }

    try {
      const stored = localStorage.getItem('mannat_active_user');
      if (stored) {
        return JSON.parse(stored) as UserSession;
      }
    } catch {}

    return null;
  },

  // Sign Out cleanly without ghost session persistence
  signOut: async () => {
    try {
      localStorage.setItem('mannat_logged_out', 'true');
      localStorage.removeItem('mannat_active_user');
      localStorage.removeItem('mannat_demo_user');
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('sb-') || key.includes('supabase')) {
          localStorage.removeItem(key);
        }
      });
      sessionStorage.clear();
      // Clear cookies
      if (typeof document !== 'undefined') {
        document.cookie.split(';').forEach((c) => {
          document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
        });
      }
    } catch {}
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch {}
    }
    return { error: null };
  },

  // Completely Reset / Wipe All Local Data & Caches
  clearAllData: async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if (typeof document !== 'undefined') {
        document.cookie.split(';').forEach((c) => {
          document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
        });
      }
    } catch {}
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch {}
    }
    return { success: true };
  },

  // Auth State Change Listener
  onAuthStateChange: (callback: (user: UserSession | null) => void) => {
    if (!isSupabaseConfigured()) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange((event, session) => {
      if (localStorage.getItem('mannat_logged_out') === 'true') {
        callback(null);
        return;
      }
      if (session?.user) {
        const u: UserSession = {
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata,
        };
        try {
          localStorage.setItem('mannat_active_user', JSON.stringify(u));
        } catch {}
        callback(u);
      } else if (event === 'SIGNED_OUT') {
        try {
          localStorage.removeItem('mannat_active_user');
        } catch {}
        callback(null);
      }
    });
  }
};
