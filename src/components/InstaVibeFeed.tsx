import React, { useState, useRef, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Heart, 
  Share2, 
  Sparkles, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Send, 
  SlidersHorizontal, 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Flag, 
  RotateCcw,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Profile } from '../types';
import { Toast } from './Toast';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { ReportBlockModal } from './ReportBlockModal';
import { nativeService } from '../services/nativeService';

interface InstaVibeFeedProps {
  profiles: Profile[];
  onOpenFilters?: () => void;
  onOpenSharePortal: (profile: Profile) => void;
  onOpenPaywall?: () => void;
  onOpenCreateProfile?: () => void;
  onUnlockSuccess?: (profileId: string) => void;
}

export const InstaVibeFeed: React.FC<InstaVibeFeedProps> = ({
  profiles,
  onOpenFilters,
  onOpenSharePortal
}) => {
  const [selectedDetailProfile, setSelectedDetailProfile] = useState<Profile | null>(null);
  const [reportModalProfile, setReportModalProfile] = useState<Profile | null>(null);
  const [activePhotoIndices, setActivePhotoIndices] = useState<Record<string, number>>({});
  const [modalActivePhotoIndex, setModalActivePhotoIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuickChip, setActiveQuickChip] = useState<'all' | 'high_match' | 'gun_milan' | 'vouched' | 'ivy_founders' | 'banking_pe' | 'doctors'>('all');
  
  // Interactive Direct Dropdown Filters
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedReligion, setSelectedReligion] = useState<string>('All');
  const [selectedMaxAge, setSelectedMaxAge] = useState<number>(45);
  const [selectedMinGunMilan, setSelectedMinGunMilan] = useState<number>(0);

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

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'heart' | 'sparkle'>('success');
  const [isMuted, setIsMuted] = useState(true);
  const [activeTabInModal, setActiveTabInModal] = useState<'overview' | 'career' | 'family' | 'kundli' | 'lifestyle'>('overview');
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const triggerToast = (msg: string, type: 'success' | 'heart' | 'sparkle' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isLiked = !likedProfiles[id];
    const updated = { ...likedProfiles, [id]: isLiked };
    setLikedProfiles(updated);
    try {
      localStorage.setItem('mannat_favorites', JSON.stringify(updated));
    } catch (err) {
      console.warn('Error saving favorites:', err);
    }
    if (isLiked) {
      triggerToast('Candidate added to your Shortlist 💕', 'heart');
    } else {
      triggerToast('Removed from Shortlist', 'success');
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

  const handleNextPhoto = (profileId: string, totalPhotos: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIndices((prev) => ({
      ...prev,
      [profileId]: ((prev[profileId] || 0) + 1) % totalPhotos
    }));
  };

  const handlePrevPhoto = (profileId: string, totalPhotos: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIndices((prev) => ({
      ...prev,
      [profileId]: ((prev[profileId] || 0) - 1 + totalPhotos) % totalPhotos
    }));
  };

  const handleSendWave = async (targetProfile: Profile) => {
    try {
      const stored = localStorage.getItem('mannat_sent_waves');
      const list: Profile[] = stored ? JSON.parse(stored) : [];
      if (!list.some((p) => p.id === targetProfile.id)) {
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

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      activeQuickChip !== 'all' ||
      selectedCity !== 'All' ||
      selectedReligion !== 'All' ||
      selectedMaxAge < 45 ||
      selectedMinGunMilan > 0
    );
  }, [searchQuery, activeQuickChip, selectedCity, selectedReligion, selectedMaxAge, selectedMinGunMilan]);

  const handleResetFilters = () => {
    setSelectedCity('All');
    setSelectedReligion('All');
    setSelectedMaxAge(45);
    setSelectedMinGunMilan(0);
    setSearchQuery('');
    setActiveQuickChip('all');
    triggerToast('All Filters Cleared ✨', 'success');
  };

  // Filtered profiles
  const processedProfiles = useMemo(() => {
    return profiles.filter((p) => {
      if (blockedProfileIds.includes(p.id)) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.display_name?.toLowerCase().includes(q);
        const matchesCity = p.city?.toLowerCase().includes(q);
        const matchesOccupation = p.occupation?.toLowerCase().includes(q);
        const matchesEducation = p.education?.toLowerCase().includes(q);
        const matchesCommunity = p.community?.toLowerCase().includes(q) || p.sub_community?.toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesOccupation && !matchesEducation && !matchesCommunity) {
          return false;
        }
      }

      // Quick Chips
      if (activeQuickChip === 'high_match' && (p.compatibility_score || 0) < 95) return false;
      if (activeQuickChip === 'gun_milan' && (p.gun_milan_score || 0) < 30) return false;
      if (activeQuickChip === 'vouched' && !p.is_vouched) return false;
      if (activeQuickChip === 'ivy_founders') {
        const txt = `${p.education} ${p.occupation}`.toLowerCase();
        if (!txt.includes('stanford') && !txt.includes('columbia') && !txt.includes('harvard') && !txt.includes('iit') && !txt.includes('founder') && !txt.includes('entrepreneur') && !txt.includes('wharton')) {
          return false;
        }
      }
      if (activeQuickChip === 'banking_pe') {
        const txt = `${p.occupation} ${p.company_name}`.toLowerCase();
        if (!txt.includes('banking') && !txt.includes('equity') && !txt.includes('goldman') && !txt.includes('blackstone') && !txt.includes('finance')) {
          return false;
        }
      }
      if (activeQuickChip === 'doctors') {
        const txt = `${p.occupation} ${p.education}`.toLowerCase();
        if (!txt.includes('doctor') && !txt.includes('dermatologist') && !txt.includes('mbbs') && !txt.includes('md') && !txt.includes('surgeon')) {
          return false;
        }
      }

      // Dropdown Filters
      if (p.age > selectedMaxAge) return false;
      if (selectedCity !== 'All' && !p.city?.toLowerCase().includes(selectedCity.toLowerCase())) return false;
      if (selectedReligion !== 'All' && p.religion !== selectedReligion) return false;
      if (selectedMinGunMilan > 0 && (p.gun_milan_score || 0) < selectedMinGunMilan) return false;

      return true;
    });
  }, [
    profiles,
    blockedProfileIds,
    searchQuery,
    activeQuickChip,
    selectedCity,
    selectedReligion,
    selectedMaxAge,
    selectedMinGunMilan
  ]);

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#161412] font-sans pb-28 select-none w-full">
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />

      {/* Report Modal */}
      <ReportBlockModal
        isOpen={!!reportModalProfile}
        profile={reportModalProfile}
        onClose={() => setReportModalProfile(null)}
        onBlockSuccess={(blockedId: string) => {
          setBlockedProfileIds((prev) => {
            const updated = [...prev, blockedId];
            try {
              localStorage.setItem('mannat_blocked_profiles', JSON.stringify(updated));
            } catch { }
            return updated;
          });
          triggerToast('Candidate has been blocked 🚫', 'success');
          setSelectedDetailProfile(null);
          setReportModalProfile(null);
        }}
        onReportSuccess={(_id: string, reason: string) => {
          triggerToast(`Report submitted: "${reason}". Thank you.`, 'success');
          setSelectedDetailProfile(null);
          setReportModalProfile(null);
        }}
      />

      {/* Main Spacious Max-Width Web Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-5">
        
        {/* UNIFIED LUXURY FILTER BAR */}
        <div className="bg-white rounded-2xl border border-[#E8DDD0] p-3 sm:p-4 shadow-xs space-y-3">
          
          {/* Top Row: Search Input + Live Dropdowns + Reset */}
          <div className="flex flex-col lg:flex-row items-center gap-3">
            
            {/* Search Input */}
            <div className="relative w-full lg:flex-1">
              <Search className="w-4 h-4 text-[#A17B5E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates by name, city, profession, or university..."
                className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] rounded-xl border border-[#E8DDD0] text-[#161412] placeholder-[#A89F91] focus:outline-none focus:border-[#560406] transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C827A] hover:text-[#161412] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Filter Dropdowns on Desktop */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto shrink-0 text-xs">
              
              {/* City Dropdown */}
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className={`w-full sm:w-auto px-3.5 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer focus:outline-none transition ${
                    selectedCity !== 'All'
                      ? 'bg-[#560406] text-[#F5E6D3] border-[#560406]'
                      : 'bg-[#FAF8F5] text-[#161412] border-[#E8DDD0] hover:bg-white'
                  }`}
                >
                  <option value="All">All Cities</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="London">London / UK</option>
                  <option value="Singapore">Singapore</option>
                </select>
              </div>

              {/* Religion Dropdown */}
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={selectedReligion}
                  onChange={(e) => setSelectedReligion(e.target.value)}
                  className={`w-full sm:w-auto px-3.5 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer focus:outline-none transition ${
                    selectedReligion !== 'All'
                      ? 'bg-[#560406] text-[#F5E6D3] border-[#560406]'
                      : 'bg-[#FAF8F5] text-[#161412] border-[#E8DDD0] hover:bg-white'
                  }`}
                >
                  <option value="All">All Religions</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Jain">Jain</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Christian">Christian</option>
                </select>
              </div>

              {/* Max Age Dropdown */}
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={selectedMaxAge}
                  onChange={(e) => setSelectedMaxAge(Number(e.target.value))}
                  className={`w-full sm:w-auto px-3.5 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer focus:outline-none transition ${
                    selectedMaxAge < 45
                      ? 'bg-[#560406] text-[#F5E6D3] border-[#560406]'
                      : 'bg-[#FAF8F5] text-[#161412] border-[#E8DDD0] hover:bg-white'
                  }`}
                >
                  <option value={45}>All Ages</option>
                  <option value={26}>Up to 26 yrs</option>
                  <option value={28}>Up to 28 yrs</option>
                  <option value={30}>Up to 30 yrs</option>
                  <option value={35}>Up to 35 yrs</option>
                </select>
              </div>

              {/* Gun Milan Dropdown */}
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={selectedMinGunMilan}
                  onChange={(e) => setSelectedMinGunMilan(Number(e.target.value))}
                  className={`w-full sm:w-auto px-3.5 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer focus:outline-none transition ${
                    selectedMinGunMilan > 0
                      ? 'bg-[#560406] text-[#F5E6D3] border-[#560406]'
                      : 'bg-[#FAF8F5] text-[#161412] border-[#E8DDD0] hover:bg-white'
                  }`}
                >
                  <option value={0}>Any Gun Milan</option>
                  <option value={30}>≥ 30 / 36 (High)</option>
                  <option value={32}>≥ 32 / 36 (Very High)</option>
                  <option value={34}>≥ 34 / 36 (Elite)</option>
                </select>
              </div>

              {/* Full Filter Drawer Trigger */}
              {onOpenFilters && (
                <button
                  type="button"
                  onClick={onOpenFilters}
                  className="px-3.5 py-2.5 rounded-xl bg-white border border-[#560406] text-[#560406] hover:bg-[#FAF8F5] text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition"
                  title="Comprehensive Search Filters"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#560406]" />
                  <span className="hidden sm:inline">Advanced</span>
                </button>
              )}

              {/* Clear All Filters Button */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3.5 py-2.5 rounded-xl bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition shrink-0"
                  title="Clear all active filters"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

          </div>

          {/* Bottom Row: Quick Curated Segment Chips + Active Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-[#F0EAE1]">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-xs">
              {[
                { id: 'all', label: 'All Candidates' },
                { id: 'high_match', label: '⭐ Top Match (>95%)' },
                { id: 'gun_milan', label: '🪐 High Kundli (>30)' },
                { id: 'vouched', label: '🛡️ Vouched by Family' },
                { id: 'ivy_founders', label: '🎓 Ivy League & Founders' },
                { id: 'banking_pe', label: '💼 Finance & PE' },
                { id: 'doctors', label: '🩺 Healthcare & Doctors' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setActiveQuickChip(chip.id as any)}
                  className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all duration-200 cursor-pointer border text-[11px] ${
                    activeQuickChip === chip.id
                      ? 'bg-[#560406] text-[#F5E6D3] border-[#560406] shadow-2xs'
                      : 'bg-[#FAF8F5] text-[#6E6259] border-[#E8DDD0] hover:bg-white hover:text-[#560406]'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-[#6E6259] font-medium shrink-0 self-end sm:self-center">
              Showing <strong className="text-[#560406] font-bold">{processedProfiles.length}</strong> Verified Profiles
            </div>
          </div>

        </div>

        {/* MAIN 3-COLUMN CANDIDATE DIRECTORY GRID */}
        {processedProfiles.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 sm:p-16 border border-[#E8DDD0] shadow-xs text-center space-y-4 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#560406]/10 text-[#560406] flex items-center justify-center mx-auto border border-[#A17B5E]/30">
              <Sparkles className="w-8 h-8 text-[#A17B5E]" />
            </div>
            <h3 className="text-2xl font-serif-editorial font-bold text-[#161412]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              No Candidates Found Matching Your Filters
            </h3>
            <p className="text-xs text-[#6E6259] max-w-sm mx-auto leading-relaxed">
              Try broadening your filter criteria or click "Clear All" to explore our complete directory of verified members.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-full bg-[#560406] text-[#F5E6D3] text-xs font-bold uppercase tracking-wider hover:bg-[#730C0F] transition cursor-pointer shadow-sm"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8">
            {processedProfiles.map((profile) => {
              const photos = profile.photos && profile.photos.length > 0
                ? profile.photos
                : ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000'];
              const currentPhotoIdx = activePhotoIndices[profile.id] || 0;
              const activePhoto = photos[currentPhotoIdx % photos.length];
              const isLiked = likedProfiles[profile.id] || false;

              return (
                <div
                  key={profile.id}
                  onClick={() => {
                    nativeService.haptic.light();
                    setSelectedDetailProfile(profile);
                    setModalActivePhotoIndex(0);
                  }}
                  className="bg-white rounded-3xl overflow-hidden border border-[#E8DDD0] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer relative"
                >
                  {/* Photo & Video Container with Carousel Controls */}
                  <div className="relative w-full aspect-[4/5] bg-[#161412] overflow-hidden">
                    {profile.bio_video_url && currentPhotoIdx === 0 ? (
                      <div className="relative w-full h-full">
                        <video
                          ref={(el) => { videoRefs.current[profile.id] = el; }}
                          src={profile.bio_video_url}
                          poster={activePhoto}
                          autoPlay
                          loop
                          muted={isMuted}
                          playsInline
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        {/* Video Sound Action */}
                        <button
                          type="button"
                          onClick={toggleSound}
                          className="absolute bottom-3 right-3 z-30 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-black/80 transition"
                          title={isMuted ? 'Unmute' : 'Mute'}
                        >
                          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#DFBE7E]" />}
                        </button>
                      </div>
                    ) : (
                      <img
                        src={activePhoto}
                        alt={profile.display_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}

                    {/* Top Badges Bar */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-20">
                      {/* Mutual Match Gauge */}
                      <div className="bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-black text-[#560406] shadow-sm border border-[#E8DDD0] flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-[#A17B5E]" />
                        <span>{profile.compatibility_score}% Mutual Match</span>
                      </div>

                      {/* Quick Actions (Favorite & Report) */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => toggleLike(profile.id, e)}
                          className={`w-8 h-8 rounded-full backdrop-blur-md border flex items-center justify-center shadow-sm transition-all active:scale-95 cursor-pointer ${
                            isLiked
                              ? 'bg-[#560406] border-[#560406] text-[#A17B5E]'
                              : 'bg-white/90 border-[#E8DDD0] text-[#560406] hover:bg-white'
                          }`}
                          title={isLiked ? 'Remove from Shortlist' : 'Add to Shortlist'}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#A17B5E]' : ''}`} />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setReportModalProfile(profile);
                          }}
                          className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-rose-300 hover:bg-black/60 transition cursor-pointer"
                          title="Report / Block"
                        >
                          <Flag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Photo Carousel Arrows */}
                    {photos.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => handlePrevPhoto(profile.id, photos.length, e)}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer shadow-md"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleNextPhoto(profile.id, photos.length, e)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer shadow-md"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>

                        {/* Carousel Dots */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                          {photos.map((_, i) => (
                            <span
                              key={i}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                i === currentPhotoIdx ? 'bg-white w-4' : 'bg-white/50 w-1.5'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Card Content & Bio Data Excerpt */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      
                      {/* Name, Age, Vouched Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <h3
                          className="text-2xl font-bold text-[#161412] tracking-tight group-hover:text-[#560406] transition-colors leading-tight"
                          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                        >
                          <span>{profile.display_name}</span>
                          <span className="text-[#A17B5E] font-sans font-extrabold text-lg ml-2">
                            · {profile.age}
                          </span>
                        </h3>

                        {profile.is_vouched && (
                          <span className="shrink-0 text-[10px] font-black text-[#560406] bg-[#560406]/5 px-2.5 py-1 rounded-full border border-[#E8DDD0] flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-[#A17B5E]" />
                            <span>Vouched</span>
                          </span>
                        )}
                      </div>

                      {/* Role & Organization */}
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-[#161412] font-semibold">
                        <Briefcase className="w-4 h-4 text-[#A17B5E] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">
                          {profile.occupation} {profile.company_name ? `· ${profile.company_name}` : ''}
                        </span>
                      </div>

                      {/* Education & Alma Mater */}
                      {profile.education && (
                        <div className="flex items-start gap-2 text-xs text-[#6E6259]">
                          <GraduationCap className="w-4 h-4 text-[#A17B5E] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{profile.education}</span>
                        </div>
                      )}

                      {/* Location & Height */}
                      <div className="flex items-center gap-4 text-xs text-[#6E6259] pt-0.5">
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#A17B5E]" />
                          {profile.city}
                        </span>
                        {profile.height && (
                          <span className="font-bold text-[#8C827A]">
                            📏 {profile.height}
                          </span>
                        )}
                      </div>

                      {/* Astrological & Community Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {profile.gun_milan_score && (
                          <span className="text-[11px] font-black text-[#560406] bg-[#FAF8F5] border border-[#E8DDD0] px-2.5 py-1 rounded-md flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#A17B5E]" />
                            {profile.gun_milan_score}/36 Gun Milan
                          </span>
                        )}
                        {profile.community && (
                          <span className="text-[11px] font-bold text-[#6E6259] bg-[#FAF8F5] border border-[#E8DDD0] px-2.5 py-1 rounded-md">
                            {profile.community}
                          </span>
                        )}
                        {profile.diet && (
                          <span className="text-[11px] font-bold text-[#6E6259] bg-[#FAF8F5] border border-[#E8DDD0] px-2.5 py-1 rounded-md">
                            {profile.diet}
                          </span>
                        )}
                      </div>

                      {/* Bio Excerpt */}
                      {profile.bio_text && (
                        <p className="text-xs text-[#6E6259] line-clamp-2 italic pt-1 leading-relaxed border-t border-[#F0EAE1]">
                          "{profile.bio_text}"
                        </p>
                      )}
                    </div>

                    {/* Dual Web Action Buttons */}
                    <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-[#E8DDD0]">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDetailProfile(profile);
                          setModalActivePhotoIndex(0);
                        }}
                        className="py-2.5 px-3 rounded-xl bg-white border border-[#560406] text-[#560406] hover:bg-[#FAF8F5] text-xs font-bold uppercase tracking-wider transition cursor-pointer text-center"
                      >
                        Full Dossier 📄
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendWave(profile);
                        }}
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#730C0F] to-[#560406] hover:brightness-110 text-[#F5E6D3] text-xs font-bold uppercase tracking-wider transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5 text-[#DFBE7E] shrink-0" />
                        <span>Connect 👋</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* GRAND 2-COLUMN LUXURY CANDIDATE DOSSIER MODAL (Desktop & Tablet) */}
      <AnimatePresence>
        {selectedDetailProfile && (
          <div className="fixed inset-0 z-50 bg-[#161412]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FAF8F5] w-full max-w-5xl max-h-[92vh] rounded-[32px] border border-[#E8DDD0] shadow-2xl overflow-hidden flex flex-col md:flex-row relative text-[#161412]"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedDetailProfile(null)}
                className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-[#E8DDD0] flex items-center justify-center text-[#161412] shadow-md cursor-pointer transition"
              >
                <X className="w-5 h-5 text-[#560406]" />
              </button>

              {/* Left Column: Photo Carousel, Video & Visual Metrics (md:w-5/12) */}
              <div className="md:w-5/12 bg-[#161412] text-white p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="space-y-4">
                  
                  {/* Photo Display / Video */}
                  <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-black/50 border border-white/10">
                    {selectedDetailProfile.bio_video_url && modalActivePhotoIndex === 0 ? (
                      <video
                        src={selectedDetailProfile.bio_video_url}
                        controls
                        autoPlay
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={
                          selectedDetailProfile.photos?.[modalActivePhotoIndex] ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000'
                        }
                        alt={selectedDetailProfile.display_name}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Vouched Badge */}
                    {selectedDetailProfile.is_vouched && (
                      <div className="absolute top-3 left-3 bg-white/95 text-[#560406] px-3 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#A17B5E]" />
                        <span>Verified & Vouched</span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Selector */}
                  {selectedDetailProfile.photos && selectedDetailProfile.photos.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {selectedDetailProfile.photos.map((pUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setModalActivePhotoIndex(idx)}
                          className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                            modalActivePhotoIndex === idx ? 'border-[#DFBE7E] scale-105' : 'border-white/20 opacity-60'
                          }`}
                        >
                          <img src={pUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Astrological & Compatibility Meter */}
                  <div className="grid grid-cols-2 gap-2 text-center pt-2">
                    <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                      <span className="text-[10px] uppercase tracking-wider text-[#DFBE7E] block">Mutual Match</span>
                      <strong className="text-lg font-bold text-white">{selectedDetailProfile.compatibility_score}%</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                      <span className="text-[10px] uppercase tracking-wider text-[#DFBE7E] block">Gun Milan</span>
                      <strong className="text-lg font-bold text-white">{selectedDetailProfile.gun_milan_score || 34} / 36</strong>
                    </div>
                  </div>
                </div>

                {/* Left Bottom Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => toggleLike(selectedDetailProfile.id)}
                    className={`flex items-center gap-1.5 font-bold transition cursor-pointer ${
                      likedProfiles[selectedDetailProfile.id] ? 'text-rose-400' : 'text-[#E8DDD0] hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${likedProfiles[selectedDetailProfile.id] ? 'fill-rose-400' : ''}`} />
                    <span>{likedProfiles[selectedDetailProfile.id] ? 'Saved to Shortlist' : 'Add to Shortlist'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenSharePortal(selectedDetailProfile)}
                    className="flex items-center gap-1.5 text-[#E8DDD0] hover:text-white font-bold cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-[#DFBE7E]" />
                    <span>Share Bio-Data</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Comprehensive Bio-Data Dossier (md:w-7/12) */}
              <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-[#FAF8F5]">
                <div className="space-y-6">
                  
                  {/* Candidate Header */}
                  <div className="border-b border-[#E8DDD0] pb-4">
                    <h2
                      className="text-3xl sm:text-4xl font-bold text-[#161412] tracking-tight"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                      {selectedDetailProfile.display_name}
                      <span className="text-[#A17B5E] font-sans font-extrabold text-2xl ml-2">
                        · {selectedDetailProfile.age} yrs
                      </span>
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#6E6259]">
                      <span className="flex items-center gap-1 font-semibold text-[#161412]">
                        <Briefcase className="w-3.5 h-3.5 text-[#A17B5E]" />
                        {selectedDetailProfile.occupation}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#A17B5E]" />
                        {selectedDetailProfile.city}
                      </span>
                      <span>·</span>
                      <span className="font-bold text-[#560406]">
                        📏 {selectedDetailProfile.height || "5'7\""}
                      </span>
                    </div>
                  </div>

                  {/* Dossier Navigation Tabs */}
                  <div className="flex items-center gap-2 border-b border-[#E8DDD0] pb-2 overflow-x-auto text-xs">
                    {[
                      { id: 'overview', label: 'Personal & Bio' },
                      { id: 'career', label: 'Education & Career' },
                      { id: 'family', label: 'Family & Legacy' },
                      { id: 'kundli', label: 'Kundli & Horoscope' },
                      { id: 'lifestyle', label: 'Lifestyle & Social' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTabInModal(tab.id as any)}
                        className={`px-3.5 py-2 rounded-lg font-bold transition whitespace-nowrap cursor-pointer ${
                          activeTabInModal === tab.id
                            ? 'bg-[#560406] text-[#F5E6D3]'
                            : 'text-[#6E6259] hover:bg-[#F0EAE1] hover:text-[#161412]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content Display */}
                  <div className="space-y-4 text-xs">
                    {activeTabInModal === 'overview' && (
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-white border border-[#E8DDD0] space-y-2">
                          <h4 className="font-bold text-[#560406] uppercase tracking-wider text-[11px]">
                            About {selectedDetailProfile.display_name}
                          </h4>
                          <p className="text-[#6E6259] leading-relaxed text-xs">
                            {selectedDetailProfile.bio_text ||
                              'A grounded, ambitious professional passionate about family values, cultural heritage, and intellectual pursuits.'}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-white rounded-xl border border-[#E8DDD0]">
                            <span className="text-[#8C827A] block text-[10px] uppercase">Marital Status</span>
                            <strong className="text-[#161412]">{selectedDetailProfile.marital_status || 'Never Married'}</strong>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-[#E8DDD0]">
                            <span className="text-[#8C827A] block text-[10px] uppercase">Religion & Community</span>
                            <strong className="text-[#161412]">{selectedDetailProfile.religion} · {selectedDetailProfile.community}</strong>
                          </div>
                        </div>

                        {selectedDetailProfile.marriage_expectations && (
                          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8DDD0] space-y-1">
                            <span className="font-bold text-[#560406] uppercase tracking-wider text-[10px]">
                              Expectations in a Life Partner
                            </span>
                            <p className="text-[#6E6259] italic text-xs">
                              "{selectedDetailProfile.marriage_expectations}"
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTabInModal === 'career' && (
                      <div className="space-y-3">
                        <div className="p-4 bg-white rounded-2xl border border-[#E8DDD0] space-y-2">
                          <span className="font-bold text-[#560406] uppercase tracking-wider text-[10px]">Alma Mater & Degrees</span>
                          <p className="text-[#161412] font-semibold">{selectedDetailProfile.education || 'Master of Science'}</p>
                        </div>

                        <div className="p-4 bg-white rounded-2xl border border-[#E8DDD0] space-y-2">
                          <span className="font-bold text-[#560406] uppercase tracking-wider text-[10px]">Current Organization & Role</span>
                          <p className="text-[#161412] font-semibold">{selectedDetailProfile.occupation} at {selectedDetailProfile.company_name || 'Reputed Firm'}</p>
                        </div>

                        <div className="p-4 bg-white rounded-2xl border border-[#E8DDD0] space-y-2">
                          <span className="font-bold text-[#560406] uppercase tracking-wider text-[10px]">Income & Financial Standing</span>
                          <p className="text-emerald-800 font-bold">{selectedDetailProfile.salary_bracket || '₹75L - ₹1Cr+ / Verified High Net Worth'}</p>
                        </div>
                      </div>
                    )}

                    {activeTabInModal === 'family' && (
                      <div className="space-y-3">
                        <div className="p-4 bg-white rounded-2xl border border-[#E8DDD0] space-y-2">
                          <span className="font-bold text-[#560406] uppercase tracking-wider text-[10px]">Family Lineage & Background</span>
                          <p className="text-[#161412] leading-relaxed">
                            {selectedDetailProfile.family_background || 'Distinguished family background with high cultural and professional reputation.'}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-white rounded-xl border border-[#E8DDD0]">
                            <span className="text-[#8C827A] block text-[10px] uppercase">Managed By</span>
                            <strong className="text-[#161412] capitalize">{selectedDetailProfile.managed_by || 'Self'}</strong>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-[#E8DDD0]">
                            <span className="text-[#8C827A] block text-[10px] uppercase">Family Location</span>
                            <strong className="text-[#161412]">{selectedDetailProfile.city}, India</strong>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTabInModal === 'kundli' && (
                      <div className="space-y-3">
                        <div className="p-4 bg-white rounded-2xl border border-[#E8DDD0] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#560406] uppercase tracking-wider text-[10px]">Astrological Gun Milan</span>
                            <strong className="text-sm font-black text-[#560406]">{selectedDetailProfile.gun_milan_score || 34} / 36 (High Synergy)</strong>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-white rounded-xl border border-[#E8DDD0]">
                            <span className="text-[#8C827A] block text-[10px] uppercase">Manglik Status</span>
                            <strong className="text-[#161412]">{selectedDetailProfile.horoscope?.manglik || 'No'}</strong>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-[#E8DDD0]">
                            <span className="text-[#8C827A] block text-[10px] uppercase">Time of Birth</span>
                            <strong className="text-[#161412]">{selectedDetailProfile.horoscope?.time_of_birth || '08:45 AM'}</strong>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-[#E8DDD0]">
                            <span className="text-[#8C827A] block text-[10px] uppercase">Place of Birth</span>
                            <strong className="text-[#161412]">{selectedDetailProfile.horoscope?.place_of_birth || selectedDetailProfile.city}</strong>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-[#E8DDD0]">
                            <span className="text-[#8C827A] block text-[10px] uppercase">Zodiac / Rashi</span>
                            <strong className="text-[#161412]">Kanya (Virgo)</strong>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTabInModal === 'lifestyle' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-white rounded-xl border border-[#E8DDD0]">
                            <span className="text-[#8C827A] block text-[10px] uppercase">Dietary Habits</span>
                            <strong className="text-[#161412]">{selectedDetailProfile.diet || 'Vegetarian'}</strong>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-[#E8DDD0]">
                            <span className="text-[#8C827A] block text-[10px] uppercase">Travel Frequency</span>
                            <strong className="text-[#161412]">{selectedDetailProfile.lifestyle_details?.travel_freq || 'Frequently'}</strong>
                          </div>
                        </div>

                        {selectedDetailProfile.lifestyle_details?.private_clubs && (
                          <div className="p-4 bg-white rounded-2xl border border-[#E8DDD0] space-y-1">
                            <span className="font-bold text-[#560406] uppercase tracking-wider text-[10px]">Private Memberships & Clubs</span>
                            <p className="text-[#161412] font-semibold">{selectedDetailProfile.lifestyle_details.private_clubs}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </div>

                {/* Bottom Action Sheet */}
                <div className="pt-6 border-t border-[#E8DDD0] flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => handleSendWave(selectedDetailProfile)}
                    className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#730C0F] to-[#560406] hover:brightness-110 text-[#F5E6D3] text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#DFBE7E]" />
                    <span>Send Interest Wave 👋</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenSharePortal(selectedDetailProfile);
                    }}
                    className="py-3.5 px-5 rounded-2xl bg-white border border-[#E8DDD0] hover:bg-[#FAF8F5] text-[#161412] text-xs font-bold uppercase tracking-wider transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-[#A17B5E]" />
                    <span>Share PDF Dossier</span>
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
