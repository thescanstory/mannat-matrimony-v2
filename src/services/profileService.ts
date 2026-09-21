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
    id: '11111111-1111-4111-8111-111111111111',
    user_id: '11111111-1111-4111-8111-111111111111',
    display_name: 'Ananya Sharma',
    age: 26,
    gender: 'female',
    height: "5'7\"",
    marital_status: 'Never Married',
    city: 'Mumbai',
    religion: 'Hindu',
    community: 'North Indian',
    sub_community: 'Brahmin',
    occupation: 'VP of Investment Banking',
    company_name: 'Goldman Sachs',
    education: 'MBA, Columbia University | B.Tech, IIT Bombay',
    bio_text: 'Balancing global finance with classical Kathak and philanthropic initiatives. Seeking a progressive, intellectually stimulating alliance with shared family values.',
    bio_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-photo-shoot-41804-large.mp4',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1000'
    ],
    managed_by: 'self',
    compatibility_score: 98,
    gun_milan_score: 34,
    is_vouched: true,
    is_spotlight: true,
    is_unlocked: false,
    credits: 10,
    diet: 'Vegetarian',
    salary_bracket: '₹75L - ₹1Cr',
    family_background: 'Father (Ex-Executive Director, RBI), Mother (Professor, Delhi Univ)',
    marriage_expectations: 'Mutual respect, shared ambitions, and cultural grounding',
    lifestyle_details: {
      travel_freq: 'Frequently (Global & Domestic)',
      private_clubs: 'Bombay Gymkhana, Soho House Mumbai',
      net_worth: '₹10Cr+'
    },
    horoscope: {
      manglik: 'No',
      time_of_birth: '08:45 AM',
      place_of_birth: 'Mumbai'
    }
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    user_id: '22222222-2222-4222-8222-222222222222',
    display_name: 'Kabir Singhania',
    age: 29,
    gender: 'male',
    height: "6'1\"",
    marital_status: 'Never Married',
    city: 'Bangalore / London',
    religion: 'Hindu',
    community: 'North Indian',
    sub_community: 'Kshatriya',
    occupation: 'Tech Entrepreneur & Founder',
    company_name: 'Venture-backed AI Lab',
    education: 'M.S. Computer Science, Stanford University',
    bio_text: 'Founder in deep tech, polo player on weekends, and art collector. Believer in quiet luxury, intellectual curiosity, and strong familial foundations.',
    bio_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-young-businessman-working-on-his-laptop-42995-large.mp4',
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
    credits: 10,
    diet: 'Eggetarian',
    salary_bracket: '₹1Cr+',
    family_background: 'Industrialist family with multi-city enterprises and philanthropic trusts',
    marriage_expectations: 'A partner with creative passion, poise, and a global outlook',
    lifestyle_details: {
      travel_freq: 'Quarterly International',
      private_clubs: 'Bangalore Club, Lansdowne Club London',
      net_worth: '₹25Cr+'
    },
    horoscope: {
      manglik: 'No',
      time_of_birth: '11:15 AM',
      place_of_birth: 'New Delhi'
    }
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    user_id: '33333333-3333-4333-8333-333333333333',
    display_name: 'Meera Kapur',
    age: 27,
    gender: 'female',
    height: "5'6\"",
    marital_status: 'Never Married',
    city: 'New Delhi',
    religion: 'Hindu',
    community: 'Punjabi',
    sub_community: 'Khatri',
    occupation: 'Architect & Interior Design Director',
    company_name: 'Studio Kapur Designs',
    education: 'B.Arch, CEPT University | Master of Interior Architecture, RISD',
    bio_text: 'Passionate about sustainable architecture, heritage conservation, and world cinema. Looking for an authentic connection grounded in family harmony.',
    bio_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-sitting-on-a-balcony-and-smiling-41808-large.mp4',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1000'
    ],
    managed_by: 'parent',
    compatibility_score: 94,
    gun_milan_score: 31,
    is_vouched: true,
    is_spotlight: false,
    is_unlocked: false,
    credits: 10,
    diet: 'Vegetarian',
    salary_bracket: '₹50L - ₹75L',
    family_background: 'Reputed architectural and legal legacy in Delhi NCR',
    marriage_expectations: 'Warmth, family involvement, and shared artistic sensibilities',
    lifestyle_details: {
      travel_freq: 'Bi-annual Leisure',
      private_clubs: 'Delhi Golf Club',
      net_worth: '₹15Cr+'
    },
    horoscope: {
      manglik: 'No',
      time_of_birth: '04:20 PM',
      place_of_birth: 'New Delhi'
    }
  },
  {
    id: '44444444-4444-4444-8444-444444444444',
    user_id: '44444444-4444-4444-8444-444444444444',
    display_name: 'Rohan Varma',
    age: 30,
    gender: 'male',
    height: "6'0\"",
    marital_status: 'Never Married',
    city: 'Mumbai',
    religion: 'Hindu',
    community: 'North Indian',
    sub_community: 'Kayastha',
    occupation: 'Managing Director, Private Equity',
    company_name: 'Blackstone Capital',
    education: 'MBA, Harvard Business School | B.A. Economics, St. Stephen’s College',
    bio_text: 'Avid marathon runner, squash player, and enthusiast of historical non-fiction. Seeking an alliance based on equal partnership, shared aspirations, and mutual admiration.',
    bio_video_url: '',
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=1000'
    ],
    managed_by: 'self',
    compatibility_score: 97,
    gun_milan_score: 33,
    is_vouched: true,
    is_spotlight: true,
    is_unlocked: false,
    credits: 10,
    diet: 'Non-Vegetarian',
    salary_bracket: '₹1Cr+',
    family_background: 'Father (Supreme Court Senior Advocate), Mother (Social Sector Leader)',
    marriage_expectations: 'Intellectual synergy, active lifestyle, and deep-rooted respect',
    lifestyle_details: {
      travel_freq: 'Regular Weekend Getaways',
      private_clubs: 'Willingdon Sports Club, CCI Mumbai',
      net_worth: '₹20Cr+'
    },
    horoscope: {
      manglik: 'No',
      time_of_birth: '02:15 PM',
      place_of_birth: 'Mumbai'
    }
  },
  {
    id: '55555555-5555-4555-8555-555555555555',
    user_id: '55555555-5555-4555-8555-555555555555',
    display_name: 'Dr. Tara Mehra',
    age: 27,
    gender: 'female',
    height: "5'5\"",
    marital_status: 'Never Married',
    city: 'Mumbai',
    religion: 'Hindu',
    community: 'Punjabi',
    sub_community: 'Khatri',
    occupation: 'Consultant Dermatologist & Aesthetician',
    company_name: 'Mehra Aesthetics Clinic',
    education: 'MD Dermatology, King’s College London | MBBS, Grant Medical College',
    bio_text: 'Devoted to clinical excellence and wellness. Enjoys travel to Mediterranean coastlines, Hindustani classical music, and culinary experiments at home.',
    bio_video_url: '',
    photos: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=1000'
    ],
    managed_by: 'parent',
    compatibility_score: 95,
    gun_milan_score: 30,
    is_vouched: true,
    is_spotlight: false,
    is_unlocked: false,
    credits: 10,
    diet: 'Vegetarian',
    salary_bracket: '₹50L - ₹75L',
    family_background: 'Established medical family with multi-speciality hospital network',
    marriage_expectations: 'Emotional maturity, family warmth, and professional encouragement',
    lifestyle_details: {
      travel_freq: 'European Summers',
      private_clubs: 'The Club Mumbai',
      net_worth: '₹12Cr+'
    },
    horoscope: {
      manglik: 'No',
      time_of_birth: '07:30 AM',
      place_of_birth: 'Mumbai'
    }
  },
  {
    id: '66666666-6666-4666-8666-666666666666',
    user_id: '66666666-6666-4666-8666-666666666666',
    display_name: 'Advait Goenka',
    age: 31,
    gender: 'male',
    height: "5'11\"",
    marital_status: 'Never Married',
    city: 'Kolkata / Singapore',
    religion: 'Hindu',
    community: 'Marwari',
    sub_community: 'Agarwal',
    occupation: 'Chief Strategy Officer & Board Member',
    company_name: 'Goenka Enterprises',
    education: 'B.S. Economics & MBA, Wharton School of Business',
    bio_text: 'Managing global supply chains and renewable investments. Grounded in traditional values, lover of vintage horology and tennis.',
    bio_video_url: '',
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1000'
    ],
    managed_by: 'self',
    compatibility_score: 99,
    gun_milan_score: 35,
    is_vouched: true,
    is_spotlight: true,
    is_unlocked: false,
    credits: 10,
    diet: 'Vegetarian',
    salary_bracket: '₹1Cr+',
    family_background: 'Prominent industrial business family in Eastern India',
    marriage_expectations: 'Grace, elegance, family bonding, and cultural integrity',
    lifestyle_details: {
      travel_freq: 'Global Business & Leisure',
      private_clubs: 'Bengal Club, Tanglin Club Singapore',
      net_worth: '₹50Cr+'
    },
    horoscope: {
      manglik: 'No',
      time_of_birth: '10:00 AM',
      place_of_birth: 'Kolkata'
    }
  }
];

export const profileService = {
  // Check if user has an existing completed profile / bio-data
  hasExistingProfile: async (userId?: string, email?: string): Promise<boolean> => {
    if (!userId && !email) return false;

    // 1. Check local completed onboardings
    try {
      if (email && localStorage.getItem('mannat_onboarded_' + email.toLowerCase()) === 'true') {
        return true;
      }
      if (userId && localStorage.getItem('mannat_onboarded_' + userId) === 'true') {
        return true;
      }
      const customProfilesStr = localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY);
      if (customProfilesStr) {
        const customProfiles: Profile[] = JSON.parse(customProfilesStr);
        const match = customProfiles.some(p => (userId && p.user_id === userId) || (userId && p.id === userId));
        if (match) return true;
      }
    } catch { }

    // 2. Check Supabase DB
    if (isSupabaseConfigured() && userId) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .or(`id.eq.${userId},user_id.eq.${userId}`)
          .limit(1);
        if (data && data.length > 0 && !error) {
          if (email) localStorage.setItem('mannat_onboarded_' + email.toLowerCase(), 'true');
          localStorage.setItem('mannat_onboarded_' + userId, 'true');
          return true;
        }
      } catch { }
    }

    return false;
  },

  // Fetch All Real Candidate Profiles
  getProfiles: async (): Promise<Profile[]> => {
    let customProfiles: Profile[] = [];
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY);
      if (stored) {
        const parsed: Profile[] = JSON.parse(stored);
        customProfiles = parsed;
      }
    } catch (e) {
      console.warn('Could not read local profiles:', e);
    }

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
      const unique = Array.from(new Map(customProfiles.map((item) => [item.id, item])).values());
      return applyUnlocks(unique);
    }

    // Auto-sync local custom profiles to Supabase cloud if present
    if (isSupabaseConfigured() && customProfiles.length > 0) {
      for (const p of customProfiles) {
        if (p.display_name && p.display_name !== 'Unnamed Member') {
          const isValidUUID = (str?: string) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
          const syncId = isValidUUID(p.id) ? p.id : generateUUID();
          supabase.from('profiles').upsert([{
            id: syncId,
            user_id: null,
            display_name: p.display_name,
            age: p.age || 0,
            height: p.height || '',
            city: p.city || 'Mumbai',
            religion: p.religion || 'Hindu',
            community: p.community || 'North Indian',
            sub_community: p.sub_community || '',
            occupation: p.occupation || 'Member',
            company_name: p.company_name || '',
            education: p.education || '',
            bio_text: p.bio_text || '',
            bio_video_url: p.bio_video_url || '',
            photos: p.photos || [],
            managed_by: p.managed_by || 'self',
            compatibility_score: p.compatibility_score || 95,
            gun_milan_score: p.gun_milan_score || 32,
            is_vouched: p.is_vouched || false,
            is_spotlight: p.is_spotlight || false,
            is_unlocked: p.is_unlocked || false,
            lifestyle_details: {
              ...(p.lifestyle_details || {}),
              user_id: p.user_id || syncId,
              diet: p.diet,
              salary_bracket: p.salary_bracket,
              family_background: p.family_background,
              marriage_expectations: p.marriage_expectations,
              gender: p.gender
            },
            horoscope: p.horoscope || {}
          }]).then(({ error }) => {
            if (error) console.warn('Background profile sync notice:', error.message);
          });
        }
      }
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        const combined = [...customProfiles, ...INITIAL_CURATED_PROFILES];
        const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
        return applyUnlocks(unique);
      }

      if (data) {
        const deletedIds: string[] = typeof window !== 'undefined'
          ? JSON.parse(localStorage.getItem('mannat_admin_deleted_ids') || '[]')
          : [];
        const activeData = (data as any[]).filter(d => !deletedIds.includes(d.id)).map(d => ({
          ...d,
          user_id: d.lifestyle_details?.user_id || d.user_id || d.id,
          diet: d.lifestyle_details?.diet || '',
          salary_bracket: d.lifestyle_details?.salary_bracket || '',
          family_background: d.lifestyle_details?.family_background || '',
          marriage_expectations: d.lifestyle_details?.marriage_expectations || '',
          gender: d.lifestyle_details?.gender || (d.gender || 'male')
        }));
        const combined = [...customProfiles, ...activeData, ...INITIAL_CURATED_PROFILES];
        const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
        return applyUnlocks(unique);
      }

      const combined = [...customProfiles, ...INITIAL_CURATED_PROFILES];
      const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
      return applyUnlocks(unique);
    } catch {
      const combined = [...customProfiles, ...INITIAL_CURATED_PROFILES];
      const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
      return applyUnlocks(unique);
    }
  },

  // Delete Candidate Profile (Remote Supabase & Local Cache) - Apple Guideline 5.1.1
  deleteProfile: async (profileId: string): Promise<boolean> => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY);
        if (stored) {
          const list: Profile[] = JSON.parse(stored);
          const filtered = list.filter(p => p.id !== profileId && p.user_id !== profileId);
          localStorage.setItem(LOCAL_STORAGE_PROFILES_KEY, JSON.stringify(filtered));
        }
      }

      if (isSupabaseConfigured() && profileId) {
        await supabase.from('profiles').delete().or(`id.eq.${profileId},user_id.eq.${profileId}`);
        await supabase.from('privacy_settings').delete().eq('profile_id', profileId);
        await supabase.from('connections').delete().or(`sender_id.eq.${profileId},receiver_id.eq.${profileId}`);
        await supabase.from('messages').delete().or(`sender_id.eq.${profileId},receiver_id.eq.${profileId}`);
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
      // Required-by-type fields default to blank, never to fabricated values
      marital_status: profileData.marital_status || '',
      religion: profileData.religion || '',
      community: profileData.community || '',
      city: profileData.city || '',
      salary_bracket: profileData.salary_bracket || '',
      occupation: profileData.occupation || '',
      company_name: profileData.company_name || '',
      family_background: profileData.family_background || '',
      marriage_expectations: profileData.marriage_expectations || '',
      // No fabricated defaults — only what the user actually provided.
      bio_video_url: profileData.bio_video_url || '',
      photos: profileData.photos && profileData.photos.length > 0 ? profileData.photos : [],
      credits: 100,
      is_vouched: false,
      is_spotlight: false,
      is_unlocked: false,
      compatibility_score: profileData.compatibility_score || 0,
      gun_milan_score: profileData.gun_milan_score || 0,
      managed_by: profileData.managed_by || 'self'
    };

    // Save to localStorage for instant offline/demo persistence
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY);
      const list: Profile[] = stored ? JSON.parse(stored) : [];
      // Replace existing if id matches, or unshift
      const filtered = list.filter(p => p.id !== newProfile.id && p.user_id !== newProfile.user_id);
      filtered.unshift(newProfile);
      localStorage.setItem(LOCAL_STORAGE_PROFILES_KEY, JSON.stringify(filtered));

      // Also register in admin candidates list
      const adminStored = localStorage.getItem('mannat_admin_candidates');
      const adminList = adminStored ? JSON.parse(adminStored) : [];
      const filteredAdmin = adminList.filter((p: Profile) => p.id !== newProfile.id);
      filteredAdmin.unshift(newProfile);
      localStorage.setItem('mannat_admin_candidates', JSON.stringify(filteredAdmin));
    } catch (e) {
      console.warn('Could not cache profile locally:', e);
    }

    // Save to Supabase with valid UUID and schema columns
    if (isSupabaseConfigured()) {
      try {
        const { error: upsertError } = await supabase.from('profiles').upsert([{
          id: newProfile.id,
          user_id: null,
          display_name: newProfile.display_name,
          age: newProfile.age,
          height: newProfile.height || '',
          city: newProfile.city,
          religion: newProfile.religion,
          community: newProfile.community,
          sub_community: newProfile.sub_community,
          occupation: newProfile.occupation,
          company_name: newProfile.company_name || '',
          education: newProfile.education || '',
          bio_text: newProfile.bio_text || '',
          bio_video_url: newProfile.bio_video_url || '',
          photos: newProfile.photos || [],
          managed_by: newProfile.managed_by || 'self',
          compatibility_score: newProfile.compatibility_score || 95,
          gun_milan_score: newProfile.gun_milan_score || 32,
          is_vouched: newProfile.is_vouched || false,
          is_spotlight: newProfile.is_spotlight || false,
          is_unlocked: newProfile.is_unlocked || false,
          lifestyle_details: {
            ...(newProfile.lifestyle_details || {}),
            user_id: newProfile.user_id,
            diet: newProfile.diet,
            salary_bracket: newProfile.salary_bracket,
            family_background: newProfile.family_background,
            marriage_expectations: newProfile.marriage_expectations,
            gender: newProfile.gender
          },
          horoscope: newProfile.horoscope || {}
        }]);
        if (upsertError) {
          console.error('Supabase profile upsert error:', upsertError);
        }
      } catch (e) {
        console.error('Supabase profile insertion exception:', e);
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

