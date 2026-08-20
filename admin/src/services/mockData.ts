import type { Profile, Scenario } from '../types';

export const MOCK_SCENARIOS: Scenario[] = [
  {
    id: 'scen-1',
    question_text: 'The Joint Account Debate',
    category: 'finance',
    context_description: 'How do you plan to manage household finances after marriage?',
    options: [
      { id: 1, text: 'Pool everything into one joint account for full transparency.', stance: 'Total Pooling' },
      { id: 2, text: 'Shared joint account for bills + separate personal spending accounts.', stance: 'Hybrid Balance' },
      { id: 3, text: 'Keep accounts 100% separate and divide monthly expenses proportionally.', stance: 'Independent' }
    ]
  }
];

export const MOCK_PROFILES: Profile[] = [
  {
    id: 'prof-1',
    user_id: 'usr-ananya',
    display_name: 'Ananya Sharma',
    age: 27,
    gender: 'female',
    height_cm: 168,
    marital_status: 'Never Married',
    religion: 'Hindu',
    community: 'Brahmin',
    sub_community: 'Kanyakubja Brahmin',
    caste: 'Brahmin',
    mother_tongue: 'Hindi',
    city: 'Bengaluru',
    salary_bracket: '₹25L - ₹35L / yr',
    income_bracket: '20-35',
    diet: 'Veg',
    occupation: 'Lead Product Designer',
    company_name: 'Flipkart',
    bio_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-smiling-at-the-camera-41130-large.mp4',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80'
    ],
    voice_intro_url: 'https://cdn.freesound.org/previews/588/588234_11861866-lq.mp3',
    credits: 10,
    is_vouched: true,
    is_verified: true,
    is_spotlight: true,
    managed_by: 'self',
    compatibility_score: 98,
    mqs_score: 96.5,
    gun_milan_score: 32,
    is_unlocked: true,
    education: 'B.Des, NID Ahmedabad',
    height: "5'6\"",
    phone_number: '+91 98765 43210',
    location_intent: 'Open to Relocate to US',
    bio_text: 'Design lead by day, classical dancer by weekend. Looking for an ambitious, empathetic partner who values open communication and good filter coffee.',
    family_background: 'Father is a retired ISRO Scientist, Mother is a High School Principal in Bengaluru. Younger brother working at Google US.',
    marriage_expectations: 'Looking for a progressive partner who respects career goals, enjoys traveling to offbeat nature spots, and believes in equal domestic partnership.',
    privacy_settings: {
      photo_privacy: 'visible_to_everyone',
      profile_visibility: 'visible_in_discovery',
      financial_privacy: 'show_verified_badge'
    },
    lifestyle_details: {
      travel_freq: '3-4 times a year',
      second_home: true,
      private_clubs: 'Golf & Country Club Member',
      net_worth: '₹5Cr - ₹10Cr'
    },
    horoscope: {
      manglik: 'No',
      dob: '1997-04-14',
      time_of_birth: '08:30 AM',
      place_of_birth: 'New Delhi'
    },
    creator_vouch: {
      id: 'vouch-1',
      user_id: 'usr-ananya',
      creator_id: 'cr-radhika',
      creator_name: 'Radhika Gupta (Matchmaker & Creator)',
      creator_avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      vouch_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-talking-on-a-video-call-41135-large.mp4',
      trust_rating: 4.9,
      commentary: 'I have personally known Ananya for 4 years. She comes from an extremely grounded, educated family and has exceptional emotional maturity.'
    }
  },
  {
    id: 'prof-2',
    user_id: 'usr-vikram',
    display_name: 'Vikramaditya Roy',
    age: 29,
    gender: 'male',
    height_cm: 180,
    marital_status: 'Never Married',
    religion: 'Hindu',
    community: 'Kayastha',
    sub_community: 'Srivastava Kayastha',
    caste: 'Kayastha',
    mother_tongue: 'Bengali',
    city: 'Mumbai',
    salary_bracket: '₹45L - ₹60L / yr',
    income_bracket: '35-50',
    diet: 'Non-Veg',
    occupation: 'Vice President - Fintech',
    company_name: 'Razorpay',
    bio_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-tablet-and-smiling-41138-large.mp4',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80'
    ],
    voice_intro_url: 'https://cdn.freesound.org/previews/588/588234_11861866-lq.mp3',
    credits: 15,
    is_vouched: true,
    is_verified: true,
    is_spotlight: false,
    managed_by: 'parent',
    compatibility_score: 94,
    mqs_score: 98.0,
    gun_milan_score: 30,
    is_unlocked: true,
    education: 'B.Tech IIT Bombay, MBA IIM Ahmedabad',
    height: "5'11\"",
    phone_number: '+91 99887 76655',
    location_intent: 'Only Same City',
    bio_text: 'Fintech builder passionate about macroeconomics, triathlon training, and indie music festivals. Believer in clear communication.',
    family_background: 'Family settled in South Mumbai. Father is a Senior Advocate at Bombay High Court, Mother owns a chain of boutique cafes.',
    marriage_expectations: 'Seeking an intellectually curious partner with her own identity and aspirations. Mutual support in high-growth careers is essential.',
    privacy_settings: {
      photo_privacy: 'blur_until_wave_accepted',
      profile_visibility: 'visible_in_discovery',
      financial_privacy: 'show_verified_badge'
    },
    lifestyle_details: {
      travel_freq: '4+ times a year',
      second_home: true,
      private_clubs: 'Bombay Gymkhana & Willingdon',
      net_worth: '₹15Cr+'
    },
    horoscope: {
      manglik: 'No',
      dob: '1995-09-22',
      time_of_birth: '11:15 AM',
      place_of_birth: 'Kolkata'
    },
    creator_vouch: {
      id: 'vouch-2',
      user_id: 'usr-vikram',
      creator_id: 'cr-karan',
      creator_name: 'Karan Mehta (Vouch Certified Agent)',
      creator_avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      vouch_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-in-a-coffee-shop-41142-large.mp4',
      trust_rating: 5.0,
      commentary: 'Vikram is one of our top verified profiles. Highly disciplined, respectful, and transparent about financial & family goals.'
    }
  },
  {
    id: 'prof-3',
    user_id: 'usr-priya',
    display_name: 'Priya Nambiar',
    age: 26,
    gender: 'female',
    height_cm: 165,
    marital_status: 'Never Married',
    religion: 'Hindu',
    community: 'Nair',
    sub_community: 'Menon Nair',
    caste: 'Nair',
    mother_tongue: 'Malayalam',
    city: 'Kochi & Hyderabad',
    salary_bracket: '₹30L - ₹40L / yr',
    income_bracket: '20-35',
    diet: 'Veg',
    occupation: 'AI Research Scientist',
    company_name: 'Microsoft Research',
    bio_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-smiling-with-a-laptop-41140-large.mp4',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80'
    ],
    voice_intro_url: 'https://cdn.freesound.org/previews/588/588234_11861866-lq.mp3',
    credits: 8,
    is_vouched: true,
    is_verified: true,
    is_spotlight: false,
    managed_by: 'self',
    compatibility_score: 95,
    mqs_score: 94.0,
    gun_milan_score: 29,
    is_unlocked: true,
    education: 'M.S. in Machine Learning, IIIT Hyderabad',
    height: "5'5\"",
    phone_number: '+91 91234 56789',
    location_intent: 'Open to Long Distance',
    bio_text: 'Working on LLMs by day, playing violin by night. Loves weekend treks in the Western Ghats and baking sourdough.',
    family_background: 'Father is a Chief Engineer at Cochin Port Trust, Mother is a Professor of Chemistry. Roots in Thrissur & Palakkad.',
    marriage_expectations: 'Looking for a kind, humor-loving partner who values balance between family traditions and modern independence.',
    privacy_settings: {
      photo_privacy: 'visible_to_everyone',
      profile_visibility: 'visible_in_discovery',
      financial_privacy: 'show_verified_badge'
    },
    lifestyle_details: {
      travel_freq: '2-3 times a year',
      second_home: false,
      private_clubs: 'International AI Society',
      net_worth: '₹2Cr - ₹5Cr'
    },
    horoscope: {
      manglik: 'No',
      dob: '1998-01-15',
      time_of_birth: '06:45 PM',
      place_of_birth: 'Kochi'
    },
    creator_vouch: {
      id: 'vouch-3',
      user_id: 'usr-priya',
      creator_id: 'cr-radhika',
      creator_name: 'Radhika Gupta (Matchmaker)',
      creator_avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      vouch_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-talking-on-a-video-call-41135-large.mp4',
      trust_rating: 4.95,
      commentary: 'Verified bio-data and family backgrounds. Priya is warm, exceptionally articulate, and clear about family values.'
    }
  }
];
