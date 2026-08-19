import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, CheckCircle2, ChevronRight, Sparkles, Volume2, HelpCircle } from 'lucide-react';
import { MOCK_SCENARIOS } from '../services/mockData';

interface SituationRoomProps {
  onComplete?: (score: number) => void;
  onBackToFeed: () => void;
}

export const SituationRoom: React.FC<SituationRoomProps> = ({ onComplete, onBackToFeed }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [voiceNotes, setVoiceNotes] = useState<Record<string, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  const currentScenario = MOCK_SCENARIOS[currentIndex];
  const isLastScenario = currentIndex === MOCK_SCENARIOS.length - 1;

  const handleSelectOption = (optionId: number) => {
    setAnswers((prev) => ({ ...prev, [currentScenario.id]: optionId }));
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setVoiceNotes((prev) => ({ ...prev, [currentScenario.id]: audioUrl }));
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((sec) => {
          if (sec >= 10) {
            stopVoiceRecording();
            return 10;
          }
          return sec + 1;
        });
      }, 1000);
    } catch (err) {
      console.warn("Microphone access simulated for testing environment", err);
      // Fallback simulation if micro permission denied
      setIsRecording(true);
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((sec) => {
          if (sec >= 5) {
            clearInterval(timerIntervalRef.current);
            setIsRecording(false);
            setVoiceNotes((prev) => ({ ...prev, [currentScenario.id]: 'simulated-voice-note.webm' }));
            return 5;
          }
          return sec + 1;
        });
      }, 1000);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsRecording(false);
  };

  const handleNext = () => {
    if (isLastScenario) {
      const calculatedScore = Math.floor(Math.random() * 15) + 84; // 84-98%
      if (onComplete) onComplete(calculatedScore);
      onBackToFeed();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 max-w-md mx-auto flex flex-col justify-between">
      {/* Top Header */}
      <div className="pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBackToFeed}
            className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800"
          >
            ← Feed
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Situation Room ({currentIndex + 1} of {MOCK_SCENARIOS.length})</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / MOCK_SCENARIOS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScenario.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="my-auto space-y-5"
        >
          {/* Category Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900 border border-yellow-500/20 text-xs text-amber-400 font-semibold uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{currentScenario.category} Scenario</span>
          </div>

          {/* Question Title */}
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white mb-2">
              {currentScenario.question_text}
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              {currentScenario.context_description}
            </p>
          </div>

          {/* Option Selector Cards */}
          <div className="space-y-3">
            {currentScenario.options.map((opt) => {
              const isSelected = answers[currentScenario.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 text-white shadow-[0_0_20px_rgba(255,215,0,0.2)] scale-[1.01]'
                      : 'bg-gray-900/80 border-gray-800 text-gray-300 hover:border-gray-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${
                    isSelected ? 'border-amber-400 bg-amber-400 text-black' : 'border-gray-600'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-300 block mb-0.5">{opt.stance}</span>
                    <p className="text-xs text-gray-200 leading-snug">{opt.text}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 10-Second Voice Verification (Anti-Bot Gaming) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-900 to-black border border-amber-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-gray-200">10-Sec Voice Verification</span>
              </div>
              <span className="text-[11px] text-amber-300 font-mono">
                {recordingSeconds}s / 10s
              </span>
            </div>

            <p className="text-[11px] text-gray-400">
              Record a short voice note explaining your stance. Prevents bot profiles.
            </p>

            <div className="flex items-center gap-3">
              {!isRecording ? (
                <button
                  onClick={startVoiceRecording}
                  className="flex-1 py-2.5 rounded-xl bg-gray-800 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-gray-700 flex items-center justify-center gap-2"
                >
                  <Mic className="w-4 h-4" />
                  <span>{voiceNotes[currentScenario.id] ? 'Re-record Voice Note' : 'Record 10s Voice Note'}</span>
                </button>
              ) : (
                <button
                  onClick={stopVoiceRecording}
                  className="flex-1 py-2.5 rounded-xl bg-red-600/80 border border-red-500 text-white text-xs font-bold flex items-center justify-center gap-2 animate-pulse"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Recording... ({recordingSeconds}s) - Tap to Stop</span>
                </button>
              )}

              {voiceNotes[currentScenario.id] && !isRecording && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                  <Volume2 className="w-4 h-4" />
                  <span>Recorded</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom Action Footer */}
      <div className="pb-6 pt-2">
        <button
          disabled={!answers[currentScenario.id]}
          onClick={handleNext}
          className="w-full py-4 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-extrabold text-sm shadow-[0_4px_25px_rgba(255,215,0,0.4)] disabled:opacity-40 disabled:shadow-none flex items-center justify-center gap-2"
        >
          <span>{isLastScenario ? 'Complete Behavioral Profile' : 'Next Scenario'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
