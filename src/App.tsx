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
import { ProfileScreen } from './components/ProfileScreen';
import { App as AdminPortal } from '../admin/src/App';
import { Toast } from './components/Toast';
import { Home, Heart, Eye, Sparkles, User, ArrowLeft, SlidersHorizontal } from 'lucide-react';

type ViewType = 'onboarding' | 'auth' | 'home' | 'for-you' | 'connections' | 'share-portal' | 'profile';

export function App() {
  // Check if accessing dedicated Admin URL route (/admin, ?admin=true, ?view=admin, #admin, or admin domain)
  const isAdminRoute = typeof window !== 'undefined' && (
    window.location.pathname.startsWith('/admin') ||
    window.location.search.includes('admin') ||
    window.location.search.includes('view=admin') ||
    window.location.hash.includes('admin') ||
    window.location.hostname.includes('admin')
  );

  if (isAdminRoute) {
    return <AdminPortal />;
  }

  return <MainApp />;
}

function MainApp() {
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('mannat_admin_deleted') === 'true') {
        return [];
      }
      return MOCK_PROFILES;
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
      if (typeof window !== 'undefined') {
        localStorage.clear();
        localStorage.setItem('mannat_logged_out', 'true');
      }
      await authService.signOut();
      setCurrentUser(null);
      setProfiles(MOCK_PROFILES);
      setActiveFilters(null);
      setCurrentView('auth');
      triggerToast('All candidate profile data and session reset. 🗑️', 'success');
    } catch {
      setCurrentUser(null);
      setCurrentView('auth');
    }
  };

  // Fetch initial profiles from Supabase Database on mount and listen to auth changes
  useEffect(() => {
    // Handle Direct Google OAuth 2.0 Return (via #access_token=...)
    async function checkGoogleOAuthReturn() {
      if (typeof window !== 'undefined' && window.location.hash) {
        const hash = window.location.hash;
        if (hash.includes('access_token=')) {
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token');
          if (accessToken) {
            try {
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` }
              });
              const gUser = await res.json();
              if (gUser && gUser.email) {
                window.history.replaceState(null, '', window.location.pathname);
                const user = authService.setUserSession(
                  gUser.email,
                  gUser.name || gUser.given_name || gUser.email.split('@')[0],
                  gUser.picture
                );
                setCurrentUser(user);
                const isExisting = await profileService.hasExistingProfile(user.id, user.email);
                if (isExisting) {
                  setCurrentView('home');
                  triggerToast(`Welcome back, ${user.user_metadata?.full_name || 'Member'}! ✨`, 'sparkle');
                } else {
                  setCurrentView('onboarding');
                  triggerToast(`Welcome! Please complete your candidate bio-data ✨`, 'sparkle');
                }
                return;
              }
            } catch (err) {
              console.warn('Google userinfo fetch error:', err);
            }
          }
        }
      }
    }
    checkGoogleOAuthReturn();

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

    const { data: authListener } = authService.onAuthStateChange(async (user) => {
      if (user) {
        setCurrentUser(user);
        
        // Clean URL hash after successful session capture
        if (typeof window !== 'undefined' && window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname);
        }

        // Check if existing profile or new account
        const isExisting = await profileService.hasExistingProfile(user.id, user.email);
        if (isExisting) {
          setCurrentView('home');
          triggerToast(`Welcome back, ${user.user_metadata?.full_name || user.email?.split('@')[0] || 'Member'}! ✨`, 'sparkle');
        } else {
          setCurrentView('onboarding');
          triggerToast(`Welcome to Mannat, ${user.user_metadata?.full_name || 'Member'}! Please complete your bio-data ✨`, 'sparkle');
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

  // Compute dynamic filtered profiles based on user gender (opposite gender only) & active filters
  const filteredProfiles = useMemo(() => {
    // 1. Determine active user gender and profile id
    let userGender: string | null = null;
    let userProfileId: string | null = null;

    if (currentUser) {
      const myProfile = profiles.find(
        (p) => p.user_id === currentUser.id || p.id === currentUser.id
      );
      if (myProfile) {
        userGender = myProfile.gender || null;
        userProfileId = myProfile.id;
      }
    }

    if (!userGender && typeof window !== 'undefined') {
      try {
        const storedGender = localStorage.getItem('mannat_user_gender');
        if (storedGender) userGender = storedGender;

        const storedCustom = localStorage.getItem('mannat_custom_profiles');
        if (storedCustom) {
          const list: Profile[] = JSON.parse(storedCustom);
          if (list.length > 0) {
            if (!userGender && list[0].gender) userGender = list[0].gender;
            if (!userProfileId) userProfileId = list[0].id;
          }
        }
      } catch {}
    }

    // 2. Filter profiles by opposite gender & exclude self
    const genderFiltered = profiles.filter((p) => {
      // Hide user's own profile
      if (currentUser && (p.user_id === currentUser.id || p.id === currentUser.id)) {
        return false;
      }
      if (userProfileId && p.id === userProfileId) {
        return false;
      }

      // If user is male/man, ONLY show females/women
      if (userGender === 'male' || userGender === 'man') {
        return p.gender === 'female';
      }

      // If user is female/woman, ONLY show males/men
      if (userGender === 'female' || userGender === 'woman') {
        return p.gender === 'male';
      }

      return true;
    });

    if (!activeFilters) return genderFiltered;

    const filtered = genderFiltered.filter((p) => {
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

    return filtered.length > 0 ? filtered : genderFiltered;
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
      setProfiles((prev) => {
        const exists = prev.some((p) => p.id === newProfile.id || (currentUser && p.user_id === currentUser.id));
        if (exists) {
          return prev.map((p) => (p.id === newProfile.id || (currentUser && p.user_id === currentUser.id) ? newProfile : p));
        }
        return [newProfile, ...prev];
      });
    }
    if (isEditingProfile) {
      setIsEditingProfile(false);
      navigateTo('profile');
      triggerToast('Bio-data & persona updated successfully! ✨', 'sparkle');
    } else {
      navigateTo('home');
      triggerToast(newProfile ? `🎉 Profile for ${newProfile.display_name} created & added to feed!` : 'Welcome to Mannat ✨', 'sparkle');
    }
  };

  const handleUpdateProfile = async (updated: Profile) => {
    try {
      await profileService.createProfile(updated);
      setProfiles((prev) => {
        const exists = prev.some((p) => p.id === updated.id || (currentUser && p.user_id === currentUser.id));
        if (exists) {
          return prev.map((p) => (p.id === updated.id || (currentUser && p.user_id === currentUser.id) ? updated : p));
        }
        return [updated, ...prev];
      });
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

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`min-h-screen bg-[#FBF9F4] text-[#111111] flex flex-col items-center justify-start p-0 font-sans select-none relative overflow-x-hidden ${isParentView ? 'text-lg font-bold' : ''}`}
    >
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />

      {/* Main Responsive Mobile App Container */}
      <div className="w-full max-w-md mx-auto flex-1 min-h-screen bg-[#FBF9F4] flex flex-col relative">
        
        {/* Luxury App Header with Back Button, Brand Logo, and Filter Button */}
        <header className="w-full bg-[#FAF8F5]/90 backdrop-blur-xl border-b border-[#EADBCE]/80 px-4 py-3 z-40 sticky top-0 shadow-xs flex items-center justify-between">
          <div className="w-16 flex items-center justify-start">
            {currentView !== 'home' && currentView !== 'auth' && (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-1 text-xs font-bold text-[#161412] hover:text-[#C5A059] transition-all px-2.5 py-1.5 rounded-full bg-[#F6F2E9] border border-[#EADBCE] hover:border-[#C5A059] active:scale-95 cursor-pointer shadow-xs"
                title="Go Back"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-[11px] font-extrabold">Back</span>
              </button>
            )}
          </div>

          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="group flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059] group-hover:rotate-12 transition-transform" />
              <span className="font-instrument text-3xl lowercase text-[#161412] tracking-tight group-hover:text-[#C5A059] transition-colors leading-none">
                mannat
              </span>
            </button>
          </div>

          <div className="w-16 flex items-center justify-end">
            {currentView === 'home' && (
              <button
                type="button"
                onClick={() => setShowFiltersModal(true)}
                className="p-2 rounded-full bg-[#F6F2E9] border border-[#EADBCE] hover:border-[#C5A059] text-[#161412] hover:text-[#C5A059] transition-all shadow-xs active:scale-95 cursor-pointer relative"
                title="Filter Profiles"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A059]" />
                {activeFilters && (
                  <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-[#C5A059] ring-2 ring-white animate-pulse" />
                )}
              </button>
            )}
          </div>
        </header>

        {/* Parent View Header Bar Banner */}
        {isParentView && (
          <div className="w-full bg-[#161412] text-white px-4 py-2 text-center text-xs font-black uppercase tracking-widest flex items-center justify-between z-30 border-b border-[#C5A059] shrink-0">
            <div className="flex items-center gap-2 mx-auto">
              <span>👨‍👩‍👧 PARENT VIEW MODE (BIO-DATA FOCUS)</span>
            </div>
            <button
              type="button"
              onClick={() => setIsParentView(false)}
              className="text-[11px] bg-[#C5A059] text-white px-3 py-1 rounded-full cursor-pointer hover:bg-white hover:text-[#161412] transition-colors"
            >
              Exit
            </button>
          </div>
        )}

        {/* Main Content Area with Smooth Slide Animations */}
        <main className="w-full flex-1 relative pb-24 overflow-x-hidden">
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
              {/* Onboarding & Edit Profile View */}
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

              {/* Auth View */}
              {currentView === 'auth' && (
                <AuthScreen 
                  onOpenOnboarding={() => navigateTo('onboarding')}
                  onLoginSuccess={async (user) => {
                    const activeUser = user || await authService.getCurrentUser();
                    if (activeUser) {
                      setCurrentUser(activeUser);
                      const isExisting = await profileService.hasExistingProfile(activeUser.id, activeUser.email);
                      if (isExisting) {
                        navigateTo('home');
                        triggerToast(`Welcome back, ${activeUser.user_metadata?.full_name || activeUser.email?.split('@')[0] || 'Member'}! ✨`, 'sparkle');
                      } else {
                        navigateTo('onboarding');
                        triggerToast(`Welcome! Please complete your candidate bio-data ✨`, 'sparkle');
                      }
                    } else {
                      navigateTo('home');
                    }
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
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md glass-dock-vara rounded-full z-50 px-3 py-2 flex items-center justify-around shadow-xl border border-[#EADBCE]/90">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-full transition-all cursor-pointer ${
              currentView === 'home' 
                ? 'text-[#C5A059] bg-[#FAF8F5] shadow-xs scale-105 font-bold' 
                : 'text-[#7E776F] hover:text-[#161412] font-semibold'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">Discover</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('for-you')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-full transition-all cursor-pointer ${
              currentView === 'for-you' 
                ? 'text-[#C5A059] bg-[#FAF8F5] shadow-xs scale-105 font-bold' 
                : 'text-[#7E776F] hover:text-[#161412] font-semibold'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">For You</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('connections')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-full transition-all cursor-pointer ${
              currentView === 'connections' 
                ? 'text-[#C5A059] bg-[#FAF8F5] shadow-xs scale-105 font-bold' 
                : 'text-[#7E776F] hover:text-[#161412] font-semibold'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">Matches</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('profile')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-full transition-all cursor-pointer ${
              currentView === 'profile' 
                ? 'text-[#C5A059] bg-[#FAF8F5] shadow-xs scale-105 font-bold' 
                : 'text-[#7E776F] hover:text-[#161412] font-semibold'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">Profile</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
