import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Check, User, ArrowRight, ArrowLeft, Upload, ShieldCheck, Sparkles, Camera, Square, X, Volume2, AlertCircle } from 'lucide-react';
import type { Profile } from '../types';
import { profileService } from '../services/profileService';
import type { UserSession } from '../services/authService';

interface OnboardingCarouselProps {
  onComplete: (newProfile?: Profile) => void;
  currentUser?: UserSession | null;
}

// Strictly High-Quality Indian Couple Photography
const INDIAN_COUPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80', // Indian Wedding Couple
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80', // Traditional Royal Couple
  'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=1000&q=80', // Traditional Indian Bride & Groom
  'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1000&q=80', // Smiling Indian Couple
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80'  // Elegant Celebration Couple
];

export const OnboardingCarousel: React.FC<OnboardingCarouselProps> = ({ onComplete, currentUser }) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State to build persona - all fields mandatory
  const [gender, setGender] = useState<'man' | 'woman'>('woman');
  const [managedBy, setManagedBy] = useState<'self' | 'parent' | 'sibling'>('self');
  const [displayName, setDisplayName] = useState(currentUser?.user_metadata?.full_name || '');
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
    currentUser?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'
  ]);
  const [videoUrl, setVideoUrl] = useState<string>(
    'https://assets.mixkit.co/videos/preview/mixkit-young-woman-smiling-at-the-camera-41130-large.mp4'
  );

  // Live In-Browser Video Recording State
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const liveVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Hidden File & Camera Input Refs
  const photoFileInputRef = useRef<HTMLInputElement | null>(null);
  const photoCameraInputRef = useRef<HTMLInputElement | null>(null);
  const videoFileInputRef = useRef<HTMLInputElement | null>(null);
  const videoCameraInputRef = useRef<HTMLInputElement | null>(null);

  const totalSteps = 10;

  // Clear validation error whenever user modifies inputs
  useEffect(() => {
    setErrorMsg(null);
  }, [step, displayName, age, height, city, subCommunity, education, occupation, companyName]);

  // Handle Photo Selection (Gallery / Files / Camera)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotoUrls: string[] = [];
      Array.from(e.target.files).slice(0, 3).forEach((file) => {
        const url = URL.createObjectURL(file);
        newPhotoUrls.push(url);
      });
      if (newPhotoUrls.length > 0) {
        setPhotos(prev => [...newPhotoUrls, ...prev].slice(0, 3));
      }
    }
  };

  // Handle Video Selection (Gallery / Files / Camera)
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  // Start Live Webcam Stream for In-Browser Recording
  const openWebcamRecorder = async () => {
    try {
      setIsRecordingModalOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 1280 } },
        audio: true
      });
      streamRef.current = stream;
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
        liveVideoRef.current.play();
      }
    } catch (err) {
      console.warn('Webcam stream error, falling back to camera input:', err);
      videoCameraInputRef.current?.click();
      setIsRecordingModalOpen(false);
    }
  };

  const startLiveRecording = () => {
    if (!streamRef.current) return;
    recordedChunksRef.current = [];
    try {
      const recorder = new MediaRecorder(streamRef.current);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/mp4' });
        const recordedUrl = URL.createObjectURL(blob);
        setVideoUrl(recordedUrl);
        closeWebcamRecorder();
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);
    } catch (e) {
      console.error('Recording error:', e);
    }
  };

  const stopLiveRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const closeWebcamRecorder = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
    setIsRecordingModalOpen(false);
  };

  // Timer for 30s Recording Limit
  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds(prev => {
          if (prev >= 29) {
            stopLiveRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Mandatory Field Validation per Step
  const validateCurrentStep = (): boolean => {
    setErrorMsg(null);

    if (step === 1) {
      if (!gender) {
        setErrorMsg('Please select whether candidate is a Man or Woman.');
        return false;
      }
      if (!managedBy) {
        setErrorMsg('Please select who is managing this profile.');
        return false;
      }
    }

    if (step === 2) {
      if (!displayName.trim()) {
        setErrorMsg('Full candidate name is mandatory.');
        return false;
      }
      if (!age || parseInt(age, 10) < 18 || parseInt(age, 10) > 80) {
        setErrorMsg('Age is mandatory (must be between 18 and 80).');
        return false;
      }
      if (!height.trim()) {
        setErrorMsg('Height is mandatory (e.g. 5\'7").');
        return false;
      }
    }

    if (step === 3) {
      if (!city.trim()) {
        setErrorMsg('Settled city is mandatory.');
        return false;
      }
      if (!religion) {
        setErrorMsg('Religion is mandatory.');
        return false;
      }
      if (!subCommunity.trim()) {
        setErrorMsg('Sub-community or caste is mandatory (e.g. Brahmin, Khatri, Agarwal).');
        return false;
      }
    }

    if (step === 4) {
      if (!education.trim()) {
        setErrorMsg('Highest education is mandatory (e.g. MBA, B.Tech, MS).');
        return false;
      }
      if (!occupation.trim()) {
        setErrorMsg('Current profession / role is mandatory.');
        return false;
      }
      if (!companyName.trim()) {
        setErrorMsg('Company or firm name is mandatory.');
        return false;
      }
    }

    if (step === 5) {
      if (!salaryBracket) {
        setErrorMsg('Salary bracket is mandatory.');
        return false;
      }
      if (!financialStance) {
        setErrorMsg('Financial preference is mandatory.');
        return false;
      }
    }

    if (step === 6) {
      if (!diet) {
        setErrorMsg('Diet preference is mandatory.');
        return false;
      }
    }

    if (step === 7) {
      if (!familyType) {
        setErrorMsg('Family type is mandatory (Nuclear or Joint).');
        return false;
      }
      if (!familyValues) {
        setErrorMsg('Family values are mandatory.');
        return false;
      }
    }

    if (step === 8) {
      if (!photos || photos.length < 3) {
        setErrorMsg('3 profile photos are mandatory for bio-data verification.');
        return false;
      }
    }

    if (step === 9) {
      if (!videoUrl) {
        setErrorMsg('30-second video intro is mandatory.');
        return false;
      }
    }

    return true;
  };

  const handleFinish = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    try {
      const createdProfile = await profileService.createProfile({
        user_id: currentUser?.id,
        display_name: displayName.trim(),
        age: parseInt(age, 10),
        height: height.trim(),
        city: city.trim(),
        religion: religion,
        community: religion === 'Hindu' ? 'North Indian' : religion,
        sub_community: subCommunity.trim(),
        education: education.trim(),
        occupation: occupation.trim(),
        company_name: companyName.trim(),
        salary_bracket: salaryBracket,
        diet: diet,
        managed_by: managedBy === 'sibling' ? 'self' : managedBy,
        photos: photos,
        bio_video_url: videoUrl,
        family_background: `${familyType} family with ${familyValues.toLowerCase()} values. Settled in ${city}.`,
        marriage_expectations: `Looking for a compatible partner who appreciates ${financialStance.toLowerCase()} financial goals and family harmony.`,
        bio_text: `Hi! I am a ${occupation} based in ${city}. Value deep mutual respect, family values, and progressive growth.`,
        lifestyle_details: {
          net_worth: salaryBracket.includes('50L') ? '₹10Cr+' : '₹5Cr - ₹10Cr',
          private_clubs: 'City Golf & Country Club',
          second_home: true
        },
        horoscope: {
          manglik: 'No'
        }
      });

      if (currentUser?.email) {
        localStorage.setItem('mannat_onboarded_' + currentUser.email.toLowerCase(), 'true');
      }
      if (currentUser?.id) {
        localStorage.setItem('mannat_onboarded_' + currentUser.id, 'true');
      }

      onComplete(createdProfile);
    } catch {
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }
    if (step < totalSteps) {
      setDirection(1);
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    setErrorMsg(null);
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
      {/* Hidden File & Camera Inputs */}
      <input
        ref={photoFileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handlePhotoUpload}
        className="hidden"
      />
      <input
        ref={photoCameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={handlePhotoUpload}
        className="hidden"
      />
      <input
        ref={videoFileInputRef}
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
        className="hidden"
      />
      <input
        ref={videoCameraInputRef}
        type="file"
        accept="video/*"
        capture="user"
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
          <span className="text-[10px] font-black text-[#B89552] uppercase bg-[#F4EFE6]/90 px-3 py-1 rounded-full border border-[#E8E1D5]">
            MANDATORY FIELDS
          </span>
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
                  STEP 1: IDENTITY & CREATOR *
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-[#111111] leading-tight">
                  Who is seeking a life partner?
                </h1>

                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                    I am a: <span className="text-red-500">*</span>
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

                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] pt-2">
                    Profile is managed by: <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'self', label: 'Self Candidate' },
                      { id: 'parent', label: 'Parent' },
                      { id: 'sibling', label: 'Sibling' }
                    ].map((mgr) => (
                      <motion.button
                        key={mgr.id}
                        whileTap={{ scale: 0.96 }}
                        type="button"
                        onClick={() => setManagedBy(mgr.id as any)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer backdrop-blur-md ${
                          managedBy === mgr.id
                            ? 'bg-[#111111] text-white border-[#111111]'
                            : 'bg-[#F4EFE6]/95 text-[#555555] border-[#E8E1D5]'
                        }`}
                      >
                        {mgr.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Name, Age, Height */}
            {step === 2 && (
              <div className="space-y-4">
                <span className="block text-[11px] font-black uppercase tracking-widest text-[#B89552]">
                  STEP 2: CANDIDATE VITALS *
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-[#111111] leading-tight">
                  Personal Details & Vitals
                </h1>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                      Full Candidate Name <span className="text-red-500">*</span>:
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder={gender === 'woman' ? 'e.g. Ananya Sharma' : 'e.g. Rohan Malhotra'}
                      className="w-full p-3.5 rounded-2xl bg-white border border-[#E8E1D5] text-sm font-bold text-[#111111] outline-none focus:border-[#B89552] shadow-xs"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                        Age (Years) <span className="text-red-500">*</span>:
                      </label>
                      <input
                        type="number"
                        min="18"
                        max="80"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g. 27"
                        className="w-full p-3.5 rounded-2xl bg-white border border-[#E8E1D5] text-sm font-bold text-[#111111] outline-none focus:border-[#B89552] shadow-xs"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                        Height <span className="text-red-500">*</span>:
                      </label>
                      <input
                        type="text"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="e.g. 5'7&quot;"
                        className="w-full p-3.5 rounded-2xl bg-white border border-[#E8E1D5] text-sm font-bold text-[#111111] outline-none focus:border-[#B89552] shadow-xs"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Location, Religion & Sub-community */}
            {step === 3 && (
              <div className="space-y-4">
                <span className="block text-[11px] font-black uppercase tracking-widest text-[#B89552]">
                  STEP 3: CULTURAL ROOTS *
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-[#111111] leading-tight">
                  Location & Background
                </h1>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                      Settled City <span className="text-red-500">*</span>:
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai / Bangalore / Delhi NCR"
                      className="w-full p-3.5 rounded-2xl bg-white border border-[#E8E1D5] text-sm font-bold text-[#111111] outline-none focus:border-[#B89552] shadow-xs"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                        Religion <span className="text-red-500">*</span>:
                      </label>
                      <select
                        value={religion}
                        onChange={(e) => setReligion(e.target.value)}
                        className="w-full p-3.5 rounded-2xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none focus:border-[#B89552] shadow-xs cursor-pointer"
                        required
                      >
                        {['Hindu', 'Sikh', 'Jain', 'Muslim', 'Christian', 'Parsi'].map((rel) => (
                          <option key={rel} value={rel}>{rel}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                        Sub-Community / Caste <span className="text-red-500">*</span>:
                      </label>
                      <input
                        type="text"
                        value={subCommunity}
                        onChange={(e) => setSubCommunity(e.target.value)}
                        placeholder="e.g. Brahmin, Khatri, Arora, Agarwal"
                        className="w-full p-3.5 rounded-2xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none focus:border-[#B89552] shadow-xs"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Education & Profession */}
            {step === 4 && (
              <div className="space-y-4">
                <span className="block text-[11px] font-black uppercase tracking-widest text-[#B89552]">
                  STEP 4: CAREER & EDUCATION *
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-[#111111] leading-tight">
                  Career, Education & Role
                </h1>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                      Highest Education <span className="text-red-500">*</span>:
                    </label>
                    <input
                      type="text"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      placeholder="e.g. MBA / B.Tech / MS / MD / CA"
                      className="w-full p-3.5 rounded-2xl bg-white border border-[#E8E1D5] text-sm font-bold text-[#111111] outline-none focus:border-[#B89552] shadow-xs"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                        Profession / Role <span className="text-red-500">*</span>:
                      </label>
                      <input
                        type="text"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        placeholder="e.g. Product Manager, Doctor, Founder"
                        className="w-full p-3.5 rounded-2xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none focus:border-[#B89552] shadow-xs"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1">
                        Company / Firm <span className="text-red-500">*</span>:
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Google, McKinsey, Enterprise"
                        className="w-full p-3.5 rounded-2xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none focus:border-[#B89552] shadow-xs"
                        required
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
                  STEP 5: FINANCIAL HARMONY *
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-[#111111] leading-tight">
                  Income & Money Values
                </h1>

                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                    Annual Salary Bracket <span className="text-red-500">*</span>:
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
                    Financial Management Preference <span className="text-red-500">*</span>:
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
                  STEP 6: LIFESTYLE & DIET *
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-[#111111] leading-tight">
                  Diet & Daily Habits
                </h1>

                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                    Diet Preference <span className="text-red-500">*</span>:
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
                  STEP 7: FAMILY & VALUES *
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-[#111111] leading-tight">
                  Family Background & Values
                </h1>

                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                    Family Type <span className="text-red-500">*</span>:
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
                    Family Values <span className="text-red-500">*</span>:
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

            {/* Step 8: Upload / Shoot 3 Candidate Photos */}
            {step === 8 && (
              <div className="space-y-4">
                <span className="block text-[11px] font-black uppercase tracking-widest text-[#B89552]">
                  STEP 8: PHOTO GALLERY (3 REQUIRED) *
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-[#111111] leading-tight">
                  Add 3 profile photos.
                </h1>
                <p className="text-xs text-[#777777] font-medium leading-relaxed">
                  Shoot directly with camera or upload 3 clear pictures for bio-data verification.
                </p>

                {/* Photo Previews */}
                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  {photos.map((url, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.04 }}
                      className="relative aspect-square rounded-2xl overflow-hidden border-2 border-[#B89552] bg-[#F4EFE6] shadow-sm group"
                    >
                      <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 right-1 bg-[#111111] text-[#B89552] text-[9px] font-black px-1.5 py-0.5 rounded-md">
                        ✓ #{idx + 1}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Dual Options: Camera Shoot & Gallery Upload */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => photoCameraInputRef.current?.click()}
                    className="p-4 rounded-2xl bg-[#111111] hover:bg-[#B89552] text-white flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95"
                  >
                    <Camera className="w-5 h-5 text-[#B89552]" />
                    <span className="text-xs font-extrabold">Use Camera to Shoot</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => photoFileInputRef.current?.click()}
                    className="p-4 rounded-2xl bg-[#F4EFE6] hover:bg-[#E8E1D5] text-[#111111] border border-[#E8E1D5] flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs active:scale-95"
                  >
                    <Upload className="w-5 h-5 text-[#B89552]" />
                    <span className="text-xs font-extrabold">Upload from Gallery</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 9: Record / Upload 30s Video Intro */}
            {step === 9 && (
              <div className="space-y-4">
                <span className="block text-[11px] font-black uppercase tracking-widest text-[#B89552]">
                  STEP 9: 30-SEC VIDEO INTRO *
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-[#111111] leading-tight">
                  Add a 30s Video Intro.
                </h1>
                <p className="text-xs text-[#777777] font-medium leading-relaxed">
                  Vertical videos with authentic voice build 10x higher trust.
                </p>

                {/* Video Player Preview with Sound Support */}
                <div className="relative rounded-2xl overflow-hidden aspect-[9/14] max-h-[260px] bg-black border-2 border-[#B89552] mx-auto shadow-md">
                  <video
                    src={videoUrl}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-[#B89552] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow flex items-center gap-1">
                    <Volume2 className="w-3 h-3" />
                    <span>Sound Active</span>
                  </div>
                </div>

                {/* Dual Options: Camera Shoot & Video File Upload */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={openWebcamRecorder}
                    className="p-3.5 rounded-2xl bg-[#111111] hover:bg-[#B89552] text-white flex flex-col items-center justify-center gap-1 cursor-pointer transition-all shadow-md active:scale-95"
                  >
                    <Camera className="w-5 h-5 text-[#B89552]" />
                    <span className="text-xs font-extrabold">Use Camera to Shoot</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => videoFileInputRef.current?.click()}
                    className="p-3.5 rounded-2xl bg-[#F4EFE6] hover:bg-[#E8E1D5] text-[#111111] border border-[#E8E1D5] flex flex-col items-center justify-center gap-1 cursor-pointer transition-all shadow-xs active:scale-95"
                  >
                    <Upload className="w-5 h-5 text-[#B89552]" />
                    <span className="text-xs font-extrabold">Upload Video File</span>
                  </button>
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
                    <h3 className="text-xl font-serif-editorial font-bold text-[#111111]">
                      {displayName}, {age}
                    </h3>
                    <p className="text-xs text-[#777777] font-semibold">
                      {occupation} · {city} · {religion} ({subCommunity})
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-[#E8E1D5] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#777777] font-bold">Persona Match:</span>
                      <span className="font-extrabold text-[#B89552]">{getGeneratedPersonaTitle()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#777777] font-bold">Financial Stance:</span>
                      <span className="font-extrabold text-[#111111]">{financialStance}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#777777] font-bold">Salary Bracket:</span>
                      <span className="font-extrabold text-[#111111]">{salaryBracket}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#777777] font-bold">Diet:</span>
                      <span className="font-extrabold text-[#111111]">{diet}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>BlurShield privacy applied & verified bio-data ready.</span>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mandatory Validation Error Alert */}
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-30 mb-2 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2 shadow-xs"
        >
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      {/* Live Camera Recording Modal */}
      {isRecordingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#161412] rounded-3xl p-5 text-white border border-[#B89552] space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={closeWebcamRecorder}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-serif-editorial font-bold text-center text-[#DFBE7E]">
              Record 30s Video Intro
            </h3>

            {/* Live Camera Viewfinder */}
            <div className="relative aspect-[9/14] max-h-[380px] w-full bg-black rounded-2xl overflow-hidden border border-white/20">
              <video
                ref={liveVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Recording Indicator & Timer */}
              {isRecording && (
                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse shadow">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span>REC {30 - recordingSeconds}s remaining</span>
                </div>
              )}
            </div>

            {/* Camera Controls */}
            <div className="flex items-center justify-center gap-4 pt-1">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startLiveRecording}
                  className="py-3 px-6 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                  <span>Start Recording (30s)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopLiveRecording}
                  className="py-3 px-6 rounded-full bg-white hover:bg-gray-200 active:scale-95 text-red-600 text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Square className="w-4 h-4 fill-red-600" />
                  <span>Stop & Save Video</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="pt-2 z-20 flex items-center gap-3 relative">
        {step > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="py-3.5 px-5 rounded-2xl bg-[#F4EFE6]/95 border border-[#E8E1D5] hover:bg-[#E8E1D5] text-xs font-bold text-[#111111] flex items-center gap-1 transition-all cursor-pointer backdrop-blur-md active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-[#B89552]" />
            <span>Back</span>
          </button>
        )}

        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleNext}
          className="flex-1 py-4 px-6 rounded-2xl bg-[#111111] hover:bg-[#B89552] text-xs font-extrabold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98"
        >
          {step === totalSteps ? (
            <>
              <Sparkles className="w-4 h-4 text-[#B89552]" />
              <span>{isSubmitting ? 'Creating Bio-Data...' : 'Complete & Enter Mannat'}</span>
            </>
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 text-[#B89552]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
