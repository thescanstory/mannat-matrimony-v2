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
          const syncUserId = isValidUUID(p.user_id) ? p.user_id! : syncId;
          supabase.from('profiles').upsert([{
            id: syncId,
            user_id: syncUserId,
            display_name: p.display_name,
            gender: p.gender,
            age: p.age,
            height: p.height,
            city: p.city,
            religion: p.religion,
            community: p.community,
            sub_community: p.sub_community,
            occupation: p.occupation,
            company_name: p.company_name,
            education: p.education,
            salary_bracket: p.salary_bracket,
            diet: p.diet,
            family_background: p.family_background,
            marriage_expectations: p.marriage_expectations,
            bio_text: p.bio_text,
            bio_video_url: p.bio_video_url,
            photos: p.photos,
            managed_by: p.managed_by,
            compatibility_score: p.compatibility_score,
            gun_milan_score: p.gun_milan_score,
            is_vouched: p.is_vouched,
            is_spotlight: p.is_spotlight,
            is_unlocked: p.is_unlocked,
            lifestyle_details: p.lifestyle_details,
            horoscope: p.horoscope
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
        const unique = Array.from(new Map(customProfiles.map((item) => [item.id, item])).values());
        return applyUnlocks(unique);
      }

      if (data) {
        const deletedIds: string[] = typeof window !== 'undefined'
          ? JSON.parse(localStorage.getItem('mannat_admin_deleted_ids') || '[]')
          : [];
        const activeData = (data as Profile[]).filter(d => !deletedIds.includes(d.id));
        const combined = [...customProfiles, ...activeData];
        const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
        return applyUnlocks(unique);
      }

      return applyUnlocks(customProfiles);
    } catch {
      return applyUnlocks(customProfiles);
    }
  },

  // Delete Candidate Profile (Remote Supabase & Local Cache)
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

      if (isSupabaseConfigured()) {
        const { error } = await supabase.from('profiles').delete().or(`id.eq.${profileId},user_id.eq.${profileId}`);
        if (error) console.error('Supabase profile delete error:', error);
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

    // Save to Supabase with valid UUID
    if (isSupabaseConfigured()) {
      try {
        const { error: upsertError } = await supabase.from('profiles').upsert([{
          id: newProfile.id,
          user_id: newProfile.user_id,
          display_name: newProfile.display_name,
          gender: newProfile.gender,
          age: newProfile.age,
          height: newProfile.height,
          city: newProfile.city,
          religion: newProfile.religion,
          community: newProfile.community,
          sub_community: newProfile.sub_community,
          occupation: newProfile.occupation,
          company_name: newProfile.company_name,
          education: newProfile.education,
          salary_bracket: newProfile.salary_bracket,
          diet: newProfile.diet,
          family_background: newProfile.family_background,
          marriage_expectations: newProfile.marriage_expectations,
          bio_text: newProfile.bio_text,
          bio_video_url: newProfile.bio_video_url,
          photos: newProfile.photos,
          managed_by: newProfile.managed_by,
          compatibility_score: newProfile.compatibility_score,
          gun_milan_score: newProfile.gun_milan_score,
          is_vouched: newProfile.is_vouched,
          is_spotlight: newProfile.is_spotlight,
          is_unlocked: newProfile.is_unlocked,
          lifestyle_details: newProfile.lifestyle_details,
          horoscope: newProfile.horoscope
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

