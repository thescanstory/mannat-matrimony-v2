import { supabase, isSupabaseConfigured } from './supabaseClient';
import { MOCK_PROFILES } from './mockData';
import type { Profile } from '../types';

const LOCAL_STORAGE_PROFILES_KEY = 'mannat_custom_profiles';

export const profileService = {
  // Fetch All Candidate Profiles
  getProfiles: async (): Promise<Profile[]> => {
    let customProfiles: Profile[] = [];
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY);
      if (stored) {
        customProfiles = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read local profiles:', e);
    }

    if (typeof window !== 'undefined' && localStorage.getItem('mannat_admin_deleted') === 'true') {
      return [];
    }

    if (!isSupabaseConfigured()) {
      return customProfiles.length > 0 ? customProfiles : MOCK_PROFILES;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return customProfiles.length > 0 ? customProfiles : [];
      }

      if (data) {
        const deletedIds: string[] = typeof window !== 'undefined' 
          ? JSON.parse(localStorage.getItem('mannat_admin_deleted_ids') || '[]')
          : [];
        const activeData = (data as Profile[]).filter(d => !deletedIds.includes(d.id));
        const combined = [...customProfiles, ...activeData];
        const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
        return unique;
      }

      return [];
    } catch {
      return [];
    }
  },

  // Create a new Candidate Profile
  createProfile: async (profileData: Partial<Profile>): Promise<Profile> => {
    const newProfile: Profile = {
      id: profileData.id || `profile-${Date.now()}`,
      user_id: profileData.user_id || 'demo-user',
      display_name: profileData.display_name || 'New Member',
      age: profileData.age || 26,
      height: profileData.height || "5'7\"",
      marital_status: profileData.marital_status || 'Never Married',
      religion: profileData.religion || 'Hindu',
      community: profileData.community || 'North Indian',
      sub_community: profileData.sub_community || 'Brahmin',
      occupation: profileData.occupation || 'Professional',
      company_name: profileData.company_name || 'Global Enterprise',
      education: profileData.education || 'Graduate Degree',
      city: profileData.city || 'Mumbai',
      salary_bracket: profileData.salary_bracket || '₹25L - ₹35L / yr',
      diet: profileData.diet || 'Veg',
      family_background: profileData.family_background || 'Respectable family settled in metro city with strong traditional values.',
      marriage_expectations: profileData.marriage_expectations || 'Looking for an ambitious, kind partner with shared cultural grounding.',
      bio_text: profileData.bio_text || 'Passionate about travel, family traditions, and continuous self-growth.',
      bio_video_url: profileData.bio_video_url || 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-smiling-at-the-camera-41130-large.mp4',
      photos: profileData.photos && profileData.photos.length > 0 ? profileData.photos : [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'
      ],
      credits: 100,
      is_vouched: true,
      is_unlocked: false,
      compatibility_score: profileData.compatibility_score || 98,
      gun_milan_score: profileData.gun_milan_score || 32,
      managed_by: profileData.managed_by || 'self',
      lifestyle_details: profileData.lifestyle_details || {
        net_worth: '₹5Cr - ₹10Cr',
        private_clubs: 'City Golf & Country Club',
        second_home: true
      },
      ...profileData
    };

    // Save to localStorage for instant offline/demo persistence
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY);
      const list: Profile[] = stored ? JSON.parse(stored) : [];
      list.unshift(newProfile);
      localStorage.setItem(LOCAL_STORAGE_PROFILES_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Could not cache profile locally:', e);
    }

    // Try saving to Supabase if connected
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('profiles').insert([{
          id: newProfile.id,
          display_name: newProfile.display_name,
          age: newProfile.age,
          height: newProfile.height,
          city: newProfile.city,
          religion: newProfile.religion,
          community: newProfile.community,
          sub_community: newProfile.sub_community,
          occupation: newProfile.occupation,
          company_name: newProfile.company_name,
          education: newProfile.education,
          bio_text: newProfile.bio_text,
          bio_video_url: newProfile.bio_video_url,
          photos: newProfile.photos,
          managed_by: newProfile.managed_by,
          compatibility_score: newProfile.compatibility_score,
          gun_milan_score: newProfile.gun_milan_score,
          lifestyle_details: newProfile.lifestyle_details
        }]);
      } catch (e) {
        console.warn('Supabase profile insertion fallback:', e);
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

