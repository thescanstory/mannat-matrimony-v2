import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex flex-col items-center justify-center p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center justify-center gap-6 text-center"
      >
        {/* Royal Brand Logo */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-3xl overflow-hidden shadow-2xl border border-[#A17B5E]/50 flex items-center justify-center bg-[#560406]"
        >
          <img
            src="/images/mannat-logo-square.png"
            alt="Mannat"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Brand Typographic Lockup */}
        <div className="flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-2xl sm:text-3xl italic font-normal text-[#560406] -mb-1 leading-none"
            style={{ fontFamily: "'Pinyon Script', cursive" }}
          >
            At
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl sm:text-5xl font-normal tracking-[0.24em] uppercase text-[#560406] leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
          >
            MANNAT
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-[9px] sm:text-[10px] uppercase tracking-[0.34em] font-bold text-[#A17B5E] mt-1"
          >
            Bespoke Matchmaking
          </motion.p>
        </div>

        {/* Loading Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-4 flex gap-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-[#A17B5E]"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ delay: i * 0.2, duration: 1.5, repeat: Infinity }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};
