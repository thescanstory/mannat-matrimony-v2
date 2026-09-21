import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft, ShieldCheck, Play, Sparkles, ArrowUpRight, Heart, Share2, Image as ImageIcon, X, Volume2, VolumeX, User, Send, Lock, Info, RefreshCw, CheckCircle2, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Profile } from '../types';
import { Toast } from './Toast';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { ReportBlockModal } from './ReportBlockModal';
import { nativeService } from '../services/nativeService';

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
  onOpenSharePortal,
  onOpenPaywall
}) => {
  const [selectedDetailProfile, setSelectedDetailProfile] = useState<Profile | null>(null);
  const [reportModalProfile, setReportModalProfile] = useState<Profile | null>(null);
  const [blockedProfileIds, setBlockedProfileIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('mannat_blocked_profiles');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [likedProfiles, setLikedProfiles] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem('mannat_favorites');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [expandedBios, setExpandedBios] = useState<Record<string, boolean>>({});
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<string | null>(null);
  const [connectModalProfile, setConnectModalProfile] = useState<Profile | null>(null);
  const [showMatchScoreTooltip, setShowMatchScoreTooltip] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'heart' | 'sparkle'>('success');
  const [isMuted, setIsMuted] = useState(true);
  const [pausedVideos, setPausedVideos] = useState<Record<string, boolean>>({});
  const [doubleTapHeart, setDoubleTapHeart] = useState<Record<string, boolean>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartYRef = useRef(0);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 5) {
      touchStartYRef.current = e.touches[0].clientY;
    } else {
      touchStartYRef.current = 0;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartYRef.current > 0 && window.scrollY <= 5 && !isRefreshing) {
      const currentY = e.touches[0].clientY;
      const diff = currentY - touchStartYRef.current;
      if (diff > 0) {
        setPullDistance(Math.min(diff * 0.45, 80));
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 45 && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(50);
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
        triggerToast('Profiles Refreshed ✨', 'sparkle');
      }, 900);
    } else {
      setPullDistance(0);
    }
    touchStartYRef.current = 0;
  };

  const triggerToast = (msg: string, type: 'success' | 'heart' | 'sparkle' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isLiked = !likedProfiles[id];
    const updated = { ...likedProfiles, [id]: isLiked };
    setLikedProfiles(updated);
    try {
      localStorage.setItem('mannat_favorites', JSON.stringify(updated));
    } catch (err) {
      console.warn('Error saving favorites:', err);
    }
    if (isLiked) {
      triggerToast('Added to your Saved Favorites! 💕', 'heart');
    } else {
      triggerToast('Removed from Saved Favorites', 'success');
    }
  };

  const toggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    Object.values(videoRefs.current).forEach((v) => {
      if (v) {
        v.muted = nextMuted;
        v.volume = 1.0;
      }
    });
    triggerToast(nextMuted ? 'Sound Muted 🔇' : 'Sound Enabled 🔊', 'sparkle');
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
    const updated = { ...likedProfiles, [id]: true };
    setLikedProfiles(updated);
    try {
      localStorage.setItem('mannat_favorites', JSON.stringify(updated));
    } catch (err) {
      console.warn('Error saving favorites:', err);
    }
    triggerToast('Added to your Favorites! 💕', 'heart');
    setTimeout(() => {
      setDoubleTapHeart((prev) => ({ ...prev, [id]: false }));
    }, 900);
  };

  const toggleBioDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedBios((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Log Interest Wave to Supabase Database & Persistent Storage
  const handleSendWave = async (targetProfile: Profile) => {
    setConnectModalProfile(null);
    try {
      const stored = localStorage.getItem('mannat_sent_waves');
      const list: Profile[] = stored ? JSON.parse(stored) : [];
      if (!list.some(p => p.id === targetProfile.id)) {
        list.unshift(targetProfile);
        localStorage.setItem('mannat_sent_waves', JSON.stringify(list));
      }
    } catch (e) {
      console.warn('Local wave save error:', e);
    }

    try {
      if (isSupabaseConfigured() && targetProfile.id.includes('-') && targetProfile.id.length >= 32) {
        await supabase.from('callback_requests').insert([
          {
            target_profile_id: targetProfile.id,
            status: 'wave_sent'
          }
        ]);
      }
    } catch (e) {
      console.warn('Supabase wave insert fallback:', e);
    }
    triggerToast(`Interest Wave Sent to ${targetProfile.display_name}! 👋`, 'sparkle');
  };

  // Detailed profile view with luxury editorial layout
  if (selectedDetailProfile) {
    const p = selectedDetailProfile;
    const isBioExpanded = expandedBios[p.id] ?? false;

    return (
      <div className="min-h-screen bg-[#F8F6F2] text-[#161412] w-full max-w-md md:max-w-4xl lg:max-w-5xl mx-auto flex flex-col justify-between pb-24 select-none relative font-sans">
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />

        {/* Full Screen Edge-to-Edge Vertical Video Hero */}
        <div
          className="relative w-full h-[580px] bg-[#161412] overflow-hidden cursor-pointer"
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
            className={`w-full h-full object-cover ${(p.lifestyle_details as any)?.video_mirrored ? 'scale-x-[-1]' : ''}`}
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
                <Heart className="w-24 h-24 text-[#A17B5E] fill-[#A17B5E] drop-shadow-2xl" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pause Badge */}
          {pausedVideos[p.id] && (
            <div className="absolute inset-0 bg-[#260102]/40 flex items-center justify-center pointer-events-none z-30">
              <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-2xl">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
            </div>
          )}

          {/* Video Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none" />

          {/* Top Floating Header Controls */}
          <div className="absolute top-5 left-4 right-4 flex items-center justify-between z-30">
            <button
              type="button"
              onClick={() => setSelectedDetailProfile(null)}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-xl border border-[#E8DDD0] flex items-center justify-center text-[#161412] shadow-md hover:bg-white active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-[#560406]" />
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleSound}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-xl border border-[#E8DDD0] flex items-center justify-center text-[#161412] shadow-md hover:bg-white active:scale-95 transition-all cursor-pointer"
                title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-[#6E6259]" /> : <Volume2 className="w-4 h-4 text-[#560406]" />}
              </button>
              <button
                type="button"
                onClick={(e) => toggleLike(p.id, e)}
                className={`w-10 h-10 rounded-full backdrop-blur-xl border flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer ${
                  likedProfiles[p.id]
                    ? 'bg-[#560406] border-[#560406] text-[#A17B5E] shadow-md'
                    : 'bg-white/90 border-[#E8DDD0] text-[#161412] hover:bg-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${likedProfiles[p.id] ? 'fill-[#A17B5E]' : 'text-[#560406]'}`} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSharePortal(p);
                }}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-xl border border-[#E8DDD0] flex items-center justify-center text-[#161412] shadow-md hover:bg-white active:scale-95 transition-all cursor-pointer"
                title="Share Bio-Data"
              >
                <Share2 className="w-4 h-4 text-[#161412]" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setReportModalProfile(p);
                }}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-xl border border-[#E8DDD0] flex items-center justify-center text-rose-700 shadow-md hover:bg-white active:scale-95 transition-all cursor-pointer"
                title="Report or Block Candidate"
              >
                <Flag className="w-4 h-4 text-rose-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details Sheet */}
        <div className="p-6 bg-[#F8F6F2] text-[#161412] rounded-t-[36px] -mt-8 relative z-20 space-y-5 border-t border-[#E8DDD0] shadow-2xl">
          <div className="flex items-center justify-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#560406] bg-white px-3.5 py-1.5 rounded-full border border-[#E8DDD0] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#560406]" />
              {p.compatibility_score}% MUTUAL MATCH
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-[#161412] tracking-tight flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                <span>{p.display_name}</span>
                <span className="text-[#A17B5E] font-sans font-extrabold text-xl">· {p.age}</span>
              </h1>
              {p.is_vouched && (
                <span className="text-xs font-black text-[#560406] bg-white px-3.5 py-1.5 rounded-full border border-[#E8DDD0] flex items-center gap-1.5 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-[#A17B5E]" />
                  <span>Vouched</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-xs text-[#6E6259] font-bold bg-white px-2.5 py-1 rounded-md border border-[#E8DDD0]">
                📏 {p.height || "5'6\""}
              </span>
              <span className="text-xs text-[#6E6259] font-bold bg-white px-2.5 py-1 rounded-md border border-[#E8DDD0]">
                🙏 {p.religion} {p.sub_community ? `· ${p.sub_community}` : ''}
              </span>
              <span className="text-xs text-[#161412] font-extrabold bg-white px-2.5 py-1 rounded-md border border-[#E8DDD0]">
                📍 {p.city}
              </span>
            </div>
          </div>

          {/* Privacy Locked Salary & Credentials Pill */}
          <div className="p-4 rounded-2xl bg-white border border-[#E8DDD0] flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#560406] block">
                ANNUAL INCOME & DOSSIER
              </span>
              <span className="text-xs font-mono font-bold text-[#6E6259] blur-xs select-none">
                ₹50,00,000 - ₹75,00,000 / yr
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenPaywall}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#730C0F] to-[#560406] hover:brightness-110 text-[#F5E6D3] text-xs font-extrabold flex items-center gap-1.5 shadow transition-all cursor-pointer border border-[#A17B5E]/40"
            >
              <Lock className="w-3.5 h-3.5 text-[#D8B486]" />
              <span>Unlock Info</span>
            </button>
          </div>

          {/* 3 Small Picture Placeholders Below Video */}
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#C5A059] flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photo Gallery (3 Pictures)</span>
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {(p.photos || []).map((photoUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedPhotoPreview(photoUrl)}
                  className="aspect-square rounded-2xl overflow-hidden border border-[#EADBCE] bg-[#F6F2E9] hover:opacity-90 active:scale-95 transition-all shadow-xs group cursor-pointer relative"
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
          <div className="border-t border-[#EADBCE] pt-3">
            <button
              type="button"
              onClick={(e) => toggleBioDropdown(p.id, e)}
              className="w-full py-3 px-4 rounded-2xl bg-white border border-[#EADBCE] flex items-center justify-between text-xs font-extrabold text-[#161412] hover:bg-[#F6F2E9] transition-all cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-serif-editorial text-sm">About & Bio Description</span>
              </div>
              {isBioExpanded ? <ChevronUp className="w-4 h-4 text-[#C5A059]" /> : <ChevronDown className="w-4 h-4 text-[#7E776F]" />}
            </button>

            {isBioExpanded && (
              <div className="mt-3 p-4 rounded-2xl bg-white border border-[#EADBCE] space-y-3 animate-fadeIn shadow-xs">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-[#C5A059] block mb-1">
                    Personal Bio
                  </span>
                  <p className="text-xs text-[#55504A] font-medium leading-relaxed">
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
              className="w-full py-3 px-5 rounded-2xl btn-vara-gold text-white font-extrabold text-xs tracking-wider uppercase shadow-md active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Connect Now</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Home Dashboard Feed
  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen bg-[#F8F6F2] text-[#161412] w-full max-w-7xl mx-auto flex flex-col justify-start pb-32 md:pb-20 select-none font-sans relative px-4 sm:px-6 lg:px-8"
    >
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />

      {/* Pull to Refresh Visual Indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div
          style={{ height: `${Math.max(pullDistance, isRefreshing ? 52 : 0)}px` }}
          className="w-full flex items-center justify-center overflow-hidden transition-all duration-150 py-2"
        >
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#560406] bg-white px-5 py-2 rounded-full border border-[#E8DDD0] shadow-sm">
            <RefreshCw className={`w-3.5 h-3.5 text-[#A17B5E] ${isRefreshing ? 'animate-spin' : ''}`} style={{ transform: `rotate(${pullDistance * 4}deg)` }} />
            <span>{isRefreshing ? 'Refreshing Profiles...' : pullDistance > 45 ? 'Release to Refresh' : 'Pull to Refresh'}</span>
          </div>
        </div>
      )}

      {/* Interactive Connect Action Sheet Modal */}
      <AnimatePresence>
        {connectModalProfile && (
          <div className="fixed inset-0 z-[70] bg-[#2D2824]/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-sm bg-[#FAF8F5] rounded-3xl p-6 border border-[#EADBCE] shadow-2xl space-y-4 text-[#161412] mb-2"
            >
              <div className="flex items-center justify-between border-b border-[#EADBCE] pb-3">
                <h3 className="text-lg font-serif-editorial font-bold text-[#161412]">
                  Connect with {connectModalProfile.display_name}
                </h3>
                <button
                  type="button"
                  onClick={() => setConnectModalProfile(null)}
                  className="p-2 rounded-full hover:bg-[#F6F2E9] text-[#7E776F] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleSendWave(connectModalProfile)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#161412] hover:bg-[#C5A059] active:scale-95 text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md whitespace-nowrap"
                >
                  <Send className="w-4 h-4 text-[#DFBE7E]" />
                  <span className="whitespace-nowrap">Send Interest Wave 👋</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setConnectModalProfile(null);
                    onOpenSharePortal(connectModalProfile);
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white border border-[#EADBCE] hover:bg-[#F6F2E9] active:scale-95 text-[#161412] text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <User className="w-4 h-4 text-[#C5A059]" />
                  <span className="whitespace-nowrap truncate">View Full Profile</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Photo Preview Modal */}
      {selectedPhotoPreview && (
        <div className="fixed inset-0 z-50 bg-[#2D2824]/85 backdrop-blur-md flex flex-col items-center justify-center p-4">
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

      {/* Hero Banner (First-time Login / Introductory Slide-Out to Left) */}
      {/* Recommended Vertical Video Profiles List */}
      <div className="px-4 sm:px-5 flex-1 pt-3">
        {(() => {
          const visibleProfiles = profiles.filter((p) => !blockedProfileIds.includes(p.id));
          if (visibleProfiles.length === 0) {
            return (
              <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-[#E8DDD0] shadow-xs text-center space-y-5 my-6">
                <div className="w-16 h-16 rounded-full bg-[#560406]/10 text-[#560406] flex items-center justify-center mx-auto shadow-inner border border-[#A17B5E]/30">
                  <Sparkles className="w-8 h-8 text-[#A17B5E]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif-editorial font-bold text-[#161412]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>No Candidate Profiles Yet</h3>
                  <p className="text-xs text-[#6E6259] max-w-xs mx-auto leading-relaxed">
                    As new users register, complete their bio-data, and upload video intros, their verified profiles will appear here in real-time.
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pb-12 max-w-7xl mx-auto">
              {visibleProfiles.map((profile) => {
                const isBioExpanded = expandedBios[profile.id] ?? false;

                return (
                  <div
                    key={profile.id}
                    onClick={() => {
                      nativeService.haptic.light();
                      setSelectedDetailProfile(profile);
                    }}
                    className="bg-white rounded-[32px] overflow-hidden border border-[#E8DDD0] shadow-sm cursor-pointer hover:shadow-md transition-all duration-300 group p-4 sm:p-5 space-y-4 relative"
                  >
                    {/* Full-bleed Tall Vertical 9:16 / h-[490px] Video Stream */}
                    <div
                      className="relative w-full h-[490px] bg-[#260102] rounded-[26px] overflow-hidden cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVideoTap(profile.id);
                      }}
                      onDoubleClick={(e) => handleDoubleTapVideo(profile.id, e)}
                    >
                      <video
                        ref={(el) => { videoRefs.current[profile.id] = el; }}
                        src={profile.bio_video_url}
                        poster={profile.photos?.[0]}
                        autoPlay
                        loop
                        muted={isMuted}
                        playsInline
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${(profile.lifestyle_details as any)?.video_mirrored ? 'scale-x-[-1]' : ''}`}
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
                            <Heart className="w-24 h-24 text-[#A17B5E] fill-[#A17B5E] drop-shadow-2xl" />
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
                          className="bg-white/95 backdrop-blur-xl px-4 py-2 rounded-full text-xs font-black text-[#560406] shadow-md border border-[#E8DDD0] flex items-center gap-1.5 cursor-pointer hover:bg-white transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#A17B5E]" />
                          <span>{profile.compatibility_score}% Match</span>
                          <Info className="w-3 h-3 text-[#6E6259] ml-0.5" />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={toggleSound}
                            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-xl border border-white/40 flex items-center justify-center text-white shadow-md hover:bg-black/70 active:scale-95 transition-all cursor-pointer"
                            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                          >
                            {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-[#A17B5E]" />}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              nativeService.haptic.light();
                              toggleLike(profile.id, e);
                            }}
                            className={`w-10 h-10 rounded-full backdrop-blur-xl border flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer ${
                              likedProfiles[profile.id]
                                ? 'bg-[#560406] border-[#560406] text-[#A17B5E]'
                                : 'bg-white/90 border-[#E8DDD0] text-[#560406] hover:bg-white'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${likedProfiles[profile.id] ? 'fill-[#A17B5E]' : 'text-[#560406]'}`} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              nativeService.haptic.light();
                              setReportModalProfile(profile);
                            }}
                            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-xl border border-white/40 flex items-center justify-center text-rose-300 shadow-md hover:bg-black/70 active:scale-95 transition-all cursor-pointer"
                            title="Report or Block Candidate"
                          >
                            <Flag className="w-4 h-4 text-rose-300" />
                          </button>
                        </div>
                      </div>

                  {/* Mutual Match Score Breakdown Tooltip */}
                  {showMatchScoreTooltip === profile.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-16 left-4 right-4 z-40 bg-[#161412] text-white p-5 rounded-2xl border border-[#A17B5E]/40 shadow-2xl space-y-2.5 text-xs animate-fadeIn"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-gray-700">
                        <span className="font-serif-editorial text-sm font-bold text-[#A17B5E]">eMatchMaker 2-Way Score</span>
                        <button type="button" onClick={() => setShowMatchScoreTooltip(null)} className="text-gray-400 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-1.5 text-[11px]">
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
                  <div className="absolute bottom-4 left-4 right-4 z-20 space-y-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-2xl font-serif-editorial font-bold text-white tracking-tight drop-shadow-md" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                          {profile.display_name} · {profile.age}
                        </h4>
                        {profile.is_vouched && (
                          <span className="text-[10px] font-black text-[#560406] bg-white px-3 py-0.5 rounded-full border border-[#E8DDD0]">
                            Vouched
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-200 font-semibold drop-shadow-sm flex items-center gap-1.5">
                        <span>{profile.height || "5'6\""}</span>
                        <span>•</span>
                        <span>{profile.religion}</span>
                        <span>•</span>
                        <span className="text-white font-bold">{profile.occupation}</span>
                      </p>
                      <p className="text-[11px] text-gray-300 font-medium">📍 {profile.city}, India</p>
                    </div>

                    <div className="flex items-center gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDetailProfile(profile);
                        }}
                        className="flex-1 py-3 px-4 rounded-xl bg-white hover:bg-[#F8F6F2] text-[#560406] text-xs font-black uppercase tracking-wider active:scale-98 transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md border border-[#E8DDD0] cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#A17B5E]" />
                        <span>View Bio-Data</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#560406]" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConnectModalProfile(profile);
                        }}
                        className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#730C0F] to-[#560406] text-[#F5E6D3] text-xs font-black uppercase tracking-wider active:scale-98 transition-all duration-200 flex items-center justify-center gap-1 shadow-md cursor-pointer border border-[#A17B5E]/40"
                      >
                        <span>Connect</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3 Small Picture Placeholders Below Video */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#560406] flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#A17B5E]" />
                      <span>Photos (3)</span>
                    </span>
                    <span className="text-[10px] text-[#6E6259] font-semibold">Click to preview</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {(profile.photos || []).map((photoUrl, idx) => (
                      <div
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPhotoPreview(photoUrl);
                        }}
                        className="aspect-square rounded-2xl overflow-hidden border border-[#E8DDD0] bg-[#F8F6F2] hover:opacity-90 active:scale-95 transition-all shadow-xs relative group cursor-pointer"
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
                    className="w-full py-3 px-4 rounded-2xl bg-[#F8F6F2] border border-[#E8DDD0] flex items-center justify-between text-xs font-extrabold text-[#161412] hover:bg-white transition-all cursor-pointer shadow-xs"
                  >
                    <span className="font-serif-editorial text-sm" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>About & Bio Description</span>
                    {isBioExpanded ? <ChevronUp className="w-4 h-4 text-[#560406]" /> : <ChevronDown className="w-4 h-4 text-[#6E6259]" />}
                  </button>

                  {isBioExpanded && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2.5 p-4 rounded-2xl bg-white border border-[#E8DDD0] space-y-2.5 text-left shadow-xs animate-fadeIn"
                    >
                      <div>
                        <span className="text-[10px] uppercase font-black tracking-wider text-[#560406] block mb-1">
                          Personal Bio
                        </span>
                        <p className="text-xs text-[#6E6259] font-medium leading-relaxed">
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
      );
    })()}
    </div>

      {/* Safety & Moderation Report / Block Modal (Apple Guideline 1.2 Compliance) */}
      <ReportBlockModal
        isOpen={!!reportModalProfile}
        profile={reportModalProfile}
        onClose={() => setReportModalProfile(null)}
        onBlockSuccess={(blockedId) => {
          setBlockedProfileIds((prev) => [...prev, blockedId]);
          if ((selectedDetailProfile as Profile | null)?.id === blockedId) {
            setSelectedDetailProfile(null);
          }
          triggerToast('Candidate blocked and removed from feed', 'success');
        }}
        onReportSuccess={(_id, _reason) => {
          triggerToast('Report submitted to Trust & Safety', 'sparkle');
        }}
      />
    </div>
  );
};
