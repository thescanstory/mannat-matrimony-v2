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

      // Save consultation lead
      await vipConsultationService.submitLead({
        profile_for: profileFor,
        full_name: fullName,
        phone_country_code: countryCode,
        phone_number: cleanPhone,
        email: cleanEmail,
        city: country,
        community: `${religion} - ${community}`,
        source_cta: 'Web 5-Step Registration Modal',
        notes: `DOB: ${birthDate}, Country: ${country}`,
      });

      // Save local user profile draft
      const userProfileDraft = {
        name: fullName,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: cleanEmail,
        phone: `${countryCode} ${cleanPhone}`,
        profile_for: profileFor,
        dob: birthDate,
        religion,
        community,
        country,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem('mannat_user_profile', JSON.stringify(userProfileDraft));

      // Authenticate session
      const session = authService.setUserSession(cleanEmail, fullName);

      setTimeout(() => {
        setSubmitting(false);
        onSuccess(session);
        onClose();
      }, 300);
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrorMessage('Something went wrong creating your account. Please try again.');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="relative w-full max-w-[540px] bg-[#FCFAF7] rounded-[32px] shadow-2xl overflow-hidden border border-[#E8DDD0] my-auto"
      >
        {/* Step Progress Indicator (when registering) */}
        {mode === 'register' && (
          <div className="w-full bg-[#F4EAE0] h-1.5 flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`flex-1 h-full transition-all duration-300 ${
                  s <= step ? 'bg-[#560406]' : 'bg-transparent'
                }`}
              />
            ))}
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 pt-6 pb-2">
          {mode === 'register' ? (
            <button
              type="button"
              onClick={handleBack}
              className="p-2 -ml-2 text-[#560406] hover:bg-[#560406]/10 rounded-full transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-5" />
          )}

          {/* Mode Switch Pills */}
          <div className="flex bg-[#EFE7DE] p-1 rounded-full text-xs font-bold border border-[#E8DDD0]">
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-[#560406] text-[#F5E6D3] shadow-xs'
                  : 'text-[#6E6259] hover:text-[#560406]'
              }`}
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
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
            className="p-2 -mr-2 text-[#8C827A] hover:text-[#560406] hover:bg-[#560406]/10 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 sm:mx-8 mt-3 px-4 py-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ================= REGISTER MODE (5 BIG STEPS) ================= */}
        {mode === 'register' && (
          <div className="px-6 sm:px-8 pb-8 pt-3">
            
            {/* STEP 1: "This Profile is for" */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-6"
              >
                {/* Grand Top Badge Icon */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F5E6D3] to-[#E8DDD0] flex items-center justify-center shadow-md ring-4 ring-[#560406]/10">
                    <User className="w-10 h-10 text-[#560406]" />
                  </div>
                </div>

                <div className="text-left space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#A17B5E]">
                    Step 1 of 5
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    This Profile is for
                  </h2>
                </div>

                {/* Profile For Pill Radios */}
                <div className="flex flex-wrap gap-3">
                  {PROFILE_FOR_OPTIONS.map((opt) => {
                    const isSelected = profileFor === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelectProfileFor(opt)}
                        className={`flex items-center gap-3 px-5 py-3 rounded-full border text-sm sm:text-base font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#560406] bg-[#560406] text-[#F5E6D3] shadow-md ring-2 ring-[#560406]/30'
                            : 'border-[#E8DDD0] bg-white text-[#161412] hover:border-[#560406] hover:bg-[#F8F6F2]'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-[#DFBE7E] bg-[#DFBE7E]'
                              : 'border-[#C8B8A6] bg-white'
                          }`}
                        >
                          {isSelected && <span className="w-2 h-2 bg-[#560406] rounded-full" />}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Warning & Genuine Match-seekers Note */}
                <div className="bg-[#FAF5EF] border border-[#DFBE7E]/60 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-left shadow-2xs">
                  <div className="w-6 h-6 rounded-full bg-[#DFBE7E]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Info className="w-4 h-4 text-[#560406]" />
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#422C1D] leading-relaxed font-medium">
                    Mannat is built for genuine match-seekers. Any falsification, commercial use or marriage bureaus is strictly prohibited &amp; may be reported to law enforcement.
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 2: "Your name" */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-6"
              >
                {/* Grand Top Badge Icon */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F5E6D3] to-[#E8DDD0] flex items-center justify-center shadow-md ring-4 ring-[#560406]/10">
                    <div className="relative">
                      <User className="w-10 h-10 text-[#560406]" />
                      <Sparkles className="w-4 h-4 text-[#A17B5E] absolute -top-1 -right-1" />
                    </div>
                  </div>
                </div>

                <div className="text-left space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#A17B5E]">
                    Step 2 of 5
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    Candidate Full Name
                  </h2>
                  <p className="text-xs text-[#6E6259]">
                    Please enter the legal name as per government ID
                  </p>
                </div>

                {/* Name Inputs */}
                <div className="space-y-4 text-left">
                  {/* First Name */}
                  <div className="relative rounded-2xl border-2 border-[#E8DDD0] px-4 pt-4 pb-2.5 focus-within:border-[#560406] focus-within:ring-2 focus-within:ring-[#560406]/20 bg-white transition-all">
                    <label className="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-[#560406] uppercase tracking-wider">
                      First name *
                    </label>
                    <input
                      type="text"
                      autoFocus
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Rahul"
                      className="w-full text-lg font-bold text-[#161412] placeholder:text-gray-300 focus:outline-hidden bg-transparent"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="relative rounded-2xl border-2 border-[#E8DDD0] px-4 pt-4 pb-2.5 focus-within:border-[#560406] focus-within:ring-2 focus-within:ring-[#560406]/20 bg-white transition-all">
                    <label className="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-[#560406] uppercase tracking-wider">
                      Last name *
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Sharma"
                      className="w-full text-lg font-bold text-[#161412] placeholder:text-gray-300 focus:outline-hidden bg-transparent"
                    />
                  </div>
                </div>

                {/* Continue Button */}
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleStep2Continue}
                    className="w-full py-4 rounded-full font-bold text-sm sm:text-base uppercase tracking-wider bg-gradient-to-r from-[#730C0F] via-[#560406] to-[#3A0204] hover:brightness-110 text-[#F5E6D3] border border-[#A17B5E]/50 shadow-lg transition-all active:scale-[0.99] cursor-pointer"
                  >
                    Continue to Date of Birth →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: "Date of birth" */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-6"
              >
                {/* Grand Top Badge Icon */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F5E6D3] to-[#E8DDD0] flex items-center justify-center shadow-md ring-4 ring-[#560406]/10">
                    <Calendar className="w-10 h-10 text-[#560406]" />
                  </div>
                </div>

                <div className="text-left space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#A17B5E]">
                    Step 3 of 5
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    Date of Birth
                  </h2>
                  <p className="text-xs text-[#6E6259]">
                    Used to calculate astrological compatibility &amp; verified age
                  </p>
                </div>

                {/* 3 Boxed Inputs */}
                <div className="grid grid-cols-3 gap-3.5">
                  {/* Day */}
                  <div className="relative rounded-2xl border-2 border-[#E8DDD0] px-3.5 pt-4 pb-3 focus-within:border-[#560406] focus-within:ring-2 focus-within:ring-[#560406]/20 bg-white transition-all">
                    <label className="absolute -top-3 left-3 bg-white px-1.5 text-xs font-bold text-[#560406] uppercase tracking-wider">
                      Day
                    </label>
                    <input
                      ref={dayRef}
                      type="tel"
                      inputMode="numeric"
                      maxLength={2}
                      value={dobDay}
                      onChange={(e) => handleDayChange(e.target.value)}
                      placeholder="DD"
                      className="w-full text-xl font-bold text-[#161412] placeholder:text-gray-300 focus:outline-hidden bg-transparent text-center"
                    />
                  </div>

                  {/* Month */}
                  <div className="relative rounded-2xl border-2 border-[#E8DDD0] px-3.5 pt-4 pb-3 focus-within:border-[#560406] focus-within:ring-2 focus-within:ring-[#560406]/20 bg-white transition-all">
                    <label className="absolute -top-3 left-3 bg-white px-1.5 text-xs font-bold text-[#560406] uppercase tracking-wider">
                      Month
                    </label>
                    <input
                      ref={monthRef}
                      type="tel"
                      inputMode="numeric"
                      maxLength={2}
                      value={dobMonth}
                      onChange={(e) => handleMonthChange(e.target.value)}
                      placeholder="MM"
                      className="w-full text-xl font-bold text-[#161412] placeholder:text-gray-300 focus:outline-hidden bg-transparent text-center"
                    />
                  </div>

                  {/* Year */}
                  <div className="relative rounded-2xl border-2 border-[#E8DDD0] px-3.5 pt-4 pb-3 focus-within:border-[#560406] focus-within:ring-2 focus-within:ring-[#560406]/20 bg-white transition-all">
                    <label className="absolute -top-3 left-3 bg-white px-1.5 text-xs font-bold text-[#560406] uppercase tracking-wider">
                      Year
                    </label>
                    <input
                      ref={yearRef}
                      type="tel"
                      inputMode="numeric"
                      maxLength={4}
                      value={dobYear}
                      onChange={(e) => handleYearChange(e.target.value)}
                      placeholder="YYYY"
                      className="w-full text-xl font-bold text-[#161412] placeholder:text-gray-300 focus:outline-hidden bg-transparent text-center"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#FAF5EF] rounded-xl text-center text-xs text-[#6E6259]">
                  Candidate must be at least 18 years old to join Mannat.
                </div>

                {/* Continue Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleStep3Continue}
                    className="w-full py-4 rounded-full font-bold text-sm sm:text-base uppercase tracking-wider bg-gradient-to-r from-[#730C0F] via-[#560406] to-[#3A0204] hover:brightness-110 text-[#F5E6D3] border border-[#A17B5E]/50 shadow-lg transition-all active:scale-[0.99] cursor-pointer"
                  >
                    Continue to Religion &amp; Community →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: "Your religion", "Community", "Living in" */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-5"
              >
                {/* Grand Top Badge Icon */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F5E6D3] to-[#E8DDD0] flex items-center justify-center shadow-md ring-4 ring-[#560406]/10">
                    <Users className="w-10 h-10 text-[#560406]" />
                  </div>
                </div>

                <div className="text-left space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#A17B5E]">
                    Step 4 of 5
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    Religion &amp; Background
                  </h2>
                </div>

                <div className="space-y-4 text-left">
                  {/* Religion Select */}
                  <div className="relative rounded-2xl border-2 border-[#E8DDD0] px-4 pt-3.5 pb-2.5 focus-within:border-[#560406] bg-white transition-all">
                    <label className="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-[#560406] uppercase tracking-wider">
                      Religion *
                    </label>
                    <select
                      value={religion}
                      onChange={(e) => handleReligionChange(e.target.value)}
                      className="w-full text-base font-bold text-[#161412] bg-transparent focus:outline-hidden appearance-none pr-8 cursor-pointer"
                    >
                      {RELIGION_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-5 h-5 text-[#A17B5E] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Community Select */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#560406] uppercase tracking-wider">Community / Sub-caste</span>
                      <button
                        type="button"
                        onClick={() => setShowCommunityTooltip(!showCommunityTooltip)}
                        className="text-[#A17B5E] hover:text-[#560406] cursor-pointer"
                        aria-label="Community Help"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </div>

                    {showCommunityTooltip && (
                      <p className="text-[11px] text-[#6E6259] bg-[#FAF5EF] p-2.5 rounded-xl border border-[#E8DDD0] mb-2">
                        Select cultural sub-community, mother tongue or gotra to match with compatible families.
                      </p>
                    )}

                    <div className="relative rounded-2xl border-2 border-[#E8DDD0] px-4 pt-3.5 pb-2.5 focus-within:border-[#560406] bg-white transition-all">
                      <select
                        value={community}
                        onChange={(e) => setCommunity(e.target.value)}
                        className="w-full text-base font-bold text-[#161412] bg-transparent focus:outline-hidden appearance-none pr-8 cursor-pointer"
                      >
                        {(COMMUNITY_BY_RELIGION[religion] || DEFAULT_COMMUNITIES).map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-5 h-5 text-[#A17B5E] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Country Select */}
                  <div className="relative rounded-2xl border-2 border-[#E8DDD0] px-4 pt-3.5 pb-2.5 focus-within:border-[#560406] bg-white transition-all">
                    <label className="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-[#560406] uppercase tracking-wider">
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
                      className="w-full text-base font-bold text-[#161412] bg-transparent focus:outline-hidden appearance-none pr-8 cursor-pointer"
                    >
                      {COUNTRY_OPTIONS.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-5 h-5 text-[#A17B5E] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Continue Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleStep4Continue}
                    className="w-full py-4 rounded-full font-bold text-sm sm:text-base uppercase tracking-wider bg-gradient-to-r from-[#730C0F] via-[#560406] to-[#3A0204] hover:brightness-110 text-[#F5E6D3] border border-[#A17B5E]/50 shadow-lg transition-all active:scale-[0.99] cursor-pointer"
                  >
                    Continue to Contact Verification →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: "Email ID" & "Mobile no." */}
            {step === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className="space-y-5"
              >
                {/* Grand Top Badge Icon */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F5E6D3] to-[#E8DDD0] flex items-center justify-center shadow-md ring-4 ring-[#560406]/10">
                    <ShieldCheck className="w-10 h-10 text-[#560406]" />
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#A17B5E]">
                    Step 5 of 5
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    Secure Your Profile
                  </h2>
                  <p className="text-xs text-[#6E6259] px-2">
                    An active email ID &amp; mobile no. are required to protect your biodata and verified matches.
                  </p>
                </div>

                <form onSubmit={handleFinalSubmit} className="space-y-4 text-left">
                  {/* Email ID Field */}
                  <div className="relative rounded-2xl border-2 border-[#E8DDD0] px-4 pt-4 pb-2.5 focus-within:border-[#560406] focus-within:ring-2 focus-within:ring-[#560406]/20 bg-white transition-all">
                    <label className="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-[#560406] uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full text-base sm:text-lg font-bold text-[#161412] placeholder:text-gray-300 focus:outline-hidden bg-transparent"
                    />
                  </div>

                  {/* Mobile No. Field */}
                  <div className="flex gap-2.5">
                    {/* Country Code */}
                    <div className="relative w-32 shrink-0 rounded-2xl border-2 border-[#E8DDD0] px-3.5 pt-4 pb-2.5 focus-within:border-[#560406] bg-white">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-full text-base font-bold text-[#161412] bg-transparent focus:outline-hidden appearance-none pr-6 cursor-pointer"
                      >
                        {COUNTRY_OPTIONS.map((c, i) => (
                          <option key={`${c.code}-${i}`} value={c.code}>
                            {c.code} ({c.name.slice(0, 3)})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#A17B5E] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Mobile Number */}
                    <div className="relative flex-1 rounded-2xl border-2 border-[#E8DDD0] px-4 pt-4 pb-2.5 focus-within:border-[#560406] focus-within:ring-2 focus-within:ring-[#560406]/20 bg-white transition-all">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Mobile Number"
                        className="w-full text-base sm:text-lg font-bold text-[#161412] placeholder:text-gray-300 focus:outline-hidden bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 rounded-full font-bold text-sm sm:text-base uppercase tracking-wider bg-gradient-to-r from-[#730C0F] via-[#560406] to-[#3A0204] hover:brightness-110 text-[#F5E6D3] border border-[#A17B5E]/50 shadow-xl transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-[#DFBE7E]" />
                      <span>{submitting ? 'Creating Account...' : 'Complete Registration & Browse'}</span>
                    </button>
                  </div>

                  {/* Legal Footer Links */}
                  <p className="text-[11px] text-[#8C827A] text-center pt-1 font-medium">
                    By creating account, you agree to our{' '}
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
          <div className="px-6 sm:px-8 pb-8 pt-4 space-y-5">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F5E6D3] to-[#E8DDD0] flex items-center justify-center shadow-md ring-4 ring-[#560406]/10">
                <Lock className="w-10 h-10 text-[#560406]" />
              </div>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                Welcome Back
              </h2>
              <p className="text-xs text-[#6E6259]">Sign in to manage your biodata and explore verified matches</p>
            </div>

            <form onSubmit={handleDirectLogin} className="space-y-4 text-left">
              <div className="relative rounded-2xl border-2 border-[#E8DDD0] px-4 pt-4 pb-2.5 focus-within:border-[#560406] focus-within:ring-2 focus-within:ring-[#560406]/20 bg-white transition-all">
                <label className="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-[#560406] uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-base sm:text-lg font-bold text-[#161412] placeholder:text-gray-300 focus:outline-hidden bg-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-full font-bold text-sm sm:text-base uppercase tracking-wider bg-gradient-to-r from-[#730C0F] via-[#560406] to-[#3A0204] hover:brightness-110 text-[#F5E6D3] border border-[#A17B5E]/50 shadow-lg transition-all active:scale-[0.99] cursor-pointer"
              >
                {submitting ? 'Signing In...' : 'Sign In with Email →'}
              </button>
            </form>

            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-[#E8DDD0] w-full" />
              <span className="bg-[#FCFAF7] px-3 text-[10px] font-black uppercase tracking-wider text-[#A17B5E]">
                OR CONTINUE WITH
              </span>
            </div>

            {/* Social 1-Click Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={submitting}
                className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl border-2 border-[#E8DDD0] bg-white hover:bg-[#F8F6F2] text-xs font-bold text-[#161412] transition-colors shadow-2xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={handleAppleAuth}
                disabled={submitting}
                className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-[#1C0102] hover:bg-[#260102] text-xs font-bold text-white border border-[#A17B5E]/30 transition-colors shadow-2xs cursor-pointer"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 170 170">
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
