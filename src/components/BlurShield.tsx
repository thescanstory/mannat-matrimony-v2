import React from 'react';
import { Lock, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlurShieldProps {
  isUnlocked: boolean;
  onUnlockClick: () => void;
  children: React.ReactNode;
  lockedLabel?: string;
}

export const BlurShield: React.FC<BlurShieldProps> = ({
  isUnlocked,
  onUnlockClick,
  children,
  lockedLabel = "Full Bio-Data & Salary details hidden"
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Content wrapper */}
      <div className={`transition-all duration-700 ${!isUnlocked ? 'filter blur-[10px] select-none pointer-events-none opacity-40 scale-[0.99]' : 'filter blur-0 opacity-100 scale-100'}`}>
        {children}
      </div>

      {/* Blur Overlay Shield when Locked */}
      <AnimatePresence>
        {!isUnlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-black/40 via-black/75 to-black/90 backdrop-blur-xl border border-yellow-500/20 rounded-2xl text-center"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-600/30 border border-amber-400/50 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(255,215,0,0.3)] animate-pulse-gold">
              <Lock className="w-6 h-6 text-amber-300" />
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Vouch Privacy Protected</span>
            </div>

            <h4 className="text-white font-bold text-base tracking-tight mb-1">
              Unlock Full Profile & Expectations
            </h4>
            <p className="text-gray-300 text-xs max-w-xs mb-4">
              {lockedLabel}
            </p>

            <button
              onClick={onUnlockClick}
              className="group relative px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-extrabold text-sm shadow-[0_4px_25px_rgba(255,215,0,0.4)] hover:shadow-[0_6px_30px_rgba(255,215,0,0.6)] active:scale-95 transition-all duration-200 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
              <span>Unlock for ₹49 (UPI)</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
