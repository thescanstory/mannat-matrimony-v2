import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  X,
  Crown,
  ArrowRight,
  ExternalLink,
  Menu,
  Sparkles,
  Lock,
  User,
  Mail,
  MapPin,
  Briefcase
} from 'lucide-react';
import { vipConsultationService, type VipLead } from '../services/vipConsultationService';
import { authService } from '../services/authService';
import { LegalModal, type LegalDocType } from './LegalModal';
import { INITIAL_CURATED_PROFILES } from '../services/profileService';

interface LandingPageProps {
  onOpenApp?: (initialView?: 'onboarding' | 'auth' | 'home') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenApp }) => {
  // Navigation & Modal States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [legalInitialDoc, setLegalInitialDoc] = useState<LegalDocType>('privacy');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showTopAppBanner, setShowTopAppBanner] = useState(true);

  // Quick Hero Registration Form State
  const [heroProfileFor, setHeroProfileFor] = useState('My Self');
  const [heroGender, setHeroGender] = useState('female');
  const [heroName, setHeroName] = useState('');
  const [heroEmail, setHeroEmail] = useState('');
  const [heroPhone, setHeroPhone] = useState('');
  const [heroCity, setHeroCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Modal Registration Form State
  const [modalProfileFor, setModalProfileFor] = useState('My Self');
  const [modalGender, setModalGender] = useState('female');
  const [modalName, setModalName] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalPhone, setModalPhone] = useState('');
  const [modalCity, setModalCity] = useState('');
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const heroFormRef = useRef<HTMLDivElement>(null);

  const navigateToApp = (view: 'onboarding' | 'auth' | 'home' = 'home') => {
    if (onOpenApp) {
      onOpenApp(view);
    } else if (typeof window !== 'undefined') {
      window.location.href = `/app?view=${view}`;
    }
  };

  // 1-Click Registration Handler (Hero Form)
  const handleHeroRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!heroName.trim()) {
      setFormError('Please enter candidate full name');
      return;
    }
    if (!heroEmail.trim() || !heroEmail.includes('@')) {
      setFormError('Please enter a valid email address');
      return;
    }
    if (!heroPhone.trim() || heroPhone.length < 8) {
      setFormError('Please enter a valid mobile number');
      return;
    }

    setIsSubmitting(true);
    try {
      const email = heroEmail.trim().toLowerCase();
      const name = heroName.trim();

      // 1. Store lead in Supabase VIP leads
      const leadData: VipLead = {
        profile_for: heroProfileFor,
        gender: heroGender === 'female' ? 'Female (Bride)' : 'Male (Groom)',
        full_name: name,
        phone_country_code: '+91',
        phone_number: heroPhone.trim(),
        email: email,
        city: heroCity.trim() || 'India / Global',
        annual_income: 'Confidential',
        source_cta: 'Hero Direct Web Registration'
      };
      await vipConsultationService.submitLead(leadData);

      // 2. Set active user session in authService
      authService.setUserSession(email, name);

      // 3. Pre-fill candidate profile data for instant onboarding
      const initialProfile = {
        display_name: name,
        gender: heroGender,
        city: heroCity.trim() || 'Mumbai',
        managed_by: heroProfileFor.includes('Self') ? 'self' : 'parent',
        religion: 'Hindu',
        marital_status: 'Never Married',
        bio_text: `Bio-data created for ${name}. Seeking a meaningful alliance based on shared values.`
      };
      localStorage.setItem('mannat_user_profile', JSON.stringify(initialProfile));
      localStorage.setItem('mannat_onboarded_' + email, 'true');

      // 4. Immediately launch the Onboarding / Member app
      navigateToApp('onboarding');
    } catch (err) {
      console.warn('Registration notice:', err);
      // Fallback: Proceed to app with user session
      const email = heroEmail.trim().toLowerCase();
      const name = heroName.trim();
      authService.setUserSession(email, name);
      navigateToApp('onboarding');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1-Click Registration Handler (Modal Form)
  const handleModalRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!modalName.trim() || !modalEmail.trim() || !modalPhone.trim()) {
      setModalError('Please fill in all required fields');
      return;
    }

    setModalSubmitting(true);
    try {
      const email = modalEmail.trim().toLowerCase();
      const name = modalName.trim();

      const leadData: VipLead = {
        profile_for: modalProfileFor,
        gender: modalGender === 'female' ? 'Female (Bride)' : 'Male (Groom)',
        full_name: name,
        phone_country_code: '+91',
        phone_number: modalPhone.trim(),
        email: email,
        city: modalCity.trim() || 'India / Global',
        annual_income: 'Confidential',
        source_cta: 'Popup Modal Registration'
      };
      await vipConsultationService.submitLead(leadData);

      authService.setUserSession(email, name);

      const initialProfile = {
        display_name: name,
        gender: modalGender,
        city: modalCity.trim() || 'Mumbai',
        managed_by: modalProfileFor.includes('Self') ? 'self' : 'parent',
        religion: 'Hindu',
        marital_status: 'Never Married',
        bio_text: `Bio-data created for ${name}. Seeking a meaningful alliance based on shared values.`
      };
      localStorage.setItem('mannat_user_profile', JSON.stringify(initialProfile));
      localStorage.setItem('mannat_onboarded_' + email, 'true');

      setShowRegisterModal(false);
      navigateToApp('onboarding');
    } catch (err) {
      console.warn('Modal registration notice:', err);
      authService.setUserSession(modalEmail.trim().toLowerCase(), modalName.trim());
      setShowRegisterModal(false);
      navigateToApp('onboarding');
    } finally {
      setModalSubmitting(false);
    }
  };

  // Verified Profiles Showcase (Top 4)
  const showcaseProfiles = INITIAL_CURATED_PROFILES.filter(p => p.id !== 'appreview-demo-user-id').slice(0, 4);

  // Four Pillars of Confidential Matchmaking
  const matchmakingPillars = [
    {
      title: 'Mandatory Identity & Background Verification',
      badge: '100% Verified Candidates',
      subtitle: 'Integrity First',
      description: 'Every applicant is reviewed with mandatory credential, education, and family background checks to ensure an authentic, high-caliber community.',
      highlight: 'Government ID & Professional Credential Check',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'BlurShield™ Photo & Contact Privacy',
      badge: 'Privacy-First Architecture',
      subtitle: 'Zero Public Exposure',
      description: 'Your portraits, contact numbers, and confidential family details remain protected. Photos are softly blurred and never indexed on Google.',
      highlight: 'Controlled Unblurring strictly upon Mutual Expression of Interest',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Family-Centric WhatsApp Bio-Data Sharing',
      badge: 'Dignified Introductions',
      subtitle: 'Elder-Friendly Dossiers',
      description: 'Generate verified bio-data cards and horoscopes formatted specifically for sharing with family elders and decision-makers over WhatsApp.',
      highlight: '1-Click WhatsApp Alliance Dossier Cards',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Dedicated Human Matchmaking Concierge',
      badge: 'Personalized Advisory',
      subtitle: 'Bespoke Advisory',
      description: 'Experience human-led matchmaking where dedicated relationship managers understand your lifestyle, intellectual wavelength, and family values.',
      highlight: 'Direct Human Advisory & Curated Introductions',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800'
    }
  ];

  // High-Intent Communities Directory
  const communityList = [
    { name: 'Punjabi Matrimony', desc: 'Arora, Khatri, Sikh & Hindu Punjabi alliances', count: '1,400+ Profiles', badge: 'Active' },
    { name: 'Marwari Matrimony', desc: 'Agarwal, Maheshwari, Khandelwal & Oswal lineages', count: '1,250+ Profiles', badge: 'Verified' },
    { name: 'Gujarati Matrimony', desc: 'Patel, Shah, Vaishnav & Jain Gujarati families', count: '980+ Profiles', badge: 'Exclusive' },
    { name: 'Jain Matrimony', desc: 'Digambar, Shwetambar & Oswal match curation', count: '820+ Profiles', badge: 'Verified' },
    { name: 'Brahmin Matrimony', desc: 'Gaur, Saraswat, Kanyakubj, Nagar & Sanadhya', count: '1,100+ Profiles', badge: 'Active' },
    { name: 'Agarwal Matrimony', desc: 'Garg, Bansal, Bindal, Mittal, Singhal & Goyal', count: '940+ Profiles', badge: 'Verified' },
    { name: 'Rajput Matrimony', desc: 'Royal heritage, Sisodia, Rathore & Chauhan clans', count: '740+ Profiles', badge: 'Exclusive' },
    { name: 'Sindhi Matrimony', desc: 'Lohana, Bhaiband & Sahiti business lineages', count: '650+ Profiles', badge: 'Verified' }
  ];

  // High-Intent Metros & NRI Hubs
  const cityList = [
    { name: 'Delhi NCR Matrimony', desc: 'South Delhi, Gurgaon, Noida, West Delhi', count: '2,800+ Members', flag: '🇮🇳' },
    { name: 'Mumbai Matrimony', desc: 'South Mumbai, Bandra, Juhu, Powai, Thane', count: '2,400+ Members', flag: '🇮🇳' },
    { name: 'Bangalore & Hyderabad', desc: 'Tech Founders, CXOs, Medical & Corporate', count: '1,900+ Members', flag: '🇮🇳' },
    { name: 'NRI Matrimony — USA', desc: 'Silicon Valley, New York, Texas, Seattle, Chicago', count: '1,650+ Members', flag: '🇺🇸' },
    { name: 'NRI Matrimony — UK', desc: 'London, Birmingham, Manchester, Leicester', count: '1,120+ Members', flag: '🇬🇧' },
    { name: 'NRI Matrimony — UAE', desc: 'Dubai, Abu Dhabi, Sharjah business families', count: '980+ Members', flag: '🇦🇪' },
    { name: 'NRI Matrimony — Canada', desc: 'Toronto, Vancouver, Calgary, Montreal', count: '860+ Members', flag: '🇨🇦' },
    { name: 'NRI Matrimony — Singapore & AU', desc: 'Singapore, Sydney, Melbourne corporate leaders', count: '720+ Members', flag: '🌏' }
  ];

  // FAQs
  const faqs = [
    {
      q: 'How do I register and create a profile on the website?',
      a: 'Simply fill out the Registration Form in the hero section above with your name, email, and mobile number. You will instantly be guided through our fast 2-minute candidate setup to add photos, education, and partner preferences.'
    },
    {
      q: 'What makes Mannat Matrimony different from conventional matrimonial sites?',
      a: 'Mannat combines a private, verified platform with human-led concierge advisory. We enforce mandatory identity checks, protect family privacy with BlurShield™, and never expose member profiles to public Google indexing.'
    },
    {
      q: 'How does BlurShield™ protect our family privacy?',
      a: 'BlurShield™ ensures candidate portraits and confidential contact details are never indexed publicly by search engines. Photos remain softly blurred and are unlocked strictly upon mutual expression of interest.'
    },
    {
      q: 'Can parents or siblings register on behalf of a candidate?',
      a: 'Yes! Over 60% of our profiles are managed by parents or family elders. Simply select "My Son" or "My Daughter" during registration to activate Parent Mode with larger text and direct WhatsApp family sharing.'
    },
    {
      q: 'What does it cost to join Mannat?',
      a: 'Creating your verified profile and exploring matching candidate profiles is 100% free. Optional VIP memberships are available starting from ₹1,499 for extended contact quotas, profile spotlights, and dedicated concierge support.'
    },
    {
      q: 'Can I access Mannat on my iPhone, Android, or laptop?',
      a: 'Yes! You can use our full web application on any laptop, tablet, or phone right in your browser, or download the official Mannat app on the Apple App Store.'
    }
  ];

  const [directoryTab, setDirectoryTab] = useState<'communities' | 'cities'>('communities');

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#161412] selection:bg-[#560406]/20 selection:text-[#560406] font-sans overflow-x-hidden pt-16 sm:pt-20">
      
      {/* 0. Top Smart App Announcement Bar */}
      <AnimatePresence>
        {showTopAppBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-[#1C0102] via-[#3A0204] to-[#1C0102] text-[#F5E6D3] text-[11px] sm:text-xs font-semibold py-1.5 px-4 border-b border-[#A17B5E]/30 flex items-center justify-between shadow-xs"
          >
            <div className="flex-1 text-center flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 bg-[#D8B486]/20 text-[#D8B486] px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold border border-[#D8B486]/30">
                Official iOS App
              </span>
              <span className="hidden sm:inline">Mannat is live on the Apple App Store.</span>
              <a
                href="https://apps.apple.com/app/id6812288373"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 text-[#D8B486] hover:text-white font-bold inline-flex items-center gap-1"
              >
                <span>Download on iOS</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <button
              onClick={() => setShowTopAppBanner(false)}
              className="text-neutral-400 hover:text-white p-0.5 cursor-pointer"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header (Clean, Royal Navigation) */}
      <header className={`fixed left-0 right-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E8DDD0] shadow-2xs transition-all ${showTopAppBanner ? 'top-7 sm:top-8' : 'top-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16 sm:h-20">
            
            {/* Brand Logo */}
            <a href="/" className="flex items-center gap-3 group shrink-0">
              <img
                src="/images/mannat-logo-square.png"
                alt="Mannat Matrimony"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover shadow-xs ring-1 ring-[#560406]/20 group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col text-left">
                <span className="text-xs sm:text-sm italic font-normal text-[#560406] -mb-1 leading-none" style={{ fontFamily: "'Pinyon Script', cursive" }}>
                  At
                </span>
                <span className="font-normal text-xl sm:text-2xl tracking-[0.22em] uppercase text-[#560406] group-hover:text-[#730C0F] transition-colors leading-tight" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}>
                  MANNAT
                </span>
                <span className="text-[7px] uppercase tracking-[0.34em] font-bold text-[#A17B5E] -mt-0.5">
                  Bespoke Matchmaking
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-[#6E6259]">
              <a href="#register" className="text-[#560406] hover:text-[#730C0F] transition font-extrabold">Register Free</a>
              <a href="#showcase" className="hover:text-[#560406] transition">Verified Profiles</a>
              <a href="#pillars" className="hover:text-[#560406] transition">Why Mannat</a>
              <a href="#directory" className="hover:text-[#560406] transition">Communities &amp; Cities</a>
              <a href="#faq" className="hover:text-[#560406] transition">FAQ</a>
            </nav>

            {/* Right Header Actions */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => navigateToApp('auth')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#E8DDD0] hover:border-[#560406]/30 text-xs font-bold text-[#560406] hover:bg-[#F4EAE0] transition cursor-pointer shadow-2xs"
              >
                <User className="w-3.5 h-3.5 text-[#A17B5E]" />
                <span>Member Log In</span>
              </button>

              <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#730C0F] via-[#560406] to-[#3A0204] hover:brightness-110 text-[#F5E6D3] border border-[#A17B5E]/60 text-xs font-bold tracking-wide shadow-md transition cursor-pointer whitespace-nowrap active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#DFBE7E]" />
                <span>Register Free</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#DFBE7E]" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-[#560406] hover:bg-[#560406]/10 transition-colors cursor-pointer"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Sheet */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#FDFBF7] border-b border-[#E8DDD0] px-4 py-4 shadow-xl space-y-2.5 text-left"
            >
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); setShowRegisterModal(true); }}
                  className="p-3 bg-white rounded-xl border border-[#560406]/30 text-[#560406] font-extrabold text-left flex items-center justify-between cursor-pointer"
                >
                  <span>✨ Register Free</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); navigateToApp('auth'); }}
                  className="p-3 bg-white rounded-xl border border-[#E8DDD0] text-[#161412] text-left flex items-center justify-between cursor-pointer"
                >
                  <span>🔐 Member Log In</span>
                </button>
                <a
                  href="#showcase"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 bg-white rounded-xl border border-[#E8DDD0] text-[#161412] flex items-center justify-between"
                >
                  <span>👑 Verified Profiles</span>
                </a>
                <a
                  href="#pillars"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 bg-white rounded-xl border border-[#E8DDD0] text-[#161412] flex items-center justify-between"
                >
                  <span>🛡️ BlurShield™ Privacy</span>
                </a>
              </div>
              <a
                href="https://apps.apple.com/app/id6812288373"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#1C0102] text-white border border-white/20 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Download on iOS App Store</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#DFBE7E]" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. HERO SECTION WITH DIRECT 1-CLICK WEB REGISTRATION */}
      <section id="register" className="relative bg-gradient-to-b from-[#240103] via-[#3A0204] to-[#1C0102] text-white pt-10 sm:pt-16 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative Golden Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#DFBE7E]/15 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Value Proposition & Trust Badges */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 bg-[#DFBE7E]/10 border border-[#DFBE7E]/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#DFBE7E] tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#DFBE7E]" />
              <span>Private &amp; Verified Indian Matrimony</span>
            </div>

            <h1
              className="text-3xl sm:text-5xl lg:text-[52px] font-normal text-white tracking-[0.01em] leading-[1.12]"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
            >
              Private, Verified Matchmaking for Discerning Families
            </h1>

            <p className="text-xs sm:text-base text-[#F4EAE0] leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
              India's intention-first matrimonial platform. Explore 100% verified bio-datas with BlurShield™ photo privacy, WhatsApp family cards, and bespoke concierge introductions.
            </p>

            {/* Value Checkpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-[#DFBE7E] shrink-0" />
                <span className="text-xs font-semibold text-white">100% Verified Candidates</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <ShieldCheck className="w-4 h-4 text-[#DFBE7E] shrink-0" />
                <span className="text-xs font-semibold text-white">BlurShield™ Privacy</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <Crown className="w-4 h-4 text-[#DFBE7E] shrink-0" />
                <span className="text-xs font-semibold text-white">WhatsApp Family Dossiers</span>
              </div>
            </div>

            {/* Existing Member Shortcut */}
            <div className="pt-2 text-xs text-[#E8DDD0] flex items-center justify-center lg:justify-start gap-2">
              <span>Already registered?</span>
              <button
                type="button"
                onClick={() => navigateToApp('auth')}
                className="text-[#DFBE7E] hover:underline font-bold cursor-pointer"
              >
                Log In to Your Account →
              </button>
            </div>
          </div>

          {/* Right Column: Direct High-Converting Web Registration Card */}
          <div ref={heroFormRef} className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="bg-[#FDFBF7] text-[#161412] p-6 sm:p-7 rounded-3xl shadow-2xl border border-[#E8DDD0] relative overflow-hidden">
              
              {/* Card Header */}
              <div className="border-b border-[#E8DDD0] pb-4 mb-4 text-left">
                <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-[#A17B5E] block mb-1">
                  Start Your Journey
                </span>
                <h2 className="text-2xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  Register Candidate Profile Free
                </h2>
                <p className="text-xs text-[#6E6259] mt-0.5">
                  Takes 2 minutes · 100% Confidential &amp; Verified
                </p>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleHeroRegisterSubmit} className="space-y-3.5 text-left">
                
                {/* Row 1: Profile For & Seeking Gender */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                      Profile For
                    </label>
                    <div className="relative">
                      <select
                        value={heroProfileFor}
                        onChange={(e) => setHeroProfileFor(e.target.value)}
                        className="w-full h-10 pl-3 pr-7 bg-[#F8F6F2] border border-[#E8DDD0] rounded-xl text-xs font-bold text-[#161412] focus:outline-none focus:ring-2 focus:ring-[#560406] appearance-none cursor-pointer"
                      >
                        <option value="My Self">Self</option>
                        <option value="My Son">Son</option>
                        <option value="My Daughter">Daughter</option>
                        <option value="My Brother">Brother</option>
                        <option value="My Sister">Sister</option>
                        <option value="My Friend / Relative">Friend / Relative</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#8C827A] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                      Candidate Gender
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 h-10 p-0.5 bg-[#F8F6F2] border border-[#E8DDD0] rounded-xl text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setHeroGender('female')}
                        className={`rounded-lg transition cursor-pointer flex items-center justify-center ${
                          heroGender === 'female' ? 'bg-[#560406] text-[#F5E6D3] shadow-2xs' : 'text-[#6E6259]'
                        }`}
                      >
                        Female
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeroGender('male')}
                        className={`rounded-lg transition cursor-pointer flex items-center justify-center ${
                          heroGender === 'male' ? 'bg-[#560406] text-[#F5E6D3] shadow-2xs' : 'text-[#6E6259]'
                        }`}
                      >
                        Male
                      </button>
                    </div>
                  </div>
                </div>

                {/* Candidate Full Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                    Candidate Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={heroName}
                      onChange={(e) => setHeroName(e.target.value)}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full h-10 pl-8 pr-3 bg-[#F8F6F2] border border-[#E8DDD0] rounded-xl text-xs font-bold text-[#161412] placeholder-[#A89F91] focus:outline-none focus:ring-2 focus:ring-[#560406]"
                    />
                    <User className="w-3.5 h-3.5 text-[#A17B5E] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={heroEmail}
                      onChange={(e) => setHeroEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full h-10 pl-8 pr-3 bg-[#F8F6F2] border border-[#E8DDD0] rounded-xl text-xs font-bold text-[#161412] placeholder-[#A89F91] focus:outline-none focus:ring-2 focus:ring-[#560406]"
                    />
                    <Mail className="w-3.5 h-3.5 text-[#A17B5E] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Mobile Number & City */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <div className="sm:col-span-7">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                      Mobile Number *
                    </label>
                    <div className="flex items-center h-10 bg-[#F8F6F2] border border-[#E8DDD0] rounded-xl px-2.5 focus-within:ring-2 focus-within:ring-[#560406]">
                      <span className="text-xs font-bold text-[#560406] pr-1.5 border-r border-[#E8DDD0]">+91</span>
                      <input
                        type="tel"
                        required
                        value={heroPhone}
                        onChange={(e) => setHeroPhone(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full pl-2 bg-transparent text-xs font-bold text-[#161412] placeholder-[#A89F91] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                      City
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={heroCity}
                        onChange={(e) => setHeroCity(e.target.value)}
                        placeholder="e.g. Mumbai"
                        className="w-full h-10 pl-7 pr-2.5 bg-[#F8F6F2] border border-[#E8DDD0] rounded-xl text-xs font-bold text-[#161412] placeholder-[#A89F91] focus:outline-none focus:ring-2 focus:ring-[#560406]"
                      />
                      <MapPin className="w-3.5 h-3.5 text-[#A17B5E] absolute left-2 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                {formError && (
                  <div className="text-[11px] text-rose-600 font-bold bg-rose-50 border border-rose-200 p-2 rounded-lg">
                    ⚠️ {formError}
                  </div>
                )}

                {/* Submit CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#730C0F] via-[#560406] to-[#3A0204] hover:brightness-110 text-[#F5E6D3] text-xs font-extrabold uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 border border-[#A17B5E]/50 mt-2"
                >
                  <Sparkles className="w-4 h-4 text-[#DFBE7E]" />
                  <span>{isSubmitting ? 'Creating Profile...' : 'Create Profile & View Matches →'}</span>
                </button>

                <p className="text-[10px] text-[#8C827A] text-center pt-1">
                  By registering, you agree to our{' '}
                  <button type="button" onClick={() => { setLegalInitialDoc('terms'); setShowLegal(true); }} className="underline text-[#560406] font-bold">Terms</button>{' '}
                  &amp;{' '}
                  <button type="button" onClick={() => { setLegalInitialDoc('privacy'); setShowLegal(true); }} className="underline text-[#560406] font-bold">Privacy Policy</button>.
                </p>

              </form>
            </div>
          </div>

        </div>
      </section>

      {/* 3. VERIFIED PROFILES SHOWCASE (TASTEFUL DISCREET PREVIEW) */}
      <section id="showcase" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-8 sm:mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-[#A17B5E] block">
            Curated Directory
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Explore Verified Candidate Profiles
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6259]">
            Every candidate is screened with mandatory ID and education credentials. Register free to view full biodatas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {showcaseProfiles.map((p) => (
            <div
              key={p.id}
              onClick={() => setShowRegisterModal(true)}
              className="bg-white rounded-2xl overflow-hidden border border-[#E8DDD0] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              {/* Photo with BlurShield Overlay */}
              <div className="relative aspect-[4/5] bg-neutral-900 overflow-hidden">
                <img
                  src={p.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'}
                  alt={p.display_name}
                  className="w-full h-full object-cover filter blur-[2px] scale-105 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                
                {/* Verified Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#560406] px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
                  <ShieldCheck className="w-3 h-3 text-[#A17B5E]" />
                  <span>100% Verified</span>
                </div>

                {/* Compatibility */}
                <div className="absolute top-3 right-3 bg-[#560406]/90 text-[#DFBE7E] px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#DFBE7E]/40">
                  ★ {p.compatibility_score}% Match
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3 inset-x-3 text-white text-left space-y-0.5">
                  <div className="text-lg font-bold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    {p.display_name}, <span className="font-sans text-sm font-semibold">{p.age} yrs</span>
                  </div>
                  <div className="text-[11px] text-[#DFBE7E] font-medium flex items-center gap-1 truncate">
                    <Briefcase className="w-3 h-3 shrink-0" />
                    <span>{p.occupation}</span>
                  </div>
                  <div className="text-[10px] text-neutral-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span>{p.city} · {p.religion}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="p-3.5 bg-[#FAF8F5] border-t border-[#E8DDD0] flex items-center justify-between text-xs font-bold text-[#560406]">
                <span className="flex items-center gap-1 text-[11px] text-[#A17B5E]">
                  <Lock className="w-3 h-3" />
                  <span>BlurShield™ Active</span>
                </span>
                <span className="group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>View Bio-Data</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
          <button
            type="button"
            onClick={() => navigateToApp('home')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#F4EAE0] text-[#560406] border border-[#560406] text-xs font-extrabold uppercase tracking-wider transition cursor-pointer shadow-xs"
          >
            <span>Explore Complete Verified Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 4. FOUR PILLARS OF DISTINCTION */}
      <section id="pillars" className="py-14 sm:py-20 bg-[#F4EAE0]/60 border-y border-[#E8DDD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-10 sm:mb-14">
            <span className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-[#A17B5E] block">
              Core Principles
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Why Discerning Families Choose Mannat
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6259]">
              Built ground-up with total privacy, rigorous vetting, and respect for cultural traditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {matchmakingPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DDD0] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#A17B5E]/50 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#A17B5E] bg-[#FDFBF7] px-3 py-1 rounded-full border border-[#E8DDD0]">
                      {pillar.badge}
                    </span>
                    <span className="text-xs font-serif italic text-[#6E6259]">0{idx + 1}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#6E6259] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8DDD0] text-xs font-semibold text-[#560406] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#A17B5E]" />
                  <span>{pillar.highlight}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. COMMUNITIES & CITIES DIRECTORY TABS */}
      <section id="directory" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8">
          <span className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-[#A17B5E] block">
            Targeted Matrimony Hubs
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Communities &amp; Global NRI Hubs
          </h2>
          
          {/* Tab Switcher */}
          <div className="inline-flex p-1 rounded-full bg-[#F4EAE0] border border-[#E8DDD0] text-xs font-bold">
            <button
              type="button"
              onClick={() => setDirectoryTab('communities')}
              className={`px-5 py-2 rounded-full transition cursor-pointer ${
                directoryTab === 'communities' ? 'bg-[#560406] text-[#F5E6D3] shadow-xs' : 'text-[#6E6259] hover:text-[#560406]'
              }`}
            >
              Prominent Communities
            </button>
            <button
              type="button"
              onClick={() => setDirectoryTab('cities')}
              className={`px-5 py-2 rounded-full transition cursor-pointer ${
                directoryTab === 'cities' ? 'bg-[#560406] text-[#F5E6D3] shadow-xs' : 'text-[#6E6259] hover:text-[#560406]'
              }`}
            >
              Indian Metros &amp; NRIs
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(directoryTab === 'communities' ? communityList : cityList).map((item: any, idx) => (
            <div
              key={idx}
              onClick={() => setShowRegisterModal(true)}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DDD0] shadow-xs hover:border-[#560406]/40 transition cursor-pointer space-y-1.5 text-left group"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#161412] group-hover:text-[#560406] transition-colors">
                  {item.flag ? `${item.flag} ` : ''}{item.name}
                </h4>
                <span className="text-[10px] font-bold text-[#A17B5E] bg-[#FDFBF7] px-2 py-0.5 rounded border border-[#E8DDD0]">
                  {item.count}
                </span>
              </div>
              <p className="text-[11px] text-[#6E6259] leading-normal line-clamp-2">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section id="faq" className="py-12 sm:py-16 bg-[#F4EAE0]/40 border-t border-[#E8DDD0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-2 mb-8 sm:mb-10">
            <span className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-[#A17B5E] block">
              Clear &amp; Transparent
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E8DDD0] overflow-hidden shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-[#161412] hover:text-[#560406] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#A17B5E] transition-transform duration-200 shrink-0 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs text-[#6E6259] leading-relaxed border-t border-[#E8DDD0]/50 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. BOTTOM CONVERSION DOCK */}
      <section className="bg-gradient-to-r from-[#260102] via-[#560406] to-[#260102] text-white py-12 px-4 text-center space-y-4">
        <h2 className="text-2xl sm:text-4xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          Ready to Discover Your Ideal Life Partner?
        </h2>
        <p className="text-xs sm:text-sm text-[#F4EAE0] max-w-lg mx-auto">
          Join thousands of verified candidates and families. Free registration on web and mobile.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              if (heroFormRef.current) {
                heroFormRef.current.scrollIntoView({ behavior: 'smooth' });
              } else {
                setShowRegisterModal(true);
              }
            }}
            className="px-6 py-3 rounded-full bg-[#DFBE7E] hover:bg-[#E8DDD0] text-[#1C0102] text-xs font-black uppercase tracking-wider shadow-lg transition cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#1C0102]" />
            <span>Register Candidate Profile Free →</span>
          </button>
          <a
            href="https://apps.apple.com/app/id6812288373"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-full bg-black/60 hover:bg-black text-white text-xs font-bold border border-white/20 transition cursor-pointer"
          >
            <span> iOS App Store</span>
          </a>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-[#1C0102] text-[#A89F91] py-10 px-4 sm:px-6 lg:px-8 border-t border-[#560406]/30 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white uppercase tracking-wider">Mannat Matrimony</span>
            <span>·</span>
            <span>Bespoke Private Matchmaking</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <button type="button" onClick={() => { setLegalInitialDoc('privacy'); setShowLegal(true); }} className="hover:text-white transition cursor-pointer">Privacy Policy</button>
            <button type="button" onClick={() => { setLegalInitialDoc('terms'); setShowLegal(true); }} className="hover:text-white transition cursor-pointer">Terms &amp; EULA</button>
            <button type="button" onClick={() => { setLegalInitialDoc('deletion'); setShowLegal(true); }} className="hover:text-white transition cursor-pointer">Account Deletion</button>
            <a href="https://apps.apple.com/app/id6812288373" target="_blank" rel="noreferrer" className="hover:text-white transition">iOS App</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-[11px] text-[#6E6259] pt-4 mt-4 border-t border-white/10 text-center sm:text-left">
          &copy; 2026 The House of Mannat. Confidential matrimonial alliance network. All rights reserved.
        </div>
      </footer>

      {/* 9. POPUP REGISTRATION MODAL */}
      <AnimatePresence>
        {showRegisterModal && (
          <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FDFBF7] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E8DDD0] shadow-2xl relative text-left"
            >
              <button
                onClick={() => setShowRegisterModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-[#F4EAE0] text-[#560406] hover:bg-[#E8DDD0] cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="border-b border-[#E8DDD0] pb-3 mb-4">
                <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-[#A17B5E] block">
                  Free Member Registration
                </span>
                <h3 className="text-2xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  Create Your Bio-Data Profile
                </h3>
              </div>

              <form onSubmit={handleModalRegisterSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                      Profile For
                    </label>
                    <select
                      value={modalProfileFor}
                      onChange={(e) => setModalProfileFor(e.target.value)}
                      className="w-full h-10 px-2.5 bg-[#F8F6F2] border border-[#E8DDD0] rounded-xl text-xs font-bold text-[#161412] focus:outline-none focus:ring-2 focus:ring-[#560406]"
                    >
                      <option value="My Self">Self</option>
                      <option value="My Son">Son</option>
                      <option value="My Daughter">Daughter</option>
                      <option value="My Brother">Brother</option>
                      <option value="My Sister">Sister</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                      Gender
                    </label>
                    <div className="grid grid-cols-2 gap-1 h-10 p-0.5 bg-[#F8F6F2] border border-[#E8DDD0] rounded-xl text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setModalGender('female')}
                        className={`rounded-lg transition cursor-pointer flex items-center justify-center ${
                          modalGender === 'female' ? 'bg-[#560406] text-[#F5E6D3]' : 'text-[#6E6259]'
                        }`}
                      >
                        Female
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalGender('male')}
                        className={`rounded-lg transition cursor-pointer flex items-center justify-center ${
                          modalGender === 'male' ? 'bg-[#560406] text-[#F5E6D3]' : 'text-[#6E6259]'
                        }`}
                      >
                        Male
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                    Candidate Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full h-10 px-3 bg-[#F8F6F2] border border-[#E8DDD0] rounded-xl text-xs font-bold text-[#161412] focus:outline-none focus:ring-2 focus:ring-[#560406]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={modalEmail}
                    onChange={(e) => setModalEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-10 px-3 bg-[#F8F6F2] border border-[#E8DDD0] rounded-xl text-xs font-bold text-[#161412] focus:outline-none focus:ring-2 focus:ring-[#560406]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={modalPhone}
                      onChange={(e) => setModalPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full h-10 px-3 bg-[#F8F6F2] border border-[#E8DDD0] rounded-xl text-xs font-bold text-[#161412] focus:outline-none focus:ring-2 focus:ring-[#560406]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={modalCity}
                      onChange={(e) => setModalCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full h-10 px-3 bg-[#F8F6F2] border border-[#E8DDD0] rounded-xl text-xs font-bold text-[#161412] focus:outline-none focus:ring-2 focus:ring-[#560406]"
                    />
                  </div>
                </div>

                {modalError && (
                  <div className="text-[11px] text-rose-600 font-bold bg-rose-50 border border-rose-200 p-2 rounded-lg">
                    ⚠️ {modalError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-[#730C0F] via-[#560406] to-[#3A0204] hover:brightness-110 text-[#F5E6D3] text-xs font-bold uppercase tracking-wider shadow-md transition cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <Sparkles className="w-4 h-4 text-[#DFBE7E]" />
                  <span>{modalSubmitting ? 'Registering...' : 'Complete Registration →'}</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Legal Modal */}
      <LegalModal
        isOpen={showLegal}
        onClose={() => setShowLegal(false)}
        initialDoc={legalInitialDoc}
      />

    </div>
  );
};
