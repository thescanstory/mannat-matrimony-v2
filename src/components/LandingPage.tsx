import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
  X,
  MessageSquare,
  Crown,
  ArrowRight,
  Phone,
  Calendar,
  Check,
  Star,
  Heart,
  ExternalLink,
  Menu
} from 'lucide-react';
import { vipConsultationService, type VipLead } from '../services/vipConsultationService';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const LandingPage: React.FC = () => {
  // Navigation & Modal States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [activePlanTab, setActivePlanTab] = useState(1); // 0: Royale, 1: Imperial, 2: Heritage
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Quick Hero Form State
  const [heroProfileFor, setHeroProfileFor] = useState('Bride');
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNo, setMobileNo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Modal Form State
  const [modalName, setModalName] = useState('');
  const [modalPhone, setModalPhone] = useState('');
  const [modalCity, setModalCity] = useState('');
  const [modalIncome, setModalIncome] = useState('₹5 - ₹10 Lakhs');
  const [modalSubmitting, setModalSubmitting] = useState(false);

  const heroFormRef = useRef<HTMLDivElement>(null);

  const scrollToHeroForm = () => {
    setMobileMenuOpen(false);
    if (heroFormRef.current) {
      heroFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = document.getElementById('heroNameInput');
      if (input) input.focus();
    }
  };

  const handleHeroFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim()) {
      setFormError('Please enter your full name');
      return;
    }
    if (!mobileNo.trim() || mobileNo.length < 8) {
      setFormError('Please enter a valid mobile number');
      return;
    }

    setIsSubmitting(true);
    try {
      const leadData: VipLead = {
        profile_for: `Quick Consultation (${heroProfileFor})`,
        gender: heroProfileFor === 'Bride' ? 'Seeking Female' : 'Seeking Male',
        full_name: fullName.trim(),
        phone_country_code: countryCode,
        phone_number: mobileNo.trim(),
        email: `${fullName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'lead'}@mannatmatrimony.com`,
        city: 'India / Global',
        annual_income: '₹5 - ₹10 Lakhs',
        source_cta: 'Hero Quick Consultation Dock'
      };

      const res = await vipConsultationService.submitLead(leadData);
      setSubmittedLeadId(res.id);
      setShowSuccessModal(true);
    } catch {
      setFormError('Unable to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalName.trim() || !modalPhone.trim()) return;

    setModalSubmitting(true);
    try {
      const leadData: VipLead = {
        profile_for: selectedPlan ? `Package Inquiry: ${selectedPlan}` : 'VIP Consultation Request',
        gender: 'Not Specified',
        full_name: modalName.trim(),
        phone_country_code: '+91',
        phone_number: modalPhone.trim(),
        email: `${modalName.toLowerCase().replace(/[^a-z0-9]/g, '')}@mannatmatrimony.com`,
        city: modalCity || 'India',
        annual_income: modalIncome,
        source_cta: selectedPlan ? `Plan: ${selectedPlan}` : 'Direct Booking Modal'
      };

      const res = await vipConsultationService.submitLead(leadData);
      setSubmittedLeadId(res.id);
      setFullName(modalName);
      setCountryCode('+91');
      setMobileNo(modalPhone);
      setSelectedPlan(null);
      setShowConsultModal(false);
      setShowSuccessModal(true);
    } catch {
      alert('Request failed. Please try again.');
    } finally {
      setModalSubmitting(false);
    }
  };

  // Testimonials
  const testimonials = [
    {
      name: 'Rohan & Sonali Jindal',
      verified: '100% Verified Alliance',
      alliance: 'Solemnized in Mumbai · Dec 2025',
      location: 'Mumbai & New York',
      community: 'Baniya / Agarwal Circle',
      quote: 'Finding a partner who truly understood our family heritage and global aspirations seemed difficult until we consulted Shalini at Mannat Matrimony. The discretion and personal attention made the journey effortless.',
      family: 'Jindal Family (Manufacturing & Real Estate Conglomerate)',
      image: '/images/vip/hero_palace_couple.jpg'
    },
    {
      name: 'Dr. Kabir & Tanya Malhotra',
      verified: '100% Verified Alliance',
      alliance: 'Solemnized in Delhi · Feb 2026',
      location: 'Delhi NCR & London',
      community: 'Punjabi Khatri Lineage',
      quote: 'As practicing medical specialists across two continents, privacy was our top priority. Mannat Matrimony’s BlurShield™ and offline concierge introduced our families with immense dignity and zero public exposure.',
      family: 'Malhotra Family (Eminent Healthcare & Hospital Chain Lineage)',
      image: '/images/vip/couple_window_red.jpg'
    },
    {
      name: 'Meera & Siddharth Varma',
      verified: '100% Verified Alliance',
      alliance: 'Solemnized in Bangalore · Nov 2025',
      location: 'Bangalore & Singapore',
      community: 'Brahmin Tech Leadership',
      quote: 'Our senior matchmaker took the time to listen to our core values, intellectual wavelength, and personal lifestyles. We were guided like trusted family friends rather than clients of an algorithm.',
      family: 'Varma Family (Established Estates & Civil Services Background)',
      image: '/images/vip/couple_floral_saree.jpg'
    },
    {
      name: 'Ananya & Aditya Singhania',
      verified: '100% Verified Alliance',
      alliance: 'Solemnized in Kolkata · Jan 2026',
      location: 'Kolkata & Dubai',
      community: 'Marwari / Jain Circle',
      quote: 'The caliber of circles and the meticulous verification gave our parents complete peace of mind. We are deeply grateful to Mannat Matrimony for bringing our two worlds together so harmoniously.',
      family: 'Singhania Family (Heritage Industrialist & Global Export Circle)',
      image: '/images/vip/couple_silk_saree.jpg'
    }
  ];

  // Membership Packages
  const membershipPlans = [
    {
      name: 'Signature Royale',
      price: '₹75,000',
      tag: 'SELECT ENTRY',
      desc: 'For established families seeking certified profiles with dedicated concierge oversight.',
      features: [
        'Dedicated Senior Matchmaking Consultant',
        'Direct Profile Presentation to Families',
        'Full Background & Credential Verification',
        'BlurShield™ Privacy Lock Protection'
      ]
    },
    {
      name: 'Imperial Bespoke',
      price: '₹1,50,000',
      tag: 'MOST PREFERRED',
      desc: 'Our flagship tier for industrialists, CXOs, and high-net-worth lineages demanding absolute excellence.',
      features: [
        'Principal Consultant Assignment',
        'Unlimited Verified Introductions',
        'In-Person Family Meeting Facilitation in 5-Star Venues',
        'Comprehensive Astrological & Pedigree Matching',
        'Complete Discretion under Strict Mutual NDA'
      ]
    },
    {
      name: 'Heritage Global',
      price: '₹3,00,000',
      tag: 'ULTRA HNI & NRI',
      desc: 'Exclusive service for prominent global dynasties, NRI magnates, and top-tier family offices worldwide.',
      features: [
        'Founder & Executive Level Concierge',
        'Global Cross-Border Matching (US, UK, UAE, India)',
        'Private Chauffeur & Venue Arrangements for Meets',
        'Custom Background Dossier & Asset Verification'
      ]
    }
  ];

  // Instagram Curated Journal Posts
  const instagramPosts = [
    {
      id: 1,
      image: '/images/vip/hero_vip_mansion_couple.jpg',
      caption: 'Celebrating timeless elegance and royal unions. When two extraordinary lineages align.',
      tag: '#EliteWeddings',
      likes: '1,420',
      link: 'https://www.instagram.com/mannatmatrimony_/'
    },
    {
      id: 2,
      image: '/images/vip/couple_floral_saree.jpg',
      caption: 'Behind the velvet ropes: Bespoke consultations crafted with 100% discretion.',
      tag: '#MannatMatrimony',
      likes: '985',
      link: 'https://www.instagram.com/mannatmatrimony_/'
    },
    {
      id: 3,
      image: '/images/vip/couple_window_red.jpg',
      caption: 'Where heritage meets modern intellect. Redefining high-net-worth matchmaking.',
      tag: '#RoyalAlliances',
      likes: '2,130',
      link: 'https://www.instagram.com/mannatmatrimony_/'
    },
    {
      id: 4,
      image: '/images/vip/couple_silk_saree.jpg',
      caption: 'A heartfelt new chapter begins. Wishing our newly solemnized couple a lifetime of joy.',
      tag: '#SuccessStories',
      likes: '1,890',
      link: 'https://www.instagram.com/mannatmatrimony_/'
    }
  ];

  // FAQs
  const faqs = [
    {
      q: 'How is Mannat Matrimony different from regular matrimony portals?',
      a: 'Mannat Matrimony is a 100% offline, bespoke matchmaking consultancy designed for elite, high-net-worth, and distinguished families. Your biodata is strictly private and presented only by senior consultants upon mutual verification.'
    },
    {
      q: 'How does BlurShield™ protect our family privacy?',
      a: 'BlurShield™ guarantees that no photos, contact details, or family identifiers are ever indexed by search engines or viewable publicly. Details are exchanged one-to-one strictly with your prior consent.'
    },
    {
      q: 'What is the verification process for candidates?',
      a: 'Every profile undergoes a 4-point verification check: Government ID authentication, educational credential vetting, company/business registry check, and family background assessment by our senior advisors.'
    },
    {
      q: 'How quickly does the Senior Matchmaker contact us?',
      a: 'Once you submit the consultation request, your assigned Senior Matchmaker contacts you via phone or WhatsApp within 15 minutes to 2 business hours for an initial confidential briefing.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#161412] selection:bg-[#A17B5E]/30 selection:text-[#161412] font-sans overflow-x-hidden">
      
      {/* 1. Header */}
      <header className="sticky top-0 z-50 bg-[#F8F6F2]/98 backdrop-blur-md border-b border-[#E8DDD0] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 h-16 sm:h-20">
            
            {/* Brand Typographic Lockup */}
            <a href="#" className="flex flex-col text-left group shrink-0">
              <span className="text-sm sm:text-base italic font-normal text-[#560406] -mb-1 sm:-mb-1.5 leading-none" style={{ fontFamily: "'Pinyon Script', cursive" }}>
                At
              </span>
              <span className="font-normal text-xl sm:text-3xl tracking-[0.22em] sm:tracking-[0.24em] uppercase text-[#560406] group-hover:text-[#730C0F] transition-colors leading-tight" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}>
                MANNAT
              </span>
              <span className="text-[7px] sm:text-[7.5px] uppercase tracking-[0.3em] sm:tracking-[0.34em] font-bold text-[#A17B5E] -mt-0.5 whitespace-nowrap">
                Bespoke Matchmaking
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-[#6E6259]">
              <a href="#about" className="hover:text-[#560406] transition">Why At Mannat</a>
              <a href="#plans" className="hover:text-[#560406] transition">Membership</a>
              <a href="#stories" className="hover:text-[#560406] transition">Portfolios</a>
              <a href="#instagram" className="hover:text-[#560406] transition">Journal</a>
              <a href="#faq" className="hover:text-[#560406] transition">FAQ</a>
            </nav>

            {/* Right Action */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <a
                href="https://wa.me/919738397933?text=Hello%20Mannat%20Matrimony,%20I%20would%20like%20to%20inquire%20about%20membership."
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#A17B5E]/50 text-[#560406] bg-[#A17B5E]/10 hover:bg-[#A17B5E]/20 text-xs font-bold transition tracking-wide"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#560406]" />
                <span>Private Concierge</span>
              </a>

              <button
                onClick={() => setShowConsultModal(true)}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#730C0F] via-[#560406] to-[#3A0204] hover:brightness-110 text-[#F5E6D3] border border-[#A17B5E]/60 text-xs font-bold tracking-wide shadow-md transition cursor-pointer whitespace-nowrap"
              >
                <span>Private Briefing</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#A17B5E]" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-[#560406] hover:bg-[#560406]/10 transition-colors"
                aria-label="Toggle Menu"
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
              className="md:hidden bg-[#F8F6F2] border-b border-[#560406]/20 px-4 py-4 shadow-xl overflow-hidden space-y-3 text-left"
            >
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <a
                  href="#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 bg-white rounded-xl border border-[#E8DDD0] text-[#161412] flex items-center justify-between"
                >
                  <span>★ Why At Mannat</span>
                </a>
                <a
                  href="#plans"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 bg-white rounded-xl border border-[#E8DDD0] text-[#161412] flex items-center justify-between"
                >
                  <span>👑 Membership</span>
                </a>
                <a
                  href="#stories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 bg-white rounded-xl border border-[#E8DDD0] text-[#161412] flex items-center justify-between"
                >
                  <span>💍 Portfolios</span>
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 bg-white rounded-xl border border-[#E8DDD0] text-[#161412] flex items-center justify-between"
                >
                  <span>❓ FAQs</span>
                </a>
              </div>
              <button
                onClick={scrollToHeroForm}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D8B486] via-[#C5A880] to-[#A17B5E] text-[#1C0102] text-xs font-black flex items-center justify-center gap-1.5 shadow-sm border border-[#F5E6D3]/40"
              >
                <span>✦ Request Confidential Briefing</span>
              </button>
              <div className="pt-1 flex gap-2">
                <a
                  href="https://wa.me/919738397933?text=Hello%20Mannat%20Matrimony,%20I%20would%20like%20to%20inquire%20about%20membership."
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-[#2E0507] border border-[#A17B5E]/40 text-[#D8B486] text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:bg-[#3D080A]"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#D8B486]" />
                  <span>Private Concierge</span>
                </a>
                <a
                  href="tel:+919738397933"
                  className="flex-1 py-2.5 rounded-xl bg-[#560406] text-[#F5E6D3] border border-[#A17B5E]/30 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-[#A17B5E]" />
                  <span>Advisor Hotline</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. Hero Section: High Impact, Crisp, Snappy */}
      <section className="relative overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/vip/hero_vip_mansion_couple.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#260102]/92 via-[#3A0204]/80 to-[#1C0102]/95 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-14 pb-8 sm:pb-12 space-y-4 sm:space-y-6">
          
          <div className="flex items-center justify-center gap-2 text-[#A17B5E]">
            <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#A17B5E]" />
            <span className="text-[8.5px] sm:text-[10px] uppercase tracking-[0.26em] sm:tracking-[0.32em] font-semibold text-[#A17B5E]">THE HOUSE OF MANNAT · BESPOKE ALLIANCES</span>
            <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#A17B5E]" />
          </div>

          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-normal text-white tracking-[0.02em] drop-shadow-md leading-[1.15]"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
          >
            No. 1 Matchmaking Service for Elites
          </h1>

          <div
            className="text-xs sm:text-base text-neutral-100 font-normal tracking-[0.04em] max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3 leading-relaxed"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <span className="font-semibold text-white">5x Higher Success Rates</span>
            <span className="text-[#A17B5E]">◆</span>
            <span className="font-semibold text-white">Assured Meetings</span>
            <span className="text-[#A17B5E]">◆</span>
            <span className="font-semibold text-white">100% Discretion</span>
          </div>

          {/* Snappy Consultation Form Dock */}
          <div ref={heroFormRef} className="w-full max-w-4xl mx-auto pt-2 sm:pt-4">
            <div className="bg-gradient-to-r from-[#3A0204] via-[#560406] to-[#3A0204] p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(86,4,6,0.55)] border border-[#A17B5E]/40 ring-1 ring-[#A17B5E]/20 backdrop-blur-md">
              
              <form onSubmit={handleHeroFormSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-2.5 items-center">
                
                {/* Field 1: Seeking */}
                <div className="sm:col-span-3 relative">
                  <select
                    value={heroProfileFor}
                    onChange={(e) => setHeroProfileFor(e.target.value)}
                    className="w-full h-11 pl-3 pr-7 bg-white rounded-xl text-sm sm:text-xs font-bold text-[#161412] border border-neutral-200/50 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#A17B5E] appearance-none cursor-pointer"
                  >
                    <option value="Bride">Seeking: Bride</option>
                    <option value="Groom">Seeking: Groom</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Field 2: Name */}
                <div className="sm:col-span-3">
                  <input
                    id="heroNameInput"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full h-11 px-3 bg-white rounded-xl text-sm sm:text-xs font-medium text-[#161412] placeholder-neutral-400 border border-neutral-200/50 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#A17B5E]"
                  />
                </div>

                {/* Field 3: Phone */}
                <div className="sm:col-span-3 flex items-center bg-white rounded-xl h-11 px-2.5 border border-neutral-200/50 shadow-xs focus-within:ring-2 focus-within:ring-[#A17B5E]">
                  <span className="text-xs font-bold text-[#161412] pr-1.5 border-r border-neutral-200">+91</span>
                  <input
                    type="tel"
                    required
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                    placeholder="Mobile Number"
                    className="w-full pl-2 bg-transparent text-sm sm:text-xs font-medium text-[#161412] placeholder-neutral-400 focus:outline-none"
                  />
                </div>

                {/* Field 4: Submit Button */}
                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 px-4 rounded-xl bg-gradient-to-r from-[#D8B486] via-[#C5A880] to-[#A17B5E] hover:brightness-105 text-[#1C0102] text-xs font-black shadow-md cursor-pointer transition whitespace-nowrap flex items-center justify-center gap-1.5 border border-[#F5E6D3]/30"
                  >
                    <span>{isSubmitting ? 'Connecting...' : 'Request Private Briefing'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#1C0102]" />
                  </button>
                </div>

              </form>

              {formError && (
                <div className="text-[11px] text-rose-300 font-semibold pt-1.5 text-left">
                  ⚠️ {formError}
                </div>
              )}

            </div>

            {/* Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-2.5 sm:p-3.5 mt-3 rounded-2xl bg-[#1C0102]/85 backdrop-blur-md border border-[#A17B5E]/30 text-center shadow-lg">
              <div className="space-y-0.5 border-r border-[#A17B5E]/20 pr-1">
                <div className="text-base sm:text-xl font-bold text-[#FDFCFC]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>₹500Cr+</div>
                <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#A17B5E] font-semibold truncate">Matched Lineages</div>
              </div>
              <div className="space-y-0.5 sm:border-r border-[#A17B5E]/20 sm:pr-1">
                <div className="text-base sm:text-xl font-bold text-[#FDFCFC]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>100%</div>
                <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#A17B5E] font-semibold truncate">Offline Discretion</div>
              </div>
              <div className="space-y-0.5 border-r border-[#A17B5E]/20 pr-1">
                <div className="text-base sm:text-xl font-bold text-[#FDFCFC]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>5x Higher</div>
                <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#A17B5E] font-semibold truncate">Success Rates</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-base sm:text-xl font-bold text-[#FDFCFC]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>1-on-1</div>
                <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#A17B5E] font-semibold truncate">Principal Matchmaker</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. The 3 Pillars (Compact Strip) */}
      <section id="about" className="py-8 sm:py-12 bg-white border-b border-[#E8DDD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6">
            <div className="bg-[#F8F6F2] p-4 sm:p-6 rounded-2xl border border-[#E8DDD0] flex items-start gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#560406] text-[#A17B5E] flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                ★
              </div>
              <div>
                <h3 className="text-base font-bold text-[#161412]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>5x Higher Success Rates</h3>
                <p className="text-xs text-[#6E6259] leading-relaxed pt-0.5">Curated high-compatibility matches based on family pedigree and lifestyle harmony.</p>
              </div>
            </div>

            <div className="bg-[#F8F6F2] p-4 sm:p-6 rounded-2xl border border-[#E8DDD0] flex items-start gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#560406] text-[#A17B5E] flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                🛡️
              </div>
              <div>
                <h3 className="text-base font-bold text-[#161412]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>100% Verified Circles</h3>
                <p className="text-xs text-[#6E6259] leading-relaxed pt-0.5">Mandatory credentials, business background, and family reputation verification.</p>
              </div>
            </div>

            <div className="bg-[#F8F6F2] p-4 sm:p-6 rounded-2xl border border-[#E8DDD0] flex items-start gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#560406] text-[#A17B5E] flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                🔒
              </div>
              <div>
                <h3 className="text-base font-bold text-[#161412]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>BlurShield™ Confidentiality</h3>
                <p className="text-xs text-[#6E6259] leading-relaxed pt-0.5">Zero public profiles. Biodatas and portraits shared 1-on-1 only after mutual consent.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Membership Packages: Snappy Tabbed Card on Mobile, 3-Columns on Desktop */}
      <section id="plans" className="py-10 sm:py-16 bg-[#FBF9F4] border-b border-[#E8DDD0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          
          <div className="text-center space-y-1 sm:space-y-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#560406]">
              Curated Packages
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#161412]" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}>
              Bespoke Membership Tiers
            </h2>
          </div>

          {/* Mobile Tab Switcher */}
          <div className="md:hidden flex p-1 rounded-xl bg-[#E8DDD0]/50 border border-[#E8DDD0] gap-1">
            {['Royale', 'Imperial (VIP)', 'Heritage Global'].map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setActivePlanTab(idx)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center ${
                  activePlanTab === idx
                    ? 'bg-[#560406] text-[#A17B5E] shadow-sm'
                    : 'text-[#6E6259]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Desktop 3-Card Grid / Mobile Tabbed Active Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {membershipPlans.map((plan, idx) => {
              const isHiddenOnMobile = activePlanTab !== idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl sm:rounded-3xl p-5 sm:p-7 transition-all flex flex-col justify-between text-left space-y-5 ${
                    isHiddenOnMobile ? 'hidden md:flex' : 'flex'
                  } ${
                    idx === 1
                      ? 'bg-gradient-to-b from-[#3A0204] via-[#560406] to-[#260102] text-white border-2 border-[#A17B5E] shadow-xl'
                      : 'bg-white text-[#161412] border border-[#E8DDD0] shadow-sm'
                  }`}
                >
                  <div className="space-y-3">
                    <div className={`inline-block px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider ${
                      idx === 1 ? 'bg-[#A17B5E] text-[#260102]' : 'bg-[#F8F6F2] text-[#560406] border border-[#E8DDD0]'
                    }`}>
                      {plan.tag}
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                        {plan.name}
                      </h3>
                      <div className={`text-lg sm:text-xl font-black mt-0.5 ${idx === 1 ? 'text-[#A17B5E]' : 'text-[#560406]'}`}>
                        {plan.price}
                      </div>
                    </div>

                    <p className={`text-xs leading-relaxed ${idx === 1 ? 'text-neutral-200' : 'text-[#6E6259]'}`}>
                      {plan.desc}
                    </p>

                    <div className="pt-3 space-y-2 border-t border-white/10">
                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs">
                          <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${idx === 1 ? 'text-[#A17B5E]' : 'text-[#560406]'}`} />
                          <span className={idx === 1 ? 'text-neutral-200' : 'text-[#6E6259]'}>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedPlan(plan.name);
                      setShowConsultModal(true);
                    }}
                    className={`w-full py-3 rounded-xl font-bold text-xs transition cursor-pointer shadow-md text-center flex items-center justify-center gap-1.5 ${
                      idx === 1
                        ? 'bg-[#A17B5E] text-[#260102] hover:brightness-105 font-black'
                        : 'bg-[#560406] text-white hover:bg-[#730C0F]'
                    }`}
                  >
                    <span>Inquire for {plan.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. Success Stories & Distinguished Alliances: Compact Carousel */}
      <section id="stories" className="py-10 sm:py-16 bg-white border-b border-[#E8DDD0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-1 text-left">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#560406] flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-[#A17B5E]" />
                <span>VERIFIED ALLIANCES</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#161412]" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}>
                Distinguished Matches
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveStoryIdx((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                className="w-9 h-9 rounded-full bg-[#F8F6F2] border border-[#E8DDD0] hover:bg-[#560406] hover:text-[#A17B5E] text-[#161412] flex items-center justify-center transition"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveStoryIdx((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                className="w-9 h-9 rounded-full bg-[#F8F6F2] border border-[#E8DDD0] hover:bg-[#560406] hover:text-[#A17B5E] text-[#161412] flex items-center justify-center transition"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-[#F8F6F2] rounded-2xl sm:rounded-3xl border border-[#730C0F]/20 overflow-hidden shadow-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStoryIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-12 items-stretch"
              >
                {/* Photo */}
                <div className="md:col-span-5 relative h-56 sm:h-80 md:min-h-[360px] overflow-hidden bg-neutral-900">
                  <img
                    src={testimonials[activeStoryIdx].image}
                    alt={testimonials[activeStoryIdx].name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#260102]/90 via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 bg-[#3A0204]/90 px-3 py-1 rounded-full border border-[#A17B5E]/40 text-[10px] font-bold text-[#A17B5E] flex items-center gap-1 shadow">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#A17B5E]" />
                    <span>{testimonials[activeStoryIdx].verified}</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white text-left space-y-0.5">
                    <div className="text-[9px] uppercase font-bold text-[#A17B5E]">{testimonials[activeStoryIdx].alliance}</div>
                    <div className="text-lg font-bold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{testimonials[activeStoryIdx].name}</div>
                    <div className="text-[11px] text-neutral-300">{testimonials[activeStoryIdx].location}</div>
                  </div>
                </div>

                {/* Quote Content */}
                <div className="md:col-span-7 p-4 sm:p-8 flex flex-col justify-between text-left space-y-4 bg-white md:bg-transparent">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-[#A17B5E]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#A17B5E] text-[#A17B5E]" />
                      ))}
                      <span className="text-[11px] font-bold text-[#560406] ml-2">{testimonials[activeStoryIdx].community}</span>
                    </div>

                    <blockquote
                      className="text-sm sm:text-lg text-[#161412] font-medium leading-relaxed italic"
                      style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                    >
                      "{testimonials[activeStoryIdx].quote}"
                    </blockquote>

                    <div className="text-[11px] text-[#6E6259]">
                      <strong className="text-[#161412] block">{testimonials[activeStoryIdx].family}</strong>
                      Facilitated confidentially under mutual non-disclosure agreement.
                    </div>
                  </div>

                  <button
                    onClick={() => setShowConsultModal(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#560406] hover:bg-[#730C0F] text-[#A17B5E] text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <span>Request Similar Match</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 6. Instagram Journal Grid (Compact 2x2) */}
      <section id="instagram" className="py-10 sm:py-16 bg-[#F8F6F2] border-b border-[#E8DDD0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex items-center justify-between gap-4 text-left">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#560406]">
                <InstagramIcon className="w-3.5 h-3.5 text-[#560406]" />
                <span>FOLLOW JOURNAL</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-bold text-[#161412]" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}>
                Glimpses from @mannatmatrimony_
              </h2>
            </div>

            <a
              href="https://www.instagram.com/mannatmatrimony_/"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-[#560406] text-[#A17B5E] text-xs font-bold flex items-center gap-1.5 hover:bg-[#730C0F] transition shadow-xs shrink-0"
            >
              <span>Follow</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
            {instagramPosts.map((post) => (
              <a
                key={post.id}
                href={post.link}
                target="_blank"
                rel="noreferrer"
                className="group relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/5] bg-neutral-900 shadow-xs block"
              >
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white text-left space-y-0.5">
                  <div className="text-[9px] font-bold text-[#A17B5E]">{post.tag}</div>
                  <div className="flex items-center gap-1 text-[10px] text-neutral-300">
                    <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                    <span>{post.likes}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* 7. FAQs (Compact Accordion) */}
      <section id="faq" className="py-10 sm:py-16 bg-white border-b border-[#E8DDD0]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="text-center space-y-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#560406]">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#161412]" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-2 text-left">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#F8F6F2] rounded-xl border border-[#E8DDD0] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <span className="font-bold text-[#161412] text-sm sm:text-base leading-snug" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#560406] transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <div className="px-4 pb-4 text-xs sm:text-sm text-[#6E6259] leading-relaxed border-t border-[#E8DDD0] pt-2.5">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8. Footer */}
      <footer id="contact" className="bg-[#1C0102] text-[#E8DDD0] pt-10 sm:pt-14 pb-28 sm:pb-16 border-t border-[#2A0203]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-white/10 text-center sm:text-left">
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-sm italic font-normal text-white -mb-1 leading-none" style={{ fontFamily: "'Pinyon Script', cursive" }}>
                At
              </span>
              <div className="text-xl sm:text-2xl font-normal text-white tracking-[0.24em] uppercase" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}>
                MANNAT
              </div>
              <span className="text-[7px] uppercase tracking-[0.34em] font-bold text-[#A17B5E] mt-0.5">
                Bespoke Elite Matchmaking
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://wa.me/919738397933?text=Hello%20Mannat%20Matrimony,%20I%20would%20like%20to%20inquire%20about%20membership."
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-[#2E0507] border border-[#A17B5E]/40 text-[#D8B486] text-xs font-bold flex items-center gap-1.5 hover:bg-[#3D080A] transition shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#D8B486]" />
                <span>Private Concierge</span>
              </a>
              <button
                onClick={() => setShowConsultModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D8B486] via-[#C5A880] to-[#A17B5E] text-[#1C0102] text-xs font-black border border-[#F5E6D3]/40 shadow-sm hover:brightness-105 transition"
              >
                Reserve Consultation
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A89CAE] gap-2 text-center sm:text-left">
            <div>
              © 2026 Mannat Matrimony. All rights reserved. Strict Non-Disclosure &amp; BlurShield Protected.
            </div>
            <div className="flex items-center gap-4">
              <a href="/admin" className="text-[#A17B5E] hover:underline">Admin Portal</a>
              <a href="tel:+919738397933" className="hover:text-white">Hotline: +91 97383 97933</a>
            </div>
          </div>

        </div>
      </footer>

      {/* 9. Floating Bottom Quick Action Dock for Mobile Conversion */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#160102]/95 backdrop-blur-md border-t border-[#A17B5E]/30 px-3 py-2 sm:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.5)] safe-area-inset-bottom">
        <div className="flex items-center gap-2.5">
          <a
            href="https://wa.me/919738397933?text=Hello%20Mannat%20Matrimony,%20I%20would%20like%20to%20inquire%20about%20membership."
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-3 rounded-xl bg-[#2A0406] border border-[#A17B5E]/50 text-[#D8B486] text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#D8B486]" />
            <span>Private Concierge</span>
          </a>
          <button
            onClick={() => setShowConsultModal(true)}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#D8B486] via-[#C5A880] to-[#A17B5E] text-[#160102] text-xs font-black flex items-center justify-center gap-1.5 shadow-lg border border-[#F5E6D3]/40 active:scale-95 transition"
          >
            <Calendar className="w-3.5 h-3.5 text-[#160102]" />
            <span>Private Briefing</span>
          </button>
        </div>
      </div>

      {/* 10. Direct Consultation Booking Modal */}
      <AnimatePresence>
        {showConsultModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-2 border-[#730C0F]/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl relative"
            >
              <button
                onClick={() => {
                  setShowConsultModal(false);
                  setSelectedPlan(null);
                }}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-[#F8F4EF] text-[#560406] hover:text-[#161412] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#560406] to-[#260102] text-[#A17B5E] flex items-center justify-center mx-auto shadow-md text-xl font-bold border border-[#A17B5E]/30">
                👑
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#560406]">
                  {selectedPlan ? 'PACKAGE INQUIRY' : 'CONFIDENTIAL BRIEFING'}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#161412]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {selectedPlan ? `${selectedPlan} Tier` : 'Book Private Consultation'}
                </h3>
                <p className="text-xs text-[#6E6259]">
                  A Senior Matchmaker will contact you confidentially within 15 mins.
                </p>
              </div>

              <form onSubmit={handleModalSubmit} className="space-y-3 text-left pt-1">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full h-11 px-3 bg-[#F8F6F2] border border-[#E8DDD0] rounded-xl text-sm sm:text-xs font-semibold text-[#161412] focus:outline-none focus:ring-2 focus:ring-[#560406]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={modalPhone}
                    onChange={(e) => setModalPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="w-full h-11 px-3 bg-[#F8F6F2] border border-[#E8DDD0] rounded-xl text-sm sm:text-xs font-semibold text-[#161412] focus:outline-none focus:ring-2 focus:ring-[#560406]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                      City of Residence
                    </label>
                    <input
                      type="text"
                      value={modalCity}
                      onChange={(e) => setModalCity(e.target.value)}
                      placeholder="e.g. Mumbai / London"
                      className="w-full h-11 px-3 bg-[#F8F6F2] border border-[#E8DDD0] rounded-xl text-sm sm:text-xs font-semibold text-[#161412] focus:outline-none focus:ring-2 focus:ring-[#560406]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                      Annual Income
                    </label>
                    <select
                      value={modalIncome}
                      onChange={(e) => setModalIncome(e.target.value)}
                      className="w-full h-11 px-2.5 bg-[#F8F6F2] border border-[#E8DDD0] rounded-xl text-sm sm:text-xs font-semibold text-[#161412] focus:ring-2 focus:ring-[#560406]"
                    >
                      <option>₹5 - ₹10 Lakhs</option>
                      <option>₹10 - ₹25 Lakhs</option>
                      <option>₹25 - ₹50 Lakhs</option>
                      <option>₹50 Lakhs - ₹1 Cr</option>
                      <option>₹1 Crore - ₹5 Crores</option>
                      <option>₹5 Crores+ (Ultra HNI)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#730C0F] via-[#560406] to-[#3A0204] hover:brightness-110 text-white text-xs font-bold shadow-lg transition cursor-pointer mt-1 border border-[#A17B5E]/30 flex items-center justify-center gap-1.5"
                >
                  {modalSubmitting ? 'Submitting...' : 'Confirm Consultation Request →'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 11. Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-2 border-[#730C0F]/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl relative"
            >
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-[#F8F4EF] text-[#560406] hover:text-[#161412] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#560406] to-[#260102] text-[#A17B5E] flex items-center justify-center mx-auto shadow-lg border border-[#A17B5E]/30">
                <Crown className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#560406]">
                  Consultation Request Confirmed
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#161412]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  Welcome to Mannat Matrimony
                </h3>
                <p className="text-xs text-[#6E6259] leading-relaxed">
                  Thank you, <strong className="text-[#161412]">{fullName}</strong>. Your reference ID is <strong className="text-[#560406] font-mono">{submittedLeadId}</strong>. A Senior Matchmaker will contact you confidentially on <strong className="text-[#161412]">{countryCode} {mobileNo}</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8F4EF] border border-[#E8DDD0] space-y-1 text-left">
                <div className="flex items-center gap-2 text-xs font-bold text-[#161412]">
                  <CheckCircle2 className="w-4 h-4 text-[#560406]" />
                  <span>Assigned Consultant: Shalini Singhania</span>
                </div>
                <div className="text-[11px] text-[#7E776F]">
                  Expected Callback: Within 15 Mins to 2 Business Hours
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <a
                  href={`https://wa.me/919738397933?text=Hello%20Mannat%20Matrimony,%20I%20have%20submitted%20a%20request%20with%20ID:%20${submittedLeadId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 rounded-xl bg-[#2E0507] border border-[#A17B5E]/50 hover:bg-[#3D080A] text-[#D8B486] text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                >
                  <MessageSquare className="w-4 h-4 text-[#D8B486]" />
                  <span>Private Concierge</span>
                </a>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#730C0F] to-[#560406] hover:brightness-110 text-[#F5E6D3] text-xs font-bold cursor-pointer transition border border-[#A17B5E]/30"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
