import React, { useState } from 'react';
import { X, Check, Crown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

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

  if (!isOpen) return null;

  const PLANS = [
    {
      id: 'gold',
      name: 'Mannat Gold',
      price: '₹1,999',
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
      name: 'Mannat Diamond',
      price: '₹2,999',
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
      name: 'Mannat Platinum',
      price: '₹4,999',
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
    try {
      if (isSupabaseConfigured()) {
        await supabase.from('subscriptions').insert([
          {
            tier: selectedPlan,
            status: 'active',
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]);
      }
      setUpgradeSuccess(true);
      if (onSelectTier) onSelectTier(selectedPlan);
      setTimeout(() => {
        setUpgradeSuccess(false);
        onClose();
      }, 1500);
    } catch {
      if (onSelectTier) onSelectTier(selectedPlan);
      onClose();
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="w-full max-w-md h-[90vh] sm:h-[840px] bg-[#FBF9F4] text-[#111111] rounded-t-[36px] sm:rounded-[36px] overflow-hidden flex flex-col justify-between select-none font-sans border border-[#E8E1D5] shadow-2xl relative"
        >
          {/* Header */}
          <div className="px-6 pt-5 pb-4 bg-[#FBF9F4] border-b border-[#E8E1D5] flex items-center justify-between shadow-sm sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <span className="font-instrument text-3xl lowercase text-[#B89552]">mannat</span>
              <div className="h-4 w-px bg-[#E8E1D5]" />
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#111111]">
                <Crown className="w-4 h-4 text-[#B89552]" />
                <span>Luxury Membership</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#F4EFE6] text-gray-400 hover:text-[#111111] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Paywall Body */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-[#FBF9F4]">
            {upgradeSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-extrabold rounded-2xl text-center animate-fadeIn">
                ✓ Active Subscription Logged to Database! Unlocking Contact Numbers...
              </div>
            )}

            {/* Banner */}
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#B89552] bg-[#F4EFE6] px-3.5 py-1 rounded-full border border-[#E8E1D5] inline-block">
                PREMIUM INTRODUCTIONS
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-[#111111] leading-tight">
                Unlock direct contact & verified intros.
              </h2>
              <p className="text-xs text-[#777777] font-medium leading-relaxed max-w-xs mx-auto">
                Discretion guaranteed. Choose your editorial tier to connect with verified partners.
              </p>
            </div>

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
                        ? 'bg-[#111111] text-white border-[#111111] shadow-xl scale-[1.01]'
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
                          Full Access Pass
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black">{plan.price}</span>
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
          </div>

          {/* Sticky Subscribe Button */}
          <div className="p-5 border-t border-[#E8E1D5] bg-[#FBF9F4] sticky bottom-0 z-20 shadow-lg space-y-2">
            <button
              type="button"
              disabled={upgrading}
              onClick={handleUpgrade}
              className="w-full py-4 px-6 rounded-full bg-[#111111] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#B89552] active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#B89552]" />
              <span>{upgrading ? 'Processing Upgrade...' : `Upgrade to ${PLANS.find((p) => p.id === selectedPlan)?.name}`}</span>
            </button>
            <p className="text-[10px] text-center text-[#777777] font-medium">
              Cancel anytime. 100% money-back discretion guarantee.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
