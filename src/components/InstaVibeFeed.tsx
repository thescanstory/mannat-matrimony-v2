import React, { useState, useRef } from 'react';
import { Search, Bell, ChevronRight, ChevronDown, ChevronUp, ArrowLeft, ShieldCheck, Play, Sparkles, ArrowUpRight, Heart, Share2, Image as ImageIcon, X, Volume2, VolumeX, MessageCircle, PhoneCall, Send, Lock, Info, Star, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Profile } from '../types';
import { Toast } from './Toast';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

interface InstaVibeFeedProps {
  profiles: Profile[];
  onOpenFilters: () => void;
  onOpenSharePortal: (profile: Profile) => void;
  onOpenPaywall: () => void;
  onOpenCreateProfile?: () => void;
  onUnlockSuccess?: (profileId: string) => void;
}

export const InstaVibeFeed: React.FC<InstaVibeFeedProps> = ({
  profiles,
  onOpenFilters,
  onOpenSharePortal,
  onOpenPaywall,
  onOpenCreateProfile
}) => {
  const [selectedDetailProfile, setSelectedDetailProfile] = useState<Profile | null>(null);
  const [likedProfiles, setLikedProfiles] = useState<Record<string, boolean>>({});
  const [expandedBios, setExpandedBios] = useState<Record<string, boolean>>({});
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<string | null>(null);
  const [connectModalProfile, setConnectModalProfile] = useState<Profile | null>(null);
  const [showMatchScoreTooltip, setShowMatchScoreTooltip] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'heart' | 'sparkle'>('success');
  const [isMuted, setIsMuted] = useState(true);
  const [pausedVideos, setPausedVideos] = useState<Record<string, boolean>>({});
  const [doubleTapHeart, setDoubleTapHeart] = useState<Record<string, boolean>>({});

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const triggerToast = (msg: string, type: 'success' | 'heart' | 'sparkle' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isLiked = !likedProfiles[id];
    setLikedProfiles((prev) => ({ ...prev, [id]: isLiked }));
    if (isLiked) {
      triggerToast('Added to your Saved Favorites! 💕', 'heart');
    }
  };

  const handleVideoTap = (id: string) => {
    const videoEl = videoRefs.current[id];
    if (videoEl) {
      if (videoEl.paused) {
        videoEl.play();
        setPausedVideos((prev) => ({ ...prev, [id]: false }));
      } else {
        videoEl.pause();
        setPausedVideos((prev) => ({ ...prev, [id]: true }));
      }
    }
  };

  const handleDoubleTapVideo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDoubleTapHeart((prev) => ({ ...prev, [id]: true }));
    setLikedProfiles((prev) => ({ ...prev, [id]: true }));
    triggerToast('Added to your Favorites! 💕', 'heart');
    setTimeout(() => {
      setDoubleTapHeart((prev) => ({ ...prev, [id]: false }));
    }, 900);
  };

  const toggleBioDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedBios((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Log Interest Wave to Supabase Database
  const handleSendWave = async (targetProfile: Profile) => {
    setConnectModalProfile(null);
    try {
      if (isSupabaseConfigured()) {
        await supabase.from('callback_requests').insert([
          {
            target_profile_id: targetProfile.id,
            status: 'wave_sent'
          }
        ]);
      }
      triggerToast(`Interest Wave Sent to ${targetProfile.display_name}! 👋`, 'sparkle');
    } catch {
      triggerToast(`Interest Wave Sent to ${targetProfile.display_name}! 👋`, 'sparkle');
    }
  };

  // Log Parent Callback Request to Supabase Database
  const handleRequestCallback = async (targetProfile: Profile) => {
    setConnectModalProfile(null);
    try {
      if (isSupabaseConfigured()) {
        await supabase.from('callback_requests').insert([
          {
            target_profile_id: targetProfile.id,
            status: 'callback_requested'
          }
        ]);
      }
      triggerToast(`Parent Callback Request Logged for ${targetProfile.display_name}! 📞`, 'success');
    } catch {
      triggerToast(`Parent Callback Request Logged for ${targetProfile.display_name}! 📞`, 'success');
    }
  };

  // Detailed profile view with interactive controls
  if (selectedDetailProfile) {
    const p = selectedDetailProfile;
    const isBioExpanded = expandedBios[p.id] ?? false;

    return (
      <div className="min-h-screen bg-[#FBF9F4] text-[#111111] max-w-md mx-auto flex flex-col justify-between pb-24 select-none relative font-sans">
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />

        {/* Full Screen Edge-to-Edge Vertical Video Hero */}
        <div
          className="relative w-full h-[580px] bg-[#111111] overflow-hidden cursor-pointer"
          onClick={() => handleVideoTap(p.id)}
          onDoubleClick={(e) => handleDoubleTapVideo(p.id, e)}
        >
          <video
            ref={(el) => { videoRefs.current[p.id] = el; }}
            src={p.bio_video_url}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Double Tap Heart Animation */}
          <AnimatePresence>
            {doubleTapHeart[p.id] && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.4, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
              >
                <Heart className="w-24 h-24 text-[#B89552] fill-[#B89552] drop-shadow-2xl" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pause Badge */}
          {pausedVideos[p.id] && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none z-30">
              <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-2xl">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
            </div>
          )}

          {/* Video Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none" />

          {/* Top Floating Header Controls */}
          <div className="absolute top-5 left-4 right-4 flex items-center justify-between z-30">
            <button
              type="button"
              onClick={() => setSelectedDetailProfile(null)}
              className="w-10 h-10 rounded-full bg-[#FBF9F4]/90 backdrop-blur-xl border border-[#E8E1D5] flex items-center justify-center text-[#111111] shadow-md hover:bg-white active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="w-10 h-10 rounded-full bg-[#FBF9F4]/90 backdrop-blur-xl border border-[#E8E1D5] flex items-center justify-center text-[#111111] shadow-md hover:bg-white active:scale-95 transition-all cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-gray-700" /> : <Volume2 className="w-5 h-5 text-[#B89552]" />}
              </button>
              <button
                type="button"
                onClick={(e) => toggleLike(p.id, e)}
                className={`w-10 h-10 rounded-full backdrop-blur-xl border flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer ${
                  likedProfiles[p.id]
                    ? 'bg-[#B89552] border-[#B89552] text-white shadow-md'
                    : 'bg-[#FBF9F4]/90 border-[#E8E1D5] text-[#111111] hover:bg-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${likedProfiles[p.id] ? 'fill-white' : ''}`} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSharePortal(p);
                }}
                className="w-10 h-10 rounded-full bg-[#FBF9F4]/90 backdrop-blur-xl border border-[#E8E1D5] flex items-center justify-center text-[#111111] shadow-md hover:bg-white active:scale-95 transition-all cursor-pointer"
              >
                <Share2 className="w-5 h-5 text-[#111111]" />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details Sheet */}
        <div className="p-6 bg-[#FBF9F4] text-[#111111] rounded-t-[36px] -mt-8 relative z-20 space-y-5 border-t border-[#E8E1D5]">
          <div className="flex items-center justify-between">
            <span className="font-instrument text-2xl lowercase text-[#B89552]">mannat</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#B89552] bg-[#F4EFE6] px-3 py-1 rounded-full border border-[#E8E1D5]">
              {p.compatibility_score}% MUTUAL MATCH
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-serif-editorial font-bold text-[#111111] tracking-tight flex items-center gap-2">
                <span>{p.display_name}</span>
                <span className="text-[#B89552] font-sans font-extrabold text-xl">· {p.age}</span>
              </h1>
              {p.is_vouched && (
                <span className="text-xs font-black text-[#B89552] bg-[#F4EFE6] px-3.5 py-1.5 rounded-full border border-[#E8E1D5] flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-[#B89552]" />
                  <span>Vouched</span>
                </span>
              )}
            </div>

            <p className="text-xs text-[#777777] font-bold mt-1 flex items-center gap-2">
              <span>{p.height || "5'6\""}</span>
              <span>•</span>
              <span>{p.religion}</span>
              <span>•</span>
              <span className="text-[#111111] font-extrabold">{p.occupation}</span>
            </p>
          </div>

          {/* Contact Details Paywall Card */}
          <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E1D5] flex items-center justify-between shadow-sm">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#B89552] block">
                VERIFIED CONTACT NUMBER
              </span>
              <span className="text-xs font-mono font-bold text-gray-500 blur-xs select-none">
                +91 98765 *****
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenPaywall}
              className="px-4 py-2 rounded-full bg-[#111111] text-white text-xs font-extrabold flex items-center gap-1.5 shadow hover:bg-[#B89552] transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#B89552]" />
              <span>Unlock Phone</span>
            </button>
          </div>

          {/* 3 Small Picture Placeholders Below Video */}
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#B89552] flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photo Gallery (3 Pictures)</span>
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {(p.photos || [
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80'
              ]).map((photoUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedPhotoPreview(photoUrl)}
                  className="aspect-square rounded-2xl overflow-hidden border border-[#E8E1D5] bg-[#F4EFE6] hover:opacity-90 active:scale-95 transition-all shadow-sm group cursor-pointer relative"
                >
                  <img
                    src={photoUrl}
                    alt={`${p.display_name} photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Collapsible Profile Description Dropdown */}
          <div className="border-t border-[#E8E1D5] pt-3">
            <button
              type="button"
              onClick={(e) => toggleBioDropdown(p.id, e)}
              className="w-full py-3 px-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E1D5] flex items-center justify-between text-xs font-extrabold text-[#111111] hover:bg-[#E8E1D5] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="font-serif-editorial text-sm">About & Bio Description</span>
              </div>
              {isBioExpanded ? <ChevronUp className="w-4 h-4 text-[#B89552]" /> : <ChevronDown className="w-4 h-4 text-[#777777]" />}
            </button>

            {isBioExpanded && (
              <div className="mt-3 p-4 rounded-2xl bg-white border border-[#E8E1D5] space-y-3 animate-fadeIn shadow-sm">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-[#B89552] block mb-1">
                    Personal Bio
                  </span>
                  <p className="text-xs text-[#555555] font-medium leading-relaxed">
                    {p.bio_text || 'No bio text provided yet.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Connect Action CTA Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setConnectModalProfile(p)}
              className="w-full py-4 px-6 rounded-full bg-[#111111] text-white font-extrabold text-xs tracking-wider uppercase shadow-md hover:bg-[#B89552] active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Connect Now</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Home Dashboard Feed
  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#111111] max-w-md mx-auto flex flex-col justify-between pb-28 select-none font-sans relative">
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />

      {/* Interactive Connect Action Sheet Modal */}
      <AnimatePresence>
        {connectModalProfile && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-sm bg-[#FBF9F4] rounded-3xl p-6 border border-[#E8E1D5] shadow-2xl space-y-5 text-[#111111]"
            >
              <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-3">
                <div>
                  <span className="font-instrument text-2xl lowercase text-[#B89552] block">mannat</span>
                  <h3 className="text-lg font-serif-editorial font-bold text-[#111111]">
                    Connect with {connectModalProfile.display_name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setConnectModalProfile(null)}
                  className="p-2 rounded-full hover:bg-[#F4EFE6] text-gray-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleSendWave(connectModalProfile)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#111111] hover:bg-[#B89552] text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Interest Wave 👋</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setConnectModalProfile(null);
                    onOpenSharePortal(connectModalProfile);
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E1D5] hover:bg-[#E8E1D5] text-[#111111] text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#B89552]" />
                  <span>View Family Bio-data Portal</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRequestCallback(connectModalProfile)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E1D5] hover:bg-[#E8E1D5] text-[#111111] text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-[#B89552]" />
                  <span>Request Parent Callback</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Photo Preview Modal */}
      {selectedPhotoPreview && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setSelectedPhotoPreview(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedPhotoPreview}
            alt="Expanded preview"
            className="max-w-full max-h-[75vh] object-contain rounded-2xl border-2 border-white/20 shadow-2xl"
          />
        </div>
      )}

      {/* Top Header */}
      <div className="bg-[#FBF9F4] px-5 pt-6 pb-4 border-b border-[#E8E1D5] sticky top-0 z-40 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <span className="font-instrument text-4xl lowercase text-[#B89552] tracking-tight">mannat</span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenCreateProfile && (
            <button
              type="button"
              onClick={onOpenCreateProfile}
              className="px-3 py-1.5 rounded-full bg-[#111111] hover:bg-[#B89552] text-white transition-all text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-[#B89552]" />
              <span>+ Add Profile</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              onOpenFilters();
              triggerToast('Opening Search Partner Filters...', 'sparkle');
            }}
            className="p-2.5 rounded-full bg-[#F4EFE6] hover:bg-[#E8E1D5] text-[#111111] transition-colors border border-[#E8E1D5] cursor-pointer shadow-xs"
            title="Search & Filters"
          >
            <Search className="w-4 h-4 text-[#111111]" />
          </button>
          <button
            type="button"
            onClick={() => triggerToast('You have 3 New Verified Intros today! ✨', 'sparkle')}
            className="p-2.5 rounded-full bg-[#F4EFE6] hover:bg-[#E8E1D5] text-[#111111] transition-colors relative border border-[#E8E1D5] cursor-pointer shadow-xs"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-[#111111]" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#B89552] border-2 border-[#FBF9F4] animate-pulse" />
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="p-5">
        <div className="bg-[#F4EFE6] rounded-[28px] p-6 text-[#111111] text-left space-y-3.5 relative overflow-hidden border border-[#E8E1D5] shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#B89552] bg-white px-3.5 py-1 rounded-full border border-[#E8E1D5] inline-block shadow-xs">
            INTENTION-FIRST MATCHMAKING
          </span>

          <h3 className="text-2xl sm:text-3xl font-serif-editorial font-bold tracking-tight leading-tight text-[#111111]">
            Curated, vetted & intention-first.
          </h3>

          <p className="text-xs text-[#666666] max-w-xs leading-relaxed font-medium">
            Explore verified vertical video profiles of partners seeking marriage.
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                onOpenFilters();
                triggerToast('Filtering Introductions...', 'sparkle');
              }}
              className="px-5 py-3 rounded-full bg-[#111111] text-white font-extrabold text-xs tracking-wider uppercase hover:bg-[#B89552] active:scale-95 transition-all duration-200 flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#B89552]" />
              <span>Filter Intros</span>
            </button>
            {onOpenCreateProfile && (
              <button
                type="button"
                onClick={onOpenCreateProfile}
                className="px-4 py-3 rounded-full bg-white text-[#111111] border border-[#E8E1D5] font-extrabold text-xs tracking-wider uppercase hover:bg-[#E8E1D5] active:scale-95 transition-all duration-200 flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#B89552]" />
                <span>Create Bio-data</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Vertical Video Profiles List */}
      <div className="px-5 space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif-editorial font-bold text-[#111111] tracking-tight">Curated Intros</h3>
            <p className="text-[11px] text-[#777777] font-bold">Verified Vertical Stream</p>
          </div>
          <button
            type="button"
            onClick={onOpenFilters}
            className="text-xs font-extrabold text-[#B89552] hover:underline flex items-center gap-0.5 bg-[#F4EFE6] px-3.5 py-1.5 rounded-full border border-[#E8E1D5] cursor-pointer"
          >
            <span>Filter</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#B89552]" />
          </button>
        </div>

        {/* Vertical Video Cards */}
        <div className="grid grid-cols-1 gap-6 pb-6">
          {profiles.map((profile) => {
            const isBioExpanded = expandedBios[profile.id] ?? false;
            const isSpotlight = profile.is_spotlight;

            return (
              <div
                key={profile.id}
                onClick={() => setSelectedDetailProfile(profile)}
                className={`bg-white rounded-[32px] overflow-hidden border shadow-sm cursor-pointer hover:shadow-xl transition-all duration-300 group p-3 space-y-3 relative ${
                  isSpotlight ? 'border-2 border-[#B89552] shadow-xl ring-2 ring-[#B89552]/20' : 'border-[#E8E1D5]'
                }`}
              >
                {/* Spotlight Badge Header */}
                {isSpotlight && (
                  <div className="bg-[#B89552] text-white text-[10px] font-black uppercase tracking-widest py-1 px-4 text-center rounded-full shadow-sm flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-white" />
                    <span>MANNAT SPOTLIGHT BOOSTED (TOP OF FEED)</span>
                  </div>
                )}

                {/* Full-bleed Tall Vertical 9:16 / h-[480px] Video Stream */}
                <div
                  className="relative w-full h-[480px] bg-black rounded-[24px] overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVideoTap(profile.id);
                  }}
                  onDoubleClick={(e) => handleDoubleTapVideo(profile.id, e)}
                >
                  <video
                    ref={(el) => { videoRefs.current[profile.id] = el; }}
                    src={profile.bio_video_url}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Double Tap Floating Heart */}
                  <AnimatePresence>
                    {doubleTapHeart[profile.id] && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.4, opacity: 1 }}
                        exit={{ scale: 2, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
                      >
                        <Heart className="w-24 h-24 text-[#B89552] fill-[#B89552] drop-shadow-2xl" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Pause Overlay Indicator */}
                  {pausedVideos[profile.id] && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none z-30">
                      <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-2xl">
                        <Play className="w-8 h-8 fill-white ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Video Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                    {/* eMatchMaker 2-Way Match Score Pill */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMatchScoreTooltip(showMatchScoreTooltip === profile.id ? null : profile.id);
                      }}
                      className="bg-[#FBF9F4]/95 backdrop-blur-xl px-3.5 py-1.5 rounded-full text-xs font-extrabold text-[#B89552] shadow-md border border-[#E8E1D5] flex items-center gap-1.5 cursor-pointer hover:bg-white transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#B89552]" />
                      <span>{profile.compatibility_score}% Match · You match each other</span>
                      <Info className="w-3 h-3 text-[#B89552] ml-0.5" />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMuted(!isMuted);
                        }}
                        className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white shadow-md hover:bg-black/60 active:scale-95 transition-all cursor-pointer"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-[#B89552]" />}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => toggleLike(profile.id, e)}
                        className={`w-10 h-10 rounded-full backdrop-blur-xl border flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer ${
                          likedProfiles[profile.id]
                            ? 'bg-[#B89552] border-[#B89552] text-white'
                            : 'bg-[#FBF9F4]/90 border-[#E8E1D5] text-[#111111] hover:bg-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${likedProfiles[profile.id] ? 'fill-white' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Mutual Match Score Breakdown Tooltip */}
                  {showMatchScoreTooltip === profile.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-14 left-4 right-4 z-40 bg-[#111111] text-white p-4 rounded-2xl border border-[#B89552]/40 shadow-2xl space-y-2 text-xs animate-fadeIn"
                    >
                      <div className="flex items-center justify-between pb-1 border-b border-gray-700">
                        <span className="font-serif-editorial text-sm font-bold text-[#B89552]">eMatchMaker 2-Way Score</span>
                        <button type="button" onClick={() => setShowMatchScoreTooltip(null)} className="text-gray-400">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-gray-300">You meet {profile.display_name}'s criteria:</span>
                          <span className="font-bold text-emerald-400">100% (Age, Religion, Diet)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">{profile.display_name} meets your criteria:</span>
                          <span className="font-bold text-emerald-400">96% (Income, City, Education)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bottom Overlay Info & Action Button */}
                  <div className="absolute bottom-4 left-4 right-4 z-20 space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-2xl font-serif-editorial font-bold text-white tracking-tight drop-shadow-md">
                          {profile.display_name} · {profile.age}
                        </h4>
                        {profile.is_vouched && (
                          <span className="text-[10px] font-black text-[#B89552] bg-[#FBF9F4] px-2.5 py-0.5 rounded-full border border-[#E8E1D5]">
                            Vouched
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-200 font-semibold drop-shadow-sm">
                        {profile.height || "5'6\""} • {profile.religion} • <span className="text-white font-bold">{profile.occupation}</span>
                      </p>
                      <p className="text-[11px] text-gray-300 font-medium">📍 {profile.city}, India</p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConnectModalProfile(profile);
                      }}
                      className="w-full py-3.5 px-6 rounded-2xl bg-[#111111] hover:bg-[#B89552] text-white text-xs font-extrabold uppercase tracking-wider active:scale-98 transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <span>Connect Now</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 3 Small Picture Placeholders Below Video */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#B89552] flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      <span>Photos (3)</span>
                    </span>
                    <span className="text-[10px] text-[#777777] font-semibold">Click to preview</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(profile.photos || [
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
                      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80'
                    ]).map((photoUrl, idx) => (
                      <div
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPhotoPreview(photoUrl);
                        }}
                        className="aspect-square rounded-xl overflow-hidden border border-[#E8E1D5] bg-[#F4EFE6] hover:opacity-90 active:scale-95 transition-all shadow-sm relative group cursor-pointer"
                      >
                        <img
                          src={photoUrl}
                          alt={`${profile.display_name} thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Collapsible Profile Description Dropdown */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={(e) => toggleBioDropdown(profile.id, e)}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-[#F4EFE6] border border-[#E8E1D5] flex items-center justify-between text-xs font-extrabold text-[#111111] hover:bg-[#E8E1D5] transition-all cursor-pointer"
                  >
                    <span className="font-serif-editorial text-sm">About & Bio Description</span>
                    {isBioExpanded ? <ChevronUp className="w-4 h-4 text-[#B89552]" /> : <ChevronDown className="w-4 h-4 text-[#777777]" />}
                  </button>

                  {isBioExpanded && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 p-3.5 rounded-xl bg-[#FBF9F4] border border-[#E8E1D5] space-y-2.5 text-left shadow-inner animate-fadeIn"
                    >
                      <div>
                        <span className="text-[10px] uppercase font-black tracking-wider text-[#B89552] block mb-0.5">
                          Personal Bio
                        </span>
                        <p className="text-xs text-[#555555] font-medium leading-relaxed">
                          {profile.bio_text || 'Design lead by day, classical dancer by weekend. Looking for an empathetic, ambitious partner.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
