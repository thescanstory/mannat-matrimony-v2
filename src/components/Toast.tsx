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
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="fixed top-[max(1rem,env(safe-area-inset-top))] left-1/2 -translate-x-1/2 z-[100] max-w-[90vw] bg-[#2D2824]/95 text-white px-4 py-2 rounded-full shadow-2xl border border-[#B89552]/40 inline-flex items-center gap-2 backdrop-blur-xl pointer-events-auto"
        >
          {type === 'heart' && <Heart className="w-4 h-4 fill-[#B89552] text-[#B89552] shrink-0" />}
          {type === 'sparkle' && <Sparkles className="w-4 h-4 text-[#B89552] shrink-0" />}
          {type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}

          <span className="text-xs font-bold whitespace-nowrap truncate max-w-[65vw]">{message}</span>

          <button
            type="button"
            onClick={onClose}
            className="p-0.5 rounded-full hover:bg-white/20 text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0 ml-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
