import React, { useState } from 'react';
import { ShieldCheck, Share2, Volume2, Award, ExternalLink, ArrowLeft, QrCode } from 'lucide-react';
import type { Profile } from '../types';
import { FamilyCallModal } from './FamilyCallModal';

interface FamilySharePortalProps {
  profile: Profile;
  onBackToFeed?: () => void;
}

export const FamilySharePortal: React.FC<FamilySharePortalProps> = ({ profile, onBackToFeed }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [scheduledSuccessMsg, setScheduledSuccessMsg] = useState<string | null>(null);

  const shareUrl = `${window.location.origin}/share/${profile.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `🙏 Traditional Bio-data & Verified Vouch Video for ${profile.display_name}:\n\n` +
      `👤 Age: ${profile.age} | City: ${profile.city}\n` +
      `🎓 Education: ${profile.education || 'Master Degree'}\n` +
      `💼 Profession: ${profile.occupation} (${profile.company_name})\n` +
      `💎 Net Worth: ${profile.lifestyle_details?.net_worth || '₹5Cr - ₹10Cr'}\n` +
      `✅ Verified Vouch Rating: ${profile.creator_vouch?.trust_rating || '4.9'}/5.0\n\n` +
      `View Mannat Family Portal: ${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#111111] p-4 max-w-lg mx-auto select-none font-sans">
      <FamilyCallModal
        isOpen={showCallModal}
        onClose={() => setShowCallModal(false)}
        targetProfile={profile}
        onScheduleSuccess={(time) => setScheduledSuccessMsg(`Family Call Scheduled for ${time}!`)}
      />

      {/* Top Banner */}
      <div className="pt-2 pb-4 flex items-center justify-between border-b border-[#E8E1D5] mb-6 bg-[#FBF9F4] px-4 py-3 rounded-2xl shadow-sm">
        {onBackToFeed && (
          <button
            type="button"
            onClick={onBackToFeed}
            className="flex items-center gap-1.5 text-xs text-[#111111] font-bold bg-[#F4EFE6] px-3.5 py-1.5 rounded-full hover:bg-[#E8E1D5] border border-[#E8E1D5] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#111111]" />
            <span>App Feed</span>
          </button>
        )}
        <div className="flex items-center gap-2">
          <span className="font-instrument text-2xl lowercase text-[#B89552]">mannat</span>
          <span className="font-serif-editorial font-bold text-base text-[#111111]">Bio-data</span>
        </div>
        <span className="text-[10px] text-[#B89552] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F4EFE6] border border-[#E8E1D5]">
          Verified
        </span>
      </div>

      {/* Main Traditional Bio-data Card */}
      <div className="bg-[#F4EFE6] border border-[#E8E1D5] rounded-3xl p-6 space-y-6 shadow-sm">
        {/* Header Profile Photo & Verification */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative">
              <img
                src={profile.photos?.[0] || profile.creator_vouch?.creator_avatar_url}
                alt={profile.display_name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 bg-[#B89552] text-white rounded-full p-1 shadow">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-serif-editorial font-bold text-[#111111]">{profile.display_name}</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
                  ✓ Verified
                </span>
              </div>
              <p className="text-sm font-bold text-[#B89552]">
                {profile.age} yrs • {profile.height || "5'6\""} • {profile.religion} ({profile.sub_community || profile.community})
              </p>
              <p className="text-xs text-[#777777] font-medium">
                📍 Settled in <span className="text-[#111111] font-bold">{profile.city}</span>
              </p>
            </div>
          </div>

          {/* QR Code linking to Video Intro */}
          <div className="p-3 bg-white rounded-2xl border border-[#E8E1D5] text-center space-y-1 shadow-sm">
            <QrCode className="w-12 h-12 text-[#111111] mx-auto" />
            <span className="text-[9px] font-black text-[#B89552] block uppercase">Scan Video</span>
          </div>
        </div>

        {/* Schedule Family Conference Call Banner */}
        <div className="bg-[#111111] text-white p-4 rounded-2xl space-y-2 flex items-center justify-between shadow-md">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-[#B89552] uppercase tracking-wider block">
              FAMILY CONFERENCE ROOM
            </span>
            <span className="text-xs font-bold block">Schedule Parent Intro Call</span>
          </div>
          <button
            type="button"
            onClick={() => setShowCallModal(true)}
            className="px-4 py-2 rounded-full bg-[#B89552] text-white text-xs font-extrabold uppercase hover:bg-white hover:text-[#111111] transition-all cursor-pointer shadow"
          >
            Schedule Call
          </button>
        </div>

        {scheduledSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl text-center">
            ✓ {scheduledSuccessMsg}
          </div>
        )}

        {/* Creator Vouch Section */}
        {profile.creator_vouch && (
          <div className="p-4 rounded-2xl bg-white border border-[#E8E1D5] space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#B89552]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-[#B89552]">
                  Certified Matchmaker Vouch
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Rating: {profile.creator_vouch.trust_rating} / 5.0
              </span>
            </div>

            <div className="relative rounded-xl overflow-hidden aspect-video bg-black border border-gray-200">
              <video
                src={profile.creator_vouch.vouch_video_url}
                controls
                className="w-full h-full object-cover"
                poster="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
              />
            </div>

            <p className="text-xs italic text-gray-700 leading-relaxed bg-[#FBF9F4] p-3 rounded-xl border border-[#E8E1D5]">
              "{profile.creator_vouch.commentary}"
            </p>
          </div>
        )}

        {/* Lifestyle & Financial Grid */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider border-l-4 border-[#B89552] pl-2">
            Lifestyle & Asset Verification
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white border border-[#E8E1D5]">
              <span className="text-[#777777] block text-[11px] font-medium">Net Worth Bracket</span>
              <span className="font-bold text-[#111111] block mt-0.5">{profile.lifestyle_details?.net_worth || '₹5Cr - ₹10Cr'}</span>
              <span className="text-emerald-600 text-[11px] font-semibold block">✓ Verified Assets</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E8E1D5]">
              <span className="text-[#777777] block text-[11px] font-medium">Private Club Member</span>
              <span className="font-bold text-[#111111] block mt-0.5">{profile.lifestyle_details?.private_clubs || 'Golf & Yacht Club'}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E8E1D5]">
              <span className="text-[#777777] block text-[11px] font-medium">Second Home Villa</span>
              <span className="font-bold text-[#111111] block mt-0.5">{profile.lifestyle_details?.second_home ? 'Yes (Vacation Home)' : 'No'}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#E8E1D5]">
              <span className="text-[#777777] block text-[11px] font-medium">Gun Milan Score</span>
              <span className="font-extrabold text-[#B89552] block mt-0.5">{profile.gun_milan_score || 32} / 36 Gunas</span>
            </div>
          </div>
        </div>

        {/* Family Background */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider border-l-4 border-[#B89552] pl-2">
            Family Background Details
          </h3>
          <p className="text-xs text-[#555555] leading-relaxed bg-white p-3.5 rounded-2xl border border-[#E8E1D5]">
            {profile.family_background}
          </p>
        </div>

        {/* Voice Intro Player */}
        {profile.voice_intro_url && (
          <div className="p-3.5 rounded-2xl bg-white border border-[#E8E1D5] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center shadow hover:bg-[#B89552] transition-colors cursor-pointer"
              >
                <Volume2 className="w-5 h-5 text-white" />
              </button>
              <div>
                <span className="text-xs font-bold text-[#111111] block">Voice Intro Audio</span>
                <span className="text-[11px] text-[#B89552] font-semibold">10-sec self description</span>
              </div>
            </div>
            {isPlayingAudio && <span className="text-xs text-[#B89552] font-mono animate-pulse">Playing...</span>}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="w-full py-4 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Bio-data via WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="w-full py-3.5 px-6 rounded-full bg-[#F4EFE6] border border-[#E8E1D5] text-[#111111] text-xs font-extrabold uppercase tracking-wider hover:bg-[#E8E1D5] active:scale-98 flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
          <span>{copied ? '✓ Link Copied!' : 'Copy Direct Web Portal Link'}</span>
        </button>
      </div>
    </div>
  );
};
