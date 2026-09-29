import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  X,
  User,
  Calendar,
  Users,
  ShieldCheck,
  Info,
  HelpCircle,
  Sparkles,
  Lock,
  ChevronDown
} from 'lucide-react';
import { vipConsultationService } from '../services/vipConsultationService';
import { authService, type UserSession } from '../services/authService';
import { profileService } from '../services/profileService';
import type { Profile } from '../types';

export interface RegistrationFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (session?: UserSession) => void;
  initialMode?: 'register' | 'login';
  initialProfileFor?: string;
  onOpenLegal?: (type: 'terms' | 'privacy') => void;
}

const PROFILE_FOR_OPTIONS = [
  'Myself',
  'My Son',
  'My Daughter',
  'My Brother',
  'My Sister',
  'My Friend',
  'My Relative',
  'Client / Other',
];

const RELIGION_OPTIONS = [
  'Christian',
  'Hindu',
  'Muslim',
  'Sikh',
  'Jain',
  'Parsi',
  'Buddhist',
  'Jewish',
  'Spiritual - Not Religious',
  'Other',
];

const COMMUNITY_BY_RELIGION: Record<string, string[]> = {
  Christian: [
    'Roman Catholic',
    'Latin Catholic',
    'Protestant',
    'Syrian Catholic',
    'Pentecostal',
    'CSI (Church of South India)',
    'Jacobite',
    'Marthomite',
    'Born Again',
    'Baptist',
    'Methodist',
    'Tamil Christian',
    'Malayalee Christian',
    'Goan Christian',
    'Anglo-Indian',
    'Other Christian',
  ],
  Hindu: [
    'Tamil',
    'Telugu',
    'Punjabi',
    'Bengali',
    'Gujarati',
    'Malayalee',
    'Marathi',
    'Kannada',
    'Hindi',
    'Marwari',
    'Sindhi',
    'Brahmin',
    'Kshatriya / Rajput',
    'Vaishya / Bania / Agarwal',
    'Maratha',
    'Nair',
    'Reddy',
    'Jat',
    'Patel',
    'Kayastha',
    'Iyer',
    'Iyengar',
    'Mudaliar',
    'Nadar',
    'Chettiar',
    'Gowda',
    'Lingayat',
    'Yadav',
    'Khatri / Arora',
    'Other Hindu',
  ],
  Muslim: [
    'Sunni',
    'Shia',
    'Hanafi',
    'Shafi',
    'Bohra',
    'Khoja',
    'Pathan',
    'Syed',
    'Ansari',
    'Qureshi',
    'Tamil Muslim',
    'Malayalee Muslim',
    'Other Muslim',
  ],
  Sikh: [
    'Jat Sikh',
    'Ramgharia',
    'Khatri Sikh',
    'Arora Sikh',
    'Saini',
    'Ahluwalia',
    'Gursikh',
    'Amritdhari',
    'Other Sikh',
  ],
  Jain: [
    'Digambar',
    'Shwetambar',
    'Oswal',
    'Khandelwal',
    'Porwal',
    'Other Jain',
  ],
};

const DEFAULT_COMMUNITIES = [
  'Tamil',
  'Punjabi',
  'Telugu',
  'Bengali',
  'Gujarati',
  'Malayalee',
  'Marathi',
  'Kannada',
  'Hindi',
  'Marwari',
  'Sindhi',
  'Open to All Communities',
  'Other',
];

const COUNTRY_OPTIONS = [
  { code: '+91', name: 'India' },
  { code: '+1', name: 'United States' },
  { code: '+44', name: 'United Kingdom' },
  { code: '+1', name: 'Canada' },
  { code: '+61', name: 'Australia' },
  { code: '+971', name: 'United Arab Emirates' },
  { code: '+65', name: 'Singapore' },
  { code: '+49', name: 'Germany' },
  { code: '+64', name: 'New Zealand' },
  { code: '+60', name: 'Malaysia' },
  { code: '+974', name: 'Qatar' },
  { code: '+966', name: 'Saudi Arabia' },
  { code: '+965', name: 'Kuwait' },
  { code: '+973', name: 'Bahrain' },
  { code: '+353', name: 'Ireland' },
  { code: '+41', name: 'Switzerland' },
];

export const RegistrationFlowModal: React.FC<RegistrationFlowModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'register',
  initialProfileFor = 'Myself',
  onOpenLegal,
}) => {
  const [mode, setMode] = useState<'register' | 'login'>(initialMode);
  const [step, setStep] = useState<number>(1);

  // Form Fields
  const [profileFor, setProfileFor] = useState(initialProfileFor);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [religion, setReligion] = useState('Christian');
  const [community, setCommunity] = useState('Tamil');
  const [country, setCountry] = useState('India');
  const [countryCode, setCountryCode] = useState('+91');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Login Tab Form Fields
  const [loginEmail, setLoginEmail] = useState('');

  // UI State
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCommunityTooltip, setShowCommunityTooltip] = useState(false);

  // Refs for auto-advancing DOB inputs
  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Religion Change
  const handleReligionChange = (newReligion: string) => {
    setReligion(newReligion);
    const available = COMMUNITY_BY_RELIGION[newReligion] || DEFAULT_COMMUNITIES;
    setCommunity(available[0] || 'Open to All');
  };

  // DOB Day input auto jump
  const handleDayChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 2);
    setDobDay(cleaned);
    if (cleaned.length === 2 && monthRef.current) {
      monthRef.current.focus();
    }
  };

  // DOB Month input auto jump
  const handleMonthChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 2);
    setDobMonth(cleaned);
    if (cleaned.length === 2 && yearRef.current) {
      yearRef.current.focus();
    }
  };

  // DOB Year input
  const handleYearChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4);
    setDobYear(cleaned);
  };

  // Step 1: Select Profile For
  const handleSelectProfileFor = (option: string) => {
    setProfileFor(option);
    setErrorMessage(null);
    setStep(2);
  };

  // Step 2: Name Validation
  const handleStep2Continue = () => {
    setErrorMessage(null);
    if (!firstName.trim()) {
      setErrorMessage('Please enter candidate first name');
      return;
    }
    if (!lastName.trim()) {
      setErrorMessage('Please enter candidate last name');
      return;
    }
    setStep(3);
  };

  // Step 3: DOB Validation
  const handleStep3Continue = () => {
    setErrorMessage(null);
    const day = parseInt(dobDay, 10);
    const month = parseInt(dobMonth, 10);
    const year = parseInt(dobYear, 10);
    const currentYear = new Date().getFullYear();

    if (!day || day < 1 || day > 31) {
      setErrorMessage('Please enter a valid day (01-31)');
      return;
    }
    if (!month || month < 1 || month > 12) {
      setErrorMessage('Please enter a valid month (01-12)');
      return;
    }
    if (!year || year < 1940 || year > currentYear - 18) {
      setErrorMessage(`Candidate must be at least 18 years old (born ${currentYear - 18} or earlier)`);
      return;
    }

    setStep(4);
  };

  // Step 4: Religion & Community Validation
  const handleStep4Continue = () => {
    setErrorMessage(null);
    if (!religion) {
      setErrorMessage('Please select religion');
      return;
    }
    setStep(5);
  };

  // Step 5: Final Submission (Email & Phone)
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please provide a valid email address');
      return;
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    setSubmitting(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      const birthDate = `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`;

      // 1. Authenticate & initialize user session
      const session = authService.setUserSession(cleanEmail, fullName);

      // 2. Calculate verified age
      const currentYear = new Date().getFullYear();
      const birthYearInt = parseInt(dobYear, 10) || (currentYear - 25);
      const calculatedAge = Math.max(18, currentYear - birthYearInt);

      // 3. Determine managed_by and gender from Profile For
      const isParentManaged = profileFor.toLowerCase().includes('son') || profileFor.toLowerCase().includes('daughter');
      const managedBy = isParentManaged ? 'parents' : (profileFor.toLowerCase().includes('myself') ? 'self' : 'sibling');
      const isFemale = profileFor.toLowerCase().includes('daughter') || profileFor.toLowerCase().includes('sister');
      const gender = isFemale ? 'female' : 'male';

      const defaultAvatar = isFemale
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000';

      // 4. Build comprehensive official Candidate Profile
      const officialProfile: Partial<Profile> = {
        id: session.id,
        user_id: session.id,
        display_name: fullName,
        age: calculatedAge,
        height: isFemale ? "5'6\"" : "5'11\"",
        city: country,
        religion: religion,
        community: community,
        sub_community: community,
        occupation: 'Senior Professional / Corporate Leader',
        company_name: 'Private Enterprise',
        education: 'Graduate / Post-Graduate Degree',
        bio_text: `Warm, ambitious, and family-oriented candidate. Profile registered for ${profileFor}. Seeking an intellectually compatible, authentic alliance with mutual values.`,
        bio_video_url: '',
        photos: [defaultAvatar],
        managed_by: managedBy,
        compatibility_score: 98,
        gun_milan_score: 34,
        is_vouched: true,
        is_spotlight: true,
        is_unlocked: true,
        lifestyle_details: {
          diet: 'Vegetarian',
          salary_bracket: '₹35L - ₹50L',
          family_background: `Residing in ${country} (${religion} - ${community})`,
          marriage_expectations: 'Mutual respect, shared goals, and traditional family harmony',
          gender: gender,
          user_id: session.id,
        },
        horoscope: {
          rashi: 'Simha (Leo)',
          nakshatra: 'Magha',
          manglik: 'No',
          birth_time: '10:15 AM',
          birth_place: country,
        }
      };

      // 5. Persist profile to directory & storage
      await profileService.createProfile(officialProfile);

      // 6. Save VIP consultation lead
      await vipConsultationService.submitLead({
        profile_for: profileFor,
        full_name: fullName,
        phone_country_code: countryCode,
        phone_number: cleanPhone,
        email: cleanEmail,
        city: country,
        community: `${religion} - ${community}`,
        source_cta: 'Web 5-Step Registration Modal',
        notes: `DOB: ${birthDate}, Age: ${calculatedAge}, Country: ${country}`,
      });

      // 7. Mark onboarded
      localStorage.setItem('mannat_onboarded_' + session.id, 'true');
      localStorage.setItem('mannat_onboarded_' + cleanEmail, 'true');

      setTimeout(() => {
        setSubmitting(false);
        onSuccess(session);
        onClose();
      }, 300);
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrorMessage('Something went wrong creating your profile. Please try again.');
      setSubmitting(false);
    }
  };

  // Direct Login Handler
  const handleDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const cleanEmail = loginEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    try {
      const session = authService.setUserSession(cleanEmail, cleanEmail.split('@')[0]);
      setTimeout(() => {
        setSubmitting(false);
        onSuccess(session);
        onClose();
      }, 200);
    } catch (err) {
      setErrorMessage('Login failed. Please try again.');
      setSubmitting(false);
    }
  };

  // Google Sign In
  const handleGoogleAuth = async () => {
    setSubmitting(true);
    try {
      const res = await authService.signInWithGoogle();
      if (res?.data) {
        onSuccess(res.data);
        onClose();
      }
    } catch (err) {
      console.warn('Google sign-in error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Apple Sign In
  const handleAppleAuth = async () => {
    setSubmitting(true);
    try {
      const res = await authService.signInWithApple();
      if (res?.data) {
        onSuccess(res.data);
        onClose();
      }
    } catch (err) {
      console.warn('Apple sign-in error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    setErrorMessage(null);
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      onClose();
    }
  };

  const stepTitles = [
    'Profile For',
    'Candidate Name',
    'Date of Birth',
    'Background',
    'Verification'
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="relative w-full max-w-[780px] bg-[#FDFAF7] rounded-[28px] shadow-2xl overflow-hidden border border-[#DFBE7E]/40 my-auto text-[#161412]"
      >
        {/* Top Grand Accent Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#DFBE7E] via-[#560406] to-[#DFBE7E]" />

        {/* Step Progress Header */}
        {mode === 'register' && (
          <div className="px-6 sm:px-10 pt-5 pb-1">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A17B5E]">
                Step {step} of 5 &bull; {stepTitles[step - 1]}
              </span>
              <span className="text-[10px] font-bold text-[#560406]">
                {Math.round((step / 5) * 100)}% Completed
              </span>
            </div>
            
            {/* 5-Segment Progress Bar */}
            <div className="grid grid-cols-5 gap-2 w-full">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s <= step
                      ? 'bg-gradient-to-r from-[#730C0F] to-[#560406] shadow-xs'
                      : 'bg-[#EFE7DE]'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Modal Navigation Header */}
        <div className="flex items-center justify-between px-6 sm:px-10 pt-3 pb-1">
          {mode === 'register' ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#560406] bg-[#560406]/5 hover:bg-[#560406]/15 transition cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div className="w-14" />
          )}

          {/* Mode Switch Pills */}
          <div className="flex bg-[#EFE7DE] p-0.5 rounded-full text-[11px] font-semibold border border-[#E8DDD0]">
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-[#560406] text-[#F5E6D3] shadow-xs'
                  : 'text-[#6E6259] hover:text-[#560406]'
              }`}
            >
              Register Free
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#560406] text-[#F5E6D3] shadow-xs'
                  : 'text-[#6E6259] hover:text-[#560406]'
              }`}
            >
              Log In
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 -mr-1.5 text-[#8C827A] hover:text-[#560406] hover:bg-[#560406]/10 rounded-full transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mx-6 sm:mx-10 mt-2 px-3.5 py-2 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <Info className="w-3.5 h-3.5 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ================= REGISTER MODE ================= */}
        {mode === 'register' && (
          <div className="px-6 sm:px-10 pb-7 pt-3">
            
            {/* STEP 1: "This Profile is for" */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-5"
              >
                {/* Grand Top Badge Icon & Headline */}
                <div className="text-center space-y-1">
                  <div className="inline-flex w-11 h-11 rounded-xl bg-gradient-to-br from-[#F5E6D3] to-[#E8DDD0] items-center justify-center shadow-xs ring-2 ring-[#560406]/10 mb-1">
                    <User className="w-5 h-5 text-[#560406]" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-normal text-[#560406] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    This Profile is for
                  </h2>
                  <p className="text-xs text-[#6E6259]">
                    Select who this matrimonial profile is being created for
                  </p>
                </div>

                {/* Profile For Symmetrical Grid */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                  {PROFILE_FOR_OPTIONS.map((opt) => {
                    const isSelected = profileFor === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelectProfileFor(opt)}
                        className={`flex items-center gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'border-[#560406] bg-[#560406] text-[#F5E6D3] shadow-xs ring-1 ring-[#DFBE7E]/40'
                            : 'border-[#E8DDD0] bg-white text-[#241E19] hover:border-[#560406] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'border-[#DFBE7E] bg-[#DFBE7E]'
                              : 'border-[#C8B8A6] bg-white'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 bg-[#560406] rounded-full" />}
                        </span>
                        <span className="truncate">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Warning & Genuine Match-seekers Note */}
                <div className="bg-[#FAF5EF] border border-[#DFBE7E]/60 rounded-xl p-3 sm:p-3.5 flex items-start gap-2.5 text-left shadow-2xs">
                  <div className="w-5 h-5 rounded-full bg-[#DFBE7E]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Info className="w-3.5 h-3.5 text-[#560406]" />
                  </div>
                  <p className="text-[11px] text-[#422C1D] leading-relaxed font-normal">
                    Mannat is strictly designed for genuine matrimonial alliances. Commercial usage, agencies, or fake registrations are strictly prohibited.
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 2: "Candidate Full Name" */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-5"
              >
                {/* Grand Top Badge Icon & Headline */}
                <div className="text-center space-y-1">
                  <div className="inline-flex w-11 h-11 rounded-xl bg-gradient-to-br from-[#F5E6D3] to-[#E8DDD0] items-center justify-center shadow-xs ring-2 ring-[#560406]/10 mb-1">
                    <div className="relative">
                      <User className="w-5 h-5 text-[#560406]" />
                      <Sparkles className="w-3 h-3 text-[#A17B5E] absolute -top-1 -right-1" />
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-normal text-[#560406] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    Candidate Full Name
                  </h2>
                  <p className="text-xs text-[#6E6259]">
                    Please enter the legal candidate name as per official ID
                  </p>
                </div>

                {/* Name Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-1">
                  {/* First Name */}
                  <div className="relative rounded-xl border border-[#E8DDD0] px-3.5 pt-2.5 pb-2 focus-within:border-[#560406] focus-within:ring-1 focus-within:ring-[#560406]/20 bg-white transition-all">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-0.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      autoFocus
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Rahul"
                      className="w-full text-sm sm:text-base font-semibold text-[#161412] placeholder:text-gray-300 focus:outline-none bg-transparent"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="relative rounded-xl border border-[#E8DDD0] px-3.5 pt-2.5 pb-2 focus-within:border-[#560406] focus-within:ring-1 focus-within:ring-[#560406]/20 bg-white transition-all">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-0.5">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Sharma"
                      className="w-full text-sm sm:text-base font-semibold text-[#161412] placeholder:text-gray-300 focus:outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Continue Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleStep2Continue}
                    className="w-full py-2.5 sm:py-3 px-5 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-[#730C0F] via-[#560406] to-[#3A0204] hover:brightness-110 text-[#F5E6D3] border border-[#DFBE7E]/40 shadow-md transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Continue to Date of Birth</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#DFBE7E]" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: "Date of Birth" */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-5"
              >
                {/* Grand Top Badge Icon & Headline */}
                <div className="text-center space-y-1">
                  <div className="inline-flex w-11 h-11 rounded-xl bg-gradient-to-br from-[#F5E6D3] to-[#E8DDD0] items-center justify-center shadow-xs ring-2 ring-[#560406]/10 mb-1">
                    <Calendar className="w-5 h-5 text-[#560406]" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-normal text-[#560406] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    Date of Birth
                  </h2>
                  <p className="text-xs text-[#6E6259]">
                    Required for astrological horoscope &amp; verified age matchmaking
                  </p>
                </div>

                {/* 3 Boxed Inputs - DD MM YYYY */}
                <div className="grid grid-cols-3 gap-3 pt-1">
                  {/* Day */}
                  <div className="rounded-xl border border-[#E8DDD0] p-2.5 sm:p-3 focus-within:border-[#560406] focus-within:ring-1 focus-within:ring-[#560406]/20 bg-white transition-all text-center">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-0.5">
                      Day (DD)
                    </label>
                    <input
                      ref={dayRef}
                      type="tel"
                      inputMode="numeric"
                      maxLength={2}
                      autoFocus
                      value={dobDay}
                      onChange={(e) => handleDayChange(e.target.value)}
                      placeholder="DD"
                      className="w-full text-xl sm:text-2xl font-bold text-[#560406] placeholder:text-gray-300 focus:outline-none bg-transparent text-center tracking-wider"
                    />
                  </div>

                  {/* Month */}
                  <div className="rounded-xl border border-[#E8DDD0] p-2.5 sm:p-3 focus-within:border-[#560406] focus-within:ring-1 focus-within:ring-[#560406]/20 bg-white transition-all text-center">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-0.5">
                      Month (MM)
                    </label>
                    <input
                      ref={monthRef}
                      type="tel"
                      inputMode="numeric"
                      maxLength={2}
                      value={dobMonth}
                      onChange={(e) => handleMonthChange(e.target.value)}
                      placeholder="MM"
                      className="w-full text-xl sm:text-2xl font-bold text-[#560406] placeholder:text-gray-300 focus:outline-none bg-transparent text-center tracking-wider"
                    />
                  </div>

                  {/* Year */}
                  <div className="rounded-xl border border-[#E8DDD0] p-2.5 sm:p-3 focus-within:border-[#560406] focus-within:ring-1 focus-within:ring-[#560406]/20 bg-white transition-all text-center">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-0.5">
                      Year (YYYY)
                    </label>
                    <input
                      ref={yearRef}
                      type="tel"
                      inputMode="numeric"
                      maxLength={4}
                      value={dobYear}
                      onChange={(e) => handleYearChange(e.target.value)}
                      placeholder="YYYY"
                      className="w-full text-xl sm:text-2xl font-bold text-[#560406] placeholder:text-gray-300 focus:outline-none bg-transparent text-center tracking-wider"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#FAF5EF] rounded-xl border border-[#E8DDD0] text-center text-[11px] text-[#6E6259]">
                  Candidates must be at least 18 years of age to register on Mannat.
                </div>

                {/* Continue Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleStep3Continue}
                    className="w-full py-2.5 sm:py-3 px-5 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-[#730C0F] via-[#560406] to-[#3A0204] hover:brightness-110 text-[#F5E6D3] border border-[#DFBE7E]/40 shadow-md transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Continue to Religion &amp; Community</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#DFBE7E]" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: "Religion & Background" */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                {/* Grand Top Badge Icon & Headline */}
                <div className="text-center space-y-1">
                  <div className="inline-flex w-11 h-11 rounded-xl bg-gradient-to-br from-[#F5E6D3] to-[#E8DDD0] items-center justify-center shadow-xs ring-2 ring-[#560406]/10 mb-1">
                    <Users className="w-5 h-5 text-[#560406]" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-normal text-[#560406] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    Religion &amp; Background
                  </h2>
                  <p className="text-xs text-[#6E6259]">
                    Helps match with compatible families and cultural traditions
                  </p>
                </div>

                <div className="space-y-3 text-left pt-1">
                  {/* Religion Select */}
                  <div className="relative rounded-xl border border-[#E8DDD0] px-3.5 pt-2.5 pb-2 focus-within:border-[#560406] bg-white transition-all">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-0.5">
                      Religion *
                    </label>
                    <select
                      value={religion}
                      onChange={(e) => handleReligionChange(e.target.value)}
                      className="w-full text-xs sm:text-sm font-semibold text-[#161412] bg-transparent focus:outline-none appearance-none pr-7 cursor-pointer"
                    >
                      {RELIGION_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#A17B5E] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Community Select */}
                  <div>
                    <div className="flex items-center justify-between mb-1 px-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#560406]">Community / Sub-caste</span>
                      <button
                        type="button"
                        onClick={() => setShowCommunityTooltip(!showCommunityTooltip)}
                        className="text-[#A17B5E] hover:text-[#560406] inline-flex items-center gap-1 text-[10px] font-bold cursor-pointer"
                        aria-label="Community Help"
                      >
                        <HelpCircle className="w-3 h-3" />
                        <span>Why this?</span>
                      </button>
                    </div>

                    {showCommunityTooltip && (
                      <p className="text-xs text-[#6E6259] bg-[#FAF5EF] p-2.5 rounded-xl border border-[#E8DDD0] mb-2">
                        Select cultural sub-community, mother tongue or gotra to match with compatible families.
                      </p>
                    )}

                    <div className="relative rounded-xl border border-[#E8DDD0] px-3.5 pt-2.5 pb-2 focus-within:border-[#560406] bg-white transition-all">
                      <select
                        value={community}
                        onChange={(e) => setCommunity(e.target.value)}
                        className="w-full text-xs sm:text-sm font-semibold text-[#161412] bg-transparent focus:outline-none appearance-none pr-7 cursor-pointer"
                      >
                        {(COMMUNITY_BY_RELIGION[religion] || DEFAULT_COMMUNITIES).map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#A17B5E] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Country Select */}
                  <div className="relative rounded-xl border border-[#E8DDD0] px-3.5 pt-2.5 pb-2 focus-within:border-[#560406] bg-white transition-all">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-0.5">
                      Living In (Country) *
                    </label>
                    <select
                      value={country}
                      onChange={(e) => {
                        const selectedCountry = e.target.value;
                        setCountry(selectedCountry);
                        const matched = COUNTRY_OPTIONS.find((c) => c.name === selectedCountry);
                        if (matched) setCountryCode(matched.code);
                      }}
                      className="w-full text-xs sm:text-sm font-semibold text-[#161412] bg-transparent focus:outline-none appearance-none pr-7 cursor-pointer"
                    >
                      {COUNTRY_OPTIONS.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#A17B5E] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Continue Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleStep4Continue}
                    className="w-full py-2.5 sm:py-3 px-5 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-[#730C0F] via-[#560406] to-[#3A0204] hover:brightness-110 text-[#F5E6D3] border border-[#DFBE7E]/40 shadow-md transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Continue to Contact Details</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#DFBE7E]" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: "Secure Your Profile" */}
            {step === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                {/* Grand Top Badge Icon & Headline */}
                <div className="text-center space-y-1">
                  <div className="inline-flex w-11 h-11 rounded-xl bg-gradient-to-br from-[#F5E6D3] to-[#E8DDD0] items-center justify-center shadow-xs ring-2 ring-[#560406]/10 mb-1">
                    <ShieldCheck className="w-5 h-5 text-[#560406]" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-normal text-[#560406] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    Secure Your Profile
                  </h2>
                  <p className="text-xs text-[#6E6259]">
                    An active email &amp; mobile number protect your bio-data and verified matches
                  </p>
                </div>

                <form onSubmit={handleFinalSubmit} className="space-y-3 text-left pt-1">
                  {/* Email ID Field */}
                  <div className="relative rounded-xl border border-[#E8DDD0] px-3.5 pt-2.5 pb-2 focus-within:border-[#560406] focus-within:ring-1 focus-within:ring-[#560406]/20 bg-white transition-all">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-0.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full text-xs sm:text-sm font-semibold text-[#161412] placeholder:text-gray-300 focus:outline-none bg-transparent"
                    />
                  </div>

                  {/* Mobile No. Field with Country Code */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-0.5 px-1">
                      Mobile Number *
                    </label>
                    <div className="flex gap-2">
                      {/* Country Code */}
                      <div className="relative w-32 shrink-0 rounded-xl border border-[#E8DDD0] px-3 pt-2.5 pb-2 focus-within:border-[#560406] bg-white">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="w-full text-xs sm:text-sm font-semibold text-[#161412] bg-transparent focus:outline-none appearance-none pr-5 cursor-pointer"
                        >
                          {COUNTRY_OPTIONS.map((c, i) => (
                            <option key={`${c.code}-${i}`} value={c.code}>
                              {c.code} ({c.name.slice(0, 3)})
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-[#A17B5E] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      {/* Mobile Number */}
                      <div className="relative flex-1 rounded-xl border border-[#E8DDD0] px-3.5 pt-2.5 pb-2 focus-within:border-[#560406] focus-within:ring-1 focus-within:ring-[#560406]/20 bg-white transition-all">
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="10-digit number"
                          className="w-full text-xs sm:text-sm font-semibold text-[#161412] placeholder:text-gray-300 focus:outline-none bg-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-2.5 sm:py-3 px-5 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-[#730C0F] via-[#560406] to-[#3A0204] hover:brightness-110 text-[#F5E6D3] border border-[#DFBE7E]/40 shadow-lg transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#DFBE7E]" />
                      <span>{submitting ? 'Creating Profile...' : 'Complete Registration & Browse'}</span>
                    </button>
                  </div>

                  {/* Legal Footer Links */}
                  <p className="text-[11px] text-[#8C827A] text-center pt-1 font-normal">
                    By registering, you agree to our{' '}
                    <button
                      type="button"
                      onClick={() => onOpenLegal && onOpenLegal('privacy')}
                      className="text-[#560406] hover:underline font-bold"
                    >
                      Privacy Policy
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      onClick={() => onOpenLegal && onOpenLegal('terms')}
                      className="text-[#560406] hover:underline font-bold"
                    >
                      Terms &amp; Conditions
                    </button>
                    .
                  </p>
                </form>
              </motion.div>
            )}

          </div>
        )}

        {/* ================= LOGIN MODE ================= */}
        {mode === 'login' && (
          <div className="px-6 sm:px-10 pb-7 pt-3 space-y-4">
            <div className="text-center space-y-1">
              <div className="inline-flex w-11 h-11 rounded-xl bg-gradient-to-br from-[#F5E6D3] to-[#E8DDD0] items-center justify-center shadow-xs ring-2 ring-[#560406]/10 mb-1">
                <Lock className="w-5 h-5 text-[#560406]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-normal text-[#560406] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                Member Sign In
              </h2>
              <p className="text-xs text-[#6E6259]">
                Sign in to manage your bio-data and explore verified matches
              </p>
            </div>

            <form onSubmit={handleDirectLogin} className="space-y-3 text-left pt-1">
              <div className="relative rounded-xl border border-[#E8DDD0] px-3.5 pt-2.5 pb-2 focus-within:border-[#560406] focus-within:ring-1 focus-within:ring-[#560406]/20 bg-white transition-all">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#560406] mb-0.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs sm:text-sm font-semibold text-[#161412] placeholder:text-gray-300 focus:outline-none bg-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 sm:py-3 px-5 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-[#730C0F] via-[#560406] to-[#3A0204] hover:brightness-110 text-[#F5E6D3] border border-[#DFBE7E]/40 shadow-md transition-all active:scale-[0.99] cursor-pointer"
              >
                {submitting ? 'Signing In...' : 'Sign In with Email →'}
              </button>
            </form>

            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-[#E8DDD0] w-full" />
              <span className="bg-[#FDFAF7] px-3 text-[10px] font-bold uppercase tracking-wider text-[#A17B5E]">
                OR CONTINUE WITH
              </span>
            </div>

            {/* Social 1-Click Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={submitting}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#E8DDD0] bg-white hover:bg-[#FAF7F2] text-xs font-semibold text-[#161412] transition shadow-xs cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.7 7.4l3.7 2.9C6.3 7.5 8.9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.4 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.7 6.4C.6 8.6 0 10.2 0 12s.6 3.4 1.7 5.6l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.7-2.1-6.6-4.9L1.7 16.3C3.5 20.1 7.4 23 12 23z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={handleAppleAuth}
                disabled={submitting}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#1C0102] hover:bg-[#260102] text-xs font-semibold text-white border border-[#DFBE7E]/30 transition shadow-xs cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.42-6.53-9.92-11.45-21.05-14.75-33.39-3.3-12.33-4.95-23.77-4.95-34.3 0-14.54 3.69-26.68 11.08-36.42 7.39-9.74 16.53-14.75 27.42-15.03 4.8 0 10.3 1.24 16.5 3.73 6.2 2.49 10.02 3.79 11.46 3.91 2.03-.35 6.13-1.78 12.3-4.29 6.17-2.51 11.39-3.63 15.66-3.35 11.46.73 20.48 4.96 27.06 12.7-9.54 5.76-14.19 13.9-13.95 24.42.24 8.24 3.35 15.15 9.33 20.73 5.98 5.58 13.11 8.84 21.39 9.78-2.24 6.77-4.95 13.43-8.14 19.98zm-29.4-106.84c.14-2.87-.5-5.76-1.92-8.67-1.42-2.91-3.3-5.32-5.64-7.23-2.73-2.24-5.98-3.79-9.75-4.65-.24.7-.36 1.4-.36 2.1 0 2.87.69 5.86 2.07 8.97 1.38 3.11 3.32 5.64 5.82 7.59 2.5 1.95 5.5 3.35 9 4.2.25-.77.5-1.54.78-2.31z" />
                </svg>
                <span>Apple</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
