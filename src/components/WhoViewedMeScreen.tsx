import React from 'react';
import { Lock, Eye, Crown, Sparkles } from 'lucide-react';
import type { Profile } from '../types';

interface WhoViewedMeScreenProps {
  profiles: Profile[];
  onOpenPaywall: () => void;
  onOpenProfile: (p: Profile) => void;
}

export const WhoViewedMeScreen: React.FC<WhoViewedMeScreenProps> = ({
  profiles,
  onOpenPaywall,
  onOpenProfile
}) => {
  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#111111] max-w-md mx-auto flex flex-col justify-between pb-28 select-none font-sans">
      {/* Top Bar Header */}
      <div className="bg-[#FBF9F4] px-5 pt-6 pb-4 border-b border-[#E8E1D5] flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="font-instrument text-3xl lowercase text-[#B89552]">mannat</span>
          <div className="h-4 w-px bg-[#E8E1D5]" />
          <h1 className="text-xl font-serif-editorial font-bold text-[#111111]">For You & Analytics</h1>
        </div>

        <button
          type="button"
          onClick={onOpenPaywall}
          className="px-3.5 py-1.5 rounded-full bg-[#111111] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm cursor-pointer hover:bg-[#B89552] transition-colors"
        >
          <Crown className="w-3.5 h-3.5 text-[#B89552]" />
          <span>Gold Member</span>
        </button>
      </div>

      {/* Paywall Banner Card */}
      <div className="p-5">
        <div className="bg-[#F4EFE6] rounded-3xl p-6 border border-[#E8E1D5] space-y-4 text-center shadow-sm relative overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-white border border-[#E8E1D5] flex items-center justify-center mx-auto text-[#B89552] shadow">
            <Eye className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#B89552]">
              12 PREMIUM MEMBERS VIEWED YOU
            </span>
            <h2 className="text-2xl font-serif-editorial font-bold text-[#111111]">
              Who's interested in your profile?
            </h2>
            <p className="text-xs text-[#777777] font-medium max-w-xs mx-auto">
              Upgrade to Gold or Diamond to unlock clear photos, salary details, and direct contact numbers.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenPaywall}
            className="w-full py-4 px-6 rounded-full bg-[#111111] text-white text-xs font-extrabold uppercase tracking-wider hover:bg-[#B89552] active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#B89552]" />
            <span>Unlock All 12 Profiles (₹1,999/mo)</span>
          </button>
        </div>
      </div>

      {/* Viewers & Shortlisted Grid */}
      <div className="px-5 space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif-editorial font-bold text-[#111111]">Recent Profile Viewers</h3>
          <span className="text-xs text-[#777777] font-bold">12 Total Views</span>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {profiles.map((profile, idx) => {
            const isLocked = idx >= 1; // Lock for demo

            return (
              <div
                key={profile.id}
                onClick={() => {
                  if (isLocked) {
                    onOpenPaywall();
                  } else {
                    onOpenProfile(profile);
                  }
                }}
                className="bg-[#F4EFE6] rounded-3xl p-3 border border-[#E8E1D5] shadow-sm relative overflow-hidden space-y-2 cursor-pointer group hover:shadow-md transition-all"
              >
                {/* Image Container with optional Backdrop Blur */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black">
                  <img
                    src={profile.photos?.[0] || profile.creator_vouch?.creator_avatar_url}
                    alt={profile.display_name}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      isLocked ? 'blur-md scale-110 opacity-70' : 'group-hover:scale-105'
                    }`}
                  />

                  {/* Lock Overlay for Free Users */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-3 text-center backdrop-blur-xs">
                      <div className="w-10 h-10 rounded-full bg-[#B89552] text-white flex items-center justify-center shadow-lg mb-1">
                        <Lock className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-white">
                        Premium Only
                      </span>
                    </div>
                  )}

                  {!isLocked && (
                    <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                      Unlocked
                    </span>
                  )}
                </div>

                {/* Info Footer */}
                <div className="space-y-0.5 text-left">
                  <h4 className="text-sm font-serif-editorial font-bold text-[#111111]">
                    {isLocked ? 'Verified Candidate' : profile.display_name}
                  </h4>
                  <p className="text-[11px] text-[#777777] font-semibold">
                    {profile.age} yrs • {profile.city}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
