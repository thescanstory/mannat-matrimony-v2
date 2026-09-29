import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  X,
  User,
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

  // Step 1 Validation & Proceed
  const handleSelectProfileFor = (option: string) => {
    setProfileFor(option);
    setErrorMessage(null);
    setStep(2);
  };

  // Step 2 Validation & Proceed
  const handleStep2Continue = () => {
    setErrorMessage(null);
    if (!firstName.trim()) {
      setErrorMessage('Please enter your first name');
      return;
    }
    if (!lastName.trim()) {
      setErrorMessage('Please enter your last name');
      return;
    }
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

    setStep(3);
  };

  // Step 3 Validation & Proceed
  const handleStep3Continue = () => {
    setErrorMessage(null);
    if (!religion) {
      setErrorMessage('Please select your religion');
      return;
    }
    setStep(4);
  };

  // Step 4 Final Submission
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
        source_cta: 'Web Multi-Step Registration Modal',
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

  // Quick Direct Login Handler
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="relative w-full max-w-[460px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 my-auto"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          {mode === 'register' ? (
            <button
              type="button"
              onClick={handleBack}
              className="p-1.5 -ml-1.5 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-5" />
          )}

          {/* Mode Switch Pills */}
          <div className="flex bg-gray-100 p-1 rounded-full text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
              className={`px-3 py-1 rounded-full transition-all ${
                mode === 'register'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
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
              className={`px-3 py-1 rounded-full transition-all ${
                mode === 'login'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Log In
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 -mr-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="mx-6 mt-2 px-3.5 py-2 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* REGISTER MODE */}
        {mode === 'register' && (
          <div className="px-6 pb-6 pt-2">
            {/* STEP 1: "This Profile is for" */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                {/* Top Badge Icon */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100/90 to-orange-100/80 flex items-center justify-center shadow-inner">
                    <User className="w-8 h-8 text-amber-600 fill-amber-500/20" />
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 text-left">
                  This Profile is for
                </h2>

                {/* Profile For Pill Radios */}
                <div className="flex flex-wrap gap-2.5">
                  {PROFILE_FOR_OPTIONS.map((opt) => {
                    const isSelected = profileFor === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelectProfileFor(opt)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border text-sm font-medium transition-all ${
                          isSelected
                            ? 'border-cyan-500 bg-cyan-50/40 text-gray-900 font-semibold shadow-xs ring-1 ring-cyan-500/30'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-cyan-500 bg-cyan-500'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Warning & Genuine Match-seekers Note */}
                <div className="bg-[#FFF8F2] border border-[#FED7AA] rounded-2xl p-4 flex items-start gap-3 text-left">
                  <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Info className="w-3.5 h-3.5 text-orange-600" />
                  </div>
                  <p className="text-xs text-orange-950/80 leading-relaxed">
                    Mannat is built for genuine match-seekers. Any falsification, commercial use or marriage bureaus is strictly prohibited & may be reported to law enforcement.
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 2: "Your name" & "Date of birth" */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                {/* Top Badge Icon */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center shadow-inner">
                    <div className="relative">
                      <User className="w-8 h-8 text-purple-600" />
                      <Sparkles className="w-3.5 h-3.5 text-purple-400 absolute -top-1 -right-1" />
                    </div>
                  </div>
                </div>

                {/* Name Section */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-900 text-left">Your name</h3>
                  
                  {/* First Name Fieldset Input */}
                  <div className="relative rounded-lg border border-gray-300 px-3.5 pt-3.5 pb-2 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 bg-white transition-all">
                    <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-gray-500">
                      First name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Patrick"
                      className="w-full text-base font-normal text-gray-900 placeholder:text-gray-400 focus:outline-hidden bg-transparent"
                    />
                  </div>

                  {/* Last Name Fieldset Input */}
                  <div className="relative rounded-lg border border-gray-300 px-3.5 pt-3.5 pb-2 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 bg-white transition-all">
                    <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-gray-500">
                      Last name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Abraham"
                      className="w-full text-base font-normal text-gray-900 placeholder:text-gray-400 focus:outline-hidden bg-transparent"
                    />
                  </div>
                </div>

                {/* Date of Birth Section */}
                <div className="space-y-3 pt-1">
                  <h3 className="text-lg font-bold text-gray-900 text-left">Date of birth</h3>
                  
                  <div className="grid grid-cols-3 gap-2.5">
                    {/* Day Input */}
                    <div className="relative rounded-lg border border-gray-300 px-3 pt-3.5 pb-2 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 bg-white transition-all">
                      <label className="absolute -top-2.5 left-2.5 bg-white px-1 text-[11px] font-medium text-gray-500">
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
                        className="w-full text-base font-normal text-gray-900 placeholder:text-gray-400 focus:outline-hidden bg-transparent text-center"
                      />
                    </div>

                    {/* Month Input */}
                    <div className="relative rounded-lg border border-gray-300 px-3 pt-3.5 pb-2 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 bg-white transition-all">
                      <label className="absolute -top-2.5 left-2.5 bg-white px-1 text-[11px] font-medium text-cyan-600">
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
                        className="w-full text-base font-normal text-gray-900 placeholder:text-gray-400 focus:outline-hidden bg-transparent text-center"
                      />
                    </div>

                    {/* Year Input */}
                    <div className="relative rounded-lg border border-gray-300 px-3 pt-3.5 pb-2 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 bg-white transition-all">
                      <label className="absolute -top-2.5 left-2.5 bg-white px-1 text-[11px] font-medium text-gray-500">
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
                        className="w-full text-base font-normal text-gray-900 placeholder:text-gray-400 focus:outline-hidden bg-transparent text-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleStep2Continue}
                    className="w-full py-3.5 rounded-full font-semibold text-sm bg-[#00B4C6] hover:bg-[#009dae] text-white shadow-md transition-all active:scale-[0.99] cursor-pointer"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: "Your religion", "Community", "Living in" */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {/* Top Badge Icon */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center shadow-inner">
                    <Users className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>

                {/* Religion Section */}
                <div className="space-y-1.5 text-left">
                  <h3 className="text-base font-bold text-gray-900">Your religion</h3>
                  <div className="relative rounded-lg border border-gray-300 px-3.5 pt-3 pb-2 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 bg-white transition-all">
                    <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-gray-500">
                      Religion
                    </label>
                    <select
                      value={religion}
                      onChange={(e) => handleReligionChange(e.target.value)}
                      className="w-full text-base font-medium text-gray-900 bg-transparent focus:outline-hidden appearance-none pr-8 cursor-pointer"
                    >
                      {RELIGION_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Community Section */}
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900">Community</h3>
                    <button
                      type="button"
                      onClick={() => setShowCommunityTooltip(!showCommunityTooltip)}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                      aria-label="Community Help"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>

                  {showCommunityTooltip && (
                    <p className="text-[11px] text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100">
                      Select your cultural sub-community, mother tongue or background to help match you with suitable families.
                    </p>
                  )}

                  <div className="relative rounded-lg border border-gray-300 px-3.5 pt-3 pb-2 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 bg-white transition-all">
                    <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-gray-500">
                      Community
                    </label>
                    <select
                      value={community}
                      onChange={(e) => setCommunity(e.target.value)}
                      className="w-full text-base font-medium text-gray-900 bg-transparent focus:outline-hidden appearance-none pr-8 cursor-pointer"
                    >
                      {(COMMUNITY_BY_RELIGION[religion] || DEFAULT_COMMUNITIES).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Living In Section */}
                <div className="space-y-1.5 text-left">
                  <h3 className="text-base font-bold text-gray-900">Living in</h3>
                  <div className="relative rounded-lg border border-gray-300 px-3.5 pt-3 pb-2 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 bg-white transition-all">
                    <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-gray-500">
                      Country
                    </label>
                    <select
                      value={country}
                      onChange={(e) => {
                        const selectedCountry = e.target.value;
                        setCountry(selectedCountry);
                        const matched = COUNTRY_OPTIONS.find((c) => c.name === selectedCountry);
                        if (matched) setCountryCode(matched.code);
                      }}
                      className="w-full text-base font-medium text-gray-900 bg-transparent focus:outline-hidden appearance-none pr-8 cursor-pointer"
                    >
                      {COUNTRY_OPTIONS.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Continue Button */}
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleStep3Continue}
                    className="w-full py-3.5 rounded-full font-semibold text-sm bg-[#00B4C6] hover:bg-[#009dae] text-white shadow-md transition-all active:scale-[0.99] cursor-pointer"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: "Email ID" & "Mobile no." */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                {/* Top Badge Icon */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center shadow-inner">
                    <ShieldCheck className="w-8 h-8 text-amber-500" />
                  </div>
                </div>

                <p className="text-sm font-medium text-gray-600 text-center px-4 leading-normal">
                  An active email ID & phone no. are required to secure your Profile
                </p>

                <form onSubmit={handleFinalSubmit} className="space-y-4">
                  {/* Email ID Field */}
                  <div className="text-left">
                    <h4 className="text-base font-bold text-gray-900 mb-1.5">Email ID</h4>
                    <div className="relative rounded-lg border border-gray-300 px-3.5 pt-3.5 pb-2 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 bg-white transition-all">
                      <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-gray-500">
                        Email ID
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full text-base font-normal text-gray-900 placeholder:text-gray-400 focus:outline-hidden bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Mobile No. Field */}
                  <div className="text-left">
                    <h4 className="text-base font-bold text-gray-900 mb-1.5">Mobile no.</h4>
                    <div className="flex gap-2">
                      {/* Country Code Selector */}
                      <div className="relative w-28 shrink-0 rounded-lg border border-gray-300 px-3 pt-3.5 pb-2 focus-within:border-cyan-500 bg-white">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="w-full text-base font-medium text-gray-900 bg-transparent focus:outline-hidden appearance-none pr-6 cursor-pointer"
                        >
                          {COUNTRY_OPTIONS.map((c, i) => (
                            <option key={`${c.code}-${i}`} value={c.code}>
                              {c.code} ({c.name.slice(0, 3)})
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      {/* Mobile Number Input */}
                      <div className="relative flex-1 rounded-lg border border-gray-300 px-3.5 pt-3.5 pb-2 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 bg-white transition-all">
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Mobile no."
                          className="w-full text-base font-normal text-gray-900 placeholder:text-gray-400 focus:outline-hidden bg-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-full font-semibold text-sm bg-[#00B4C6] hover:bg-[#009dae] text-white shadow-md transition-all active:scale-[0.99] cursor-pointer"
                    >
                      {submitting ? 'Creating Profile...' : 'Submit'}
                    </button>
                  </div>

                  {/* Legal Footer Links */}
                  <p className="text-[11px] text-gray-500 text-center pt-1">
                    By creating account, you agree to our{' '}
                    <button
                      type="button"
                      onClick={() => onOpenLegal && onOpenLegal('privacy')}
                      className="text-cyan-600 hover:underline font-medium"
                    >
                      Privacy Policy
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      onClick={() => onOpenLegal && onOpenLegal('terms')}
                      className="text-cyan-600 hover:underline font-medium"
                    >
                      T&C
                    </button>
                    .
                  </p>
                </form>
              </motion.div>
            )}
          </div>
        )}

        {/* LOGIN MODE */}
        {mode === 'login' && (
          <div className="px-6 pb-6 pt-3 space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-[#560406]/10 flex items-center justify-center shadow-inner">
                <Lock className="w-8 h-8 text-[#560406]" />
              </div>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-xs text-gray-500">Sign in to manage your biodata and verified matches</p>
            </div>

            <form onSubmit={handleDirectLogin} className="space-y-3.5 text-left">
              <div className="relative rounded-lg border border-gray-300 px-3.5 pt-3.5 pb-2 focus-within:border-[#560406] focus-within:ring-1 focus-within:ring-[#560406] bg-white transition-all">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-gray-500">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-base font-normal text-gray-900 placeholder:text-gray-400 focus:outline-hidden bg-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-full font-semibold text-sm bg-[#560406] hover:bg-[#430305] text-white shadow-md transition-all active:scale-[0.99]"
              >
                {submitting ? 'Signing In...' : 'Sign In with Email'}
              </button>
            </form>

            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-gray-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                Or Continue With
              </span>
            </div>

            {/* Social 1-Click Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={submitting}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors shadow-xs"
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
                Google
              </button>

              <button
                type="button"
                onClick={handleAppleAuth}
                disabled={submitting}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors shadow-xs"
              >
                <svg className="w-4 h-4 fill-black" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.42-6.53-9.92-11.45-21.05-14.75-33.39-3.3-12.33-4.95-23.77-4.95-34.3 0-14.54 3.69-26.68 11.08-36.42 7.39-9.74 16.53-14.75 27.42-15.03 4.8 0 10.3 1.24 16.5 3.73 6.2 2.49 10.02 3.79 11.46 3.91 2.03-.35 6.13-1.78 12.3-4.29 6.17-2.51 11.39-3.63 15.66-3.35 11.46.73 20.48 4.96 27.06 12.7-9.54 5.76-14.19 13.9-13.95 24.42.24 8.24 3.35 15.15 9.33 20.73 5.98 5.58 13.11 8.84 21.39 9.78-2.24 6.77-4.95 13.43-8.14 19.98zm-29.4-106.84c.14-2.87-.5-5.76-1.92-8.67-1.42-2.91-3.3-5.32-5.64-7.23-2.73-2.24-5.98-3.79-9.75-4.65-.24.7-.36 1.4-.36 2.1 0 2.87.69 5.86 2.07 8.97 1.38 3.11 3.32 5.64 5.82 7.59 2.5 1.95 5.5 3.35 9 4.2.25-.77.5-1.54.78-2.31z" />
                </svg>
                Apple
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
