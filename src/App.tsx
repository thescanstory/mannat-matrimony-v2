import { useState, useEffect, useMemo } from 'react';
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
import { Home, Heart, Eye, Sparkles, User } from 'lucide-react';

export function App() {
  const [profiles, setProfiles] = useState<Profile[]>(MOCK_PROFILES);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [currentView, setCurrentView] = useState<'onboarding' | 'auth' | 'home' | 'for-you' | 'connections' | 'share-portal' | 'profile'>('home');
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

  // Fetch initial profiles from Supabase Database on mount and listen to auth changes
  useEffect(() => {
    async function loadBackendData() {
      try {
        const liveProfiles = await profileService.getProfiles();
        if (liveProfiles && liveProfiles.length > 0) {
          setProfiles(liveProfiles);
        }
        const activeUser = await authService.getCurrentUser();
        setCurrentUser(activeUser);
      } catch {
        setProfiles(MOCK_PROFILES);
      }
    }
    loadBackendData();

    const { data: authListener } = authService.onAuthStateChange((user) => {
      setCurrentUser(user);
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
    setCurrentView('share-portal');
  };

  const handleProfileCreated = (newProfile?: Profile) => {
    if (newProfile) {
      setProfiles((prev) => [newProfile, ...prev]);
      triggerToast(`🎉 Profile for ${newProfile.display_name} created & added to feed!`, 'sparkle');
    }
    setCurrentView('home');
  };

  return (
    <div className={`min-h-screen bg-[#FBF9F4] text-[#111111] flex flex-col items-center justify-start p-0 font-sans select-none relative overflow-x-hidden ${isParentView ? 'text-lg font-bold' : ''}`}>
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />

      {/* Main Responsive Mobile App Container */}
      <div className="w-full max-w-md mx-auto flex-1 min-h-screen bg-[#FBF9F4] flex flex-col relative">
        
        {/* App Header Inside The App Frame */}
        <header className="w-full bg-[#FBF9F4] border-b border-[#E8E1D5] px-5 py-4 z-40 sticky top-0 shadow-xs flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="font-instrument text-3xl lowercase text-[#B89552] tracking-tight hover:opacity-80 transition-opacity cursor-pointer leading-none"
          >
            mannat
          </button>
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

        {/* Main Content Area */}
        <main className="w-full flex-1 relative pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="w-full h-full"
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
                  setCurrentView('profile');
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
                onOpenCreateProfile={() => setCurrentView('onboarding')}
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
                  setCurrentView('share-portal');
                }}
                onOpenFilters={() => setShowFiltersModal(true)}
              />
            )}

            {/* Family Share Portal */}
            {currentView === 'share-portal' && (
              <FamilySharePortal
                profile={shareProfile || profiles[0]}
                onBackToFeed={() => setCurrentView('home')}
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
                onOpenOnboarding={() => setCurrentView('onboarding')}
                onOpenAuth={() => setCurrentView('auth')}
                onLogout={handleLogout}
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
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-black transition-all cursor-pointer ${
              currentView === 'home' ? 'text-[#B89552] scale-105' : 'text-[#777777] hover:text-[#111111]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('for-you')}
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
            onClick={() => setCurrentView('connections')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-black transition-all cursor-pointer ${
              currentView === 'connections' ? 'text-[#B89552] scale-105' : 'text-[#777777] hover:text-[#111111]'
            }`}
          >
            <Heart className="w-5 h-5" />
            <span>Connections</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('profile')}
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
