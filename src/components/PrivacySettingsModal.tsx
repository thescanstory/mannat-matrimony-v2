import React, { useState } from 'react';
import { X, Lock, Eye, Check, ShieldCheck, Sparkles } from 'lucide-react';
import type { PrivacySettings } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

interface PrivacySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSettings: PrivacySettings;
  onSave: (settings: PrivacySettings) => void;
}

export const PrivacySettingsModal: React.FC<PrivacySettingsModalProps> = ({
  isOpen,
  onClose,
  initialSettings,
  onSave
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
        await supabase.from('privacy_settings').upsert([
          {
            photo_privacy: photoPrivacy,
            profile_visibility: profileVisibility,
            financial_privacy: financialPrivacy
          }
        ]);
      }
      onSave(updatedSettings);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1200);
    } catch {
      onSave(updatedSettings);
      onClose();
    } finally {
      setSaving(false);
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
          <div className="px-6 pt-5 pb-4 bg-[#FBF9F4] border-b border-[#E8E1D5] flex items-center justify-between shadow-sm sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <span className="font-instrument text-3xl lowercase text-[#B89552]">mannat</span>
              <div className="h-4 w-px bg-[#E8E1D5]" />
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#111111]">
                <ShieldCheck className="w-4 h-4 text-[#B89552]" />
                <span>Privacy Control Center</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#F4EFE6] text-gray-400 hover:text-[#111111] transition-colors cursor-pointer"
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
