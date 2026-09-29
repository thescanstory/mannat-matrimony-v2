import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { Profile } from '../types';

const LOCAL_STORAGE_PROFILES_KEY = 'mannat_custom_profiles';

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const INITIAL_CURATED_PROFILES: Profile[] = [
  {
    id: 'appreview-demo-user-id',
    user_id: 'appreview-demo-user-id',
    display_name: 'Rahul Sharma',
    age: 29,
    height: "5'11\"",
    city: 'Mumbai / London',
    religion: 'Hindu',
    community: 'North Indian',
    sub_community: 'Brahmin',
    occupation: 'VP of Technology & Product',
    company_name: 'Global Ventures',
    education: 'M.S. in Management & Technology, London Business School | B.Tech, IIT',
    bio_text: 'Passionate about innovation, classical music, and philanthropy. Seeking a warm, intellectually curious, and family-oriented partner.',
    bio_video_url: '',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1000'
    ],
    managed_by: 'self',
    compatibility_score: 98,
    gun_milan_score: 34,
    is_vouched: true,
    is_spotlight: true,
    is_unlocked: true,
    lifestyle_details: {
      diet: 'Vegetarian',
      salary_bracket: '₹1Cr+',
      family_background: 'Father (Retd. Bureaucrat, IAS), Mother (Educator)',
      marriage_expectations: 'Mutual respect, shared values, and modern aspirations',
      gender: 'male',
      user_id: 'appreview-demo-user-id'
    },
    horoscope: {
      rashi: 'Simha (Leo)',
      nakshatra: 'Magha',
      manglik: 'No',
      birth_time: '10:30 AM',
      birth_place: 'Mumbai'
    }
  },
  {
    id: '11111111-1111-4111-8111-111111111111',
    user_id: '11111111-1111-4111-8111-111111111111',
    display_name: 'Ananya Sharma',
    age: 26,
    height: "5'7\"",
    city: 'Mumbai',
    religion: 'Hindu',
    community: 'North Indian',
    sub_community: 'Brahmin',
    occupation: 'VP of Investment Banking',
    company_name: 'Goldman Sachs',
    education: 'MBA, Columbia University | B.Tech, IIT Bombay',
    bio_text: 'Balancing global finance with classical Kathak and philanthropic initiatives. Seeking a progressive, intellectually stimulating alliance.',
    bio_video_url: '',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1000'
    ],
    managed_by: 'self',
    compatibility_score: 98,
    gun_milan_score: 34,
    is_vouched: true,
    is_spotlight: true,
    is_unlocked: false,
    lifestyle_details: {
      diet: 'Vegetarian',
      salary_bracket: '₹75L - ₹1Cr',
      family_background: 'Father (Ex-Director, RBI), Mother (Professor, Delhi Univ)',
      marriage_expectations: 'Mutual respect, shared ambitions, and cultural values',
      gender: 'female',
      user_id: '11111111-1111-4111-8111-111111111111'
    },
    horoscope: {
      rashi: 'Kanya (Virgo)',
      nakshatra: 'Hasta',
      manglik: 'No',
      birth_time: '08:45 AM',
      birth_place: 'Mumbai'
    }
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    user_id: '22222222-2222-4222-8222-222222222222',
    display_name: 'Kabir Singhania',
    age: 29,
    height: "6'1\"",
    city: 'Bangalore / London',
    religion: 'Hindu',
    community: 'North Indian',
    sub_community: 'Kshatriya',
    occupation: 'Tech Entrepreneur & Founder',
    company_name: 'Venture-backed AI Lab',
    education: 'M.S. Computer Science, Stanford University',
    bio_text: 'Founder in deep tech, polo player on weekends, and art collector. Believer in quiet luxury and strong familial foundations.',
    bio_video_url: '',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1000'
    ],
    managed_by: 'self',
    compatibility_score: 96,
    gun_milan_score: 32,
    is_vouched: true,
    is_spotlight: true,
    is_unlocked: false,
    lifestyle_details: {
      diet: 'Eggetarian',
      salary_bracket: '₹1Cr+',
      family_background: 'Industrialist family with multi-city presence',
      marriage_expectations: 'A partner with creative passion and global outlook',
      gender: 'male',
      user_id: '22222222-2222-4222-8222-222222222222'
    },
    horoscope: {
      rashi: 'Simha (Leo)',
      nakshatra: 'Magha',
      manglik: 'No',
      birth_time: '11:15 AM',
      birth_place: 'New Delhi'
    }
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    user_id: '33333333-3333-4333-8333-333333333333',
    display_name: 'Meera Kapur',
    age: 27,
    height: "5'6\"",
    city: 'New Delhi',
    religion: 'Hindu',
    community: 'Punjabi',
    sub_community: 'Khatri',
    occupation: 'Architect & Interior Design Director',
    company_name: 'Studio Kapur Designs',
    education: 'B.Arch, CEPT University | Master of Interior Architecture, RISD',
    bio_text: 'Passionate about sustainable architecture, heritage conservation, and world cinema. Looking for an authentic connection grounded in family harmony.',
    bio_video_url: '',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1000'
    ],
    managed_by: 'parents',
    compatibility_score: 94,
    gun_milan_score: 31,
    is_vouched: true,
    is_spotlight: false,
    is_unlocked: false,
    lifestyle_details: {
      diet: 'Vegetarian',
      salary_bracket: '₹50L - ₹75L',
      family_background: 'Reputed architectural and legal legacy in Delhi NCR',
      marriage_expectations: 'Warmth, family involvement, and shared artistic sensibilities',
      gender: 'female',
      user_id: '33333333-3333-4333-8333-333333333333'
    },
    horoscope: {
      rashi: 'Tula (Libra)',
      nakshatra: 'Chitra',
      manglik: 'No',
      birth_time: '04:20 PM',
      birth_place: 'New Delhi'
    }
  },
  {
    id: '44444444-4444-4444-8444-444444444444',
    user_id: '44444444-4444-4444-8444-444444444444',
    display_name: 'Dr. Siddharth Mittal',
    age: 30,
    height: "5'11\"",
    city: 'New Delhi / Gurgaon',
    religion: 'Hindu',
    community: 'Marwari',
    sub_community: 'Agarwal',
    occupation: 'Cardiologist & Healthcare Director',
    company_name: 'Medanta Heart Institute',
    education: 'MBBS, MD (Medicine) - AIIMS Delhi, DM (Cardiology)',
    bio_text: 'Dedicated physician, marathoner, and classical violinist. Passionate about preventive cardiology and family values.',
    bio_video_url: '',
    photos: [
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=1000'
    ],
    managed_by: 'parents',
    compatibility_score: 95,
    gun_milan_score: 33,
    is_vouched: true,
    is_spotlight: true,
    is_unlocked: false,
    lifestyle_details: {
      diet: 'Pure Vegetarian',
      salary_bracket: '₹80L - ₹1Cr',
      family_background: 'Prominent Agarwal pharmaceutical and healthcare business family',
      marriage_expectations: 'A partner who values family bonding, intellectual depth, and mutual growth',
      gender: 'male',
      user_id: '44444444-4444-4444-8444-444444444444'
    },
    horoscope: {
      rashi: 'Dhanu (Sagittarius)',
      nakshatra: 'Mula',
      manglik: 'No',
      birth_time: '06:30 AM',
      birth_place: 'Delhi'
    }
  },
  {
    id: '55555555-5555-4555-8555-555555555555',
    user_id: '55555555-5555-4555-8555-555555555555',
    display_name: 'Rhea Kulkarni',
    age: 28,
    height: "5'5\"",
    city: 'San Francisco, CA (USA)',
    religion: 'Hindu',
    community: 'Maharashtrian',
    sub_community: 'Deshastha Brahmin',
    occupation: 'Staff AI Research Scientist',
    company_name: 'Google DeepMind',
    education: 'Ph.D. in CS, Stanford University | B.Tech, IIT Bombay',
    bio_text: 'Living in Silicon Valley, passionate about AI ethics, hiking across California national parks, and Hindustani classical vocal music.',
    bio_video_url: '',
    photos: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=1000'
    ],
    managed_by: 'self',
    compatibility_score: 97,
    gun_milan_score: 35,
    is_vouched: true,
    is_spotlight: true,
    is_unlocked: false,
    lifestyle_details: {
      diet: 'Vegetarian',
      salary_bracket: '$350k+ (₹3Cr+)',
      family_background: 'Educated Pune lineage (Father Retd. ISRO Scientist, Mother Doctor)',
      marriage_expectations: 'Intellectual equality, humor, and respect for cultural roots',
      gender: 'female',
      user_id: '55555555-5555-4555-8555-555555555555'
    },
    horoscope: {
      rashi: 'Mesh (Aries)',
      nakshatra: 'Ashwini',
      manglik: 'No',
      birth_time: '09:15 AM',
      birth_place: 'Pune'
    }
  },
  {
    id: '66666666-6666-4666-8666-666666666666',
    user_id: '66666666-6666-4666-8666-666666666666',
    display_name: 'Arjun Reddy',
    age: 31,
    height: "6'0\"",
    city: 'Hyderabad / Dallas, TX',
    religion: 'Hindu',
    community: 'Telugu',
    sub_community: 'Reddy',
    occupation: 'Managing Director & Partner',
    company_name: 'Reddy Capital Advisors',
    education: 'MBA, Wharton (UPenn) | B.Tech, IIT Madras',
    bio_text: 'Managing private equity investments between Hyderabad and the US. Passionate about real estate development, golf, and family heritage.',
    bio_video_url: '',
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=1000'
    ],
    managed_by: 'parents',
    compatibility_score: 96,
    gun_milan_score: 32,
    is_vouched: true,
    is_spotlight: true,
    is_unlocked: false,
    lifestyle_details: {
      diet: 'Non-Vegetarian',
      salary_bracket: '₹2Cr+',
      family_background: 'Prominent Jubilee Hills infrastructure & renewable energy business house',
      marriage_expectations: 'A partner with traditional poise alongside modern ambition',
      gender: 'male',
      user_id: '66666666-6666-4666-8666-666666666666'
    },
    horoscope: {
      rashi: 'Vrishchik (Scorpio)',
      nakshatra: 'Anuradha',
      manglik: 'No',
      birth_time: '02:40 PM',
      birth_place: 'Hyderabad'
    }
  },
  {
    id: '77777777-7777-4777-8777-777777777777',
    user_id: '77777777-7777-4777-8777-777777777777',
    display_name: 'Dr. Tarini Shah',
    age: 28,
    height: "5'6\"",
    city: 'Ahmedabad / Mumbai',
    religion: 'Jain',
    community: 'Gujarati',
    sub_community: 'Shwetambar Jain',
    occupation: 'Dermatologist & Cosmetology Clinic Founder',
    company_name: 'Aura Aesthetics Clinic',
    education: 'MBBS, MD (Dermatology) - KEM Hospital Mumbai',
    bio_text: 'Aesthetic physician, culinary enthusiast, and certified scuba diver. Committed to Jain values, mindfulness, and warm family traditions.',
    bio_video_url: '',
    photos: [
      'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=1000'
    ],
    managed_by: 'self',
    compatibility_score: 95,
    gun_milan_score: 33,
    is_vouched: true,
    is_spotlight: true,
    is_unlocked: false,
    lifestyle_details: {
      diet: 'Pure Jain Vegetarian',
      salary_bracket: '₹60L - ₹80L',
      family_background: 'Established textile & diamond manufacturing lineage in Ahmedabad',
      marriage_expectations: 'Mutual respect, dietary compatibility (Jain diet), and shared cultural warmth',
      gender: 'female',
      user_id: '77777777-7777-4777-8777-777777777777'
    },
    horoscope: {
      rashi: 'Kumbh (Aquarius)',
      nakshatra: 'Shatabhisha',
      manglik: 'No',
      birth_time: '10:05 AM',
      birth_place: 'Ahmedabad'
    }
  }
];

export const profileService = {
  // Check if user has an existing completed profile / bio-data
  hasExistingProfile: async (userId?: string, email?: string): Promise<boolean> => {
    if (!userId && !email) return false;

    // Fast-path for Reviewer & Demo Accounts
    if (
      (email && (email.toLowerCase().includes('appreview') || email.toLowerCase().includes('rahul@mannat.vip'))) ||
      (userId && userId.includes('appreview'))
    ) {
      return true;
    }

    // 1. If Supabase DB is configured, cloud DB is the authoritative source of truth
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('profiles').select('id, user_id, display_name');
        if (userId) {
          query = query.or(`id.eq.${userId},user_id.eq.${userId}`);
        }
        const { data, error } = await query.limit(1);

        if (!error && data && data.length > 0) {
          if (email) localStorage.setItem('mannat_onboarded_' + email.toLowerCase(), 'true');
          if (userId) localStorage.setItem('mannat_onboarded_' + userId, 'true');
          return true;
        }
      } catch (err) {
        console.warn('DB check profile notice:', err);
      }
    }

    // 2. Fallback for offline / demo mode
    try {
      if (email && localStorage.getItem('mannat_onboarded_' + email.toLowerCase()) === 'true') {
        return true;
      }
      if (userId && localStorage.getItem('mannat_onboarded_' + userId) === 'true') {
        return true;
      }
      const myProfileStr = localStorage.getItem('mannat_user_profile');
      if (myProfileStr) {
        const myP = JSON.parse(myProfileStr);
        if (myP && (myP.user_id === userId || myP.id === userId || myP.display_name)) {
          return true;
        }
      }
    } catch { }

    // Check if user is in INITIAL_CURATED_PROFILES
    const matchedCurated = INITIAL_CURATED_PROFILES.find(
      (p) => p.user_id === userId || p.id === userId || (email && p.id.includes('appreview'))
    );
    if (matchedCurated) {
      return true;
    }

    return false;
  },

  // Fetch All Candidate Profiles
  getProfiles: async (): Promise<Profile[]> => {
    const deletedIds: string[] = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('mannat_admin_deleted_ids') || '[]')
      : [];

    const unlockedIds: string[] = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('mannat_unlocked_ids') || '[]')
      : [];

    const applyUnlocks = (list: Profile[]): Profile[] => {
      return list.map(p => ({
        ...p,
        is_unlocked: p.is_unlocked || unlockedIds.includes(p.id)
      }));
    };

    if (!isSupabaseConfigured()) {
      let customProfiles: Profile[] = [];
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY);
        if (stored) {
          customProfiles = JSON.parse(stored);
        }
      } catch {}
      const combined = [...customProfiles, ...INITIAL_CURATED_PROFILES];
      const unique = Array.from(new Map(combined.filter(p => !deletedIds.includes(p.id)).map((item) => [item.id, item])).values());
      return applyUnlocks(unique);
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        // Safe fallback to curated profiles when remote DB is empty or during network isolation
        const fallbackUnique = Array.from(new Map(INITIAL_CURATED_PROFILES.filter(p => !deletedIds.includes(p.id)).map(item => [item.id, item])).values());
        return applyUnlocks(fallbackUnique);
      }

      const activeData: Profile[] = (data as any[])
        .filter(d => !deletedIds.includes(d.id))
        .map(d => ({
          ...d,
          display_name: (d.display_name || 'Member').trim(),
          city: (d.city || '').trim(),
          religion: (d.religion || '').trim(),
          community: (d.community || '').trim(),
          sub_community: (d.sub_community || '').trim(),
          occupation: (d.occupation || '').trim(),
          company_name: (d.company_name || '').trim(),
          education: (d.education || '').trim(),
          photos: Array.isArray(d.photos) && d.photos.length > 0 ? d.photos : ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000'],
          user_id: d.lifestyle_details?.user_id || d.user_id || d.id,
          diet: d.lifestyle_details?.diet || d.diet || '',
          salary_bracket: d.lifestyle_details?.salary_bracket || d.salary_bracket || '',
          family_background: d.lifestyle_details?.family_background || d.family_background || '',
          marriage_expectations: d.lifestyle_details?.marriage_expectations || d.marriage_expectations || '',
          gender: d.lifestyle_details?.gender || d.gender || 'female'
        }));

      // Merge with initial curated profiles to guarantee a vibrant directory
      const mergedMap = new Map<string, Profile>();
      INITIAL_CURATED_PROFILES.forEach(p => mergedMap.set(p.id, p));
      activeData.forEach(p => mergedMap.set(p.id, p));

      const mergedList = Array.from(mergedMap.values()).filter(p => !deletedIds.includes(p.id));

      try {
        localStorage.setItem(LOCAL_STORAGE_PROFILES_KEY, JSON.stringify(mergedList));
      } catch {}

      return applyUnlocks(mergedList);
    } catch {
      return applyUnlocks(INITIAL_CURATED_PROFILES);
    }
  },

  // Delete Candidate Profile (Remote Supabase & Local Cache) - Apple Guideline 5.1.1
  deleteProfile: async (profileId: string, email?: string): Promise<boolean> => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY);
        if (stored) {
          const list: Profile[] = JSON.parse(stored);
          const filtered = list.filter(p => p.id !== profileId && p.user_id !== profileId);
          localStorage.setItem(LOCAL_STORAGE_PROFILES_KEY, JSON.stringify(filtered));
        }

        // Wipe all local onboarding and user state so next login asks onboarding questions
        if (profileId) {
          localStorage.removeItem('mannat_onboarded_' + profileId);
        }
        if (email) {
          localStorage.removeItem('mannat_onboarded_' + email.toLowerCase());
        }
        localStorage.removeItem('mannat_user_profile');
        localStorage.removeItem('mannat_active_user');
        localStorage.removeItem('mannat_auth_email');
        localStorage.removeItem('mannat_auth_name');
        localStorage.removeItem(LOCAL_STORAGE_PROFILES_KEY);
      }

      if (isSupabaseConfigured() && profileId) {
        await supabase.from('profiles').delete().or(`id.eq.${profileId},user_id.eq.${profileId}`);
        await supabase.from('privacy_settings').delete().eq('profile_id', profileId);
        await supabase.from('matches').delete().or(`profile_a.eq.${profileId},profile_b.eq.${profileId}`);
        await supabase.from('chats').delete().or(`sender_id.eq.${profileId},receiver_id.eq.${profileId}`);
        await supabase.from('subscriptions').delete().eq('user_id', profileId);
      }
      return true;
    } catch (e) {
      console.error('deleteProfile error:', e);
      return false;
    }
  },

  // Create a new Candidate Profile
  createProfile: async (profileData: Partial<Profile>): Promise<Profile> => {
    const isValidUUID = (str?: string) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    const validId = isValidUUID(profileData.id) ? profileData.id! : generateUUID();
    const validUserId = isValidUUID(profileData.user_id) ? profileData.user_id! : validId;

    const newProfile: Profile = {
      ...profileData,
      id: validId,
      user_id: validUserId,
      display_name: (profileData.display_name || '').trim() || 'Unnamed Member',
      age: profileData.age || 0,
      marital_status: profileData.marital_status || '',
      religion: profileData.religion || '',
      community: profileData.community || '',
      city: profileData.city || '',
      salary_bracket: profileData.salary_bracket || '',
      occupation: profileData.occupation || '',
      company_name: profileData.company_name || '',
      family_background: profileData.family_background || '',
      marriage_expectations: profileData.marriage_expectations || '',
      bio_video_url: profileData.bio_video_url || '',
      photos: profileData.photos && profileData.photos.length > 0 ? profileData.photos : [],
      credits: 100,
      is_vouched: false,
      is_spotlight: false,
      is_unlocked: false,
      compatibility_score: profileData.compatibility_score || 95,
      gun_milan_score: profileData.gun_milan_score || 32,
      managed_by: profileData.managed_by || 'self'
    };

    // Safe LocalStorage persistence (guards against quota limits)
    try {
      localStorage.setItem('mannat_user_profile', JSON.stringify(newProfile));
      localStorage.setItem('mannat_onboarded_' + newProfile.id, 'true');
      if (newProfile.user_id) {
        localStorage.setItem('mannat_onboarded_' + newProfile.user_id, 'true');
      }

      const stored = localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY);
      const list: Profile[] = stored ? JSON.parse(stored) : [];
      const filtered = list.filter(p => p.id !== newProfile.id && p.user_id !== newProfile.user_id);
      filtered.unshift(newProfile);
      localStorage.setItem(LOCAL_STORAGE_PROFILES_KEY, JSON.stringify(filtered));

      // Also register in admin candidates list
      const adminStored = localStorage.getItem('mannat_admin_candidates');
      const adminList = adminStored ? JSON.parse(adminStored) : [];
      const filteredAdmin = adminList.filter((p: Profile) => p.id !== newProfile.id && p.user_id !== newProfile.user_id);
      filteredAdmin.unshift(newProfile);
      localStorage.setItem('mannat_admin_candidates', JSON.stringify(filteredAdmin));
    } catch (e) {
      console.warn('LocalStorage quota or caching notice, saving lightweight profile:', e);
      try {
        // Fallback: save profile without heavy video URL if storage quota is tight
        const lightweight = { ...newProfile, bio_video_url: '' };
        localStorage.setItem('mannat_user_profile', JSON.stringify(lightweight));
        localStorage.setItem('mannat_onboarded_' + newProfile.id, 'true');
        if (newProfile.user_id) {
          localStorage.setItem('mannat_onboarded_' + newProfile.user_id, 'true');
        }
      } catch {}
    }

    // Save to Supabase with valid UUID and schema columns
    if (isSupabaseConfigured()) {
      try {
        const payload = {
          id: newProfile.id,
          user_id: isValidUUID(newProfile.user_id) ? newProfile.user_id : null,
          display_name: (newProfile.display_name || '').trim() || 'Member',
          age: Number(newProfile.age) || 25,
          height: (newProfile.height || "5'8\"").trim(),
          city: (newProfile.city || 'Mumbai').trim(),
          religion: (newProfile.religion || 'Hindu').trim(),
          community: (newProfile.community || (newProfile.religion === 'Hindu' ? 'North Indian' : newProfile.religion || 'Community')).trim(),
          sub_community: (newProfile.sub_community || '').trim(),
          occupation: (newProfile.occupation || 'Professional').trim(),
          company_name: (newProfile.company_name || '').trim(),
          education: (newProfile.education || 'Graduate').trim(),
          bio_text: (newProfile.bio_text || '').trim(),
          bio_video_url: (newProfile.bio_video_url || '').trim(),
          photos: Array.isArray(newProfile.photos) ? newProfile.photos : [],
          voice_intro_url: newProfile.voice_intro_url || null,
          managed_by: newProfile.managed_by || 'self',
          compatibility_score: Number(newProfile.compatibility_score) || 95,
          gun_milan_score: Number(newProfile.gun_milan_score) || 32,
          is_vouched: Boolean(newProfile.is_vouched),
          is_spotlight: Boolean(newProfile.is_spotlight),
          is_unlocked: Boolean(newProfile.is_unlocked),
          lifestyle_details: {
            ...(newProfile.lifestyle_details || {}),
            user_id: newProfile.user_id,
            diet: newProfile.diet || '',
            salary_bracket: newProfile.salary_bracket || '',
            family_background: newProfile.family_background || '',
            marriage_expectations: newProfile.marriage_expectations || '',
            gender: newProfile.gender || 'male'
          },
          horoscope: newProfile.horoscope || {}
        };
        const { error: upsertErr } = await supabase.from('profiles').upsert([payload]);
        if (upsertErr) {
          console.error('Supabase profile upsert error:', upsertErr);
        } else {
          console.log('Successfully saved profile to Supabase cloud:', newProfile.id);
        }
      } catch (e) {
        console.warn('Supabase profile insertion exception:', e);
      }
    }

    return newProfile;
  },

  // Upload Candidate Photo Gallery (3 Photos)
  uploadPhoto: async (file: File, userId: string, photoIndex: number): Promise<string> => {
    if (!isSupabaseConfigured()) {
      return URL.createObjectURL(file);
    }

    const filePath = `photos/${userId}/photo_${photoIndex}_${Date.now()}.${file.name.split('.').pop()}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from('media').getPublicUrl(filePath);
    return data.publicUrl;
  },

  // Upload Candidate 30s Video Intro Stream
  uploadVideoIntro: async (file: File, userId: string): Promise<string> => {
    if (!isSupabaseConfigured()) {
      return URL.createObjectURL(file);
    }

    const filePath = `videos/${userId}/video_intro_${Date.now()}.${file.name.split('.').pop()}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from('media').getPublicUrl(filePath);
    return data.publicUrl;
  }
};

