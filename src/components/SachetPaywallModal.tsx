import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ShieldCheck, Zap, ArrowRight, Apple } from 'lucide-react';
import confetti from 'canvas-confetti';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const isIOS = isIOSDevice();

  const handlePayNow = async () => {
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
        setIsSuccess(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FFE55C', '#FFFFFF']
        });

        setTimeout(() => {
          onSuccess(profile.id);
          setIsSuccess(false);
          onClose();
        }, 1200);
      }
    } catch (e) {
      console.warn('Payment failed or cancelled:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-gradient-to-b from-gray-900 via-black to-gray-950 border border-yellow-500/30 rounded-t-3xl sm:rounded-3xl p-6 text-white shadow-[0_-10px_40px_rgba(255,215,0,0.2)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
                <Zap className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Sachet Paywall</h3>
                <p className="text-xs text-amber-400/80 font-medium">Instant Single Profile Unlock</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-800/80 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isSuccess ? (
            <div className="mt-5 space-y-5">
              {/* Profile Preview Card */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gray-800/50 border border-gray-700/50">
                <img
                  src={profile.creator_vouch?.creator_avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={profile.display_name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-amber-400/60"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-white truncate">{profile.display_name}</h4>
                  <p className="text-xs text-gray-400">{profile.age} yrs • {profile.city}</p>
                  <div className="inline-flex items-center gap-1 mt-1 text-[11px] text-amber-300 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Behavioral Match: {profile.compatibility_score}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 line-through">₹199</span>
                  <div className="text-xl font-black text-amber-300">₹49 / $0.99</div>
                </div>
              </div>

              {/* Benefits Checklist */}
              <div className="space-y-2 text-xs text-gray-300 bg-black/40 p-3.5 rounded-xl border border-gray-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Reveal Full Name, Company & Specific Salary Bracket</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Unlock Traditional Bio-data & Family Background Card</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Generate Shareable Family WhatsApp Web Portal Link</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  Payment Method (In-App Purchase / UPI)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'apple', name: ' Apple IAP', color: 'bg-white/10 border-white/30 text-white' },
                    { id: 'gpay', name: 'GPay', color: 'bg-blue-600/20 border-blue-500/40 text-blue-300' },
                    { id: 'phonepe', name: 'PhonePe', color: 'bg-purple-600/20 border-purple-500/40 text-purple-300' },
                    { id: 'paytm', name: 'Paytm', color: 'bg-cyan-600/20 border-cyan-500/40 text-cyan-300' },
                  ].map((app) => (
                    <button
                      key={app.id}
                      onClick={() => setSelectedApp(app.id as any)}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        selectedApp === app.id
                          ? 'border-amber-400 bg-amber-500/20 shadow-[0_0_12px_rgba(255,215,0,0.3)]'
                          : 'border-gray-800 bg-gray-900/60 hover:border-gray-700'
                      }`}
                    >
                      <span className="text-[11px] font-bold">{app.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pay Action Button */}
              <button
                disabled={isProcessing}
                onClick={handlePayNow}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-extrabold text-sm shadow-[0_4px_25px_rgba(255,215,0,0.4)] hover:shadow-[0_6px_30px_rgba(255,215,0,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Processing In-App Purchase...</span>
                  </div>
                ) : (
                  <>
                    <span>Unlock for ₹49 ($0.99)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
                <Apple className="w-3.5 h-3.5 text-gray-400" />
                <span>Apple StoreKit & 256-bit Encrypted Checkout</span>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-full flex items-center justify-center mx-auto text-black shadow-[0_0_30px_rgba(255,215,0,0.6)]"
              >
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </motion.div>
              <h4 className="text-xl font-black text-white">Payment Successful!</h4>
              <p className="text-xs text-amber-300">Profile Unlocked • Dissolving Blur Shield...</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
