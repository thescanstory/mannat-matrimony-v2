import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_PROFILES } from './services/mockData';
import { profileService } from './services/profileService';
import { authService } from './services/authService';
import type { UserSession } from './services/authService';
import type { Profile, PrivacySettings, FilterCriteria } from './types';
import { InstaVibeFeed } from './components/InstaVibeFeed';
import { ConnectionsScreen } from './components/ConnectionsScreen';
import { OnboardingCarousel } from './components/OnboardingCarousel';
import { AuthScreen } from './components/AuthScreen';
import { SearchFiltersModal } from './components/SearchFiltersModal';
import { FamilySharePortal } from './components/FamilySharePortal';
import { PrivacySettingsModal } from './components/PrivacySettingsModal';
import { PaywallModal } from './components/PaywallModal';
import { WhoViewedMeScreen } from './components/WhoViewedMeScreen';
import { AiMatchmakerModal } from './components/AiMatchmakerModal';
import { ProfileScreen } from './components/ProfileScreen';
import { Toast } from './components/Toast';
import { Home, Heart, Eye, Sparkles, User, ArrowLeft, SlidersHorizontal } from 'lucide-react';

type ViewType = 'onboarding' | 'auth' | 'home' | 'for-you' | 'connections' | 'share-portal' | 'profile';

export function App() {
  const [profiles, setProfiles] = useState<Profile[]>(MOCK_PROFILES);
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
      return stored ? 'home' : 'auth';
    } catch {
      return 'auth';
    }
  });

  // Navigation History Stack & Slide Direction (-1 = back/left, 1 = forward/right)
  const [history, setHistory] = useState<ViewType[]>(['home']);
  const [slideDirection, setSlideDirection] = useState<number>(1);

  const navigateTo = useCallback((view: ViewType) => {
    if (view === currentView) return;
    setHistory((prev) => [...prev, currentView]);
    setSlideDirection(1);
    setCurrentView(view);
  }, [currentView]);

  const goBack = useCallback(() => {
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

  // Touch Swipe Gesture for iOS-style slide-back (drag from left edge / rightward swipe)
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

    // Detect rightward swipe: swipe right by > 65px and predominantly horizontal
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
  const [showAiModal, setShowAiModal] = useState(false);
  const [isParentView, setIsParentView] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterCriteria | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'heart' | 'sparkle'>('success');
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    photo_privacy: 'visible_to_everyone',
    profile_visibility: 'visible_in_discovery',
    financial_privacy: 'show_verified_badge'
  });

  const triggerToast = (msg: string, type: 'success' | 'heart' | 'sparkle' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setCurrentUser(null);
      triggerToast('Logged out successfully', 'success');
    } catch {
      setCurrentUser(null);
      triggerToast('Logged out', 'success');
    }
  };

  const handleResetAllData = async () => {
    await authService.clearAllData();
    localStorage.removeItem('mannat_intro_dismissed');
    setCurrentUser(null);
    setProfiles(MOCK_PROFILES);
    setActiveFilters(null);
    setCurrentView('auth');
    triggerToast('All test data & sessions wiped clean! Please sign in.', 'sparkle');
  };

  // Fetch initial profiles from Supabase Database on mount and listen to auth changes
  useEffect(() => {
    async function loadBackendData() {
      try {
        const liveProfiles = await profileService.getProfiles();
        if (liveProfiles && liveProfiles.length > 0) {
          setProfiles(liveProfiles);
        }
        const activeUser = await authService.getCurrentUser();
        if (activeUser) {
          setCurrentUser(activeUser);
        }
      } catch {
        setProfiles(MOCK_PROFILES);
      }
    }
    loadBackendData();

    const { data: authListener } = authService.onAuthStateChange((user) => {
      if (user) {
        setCurrentUser(user);
        setCurrentView('profile');
        triggerToast(`Welcome back, ${user.user_metadata?.full_name || user.email?.split('@')[0] || 'Member'}! ✨`, 'sparkle');
        
        // Clean URL hash after successful session capture
        if (typeof window !== 'undefined' && window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Compute dynamic filtered profiles based on active filters
  const filteredProfiles = useMemo(() => {
    if (!activeFilters) return profiles;

    const filtered = profiles.filter((p) => {
      // 1. Age Range
      if (p.age < activeFilters.ageMin || p.age > activeFilters.ageMax) {
        return false;
      }

      // 2. Religion Faith
      if (activeFilters.selectedReligion && activeFilters.selectedReligion.length > 0) {
        if (!activeFilters.selectedReligion.includes(p.religion)) {
          return false;
        }
      }

      // 3. Sub-Community / Caste
      if (activeFilters.selectedSubCommunity && activeFilters.selectedSubCommunity.length > 0) {
        const matchesCommunity = activeFilters.selectedSubCommunity.some(
          (sub) =>
            (p.sub_community && p.sub_community.toLowerCase().includes(sub.toLowerCase())) ||
            (p.community && p.community.toLowerCase().includes(sub.toLowerCase())) ||
            (p.caste && p.caste.toLowerCase().includes(sub.toLowerCase()))
        );
        if (!matchesCommunity) return false;
      }

      // 4. Manglik Preference
      if (activeFilters.manglikPref && activeFilters.manglikPref !== "Doesn't Matter") {
        if (p.horoscope?.manglik && p.horoscope.manglik !== activeFilters.manglikPref) {
          return false;
        }
      }

      // 5. Gun Milan Score
      if (p.gun_milan_score !== undefined && activeFilters.gunMilanMin) {
        if (p.gun_milan_score < activeFilters.gunMilanMin) {
          return false;
        }
      }

      // 6. Net Worth Bracket
      if (activeFilters.selectedNetWorth && activeFilters.selectedNetWorth.length > 0) {
        if (p.lifestyle_details?.net_worth) {
          if (!activeFilters.selectedNetWorth.includes(p.lifestyle_details.net_worth)) {
            return false;
          }
        }
      }

      // 7. Second Home Preference
      if (activeFilters.secondHomePref) {
        if (!p.lifestyle_details?.second_home) {
          return false;
        }
      }

      return true;
    });

    return filtered.length > 0 ? filtered : profiles;
  }, [profiles, activeFilters]);

  const handleUnlockSuccess = (profileId: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === profileId ? { ...p, is_unlocked: true } : p))
    );
  };

  const handleOpenSharePortal = (profile: Profile) => {
    setShareProfile(profile);
    navigateTo('share-portal');
  };

  const handleProfileCreated = (newProfile?: Profile) => {
    if (newProfile) {
      setProfiles((prev) => [newProfile, ...prev]);
      triggerToast(`🎉 Profile for ${newProfile.display_name} created & added to feed!`, 'sparkle');
    }
    navigateTo('home');
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

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`min-h-screen bg-[#FBF9F4] text-[#111111] flex flex-col items-center justify-start p-0 font-sans select-none relative overflow-x-hidden ${isParentView ? 'text-lg font-bold' : ''}`}
    >
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />

      {/* Main Responsive Mobile App Container */}
      <div className="w-full max-w-md mx-auto flex-1 min-h-screen bg-[#FBF9F4] flex flex-col relative">
        
        {/* App Header with Back Button, Brand Logo, and Filter Button */}
        <header className="w-full bg-[#FBF9F4] border-b border-[#E8E1D5] px-4 py-3.5 z-40 sticky top-0 shadow-xs flex items-center justify-between">
          <div className="w-14 flex items-center justify-start">
            {currentView !== 'home' && currentView !== 'auth' && (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-1 text-xs font-black text-[#111111] hover:text-[#B89552] transition-all p-1.5 -ml-1 rounded-full hover:bg-[#E8E1D5]/40 active:scale-95 cursor-pointer"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4 text-[#B89552]" />
                <span>Back</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="font-instrument text-3xl lowercase text-[#B89552] tracking-tight hover:opacity-80 transition-opacity cursor-pointer leading-none text-center"
          >
            mannat
          </button>

          <div className="w-14 flex items-center justify-end">
            {currentView === 'home' && (
              <button
                type="button"
                onClick={() => setShowFiltersModal(true)}
                className="p-2 rounded-full bg-[#F4EFE6] border border-[#E8E1D5] hover:border-[#B89552] text-[#111111] hover:text-[#B89552] transition-all shadow-xs active:scale-95 cursor-pointer relative"
                title="Filter Profiles"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#B89552]" />
                {activeFilters && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#B89552] ring-2 ring-white" />
                )}
              </button>
            )}
          </div>
        </header>

        {/* Parent View Header Bar Banner */}
        {isParentView && (
          <div className="w-full bg-[#111111] text-white px-4 py-2 text-center text-xs font-black uppercase tracking-widest flex items-center justify-between z-30 border-b border-[#B89552] shrink-0">
            <div className="flex items-center gap-2 mx-auto">
              <span>👨‍👩‍👧 PARENT VIEW MODE (BIO-DATA FOCUS)</span>
            </div>
            <button
              type="button"
              onClick={() => setIsParentView(false)}
              className="text-[11px] bg-[#B89552] text-white px-3 py-1 rounded-full cursor-pointer hover:bg-white hover:text-[#111111] transition-colors"
            >
              Exit
            </button>
          </div>
        )}

        {/* Main Content Area with Smooth Slide Animations */}
        <main className="w-full flex-1 relative pb-20 overflow-x-hidden">
          <AnimatePresence mode="wait" custom={slideDirection}>
            <motion.div
              key={currentView}
              custom={slideDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
              className="w-full flex-1 flex flex-col"
            >
              {/* Onboarding View */}
              {currentView === 'onboarding' && (
                <OnboardingCarousel onComplete={handleProfileCreated} />
              )}

              {/* Auth View */}
              {currentView === 'auth' && (
                <AuthScreen 
                  onLoginSuccess={async (user) => {
                    if (user) {
                      setCurrentUser(user);
                    } else {
                      const u = await authService.getCurrentUser();
                      setCurrentUser(u);
                    }
                    navigateTo('profile');
                    triggerToast('Signed in successfully! ✨', 'sparkle');
                  }} 
                />
              )}

              {/* Main Home Dashboard Feed */}
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

              {/* For You / Who Viewed Me Tab */}
              {currentView === 'for-you' && (
                <WhoViewedMeScreen
                  profiles={filteredProfiles}
                  onOpenPaywall={() => setShowPaywallModal(true)}
                  onOpenProfile={handleOpenSharePortal}
                />
              )}

              {/* Connections View with Live Chat */}
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

              {/* Family Share Portal */}
              {currentView === 'share-portal' && (
                <FamilySharePortal
                  profile={shareProfile || profiles[0]}
                  onBackToFeed={goBack}
                />
              )}

              {/* Profile & Account View */}
              {currentView === 'profile' && (
                <ProfileScreen
                  currentUser={currentUser}
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
                  onOpenAiMatchmaker={() => setShowAiModal(true)}
                  onOpenOnboarding={() => navigateTo('onboarding')}
                  onOpenAuth={() => navigateTo('auth')}
                  onLogout={handleLogout}
                  onResetAllData={handleResetAllData}
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

      <AiMatchmakerModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        profiles={profiles}
        onSelectCandidate={handleOpenSharePortal}
      />

      {/* Modern Floating Bottom Dock Navigation Bar */}
      {(currentView === 'home' || currentView === 'for-you' || currentView === 'connections' || currentView === 'profile') && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md glass-dock-vara rounded-full z-50 px-4 py-2.5 flex items-center justify-around shadow-xl border border-[#E8E1D5]">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-black transition-all cursor-pointer ${
              currentView === 'home' ? 'text-[#B89552] scale-105' : 'text-[#777777] hover:text-[#111111]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('for-you')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-black transition-all cursor-pointer ${
              currentView === 'for-you' ? 'text-[#B89552] scale-105' : 'text-[#777777] hover:text-[#111111]'
            }`}
          >
            <Eye className="w-5 h-5" />
            <span>For You</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className="flex flex-col items-center gap-0.5 text-[10px] font-black text-[#B89552] hover:text-[#9A7B3E] transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            <span>AI Match</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('connections')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-black transition-all cursor-pointer ${
              currentView === 'connections' ? 'text-[#B89552] scale-105' : 'text-[#777777] hover:text-[#111111]'
            }`}
          >
            <Heart className="w-5 h-5" />
            <span>Connections</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('profile')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-black transition-all cursor-pointer ${
              currentView === 'profile' ? 'text-[#B89552] scale-105' : 'text-[#777777] hover:text-[#111111]'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
