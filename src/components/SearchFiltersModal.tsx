import React, { useState } from 'react';
import { X, RotateCcw, Check, Sparkles, Filter, Globe, Star } from 'lucide-react';
import metadataOptions from '../data/metadata_options.json';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export const SearchFiltersModal: React.FC<SearchFiltersModalProps> = ({
  isOpen,
  onClose,
  onApply
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'horoscope' | 'lifestyle'>('basic');
  const [ageMin, setAgeMin] = useState(24);
  const [ageMax, setAgeMax] = useState(30);
  const [selectedReligion, setSelectedReligion] = useState<string[]>(['Hindu']);
  const [selectedSubCommunity, setSelectedSubCommunity] = useState<string[]>(['Brahmin', 'Kayastha']);
  const [manglikPref, setManglikPref] = useState<'Yes' | 'No' | "Doesn't Matter">("Doesn't Matter");
  const [gunMilanMin, setGunMilanMin] = useState(24);
  const [locationIntent, setLocationIntent] = useState<string[]>(['Open to Relocate to US', 'Only Same City']);
  const [selectedNetWorth, setSelectedNetWorth] = useState<string[]>(['₹5Cr - ₹10Cr']);
  const [secondHomePref, setSecondHomePref] = useState<boolean>(true);

  if (!isOpen) return null;

  const toggleSelection = (list: string[], item: string, setList: (val: string[]) => void) => {
    if (list.includes(item)) {
      if (list.length > 1) {
        setList(list.filter((i) => i !== item));
      }
    } else {
      setList([...list, item]);
    }
  };

  const handleReset = () => {
    setAgeMin(22);
    setAgeMax(32);
    setSelectedReligion(['Hindu']);
    setSelectedSubCommunity(['Brahmin']);
    setManglikPref("Doesn't Matter");
    setGunMilanMin(24);
    setLocationIntent(['Open to Relocate to US']);
    setSelectedNetWorth(['₹5Cr - ₹10Cr']);
  };

  const SUB_COMMUNITIES = ['Brahmin', 'Kanyakubja Brahmin', 'Kayastha', 'Srivastava Kayastha', 'Agarwal', 'Khatri', 'Iyer', 'Menon Nair', 'Maratha'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-md h-[92vh] sm:h-[840px] bg-[#FBF9F4] text-[#111111] rounded-t-[36px] sm:rounded-[36px] overflow-hidden flex flex-col justify-between select-none font-sans border border-[#E8E1D5] shadow-2xl relative"
        >
          {/* Top Header */}
          <div className="px-6 pt-5 pb-4 bg-[#FBF9F4] border-b border-[#E8E1D5] sticky top-0 z-20 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="font-instrument text-3xl lowercase text-[#B89552]">mannat</span>
              <div className="h-4 w-px bg-[#E8E1D5]" />
              <div className="flex items-center gap-1 text-xs font-bold text-[#111111]">
                <Filter className="w-3.5 h-3.5 text-[#B89552]" />
                <span>Refine Search</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-extrabold text-[#B89552] hover:text-[#111111] bg-[#F4EFE6] px-3 py-1.5 rounded-full border border-[#E8E1D5] flex items-center gap-1 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[#F4EFE6] text-gray-400 hover:text-[#111111] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Category Tabs */}
          <div className="bg-[#F4EFE6] px-4 py-2 border-b border-[#E8E1D5] flex items-center justify-between gap-1 text-xs font-extrabold">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'basic'
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'text-[#777777] hover:text-[#111111]'
              }`}
            >
              Religion & Basic
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('horoscope')}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'horoscope'
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'text-[#777777] hover:text-[#111111]'
              }`}
            >
              Horoscope & Location
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lifestyle')}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'lifestyle'
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'text-[#777777] hover:text-[#111111]'
              }`}
            >
              Net Worth & Clubs
            </button>
          </div>

          {/* Form Options Content */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto scrollbar-none bg-[#FBF9F4]">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                {/* 1. Religion Selection Chips (ON TOP) */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-black uppercase tracking-widest text-[#B89552]">
                    Religion & Faith
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {metadataOptions.religions.map((rel) => {
                      const isSelected = selectedReligion.includes(rel);
                      return (
                        <button
                          key={rel}
                          type="button"
                          onClick={() => toggleSelection(selectedReligion, rel, setSelectedReligion)}
                          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#111111] text-white shadow-md border border-[#111111]'
                              : 'bg-[#F4EFE6] text-[#555555] border border-[#E8E1D5] hover:bg-[#E8E1D5]'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#B89552]" />}
                          <span>{rel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Sub-Community Multi-Select (BELOW RELIGION) */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-black uppercase tracking-widest text-[#B89552]">
                    Sub-Community / Caste
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {SUB_COMMUNITIES.map((sub) => {
                      const isSelected = selectedSubCommunity.includes(sub);
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => toggleSelection(selectedSubCommunity, sub, setSelectedSubCommunity)}
                          className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#111111] text-white shadow-md border border-[#111111]'
                              : 'bg-[#F4EFE6] text-[#555555] border border-[#E8E1D5] hover:bg-[#E8E1D5]'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#B89552]" />}
                          <span>{sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Age Slider Section */}
                <div className="bg-[#F4EFE6] p-5 rounded-2xl border border-[#E8E1D5] space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-widest text-[#B89552]">
                      Age Preference Range
                    </label>
                    <span className="text-xs font-extrabold bg-white px-3 py-1 rounded-full border border-[#E8E1D5] text-[#111111]">
                      {ageMin} yrs – {ageMax} yrs
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white border border-[#E8E1D5]">
                      <span className="text-[10px] text-[#777777] font-bold uppercase block">Minimum Age</span>
                      <span className="text-base font-black text-[#111111]">{ageMin} Years</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#E8E1D5]">
                      <span className="text-[10px] text-[#777777] font-bold uppercase block">Maximum Age</span>
                      <span className="text-base font-black text-[#111111]">{ageMax} Years</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div>
                      <span className="text-[10px] font-bold text-[#777777] block mb-1">Adjust Min Age ({ageMin})</span>
                      <input
                        type="range"
                        min={18}
                        max={35}
                        value={ageMin}
                        onChange={(e) => setAgeMin(parseInt(e.target.value, 10))}
                        className="w-full accent-[#B89552] cursor-pointer"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#777777] block mb-1">Adjust Max Age ({ageMax})</span>
                      <input
                        type="range"
                        min={25}
                        max={45}
                        value={ageMax}
                        onChange={(e) => setAgeMax(parseInt(e.target.value, 10))}
                        className="w-full accent-[#B89552] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'horoscope' && (
              <div className="space-y-6">
                {/* Horoscope & Manglik */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-black uppercase tracking-widest text-[#B89552] flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-[#B89552]" />
                    <span>Manglik Preference</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Yes', 'No', "Doesn't Matter"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setManglikPref(m)}
                        className={`py-3 px-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                          manglikPref === m
                            ? 'bg-[#111111] text-white shadow-md'
                            : 'bg-[#F4EFE6] text-[#555555] border border-[#E8E1D5] hover:bg-[#E8E1D5]'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gun Milan Min Score */}
                <div className="bg-[#F4EFE6] p-5 rounded-2xl border border-[#E8E1D5] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-widest text-[#B89552]">
                      Minimum Gun Milan Score
                    </label>
                    <span className="text-xs font-extrabold bg-white px-3 py-1 rounded-full border border-[#E8E1D5]">
                      {gunMilanMin} / 36 Gunas
                    </span>
                  </div>
                  <input
                    type="range"
                    min={18}
                    max={36}
                    value={gunMilanMin}
                    onChange={(e) => setGunMilanMin(parseInt(e.target.value, 10))}
                    className="w-full accent-[#B89552] cursor-pointer"
                  />
                </div>

                {/* Location Intent */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-black uppercase tracking-widest text-[#B89552] flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#B89552]" />
                    <span>Location Intent & Relocation</span>
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {['Open to Relocate to US', 'Open to Long Distance', 'Only Same City'].map((loc) => {
                      const isSelected = locationIntent.includes(loc);
                      return (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => toggleSelection(locationIntent, loc, setLocationIntent)}
                          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#111111] text-white shadow-md border border-[#111111]'
                              : 'bg-[#F4EFE6] text-[#555555] border border-[#E8E1D5] hover:bg-[#E8E1D5]'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#B89552]" />}
                          <span>{loc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'lifestyle' && (
              <div className="space-y-6">
                {/* Net Worth Range */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-black uppercase tracking-widest text-[#B89552]">
                    Family Net Worth Bracket
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {['₹2Cr - ₹5Cr', '₹5Cr - ₹10Cr', '₹15Cr - ₹30Cr', '₹50Cr+ Ultra HNI'].map((nw) => {
                      const isSelected = selectedNetWorth.includes(nw);
                      return (
                        <button
                          key={nw}
                          type="button"
                          onClick={() => toggleSelection(selectedNetWorth, nw, setSelectedNetWorth)}
                          className={`p-3.5 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#111111] text-white border-[#111111] shadow-md'
                              : 'bg-[#F4EFE6] text-[#555555] border-[#E8E1D5] hover:bg-[#E8E1D5]'
                          }`}
                        >
                          <span>{nw}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#B89552]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Second Home */}
                <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E1D5] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-[#111111] block">Second Home / Vacation Villa</span>
                    <span className="text-[11px] text-[#777777] block">Filter profiles owning vacation properties</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSecondHomePref(!secondHomePref)}
                    className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
                      secondHomePref ? 'bg-[#111111] text-white' : 'bg-white text-gray-400 border border-[#E8E1D5]'
                    }`}
                  >
                    {secondHomePref ? 'Yes Required' : 'Doesn\'t Matter'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Apply Button */}
          <div className="p-5 border-t border-[#E8E1D5] bg-[#FBF9F4] sticky bottom-0 z-20 shadow-lg flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onApply();
                onClose();
              }}
              className="w-full py-4 px-6 rounded-full bg-[#111111] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#B89552] active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#B89552]" />
              <span>Show Matched Intros</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
