import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ShieldCheck, Zap, ArrowRight, Apple, ArrowLeft, Lock } from 'lucide-react';
import type { Profile } from '../types';
import { paymentService } from '../services/paymentService';
import { iapService, isIOSDevice } from '../services/iapService';

interface SachetPaywallModalProps {
  isOpen: boolean;
  profile: Profile;
  onClose: () => void;
  onSuccess: (profileId: string) => void;
}

export const SachetPaywallModal: React.FC<SachetPaywallModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSuccess
}) => {
  const [selectedApp, setSelectedApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'apple'>('gpay');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const isIOS = isIOSDevice();

  const handleOpenConfirm = () => {
    setShowConfirm(true);
  };

  const handleConfirmPay = async () => {
    setIsProcessing(true);

    try {
      let result;
      if (selectedApp === 'apple' || isIOS) {
        result = await iapService.purchase('vip.mannat.sachet49');
      } else {
        result = await paymentService.processPayment({
          amount: 49,
          name: 'Mannat Matrimony',
          description: `Instant Unlock for ${profile.display_name}`,
          profileId: profile.id,
        });
      }

      if (result.success) {
        setShowConfirm(false);
        setIsSuccess(true);
      }
    } catch (e) {
      console.warn('Payment failed or cancelled:', e);
      setShowConfirm(false);
      setIsSuccess(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDone = () => {
    onSuccess(profile.id);
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#1C0102]/85 backdrop-blur-md">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-gradient-to-b from-[#260102] via-[#3A0204] to-[#1C0102] border border-[#A17B5E]/40 rounded-t-3xl sm:rounded-3xl p-6 text-white shadow-[0_-10px_40px_rgba(86,4,6,0.6)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1 text-xs font-bold text-[#D8B486] hover:text-white bg-[#560406]/60 hover:bg-[#560406] px-3 py-1.5 rounded-full border border-[#A17B5E]/40 cursor-pointer transition-all active:scale-95"
                title="Go Back"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#D8B486]" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#A17B5E]/20 border border-[#A17B5E]/40 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-[#D8B486]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Sachet Unlock</h3>
                  <p className="text-[10px] text-[#A17B5E] font-medium">Instant Single Profile</p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 text-neutral-300 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!isSuccess ? (
            <div className="mt-5 space-y-5">
              {/* Profile Preview Card */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#1C0102]/60 border border-[#A17B5E]/30">
                <img
                  src={profile.creator_vouch?.creator_avatar_url || ''}
                  alt={profile.display_name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#A17B5E]"
                />
                <div className="flex-1 min-w-0 text-left">
                  <h4 className="font-bold text-sm text-white truncate">{profile.display_name}</h4>
                  <p className="text-xs text-neutral-300">{profile.age} yrs • {profile.city}</p>
                  <div className="inline-flex items-center gap-1 mt-1 text-[11px] text-[#D8B486] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Behavioral Match: {profile.compatibility_score}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-neutral-400 line-through">₹199</span>
                  <div className="text-xl font-black text-[#D8B486]">₹49</div>
                </div>
              </div>

              {/* Benefits Checklist */}
              <div className="space-y-2 text-xs text-neutral-200 bg-[#1C0102]/40 p-3.5 rounded-xl border border-[#A17B5E]/20 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D8B486] flex-shrink-0" />
                  <span>Reveal Full Name, Company & Specific Salary Bracket</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D8B486] flex-shrink-0" />
                  <span>Unlock Traditional Bio-data & Family Background Card</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D8B486] flex-shrink-0" />
                  <span>Generate Shareable Family WhatsApp Web Portal Link</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="text-left">
                <label className="block text-xs font-bold text-[#A17B5E] uppercase tracking-wider mb-2.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'apple', name: ' Apple IAP' },
                    { id: 'gpay', name: 'GPay' },
                    { id: 'phonepe', name: 'PhonePe' },
                    { id: 'paytm', name: 'Paytm' },
                  ].map((app) => (
                    <button
                      key={app.id}
                      onClick={() => setSelectedApp(app.id as any)}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        selectedApp === app.id
                          ? 'border-[#A17B5E] bg-[#560406] shadow-[0_0_12px_rgba(161,123,94,0.4)] text-[#D8B486]'
                          : 'border-white/10 bg-white/5 hover:border-[#A17B5E]/40 text-neutral-300'
                      }`}
                    >
                      <span className="text-[11px] font-bold">{app.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pay Action Button */}
              <button
                type="button"
                onClick={handleOpenConfirm}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D8B486] via-[#C5A880] to-[#A17B5E] text-[#1C0102] font-black text-xs shadow-[0_4px_25px_rgba(161,123,94,0.35)] hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#F5E6D3]/40"
              >
                <span>Unlock Profile for ₹49</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[11px] text-neutral-400 flex items-center justify-center gap-1.5">
                <Apple className="w-3.5 h-3.5 text-[#A17B5E]" />
                <span>Apple StoreKit & 256-bit Encrypted Checkout</span>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-gradient-to-tr from-[#D8B486] to-[#A17B5E] rounded-full flex items-center justify-center mx-auto text-[#1C0102] shadow-[0_0_30px_rgba(161,123,94,0.6)]"
              >
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </motion.div>
              <div>
                <h4 className="text-xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Payment Successful!</h4>
                <p className="text-xs text-[#D8B486] mt-1">Profile for {profile.display_name} has been fully unlocked.</p>
              </div>

              <div className="bg-[#1C0102]/60 border border-[#A17B5E]/30 rounded-2xl p-3.5 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Candidate</span>
                  <span className="font-bold text-white">{profile.display_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Amount Paid</span>
                  <span className="font-bold text-[#D8B486]">₹49</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Status</span>
                  <span className="font-bold text-emerald-400">Unlocked & Verified</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDone}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D8B486] via-[#C5A880] to-[#A17B5E] text-[#1C0102] font-black text-xs shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
              >
                Done • View Full Bio-Data
              </button>
            </div>
          )}

          {/* Sachet Payment Confirmation Sheet */}
          {showConfirm && (
            <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                className="w-full max-w-sm bg-[#260102] border border-[#A17B5E]/50 rounded-t-[32px] sm:rounded-[32px] p-6 text-white text-left space-y-4 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#560406] text-[#D8B486] flex items-center justify-center">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Confirm Unlock</h4>
                      <p className="text-[10px] text-[#A17B5E]">One-time In-App Purchase</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfirm(false)}
                    className="p-1 rounded-full text-neutral-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-[#1C0102]/80 rounded-2xl p-4 border border-[#A17B5E]/30 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Candidate:</span>
                    <span className="font-bold text-white">{profile.display_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Charge:</span>
                    <span className="text-base font-black text-[#D8B486]">₹49</span>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  You will be charged <strong>₹49</strong> for a single profile unlock with full salary reveal and shareable bio-data.
                </p>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleConfirmPay}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D8B486] to-[#A17B5E] text-[#1C0102] font-black text-xs uppercase tracking-wider shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Processing In-App Purchase...</span>
                      </div>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Confirm &amp; Pay ₹49</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => setShowConfirm(false)}
                    className="w-full py-2 text-center text-xs font-bold text-neutral-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

