import React, { useState } from 'react';
import { Share2, Volume2, VolumeX, ExternalLink, Heart, Sparkles, MapPin, Briefcase, User, Check, Send } from 'lucide-react';
import type { Profile } from '../types';

interface FamilySharePortalProps {
  profile: Profile;
  onBackToFeed?: () => void;
}

export const FamilySharePortal: React.FC<FamilySharePortalProps> = ({ profile }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [waveSent, setWaveSent] = useState(false);

  const photos = profile.photos && profile.photos.length > 0
    ? profile.photos
    : [profile.creator_vouch?.creator_avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'];

  const shareUrl = `${window.location.origin}/share/${profile.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `✨ Verified Matrimonial Bio-Data for ${profile.display_name}:\n\n` +
      `👤 Age & Height: ${profile.age} yrs, ${profile.height || "5'7\""}\n` +
      `📍 City: ${profile.city}\n` +
      `🎓 Education: ${profile.education || 'Master Degree'}\n` +
      `💼 Profession: ${profile.occupation} (${profile.company_name || 'Top Firm'})\n` +
      `🙏 Community: ${profile.religion} (${profile.sub_community || profile.community || 'North Indian'})\n` +
      `💰 Income: ${profile.salary_bracket || '₹35L - ₹50L/yr'}\n\n` +
      `View Full Verified Profile on Mannat: ${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const toggleVoicePlayback = () => {
    if (isPlayingAudio) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const introSpeech = new SpeechSynthesisUtterance(
          `Namaste. I am ${profile.display_name}, ${profile.age} years old from ${profile.city}. I work as a ${profile.occupation} at ${profile.company_name || 'my organization'}. I value mutual respect, family values, and progressive growth.`
        );
        introSpeech.rate = 0.95;
        introSpeech.pitch = 1.05;
        introSpeech.onend = () => setIsPlayingAudio(false);
        introSpeech.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(introSpeech);
      } else {
        setTimeout(() => setIsPlayingAudio(false), 4000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#111111] p-4 pb-36 max-w-lg mx-auto select-none font-sans">
      {/* Hero Photo Carousel & Vitals */}
      <div className="bg-white border border-[#E8E1D5] rounded-3xl p-4 space-y-4 shadow-sm">
        {/* Main Active Photo */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#2D2824] shadow-md">
          <img
            src={photos[selectedPhotoIndex]}
            alt={`${profile.display_name} photo`}
            className="w-full h-full object-cover"
          />

          {/* Compatibility Score Tag */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-[#E8E1D5] flex items-center gap-1.5 text-xs font-extrabold text-[#B89552]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{profile.compatibility_score || 98}% Match</span>
          </div>

          {/* Gradient Info Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif-editorial font-bold tracking-tight">
                {profile.display_name}, {profile.age}
              </h1>
              <span className="text-[10px] font-black uppercase text-[#B89552] bg-white px-2 py-0.5 rounded-full">
                Vouched
              </span>
            </div>
            <p className="text-xs text-gray-200 font-semibold mt-1">
              {profile.height || "5'7\""} • {profile.religion} ({profile.sub_community || profile.community || 'North Indian'})
            </p>
            <p className="text-xs text-gray-300 font-medium flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#DFBE7E]" />
              <span>Settled in {profile.city}, India</span>
            </p>
          </div>
        </div>

        {/* Photo Gallery Thumbnails */}
        {photos.length > 1 && (
          <div className="flex items-center gap-2.5">
            {photos.map((url, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedPhotoIndex(idx)}
                className={`relative flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedPhotoIndex === idx ? 'border-[#B89552] ring-2 ring-[#B89552]/30 scale-105' : 'border-[#E8E1D5] opacity-75'
                }`}
              >
                <img src={url} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Voice Intro Player */}
      <div className="mt-4 p-4 rounded-2xl bg-white border border-[#E8E1D5] flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleVoicePlayback}
            className={`w-11 h-11 rounded-full flex items-center justify-center shadow-xs transition-colors cursor-pointer shrink-0 ${
              isPlayingAudio ? 'bg-[#B89552] text-white animate-pulse' : 'bg-[#2D2824] text-white hover:bg-[#B89552]'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-white" />}
          </button>
          <div>
            <span className="text-xs font-extrabold text-[#111111] block">Voice Bio-Description</span>
            <span className="text-[11px] text-[#777777] font-semibold">
              {isPlayingAudio ? 'Playing candidate voice introduction...' : 'Tap to listen to candidate audio description'}
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Matrimonial Sections */}
      <div className="mt-4 space-y-4">
        {/* 1. Core Vitals & Identity */}
        <div className="bg-white rounded-3xl p-5 border border-[#E8E1D5] shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-[#E8E1D5] pb-2.5">
            <User className="w-4 h-4 text-[#B89552]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-[#111111]">Candidate Vitals & Identity</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5]">
              <span className="text-[#777777] text-[10px] uppercase font-bold block">Age & DOB</span>
              <span className="font-extrabold text-[#111111] text-xs mt-0.5 block">{profile.age} Years</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5]">
              <span className="text-[#777777] text-[10px] uppercase font-bold block">Height</span>
              <span className="font-extrabold text-[#111111] text-xs mt-0.5 block">{profile.height || "5'7\" (170 cm)"}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5]">
              <span className="text-[#777777] text-[10px] uppercase font-bold block">Marital Status</span>
              <span className="font-extrabold text-[#111111] text-xs mt-0.5 block">Never Married</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5]">
              <span className="text-[#777777] text-[10px] uppercase font-bold block">Profile Managed By</span>
              <span className="font-extrabold text-[#111111] text-xs mt-0.5 block">Self Candidate</span>
            </div>
          </div>
        </div>

        {/* 2. Career & Financial Standing */}
        <div className="bg-white rounded-3xl p-5 border border-[#E8E1D5] shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-[#E8E1D5] pb-2.5">
            <Briefcase className="w-4 h-4 text-[#B89552]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-[#111111]">Career & Education</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] col-span-2">
              <span className="text-[#777777] text-[10px] uppercase font-bold block">Current Role / Title</span>
              <span className="font-extrabold text-[#111111] text-sm mt-0.5 block">{profile.occupation}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5]">
              <span className="text-[#777777] text-[10px] uppercase font-bold block">Company / Firm</span>
              <span className="font-extrabold text-[#111111] text-xs mt-0.5 block">{profile.company_name || 'Leading Enterprise'}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5]">
              <span className="text-[#777777] text-[10px] uppercase font-bold block">Highest Degree</span>
              <span className="font-extrabold text-[#111111] text-xs mt-0.5 block">{profile.education || 'Masters Degree'}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5]">
              <span className="text-[#777777] text-[10px] uppercase font-bold block">Annual Income</span>
              <span className="font-extrabold text-[#B89552] text-xs mt-0.5 block">{profile.salary_bracket || '₹35 - 50 Lakhs'}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5]">
              <span className="text-[#777777] text-[10px] uppercase font-bold block">Work Location</span>
              <span className="font-extrabold text-[#111111] text-xs mt-0.5 block">{profile.city}, India</span>
            </div>
          </div>
        </div>

        {/* 3. Cultural Roots & Horoscope */}
        <div className="bg-white rounded-3xl p-5 border border-[#E8E1D5] shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-[#E8E1D5] pb-2.5">
            <Sparkles className="w-4 h-4 text-[#B89552]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-[#111111]">Cultural Roots & Astrology</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5]">
              <span className="text-[#777777] text-[10px] uppercase font-bold block">Religion</span>
              <span className="font-extrabold text-[#111111] text-xs mt-0.5 block">{profile.religion}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5]">
              <span className="text-[#777777] text-[10px] uppercase font-bold block">Community / Caste</span>
              <span className="font-extrabold text-[#111111] text-xs mt-0.5 block">{profile.sub_community || profile.community || 'North Indian'}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5]">
              <span className="text-[#777777] text-[10px] uppercase font-bold block">Manglik Status</span>
              <span className="font-extrabold text-[#111111] text-xs mt-0.5 block">No (Non-Manglik)</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5]">
              <span className="text-[#777777] text-[10px] uppercase font-bold block">Gun Milan Match</span>
              <span className="font-extrabold text-[#B89552] text-xs mt-0.5 block">{profile.gun_milan_score || 32} / 36 Gunas</span>
            </div>
          </div>
        </div>

        {/* 4. Lifestyle & Dietary Habits */}
        <div className="bg-white rounded-3xl p-5 border border-[#E8E1D5] shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-[#E8E1D5] pb-2.5">
            <Heart className="w-4 h-4 text-[#B89552]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-[#111111]">Lifestyle & Diet</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5]">
              <span className="text-[#777777] text-[10px] uppercase font-bold block">Diet Preference</span>
              <span className="font-extrabold text-[#111111] text-xs mt-0.5 block">{profile.diet || 'Vegetarian'}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5]">
              <span className="text-[#777777] text-[10px] uppercase font-bold block">Drinking & Smoking</span>
              <span className="font-extrabold text-[#111111] text-xs mt-0.5 block">Non-Smoker • Social</span>
            </div>
          </div>
        </div>

        {/* 5. Family Background */}
        <div className="bg-white rounded-3xl p-5 border border-[#E8E1D5] shadow-xs space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#111111] border-b border-[#E8E1D5] pb-2.5">
            Family Background & Values
          </h3>
          <p className="text-xs text-[#555555] leading-relaxed bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E8E1D5]">
            {profile.family_background || 'Respectable family settled in metro city with strong cultural values and progressive outlook.'}
          </p>
        </div>

        {/* 6. Partner Expectations */}
        <div className="bg-white rounded-3xl p-5 border border-[#E8E1D5] shadow-xs space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#111111] border-b border-[#E8E1D5] pb-2.5">
            Partner Expectations & Marriage Timeline
          </h3>
          <p className="text-xs text-[#555555] leading-relaxed bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E8E1D5]">
            {profile.marriage_expectations || 'Looking for an ambitious, emotionally mature partner who values mutual growth, open communication, and family harmony.'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={() => setWaveSent(true)}
          className={`w-full py-4 px-6 rounded-2xl text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
            waveSent ? 'bg-emerald-600' : 'bg-[#2D2824] hover:bg-[#B89552]'
          }`}
        >
          {waveSent ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4 text-[#DFBE7E]" />}
          <span>{waveSent ? 'Interest Wave Sent! 👋' : 'Send Interest Wave 👋'}</span>
        </button>

        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-98 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Bio-data via WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#F4EFE6] border border-[#E8E1D5] text-[#111111] text-xs font-extrabold uppercase tracking-wider hover:bg-[#E8E1D5] active:scale-98 flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          <ExternalLink className="w-4 h-4 text-[#B89552]" />
          <span>{copied ? '✓ Link Copied!' : 'Copy Direct Web Portal Link'}</span>
        </button>
      </div>
    </div>
  );
};
