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
    <div className="min-h-screen bg-[#FAF7F2] text-[#241E19] selection:bg-[#560406]/15 selection:text-[#560406] font-sans antialiased overflow-x-hidden pt-20 sm:pt-28">
      
      {/* 0. Top iOS App Banner */}
      <AnimatePresence>
        {showTopAppBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[60] bg-[#2E0507] text-[#EDE4DA] text-[11px] sm:text-xs py-2.5 px-4 sm:px-6 border-b border-[#560406] flex items-center justify-between shadow-xs"
          >
            <div className="flex-1 text-center flex items-center justify-center gap-2">
              <span className="inline-block bg-[#DFBE7E]/20 text-[#DFBE7E] px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold border border-[#DFBE7E]/30">
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
              className="text-neutral-400 hover:text-white p-1 cursor-pointer rounded-md hover:bg-white/10 transition"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header (Classic Editorial Navigation) */}
      <header className={`fixed left-0 right-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DDD0] shadow-xs transition-all duration-300 ${showTopAppBanner ? 'top-9 sm:top-10' : 'top-0'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between h-18 sm:h-22">
            
            {/* Brand Logo */}
            <a href="/" className="flex items-center gap-3.5 group shrink-0">
              <img
                src="/images/mannat-logo-square.png"
                alt="Mannat Matrimony"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg object-cover shadow-xs ring-1 ring-[#560406]/15"
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
            <nav className="hidden md:flex items-center gap-9 text-xs font-semibold uppercase tracking-widest text-[#5A4F46]">
              <a href="#showcase" className="hover:text-[#560406] transition-colors py-1.5">
                Verified Profiles
              </a>
              <a href="#principles" className="hover:text-[#560406] transition-colors py-1.5">
                Why Mannat
              </a>
              <a href="#pricing" className="hover:text-[#560406] transition-colors py-1.5">
                Membership
              </a>
              <a href="#faq" className="hover:text-[#560406] transition-colors py-1.5">
                FAQ
              </a>
            </nav>

            {/* Right Action CTAs */}
            <div className="flex items-center gap-3.5 shrink-0">
              <button
                type="button"
                onClick={handleOpenLogin}
                className="px-4 py-2.5 text-xs font-semibold text-[#560406] hover:bg-[#560406]/5 rounded-full transition cursor-pointer"
              >
                Log In
              </button>

              <button
                type="button"
                onClick={() => handleOpenRegister('Myself')}
                className="px-6 py-2.5 rounded-full bg-[#560406] hover:bg-[#6D090C] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider shadow-xs transition cursor-pointer"
              >
                Register Free
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 rounded-lg text-[#560406] hover:bg-[#560406]/5 cursor-pointer"
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
              className="md:hidden bg-[#FAF7F2] border-b border-[#E8DDD0] px-6 py-5 space-y-3"
            >
              <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); handleOpenLogin(); }}
                  className="p-3.5 bg-white rounded-xl border border-[#E8DDD0] text-[#560406] text-center cursor-pointer"
                >
                  Member Log In
                </button>
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); handleOpenRegister('Myself'); }}
                  className="p-3.5 bg-[#560406] rounded-xl text-[#FAF7F2] text-center cursor-pointer"
                >
                  Register Free
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. HERO: Warm Editorial Indian Luxury with Indian Wedding Couple */}
      <section className="relative bg-[#2B0305] text-[#FAF7F2] pt-14 sm:pt-20 lg:pt-24 pb-20 sm:pb-28 lg:pb-32 px-6 sm:px-10 lg:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Headline, Copy, Preference Bar */}
            <div className="lg:col-span-7 space-y-8 sm:space-y-10 text-center lg:text-left">
              <div className="space-y-4 sm:space-y-5">
                <span className="inline-block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#DFBE7E]">
                  Private Matrimonial Alliance Network
                </span>

                <h1
                  className="text-3xl sm:text-5xl lg:text-[54px] font-normal text-white leading-[1.16] tracking-tight"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Find Your Forever with Verified Matrimonial Matches
                </h1>

                <p className="text-sm sm:text-base text-[#E2D6CA] leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                  A bespoke matrimonial service tailored for modern Indian candidates and families. 
                  Browse verified candidate bio-datas protected by BlurShield™ privacy controls and direct WhatsApp family sharing.
                </p>
              </div>

              {/* Preference Search Bar */}
              <div className="bg-white text-[#241E19] p-4 sm:p-5 lg:p-6 rounded-3xl shadow-2xl border border-[#DFBE7E]/40 max-w-2xl mx-auto lg:mx-0">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 items-center text-left">
                  
                  {/* Gender */}
                  <div className="col-span-1 px-2 sm:border-r border-[#E8DDD0]">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C7355] mb-1">
                      Seeking
                    </label>
                    <select
                      value={heroGender}
                      onChange={(e) => setHeroGender(e.target.value as any)}
                      className="w-full text-xs sm:text-sm font-semibold text-[#560406] bg-transparent focus:outline-hidden cursor-pointer py-1"
                    >
                      <option value="female">Woman</option>
                      <option value="male">Man</option>
                    </select>
                  </div>

                  {/* Age Range */}
                  <div className="col-span-1 px-2 sm:border-r border-[#E8DDD0]">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C7355] mb-1">
                      Age
                    </label>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#241E19] py-1">
                      <select
                        value={heroAgeMin}
                        onChange={(e) => setHeroAgeMin(e.target.value)}
                        className="bg-transparent focus:outline-hidden cursor-pointer"
                      >
                        {[20, 21, 22, 23, 24, 25, 26, 27, 28, 30, 32].map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                      <span className="text-neutral-400 font-normal text-[10px]">to</span>
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
                  <div className="col-span-1 px-2 sm:border-r border-[#E8DDD0]">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C7355] mb-1">
                      Religion
                    </label>
                    <select
                      value={heroReligion}
                      onChange={(e) => setHeroReligion(e.target.value)}
                      className="w-full text-xs font-semibold text-[#241E19] bg-transparent focus:outline-hidden cursor-pointer py-1"
                    >
                      <option value="Select">Any</option>
                      <option value="Christian">Christian</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Muslim">Muslim</option>
                      <option value="Sikh">Sikh</option>
                      <option value="Jain">Jain</option>
                      <option value="Parsi">Parsi</option>
                    </select>
                  </div>

                  {/* Community / Language */}
                  <div className="col-span-1 px-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C7355] mb-1">
                      Mother Tongue
                    </label>
                    <select
                      value={heroCommunity}
                      onChange={(e) => setHeroCommunity(e.target.value)}
                      className="w-full text-xs font-semibold text-[#241E19] bg-transparent focus:outline-hidden cursor-pointer py-1"
                    >
                      <option value="Select">Any</option>
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
                  <div className="col-span-2 sm:col-span-1 pt-1 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => handleOpenRegister('Myself')}
                      className="w-full py-3 px-4 rounded-xl bg-[#560406] hover:bg-[#6D090C] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <span>Begin</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#DFBE7E]" />
                    </button>
                  </div>

                </div>
              </div>

              {/* 3 Grounded Trust Assurances */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 text-left">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-[#E2D6CA] space-y-1">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#DFBE7E]" />
                    <span>Verified IDs</span>
                  </div>
                  <p className="text-[11px] text-[#C2B5A8]">Mandatory ID checks</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-[#E2D6CA] space-y-1">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#DFBE7E]" />
                    <span>BlurShield™</span>
                  </div>
                  <p className="text-[11px] text-[#C2B5A8]">Private photo controls</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-[#E2D6CA] space-y-1">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-[#DFBE7E]" />
                    <span>Confidential</span>
                  </div>
                  <p className="text-[11px] text-[#C2B5A8]">Zero Google indexing</p>
                </div>
              </div>

            </div>

            {/* Right Column: Indian Wedding Couple Editorial Frame */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md">
                
                {/* Decorative Frame */}
                <div className="absolute -inset-2.5 rounded-3xl border border-[#DFBE7E]/40 transform rotate-1 pointer-events-none" />
                
                {/* Main Couple Photo Card */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-[#DFBE7E]/60 shadow-2xl bg-[#1C0102]">
                  <img
                    src="/images/hero-couple.jpg"
                    alt="Indian Wedding Couple - Blessed Matrimonial Alliances"
                    className="w-full aspect-[4/5] object-cover object-center filter brightness-95 contrast-105"
                  />
                  
                  {/* Subtle Bottom Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C0102]/90 via-transparent to-black/10 pointer-events-none" />

                  {/* Floating Gold Quality Plaque */}
                  <div className="absolute bottom-5 inset-x-5 p-4 rounded-2xl bg-[#2B0305]/95 backdrop-blur-md border border-[#DFBE7E]/50 text-center space-y-1 shadow-xl">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#DFBE7E]">
                      The House of Mannat
                    </div>
                    <div className="text-base font-semibold text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                      Where Cherished Alliances Begin
                    </div>
                    <div className="text-[11px] text-[#E2D6CA]">
                      Exclusive Matchmaking for Cultured Families
                    </div>
                  </div>

                  {/* Top Right Verified Seal */}
                  <div className="absolute top-4 right-4 bg-[#2B0305]/90 border border-[#DFBE7E]/60 text-[#DFBE7E] text-[10px] font-extrabold uppercase tracking-wider py-1.5 px-3.5 rounded-full shadow-md flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#DFBE7E]" />
                    <span>100% Verified</span>
                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. VERIFIED PROFILES SHOWCASE */}
      <section id="showcase" className="py-20 sm:py-28 lg:py-32 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14 sm:mb-16">
          <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#8C7355] block">
            Curated Alliances
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Explore Verified Candidate Bio-Datas
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6259] leading-relaxed">
            Every applicant is vetted. Create your profile or log in to view complete details and initiate direct conversation.
          </p>
        </div>

        {showcaseProfiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-8">
            {showcaseProfiles.map((p) => (
              <div
                key={p.id}
                onClick={() => handleOpenRegister('Myself')}
                className="bg-white rounded-3xl overflow-hidden border border-[#E8DDD0] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
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
                  <div className="absolute top-3.5 left-3.5 bg-white/95 text-[#560406] px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#560406]" />
                    <span>Verified</span>
                  </div>

                  {/* Compatibility Score */}
                  <div className="absolute top-3.5 right-3.5 bg-[#560406]/90 text-[#DFBE7E] px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-[#DFBE7E]/30">
                    {p.compatibility_score || 95}% Match
                  </div>

                  {/* Bottom Bio Overlay */}
                  <div className="absolute bottom-4 inset-x-4 text-white text-left space-y-1">
                    <div className="text-xl font-bold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                      {p.display_name}, <span className="font-sans text-xs font-normal text-neutral-300">{p.age} yrs</span>
                    </div>
                    <div className="text-[11px] text-[#DFBE7E] font-medium flex items-center gap-1.5 truncate">
                      <Briefcase className="w-3.5 h-3.5 shrink-0" />
                      <span>{p.occupation || 'Professional'}</span>
                    </div>
                    <div className="text-[10px] text-neutral-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{p.city} · {p.religion}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 sm:p-5 bg-[#FAF7F2] border-t border-[#E8DDD0] flex items-center justify-between text-xs font-semibold text-[#560406]">
                  <span className="flex items-center gap-1.5 text-[11px] text-[#8C7355]">
                    <Lock className="w-3.5 h-3.5" />
                    <span>BlurShield™ Active</span>
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
                    <span>View Bio-Data</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-[#E8DDD0] max-w-xl mx-auto text-center space-y-4 shadow-sm">
            <h3 className="text-2xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Private Verified Directory
            </h3>
            <p className="text-xs sm:text-sm text-[#6E6259]">
              Candidate profiles are protected under BlurShield™ privacy. Register or log in to explore matching candidates.
            </p>
            <button
              type="button"
              onClick={() => handleOpenRegister('Myself')}
              className="mt-3 px-8 py-3 rounded-full bg-[#560406] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md"
            >
              Register Free to View Matches
            </button>
          </div>
        )}

        <div className="text-center pt-12 sm:pt-16">
          <button
            type="button"
            onClick={() => handleOpenRegister('Myself')}
            className="px-8 py-3.5 rounded-full bg-white hover:bg-[#F2EAE0] text-[#560406] border border-[#560406] text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-xs"
          >
            Explore Complete Directory →
          </button>
        </div>
      </section>

      {/* 4. FOUR PILLARS OF DISTINCTION */}
      <section id="principles" className="py-20 sm:py-28 lg:py-32 bg-[#F2EAE0]/70 border-y border-[#E8DDD0]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14 sm:mb-16">
            <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#8C7355] block">
              Core Principles
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Why Discerning Families Choose Mannat
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
            {matchmakingPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8DDD0] shadow-sm flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#8C7355] bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#E8DDD0]">
                      {pillar.badge}
                    </span>
                    <span className="text-sm font-serif italic text-[#8C7355]">0{idx + 1}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-[#560406] pt-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#6E6259] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E8DDD0] text-xs font-semibold text-[#560406] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0" />
                  <span>{pillar.highlight}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. MEMBERSHIP & INVESTMENT PLANS (1, 3, 6, 12 Months) */}
      <section id="pricing" className="py-20 sm:py-28 lg:py-32 bg-[#FAF7F2] border-t border-[#E8DDD0]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14 sm:mb-16">
            <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#8C7355] block">
              Transparent Membership
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Membership &amp; Subscription Plans
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6259] leading-relaxed">
              100% Free bio-data registration &amp; match discovery. Choose a duration tier whenever you wish to initiate direct contact.
            </p>
          </div>

          {/* 4 Clean Duration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Plan 1: 1 Month */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-[#E8DDD0] shadow-sm flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#6E6259] bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#E8DDD0]">
                  Silver Tier
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    1 Month
                  </h3>
                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="text-3xl sm:text-4xl font-bold text-[#241E19]">₹1,499</span>
                    <span className="text-xs text-[#8C7355] font-medium">/ 30 Days</span>
                  </div>
                  <p className="text-xs text-[#6E6259] mt-2.5 leading-relaxed">
                    Essential plan to quickly reach out and initiate direct conversations.
                  </p>
                </div>

                <div className="border-t border-[#E8DDD0] pt-5 space-y-3 text-xs text-[#241E19]">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#560406] shrink-0 mt-0.5" />
                    <span><strong>15 Direct Contacts</strong> unlock</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#560406] shrink-0 mt-0.5" />
                    <span>Direct chat messaging</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#560406] shrink-0 mt-0.5" />
                    <span>Mobile phone number &amp; WhatsApp access</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenRegister('Myself')}
                className="w-full py-3 rounded-full border border-[#560406] text-[#560406] hover:bg-[#560406] hover:text-[#FAF7F2] text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Choose 1 Month
              </button>
            </div>

            {/* Plan 2: 3 Months */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-[#E8DDD0] shadow-sm flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C7355] bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#E8DDD0]">
                  Gold Tier
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    3 Months
                  </h3>
                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="text-3xl sm:text-4xl font-bold text-[#241E19]">₹4,499</span>
                    <span className="text-xs text-[#8C7355] font-medium">/ 90 Days</span>
                  </div>
                  <p className="text-xs text-[#6E6259] mt-2.5 leading-relaxed">
                    Complete quarterly access with advanced verified credentials.
                  </p>
                </div>

                <div className="border-t border-[#E8DDD0] pt-5 space-y-3 text-xs text-[#241E19]">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#560406] shrink-0 mt-0.5" />
                    <span><strong>50 Direct Contacts</strong> unlock</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#560406] shrink-0 mt-0.5" />
                    <span>Verified income &amp; education credential access</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#560406] shrink-0 mt-0.5" />
                    <span>1-Click WhatsApp family alliance cards</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenRegister('Myself')}
                className="w-full py-3 rounded-full border border-[#560406] text-[#560406] hover:bg-[#560406] hover:text-[#FAF7F2] text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Choose 3 Months
              </button>
            </div>

            {/* Plan 3: 6 Months (Most Popular) */}
            <div className="bg-[#2B0305] text-[#FAF7F2] rounded-3xl p-7 sm:p-8 border-2 border-[#DFBE7E] shadow-xl flex flex-col justify-between space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#DFBE7E] text-[#2B0305] text-[9px] font-bold uppercase tracking-widest py-1.5 px-4 rounded-bl-xl">
                ★ Most Popular
              </div>

              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#DFBE7E] bg-white/10 px-3.5 py-1.5 rounded-full border border-[#DFBE7E]/30">
                  Diamond VIP
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-[#DFBE7E]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    6 Months
                  </h3>
                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="text-3xl sm:text-4xl font-bold text-white">₹6,499</span>
                    <span className="text-xs text-[#DFBE7E] font-medium">/ 180 Days</span>
                  </div>
                  <p className="text-xs text-[#E2D6CA] mt-2.5 leading-relaxed">
                    Our premier semi-annual plan with prioritized search ranking.
                  </p>
                </div>

                <div className="border-t border-white/20 pt-5 space-y-3 text-xs text-[#E2D6CA]">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#DFBE7E] shrink-0 mt-0.5" />
                    <span><strong>60 Direct Contacts</strong> allocation</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#DFBE7E] shrink-0 mt-0.5" />
                    <span><strong>Priority Search Ranking</strong></span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#DFBE7E] shrink-0 mt-0.5" />
                    <span>In-app secure voice &amp; video calling</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenRegister('Myself')}
                className="w-full py-3.5 rounded-full bg-[#DFBE7E] hover:bg-[#EADBBE] text-[#2B0305] text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-md"
              >
                Choose 6 Months
              </button>
            </div>

            {/* Plan 4: 12 Months */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-[#E8DDD0] shadow-sm flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C7355] bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#E8DDD0]">
                  Platinum VIP
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    12 Months
                  </h3>
                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="text-3xl sm:text-4xl font-bold text-[#241E19]">₹10,999</span>
                    <span className="text-xs text-[#8C7355] font-medium">/ 365 Days</span>
                  </div>
                  <p className="text-xs text-[#6E6259] mt-2.5 leading-relaxed">
                    Full year high-volume quota with dedicated relationship advisory.
                  </p>
                </div>

                <div className="border-t border-[#E8DDD0] pt-5 space-y-3 text-xs text-[#241E19]">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#560406] shrink-0 mt-0.5" />
                    <span><strong>300+ Direct Contacts</strong></span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#560406] shrink-0 mt-0.5" />
                    <span><strong>1-Year Spotlight</strong> pinned ranking</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#560406] shrink-0 mt-0.5" />
                    <span>Dedicated relationship advisory</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenRegister('Myself')}
                className="w-full py-3 rounded-full bg-[#560406] hover:bg-[#6D090C] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-md"
              >
                Choose 12 Months
              </button>
            </div>

          </div>

          {/* Plan Comparison Table */}
          <div className="mt-16 sm:mt-20 bg-white rounded-3xl p-8 sm:p-12 border border-[#E8DDD0] shadow-sm">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h4 className="text-2xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                Plan Comparison
              </h4>
              <p className="text-xs sm:text-sm text-[#6E6259] mt-1">
                Compare features across all 4 duration options
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#E8DDD0] text-[#560406] font-bold">
                    <th className="pb-4 pr-6">Duration</th>
                    <th className="pb-4 px-6">Price</th>
                    <th className="pb-4 px-6">Contact Quota</th>
                    <th className="pb-4 pl-6">Key Inclusions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DDD0]/60 text-[#241E19]">
                  <tr>
                    <td className="py-4 pr-6 font-bold text-[#560406]">1 Month (Silver)</td>
                    <td className="py-4 px-6 font-bold">₹1,499</td>
                    <td className="py-4 px-6">15 Contacts</td>
                    <td className="py-4 pl-6 text-[#6E6259]">Direct chat messaging, mobile phone access</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-6 font-bold text-[#560406]">3 Months (Gold)</td>
                    <td className="py-4 px-6 font-bold">₹4,499</td>
                    <td className="py-4 px-6">50 Contacts</td>
                    <td className="py-4 pl-6 text-[#6E6259]">Verified info access, voice &amp; video calling</td>
                  </tr>
                  <tr className="bg-[#FAF5EF]">
                    <td className="py-4 pr-6 font-extrabold text-[#560406]">6 Months (Diamond VIP ★)</td>
                    <td className="py-4 px-6 font-extrabold text-[#560406]">₹6,499</td>
                    <td className="py-4 px-6 font-bold">60 Contacts</td>
                    <td className="py-4 pl-6 text-[#241E19] font-semibold">Priority search ranking over standard profiles</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-6 font-bold text-[#560406]">12 Months (Platinum VIP)</td>
                    <td className="py-4 px-6 font-bold">₹10,999</td>
                    <td className="py-4 px-6 font-bold">300+ Contacts</td>
                    <td className="py-4 pl-6 text-[#6E6259]">Full-year Spotlight, dedicated relationship advisory</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment Assurance */}
            <div className="mt-8 pt-6 border-t border-[#E8DDD0] flex flex-wrap items-center justify-between gap-4 text-xs text-[#8C7355]">
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
      <section id="faq" className="py-20 sm:py-28 lg:py-32 bg-[#FAF7F2] border-t border-[#E8DDD0]">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          
          <div className="text-center space-y-3 mb-12 sm:mb-16">
            <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#8C7355] block">
              Clear &amp; Transparent
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E8DDD0] shadow-xs overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-[#241E19] hover:text-[#560406] cursor-pointer"
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
                      className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-[#6E6259] leading-relaxed border-t border-[#E8DDD0]/50 pt-4"
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
      <section className="bg-[#2B0305] text-[#FAF7F2] py-20 sm:py-28 px-6 sm:px-10 lg:px-16 text-center space-y-6 border-t border-[#560406]">
        <h2 className="text-3xl sm:text-5xl font-normal text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          Begin Your Matrimonial Journey
        </h2>
        <p className="text-xs sm:text-base text-[#E2D6CA] max-w-lg mx-auto leading-relaxed">
          Log in with your existing account or register free to explore verified matches.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => handleOpenRegister('Myself')}
            className="px-8 py-3.5 rounded-full bg-[#DFBE7E] hover:bg-[#EADBBE] text-[#2B0305] text-xs font-bold uppercase tracking-wider shadow-md transition cursor-pointer"
          >
            Register Free
          </button>
          <button
            type="button"
            onClick={handleOpenLogin}
            className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/20 transition cursor-pointer"
          >
            Member Log In
          </button>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-[#1D0203] text-[#A89F91] py-14 sm:py-18 px-6 sm:px-10 lg:px-16 text-xs border-t border-[#3B0406]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-white uppercase tracking-wider">Mannat Matrimony</span>
            <span>·</span>
            <span>Bespoke Private Matchmaking</span>
          </div>
          <div className="flex items-center gap-6 text-xs font-semibold">
            <button type="button" onClick={() => { setLegalInitialDoc('privacy'); setShowLegal(true); }} className="hover:text-white transition cursor-pointer">Privacy Policy</button>
            <button type="button" onClick={() => { setLegalInitialDoc('terms'); setShowLegal(true); }} className="hover:text-white transition cursor-pointer">Terms &amp; EULA</button>
            <button type="button" onClick={() => { setLegalInitialDoc('deletion'); setShowLegal(true); }} className="hover:text-white transition cursor-pointer">Account Deletion</button>
            <a href="https://apps.apple.com/app/id6812288373" target="_blank" rel="noreferrer" className="hover:text-white transition">iOS App</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-[11px] text-[#6E6259] pt-6 mt-6 border-t border-white/10 text-center sm:text-left">
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
