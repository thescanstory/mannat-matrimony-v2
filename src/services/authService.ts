import { supabase, isSupabaseConfigured, getGoogleClientId } from './supabaseClient';

export interface UserSession {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export const authService = {
  // 1-Click Google OAuth Sign In
  signInWithGoogle: async () => {
    if (!isSupabaseConfigured()) {
      return {
        user: {
          id: 'demo-google-user-123',
          email: 'candidate@google.com',
          user_metadata: { full_name: 'Ananya Sharma' }
        },
        error: null
      };
    }

    const clientId = getGoogleClientId();
    const redirectUri = window.location.origin + '/auth/callback';

    const options: any = {
      provider: 'google',
      options: {
        redirectTo: redirectUri
      }
    };

    // Add client ID if configured - this enables proper Google OAuth flow
    if (clientId) {
      options.options.client_id = clientId;
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUri,
        ...(clientId && { client_id: clientId })
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

  // Get Current Active User
  getCurrentUser: async (): Promise<UserSession | null> => {
    if (!isSupabaseConfigured()) {
      return {
        id: 'demo-user-1',
        email: 'ananya@mannat.app',
        user_metadata: { full_name: 'Ananya Sharma' }
      };
    }

    const { data: { user } } = await supabase.auth.getUser();
    return user as UserSession | null;
  },

  // Sign Out
  signOut: async () => {
    if (!isSupabaseConfigured()) return { error: null };
    return await supabase.auth.signOut();
  },

  // Auth State Change Listener
  onAuthStateChange: (callback: (user: UserSession | null) => void) => {
    if (!isSupabaseConfigured()) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback((session?.user as UserSession) || null);
    });
  }
};

