import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Crown, 
  UserCheck, 
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
  AlertTriangle
} from 'lucide-react';
import { authService } from '../services/authService';
import type { UserSession } from '../services/authService';
import type { PrivacySettings } from '../types';

interface ProfileScreenProps {
  currentUser: UserSession | null;
  privacySettings: PrivacySettings;
  isParentView: boolean;
  onToggleParentView: () => void;
  onOpenPrivacySettings: () => void;
  onOpenPaywall: () => void;
  onOpenOnboarding?: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onDeleteAllData?: () => void;
  onUpdateUser?: (updated: UserSession) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  privacySettings,
  isParentView,
  onToggleParentView,
  onOpenPrivacySettings,
  onOpenPaywall,
  onOpenAuth,
  onLogout,
  onDeleteAllData,
  onUpdateUser
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [editName, setEditName] = useState(currentUser?.user_metadata?.full_name || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');

  const displayName = currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || 'Member Candidate';
  const email = currentUser?.email || 'Not signed in';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editEmail.trim()) return;
    const updated = authService.setUserSession(editEmail, editName, currentUser?.user_metadata?.avatar_url);
    if (onUpdateUser) {
      onUpdateUser(updated);
    }
    setShowEditModal(false);
  };

  const handleConfirmDeleteAll = () => {
    setShowDeleteConfirmModal(false);
    if (onDeleteAllData) {
      onDeleteAllData();
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FBF9F4] text-[#111111] pb-28 select-none font-sans">

      <div className="p-5 space-y-5">
        {/* User Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E1D5] shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#F4EFE6] border-2 border-[#B89552]/40 flex items-center justify-center text-[#B89552] text-xl font-serif-editorial font-bold shadow-inner">
              {currentUser?.user_metadata?.avatar_url ? (
                <img 
                  src={currentUser.user_metadata.avatar_url} 
                  alt={displayName} 
                  className="w-full h-full rounded-full object-cover" 
                />
              ) : (
                <User className="w-8 h-8 text-[#B89552]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-serif-editorial font-bold text-[#111111] truncate">{displayName}</h2>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified</span>
                </span>
              </div>
              <p className="text-xs text-[#777777] truncate">{email}</p>
            </div>

            {currentUser && (
              <button
                type="button"
                onClick={() => {
                  setEditName(currentUser.user_metadata?.full_name || '');
                  setEditEmail(currentUser.email || '');
                  setShowEditModal(true);
                }}
                className="p-2 rounded-full hover:bg-[#F4EFE6] text-[#B89552] border border-[#E8E1D5] transition-all cursor-pointer"
                title="Edit Name & Email"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Auth Action Buttons */}
          <div className="mt-5 pt-4 border-t border-[#E8E1D5]">
            {currentUser ? (
              <button
                type="button"
                onClick={onLogout}
                className="w-full py-2.5 px-4 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border border-rose-200 active:scale-98"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of Account</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full py-2.5 px-4 rounded-full bg-[#111111] hover:bg-[#B89552] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
              >
                <LogIn className="w-4 h-4 text-[#B89552]" />
                <span>Sign In to Account</span>
              </button>
            )}
          </div>
        </div>

        {/* Premium Upgrade Banner */}
        <div 
          onClick={onOpenPaywall}
          className="bg-gradient-to-br from-[#1A1A1A] to-[#2C261E] rounded-3xl p-5 text-white border border-[#B89552]/40 shadow-sm cursor-pointer hover:border-[#B89552] transition-all active:scale-98 group"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#B89552]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#B89552]">MEMBERSHIP STATUS</span>
              </div>
              <h3 className="text-base font-serif-editorial font-bold text-white">Mannat Gold Membership</h3>
              <p className="text-xs text-gray-300">Unlock unlimited verified contact direct requests & phone invites</p>
            </div>
            <div className="p-2.5 rounded-full bg-[#B89552] text-[#111111] group-hover:scale-105 transition-transform">
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Privacy & Security Section */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#8C6D32] px-1 block">
            Privacy & Trust Center
          </span>
          <div className="bg-white rounded-3xl border border-[#E8E1D5] divide-y divide-[#E8E1D5] shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={onOpenPrivacySettings}
              className="w-full p-4 flex items-center justify-between hover:bg-[#F4EFE6] transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-2xl bg-amber-50 text-[#B89552] border border-[#B89552]/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111111]">Privacy Controls & Blur Shield</h4>
                  <p className="text-[11px] text-[#777777]">Photo visibility, discovery mode & financial badges</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#888888]" />
            </button>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111111]">Photo Blur Shield</h4>
                  <p className="text-[11px] text-[#777777]">
                    {privacySettings.photo_privacy === 'visible_to_everyone' ? 'Public (Visible)' : 'Protected (Request to view)'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#8C6D32] bg-[#F4EFE6] px-2.5 py-1 rounded-full border border-[#E8E1D5]">
                {privacySettings.photo_privacy === 'visible_to_everyone' ? 'Standard' : 'Private'}
              </span>
            </div>
          </div>
        </div>

        {/* Discovery & App Modes */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#8C6D32] px-1 block">
            App Modes & Discovery
          </span>
          <div className="bg-white rounded-3xl border border-[#E8E1D5] divide-y divide-[#E8E1D5] shadow-xs overflow-hidden">
            {/* Parent Mode Toggle */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-2xl border ${isParentView ? 'bg-amber-600 text-white border-amber-600' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111111]">Parent View Mode</h4>
                  <p className="text-[11px] text-[#777777]">Large text & family bio-data oriented interface</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onToggleParentView}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer shadow-xs ${
                  isParentView ? 'bg-amber-600 text-white' : 'bg-[#F4EFE6] text-[#111111] hover:bg-[#E8E1D5]'
                }`}
              >
                {isParentView ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone: Delete All Profile Data */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 px-1 block">
            Account Management & Data Reset
          </span>
          <div className="bg-white rounded-3xl border border-rose-200 p-4 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>Delete All Profile Data</span>
                </h4>
                <p className="text-[11px] text-[#777777] leading-relaxed">
                  Permanently erase your bio-data, candidate persona, photos, video intro, and wave history.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteConfirmModal(true)}
                className="py-2 px-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-extrabold transition-all cursor-pointer shadow-sm shrink-0"
              >
                Delete Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Account Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#FBF9F4] rounded-3xl p-6 border border-[#E8E1D5] shadow-2xl space-y-4 text-left">
            <h3 className="text-base font-serif-editorial font-bold text-[#111111]">
              Edit Account Identity
            </h3>
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none focus:border-[#B89552]"
                  />
                  <User className="w-4 h-4 text-[#B89552] absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none focus:border-[#B89552]"
                    required
                  />
                  <Mail className="w-4 h-4 text-[#B89552] absolute left-3 top-3" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#555555] text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#111111] hover:bg-[#B89552] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-rose-200 shadow-2xl space-y-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-serif-editorial font-bold text-[#111111]">
                Delete All Profile Data?
              </h3>
              <p className="text-xs text-[#777777] leading-relaxed">
                This will permanently erase your verified bio-data, photos, intro video, saved matches, and account session. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirmModal(false)}
                className="flex-1 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-[#555555] text-xs font-bold transition-all cursor-pointer"
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
