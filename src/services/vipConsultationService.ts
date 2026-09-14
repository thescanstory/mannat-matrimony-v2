import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface VipLead {
  id?: string;
  created_at?: string;
  profile_for: string; // 'Myself' | 'Son' | 'Daughter' | 'Sibling' | 'Relative'
  gender?: string; // 'Male' | 'Female' | 'Not Specified'
  full_name: string;
  phone_country_code: string;
  phone_number: string;
  email?: string;
  city?: string;
  community?: string;
  education?: string;
  profession?: string;
  annual_income?: string;
  age_bracket?: string;
  marital_status?: string;
  preferred_slot?: string;
  source_cta?: string;
  notes?: string;
  status?: 'pending' | 'contacted' | 'assigned';
}

const STORAGE_KEY = 'mannat_vip_consultations';

export const vipConsultationService = {
  async submitLead(lead: VipLead): Promise<{ success: boolean; id: string; message: string }> {
    const leadId = 'vip_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newRecord: VipLead = {
      ...lead,
      id: leadId,
      created_at: new Date().toISOString(),
      status: 'pending'
    };

    // 1. Save locally in localStorage for persistent client & admin reference
    try {
      if (typeof window !== 'undefined') {
        const existingRaw = localStorage.getItem(STORAGE_KEY);
        const existing: VipLead[] = existingRaw ? JSON.parse(existingRaw) : [];
        existing.unshift(newRecord);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      }
    } catch (e) {
      console.warn('Failed to save VIP lead to localStorage:', e);
    }

    // 2. Save in Supabase cloud if configured
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('vip_consultations').insert([{
          id: leadId,
          profile_for: lead.profile_for,
          gender: lead.gender,
          full_name: lead.full_name,
          phone: `${lead.phone_country_code} ${lead.phone_number}`,
          email: lead.email,
          city: lead.city,
          profession: lead.profession,
          annual_income: lead.annual_income || 'Confidential',
          created_at: new Date().toISOString(),
          status: 'pending'
        }]).select();
      } catch (err) {
        // Fallback gracefully if table hasn't been created yet
        console.log('Supabase VIP consultation logged locally:', err);
      }
    }

    return {
      success: true,
      id: leadId,
      message: 'Your confidential VIP consultation request has been received. A Senior Matchmaker will connect with you within 2 hours.'
    };
  },

  getSavedLeads(): VipLead[] {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      }
    } catch {
      return [];
    }
    return [];
  }
};
