-- ====================================================================
-- MANNAT PRODUCTION DATABASE SCHEMA (IDEMPOTENT & SAFE FOR RE-RUNS)
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Candidates Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    age INT NOT NULL,
    height TEXT,
    city TEXT NOT NULL,
    religion TEXT NOT NULL,
    community TEXT,
    sub_community TEXT,
    occupation TEXT NOT NULL,
    company_name TEXT,
    education TEXT,
    bio_text TEXT,
    bio_video_url TEXT NOT NULL,
    photos TEXT[] DEFAULT '{}',
    voice_intro_url TEXT,
    is_vouched BOOLEAN DEFAULT FALSE,
    is_spotlight BOOLEAN DEFAULT FALSE,
    spotlight_until TIMESTAMPTZ,
    managed_by TEXT DEFAULT 'self',
    compatibility_score INT DEFAULT 95,
    gun_milan_score INT DEFAULT 32,
    is_unlocked BOOLEAN DEFAULT FALSE,
    lifestyle_details JSONB DEFAULT '{}',
    horoscope JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Privacy Settings Table
CREATE TABLE IF NOT EXISTS public.privacy_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    photo_privacy TEXT DEFAULT 'visible_to_everyone',
    profile_visibility TEXT DEFAULT 'visible_in_discovery',
    financial_privacy TEXT DEFAULT 'show_verified_badge',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Certified Matchmaker Vouches Table
CREATE TABLE IF NOT EXISTS public.creator_vouches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    creator_name TEXT NOT NULL,
    creator_avatar_url TEXT NOT NULL,
    trust_rating NUMERIC(2,1) DEFAULT 4.9,
    vouch_video_url TEXT NOT NULL,
    commentary TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Callback Requests & Family Intro Calls Table
CREATE TABLE IF NOT EXISTS public.callback_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    target_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    scheduled_at TIMESTAMPTZ,
    google_meet_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Subscriptions & Tiered Paywalls Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tier TEXT DEFAULT 'gold',
    status TEXT DEFAULT 'active',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Matches Table (pairwise)
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_a_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_b_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    match_score INT DEFAULT 100
);

-- 8. Chats Table (one row per message)
CREATE TABLE IF NOT EXISTS public.chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_chats_match_id ON public.chats(match_id);
CREATE INDEX IF NOT EXISTS idx_chats_sent_at ON public.chats(sent_at);
CREATE INDEX IF NOT EXISTS idx_matches_users ON public.matches(user_a_id, user_b_id);

-- ====================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES (DROP + RECREATE FOR CLEAN IDEMPOTENCY)
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_vouches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.callback_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public Read Access for Profiles" ON public.profiles;
CREATE POLICY "Public Read Access for Profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users Manage Own Profile" ON public.profiles;
CREATE POLICY "Users Manage Own Profile" ON public.profiles FOR ALL USING (auth.uid() = user_id);

-- Privacy Settings Policy
DROP POLICY IF EXISTS "Users Manage Own Privacy" ON public.privacy_settings;
CREATE POLICY "Users Manage Own Privacy" ON public.privacy_settings FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = profile_id)
);

-- Creator Vouches Policy
DROP POLICY IF EXISTS "Allow public read vouches" ON public.creator_vouches;
CREATE POLICY "Allow public read vouches" ON public.creator_vouches FOR SELECT USING (true);

-- Callback Requests Policy
DROP POLICY IF EXISTS "Callback Requests Owner" ON public.callback_requests;
CREATE POLICY "Callback Requests Owner" ON public.callback_requests FOR ALL USING (auth.uid() = requester_id);

-- Subscriptions Policy
DROP POLICY IF EXISTS "Subscriptions Owner" ON public.subscriptions;
CREATE POLICY "Subscriptions Owner" ON public.subscriptions FOR ALL USING (auth.uid() = user_id);

-- Matches Policies
DROP POLICY IF EXISTS "Allow public read matches" ON public.matches;
CREATE POLICY "Allow public read matches" ON public.matches FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert matches" ON public.matches;
CREATE POLICY "Allow authenticated insert matches" ON public.matches FOR INSERT WITH CHECK (true);

-- Chats Policies
DROP POLICY IF EXISTS "Allow public read chats" ON public.chats;
CREATE POLICY "Allow public read chats" ON public.chats FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert chats" ON public.chats;
CREATE POLICY "Allow authenticated insert chats" ON public.chats FOR INSERT WITH CHECK (true);

-- Enable Supabase Realtime for instant chat message broadcasting
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'chats'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.chats;
    END IF;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- ====================================================================
-- SAMPLE SEED DATA INSERTION (OPTIONAL SEED FOR SUPABASE DB)
-- ====================================================================

INSERT INTO public.profiles (
    display_name, age, height, city, religion, community, sub_community,
    occupation, company_name, education, bio_text, bio_video_url,
    photos, is_vouched, is_spotlight, compatibility_score, gun_milan_score,
    lifestyle_details
) VALUES 
(
    'Ananya Sharma', 27, '5''6"', 'Mumbai', 'Hindu', 'Brahmin', 'Kanyakubja Brahmin',
    'Senior Product Designer', 'Flipkart', 'B.Des NID Ahmedabad',
    'Design lead by day, classical dancer by weekend. Looking for an empathetic, ambitious partner.',
    'https://assets.mixkit.co/videos/preview/mixkit-young-woman-smiling-at-the-camera-41130-large.mp4',
    ARRAY['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'],
    TRUE, TRUE, 98, 34,
    '{"net_worth": "₹5Cr - ₹10Cr", "private_clubs": "Willingdon Sports Club", "second_home": true}'::jsonb
),
(
    'Rohan Verma', 29, '5''11"', 'Bengaluru', 'Hindu', 'Kayastha', 'Srivastava Kayastha',
    'VP Engineering', 'Razorpay', 'B.Tech IIT Bombay',
    'Building tech platforms and running marathons. Seeking an intellectually curious partner.',
    'https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-digital-tablet-and-smiling-41133-large.mp4',
    ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'],
    TRUE, FALSE, 96, 31,
    '{"net_worth": "₹15Cr - ₹30Cr", "private_clubs": "Bangalore Club", "second_home": true}'::jsonb
) ON CONFLICT DO NOTHING;

-- Seed data for matches and chats
INSERT INTO public.matches (user_a_id, user_b_id, match_score)
SELECT p1.id, p2.id, 95
FROM public.profiles p1, public.profiles p2
WHERE p1.id <> p2.id
LIMIT 5
ON CONFLICT DO NOTHING;

INSERT INTO public.chats (match_id, sender_id, message)
SELECT m.id, m.user_a_id, 'Hello! Nice to meet you.'
FROM public.matches m
LIMIT 5
ON CONFLICT DO NOTHING;
