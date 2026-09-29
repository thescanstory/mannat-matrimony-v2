import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Check,
  X,
  ArrowRight,
  ExternalLink,
  Menu,
  Lock,
  MapPin,
  Briefcase
} from 'lucide-react';
import { type UserSession } from '../services/authService';
import { LegalModal, type LegalDocType } from './LegalModal';
import { profileService } from '../services/profileService';
import type { Profile } from '../types';
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

  // Hero Preference Bar State
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

  // Real candidate profiles from Supabase / database
  const [showcaseProfiles, setShowcaseProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    let isMounted = true;
    profileService.getProfiles().then((list) => {
      if (isMounted) {
        setShowcaseProfiles(list.slice(0, 4));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Four Core Principles
  const matchmakingPillars = [
    {
      title: 'Mandatory Government ID & Background Check',
      badge: '100% Verified Community',
      subtitle: 'Integrity & Authenticity',
      description: 'Every applicant undergoes mandatory government identity verification and employment vetting to maintain an authentic, respectful network.',
      highlight: 'Government ID verification before profile activation'
    },
    {
      title: 'BlurShield™ Photo & Contact Privacy',
      badge: 'Privacy by Design',
      subtitle: 'Zero Public Indexing',
      description: 'Your portraits, contact numbers, and family details are never exposed to public search engines. Photos are revealed exclusively upon mutual interest.',
      highlight: 'Photos unblurred strictly upon mutual consent'
    },
    {
      title: 'Elder-Friendly WhatsApp Bio-Data Dossiers',
      badge: 'Family-Centered Alliances',
      subtitle: 'Dignified Sharing',
      description: 'Generate clean, verified bio-data cards and horoscopes formatted specifically for sharing with parents and elders over WhatsApp.',
      highlight: '1-Click WhatsApp alliance dossiers'
    },
    {
      title: 'Bespoke Relationship Advisory',
      badge: 'Human Matchmaking',
      subtitle: 'Personalized Care',
      description: 'Experience human-led guidance where dedicated matchmaking advisors understand your lifestyle, intellectual wavelength, and family background.',
      highlight: 'Direct guidance from dedicated relationship advisors'
    }
  ];

  // Frequently Asked Questions
  const faqs = [
    {
      q: 'How does Mannat ensure profile authenticity?',
      a: 'Unlike open social platforms, every candidate on Mannat must provide official government-issued ID verification and basic education/employment confirmation before their bio-data is recommended to other members.'
    },
    {
      q: 'Can parents or family elders register on behalf of a son or daughter?',
      a: 'Yes. Over 60% of our candidate profiles are managed by parents or family elders. You can select "Son", "Daughter", "Brother", or "Sister" during registration to enable Parent Mode with simplified WhatsApp dossier sharing.'
    },
    {
      q: 'How does BlurShield™ protect our privacy and photos?',
      a: 'BlurShield™ ensures that portraits are never indexed on Google or visible to unauthorized visitors. Candidate photos remain discreetly blurred until you mutually approve an alliance request.'
    },
    {
      q: 'Is it free to create a bio-data and explore matches?',
      a: 'Yes. Creating your bio-data, exploring verified candidate profiles, and checking horoscope compatibility scores is completely free. Optional membership tiers are available when you wish to initiate direct phone contact.'
    },
    {
      q: 'How do I log in to my existing account?',
      a: 'Click "Log In" in the top navigation bar. You can sign in using Google, Apple ID, or your registered email address without needing to download an app.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#241E19] selection:bg-[#560406]/15 selection:text-[#560406] font-sans antialiased overflow-x-hidden pt-16 sm:pt-20">
      
      {/* 0. Top iOS App Banner */}
      <AnimatePresence>
        {showTopAppBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[60] bg-[#2E0507] text-[#EDE4DA] text-[11px] sm:text-xs py-2 px-4 border-b border-[#560406] flex items-center justify-between shadow-xs"
          >
            <div className="flex-1 text-center flex items-center justify-center gap-2">
              <span className="inline-block bg-[#DFBE7E]/20 text-[#DFBE7E] px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold border border-[#DFBE7E]/30">
                Official iOS App
              </span>
              <span className="hidden sm:inline text-neutral-300">Mannat Matrimony is available on the App Store.</span>
              <a
                href="https://apps.apple.com/app/id6812288373"
                target="_blank"
                rel="noreferrer"
                className="text-[#DFBE7E] hover:text-white font-semibold underline underline-offset-2 inline-flex items-center gap-1 ml-1"
              >
                <span>Download for iPhone</span>
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

      {/* 1. Header (Classic Editorial Navigation) */}
      <header className={`fixed left-0 right-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DDD0] shadow-xs transition-all duration-300 ${showTopAppBanner ? 'top-8 sm:top-9' : 'top-0'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Brand Logo */}
            <a href="/" className="flex items-center gap-3.5 group shrink-0">
              <img
                src="/images/mannat-logo-square.png"
                alt="Mannat Matrimony"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover shadow-xs ring-1 ring-[#560406]/15"
              />
              <div className="flex flex-col text-left">
                <span className="text-xs sm:text-sm italic font-normal text-[#560406] -mb-1 leading-none" style={{ fontFamily: "'Pinyon Script', cursive" }}>
                  At
                </span>
                <span className="font-normal text-xl sm:text-2xl tracking-[0.22em] uppercase text-[#560406] leading-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  MANNAT
                </span>
                <span className="text-[7px] uppercase tracking-[0.3em] font-semibold text-[#8C7355] -mt-0.5">
                  Bespoke Matchmaking
                </span>
              </div>
            </a>

            {/* Editorial Nav Links */}
            <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-[#5A4F46]">
              <a href="#showcase" className="hover:text-[#560406] transition-colors py-1">
                Verified Profiles
              </a>
              <a href="#principles" className="hover:text-[#560406] transition-colors py-1">
                Why Mannat
              </a>
              <a href="#pricing" className="hover:text-[#560406] transition-colors py-1">
                Membership
              </a>
              <a href="#faq" className="hover:text-[#560406] transition-colors py-1">
                FAQ
              </a>
            </nav>

            {/* Right Action CTAs */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleOpenLogin}
                className="px-3.5 py-2 text-xs font-semibold text-[#560406] hover:bg-[#560406]/5 rounded-full transition cursor-pointer"
              >
                Log In
              </button>

              <button
                type="button"
                onClick={() => handleOpenRegister('Myself')}
                className="px-5 py-2.5 rounded-full bg-[#560406] hover:bg-[#6D090C] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider shadow-xs transition cursor-pointer"
              >
                Register Free
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-[#560406] hover:bg-[#560406]/5 cursor-pointer"
                aria-label="Open menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
              className="md:hidden bg-[#FAF7F2] border-b border-[#E8DDD0] px-4 py-4 space-y-3"
            >
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); handleOpenLogin(); }}
                  className="p-3 bg-white rounded-xl border border-[#E8DDD0] text-[#560406] text-center cursor-pointer"
                >
                  Member Log In
                </button>
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); handleOpenRegister('Myself'); }}
                  className="p-3 bg-[#560406] rounded-xl text-[#FAF7F2] text-center cursor-pointer"
                >
                  Register Free
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. HERO: Warm Editorial Indian Luxury */}
      <section className="relative bg-[#2B0305] text-[#FAF7F2] pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.25em] text-[#DFBE7E]">
              Private Matrimonial Alliance Network
            </span>

            <h1
              className="text-3xl sm:text-5xl lg:text-[54px] font-normal text-white leading-[1.18] tracking-tight"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Find Your Forever with Verified Matrimonial Matches
            </h1>

            <p className="text-sm sm:text-base text-[#E2D6CA] leading-relaxed max-w-2xl mx-auto font-normal">
              A refined matrimonial service tailored for modern Indian candidates and families. 
              Browse verified candidate bio-datas protected by BlurShield™ privacy controls and direct WhatsApp family sharing.
            </p>
          </div>

          {/* Clean Preference Search Bar */}
          <div className="bg-white text-[#241E19] p-3 sm:p-4 rounded-2xl sm:rounded-full shadow-xl border border-[#DFBE7E]/30 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-center text-left">
              
              {/* Gender */}
              <div className="col-span-1 px-3 sm:border-r border-[#E8DDD0]">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C7355]">
                  Seeking
                </label>
                <select
                  value={heroGender}
                  onChange={(e) => setHeroGender(e.target.value as any)}
                  className="w-full text-xs sm:text-sm font-semibold text-[#560406] bg-transparent focus:outline-hidden cursor-pointer"
                >
                  <option value="female">Woman</option>
                  <option value="male">Man</option>
                </select>
              </div>

              {/* Age Range */}
              <div className="col-span-1 px-3 sm:border-r border-[#E8DDD0]">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C7355]">
                  Age Range
                </label>
                <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#241E19]">
                  <select
                    value={heroAgeMin}
                    onChange={(e) => setHeroAgeMin(e.target.value)}
                    className="bg-transparent focus:outline-hidden cursor-pointer"
                  >
                    {[20, 21, 22, 23, 24, 25, 26, 27, 28, 30, 32].map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                  <span className="text-neutral-400 font-normal">to</span>
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
              <div className="col-span-1 px-3 sm:border-r border-[#E8DDD0]">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C7355]">
                  Religion
                </label>
                <select
                  value={heroReligion}
                  onChange={(e) => setHeroReligion(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold text-[#241E19] bg-transparent focus:outline-hidden cursor-pointer"
                >
                  <option value="Select">Any Religion</option>
                  <option value="Christian">Christian</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Jain">Jain</option>
                  <option value="Parsi">Parsi</option>
                </select>
              </div>

              {/* Mother Tongue */}
              <div className="col-span-1 px-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C7355]">
                  Mother Tongue
                </label>
                <select
                  value={heroCommunity}
                  onChange={(e) => setHeroCommunity(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold text-[#241E19] bg-transparent focus:outline-hidden cursor-pointer"
                >
                  <option value="Select">Any Language</option>
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

              {/* Action */}
              <div className="col-span-2 sm:col-span-1">
                <button
                  type="button"
                  onClick={() => handleOpenRegister('Myself')}
                  className="w-full py-3 px-5 rounded-full bg-[#560406] hover:bg-[#6D090C] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Let's Begin</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#DFBE7E]" />
                </button>
              </div>

            </div>
          </div>

          {/* 3 Grounded Trust Assurances */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-2 text-left">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#E2D6CA] space-y-1">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#DFBE7E]" />
                <span>Verified Identities</span>
              </div>
              <p className="text-[11px] text-[#C2B5A8]">Mandatory government ID checking for every candidate.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#E2D6CA] space-y-1">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#DFBE7E]" />
                <span>BlurShield™ Privacy</span>
              </div>
              <p className="text-[11px] text-[#C2B5A8]">Photos remain private and are unblurred upon mutual consent.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#E2D6CA] space-y-1">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#DFBE7E]" />
                <span>Confidential Alliances</span>
              </div>
              <p className="text-[11px] text-[#C2B5A8]">Zero public indexing on search engines. Dignified introductions.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. VERIFIED PROFILES SHOWCASE */}
      <section id="showcase" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10 sm:mb-12">
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#8C7355] block">
            Curated Alliances
          </span>
          <h2 className="text-2xl sm:text-4xl font-normal text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Explore Verified Candidate Bio-Datas
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6259]">
            Every applicant is vetted. Create your profile or log in to view complete details and initiate direct conversation.
          </p>
        </div>

        {showcaseProfiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {showcaseProfiles.map((p) => (
              <div
                key={p.id}
                onClick={() => handleOpenRegister('Myself')}
                className="bg-white rounded-2xl overflow-hidden border border-[#E8DDD0] shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
              >
                {/* Photo with BlurShield */}
                <div className="relative aspect-[4/5] bg-neutral-900 overflow-hidden">
                  <img
                    src={p.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'}
                    alt={p.display_name}
                    className="w-full h-full object-cover filter blur-[2px] scale-102 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  
                  {/* Verified Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 text-[#560406] px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3 h-3 text-[#560406]" />
                    <span>Verified</span>
                  </div>

                  {/* Compatibility Score */}
                  <div className="absolute top-3 right-3 bg-[#560406]/90 text-[#DFBE7E] px-2 py-0.5 rounded-full text-[10px] font-semibold border border-[#DFBE7E]/30">
                    {p.compatibility_score || 95}% Match
                  </div>

                  {/* Bottom Bio Overlay */}
                  <div className="absolute bottom-3 inset-x-3 text-white text-left space-y-0.5">
                    <div className="text-lg font-bold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                      {p.display_name}, <span className="font-sans text-xs font-normal text-neutral-300">{p.age} yrs</span>
                    </div>
                    <div className="text-[11px] text-[#DFBE7E] font-medium flex items-center gap-1 truncate">
                      <Briefcase className="w-3 h-3 shrink-0" />
                      <span>{p.occupation || 'Professional'}</span>
                    </div>
                    <div className="text-[10px] text-neutral-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span>{p.city} · {p.religion}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-3.5 bg-[#FAF7F2] border-t border-[#E8DDD0] flex items-center justify-between text-xs font-semibold text-[#560406]">
                  <span className="flex items-center gap-1 text-[11px] text-[#8C7355]">
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
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-[#E8DDD0] max-w-xl mx-auto text-center space-y-3">
            <h3 className="text-xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Private Verified Directory
            </h3>
            <p className="text-xs text-[#6E6259]">
              Candidate profiles are protected under BlurShield™ privacy. Register or log in to explore matching candidates.
            </p>
            <button
              type="button"
              onClick={() => handleOpenRegister('Myself')}
              className="mt-2 px-6 py-2.5 rounded-full bg-[#560406] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Register Free to View Matches
            </button>
          </div>
        )}

        <div className="text-center pt-8">
          <button
            type="button"
            onClick={() => handleOpenRegister('Myself')}
            className="px-6 py-3 rounded-full bg-white hover:bg-[#F2EAE0] text-[#560406] border border-[#560406] text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-2xs"
          >
            Explore Complete Directory →
          </button>
        </div>
      </section>

      {/* 4. FOUR PILLARS OF DISTINCTION */}
      <section id="principles" className="py-16 sm:py-20 bg-[#F2EAE0]/70 border-y border-[#E8DDD0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12 sm:mb-14">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#8C7355] block">
              Core Principles
            </span>
            <h2 className="text-2xl sm:text-4xl font-normal text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Why Discerning Families Choose Mannat
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matchmakingPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DDD0] shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#8C7355] bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#E8DDD0]">
                      {pillar.badge}
                    </span>
                    <span className="text-xs font-serif italic text-[#8C7355]">0{idx + 1}</span>
                  </div>

                  <h3 className="text-xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#6E6259] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8DDD0] text-xs font-semibold text-[#560406] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0" />
                  <span>{pillar.highlight}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. MEMBERSHIP & INVESTMENT PLANS (1, 3, 6, 12 Months) */}
      <section id="pricing" className="py-16 sm:py-24 bg-[#FAF7F2] border-t border-[#E8DDD0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12 sm:mb-14">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#8C7355] block">
              Transparent Membership
            </span>
            <h2 className="text-2xl sm:text-4xl font-normal text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Membership &amp; Subscription Plans
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6259]">
              100% Free bio-data registration &amp; match discovery. Choose a duration tier whenever you wish to initiate direct contact.
            </p>
          </div>

          {/* 4 Clean Duration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Plan 1: 1 Month */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8DDD0] shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#6E6259] bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#E8DDD0]">
                  Silver Tier
                </span>
                <div>
                  <h3 className="text-xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    1 Month
                  </h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold text-[#241E19]">₹1,499</span>
                    <span className="text-xs text-[#8C7355] font-medium">/ 30 Days</span>
                  </div>
                  <p className="text-xs text-[#6E6259] mt-2 leading-relaxed">
                    Essential plan to quickly reach out and initiate direct conversations.
                  </p>
                </div>

                <div className="border-t border-[#E8DDD0] pt-4 space-y-2.5 text-xs text-[#241E19]">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#560406] shrink-0 mt-0.5" />
                    <span><strong>15 Direct Contacts</strong> unlock</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#560406] shrink-0 mt-0.5" />
                    <span>Direct chat messaging</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#560406] shrink-0 mt-0.5" />
                    <span>Mobile phone number &amp; WhatsApp access</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenRegister('Myself')}
                className="w-full py-2.5 rounded-full border border-[#560406] text-[#560406] hover:bg-[#560406] hover:text-[#FAF7F2] text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Choose 1 Month
              </button>
            </div>

            {/* Plan 2: 3 Months */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8DDD0] shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C7355] bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#E8DDD0]">
                  Gold Tier
                </span>
                <div>
                  <h3 className="text-xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    3 Months
                  </h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold text-[#241E19]">₹4,499</span>
                    <span className="text-xs text-[#8C7355] font-medium">/ 90 Days</span>
                  </div>
                  <p className="text-xs text-[#6E6259] mt-2 leading-relaxed">
                    Complete quarterly access with advanced verified credentials.
                  </p>
                </div>

                <div className="border-t border-[#E8DDD0] pt-4 space-y-2.5 text-xs text-[#241E19]">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#560406] shrink-0 mt-0.5" />
                    <span><strong>50 Direct Contacts</strong> unlock</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#560406] shrink-0 mt-0.5" />
                    <span>Verified income &amp; education credential access</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#560406] shrink-0 mt-0.5" />
                    <span>1-Click WhatsApp family alliance cards</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenRegister('Myself')}
                className="w-full py-2.5 rounded-full border border-[#560406] text-[#560406] hover:bg-[#560406] hover:text-[#FAF7F2] text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Choose 3 Months
              </button>
            </div>

            {/* Plan 3: 6 Months (Most Popular) */}
            <div className="bg-[#2B0305] text-[#FAF7F2] rounded-2xl p-6 sm:p-7 border-2 border-[#DFBE7E] shadow-lg flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#DFBE7E] text-[#2B0305] text-[9px] font-bold uppercase tracking-widest py-1 px-3 rounded-bl-lg">
                ★ Most Popular
              </div>

              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#DFBE7E] bg-white/10 px-3 py-1 rounded-full border border-[#DFBE7E]/30">
                  Diamond VIP
                </span>
                <div>
                  <h3 className="text-xl font-bold text-[#DFBE7E]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    6 Months
                  </h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold text-white">₹6,499</span>
                    <span className="text-xs text-[#DFBE7E] font-medium">/ 180 Days</span>
                  </div>
                  <p className="text-xs text-[#E2D6CA] mt-2 leading-relaxed">
                    Our premier semi-annual plan with prioritized search ranking.
                  </p>
                </div>

                <div className="border-t border-white/20 pt-4 space-y-2.5 text-xs text-[#E2D6CA]">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#DFBE7E] shrink-0 mt-0.5" />
                    <span><strong>60 Direct Contacts</strong> allocation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#DFBE7E] shrink-0 mt-0.5" />
                    <span><strong>Priority Search Ranking</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#DFBE7E] shrink-0 mt-0.5" />
                    <span>In-app secure voice &amp; video calling</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenRegister('Myself')}
                className="w-full py-3 rounded-full bg-[#DFBE7E] hover:bg-[#EADBBE] text-[#2B0305] text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Choose 6 Months
              </button>
            </div>

            {/* Plan 4: 12 Months */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8DDD0] shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C7355] bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#E8DDD0]">
                  Platinum VIP
                </span>
                <div>
                  <h3 className="text-xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    12 Months
                  </h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold text-[#241E19]">₹10,999</span>
                    <span className="text-xs text-[#8C7355] font-medium">/ 365 Days</span>
                  </div>
                  <p className="text-xs text-[#6E6259] mt-2 leading-relaxed">
                    Full year high-volume quota with dedicated relationship advisory.
                  </p>
                </div>

                <div className="border-t border-[#E8DDD0] pt-4 space-y-2.5 text-xs text-[#241E19]">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#560406] shrink-0 mt-0.5" />
                    <span><strong>300+ Direct Contacts</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#560406] shrink-0 mt-0.5" />
                    <span><strong>1-Year Spotlight</strong> pinned ranking</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#560406] shrink-0 mt-0.5" />
                    <span>Dedicated relationship advisory</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenRegister('Myself')}
                className="w-full py-2.5 rounded-full bg-[#560406] hover:bg-[#6D090C] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Choose 12 Months
              </button>
            </div>

          </div>

          {/* Plan Comparison Table */}
          <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DDD0] shadow-xs">
            <div className="text-center max-w-xl mx-auto mb-6">
              <h4 className="text-lg font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                Plan Comparison
              </h4>
              <p className="text-xs text-[#6E6259]">
                Compare features across all 4 duration options
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E8DDD0] text-[#560406] font-bold">
                    <th className="pb-3 pr-4">Duration</th>
                    <th className="pb-3 px-4">Price</th>
                    <th className="pb-3 px-4">Contact Quota</th>
                    <th className="pb-3 pl-4">Key Inclusions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DDD0]/60 text-[#241E19]">
                  <tr>
                    <td className="py-3 pr-4 font-bold text-[#560406]">1 Month (Silver)</td>
                    <td className="py-3 px-4 font-bold">₹1,499</td>
                    <td className="py-3 px-4">15 Contacts</td>
                    <td className="py-3 pl-4 text-[#6E6259]">Direct chat messaging, mobile phone access</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-bold text-[#560406]">3 Months (Gold)</td>
                    <td className="py-3 px-4 font-bold">₹4,499</td>
                    <td className="py-3 px-4">50 Contacts</td>
                    <td className="py-3 pl-4 text-[#6E6259]">Verified info access, voice &amp; video calling</td>
                  </tr>
                  <tr className="bg-[#FAF5EF]">
                    <td className="py-3 pr-4 font-extrabold text-[#560406]">6 Months (Diamond VIP ★)</td>
                    <td className="py-3 px-4 font-extrabold text-[#560406]">₹6,499</td>
                    <td className="py-3 px-4 font-bold">60 Contacts</td>
                    <td className="py-3 pl-4 text-[#241E19] font-semibold">Priority search ranking over standard profiles</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-bold text-[#560406]">12 Months (Platinum VIP)</td>
                    <td className="py-3 px-4 font-bold">₹10,999</td>
                    <td className="py-3 px-4 font-bold">300+ Contacts</td>
                    <td className="py-3 pl-4 text-[#6E6259]">Full-year Spotlight, dedicated relationship advisory</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment Assurance */}
            <div className="mt-6 pt-4 border-t border-[#E8DDD0] flex flex-wrap items-center justify-between gap-4 text-[11px] text-[#8C7355]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#560406]" />
                <span>100% Encrypted &amp; Secure Checkout</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[#560406]">Supported Methods:</span>
                <span>UPI (GPay / PhonePe / Paytm)</span>
                <span>•</span>
                <span>Net Banking</span>
                <span>•</span>
                <span>Cards</span>
                <span>•</span>
                <span>Apple In-App Purchases</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. FAQ */}
      <section id="faq" className="py-14 sm:py-20 bg-[#FAF7F2] border-t border-[#E8DDD0]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-2 mb-8 sm:mb-10">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#8C7355] block">
              Clear &amp; Transparent
            </span>
            <h2 className="text-2xl sm:text-3xl font-normal text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 font-semibold text-xs sm:text-sm text-[#241E19] hover:text-[#560406] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#8C7355] transition-transform duration-200 shrink-0 ${openFaq === idx ? 'rotate-180' : ''}`} />
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

      {/* 7. BOTTOM ACTION BANNER */}
      <section className="bg-[#2B0305] text-[#FAF7F2] py-14 px-4 text-center space-y-4 border-t border-[#560406]">
        <h2 className="text-2xl sm:text-4xl font-normal text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          Begin Your Matrimonial Journey
        </h2>
        <p className="text-xs sm:text-sm text-[#E2D6CA] max-w-lg mx-auto">
          Log in with your existing account or register free to explore verified matches.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleOpenRegister('Myself')}
            className="px-6 py-3 rounded-full bg-[#DFBE7E] hover:bg-[#EADBBE] text-[#2B0305] text-xs font-bold uppercase tracking-wider shadow-sm transition cursor-pointer"
          >
            Register Free
          </button>
          <button
            type="button"
            onClick={handleOpenLogin}
            className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/20 transition cursor-pointer"
          >
            Member Log In
          </button>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-[#1D0203] text-[#A89F91] py-10 px-4 sm:px-6 lg:px-8 text-xs border-t border-[#3B0406]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
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
        <div className="max-w-6xl mx-auto text-[11px] text-[#6E6259] pt-4 mt-4 border-t border-white/10 text-center sm:text-left">
          &copy; 2026 The House of Mannat. Confidential matrimonial alliance network. All rights reserved.
        </div>
      </footer>

      {/* Registration & Login Modal */}
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
