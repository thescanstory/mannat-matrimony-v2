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
            className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#1C0102]/80 via-[#260102]/92 to-[#1C0102]/98 backdrop-blur-xl border border-[#A17B5E]/30 rounded-2xl text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#560406] to-[#260102] border border-[#A17B5E]/50 flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(86,4,6,0.5)]">
              <Lock className="w-5 h-5 text-[#D8B486]" />
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#560406]/60 border border-[#A17B5E]/40 text-[#D8B486] text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D8B486]" />
              <span>BlurShield™ Privacy Protected</span>
            </div>

            <h4 className="text-white font-bold text-base tracking-tight mb-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Unlock Full Profile & Expectations
            </h4>
            <p className="text-neutral-300 text-xs max-w-xs mb-4">
              {lockedLabel}
            </p>

            <button
              onClick={onUnlockClick}
              className="group relative px-6 py-3 rounded-xl bg-gradient-to-r from-[#D8B486] via-[#C5A880] to-[#A17B5E] text-[#1C0102] font-black text-xs shadow-[0_4px_25px_rgba(161,123,94,0.35)] hover:brightness-105 active:scale-95 transition-all duration-200 flex items-center gap-2 border border-[#F5E6D3]/40 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#1C0102] group-hover:rotate-12 transition-transform" />
              <span>Unlock for ₹49 (Instant)</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
