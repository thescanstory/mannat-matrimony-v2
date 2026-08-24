import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Heart, Sparkles, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'heart' | 'sparkle';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-[90%] w-auto bg-[#2D2824] text-white px-5 py-3 rounded-full shadow-2xl border border-[#B89552]/40 flex items-center gap-3 backdrop-blur-xl"
        >
          {type === 'heart' && <Heart className="w-5 h-5 fill-[#B89552] text-[#B89552] animate-bounce" />}
          {type === 'sparkle' && <Sparkles className="w-5 h-5 text-[#B89552] animate-spin" />}
          {type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}

          <span className="text-xs font-extrabold tracking-wide">{message}</span>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-gray-400 hover:text-white transition-colors cursor-pointer ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
