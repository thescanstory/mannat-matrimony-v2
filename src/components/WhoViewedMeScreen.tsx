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
    <div className="min-h-screen bg-[#FBF9F4] text-[#111111] w-full max-w-md mx-auto flex flex-col justify-start pb-36 select-none font-sans px-4 pt-2 space-y-4">
      {/* Paywall Banner Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#E8E1D5] space-y-4 text-center shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-3">
          <div className="text-left">
            <h1 className="text-xl font-serif-editorial font-bold text-[#111111]">For You</h1>
            <p className="text-[11px] text-[#777777] font-semibold">12 Premium Profile Viewers</p>
          </div>
          <button
            type="button"
            onClick={onOpenPaywall}
            className="px-3 py-1.5 rounded-full bg-[#2D2824] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-[#B89552] transition-colors whitespace-nowrap active:scale-95 shrink-0"
          >
            <Crown className="w-3.5 h-3.5 text-[#B89552]" />
            <span>Gold Member</span>
          </button>
        </div>

        <div className="w-12 h-12 rounded-full bg-[#F4EFE6] border border-[#E8E1D5] flex items-center justify-center mx-auto text-[#B89552] shadow-xs">
          <Eye className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#B89552]">
            RECENT PROFILE VISITORS
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
          className="w-full py-3.5 px-4 rounded-2xl bg-[#2D2824] text-white text-xs font-extrabold uppercase tracking-wider hover:bg-[#B89552] active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4 text-[#B89552]" />
          <span className="truncate">Unlock All 12 Profiles (₹1,999/mo)</span>
        </button>
      </div>

      {/* Viewers & Shortlisted Grid */}
      <div className="space-y-3 flex-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-serif-editorial font-bold text-[#111111]">Recent Profile Viewers</h3>
          <span className="text-xs text-[#B89552] font-bold">12 Total Views</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
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
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#2D2824]">
                  <img
                    src={profile.photos?.[0] || profile.creator_vouch?.creator_avatar_url}
                    alt={profile.display_name}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      isLocked ? 'blur-md scale-110 opacity-70' : 'group-hover:scale-105'
                    }`}
                  />

                  {/* Lock Overlay for Free Users */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-[#2D2824]/40 flex flex-col items-center justify-center text-white p-3 text-center backdrop-blur-xs">
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
