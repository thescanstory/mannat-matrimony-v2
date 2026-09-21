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

export const INITIAL_CURATED_PROFILES: Profile[] = [];

export const profileService = {
  // Check if user has an existing completed profile / bio-data
  hasExistingProfile: async (userId?: string, email?: string): Promise<boolean> => {
    if (!userId && !email) return false;

    // 1. Check local session flags & profile cache (instant refresh check)
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
      const customProfilesStr = localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY);
      if (customProfilesStr) {
        const customProfiles: Profile[] = JSON.parse(customProfilesStr);
        const match = customProfiles.some(p => (userId && (p.user_id === userId || p.id === userId)));
        if (match) return true;
      }
    } catch { }

    // 2. If Supabase DB is configured, check the cloud DB as authoritative source
    if (isSupabaseConfigured() && userId) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, user_id, display_name')
          .or(`id.eq.${userId},user_id.eq.${userId}`)
          .limit(1);

        if (data && data.length > 0 && !error) {
          if (email) localStorage.setItem('mannat_onboarded_' + email.toLowerCase(), 'true');
          localStorage.setItem('mannat_onboarded_' + userId, 'true');
          return true;
        }
      } catch (err) {
        console.warn('DB check profile notice:', err);
      }
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

    // Save to localStorage for instant offline/refresh persistence
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
      console.warn('Could not cache profile locally:', e);
    }

    // Save to Supabase with valid UUID and schema columns
    if (isSupabaseConfigured()) {
      try {
        const { error: upsertError } = await supabase.from('profiles').upsert([{
          id: newProfile.id,
          user_id: isValidUUID(newProfile.user_id) ? newProfile.user_id : null,
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

