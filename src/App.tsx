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
import { Toast } from './components/Toast';
import { Home, Heart, ShieldCheck, Crown, Eye, UserCheck, Filter, X, Sparkles, Plus } from 'lucide-react';

export function App() {
  const [profiles, setProfiles] = useState<Profile[]>(MOCK_PROFILES);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [currentView, setCurrentView] = useState<'onboarding' | 'auth' | 'home' | 'for-you' | 'connections' | 'share-portal'>('home');
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

      {/* Global Top Controls & Navigation Bar */}
      <header className="w-full bg-[#F4EFE6] border-b border-[#E8E1D5] px-4 py-2.5 z-40 sticky top-0 shadow-xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="font-instrument text-2xl sm:text-3xl lowercase text-[#B89552] tracking-tight hover:opacity-80 transition-opacity cursor-pointer"
          >
            mannat
          </button>
          <div className="hidden sm:block h-4 w-px bg-[#E8E1D5]" />
          <span className="hidden sm:inline-block text-[11px] text-[#777777] font-bold uppercase tracking-wider">
            Verified Indian Matrimony
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Create Profile Button */}
          <button
            type="button"
            onClick={() => setCurrentView('onboarding')}
            className="px-3 py-1.5 rounded-full bg-white border border-[#E8E1D5] hover:bg-gray-100 text-[#111111] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#B89552]" />
            <span>Add Profile</span>
          </button>

          {/* AI Matchmaker Trigger */}
          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className="px-3.5 py-1.5 rounded-full bg-[#111111] text-[#B89552] hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs border border-[#B89552]/40 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Matchmaker</span>
            <span className="sm:hidden">AI Match</span>
          </button>

          {/* Parent Mode Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsParentView(!isParentView);
              triggerToast(
                !isParentView ? 'Parent Mode Activated 👨‍👩‍👧 Large Text & Extra Guidance' : 'Switched back to Candidate Mode',
                'sparkle'
              );
            }}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs ${
              isParentView ? 'bg-amber-600 text-white font-extrabold shadow-sm' : 'bg-white text-[#111111] border border-[#E8E1D5] hover:bg-gray-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Parent Mode ({isParentView ? 'ON' : 'OFF'})</span>
          </button>

          {/* Filter State Indicator */}
          {activeFilters && (
            <div className="flex items-center gap-1.5 bg-[#B89552]/15 text-[#8C6D32] px-3 py-1 rounded-full border border-[#B89552]/30 text-xs font-bold">
              <Filter className="w-3 h-3" />
              <span>Filters Active</span>
              <button
                type="button"
                onClick={() => {
                  setActiveFilters(null);
                  triggerToast('Filters cleared', 'success');
                }}
                className="hover:text-black ml-1 cursor-pointer"
                title="Clear Filters"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Privacy Center Button */}
          <button
            type="button"
            onClick={() => setShowPrivacyModal(true)}
            className="hidden md:flex px-3 py-1.5 rounded-full bg-white border border-[#E8E1D5] text-[#111111] text-xs font-bold hover:bg-gray-100 items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#B89552]" />
            <span>Privacy</span>
          </button>

          {/* Upgrade Button */}
          <button
            type="button"
            onClick={() => setShowPaywallModal(true)}
            className="px-3.5 py-1.5 rounded-full bg-[#111111] text-white text-xs font-bold hover:bg-[#B89552] flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Crown className="w-3.5 h-3.5 text-[#B89552]" />
            <span className="hidden sm:inline">Upgrade</span>
          </button>

          {currentUser && (
            <span className="hidden lg:inline-block text-xs text-emerald-700 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ✓ {currentUser.user_metadata?.full_name || currentUser.email}
            </span>
          )}
        </div>
      </header>

      {/* Parent View Header Bar Banner */}
      {isParentView && (
        <div className="w-full bg-[#111111] text-white px-4 py-2 text-center text-xs sm:text-sm font-black uppercase tracking-widest flex items-center justify-between z-30 border-b border-[#B89552] shrink-0">
          <div className="flex items-center gap-2 mx-auto">
            <span>👨‍👩‍👧 PARENT VIEW MODE ACTIVE (ENLARGED TEXT & BIO-DATA FOCUS)</span>
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

      {/* Main Responsive App Content Area */}
      <main className="w-full max-w-xl mx-auto flex-1 min-h-[calc(100vh-60px)] relative pb-16">
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
              <AuthScreen onLoginSuccess={() => setCurrentView('home')} />
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
          </motion.div>
        </AnimatePresence>
      </main>

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
      {(currentView === 'home' || currentView === 'for-you' || currentView === 'connections') && (
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
            onClick={() => setShowPrivacyModal(true)}
            className="flex flex-col items-center gap-0.5 text-[10px] font-black text-[#777777] hover:text-[#111111] transition-all cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Privacy</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
