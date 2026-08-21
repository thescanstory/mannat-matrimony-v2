import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qexwbaykwguoigkaqiwa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFleHdiYXlrd2d1b2lna2FxaXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTQxNTIsImV4cCI6MjEwMjczMDE1Mn0.pGPPoAzzgEpsu8MLms9do6TK-OLQYYgkdpCTyOiG-no';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAllTables() {
  console.log('--- Checking RLS status on tables ---');

  // 1. Check Profiles SELECT
  const { data: pSelect, error: pSelErr } = await supabase.from('profiles').select('id, display_name').limit(2);
  console.log('Profiles SELECT:', pSelErr ? `❌ ${pSelErr.message}` : `✅ OK (${pSelect.length} rows)`);

  // 2. Check Profiles INSERT
  const testId = '11111111-2222-3333-4444-555555555555';
  const { error: pInsErr } = await supabase.from('profiles').insert([{
    id: testId,
    display_name: 'Test',
    age: 25,
    city: 'Mumbai',
    religion: 'Hindu',
    occupation: 'Eng',
    bio_video_url: 'https://video.mp4'
  }]);
  console.log('Profiles INSERT:', pInsErr ? `❌ ${pInsErr.message}` : '✅ OK');

  // 3. Check Callback Requests SELECT
  const { data: cbSelect, error: cbSelErr } = await supabase.from('callback_requests').select('*').limit(2);
  console.log('Callback Requests SELECT:', cbSelErr ? `❌ ${cbSelErr.message}` : `✅ OK (${cbSelect.length} rows)`);

  // 4. Check Callback Requests INSERT
  const cbId = '22222222-3333-4444-5555-666666666666';
  const { error: cbInsErr } = await supabase.from('callback_requests').insert([{
    id: cbId,
    status: 'pending'
  }]);
  console.log('Callback Requests INSERT:', cbInsErr ? `❌ ${cbInsErr.message}` : '✅ OK');

  // 5. Check Chats SELECT
  const { data: cSelect, error: cSelErr } = await supabase.from('chats').select('*').limit(2);
  console.log('Chats SELECT:', cSelErr ? `❌ ${cSelErr.message}` : `✅ OK (${cSelect.length} rows)`);

  // 6. Cleanup if inserted
  if (!pInsErr) await supabase.from('profiles').delete().eq('id', testId);
  if (!cbInsErr) await supabase.from('callback_requests').delete().eq('id', cbId);
}

testAllTables();
