import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qexwbaykwguoigkaqiwa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFleHdiYXlrd2d1b2lna2FxaXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTQxNTIsImV4cCI6MjEwMjczMDE1Mn0.pGPPoAzzgEpsu8MLms9do6TK-OLQYYgkdpCTyOiG-no';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
