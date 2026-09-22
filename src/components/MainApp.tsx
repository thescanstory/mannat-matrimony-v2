import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Home, Heart, User, SlidersHorizontal, ArrowLeft, Eye, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Profile, FilterCriteria, PrivacySettings } from '../types';
import { InstaVibeFeed } from './InstaVibeFeed';
import { ProfileScreen } from './ProfileScreen';
import { ConnectionsScreen } from './ConnectionsScreen';
import { OnboardingCarousel } from './OnboardingCarousel';
import { SearchFiltersModal } from './SearchFiltersModal';
import { PrivacySettingsModal } from './PrivacySettingsModal';
import { PaywallModal } from './PaywallModal';
import { FamilySharePortal } from './FamilySharePortal';
import { WhoViewedMeScreen } from './WhoViewedMeScreen';
import { Toast } from './Toast';
import { SplashScreen } from './SplashScreen';
import { AuthScreen } from './AuthScreen';
import { profileService, INITIAL_CURATED_PROFILES } from '../services/profileService';
import { authService, type UserSession } from '../services/authService';
import { nativeService } from '../services/nativeService';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

type ViewType = 'splash' | 'auth' | 'home' | 'for-you' | 'connections' | 'share-portal' | 'profile' | 'onboarding';

export const MainApp: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('mannat_admin_deleted') === 'true') {
        return [];
      }
      return INITIAL_CURATED_PROFILES;
    } catch {
      return INITIAL_CURATED_PROFILES;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const stored = localStorage.getItem('mannat_active_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [currentView, setCurrentView] = useState<ViewType>(() => {
    try {
      if (typeof window !== 'undefined' && !window.location.search.includes('splash=true')) {
        return 'home';
      }
      return 'home';
    } catch {
      return 'home';
    }
  });

  // Navigation History Stack & Slide Direction
  const [history, setHistory] = useState<ViewType[]>(['home']);
  const [slideDirection, setSlideDirection] = useState<number>(1);

  const navigateTo = useCallback((view: ViewType) => {
    nativeService.haptic.light();
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    if (view === currentView) return;
    setHistory((prev) => [...prev, currentView]);
    setSlideDirection(1);
    setCurrentView(view);
  }, [currentView]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [currentView]);

  const goBack = useCallback(() => {
    nativeService.haptic.light();
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    if (history.length > 0) {
      const prevView = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setSlideDirection(-1);
      setCurrentView(prevView);
    } else if (currentView !== 'home' && currentView !== 'auth') {
      setSlideDirection(-1);
      setCurrentView('home');
    }
  }, [history, currentView]);

  // Touch Swipe Gesture for iOS-style slide-back
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    if (deltaX > 65 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5 && (currentView !== 'home' && currentView !== 'auth')) {
      goBack();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const [shareProfile, setShareProfile] = useState<Profile | null>(null);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [isParentView, setIsParentView] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterCriteria | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'heart' | 'sparkle'>('success');
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    photo_privacy: 'visible_to_everyone',
    profile_visibility: 'visible_in_discovery',
    financial_privacy: 'show_verified_badge'
  });

  // Determine active logged-in user profile strictly from verified live profiles
  const activeUserProfile = useMemo(() => {
    if (!currentUser) return null;
    const found = profiles.find((p) => 
      p.user_id === currentUser.id || 
      p.id === currentUser.id ||
      ((p.lifestyle_details as any)?.user_id === currentUser.id)
    );
    return found || null;
  }, [currentUser, profiles]);

  const triggerToast = (msg: string, type: 'success' | 'heart' | 'sparkle' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setCurrentUser(null);
      setCurrentView('auth');
      triggerToast('Logged out successfully', 'success');
    } catch {
      setCurrentUser(null);
      setCurrentView('auth');
      triggerToast('Logged out', 'success');
    }
  };

  const handleDeleteAllData = async () => {
    try {
      if (currentUser?.id) {
        await profileService.deleteProfile(currentUser.id, currentUser.email);
      }
      if (typeof window !== 'undefined') {
        localStorage.clear();
        localStorage.setItem('mannat_logged_out', 'true');
      }
      await authService.signOut();
      setCurrentUser(null);
      setProfiles([]);
      setActiveFilters(null);
      setCurrentView('auth');
      triggerToast('All candidate profile data and session reset. 🗑️', 'success');
    } catch {
      setCurrentUser(null);
      setCurrentView('auth');
    }
  };

  const handleSplashComplete = useCallback(() => {
    try {
      const stored = localStorage.getItem('mannat_active_user');
      setCurrentView(stored ? 'home' : 'auth');
    } catch {
      setCurrentView('auth');
    }
  }, []);

  // Check and restore active user session (including Apple & Google OAuth hash redirect)
  useEffect(() => {
    async function checkUserSession() {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          const hasProfile = await profileService.hasExistingProfile(user.id, user.email);
          if (hasProfile) {
            setCurrentView((prev) => (prev === 'auth' || prev === 'onboarding' ? 'home' : prev));
          } else {
            // Profile was deleted in cloud DB -> clear local storage & navigate to onboarding
            localStorage.removeItem('mannat_user_profile');
            localStorage.removeItem('mannat_custom_profiles');
            setCurrentView((prev) => (prev === 'auth' ? 'onboarding' : prev === 'home' || prev === 'profile' ? 'onboarding' : prev));
          }
        }
      } catch (err) {
        console.warn('Error checking user session:', err);
      }
    }
    checkUserSession();

    const authListener = authService.onAuthStateChange(async (user) => {
      if (user) {
        setCurrentUser(user);
        const hasProfile = await profileService.hasExistingProfile(user.id, user.email);
        if (!hasProfile) {
          localStorage.removeItem('mannat_user_profile');
          localStorage.removeItem('mannat_custom_profiles');
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem('mannat_user_profile');
        localStorage.removeItem('mannat_custom_profiles');
        setCurrentView('auth');
      }
    });

    return () => {
      authListener?.data?.subscription?.unsubscribe();
    };
  }, []);

  // Fetch initial profiles from Supabase Database on mount
  useEffect(() => {
    async function loadProfiles() {
      try {
        const liveProfiles = await profileService.getProfiles();
        setProfiles(liveProfiles);

        if (currentUser) {
          const myProfile = liveProfiles.find(
            (p) => p.user_id === currentUser.id || p.id === currentUser.id || ((p.lifestyle_details as any)?.user_id === currentUser.id)
          );
          if (!myProfile) {
            localStorage.removeItem('mannat_user_profile');
            localStorage.removeItem('mannat_custom_profiles');
            if (currentUser.id) localStorage.removeItem('mannat_onboarded_' + currentUser.id);
            if (currentUser.email) localStorage.removeItem('mannat_onboarded_' + currentUser.email.toLowerCase());
            setCurrentView((prev) => (prev === 'splash' || prev === 'auth' ? prev : 'onboarding'));
          }
        }
      } catch (err) {
        console.warn('Error loading profiles:', err);
      }
    }
    loadProfiles();
  }, [currentUser]);

  // Realtime Supabase Database Listener: Listen for Admin Deletions & Updates live
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const channel = supabase
      .channel('user_app_live_db_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, async (payload) => {
        if (payload.eventType === 'DELETE') {
          const deletedId = (payload.old as any)?.id;
          const deletedUserId = (payload.old as any)?.user_id;

          // Check if deleted candidate profile belongs to currently active user
          const isCurrentActiveUser = 
            (deletedId && (deletedId === activeUserProfile?.id || (currentUser && deletedId === currentUser.id))) ||
            (deletedUserId && currentUser && deletedUserId === currentUser.id);

          if (isCurrentActiveUser) {
            localStorage.removeItem('mannat_user_profile');
            localStorage.removeItem('mannat_custom_profiles');
            if (currentUser?.id) localStorage.removeItem('mannat_onboarded_' + currentUser.id);
            if (currentUser?.email) localStorage.removeItem('mannat_onboarded_' + currentUser.email.toLowerCase());
            setCurrentView('onboarding');
            triggerToast('Your candidate profile was removed by administrator. Please complete onboarding.', 'sparkle');
          }

          // Remove the deleted profile from active feed immediately
          setProfiles((prev) => prev.filter((p) => p.id !== deletedId && (!deletedUserId || p.user_id !== deletedUserId)));
        } else if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const liveProfiles = await profileService.getProfiles();
          setProfiles(liveProfiles);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, activeUserProfile]);

  const filteredProfiles = useMemo(() => {
    let userGender: string | null = null;
    let userProfileId: string | null = null;

    if (currentUser && profiles.length > 0) {
      const myProfile = profiles.find(
        (p) => p.user_id === currentUser.id || p.id === currentUser.id
      );
      if (myProfile) {
        userGender = myProfile.gender || null;
        userProfileId = myProfile.id;
      }
    }

    const genderFiltered = profiles.filter((p) => {
      if (currentUser && (p.user_id === currentUser.id || p.id === currentUser.id)) {
        return false;
      }
      if (userProfileId && p.id === userProfileId) {
        return false;
      }
      if (userGender === 'male') return p.gender === 'female';
      if (userGender === 'female') return p.gender === 'male';
      return true;
    });

    if (!activeFilters) return genderFiltered;

    return genderFiltered.filter((p) => {
      // Age filter
      if (p.age && (p.age < activeFilters.ageMin || p.age > activeFilters.ageMax)) {
        return false;
      }
      // Religion filter
      if (
        activeFilters.selectedReligion &&
        activeFilters.selectedReligion.length > 0 &&
        p.religion &&
        !activeFilters.selectedReligion.includes(p.religion)
      ) {
        return false;
      }
      // Sub-community / Caste filter
      if (
        activeFilters.selectedSubCommunity &&
        activeFilters.selectedSubCommunity.length > 0 &&
        (p.sub_community || p.community) &&
        !activeFilters.selectedSubCommunity.some(
          (c) =>
            c.includes('No Bar') ||
            c.includes('Open') ||
            p.sub_community === c ||
            p.community === c
        )
      ) {
        return false;
      }
      return true;
    });
  }, [profiles, activeFilters, currentUser]);

  const handleUnlockSuccess = (profileId: string) => {
    try {
      const stored = localStorage.getItem('mannat_unlocked_ids');
      const list: string[] = stored ? JSON.parse(stored) : [];
      if (!list.includes(profileId)) {
        list.push(profileId);
        localStorage.setItem('mannat_unlocked_ids', JSON.stringify(list));
      }
    } catch (e) {
      console.warn('Error persisting unlock state:', e);
    }
    setProfiles((prev) =>
      prev.map((p) => (p.id === profileId ? { ...p, is_unlocked: true } : p))
    );
    triggerToast('🔓 Bio-Data Unlocked! Full details now accessible.', 'sparkle');
  };

  const handleOpenSharePortal = (profile: Profile) => {
    setShareProfile(profile);
    navigateTo('share-portal');
  };

  const handleProfileCreated = (newProfile?: Profile) => {
    if (newProfile) {
      setProfiles((prev) => [newProfile, ...prev.filter(p => p.id !== newProfile.id && p.user_id !== newProfile.user_id)]);
      profileService.getProfiles().then((liveProfiles) => {
        if (liveProfiles && liveProfiles.length > 0) {
          setProfiles(liveProfiles);
        }
      }).catch(() => {});
    }
    if (isEditingProfile) {
      setIsEditingProfile(false);
      navigateTo('profile');
      triggerToast('Bio-data updated successfully! ✨', 'sparkle');
    } else {
      navigateTo('home');
      triggerToast(newProfile ? `🎉 Welcome, ${newProfile.display_name}!` : 'Welcome to Mannat ✨', 'sparkle');
    }
  };

  const handleUpdateProfile = async (updated: Profile) => {
    try {
      await profileService.createProfile(updated);
      setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      triggerToast('Candidate bio-data updated successfully! ✨', 'sparkle');
    } catch {
      triggerToast('Bio-data updated', 'success');
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0
    })
  };

  if (currentView === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`min-h-[100dvh] bg-[#F8F6F2] text-[#161412] flex flex-col items-center justify-start p-0 font-sans select-none relative overflow-x-hidden ${isParentView ? 'text-lg font-bold' : ''}`}
    >
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />

      {/* Main Responsive Web App Container */}
      <div className="w-full max-w-7xl mx-auto flex-1 min-h-[100dvh] bg-[#F8F6F2] flex flex-col relative">
        
        {/* Luxury Fixed App Header (Responsive for Mobile & Desktop Web) */}
        {currentView !== 'auth' && currentView !== 'onboarding' && (
          <header className="fixed top-0 inset-x-0 w-full bg-[#F8F6F2]/98 backdrop-blur-xl border-b border-[#E8DDD0] z-40 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
              
              {/* Left Brand Lockup & Mobile Back */}
              <div className="flex items-center gap-3 shrink-0">
                {currentView !== 'home' && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#560406] hover:text-[#730C0F] transition-all px-3 py-1.5 rounded-full bg-white border border-[#E8DDD0] active:scale-95 cursor-pointer shadow-xs"
                    title="Go Back"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-[#560406]" />
                    <span className="text-[11px] font-extrabold hidden sm:inline">Back</span>
                  </button>
                )}

                <a href="/" className="flex items-center gap-2.5 group">
                  <img
                    src="/images/mannat-logo-square.png"
                    alt="Mannat"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover shadow-sm ring-1 ring-[#560406]/20 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex flex-col text-left">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs italic text-[#560406] leading-none" style={{ fontFamily: "'Pinyon Script', cursive" }}>At</span>
                      <span className="text-lg sm:text-2xl font-normal tracking-[0.2em] uppercase text-[#560406] group-hover:text-[#730C0F] transition-colors leading-tight" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}>
                        MANNAT
                      </span>
                    </div>
                    <span className="hidden md:inline text-[7px] uppercase tracking-[0.3em] font-bold text-[#A17B5E] -mt-0.5">
                      Bespoke Matchmaking
                    </span>
                  </div>
                </a>
              </div>

              {/* Center Desktop Navigation Tabs */}
              <nav className="hidden md:flex items-center gap-1.5 bg-white/80 p-1 rounded-full border border-[#E8DDD0] shadow-xs">
                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    currentView === 'home'
                      ? 'bg-[#560406] text-[#F5E6D3] shadow-xs'
                      : 'text-[#6E6259] hover:text-[#560406] hover:bg-neutral-100/60'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Discover Feed</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('for-you')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    currentView === 'for-you'
                      ? 'bg-[#560406] text-[#F5E6D3] shadow-xs'
                      : 'text-[#6E6259] hover:text-[#560406] hover:bg-neutral-100/60'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>For You</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('connections')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    currentView === 'connections'
                      ? 'bg-[#560406] text-[#F5E6D3] shadow-xs'
                      : 'text-[#6E6259] hover:text-[#560406] hover:bg-neutral-100/60'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Alliances</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('profile')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    currentView === 'profile'
                      ? 'bg-[#560406] text-[#F5E6D3] shadow-xs'
                      : 'text-[#6E6259] hover:text-[#560406] hover:bg-neutral-100/60'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>My Profile</span>
                </button>
              </nav>

              {/* Right Action Tools */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowFiltersModal(true)}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-white hover:bg-neutral-50 text-[#560406] transition-colors border border-[#E8DDD0] cursor-pointer shadow-xs text-xs font-bold"
                  title="Search Filters"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#560406]" />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFilters && (
                    <span className="w-2 h-2 rounded-full bg-[#560406]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowPaywallModal(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-[#730C0F] to-[#560406] hover:brightness-110 text-[#F5E6D3] text-xs font-bold transition shadow-xs cursor-pointer border border-[#A17B5E]/40"
                >
                  <Crown className="w-3.5 h-3.5 text-[#D8B486]" />
                  <span>VIP Memberships</span>
                </button>

                <a
                  href="https://apps.apple.com/app/id6812288373"
                  target="_blank"
                  rel="noreferrer"
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black hover:bg-neutral-900 text-white text-[11px] font-bold transition border border-white/20 shadow-xs"
                >
                  <svg className="w-3 h-3 fill-current shrink-0" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.59-7.71-11.72-14.01-6.42-9.79-11.48-20.76-15.17-32.91-3.69-12.16-5.54-23.77-5.54-34.84 0-14.45 3.63-26.47 10.9-36.06 7.27-9.59 16.51-14.44 27.71-14.56 4.91 0 10.42 1.34 16.53 4.02 6.11 2.68 10.15 4.02 12.11 4.02 1.63 0 5.86-1.4 12.69-4.2 6.83-2.8 12.71-4.04 17.65-3.73 13.06.66 23.36 5.62 30.9 14.89-11.54 6.96-17.19 16.64-16.96 29.04.22 9.68 3.86 17.81 10.93 24.39 7.07 6.58 15.46 10.22 25.17 10.92-2.18 6.53-4.8 12.87-7.85 19.01zM119.22 33.64c0-7.39 2.66-14.17 7.99-20.33 5.33-6.17 11.95-10.15 19.86-11.94 1.09 7.61-1.2 14.7-6.87 21.27-5.67 6.57-12.66 10.57-20.98 12-.02-.33-.04-.67-.04-1z" />
                  </svg>
                  <span>iOS App</span>
                </a>
              </div>

            </div>
          </header>
        )}

        {/* View Routing & Dynamic View Transitions */}
        <main className={`flex-1 w-full flex flex-col justify-start relative overflow-x-hidden ${currentView !== 'auth' && currentView !== 'onboarding' ? 'pt-[calc(env(safe-area-inset-top)+4.5rem)] sm:pt-24' : ''}`}>
          <AnimatePresence mode="wait" custom={slideDirection}>
            <motion.div
              key={currentView}
              custom={slideDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="flex-1 w-full flex flex-col justify-start"
            >
              {/* Auth View */}
              {currentView === 'auth' && (
                <AuthScreen 
                  onLoginSuccess={async (user) => {
                    const activeUser = user || currentUser;
                    if (activeUser) {
                      setCurrentUser(activeUser);
                      const hasProfile = await profileService.hasExistingProfile(activeUser.id, activeUser.email);
                      navigateTo(hasProfile ? 'home' : 'onboarding');
                    } else {
                      navigateTo('onboarding');
                    }
                  }}
                  onOpenLanding={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = '/';
                    }
                  }}
                />
              )}

              {/* Onboarding View */}
              {currentView === 'onboarding' && (
                <OnboardingCarousel
                  onComplete={handleProfileCreated}
                  currentUser={currentUser}
                  initialData={isEditingProfile ? activeUserProfile : null}
                  isEditing={isEditingProfile}
                  onCancel={() => {
                    setIsEditingProfile(false);
                    navigateTo('profile');
                  }}
                />
              )}

              {/* Main Feed */}
              {currentView === 'home' && (
                <InstaVibeFeed
                  profiles={filteredProfiles}
                  onOpenFilters={() => setShowFiltersModal(true)}
                  onOpenSharePortal={handleOpenSharePortal}
                  onOpenPaywall={() => setShowPaywallModal(true)}
                  onOpenCreateProfile={() => navigateTo('onboarding')}
                  onUnlockSuccess={handleUnlockSuccess}
                />
              )}

              {/* For You / Who Viewed Me */}
              {currentView === 'for-you' && (
                <WhoViewedMeScreen
                  profiles={filteredProfiles}
                  onOpenPaywall={() => setShowPaywallModal(true)}
                  onOpenProfile={handleOpenSharePortal}
                />
              )}

              {/* Connections */}
              {currentView === 'connections' && (
                <ConnectionsScreen
                  profiles={filteredProfiles}
                  onOpenProfile={(p) => {
                    setShareProfile(p);
                    navigateTo('share-portal');
                  }}
                  onOpenFilters={() => setShowFiltersModal(true)}
                />
              )}

              {/* Family Share */}
              {currentView === 'share-portal' && (
                <FamilySharePortal
                  profile={shareProfile || profiles[0]}
                  onBackToFeed={goBack}
                />
              )}

              {/* Profile View */}
              {currentView === 'profile' && (
                <ProfileScreen
                  currentUser={currentUser}
                  candidateProfile={activeUserProfile}
                  privacySettings={privacySettings}
                  isParentView={isParentView}
                  onToggleParentView={() => {
                    setIsParentView(!isParentView);
                    triggerToast(
                      !isParentView ? 'Parent Mode Activated 👨‍👩‍👧 Large Text & Extra Guidance' : 'Switched back to Candidate Mode',
                      'sparkle'
                    );
                  }}
                  onOpenPrivacySettings={() => setShowPrivacyModal(true)}
                  onOpenPaywall={() => setShowPaywallModal(true)}
                  onEditBioData={() => {
                    setIsEditingProfile(true);
                    navigateTo('onboarding');
                  }}
                  onUpdateProfile={handleUpdateProfile}
                  onOpenAuth={() => navigateTo('auth')}
                  onLogout={handleLogout}
                  onDeleteAllData={handleDeleteAllData}
                  onUpdateUser={(updated) => {
                    setCurrentUser(updated);
                    triggerToast('Profile account updated! ✨', 'sparkle');
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Modals */}
      <SearchFiltersModal
        isOpen={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        onApply={(filters) => {
          setActiveFilters(filters);
          triggerToast('Filters Applied! ✨', 'sparkle');
        }}
        initialFilters={activeFilters || undefined}
        onReset={() => {
          setActiveFilters(null);
          triggerToast('Filters reset to default', 'success');
        }}
      />

      <PrivacySettingsModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        initialSettings={privacySettings}
        currentUser={currentUser}
        onLogout={handleLogout}
        onSave={(settings) => {
          setPrivacySettings(settings);
          triggerToast('Privacy preferences updated!', 'success');
        }}
      />

      <PaywallModal
        isOpen={showPaywallModal}
        onClose={() => setShowPaywallModal(false)}
        onSelectTier={(tier) => triggerToast(`Upgraded to Mannat ${tier.toUpperCase()} Membership! 👑`, 'sparkle')}
      />

      {/* Ultra-Luxury Frosted Floating Bottom Dock Navigation Bar (Mobile Only - Desktop uses Top Header Nav) */}
      {(currentView === 'home' || currentView === 'for-you' || currentView === 'connections' || currentView === 'profile') && !showFiltersModal && !showPrivacyModal && !showPaywallModal && (
        <div className="md:hidden fixed bottom-[max(0.75rem,calc(env(safe-area-inset-bottom)+0.25rem))] left-1/2 -translate-x-1/2 w-[90%] max-w-xs glass-dock-vara rounded-full z-40 px-2 py-1.5 flex items-center justify-around shadow-xl border border-[#E8DDD0]/80">
          {[
            { id: 'home', label: 'Discover', icon: Home },
            { id: 'for-you', label: 'For You', icon: Eye },
            { id: 'connections', label: 'Alliances', icon: Heart },
            { id: 'profile', label: 'Profile', icon: User }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateTo(item.id as ViewType)}
                className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-full transition-all cursor-pointer active:scale-95 ${
                  isActive
                    ? 'text-[#560406] bg-[#560406]/10 font-bold'
                    : 'text-[#6E6259] hover:text-[#560406] font-medium'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-transform ${isActive ? 'scale-110 text-[#560406]' : ''}`} />
                <span className="text-[9.5px] tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
