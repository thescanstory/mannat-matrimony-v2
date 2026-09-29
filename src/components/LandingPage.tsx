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
  Briefcase,
  Sparkles
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showTopAppBanner, setShowTopAppBanner] = useState(true);
  const [showTableComparison, setShowTableComparison] = useState(false);

  // Multi-Step Registration & Login Flow Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'register' | 'login'>('register');
  const [authModalProfileFor, setAuthModalProfileFor] = useState('Myself');

  // Hero Preference Bar State (Desktop)
  const [heroGender, setHeroGender] = useState<'female' | 'male'>('female');
  const [heroReligion, setHeroReligion] = useState('Any');

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

  // Real candidate profiles from database
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

  // 4 Core Principles
  const matchmakingPillars = [
    {
      num: '01',
      title: '100% ID Verified',
      desc: 'Mandatory government credential check before any candidate is activated.',
      badge: 'Vetted Candidates'
    },
    {
      num: '02',
      title: 'BlurShield™ Privacy',
      desc: 'Portraits remain discreetly blurred until you mutually approve an alliance.',
      badge: 'Discreet by Design'
    },
    {
      num: '03',
      title: 'WhatsApp Dossiers',
      desc: '1-click formatted PDF biodatas tailored for sharing with parents and elders.',
      badge: 'Parent-Friendly'
    },
    {
      num: '04',
      title: 'Bespoke Advisory',
      desc: 'Personal relationship advisors who understand your lifestyle and cultural wavelength.',
      badge: 'Concierge Care'
    }
  ];

  // Frequently Asked Questions
  const faqs = [
    {
      q: 'How does Mannat verify candidate profiles?',
      a: 'Every member undergoes mandatory government identity vetting and credential verification before bio-datas are shared.'
    },
    {
      q: 'Can parents create and manage a profile?',
      a: 'Yes. Over 60% of our profiles are managed by parents or family elders with simplified WhatsApp dossier sharing.'
    },
    {
      q: 'How does BlurShield™ protect photo privacy?',
      a: 'Portraits are never indexed on Google and remain blurred until you mutually approve an alliance request.'
    },
    {
      q: 'Is it free to explore matches?',
      a: 'Yes. Registration, bio-data creation, and match discovery are 100% free. Optional plans unlock direct phone contact.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#241E19] selection:bg-[#560406]/15 selection:text-[#560406] font-sans antialiased overflow-x-hidden">
      
      {/* 0. Top iOS App Banner */}
      <AnimatePresence>
        {showTopAppBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#1A0102] text-[#EDE4DA] text-[10px] sm:text-xs py-1.5 px-3 sm:px-6 border-b border-[#560406]/60 flex items-center justify-between"
          >
            <div className="flex-1 text-center flex items-center justify-center gap-1.5 sm:gap-2 truncate pr-1">
              <span className="bg-[#DFBE7E]/20 text-[#DFBE7E] px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] uppercase tracking-wider font-bold border border-[#DFBE7E]/30 shrink-0">
                iOS App
              </span>
              <span className="text-neutral-300">Available on the App Store.</span>
              <a
                href="https://apps.apple.com/app/id6812288373"
                target="_blank"
                rel="noreferrer"
                className="text-[#DFBE7E] hover:text-white font-medium underline underline-offset-2 inline-flex items-center gap-1 ml-0.5 truncate"
              >
                <span>Download</span>
                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
              </a>
            </div>
            <button
              onClick={() => setShowTopAppBanner(false)}
              className="text-neutral-400 hover:text-white p-1 cursor-pointer rounded hover:bg-white/10 transition shrink-0"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header (Cohesive Dark Luxury Navbar) */}
      <header className="sticky top-0 z-50 bg-[#2B0305]/95 backdrop-blur-md border-b border-[#DFBE7E]/20 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-14 sm:h-18">
            
            {/* Brand Logo */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 sm:gap-3 group shrink-0 cursor-pointer"
            >
              <img
                src="/images/mannat-logo-square.png"
                alt="Mannat"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-md object-cover ring-1 ring-[#DFBE7E]/40"
              />
              <div className="flex flex-col text-left">
                <span className="text-[9px] sm:text-[10px] italic font-normal text-[#DFBE7E] -mb-1 leading-none" style={{ fontFamily: "'Pinyon Script', cursive" }}>
                  At
                </span>
                <span className="font-normal text-base sm:text-xl tracking-[0.2em] uppercase text-white leading-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  MANNAT
                </span>
                <span className="text-[6px] sm:text-[6.5px] uppercase tracking-[0.25em] font-semibold text-[#DFBE7E]/80 -mt-0.5">
                  Matchmaking
                </span>
              </div>
            </a>

            {/* Editorial Nav Links */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-semibold uppercase tracking-widest text-[#E2D6CA]">
              <a
                href="#showcase"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#DFBE7E] transition-colors py-1"
              >
                Profiles
              </a>
              <a
                href="#principles"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('principles')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#DFBE7E] transition-colors py-1"
              >
                Why Mannat
              </a>
              <a
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#DFBE7E] transition-colors py-1"
              >
                Plans
              </a>
              <a
                href="#faq"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#DFBE7E] transition-colors py-1"
              >
                FAQ
              </a>
            </nav>

            {/* Right Action CTAs */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleOpenLogin}
                className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-xs font-semibold text-[#DFBE7E] hover:text-white transition cursor-pointer"
              >
                Log In
              </button>

              <button
                type="button"
                onClick={() => handleOpenRegister('Myself')}
                className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#DFBE7E] hover:bg-[#EADBBE] text-[#2B0305] text-xs font-bold uppercase tracking-wider shadow-xs transition cursor-pointer"
              >
                Register
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1 rounded-md text-white hover:bg-white/10 cursor-pointer"
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
              className="md:hidden bg-[#1E0203] border-b border-[#DFBE7E]/20 px-4 py-3 space-y-2 shadow-2xl"
            >
              <div className="flex flex-col space-y-1 text-xs font-medium text-[#E2D6CA] pb-2 border-b border-white/10">
                <a
                  href="#showcase"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-1.5 px-2 hover:bg-white/5 rounded text-[#DFBE7E]"
                >
                  Verified Profiles
                </a>
                <a
                  href="#principles"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    document.getElementById('principles')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-1.5 px-2 hover:bg-white/5 rounded text-[#DFBE7E]"
                >
                  Why Mannat
                </a>
                <a
                  href="#pricing"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-1.5 px-2 hover:bg-white/5 rounded text-[#DFBE7E]"
                >
                  Membership Plans
                </a>
                <a
                  href="#faq"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-1.5 px-2 hover:bg-white/5 rounded text-[#DFBE7E]"
                >
                  FAQ
                </a>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-1">
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); handleOpenLogin(); }}
                  className="py-2 bg-white/10 rounded-lg text-[#DFBE7E] text-center cursor-pointer border border-white/10"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); handleOpenRegister('Myself'); }}
                  className="py-2 bg-[#DFBE7E] rounded-lg text-[#2B0305] text-center cursor-pointer font-bold"
                >
                  Register Free
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. HERO: High-Fashion Luxury Indian Matrimonial Sanctuary */}
      <section className="relative bg-[#2B0305] text-[#FAF7F2] pt-6 sm:pt-14 pb-10 sm:pb-20 px-4 sm:px-8 lg:px-12 overflow-hidden border-b border-[#560406]">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-[#DFBE7E]/5 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* ================= MOBILE HERO (< lg) ================= */}
          <div className="lg:hidden flex flex-col items-center text-center space-y-4">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DFBE7E]/15 border border-[#DFBE7E]/30 text-[9px] uppercase tracking-[0.2em] font-semibold text-[#DFBE7E]">
              <Sparkles className="w-2.5 h-2.5 text-[#DFBE7E]" />
              <span>Private Matrimonial Sanctuary</span>
            </div>

            {/* Headline */}
            <h1
              className="text-2xl sm:text-3xl font-normal text-white leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Private, Verified Matchmaking for Discerning Families
            </h1>

            {/* Compact Wedding Couple Hero Visual */}
            <div className="relative w-full max-w-[280px] my-1">
              <div className="relative rounded-2xl overflow-hidden border border-[#DFBE7E]/50 shadow-2xl bg-[#1C0102]">
                <img
                  src="/images/hero-couple.jpg"
                  alt="Indian Wedding Couple"
                  className="w-full aspect-[4/5] object-cover object-center filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C0102]/95 via-transparent to-black/20 pointer-events-none" />
                
                {/* Verified Pill */}
                <div className="absolute top-2.5 right-2.5 bg-[#2B0305]/90 border border-[#DFBE7E]/60 text-[#DFBE7E] text-[8px] font-bold uppercase tracking-wider py-0.5 px-2 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  <span>100% Verified</span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-2.5 inset-x-2.5 text-center space-y-0.5">
                  <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-[#DFBE7E] block">
                    The House of Mannat
                  </span>
                  <div className="text-xs font-semibold text-white font-serif">
                    Where Sacred Alliances Begin
                  </div>
                </div>
              </div>
            </div>

            {/* Subtitle & Trust Points */}
            <p className="text-xs text-[#E2D6CA] leading-relaxed max-w-xs font-light">
              100% ID Verified Bio-datas · BlurShield™ Privacy · WhatsApp Family Dossiers
            </p>

            {/* Action Buttons */}
            <div className="w-full max-w-xs space-y-2 pt-1">
              <button
                type="button"
                onClick={() => handleOpenRegister('Myself')}
                className="w-full py-3 px-6 rounded-xl bg-[#DFBE7E] hover:bg-[#EADBBE] text-[#2B0305] text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
              >
                <span>Begin Free Matchmaking</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2B0305]" />
              </button>

              <button
                type="button"
                onClick={handleOpenLogin}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/15 transition cursor-pointer"
              >
                Member Log In
              </button>
            </div>

          </div>

          {/* ================= DESKTOP HERO (lg+) ================= */}
          <div className="hidden lg:grid grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headline, Search Box, Trust Row */}
            <div className="col-span-7 space-y-6 text-left">
              
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFBE7E]/15 border border-[#DFBE7E]/30 text-xs uppercase tracking-[0.2em] font-semibold text-[#DFBE7E]">
                  <Sparkles className="w-3 h-3 text-[#DFBE7E]" />
                  <span>Private Matrimonial Alliance Network</span>
                </div>

                <h1
                  className="text-4xl lg:text-[48px] font-normal text-white leading-[1.15] tracking-tight"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Private, Verified Matchmaking for Discerning Families
                </h1>

                <p className="text-sm text-[#E2D6CA] leading-relaxed max-w-lg font-light">
                  A bespoke matrimonial sanctuary tailored for cultured Indian candidates and families. 
                  Browse verified bio-datas protected by BlurShield™ privacy controls.
                </p>
              </div>

              {/* Desktop Search Bar */}
              <div className="bg-white text-[#241E19] p-3 rounded-2xl shadow-2xl border border-[#DFBE7E]/40 max-w-xl">
                <div className="flex items-center gap-3 text-left">
                  
                  {/* Seeking Toggle */}
                  <div className="flex-1 flex items-center gap-2 bg-[#FAF7F2] p-2 rounded-xl border border-[#E8DDD0]">
                    <span className="text-[10px] uppercase font-bold text-[#8C7355] pl-1 shrink-0">Seeking:</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setHeroGender('female')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${heroGender === 'female' ? 'bg-[#560406] text-white' : 'text-[#560406] hover:bg-[#560406]/10'}`}
                      >
                        Bride
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeroGender('male')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${heroGender === 'male' ? 'bg-[#560406] text-white' : 'text-[#560406] hover:bg-[#560406]/10'}`}
                      >
                        Groom
                      </button>
                    </div>
                  </div>

                  {/* Religion Select */}
                  <div className="flex-1 flex items-center gap-2 bg-[#FAF7F2] p-2 rounded-xl border border-[#E8DDD0]">
                    <span className="text-[10px] uppercase font-bold text-[#8C7355] pl-1 shrink-0">Religion:</span>
                    <select
                      value={heroReligion}
                      onChange={(e) => setHeroReligion(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-[#560406] focus:outline-hidden cursor-pointer pr-1"
                    >
                      <option value="Any">All Faiths</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Christian">Christian</option>
                      <option value="Muslim">Muslim</option>
                      <option value="Sikh">Sikh</option>
                      <option value="Jain">Jain</option>
                    </select>
                  </div>

                  {/* CTA Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenRegister('Myself')}
                    className="py-2.5 px-5 rounded-xl bg-[#560406] hover:bg-[#6D090C] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs shrink-0"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#DFBE7E]" />
                  </button>

                </div>
              </div>

              {/* 3 Trust Badges */}
              <div className="flex items-center gap-6 text-xs text-[#DFBE7E] pt-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>100% ID Verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>BlurShield™ Privacy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>Zero Google Indexing</span>
                </div>
              </div>

            </div>

            {/* Right Column: Desktop Wedding Couple Frame */}
            <div className="col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-sm">
                
                <div className="absolute -inset-1.5 rounded-3xl border border-[#DFBE7E]/40 transform rotate-1 pointer-events-none" />
                
                <div className="relative rounded-3xl overflow-hidden border-2 border-[#DFBE7E]/60 shadow-2xl bg-[#1C0102]">
                  <img
                    src="/images/hero-couple.jpg"
                    alt="Indian Wedding Couple"
                    className="w-full aspect-[4/5] object-cover object-center filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C0102]/90 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute bottom-3 inset-x-3 p-3 rounded-2xl bg-[#2B0305]/95 backdrop-blur-md border border-[#DFBE7E]/40 text-center space-y-0.5">
                    <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#DFBE7E]">
                      The House of Mannat
                    </div>
                    <div className="text-sm font-semibold text-white font-serif">
                      Where Sacred Alliances Begin
                    </div>
                  </div>

                  <div className="absolute top-3 right-3 bg-[#2B0305]/90 border border-[#DFBE7E]/60 text-[#DFBE7E] text-[9px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>100% Verified</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. VERIFIED PROFILES SHOWCASE */}
      <section id="showcase" className="py-10 sm:py-18 px-4 sm:px-8 lg:px-12 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto space-y-1.5 sm:space-y-2 mb-6 sm:mb-10">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C7355] block">
            Curated Profiles
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-normal text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Explore Verified Bio-Datas
          </h2>
          <p className="text-xs text-[#6E6259]">
            Every candidate is vetted. Log in or register to connect directly.
          </p>
        </div>

        {showcaseProfiles.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {showcaseProfiles.map((p) => (
              <div
                key={p.id}
                onClick={() => handleOpenRegister('Myself')}
                className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#E8DDD0] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                {/* Photo with BlurShield */}
                <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden">
                  <img
                    src={p.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'}
                    alt={p.display_name}
                    className="w-full h-full object-cover filter blur-[2px] scale-102 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Verified Pill */}
                  <div className="absolute top-2 left-2 bg-white/95 text-[#560406] px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold flex items-center gap-0.5 shadow-2xs">
                    <ShieldCheck className="w-2.5 h-2.5 text-[#560406]" />
                    <span>Verified</span>
                  </div>

                  {/* Bio Info */}
                  <div className="absolute bottom-2 inset-x-2 text-white text-left space-y-0.5">
                    <div className="text-sm sm:text-base font-bold truncate" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                      {p.display_name}, <span className="font-sans text-[11px] font-normal text-neutral-300">{p.age}y</span>
                    </div>
                    <div className="text-[9.5px] sm:text-[10px] text-[#DFBE7E] font-medium truncate flex items-center gap-1">
                      <Briefcase className="w-2.5 h-2.5 shrink-0" />
                      <span>{p.occupation || 'Professional'}</span>
                    </div>
                    <div className="text-[9px] text-neutral-300 truncate flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 shrink-0" />
                      <span>{p.city}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-2 sm:p-2.5 bg-[#FAF7F2] border-t border-[#E8DDD0] flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-[#560406]">
                  <span className="flex items-center gap-1 text-[#8C7355]">
                    <Lock className="w-2.5 h-2.5" />
                    <span>BlurShield™</span>
                  </span>
                  <span className="flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>View</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-[#E8DDD0] max-w-sm mx-auto text-center space-y-2">
            <h3 className="text-base font-bold text-[#560406] font-serif">Private Verified Directory</h3>
            <p className="text-xs text-[#6E6259]">Register free to browse vetted profiles.</p>
            <button
              type="button"
              onClick={() => handleOpenRegister('Myself')}
              className="mt-1 px-4 py-2 rounded-full bg-[#560406] text-white text-xs font-bold uppercase tracking-wider"
            >
              Explore Free
            </button>
          </div>
        )}

        <div className="text-center pt-6 sm:pt-8">
          <button
            type="button"
            onClick={() => handleOpenRegister('Myself')}
            className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-white hover:bg-[#F2EAE0] text-[#560406] border border-[#560406] text-xs font-semibold uppercase tracking-wider transition cursor-pointer shadow-2xs"
          >
            Explore All Profiles →
          </button>
        </div>
      </section>

      {/* 4. FOUR PILLARS — Sleek, light 2x2 grid */}
      <section id="principles" className="py-10 sm:py-18 bg-[#F2EAE0]/60 border-y border-[#E8DDD0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="text-center max-w-xl mx-auto space-y-1.5 sm:space-y-2 mb-6 sm:mb-10">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C7355] block">
              Core Principles
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-normal text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Why Discerning Families Choose Mannat
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {matchmakingPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-[#E8DDD0] shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] uppercase tracking-wider font-bold text-[#8C7355] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8DDD0]">
                      {pillar.badge}
                    </span>
                    <span className="text-xs font-serif italic text-[#8C7355]">{pillar.num}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-[#6E6259] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E8DDD0]/60 text-[11px] font-semibold text-[#560406] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8C7355] shrink-0" />
                  <span>Verified Standard</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4.5. SACRED ALLIANCES (Photo Gallery) */}
      <section className="py-10 sm:py-18 bg-[#2B0305] text-[#FAF7F2] border-b border-[#560406]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="text-center max-w-xl mx-auto space-y-1.5 sm:space-y-2 mb-6 sm:mb-10">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold text-[#DFBE7E] block">
              Sacred Traditions
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-normal text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Where Lifelong Alliances Begin
            </h2>
            <p className="text-xs text-[#E2D6CA]">
              Honoring cultural heritage, family blessings, and timeless vows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            
            <div className="relative rounded-xl overflow-hidden border border-[#DFBE7E]/40 shadow-xl bg-[#1C0102] group">
              <div className="aspect-[4/3] sm:aspect-[3/4] overflow-hidden">
                <img
                  src="/images/story-couple-1.jpg"
                  alt="Jaimala Rituals"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C0102] via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-0 inset-x-0 p-3 text-left bg-[#1C0102]/85 backdrop-blur-2xs border-t border-[#DFBE7E]/30">
                <span className="text-[8px] uppercase tracking-widest font-bold text-[#DFBE7E] block">Sacred Jaimala</span>
                <div className="text-sm font-semibold text-white font-serif">Joyous Celebrations</div>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-[#DFBE7E]/50 shadow-xl bg-[#1C0102] group">
              <div className="aspect-[4/3] sm:aspect-[3/4] overflow-hidden">
                <img
                  src="/images/story-couple-2.jpg"
                  alt="Mutual Respect"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C0102] via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-0 inset-x-0 p-3 text-left bg-[#1C0102]/85 backdrop-blur-2xs border-t border-[#DFBE7E]/30">
                <span className="text-[8px] uppercase tracking-widest font-bold text-[#DFBE7E] block">Enduring Devotion</span>
                <div className="text-sm font-semibold text-white font-serif">Sacred Commitments</div>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-[#DFBE7E]/40 shadow-xl bg-[#1C0102] group">
              <div className="aspect-[4/3] sm:aspect-[3/4] overflow-hidden">
                <img
                  src="/images/story-couple-3.jpg"
                  alt="Hastamelap Rituals"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C0102] via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-0 inset-x-0 p-3 text-left bg-[#1C0102]/85 backdrop-blur-2xs border-t border-[#DFBE7E]/30">
                <span className="text-[8px] uppercase tracking-widest font-bold text-[#DFBE7E] block">Hastamelap Rituals</span>
                <div className="text-sm font-semibold text-white font-serif">Timeless Traditions</div>
              </div>
            </div>

          </div>

          <div className="text-center pt-6 sm:pt-8">
            <button
              type="button"
              onClick={() => handleOpenRegister('Myself')}
              className="px-6 py-2.5 rounded-full bg-[#DFBE7E] hover:bg-[#EADBBE] text-[#2B0305] text-xs font-bold uppercase tracking-wider shadow-md transition cursor-pointer"
            >
              Begin Your Search →
            </button>
          </div>

        </div>
      </section>

      {/* 5. MEMBERSHIP PLANS */}
      <section id="pricing" className="py-10 sm:py-18 bg-[#FAF7F2] border-t border-[#E8DDD0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="text-center max-w-xl mx-auto space-y-1.5 sm:space-y-2 mb-6 sm:mb-10">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C7355] block">
              Transparent Pricing
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-normal text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Membership Plans
            </h2>
            <p className="text-xs text-[#6E6259]">
              Free bio-data &amp; match discovery. Choose a duration tier to unlock direct phone contact.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            
            {/* 1 Month */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-[#E8DDD0] shadow-2xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[8px] uppercase font-bold text-[#6E6259] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8DDD0]">
                  Silver
                </span>
                <div>
                  <h3 className="text-lg font-bold text-[#560406] font-serif">1 Month</h3>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-bold text-[#241E19]">₹1,499</span>
                    <span className="text-[10px] text-[#8C7355]">/ 30 Days</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#E8DDD0] space-y-1.5 text-xs text-[#241E19]">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#560406] shrink-0" />
                    <span><strong>15 Contacts</strong> unlock</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#560406] shrink-0" />
                    <span>Direct chat &amp; phone numbers</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenRegister('Myself')}
                className="w-full py-2 rounded-full border border-[#560406] text-[#560406] hover:bg-[#560406] hover:text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Select Plan
              </button>
            </div>

            {/* 3 Months */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-[#E8DDD0] shadow-2xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[8px] uppercase font-bold text-[#8C7355] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8DDD0]">
                  Gold
                </span>
                <div>
                  <h3 className="text-lg font-bold text-[#560406] font-serif">3 Months</h3>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-bold text-[#241E19]">₹4,499</span>
                    <span className="text-[10px] text-[#8C7355]">/ 90 Days</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#E8DDD0] space-y-1.5 text-xs text-[#241E19]">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#560406] shrink-0" />
                    <span><strong>50 Contacts</strong> unlock</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#560406] shrink-0" />
                    <span>WhatsApp dossiers &amp; call access</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenRegister('Myself')}
                className="w-full py-2 rounded-full border border-[#560406] text-[#560406] hover:bg-[#560406] hover:text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Select Plan
              </button>
            </div>

            {/* 6 Months — Diamond VIP */}
            <div className="bg-[#2B0305] text-[#FAF7F2] rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 border-[#DFBE7E] shadow-md flex flex-col justify-between space-y-4 relative">
              <div className="absolute top-0 right-0 bg-[#DFBE7E] text-[#2B0305] text-[7.5px] font-bold uppercase tracking-widest py-0.5 px-2.5 rounded-bl-lg">
                ★ Popular
              </div>

              <div className="space-y-2">
                <span className="text-[8px] uppercase font-bold text-[#DFBE7E] bg-white/10 px-2 py-0.5 rounded border border-[#DFBE7E]/30">
                  Diamond VIP
                </span>
                <div>
                  <h3 className="text-lg font-bold text-[#DFBE7E] font-serif">6 Months</h3>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-bold text-white">₹6,499</span>
                    <span className="text-[10px] text-[#DFBE7E]">/ 180 Days</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/20 space-y-1.5 text-xs text-[#E2D6CA]">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#DFBE7E] shrink-0" />
                    <span><strong>60 Contacts</strong> allocation</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#DFBE7E] shrink-0" />
                    <span><strong>Priority Search Ranking</strong></span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenRegister('Myself')}
                className="w-full py-2 rounded-full bg-[#DFBE7E] hover:bg-[#EADBBE] text-[#2B0305] text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-xs"
              >
                Select Plan
              </button>
            </div>

            {/* 12 Months */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-[#E8DDD0] shadow-2xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[8px] uppercase font-bold text-[#8C7355] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8DDD0]">
                  Platinum
                </span>
                <div>
                  <h3 className="text-lg font-bold text-[#560406] font-serif">12 Months</h3>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-bold text-[#241E19]">₹10,999</span>
                    <span className="text-[10px] text-[#8C7355]">/ 365 Days</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#E8DDD0] space-y-1.5 text-xs text-[#241E19]">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#560406] shrink-0" />
                    <span><strong>300+ Contacts</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#560406] shrink-0" />
                    <span>Dedicated advisor guidance</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenRegister('Myself')}
                className="w-full py-2 rounded-full bg-[#560406] hover:bg-[#6D090C] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-xs"
              >
                Select Plan
              </button>
            </div>

          </div>

          {/* Toggleable Comparison Table */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setShowTableComparison(!showTableComparison)}
              className="text-xs font-semibold text-[#560406] hover:underline inline-flex items-center gap-1 cursor-pointer py-1"
            >
              <span>{showTableComparison ? 'Hide Plan Comparison' : 'View Detailed Plan Comparison'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showTableComparison ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showTableComparison && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 bg-white rounded-2xl p-4 sm:p-6 border border-[#E8DDD0] text-left overflow-x-auto"
                >
                  <table className="w-full text-[11px] sm:text-xs min-w-[480px]">
                    <thead>
                      <tr className="border-b border-[#E8DDD0] text-[#560406] font-bold">
                        <th className="pb-2.5">Tier</th>
                        <th className="pb-2.5">Price</th>
                        <th className="pb-2.5">Quota</th>
                        <th className="pb-2.5">Highlights</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8DDD0]/50 text-[#241E19]">
                      <tr>
                        <td className="py-2.5 font-bold text-[#560406]">1 Month (Silver)</td>
                        <td className="py-2.5 font-bold">₹1,499</td>
                        <td className="py-2.5">15 Contacts</td>
                        <td className="py-2.5 text-[#6E6259]">Direct chat, mobile phone unlock</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-[#560406]">3 Months (Gold)</td>
                        <td className="py-2.5 font-bold">₹4,499</td>
                        <td className="py-2.5">50 Contacts</td>
                        <td className="py-2.5 text-[#6E6259]">Verified credentials &amp; dossiers</td>
                      </tr>
                      <tr className="bg-[#FAF5EF]">
                        <td className="py-2.5 font-extrabold text-[#560406]">6 Months (Diamond VIP)</td>
                        <td className="py-2.5 font-extrabold text-[#560406]">₹6,499</td>
                        <td className="py-2.5 font-bold">60 Contacts</td>
                        <td className="py-2.5 font-semibold text-[#560406]">Priority search ranking</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-[#560406]">12 Months (Platinum)</td>
                        <td className="py-2.5 font-bold">₹10,999</td>
                        <td className="py-2.5 font-bold">300+ Contacts</td>
                        <td className="py-2.5 text-[#6E6259]">Spotlight ranking, dedicated advisor</td>
                      </tr>
                    </tbody>
                  </table>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 6. FAQ */}
      <section id="faq" className="py-10 sm:py-18 bg-[#FAF7F2] border-t border-[#E8DDD0]">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          
          <div className="text-center space-y-1.5 sm:space-y-2 mb-6 sm:mb-10">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C7355] block">
              Clear Answers
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-normal text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#E8DDD0] shadow-2xs overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 font-semibold text-xs sm:text-sm text-[#241E19] hover:text-[#560406] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#8C7355] transition-transform duration-200 shrink-0 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-3.5 sm:px-4 pb-3.5 text-xs text-[#6E6259] leading-relaxed border-t border-[#E8DDD0]/40 pt-2"
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
      <section className="bg-[#2B0305] text-[#FAF7F2] py-10 sm:py-16 px-4 sm:px-8 text-center space-y-3 sm:space-y-4 border-t border-[#560406]">
        <h2 className="text-xl sm:text-3xl lg:text-4xl font-normal text-white font-serif">
          Begin Your Matrimonial Journey
        </h2>
        <p className="text-xs text-[#E2D6CA] max-w-md mx-auto">
          Register free to explore verified matches or sign in to your existing account.
        </p>
        <div className="flex items-center justify-center gap-2.5 pt-2 max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => handleOpenRegister('Myself')}
            className="flex-1 py-2.5 px-4 rounded-full bg-[#DFBE7E] hover:bg-[#EADBBE] text-[#2B0305] text-xs font-bold uppercase tracking-wider shadow-md transition cursor-pointer"
          >
            Register Free
          </button>
          <button
            type="button"
            onClick={handleOpenLogin}
            className="flex-1 py-2.5 px-4 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/20 transition cursor-pointer"
          >
            Log In
          </button>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-[#1D0203] text-[#A89F91] py-8 sm:py-10 px-4 sm:px-8 lg:px-12 text-[11px] border-t border-[#3B0406]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white uppercase tracking-wider">Mannat Matrimony</span>
            <span>·</span>
            <span>Private Matchmaking</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 font-medium">
            <button type="button" onClick={() => { setLegalInitialDoc('privacy'); setShowLegal(true); }} className="hover:text-white transition cursor-pointer">Privacy</button>
            <button type="button" onClick={() => { setLegalInitialDoc('terms'); setShowLegal(true); }} className="hover:text-white transition cursor-pointer">Terms &amp; EULA</button>
            <button type="button" onClick={() => { setLegalInitialDoc('deletion'); setShowLegal(true); }} className="hover:text-white transition cursor-pointer">Account Deletion</button>
            <a href="https://apps.apple.com/app/id6812288373" target="_blank" rel="noreferrer" className="hover:text-white transition">iOS App</a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto text-[10px] text-[#6E6259] pt-3 mt-3 border-t border-white/10 text-center sm:text-left">
          &copy; 2026 The House of Mannat. Confidential matrimonial alliance network.
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
