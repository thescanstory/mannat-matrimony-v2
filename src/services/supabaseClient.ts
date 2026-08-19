import { createClient } from '@supabase/supabase-js';

// User's Live Supabase Project Credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qexwbaykwguoigkaqiwa.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFleHdiYXlrd2d1b2lna2FxaXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTQxNTIsImV4cCI6MjEwMjczMDE1Mn0.pGPPoAzzgEpsu8MLms9do6TK-OLQYYgkdpCTyOiG-no';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export const isSupabaseConfigured = () => {
  return true; // Live Supabase project connected!
};
