import React from 'react';
import { 
  ShieldCheck, 
  Crown, 
  Sparkles, 
  UserCheck, 
  LogOut, 
  LogIn, 
  User, 
  ChevronRight, 
  Lock, 
  CheckCircle2, 
  FileText,
  RefreshCw
} from 'lucide-react';
import type { UserSession } from '../services/authService';
import type { PrivacySettings } from '../types';

interface ProfileScreenProps {
  currentUser: UserSession | null;
  privacySettings: PrivacySettings;
  isParentView: boolean;
  onToggleParentView: () => void;
  onOpenPrivacySettings: () => void;
  onOpenPaywall: () => void;
  onOpenAiMatchmaker: () => void;
  onOpenOnboarding: () => void;
  onOpenAuth: () => void;
  onOpenAdmin?: () => void;
  onLogout: () => void;
  onResetAllData: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  privacySettings,
  isParentView,
  onToggleParentView,
  onOpenPrivacySettings,
  onOpenPaywall,
  onOpenAiMatchmaker,
  onOpenOnboarding,
  onOpenAuth,
  onOpenAdmin,
  onLogout,
  onResetAllData
}) => {
  const displayName = currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || 'Member Candidate';
  const email = currentUser?.email || 'Not signed in';

  return (
    <div className="w-full min-h-screen bg-[#FBF9F4] text-[#111111] pb-28 select-none font-sans">

      <div className="p-5 space-y-5">
        {/* User Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E1D5] shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#F4EFE6] border-2 border-[#B89552]/40 flex items-center justify-center text-[#B89552] text-xl font-serif-editorial font-bold shadow-inner">
              {currentUser?.user_metadata?.avatar_url ? (
                <img 
                  src={currentUser.user_metadata.avatar_url} 
                  alt={displayName} 
                  className="w-full h-full rounded-full object-cover" 
                />
              ) : (
                <User className="w-8 h-8 text-[#B89552]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-serif-editorial font-bold text-[#111111] truncate">{displayName}</h2>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified</span>
                </span>
              </div>
              <p className="text-xs text-[#777777] truncate">{email}</p>
            </div>
          </div>

          {/* Auth Action */}
          <div className="mt-5 pt-4 border-t border-[#E8E1D5] flex items-center justify-between">
            {currentUser ? (
              <button
                type="button"
                onClick={onLogout}
                className="w-full py-2.5 px-4 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border border-rose-200 active:scale-98"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of Account</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full py-2.5 px-4 rounded-full bg-[#111111] hover:bg-[#B89552] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
              >
                <LogIn className="w-4 h-4 text-[#B89552]" />
                <span>Sign In / Create Account</span>
              </button>
            )}
          </div>
        </div>

        {/* Premium Upgrade Banner */}
        <div 
          onClick={onOpenPaywall}
          className="bg-gradient-to-br from-[#1A1A1A] to-[#2C261E] rounded-3xl p-5 text-white border border-[#B89552]/40 shadow-sm cursor-pointer hover:border-[#B89552] transition-all active:scale-98 group"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#B89552]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#B89552]">MEMBERSHIP STATUS</span>
              </div>
              <h3 className="text-base font-serif-editorial font-bold text-white">Mannat Gold Membership</h3>
              <p className="text-xs text-gray-300">Unlock unlimited verified contact direct requests & phone invites</p>
            </div>
            <div className="p-2.5 rounded-full bg-[#B89552] text-[#111111] group-hover:scale-105 transition-transform">
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Privacy & Security Section */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#8C6D32] px-1 block">
            Privacy & Trust Center
          </span>
          <div className="bg-white rounded-3xl border border-[#E8E1D5] divide-y divide-[#E8E1D5] shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={onOpenPrivacySettings}
              className="w-full p-4 flex items-center justify-between hover:bg-[#F4EFE6] transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-2xl bg-amber-50 text-[#B89552] border border-[#B89552]/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111111]">Privacy Controls & Blur Shield</h4>
                  <p className="text-[11px] text-[#777777]">Photo visibility, discovery mode & financial badges</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#888888]" />
            </button>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111111]">Photo Blur Shield</h4>
                  <p className="text-[11px] text-[#777777]">
                    {privacySettings.photo_privacy === 'visible_to_everyone' ? 'Public (Visible)' : 'Protected (Request to view)'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#8C6D32] bg-[#F4EFE6] px-2.5 py-1 rounded-full border border-[#E8E1D5]">
                {privacySettings.photo_privacy === 'visible_to_everyone' ? 'Standard' : 'Private'}
              </span>
            </div>
          </div>
        </div>

        {/* Discovery & App Modes */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#8C6D32] px-1 block">
            App Modes & Discovery
          </span>
          <div className="bg-white rounded-3xl border border-[#E8E1D5] divide-y divide-[#E8E1D5] shadow-xs overflow-hidden">
            {/* Parent Mode Toggle */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-2xl border ${isParentView ? 'bg-amber-600 text-white border-amber-600' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111111]">Parent View Mode</h4>
                  <p className="text-[11px] text-[#777777]">Large text & family bio-data oriented interface</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onToggleParentView}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer shadow-xs ${
                  isParentView ? 'bg-amber-600 text-white' : 'bg-[#F4EFE6] text-[#111111] hover:bg-[#E8E1D5]'
                }`}
              >
                {isParentView ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* AI Matchmaker Trigger */}
            <button
              type="button"
              onClick={onOpenAiMatchmaker}
              className="w-full p-4 flex items-center justify-between hover:bg-[#F4EFE6] transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111111]">AI Matchmaker Assistant</h4>
                  <p className="text-[11px] text-[#777777]">Get personalized compatibility scoring & introductions</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#888888]" />
            </button>

            {/* Create / Edit Bio-data */}
            <button
              type="button"
              onClick={onOpenOnboarding}
              className="w-full p-4 flex items-center justify-between hover:bg-[#F4EFE6] transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111111]">Create / Edit Bio-data</h4>
                  <p className="text-[11px] text-[#777777]">Update background, astrological chart & family details</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#888888]" />
            </button>

            {/* Admin Command Center */}
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="w-full p-4 flex items-center justify-between hover:bg-[#F4EFE6] transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-2xl bg-amber-50 text-[#C5A059] border border-[#C5A059]/30">
                    <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                      <span>Admin Command Center</span>
                      <span className="text-[9px] font-black uppercase text-[#C5A059] bg-[#F6F2E9] px-2 py-0.5 rounded-full border border-[#EADBCE]">
                        PORTAL
                      </span>
                    </h4>
                    <p className="text-[11px] text-[#777777]">Manage candidates, verifications, analytics & purge utilities</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#888888]" />
              </button>
            )}
          </div>
        </div>

        {/* Developer / Testing Data Reset Section */}
        <div className="p-4 rounded-3xl bg-rose-50/60 border border-rose-200/70 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-black text-rose-800 uppercase tracking-wider block">
              Testing & Session Utilities
            </span>
            <p className="text-[11px] text-rose-700">Wipe all active logins and start fresh unauthenticated</p>
          </div>
          <button
            type="button"
            onClick={onResetAllData}
            className="px-3.5 py-2 rounded-full bg-white border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0 active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
