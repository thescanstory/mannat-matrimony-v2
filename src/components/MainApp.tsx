import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Home, Heart, User, SlidersHorizontal, ArrowLeft, Eye } from 'lucide-react';
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
import { profileService } from '../services/profileService';
import { authService, type UserSession } from '../services/authService';
import { nativeService } from '../services/nativeService';

type ViewType = 'splash' | 'auth' | 'home' | 'for-you' | 'connections' | 'share-portal' | 'profile' | 'onboarding';

export const MainApp: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('mannat_admin_deleted') === 'true') {
        return [];
      }
      return [];
    } catch {
      return [];
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
      const stored = localStorage.getItem('mannat_active_user');
      return stored ? 'splash' : 'splash';
    } catch {
      return 'splash';
    }
  });

  // Navigation History Stack & Slide Direction
  const [history, setHistory] = useState<ViewType[]>(['home']);
  const [slideDirection, setSlideDirection] = useState<number>(1);

  const navigateTo = useCallback((view: ViewType) => {
    if (view === currentView) return;
    nativeService.haptic.selection();
    setHistory((prev) => [...prev, currentView]);
    setSlideDirection(1);
    setCurrentView(view);
  }, [currentView]);

  const goBack = useCallback(() => {
    nativeService.haptic.selection();
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

  // Determine active logged-in user profile
  const activeUserProfile = useMemo(() => {
    if (!currentUser) return null;
    const found = profiles.find((p) => p.user_id === currentUser.id || p.id === currentUser.id);
    if (found) return found;

    try {
      const stored = localStorage.getItem('mannat_custom_profiles');
      if (stored) {
        const list: Profile[] = JSON.parse(stored);
        if (list.length > 0) return list[0];
      }
    } catch {}
    return null;
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
        await profileService.deleteProfile(currentUser.id);
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
          setCurrentView('home');
        }
      } catch (err) {
        console.warn('Error checking user session:', err);
      }
    }
    checkUserSession();

    const authListener = authService.onAuthStateChange((user) => {
      if (user) {
        setCurrentUser(user);
        setCurrentView('home');
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
        if (liveProfiles && liveProfiles.length > 0) {
          setProfiles(liveProfiles);
        }
      } catch (err) {
        console.warn('Error loading profiles:', err);
      }
    }
    loadProfiles();
  }, []);

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
    return genderFiltered;
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

  const handleProfileCreated = async (newProfile?: Profile) => {
    if (newProfile) {
      try {
        const liveProfiles = await profileService.getProfiles();
        if (liveProfiles && liveProfiles.length > 0) {
          setProfiles(liveProfiles);
        }
      } catch {
        setProfiles((prev) => [newProfile, ...prev]);
      }
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

      {/* Main Responsive Mobile App Container */}
      <div className="w-full max-w-md mx-auto flex-1 min-h-[100dvh] bg-[#F8F6F2] flex flex-col relative">
        
        {/* Luxury App Header */}
        {currentView !== 'auth' && currentView !== 'onboarding' && (
          <header className="w-full bg-[#F8F6F2]/95 backdrop-blur-xl border-b border-[#E8DDD0] px-5 pt-[max(1.25rem,calc(env(safe-area-inset-top)+0.5rem))] pb-3.5 z-40 sticky top-0 shadow-xs flex items-center justify-between">
            <div className="w-16 flex items-center justify-start">
              {currentView !== 'home' && (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#560406] hover:text-[#730C0F] transition-all px-3 py-1.5 rounded-full bg-white border border-[#E8DDD0] active:scale-95 cursor-pointer shadow-xs"
                  title="Go Back"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#560406]" />
                  <span className="text-[11px] font-extrabold">Back</span>
                </button>
              )}
            </div>

            {/* Brand Typographic Lockup */}
            <div className="flex flex-col items-center">
              <span className="text-xs italic font-normal text-[#560406] -mb-1 leading-none" style={{ fontFamily: "'Pinyon Script', cursive" }}>At</span>
              <span className="text-xl font-normal tracking-[0.24em] uppercase text-[#560406] leading-tight" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}>
                MANNAT
              </span>
            </div>

            <div className="w-16 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowFiltersModal(true)}
                className="p-2.5 rounded-full hover:bg-white text-[#560406] transition-colors border border-[#E8DDD0] cursor-pointer shadow-xs bg-white/80"
                title="Search Filters"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#560406]" />
              </button>
            </div>
          </header>
        )}

        {/* View Routing & Dynamic View Transitions */}
        <main className="flex-1 w-full flex flex-col justify-start relative overflow-x-hidden">
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
                  onLoginSuccess={(user) => {
                    const activeUser = user || currentUser;
                    if (activeUser) {
                      setCurrentUser(activeUser);
                      navigateTo('home');
                    } else {
                      navigateTo('home');
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
                  candidateProfile={activeUserProfile || profiles[0]}
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

      {/* Ultra-Luxury Frosted Floating Bottom Dock Navigation Bar */}
      {(currentView === 'home' || currentView === 'for-you' || currentView === 'connections' || currentView === 'profile') && (
        <div className="fixed bottom-[max(1rem,calc(env(safe-area-inset-bottom)+0.5rem))] left-1/2 -translate-x-1/2 w-[92%] max-w-sm glass-dock-vara rounded-full z-50 px-3.5 py-2 flex items-center justify-around shadow-2xl border border-[#E8DDD0]">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-full transition-all cursor-pointer ${
              currentView === 'home' 
                ? 'text-[#560406] bg-white shadow-sm scale-105 font-bold' 
                : 'text-[#6E6259] hover:text-[#560406] font-semibold'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">Discover</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('for-you')}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-full transition-all cursor-pointer ${
              currentView === 'for-you' 
                ? 'text-[#560406] bg-white shadow-sm scale-105 font-bold' 
                : 'text-[#6E6259] hover:text-[#560406] font-semibold'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">For You</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('connections')}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-full transition-all cursor-pointer ${
              currentView === 'connections' 
                ? 'text-[#560406] bg-white shadow-sm scale-105 font-bold' 
                : 'text-[#6E6259] hover:text-[#560406] font-semibold'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">Alliances</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('profile')}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-full transition-all cursor-pointer ${
              currentView === 'profile' 
                ? 'text-[#560406] bg-white shadow-sm scale-105 font-bold' 
                : 'text-[#6E6259] hover:text-[#560406] font-semibold'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">Profile</span>
          </button>
        </div>
      )}
    </div>
  );
};
