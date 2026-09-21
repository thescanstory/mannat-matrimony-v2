import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  Check,
  User,
  ArrowRight,
  ArrowLeft,
  Upload,
  ShieldCheck,
  Sparkles,
  Camera,
  Square,
  X,
  Volume2,
  AlertCircle,
  Trash2,
  Plus,
  Briefcase,
  MapPin,
  Compass,
  Users,
  ChevronDown,
  GraduationCap,
  Building2,
  Calendar,
  Ruler,
  FlipHorizontal
} from 'lucide-react';
import type { Profile } from '../types';
import { profileService } from '../services/profileService';
import type { UserSession } from '../services/authService';
import { HEIGHT_OPTIONS } from '../data/heightOptions';
import { CITY_OPTIONS } from '../cityOptions';

interface OnboardingCarouselProps {
  onComplete: (newProfile?: Profile) => void;
  currentUser?: UserSession | null;
  initialData?: Profile | null;
  isEditing?: boolean;
  onCancel?: () => void;
}


export const OnboardingCarousel: React.FC<OnboardingCarouselProps> = ({
  onComplete,
  currentUser,
  initialData,
  isEditing = false,
  onCancel
}) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [objectUrls, setObjectUrls] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      objectUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [objectUrls]);

  // Parse existing occupation / employment type if editing
  const rawOccupation = initialData?.occupation || '';
  const initialEmploymentType: 'Salaried' | 'Self-Employed / Business' =
    rawOccupation.includes('Self-Employed') || rawOccupation.includes('Business')
      ? 'Self-Employed / Business'
      : 'Salaried';
  const cleanOccupation = rawOccupation.replace(/\s*\((Salaried|Self-Employed \/ Business|Self-Employed|Business)\)/i, '');

  // Form State to build persona - populated from initialData if editing.
  // All default values are left empty (no pre-filled data) so new users
  // make their own choices instead of inheriting hidden presets.
  const [gender, setGender] = useState<string>(
    initialData?.gender === 'female' ? 'woman' : initialData?.gender === 'male' ? 'man' : ''
  );
  const managedBy = 'self';
  const [displayName, setDisplayName] = useState(
    initialData?.display_name || ''
  );
  const [age, setAge] = useState(initialData?.age ? String(initialData.age) : '');
  const [height, setHeight] = useState(initialData?.height || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [cityIsOther, setCityIsOther] = useState(
    Boolean(initialData?.city && !CITY_OPTIONS.includes(initialData.city))
  );
  const [religion, setReligion] = useState(initialData?.religion || '');
  const [subCommunity, setSubCommunity] = useState(initialData?.sub_community || '');
  const [education, setEducation] = useState(initialData?.education || '');
  const [employmentType, setEmploymentType] = useState<string>(initialData ? initialEmploymentType : '');
  const [occupation, setOccupation] = useState(initialData ? cleanOccupation : '');
  const [companyName, setCompanyName] = useState(initialData?.company_name || '');
  const [salaryBracket, setSalaryBracket] = useState(initialData?.salary_bracket || '');
  const [financialStance, setFinancialStance] = useState('');
  const [diet, setDiet] = useState(initialData?.diet || '');
  const [familyType, setFamilyType] = useState('');
  const [familyValues, setFamilyValues] = useState('');

  // Step 8 & 9 Media Upload State
  const [photos, setPhotos] = useState<string[]>(initialData?.photos || []);
  const [videoUrl, setVideoUrl] = useState<string>(
    initialData?.bio_video_url || ''
  );

  // Live In-Browser Video Recording State
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isVideoMirrored, setIsVideoMirrored] = useState(false);
  const [isCameraMirrored, setIsCameraMirrored] = useState(false);
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

  useEffect(() => {
    setErrorMsg(null);
  }, [step, displayName, age, height, city, education, occupation, companyName, employmentType, salaryBracket, photos]);

  // Handle Photo Selection (Gallery / Files / Camera)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotoUrls: string[] = [];
      Array.from(e.target.files).forEach((file) => {
        const url = URL.createObjectURL(file);
        newPhotoUrls.push(url);
      });
      setPhotos(prev => [...prev, ...newPhotoUrls].slice(0, 3));
      setObjectUrls((prev) => [...prev, ...newPhotoUrls]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Handle Video Selection (Gallery / Files / Camera)
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setObjectUrls((prev) => [...prev, url]);
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
        setObjectUrls((prev) => [...prev, recordedUrl]);
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
    if (mediaRecorderRef.current) {
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
    }

    if (step === 4) {
      if (!education.trim()) {
        setErrorMsg('Highest education is mandatory (e.g. MBA, B.Tech, MS).');
        return false;
      }
      if (!employmentType) {
        setErrorMsg('Please select if salaried or self-employed / business.');
        return false;
      }
      if (!occupation.trim()) {
        setErrorMsg('Current profession / role is mandatory.');
        return false;
      }
      if (!companyName.trim()) {
        setErrorMsg('Company or business name is mandatory.');
        return false;
      }
    }

    if (step === 5) {
      if (!salaryBracket) {
        setErrorMsg('Annual Income bracket is mandatory.');
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
      if (!photos || photos.length === 0) {
        setErrorMsg('Please upload or shoot at least 1 to 3 profile photos.');
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
    const standardGender = gender === 'man' ? 'male' : 'female';
    try {
      // No stock photo defaults — only photos the user actually uploaded.
      const finalPhotos = photos;

      const createdProfile = await profileService.createProfile({
        id: initialData?.id,
        user_id: currentUser?.id || initialData?.user_id,
        display_name: displayName.trim(),
        gender: standardGender,
        age: parseInt(age, 10),
        height: height.trim(),
        city: city.trim(),
        religion: religion,
        community: religion === 'Hindu' ? 'North Indian' : religion,
        sub_community: subCommunity.trim() || undefined,
        education: education.trim(),
        occupation: `${occupation.trim()} (${employmentType})`,
        company_name: companyName.trim(),
        salary_bracket: salaryBracket,
        diet: diet,
        managed_by: 'self',
        photos: finalPhotos,
        bio_video_url: videoUrl,
        family_background: `${familyType} family with ${familyValues.toLowerCase()} values. Settled in ${city}.`,
        marriage_expectations: `Looking for a compatible partner who appreciates ${financialStance.toLowerCase()} financial goals and family harmony.`,
        bio_text: `Hi! I am a ${occupation} (${employmentType}) based in ${city}. Value deep mutual respect, family values, and progressive growth.`,
        lifestyle_details: {
          net_worth: salaryBracket.includes('50L') ? '₹10Cr+' : '₹5Cr - ₹10Cr',
          private_clubs: 'City Golf & Country Club',
          second_home: true,
          video_mirrored: isVideoMirrored
        },
        horoscope: {
          manglik: 'No'
        }
      });

      // Save user gender so discover feed filters strictly
      localStorage.setItem('mannat_user_gender', standardGender);

      if (currentUser?.email) {
        localStorage.setItem('mannat_onboarded_' + currentUser.email.toLowerCase(), 'true');
      }
      if (currentUser?.id) {
        localStorage.setItem('mannat_onboarded_' + currentUser.id, 'true');
      }

      onComplete(createdProfile);
    } catch (error) {
      console.error('Profile creation error:', error);
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

  const stepLabels = [
    { num: 1, title: 'Identity', desc: 'Gender & Creator' },
    { num: 2, title: 'Vitals', desc: 'Name, Age & Height' },
    { num: 3, title: 'Cultural Roots', desc: 'City & Faith' },
    { num: 4, title: 'Career', desc: 'Education & Role' },
    { num: 5, title: 'Affluence', desc: 'Income & Values' },
    { num: 6, title: 'Lifestyle', desc: 'Diet & Habits' },
    { num: 7, title: 'Family', desc: 'Roots & Values' },
    { num: 8, title: 'Portfolio', desc: 'Photo Gallery' },
    { num: 9, title: 'Video Intro', desc: '30s Voice Intro' },
    { num: 10, title: 'Summary', desc: 'MQS Persona Match' }
  ];

  return (
    <div className="min-h-[100dvh] bg-[#F4EFE6]/60 flex flex-col justify-start font-sans text-[#111111] antialiased">
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

      {/* Main Responsive Web App Container */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 flex-1 flex flex-col">
        
        {/* Top Header Bar */}
        <header className="w-full pb-4 sm:pb-6 flex items-center justify-between border-b border-[#E8DDD0]">
          <div className="flex items-center gap-3 sm:gap-4">
            <img 
              src="/images/mannat-logo-square.png" 
              alt="Mannat" 
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-xl shadow-xs border border-[#E8DDD0]/80 bg-white p-1"
            />
            <div className="flex flex-col text-left">
              <span className="text-xl sm:text-2xl font-normal tracking-[0.2em] uppercase text-[#560406] leading-none" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}>
                MANNAT
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.34em] font-extrabold text-[#A17B5E] mt-1">
                Bespoke Member Onboarding Studio
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8DDD0] shadow-2xs text-xs font-bold text-[#560406]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Confidential & Encrypted</span>
            </div>

            {isEditing && (
              <button
                type="button"
                onClick={() => (onCancel ? onCancel() : onComplete())}
                className="text-xs font-bold uppercase text-[#6E6259] hover:text-[#560406] bg-white px-4 py-2 rounded-full border border-[#E8DDD0] transition-all cursor-pointer shadow-xs whitespace-nowrap"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </header>

        {/* Studio Content: 2-Column Desktop Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-6 sm:pt-8 items-start">
          
          {/* Left Sidebar (Desktop Only): Step Journey & Trust Badges */}
          <aside className="hidden lg:flex lg:col-span-4 flex-col gap-6 sticky top-8">
            <div className="bg-white rounded-3xl p-6 border border-[#E8DDD0] shadow-sm space-y-5">
              <div className="space-y-1 text-left">
                <span className="text-[10px] uppercase tracking-widest font-black text-[#560406]">
                  Profile Completion
                </span>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xl font-serif-editorial font-bold text-[#111111]">
                    Step {step} of {totalSteps}
                  </h3>
                  <span className="text-xs font-black text-[#560406]">
                    {Math.round((step / totalSteps) * 100)}% Done
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-[#E8DDD0] rounded-full overflow-hidden mt-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#A17B5E] to-[#560406] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / totalSteps) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  />
                </div>
              </div>

              {/* Step Checklist List */}
              <nav className="space-y-1 pt-2">
                {stepLabels.map((s) => {
                  const isCurrent = step === s.num;
                  const isDone = step > s.num;
                  return (
                    <div
                      key={s.num}
                      className={`flex items-center gap-3 p-2.5 rounded-2xl text-left transition-all ${
                        isCurrent
                          ? 'bg-[#560406]/5 border border-[#560406]/20 font-bold'
                          : isDone
                          ? 'text-[#444444] opacity-80'
                          : 'text-[#999999]'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-[#560406] text-[#F5E6D3]'
                            : 'bg-[#E8DDD0] text-[#777777]'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5" /> : s.num}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className={`text-xs ${isCurrent ? 'font-black text-[#560406]' : 'font-semibold'}`}>
                          {s.title}
                        </span>
                        <span className="text-[10px] text-[#777777] truncate">
                          {s.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Desktop Trust Card */}
            <div className="bg-gradient-to-br from-[#2D2824] to-[#161412] text-white p-5 rounded-3xl border border-[#A17B5E]/30 shadow-md space-y-2 text-left">
              <div className="flex items-center gap-2 text-[#D8B486]">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-wider">The Mannat Standard</span>
              </div>
              <p className="text-xs text-[#E5D8CC] font-medium leading-relaxed">
                Every candidate biodata undergoes manual verification & BlurShield privacy screening before accessing our private matchmaking circle.
              </p>
            </div>
          </aside>

          {/* Right Area: Step Interactive Form Card */}
          <section className="lg:col-span-8 flex flex-col justify-between bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#E8DDD0] shadow-sm relative min-h-[560px]">
            
            {/* Mobile Progress Bar */}
            <div className="lg:hidden w-full pb-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#560406]">
                <span>Step {step} of {totalSteps}: {stepLabels[step - 1]?.title}</span>
                <span>{Math.round((step / totalSteps) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#E8DDD0] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#A17B5E] to-[#560406] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / totalSteps) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                />
              </div>
            </div>

            {/* Step Content Container */}
            <div className="flex-1 flex flex-col justify-start">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6 text-left w-full"
                >
                  {/* Step 1: Gender & Managed By */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-[#560406]/10 text-[11px] font-black uppercase tracking-widest text-[#560406] mb-2">
                          STEP 1 · IDENTITY & CANDIDATE
                        </span>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-editorial font-bold text-[#111111] leading-tight">
                          Who is seeking a life partner?
                        </h1>
                        <p className="text-xs sm:text-sm text-[#777777] font-medium mt-1">
                          Select the candidate profile to personalize the matchmaking circle.
                        </p>
                      </div>

                      <div className="space-y-3 pt-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                          Candidate is a: <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => setGender('man')}
                            className={`p-5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                              gender === 'man'
                                ? 'bg-gradient-to-br from-[#2D2824] to-[#161412] text-white border-[#560406] shadow-md'
                                : 'bg-[#FBF9F4] text-[#444444] border-[#E8DDD0] hover:border-[#560406]/50 hover:bg-[#F4EFE6]'
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${gender === 'man' ? 'bg-[#560406] text-[#F5E6D3]' : 'bg-[#E8DDD0] text-[#555555]'}`}>
                              <User className="w-6 h-6" />
                            </div>
                            <span className="text-base font-extrabold block">Groom (Man)</span>
                            <span className="text-[11px] opacity-75">Creating profile for himself / family</span>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => setGender('woman')}
                            className={`p-5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                              gender === 'woman'
                                ? 'bg-gradient-to-br from-[#2D2824] to-[#161412] text-white border-[#560406] shadow-md'
                                : 'bg-[#FBF9F4] text-[#444444] border-[#E8DDD0] hover:border-[#560406]/50 hover:bg-[#F4EFE6]'
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${gender === 'woman' ? 'bg-[#560406] text-[#F5E6D3]' : 'bg-[#E8DDD0] text-[#555555]'}`}>
                              <User className="w-6 h-6" />
                            </div>
                            <span className="text-base font-extrabold block">Bride (Woman)</span>
                            <span className="text-[11px] opacity-75">Creating profile for herself / family</span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Name, Age, Height */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-[#560406]/10 text-[11px] font-black uppercase tracking-widest text-[#560406] mb-2">
                          STEP 2 · CANDIDATE VITALS
                        </span>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-editorial font-bold text-[#111111] leading-tight">
                          Personal Details & Vitals
                        </h1>
                        <p className="text-xs sm:text-sm text-[#777777] font-medium mt-1">
                          Accurate biodata details ensure high compatibility match scores.
                        </p>
                      </div>

                      <div className="space-y-4 pt-2">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                            Full Candidate Name <span className="text-red-500">*</span>:
                          </label>
                          <div className="relative flex items-center">
                            <User className="w-4 h-4 text-[#560406] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                              placeholder="Enter candidate full legal name"
                              className="w-full h-13 pl-11 pr-4 rounded-2xl bg-[#FBF9F4] border border-[#E8DDD0] text-sm font-bold text-[#111111] outline-none focus:border-[#560406] focus:bg-white shadow-2xs transition-all"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                              Age (Years) <span className="text-red-500">*</span>:
                            </label>
                            <div className="relative flex items-center">
                              <Calendar className="w-4 h-4 text-[#560406] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                              <input
                                type="number"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                min="18"
                                max="80"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="e.g. 28"
                                className="w-full h-13 pl-11 pr-4 rounded-2xl bg-[#FBF9F4] border border-[#E8DDD0] text-sm font-bold text-[#111111] outline-none focus:border-[#560406] focus:bg-white shadow-2xs transition-all"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                              Height <span className="text-red-500">*</span>:
                            </label>
                            <div className="relative flex items-center">
                              <Ruler className="w-4 h-4 text-[#560406] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                              <select
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                className="w-full h-13 pl-11 pr-10 rounded-2xl bg-[#FBF9F4] border border-[#E8DDD0] text-xs font-bold text-[#111111] outline-none focus:border-[#560406] focus:bg-white shadow-2xs cursor-pointer appearance-none transition-all"
                                required
                              >
                                <option value="" disabled>Select height</option>
                                {HEIGHT_OPTIONS.map((hOpt) => (
                                  <option key={hOpt} value={hOpt}>{hOpt}</option>
                                ))}
                              </select>
                              <ChevronDown className="w-4 h-4 text-[#888888] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Location, Religion & Sub-community */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-[#560406]/10 text-[11px] font-black uppercase tracking-widest text-[#560406] mb-2">
                          STEP 3 · CULTURAL ROOTS
                        </span>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-editorial font-bold text-[#111111] leading-tight">
                          Location & Background
                        </h1>
                        <p className="text-xs sm:text-sm text-[#777777] font-medium mt-1">
                          Where is the candidate settled and what are their cultural roots?
                        </p>
                      </div>

                      <div className="space-y-4 pt-2">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                            Settled City / Location <span className="text-red-500">*</span>:
                          </label>
                          <div className="relative flex items-center">
                            <MapPin className="w-4 h-4 text-[#560406] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <select
                              value={cityIsOther || (city && city !== 'Other' && !CITY_OPTIONS.includes(city)) ? 'other' : city}
                              onChange={(e) => {
                                if (e.target.value === 'other') {
                                  setCityIsOther(true);
                                  setCity('');
                                } else {
                                  setCityIsOther(false);
                                  setCity(e.target.value);
                                }
                              }}
                              className="w-full h-13 pl-11 pr-10 rounded-2xl bg-[#FBF9F4] border border-[#E8DDD0] text-xs font-bold text-[#111111] outline-none focus:border-[#560406] focus:bg-white shadow-2xs cursor-pointer appearance-none transition-all"
                              required
                            >
                              <option value="" disabled>Select settled city</option>
                              {CITY_OPTIONS.map((cityName) => (
                                <option key={cityName} value={cityName}>{cityName}</option>
                              ))}
                              <option value="other">Other / NRI City (Specify below)</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#888888] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>

                          {(cityIsOther || (city && city !== 'Other' && !CITY_OPTIONS.includes(city))) && (
                            <div className="relative flex items-center mt-3">
                              <MapPin className="w-4 h-4 text-[#560406] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                              <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Type city and country (e.g. Dubai, London, New York)"
                                className="w-full h-13 pl-11 pr-4 rounded-2xl bg-[#FBF9F4] border border-[#E8DDD0] text-sm font-bold text-[#111111] outline-none focus:border-[#560406] focus:bg-white shadow-2xs transition-all"
                                required
                              />
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                              Religion <span className="text-red-500">*</span>:
                            </label>
                            <div className="relative flex items-center">
                              <Compass className="w-4 h-4 text-[#560406] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                              <select
                                value={religion}
                                onChange={(e) => setReligion(e.target.value)}
                                className="w-full h-13 pl-11 pr-10 rounded-2xl bg-[#FBF9F4] border border-[#E8DDD0] text-xs font-bold text-[#111111] outline-none focus:border-[#560406] focus:bg-white shadow-2xs cursor-pointer appearance-none transition-all"
                                required
                              >
                                <option value="" disabled>Select religion</option>
                                <option value="Hindu">Hindu</option>
                                <option value="Muslim">Muslim</option>
                                <option value="Sikh">Sikh</option>
                                <option value="Christian">Christian</option>
                                <option value="Jain">Jain</option>
                                <option value="Parsi">Parsi</option>
                                <option value="Atheist">Atheist</option>
                                <option value="Agnostic">Agnostic</option>
                                <option value="Spiritual">Spiritual</option>
                                <option value="Buddhist">Buddhist</option>
                                <option value="Jewish">Jewish</option>
                                <option value="Other">Other</option>
                              </select>
                              <ChevronDown className="w-4 h-4 text-[#888888] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                              Community / Caste (Optional):
                            </label>
                            <div className="relative flex items-center">
                              <Users className="w-4 h-4 text-[#560406] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                              <input
                                type="text"
                                value={subCommunity}
                                onChange={(e) => setSubCommunity(e.target.value)}
                                placeholder="e.g. Brahmin, Agarwal, Khatri, Sunni"
                                className="w-full h-13 pl-11 pr-4 rounded-2xl bg-[#FBF9F4] border border-[#E8DDD0] text-xs font-bold text-[#111111] outline-none focus:border-[#560406] focus:bg-white shadow-2xs transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Education & Profession (Salaried vs Self-Employed) */}
                  {step === 4 && (
                    <div className="space-y-5">
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-[#560406]/10 text-[11px] font-black uppercase tracking-widest text-[#560406] mb-2">
                          STEP 4 · CAREER & PROFESSIONAL STANDING
                        </span>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-editorial font-bold text-[#111111] leading-tight">
                          Education & Profession
                        </h1>
                        <p className="text-xs sm:text-sm text-[#777777] font-medium mt-1">
                          Highlight credentials, employment structure, and professional domain.
                        </p>
                      </div>

                      <div className="space-y-4 pt-2">
                        {/* Salaried vs Self Employed Selector */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                            Employment Structure <span className="text-red-500">*</span>:
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={() => setEmploymentType('Salaried')}
                              className={`h-14 px-4 rounded-2xl border-2 text-center transition-all cursor-pointer flex items-center justify-center gap-3 ${
                                employmentType === 'Salaried'
                                  ? 'bg-[#2D2824] text-white border-[#560406] font-bold shadow-md'
                                  : 'bg-[#FBF9F4] text-[#555555] border-[#E8DDD0] hover:bg-[#F4EFE6]'
                              }`}
                            >
                              <Briefcase className="w-5 h-5 text-[#D8B486]" />
                              <div className="text-left">
                                <span className="text-xs font-extrabold block">Corporate / Salaried</span>
                                <span className="text-[10px] opacity-75">Employed at company or institution</span>
                              </div>
                            </motion.button>

                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={() => setEmploymentType('Self-Employed / Business')}
                              className={`h-14 px-4 rounded-2xl border-2 text-center transition-all cursor-pointer flex items-center justify-center gap-3 ${
                                employmentType === 'Self-Employed / Business'
                                  ? 'bg-[#2D2824] text-white border-[#560406] font-bold shadow-md'
                                  : 'bg-[#FBF9F4] text-[#555555] border-[#E8DDD0] hover:bg-[#F4EFE6]'
                              }`}
                            >
                              <Sparkles className="w-5 h-5 text-[#D8B486]" />
                              <div className="text-left">
                                <span className="text-xs font-extrabold block">Business / Self-Employed</span>
                                <span className="text-[10px] opacity-75">Founder, partner, or private practice</span>
                              </div>
                            </motion.button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                            Highest Qualification / Degree <span className="text-red-500">*</span>:
                          </label>
                          <div className="relative flex items-center">
                            <GraduationCap className="w-4 h-4 text-[#560406] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type="text"
                              value={education}
                              onChange={(e) => setEducation(e.target.value)}
                              placeholder="e.g. MBA (IIM / Harvard), B.Tech (IIT), MS, MD, CA"
                              className="w-full h-13 pl-11 pr-4 rounded-2xl bg-[#FBF9F4] border border-[#E8DDD0] text-sm font-bold text-[#111111] outline-none focus:border-[#560406] focus:bg-white shadow-2xs transition-all"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                              Profession / Designation <span className="text-red-500">*</span>:
                            </label>
                            <div className="relative flex items-center">
                              <Briefcase className="w-4 h-4 text-[#560406] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                              <input
                                type="text"
                                value={occupation}
                                onChange={(e) => setOccupation(e.target.value)}
                                placeholder="e.g. VP Strategy, Investment Banker, Surgeon"
                                className="w-full h-13 pl-11 pr-4 rounded-2xl bg-[#FBF9F4] border border-[#E8DDD0] text-xs font-bold text-[#111111] outline-none focus:border-[#560406] focus:bg-white shadow-2xs transition-all"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                              {employmentType === 'Salaried' ? 'Company / Employer *' : 'Business / Firm Name *'}:
                            </label>
                            <div className="relative flex items-center">
                              <Building2 className="w-4 h-4 text-[#560406] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                              <input
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder={employmentType === 'Salaried' ? 'e.g. McKinsey & Co, Google' : 'e.g. Apex Legal & Capital'}
                                className="w-full h-13 pl-11 pr-4 rounded-2xl bg-[#FBF9F4] border border-[#E8DDD0] text-xs font-bold text-[#111111] outline-none focus:border-[#560406] focus:bg-white shadow-2xs transition-all"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Income & Financial Stance */}
                  {step === 5 && (
                    <div className="space-y-5">
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-[#560406]/10 text-[11px] font-black uppercase tracking-widest text-[#560406] mb-2">
                          STEP 5 · FINANCIAL HARMONY & AFFLUENCE
                        </span>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-editorial font-bold text-[#111111] leading-tight">
                          Income Bracket & Money Values
                        </h1>
                        <p className="text-xs sm:text-sm text-[#777777] font-medium mt-1">
                          Financial alignment is one of the highest predictors of long-term compatibility.
                        </p>
                      </div>

                      <div className="space-y-4 pt-2">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                            Annual Income Bracket <span className="text-red-500">*</span>:
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {['₹5L - ₹10L', '₹10L - ₹15L', '₹15L - ₹25L', '₹25L - ₹35L', '₹35L - ₹50L', '₹50L+ HNI'].map((sal) => (
                              <motion.button
                                key={sal}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={() => setSalaryBracket(sal)}
                                className={`p-4 rounded-2xl border-2 text-xs font-extrabold transition-all cursor-pointer ${
                                  salaryBracket === sal
                                    ? 'bg-[#2D2824] text-white border-[#560406] shadow-md'
                                    : 'bg-[#FBF9F4] text-[#444444] border-[#E8DDD0] hover:bg-[#F4EFE6]'
                                }`}
                              >
                                {sal}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                            Financial Management Outlook <span className="text-red-500">*</span>:
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                              { id: 'Total Pooling', label: 'Joint Account Pooling', desc: '100% combined finances' },
                              { id: 'Hybrid Balance', label: 'Shared + Independent', desc: 'Joint household + personal savings' },
                              { id: 'Independent', label: 'Independent Finances', desc: 'Autonomous individual accounts' }
                            ].map((fin) => (
                              <motion.button
                                key={fin.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={() => setFinancialStance(fin.id)}
                                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                                  financialStance === fin.id
                                    ? 'bg-[#2D2824] text-white border-[#560406] shadow-md'
                                    : 'bg-[#FBF9F4] text-[#444444] border-[#E8DDD0] hover:bg-[#F4EFE6]'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-extrabold">{fin.label}</span>
                                  {financialStance === fin.id && <Check className="w-4 h-4 text-[#D8B486]" />}
                                </div>
                                <span className="text-[10px] opacity-75">{fin.desc}</span>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 6: Diet & Lifestyle */}
                  {step === 6 && (
                    <div className="space-y-5">
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-[#560406]/10 text-[11px] font-black uppercase tracking-widest text-[#560406] mb-2">
                          STEP 6 · LIFESTYLE & DIET
                        </span>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-editorial font-bold text-[#111111] leading-tight">
                          Diet & Daily Living
                        </h1>
                        <p className="text-xs sm:text-sm text-[#777777] font-medium mt-1">
                          Food preferences and daily habits define day-to-day household synergy.
                        </p>
                      </div>

                      <div className="space-y-4 pt-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                          Diet Preference <span className="text-red-500">*</span>:
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {['Veg', 'Eggetarian', 'Non-Veg', 'Vegan', 'Jain Veg'].map((d) => (
                            <motion.button
                              key={d}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={() => setDiet(d)}
                              className={`p-4 rounded-2xl border-2 text-xs font-extrabold transition-all cursor-pointer ${
                                diet === d
                                  ? 'bg-[#2D2824] text-white border-[#560406] shadow-md'
                                  : 'bg-[#FBF9F4] text-[#444444] border-[#E8DDD0] hover:bg-[#F4EFE6]'
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
                    <div className="space-y-5">
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-[#560406]/10 text-[11px] font-black uppercase tracking-widest text-[#560406] mb-2">
                          STEP 7 · FAMILY & CORE VALUES
                        </span>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-editorial font-bold text-[#111111] leading-tight">
                          Family Background & Values
                        </h1>
                        <p className="text-xs sm:text-sm text-[#777777] font-medium mt-1">
                          Understanding family structure and foundational philosophy.
                        </p>
                      </div>

                      <div className="space-y-4 pt-2">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                            Family Structure <span className="text-red-500">*</span>:
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {['Nuclear Family', 'Joint Family'].map((fam) => (
                              <motion.button
                                key={fam}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={() => setFamilyType(fam.replace(' Family', ''))}
                                className={`p-4 rounded-2xl border-2 text-xs font-extrabold transition-all cursor-pointer ${
                                  familyType === fam.replace(' Family', '')
                                    ? 'bg-[#2D2824] text-white border-[#560406] shadow-md'
                                    : 'bg-[#FBF9F4] text-[#444444] border-[#E8DDD0] hover:bg-[#F4EFE6]'
                                }`}
                              >
                                {fam}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                            Family Outlook & Values <span className="text-red-500">*</span>:
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                              { val: 'Traditional', desc: 'Grounded in heritage & rituals' },
                              { val: 'Moderate', desc: 'Balanced cultural harmony' },
                              { val: 'Progressive', desc: 'Modern egalitarian outlook' }
                            ].map((item) => (
                              <motion.button
                                key={item.val}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={() => setFamilyValues(item.val)}
                                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col gap-1 ${
                                  familyValues === item.val
                                    ? 'bg-[#2D2824] text-white border-[#560406] shadow-md'
                                    : 'bg-[#FBF9F4] text-[#444444] border-[#E8DDD0] hover:bg-[#F4EFE6]'
                                }`}
                              >
                                <span className="text-xs font-extrabold">{item.val}</span>
                                <span className="text-[10px] opacity-75">{item.desc}</span>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 8: Upload / Shoot Up to 3 Photos */}
                  {step === 8 && (
                    <div className="space-y-5">
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-[#560406]/10 text-[11px] font-black uppercase tracking-widest text-[#560406] mb-2">
                          STEP 8 · PHOTO PORTFOLIO
                        </span>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-editorial font-bold text-[#111111] leading-tight">
                          Select 1 to 3 High-Resolution Photos
                        </h1>
                        <p className="text-xs sm:text-sm text-[#777777] font-medium mt-1">
                          Photos are protected with BlurShield™ and only visible to verified matches.
                        </p>
                      </div>

                      {/* 3 Interactive Photo Slots */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        {[0, 1, 2].map((slotIdx) => {
                          const photoUrl = photos[slotIdx];
                          return (
                            <div key={slotIdx} className="relative aspect-3/4 sm:aspect-square">
                              {photoUrl ? (
                                <motion.div
                                  whileHover={{ scale: 1.02 }}
                                  className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-[#560406] bg-[#F4EFE6] shadow-sm group"
                                >
                                  <img src={photoUrl} alt={`Photo ${slotIdx + 1}`} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePhoto(slotIdx)}
                                    className="absolute top-2 right-2 p-1.5 rounded-full bg-[#2D2824]/80 hover:bg-red-600 text-white transition-colors cursor-pointer shadow"
                                    title="Remove Photo"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                  <span className="absolute bottom-2 left-2 bg-[#2D2824]/90 text-[#D8B486] text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                                    Photo #{slotIdx + 1}
                                  </span>
                                </motion.div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => photoFileInputRef.current?.click()}
                                  className="w-full h-full rounded-2xl border-2 border-dashed border-[#560406]/40 hover:border-[#560406] bg-[#FBF9F4] hover:bg-[#F4EFE6] flex flex-col items-center justify-center gap-2 text-[#777777] transition-all cursor-pointer p-4"
                                >
                                  <div className="w-10 h-10 rounded-full bg-white border border-[#E8DDD0] flex items-center justify-center text-[#560406]">
                                    <Plus className="w-5 h-5" />
                                  </div>
                                  <span className="text-xs font-extrabold text-[#111111]">Photo #{slotIdx + 1}</span>
                                  <span className="text-[10px] text-[#888888]">Click to upload</span>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Desktop Action Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => photoCameraInputRef.current?.click()}
                          className="p-4 rounded-2xl bg-[#2D2824] hover:bg-[#560406] text-white flex items-center justify-center gap-2.5 cursor-pointer transition-all shadow-md active:scale-98"
                        >
                          <Camera className="w-5 h-5 text-[#D8B486]" />
                          <span className="text-xs font-extrabold">Open Camera & Snap Photo</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => photoFileInputRef.current?.click()}
                          className="p-4 rounded-2xl bg-[#FBF9F4] hover:bg-[#F4EFE6] text-[#111111] border border-[#E8DDD0] flex items-center justify-center gap-2.5 cursor-pointer transition-all shadow-2xs active:scale-98"
                        >
                          <Upload className="w-5 h-5 text-[#560406]" />
                          <span className="text-xs font-extrabold">Upload Files from Device</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 9: Record / Upload 30s Video Intro */}
                  {step === 9 && (
                    <div className="space-y-5">
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-[#560406]/10 text-[11px] font-black uppercase tracking-widest text-[#560406] mb-2">
                          STEP 9 · 30-SECOND VIDEO INTRO
                        </span>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-editorial font-bold text-[#111111] leading-tight">
                          30-Second Authentic Video Intro
                        </h1>
                        <p className="text-xs sm:text-sm text-[#777777] font-medium mt-1">
                          A brief video showing personality and genuine voice builds 10x higher trust among families.
                        </p>
                      </div>

                      {/* Video Player Preview and Studio */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-2">
                        <div className="sm:col-span-6 flex flex-col items-center">
                          <div className="relative rounded-2xl overflow-hidden aspect-9/14 max-h-[300px] w-full max-w-[220px] bg-[#161412] border-2 border-[#560406] shadow-md">
                            {videoUrl ? (
                              <>
                                <video
                                  src={videoUrl}
                                  controls
                                  playsInline
                                  className={`w-full h-full object-cover ${isVideoMirrored ? 'scale-x-[-1]' : ''}`}
                                />
                                <div className="absolute top-2 right-2 bg-[#560406] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow flex items-center gap-1">
                                  <Volume2 className="w-3 h-3" />
                                  <span>Sound Active</span>
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 text-center">
                                <Camera className="w-8 h-8 text-[#D8B486]" />
                                <span className="text-xs font-extrabold text-white">No video uploaded</span>
                                <span className="text-[10px] text-[#A17B5E]">Record webcam or upload a video file</span>
                              </div>
                            )}
                          </div>

                          {videoUrl && (
                            <button
                              type="button"
                              onClick={() => setIsVideoMirrored(!isVideoMirrored)}
                              className="mt-3 py-1.5 px-3 rounded-full bg-white border border-[#E8DDD0] text-[#560406] hover:bg-[#F4EFE6] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                            >
                              <FlipHorizontal className="w-3.5 h-3.5" />
                              <span>{isVideoMirrored ? 'Mirrored (Click to Un-mirror)' : 'Normal (Click to Mirror)'}</span>
                            </button>
                          )}
                        </div>

                        {/* Video Actions */}
                        <div className="sm:col-span-6 space-y-3">
                          <button
                            type="button"
                            onClick={openWebcamRecorder}
                            className="w-full p-4 rounded-2xl bg-[#2D2824] hover:bg-[#560406] text-white flex items-center justify-center gap-3 cursor-pointer transition-all shadow-md active:scale-98"
                          >
                            <Camera className="w-5 h-5 text-[#D8B486]" />
                            <div className="text-left">
                              <span className="text-xs font-extrabold block">Record with Webcam / Camera</span>
                              <span className="text-[10px] text-[#D8B486]">Live 30-second video recording</span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => videoFileInputRef.current?.click()}
                            className="w-full p-4 rounded-2xl bg-[#FBF9F4] hover:bg-[#F4EFE6] text-[#111111] border border-[#E8DDD0] flex items-center justify-center gap-3 cursor-pointer transition-all shadow-2xs active:scale-98"
                          >
                            <Upload className="w-5 h-5 text-[#560406]" />
                            <div className="text-left">
                              <span className="text-xs font-extrabold block">Upload Video File</span>
                              <span className="text-[10px] text-[#777777]">MP4, MOV, or WebM from computer</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 10: Persona Reveal & Verification Card */}
                  {step === 10 && (
                    <div className="space-y-5">
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-black uppercase tracking-widest mb-2">
                          STEP 10 · MANNAT PERSONA READY
                        </span>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-editorial font-bold text-[#111111] leading-tight">
                          Review Your Verified Biodata
                        </h1>
                        <p className="text-xs sm:text-sm text-[#777777] font-medium mt-1">
                          Your profile has been formulated with our algorithm for executive matrimony.
                        </p>
                      </div>

                      {/* Generated Persona Badge Card */}
                      <motion.div
                        initial={{ scale: 0.96, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                        className="bg-gradient-to-br from-[#FAF8F5] to-[#F4EFE6] border-2 border-[#560406]/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-md text-left"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="text-xs font-black uppercase tracking-wider bg-[#560406] text-[#F5E6D3] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                            <Sparkles className="w-3.5 h-3.5 text-[#D8B486]" />
                            <span>98% MQS MATCH COMPATIBILITY</span>
                          </span>
                          <span className="text-xs font-extrabold text-[#560406]">
                            Persona: {getGeneratedPersonaTitle()}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-2xl font-serif-editorial font-bold text-[#111111]">
                            {displayName || 'Candidate Name'}, {age} yrs
                          </h3>
                          <p className="text-xs text-[#6E6259] font-bold mt-0.5">
                            {occupation} ({employmentType}) · {city} · {religion} {subCommunity ? `(${subCommunity})` : ''}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-[#E8DDD0] text-xs">
                          <div className="flex items-center justify-between py-1 border-b sm:border-b-0 sm:border-r border-[#E8DDD0] sm:pr-3">
                            <span className="text-[#777777] font-bold">Employment:</span>
                            <span className="font-extrabold text-[#111111] truncate">{employmentType} · {companyName}</span>
                          </div>
                          <div className="flex items-center justify-between py-1 sm:pl-3">
                            <span className="text-[#777777] font-bold">Annual Income:</span>
                            <span className="font-extrabold text-[#111111]">{salaryBracket}</span>
                          </div>
                          <div className="flex items-center justify-between py-1 border-b sm:border-b-0 sm:border-r border-[#E8DDD0] sm:pr-3">
                            <span className="text-[#777777] font-bold">Financial Stance:</span>
                            <span className="font-extrabold text-[#111111]">{financialStance}</span>
                          </div>
                          <div className="flex items-center justify-between py-1 sm:pl-3">
                            <span className="text-[#777777] font-bold">Diet:</span>
                            <span className="font-extrabold text-[#111111]">{diet}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 text-xs text-emerald-800 bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                          <span>BlurShield™ privacy applied. Ready for curated matrimonial discovery.</span>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Validation Error Alert */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="my-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2.5 shadow-xs"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* Bottom Form Navigation Controls */}
            <div className="w-full pt-6 border-t border-[#E8DDD0] flex items-center justify-between gap-4 mt-8">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="py-3.5 px-6 rounded-2xl bg-[#FBF9F4] border border-[#E8DDD0] hover:bg-[#F4EFE6] text-xs font-bold text-[#161412] flex items-center gap-2 transition-all cursor-pointer active:scale-98 shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4 text-[#560406]" />
                  <span>Previous Step</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleNext}
                className="py-4 px-8 rounded-2xl bg-gradient-to-r from-[#730C0F] via-[#560406] to-[#3A0204] hover:brightness-110 text-xs font-extrabold text-[#F5E6D3] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98 border border-[#A17B5E]/40"
              >
                {step === totalSteps ? (
                  <>
                    <Sparkles className="w-4 h-4 text-[#D8B486]" />
                    <span>{isSubmitting ? 'Submitting Biodata...' : isEditing ? 'Save & Update Biodata' : 'Complete Onboarding & Enter Mannat'}</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Step {step + 1}</span>
                    <ArrowRight className="w-4 h-4 text-[#D8B486]" />
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Live Webcam Recording Modal */}
      {isRecordingModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#161412]/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#221F1C] rounded-3xl p-6 text-white border border-[#560406] space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={closeWebcamRecorder}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-serif-editorial font-bold text-center text-[#D8B486]">
              Record 30s Video Intro
            </h3>

            {/* Live Camera Viewfinder */}
            <div className="relative aspect-9/14 max-h-[380px] w-full bg-black rounded-2xl overflow-hidden border border-white/20 mx-auto">
              <video
                ref={liveVideoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover ${isCameraMirrored ? 'scale-x-[-1]' : ''}`}
              />

              {/* Viewfinder Flip Button */}
              {!isRecording && (
                <button
                  type="button"
                  onClick={() => setIsCameraMirrored(!isCameraMirrored)}
                  className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow hover:bg-black/90 cursor-pointer border border-white/20"
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                  <span>{isCameraMirrored ? 'Mirrored' : 'Normal'}</span>
                </button>
              )}

              {/* Recording Indicator & Timer */}
              {isRecording && (
                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse shadow">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span>REC {30 - recordingSeconds}s remaining</span>
                </div>
              )}
            </div>

            {/* Camera Controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
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
    </div>
  );
};
