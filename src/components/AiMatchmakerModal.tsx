import React, { useState } from 'react';
import { X, Sparkles, Bot, Compass, Award, Star, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Profile } from '../types';

interface AiMatchmakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: Profile[];
  onSelectCandidate: (profile: Profile) => void;
}

export const AiMatchmakerModal: React.FC<AiMatchmakerModalProps> = ({
  isOpen,
  onClose,
  profiles,
  onSelectCandidate
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Profile>(profiles[0]);
  const [aiReport, setAiReport] = useState<{
    synergyScore: number;
    valuesFit: string;
    lifestyleHarmony: string;
    conversationStarters: string[];
  } | null>(null);

  if (!isOpen) return null;

  const runAiAnalysis = (candidate: Profile) => {
    setSelectedCandidate(candidate);
    setAnalyzing(true);
    setAiReport(null);

    setTimeout(() => {
      setAnalyzing(false);
      setAiReport({
        synergyScore: candidate.compatibility_score || 96,
        valuesFit: `Both individuals demonstrate a high alignment on family governance (${candidate.managed_by === 'parent' ? 'Family-Collaborative' : 'Self-Driven'}) and financial transparency.`,
        lifestyleHarmony: `Shared interest in modern urban lifestyle with traditional grounding. ${candidate.lifestyle_details?.second_home ? 'Enjoys weekend retreat getaways.' : 'Focused on career progression and travel.'}`,
        conversationStarters: [
          `Ask about their perspective on balancing high-paced work (${candidate.occupation}) with family time.`,
          `Discuss their favourite spots in ${candidate.city} and relocation flexibility.`,
          `Inquire about the creator vouch commentary and joint interests.`
        ]
      });
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="w-full max-w-md h-[92vh] sm:h-[820px] bg-[#FBF9F4] text-[#111111] rounded-t-[36px] sm:rounded-[36px] overflow-hidden flex flex-col justify-between select-none font-sans border border-[#E8E1D5] shadow-2xl relative"
        >
          {/* Header */}
          <div className="px-5 pt-4 pb-3.5 bg-[#FBF9F4] border-b border-[#E8E1D5] flex items-center justify-between shadow-xs sticky top-0 z-20">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1 text-xs font-black text-[#111111] hover:text-[#B89552] transition-all p-1.5 -ml-1 rounded-full hover:bg-[#E8E1D5]/40 active:scale-95 cursor-pointer"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4 text-[#B89552]" />
                <span>Back</span>
              </button>
              <div className="h-4 w-px bg-[#E8E1D5]" />
              <div>
                <h3 className="font-serif-editorial text-base font-bold text-[#111111] leading-tight">
                  AI Matchmaker
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#E8E1D5]/50 text-gray-400 hover:text-[#111111] transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1 bg-[#FBF9F4]">
            {/* Candidate Selector Reel */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#B89552] mb-2.5">
                Select Candidate to Analyze Synergy
              </label>
              <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none pb-1">
                {profiles.slice(0, 5).map((p) => {
                  const isSelected = selectedCandidate?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => runAiAnalysis(p)}
                      className={`p-2 rounded-2xl border transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-[#111111] text-white border-[#111111] shadow-md'
                          : 'bg-[#F4EFE6] text-[#111111] border-[#E8E1D5] hover:bg-[#E8E1D5]'
                      }`}
                    >
                      <img
                        src={p.photos?.[0] || p.creator_vouch?.creator_avatar_url}
                        alt={p.display_name}
                        className="w-8 h-8 rounded-full object-cover border border-[#B89552]"
                      />
                      <div className="text-left pr-1">
                        <span className="text-xs font-bold block leading-tight">{p.display_name}</span>
                        <span className={`text-[10px] block ${isSelected ? 'text-[#B89552]' : 'text-gray-500'}`}>
                          {p.age}y • {p.city}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Analysis State */}
            {analyzing ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#111111] text-[#B89552] flex items-center justify-center mx-auto animate-spin">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-[#111111]">Synthesizing Compatibility Matrix...</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Cross-referencing behavioral scenarios, astrological gunas, and verified creator commentary.
                </p>
              </div>
            ) : aiReport ? (
              <div className="space-y-4 animate-fadeIn">
                {/* Score Banner */}
                <div className="p-4 rounded-3xl bg-gradient-to-r from-[#111111] to-[#242220] text-white border border-[#B89552]/40 shadow-lg flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#B89552]">
                      AI Synergy Index
                    </span>
                    <h4 className="text-xl font-serif-editorial font-bold">
                      {aiReport.synergyScore}% Alignment
                    </h4>
                    <span className="text-[11px] text-gray-300">High Long-term Matrimonial Potential</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#B89552]/20 border border-[#B89552] flex items-center justify-center text-[#B89552]">
                    <Award className="w-6 h-6" />
                  </div>
                </div>

                {/* Values & Lifestyle Insights */}
                <div className="space-y-2.5">
                  <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E1D5] space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#B89552] flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#B89552]" />
                      <span>Values & Expectations</span>
                    </span>
                    <p className="text-xs text-[#333333] leading-relaxed">
                      {aiReport.valuesFit}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E1D5] space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#B89552] flex items-center gap-1">
                      <Compass className="w-3 h-3 text-[#B89552]" />
                      <span>Lifestyle & Wealth Synergy</span>
                    </span>
                    <p className="text-xs text-[#333333] leading-relaxed">
                      {aiReport.lifestyleHarmony}
                    </p>
                  </div>
                </div>

                {/* Suggested Icebreakers */}
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-[#B89552]">
                    Suggested Conversation Starters
                  </label>
                  <div className="space-y-1.5">
                    {aiReport.conversationStarters.map((starter, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white border border-[#E8E1D5] text-xs text-[#111111] flex items-start gap-2 shadow-xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-[#B89552] shrink-0 mt-0.5" />
                        <span>{starter}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center space-y-3 bg-[#F4EFE6] rounded-3xl border border-[#E8E1D5]">
                <Bot className="w-10 h-10 text-[#B89552] mx-auto" />
                <h4 className="text-base font-bold text-[#111111]">
                  Discover Deep Alignment
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                  Select any candidate above to generate personalized AI compatibility insights before reaching out.
                </p>
                <button
                  type="button"
                  onClick={() => runAiAnalysis(selectedCandidate)}
                  className="px-5 py-2.5 rounded-full bg-[#111111] text-white text-xs font-extrabold hover:bg-[#B89552] transition-colors cursor-pointer"
                >
                  Analyze {selectedCandidate.display_name}
                </button>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-5 border-t border-[#E8E1D5] bg-[#FBF9F4] sticky bottom-0 z-20 shadow-lg">
            <button
              type="button"
              onClick={() => {
                onSelectCandidate(selectedCandidate);
                onClose();
              }}
              className="w-full py-4 px-6 rounded-full bg-[#111111] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#B89552] active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View {selectedCandidate.display_name}'s Family Portal</span>
              <ArrowRight className="w-4 h-4 text-[#B89552]" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
