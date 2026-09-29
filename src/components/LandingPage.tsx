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
  Briefcase,
  LogIn,
  UserPlus
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
  const [showLegal, setShowLegal] = useState(false);
  const [legalInitialDoc, setLegalInitialDoc] = useState<LegalDocType>('privacy');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showTopAppBanner, setShowTopAppBanner] = useState(true);

  // Active Hero Tab: 'login' | 'register'
  const [heroTab, setHeroTab] = useState<'login' | 'register'>('login');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register Form State
  const [regProfileFor, setRegProfileFor] = useState('My Self');
  const [regGender, setRegGender] = useState('female');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  const heroFormRef = useRef<HTMLDivElement>(null);

  const navigateToApp = (view: 'onboarding' | 'auth' | 'home' = 'home') => {
    if (onOpenApp) {
      onOpenApp(view);
    } else if (typeof window !== 'undefined') {
      window.location.href = `/app?view=${view}`;
    }
  };

  // Direct Web Login with Email
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const finalEmail = loginEmail.trim().toLowerCase();
    if (!finalEmail) return;

    setLoginLoading(true);
    authService.setUserSession(finalEmail, finalEmail.split('@')[0]);
    setTimeout(() => {
      setLoginLoading(false);
      navigateToApp('home');
    }, 150);
  };

  // 1-Click Google Sign In on Website
  const handleGoogleSignIn = async () => {
    setLoginLoading(true);
    try {
      const res = await authService.signInWithGoogle();
      if (res?.data) {
        navigateToApp('home');
      }
    } catch (err) {
      console.warn('Google sign-in notice:', err);
    } finally {
      setLoginLoading(false);
    }
  };

  // 1-Click Apple Sign In on Website
  const handleAppleSignIn = async () => {
    setLoginLoading(true);
    try {
      const res = await authService.signInWithApple();
      if (res?.data) {
        navigateToApp('home');
      }
    } catch (err) {
      console.warn('Apple sign-in notice:', err);
    } finally {
      setLoginLoading(false);
    }
  };

  // 1-Click Free Registration on Website
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim()) {
      setRegError('Please enter candidate full name');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('Please enter a valid email address');
      return;
    }
    if (!regPhone.trim() || regPhone.length < 8) {
      setRegError('Please enter a valid mobile number');
      return;
    }

    setRegSubmitting(true);
    try {
      const email = regEmail.trim().toLowerCase();
      const name = regName.trim();

      // Save lead to Supabase in background
      const leadData: VipLead = {
        profile_for: regProfileFor,
        gender: regGender === 'female' ? 'Female (Bride)' : 'Male (Groom)',
        full_name: name,
        phone_country_code: '+91',
        phone_number: regPhone.trim(),
        email: email,
        city: regCity.trim() || 'India / Global',
        annual_income: 'Confidential',
        source_cta: 'Hero Direct Web Registration'
      };
      await vipConsultationService.submitLead(leadData);

      // Create session and seed initial bio
      authService.setUserSession(email, name);
      const initialProfile = {
        display_name: name,
        gender: regGender,
        city: regCity.trim() || 'Mumbai',
        managed_by: regProfileFor.includes('Self') ? 'self' : 'parent',
        religion: 'Hindu',
        marital_status: 'Never Married',
        bio_text: `Bio-data created for ${name}. Seeking a meaningful alliance based on shared values.`
      };
      localStorage.setItem('mannat_user_profile', JSON.stringify(initialProfile));
      localStorage.setItem('mannat_onboarded_' + email, 'true');

      // Launch onboarding directly
      navigateToApp('onboarding');
    } catch (err) {
      console.warn('Registration notice:', err);
      authService.setUserSession(regEmail.trim().toLowerCase(), regName.trim());
      navigateToApp('onboarding');
    } finally {
      setRegSubmitting(false);
    }
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
                onClick={() => { setHeroTab('login'); heroFormRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
                className="hover:text-[#560406] transition cursor-pointer font-bold"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => { setHeroTab('register'); heroFormRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
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
                onClick={() => {
                  setHeroTab('login');
                  heroFormRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full border border-[#560406] text-xs font-bold text-[#560406] hover:bg-[#560406] hover:text-[#F5E6D3] transition cursor-pointer shadow-2xs active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setHeroTab('register');
                  heroFormRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
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
                    setHeroTab('login');
                    heroFormRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-3 bg-white rounded-xl border border-[#560406]/30 text-[#560406] font-extrabold text-left flex items-center justify-between cursor-pointer"
                >
                  <span>🔐 Member Log In</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setHeroTab('register');
                    heroFormRef.current?.scrollIntoView({ behavior: 'smooth' });
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

      {/* 2. HERO: INTENTION-FIRST MATCHMAKING WITH PROMINENT DUAL LOGIN / REGISTER DOCK */}
      <section className="relative bg-gradient-to-b from-[#240103] via-[#3A0204] to-[#1C0102] text-white pt-10 sm:pt-16 pb-14 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Golden Radial Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#DFBE7E]/15 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 bg-[#DFBE7E]/10 border border-[#DFBE7E]/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#DFBE7E] tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#DFBE7E]" />
              <span>India's Intention-First Private Matrimonial Network</span>
            </div>

            <h1
              className="text-3xl sm:text-5xl lg:text-[54px] font-normal text-white tracking-[0.01em] leading-[1.12]"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
            >
              Private, Verified Matchmaking for Discerning Families
            </h1>

            <p className="text-xs sm:text-base text-[#F4EAE0] leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
              Log in or register on the web to explore verified candidate bio-datas with BlurShield™ privacy controls, WhatsApp family cards, and bespoke concierge introductions.
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-left">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-[#DFBE7E] shrink-0" />
                <span className="text-xs font-semibold text-white">100% Verified Members</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <ShieldCheck className="w-4 h-4 text-[#DFBE7E] shrink-0" />
                <span className="text-xs font-semibold text-white">BlurShield™ Privacy</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <Crown className="w-4 h-4 text-[#DFBE7E] shrink-0" />
                <span className="text-xs font-semibold text-white">Family Dossiers</span>
              </div>
            </div>

            {/* Direct App Link */}
            <div className="pt-2 text-xs text-[#E8DDD0] flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <span className="text-neutral-400">Also available on mobile:</span>
              <a
                href="https://apps.apple.com/app/id6812288373"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 hover:bg-black text-white text-xs font-bold border border-white/20 transition shadow-xs"
              >
                <span> Download on App Store</span>
                <ExternalLink className="w-3 h-3 text-[#DFBE7E]" />
              </a>
            </div>
          </div>

          {/* Right Column: High-Clarity Dual-Mode Login / Register Box */}
          <div ref={heroFormRef} className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="bg-[#FDFBF7] text-[#161412] p-5 sm:p-7 rounded-3xl shadow-2xl border border-[#E8DDD0] relative overflow-hidden">
              
              {/* Dual Tab Switcher (Log In vs Register Free) */}
              <div className="grid grid-cols-2 p-1 bg-[#F4EAE0] rounded-2xl border border-[#E8DDD0] mb-5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setHeroTab('login')}
                  className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    heroTab === 'login'
                      ? 'bg-[#560406] text-[#F5E6D3] shadow-xs font-extrabold'
                      : 'text-[#6E6259] hover:text-[#560406]'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Member Log In</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHeroTab('register')}
                  className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    heroTab === 'register'
                      ? 'bg-[#560406] text-[#F5E6D3] shadow-xs font-extrabold'
                      : 'text-[#6E6259] hover:text-[#560406]'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register Free</span>
                </button>
              </div>

              {/* TAB 1: MEMBER LOG IN */}
              {heroTab === 'login' && (
                <div className="space-y-4 text-left">
                  <div>
                    <h2 className="text-2xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                      Sign In to Your Account
                    </h2>
                    <p className="text-xs text-[#6E6259] mt-0.5">
                      Access your verified bio-data, messages, and partner matches.
                    </p>
                  </div>

                  {/* 1-Tap Social Logins */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      disabled={loginLoading}
                      onClick={handleAppleSignIn}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#1C0102] hover:bg-[#260102] active:scale-95 text-xs font-bold text-white border border-[#A17B5E]/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 170 170">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.59-7.71-11.72-14.01-6.42-9.79-11.48-20.76-15.17-32.91-3.69-12.16-5.54-23.77-5.54-34.84 0-14.45 3.63-26.47 10.9-36.06 7.27-9.59 16.51-14.44 27.71-14.56 4.91 0 10.42 1.34 16.53 4.02 6.11 2.68 10.15 4.02 12.11 4.02 1.63 0 5.86-1.4 12.69-4.2 6.83-2.8 12.71-4.04 17.65-3.73 13.06.66 23.36 5.62 30.9 14.89-11.54 6.96-17.19 16.64-16.96 29.04.22 9.68 3.86 17.81 10.93 24.39 7.07 6.58 15.46 10.22 25.17 10.92-2.18 6.53-4.8 12.87-7.85 19.01zM119.22 33.64c0-7.39 2.66-14.17 7.99-20.33 5.33-6.17 11.95-10.15 19.86-11.94 1.09 7.61-1.2 14.7-6.87 21.27-5.67 6.57-12.66 10.57-20.98 12-.02-.33-.04-.67-.04-1z" />
                      </svg>
                      <span>{loginLoading ? 'Authenticating...' : 'Continue with Apple'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={loginLoading}
                      onClick={handleGoogleSignIn}
                      className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#F8F6F2] active:scale-95 text-xs font-bold text-[#161412] border border-[#E8DDD0] flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>{loginLoading ? 'Opening Google...' : 'Continue with Google'}</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <div className="flex-1 h-px bg-[#E8DDD0]" />
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#A17B5E]">OR SIGN IN WITH EMAIL</span>
                    <div className="flex-1 h-px bg-[#E8DDD0]" />
                  </div>

                  {/* Email Login Form */}
                  <form onSubmit={handleEmailLogin} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                        Registered Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full h-10 pl-8 pr-3 bg-[#F8F6F2] border border-[#E8DDD0] rounded-xl text-xs font-bold text-[#161412] placeholder-[#A89F91] focus:outline-none focus:ring-2 focus:ring-[#560406]"
                        />
                        <Mail className="w-3.5 h-3.5 text-[#A17B5E] absolute left-2.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="w-full h-11 rounded-xl bg-gradient-to-r from-[#730C0F] via-[#560406] to-[#3A0204] hover:brightness-110 text-[#F5E6D3] text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 border border-[#A17B5E]/50"
                    >
                      <LogIn className="w-3.5 h-3.5 text-[#DFBE7E]" />
                      <span>{loginLoading ? 'Signing In...' : 'Sign In with Email →'}</span>
                    </button>
                  </form>

                  <p className="text-[10px] text-[#8C827A] text-center pt-1">
                    Don't have an account yet?{' '}
                    <button type="button" onClick={() => setHeroTab('register')} className="text-[#560406] font-bold underline cursor-pointer">
                      Register Free Here
                    </button>
                  </p>
                </div>
              )}

              {/* TAB 2: REGISTER FREE */}
              {heroTab === 'register' && (
                <div className="space-y-3.5 text-left">
                  <div>
                    <h2 className="text-2xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                      Register Candidate Profile
                    </h2>
                    <p className="text-xs text-[#6E6259] mt-0.5">
                      Takes 2 minutes · 100% Confidential &amp; Verified
                    </p>
                  </div>

                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    {/* Row 1: Profile For & Gender */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                          Profile For
                        </label>
                        <div className="relative">
                          <select
                            value={regProfileFor}
                            onChange={(e) => setRegProfileFor(e.target.value)}
                            className="w-full h-9 pl-2.5 pr-6 bg-[#F8F6F2] border border-[#E8DDD0] rounded-xl text-xs font-bold text-[#161412] focus:outline-none focus:ring-2 focus:ring-[#560406] appearance-none cursor-pointer"
                          >
                            <option value="My Self">Self</option>
                            <option value="My Son">Son</option>
                            <option value="My Daughter">Daughter</option>
                            <option value="My Brother">Brother</option>
                            <option value="My Sister">Sister</option>
                          </select>
                          <ChevronDown className="w-3 h-3 text-[#8C827A] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                          Gender
                        </label>
                        <div className="grid grid-cols-2 gap-1 h-9 p-0.5 bg-[#F8F6F2] border border-[#E8DDD0] rounded-xl text-xs font-bold">
                          <button
                            type="button"
                            onClick={() => setRegGender('female')}
                            className={`rounded-lg transition cursor-pointer flex items-center justify-center ${
                              regGender === 'female' ? 'bg-[#560406] text-[#F5E6D3] shadow-2xs' : 'text-[#6E6259]'
                            }`}
                          >
                            Female
                          </button>
                          <button
                            type="button"
                            onClick={() => setRegGender('male')}
                            className={`rounded-lg transition cursor-pointer flex items-center justify-center ${
                              regGender === 'male' ? 'bg-[#560406] text-[#F5E6D3] shadow-2xs' : 'text-[#6E6259]'
                            }`}
                          >
                            Male
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Candidate Name */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                        Candidate Full Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full h-9 pl-7 pr-3 bg-[#F8F6F2] border border-[#E8DDD0] rounded-xl text-xs font-bold text-[#161412] placeholder-[#A89F91] focus:outline-none focus:ring-2 focus:ring-[#560406]"
                        />
                        <User className="w-3 h-3 text-[#A17B5E] absolute left-2.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full h-9 pl-7 pr-3 bg-[#F8F6F2] border border-[#E8DDD0] rounded-xl text-xs font-bold text-[#161412] placeholder-[#A89F91] focus:outline-none focus:ring-2 focus:ring-[#560406]"
                        />
                        <Mail className="w-3 h-3 text-[#A17B5E] absolute left-2.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* Mobile & City */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="98765 43210"
                          className="w-full h-9 px-2.5 bg-[#F8F6F2] border border-[#E8DDD0] rounded-xl text-xs font-bold text-[#161412] placeholder-[#A89F91] focus:outline-none focus:ring-2 focus:ring-[#560406]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={regCity}
                          onChange={(e) => setRegCity(e.target.value)}
                          placeholder="e.g. Mumbai"
                          className="w-full h-9 px-2.5 bg-[#F8F6F2] border border-[#E8DDD0] rounded-xl text-xs font-bold text-[#161412] placeholder-[#A89F91] focus:outline-none focus:ring-2 focus:ring-[#560406]"
                        />
                      </div>
                    </div>

                    {regError && (
                      <div className="text-[11px] text-rose-600 font-bold bg-rose-50 border border-rose-200 p-2 rounded-lg">
                        ⚠️ {regError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={regSubmitting}
                      className="w-full h-11 rounded-xl bg-gradient-to-r from-[#730C0F] via-[#560406] to-[#3A0204] hover:brightness-110 text-[#F5E6D3] text-xs font-extrabold uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 border border-[#A17B5E]/50 mt-2"
                    >
                      <Sparkles className="w-4 h-4 text-[#DFBE7E]" />
                      <span>{regSubmitting ? 'Creating Profile...' : 'Create Profile & View Matches →'}</span>
                    </button>
                  </form>

                  <p className="text-[10px] text-[#8C827A] text-center pt-1">
                    Already registered?{' '}
                    <button type="button" onClick={() => setHeroTab('login')} className="text-[#560406] font-bold underline cursor-pointer">
                      Log In Here
                    </button>
                  </p>
                </div>
              )}

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
              onClick={() => {
                setHeroTab('register');
                heroFormRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
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
            onClick={() => navigateToApp('home')}
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
            onClick={() => {
              setHeroTab('register');
              heroFormRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3 rounded-full bg-[#DFBE7E] hover:bg-[#E8DDD0] text-[#1C0102] text-xs font-black uppercase tracking-wider shadow-lg transition cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#1C0102]" />
            <span>Register Free on Web →</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setHeroTab('login');
              heroFormRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
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

      {/* Legal Modal */}
      <LegalModal
        isOpen={showLegal}
        onClose={() => setShowLegal(false)}
        initialDoc={legalInitialDoc}
      />

    </div>
  );
};
