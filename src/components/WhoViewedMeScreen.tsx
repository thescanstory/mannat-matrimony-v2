import React from 'react';
import { Lock, Crown, Sparkles } from 'lucide-react';
import type { Profile } from '../types';
import { nativeService } from '../services/nativeService';

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
    <div className="min-h-screen bg-[#F8F6F2] text-[#161412] w-full max-w-7xl mx-auto flex flex-col justify-start pb-32 md:pb-20 select-none font-sans px-4 sm:px-6 lg:px-8 pt-3 space-y-5">
      {/* Paywall Banner Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E8DDD0] shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-1.5 text-left max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#560406] bg-[#560406]/10 px-2.5 py-0.5 rounded-full border border-[#A17B5E]/30">
                Recent Profile Visitors
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#560406] text-[#A17B5E] text-[10px] font-bold flex items-center gap-1 shadow-xs border border-[#A17B5E]/30">
                <Crown className="w-2.5 h-2.5 text-[#A17B5E]" />
                <span>VIP Priority</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#161412] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Who's interested in your profile?
            </h1>
            <p className="text-xs text-[#6E6259] font-medium leading-relaxed">
              12 Premium verified candidates recently viewed your dossier. Upgrade to Gold or Diamond to unlock unblurred high-resolution photos, financial bio-data, and direct contact numbers.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                nativeService.haptic.medium();
                onOpenPaywall();
              }}
              className="py-3 px-5 rounded-xl bg-gradient-to-r from-[#730C0F] to-[#560406] text-[#F5E6D3] text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap border border-[#A17B5E]/40"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D8B486]" />
              <span>Unlock All 12 Profiles (From ₹1,499)</span>
            </button>
            <p className="text-[10px] text-center text-[#6E6259]">Instant unblur &amp; direct concierge access</p>
          </div>
        </div>
      </div>

      {/* Viewers & Shortlisted Grid */}
      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl font-bold text-[#161412]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Recent Profile Viewers</h3>
          <span className="text-xs text-[#560406] font-bold">12 Total Views</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
