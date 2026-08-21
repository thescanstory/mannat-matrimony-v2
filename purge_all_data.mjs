import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qexwbaykwguoigkaqiwa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFleHdiYXlrd2d1b2lna2FxaXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTQxNTIsImV4cCI6MjEwMjczMDE1Mn0.pGPPoAzzgEpsu8MLms9do6TK-OLQYYgkdpCTyOiG-no';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function purgeAllData() {
  console.log('=== PURGING ALL USER & CANDIDATE DATA FROM SUPABASE ===\n');

  try {
    // 1. Delete callback requests
    console.log('1. Deleting all callback requests...');
    const { error: cbErr } = await supabase.from('callback_requests').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log(cbErr ? `⚠️ callback_requests: ${cbErr.message}` : '✅ callback_requests purged');

    // 2. Delete chats
    console.log('2. Deleting all chats...');
    const { error: chatErr } = await supabase.from('chats').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log(chatErr ? `⚠️ chats: ${chatErr.message}` : '✅ chats purged');

    // 3. Delete matches
    console.log('3. Deleting all matches...');
    const { error: matchErr } = await supabase.from('matches').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log(matchErr ? `⚠️ matches: ${matchErr.message}` : '✅ matches purged');

    // 4. Delete privacy settings
    console.log('4. Deleting all privacy settings...');
    const { error: privErr } = await supabase.from('privacy_settings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log(privErr ? `⚠️ privacy_settings: ${privErr.message}` : '✅ privacy_settings purged');

    // 5. Delete creator vouches
    console.log('5. Deleting all creator vouches...');
    const { error: vouchErr } = await supabase.from('creator_vouches').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log(vouchErr ? `⚠️ creator_vouches: ${vouchErr.message}` : '✅ creator_vouches purged');

    // 6. Delete all candidate profiles
    console.log('6. Deleting all candidate profiles...');
    const { error: profErr } = await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log(profErr ? `⚠️ profiles: ${profErr.message}` : '✅ profiles purged');

    // Verification check
    console.log('\n--- VERIFYING PURGED STATE ---');
    const { data: remProfiles } = await supabase.from('profiles').select('id, display_name');
    const { data: remCallbacks } = await supabase.from('callback_requests').select('id');
    const { data: remChats } = await supabase.from('chats').select('id');

    console.log('Remaining Profiles in DB:', remProfiles?.length ?? 0);
    console.log('Remaining Callbacks in DB:', remCallbacks?.length ?? 0);
    console.log('Remaining Chats in DB:', remChats?.length ?? 0);

  } catch (err) {
    console.error('Error during purge:', err);
  }
}

purgeAllData();
