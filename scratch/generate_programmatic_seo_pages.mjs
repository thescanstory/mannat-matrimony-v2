import fs from 'fs';
import path from 'path';

const pages = [
  // ==========================================
  // 1. COMMUNITIES & LINEAGES
  // ==========================================
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
    slug: 'sikh-matrimony',
    title: 'Sikh Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Elite Sikh Matrimony for Prestigious Families',
    eyebrow: 'Gursikh & Sikh Professionals · Global Matchmaking',
    description: 'Exclusive Sikh matchmaking for Jat Sikh, Ramgarhia, Khatri & Arora Sikh professionals across Punjab, Delhi NCR, Canada, UK, and USA. 100% verified biodatas.',
    keywordFocus: 'Sikh matrimony, Jat Sikh matrimony, Gursikh matchmaking, NRI Sikh matrimony Canada UK',
    communityTag: 'Jat Sikh · Khatri Sikh · Arora Sikh · Gursikh',
    countBadge: '1,120+ Verified Profiles',
    introText: 'Mannat connects accomplished Sikh doctors, corporate executives, entrepreneurs, and defense officers with values-aligned Sikh families worldwide.',
    pillar1: { title: 'Faith & Cultural Values Alignment', desc: 'Detailed options for Gursikh, Keshdhari, Amritdhari, and modern Sikh lifestyle preferences.' },
    pillar2: { title: 'Global NRI Sikh Network', desc: 'Direct access to established Sikh families in Toronto, Vancouver, London, Birmingham, and California.' },
    pillar3: { title: 'Dignified Family Privacy', desc: 'BlurShield™ protection ensuring portraits remain protected until mutual consent.' },
    faqs: [
      { q: 'Do you cater to NRI Sikh families in Canada and the UK?', a: 'Yes, a large segment of our verified Sikh network resides in Canada, the UK, the US, and Australia.' },
      { q: 'Can we filter profiles by turban/lifestyle preferences?', a: 'Yes, filters include Keshdhari, Gursikh, vegetarian diet, and cultural traditions.' }
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
      { q: 'Which Marwari sub-communities are represented on Mannat?', a: 'We curate profiles for Agarwal, Maheshwari, Khandelwal, and Oswal business families.' },
      { q: 'Can family elders manage the candidate profile?', a: 'Yes. Parents and guardians can manage the profile with elder-friendly WhatsApp bio-data dossiers and dedicated phone support.' },
      { q: 'Are candidate photos publicly visible on search engines?', a: 'No. BlurShield™ guarantees zero public search engine indexing.' }
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
      { q: 'How does Mannat verify income and education?', a: 'We authenticate university degree certificates and professional registry records.' }
    ]
  },
  {
    slug: 'maheshwari-matrimony',
    title: 'Maheshwari Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Elite Maheshwari Matrimony for Prominent Families',
    eyebrow: 'Birla · Bangur · Daga · Somani · Kabra · Rathi',
    description: 'High-end verified matchmaking for Maheshwari business families, CAs, and entrepreneurs across Rajasthan, Mumbai, Pune, Kolkata, and Hyderabad.',
    keywordFocus: 'Maheshwari matrimony, Maheshwari matchmaking, Daga matrimony, Somani matrimony, Kabra matrimony',
    communityTag: 'Somani · Daga · Kabra · Rathi · Toshniwal · Mohta',
    countBadge: '680+ Verified Profiles',
    introText: 'Discreet matchmaking designed for respected Maheshwari business lineages who value cultural traditions, vegetarianism, and mutual family prestige.',
    pillar1: { title: 'Gotra & Khas Parivar Mapping', desc: 'Precise Gotra and Kuldevi validation for traditional Maheshwari standards.' },
    pillar2: { title: 'Kundli Milan & Manglik Verification', desc: 'In-depth Vedic horoscope compatibility analysis for marriage peace and prosperity.' },
    pillar3: { title: 'Discreet VIP Matchmaking', desc: 'Personal relationship manager for discreet family-to-family meetings.' },
    faqs: [
      { q: 'Which regions have the highest Maheshwari candidate concentration on Mannat?', a: 'Rajasthan (Jaipur, Jodhpur, Bikaner), Mumbai, Pune, Kolkata, Indore, and Hyderabad.' }
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
      { q: 'Which Gujarati communities are active on Mannat?', a: 'We serve Leva & Kadva Patels, Vaishnav Vanias, Jain Shahs, Brahmins, and Gujarati business families.' }
    ]
  },
  {
    slug: 'patel-matrimony',
    title: 'Patel Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Patel Matrimony for Leva & Kadva Patidar Families',
    eyebrow: 'Patidar Heritage · Global Network',
    description: 'Exclusive matchmaking for Leva and Kadva Patel families across Gujarat, USA, UK, Canada, and East Africa. 100% ID verified profiles.',
    keywordFocus: 'Patel matrimony, Leva Patel matrimony, Kadva Patidar matrimony, NRI Patel matchmaking USA',
    communityTag: 'Leva Patel · Kadva Patidar · 24 Gam · 6 Gam · 42 Gam',
    countBadge: '940+ Verified Profiles',
    introText: 'Connecting respected Patel families across Ahmedabad, Surat, Baroda, Rajkot, London, New Jersey, and Dallas with pre-verified profiles.',
    pillar1: { title: 'Gam & Samaj Validation', desc: 'Filter profiles by specific Gam Samaj (6 Gam, 24 Gam, 42 Gam) and region.' },
    pillar2: { title: 'Green Card & NRI Status Verification', desc: 'Verified immigration credentials for global NRI Patels.' },
    pillar3: { title: 'BlurShield™ Photo Security', desc: 'Complete confidentiality for brides and grooms until family interest is approved.' },
    faqs: [
      { q: 'Do you cover both Leva and Kadva Patels?', a: 'Yes, we have verified networks for both communities worldwide.' }
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
      { q: 'Do you cater to both Digambar and Shwetambar Jain families?', a: 'Yes, Mannat serves Digambar, Shwetambar Murtipujak, Sthanakvasi, Terapanthi, and Oswal Jain families.' }
    ]
  },
  {
    slug: 'brahmin-matrimony',
    title: 'Brahmin Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Brahmin Matrimony for Intellectual Lineages',
    eyebrow: 'Vedic Heritage · High Educational Prestige',
    description: 'Private matchmaking for Gaur, Saraswat, Kanyakubja, Maithil, Iyer, Iyengar, and Deshastha Brahmin families. 100% verified credentials with Kundli matching.',
    keywordFocus: 'Brahmin matrimony, Gaur Brahmin matrimony, Saraswat matrimony, Kanyakubja matrimony, Iyer matrimony, Iyengar matrimony',
    communityTag: 'Gaur · Saraswat · Kanyakubja · Maithil · Iyer · Iyengar · Deshastha',
    countBadge: '1,500+ Verified Profiles',
    introText: 'Connecting cultured Brahmin families with accomplished doctors, engineers, civil servants, and corporate leaders rooted in cultural values.',
    pillar1: { title: 'Gotra, Pravara & Veda Alignment', desc: 'Detailed Gotra mapping ensuring precise Vedic tradition adherence.' },
    pillar2: { title: 'Vedic Kundli & 36 Gun Milan', desc: 'Instant astrological matchmaking including Manglik, Nadi, and Bhakoot dosha checks.' },
    pillar3: { title: 'Strict Privacy & Identity Protection', desc: 'BlurShield™ guarantees your family dignity and confidential introductions.' },
    faqs: [
      { q: 'Which Brahmin sub-sects are represented on Mannat?', a: 'Gaur, Saraswat, Sanadya, Kanyakubja, Maithil, Iyer, Iyengar, Deshastha, Chitpavan, and Nagar Brahmins.' }
    ]
  },
  {
    slug: 'rajput-matrimony',
    title: 'Rajput Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Rajput Matrimony for Regal Lineages',
    eyebrow: 'Kshatriya Heritage · Nobility & Valor',
    description: 'Exclusive Rajput matchmaking for Rathore, Chauhan, Sisodia, Shekhawat, Tomar & Parmar families. 100% verified biodatas and Kuldevi matching.',
    keywordFocus: 'Rajput matrimony, Kshatriya matchmaking, Rathore matrimony, Chauhan matrimony, Sisodia matrimony',
    communityTag: 'Rathore · Chauhan · Sisodia · Shekhawat · Tomar · Parmar',
    countBadge: '890+ Verified Profiles',
    introText: 'Curated matchmaking for prestigious Rajput royal, feudal, and accomplished modern families in Rajasthan, MP, UP, Bihar, Gujarat, and overseas.',
    pillar1: { title: 'Kul, Vansh & Gotra Compatibility', desc: 'Suryavanshi, Chandravanshi, and Agnivanshi lineage alignment with strict Gotra verification.' },
    pillar2: { title: 'Horoscope & Kundli Verification', desc: 'Complete 36 Gun Milan with Manglik compatibility analysis.' },
    pillar3: { title: 'Discreet Family Coordination', desc: 'White-glove introductions preserving royal dignity and privacy.' },
    faqs: [
      { q: 'How does Mannat verify Rajput ancestry and background?', a: 'Profiles are verified through government ID, educational degrees, and local family references.' }
    ]
  },
  {
    slug: 'maratha-matrimony',
    title: 'Maratha Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified 96 Kuli Maratha Matrimony',
    eyebrow: '96 Kuli Heritage · Maharashtra & Global',
    description: 'Bespoke matchmaking for 96 Kuli Maratha and Deshmukh families across Pune, Mumbai, Kolhapur, Satara, and NRI locations.',
    keywordFocus: 'Maratha matrimony, 96 Kuli Maratha matrimony, Deshmukh matrimony, Maratha matchmaking Pune Mumbai',
    communityTag: '96 Kuli Maratha · Deshmukh · Patil · Jadhav · Bhosale · Shinde',
    countBadge: '1,100+ Verified Profiles',
    introText: 'Serving respected Maratha business leaders, doctors, civil servants, and professionals with verified credentials and Vedic Patrika matching.',
    pillar1: { title: '96 Kuli Lineage & Devak Verification', desc: 'Detailed recording of Kul, Devak, and Gotra traditions.' },
    pillar2: { title: 'Vedic Patrika Gun Milan', desc: 'Comprehensive horoscope matching for harmonious marital unions.' },
    pillar3: { title: 'Complete Privacy Protection', desc: 'BlurShield™ ensures your profile is shared only with verified families.' },
    faqs: [
      { q: 'Are 96 Kuli Maratha Kul and Devak details verified?', a: 'Yes, members record Devak, Gotra, and Kul on their confidential profiles.' }
    ]
  },
  {
    slug: 'sindhi-matrimony',
    title: 'Sindhi Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Sindhi Matrimony for Global Business Families',
    eyebrow: 'Sindhi Heritage · Global Diaspora',
    description: 'Private, verified Sindhi matchmaking for Amil, Bhaiband, Sahiti & Larkana families across Mumbai, Pune, Dubai, London, Hong Kong, and USA.',
    keywordFocus: 'Sindhi matrimony, Sindhi matchmaking, Amil matrimony, Bhaiband matrimony, NRI Sindhi matchmaking Dubai',
    communityTag: 'Amil · Bhaiband · Sahiti · Larkana',
    countBadge: '620+ Verified Profiles',
    introText: 'Curated introductions for Sindhi business leaders, entrepreneurs, chartered accountants, and global traders across India and the diaspora.',
    pillar1: { title: 'Global NRI Sindhi Connections', desc: 'Deep roots in Dubai, Singapore, Hong Kong, London, Lagos, and USA.' },
    pillar2: { title: 'Business & Lifestyle Alignment', desc: 'Connecting families with shared entrepreneurial mindset and cultural warmth.' },
    pillar3: { title: 'Dignified Discretion', desc: 'BlurShield™ keeps portraits confidential until mutually approved.' },
    faqs: [
      { q: 'Which Sindhi communities are on Mannat?', a: 'Amil, Bhaiband, Sahiti, and Sindhi business families across India and the NRI diaspora.' }
    ]
  },
  {
    slug: 'kayastha-matrimony',
    title: 'Kayastha Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Kayastha Matrimony for Intellectual Families',
    eyebrow: 'Scholarly Heritage · Civil Servants & Corporate Leaders',
    description: 'Private matchmaking for Mathur, Srivastava, Saxena, Bhatnagar, Nigam & Asthana families. 100% verified degrees and backgrounds.',
    keywordFocus: 'Kayastha matrimony, Srivastava matrimony, Mathur matrimony, Saxena matrimony, Bhatnagar matrimony',
    communityTag: 'Srivastava · Mathur · Saxena · Bhatnagar · Nigam · Asthana',
    countBadge: '740+ Verified Profiles',
    introText: 'Connecting cultured Kayastha families across Delhi NCR, UP, Bihar, Mumbai, Bangalore, and global NRI hubs with pre-verified profiles.',
    pillar1: { title: 'Educational & Professional Pedigree', desc: 'Focus on accomplished professionals: doctors, IAS/IPS, lawyers, and corporate leaders.' },
    pillar2: { title: 'Kundli & Gotra Mapping', desc: 'Astrological compatibility matching aligned with Kayastha traditions.' },
    pillar3: { title: 'Strict Privacy & Identity Protection', desc: 'Portraits and contact numbers protected by BlurShield™.' },
    faqs: [
      { q: 'Which Kayastha sub-castes are available?', a: 'Srivastava, Mathur, Saxena, Bhatnagar, Nigam, Kulshreshtha, Gaur, and Asthana.' }
    ]
  },
  {
    slug: 'telugu-matrimony',
    title: 'Telugu Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Telugu Matrimony for Prestigious Families',
    eyebrow: 'Reddy · Kamma · Arya Vysya · Brahmin Telugu',
    description: 'Exclusive matchmaking for Telugu Reddy, Kamma, Brahmin, and Arya Vysya families across Hyderabad, Bangalore, USA, and UK.',
    keywordFocus: 'Telugu matrimony, Reddy matrimony, Kamma matrimony, Arya Vysya matrimony, Telugu NRI matchmaking USA',
    communityTag: 'Reddy · Kamma · Arya Vysya · Brahmin · Kapu',
    countBadge: '1,450+ Verified Profiles',
    introText: 'Connecting distinguished Telugu families with top US MS/H1B professionals, doctors, tech executives, and business leaders.',
    pillar1: { title: 'USA & Global NRI Telugu Network', desc: 'Direct verification for H1B, Green Card, and US citizen Telugu professionals.' },
    pillar2: { title: 'Jathakam & 36 Guna Milan', desc: 'Instant Telugu horoscope and Jathakam matching with Dosha checks.' },
    pillar3: { title: 'BlurShield™ Privacy', desc: 'Candidate photos protected from search engine scraping.' },
    faqs: [
      { q: 'Are US NRI Telugu profiles verified?', a: 'Yes, university degrees, company credentials, and LinkedIn profiles are verified.' }
    ]
  },
  {
    slug: 'reddy-matrimony',
    title: 'Reddy Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Reddy Matrimony for Prestigious Families',
    eyebrow: 'Reddy Heritage · Hyderabad, Andhra & Global NRI',
    description: 'High-touch matchmaking for Motati, Gudati, Pedakanti, and Pakanati Reddy families. 100% verified biodatas.',
    keywordFocus: 'Reddy matrimony, Reddy matchmaking Hyderabad, NRI Reddy matrimony USA, Motati Reddy',
    communityTag: 'Motati · Gudati · Pedakanti · Pakanati · Pokanati',
    countBadge: '920+ Verified Profiles',
    introText: 'Catering to prominent Reddy business dynasties, doctors, software leaders, and political families in India and overseas.',
    pillar1: { title: 'Gothram & Branch Matching', desc: 'Precise Gothram and regional branch verification.' },
    pillar2: { title: 'Jathakam Kundali Match', desc: 'Accurate Telugu horoscope alignment.' },
    pillar3: { title: 'Confidential Dossiers', desc: 'WhatsApp-ready biodatas formatted for family elders.' },
    faqs: [
      { q: 'Which Reddy branches are registered on Mannat?', a: 'Motati, Gudati, Pakanati, Reddy doctors, and software executives in USA and India.' }
    ]
  },
  {
    slug: 'tamil-matrimony',
    title: 'Tamil Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Tamil Matrimony for Cultured Families',
    eyebrow: 'Iyer · Iyengar · Chettiar · Mudaliar · Nadar',
    description: 'Curated Tamil matchmaking for Brahmin Iyer, Iyengar, Chettiar, and Mudaliar families across Chennai, Bangalore, Singapore, and USA.',
    keywordFocus: 'Tamil matrimony, Iyer matrimony, Iyengar matrimony, Chettiar matrimony, Tamil Brahmin matchmaking',
    communityTag: 'Iyer · Iyengar · Chettiar · Mudaliar · Pillai · Nadar',
    countBadge: '1,180+ Verified Profiles',
    introText: 'Preserving traditions and intellectual values by connecting accomplished Tamil professionals with verified family backgrounds.',
    pillar1: { title: 'Porutham & Jathagam Match', desc: '10 Poruthams analysis and Vedic horoscope matching.' },
    pillar2: { title: 'Verified Educational Credentials', desc: 'Authentication of top university degrees and global roles.' },
    pillar3: { title: 'BlurShield™ Discretion', desc: 'Complete confidentiality for family elders and candidates.' },
    faqs: [
      { q: 'Does Mannat calculate 10 Poruthams for Tamil profiles?', a: 'Yes, full Porutham and Jathagam compatibility reports are generated automatically.' }
    ]
  },
  {
    slug: 'iyer-matrimony',
    title: 'Iyer Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Iyer Matrimony for Vadama & Brahacharanam Families',
    eyebrow: 'Vadama · Brahacharanam · Vathima · Ashtasahasram',
    description: 'Exclusive matchmaking for Tamil Brahmin Iyer families. 100% verified profiles with Gothram, Veda, and 10 Poruthams Jathagam analysis.',
    keywordFocus: 'Iyer matrimony, Vadama Iyer matrimony, Brahacharanam matchmaking, Tamil Brahmin Iyer profiles',
    communityTag: 'Vadama · Brahacharanam · Vathima · Ashtasahasram · Chozhiya',
    countBadge: '650+ Verified Profiles',
    introText: 'Dedicated to cultured Iyer families seeking accomplished doctors, scientists, IIT/IIM graduates, and tech innovators.',
    pillar1: { title: 'Gothram & Pravara Strict Matching', desc: 'Zero same-gothram errors, honoring Vedic Shastras.' },
    pillar2: { title: '10 Porutham Horoscope Compatibility', desc: 'Detailed astrological compatibility scorecards.' },
    pillar3: { title: 'Discreet Family Introductions', desc: 'BlurShield™ security for family photos.' },
    faqs: [
      { q: 'Which Iyer sects are included?', a: 'Vadama, Brahacharanam, Vathima, Ashtasahasram, and Chozhiya.' }
    ]
  },
  {
    slug: 'kannada-matrimony',
    title: 'Kannada Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Kannada Matrimony for Prominent Families',
    eyebrow: 'Brahmin · Lingayat · Vokkaliga · Gowda · Shetty',
    description: 'Bespoke matchmaking for Kannada Brahmin, Lingayat, Vokkaliga, and Bunt families across Bangalore, Mysore, Hubli, and NRI locations.',
    keywordFocus: 'Kannada matrimony, Lingayat matrimony, Vokkaliga matrimony, Kannada Brahmin matrimony, Bunt matrimony Bangalore',
    communityTag: 'Brahmin · Lingayat · Vokkaliga · Bunt · Kuruba',
    countBadge: '1,050+ Verified Profiles',
    introText: 'Connecting cultured Karnataka families with high-achieving corporate leaders, entrepreneurs, and overseas professionals.',
    pillar1: { title: 'Kundali & Gun Milan', desc: 'Vedic horoscope and Rashi Nakshatra analysis.' },
    pillar2: { title: 'Strict ID & Work Verification', desc: 'Multi-point background checks.' },
    pillar3: { title: 'Elder-Friendly WhatsApp Sharing', desc: 'Easy biodata PDFs for family discussions.' },
    faqs: [
      { q: 'Do you cover Bunt and Lingayat families?', a: 'Yes, we have specialized curated circles for Bunts, Lingayats, Vokkaligas, and Kannada Brahmins.' }
    ]
  },
  {
    slug: 'malayalam-matrimony',
    title: 'Malayalam Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Malayalam Matrimony for Cultured Families',
    eyebrow: 'Nair · Ezhava · Syrian Christian · Menon · Namboodiri',
    description: 'Private matchmaking for Nair, Menon, Syrian Christian, and Ezhava families across Kerala, Bangalore, Dubai/Gulf, UK, and USA.',
    keywordFocus: 'Malayalam matrimony, Nair matrimony, Kerala matrimony, Syrian Christian matrimony, Gulf Malayalam matchmaking',
    communityTag: 'Nair · Menon · Syrian Christian · Ezhava · Namboodiri',
    countBadge: '960+ Verified Profiles',
    introText: 'Connecting educated Kerala families with doctors, nurses, software architects, and Gulf entrepreneurs with verified credentials.',
    pillar1: { title: 'Jathakam & Porutham Analysis', desc: 'Traditional Kerala astrological matching.' },
    pillar2: { title: 'Gulf & Global NRI Hubs', desc: 'Extensive candidate base across UAE, Oman, Qatar, UK, and USA.' },
    pillar3: { title: 'BlurShield™ Privacy Controls', desc: 'Zero public exposure of candidate photographs.' },
    faqs: [
      { q: 'Are Gulf NRI Malayali profiles verified?', a: 'Yes, Gulf residency visas, job contracts, and educational degrees are thoroughly vetted.' }
    ]
  },
  {
    slug: 'bengali-matrimony',
    title: 'Bengali Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Bengali Matrimony for Intellectual Lineages',
    eyebrow: 'Brahmin · Baidya · Kayastha · Mahishya',
    description: 'Curated matchmaking for Bengali Brahmin (Banerjee, Chatterjee, Mukherjee), Baidya (Sen, Dasgupta), and Kayastha (Ghosh, Bose, Mitra) families.',
    keywordFocus: 'Bengali matrimony, Bengali Brahmin matrimony, Baidya matrimony, Bengali Kayastha matchmaking Kolkata',
    communityTag: 'Brahmin · Baidya · Kayastha · Mahishya',
    countBadge: '880+ Verified Profiles',
    introText: 'Serving progressive, cultured Bengali families seeking doctors, academics, tech pioneers, and creative leaders.',
    pillar1: { title: 'Koshthi Gun Milan', desc: 'Accurate Bengali horoscope and astrological compatibility.' },
    pillar2: { title: 'Academic & Professional Verification', desc: 'Verification of IIT, IIM, medical, and foreign university credentials.' },
    pillar3: { title: 'Confidential Introductions', desc: 'Dignified matchmaking with BlurShield™ protection.' },
    faqs: [
      { q: 'Which Bengali communities are represented?', a: 'Rarhi & Varendra Brahmins, Baidyas, and Kayasthas across Kolkata, Delhi, Bangalore, UK, and USA.' }
    ]
  },
  {
    slug: 'kashmiri-pandit-matrimony',
    title: 'Kashmiri Pandit Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Kashmiri Pandit Matrimony',
    eyebrow: 'Vedic Heritage · Saraswat Lineage',
    description: 'Exclusive, confidential matchmaking for Kashmiri Pandit families worldwide. 100% verified Gotra, Teki horoscope, and family lineage checks.',
    keywordFocus: 'Kashmiri Pandit matrimony, Kashmiri Brahmin matchmaking, Teki matching, Saraswat Kashmiri profiles',
    communityTag: 'Dhar · Raina · Kaul · Bhat · Mattoo · Tikoo · Pandit',
    countBadge: '410+ Verified Profiles',
    introText: 'Dedicated to preserving cultural heritage and connecting distinguished Kashmiri Pandit families across Delhi NCR, Jammu, Mumbai, USA, and UK.',
    pillar1: { title: 'Teki & Horoscope Compatibility', desc: 'Authentic Kashmiri Teki astrological matching.' },
    pillar2: { title: 'Gotra & Lineage Preservation', desc: 'Detailed ancestral background validation.' },
    pillar3: { title: 'Discreet Family Privacy', desc: 'BlurShield™ protects candidate photos.' },
    faqs: [
      { q: 'How does Teki matching work on Mannat?', a: 'Teki charts are matched with full planetary aspect analysis alongside 36 Gun Milan.' }
    ]
  },

  // ==========================================
  // 2. GLOBAL NRI GEO-TARGETED
  // ==========================================
  {
    slug: 'nri-matrimony',
    title: 'NRI Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified NRI Matrimony for Global Indian Families',
    eyebrow: 'USA · UK · Canada · UAE · Australia · Singapore',
    description: 'Premier matchmaking for NRI tech leaders, physicians, investment bankers, and entrepreneurs across North America, Europe, and the Middle East.',
    keywordFocus: 'NRI matrimony, global Indian matchmaking, USA NRI matrimony, UK Indian matrimony, Canada Indian matchmaking',
    communityTag: 'USA · UK · Canada · UAE · Australia · Singapore',
    countBadge: '2,800+ Verified NRI Profiles',
    introText: 'Mannat bridges continents for ambitious NRI singles and their families, ensuring verified immigration status, authentic education credentials, and cultural compatibility.',
    pillar1: { title: 'Immigration & Visa Status Verification', desc: 'Clear visibility of H-1B, Green Card, US/UK/Canadian Citizenship status.' },
    pillar2: { title: 'Cross-Timezone Family Concierge', desc: 'Dedicated relationship managers coordinating introductions across IST, EST, PST, and GMT.' },
    pillar3: { title: 'High-Earning NRI Circles', desc: 'Curated pool of top tier tech engineers, physicians, management consultants, and founders.' },
    faqs: [
      { q: 'How does Mannat verify NRI visa and work credentials?', a: 'We verify international university diplomas, corporate affiliations, and work authorization documentation.' },
      { q: 'Can families in India initiate matches with candidates living abroad?', a: 'Yes. Our platform and concierge seamlessly coordinate family-to-family discussions across time zones.' }
    ]
  },
  {
    slug: 'usa-nri-matrimony',
    title: 'USA NRI Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified USA NRI Matrimony for Indian Tech & Medical Leaders',
    eyebrow: 'Silicon Valley · New York · Seattle · Texas · Chicago',
    description: 'Premier matchmaking for Indian H-1B, Green Card, and US Citizen professionals across California, New York, Texas, Washington, and New Jersey.',
    keywordFocus: 'USA NRI matrimony, Indian matrimony USA, Silicon Valley Indian matchmaking, US Green Card matrimony',
    communityTag: 'San Francisco · NYC · Seattle · Dallas · Austin · Chicago',
    countBadge: '1,650+ Verified US Profiles',
    introText: 'Connecting accomplished US-based Indian software architects, FAANG leaders, physicians, and finance professionals with cultured families.',
    pillar1: { title: 'Visa & Residency Verification', desc: 'Authenticated H-1B, L-1, Green Card, and US Citizenship status.' },
    pillar2: { title: 'Top US University Pedigree', desc: 'Stanford, MIT, Harvard, Columbia, CMU, UC Berkeley alumni network.' },
    pillar3: { title: 'US Timezone Coordination', desc: 'Dedicated managers working across EST and PST timezones.' },
    faqs: [
      { q: 'Are US compensation figures and company roles verified?', a: 'We authenticate professional LinkedIn credentials, corporate email domains, and educational degrees.' }
    ]
  },
  {
    slug: 'uk-nri-matrimony',
    title: 'UK NRI Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified UK NRI Matrimony for British Indian Families',
    eyebrow: 'London · Birmingham · Manchester · Leicester · Edinburgh',
    description: 'Exclusive matchmaking for British Indian doctors, NHS consultants, Canary Wharf bankers, and entrepreneurs across the United Kingdom.',
    keywordFocus: 'UK NRI matrimony, British Indian matrimony, London Indian matchmaking, NHS doctors matrimony UK',
    communityTag: 'London · Birmingham · Leicester · Manchester · Leeds',
    countBadge: '820+ Verified UK Profiles',
    introText: 'Connecting distinguished British Indian families with high-achieving professionals rooted in heritage and mutual lifestyle expectations.',
    pillar1: { title: 'British Citizenship & ILR Verification', desc: 'Authentication of UK residency and professional registration (GMC, SRA, ICAEW).' },
    pillar2: { title: 'Cultural Heritage Alignment', desc: 'Punjabi, Gujarati, South Indian, and Bengali communities in the UK.' },
    pillar3: { title: 'Zero Public Search Indexing', desc: 'BlurShield™ guarantees complete candidate privacy.' },
    faqs: [
      { q: 'Do you verify GMC registration for UK doctors?', a: 'Yes, medical council registration and hospital credentials are independently verified.' }
    ]
  },
  {
    slug: 'canada-nri-matrimony',
    title: 'Canada NRI Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Canada NRI Matrimony for Indian Professionals',
    eyebrow: 'Toronto (GTA) · Vancouver · Calgary · Montreal · Ottawa',
    description: 'Private matchmaking for Canadian PR and Citizen tech executives, healthcare workers, and entrepreneurs across Ontario, BC, and Alberta.',
    keywordFocus: 'Canada NRI matrimony, Indian matrimony Toronto, Punjabi matrimony Canada, Canadian PR matrimony',
    communityTag: 'Toronto · Vancouver · Calgary · Edmonton · Montreal',
    countBadge: '930+ Verified Canada Profiles',
    introText: 'Connecting established Indo-Canadian families with accomplished professionals seeking life partners with shared cultural values.',
    pillar1: { title: 'PR & Canadian Citizenship Verified', desc: 'Clear proof of Canadian permanent residency and citizenship.' },
    pillar2: { title: 'High Punjabi, Gujarati & South Indian Community Presence', desc: 'Active circles across Greater Toronto Area and Metro Vancouver.' },
    pillar3: { title: 'Direct WhatsApp Family Dossiers', desc: 'Facilitating discussions between parents in India and candidates in Canada.' },
    faqs: [
      { q: 'How do you assist parents living in India with candidates in Canada?', a: 'We coordinate virtual family meetings and provide complete vetted biodata dossiers.' }
    ]
  },
  {
    slug: 'australia-nri-matrimony',
    title: 'Australia NRI Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Australia NRI Matrimony for Indian Families',
    eyebrow: 'Sydney · Melbourne · Brisbane · Perth · Adelaide',
    description: 'Curated matchmaking for Australian PR & Citizen engineers, finance professionals, and doctors across NSW, Victoria, and Queensland.',
    keywordFocus: 'Australia NRI matrimony, Indian matrimony Sydney, Indian matchmaking Melbourne, Australian PR matrimony',
    communityTag: 'Sydney · Melbourne · Brisbane · Perth',
    countBadge: '520+ Verified Australia Profiles',
    introText: 'Serving progressive Indian families in Australia seeking intellectually compatible, values-aligned life partners.',
    pillar1: { title: 'Australian PR & Citizenship Verification', desc: 'Validated residency credentials.' },
    pillar2: { title: 'AEST / AEDT Timezone Support', desc: 'Dedicated coordination aligned with Australian working hours.' },
    pillar3: { title: 'BlurShield™ Privacy', desc: 'Portraits remain protected from web crawlers.' },
    faqs: [
      { q: 'Which Australian cities have the most candidates?', a: 'Sydney, Melbourne, Brisbane, and Perth.' }
    ]
  },
  {
    slug: 'dubai-nri-matrimony',
    title: 'Dubai & Gulf NRI Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Dubai & Gulf NRI Matrimony',
    eyebrow: 'Dubai · Abu Dhabi · Doha · Riyadh · Muscat · Bahrain',
    description: 'Exclusive matchmaking for prominent Indian business owners, C-suite executives, and corporate leaders across the UAE and GCC.',
    keywordFocus: 'Dubai NRI matrimony, UAE Indian matrimony, Gulf NRI matchmaking, Golden Visa Indian matrimony',
    communityTag: 'Dubai · Abu Dhabi · Sharjah · Doha · Riyadh',
    countBadge: '760+ Verified Gulf Profiles',
    introText: 'Connecting established Gulf NRI business dynasties, Golden Visa holders, and senior professionals with verified families in India and worldwide.',
    pillar1: { title: 'UAE Golden Visa & Executive Verification', desc: 'Authentication of business trade licenses and corporate seniority.' },
    pillar2: { title: 'Strong Sindhi, Marwari, Gujarati & Kerala Circles', desc: 'Established community networks across Dubai and Abu Dhabi.' },
    pillar3: { title: 'High-Touch Concierge Service', desc: 'VIP relationship managers conducting private introductions.' },
    faqs: [
      { q: 'Do you cater to UAE Golden Visa holders?', a: 'Yes, our Gulf network includes prominent entrepreneurs, doctors, and executive Golden Visa holders.' }
    ]
  },

  // ==========================================
  // 3. METROS & REGIONAL HUBS
  // ==========================================
  {
    slug: 'delhi-matrimony',
    title: 'Delhi NCR Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Elite Delhi NCR Matrimony for Established Families',
    eyebrow: 'South Delhi · Gurgaon · Noida · West Delhi · Civil Lines',
    description: 'Discreet, verified matchmaking for distinguished Delhi NCR business families, bureaucrats, lawyers, and corporate leaders. 100% verified biodatas.',
    keywordFocus: 'Delhi matrimony, South Delhi matrimony, Gurgaon elite matchmaking, Noida verified matrimony, Delhi NCR matrimony',
    communityTag: 'South Delhi · Gurgaon Golf Course Rd · Greater Kailash · Civil Lines',
    countBadge: '1,850+ Verified Profiles',
    introText: 'Mannat caters to prominent families in South Delhi, Gurgaon Golf Course Road, Lutyens Zone, and upscale NCR enclaves seeking culturally refined matches.',
    pillar1: { title: 'Hyper-Local NCR Lineage Vetting', desc: 'Rigorous vetting of family standing, business registries, and property/educational credentials.' },
    pillar2: { title: 'Private Relationship Managers', desc: 'Experienced matrimonial advisors based in Delhi NCR who facilitate discreet introductory meetings.' },
    pillar3: { title: 'BlurShield™ Elite Security', desc: 'Full image blurring and phone number masking to ensure complete peace of mind for high-profile families.' },
    faqs: [
      { q: 'Which Delhi NCR areas are most active on Mannat?', a: 'Greater Kailash, Vasant Vihar, Golf Course Road Gurgaon, Shanti Niketan, Defence Colony, and Sector 15 Noida.' }
    ]
  },
  {
    slug: 'mumbai-matrimony',
    title: 'Mumbai Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Curated Mumbai Matrimony for Sophisticated Families',
    eyebrow: 'South Mumbai · Bandra · Juhu · Powai · Thane',
    description: 'Confidential matchmaking for South Bombay industrialists, Bollywood creative leaders, investment bankers, and business dynasties.',
    keywordFocus: 'Mumbai matrimony, South Bombay matchmaking, Bandra matrimony, Juhu verified matrimony, Mumbai elite matrimony',
    communityTag: 'South Mumbai · BKC · Bandra · Juhu · Worli',
    countBadge: '1,620+ Verified Profiles',
    introText: 'Designed for Mumbai’s fast-paced yet traditional elite. Connecting C-suite executives, chartered accountants, and heritage business families.',
    pillar1: { title: 'Financial & Professional Due Diligence', desc: 'Verification of university credentials, professional registries (ICAI, Bar Council), and corporate standing.' },
    pillar2: { title: 'Lifestyle & Urban Compatibility', desc: 'Intelligent matching based on lifestyle preferences, intellectual wavelength, and modern values.' },
    pillar3: { title: 'Zero Public Search Engine Indexing', desc: 'Candidate profiles and portraits remain 100% confidential behind secure BlurShield™ layers.' },
    faqs: [
      { q: 'Does Mannat cater to South Mumbai and Bandra business families?', a: 'Yes, we have an extensive network of Marwari, Gujarati, Parsi, Sindhi, and Maharashtrian business families across MMR.' }
    ]
  },
  {
    slug: 'matchmaking-bangalore',
    title: 'Bangalore Matchmaking & Matrimony | Mannat Matrimony',
    h1: 'Verified Bangalore Matchmaking for Tech Leaders & Founders',
    eyebrow: 'Indiranagar · Koramangala · Whitefield · Sadashivanagar',
    description: 'High-caliber matchmaking for Bangalore tech founders, FAANG software architects, venture capitalists, and legacy families. 100% verified profiles.',
    keywordFocus: 'Bangalore matrimony, tech matrimony Bangalore, startup founder matrimony, Koramangala matchmaking, Indiranagar matrimony',
    communityTag: 'Koramangala · Indiranagar · Lavelle Road · Whitefield',
    countBadge: '1,420+ Verified Profiles',
    introText: 'Built for Bangalore’s intellectual and entrepreneurial leaders who value transparency, privacy, and genuine compatibility over outdated matrimony sites.',
    pillar1: { title: 'Startup Founders & Tech Leaders', desc: 'Connecting engineers, VCs, product managers, and founders with shared intellectual interests.' },
    pillar2: { title: 'Vetted Higher Education', desc: 'Verified alumni of IIT, IIM, IISc, BITS Pilani, Stanford, and Ivy League universities.' },
    pillar3: { title: 'Modern Privacy Architecture', desc: 'Photos and contact numbers remain completely hidden until both parties accept an introduction.' },
    faqs: [
      { q: 'How does Bangalore matchmaking work on Mannat?', a: 'Candidates create a verified profile. Our algorithms and relationship managers curate matches matching intellectual and cultural wavelengths.' }
    ]
  },
  {
    slug: 'hyderabad-matrimony',
    title: 'Hyderabad Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Hyderabad Matrimony for Distinguished Families',
    eyebrow: 'Jubilee Hills · Banjara Hills · Gachibowli · Hitec City',
    description: 'Curated matchmaking for Hyderabad Reddy, Kamma, Arya Vysya, and Brahmin families, pharmaceutical leaders, and global NRI software executives.',
    keywordFocus: 'Hyderabad matrimony, Jubilee Hills matchmaking, Banjara Hills matrimony, Telugu matrimony Hyderabad',
    communityTag: 'Jubilee Hills · Banjara Hills · Madhapur · Gachibowli',
    countBadge: '1,310+ Verified Profiles',
    introText: 'Serving prominent Hyderabadi industrial families, tech pioneers in Hitec City, and global US NRI Telugu candidates with verified background credentials.',
    pillar1: { title: 'Telugu Heritage & Jathakam Alignment', desc: 'Vedic Telugu horoscope matching with Gothram compatibility checks.' },
    pillar2: { title: 'Global US NRI Cross-Connection', desc: 'Direct access to verified Telugu tech professionals and physicians across Silicon Valley and Texas.' },
    pillar3: { title: 'Dignified Discretion & Security', desc: 'BlurShield™ protection ensuring portraits remain protected from public crawlers.' },
    faqs: [
      { q: 'Which Hyderabad communities are active?', a: 'Reddy, Kamma, Arya Vysya, Brahmin, and Telugu corporate and medical leaders.' }
    ]
  },
  {
    slug: 'pune-matrimony',
    title: 'Pune Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Pune Matrimony for Intellectual & Industrial Families',
    eyebrow: 'Koregaon Park · Prabhat Road · Kalyani Nagar · Baner',
    description: 'High-touch matchmaking for Maratha, Brahmin, and industrialist business families across Pune. 100% verified educational and family backgrounds.',
    keywordFocus: 'Pune matrimony, Maratha matrimony Pune, Brahmin matrimony Pune, Koregaon Park matchmaking',
    communityTag: 'Koregaon Park · Prabhat Road · Kalyani Nagar · Aundh · Baner',
    countBadge: '980+ Verified Profiles',
    introText: 'Bridging Pune’s rich cultural legacy with modern innovation for manufacturing leaders, IT directors, and academic families.',
    pillar1: { title: 'Vedic Patrika Gun Milan', desc: 'Accurate horoscope matching and Gun Milan calculations aligned with Maharashtra traditions.' },
    pillar2: { title: 'Verified Educational Pedigree', desc: 'Authentication of top engineering, medical, and management credentials.' },
    pillar3: { title: 'Elder-Centric WhatsApp Sharing', desc: 'Instant generation of elegant biodata PDFs for family elders.' },
    faqs: [
      { q: 'Does Mannat serve both traditional and modern Pune families?', a: 'Yes, we curate profiles for traditional industrial lineages as well as modern IT and medical professionals.' }
    ]
  },
  {
    slug: 'chandigarh-matrimony',
    title: 'Chandigarh & Punjab Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Chandigarh & Punjab Matrimony for Elite Families',
    eyebrow: 'Sector 8, 9, 10 · Mohali · Panchkula · Ludhiana · Jalandhar',
    description: 'Curated matchmaking for prestigious Punjabi Arora, Khatri, Jat Sikh, and business families across Chandigarh Tricity and Punjab.',
    keywordFocus: 'Chandigarh matrimony, Tricity matchmaking, Ludhiana elite matrimony, Punjab verified matrimony',
    communityTag: 'Chandigarh Sector 9 · Mohali · Panchkula · Ludhiana',
    countBadge: '890+ Verified Profiles',
    introText: 'Connecting distinguished land-owning, industrial, and civil service families in Chandigarh with verified global profiles.',
    pillar1: { title: 'Deep Punjab & NRI Connections', desc: 'Seamless matches between Chandigarh Tricity and Canada/UK/USA NRI families.' },
    pillar2: { title: 'Agricultural & Business Land Holding Checks', desc: 'Clear background transparency for prestigious lineages.' },
    pillar3: { title: 'BlurShield™ Photo Security', desc: 'Full image protection until mutual interest is confirmed.' },
    faqs: [
      { q: 'Do you cover Ludhiana, Jalandhar, and Amritsar?', a: 'Yes, our network spans across Punjab and the Chandigarh Tricity region.' }
    ]
  },
  {
    slug: 'kolkata-matrimony',
    title: 'Kolkata Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Kolkata Matrimony for Cultured & Business Families',
    eyebrow: 'Alipore · Ballygunge · Salt Lake · New Town',
    description: 'High-caliber matchmaking for Bengali intellectuals, Marwari business houses, and corporate leaders across Kolkata.',
    keywordFocus: 'Kolkata matrimony, Alipore Marwari matchmaking, Ballygunge Bengali matrimony, verified Kolkata biodatas',
    communityTag: 'Alipore · Ballygunge · Salt Lake · Southern Avenue',
    countBadge: '780+ Verified Profiles',
    introText: 'Serving prominent Marwari business houses and respected Bengali intellectual families in Kolkata.',
    pillar1: { title: 'Cultural & Business Harmony', desc: 'Understanding the unique balance of tradition and intellect in Kolkata.' },
    pillar2: { title: 'Koshthi & Kundali Compatibility', desc: 'Accurate Vedic astrological matching.' },
    pillar3: { title: 'Discreet Private Introductions', desc: 'Ensuring total confidentiality for high-profile families.' },
    faqs: [
      { q: 'Which communities in Kolkata use Mannat?', a: 'Marwari industrial families and Bengali Brahmin, Baidya, and Kayastha professionals.' }
    ]
  },
  {
    slug: 'chennai-matrimony',
    title: 'Chennai Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Chennai Matrimony for Distinguished Families',
    eyebrow: 'Boat Club · Poes Garden · Adyar · Anna Nagar · Besant Nagar',
    description: 'Premier matchmaking for Chennai Iyer, Iyengar, Chettiar, Mudaliar, and industrialist families. 100% verified credentials.',
    keywordFocus: 'Chennai matrimony, Boat Club matchmaking, Tamil Brahmin matrimony Chennai, verified Chennai biodatas',
    communityTag: 'Boat Club · Poes Garden · Adyar · Anna Nagar',
    countBadge: '910+ Verified Profiles',
    introText: 'Connecting heritage family businesses, automotive leaders, doctors, and tech pioneers across Chennai and overseas.',
    pillar1: { title: 'Jathagam & 10 Poruthams Analysis', desc: 'Precision Tamil astrological compatibility checks.' },
    pillar2: { title: 'Verified Educational Credentials', desc: 'IIT Madras, Anna University, and global university alumni verification.' },
    pillar3: { title: 'BlurShield™ Photo Security', desc: 'Zero public indexing of candidate photographs.' },
    faqs: [
      { q: 'How does Mannat verify candidate backgrounds in Chennai?', a: 'Degree certificates, employer verifications, and family references are authenticated.' }
    ]
  },
  {
    slug: 'jaipur-matrimony',
    title: 'Jaipur & Rajasthan Matrimony Verified Profiles | Mannat Matrimony',
    h1: 'Verified Jaipur & Rajasthan Matrimony for Prestigious Families',
    eyebrow: 'C-Scheme · Civil Lines · Raja Park · Mansarovar',
    description: 'Curated matchmaking for Rajput nobility, Marwari business owners, Agarwal, Maheshwari, and Brahmin families across Rajasthan.',
    keywordFocus: 'Jaipur matrimony, Rajasthan matchmaking, C-Scheme elite matrimony, Marwari matrimony Jaipur',
    communityTag: 'C-Scheme · Civil Lines · Malviya Nagar · Vaishali Nagar',
    countBadge: '720+ Verified Profiles',
    introText: 'Preserving regal heritage and business pride with verified matrimonial introductions across Rajasthan.',
    pillar1: { title: 'Lineage & Kuldevi Verification', desc: 'Detailed Gotra, Kul, and heritage validation.' },
    pillar2: { title: 'Kundli Milan & Gun Analysis', desc: '36-point Gun Milan and horoscope alignment.' },
    pillar3: { title: 'Concierge Family Meetings', desc: 'Discreet introductory coordination for family elders.' },
    faqs: [
      { q: 'Which Rajasthan cities are covered?', a: 'Jaipur, Jodhpur, Udaipur, Kota, Bikaner, and Bhilwara.' }
    ]
  },

  // ==========================================
  // 4. ELITE PROFESSIONS & WEALTH
  // ==========================================
  {
    slug: 'elite-matrimony',
    title: 'Elite Matrimony for Ultra HNW & Business Families | Mannat',
    h1: 'Bespoke Elite Matrimony for Distinguished Families',
    eyebrow: 'Ultra HNI · Industrial Dynasties · Global C-Suite',
    description: 'India’s most confidential matrimonial concierge for ultra-high-net-worth families, prominent founders, and international executives. Invitation-only curation.',
    keywordFocus: 'Elite matrimony, luxury matchmaking India, HNI matrimony, ultra high net worth matchmaking, bespoke matrimonial concierge',
    communityTag: 'Net Worth ₹15Cr+ · Industrial Dynasties · Global Founders',
    countBadge: '500+ Curated Elite Lineages',
    introText: 'Mannat Elite is a private membership tier reserved for influential families who require absolute discretion, background vetting, and high-touch concierge matchmaking.',
    pillar1: { title: 'Private Relationship Director', desc: 'A dedicated matchmaking director who manages family introductions with total privacy.' },
    pillar2: { title: 'Offline & Air-Gapped Curation', desc: 'Option for profiles to remain completely off digital discovery and handled solely through private dossiers.' },
    pillar3: { title: 'Lifestyle & Vision Alignment', desc: 'Ensuring shared financial wavelength, cultural heritage, and intellectual compatibility.' },
    faqs: [
      { q: 'What is the eligibility for Mannat Elite membership?', a: 'Mannat Elite is designed for established business families, founders, and C-level executives.' },
      { q: 'Can my profile remain completely hidden from other users?', a: 'Yes. Elite members can choose our 100% confidential offline curation option.' }
    ]
  },
  {
    slug: 'matrimony-for-doctors',
    title: 'Matrimony for Doctors & Medical Specialists | Mannat',
    h1: 'Verified Matrimony for Doctors & Healthcare Leaders',
    eyebrow: 'MBBS · MD · MS · DM · MCh · USMLE · NHS Consultants',
    description: 'Private matrimonial matching for physicians, surgeons, medical specialists, and hospital founders across India, USA, UK, and Australia. 100% NMC/GMC verified.',
    keywordFocus: 'Doctor matrimony, matrimony for doctors, MD MS doctor matrimony, surgeon matrimony, medical specialist matchmaking',
    communityTag: 'MBBS · MD · MS · DM · MCh · USMLE · FRCS',
    countBadge: '1,150+ Verified Doctors',
    introText: 'Created specifically for doctors who need a partner understanding the demands, dedication, and lifestyle of the medical profession.',
    pillar1: { title: 'Medical License & Degree Verification', desc: 'Mandatory verification of NMC registration, medical council credentials, and hospital affiliations.' },
    pillar2: { title: 'Specialty & Career Alignment', desc: 'Filter by medical specialty (Cardiology, Surgery, Radiology, Oncology, Dermatology) and practice location.' },
    pillar3: { title: 'Global Medical Opportunities', desc: 'Active network of USMLE / Residency physicians in the US, NHS consultants in the UK, and Gulf specialists.' },
    faqs: [
      { q: 'How does Mannat verify medical credentials?', a: 'We cross-verify National Medical Commission (NMC), GMC, and state medical council registration numbers.' },
      { q: 'Can doctors specify partner profession preferences?', a: 'Yes. Many doctors choose matches with fellow doctors, while others prefer corporate or creative leaders.' }
    ]
  },
  {
    slug: 'iit-iim-matrimony',
    title: 'IIT & IIM Alumni Matrimony | Mannat Matrimony',
    h1: 'Verified Matrimony for IIT, IIM & Ivy League Alumni',
    eyebrow: 'IIT · IIM · BITS · ISB · Stanford · MIT · Harvard',
    description: 'High-intellect matchmaking for graduates of premier engineering and management institutes. Connect with intellectually compatible life partners.',
    keywordFocus: 'IIT matrimony, IIM matrimony, IIT IIM matchmaking, Ivy League Indian matrimony, tech executive matrimony',
    communityTag: 'IIT · IIM · BITS Pilani · ISB · Ivy League Alumni',
    countBadge: '2,100+ Verified Alumni',
    introText: 'Where intellectual curiosity meets family tradition. Mannat connects alumni of India’s and the world’s top tier institutions who seek an equal partner in life.',
    pillar1: { title: 'Degree Certificate Verification', desc: 'Direct verification of university diplomas, alumni registries, and professional roles.' },
    pillar2: { title: 'Intellectual & Career Ambition Alignment', desc: 'Match with partners who appreciate high-growth careers, innovation, and balanced lives.' },
    pillar3: { title: 'Privacy & BlurShield™ Security', desc: 'Profiles are protected from public search indexing and workplace colleagues.' },
    faqs: [
      { q: 'Which institutes are included in the premier alumni network?', a: 'IITs, IIMs, BITS Pilani, ISB, IISc, AIIMS, Stanford, MIT, Harvard, Columbia, and Cambridge.' },
      { q: 'How do you verify alumni status?', a: 'We verify official institute email addresses, degree certificates, and LinkedIn alumni profiles.' }
    ]
  },
  {
    slug: 'ca-finance-matrimony',
    title: 'CA & Investment Banker Matrimony | Mannat Matrimony',
    h1: 'Verified Matrimony for Chartered Accountants & Finance Leaders',
    eyebrow: 'ICAI CAs · CFA · Investment Bankers · PE & VC Partners',
    description: 'Exclusive matchmaking for Chartered Accountants, CFOs, Private Equity directors, and investment bankers. 100% ICAI verified credentials.',
    keywordFocus: 'CA matrimony, Chartered Accountant matrimony, Investment banker matrimony, CFA matchmaking India',
    communityTag: 'CA · CFA · Investment Banking · PE / VC Partners',
    countBadge: '1,280+ Verified Finance Leaders',
    introText: 'Connecting accomplished finance professionals who appreciate fiscal acumen, career ambition, and family heritage.',
    pillar1: { title: 'ICAI & CFA Verification', desc: 'Direct authentication of ICAI membership numbers and professional designations.' },
    pillar2: { title: 'Shared Ambition & Lifestyle', desc: 'Connecting partners with aligned financial perspectives and lifestyle goals.' },
    pillar3: { title: 'BlurShield™ Discretion', desc: 'Total privacy for high-profile corporate leaders.' },
    faqs: [
      { q: 'Are ICAI membership numbers verified?', a: 'Yes, ICAI active registry records and credentials are authenticated.' }
    ]
  },
  {
    slug: 'ias-ips-civil-services-matrimony',
    title: 'IAS, IPS & Civil Services Matrimony | Mannat Matrimony',
    h1: 'Verified Matrimony for IAS, IPS, IFS & Bureaucratic Families',
    eyebrow: 'UPSC · IAS · IPS · IFS · IRS · Judiciary · State PCS',
    description: 'Confidential matchmaking for UPSC civil servants, diplomats, judges, and bureaucratic lineages across India. 100% verified service credentials.',
    keywordFocus: 'IAS matrimony, IPS matrimony, civil services matrimony, UPSC officer matchmaking, bureaucrat matrimony',
    communityTag: 'IAS · IPS · IFS · IRS · State Civil Services · Judicial Officers',
    countBadge: '480+ Verified Officers',
    introText: 'A secure, dignified sanctuary for civil servants and administrative leaders who require absolute discretion, security, and cultural alignment.',
    pillar1: { title: 'Cadre & Service Verification', desc: 'Authentication of UPSC batch, cadre allocation, and official status.' },
    pillar2: { title: 'Cadre Compatibility & Transfer Realities', desc: 'Matching partners understanding the lifestyle and responsibilities of public governance.' },
    pillar3: { title: 'Ultra-Secure Discretion', desc: 'BlurShield™ security and private offline dossier options.' },
    faqs: [
      { q: 'How does Mannat protect the privacy of civil servants?', a: 'Official designations and contact details are never shared without explicit mutual consent.' }
    ]
  },

  // ==========================================
  // 5. HIGH-INTENT UTILITIES & LIFE STAGE
  // ==========================================
  {
    slug: 'marriage-biodata-maker',
    title: 'Free Marriage Biodata Maker Online (PDF Download) | Mannat Matrimony',
    h1: 'Create Luxury Marriage Biodata in 2 Minutes (Free PDF)',
    eyebrow: 'Free Tool · 4 Luxury Themes · Instant WhatsApp & Print PDF',
    description: 'Create elegant, professional marriage biodatas in English & Hindi. Choose royal themes, add photo & horoscope details, and download instant high-resolution PDF for free.',
    keywordFocus: 'marriage biodata maker, biodata for marriage, marriage biodata format, free marriage biodata pdf, marriage biodata creator',
    communityTag: 'Free Tool · Instant PDF Download · WhatsApp Ready',
    countBadge: '50,000+ Biodatas Created',
    introText: 'Make an unforgettable first impression on family elders. Our free Marriage Biodata Maker formats your personal background, education, horoscope, and family details into a stunning, printable PDF in minutes.',
    pillar1: { title: 'Instant PDF & Print Ready', desc: 'Download crystal-clear A4 PDF formatted perfectly for printing and WhatsApp sharing.' },
    pillar2: { title: 'Royal Luxury Templates', desc: 'Choose from Royal Gold, Emerald Elite, Rose Blossom, and Minimalist Platinum designs.' },
    pillar3: { title: '100% Free & Private', desc: 'No account required to generate and download your biodata. Your details stay on your device.' },
    faqs: [
      { q: 'Is the Marriage Biodata Maker completely free?', a: 'Yes! You can create, preview, customize, and download unlimited marriage biodata PDFs for free.' },
      { q: 'What details should be included in a matrimonial biodata?', a: 'Personal info (Name, DOB, Height), Education & Career, Family Background (Parents, Siblings), Horoscope/Kundali details, and Contact info.' },
      { q: 'Can I share the downloaded biodata directly on WhatsApp?', a: 'Yes, the downloaded PDF and image formats are optimized for crisp viewing on mobile devices and WhatsApp.' }
    ],
    isTool: true
  },
  {
    slug: 'kundali-matching-matrimony',
    title: 'Kundali Matching for Marriage (36 Gun Milan) | Mannat Matrimony',
    h1: 'Vedic Kundali Matching & 36 Gun Milan for Matrimony',
    eyebrow: 'Vedic Astrology · Ashtakoot Milan · Manglik Dosha Analysis',
    description: 'Accurate 36 Gun Milan horoscope matching for marriage. Understand Ashtakoot compatibility (Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi) and Manglik Dosha.',
    keywordFocus: 'Kundali matching, 36 gun milan for marriage, horoscope matching matrimony, manglik dosha check, ashtakoot guna milan',
    communityTag: '36 Gun Milan · Vedic Astrological Analysis · Dosha Checks',
    countBadge: 'Instant Compatibility Analysis',
    introText: 'Vedic horoscope matching has guided Indian marriages for millennia. Mannat’s Kundali Milan system provides comprehensive Ashtakoot analysis alongside modern lifestyle alignment.',
    pillar1: { title: '36 Gun Milan Breakdown', desc: 'Complete score analysis across all 8 Ashtakoot factors (Varna to Nadi).' },
    pillar2: { title: 'Manglik & Nadi Dosha Guidance', desc: 'Clear identification of Manglik status, Nadi Dosha, and traditional Vedic remedies.' },
    pillar3: { title: 'Holistic Compatibility Score', desc: 'Combining astrological harmony with education, career, and core values.' },
    faqs: [
      { q: 'How many Gunas are considered good for marriage?', a: '18 to 24 Gunas is considered average/acceptable, 25 to 32 is very good, and 33 to 36 is exceptional.' },
      { q: 'What is Nadi Dosha and how is it resolved?', a: 'Nadi Dosha accounts for 8 points. It assesses health and progeny compatibility. Remedies include specific pujas or partner Nakshatra exceptions.' },
      { q: 'Does Mannat automatically calculate Kundli compatibility?', a: 'Yes, members can view instant Gun Milan scores when reviewing verified profiles.' }
    ]
  },
  {
    slug: '30-plus-matrimony',
    title: '30+ Matrimony for Accomplished Singles | Mannat Matrimony',
    h1: 'Verified Matrimony for 30+ & 35+ Accomplished Professionals',
    eyebrow: 'Mature Mindset · Emotional Maturity · Established Careers',
    description: 'Dignified, verified matchmaking for singles in their 30s and 40s who prioritized education, career, and personal growth. Zero stigma, 100% respect.',
    keywordFocus: '30 plus matrimony, late marriage matrimony, matrimony for 35 plus, mature singles matchmaking India',
    communityTag: 'Ages 30 to 45 · Established Professionals · Equal Partners',
    countBadge: '1,800+ Verified 30+ Profiles',
    introText: 'Finding love on your own terms. Mannat celebrates accomplished professionals who chose to marry when ready, connecting emotionally mature, ambitious singles.',
    pillar1: { title: 'Emotional & Lifestyle Maturity', desc: 'Conversations built on genuine intellectual depth, shared values, and mutual respect.' },
    pillar2: { title: 'Established Financial Independence', desc: 'Connecting career-driven individuals who value egalitarian, supportive partnerships.' },
    pillar3: { title: 'BlurShield™ Privacy Protection', desc: 'Keep your search discreet from workplace circles and casual onlookers.' },
    faqs: [
      { q: 'Is there active representation of singles in their 30s on Mannat?', a: 'Yes! Over 45% of our verified member base comprises professionals aged 29 to 42.' }
    ]
  },
  {
    slug: 'second-marriage-divorced-matrimony',
    title: 'Second Marriage & Divorced Matrimony | Mannat Matrimony',
    h1: 'Dignified Second Marriage & Divorced Matrimony',
    eyebrow: 'Fresh Beginnings · Empathetic & Confidential Matchmaking',
    description: 'Respectful, private matchmaking for divorced, widowed, and separated individuals seeking a meaningful second chapter. 100% legal document verification.',
    keywordFocus: 'Second marriage matrimony, divorced matrimony, remarriage matrimony India, verified divorced profiles',
    communityTag: 'Divorced · Widowed · Annulled · Fresh Starts',
    countBadge: '920+ Verified Profiles',
    introText: 'Everyone deserves a second chance at love and companionship. Mannat provides an empathetic, confidential sanctuary for verified remarriage profiles.',
    pillar1: { title: 'Legal & Marital Status Due Diligence', desc: 'Mandatory verification of divorce decrees or legal dissolution documents for complete transparency.' },
    pillar2: { title: 'Child Custody & Living Clarity', desc: 'Clear, transparent preferences regarding children, co-parenting, and future family plans.' },
    pillar3: { title: 'Zero Judgment, Total Privacy', desc: 'Strict BlurShield™ privacy controls and private introductory coordination.' },
    faqs: [
      { q: 'How does Mannat verify divorce status?', a: 'We require a copy of the legal divorce decree / mutual consent order before marking profiles verified.' }
    ]
  },
  {
    slug: 'verified-matrimony',
    title: '100% Verified Matrimony Profiles | Mannat Matrimony',
    h1: '100% Verified Matrimony Platform in India',
    eyebrow: 'Zero Fake Profiles · Multi-Point Identity & Degree Vetting',
    description: 'Experience genuine matchmaking with zero fake accounts, bots, or unverified bios. Government ID and education credential validation on every profile.',
    keywordFocus: 'Verified matrimony, safe matrimony app, genuine matrimonial site, scam-free Indian matrimony',
    communityTag: 'Multi-Point Vetted · Zero Bots · Trusted by 10,000+ Families',
    countBadge: '100% ID Verified Guarantee',
    introText: 'Say goodbye to unverified numbers, fake photos, and stale biodatas. Mannat is built from the ground up on identity security and authentic connections.',
    pillar1: { title: 'Government ID Validation', desc: 'Aadhaar, Passport, or PAN authentication required before account activation.' },
    pillar2: { title: 'University Degree Verification', desc: 'Cross-checking graduation credentials directly with accredited university registries.' },
    pillar3: { title: 'Active Human Moderation', desc: 'Dedicated safety team screening all photos, bios, and family backgrounds.' },
    faqs: [
      { q: 'How do I know a profile is truly verified?', a: 'Profiles on Mannat display a gold verified badge only after passing ID, phone, and credential checks.' }
    ]
  },
  {
    slug: 'photo-privacy-blurshield',
    title: 'Photo Privacy & BlurShield™ Matrimony | Mannat Matrimony',
    h1: 'Private Matrimony with BlurShield™ Photo Protection',
    eyebrow: 'Zero Public Search Indexing · Mutual Consent Photo Sharing',
    description: 'Protect your candidate portraits and personal identity from Google images, scraper bots, and casual browsing. You decide who sees your photos.',
    keywordFocus: 'Private matrimony, photo privacy matrimony app, blur photo matrimony, confidential Indian matchmaking',
    communityTag: 'BlurShield™ Technology · Anti-Screenshot · Mutual Consent',
    countBadge: '100% Private & Protected',
    introText: 'Your privacy is paramount. BlurShield™ ensures candidate portraits remain elegantly blurred until mutual family interest is accepted.',
    pillar1: { title: 'Zero Google Image Crawling', desc: 'Proprietary headers and canvas rendering prevent search engine bots from scraping photos.' },
    pillar2: { title: 'Granular Access Controls', desc: 'Grant photo reveal permissions individually with one tap, and revoke anytime.' },
    pillar3: { title: 'Protected Contact Coordinates', desc: 'Phone numbers and email addresses are never displayed publicly.' },
    faqs: [
      { q: 'Can search engines like Google index my matrimonial photos?', a: 'Never. Our BlurShield™ architecture strictly blocks crawlers and indexes only curated text.' }
    ]
  }
];

// Helper to generate schema
function generateSchema(p) {
  const isTool = p.isTool;
  const canonical = `https://mannatmatrimony.com/${p.slug}`;
  
  const baseSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mannatmatrimony.com/" },
        { "@type": "ListItem", "position": 2, "name": p.h1, "item": canonical }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": p.faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": isTool ? "SoftwareApplication" : "Service",
      "name": p.title,
      "serviceType": "Matrimonial & Matchmaking Service",
      "provider": {
        "@type": "Organization",
        "name": "Mannat Matrimony",
        "url": "https://mannatmatrimony.com",
        "logo": "https://mannatmatrimony.com/favicon.png",
        "telephone": "+91-97383-97933",
        "sameAs": [
          "https://instagram.com/mannatmatrimony",
          "https://facebook.com/mannatmatrimony",
          "https://linkedin.com/company/mannatmatrimony"
        ]
      },
      "areaServed": ["India", "United States", "United Kingdom", "Canada", "United Arab Emirates", "Australia"],
      "description": p.description,
      "url": canonical
    }
  ];

  if (isTool) {
    baseSchemas.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Create a Marriage Biodata Online",
      "step": [
        { "@type": "HowToStep", "name": "Enter Personal & Family Details", "text": "Fill in your basic information, education, profession, family background, and horoscope details." },
        { "@type": "HowToStep", "name": "Choose a Luxury Theme", "text": "Select from Royal Gold, Emerald Elite, Rose Blossom, or Minimalist Platinum styles." },
        { "@type": "HowToStep", "name": "Download PDF Instantly", "text": "Click Download PDF to get a print-ready, high-resolution A4 document optimized for WhatsApp sharing." }
      ]
    });
  }

  return baseSchemas.map(s => `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`).join('\n');
}

// Generate interactive biodata maker HTML if page is tool
function generateToolContent() {
  return `
  <!-- BIODATA MAKER INTERACTIVE TOOL COMPONENT -->
  <section class="biodata-builder-section" id="builder">
    <div class="container">
      <div class="builder-grid">
        <!-- FORM PANEL -->
        <div class="form-card">
          <div class="form-card-header">
            <h3><span class="gold-icon">✍️</span> Enter Matrimonial Biodata Details</h3>
            <p>Your details are private and processed locally on your device.</p>
          </div>

          <form id="biodataForm" oninput="updateLivePreview()">
            <!-- Template Selector -->
            <div class="field-group">
              <label class="section-label">Select Luxury Theme</label>
              <div class="theme-selector-grid">
                <label class="theme-pill active"><input type="radio" name="theme" value="gold" checked onchange="changeTheme('gold')"> 👑 Royal Gold</label>
                <label class="theme-pill"><input type="radio" name="theme" value="emerald" onchange="changeTheme('emerald')"> 🌿 Emerald Elite</label>
                <label class="theme-pill"><input type="radio" name="theme" value="rose" onchange="changeTheme('rose')"> 🌸 Rose Blossom</label>
                <label class="theme-pill"><input type="radio" name="theme" value="platinum" onchange="changeTheme('platinum')"> 💎 Minimalist</label>
              </div>
            </div>

            <!-- 1. Personal Details -->
            <div class="field-group">
              <label class="section-label">1. Personal Information</label>
              <div class="input-grid">
                <div>
                  <label>Full Name *</label>
                  <input type="text" id="bioName" placeholder="e.g. Rohan Sharma" value="Rohan Sharma" required>
                </div>
                <div>
                  <label>Date of Birth / Age *</label>
                  <input type="text" id="bioDob" placeholder="e.g. 14 Oct 1996 (29 Yrs)" value="14 Oct 1996 (29 Yrs)">
                </div>
                <div>
                  <label>Height</label>
                  <input type="text" id="bioHeight" placeholder="e.g. 5 ft 11 in (180 cm)" value="5 ft 11 in">
                </div>
                <div>
                  <label>Religion & Caste</label>
                  <input type="text" id="bioCommunity" placeholder="e.g. Hindu - Brahmin (Gaur)" value="Hindu - Brahmin (Gaur)">
                </div>
                <div>
                  <label>Mother Tongue</label>
                  <input type="text" id="bioLanguage" placeholder="e.g. Hindi, English" value="Hindi, English">
                </div>
                <div>
                  <label>Current Location</label>
                  <input type="text" id="bioLocation" placeholder="e.g. South Delhi / Gurgaon" value="South Delhi">
                </div>
              </div>
            </div>

            <!-- 2. Education & Career -->
            <div class="field-group">
              <label class="section-label">2. Education & Career</label>
              <div class="input-grid">
                <div>
                  <label>Highest Qualification</label>
                  <input type="text" id="bioEducation" placeholder="e.g. B.Tech (IIT Delhi), MBA (IIM-A)" value="B.Tech (IIT Delhi)">
                </div>
                <div>
                  <label>Occupation / Role</label>
                  <input type="text" id="bioOccupation" placeholder="e.g. Senior Product Manager" value="Senior Product Manager">
                </div>
                <div>
                  <label>Company / Organization</label>
                  <input type="text" id="bioCompany" placeholder="e.g. Microsoft / Tech Startup" value="Microsoft India">
                </div>
                <div>
                  <label>Annual Income (Optional)</label>
                  <input type="text" id="bioIncome" placeholder="e.g. ₹35 - 40 LPA" value="₹38 LPA">
                </div>
              </div>
            </div>

            <!-- 3. Family Background -->
            <div class="field-group">
              <label class="section-label">3. Family Background</label>
              <div class="input-grid">
                <div>
                  <label>Father's Name & Occupation</label>
                  <input type="text" id="bioFather" placeholder="e.g. Dr. V. K. Sharma (Chief Medical Officer)" value="Dr. V. K. Sharma (Retd. CMO)">
                </div>
                <div>
                  <label>Mother's Name & Occupation</label>
                  <input type="text" id="bioMother" placeholder="e.g. Smt. Sunita Sharma (Homemaker)" value="Smt. Sunita Sharma (Homemaker)">
                </div>
                <div>
                  <label>Brothers & Sisters</label>
                  <input type="text" id="bioSiblings" placeholder="e.g. 1 Elder Sister (Married, CA in London)" value="1 Sister (Married, CA in London)">
                </div>
                <div>
                  <label>Family Type & Origin</label>
                  <input type="text" id="bioFamilyOrigin" placeholder="e.g. Nuclear Family · Native Jaipur" value="Nuclear Family · Native Jaipur">
                </div>
              </div>
            </div>

            <!-- 4. Horoscope & Kundali (Optional) -->
            <div class="field-group">
              <label class="section-label">4. Horoscope / Kundali (Optional)</label>
              <div class="input-grid">
                <div>
                  <label>Gotra</label>
                  <input type="text" id="bioGotra" placeholder="e.g. Bharadwaj (Self), Kaushik (Maternal)" value="Bharadwaj">
                </div>
                <div>
                  <label>Rashi & Nakshatra</label>
                  <input type="text" id="bioRashi" placeholder="e.g. Tula (Libra) · Swati Nakshatra" value="Tula · Swati Nakshatra">
                </div>
                <div>
                  <label>Manglik Status</label>
                  <input type="text" id="bioManglik" placeholder="e.g. Non-Manglik / Anshik Manglik" value="Non-Manglik">
                </div>
                <div>
                  <label>Time & Place of Birth</label>
                  <input type="text" id="bioBirthPlace" placeholder="e.g. 06:45 AM, New Delhi" value="06:45 AM, New Delhi">
                </div>
              </div>
            </div>

            <!-- 5. Contact Coordinates -->
            <div class="field-group">
              <label class="section-label">5. Contact Information</label>
              <div class="input-grid">
                <div>
                  <label>Primary Phone / WhatsApp *</label>
                  <input type="text" id="bioPhone" placeholder="e.g. +91 98765 43210 (Father)" value="+91 98765 43210">
                </div>
                <div>
                  <label>Contact Email</label>
                  <input type="email" id="bioEmail" placeholder="e.g. family.sharma@gmail.com" value="sharma.family@gmail.com">
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- LIVE PREVIEW & DOWNLOAD PANEL -->
        <div class="preview-panel">
          <div class="preview-toolbar">
            <span class="preview-status">✨ Live Preview (A4 Formatted)</span>
            <button class="btn btn-primary" onclick="downloadBiodataPDF()">
              <span>📥 Download High-Res PDF</span>
            </button>
          </div>

          <!-- THE BIODATA PAPER -->
          <div class="biodata-paper theme-gold" id="biodataPaper">
            <!-- Header Ornament -->
            <div class="paper-header">
              <div class="om-symbol">॥ श्री गणेशाय नमः ॥</div>
              <h2 id="prevName" class="prev-name">Rohan Sharma</h2>
              <div id="prevSubhead" class="prev-subhead">B.Tech (IIT Delhi) · Senior Product Manager</div>
            </div>

            <div class="paper-divider"></div>

            <!-- Personal Section -->
            <div class="paper-section">
              <div class="paper-section-title">Personal Details</div>
              <div class="paper-row"><span class="lbl">Date of Birth:</span><span class="val" id="prevDob">14 Oct 1996 (29 Yrs)</span></div>
              <div class="paper-row"><span class="lbl">Height:</span><span class="val" id="prevHeight">5 ft 11 in</span></div>
              <div class="paper-row"><span class="lbl">Community:</span><span class="val" id="prevCommunity">Hindu - Brahmin (Gaur)</span></div>
              <div class="paper-row"><span class="lbl">Mother Tongue:</span><span class="val" id="prevLanguage">Hindi, English</span></div>
              <div class="paper-row"><span class="lbl">Location:</span><span class="val" id="prevLocation">South Delhi</span></div>
            </div>

            <!-- Education & Career Section -->
            <div class="paper-section">
              <div class="paper-section-title">Education & Career</div>
              <div class="paper-row"><span class="lbl">Education:</span><span class="val" id="prevEducation">B.Tech (IIT Delhi)</span></div>
              <div class="paper-row"><span class="lbl">Profession:</span><span class="val" id="prevOccupation">Senior Product Manager</span></div>
              <div class="paper-row"><span class="lbl">Organization:</span><span class="val" id="prevCompany">Microsoft India</span></div>
              <div class="paper-row"><span class="lbl">Annual Income:</span><span class="val" id="prevIncome">₹38 LPA</span></div>
            </div>

            <!-- Family Details -->
            <div class="paper-section">
              <div class="paper-section-title">Family Details</div>
              <div class="paper-row"><span class="lbl">Father:</span><span class="val" id="prevFather">Dr. V. K. Sharma (Retd. CMO)</span></div>
              <div class="paper-row"><span class="lbl">Mother:</span><span class="val" id="prevMother">Smt. Sunita Sharma (Homemaker)</span></div>
              <div class="paper-row"><span class="lbl">Siblings:</span><span class="val" id="prevSiblings">1 Sister (Married, CA in London)</span></div>
              <div class="paper-row"><span class="lbl">Origin & Status:</span><span class="val" id="prevFamilyOrigin">Nuclear Family · Native Jaipur</span></div>
            </div>

            <!-- Horoscope Details -->
            <div class="paper-section">
              <div class="paper-section-title">Horoscope & Kundali</div>
              <div class="paper-row"><span class="lbl">Gotra:</span><span class="val" id="prevGotra">Bharadwaj</span></div>
              <div class="paper-row"><span class="lbl">Rashi / Nakshatra:</span><span class="val" id="prevRashi">Tula · Swati Nakshatra</span></div>
              <div class="paper-row"><span class="lbl">Manglik:</span><span class="val" id="prevManglik">Non-Manglik</span></div>
              <div class="paper-row"><span class="lbl">Birth Time & Place:</span><span class="val" id="prevBirthPlace">06:45 AM, New Delhi</span></div>
            </div>

            <!-- Contact Coordinates -->
            <div class="paper-section">
              <div class="paper-section-title">Contact Information</div>
              <div class="paper-row"><span class="lbl">Phone / WhatsApp:</span><span class="val" id="prevPhone">+91 98765 43210</span></div>
              <div class="paper-row"><span class="lbl">Email:</span><span class="val" id="prevEmail">sharma.family@gmail.com</span></div>
            </div>

            <!-- Footer Badge -->
            <div class="paper-footer">
              <span>Created with Mannat Matrimony · www.mannatmatrimony.com</span>
            </div>
          </div>

          <!-- PROMOTION CTA CARD -->
          <div class="biodata-mannat-cta">
            <h4>Ready to meet verified matches matching this biodata?</h4>
            <p>Skip unverified apps and fake profiles. Create your 100% ID-verified Mannat Profile with BlurShield™ privacy today.</p>
            <a href="https://mannatmatrimony.com/" class="btn btn-secondary">Create Free Verified Profile →</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <script>
    function updateLivePreview() {
      const getVal = (id, fallback) => document.getElementById(id)?.value || fallback;
      
      const name = getVal('bioName', 'Full Name');
      const edu = getVal('bioEducation', '');
      const occ = getVal('bioOccupation', '');
      
      document.getElementById('prevName').innerText = name;
      document.getElementById('prevSubhead').innerText = [edu, occ].filter(Boolean).join(' · ');
      
      document.getElementById('prevDob').innerText = getVal('bioDob', '-');
      document.getElementById('prevHeight').innerText = getVal('bioHeight', '-');
      document.getElementById('prevCommunity').innerText = getVal('bioCommunity', '-');
      document.getElementById('prevLanguage').innerText = getVal('bioLanguage', '-');
      document.getElementById('prevLocation').innerText = getVal('bioLocation', '-');

      document.getElementById('prevEducation').innerText = getVal('bioEducation', '-');
      document.getElementById('prevOccupation').innerText = getVal('bioOccupation', '-');
      document.getElementById('prevCompany').innerText = getVal('bioCompany', '-');
      document.getElementById('prevIncome').innerText = getVal('bioIncome', '-');

      document.getElementById('prevFather').innerText = getVal('bioFather', '-');
      document.getElementById('prevMother').innerText = getVal('bioMother', '-');
      document.getElementById('prevSiblings').innerText = getVal('bioSiblings', '-');
      document.getElementById('prevFamilyOrigin').innerText = getVal('bioFamilyOrigin', '-');

      document.getElementById('prevGotra').innerText = getVal('bioGotra', '-');
      document.getElementById('prevRashi').innerText = getVal('bioRashi', '-');
      document.getElementById('prevManglik').innerText = getVal('bioManglik', '-');
      document.getElementById('prevBirthPlace').innerText = getVal('bioBirthPlace', '-');

      document.getElementById('prevPhone').innerText = getVal('bioPhone', '-');
      document.getElementById('prevEmail').innerText = getVal('bioEmail', '-');
    }

    function changeTheme(themeName) {
      const paper = document.getElementById('biodataPaper');
      paper.className = 'biodata-paper theme-' + themeName;
      document.querySelectorAll('.theme-pill').forEach(p => p.classList.remove('active'));
      const activePill = document.querySelector('input[value="' + themeName + '"]')?.parentElement;
      if (activePill) activePill.classList.add('active');
    }

    function downloadBiodataPDF() {
      window.print();
    }
  </script>
  `;
}

// Generate the complete HTML page
function generateHtml(p) {
  const schemaHtml = generateSchema(p);
  const toolContent = p.isTool ? generateToolContent() : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.title}</title>
  <meta name="description" content="${p.description}">
  <meta name="keywords" content="${p.keywordFocus}">
  <link rel="canonical" href="https://mannatmatrimony.com/${p.slug}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">

  <!-- OpenGraph Meta Tags -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://mannatmatrimony.com/${p.slug}">
  <meta property="og:title" content="${p.title}">
  <meta property="og:description" content="${p.description}">
  <meta property="og:image" content="https://mannatmatrimony.com/og-image.jpg">
  <meta property="og:site_name" content="Mannat Matrimony">
  <meta property="og:locale" content="en_IN">

  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${p.title}">
  <meta name="twitter:description" content="${p.description}">
  <meta name="twitter:image" content="https://mannatmatrimony.com/og-image.jpg">

  <!-- Favicons -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <!-- Fonts & Core Styles -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-dark: #07090E;
      --bg-surface: #0E131F;
      --bg-card: rgba(18, 24, 38, 0.7);
      --gold-primary: #D4AF37;
      --gold-light: #F3E5AB;
      --gold-dark: #AA771C;
      --text-main: #F8FAFC;
      --text-muted: #94A3B8;
      --border-subtle: rgba(212, 175, 55, 0.2);
      --border-focus: rgba(212, 175, 55, 0.6);
      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 24px;
      --shadow-glow: 0 0 35px rgba(212, 175, 55, 0.15);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: 'Plus Jakarta Sans', sans-serif;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    a { color: inherit; text-decoration: none; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

    /* Header Nav */
    .site-nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(7, 9, 14, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-subtle);
      padding: 16px 0;
    }
    .nav-wrapper { display: flex; align-items: center; justify-content: space-between; }
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'Cinzel', serif;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 2px;
      color: var(--gold-light);
    }
    .brand-logo img { width: 32px; height: 32px; border-radius: 50%; }
    .nav-links { display: flex; align-items: center; gap: 24px; }
    .nav-links a { color: var(--text-muted); font-size: 14px; font-weight: 500; transition: color 0.2s; }
    .nav-links a:hover { color: var(--gold-light); }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 22px;
      border-radius: 9999px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .btn-primary {
      background: linear-gradient(135deg, var(--gold-light), var(--gold-primary), var(--gold-dark));
      color: #07090E;
      box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(212, 175, 55, 0.5);
    }
    .btn-secondary {
      background: rgba(212, 175, 55, 0.1);
      border: 1px solid var(--border-subtle);
      color: var(--gold-light);
    }
    .btn-secondary:hover {
      background: rgba(212, 175, 55, 0.2);
      border-color: var(--gold-primary);
    }

    /* Hero */
    .hero-section {
      padding: 80px 0 60px;
      background: radial-gradient(circle at 50% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 65%);
      text-align: center;
    }
    .eyebrow-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: rgba(212, 175, 55, 0.1);
      border: 1px solid var(--border-subtle);
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 1px;
      color: var(--gold-light);
      margin-bottom: 24px;
      text-transform: uppercase;
    }
    .hero-title {
      font-family: 'Cinzel', serif;
      font-size: clamp(32px, 5vw, 56px);
      font-weight: 700;
      line-height: 1.15;
      color: #FFF;
      margin-bottom: 20px;
      letter-spacing: -0.5px;
    }
    .hero-title .gold-accent {
      background: linear-gradient(135deg, var(--gold-light), var(--gold-primary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-subtitle {
      max-width: 760px;
      margin: 0 auto 36px;
      color: var(--text-muted);
      font-size: clamp(16px, 2vw, 18px);
      line-height: 1.7;
    }
    .hero-cta-group { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }

    /* Trust Stats */
    .stats-strip {
      padding: 40px 0;
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
      background: rgba(14, 19, 31, 0.4);
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 24px;
      text-align: center;
    }
    .stat-card h3 {
      font-family: 'Cinzel', serif;
      font-size: 32px;
      font-weight: 700;
      color: var(--gold-light);
      margin-bottom: 4px;
    }
    .stat-card p { font-size: 14px; color: var(--text-muted); }

    /* Pillars */
    .pillars-section { padding: 90px 0; }
    .section-header { text-align: center; max-width: 680px; margin: 0 auto 50px; }
    .section-header h2 {
      font-family: 'Cinzel', serif;
      font-size: 36px;
      color: #FFF;
      margin-bottom: 12px;
    }
    .section-header p { color: var(--text-muted); font-size: 16px; }

    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 30px;
    }
    .pillar-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 36px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    .pillar-card:hover {
      border-color: var(--border-focus);
      transform: translateY(-4px);
      box-shadow: var(--shadow-glow);
    }
    .pillar-icon {
      width: 48px;
      height: 48px;
      background: rgba(212, 175, 55, 0.15);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin-bottom: 20px;
    }
    .pillar-card h3 {
      font-family: 'Cinzel', serif;
      font-size: 20px;
      color: var(--gold-light);
      margin-bottom: 12px;
    }
    .pillar-card p { color: var(--text-muted); font-size: 15px; line-height: 1.6; }

    /* FAQ Section */
    .faq-section { padding: 80px 0; background: rgba(14, 19, 31, 0.3); border-top: 1px solid var(--border-subtle); }
    .faq-list { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; }
    .faq-item {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      overflow: hidden;
      transition: border-color 0.2s;
    }
    .faq-item:hover { border-color: var(--border-focus); }
    .faq-question {
      padding: 20px 24px;
      font-size: 17px;
      font-weight: 600;
      color: #FFF;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .faq-answer {
      padding: 0 24px 20px;
      color: var(--text-muted);
      font-size: 15px;
      line-height: 1.7;
    }

    /* Cross-linking Cluster Section */
    .cluster-section { padding: 80px 0; }
    .cluster-group { margin-bottom: 40px; }
    .cluster-group h4 {
      font-family: 'Cinzel', serif;
      font-size: 18px;
      color: var(--gold-light);
      margin-bottom: 16px;
      border-bottom: 1px solid var(--border-subtle);
      padding-bottom: 8px;
    }
    .tag-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
    .tag-link {
      padding: 8px 16px;
      background: rgba(18, 24, 38, 0.6);
      border: 1px solid var(--border-subtle);
      border-radius: 9999px;
      font-size: 13px;
      color: var(--text-muted);
      transition: all 0.2s;
    }
    .tag-link:hover {
      color: var(--gold-light);
      border-color: var(--gold-primary);
      background: rgba(212, 175, 55, 0.1);
    }

    /* VIP Floating CTA */
    .vip-banner {
      padding: 60px 0;
      background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(7, 9, 14, 0.95));
      border-top: 1px solid var(--border-subtle);
      text-align: center;
    }
    .vip-banner h3 { font-family: 'Cinzel', serif; font-size: 32px; color: #FFF; margin-bottom: 12px; }
    .vip-banner p { color: var(--text-muted); max-width: 600px; margin: 0 auto 28px; }

    /* Footer */
    footer {
      background: #040508;
      border-top: 1px solid var(--border-subtle);
      padding: 50px 0 30px;
      font-size: 14px;
      color: var(--text-muted);
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 2fr repeat(3, 1fr);
      gap: 40px;
      margin-bottom: 40px;
    }
    .footer-col h4 {
      font-family: 'Cinzel', serif;
      font-size: 15px;
      color: var(--gold-light);
      margin-bottom: 16px;
    }
    .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
    .footer-col a:hover { color: var(--gold-light); }
    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 24px;
      text-align: center;
      font-size: 13px;
    }

    /* BIODATA MAKER CUSTOM STYLES */
    .biodata-builder-section { padding: 60px 0 90px; }
    .builder-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: start;
    }
    @media (max-width: 960px) {
      .builder-grid { grid-template-columns: 1fr; }
      .footer-grid { grid-template-columns: 1fr 1fr; }
    }
    .form-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 32px;
    }
    .form-card-header { margin-bottom: 24px; }
    .form-card-header h3 { font-family: 'Cinzel', serif; font-size: 22px; color: var(--gold-light); margin-bottom: 6px; }
    .form-card-header p { font-size: 14px; color: var(--text-muted); }

    .section-label {
      display: block;
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--gold-light);
      margin: 20px 0 12px;
      border-bottom: 1px solid rgba(212, 175, 55, 0.15);
      padding-bottom: 6px;
    }
    .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 600px) { .input-grid { grid-template-columns: 1fr; } }
    .input-grid label { display: block; font-size: 13px; color: var(--text-muted); margin-bottom: 6px; }
    .input-grid input, .input-grid select, .input-grid textarea {
      width: 100%;
      padding: 10px 14px;
      background: rgba(7, 9, 14, 0.8);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      color: #FFF;
      font-size: 14px;
      font-family: inherit;
    }
    .input-grid input:focus { border-color: var(--gold-primary); outline: none; }

    .theme-selector-grid { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
    .theme-pill {
      padding: 8px 14px;
      background: rgba(7, 9, 14, 0.6);
      border: 1px solid var(--border-subtle);
      border-radius: 9999px;
      font-size: 13px;
      cursor: pointer;
      color: var(--text-muted);
    }
    .theme-pill.active {
      border-color: var(--gold-primary);
      background: rgba(212, 175, 55, 0.15);
      color: var(--gold-light);
    }
    .theme-pill input { display: none; }

    /* PREVIEW PAPER */
    .preview-panel { position: sticky; top: 90px; }
    .preview-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .preview-status { font-size: 14px; font-weight: 600; color: var(--gold-light); }

    .biodata-paper {
      background: #FCFAF7;
      color: #1A1A1A;
      padding: 36px 32px;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      font-family: 'Playfair Display', serif;
      min-height: 600px;
    }
    .biodata-paper.theme-gold { border: 4px double #B8860B; background: #FCFAF5; }
    .biodata-paper.theme-emerald { border: 4px double #1B4D3E; background: #F6FAF8; }
    .biodata-paper.theme-rose { border: 4px double #C77D88; background: #FDF9FA; }
    .biodata-paper.theme-platinum { border: 2px solid #94A3B8; background: #FFFFFF; font-family: 'Plus Jakarta Sans', sans-serif; }

    .paper-header { text-align: center; margin-bottom: 16px; }
    .om-symbol { font-size: 14px; font-weight: bold; color: #8B0000; margin-bottom: 6px; }
    .prev-name { font-size: 26px; font-weight: 700; color: #111; margin-bottom: 4px; }
    .prev-subhead { font-size: 14px; font-style: italic; color: #555; }
    .paper-divider { height: 2px; background: linear-gradient(90deg, transparent, #B8860B, transparent); margin: 12px 0 16px; }

    .paper-section { margin-bottom: 14px; }
    .paper-section-title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #8B0000;
      border-bottom: 1px solid #D4AF37;
      padding-bottom: 2px;
      margin-bottom: 8px;
    }
    .paper-row { display: flex; font-size: 13px; line-height: 1.5; margin-bottom: 3px; }
    .paper-row .lbl { width: 140px; font-weight: 600; color: #333; flex-shrink: 0; }
    .paper-row .val { color: #111; flex-grow: 1; }

    .paper-footer {
      text-align: center;
      font-size: 11px;
      color: #777;
      margin-top: 24px;
      border-top: 1px dotted #CCC;
      padding-top: 8px;
    }

    .biodata-mannat-cta {
      margin-top: 20px;
      padding: 20px;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      text-align: center;
    }
    .biodata-mannat-cta h4 { font-family: 'Cinzel', serif; font-size: 16px; color: var(--gold-light); margin-bottom: 6px; }
    .biodata-mannat-cta p { font-size: 13px; color: var(--text-muted); margin-bottom: 14px; }

    @media print {
      body * { visibility: hidden; }
      #biodataPaper, #biodataPaper * { visibility: visible; }
      #biodataPaper { position: absolute; left: 0; top: 0; width: 100%; border: none; box-shadow: none; }
    }
  </style>

  ${schemaHtml}
</head>
<body>

  <!-- NAVIGATION -->
  <nav class="site-nav">
    <div class="container nav-wrapper">
      <a href="https://mannatmatrimony.com/" class="brand-logo">
        <img src="/favicon.png" alt="Mannat Matrimony Logo">
        <span>MANNAT</span>
      </a>
      <div class="nav-links">
        <a href="https://mannatmatrimony.com/marriage-biodata-maker">Biodata Maker</a>
        <a href="https://mannatmatrimony.com/elite-matrimony">Elite Tier</a>
        <a href="https://mannatmatrimony.com/nri-matrimony">NRI</a>
        <a href="https://mannatmatrimony.com/safety">Safety & BlurShield™</a>
        <a href="https://mannatmatrimony.com/" class="btn btn-primary">Login / Join Free</a>
      </div>
    </div>
  </nav>

  <!-- HERO -->
  <header class="hero-section">
    <div class="container">
      <div class="eyebrow-pill">✨ ${p.eyebrow}</div>
      <h1 class="hero-title">${p.h1}</h1>
      <p class="hero-subtitle">${p.introText}</p>
      <div class="hero-cta-group">
        <a href="${p.isTool ? '#builder' : 'https://mannatmatrimony.com/'}" class="btn btn-primary">
          <span>${p.isTool ? '✨ Create Free Biodata' : 'Explore Verified Profiles Free'}</span>
          <span>→</span>
        </a>
        <a href="https://wa.me/919738397933?text=Hi%20Mannat%20Team,%20I%20am%20interested%20in%20verified%20matchmaking%20for%20${encodeURIComponent(p.slug)}" class="btn btn-secondary" target="_blank" rel="noopener">
          <span>💬 WhatsApp VIP Desk</span>
        </a>
      </div>
    </div>
  </header>

  <!-- STATS -->
  <section class="stats-strip">
    <div class="container">
      <div class="stats-grid">
        <div class="stat-card">
          <h3>${p.countBadge}</h3>
          <p>${p.communityTag}</p>
        </div>
        <div class="stat-card">
          <h3>100% ID Verified</h3>
          <p>Aadhaar & Degree Validated</p>
        </div>
        <div class="stat-card">
          <h3>BlurShield™</h3>
          <p>Zero Public Photo Scrapers</p>
        </div>
        <div class="stat-card">
          <h3>4.9 / 5.0 ★</h3>
          <p>Elite Matchmaking Trust Rating</p>
        </div>
      </div>
    </div>
  </section>

  ${toolContent}

  <!-- THREE PILLARS -->
  <section class="pillars-section">
    <div class="container">
      <div class="section-header">
        <h2>The Mannat Matrimonial Standard</h2>
        <p>Why distinguished families across India and the diaspora trust Mannat over conventional matrimonial portals.</p>
      </div>
      <div class="pillars-grid">
        <div class="pillar-card">
          <div class="pillar-icon">🛡️</div>
          <h3>${p.pillar1.title}</h3>
          <p>${p.pillar1.desc}</p>
        </div>
        <div class="pillar-card">
          <div class="pillar-icon">🔒</div>
          <h3>${p.pillar2.title}</h3>
          <p>${p.pillar2.desc}</p>
        </div>
        <div class="pillar-card">
          <div class="pillar-icon">✨</div>
          <h3>${p.pillar3.title}</h3>
          <p>${p.pillar3.desc}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQS -->
  <section class="faq-section">
    <div class="container">
      <div class="section-header">
        <h2>Frequently Asked Questions</h2>
        <p>Everything you need to know about our verified matchmaking process and confidentiality guarantees.</p>
      </div>
      <div class="faq-list">
        ${p.faqs.map(f => `
          <div class="faq-item">
            <div class="faq-question">${f.q} <span>+</span></div>
            <div class="faq-answer">${f.a}</div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- PROGRAMMATIC SEO CLUSTERS -->
  <section class="cluster-section">
    <div class="container">
      <div class="section-header">
        <h2>Explore Matrimonial Specialties</h2>
        <p>Curated verified matchmaking communities across India, North America, UK, and the Gulf.</p>
      </div>

      <div class="cluster-group">
        <h4>Cultural & Regional Communities</h4>
        <div class="tag-cloud">
          <a href="/punjabi-matrimony" class="tag-link">Punjabi Matrimony</a>
          <a href="/sikh-matrimony" class="tag-link">Sikh Matrimony</a>
          <a href="/marwari-matrimony" class="tag-link">Marwari Matrimony</a>
          <a href="/agarwal-matrimony" class="tag-link">Agarwal Matrimony</a>
          <a href="/maheshwari-matrimony" class="tag-link">Maheshwari Matrimony</a>
          <a href="/gujarati-matrimony" class="tag-link">Gujarati Matrimony</a>
          <a href="/patel-matrimony" class="tag-link">Patel Matrimony</a>
          <a href="/jain-matrimony" class="tag-link">Jain Matrimony</a>
          <a href="/brahmin-matrimony" class="tag-link">Brahmin Matrimony</a>
          <a href="/rajput-matrimony" class="tag-link">Rajput Matrimony</a>
          <a href="/maratha-matrimony" class="tag-link">Maratha Matrimony</a>
          <a href="/sindhi-matrimony" class="tag-link">Sindhi Matrimony</a>
          <a href="/kayastha-matrimony" class="tag-link">Kayastha Matrimony</a>
          <a href="/telugu-matrimony" class="tag-link">Telugu Matrimony</a>
          <a href="/reddy-matrimony" class="tag-link">Reddy Matrimony</a>
          <a href="/tamil-matrimony" class="tag-link">Tamil Matrimony</a>
          <a href="/iyer-matrimony" class="tag-link">Iyer Matrimony</a>
          <a href="/kannada-matrimony" class="tag-link">Kannada Matrimony</a>
          <a href="/malayalam-matrimony" class="tag-link">Malayalam Matrimony</a>
          <a href="/bengali-matrimony" class="tag-link">Bengali Matrimony</a>
          <a href="/kashmiri-pandit-matrimony" class="tag-link">Kashmiri Pandit Matrimony</a>
        </div>
      </div>

      <div class="cluster-group">
        <h4>Global NRI Destinations</h4>
        <div class="tag-cloud">
          <a href="/nri-matrimony" class="tag-link">NRI Matrimony Global</a>
          <a href="/usa-nri-matrimony" class="tag-link">USA NRI Matrimony</a>
          <a href="/uk-nri-matrimony" class="tag-link">UK NRI Matrimony</a>
          <a href="/canada-nri-matrimony" class="tag-link">Canada NRI Matrimony</a>
          <a href="/australia-nri-matrimony" class="tag-link">Australia NRI Matrimony</a>
          <a href="/dubai-nri-matrimony" class="tag-link">Dubai & Gulf NRI Matrimony</a>
        </div>
      </div>

      <div class="cluster-group">
        <h4>Metro Cities & High-Volume Hubs</h4>
        <div class="tag-cloud">
          <a href="/delhi-matrimony" class="tag-link">Delhi NCR Matrimony</a>
          <a href="/mumbai-matrimony" class="tag-link">Mumbai Matrimony</a>
          <a href="/matchmaking-bangalore" class="tag-link">Bangalore Matchmaking</a>
          <a href="/hyderabad-matrimony" class="tag-link">Hyderabad Matrimony</a>
          <a href="/pune-matrimony" class="tag-link">Pune Matrimony</a>
          <a href="/chandigarh-matrimony" class="tag-link">Chandigarh Matrimony</a>
          <a href="/kolkata-matrimony" class="tag-link">Kolkata Matrimony</a>
          <a href="/chennai-matrimony" class="tag-link">Chennai Matrimony</a>
          <a href="/jaipur-matrimony" class="tag-link">Jaipur Matrimony</a>
        </div>
      </div>

      <div class="cluster-group">
        <h4>Elite Professions & Tools</h4>
        <div class="tag-cloud">
          <a href="/marriage-biodata-maker" class="tag-link">Marriage Biodata Maker (Free PDF)</a>
          <a href="/kundali-matching-matrimony" class="tag-link">Kundali Matching & 36 Gun Milan</a>
          <a href="/elite-matrimony" class="tag-link">Elite Matrimony (HNI)</a>
          <a href="/matrimony-for-doctors" class="tag-link">Doctors Matrimony</a>
          <a href="/iit-iim-matrimony" class="tag-link">IIT & IIM Alumni Matrimony</a>
          <a href="/ca-finance-matrimony" class="tag-link">CA & Finance Matrimony</a>
          <a href="/ias-ips-civil-services-matrimony" class="tag-link">Civil Services Matrimony</a>
          <a href="/30-plus-matrimony" class="tag-link">30+ Matrimony</a>
          <a href="/second-marriage-divorced-matrimony" class="tag-link">Second Marriage & Divorced</a>
          <a href="/verified-matrimony" class="tag-link">100% Verified Profiles</a>
          <a href="/photo-privacy-blurshield" class="tag-link">Photo Privacy & BlurShield™</a>
        </div>
      </div>
    </div>
  </section>

  <!-- VIP BANNER -->
  <section class="vip-banner">
    <div class="container">
      <h3>Experience Confidential Matchmaking</h3>
      <p>Speak directly with our matrimonial concierge team. We prioritize your family values, career aspirations, and absolute discretion.</p>
      <a href="https://mannatmatrimony.com/" class="btn btn-primary">Join Mannat Matrimony Free →</a>
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="brand-logo" style="margin-bottom: 14px;">
            <img src="/favicon.png" alt="Logo">
            <span>MANNAT</span>
          </div>
          <p style="margin-bottom: 16px;">India's premier verified matrimonial sanctuary. Multi-point ID background checks, BlurShield™ candidate security, and high-touch concierge matchmaking.</p>
          <p>Concierge Desk: <strong>+91 97383 97933</strong></p>
        </div>

        <div class="footer-col">
          <h4>Communities</h4>
          <ul>
            <li><a href="/punjabi-matrimony">Punjabi Matrimony</a></li>
            <li><a href="/marwari-matrimony">Marwari Matrimony</a></li>
            <li><a href="/agarwal-matrimony">Agarwal Matrimony</a></li>
            <li><a href="/gujarati-matrimony">Gujarati Matrimony</a></li>
            <li><a href="/brahmin-matrimony">Brahmin Matrimony</a></li>
            <li><a href="/rajput-matrimony">Rajput Matrimony</a></li>
            <li><a href="/jain-matrimony">Jain Matrimony</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>NRI & Metros</h4>
          <ul>
            <li><a href="/nri-matrimony">NRI Matrimony Global</a></li>
            <li><a href="/usa-nri-matrimony">USA NRI Matrimony</a></li>
            <li><a href="/uk-nri-matrimony">UK NRI Matrimony</a></li>
            <li><a href="/delhi-matrimony">Delhi NCR</a></li>
            <li><a href="/mumbai-matrimony">Mumbai Matrimony</a></li>
            <li><a href="/matchmaking-bangalore">Bangalore Matchmaking</a></li>
            <li><a href="/hyderabad-matrimony">Hyderabad Matrimony</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Tools & Safety</h4>
          <ul>
            <li><a href="/marriage-biodata-maker">Marriage Biodata Maker</a></li>
            <li><a href="/kundali-matching-matrimony">Kundali Gun Milan</a></li>
            <li><a href="/elite-matrimony">Elite HNI Concierge</a></li>
            <li><a href="/matrimony-for-doctors">Doctors Matrimony</a></li>
            <li><a href="/iit-iim-matrimony">IIT IIM Matrimony</a></li>
            <li><a href="/safety">Safety & Privacy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© ${new Date().getFullYear()} Mannat Matrimony (Mannat Tech Pvt Ltd). All rights reserved.</p>
      </div>
    </div>
  </footer>

</body>
</html>`;
}

// MAIN EXECUTION
const publicDir = path.resolve('public');

// 1. Generate all landing pages in public/<slug>/index.html
pages.forEach(p => {
  const targetDir = path.join(publicDir, p.slug);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const htmlContent = generateHtml(p);
  fs.writeFileSync(path.join(targetDir, 'index.html'), htmlContent, 'utf-8');
  console.log(`✅ Generated SEO Landing Page: /${p.slug}`);
});

// 2. Generate updated sitemap.xml
const nowIso = new Date().toISOString().split('T')[0];
const staticUrls = [
  { loc: 'https://mannatmatrimony.com/', priority: '1.0', changefreq: 'daily' },
  { loc: 'https://mannatmatrimony.com/about', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://mannatmatrimony.com/safety', priority: '0.9', changefreq: 'monthly' },
  { loc: 'https://mannatmatrimony.com/privacy', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://mannatmatrimony.com/terms', priority: '0.7', changefreq: 'monthly' },
];

const programmaticUrls = pages.map(p => ({
  loc: `https://mannatmatrimony.com/${p.slug}`,
  priority: p.isTool ? '0.95' : '0.9',
  changefreq: p.isTool ? 'daily' : 'weekly'
}));

const allUrls = [...staticUrls, ...programmaticUrls];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${nowIso}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
    <image:image>
      <image:loc>https://mannatmatrimony.com/og-image.jpg</image:loc>
      <image:title>Mannat Matrimony - Verified Matchmaking</image:title>
      <image:caption>Confidential and Verified Indian Matrimonial Matchmaking</image:caption>
    </image:image>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
console.log(`✅ Updated public/sitemap.xml with all ${allUrls.length} indexed URLs`);

// 3. Update llms.txt for AI Search Engines (ChatGPT, Perplexity, Claude, Gemini)
const llmsTxt = `# Mannat Matrimony (https://mannatmatrimony.com)
> India's premier verified matrimonial platform. Multi-point ID background checks, BlurShield™ candidate security, and high-touch concierge matchmaking.

## Key Facts & Capabilities
- **Platform**: Verified Indian Matrimonial & Matchmaking App
- **Website**: https://mannatmatrimony.com
- **Core Security**: BlurShield™ technology prevents public search engines and bots from harvesting candidate portraits.
- **Verification**: Mandatory Government ID (Aadhaar, Passport, PAN) and University Degree validation.
- **Audience**: Discerning Indian families, elite business lineages, doctors, IIT/IIM alumni, and global NRIs (USA, UK, Canada, UAE, Australia).
- **Concierge Desk**: +91-97383-97933

## Free Tools
- **Marriage Biodata Maker (Free PDF Download)**: https://mannatmatrimony.com/marriage-biodata-maker
- **Kundali & 36 Gun Milan Matching Guide**: https://mannatmatrimony.com/kundali-matching-matrimony

## Cultural & Community Matchmaking Verticals
${pages.filter(p => !p.isTool).map(p => `- **${p.h1}**: https://mannatmatrimony.com/${p.slug} - ${p.description}`).join('\n')}

## Frequently Asked Questions & Citations
- **Q: What is Mannat Matrimony?**
  A: Mannat Matrimony is a private, verified Indian matrimonial service offering multi-point ID verification, BlurShield™ photo privacy, and bespoke concierge matchmaking for accomplished professionals and families.
- **Q: How does BlurShield™ protect member photos?**
  A: BlurShield™ blurs profile photos from search engines and casual viewers. Portraits and phone numbers are only revealed upon mutual interest approval.
- **Q: How to contact Mannat concierge?**
  A: Call or WhatsApp +91-97383-97933 or visit https://mannatmatrimony.com.
`;

fs.writeFileSync(path.join(publicDir, 'llms.txt'), llmsTxt, 'utf-8');
console.log('✅ Updated public/llms.txt for AI Search Engines');

console.log('🚀 Complete 35+ Deep SEO & Tool Suite Generated Successfully!');
