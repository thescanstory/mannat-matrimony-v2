import React, { useState } from 'react';
import { X, Check, RefreshCw, ShieldCheck, FileText, Apple, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NudgeBanner } from './NudgeBanner';

import confetti from 'canvas-confetti';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { paymentService } from '../services/paymentService';
import { iapService, isIOSDevice } from '../services/iapService';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTier?: (tier: string) => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  onSelectTier
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'gold' | 'diamond' | 'platinum'>('diamond');
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);
  const [showLegalModal, setShowLegalModal] = useState<'eula' | 'privacy' | null>(null);
  const isIOS = isIOSDevice();

  if (!isOpen) return null;

  const PLANS = [
    {
      id: 'gold',
      appleProductId: 'vip.mannat.sub.gold',
      name: 'Mannat Gold',
      price: '₹1,999 / $19.99',
      amount: 1999,
      period: '/ month',
      popular: false,
      features: [
        'Unlimited Interest Waves',
        'View Verified Phone Numbers',
        'View Who Viewed & Shortlisted You',
        'Direct Family WhatsApp Sharing'
      ]
    },
    {
      id: 'diamond',
      appleProductId: 'vip.mannat.sub.diamond',
      name: 'Mannat Diamond',
      price: '₹2,999 / $29.99',
      amount: 2999,
      period: '/ month',
      popular: true,
      features: [
        'Everything in Gold',
        'In-App Video & Voice Call without revealing number',
        'Certified Matchmaker Priority Vouch',
        'Gold Verified Blue Badge Boost'
      ]
    },
    {
      id: 'platinum',
      appleProductId: 'vip.mannat.sub.platinum',
      name: 'Mannat Platinum',
      price: '₹4,999 / $49.99',
      amount: 4999,
      period: '/ month',
      popular: false,
      features: [
        'Everything in Diamond',
        '24h Profile Spotlight Booster (Top Feed Placement)',
        'Golden Halo Ring Around Profile',
        'Dedicated Personal Relationship Concierge'
      ]
    }
  ];

  const handleUpgrade = async () => {
    setUpgrading(true);
    const planObj = PLANS.find((p) => p.id === selectedPlan) || PLANS[1];

    try {
      let payment;
      if (isIOS) {
        payment = await iapService.purchase(planObj.appleProductId);
      } else {
        payment = await paymentService.processPayment({
          amount: planObj.amount,
          name: 'Mannat Luxury Membership',
          description: `Upgrade to ${planObj.name}`,
          tierId: planObj.id,
        });
      }

      if (payment.success) {
        if (isSupabaseConfigured()) {
          try {
            const { data: userData } = await supabase.auth.getUser();
            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
            await supabase.from('subscriptions').insert([
              {
                user_id: userData?.user?.id,
                tier: selectedPlan,
                status: 'active',
                expires_at: expiresAt
              }
            ]);
          } catch (e) {
            console.warn('Subscription DB sync fallback:', e);
          }
        }

        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#B89552', '#FFD700', '#FFFFFF']
        });

        setUpgradeSuccess(true);
        if (onSelectTier) onSelectTier(selectedPlan);

        setTimeout(() => {
          setUpgradeSuccess(false);
          onClose();
        }, 1500);
      }
    } catch {
      if (onSelectTier) onSelectTier(selectedPlan);
      onClose();
    } finally {
      setUpgrading(false);
    }
  };

  const handleRestorePurchases = async () => {
    setRestoring(true);
    try {
      const { restored, activeProducts } = await iapService.restorePurchases();
      if (restored && activeProducts.length > 0) {
        setRestoreMessage(`✓ Successfully restored ${activeProducts.length} active subscription(s)!`);
        if (onSelectTier) onSelectTier('diamond');
      } else {
        setRestoreMessage('No active App Store subscriptions found for this Apple ID.');
      }
    } catch {
      setRestoreMessage('Unable to restore purchases from Apple StoreKit.');
    } finally {
      setRestoring(false);
      setTimeout(() => setRestoreMessage(null), 4000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#2D2824]/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="w-full max-w-md h-[92vh] sm:h-[840px] bg-[#FBF9F4] text-[#111111] rounded-t-[36px] sm:rounded-[36px] overflow-hidden flex flex-col justify-between select-none font-sans border border-[#E8E1D5] shadow-2xl relative"
        >
          {/* Header */}
          <div className="px-5 pt-4 pb-3.5 bg-[#FBF9F4] border-b border-[#E8E1D5] flex items-center justify-between shadow-xs sticky top-0 z-20">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 text-xs font-extrabold text-[#111111] hover:text-[#B89552] bg-[#F4EFE6] hover:bg-[#E8E1D5] px-3.5 py-1.5 rounded-full border border-[#E8E1D5] transition-all active:scale-95 cursor-pointer shadow-xs"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4 text-[#B89552]" />
                <span>Back</span>
              </button>
              <div className="h-4 w-px bg-[#E8E1D5]" />
              <span className="font-instrument text-2xl lowercase text-[#B89552] leading-none">mannat</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#E8E1D5]/50 text-gray-400 hover:text-[#111111] transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Paywall Body */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1 bg-[#FBF9F4]">
            {upgradeSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-extrabold rounded-2xl text-center animate-fadeIn">
                ✓ Subscription Active via Apple StoreKit! Unlocking verified candidates...
              </div>
            )}

            {restoreMessage && (
              <div className="p-3 bg-amber-50 border border-amber-300 text-[#8C6D32] text-xs font-extrabold rounded-2xl text-center animate-fadeIn">
                {restoreMessage}
              </div>
            )}

            {/* Banner */}
            <NudgeBanner
          title="PREMIUM INTRODUCTIONS"
          subtitle="Unlock direct contact & verified intros."
          className="bg-[#F4EFE6] border-[#E8E1D5]"
        >
          <p className="text-xs text-[#777777] font-medium leading-relaxed max-w-full">
            Discretion guaranteed. Manage your auto-renewable subscription safely through Apple App Store.
          </p>
        </NudgeBanner>

            {/* Plan Selector Grid */}
            <div className="space-y-3">
              {PLANS.map((plan) => {
                const isSelected = selectedPlan === plan.id;

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id as any)}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#2D2824] text-white border-[#111111] shadow-xl scale-[1.01]'
                        : 'bg-[#F4EFE6] text-[#111111] border-[#E8E1D5] hover:bg-[#E8E1D5]'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 right-6 bg-[#B89552] text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md border border-white">
                        ★ MOST POPULAR
                      </span>
                    )}

                    <div className="flex items-center justify-between pb-3 border-b border-gray-700/40">
                      <div>
                        <h3 className="font-serif-editorial text-xl font-bold">{plan.name}</h3>
                        <span className={`text-[11px] font-extrabold ${isSelected ? 'text-[#B89552]' : 'text-[#777777]'}`}>
                          Apple In-App Pass
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black">{plan.price}</span>
                        <span className={`text-[10px] block ${isSelected ? 'text-gray-400' : 'text-[#777777]'}`}>
                          {plan.period}
                        </span>
                      </div>
                    </div>

                    <ul className="mt-3 space-y-2 text-xs">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className={`w-3.5 h-3.5 ${isSelected ? 'text-[#B89552]' : 'text-[#111111]'}`} />
                          <span className={isSelected ? 'text-gray-200' : 'text-[#555555]'}>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Apple Mandatory Subscription Terms & Legal Links */}
            <div className="pt-2 pb-1 text-center space-y-2 border-t border-[#E8E1D5]">
              <div className="flex items-center justify-center gap-3 text-[11px] font-bold text-[#777777]">
                <button
                  type="button"
                  onClick={handleRestorePurchases}
                  disabled={restoring}
                  className="hover:text-[#111111] flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${restoring ? 'animate-spin' : ''}`} />
                  <span>Restore Purchases</span>
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setShowLegalModal('eula')}
                  className="hover:text-[#111111] flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3 h-3" />
                  <span>Terms (EULA)</span>
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setShowLegalModal('privacy')}
                  className="hover:text-[#111111] flex items-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Privacy Policy</span>
                </button>
              </div>

              <p className="text-[10px] text-gray-500 leading-tight max-w-xs mx-auto">
                Payment will be charged to your Apple ID Account at confirmation of purchase. Subscription automatically renews unless cancelled at least 24 hours before the end of the current period.
              </p>
            </div>
          </div>

          {/* Sticky Subscribe & Back Button */}
          <div className="p-5 border-t border-[#E8E1D5] bg-[#FBF9F4] sticky bottom-0 z-20 shadow-lg space-y-2.5">
            <button
              type="button"
              disabled={upgrading}
              onClick={handleUpgrade}
              className="w-full py-4 px-6 rounded-full bg-[#2D2824] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#B89552] active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Apple className="w-4 h-4 text-white" />
              <span>{upgrading ? 'Processing StoreKit...' : `Subscribe via Apple Pay`}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-full bg-transparent hover:bg-[#F4EFE6] text-[#777777] hover:text-[#2D2824] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Go Back / Maybe Later</span>
            </button>
          </div>

          {/* Legal Modal Popup (EULA & Privacy) */}
          {showLegalModal && (
            <div className="fixed inset-0 z-60 bg-[#2D2824]/80 flex items-center justify-center p-4">
              <div className="bg-[#FBF9F4] rounded-3xl p-6 max-w-sm w-full space-y-4 border border-[#E8E1D5] shadow-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-3">
                  <h4 className="font-bold text-sm text-[#2D2824]">
                    {showLegalModal === 'eula' ? 'Standard Apple EULA & Terms' : 'Mannat Privacy Policy'}
                  </h4>
                  <button onClick={() => setShowLegalModal(null)} className="text-xs text-gray-400 hover:text-[#2D2824]">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-[#555555] space-y-2 leading-relaxed">
                  {showLegalModal === 'eula' ? (
                    <>
                      <p>
                        This Application utilizes the Apple Standard End User License Agreement (EULA) and strictly prohibits objectionable content and abusive users.
                      </p>
                      <p>
                        Users can filter and block profiles, report misconduct, and delete their accounts at any time from the Privacy Center.
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        Mannat values your matrimonial privacy. Your phone number, financial details, and private videos are shielded with encryption and never shared without mutual wave acceptance.
                      </p>
                      <p>
                        You can request full data wiping and account deletion directly from the settings menu.
                      </p>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowLegalModal(null)}
                  className="w-full py-2.5 rounded-xl bg-[#2D2824] text-white text-xs font-bold"
                >
                  I Understand
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
