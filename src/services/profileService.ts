import { supabase, isSupabaseConfigured } from './supabaseClient';
import { MOCK_PROFILES } from './mockData';
import type { Profile } from '../types';

export const profileService = {
  // Fetch All Candidate Profiles
  getProfiles: async (): Promise<Profile[]> => {
    if (!isSupabaseConfigured()) {
      return MOCK_PROFILES;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return MOCK_PROFILES;
      }

      return data as Profile[];
    } catch {
      return MOCK_PROFILES;
    }
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
