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
  },
  {
    id: '44444444-4444-4444-8444-444444444444',
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
      gender: 'male'
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
      gender: 'female'
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
      marriage_expectations: 'A poised, accomplished partner who values tradition alongside modern ambition',
      gender: 'male'
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
      gender: 'female'
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

async function seed() {
  console.log(`Seeding ${profiles.length} curated luxury candidate profiles to Supabase...`);
  let success = 0;
  for (const p of profiles) {
    const { error } = await supabase.from('profiles').upsert([p]);
    if (error) {
      console.error(`❌ Error inserting ${p.display_name}:`, error.message);
    } else {
      success++;
      console.log(`✅ [${success}/${profiles.length}] Successfully seeded profile: ${p.display_name} (${p.occupation})`);
    }
  }
  console.log(`\n🎉 Finished seeding ${success} profiles to database!`);
}

seed();
