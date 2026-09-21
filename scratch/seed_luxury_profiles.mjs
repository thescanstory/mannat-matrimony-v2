import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qexwbaykwguoigkaqiwa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFleHdiYXlrd2d1b2lna2FxaXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTQxNTIsImV4cCI6MjEwMjczMDE1Mn0.pGPPoAzzgEpsu8MLms9do6TK-OLQYYgkdpCTyOiG-no';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const profiles = [
  {
    id: '11111111-1111-4111-8111-111111111111',
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
      gender: 'female'
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
      gender: 'male'
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
      gender: 'female'
    },
    horoscope: {
      rashi: 'Tula (Libra)',
      nakshatra: 'Chitra',
      manglik: 'No',
      birth_time: '04:20 PM',
      birth_place: 'New Delhi'
    }
  }
];

async function seed() {
  console.log('Seeding curated candidate profiles...');
  for (const p of profiles) {
    const { error } = await supabase.from('profiles').upsert([p]);
    if (error) console.error('Error inserting', p.display_name, error);
    else console.log('✅ Added candidate profile:', p.display_name);
  }
}

seed();
