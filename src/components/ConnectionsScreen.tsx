import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import type { Profile } from '../types';

interface ConnectionsScreenProps {
  profiles: Profile[];
  onOpenProfile: (profile: Profile) => void;
  onOpenFilters: () => void;
}

export const ConnectionsScreen: React.FC<ConnectionsScreenProps> = ({
  profiles,
  onOpenProfile,
  onOpenFilters
}) => {
  const [activeTab, setActiveTab] = useState<'Accepted' | 'Sent' | 'Received'>('Accepted');

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#111111] max-w-md mx-auto flex flex-col justify-between pb-28 select-none font-sans">
      {/* Top Header */}
      <div className="bg-[#FBF9F4] px-5 pt-6 pb-4 border-b border-[#E8E1D5] flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <h1 className="text-2xl font-serif-editorial font-bold text-[#111111] tracking-tight">Connections</h1>
        <button
          type="button"
          onClick={onOpenFilters}
          className="p-2.5 rounded-full bg-[#F4EFE6] hover:bg-[#E8E1D5] text-[#111111] transition-colors border border-[#E8E1D5] cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#111111]" />
        </button>
      </div>

      {/* Tabs Row */}
      <div className="bg-[#FBF9F4] px-5 border-b border-[#E8E1D5] flex items-center justify-around sticky top-[69px] z-20">
        {(['Accepted', 'Sent', 'Received'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`py-3.5 text-xs font-extrabold uppercase tracking-wider transition-all relative cursor-pointer ${
                isActive ? 'text-[#B89552]' : 'text-[#777777] hover:text-[#111111]'
              }`}
            >
              <span>{tab}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B89552] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content List */}
      <div className="p-4 space-y-4 flex-1 bg-[#FBF9F4]">
        {activeTab === 'Accepted' && (
          <div className="space-y-4">
            {profiles.slice(0, 2).map((profile) => (
              <div
                key={profile.id}
                onClick={() => onOpenProfile(profile)}
                className="bg-[#F4EFE6] rounded-3xl p-4 border border-[#E8E1D5] shadow-sm space-y-3 cursor-pointer hover:shadow-md transition-all text-left"
              >
                {/* Photo Header */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black">
                  <img
                    src={profile.photos?.[0] || profile.creator_vouch?.creator_avatar_url}
                    alt={profile.display_name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 text-[11px] font-extrabold text-[#B89552] bg-white px-3 py-1 rounded-full shadow border border-[#E8E1D5]">
                    Accepted by me
                  </span>
                </div>

                {/* Profile Brief */}
                <div>
                  <h3 className="text-xl font-serif-editorial font-bold text-[#111111]">{profile.display_name}</h3>
                  <p className="text-xs text-[#777777] font-semibold mt-0.5">
                    {profile.age}yrs, {profile.height || "5'6\""} • {profile.religion}
                  </p>
                  <p className="text-xs text-[#999999] mt-0.5">{profile.city}</p>
                </div>

                {/* Actions */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenProfile(profile);
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#111111] text-white text-xs font-extrabold uppercase tracking-wider hover:bg-[#B89552] active:scale-98 transition-all cursor-pointer shadow-sm"
                >
                  View Bio-data & Details
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Sent' && (
          <div className="space-y-4">
            {profiles.slice(1, 3).map((profile) => (
              <div
                key={profile.id}
                onClick={() => onOpenProfile(profile)}
                className="bg-[#F4EFE6] rounded-3xl p-4 border border-[#E8E1D5] shadow-sm space-y-3 cursor-pointer text-left"
              >
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black">
                  <img
                    src={profile.photos?.[0] || profile.creator_vouch?.creator_avatar_url}
                    alt={profile.display_name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 text-[11px] font-extrabold text-[#777777] bg-white px-3 py-1 rounded-full shadow border border-[#E8E1D5]">
                    Pending Response
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-serif-editorial font-bold text-[#111111]">{profile.display_name}</h3>
                  <p className="text-xs text-[#777777] font-semibold mt-0.5">
                    {profile.age}yrs • {profile.occupation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Received' && (
          <div className="space-y-4">
            {profiles.slice(0, 1).map((profile) => (
              <div
                key={profile.id}
                onClick={() => onOpenProfile(profile)}
                className="bg-[#F4EFE6] rounded-3xl p-4 border border-[#E8E1D5] shadow-sm space-y-3 cursor-pointer text-left"
              >
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black">
                  <img
                    src={profile.photos?.[0] || profile.creator_vouch?.creator_avatar_url}
                    alt={profile.display_name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 text-[11px] font-extrabold text-[#B89552] bg-white px-3 py-1 rounded-full shadow border border-[#E8E1D5]">
                    New Interest Request
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-serif-editorial font-bold text-[#111111]">{profile.display_name}</h3>
                  <p className="text-xs text-[#777777] font-semibold mt-0.5">
                    {profile.age}yrs • {profile.city}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="py-3 px-4 rounded-2xl bg-[#E8E1D5] text-[#111111] text-xs font-extrabold uppercase tracking-wider hover:bg-gray-300 active:scale-98 transition-all cursor-pointer"
                  >
                    Decline
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenProfile(profile);
                    }}
                    className="py-3 px-4 rounded-2xl bg-[#111111] text-white text-xs font-extrabold uppercase tracking-wider hover:bg-[#B89552] active:scale-98 transition-all cursor-pointer shadow-sm"
                  >
                    Accept Wave
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
