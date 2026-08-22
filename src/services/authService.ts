import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface UserSession {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '53450733585-uj6ltrdggai2146p321tb0ok27fjhi52.apps.googleusercontent.com';

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

  // 1-Click Google OAuth Sign In (Forces Account Chooser)
  signInWithGoogle: async () => {
    localStorage.removeItem('mannat_logged_out');
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account'
        }
      }
    });
  },

  // 1-Click Apple OAuth Sign In
  signInWithApple: async () => {
    localStorage.removeItem('mannat_logged_out');
    return await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: window.location.origin
      }
    });
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
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: formattedEmail,
      user_metadata: {
        full_name: candidateName,
        avatar_url: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
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

  // Get Current Active User
  getCurrentUser: async (): Promise<UserSession | null> => {
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
