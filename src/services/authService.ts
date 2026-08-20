import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface UserSession {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export const GOOGLE_CLIENT_ID = '953419391945-pb3f0afso7h4dj2b9ni3mo14m08qip87.apps.googleusercontent.com';

export const authService = {
  // Exchange Google ID Token with Supabase
  signInWithGoogleIdToken: async (idToken: string) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: null };
    }
    return await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });
  },

  // 1-Click Google OAuth Sign In
  signInWithGoogle: async () => {
    if (!isSupabaseConfigured()) {
      return {
        user: {
          id: 'demo-google-user-123',
          email: 'patrickabraham.abraham@gmail.com',
          user_metadata: { full_name: 'Patrick Abraham' }
        },
        error: null
      };
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });

    return { data, error };
  },

  // 1-Click Apple OAuth Sign In
  signInWithApple: async () => {
    if (!isSupabaseConfigured()) {
      return {
        user: {
          id: 'demo-apple-user-456',
          email: 'candidate@apple.id',
          user_metadata: { full_name: 'Ananya Sharma' }
        },
        error: null
      };
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: window.location.origin
      }
    });

    return { data, error };
  },

  // Passwordless Email Magic Link
  signInWithEmailMagicLink: async (email: string) => {
    if (!isSupabaseConfigured()) {
      return { data: { message: 'Demo magic link sent!' }, error: null };
    }

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });

    return { data, error };
  },

  // Instant 1-Click Access (Developer & Guest Demo)
  signInWithDemoUser: (name = 'Patrick Abraham', email = 'patrickabraham.abraham@gmail.com'): UserSession => {
    const user: UserSession = {
      id: 'usr_demo_' + Math.random().toString(36).substring(2, 8),
      email,
      user_metadata: { 
        full_name: name,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      }
    };
    try {
      localStorage.setItem('mannat_active_user', JSON.stringify(user));
    } catch {}
    return user;
  },

  // Get Current Active User
  getCurrentUser: async (): Promise<UserSession | null> => {
    // Check local session first
    try {
      const stored = localStorage.getItem('mannat_active_user');
      if (stored) {
        return JSON.parse(stored) as UserSession;
      }
    } catch {}

    if (!isSupabaseConfigured()) {
      return null;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user as UserSession | null;
    } catch {
      return null;
    }
  },

  // Sign Out
  signOut: async () => {
    try {
      localStorage.removeItem('mannat_active_user');
      localStorage.removeItem('mannat_demo_user');
    } catch {}
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    return { error: null };
  },

  // Completely Reset / Wipe All Local Data & Caches
  clearAllData: async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    return { success: true };
  },

  // Auth State Change Listener
  onAuthStateChange: (callback: (user: UserSession | null) => void) => {
    if (!isSupabaseConfigured()) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        callback(session.user as UserSession);
      }
    });
  }
};

