export type ScenarioCategory = 'finance' | 'family' | 'lifestyle';

export interface ScenarioOption {
  id: number;
  text: string;
  stance: string;
}

export interface Scenario {
  id: string;
  question_text: string;
  category: ScenarioCategory;
  options: ScenarioOption[];
  context_description?: string;
}

export interface CreatorVouch {
  id: string;
  user_id: string;
  creator_id: string;
  creator_name: string;
  creator_avatar_url: string;
  vouch_video_url: string;
  trust_rating: number;
  commentary?: string;
}

export interface PrivacySettings {
  photo_privacy: 'visible_to_everyone' | 'only_accepted_waves' | 'premium_only' | 'blur_until_wave_accepted';
  profile_visibility: 'visible_in_discovery' | 'hidden_from_search' | 'community_only';
  financial_privacy: 'blur_until_accept' | 'show_verified_badge';
}

export interface LifestyleDetails {
  travel_freq?: string;
  second_home?: boolean;
  private_clubs?: string;
  net_worth?: string;
}

export interface Horoscope {
  manglik?: 'Yes' | 'No' | "Doesn't Matter";
  dob?: string;
  time_of_birth?: string;
  place_of_birth?: string;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  age: number;
  gender?: 'male' | 'female' | 'other';
  height_cm?: number;
  marital_status: string;
  religion: string;
  community: string;
  sub_community?: string;
  caste?: string;
  mother_tongue?: string;
  city: string;
  salary_bracket: string;
  income_bracket?: string;
  diet?: string;
  bio_video_url: string;
  intro_video_url?: string;
  voice_intro_url?: string;
  credits: number;
  is_vouched: boolean;
  is_verified?: boolean;
  is_spotlight?: boolean;
  spotlight_until?: string;
  managed_by?: 'self' | 'parent';
  compatibility_score: number;
  mqs_score?: number;
  gun_milan_score?: number;
  is_unlocked: boolean;
  creator_vouch?: CreatorVouch;
  bio_text?: string;
  education?: string;
  height?: string;
  photos?: string[];
  occupation: string;
  company_name: string;
  family_background: string;
  marriage_expectations: string;
  phone_number?: string;
  location_intent?: 'Open to Relocate to US' | 'Open to Long Distance' | 'Only Same City';
  privacy_settings?: PrivacySettings;
  lifestyle_details?: LifestyleDetails;
  horoscope?: Horoscope;
}

export interface CallbackRequest {
  id: string;
  requester_id: string;
  target_profile_id: string;
  scheduled_at: string;
  meet_link: string;
  status: 'pending' | 'accepted' | 'completed';
}

export interface FilterCriteria {
  ageMin: number;
  ageMax: number;
  selectedReligion: string[];
  selectedSubCommunity: string[];
  manglikPref: 'Yes' | 'No' | "Doesn't Matter";
  gunMilanMin: number;
  locationIntent: string[];
  selectedNetWorth: string[];
  secondHomePref: boolean;
}

export interface Match {
  id: string;
  user_a_id: string;
  user_b_id: string;
  match_score: number;
  created_at: string;
  partner?: Profile;
  last_message?: string;
  last_message_at?: string;
}

export interface ChatMessage {
  id: string;
  match_id: string;
  sender_id: string;
  message: string;
  sent_at: string;
  is_self?: boolean;
}

export interface PaymentOrder {
  amount: number; // in INR (e.g., 49 or 2999)
  currency?: string;
  name: string;
  description: string;
  userEmail?: string;
  userPhone?: string;
  profileId?: string;
  tierId?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  error?: string;
}

