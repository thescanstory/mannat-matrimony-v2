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
    <div className="min-h-screen bg-[#F8F6F2] text-[#161412] w-full max-w-md mx-auto flex flex-col justify-start pb-44 select-none font-sans px-5 sm:px-6 pt-3 space-y-5">
      {/* Paywall Banner Card */}
      <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-[#E8DDD0] space-y-5 text-center shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#E8DDD0] pb-3.5">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-[#161412] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>For You</h1>
            <p className="text-[11px] text-[#6E6259] font-semibold">12 Premium Profile Viewers</p>
          </div>
          <button
            type="button"
            onClick={onOpenPaywall}
            className="px-3.5 py-1.5 rounded-full bg-[#560406] text-[#A17B5E] text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer hover:brightness-110 transition-colors whitespace-nowrap active:scale-95 shrink-0 border border-[#A17B5E]/30"
          >
            <Crown className="w-3.5 h-3.5 text-[#A17B5E]" />
            <span>VIP Member</span>
          </button>
        </div>

        <div className="w-14 h-14 rounded-full bg-[#560406]/10 border border-[#A17B5E]/30 flex items-center justify-center mx-auto text-[#560406] shadow-xs">
          <Eye className="w-7 h-7 text-[#560406]" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#560406]">
            RECENT PROFILE VISITORS
          </span>
          <h2 className="text-2xl font-bold text-[#161412]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Who's interested in your profile?
          </h2>
          <p className="text-xs text-[#6E6259] font-medium max-w-xs mx-auto leading-relaxed">
            Upgrade to Gold or Diamond to unlock clear photos, salary details, and direct contact numbers.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenPaywall}
          className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#730C0F] to-[#560406] text-[#F5E6D3] text-xs font-black uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap border border-[#A17B5E]/40"
        >
          <Sparkles className="w-4 h-4 text-[#D8B486]" />
          <span className="truncate">Unlock All 12 Profiles (₹1,999/mo)</span>
        </button>
      </div>

      {/* Viewers & Shortlisted Grid */}
      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold text-[#161412]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Recent Profile Viewers</h3>
          <span className="text-xs text-[#560406] font-bold">12 Total Views</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
                className="bg-white rounded-[28px] p-3.5 border border-[#E8DDD0] shadow-sm relative overflow-hidden space-y-2.5 cursor-pointer group hover:shadow-md transition-all"
              >
                {/* Image Container with optional Backdrop Blur */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#260102]">
                  <img
                    src={profile.photos?.[0] || profile.creator_vouch?.creator_avatar_url}
                    alt={profile.display_name}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      isLocked ? 'blur-md scale-110 opacity-70' : 'group-hover:scale-105'
                    }`}
                  />

                  {/* Lock Overlay for Free Users */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center text-white p-3 text-center backdrop-blur-xs">
                      <div className="w-10 h-10 rounded-full bg-[#560406] text-[#A17B5E] flex items-center justify-center shadow-lg mb-1 border border-[#A17B5E]/40">
                        <Lock className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-white">
                        VIP Only
                      </span>
                    </div>
                  )}

                  {!isLocked && (
                    <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow">
                      Unlocked
                    </span>
                  )}
                </div>

                {/* Info Footer */}
                <div className="space-y-0.5 text-left px-1">
                  <h4 className="text-sm font-bold text-[#161412] truncate" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                    {isLocked ? 'Verified Candidate' : profile.display_name}
                  </h4>
                  <p className="text-[11px] text-[#6E6259] font-semibold">
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
