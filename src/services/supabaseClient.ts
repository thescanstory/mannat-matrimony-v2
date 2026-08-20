import { createClient } from '@supabase/supabase-js';

// User's Live Supabase Project Credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qexwbaykwguoigkaqiwa.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFleHdiYXlrd2d1b2lna2FxaXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTQxNTIsImV4cCI6MjEwMjczMDE1Mn0.pGPPoAzzgEpsu8MLms9do6TK-OLQYYgkdpCTyOiG-no';

// Google OAuth credentials - must be set via VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_CLIENT_SECRET
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const googleClientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // Google OAuth configuration will be applied dynamically if client ID is provided
    // The redirect URI is set in Google Cloud Console: https://mannat-matrimony-v2.vercel.app/auth/callback
  }
});

export const isSupabaseConfigured = () => {
  return true; // Live Supabase project connected!
};

/**
 * Gets the Google OAuth client ID if configured
 * Returns undefined if not set (uses demo fallback)
 */
export const getGoogleClientId = () => {
  return googleClientId;
};

/**
 * Gets the Google OAuth client secret if configured
 * Returns undefined if not set
 */
export const getGoogleClientSecret = () => {
  return googleClientSecret;
};
