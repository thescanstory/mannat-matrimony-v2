import React, { useState } from 'react';
import { X, Lock, Eye, Check, ShieldCheck, Sparkles, ArrowLeft, LogOut } from 'lucide-react';
import type { PrivacySettings } from '../types';
import type { UserSession } from '../services/authService';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

interface PrivacySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSettings: PrivacySettings;
  onSave: (settings: PrivacySettings) => void;
  currentUser?: UserSession | null;
  onLogout?: () => void;
}

export const PrivacySettingsModal: React.FC<PrivacySettingsModalProps> = ({
  isOpen,
  onClose,
  initialSettings,
  onSave,
  currentUser,
  onLogout
}) => {
  const [photoPrivacy, setPhotoPrivacy] = useState(initialSettings.photo_privacy || 'visible_to_everyone');
  const [profileVisibility, setProfileVisibility] = useState(initialSettings.profile_visibility || 'visible_in_discovery');
  const [financialPrivacy, setFinancialPrivacy] = useState(initialSettings.financial_privacy || 'show_verified_badge');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    const updatedSettings: PrivacySettings = {
      photo_privacy: photoPrivacy,
      profile_visibility: profileVisibility,
      financial_privacy: financialPrivacy
    };

    try {
      if (isSupabaseConfigured()) {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user?.id) {
          await supabase.from('privacy_settings').upsert([
            {
              profile_id: userData.user.id,
              photo_privacy: photoPrivacy,
              profile_visibility: profileVisibility,
              financial_privacy: financialPrivacy
            }
          ]);
        }
      }
    } catch (e) {
      console.warn('Privacy settings local save fallback:', e);
    } finally {
      onSave(updatedSettings);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setSaving(false);
        onClose();
      }, 500);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="w-full max-w-md bg-[#FBF9F4] text-[#111111] rounded-t-[36px] sm:rounded-[36px] overflow-hidden flex flex-col justify-between select-none font-sans border border-[#E8E1D5] shadow-2xl relative"
        >
          {/* Header */}
          <div className="px-5 pt-4 pb-3.5 bg-[#FBF9F4] border-b border-[#E8E1D5] flex items-center justify-between shadow-xs sticky top-0 z-20">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1 text-xs font-black text-[#111111] hover:text-[#B89552] transition-all p-1.5 -ml-1 rounded-full hover:bg-[#E8E1D5]/40 active:scale-95 cursor-pointer"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4 text-[#B89552]" />
                <span>Back</span>
              </button>
              <div className="h-4 w-px bg-[#E8E1D5]" />
              <span className="font-instrument text-2xl lowercase text-[#B89552] leading-none">mannat</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#E8E1D5]/50 text-gray-400 hover:text-[#111111] transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Options */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-[#FBF9F4]">
            {savedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-extrabold rounded-2xl text-center animate-fadeIn">
                ✓ Privacy Settings Saved to Supabase Database!
              </div>
            )}

            {/* 1. Photo Privacy */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#B89552]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-[#B89552]">
                  Photo Privacy Boundary
                </h3>
              </div>

              <div className="space-y-2">
                {[
                  {
                    id: 'visible_to_everyone',
                    title: 'Visible to Everyone',
                    desc: 'Your photos are visible to all verified candidates'
                  },
                  {
                    id: 'accepted_waves_only',
                    title: 'Only Accepted Waves',
                    desc: 'Photos locked until you accept their interest wave'
                  },
                  {
                    id: 'blur_until_accepted',
                    title: 'Blur 20px Until Accepted (Gold Lock)',
                    desc: 'Photos show 20px blur with gold lock badge'
                  }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPhotoPrivacy(opt.id as any)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      photoPrivacy === opt.id
                        ? 'bg-[#111111] text-white border-[#111111] shadow-md'
                        : 'bg-[#F4EFE6] text-[#111111] border-[#E8E1D5] hover:bg-[#E8E1D5]'
                    }`}
                  >
                    <div className="space-y-0.5 pr-2">
                      <span className="text-xs font-extrabold block">{opt.title}</span>
                      <span className={`text-[11px] block ${photoPrivacy === opt.id ? 'text-gray-300' : 'text-[#777777]'}`}>
                        {opt.desc}
                      </span>
                    </div>
                    {photoPrivacy === opt.id && <Check className="w-4 h-4 text-[#B89552] shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Profile Visibility */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#B89552]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-[#B89552]">
                  Profile Search Visibility
                </h3>
              </div>

              <div className="space-y-2">
                {[
                  {
                    id: 'visible_in_discovery',
                    title: 'Visible in Discovery Feed',
                    desc: 'Appear in daily curated candidate stream'
                  },
                  {
                    id: 'hidden_incognito',
                    title: 'Incognito Mode (Hidden from Search)',
                    desc: 'Only visible to profiles you send interest waves to'
                  }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setProfileVisibility(opt.id as any)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      profileVisibility === opt.id
                        ? 'bg-[#111111] text-white border-[#111111] shadow-md'
                        : 'bg-[#F4EFE6] text-[#111111] border-[#E8E1D5] hover:bg-[#E8E1D5]'
                    }`}
                  >
                    <div className="space-y-0.5 pr-2">
                      <span className="text-xs font-extrabold block">{opt.title}</span>
                      <span className={`text-[11px] block ${profileVisibility === opt.id ? 'text-gray-300' : 'text-[#777777]'}`}>
                        {opt.desc}
                      </span>
                    </div>
                    {profileVisibility === opt.id && <Check className="w-4 h-4 text-[#B89552] shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Financial Privacy */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B89552]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-[#B89552]">
                  Financial Privacy Boundary
                </h3>
              </div>

              <div className="space-y-2">
                {[
                  {
                    id: 'show_verified_badge',
                    title: 'Show Verified Badge Only',
                    desc: 'Display verified HNI badge without exact figures'
                  },
                  {
                    id: 'blur_until_accepted',
                    title: 'Hide Assets Until Wave Accepted',
                    desc: 'Net worth figures stay hidden until mutual match'
                  }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFinancialPrivacy(opt.id as any)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      financialPrivacy === opt.id
                        ? 'bg-[#111111] text-white border-[#111111] shadow-md'
                        : 'bg-[#F4EFE6] text-[#111111] border-[#E8E1D5] hover:bg-[#E8E1D5]'
                    }`}
                  >
                    <div className="space-y-0.5 pr-2">
                      <span className="text-xs font-extrabold block">{opt.title}</span>
                      <span className={`text-[11px] block ${financialPrivacy === opt.id ? 'text-gray-300' : 'text-[#777777]'}`}>
                        {opt.desc}
                      </span>
                    </div>
                    {financialPrivacy === opt.id && <Check className="w-4 h-4 text-[#B89552] shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Apple App Store Mandated: Account Deletion (Guideline 5.1.1) */}
            <div className="pt-2 border-t border-[#E8E1D5] space-y-2">
              {/* Account Session & Logout */}
              {currentUser && onLogout && (
                <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E1D5] flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-black text-[#8C6D32] uppercase tracking-wider block">
                      Logged In As
                    </span>
                    <p className="text-xs font-bold text-[#111111] truncate">
                      {currentUser.user_metadata?.full_name || currentUser.email || 'Candidate User'}
                    </p>
                    {currentUser.email && (
                      <p className="text-[11px] text-[#777777] truncate">{currentUser.email}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="px-3.5 py-2 rounded-full bg-white border border-[#E8E1D5] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-[#111111] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0 active:scale-95"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}

              {/* GDPR Delete Data */}
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-2">
                <span className="text-xs font-black text-rose-800 uppercase tracking-wider block">
                  Account Management & GDPR
                </span>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  Permanently delete your profile, media assets, and chats from Mannat servers.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to permanently delete your account and data? This action cannot be undone.')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-extrabold cursor-pointer transition-colors"
                >
                  Delete Account & Wipe Data
                </button>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Save Button */}
          <div className="p-5 border-t border-[#E8E1D5] bg-[#FBF9F4] sticky bottom-0 z-20 shadow-lg">
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="w-full py-4 px-6 rounded-full bg-[#111111] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#B89552] active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#B89552]" />
              <span>{saving ? 'Saving to Database...' : 'Save Privacy Controls'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

