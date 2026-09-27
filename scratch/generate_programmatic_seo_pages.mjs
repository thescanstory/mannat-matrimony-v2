import fs from 'fs';
import path from 'path';

const pages = [
  // 1. Communities
  {
    slug: 'punjabi-matrimony',
    title: 'Punjabi Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Punjabi Matrimony for Discerning Families',
    eyebrow: 'Heritage & Lineage · Bespoke Matchmaking',
    description: 'Private, verified Punjabi matchmaking for accomplished Arora, Khatri, Sikh & Hindu Punjabi families. 100% ID verified biodatas with BlurShield™ privacy.',
    keywordFocus: 'Punjabi matrimony, Arora matrimony, Khatri matrimony, Sikh matrimony, verified Punjabi profiles',
    communityTag: 'Arora · Khatri · Sikh · Hindu Punjabi',
    countBadge: '1,400+ Verified Profiles',
    introText: 'Mannat Matrimony provides confidential, curated matchmaking for distinguished Punjabi families across India and the global diaspora (USA, UK, Canada, UAE). Every candidate profile undergoes multi-point credential, education, and family background vetting.',
    pillar1: { title: 'Authentic Lineage & Background Vetting', desc: 'Mandatory verification of government ID, higher education degrees, and family background.' },
    pillar2: { title: 'BlurShield™ Family Privacy Controls', desc: 'Portraits and contact coordinates remain softly blurred from public web crawlers.' },
    pillar3: { title: 'WhatsApp Bio-Data Dossier Sharing', desc: 'Instantly generate elegant candidate dossiers formatted specifically for family elders on WhatsApp.' },
    faqs: [
      { q: 'Which Punjabi communities are active on Mannat?', a: 'Mannat caters to Arora, Khatri, Sikh, Hindu Punjabi, Bhasin, Sethi, Kohli, and business families across Delhi NCR, Punjab, Chandigarh, Mumbai, UK, USA, and Canada.' },
      { q: 'How does Mannat verify candidate credentials?', a: 'Every profile undergoes a multi-point verification process: Government ID validation, educational degree verification from accredited universities, and professional registry validation.' },
      { q: 'How is family privacy protected on Mannat?', a: 'With BlurShield™, member portraits and contact numbers remain completely hidden from search engines and casual viewers until mutual interest is accepted.' }
    ]
  },
  {
    slug: 'marwari-matrimony',
    title: 'Marwari Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Marwari Matrimony for Prestigious Lineages',
    eyebrow: 'Industrialists & Business Lineages · Confidential Matchmaking',
    description: 'Exclusive, verified Marwari matchmaking for Agarwal, Maheshwari, Khandelwal & Oswal families. 100% verified biodatas and dedicated concierge advisory.',
    keywordFocus: 'Marwari matrimony, Agarwal matrimony, Maheshwari matrimony, Khandelwal matrimony, Oswal matrimony',
    communityTag: 'Agarwal · Maheshwari · Khandelwal · Oswal',
    countBadge: '1,250+ Verified Profiles',
    introText: 'Mannat offers private, high-touch matrimonial curation tailored specifically for prominent Marwari industrialist and business families in Mumbai, Delhi NCR, Kolkata, Rajasthan, Bangalore, and global NRI hubs.',
    pillar1: { title: 'Business & Industrial Lineage Alignment', desc: 'Curated introductions understanding the cultural nuances and financial wavelength of established business dynasties.' },
    pillar2: { title: 'Complete Kundli & Gun Milan Analysis', desc: 'Automated 36-point Gun Milan scores with Rashi, Nakshatra, and Manglik compatibility alongside lifestyle alignment.' },
    pillar3: { title: 'Bespoke Matchmaking Concierge', desc: 'Dedicated relationship managers who understand family legacy expectations and conduct discreet introductions.' },
    faqs: [
      { q: 'Which Marwari sub-communities are represented on Mannat?', a: 'We curate profiles for Agarwal (Garg, Goyal, Mittal, Bansal, Singhal), Maheshwari (Birla, Bangur, Daga, Somani, Kabra), Khandelwal, and Oswal business families.' },
      { q: 'Can family elders manage the candidate profile?', a: 'Yes. Parents and guardians can manage the profile with elder-friendly WhatsApp bio-data dossiers and dedicated phone support.' },
      { q: 'Are candidate photos publicly visible on search engines?', a: 'No. BlurShield™ guarantees zero public search engine indexing and protects photos until mutual interest is approved.' }
    ]
  },
  {
    slug: 'agarwal-matrimony',
    title: 'Agarwal Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Agarwal Matrimony for Distinguished Business Families',
    eyebrow: 'Banias · Mittal · Bansal · Goyal · Singhal · Garg',
    description: 'Private, verified Agarwal matchmaking for Mittal, Bansal, Goyal, Singhal, Garg & Jindal lineages. 100% verified biodatas with Kundli Gun Milan.',
    keywordFocus: 'Agarwal matrimony, Aggarwal matchmaking, Mittal matrimony, Bansal matrimony, Goyal matrimony',
    communityTag: 'Mittal · Bansal · Goyal · Singhal · Garg · Jindal',
    countBadge: '1,380+ Verified Profiles',
    introText: 'Exclusive matchmaking for Agarwal business and corporate leaders across Delhi NCR, Haryana, Punjab, Mumbai, Kolkata, and international locations.',
    pillar1: { title: 'Gotra & Lineage Compatibility', desc: 'Accurate Gotra mapping and background checks tailored for Agarwal traditions.' },
    pillar2: { title: 'Vedic Kundli Compatibility', desc: 'Automated 36-point Gun Milan scores calculated instantly with horoscope cards.' },
    pillar3: { title: 'Dignified Family Privacy', desc: 'BlurShield™ protection ensuring zero public search engine exposure of portraits.' },
    faqs: [
      { q: 'Which Agarwal Gotras are supported?', a: 'All 18 Agarwal Gotras including Garg, Goyal, Mittal, Bansal, Singhal, Kansal, Jindal, Tayal, and Bindal.' },
      { q: 'How does Mannat verify income and education?', a: 'We authenticate university degree certificates and company registry filings.' }
    ]
  },
  {
    slug: 'gujarati-matrimony',
    title: 'Gujarati Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Gujarati Matrimony for Discerning Families',
    eyebrow: 'Business Heritage · Cultural Harmony',
    description: 'Private, verified Gujarati matchmaking for Patel, Shah, Vaishnav & Jain Gujarati families across Mumbai, Ahmedabad, Surat, USA, and UK.',
    keywordFocus: 'Gujarati matrimony, Patel matrimony, Shah matrimony, Vaishnav matrimony, verified Gujarati biodatas',
    communityTag: 'Patel · Shah · Vaishnav · Jain Gujarati',
    countBadge: '980+ Verified Profiles',
    introText: 'A discreet, verified matchmaking sanctuary for Gujarati business leaders, chartered accountants, doctors, and global entrepreneurs in India and abroad.',
    pillar1: { title: 'Multi-Point Background Verification', desc: 'Authenticating professional standing, university credentials, and family background.' },
    pillar2: { title: 'Elder-Centric WhatsApp Sharing', desc: 'Generate complete biodatas and horoscope cards formatted for easy sharing on WhatsApp.' },
    pillar3: { title: 'Global NRI Gujarati Network', desc: 'Extensive candidate circles across New Jersey, California, London, Leicester, Dubai, and Singapore.' },
    faqs: [
      { q: 'Which Gujarati communities are active on Mannat?', a: 'We serve Leva & Kadva Patels, Vaishnav Vanias, Jain Shahs, Brahmins, and Gujarati business families.' },
      { q: 'How does BlurShield™ protect Gujarati family profiles?', a: 'Portraits remain softly blurred and protected. Contact details are never displayed publicly without mutual approval.' }
    ]
  },
  {
    slug: 'jain-matrimony',
    title: 'Jain Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Jain Matrimony for Values-Driven Families',
    eyebrow: 'Spiritual Values · Lineage Harmony',
    description: 'Confidential, verified matchmaking for Digambar, Shwetambar, Oswal & Porwal Jain families. 100% verified profiles with diet & value alignment.',
    keywordFocus: 'Jain matrimony, Shwetambar matrimony, Digambar matrimony, Oswal Jain matrimony',
    communityTag: 'Shwetambar · Digambar · Oswal · Porwal',
    countBadge: '820+ Verified Profiles',
    introText: 'Tailored matchmaking connecting Jain families who prioritize dietary alignment (pure vegetarian), cultural harmony, and intellectual compatibility.',
    pillar1: { title: 'Dietary & Lifestyle Compatibility', desc: 'Clear visibility into food preferences (Jain vegetarian / vegan) and daily lifestyle values.' },
    pillar2: { title: 'Rigorous Verification Standards', desc: 'Mandatory government ID and university credential verification for every candidate profile.' },
    pillar3: { title: 'Confidential Introductions', desc: 'Protecting candidate identity and dignity through BlurShield™ privacy controls.' },
    faqs: [
      { q: 'Do you cater to both Digambar and Shwetambar Jain families?', a: 'Yes, Mannat serves Digambar, Shwetambar Murtipujak, Sthanakvasi, Terapanthi, and Oswal Jain families.' },
      { q: 'How can we connect with a Jain relationship manager?', a: 'You can submit a VIP consultation request or call our dedicated concierge desk at +91-97383-97933.' }
    ]
  },
  {
    slug: 'brahmin-matrimony',
    title: 'Brahmin Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Brahmin Matrimony for Intellectual & Cultural Alliances',
    eyebrow: 'Tradition Meets Intellect · Vedic Compatibility',
    description: 'Private, verified Brahmin matchmaking for Gaur, Saraswat, Kanyakubj, Nagar & Sanadhya lineages. 100% verified credentials and automated Gun Milan.',
    keywordFocus: 'Brahmin matrimony, Gaur Brahmin, Saraswat Brahmin, Kanyakubj Brahmin, Nagar Brahmin',
    communityTag: 'Gaur · Saraswat · Kanyakubj · Nagar · Sanadhya',
    countBadge: '1,100+ Verified Profiles',
    introText: 'Dedicated to preserving cultural values, Vedic astrology harmony, and academic excellence for distinguished Brahmin families across India and globally.',
    pillar1: { title: 'Comprehensive Vedic Astrological Matching', desc: 'Detailed Kundli Milan, Rashi, Nakshatra, and Manglik assessment for spiritual and familial harmony.' },
    pillar2: { title: 'Academic & Professional Pedigree', desc: 'High concentration of Doctors, IIT/IIM alumni, Professors, Civil Servants, and Corporate Executives.' },
    pillar3: { title: 'Discreet Photo & Contact Privacy', desc: 'BlurShield™ ensures your biodata and photos are protected from unsolicited exposure.' },
    faqs: [
      { q: 'Which Brahmin lineages are active on Mannat?', a: 'Gaur, Saraswat, Kanyakubj, Nagar, Sanadhya, Maithil, Iyer, and Iyengar lineages are actively represented.' },
      { q: 'Is Kundli matching available on the app?', a: 'Yes, every profile includes automated 36-point Gun Milan calculation with detailed astrological breakdown.' }
    ]
  },
  {
    slug: 'rajput-matrimony',
    title: 'Rajput Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Rajput Matrimony for Royal & Distinguished Lineages',
    eyebrow: 'Heritage · Honor · Aristocratic Lineages',
    description: 'Private, verified Rajput matchmaking for Sisodia, Rathore, Chauhan, Shekhawat & Parmar lineages. 100% verified biodatas and concierge assistance.',
    keywordFocus: 'Rajput matrimony, Royal Rajput matchmaking, Rathore matrimony, Chauhan matrimony, Sisodia Rajput',
    communityTag: 'Sisodia · Rathore · Chauhan · Shekhawat · Parmar',
    countBadge: '740+ Verified Profiles',
    introText: 'Preserving aristocratic heritage, traditional family values, and modern intellectual aspirations for distinguished Rajput families in Rajasthan, Delhi, UP, MP, and abroad.',
    pillar1: { title: 'Kul & Clan Verification', desc: 'Respectful authentication of lineage, Kuldevi, and family ancestral background.' },
    pillar2: { title: 'Vedic Kundli Compatibility', desc: 'Complete Gun Milan calculation and astrological harmony review.' },
    pillar3: { title: 'Strict Privacy Protection', desc: 'BlurShield™ ensures portraits remain softly blurred until formal interest is accepted.' },
    faqs: [
      { q: 'Which Rajput clans are represented on Mannat?', a: 'Sisodia, Rathore, Chauhan, Shekhawat, Tomar, Parmar, Kachwaha, and Bhati lineages.' },
      { q: 'How does Mannat facilitate family introductions?', a: 'Through formatted WhatsApp dossiers and human concierge coordination between elders.' }
    ]
  },
  {
    slug: 'sindhi-matrimony',
    title: 'Sindhi Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Sindhi Matrimony for Global Business Families',
    eyebrow: 'Global Business Dynasties · Cultural Pride',
    description: 'Exclusive, verified Sindhi matchmaking for Lohana, Bhaiband, Sahiti & Amil families across Mumbai, Dubai, Singapore, London, and USA.',
    keywordFocus: 'Sindhi matrimony, Lohana matrimony, Bhaiband matrimony, Sahiti matrimony, Sindhi matchmaking',
    communityTag: 'Lohana · Bhaiband · Sahiti · Amil',
    countBadge: '650+ Verified Profiles',
    introText: 'Connecting enterprising Sindhi business families and accomplished professionals across India, UAE, UK, Hong Kong, and the United States.',
    pillar1: { title: 'Global Business Network', desc: 'Curating introductions among established international trading and corporate families.' },
    pillar2: { title: '100% Verified Credentials', desc: 'Government ID, education, and company validation before activation.' },
    pillar3: { title: 'BlurShield™ Privacy', desc: 'Protecting candidate identity from unauthorized social distribution.' },
    faqs: [
      { q: 'Which Sindhi groups are active on Mannat?', a: 'Lohana, Bhaiband, Sahiti, Amil, and Sindhi business families in Mumbai, Pune, Dubai, and worldwide.' },
      { q: 'Is international relocation support available?', a: 'Yes, filters specify relocation readiness across UAE, UK, and USA.' }
    ]
  },
  {
    slug: 'kayastha-matrimony',
    title: 'Kayastha Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Kayastha Matrimony for Intellectual & Administrative Lineages',
    eyebrow: 'Intellectual Heritage · Civil Services · Corporate Excellence',
    description: 'Private, verified Kayastha matchmaking for Srivastava, Saxena, Mathur, Nigam, Bhatnagar & Asthana families. 100% verified biodatas.',
    keywordFocus: 'Kayastha matrimony, Srivastava matrimony, Saxena matrimony, Mathur matrimony, Nigam matrimony',
    communityTag: 'Srivastava · Saxena · Mathur · Nigam · Bhatnagar',
    countBadge: '680+ Verified Profiles',
    introText: 'Celebrating generations of intellectual leadership, civil administration, jurisprudence, and modern corporate excellence for Kayastha families.',
    pillar1: { title: 'High Concentration of Civil Servants & CAs', desc: 'Connecting IAS, IPS, Judges, Lawyers, Chartered Accountants, and Corporate Leaders.' },
    pillar2: { title: 'Automated Astrological Gun Milan', desc: 'Instant 36-point horoscope compatibility reports.' },
    pillar3: { title: 'BlurShield™ Confidentiality', desc: 'Discreet portrait protection ensuring complete privacy.' },
    faqs: [
      { q: 'Which Kayastha sub-castes are on Mannat?', a: 'Srivastava, Saxena, Mathur, Nigam, Bhatnagar, Asthana, Ambashtha, and Kulshrestha.' },
      { q: 'How are education credentials verified?', a: 'We verify college degrees and professional registry documents.' }
    ]
  },

  // 2. Metros & Regional Hubs
  {
    slug: 'delhi-matrimony',
    title: 'Delhi NCR Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Bespoke Matrimonial Services in Delhi NCR',
    eyebrow: 'South Delhi · Gurgaon · Noida · West Delhi',
    description: 'Private, verified matchmaking for distinguished Delhi NCR families. 100% verified profiles of entrepreneurs, corporate leaders, and professionals.',
    keywordFocus: 'Delhi matrimony, Delhi NCR matchmaking, Gurgaon matrimony, South Delhi matrimonial services',
    communityTag: 'South Delhi · Gurgaon · Noida · West Delhi',
    countBadge: '2,800+ Verified Members',
    introText: 'Serving high-net-worth business families and corporate executives across South Delhi, Golf Course Road Gurgaon, Noida, and Chandigarh.',
    pillar1: { title: 'Delhi NCR High-Caliber Network', desc: 'Exclusive community of business founders, CXOs, civil servants, and medical specialists.' },
    pillar2: { title: 'Personalized Concierge Advisory', desc: 'Senior relationship advisors coordinating private family introductions in Delhi NCR.' },
    pillar3: { title: '100% Verified Credentials', desc: 'Zero fake profiles. Mandatory ID and professional verification before profile activation.' },
    faqs: [
      { q: 'Where are Delhi NCR members located?', a: 'Members are located across South Delhi (GK, Vasant Vihar, Jor Bagh), Gurgaon (DLF, Golf Course Rd), Noida, and Central Delhi.' },
      { q: 'How does Mannat assist Delhi families?', a: 'We provide both self-serve app exploration and dedicated matchmaker concierge support for personal introductions.' }
    ]
  },
  {
    slug: 'mumbai-matrimony',
    title: 'Mumbai Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Bespoke Matrimonial Services in Mumbai',
    eyebrow: 'South Mumbai · Bandra · Juhu · Powai',
    description: 'Private, verified matchmaking for discerning Mumbai families. Connect with top corporate leaders, entrepreneurs, and investment bankers.',
    keywordFocus: 'Mumbai matrimony, South Mumbai matchmaking, Bandra matrimony, verified Mumbai biodatas',
    communityTag: 'South Mumbai · Bandra · Juhu · Powai · Thane',
    countBadge: '2,400+ Verified Members',
    introText: 'India’s financial capital demands the highest standards of discretion. Mannat delivers confidential matchmaking for Mumbai’s elite families.',
    pillar1: { title: 'Finance, Tech & Business Leaders', desc: 'Featuring Investment Bankers, Corporate VPs, Family Business Successors, and Creative Directors.' },
    pillar2: { title: 'BlurShield™ Photo Confidentiality', desc: 'Safeguard your social and professional privacy with controlled photo unblurring.' },
    pillar3: { title: 'WhatsApp Alliance Cards', desc: 'Share verified candidate cards directly with family elders for swift consultation.' },
    faqs: [
      { q: 'Which areas of Mumbai are represented?', a: 'Members reside in South Mumbai (Colaba, Malabar Hill, Marine Drive), Bandra, Juhu, Powai, Andheri, and Thane.' },
      { q: 'Is the platform free to explore for Mumbai residents?', a: 'Yes, downloading the iOS app or signing into the web app is completely free to browse verified profiles.' }
    ]
  },
  {
    slug: 'matchmaking-bangalore',
    title: 'Bangalore Matchmaking & Elite Matrimony | Mannat Matrimony',
    h1: 'Bespoke Matchmaking for Bangalore Tech & Corporate Leaders',
    eyebrow: 'Indiranagar · Koramangala · Lavelle Road · Whitefield',
    description: 'Verified matchmaking for Bangalore’s tech founders, corporate VPs, doctors, and industrialist families. 100% verified credentials.',
    keywordFocus: 'Bangalore matrimony, Bangalore matchmaking, tech founder matrimony, verified Bangalore biodatas',
    communityTag: 'Indiranagar · Koramangala · Lavelle Rd · Whitefield',
    countBadge: '1,950+ Verified Members',
    introText: 'Connecting India’s top tech innovators, venture capitalists, corporate counsels, and established families in Bangalore.',
    pillar1: { title: 'High-Tech & Business Founder Circles', desc: 'Featuring Unicorn founders, Product Directors, VC partners, and Senior Surgeons.' },
    pillar2: { title: 'Intellectual & Cultural Compatibility', desc: 'Aligning progressive mindsets with deep cultural roots and familial values.' },
    pillar3: { title: 'Zero Public Search Indexing', desc: 'BlurShield™ guarantees your profile is never indexed on Google search engines.' },
    faqs: [
      { q: 'Which Bangalore areas are active?', a: 'Indiranagar, Koramangala, Sadashivanagar, Lavelle Road, HSR Layout, and Whitefield.' },
      { q: 'Are IT/Tech salaries verified?', a: 'Yes, our compliance team validates professional credentials and company registry profiles.' }
    ]
  },
  {
    slug: 'hyderabad-matrimony',
    title: 'Hyderabad Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Matrimonial Services in Hyderabad',
    eyebrow: 'Jubilee Hills · Banjara Hills · Gachibowli · Hitec City',
    description: 'Private, verified matchmaking for prestigious Hyderabad business dynasties, doctors, and tech leaders. 100% verified profiles with BlurShield™.',
    keywordFocus: 'Hyderabad matrimony, Jubilee Hills matchmaking, Banjara Hills matrimony, verified Hyderabad biodatas',
    communityTag: 'Jubilee Hills · Banjara Hills · Gachibowli · Secunderabad',
    countBadge: '1,500+ Verified Members',
    introText: 'Curating alliances for Hyderabad’s prominent pharmaceutical industrialists, real estate leaders, IT executives, and Reddy/Kamma/Brahmin lineages.',
    pillar1: { title: 'Prominent Industrialist & Tech Lineages', desc: 'Understanding the heritage and aspirations of Hyderabad’s leading families.' },
    pillar2: { title: 'Kundli & Cultural Matchmaking', desc: 'Vedic astrology Gun Milan and Gotra matching integrated.' },
    pillar3: { title: 'WhatsApp Dossiers for Elders', desc: 'Instant 1-click dossier creation formatted for family consultation.' },
    faqs: [
      { q: 'Which areas of Hyderabad are represented?', a: 'Jubilee Hills, Banjara Hills, Gachibowli, Madhapur, Somajiguda, and Secunderabad.' },
      { q: 'Do you offer concierge support in Hyderabad?', a: 'Yes, dedicated relationship managers assist in coordinating private family introductions.' }
    ]
  },
  {
    slug: 'pune-matrimony',
    title: 'Pune Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Matrimonial Services in Pune',
    eyebrow: 'Koregaon Park · Kalyani Nagar · Baner · Aundh',
    description: 'Private, verified matchmaking for Pune’s business families, automotive leaders, tech architects, and doctors. 100% verified biodatas.',
    keywordFocus: 'Pune matrimony, Koregaon Park matchmaking, Baner matrimony, verified Pune biodatas',
    communityTag: 'Koregaon Park · Kalyani Nagar · Baner · Aundh · Kothrud',
    countBadge: '1,150+ Verified Members',
    introText: 'Connecting Pune’s established industrial families, software engineering leaders, and medical specialists in a dignified, confidential environment.',
    pillar1: { title: 'Engineering, Auto & Tech Leadership', desc: 'High concentration of accomplished tech executives and manufacturing leaders.' },
    pillar2: { title: 'Astrological & Horoscope Matching', desc: '36-point Kundli Milan calculated with precision.' },
    pillar3: { title: 'BlurShield™ Privacy', desc: 'Safe from public internet exposure and unsolicited social searches.' },
    faqs: [
      { q: 'Which areas in Pune are covered?', a: 'Koregaon Park, Kalyani Nagar, Boat Club Road, Baner, Aundh, and Kothrud.' },
      { q: 'Is it free to join?', a: 'Yes, creating a profile and browsing verified matches is free.' }
    ]
  },

  // 3. Global NRI Hubs
  {
    slug: 'nri-matrimony',
    title: 'NRI Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified NRI Matrimony for Accomplished Global Indians',
    eyebrow: 'USA · UK · Canada · UAE · Australia · Singapore',
    description: 'Verified NRI matrimony for Indian professionals across USA, UK, Canada, UAE & Australia. Human-verified visas, degrees & careers with BlurShield™ privacy.',
    keywordFocus: 'NRI matrimony, global Indian matchmaking, USA NRI matrimony, UK NRI matrimony, Dubai matrimony',
    communityTag: 'USA · UK · Canada · UAE · Australia · Singapore',
    countBadge: '4,200+ Verified NRI Profiles',
    introText: 'Mannat connects verified Non-Resident Indian (NRI) professionals and accomplished families with like-minded partners in India and abroad. Rigorous passport, visa status (H-1B, Green Card, Citizen, ILR), university degree, and career verification.',
    pillar1: { title: 'Passport & Visa Verification', desc: 'Authenticating Passport, Citizen certificate, Green Card, H-1B, or OCI status.' },
    pillar2: { title: 'International University Degrees', desc: 'Validating Master’s and PhD qualifications from US, UK, Canadian, and Australian universities.' },
    pillar3: { title: 'BlurShield™ Global Privacy', desc: 'Safeguard your photos and career identity from public web scrapers.' },
    faqs: [
      { q: 'How does Mannat verify NRI visa status?', a: 'We review official documentation such as passport copy, foreign visa stamp, Green Card, or citizenship certificate.' },
      { q: 'Can parents in India manage an NRI profile?', a: 'Yes, parents can co-manage the profile with dual login capabilities.' },
      { q: 'Is the iOS app available internationally?', a: 'Yes, available on the Apple App Store across USA, UK, Canada, Australia, UAE, India, and 150+ countries.' }
    ]
  },

  // 4. Elite & Wealth Categories
  {
    slug: 'elite-matrimony',
    title: 'Elite Matrimony India | Luxury & VIP Matchmaking | Mannat',
    h1: 'Elite Matrimony for High-Net-Worth & Distinguished Families',
    eyebrow: 'Ultra HNI · Business Families · Luxury Matchmaking',
    description: 'India’s premier private matrimonial sanctuary for ultra-HNIs, corporate CXOs, and industrialist dynasties. 100% verified with dedicated concierge support.',
    keywordFocus: 'elite matrimony, luxury matchmaking india, vip matrimony, high net worth matrimony, private matchmaking',
    communityTag: 'Ultra HNI · Business Lineages · CXOs · Royalty',
    countBadge: '3,500+ Exclusive Members',
    introText: 'Where extraordinary lineages align. Mannat combines discrete technology, biometric privacy, and personalized human advisory for India’s most influential families.',
    pillar1: { title: 'Absolute Discretion & Zero Public Indexing', desc: 'Your biodata and portraits are never exposed to search engines or casual internet users.' },
    pillar2: { title: 'Dedicated Senior Matchmaker Concierge', desc: 'Bespoke advisory understanding financial stature, intellectual wavelength, and family traditions.' },
    pillar3: { title: 'Rigorous Background & Wealth Vetting', desc: 'Multi-tiered authentication of education, professional registry, and family reputation.' },
    faqs: [
      { q: 'What is the eligibility for Mannat Elite Matrimony?', a: 'Mannat caters to accomplished professionals, corporate leaders, family business successors, and distinguished lineages.' },
      { q: 'How does the concierge advisory work?', a: 'A dedicated relationship manager personally curates hand-picked candidate dossiers and coordinates confidential family introductions.' },
      { q: 'How can I apply for elite VIP membership?', a: 'Submit the VIP Consultation form on our website or contact our private concierge desk at +91-97383-97933.' }
    ]
  },
  {
    slug: 'matrimony-for-doctors',
    title: 'Matrimony for Doctors & Medical Specialists | Mannat Matrimony',
    h1: 'Verified Matrimony for Doctors & Healthcare Leaders',
    eyebrow: 'Surgeons · MDs · Super-Specialists · Healthcare',
    description: 'Exclusive, verified matchmaking for MBBS, MD, MS, DM & MCh medical professionals across India, USA, UK, and UAE. 100% credential verified.',
    keywordFocus: 'doctor matrimony, matrimony for doctors, medical specialist matchmaking, surgeon matrimony',
    communityTag: 'MBBS · MD/MS · DM/MCh · Healthcare Leaders',
    countBadge: '1,350+ Verified Doctors',
    introText: 'Understanding the intense dedication, academic rigor, and lifestyle rhythms of medical professionals. Mannat connects doctors with compatible life partners.',
    pillar1: { title: 'Medical Degree & Registry Validation', desc: 'Verification of NMC / State Medical Council registries and university qualifications.' },
    pillar2: { title: 'Specialty & Practice Understanding', desc: 'Filters for medical specialty, clinical practice, private hospital attachment, and research careers.' },
    pillar3: { title: 'Global Medical Relocation Filters', desc: 'Connecting doctors in India with NRI healthcare professionals preparing for USMLE, PLAB, or AMC pathways.' },
    faqs: [
      { q: 'How does Mannat verify medical credentials?', a: 'Our compliance desk validates NMC registration numbers, state council licenses, and postgraduate medical degrees.' },
      { q: 'Can doctors search for partners outside the medical field?', a: 'Yes, members can choose to match exclusively with other doctors or explore compatible corporate and civil service professionals.' }
    ]
  },
  {
    slug: 'iit-iim-matrimony',
    title: 'IIT IIM Alumni Matrimony | Elite Education Matchmaking | Mannat',
    h1: 'Verified Matrimony for IIT, IIM & Ivy League Alumni',
    eyebrow: 'Premier Institutes · Intellectual Wavelength',
    description: 'Private matchmaking for graduates of IIT, IIM, BITS, Stanford, Harvard, MIT & Columbia. Connect on intellectual wavelength and shared aspirations.',
    keywordFocus: 'IIT matrimony, IIM matrimony, IIT IIM matchmaking, alumni matrimony, Ivy League matrimony',
    communityTag: 'IIT · IIM · BITS · Ivy League · Stanford',
    countBadge: '1,800+ Verified Alumni',
    introText: 'For minds that think alike. Mannat curates introductions between accomplished alumni of India and the world’s top academic institutions.',
    pillar1: { title: 'Degree & Institute Credential Checks', desc: 'Strict verification of university degrees, graduation years, and professional employment.' },
    pillar2: { title: 'Shared Intellectual Wavelength', desc: 'Connecting ambitious tech founders, product leaders, McKinsey/BCG consultants, and researchers.' },
    pillar3: { title: 'BlurShield™ Professional Privacy', desc: 'Keep your career details and photos protected from open web crawlers.' },
    faqs: [
      { q: 'Which institutions are featured in the Alumni network?', a: 'IITs, IIMs, BITS Pilani, AIIMS, Stanford, Harvard, MIT, Columbia, Oxford, Cambridge, and London Business School.' },
      { q: 'How are degrees verified on Mannat?', a: 'We authenticate degree certificates and official university credentials.' }
    ]
  },
  {
    slug: 'verified-matrimony',
    title: '100% Verified Matrimony India | Mannat Matrimony',
    h1: 'India’s Only 100% Verified Matrimonial Platform',
    eyebrow: 'Zero Fake Profiles · Multi-Point ID Verification',
    description: 'Every candidate undergoes mandatory government ID, degree, salary, and family background authentication. Experience authentic, dignified matchmaking.',
    keywordFocus: 'verified matrimony, genuine matrimony india, 100% verified matchmaking, background verified biodatas',
    communityTag: 'Government ID · Degree · Salary · Background Verified',
    countBadge: '100% Verified Candidates',
    introText: 'Eliminating fake profiles, misleading claims, and unsolicited outreach. Mannat sets the gold standard for verified matrimonial trust in India.',
    pillar1: { title: 'Government ID Authentication', desc: 'Validating Aadhaar, Passport, and Voter ID documents.' },
    pillar2: { title: 'Professional & Salary Vetting', desc: 'Checking corporate registry and employment credentials.' },
    pillar3: { title: 'BlurShield™ Anti-Scraping Privacy', desc: 'Zero indexing of private details on public search engines.' },
    faqs: [
      { q: 'How long does verification take?', a: 'Our compliance team reviews and validates documentation within 24 hours.' },
      { q: 'Are unverified profiles allowed to send messages?', a: 'No, only verified candidates can send and receive interest waves.' }
    ]
  },
  {
    slug: 'photo-privacy-blurshield',
    title: 'BlurShield™ Matrimony Photo Privacy | Mannat Matrimony',
    h1: 'BlurShield™: Complete Matrimonial Photo & Data Privacy',
    eyebrow: 'Zero Public Indexing · Mutual Consent Unblurring',
    description: 'Keep your portraits, contact details, and biodata completely protected. Softly blurred photos unlocked strictly upon mutual consent.',
    keywordFocus: 'matrimony photo privacy, hide photos on matrimony app, blur photos matrimonial, confidential matchmaking',
    communityTag: 'Biometric Privacy · Anti-Screenshot · Mutual Consent',
    countBadge: '100% Confidential Sanctuary',
    introText: 'Your privacy is non-negotiable. BlurShield™ ensures member photos and contact information are never exposed to search engines, colleagues, or casual browsers.',
    pillar1: { title: 'Zero Google Search Indexing', desc: 'Member photos are completely excluded from search engine crawlers.' },
    pillar2: { title: 'Mutual Consent Unblurring', desc: 'Photos remain softly blurred until both candidates express mutual interest.' },
    pillar3: { title: 'Anti-Screenshot & Safe Sharing', desc: 'Advanced mobile architecture discouraging unauthorized saving.' },
    faqs: [
      { q: 'How does BlurShield™ work?', a: 'Photos are softly blurred by default. Once you send a wave and the matched candidate accepts, full HD photos are unlocked for both parties.' },
      { q: 'Can search engines like Google see my photos?', a: 'No, search engine bots are strictly blocked from indexing candidate images.' }
    ]
  }
];

function generateHtml(page) {
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${page.title}</title>
<meta name="description" content="${page.description}">
<meta name="keywords" content="${page.keywordFocus}">
<link rel="canonical" href="https://mannatmatrimony.com/${page.slug}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Mannat Matrimony">
<meta property="og:title" content="${page.title}">
<meta property="og:description" content="${page.description}">
<meta property="og:url" content="https://mannatmatrimony.com/${page.slug}">
<meta property="og:image" content="https://mannatmatrimony.com/og-image.jpg">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${page.title}">
<meta name="twitter:description" content="${page.description}">
<meta name="twitter:image" content="https://mannatmatrimony.com/og-image.jpg">
<meta name="apple-itunes-app" content="app-id=6812288373">
<meta name="theme-color" content="#560406">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Pinyon+Script&display=swap" rel="stylesheet">
<style>
:root { --bg: #F8F6F2; --surface: #ffffff; --ink: #161412; --muted: #6E6259; --primary: #560406; --primary-hover: #730C0F; --accent: #A17B5E; --gold: #D8B486; --border: #E8DDD0; }
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
body { margin: 0; background: var(--bg); color: var(--ink); font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; line-height: 1.6; }
h1, h2, h3 { font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif; line-height: 1.2; font-weight: 600; }
h1 { font-size: clamp(32px, 5.5vw, 54px); margin: 0.2em 0 0.35em; color: var(--ink); }
h2 { font-size: clamp(24px, 3.8vw, 36px); margin: 0 0 0.5em; color: var(--ink); }
h3 { font-size: 20px; margin: 0 0 0.4em; }
a { color: inherit; text-decoration-color: var(--accent); text-underline-offset: 3px; }
.wrap { max-width: 1120px; margin: 0 auto; padding: 0 20px; }
.narrow { max-width: 820px; }
header.site { background: rgba(248, 246, 242, 0.98); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 50; }
header.site .wrap { display: flex; justify-content: space-between; align-items: center; height: 72px; }
.brand-lockup { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.brand-logo { width: 42px; height: 42px; border-radius: 10px; object-fit: cover; border: 1px solid rgba(86,4,6,0.2); }
.brand-text { display: flex; flex-direction: column; text-align: left; }
.brand-script { font-family: 'Pinyon Script', cursive; font-size: 13px; color: var(--primary); line-height: 1; margin-bottom: -4px; }
.brand-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--primary); font-weight: 600; line-height: 1; }
.brand-sub { font-size: 7.5px; letter-spacing: 0.32em; text-transform: uppercase; color: var(--accent); font-weight: 700; margin-top: 2px; }
.header-actions { display: flex; align-items: center; gap: 10px; }
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 999px; font-weight: 700; font-size: 13px; text-decoration: none; transition: all 0.2s ease; cursor: pointer; border: none; }
.btn-primary { background: linear-gradient(135deg, var(--primary-hover), var(--primary)); color: #F5E6D3; border: 1px solid rgba(161,123,94,0.6); box-shadow: 0 4px 12px rgba(86,4,6,0.25); }
.btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
.btn-appstore { background: #1C0102; color: #fff; border: 1px solid rgba(86,4,6,0.3); }
.btn-appstore:hover { background: #260102; }
.hero { padding: 48px 0 40px; text-align: center; }
.eyebrow { display: inline-flex; align-items: center; gap: 6px; color: var(--primary); text-transform: uppercase; letter-spacing: 0.2em; font-size: 11px; font-weight: 800; background: rgba(86,4,6,0.08); padding: 4px 14px; border-radius: 999px; margin-bottom: 16px; border: 1px solid rgba(86,4,6,0.15); }
.hero-desc { font-size: clamp(16px, 2vw, 19px); color: var(--muted); max-width: 760px; margin: 0 auto 28px; line-height: 1.6; }
.hero-dock { background: linear-gradient(135deg, #3A0204, #560406, #3A0204); padding: 24px; border-radius: 24px; border: 1px solid rgba(161,123,94,0.4); box-shadow: 0 20px 50px rgba(86,4,6,0.35); max-width: 720px; margin: 0 auto 36px; text-align: left; color: #fff; }
.dock-title { font-size: 18px; font-weight: 700; color: #F5E6D3; margin-bottom: 6px; font-family: 'Cormorant Garamond', Georgia, serif; }
.dock-desc { font-size: 13px; color: #E8DDD0; margin-bottom: 16px; }
.dock-form { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; }
.dock-input { width: 100%; height: 44px; padding: 0 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); background: #fff; color: #161412; font-size: 13px; font-weight: 600; outline: none; }
.dock-submit { height: 44px; border-radius: 12px; background: linear-gradient(135deg, #D8B486, #A17B5E); color: #1C0102; font-weight: 800; font-size: 13px; border: none; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; }
.dock-submit:hover { filter: brightness(1.05); }
.chips-bar { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin: 16px 0 0; list-style: none; padding: 0; }
.chip { background: #fff; border: 1px solid var(--border); border-radius: 999px; padding: 6px 14px; font-size: 12px; font-weight: 600; color: var(--ink); }
.block { padding: 56px 0; border-top: 1px solid var(--border); background: #fff; }
.block-alt { padding: 56px 0; border-top: 1px solid var(--border); background: var(--bg); }
.pillars-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-top: 28px; text-align: left; }
.pillar-card { background: var(--bg); border: 1px solid var(--border); border-radius: 18px; padding: 24px; transition: border-color 0.2s; }
.pillar-card:hover { border-color: rgba(86,4,6,0.4); }
.pillar-num { width: 36px; height: 36px; border-radius: 10px; background: var(--primary); color: var(--gold); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; margin-bottom: 14px; }
.faq-item { background: #fff; border: 1px solid var(--border); border-radius: 14px; margin-bottom: 12px; padding: 18px 22px; text-align: left; }
.faq-q { font-weight: 700; font-size: 16px; color: var(--ink); font-family: 'Cormorant Garamond', Georgia, serif; }
.faq-a { font-size: 14px; color: var(--muted); margin-top: 8px; line-height: 1.6; }
.directory-cluster { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; margin-top: 20px; }
.dir-link { display: block; background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 12px 16px; font-size: 13px; font-weight: 600; text-decoration: none; color: var(--ink); transition: all 0.2s; }
.dir-link:hover { border-color: var(--primary); color: var(--primary); background: #FAF7F2; }
footer { background: #1C0102; color: #E8DDD0; padding: 48px 0 32px; border-top: 1px solid #2A0203; font-size: 13px; text-align: center; }
footer a { color: var(--gold); text-decoration: none; }
footer a:hover { color: #fff; }
</style>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://mannatmatrimony.com/#organization",
      "name": "Mannat Matrimony",
      "url": "https://mannatmatrimony.com",
      "logo": "https://mannatmatrimony.com/images/mannat-logo-square.png",
      "telephone": "+91-97383-97933",
      "sameAs": [
        "https://apps.apple.com/app/id6812288373",
        "https://www.instagram.com/mannatmatrimony_/"
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://mannatmatrimony.com/${page.slug}#webpage",
      "url": "https://mannatmatrimony.com/${page.slug}",
      "name": "${page.title}",
      "description": "${page.description}",
      "isPartOf": { "@id": "https://mannatmatrimony.com/#website" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mannatmatrimony.com/" },
        { "@type": "ListItem", "position": 2, "name": "${page.h1}", "item": "https://mannatmatrimony.com/${page.slug}" }
      ]
    },
    {
      "@type": "Service",
      "name": "${page.h1}",
      "serviceType": "Bespoke Matrimonial & Matchmaking Concierge",
      "provider": { "@id": "https://mannatmatrimony.com/#organization" },
      "description": "${page.description}",
      "areaServed": ["IN", "US", "GB", "AE", "CA", "AU", "SG"]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        ${page.faqs.map(f => `{
          "@type": "Question",
          "name": "${f.q.replace(/"/g, '\\"')}",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "${f.a.replace(/"/g, '\\"')}"
          }
        }`).join(',\n        ')}
      ]
    }
  ]
}
</script>
</head>
<body>

<header class="site">
  <div class="wrap">
    <a href="/" class="brand-lockup">
      <img src="/images/mannat-logo-square.png" alt="Mannat Matrimony" class="brand-logo" />
      <div class="brand-text">
        <span class="brand-script">At</span>
        <span class="brand-title">MANNAT</span>
        <span class="brand-sub">Bespoke Matchmaking</span>
      </div>
    </a>
    <div class="header-actions">
      <a href="https://apps.apple.com/app/id6812288373" target="_blank" rel="noreferrer" class="btn btn-appstore"> App Store</a>
      <a href="/app" class="btn btn-primary">Log In / Sign In →</a>
    </div>
  </div>
</header>

<main>
  <section class="hero wrap">
    <div class="eyebrow">${page.eyebrow}</div>
    <h1>${page.h1}</h1>
    <p class="hero-desc">${page.introText}</p>

    <div class="hero-dock">
      <div class="dock-title">Request Confidential Consultation</div>
      <div class="dock-desc">Our senior matchmakers curate bespoke profiles aligned with your family lineage &amp; expectations.</div>
      <form class="dock-form" action="/app" method="GET">
        <input type="text" name="name" placeholder="Your Full Name" class="dock-input" required />
        <input type="tel" name="phone" placeholder="Mobile Number (+91)" class="dock-input" required />
        <button type="submit" class="dock-submit">Explore Candidate Circle →</button>
      </form>
    </div>

    <ul class="chips-bar">
      <li class="chip">✓ 100% Verified Biodatas</li>
      <li class="chip">🔒 BlurShield™ Privacy Controls</li>
      <li class="chip">👑 ${page.countBadge}</li>
      <li class="chip">⚡ WhatsApp Dossier Cards</li>
    </ul>
  </section>

  <section class="block">
    <div class="wrap narrow" style="text-align: left;">
      <h2>Why Discerning Families Choose Mannat</h2>
      <p style="color: var(--muted); font-size: 15px; margin-bottom: 24px;">
        Traditional matrimony platforms are overwhelmed with unverified profiles, public photo exposure, and cold automated algorithms. Mannat redefines matchmaking by upholding strict verification, cultural dignity, and absolute confidentiality.
      </p>

      <div class="pillars-grid">
        <div class="pillar-card">
          <div class="pillar-num">01</div>
          <h3>${page.pillar1.title}</h3>
          <p style="font-size: 13px; color: var(--muted);">${page.pillar1.desc}</p>
        </div>
        <div class="pillar-card">
          <div class="pillar-num">02</div>
          <h3>${page.pillar2.title}</h3>
          <p style="font-size: 13px; color: var(--muted);">${page.pillar2.desc}</p>
        </div>
        <div class="pillar-card">
          <div class="pillar-num">03</div>
          <h3>${page.pillar3.title}</h3>
          <p style="font-size: 13px; color: var(--muted);">${page.pillar3.desc}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="block-alt">
    <div class="wrap narrow">
      <h2 style="text-align: center;">Frequently Asked Questions</h2>
      <div style="margin-top: 24px;">
        ${page.faqs.map(f => `
        <div class="faq-item">
          <div class="faq-q">${f.q}</div>
          <div class="faq-a">${f.a}</div>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <section class="block">
    <div class="wrap narrow" style="text-align: center;">
      <h2>Explore Matchmaking Directories</h2>
      <p style="font-size: 14px; color: var(--muted);">Explore verified candidate portfolios across communities, metros, and professions:</p>
      
      <div class="directory-cluster">
        <a href="/punjabi-matrimony" class="dir-link">🏛️ Punjabi Matrimony</a>
        <a href="/marwari-matrimony" class="dir-link">🏛️ Marwari Matrimony</a>
        <a href="/agarwal-matrimony" class="dir-link">🏛️ Agarwal Matrimony</a>
        <a href="/gujarati-matrimony" class="dir-link">🏛️ Gujarati Matrimony</a>
        <a href="/jain-matrimony" class="dir-link">🏛️ Jain Matrimony</a>
        <a href="/brahmin-matrimony" class="dir-link">🏛️ Brahmin Matrimony</a>
        <a href="/rajput-matrimony" class="dir-link">🏛️ Rajput Matrimony</a>
        <a href="/sindhi-matrimony" class="dir-link">🏛️ Sindhi Matrimony</a>
        <a href="/kayastha-matrimony" class="dir-link">🏛️ Kayastha Matrimony</a>
        <a href="/delhi-matrimony" class="dir-link">📍 Delhi NCR Matrimony</a>
        <a href="/mumbai-matrimony" class="dir-link">📍 Mumbai Matrimony</a>
        <a href="/matchmaking-bangalore" class="dir-link">📍 Bangalore Matrimony</a>
        <a href="/hyderabad-matrimony" class="dir-link">📍 Hyderabad Matrimony</a>
        <a href="/pune-matrimony" class="dir-link">📍 Pune Matrimony</a>
        <a href="/elite-matrimony" class="dir-link">👑 Elite Matrimony India</a>
        <a href="/nri-matrimony" class="dir-link">✈️ NRI Matrimony (Global)</a>
        <a href="/matrimony-for-doctors" class="dir-link">🩺 Doctors Matrimony</a>
        <a href="/iit-iim-matrimony" class="dir-link">🎓 IIT &amp; IIM Matrimony</a>
        <a href="/verified-matrimony" class="dir-link">🛡️ 100% Verified Matrimony</a>
        <a href="/photo-privacy-blurshield" class="dir-link">🔒 BlurShield™ Privacy</a>
      </div>
    </div>
  </section>
</main>

<footer>
  <div class="wrap">
    <p style="font-weight: 700; color: #fff; font-size: 15px; margin-bottom: 8px;">The House of Mannat · Private &amp; Verified Matchmaking</p>
    <p style="color: #A89CAE; margin-bottom: 16px;">© 2026 Mannat Matrimony. All rights reserved. Encrypted &amp; BlurShield™ Protected.</p>
    <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
      <a href="/privacy.html">Privacy Policy</a>
      <a href="/terms.html">Terms &amp; EULA</a>
      <a href="/support.html">Support &amp; Safety</a>
      <a href="/app">Log In / Sign In</a>
      <a href="https://apps.apple.com/app/id6812288373" target="_blank" rel="noreferrer"> iOS App Store</a>
    </div>
  </div>
</footer>

</body>
</html>`;
}

// Generate all pages
for (const page of pages) {
  const targetDir = path.join(process.cwd(), 'public', page.slug);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const filePath = path.join(targetDir, 'index.html');
  fs.writeFileSync(filePath, generateHtml(page), 'utf-8');
  console.log(`✅ Generated SEO Landing Page: /${page.slug}`);
}

// Update sitemap.xml with all pages
const allSlugs = [
  '',
  ...pages.map(p => p.slug),
  'support.html',
  'privacy.html',
  'terms.html',
  'eula.html'
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allSlugs.map(slug => {
  const loc = slug ? `https://mannatmatrimony.com/${slug}` : 'https://mannatmatrimony.com/';
  const priority = slug === '' ? '1.0' : slug.includes('html') ? '0.6' : '0.9';
  const changefreq = slug === '' ? 'daily' : slug.includes('html') ? 'monthly' : 'weekly';
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>2026-09-27</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemapXml, 'utf-8');
console.log(`✅ Updated public/sitemap.xml with all ${allSlugs.length} indexed URLs`);

console.log('🚀 Full Programmatic SEO Suite Generated!');
