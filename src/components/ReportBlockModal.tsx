import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, UserX, Flag, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { Profile } from '../types';
import { nativeService } from '../services/nativeService';

interface ReportBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  onBlockSuccess?: (profileId: string) => void;
  onReportSuccess?: (profileId: string, reason: string) => void;
}

const REPORT_REASONS = [
  'Inauthentic or Fake Bio-Data',
  'Inappropriate or Impersonated Photographs',
  'Commercial Solicitation / Financial Scam',
  'Harassment or Disrespectful Behavior',
  'Underage / Non-Serious Matrimonial Intent',
  'Other Policy Violation'
];

export const ReportBlockModal: React.FC<ReportBlockModalProps> = ({
  isOpen,
  onClose,
  profile,
  onBlockSuccess,
  onReportSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'options' | 'report' | 'block_confirm'>('options');
  const [selectedReason, setSelectedReason] = useState<string>(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  if (!isOpen || !profile) return null;

  const handleBlock = () => {
    setSubmitting(true);
    nativeService.haptic.medium();

    try {
      // Save blocked profile ID to local storage
      const stored = localStorage.getItem('mannat_blocked_profiles');
      const blockedList: string[] = stored ? JSON.parse(stored) : [];
      if (!blockedList.includes(profile.id)) {
        blockedList.push(profile.id);
        localStorage.setItem('mannat_blocked_profiles', JSON.stringify(blockedList));
      }

      setSubmittedMessage(`You have blocked ${profile.display_name}. Their bio-data will no longer be visible to you.`);
      setTimeout(() => {
        setSubmitting(false);
        if (onBlockSuccess) onBlockSuccess(profile.id);
        handleClose();
      }, 1500);
    } catch {
      setSubmitting(false);
      handleClose();
    }
  };

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    nativeService.haptic.success();

    // Also auto-block the user on report for safety
    try {
      const stored = localStorage.getItem('mannat_blocked_profiles');
      const blockedList: string[] = stored ? JSON.parse(stored) : [];
      if (!blockedList.includes(profile.id)) {
        blockedList.push(profile.id);
        localStorage.setItem('mannat_blocked_profiles', JSON.stringify(blockedList));
      }
    } catch (e) {
      console.warn('Block on report storage error:', e);
    }

    setTimeout(() => {
      setSubmitting(false);
      setSubmittedMessage(`Thank you. Your report against ${profile.display_name} has been submitted to our Trust & Safety team. This profile has been blocked from your view.`);
      if (onReportSuccess) onReportSuccess(profile.id, selectedReason);
      if (onBlockSuccess) onBlockSuccess(profile.id);
      setTimeout(() => {
        handleClose();
      }, 2000);
    }, 600);
  };

  const handleClose = () => {
    setActiveTab('options');
    setSelectedReason(REPORT_REASONS[0]);
    setDetails('');
    setSubmittedMessage(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-[#FBF9F4] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E8E1D5] overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E8E1D5] flex items-center justify-between bg-white/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-rose-700" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#2D2824]">Safety & Moderation</h3>
                <p className="text-[11px] text-[#6E6259]">Actions for {profile.display_name} ({profile.id})</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-[#E8E1D5]/40 hover:bg-[#E8E1D5] flex items-center justify-center text-[#2D2824] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
            {submittedMessage ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[#2D2824]">Action Completed</h4>
                <p className="text-xs text-[#6E6259] leading-relaxed max-w-xs mx-auto">
                  {submittedMessage}
                </p>
              </div>
            ) : activeTab === 'options' ? (
              <div className="space-y-3">
                <p className="text-xs text-[#6E6259] leading-relaxed">
                  We are committed to maintaining an authentic, verified matrimonial environment. If this profile violates our community guidelines, choose an option below:
                </p>

                {/* Option 1: Report Profile */}
                <button
                  onClick={() => {
                    nativeService.haptic.light();
                    setActiveTab('report');
                  }}
                  className="w-full p-4 rounded-2xl bg-white border border-[#E8E1D5] hover:border-amber-300 hover:bg-amber-50/40 transition flex items-center justify-between text-left group cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                      <Flag className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#2D2824] group-hover:text-amber-900">
                        Report Bio-Data or Photo
                      </div>
                      <div className="text-[11px] text-[#6E6259]">
                        Flag misleading information, inappropriate content, or misconduct
                      </div>
                    </div>
                  </div>
                </button>

                {/* Option 2: Block Profile */}
                <button
                  onClick={() => {
                    nativeService.haptic.light();
                    setActiveTab('block_confirm');
                  }}
                  className="w-full p-4 rounded-2xl bg-white border border-[#E8E1D5] hover:border-rose-300 hover:bg-rose-50/40 transition flex items-center justify-between text-left group cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                      <UserX className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#2D2824] group-hover:text-rose-900">
                        Block {profile.display_name}
                      </div>
                      <div className="text-[11px] text-[#6E6259]">
                        Permanently hide this candidate from your feed and messaging
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            ) : activeTab === 'report' ? (
              <form onSubmit={handleReport} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2D2824] flex items-center gap-1.5">
                    <Flag className="w-3.5 h-3.5 text-rose-600" />
                    Reason for Reporting:
                  </label>
                  <div className="space-y-2">
                    {REPORT_REASONS.map((reason) => (
                      <label
                        key={reason}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                          selectedReason === reason
                            ? 'bg-[#560406]/5 border-[#560406] text-[#560406] font-bold'
                            : 'bg-white border-[#E8DDD0] text-[#4A4036]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="reportReason"
                          checked={selectedReason === reason}
                          onChange={() => setSelectedReason(reason)}
                          className="accent-[#560406]"
                        />
                        <span>{reason}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#2D2824]">
                    Additional Details (Optional):
                  </label>
                  <textarea
                    rows={2}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Provide any specific context for our Trust & Safety team..."
                    className="w-full p-2.5 text-xs bg-white border border-[#E8DDD0] rounded-xl outline-none focus:ring-2 focus:ring-[#560406]"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('options')}
                    className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-xs font-bold text-white transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Submitting...' : 'Submit & Block'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Block Confirmation */
              <div className="space-y-4 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#2D2824]">
                    Block {profile.display_name}?
                  </h4>
                  <p className="text-xs text-[#6E6259] max-w-xs mx-auto">
                    They will no longer be able to view your profile, send interest, or message you. This candidate will be permanently removed from your feed.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('options')}
                    className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleBlock}
                    className="flex-1 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-xs font-bold text-white transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Blocking...' : 'Confirm Block'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
