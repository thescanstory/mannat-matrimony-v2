import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Clock, Video, CheckCircle2, Users, Mic, MicOff, VideoOff, PhoneOff, Sparkles } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'instant' | 'schedule'>('instant');
  const [selectedDate, setSelectedDate] = useState('2026-08-22');
  const [selectedTime, setSelectedTime] = useState('06:00 PM');
  const [isScheduled, setIsScheduled] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera stream on unmount or call end
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  if (!isOpen) return null;

  const startLiveWebRTCCall = async () => {
    setIsCallActive(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    } catch {
      console.warn('Camera/mic access fallback: preview avatar stream active');
    }
  };

  const endLiveWebRTCCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCallActive(false);
    onClose();
  };

  const handleConfirmSchedule = () => {
    setIsScheduled(true);
    setTimeout(() => {
      onScheduleSuccess(`${selectedDate} ${selectedTime}`);
      setIsScheduled(false);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#2D2824]/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
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
              onClick={isCallActive ? endLiveWebRTCCall : onClose}
              className="p-2 rounded-full hover:bg-[#F4EFE6] text-[#7E776F] hover:text-[#111111] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher */}
          {!isCallActive && !isScheduled && (
            <div className="px-6 pt-3 bg-[#FBF9F4] flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('instant')}
                className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'instant'
                    ? 'bg-[#2D2824] text-white shadow-xs'
                    : 'bg-[#F4EFE6] text-[#777777] hover:text-[#111111]'
                }`}
              >
                Instant Video Call
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('schedule')}
                className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'schedule'
                    ? 'bg-[#2D2824] text-white shadow-xs'
                    : 'bg-[#F4EFE6] text-[#777777] hover:text-[#111111]'
                }`}
              >
                Schedule Calendar
              </button>
            </div>
          )}

          {/* Modal Content */}
          <div className="p-6 space-y-5 flex-1 bg-[#FBF9F4]">
            {isCallActive ? (
              /* Live WebRTC Call Screen */
              <div className="space-y-4">
                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#2D2824] shadow-lg border border-[#2D2824]">
                  {/* Remote Candidate Stream */}
                  <img
                    src={targetProfile.photos?.[0] || ''}
                    alt={targetProfile.display_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#2D2824]/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{targetProfile.display_name} • Connected</span>
                  </div>

                  {/* Local WebRTC Camera Inset */}
                  <div className="absolute bottom-3 right-3 w-24 h-32 rounded-2xl overflow-hidden border-2 border-white shadow-xl bg-[#2D2824]">
                    {!isVideoOff ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover mirror"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#2D2824] text-[#7E776F] text-xs font-bold">
                        Cam Off
                      </div>
                    )}
                  </div>
                </div>

                {/* Call Control Strip */}
                <div className="flex items-center justify-center gap-4 py-2">
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-3.5 rounded-full shadow-md transition-all cursor-pointer ${
                      isMuted ? 'bg-rose-500 text-white' : 'bg-[#F4EFE6] text-[#111111] hover:bg-[#E8E1D5]'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`p-3.5 rounded-full shadow-md transition-all cursor-pointer ${
                      isVideoOff ? 'bg-rose-500 text-white' : 'bg-[#F4EFE6] text-[#111111] hover:bg-[#E8E1D5]'
                    }`}
                  >
                    {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </button>

                  <button
                    type="button"
                    onClick={endLiveWebRTCCall}
                    className="p-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg transition-all cursor-pointer"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : isScheduled ? (
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
            ) : activeTab === 'instant' ? (
              /* Instant WebRTC Call Starter */
              <div className="space-y-4">
                <div className="bg-[#F4EFE6] p-5 rounded-3xl border border-[#E8E1D5] space-y-3 text-center shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#B89552]">
                    DIRECT 1-ON-1 INTRO CALL
                  </span>

                  <div className="flex items-center justify-center gap-4 py-2">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full border-2 border-[#B89552] overflow-hidden mx-auto shadow-md">
                        <img
                          src=""
                          alt="Your Family"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-[#111111] block mt-1">You</span>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-[#2D2824] text-white flex items-center justify-center text-xs font-black">
                      +
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full border-2 border-[#B89552] overflow-hidden mx-auto shadow-md">
                        <img
                          src={targetProfile.photos?.[0] || ''}
                          alt={targetProfile.display_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-[#111111] block mt-1">{targetProfile.display_name}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#666666] font-medium leading-relaxed">
                    Start a secure, in-app video introduction directly with {targetProfile.display_name} without exchanging phone numbers.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={startLiveWebRTCCall}
                  className="w-full py-4 px-6 rounded-full bg-[#2D2824] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#B89552] active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#B89552]" />
                  <span>Start Instant In-App Video Call</span>
                </button>
              </div>
            ) : (
              /* Schedule Calendar */
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
                            ? 'bg-[#2D2824] text-white shadow-sm'
                            : 'bg-[#F4EFE6] text-[#555555] border border-[#E8E1D5] hover:bg-[#E8E1D5]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleConfirmSchedule}
                    className="w-full py-4 px-6 rounded-full bg-[#2D2824] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#B89552] active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Video className="w-4 h-4 text-[#B89552]" />
                    <span>Confirm & Generate Google Meet Link</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
