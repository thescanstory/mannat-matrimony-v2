import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_PROFILES } from './services/mockData';
import { profileService } from './services/profileService';
import { authService } from './services/authService';
import type { UserSession } from './services/authService';
import type { Profile, PrivacySettings } from './types';
import { InstaVibeFeed } from './components/InstaVibeFeed';
import { ConnectionsScreen } from './components/ConnectionsScreen';
import { OnboardingCarousel } from './components/OnboardingCarousel';
import { AuthScreen } from './components/AuthScreen';
import { SearchFiltersModal } from './components/SearchFiltersModal';
import { FamilySharePortal } from './components/FamilySharePortal';
import { PrivacySettingsModal } from './components/PrivacySettingsModal';
import { PaywallModal } from './components/PaywallModal';
import { WhoViewedMeScreen } from './components/WhoViewedMeScreen';
import { Home, Heart, Wifi, Battery, Smartphone, Maximize2, ShieldCheck, Crown, Eye, UserCheck } from 'lucide-react';

export function App() {
  const [profiles, setProfiles] = useState<Profile[]>(MOCK_PROFILES);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [currentView, setCurrentView] = useState<'onboarding' | 'auth' | 'home' | 'for-you' | 'connections' | 'share-portal'>('onboarding');
  const [shareProfile, setShareProfile] = useState<Profile | null>(null);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [isParentView, setIsParentView] = useState(false);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    photo_privacy: 'visible_to_everyone',
    profile_visibility: 'visible_in_discovery',
    financial_privacy: 'show_verified_badge'
  });

  // Fetch initial profiles from Supabase Database on mount
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
  }, []);

  const handleUnlockSuccess = (profileId: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === profileId ? { ...p, is_unlocked: true } : p))
    );
  };

  const handleOpenSharePortal = (profile: Profile) => {
    setShareProfile(profile);
    setCurrentView('share-portal');
  };

  return (
    <div className={`min-h-screen bg-[#FBF9F4] text-[#111111] flex flex-col items-center justify-center p-0 sm:py-6 font-sans select-none relative overflow-x-hidden ${isParentView ? 'text-lg font-bold' : ''}`}>
      {/* Top Controls Bar */}
      <div className="hidden sm:flex items-center justify-center gap-3 mb-4 bg-[#F4EFE6] border border-[#E8E1D5] px-5 py-2.5 rounded-full z-50 text-xs font-bold shadow-sm max-w-full flex-wrap">
        <span className="font-instrument text-2xl lowercase text-[#B89552] tracking-tight">mannat</span>
        <div className="h-4 w-px bg-[#E8E1D5]" />

        {/* Parent Mode Toggle */}
        <button
          type="button"
          onClick={() => setIsParentView(!isParentView)}
          className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
            isParentView ? 'bg-amber-600 text-white font-extrabold shadow-sm' : 'bg-white text-[#111111] border border-[#E8E1D5] hover:bg-gray-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Parent Mode 👨‍👩‍👧 ({isParentView ? 'ON' : 'OFF'})</span>
        </button>

        <div className="h-4 w-px bg-[#E8E1D5]" />

        <button
          type="button"
          onClick={() => setShowPrivacyModal(true)}
          className="px-3.5 py-1.5 rounded-full bg-white border border-[#E8E1D5] text-[#111111] hover:bg-gray-100 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#B89552]" />
          <span>Privacy Center</span>
        </button>

        <button
          type="button"
          onClick={() => setShowPaywallModal(true)}
          className="px-3.5 py-1.5 rounded-full bg-[#111111] text-white hover:bg-[#B89552] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
        >
          <Crown className="w-3.5 h-3.5 text-[#B89552]" />
          <span>Upgrade Membership</span>
        </button>

        {currentUser && (
          <>
            <div className="h-4 w-px bg-[#E8E1D5]" />
            <span className="text-emerald-700 font-extrabold">✓ {currentUser.user_metadata?.full_name || currentUser.email}</span>
          </>
        )}

        <div className="h-4 w-px bg-[#E8E1D5]" />

        {/* Device View Toggle */}
        <button
          type="button"
          onClick={() => setIsPhoneFrame(true)}
          className={`px-3 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer ${
            isPhoneFrame ? 'bg-[#111111] text-white font-bold' : 'text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Frame</span>
        </button>
        <button
          type="button"
          onClick={() => setIsPhoneFrame(false)}
          className={`px-3 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer ${
            !isPhoneFrame ? 'bg-[#111111] text-white font-bold' : 'text-[#777777] hover:text-[#111111]'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Full View</span>
        </button>
      </div>

      {/* Main Device Shell */}
      <div
        className={`w-full transition-all duration-500 relative ${
          isPhoneFrame
            ? 'max-w-[420px] h-[860px] phone-vara-bezel rounded-[50px] overflow-hidden bg-[#FBF9F4] shadow-2xl flex flex-col justify-between border border-[#E8E1D5]'
            : 'max-w-md min-h-screen bg-[#FBF9F4] flex flex-col justify-between shadow-xl border-x border-[#E8E1D5]'
        }`}
      >
        {/* Mock iPhone Status Bar */}
        {isPhoneFrame && (
          <div className="bg-[#FBF9F4] px-7 pt-3 pb-1 flex items-center justify-between text-xs font-black text-[#111111] z-50 select-none border-b border-[#E8E1D5] shrink-0">
            <span>9:41</span>
            {/* Dynamic Island Notch */}
            <div className="w-24 h-5 rounded-full bg-[#111111] border border-gray-800 flex items-center justify-end px-2">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-900 border border-gray-700" />
            </div>
            <div className="flex items-center gap-1.5 text-[#111111]">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 fill-[#111111]" />
            </div>
          </div>
        )}

        {/* Parent View Header Bar */}
        {isParentView && (
          <div className="bg-[#111111] text-white px-4 py-2 text-center text-xs font-black uppercase tracking-widest flex items-center justify-between z-50 border-b border-[#B89552] shrink-0">
            <span>👨‍👩‍👧 PARENT VIEW MODE</span>
            <button
              type="button"
              onClick={() => setIsParentView(false)}
              className="text-[10px] bg-[#B89552] text-white px-2.5 py-0.5 rounded-full cursor-pointer hover:bg-white hover:text-[#111111] transition-colors"
            >
              Exit Mode
            </button>
          </div>
        )}

        {/* Inner Scrollable Screen View Container with Animated Page Transitions */}
        <div className="flex-1 overflow-y-auto scrollbar-none relative bg-[#FBF9F4] w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="w-full h-full"
            >
              {/* Onboarding View */}
              {currentView === 'onboarding' && (
                <OnboardingCarousel onComplete={() => setCurrentView('auth')} />
              )}

              {/* Auth View */}
              {currentView === 'auth' && (
                <AuthScreen onLoginSuccess={() => setCurrentView('home')} />
              )}

              {/* Main Home Dashboard Feed */}
              {currentView === 'home' && (
                <InstaVibeFeed
                  profiles={profiles}
                  onOpenFilters={() => setShowFiltersModal(true)}
                  onOpenSharePortal={handleOpenSharePortal}
                  onOpenPaywall={() => setShowPaywallModal(true)}
                  onUnlockSuccess={handleUnlockSuccess}
                />
              )}

              {/* For You / Who Viewed Me Tab */}
              {currentView === 'for-you' && (
                <WhoViewedMeScreen
                  profiles={profiles}
                  onOpenPaywall={() => setShowPaywallModal(true)}
                  onOpenProfile={handleOpenSharePortal}
                />
              )}

              {/* Connections View */}
              {currentView === 'connections' && (
                <ConnectionsScreen
                  profiles={profiles}
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
        </div>

        {/* Modals */}
        <SearchFiltersModal
          isOpen={showFiltersModal}
          onClose={() => setShowFiltersModal(false)}
          onApply={() => {}}
        />

        <PrivacySettingsModal
          isOpen={showPrivacyModal}
          onClose={() => setShowPrivacyModal(false)}
          initialSettings={privacySettings}
          onSave={(settings) => setPrivacySettings(settings)}
        />

        <PaywallModal
          isOpen={showPaywallModal}
          onClose={() => setShowPaywallModal(false)}
          onSelectTier={() => {}}
        />

        {/* Modern Floating Glass Dock Navigation Bar */}
        {(currentView === 'home' || currentView === 'for-you' || currentView === 'connections') && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] glass-dock-vara rounded-full z-50 px-5 py-2.5 flex items-center justify-around shadow-lg border border-[#E8E1D5]">
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
    </div>
  );
}

export default App;
