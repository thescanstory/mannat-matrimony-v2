import React, { useState } from 'react';
import { X, Check, RefreshCw, ShieldCheck, FileText, Apple, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NudgeBanner } from './NudgeBanner';

import { Capacitor } from '@capacitor/core';
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
  const [selectedPlan, setSelectedPlan] = useState<'sachet' | 'gold' | 'diamond' | 'platinum'>('diamond');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [transactionReceipt, setTransactionReceipt] = useState<{ id: string; date: string } | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);
  const [showLegalModal, setShowLegalModal] = useState<'eula' | 'privacy' | null>(null);

  // Distinguish native iOS app from web app (desktop / mobile web uses Razorpay)
  const isNativeIOS = Capacitor.isNativePlatform() && isIOSDevice();

  if (!isOpen) return null;

  const PLANS = [
    {
      id: 'sachet',
      appleProductId: 'vip.mannat.sachet49',
      name: 'Single Profile Unlock',
      price: '₹49',
      amount: 49,
      period: ' (One-Time)',
      popular: false,
      features: [
        'Instant Unlock of 1 Candidate Biodata',
        'Reveal Full Name & Salary Bracket',
        'Direct WhatsApp Family Sharing Card'
      ]
    },
    {
      id: 'gold',
      appleProductId: 'vip.mannat.sub.gold',
      name: 'Gold Member Pass',
      price: '₹1,999',
      amount: 1999,
      period: '/month',
      popular: false,
      features: [
        'Unlock up to 10 Candidate Profiles / mo',
        'Direct Phone & Horoscope Sharing',
        'Gold Verified Member Badge'
      ]
    },
    {
      id: 'diamond',
      appleProductId: 'vip.mannat.sub.diamond',
      name: 'Diamond VIP Pass',
      price: '₹4,999',
      amount: 4999,
      period: '/month',
      popular: true,
      features: [
        'Unlimited Bio-Data Profile Unlocks',
        'Priority Matchmaker Introductions',
        'BlurShield™ Unrestricted Access'
      ]
    },
    {
      id: 'platinum',
      appleProductId: 'vip.mannat.sub.platinum',
      name: 'Royal Concierge Pass',
      price: '₹9,999',
      amount: 9999,
      period: '/month',
      popular: false,
      features: [
        'Dedicated Private Matchmaker',
        'Private In-Person Meeting Arrangements',
        'Horoscope & Kundli Consultation'
      ]
    }
  ];

  const currentPlanObj = PLANS.find(p => p.id === selectedPlan) || PLANS[2];

  const handleOpenConfirmation = () => {
    setRestoreMessage(null);
    setShowConfirmModal(true);
  };

  const handleConfirmPurchase = async () => {
    setUpgrading(true);
    setRestoreMessage(null);
    const planObj = currentPlanObj;

    try {
      let payment: { success: boolean; paymentId?: string; error?: string } = { success: false };
      
      if (isNativeIOS) {
        payment = await iapService.purchase(planObj.appleProductId);
      } else {
        payment = await paymentService.processPayment({
          amount: planObj.amount,
          name: 'Mannat Matrimony',
          description: `Unlock ${planObj.name}`,
          tierId: planObj.id,
        });
      }

      if (payment && payment.success) {
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
            console.warn('Subscription DB sync notice:', e);
          }
        }

        setTransactionReceipt({
          id: payment.paymentId || `TXN-RZP-${Date.now()}`,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        });
        setShowConfirmModal(false);
        setUpgradeSuccess(true);
        if (onSelectTier) onSelectTier(selectedPlan);
      } else if (payment && payment.error && payment.error !== 'Payment cancelled by user') {
        setRestoreMessage(`Payment notice: ${payment.error}`);
        setShowConfirmModal(false);
      } else {
        // User cancelled modal
        setShowConfirmModal(false);
      }
    } catch (err: any) {
      console.warn('Payment execution error:', err);
      setRestoreMessage('Payment could not be completed. Please try again.');
      setShowConfirmModal(false);
    } finally {
      setUpgrading(false);
    }
  };

  const handleDoneSuccess = () => {
    setUpgradeSuccess(false);
    onClose();
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
      <div className="fixed inset-0 z-[999] bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="w-full max-w-md md:max-w-2xl lg:max-w-3xl h-[92vh] sm:h-auto sm:max-h-[88vh] bg-[#F8F6F2] text-[#161412] rounded-t-[36px] sm:rounded-[36px] overflow-hidden flex flex-col justify-between select-none font-sans border border-[#E8DDD0] shadow-2xl relative"
        >
          {/* Header */}
          <div className="px-5 pt-4 pb-3.5 bg-[#F8F6F2] border-b border-[#E8DDD0] flex items-center justify-between shadow-xs sticky top-0 z-20">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 text-xs font-extrabold text-[#560406] hover:text-[#730C0F] bg-white hover:bg-[#F8F6F2] px-3.5 py-1.5 rounded-full border border-[#E8DDD0] transition-all active:scale-95 cursor-pointer shadow-xs"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4 text-[#560406]" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-2">
                <img
                  src="/images/mannat-logo-square.png"
                  alt="Mannat"
                  className="w-7 h-7 rounded-lg object-cover shadow-xs ring-1 ring-[#560406]/20"
                />
                <div className="flex flex-col text-left">
                  <span className="text-xs italic font-normal text-[#560406] -mb-1 leading-none" style={{ fontFamily: "'Pinyon Script', cursive" }}>At</span>
                  <span className="text-base font-normal tracking-[0.2em] uppercase text-[#560406] leading-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>MANNAT</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white text-gray-400 hover:text-[#161412] transition-colors cursor-pointer border border-[#E8DDD0]"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Upgrade Success View */}
          {upgradeSuccess ? (
            <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-6 bg-[#F8F6F2]">
              <div className="w-20 h-20 bg-gradient-to-tr from-[#D8B486] to-[#A17B5E] rounded-full flex items-center justify-center text-[#1C0102] shadow-xl border-4 border-white">
                <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-black text-[#A17B5E]">
                  PAYMENT &amp; MEMBERSHIP CONFIRMED
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#560406]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  Welcome to {currentPlanObj.name}!
                </h2>
                <p className="text-xs text-[#6E6259] max-w-xs mx-auto leading-relaxed">
                  Your Apple StoreKit subscription is active. All premium candidate features, direct phone numbers, and priority vouching are now unlocked.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="w-full bg-white border border-[#E8DDD0] rounded-2xl p-4 text-left space-y-2.5 shadow-xs">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-[#E8DDD0]">
                  <span className="text-[#6E6259] font-medium">Plan</span>
                  <span className="font-bold text-[#161412]">{currentPlanObj.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-[#E8DDD0]">
                  <span className="text-[#6E6259] font-medium">Amount</span>
                  <span className="font-bold text-[#560406]">{currentPlanObj.price} {currentPlanObj.period}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] pb-2 border-b border-[#E8DDD0]">
                  <span className="text-[#6E6259] font-medium">Transaction ID</span>
                  <code className="font-bold text-[#161412] bg-[#F8F6F2] px-1.5 py-0.5 rounded">{transactionReceipt?.id}</code>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#6E6259] font-medium">Status</span>
                  <span className="font-extrabold text-emerald-700 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Active &amp; Verified
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDoneSuccess}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#730C0F] via-[#560406] to-[#3A0204] text-[#F5E6D3] font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-98 transition shadow-lg cursor-pointer border border-[#A17B5E]/50"
              >
                Done • Start Exploring
              </button>
            </div>
          ) : (
            <>
              {/* Paywall Body */}
              <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 bg-[#F8F6F2]">
                {restoreMessage && (
                  <div className="p-3 bg-amber-50 border border-amber-300 text-[#8C6D32] text-xs font-extrabold rounded-2xl text-center animate-fadeIn">
                    {restoreMessage}
                  </div>
                )}

                {/* Banner */}
                <NudgeBanner
                  title="PREMIUM INTRODUCTIONS"
                  subtitle="Unlock direct contact &amp; verified intros."
                  className="bg-[#F8F6F2] border-[#E8DDD0]"
                >
                  <p className="text-xs text-[#6E6259] font-medium leading-relaxed max-w-full">
                    {isNativeIOS
                      ? 'Discretion guaranteed. Manage your auto-renewable subscription safely through Apple App Store.'
                      : 'Discretion guaranteed. Secure online payments powered by Razorpay (UPI, Credit/Debit Cards, NetBanking).'}
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
                        className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-gradient-to-b from-[#3A0204] via-[#560406] to-[#260102] text-white border-2 border-[#A17B5E] shadow-xl scale-[1.01]'
                            : 'bg-white text-[#161412] border-[#E8DDD0] hover:bg-[#F8F6F2]'
                        }`}
                      >
                        {plan.popular && (
                          <span className="absolute -top-3 right-6 bg-[#A17B5E] text-[#1C0102] text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md border border-[#F5E6D3]/60">
                            ★ MOST POPULAR
                          </span>
                        )}

                        <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{plan.name}</h3>
                            <span className={`text-[11px] font-extrabold ${isSelected ? 'text-[#D8B486]' : 'text-[#A17B5E]'}`}>
                              {isNativeIOS ? 'Apple In-App Pass' : 'Razorpay Verified Pass'}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className={`text-xl font-black ${isSelected ? 'text-[#D8B486]' : 'text-[#560406]'}`}>{plan.price}</span>
                            <span className={`text-[10px] block ${isSelected ? 'text-neutral-300' : 'text-[#6E6259]'}`}>
                              {plan.period}
                            </span>
                          </div>
                        </div>

                        <ul className="mt-2.5 space-y-1.5 text-xs">
                          {plan.features.map((feat, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <Check className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#D8B486]' : 'text-[#560406]'}`} />
                              <span className={isSelected ? 'text-neutral-200' : 'text-[#6E6259]'}>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>

                {/* Subscription Terms & Legal Links */}
                <div className="pt-2 pb-1 text-center space-y-2 border-t border-[#E8DDD0]">
                  <div className="flex items-center justify-center gap-3 text-[11px] font-bold text-[#6E6259]">
                    {isNativeIOS && (
                      <>
                        <button
                          type="button"
                          onClick={handleRestorePurchases}
                          disabled={restoring}
                          className="hover:text-[#560406] flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${restoring ? 'animate-spin' : ''}`} />
                          <span>Restore Purchases</span>
                        </button>
                        <span>•</span>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowLegalModal('eula')}
                      className="hover:text-[#560406] flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Terms &amp; Conditions</span>
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setShowLegalModal('privacy')}
                      className="hover:text-[#560406] flex items-center gap-1 cursor-pointer"
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>Privacy Policy</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-[#8C7E74] leading-tight max-w-xs mx-auto">
                    {isNativeIOS
                      ? 'Payment will be charged to your Apple ID Account at confirmation of purchase. Subscription automatically renews unless cancelled at least 24 hours before the end of the current period.'
                      : 'Payments processed securely via Razorpay with 256-bit SSL encryption. All major UPI apps (GPay, PhonePe, Paytm), Cards & NetBanking accepted.'}
                  </p>
                </div>
              </div>

              {/* Sticky Subscribe & Back Button */}
              <div className="p-4 sm:p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-[#E8DDD0] bg-[#F8F6F2] sticky bottom-0 z-20 shadow-lg space-y-2">
                <button
                  type="button"
                  onClick={handleOpenConfirmation}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#D8B486] via-[#C5A880] to-[#A17B5E] text-[#1C0102] font-black text-xs uppercase tracking-wider hover:brightness-105 active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#F5E6D3]/40"
                >
                  {isNativeIOS ? (
                    <Apple className="w-4 h-4 text-[#1C0102] shrink-0" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-[#1C0102] shrink-0" />
                  )}
                  <span className="truncate">
                    {selectedPlan === 'sachet' 
                      ? (isNativeIOS ? `Unlock Profile • ${currentPlanObj.price}` : `Pay with Razorpay • ${currentPlanObj.price}`)
                      : (isNativeIOS ? `Subscribe • ${currentPlanObj.name} (${currentPlanObj.price}${currentPlanObj.period})` : `Upgrade with Razorpay • ${currentPlanObj.price}${currentPlanObj.period}`)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 px-4 rounded-xl bg-transparent hover:bg-white text-[#6E6259] hover:text-[#560406] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Go Back / Maybe Later</span>
                </button>
              </div>
            </>
          )}

          {/* Payment Confirmation Modal Sheet */}
          {showConfirmModal && (
            <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                className="w-full max-w-sm bg-white rounded-t-[32px] sm:rounded-[32px] p-6 border border-[#E8DDD0] shadow-2xl space-y-5 text-left"
              >
                <div className="flex items-center justify-between border-b border-[#E8DDD0] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#560406] text-[#D8B486] flex items-center justify-center shadow-xs">
                      {isNativeIOS ? <Apple className="w-4 h-4" /> : <ShieldCheck className="w-5 h-5 text-[#DFBE7E]" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#161412]">
                        {isNativeIOS ? 'Apple In-App Purchase' : 'Razorpay Secure Checkout'}
                      </h4>
                      <p className="text-[10px] text-[#6E6259]">
                        {isNativeIOS ? 'StoreKit 256-bit Encrypted' : 'UPI • Cards • NetBanking • Wallets'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(false)}
                    className="p-1 rounded-full text-gray-400 hover:text-[#161412]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-[#F8F6F2] rounded-2xl p-4 border border-[#E8DDD0] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#6E6259] font-medium">Selected Tier:</span>
                    <span className="font-extrabold text-[#560406]">{currentPlanObj.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#6E6259] font-medium">Price:</span>
                    <span className="text-base font-black text-[#560406]">{currentPlanObj.price} <span className="text-[10px] font-normal text-[#6E6259]">{currentPlanObj.period}</span></span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] pt-1 border-t border-[#E8DDD0]">
                    <span className="text-[#6E6259] font-medium">Gateway:</span>
                    <span className="font-bold text-[#161412]">
                      {isNativeIOS ? 'Billed to Apple ID' : 'Direct via Razorpay (India)'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[#6E6259] leading-relaxed">
                  {selectedPlan === 'sachet'
                    ? `You will be charged ${currentPlanObj.price} for a one-time profile unlock.`
                    : `You will be charged ${currentPlanObj.price} for membership access with instant activation.`}
                </p>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    disabled={upgrading}
                    onClick={handleConfirmPurchase}
                    className="w-full py-3.5 rounded-xl bg-[#560406] hover:bg-[#730C0F] text-[#F5E6D3] font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {upgrading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{isNativeIOS ? 'Contacting Apple StoreKit...' : 'Opening Razorpay Gateway...'}</span>
                      </div>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-[#D8B486]" />
                        <span>{isNativeIOS ? 'Confirm & Pay' : 'Proceed to Razorpay'} {currentPlanObj.price}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={upgrading}
                    onClick={() => setShowConfirmModal(false)}
                    className="w-full py-2 text-center text-xs font-bold text-[#6E6259] hover:text-[#161412] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}

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
                  className="w-full py-2.5 rounded-xl bg-[#2D2824] text-white text-xs font-bold cursor-pointer"
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

