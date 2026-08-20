import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Check, User, ArrowRight, ArrowLeft, Upload, Video, ShieldCheck, Sparkles } from 'lucide-react';
import type { Profile } from '../types';
import { profileService } from '../services/profileService';

interface OnboardingCarouselProps {
  onComplete: (newProfile?: Profile) => void;
}

// Strictly High-Quality Indian Couple Photography
const INDIAN_COUPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80', // Indian Wedding Couple
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80', // Traditional Royal Couple
  'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=1000&q=80', // Traditional Indian Bride & Groom
  'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1000&q=80', // Smiling Indian Couple
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80'  // Elegant Celebration Couple
];

export const OnboardingCarousel: React.FC<OnboardingCarouselProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State to build persona - all fields editable with clear placeholders
  const [gender, setGender] = useState<'man' | 'woman'>('woman');
  const [managedBy, setManagedBy] = useState<'self' | 'parent' | 'sibling'>('self');
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [city, setCity] = useState('');
  const [religion, setReligion] = useState('Hindu');
  const [subCommunity, setSubCommunity] = useState('');
  const [education, setEducation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [salaryBracket, setSalaryBracket] = useState('₹25L - ₹35L / yr');
  const [financialStance, setFinancialStance] = useState('Hybrid Balance');
  const [diet, setDiet] = useState('Veg');
  const [familyType, setFamilyType] = useState('Nuclear');
  const [familyValues, setFamilyValues] = useState('Moderate');

  // Step 8 & 9 Media Upload State
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'
  ]);
  const [videoUrl, setVideoUrl] = useState<string>(
    'https://assets.mixkit.co/videos/preview/mixkit-young-woman-smiling-at-the-camera-41130-large.mp4'
  );

  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const totalSteps = 10;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotoUrls: string[] = [];
      Array.from(e.target.files).slice(0, 3).forEach((file) => {
        const url = URL.createObjectURL(file);
        newPhotoUrls.push(url);
      });
      if (newPhotoUrls.length > 0) {
        setPhotos(newPhotoUrls);
      }
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const createdProfile = await profileService.createProfile({
        display_name: displayName.trim() || (gender === 'woman' ? 'Ananya Sharma' : 'Rohan Malhotra'),
        age: age ? parseInt(age, 10) : 27,
        height: height || "5'7\"",
        city: city.trim() || 'Mumbai',
        religion: religion || 'Hindu',
        community: religion === 'Hindu' ? 'North Indian' : religion,
        sub_community: subCommunity.trim() || 'Brahmin',
        education: education.trim() || 'B.Tech / MBA',
        occupation: occupation.trim() || 'Software Engineer',
        company_name: companyName.trim() || 'Tech Enterprise',
        salary_bracket: salaryBracket,
        diet: diet,
        managed_by: managedBy === 'sibling' ? 'self' : managedBy,
        photos: photos,
        bio_video_url: videoUrl,
        family_background: `${familyType} family with ${familyValues.toLowerCase()} values. Settled in ${city || 'Mumbai'}.`,
        marriage_expectations: `Looking for a compatible partner who appreciates ${financialStance.toLowerCase()} financial goals and family harmony.`,
        bio_text: `Hi! I am a ${occupation || 'Professional'} based in ${city || 'Mumbai'}. Value deep mutual respect, family values, and progressive growth.`
      });

      onComplete(createdProfile);
    } catch {
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setDirection(1);
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const getGeneratedPersonaTitle = () => {
    if (familyValues === 'Progressive' && financialStance === 'Independent') {
      return 'Modern Progressive Leader';
    }
    if (diet === 'Veg' && familyValues === 'Traditional') {
      return 'Grounded Cultural Traditionalist';
    }
    return 'Empathetic Ambitious Builder';
  };

  const currentCouplePhoto = INDIAN_COUPLE_PHOTOS[(step - 1) % INDIAN_COUPLE_PHOTOS.length];

  // Framer Motion Variants for Smooth Slide & Scale
  const slideVariants: Variants = {
    initial: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
      scale: 0.96
    }),
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 280,
        damping: 24
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      scale: 0.96,
      transition: {
        duration: 0.18
      }
    })
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] flex flex-col justify-between p-4 sm:p-6 w-full max-w-lg mx-auto relative select-none text-[#111111] font-sans overflow-hidden">
      {/* Hidden File Inputs */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handlePhotoUpload}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
        className="hidden"
      />

      {/* Background Image Layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCouplePhoto}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 0.25, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <img
            src={currentCouplePhoto}
            alt="Indian Couple Background"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Light Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FBF9F4]/95 via-[#FBF9F4]/80 to-[#FBF9F4]/98 z-0 pointer-events-none" />

      {/* Top Header */}
      <div className="pt-2 z-20 space-y-3 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-instrument text-3xl lowercase text-[#B89552] tracking-tight">mannat</span>
            <span className="text-[10px] font-black text-[#B89552] bg-[#F4EFE6]/95 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-[#E8E1D5] shadow-xs">
              STEP {step} OF {totalSteps}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onComplete()}
            className="text-xs font-bold text-[#777777] hover:text-[#111111] bg-[#F4EFE6]/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#E8E1D5] transition-all cursor-pointer shadow-xs active:scale-95"
          >
            Skip
          </button>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-1.5 bg-[#E8E1D5] rounded-full overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-[#B89552] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          />
        </div>
      </div>

      {/* Step Content Container */}
      <div className="my-auto py-4 z-20 flex-1 flex flex-col justify-center relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-4 text-left"
          >
            {/* Step 1: Gender & Managed By */}
            {step === 1 && (
              <div className="space-y-4">
                <span className="block text-[11px] font-black uppercase tracking-widest text-[#B89552]">
                  STEP 1: IDENTITY & CREATOR
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-[#111111] leading-tight">
                  Who is seeking a life partner?
                </h1>

                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                    I am a:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={() => setGender('man')}
                      className={`p-4 rounded-2xl border text-center transition-all cursor-pointer backdrop-blur-md ${
                        gender === 'man'
                          ? 'bg-[#111111] text-white border-[#111111] shadow-md font-bold'
                          : 'bg-[#F4EFE6]/95 text-[#555555] border-[#E8E1D5] hover:bg-[#E8E1D5]'
                      }`}
                    >
                      <User className="w-6 h-6 mx-auto mb-1 text-[#B89552]" />
                      <span className="text-sm font-extrabold block">Man</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={() => setGender('woman')}
                      className={`p-4 rounded-2xl border text-center transition-all cursor-pointer backdrop-blur-md ${
                        gender === 'woman'
                          ? 'bg-[#111111] text-white border-[#111111] shadow-md font-bold'
                          : 'bg-[#F4EFE6]/95 text-[#555555] border-[#E8E1D5] hover:bg-[#E8E1D5]'
                      }`}
                    >
                      <User className="w-6 h-6 mx-auto mb-1 text-[#B89552]" />
                      <span className="text-sm font-extrabold block">Woman</span>
                    </motion.button>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                    Profile Created By:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'self', label: 'Myself' },
                      { id: 'parent', label: 'Parent / Guardian' },
                      { id: 'sibling', label: 'Sibling / Relative' }
                    ].map((mgr) => (
                      <motion.button
                        key={mgr.id}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setManagedBy(mgr.id as any)}
                        className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer backdrop-blur-md ${
                          managedBy === mgr.id
                            ? 'bg-[#111111] text-white border-[#111111] shadow-sm'
                            : 'bg-[#F4EFE6]/95 text-[#555555] border-[#E8E1D5] hover:bg-[#E8E1D5]'
                        }`}
                      >
                        {mgr.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Name, Age, Height & City */}
            {step === 2 && (
              <div className="space-y-4">
                <span className="block text-[11px] font-black uppercase tracking-widest text-[#B89552]">
                  STEP 2: BASIC DETAILS
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-[#111111] leading-tight">
                  What is your name and age?
                </h1>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                      Full Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full p-3.5 rounded-xl bg-white border border-[#E8E1D5] text-sm font-semibold text-[#111111] outline-none focus:border-[#B89552] shadow-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                        Age (Years)
                      </label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g. 27"
                        className="w-full p-3.5 rounded-xl bg-white border border-[#E8E1D5] text-sm font-semibold text-[#111111] outline-none focus:border-[#B89552] shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                        Height
                      </label>
                      <input
                        type="text"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="e.g. 5'6&quot;"
                        className="w-full p-3.5 rounded-xl bg-white border border-[#E8E1D5] text-sm font-semibold text-[#111111] outline-none focus:border-[#B89552] shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                      Current City / Location
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai, Delhi NCR, Bangalore, London"
                      className="w-full p-3.5 rounded-xl bg-white border border-[#E8E1D5] text-sm font-semibold text-[#111111] outline-none focus:border-[#B89552] shadow-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Religion & Sub-Community */}
            {step === 3 && (
              <div className="space-y-4">
                <span className="block text-[11px] font-black uppercase tracking-widest text-[#B89552]">
                  STEP 3: CULTURAL ROOTS
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-[#111111] leading-tight">
                  Religion & Sub-Community
                </h1>

                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                    Select Religion:
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {['Hindu', 'Sikh', 'Jain', 'Muslim', 'Christian'].map((rel) => (
                      <motion.button
                        key={rel}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setReligion(rel)}
                        className={`px-4 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer backdrop-blur-md ${
                          religion === rel
                            ? 'bg-[#111111] text-white shadow-sm'
                            : 'bg-[#F4EFE6]/95 text-[#555555] border border-[#E8E1D5]'
                        }`}
                      >
                        {rel}
                      </motion.button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                      Sub-Community / Caste / Gotra
                    </label>
                    <input
                      type="text"
                      value={subCommunity}
                      onChange={(e) => setSubCommunity(e.target.value)}
                      placeholder="e.g. Kanyakubja Brahmin, Kayastha, Agarwal, Khatri"
                      className="w-full p-3.5 rounded-xl bg-white border border-[#E8E1D5] text-sm font-semibold text-[#111111] outline-none focus:border-[#B89552] shadow-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Education & Career */}
            {step === 4 && (
              <div className="space-y-4">
                <span className="block text-[11px] font-black uppercase tracking-widest text-[#B89552]">
                  STEP 4: CAREER & EDUCATION
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-[#111111] leading-tight">
                  Professional Background
                </h1>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                      Highest Education Degree
                    </label>
                    <input
                      type="text"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      placeholder="e.g. B.Tech IIT Bombay, MBA IIM, MS Stanford"
                      className="w-full p-3.5 rounded-xl bg-white border border-[#E8E1D5] text-sm font-semibold text-[#111111] outline-none focus:border-[#B89552] shadow-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                        Occupation / Role
                      </label>
                      <input
                        type="text"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        placeholder="e.g. Product Designer / Doctor"
                        className="w-full p-3.5 rounded-xl bg-white border border-[#E8E1D5] text-sm font-semibold text-[#111111] outline-none focus:border-[#B89552] shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Google / AI Startup / Self-employed"
                        className="w-full p-3.5 rounded-xl bg-white border border-[#E8E1D5] text-sm font-semibold text-[#111111] outline-none focus:border-[#B89552] shadow-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Income & Financial Stance */}
            {step === 5 && (
              <div className="space-y-4">
                <span className="block text-[11px] font-black uppercase tracking-widest text-[#B89552]">
                  STEP 5: FINANCIAL HARMONY
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-[#111111] leading-tight">
                  Income & Money Values
                </h1>

                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                    Annual Salary Bracket:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['₹15L - ₹25L', '₹25L - ₹35L', '₹35L - ₹50L', '₹50L+ HNI'].map((sal) => (
                      <motion.button
                        key={sal}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setSalaryBracket(sal)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer backdrop-blur-md ${
                          salaryBracket === sal
                            ? 'bg-[#111111] text-white border-[#111111]'
                            : 'bg-[#F4EFE6]/95 text-[#555555] border-[#E8E1D5]'
                        }`}
                      >
                        {sal}
                      </motion.button>
                    ))}
                  </div>

                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] pt-2">
                    Financial Management Preference:
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'Total Pooling', label: 'Total Joint Account Pooling' },
                      { id: 'Hybrid Balance', label: 'Shared Joint Account + Separate Savings' },
                      { id: 'Independent', label: '100% Independent Accounts' }
                    ].map((fin) => (
                      <motion.button
                        key={fin.id}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setFinancialStance(fin.id)}
                        className={`w-full p-3.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between backdrop-blur-md ${
                          financialStance === fin.id
                            ? 'bg-[#111111] text-white border-[#111111]'
                            : 'bg-[#F4EFE6]/95 text-[#555555] border-[#E8E1D5]'
                        }`}
                      >
                        <span>{fin.label}</span>
                        {financialStance === fin.id && <Check className="w-4 h-4 text-[#B89552]" />}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Diet & Lifestyle */}
            {step === 6 && (
              <div className="space-y-4">
                <span className="block text-[11px] font-black uppercase tracking-widest text-[#B89552]">
                  STEP 6: LIFESTYLE & DIET
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-[#111111] leading-tight">
                  Diet & Daily Habits
                </h1>

                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                    Diet Preference:
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {['Veg', 'Eggetarian', 'Non-Veg', 'Vegan', 'Jain Veg'].map((d) => (
                      <motion.button
                        key={d}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setDiet(d)}
                        className={`px-4 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer backdrop-blur-md ${
                          diet === d
                            ? 'bg-[#111111] text-white shadow-sm'
                            : 'bg-[#F4EFE6]/95 text-[#555555] border border-[#E8E1D5]'
                        }`}
                      >
                        {d}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Family Background & Values */}
            {step === 7 && (
              <div className="space-y-4">
                <span className="block text-[11px] font-black uppercase tracking-widest text-[#B89552]">
                  STEP 7: FAMILY & VALUES
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-[#111111] leading-tight">
                  Family Background & Values
                </h1>

                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                    Family Type:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Nuclear', 'Joint Family'].map((fam) => (
                      <motion.button
                        key={fam}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setFamilyType(fam)}
                        className={`p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer backdrop-blur-md ${
                          familyType === fam
                            ? 'bg-[#111111] text-white border-[#111111]'
                            : 'bg-[#F4EFE6]/95 text-[#555555] border-[#E8E1D5]'
                        }`}
                      >
                        {fam}
                      </motion.button>
                    ))}
                  </div>

                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] pt-2">
                    Family Values:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Traditional', 'Moderate', 'Progressive'].map((val) => (
                      <motion.button
                        key={val}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setFamilyValues(val)}
                        className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer backdrop-blur-md ${
                          familyValues === val
                            ? 'bg-[#111111] text-white border-[#111111]'
                            : 'bg-[#F4EFE6]/95 text-[#555555] border-[#E8E1D5]'
                        }`}
                      >
                        {val}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 8: Upload 3 Candidate Photos */}
            {step === 8 && (
              <div className="space-y-4">
                <span className="block text-[11px] font-black uppercase tracking-widest text-[#B89552]">
                  STEP 8: PHOTO GALLERY (3 REQUIRED)
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-[#111111] leading-tight">
                  Add 3 profile photos.
                </h1>
                <p className="text-xs text-[#777777] font-medium leading-relaxed">
                  Discretion guaranteed. Select or upload 3 clear pictures for your verified bio-data portal.
                </p>

                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  {photos.map((url, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.04 }}
                      className="relative aspect-square rounded-2xl overflow-hidden border-2 border-[#B89552] bg-[#F4EFE6] shadow-sm"
                    >
                      <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 right-1 bg-[#111111] text-[#B89552] text-[9px] font-black px-1.5 py-0.5 rounded-md">
                        ✓ #{idx + 1}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div
                  onClick={() => photoInputRef.current?.click()}
                  className="p-4 rounded-2xl bg-[#F4EFE6]/95 border border-[#E8E1D5] flex items-center justify-between cursor-pointer hover:bg-[#E8E1D5] transition-colors backdrop-blur-md shadow-xs active:scale-98"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-[#111111]">
                    <Upload className="w-4 h-4 text-[#B89552]" />
                    <span>Upload custom photos from device</span>
                  </div>
                  <span className="text-[10px] text-[#B89552] font-black uppercase bg-white px-3 py-1 rounded-full border border-[#E8E1D5] shadow-xs">
                    Browse Files
                  </span>
                </div>
              </div>
            )}

            {/* Step 9: Record / Upload 30s Video Intro */}
            {step === 9 && (
              <div className="space-y-4">
                <span className="block text-[11px] font-black uppercase tracking-widest text-[#B89552]">
                  STEP 9: 30-SEC VIDEO INTRO
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-[#111111] leading-tight">
                  Add a 30s Video Intro.
                </h1>
                <p className="text-xs text-[#777777] font-medium leading-relaxed">
                  Vertical videos build 10x higher trust. Introduce your values, personality, and expectations.
                </p>

                <div className="relative rounded-2xl overflow-hidden aspect-[9/14] max-h-[300px] bg-black border-2 border-[#B89552] mx-auto shadow-md">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-[#B89552] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow">
                    30s Intro Preview
                  </div>
                </div>

                <div
                  onClick={() => videoInputRef.current?.click()}
                  className="p-3.5 rounded-2xl bg-[#F4EFE6]/95 border border-[#E8E1D5] flex items-center justify-between text-xs font-bold backdrop-blur-md cursor-pointer hover:bg-[#E8E1D5] transition-colors shadow-xs active:scale-98"
                >
                  <div className="flex items-center gap-2 text-[#111111]">
                    <Video className="w-4 h-4 text-[#B89552]" />
                    <span>Upload 30s video stream from device</span>
                  </div>
                  <span className="text-[10px] font-black text-[#B89552] uppercase bg-white px-3 py-1 rounded-full border border-[#E8E1D5] shadow-xs">
                    Choose Video
                  </span>
                </div>
              </div>
            )}

            {/* Step 10: Expectations & Generated Persona Card Reveal */}
            {step === 10 && (
              <div className="space-y-4 text-center">
                <span className="block text-[11px] font-black uppercase tracking-widest text-[#B89552]">
                  MANNAT PERSONA PROFILE GENERATED
                </span>

                {/* Generated Persona Badge Card */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                  className="bg-[#F4EFE6]/95 border-2 border-[#B89552] rounded-3xl p-6 space-y-4 shadow-xl text-left backdrop-blur-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-instrument text-2xl lowercase text-[#B89552]">mannat</span>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#111111] text-white px-3 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#B89552]" />
                      <span>98% MQS MATCH SCORE</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-[#777777]">GENERATED PERSONA</span>
                    <h2 className="text-2xl font-serif-editorial font-bold text-[#111111]">
                      {getGeneratedPersonaTitle()}
                    </h2>
                    <p className="text-xs text-[#555555] mt-1 font-medium leading-relaxed">
                      {displayName || 'Ananya Sharma'}, {age || '27'}yrs • {religion} ({subCommunity || 'Brahmin'}) • {occupation || 'Professional'} at {companyName || 'Global Enterprise'} • {city || 'Mumbai'}.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#E8E1D5]">
                    <div>
                      <span className="text-[#777777] block text-[10px]">Financial Stance</span>
                      <span className="font-bold text-[#111111]">{financialStance}</span>
                    </div>
                    <div>
                      <span className="text-[#777777] block text-[10px]">Family Values</span>
                      <span className="font-bold text-[#111111]">{familyValues}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E8E1D5] flex items-center justify-between text-xs text-emerald-700 font-bold">
                    <span>✓ 3 Photos & 30s Video Ready</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                </motion.div>
              </div>
            )}

            {/* CONTINUE & BACK BUTTON BAR DIRECTLY BELOW FORM CONTENT */}
            <div className="pt-4 flex items-center gap-3">
              {step > 1 ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handlePrev}
                  className="py-3.5 px-5 rounded-full bg-[#F4EFE6]/95 backdrop-blur-md text-[#111111] font-extrabold text-xs uppercase tracking-wider hover:bg-[#E8E1D5] border border-[#E8E1D5] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </motion.button>
              ) : null}

              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.01 }}
                type="button"
                disabled={isSubmitting}
                onClick={handleNext}
                className="flex-1 py-4 px-6 rounded-full bg-[#111111] text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:bg-[#B89552] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{step === totalSteps ? (isSubmitting ? 'Saving Profile...' : 'Save & Enter Mannat Feed') : 'Continue'}</span>
                <ArrowRight className="w-4 h-4 text-[#B89552]" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
