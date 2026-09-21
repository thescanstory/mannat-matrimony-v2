import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Check, Sparkles, Globe, Star, ArrowLeft } from 'lucide-react';
import metadataOptions from '../data/metadata_options.json';
import { motion, AnimatePresence } from 'framer-motion';
import type { FilterCriteria } from '../types';
import { DEFAULT_FILTERS } from '../data/filterDefaults';

interface SearchFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterCriteria) => void;
  initialFilters?: FilterCriteria;
  onReset?: () => void;
}

export const SearchFiltersModal: React.FC<SearchFiltersModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialFilters,
  onReset
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'horoscope' | 'lifestyle'>('basic');
  const [ageMin, setAgeMin] = useState(initialFilters?.ageMin ?? DEFAULT_FILTERS.ageMin);
  const [ageMax, setAgeMax] = useState(initialFilters?.ageMax ?? DEFAULT_FILTERS.ageMax);
  const [selectedReligion, setSelectedReligion] = useState<string[]>(
    initialFilters?.selectedReligion ?? DEFAULT_FILTERS.selectedReligion
  );
  const [selectedSubCommunity, setSelectedSubCommunity] = useState<string[]>(
    initialFilters?.selectedSubCommunity ?? DEFAULT_FILTERS.selectedSubCommunity
  );
  const [manglikPref, setManglikPref] = useState<'Yes' | 'No' | "Doesn't Matter">(
    initialFilters?.manglikPref ?? DEFAULT_FILTERS.manglikPref
  );
  const [gunMilanMin, setGunMilanMin] = useState(
    initialFilters?.gunMilanMin ?? DEFAULT_FILTERS.gunMilanMin
  );
  const [locationIntent, setLocationIntent] = useState<string[]>(
    initialFilters?.locationIntent ?? DEFAULT_FILTERS.locationIntent
  );
  const [selectedNetWorth, setSelectedNetWorth] = useState<string[]>(
    initialFilters?.selectedNetWorth ?? DEFAULT_FILTERS.selectedNetWorth
  );
  const [secondHomePref, setSecondHomePref] = useState<boolean>(
    initialFilters?.secondHomePref ?? DEFAULT_FILTERS.secondHomePref
  );

  useEffect(() => {
    if (initialFilters) {
      setAgeMin(initialFilters.ageMin);
      setAgeMax(initialFilters.ageMax);
      setSelectedReligion(initialFilters.selectedReligion);
      setSelectedSubCommunity(initialFilters.selectedSubCommunity);
      setManglikPref(initialFilters.manglikPref);
      setGunMilanMin(initialFilters.gunMilanMin);
      setLocationIntent(initialFilters.locationIntent);
      setSelectedNetWorth(initialFilters.selectedNetWorth);
      setSecondHomePref(initialFilters.secondHomePref);
    }
  }, [initialFilters]);

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
    setAgeMin(DEFAULT_FILTERS.ageMin);
    setAgeMax(DEFAULT_FILTERS.ageMax);
    setSelectedReligion(DEFAULT_FILTERS.selectedReligion);
    setSelectedSubCommunity(DEFAULT_FILTERS.selectedSubCommunity);
    setManglikPref(DEFAULT_FILTERS.manglikPref);
    setGunMilanMin(DEFAULT_FILTERS.gunMilanMin);
    setLocationIntent(DEFAULT_FILTERS.locationIntent);
    setSelectedNetWorth(DEFAULT_FILTERS.selectedNetWorth);
    setSecondHomePref(DEFAULT_FILTERS.secondHomePref);
    if (onReset) onReset();
  };

  const handleApplyClick = () => {
    const filters: FilterCriteria = {
      ageMin,
      ageMax,
      selectedReligion,
      selectedSubCommunity,
      manglikPref,
      gunMilanMin,
      locationIntent,
      selectedNetWorth,
      secondHomePref
    };
    onApply(filters);
    onClose();
  };

  const SUB_COMMUNITIES = ['Brahmin', 'Kanyakubja Brahmin', 'Kayastha', 'Srivastava Kayastha', 'Agarwal', 'Khatri', 'Iyer', 'Menon Nair', 'Maratha'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-md h-[92vh] sm:h-[840px] bg-[#F8F6F2] text-[#161412] rounded-t-[36px] sm:rounded-[36px] overflow-hidden flex flex-col justify-between select-none font-sans border border-[#E8DDD0] shadow-2xl relative"
        >
          {/* Top Header with Back Button & Royal Branding */}
          <div className="px-5 pt-4 pb-3.5 bg-[#F8F6F2] border-b border-[#E8DDD0] sticky top-0 z-20 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1 text-xs font-bold text-[#560406] hover:text-[#730C0F] transition-all p-1.5 -ml-1 rounded-full hover:bg-white active:scale-95 cursor-pointer shadow-xs border border-[#E8DDD0]"
                title="Go Back"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#560406]" />
                <span className="text-[11px] font-extrabold">Back</span>
              </button>
              <div className="h-4 w-px bg-[#E8DDD0]" />
              <div className="flex flex-col text-left">
                <span className="text-xs italic font-normal text-[#560406] -mb-1 leading-none" style={{ fontFamily: "'Pinyon Script', cursive" }}>At</span>
                <span className="text-base font-normal tracking-[0.2em] uppercase text-[#560406] leading-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>MANNAT</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-bold text-[#560406] hover:text-[#161412] bg-white px-3 py-1.5 rounded-full border border-[#E8DDD0] flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <RotateCcw className="w-3 h-3 text-[#A17B5E]" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white text-gray-400 hover:text-[#161412] transition-colors cursor-pointer border border-[#E8DDD0]"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Category Tabs */}
          <div className="bg-white px-4 py-2 border-b border-[#E8DDD0] flex items-center justify-between gap-1.5 text-xs font-bold shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`flex-1 py-2 px-1 rounded-xl transition-all cursor-pointer text-center text-xs ${
                activeTab === 'basic'
                  ? 'bg-[#560406] text-[#A17B5E] font-black shadow-sm'
                  : 'text-[#6E6259] hover:text-[#161412] bg-[#F8F6F2]'
              }`}
            >
              Religion & Age
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('horoscope')}
              className={`flex-1 py-2 px-1 rounded-xl transition-all cursor-pointer text-center text-xs ${
                activeTab === 'horoscope'
                  ? 'bg-[#560406] text-[#A17B5E] font-black shadow-sm'
                  : 'text-[#6E6259] hover:text-[#161412] bg-[#F8F6F2]'
              }`}
            >
              Horoscope & Location
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lifestyle')}
              className={`flex-1 py-2 px-1 rounded-xl transition-all cursor-pointer text-center text-xs ${
                activeTab === 'lifestyle'
                  ? 'bg-[#560406] text-[#A17B5E] font-black shadow-sm'
                  : 'text-[#6E6259] hover:text-[#161412] bg-[#F8F6F2]'
              }`}
            >
              Net Worth & Perks
            </button>
          </div>

          {/* Form Options Content */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto scrollbar-none bg-[#F8F6F2]">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                {/* 1. Religion Selection Chips */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-black uppercase tracking-widest text-[#560406]">
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
                          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                            isSelected
                              ? 'bg-[#560406] text-[#F5E6D3] shadow-md border border-[#560406]'
                              : 'bg-white text-[#6E6259] border border-[#E8DDD0] hover:bg-[#F8F6F2]'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#D8B486]" />}
                          <span>{rel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Sub-Community Multi-Select */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-black uppercase tracking-widest text-[#560406]">
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
                          className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                            isSelected
                              ? 'bg-[#560406] text-[#F5E6D3] shadow-md border border-[#560406]'
                              : 'bg-white text-[#6E6259] border border-[#E8DDD0] hover:bg-[#F8F6F2]'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#D8B486]" />}
                          <span>{sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Age Slider Section */}
                <div className="bg-white p-5 rounded-2xl border border-[#E8DDD0] space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-widest text-[#560406]">
                      Age Preference Range
                    </label>
                    <span className="text-xs font-bold bg-[#F8F6F2] px-3 py-1 rounded-full border border-[#E8DDD0] text-[#560406]">
                      {ageMin} yrs – {ageMax} yrs
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-[#F8F6F2] border border-[#E8DDD0]">
                      <span className="text-[10px] text-[#6E6259] font-bold uppercase block">Minimum Age</span>
                      <span className="text-base font-black text-[#161412]">{ageMin} Years</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8F6F2] border border-[#E8DDD0]">
                      <span className="text-[10px] text-[#6E6259] font-bold uppercase block">Maximum Age</span>
                      <span className="text-base font-black text-[#161412]">{ageMax} Years</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div>
                      <span className="text-[10px] font-bold text-[#6E6259] block mb-1">Min Age ({ageMin})</span>
                      <input
                        type="range"
                        min={18}
                        max={35}
                        value={ageMin}
                        onChange={(e) => setAgeMin(parseInt(e.target.value, 10))}
                        className="w-full accent-[#560406] cursor-pointer"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#6E6259] block mb-1">Max Age ({ageMax})</span>
                      <input
                        type="range"
                        min={25}
                        max={45}
                        value={ageMax}
                        onChange={(e) => setAgeMax(parseInt(e.target.value, 10))}
                        className="w-full accent-[#560406] cursor-pointer"
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
                  <label className="block text-xs font-black uppercase tracking-widest text-[#560406] flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-[#A17B5E]" />
                    <span>Manglik Preference</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Yes', 'No', "Doesn't Matter"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setManglikPref(m)}
                        className={`py-3 px-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                          manglikPref === m
                            ? 'bg-[#560406] text-[#F5E6D3] shadow-md border border-[#560406]'
                            : 'bg-white text-[#6E6259] border border-[#E8DDD0] hover:bg-[#F8F6F2]'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gun Milan Min Score */}
                <div className="bg-white p-5 rounded-2xl border border-[#E8DDD0] space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-widest text-[#560406]">
                      Minimum Gun Milan Score
                    </label>
                    <span className="text-xs font-bold bg-[#F8F6F2] px-3 py-1 rounded-full border border-[#E8DDD0] text-[#560406]">
                      {gunMilanMin} / 36 Gunas
                    </span>
                  </div>
                  <input
                    type="range"
                    min={18}
                    max={36}
                    value={gunMilanMin}
                    onChange={(e) => setGunMilanMin(parseInt(e.target.value, 10))}
                    className="w-full accent-[#560406] cursor-pointer"
                  />
                </div>

                {/* Location Intent */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-black uppercase tracking-widest text-[#560406] flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#A17B5E]" />
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
                          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                            isSelected
                              ? 'bg-[#560406] text-[#F5E6D3] shadow-md border border-[#560406]'
                              : 'bg-white text-[#6E6259] border border-[#E8DDD0] hover:bg-[#F8F6F2]'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#D8B486]" />}
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
                  <label className="block text-xs font-black uppercase tracking-widest text-[#560406]">
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
                          className={`p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between shadow-xs ${
                            isSelected
                              ? 'bg-[#560406] text-[#F5E6D3] border-[#560406] shadow-md'
                              : 'bg-white text-[#6E6259] border-[#E8DDD0] hover:bg-[#F8F6F2]'
                          }`}
                        >
                          <span>{nw}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#D8B486]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Second Home */}
                <div className="p-4 rounded-2xl bg-white border border-[#E8DDD0] flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-xs font-bold text-[#161412] block">Second Home / Vacation Villa</span>
                    <span className="text-[11px] text-[#6E6259] block">Filter profiles owning vacation properties</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSecondHomePref(!secondHomePref)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                      secondHomePref ? 'bg-[#560406] text-[#F5E6D3]' : 'bg-[#F8F6F2] text-[#6E6259] border border-[#E8DDD0]'
                    }`}
                  >
                    {secondHomePref ? 'Required' : 'Optional'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Apply Button */}
          <div className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-[#E8DDD0] bg-[#F8F6F2] sticky bottom-0 z-20 shadow-lg flex items-center gap-3">
            <button
              type="button"
              onClick={handleApplyClick}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#730C0F] to-[#560406] text-[#F5E6D3] font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#A17B5E]/40"
            >
              <Sparkles className="w-4 h-4 text-[#D8B486]" />
              <span>Apply Filters & Discover</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
