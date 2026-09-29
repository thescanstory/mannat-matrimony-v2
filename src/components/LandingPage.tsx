import React, { useState } from 'react';
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
  MapPin,
  Briefcase,
  LogIn
} from 'lucide-react';
import { type UserSession } from '../services/authService';
import { LegalModal, type LegalDocType } from './LegalModal';
import { INITIAL_CURATED_PROFILES } from '../services/profileService';
import { RegistrationFlowModal } from './RegistrationFlowModal';

interface LandingPageProps {
  onOpenApp?: (initialView?: 'onboarding' | 'auth' | 'home') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenApp }) => {
  // Navigation & Modal States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [legalInitialDoc, setLegalInitialDoc] = useState<LegalDocType>('privacy');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showTopAppBanner, setShowTopAppBanner] = useState(true);

  // Multi-Step Registration & Login Flow Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'register' | 'login'>('register');
  const [authModalProfileFor, setAuthModalProfileFor] = useState('Myself');

  // Hero Quick Finder State
  const [heroGender, setHeroGender] = useState<'female' | 'male'>('female');
  const [heroAgeMin, setHeroAgeMin] = useState('21');
  const [heroAgeMax, setHeroAgeMax] = useState('27');
  const [heroReligion, setHeroReligion] = useState('Select');
  const [heroCommunity, setHeroCommunity] = useState('Select');

  const navigateToApp = (view: 'onboarding' | 'auth' | 'home' = 'home') => {
    if (onOpenApp) {
      onOpenApp(view);
    } else if (typeof window !== 'undefined') {
      window.location.href = `/app?view=${view}`;
    }
  };

  const handleOpenRegister = (profileForChoice: string = 'Myself') => {
    setAuthModalProfileFor(profileForChoice);
    setAuthModalMode('register');
    setAuthModalOpen(true);
  };

  const handleOpenLogin = () => {
    setAuthModalMode('login');
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (_session?: UserSession) => {
    setAuthModalOpen(false);
    navigateToApp('home');
  };

  // Top Curated Showcase Profiles
  const showcaseProfiles = INITIAL_CURATED_PROFILES.filter(p => p.id !== 'appreview-demo-user-id').slice(0, 4);

  // 4 Pillars of Distinction
  const matchmakingPillars = [
    {
      title: 'Mandatory Identity & Credential Vetting',
      badge: '100% Verified Candidates',
      subtitle: 'Integrity First',
      description: 'Every applicant undergoes mandatory government ID and professional credential checks to ensure an exclusive, authentic community.',
      highlight: 'Government ID & Professional Credential Check',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'BlurShield™ Photo & Contact Privacy',
      badge: 'Privacy-First Architecture',
      subtitle: 'Zero Public Search Indexing',
      description: 'Your portraits, contact numbers, and confidential family details remain protected. Photos are never indexed on Google and are unblurred strictly upon mutual interest.',
      highlight: 'Controlled Unblurring upon Mutual Consent',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'WhatsApp Family Bio-Data Dossiers',
      badge: 'Dignified Introductions',
      subtitle: 'Elder-Friendly Design',
      description: 'Instantly generate elegant, verified bio-data cards and horoscopes formatted specifically for sharing with family elders and decision-makers over WhatsApp.',
      highlight: '1-Click WhatsApp Alliance Cards',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Dedicated Matchmaking Concierge',
      badge: 'Personalized Support',
      subtitle: 'Bespoke Advisory',
      description: 'Experience human-led matchmaking where dedicated relationship advisors understand your lifestyle, intellectual wavelength, and family background.',
      highlight: 'Direct Human Advisory & Curated Introductions',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800'
    }
  ];

  // FAQs
  const faqs = [
    {
      q: 'How do I log in to my account on the website?',
      a: 'You can log in directly on this website in 1 click using Google, Apple ID, or your registered Email address in the "Member Log In" box above. No app installation is required to browse and manage your bio-data.'
    },
    {
      q: 'How do I register a new profile on the website?',
      a: 'Click the "Register Free" tab in the hero card above, enter your name, email, and phone number, and click "Create Profile". You will immediately be guided through a simple 2-minute setup to add your photo and partner preferences.'
    },
    {
      q: 'Can parents or family members manage the account?',
      a: 'Yes! Over 60% of our candidate profiles are managed by parents or family elders. Select "Son" or "Daughter" during registration to activate Parent Mode with larger text and direct WhatsApp family sharing.'
    },
    {
      q: 'How does BlurShield™ protect our privacy?',
      a: 'BlurShield™ ensures your portraits and phone numbers are never indexed on Google. Candidate photos remain discreetly blurred until you mutually approve an alliance request.'
    },
    {
      q: 'Is it free to join and view profiles?',
      a: 'Yes! Creating your bio-data and exploring matching verified profiles is completely free. We also offer optional VIP memberships for extended contact quotas and concierge advisory.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#161412] selection:bg-[#560406]/20 selection:text-[#560406] font-sans overflow-x-hidden pt-16 sm:pt-20">
      
      {/* 0. Top Smart Announcement */}
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
              <span className="hidden sm:inline">Mannat Matrimony is live on the Apple App Store.</span>
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
              aria-label="Dismiss"
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
              <button
                type="button"
                onClick={handleOpenLogin}
                className="hover:text-[#560406] transition cursor-pointer font-bold"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => handleOpenRegister('Myself')}
                className="hover:text-[#560406] transition cursor-pointer font-bold text-[#560406]"
              >
                Register Free
              </button>
              <a href="#showcase" className="hover:text-[#560406] transition">Verified Profiles</a>
              <a href="#pillars" className="hover:text-[#560406] transition">Why Mannat</a>
              <a href="#faq" className="hover:text-[#560406] transition">FAQ</a>
            </nav>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleOpenLogin}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full border border-[#560406] text-xs font-bold text-[#560406] hover:bg-[#560406] hover:text-[#F5E6D3] transition cursor-pointer shadow-2xs active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenRegister('Myself')}
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#730C0F] via-[#560406] to-[#3A0204] hover:brightness-110 text-[#F5E6D3] border border-[#A17B5E]/60 text-xs font-bold tracking-wide shadow-md transition cursor-pointer whitespace-nowrap active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#DFBE7E]" />
                <span>Register Free</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#DFBE7E]" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-[#560406] hover:bg-[#560406]/10 transition-colors cursor-pointer"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Nav Sheet */}
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
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleOpenLogin();
                  }}
                  className="p-3 bg-white rounded-xl border border-[#560406]/30 text-[#560406] font-extrabold text-left flex items-center justify-between cursor-pointer"
                >
                  <span>🔐 Member Log In</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleOpenRegister('Myself');
                  }}
                  className="p-3 bg-white rounded-xl border border-[#560406]/30 text-[#560406] font-extrabold text-left flex items-center justify-between cursor-pointer"
                >
                  <span>✨ Register Free</span>
                </button>
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

      {/* 2. HERO: MATCHMAKING SEARCH & FAST REGISTRATION */}
      <section className="relative bg-gradient-to-b from-[#240103] via-[#3A0204] to-[#1C0102] text-white pt-10 sm:pt-14 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Golden Radial Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#DFBE7E]/15 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-8 text-center">
          
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#DFBE7E]/10 border border-[#DFBE7E]/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#DFBE7E] tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#DFBE7E]" />
              <span>India's Intention-First Private Matrimonial Network</span>
            </div>

            <h1
              className="text-3xl sm:text-5xl lg:text-[52px] font-normal text-white tracking-[0.01em] leading-[1.15]"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
            >
              Find Your Forever with Verified Matrimonial Matches
            </h1>

            <p className="text-xs sm:text-base text-[#F4EAE0] leading-relaxed max-w-2xl mx-auto font-normal">
              Over 20 Lakh Success Stories. Register in 4 simple steps to browse verified bio-datas with BlurShield™ privacy controls and direct WhatsApp family sharing.
            </p>
          </div>

          {/* Quick Matchmaking Finder Horizontal Bar (Matching screenshot background) */}
          <div className="bg-white/95 backdrop-blur-md text-[#161412] p-3 sm:p-4 rounded-2xl sm:rounded-full shadow-2xl border border-[#E8DDD0] max-w-5xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 items-center">
              
              {/* Looking for */}
              <div className="col-span-1 text-left px-2 sm:px-3 sm:border-r border-gray-200">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  I'm looking for a
                </label>
                <select
                  value={heroGender}
                  onChange={(e) => setHeroGender(e.target.value as any)}
                  className="w-full text-xs sm:text-sm font-bold text-[#560406] bg-transparent focus:outline-hidden cursor-pointer"
                >
                  <option value="female">Woman</option>
                  <option value="male">Man</option>
                </select>
              </div>

              {/* Age Range */}
              <div className="col-span-1 text-left px-2 sm:px-3 sm:border-r border-gray-200">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  aged
                </label>
                <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-gray-800">
                  <select
                    value={heroAgeMin}
                    onChange={(e) => setHeroAgeMin(e.target.value)}
                    className="bg-transparent focus:outline-hidden cursor-pointer"
                  >
                    {[20, 21, 22, 23, 24, 25, 26, 27, 28, 30, 32].map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                  <span className="text-gray-400 font-normal text-xs">to</span>
                  <select
                    value={heroAgeMax}
                    onChange={(e) => setHeroAgeMax(e.target.value)}
                    className="bg-transparent focus:outline-hidden cursor-pointer"
                  >
                    {[24, 25, 26, 27, 28, 29, 30, 32, 35, 40].map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Religion */}
              <div className="col-span-1 text-left px-2 sm:px-3 sm:border-r border-gray-200">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  of religion
                </label>
                <select
                  value={heroReligion}
                  onChange={(e) => setHeroReligion(e.target.value)}
                  className="w-full text-xs sm:text-sm font-bold text-gray-800 bg-transparent focus:outline-hidden cursor-pointer"
                >
                  <option value="Select">Select Religion</option>
                  <option value="Christian">Christian</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Jain">Jain</option>
                  <option value="Parsi">Parsi</option>
                </select>
              </div>

              {/* Community / Mother Tongue */}
              <div className="col-span-1 text-left px-2 sm:px-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  and mother tongue
                </label>
                <select
                  value={heroCommunity}
                  onChange={(e) => setHeroCommunity(e.target.value)}
                  className="w-full text-xs sm:text-sm font-bold text-gray-800 bg-transparent focus:outline-hidden cursor-pointer"
                >
                  <option value="Select">Select Language</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Punjabi">Punjabi</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Kannada">Kannada</option>
                </select>
              </div>

              {/* Action Button: "Let's Begin" */}
              <div className="col-span-2 sm:col-span-1">
                <button
                  type="button"
                  onClick={() => handleOpenRegister('Myself')}
                  className="w-full py-3 px-6 rounded-full bg-[#00B4C6] hover:bg-[#009dae] text-white text-sm font-extrabold uppercase tracking-wide shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Let's Begin</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

          {/* Quick Dual Cards: 1-Click Register & Member Sign In */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => handleOpenRegister('Myself')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#DFBE7E] via-[#E8DDD0] to-[#DFBE7E] text-[#1C0102] font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-105 transition active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#1C0102]" />
              <span>Create Profile in 4 Steps (Free)</span>
            </button>

            <button
              type="button"
              onClick={handleOpenLogin}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition active:scale-95 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-[#DFBE7E]" />
              <span>Existing Member Log In</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-4 text-left">
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <CheckCircle2 className="w-5 h-5 text-[#DFBE7E] shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">100% Verified Members</div>
                <div className="text-[10px] text-neutral-300">Mandatory Government ID verification</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <ShieldCheck className="w-5 h-5 text-[#DFBE7E] shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">BlurShield™ Privacy</div>
                <div className="text-[10px] text-neutral-300">Zero search engine photo indexing</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <Crown className="w-5 h-5 text-[#DFBE7E] shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">Family WhatsApp Cards</div>
                <div className="text-[10px] text-neutral-300">Designed for parents &amp; match-seekers</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. VERIFIED PROFILES SHOWCASE */}
      <section id="showcase" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-8 sm:mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-[#A17B5E] block">
            Curated Directory
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Explore Verified Candidate Profiles
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6259]">
            Every candidate is screened with mandatory ID and education credentials. Log in or register free to view full biodatas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {showcaseProfiles.map((p) => (
            <div
              key={p.id}
              onClick={() => handleOpenRegister('Myself')}
              className="bg-white rounded-2xl overflow-hidden border border-[#E8DDD0] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              {/* Photo with BlurShield */}
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

                {/* Match Score */}
                <div className="absolute top-3 right-3 bg-[#560406]/90 text-[#DFBE7E] px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#DFBE7E]/40">
                  ★ {p.compatibility_score}% Match
                </div>

                {/* Bottom Bio Overlay */}
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

              {/* Card Footer */}
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
            onClick={() => handleOpenRegister('Myself')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#F4EAE0] text-[#560406] border border-[#560406] text-xs font-extrabold uppercase tracking-wider transition cursor-pointer shadow-xs"
          >
            <span>Explore Complete Verified Directory →</span>
          </button>
        </div>
      </section>

      {/* 4. FOUR PILLARS */}
      <section id="pillars" className="py-14 sm:py-20 bg-[#F4EAE0]/60 border-y border-[#E8DDD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-10 sm:mb-14">
            <span className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-[#A17B5E] block">
              Core Principles
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Why Discerning Families Choose Mannat
            </h2>
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

      {/* 5. FAQ */}
      <section id="faq" className="py-12 sm:py-16 bg-[#FDFBF7] border-t border-[#E8DDD0]">
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

      {/* 6. BOTTOM ACTION BAR */}
      <section className="bg-gradient-to-r from-[#260102] via-[#560406] to-[#260102] text-white py-12 px-4 text-center space-y-4">
        <h2 className="text-2xl sm:text-4xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          Ready to Begin Your Matrimonial Journey?
        </h2>
        <p className="text-xs sm:text-sm text-[#F4EAE0] max-w-lg mx-auto">
          Log in with your existing account or register free to view verified matches.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleOpenRegister('Myself')}
            className="px-6 py-3 rounded-full bg-[#DFBE7E] hover:bg-[#E8DDD0] text-[#1C0102] text-xs font-black uppercase tracking-wider shadow-lg transition cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#1C0102]" />
            <span>Register Free in 4 Steps →</span>
          </button>
          <button
            type="button"
            onClick={handleOpenLogin}
            className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition cursor-pointer"
          >
            <span>Member Log In</span>
          </button>
        </div>
      </section>

      {/* 7. FOOTER */}
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

      {/* Multi-Step Registration & Login Flow Modal */}
      <RegistrationFlowModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authModalMode}
        initialProfileFor={authModalProfileFor}
        onOpenLegal={(type) => {
          setLegalInitialDoc(type === 'terms' ? 'terms' : 'privacy');
          setShowLegal(true);
        }}
      />

      {/* Legal Modal */}
      <LegalModal
        isOpen={showLegal}
        onClose={() => setShowLegal(false)}
        initialDoc={legalInitialDoc}
      />

    </div>
  );
};
