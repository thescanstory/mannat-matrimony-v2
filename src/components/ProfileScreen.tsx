import React, { useState } from 'react';
import {
  ShieldCheck,
  LogOut,
  LogIn,
  User,
  ChevronRight,
  Lock,
  CheckCircle2,
  Edit3,
  Check,
  Mail,
  Trash2,
  AlertTriangle,
  MapPin,
  Sparkles,
  Camera,
  Crown
} from 'lucide-react';
import type { UserSession } from '../services/authService';
import type { Profile, PrivacySettings } from '../types';

interface ProfileScreenProps {
  currentUser: UserSession | null;
  candidateProfile?: Profile | null;
  privacySettings: PrivacySettings;
  isParentView?: boolean;
  onToggleParentView?: () => void;
  onOpenPrivacySettings: () => void;
  onOpenPaywall: () => void;
  onEditBioData?: () => void;
  onUpdateProfile?: (updated: Profile) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onDeleteAllData?: () => void;
  onUpdateUser?: (updated: UserSession) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  candidateProfile,
  privacySettings,
  onOpenPrivacySettings,
  onOpenPaywall,
  onEditBioData,
  onOpenAuth,
  onLogout,
  onDeleteAllData,
  onUpdateUser
}) => {
  const [showEditAccountModal, setShowEditAccountModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<string | null>(null);

  // Profile data from props or defaults
  const displayName = candidateProfile?.display_name || currentUser?.user_metadata?.full_name || 'Candidate Member';
  const email = currentUser?.email || 'member@mannat.vip';
  const age = candidateProfile?.age || 27;
  const height = candidateProfile?.height || "5'7\" (170 cm)";
  const city = candidateProfile?.city || 'Mumbai';
  const occupation = candidateProfile?.occupation || 'Senior Product Designer';
  const education = candidateProfile?.education || 'Master of Design (M.Des)';
  const religion = candidateProfile?.religion || 'Hindu';
  const subCommunity = candidateProfile?.sub_community || 'Brahmin';
  const incomeBracket = candidateProfile?.income_bracket || '₹35,00,000 - ₹50,00,000 / yr';
  const diet = candidateProfile?.diet || 'Vegetarian';
  const bioText = candidateProfile?.bio_text || 'Passionate about timeless design, classical music, and meaningful family traditions. Looking for an empathetic partner with shared values.';
  const photos = candidateProfile?.photos && candidateProfile.photos.length > 0 
    ? candidateProfile.photos 
    : ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'];
  const videoUrl = candidateProfile?.bio_video_url || 'https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-fashion-woman-with-silver-glitter-makeup-39875-large.mp4';

  const [editName, setEditName] = useState(currentUser?.user_metadata?.full_name || displayName);
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUser && currentUser) {
      onUpdateUser({
        ...currentUser,
        email: editEmail.trim() || currentUser.email,
        user_metadata: {
          ...currentUser.user_metadata,
          full_name: editName.trim() || displayName
        }
      });
    }
    setShowEditAccountModal(false);
  };

  const handleConfirmDeleteAll = () => {
    setShowDeleteConfirmModal(false);
    if (onDeleteAllData) {
      onDeleteAllData();
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F6F2] text-[#161412] pb-44 select-none font-sans">
      <div className="p-5 sm:p-6 space-y-6 max-w-md mx-auto">

        {/* 1. Ultra-Luxurious Royal Profile Dossier Card */}
        <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-[#E8DDD0] shadow-sm relative overflow-hidden text-center space-y-5">
          {/* Subtle Royal Accent Corner Badge */}
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#560406] bg-[#A17B5E]/15 px-3 py-1 rounded-full border border-[#A17B5E]/30">
              <Crown className="w-3 h-3 text-[#A17B5E]" />
              <span>VIP Circle</span>
            </span>
          </div>

          {/* Big Profile Avatar Frame */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto mt-2">
            <div className="w-full h-full rounded-[28px] bg-[#F8F6F2] border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
              {photos[0] ? (
                <img 
                  src={photos[0]} 
                  alt={displayName} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <User className="w-16 h-16 text-[#A17B5E]" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#560406] text-[#A17B5E] p-2 rounded-full shadow-lg border-2 border-white">
              <CheckCircle2 className="w-4 h-4 text-[#A17B5E]" />
            </div>
          </div>

          {/* Name & Vitals */}
          <div className="space-y-1 pt-1">
            <h2 
              className="text-2xl sm:text-3xl font-bold text-[#161412] tracking-tight" 
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {displayName} · {age}
            </h2>
            <p className="text-xs text-[#6E6259] font-semibold flex items-center justify-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#A17B5E]" />
              <span>{city}, India</span>
              <span>•</span>
              <span>{religion} {subCommunity ? `(${subCommunity})` : ''}</span>
            </p>
            <p className="text-xs font-bold text-[#560406]">{occupation}</p>
            <p className="text-[11px] text-[#6E6259] font-medium">{email}</p>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-center gap-2.5 flex-wrap">
            {onEditBioData && (
              <button
                type="button"
                onClick={onEditBioData}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#730C0F] to-[#560406] hover:brightness-110 text-[#F5E6D3] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98 border border-[#A17B5E]/40 whitespace-nowrap"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#D8B486]" />
                <span>Edit Bio-Data</span>
              </button>
            )}

            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  setEditName(currentUser.user_metadata?.full_name || displayName);
                  setEditEmail(currentUser.email || '');
                  setShowEditAccountModal(true);
                }}
                className="py-3 px-4 rounded-2xl bg-[#F8F6F2] hover:bg-white text-[#560406] border border-[#E8DDD0] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5 text-[#A17B5E]" />
                <span>Account</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="py-3 px-5 rounded-2xl bg-[#560406] text-[#F5E6D3] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
              >
                <LogIn className="w-3.5 h-3.5 text-[#D8B486]" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. VIP Membership Status Banner */}
        <div 
          onClick={onOpenPaywall}
          className="rounded-[28px] p-6 bg-gradient-to-r from-[#560406] via-[#730C0F] to-[#400204] text-[#F8F6F2] shadow-xl border border-[#A17B5E]/40 relative overflow-hidden cursor-pointer hover:brightness-105 transition-all group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#A17B5E]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#A17B5E] flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-[#A17B5E]" />
                <span>MANNAT VIP PASS</span>
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                Diamond Membership
              </h3>
              <p className="text-xs text-amber-100/80 font-medium">
                Direct phone requests & verified matchmaking concierge
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-[#A17B5E] group-hover:scale-110 transition-transform">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* 3. Bio & Personal Narrative */}
        <div className="bg-white rounded-[28px] p-6 border border-[#E8DDD0] shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E8DDD0] pb-2.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#560406] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#A17B5E]" />
              <span>Personal Narrative</span>
            </span>
            {onEditBioData && (
              <button
                type="button"
                onClick={onEditBioData}
                className="text-[11px] font-bold text-[#560406] hover:underline cursor-pointer"
              >
                Edit
              </button>
            )}
          </div>
          <p className="text-xs text-[#6E6259] leading-relaxed font-medium">
            {bioText}
          </p>
        </div>

        {/* 4. Complete Bio-Data Grid Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-[#560406]">
              Candidate Dossier
            </span>
            {onEditBioData && (
              <button
                type="button"
                onClick={onEditBioData}
                className="text-xs font-bold text-[#560406] hover:underline cursor-pointer flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3 text-[#A17B5E]" />
                <span>Update All</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {/* Height & Physical */}
            <div className="bg-white p-4 rounded-2xl border border-[#E8DDD0] shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#6E6259] block">Height & Vitals</span>
              <p className="text-xs font-bold text-[#161412]">{height}</p>
              <span className="text-[10px] text-[#6E6259]">Age: {age} yrs</span>
            </div>

            {/* Career & Profession */}
            <div className="bg-white p-4 rounded-2xl border border-[#E8DDD0] shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#6E6259] block">Profession</span>
              <p className="text-xs font-bold text-[#161412] truncate">{occupation}</p>
              <span className="text-[10px] text-[#6E6259] truncate block">{city}</span>
            </div>

            {/* Education */}
            <div className="bg-white p-4 rounded-2xl border border-[#E8DDD0] shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#6E6259] block">Education</span>
              <p className="text-xs font-bold text-[#161412] truncate">{education}</p>
              <span className="text-[10px] text-[#6E6259]">Verified Degree</span>
            </div>

            {/* Annual Income */}
            <div className="bg-white p-4 rounded-2xl border border-[#E8DDD0] shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#6E6259] block">Annual Package</span>
              <p className="text-xs font-bold text-[#560406] truncate">{incomeBracket}</p>
              <span className="text-[10px] text-[#6E6259]">Verified Dossier</span>
            </div>

            {/* Cultural Community */}
            <div className="bg-white p-4 rounded-2xl border border-[#E8DDD0] shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#6E6259] block">Community</span>
              <p className="text-xs font-bold text-[#161412] truncate">{religion} · {subCommunity}</p>
              <span className="text-[10px] text-[#6E6259]">Traditional Values</span>
            </div>

            {/* Lifestyle & Diet */}
            <div className="bg-white p-4 rounded-2xl border border-[#E8DDD0] shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#6E6259] block">Diet & Lifestyle</span>
              <p className="text-xs font-bold text-[#161412] truncate">{diet}</p>
              <span className="text-[10px] text-[#6E6259]">Non-Smoker</span>
            </div>
          </div>
        </div>

        {/* 5. Verified Photos & Media Showcase */}
        <div className="bg-white rounded-[28px] p-6 border border-[#E8DDD0] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8DDD0] pb-2.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#560406] flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#A17B5E]" />
              <span>Photo Gallery ({photos.length})</span>
            </span>
            {onEditBioData && (
              <button
                type="button"
                onClick={onEditBioData}
                className="text-[11px] font-bold text-[#560406] hover:underline cursor-pointer"
              >
                Manage Photos
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {photos.map((url, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedPhotoPreview(url)}
                className="aspect-square rounded-2xl overflow-hidden border border-[#E8DDD0] bg-[#F8F6F2] hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer relative group"
              >
                <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </button>
            ))}
          </div>

          {/* Intro Video Preview */}
          {videoUrl && (
            <div className="pt-2 border-t border-[#E8DDD0] space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#560406] block">
                Video Introduction (30s)
              </span>
              <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-black shadow-inner">
                <video src={videoUrl} controls playsInline className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>

        {/* 6. Privacy & Security Trust Center */}
        <div className="bg-white rounded-[28px] border border-[#E8DDD0] divide-y divide-[#E8DDD0] shadow-xs overflow-hidden">
          <button
            type="button"
            onClick={onOpenPrivacySettings}
            className="w-full p-5 flex items-center justify-between hover:bg-[#F8F6F2] transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-[#560406]/10 text-[#560406] border border-[#A17B5E]/30">
                <ShieldCheck className="w-5 h-5 text-[#560406]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#161412]">Privacy Controls & Blur Shield</h4>
                <p className="text-[11px] text-[#6E6259]">Photo visibility, discovery mode & dossier privacy</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6E6259]" />
          </button>

          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-[#560406]/10 text-[#560406] border border-[#A17B5E]/30">
                <Lock className="w-5 h-5 text-[#560406]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#161412]">Photo Blur Shield</h4>
                <p className="text-[11px] text-[#6E6259]">
                  {privacySettings.photo_privacy === 'visible_to_everyone' ? 'Public (Visible)' : 'Protected (Request to view)'}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#560406] bg-[#A17B5E]/15 px-3 py-1 rounded-full border border-[#A17B5E]/30">
              {privacySettings.photo_privacy === 'visible_to_everyone' ? 'Standard' : 'Private'}
            </span>
          </div>
        </div>

        {/* 7. Danger Zone & Session Management */}
        <div className="bg-white rounded-[28px] border border-rose-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Delete All Profile Data</span>
              </h4>
              <p className="text-[11px] text-[#6E6259]">
                Permanently erase your candidate profile, bio-data & photos.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDeleteConfirmModal(true)}
              className="py-2 px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              Delete
            </button>
          </div>

          {currentUser && (
            <div className="pt-2 border-t border-rose-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6E6259]">Active Session: {email}</span>
              <button
                type="button"
                onClick={onLogout}
                className="text-xs font-bold text-rose-600 hover:underline cursor-pointer flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {selectedPhotoPreview && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setSelectedPhotoPreview(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors cursor-pointer"
          >
            ✕
          </button>
          <img
            src={selectedPhotoPreview}
            alt="Preview"
            className="max-w-full max-h-[75vh] object-contain rounded-2xl border-2 border-white/20 shadow-2xl"
          />
        </div>
      )}

      {/* Edit Account Identity Modal */}
      {showEditAccountModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#F8F6F2] rounded-[28px] p-6 border border-[#E8DDD0] shadow-2xl space-y-4 text-left">
            <h3 className="text-xl font-bold text-[#161412]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Edit Account Identity
            </h3>
            <form onSubmit={handleSaveAccount} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-[#E8DDD0] text-xs font-bold text-[#161412] outline-none focus:border-[#560406]"
                  />
                  <User className="w-4 h-4 text-[#A17B5E] absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#560406] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-[#E8DDD0] text-xs font-bold text-[#161412] outline-none focus:border-[#560406]"
                    required
                  />
                  <Mail className="w-4 h-4 text-[#A17B5E] absolute left-3 top-3" />
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditAccountModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#6E6259] text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#730C0F] to-[#560406] text-[#F5E6D3] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Check className="w-4 h-4 text-[#D8B486]" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-[28px] p-6 border border-rose-200 shadow-2xl space-y-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-[#161412]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                Delete All Profile Data?
              </h3>
              <p className="text-xs text-[#6E6259] leading-relaxed">
                This will permanently erase your verified bio-data, photos, intro video, saved matches, and account session. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirmModal(false)}
                className="flex-1 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-[#6E6259] text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAll}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete All</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
