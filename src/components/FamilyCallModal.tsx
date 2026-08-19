import React, { useState } from 'react';
import { X, Calendar, Clock, Video, CheckCircle2, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Profile } from '../types';

interface FamilyCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProfile: Profile;
  onScheduleSuccess: (scheduledAt: string) => void;
}

export const FamilyCallModal: React.FC<FamilyCallModalProps> = ({
  isOpen,
  onClose,
  targetProfile,
  onScheduleSuccess
}) => {
  const [selectedDate, setSelectedDate] = useState('2026-08-22');
  const [selectedTime, setSelectedTime] = useState('06:00 PM');
  const [isScheduled, setIsScheduled] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsScheduled(true);
    setTimeout(() => {
      onScheduleSuccess(`${selectedDate} ${selectedTime}`);
      setIsScheduled(false);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          className="w-full max-w-md bg-[#FBF9F4] text-[#111111] rounded-t-[36px] sm:rounded-[36px] overflow-hidden flex flex-col justify-between select-none font-sans border border-[#E8E1D5] shadow-2xl relative"
        >
          {/* Header */}
          <div className="px-6 pt-5 pb-4 bg-[#FBF9F4] border-b border-[#E8E1D5] flex items-center justify-between shadow-sm sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <span className="font-instrument text-3xl lowercase text-[#B89552]">mannat</span>
              <div className="h-4 w-px bg-[#E8E1D5]" />
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#111111]">
                <Users className="w-4 h-4 text-[#B89552]" />
                <span>Family Conference Call</span>
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

          {/* Modal Content */}
          <div className="p-6 space-y-6 flex-1 bg-[#FBF9F4]">
            {isScheduled ? (
              <div className="py-12 text-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-700 flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif-editorial font-bold text-[#111111]">
                  Family Call Scheduled!
                </h3>
                <p className="text-xs text-[#777777] font-medium max-w-xs mx-auto">
                  Google Meet link generated for {targetProfile.display_name}'s family on {selectedDate} at {selectedTime}.
                </p>
                <div className="p-3 bg-[#F4EFE6] rounded-xl border border-[#E8E1D5] font-mono text-xs text-[#B89552]">
                  https://meet.google.com/mannat-fam-call
                </div>
              </div>
            ) : (
              <>
                {/* Both Families Avatars */}
                <div className="bg-[#F4EFE6] p-5 rounded-3xl border border-[#E8E1D5] space-y-3 text-center shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#B89552]">
                    SECURE FAMILY INTRO CALL
                  </span>

                  <div className="flex items-center justify-center gap-4 py-2">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full border-2 border-[#B89552] overflow-hidden mx-auto shadow-md">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                          alt="Your Family"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-[#111111] block mt-1">Your Family</span>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-black">
                      VS
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full border-2 border-[#B89552] overflow-hidden mx-auto shadow-md">
                        <img
                          src={targetProfile.photos?.[0] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                          alt={targetProfile.display_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-[#111111] block mt-1">{targetProfile.display_name}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#666666] font-medium leading-relaxed">
                    Schedule a private 15-minute video conference between both parents & matchmakers.
                  </p>
                </div>

                {/* Date & Time Pickers */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-[#B89552] mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Select Preferred Date</span>
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-3.5 rounded-2xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none focus:border-[#B89552]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-[#B89552] mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Select Time Slot</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['05:00 PM', '06:00 PM', '07:30 PM'].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-3 px-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                            selectedTime === slot
                              ? 'bg-[#111111] text-white shadow-sm'
                              : 'bg-[#F4EFE6] text-[#555555] border border-[#E8E1D5] hover:bg-[#E8E1D5]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Confirm Button */}
          {!isScheduled && (
            <div className="p-5 border-t border-[#E8E1D5] bg-[#FBF9F4] sticky bottom-0 z-20 shadow-lg">
              <button
                type="button"
                onClick={handleConfirm}
                className="w-full py-4 px-6 rounded-full bg-[#111111] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#B89552] active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Video className="w-4 h-4 text-[#B89552]" />
                <span>Confirm & Generate Google Meet Link</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
