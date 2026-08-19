import { supabase, isSupabaseConfigured } from './supabaseClient';

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

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
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
  }
};
