import React, { useState, useEffect, useMemo } from 'react';
import { X, RotateCcw, Check, Sparkles, Globe, Star, ArrowLeft, Moon, Compass, ShieldCheck } from 'lucide-react';
import metadataOptions from '../data/metadata_options.json';
import { motion, AnimatePresence } from 'framer-motion';
import type { FilterCriteria } from '../types';
import { DEFAULT_FILTERS } from '../data/filterDefaults';

export const RELIGION_COMMUNITIES_MAP: Record<string, string[]> = {
  Hindu: [
    'Brahmin',
    'Kanyakubja Brahmin',
    'Gaur Brahmin',
    'Saraswat Brahmin',
    'Maithil Brahmin',
    'Sanadhya Brahmin',
    'Iyer',
    'Iyengar',
    'Kayastha',
    'Srivastava Kayastha',
    'Mathur Kayastha',
    'Saxena Kayastha',
    'Agarwal',
    'Bania / Vaishya',
    'Gupta',
    'Maheshwari',
    'Khandelwal',
    'Khatri',
    'Arora',
    'Bhatia',
    'Rajput',
    'Chauhan',
    'Rathore',
    'Maratha',
    '96 Kuli Maratha',
    'Kunbi Maratha',
    'Jat',
    'Gujjar / Gurjar',
    'Yadav / Ahir',
    'Nair',
    'Menon Nair',
    'Pillai',
    'Ezhava',
    'Reddy',
    'Kamma',
    'Naidu',
    'Kapu',
    'Lingayat',
    'Vokkaliga',
    'Bunt',
    'Patel / Leva Patel',
    'Kadva Patel',
    'Caste No Bar / Any Hindu'
  ],
  Muslim: [
    'Sunni',
    'Shia',
    'Syed',
    'Sheikh',
    'Pathan',
    'Mughal',
    'Ansari',
    'Qureshi',
    'Siddiqui',
    'Farooqi',
    'Usmani',
    'Memon',
    'Bohra / Dawoodi Bohra',
    'Khoja',
    'Malik',
    'Abbasi',
    'Khan',
    'Hanafi',
    'Sect No Bar / Any Muslim'
  ],
  Sikh: [
    'Jat Sikh',
    'Ramgarhia',
    'Khatri Sikh',
    'Arora Sikh',
    'Ahluwalia',
    'Saini',
    'Kamboj',
    'Bhatra',
    'Lubana',
    'Mazhabi',
    'Gursikh',
    'Amritdhari',
    'Caste No Bar / Any Sikh'
  ],
  Christian: [
    'Roman Catholic',
    'Catholic',
    'Protestant',
    'Syrian Catholic',
    'Mar Thoma',
    'Jacobite',
    'Malankara',
    'CSI / CNI',
    'Pentecostal',
    'Baptist',
    'Methodist',
    'Seventh-day Adventist',
    'Anglo-Indian',
    'Latin Catholic',
    'Denomination No Bar / Any Christian'
  ],
  Jain: [
    'Digambar',
    'Shwetambar',
    'Oswal',
    'Porwal',
    'Khandelwal Jain',
    'Agarwal Jain',
    'Shrimal',
    'Terapanthi',
    'Sthanakvasi',
    'Murtipujak',
    'Caste No Bar / Any Jain'
  ],
  Parsi: [
    'Irani Parsi',
    'Shahenshahi',
    'Kadmi',
    'Fasli',
    'Open to All Parsis'
  ],
  Buddhist: [
    'Mahayana',
    'Theravada',
    'Navayana / Neo-Buddhist',
    'Tibetan Buddhist',
    'Open to All Buddhists'
  ],
  Jewish: [
    'Bene Israel',
    'Baghdadi',
    'Cochin Jewish',
    'Ashkenazi',
    'Sephardic',
    'Open to All'
  ],
  Atheist: ['Open to All', 'Progressive / Secular', 'Caste No Bar'],
  Agnostic: ['Open to All', 'Progressive / Secular', 'Caste No Bar'],
  Spiritual: ['Open to All', 'Interfaith / Universal', 'Caste No Bar']
};

export const RASHI_OPTIONS = [
  { id: 'mesh', name: 'Mesh (Aries)', symbol: '♈' },
  { id: 'vrishabh', name: 'Vrishabh (Taurus)', symbol: '♉' },
  { id: 'mithun', name: 'Mithun (Gemini)', symbol: '♊' },
  { id: 'kark', name: 'Kark (Cancer)', symbol: '♋' },
  { id: 'simha', name: 'Simha (Leo)', symbol: '♌' },
  { id: 'kanya', name: 'Kanya (Virgo)', symbol: '♍' },
  { id: 'tula', name: 'Tula (Libra)', symbol: '♎' },
  { id: 'vrishchik', name: 'Vrishchik (Scorpio)', symbol: '♏' },
  { id: 'dhanu', name: 'Dhanu (Sagittarius)', symbol: '♐' },
  { id: 'makar', name: 'Makar (Capricorn)', symbol: '♑' },
  { id: 'kumbh', name: 'Kumbh (Aquarius)', symbol: '♒' },
  { id: 'meen', name: 'Meen (Pisces)', symbol: '♓' }
];

export const DOSHA_OPTIONS = [
  'No Kaal Sarp Dosha',
  'No Nadi Dosha',
  'No Bhakoot Dosha',
  'No Shani Sade Sati'
];

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
  const [manglikPref, setManglikPref] = useState<'Yes' | 'No' | "Doesn't Matter" | 'Anshik / Mild'>(
    initialFilters?.manglikPref ?? DEFAULT_FILTERS.manglikPref
  );
  const [gunMilanMin, setGunMilanMin] = useState(
    initialFilters?.gunMilanMin ?? DEFAULT_FILTERS.gunMilanMin
  );
  const [selectedRashi, setSelectedRashi] = useState<string[]>(
    initialFilters?.selectedRashi ?? []
  );
  const [kundliRequirement, setKundliRequirement] = useState<'Mandatory' | 'Preferred' | 'Flexible' | "Doesn't Matter">(
    initialFilters?.kundliRequirement ?? "Doesn't Matter"
  );
  const [doshaFilters, setDoshaFilters] = useState<string[]>(
    initialFilters?.doshaFilters ?? []
  );
  const [locationIntent, setLocationIntent] = useState<string[]>(
    initialFilters?.locationIntent ?? DEFAULT_FILTERS.locationIntent
  );
  const [selectedNetWorth, setSelectedNetWorth] = useState<string[]>(
    initialFilters?.selectedNetWorth ?? DEFAULT_FILTERS.selectedNetWorth
  );

  useEffect(() => {
    if (initialFilters) {
      setAgeMin(initialFilters.ageMin);
      setAgeMax(initialFilters.ageMax);
      setSelectedReligion(initialFilters.selectedReligion);
      setSelectedSubCommunity(initialFilters.selectedSubCommunity);
      setManglikPref(initialFilters.manglikPref);
      setGunMilanMin(initialFilters.gunMilanMin);
      setSelectedRashi(initialFilters.selectedRashi ?? []);
      setKundliRequirement(initialFilters.kundliRequirement ?? "Doesn't Matter");
      setDoshaFilters(initialFilters.doshaFilters ?? []);
      setLocationIntent(initialFilters.locationIntent);
      setSelectedNetWorth(initialFilters.selectedNetWorth);
    }
  }, [initialFilters]);

  // Compute dynamic caste/sub-community list based on selected religion(s)
  const dynamicSubCommunities = useMemo(() => {
    if (!selectedReligion || selectedReligion.length === 0) {
      return RELIGION_COMMUNITIES_MAP['Hindu'] || [];
    }
    const combined: string[] = [];
    selectedReligion.forEach((rel) => {
      const list = RELIGION_COMMUNITIES_MAP[rel] || [];
      list.forEach((item) => {
        if (!combined.includes(item)) {
          combined.push(item);
        }
      });
    });
    return combined.length > 0 ? combined : RELIGION_COMMUNITIES_MAP['Hindu'];
  }, [selectedReligion]);

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

  const handleReligionChange = (rel: string) => {
    let nextReligions: string[];
    if (selectedReligion.includes(rel)) {
      if (selectedReligion.length > 1) {
        nextReligions = selectedReligion.filter((r) => r !== rel);
      } else {
        nextReligions = [rel];
      }
    } else {
      nextReligions = [...selectedReligion, rel];
    }
    setSelectedReligion(nextReligions);

    // Reset sub-community selections to first valid option of newly selected religion
    const newAvailable = nextReligions.flatMap((r) => RELIGION_COMMUNITIES_MAP[r] || []);
    const validSelected = selectedSubCommunity.filter((s) => newAvailable.includes(s));
    if (validSelected.length > 0) {
      setSelectedSubCommunity(validSelected);
    } else if (newAvailable.length > 0) {
      setSelectedSubCommunity([newAvailable[0]]);
    }
  };

  const handleReset = () => {
    setAgeMin(DEFAULT_FILTERS.ageMin);
    setAgeMax(DEFAULT_FILTERS.ageMax);
    setSelectedReligion(DEFAULT_FILTERS.selectedReligion);
    setSelectedSubCommunity(DEFAULT_FILTERS.selectedSubCommunity);
    setManglikPref(DEFAULT_FILTERS.manglikPref);
    setGunMilanMin(DEFAULT_FILTERS.gunMilanMin);
    setSelectedRashi([]);
    setKundliRequirement("Doesn't Matter");
    setDoshaFilters([]);
    setLocationIntent(DEFAULT_FILTERS.locationIntent);
    setSelectedNetWorth(DEFAULT_FILTERS.selectedNetWorth);
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
      selectedRashi,
      kundliRequirement,
      doshaFilters,
      locationIntent,
      selectedNetWorth,
      secondHomePref: false
    };
    onApply(filters);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-md md:max-w-2xl lg:max-w-3xl h-[92vh] sm:h-[840px] sm:max-h-[88vh] bg-[#F8F6F2] text-[#161412] rounded-t-[36px] sm:rounded-[36px] overflow-hidden flex flex-col justify-between select-none font-sans border border-[#E8DDD0] shadow-2xl relative"
        >
          {/* Top Header with Back Button & Royal Branding */}
          <div className="px-5 pt-4 pb-3.5 bg-[#F8F6F2] border-b border-[#E8DDD0] sticky top-0 z-20 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1 text-xs font-bold text-[#560406] hover:text-[#730C0F] transition-all px-3 py-1.5 rounded-full bg-white border border-[#E8DDD0] active:scale-95 cursor-pointer shadow-xs"
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
              className={`flex-1 py-2 px-1 rounded-xl transition-all cursor-pointer text-center text-xs font-bold ${
                activeTab === 'basic'
                  ? 'bg-[#560406] text-[#A17B5E] shadow-sm'
                  : 'text-[#6E6259] hover:text-[#161412] bg-[#F8F6F2]'
              }`}
            >
              Religion &amp; Age
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('horoscope')}
              className={`flex-1 py-2 px-1 rounded-xl transition-all cursor-pointer text-center text-xs font-bold ${
                activeTab === 'horoscope'
                  ? 'bg-[#560406] text-[#A17B5E] shadow-sm'
                  : 'text-[#6E6259] hover:text-[#161412] bg-[#F8F6F2]'
              }`}
            >
              Horoscope &amp; Location
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lifestyle')}
              className={`flex-1 py-2 px-1 rounded-xl transition-all cursor-pointer text-center text-xs font-bold ${
                activeTab === 'lifestyle'
                  ? 'bg-[#560406] text-[#A17B5E] shadow-sm'
                  : 'text-[#6E6259] hover:text-[#161412] bg-[#F8F6F2]'
              }`}
            >
              Net Worth &amp; Career
            </button>
          </div>

          {/* Form Options Content */}
          <div className="p-5 sm:p-6 space-y-6 flex-1 overflow-y-auto scrollbar-none bg-[#F8F6F2]">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                {/* 1. Religion Selection Grid (Cleanly aligned 3-column / 4-column grid) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-widest text-[#560406]">
                      Religion &amp; Faith
                    </label>
                    <span className="text-[10px] text-[#A17B5E] font-bold">Select 1 or more</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {metadataOptions.religions.map((rel) => {
                      const isSelected = selectedReligion.includes(rel);
                      return (
                        <button
                          key={rel}
                          type="button"
                          onClick={() => handleReligionChange(rel)}
                          className={`py-2.5 px-2 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs text-center ${
                            isSelected
                              ? 'bg-[#560406] text-[#F5E6D3] shadow-md border border-[#560406]'
                              : 'bg-white text-[#6E6259] border border-[#E8DDD0] hover:bg-[#F8F6F2]'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-[#D8B486] shrink-0" />}
                          <span className="truncate">{rel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Dynamic Sub-Community / Caste Grid mapped to Selected Religion */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-widest text-[#560406]">
                      Sub-Community / Caste
                    </label>
                    <span className="text-[10px] text-[#6E6259] font-bold">
                      {selectedReligion.join(', ')} Communities
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1 bg-white/50 rounded-2xl border border-[#E8DDD0]">
                    {dynamicSubCommunities.map((sub) => {
                      const isSelected = selectedSubCommunity.includes(sub);
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => toggleSelection(selectedSubCommunity, sub, setSelectedSubCommunity)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer shadow-xs text-left ${
                            isSelected
                              ? 'bg-[#560406] text-[#F5E6D3] shadow-sm border border-[#560406]'
                              : 'bg-white text-[#6E6259] border border-[#E8DDD0] hover:bg-[#F8F6F2]'
                          }`}
                        >
                          <span className="truncate pr-1">{sub}</span>
                          {isSelected && <Check className="w-3 h-3 text-[#D8B486] shrink-0" />}
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
                    <div className="p-3.5 rounded-xl bg-[#F8F6F2] border border-[#E8DDD0] text-center">
                      <span className="text-[10px] text-[#6E6259] font-bold uppercase block mb-0.5">Minimum Age</span>
                      <span className="text-lg font-black text-[#161412]">{ageMin} Years</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F8F6F2] border border-[#E8DDD0] text-center">
                      <span className="text-[10px] text-[#6E6259] font-bold uppercase block mb-0.5">Maximum Age</span>
                      <span className="text-lg font-black text-[#161412]">{ageMax} Years</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-[#6E6259] mb-1">
                        <span>Min Age</span>
                        <span className="text-[#560406]">{ageMin} yrs</span>
                      </div>
                      <input
                        type="range"
                        min={18}
                        max={35}
                        value={ageMin}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setAgeMin(val);
                          if (val > ageMax) setAgeMax(val);
                        }}
                        className="w-full accent-[#560406] cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-[#6E6259] mb-1">
                        <span>Max Age</span>
                        <span className="text-[#560406]">{ageMax} yrs</span>
                      </div>
                      <input
                        type="range"
                        min={25}
                        max={50}
                        value={ageMax}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setAgeMin(Math.min(ageMin, val));
                          setAgeMax(val);
                        }}
                        className="w-full accent-[#560406] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'horoscope' && (
              <div className="space-y-6">
                {/* 1. Manglik Preference Grid */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-black uppercase tracking-widest text-[#560406] flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-[#A17B5E]" />
                    <span>Manglik Preference</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Non-Manglik', 'Manglik', 'Anshik / Mild', "Doesn't Matter"] as const).map((m) => {
                      const isSelected =
                        manglikPref === m ||
                        (m === 'Non-Manglik' && manglikPref === 'No') ||
                        (m === 'Manglik' && manglikPref === 'Yes');

                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            if (m === 'Non-Manglik') setManglikPref('No');
                            else if (m === 'Manglik') setManglikPref('Yes');
                            else setManglikPref(m);
                          }}
                          className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs text-center ${
                            isSelected
                              ? 'bg-[#560406] text-[#F5E6D3] shadow-md border border-[#560406]'
                              : 'bg-white text-[#6E6259] border border-[#E8DDD0] hover:bg-[#F8F6F2]'
                          }`}
                        >
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Minimum Gun Milan Score with Qualitative Rating */}
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

                  <div className="flex justify-between text-[10px] font-bold text-[#6E6259]">
                    <span>18 (Acceptable)</span>
                    <span className="text-[#560406]">24+ (Recommended)</span>
                    <span>32+ (Uttam Milan)</span>
                  </div>
                </div>

                {/* 3. Kundli Matching Requirement */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-black uppercase tracking-widest text-[#560406] flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#A17B5E]" />
                    <span>Kundli Matching Requirement</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Mandatory', 'Flexible', "Doesn't Matter"] as const).map((req) => (
                      <button
                        key={req}
                        type="button"
                        onClick={() => setKundliRequirement(req)}
                        className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs text-center ${
                          kundliRequirement === req
                            ? 'bg-[#560406] text-[#F5E6D3] shadow-md border border-[#560406]'
                            : 'bg-white text-[#6E6259] border border-[#E8DDD0] hover:bg-[#F8F6F2]'
                        }`}
                      >
                        {req}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Rashi / Moon Sign (12 Signs Grid) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-widest text-[#560406] flex items-center gap-1.5">
                      <Moon className="w-3.5 h-3.5 text-[#A17B5E]" />
                      <span>Rashi / Moon Sign</span>
                    </label>
                    <span className="text-[10px] text-[#6E6259] font-bold">Optional filter</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 bg-white/50 rounded-2xl border border-[#E8DDD0]">
                    {RASHI_OPTIONS.map((rashi) => {
                      const isSelected = selectedRashi.includes(rashi.id);
                      return (
                        <button
                          key={rashi.id}
                          type="button"
                          onClick={() => toggleSelection(selectedRashi, rashi.id, setSelectedRashi)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs text-center ${
                            isSelected
                              ? 'bg-[#560406] text-[#F5E6D3] shadow-sm border border-[#560406]'
                              : 'bg-white text-[#6E6259] border border-[#E8DDD0] hover:bg-[#F8F6F2]'
                          }`}
                        >
                          <span>{rashi.symbol}</span>
                          <span className="truncate text-[11px]">{rashi.name.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Dosha Filters */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-black uppercase tracking-widest text-[#560406] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#A17B5E]" />
                    <span>Astrological Dosha Filters</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {DOSHA_OPTIONS.map((dosha) => {
                      const isSelected = doshaFilters.includes(dosha);
                      return (
                        <button
                          key={dosha}
                          type="button"
                          onClick={() => toggleSelection(doshaFilters, dosha, setDoshaFilters)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer shadow-xs ${
                            isSelected
                              ? 'bg-[#560406] text-[#F5E6D3] shadow-sm border border-[#560406]'
                              : 'bg-white text-[#6E6259] border border-[#E8DDD0] hover:bg-[#F8F6F2]'
                          }`}
                        >
                          <span className="truncate pr-1 text-[11px]">{dosha}</span>
                          {isSelected && <Check className="w-3 h-3 text-[#D8B486] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Location Intent */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-black uppercase tracking-widest text-[#560406] flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#A17B5E]" />
                    <span>Location Intent &amp; Relocation</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Only Same City', 'Open to Relocate to Metro Cities', 'Open to Relocate to US', 'Open to Long Distance'].map((loc) => {
                      const isSelected = locationIntent.includes(loc);
                      return (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => toggleSelection(locationIntent, loc, setLocationIntent)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer shadow-xs text-left ${
                            isSelected
                              ? 'bg-[#560406] text-[#F5E6D3] shadow-md border border-[#560406]'
                              : 'bg-white text-[#6E6259] border border-[#E8DDD0] hover:bg-[#F8F6F2]'
                          }`}
                        >
                          <span className="truncate pr-1 text-[11px]">{loc}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#D8B486] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'lifestyle' && (
              <div className="space-y-6">
                {/* Net Worth Range (Clean 2-Column Aligned Grid) */}
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
                              : 'bg-white text-[#6E6259] border border-[#E8DDD0] hover:bg-[#F8F6F2]'
                          }`}
                        >
                          <span>{nw}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#D8B486]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Income / Salary Preference */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-black uppercase tracking-widest text-[#560406]">
                    Candidate Annual Income Range
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {['₹15L - ₹25L', '₹25L - ₹50L', '₹50L - ₹1Cr', '₹1Cr+ / HNWI'].map((inc) => (
                      <div
                        key={inc}
                        className="p-3.5 rounded-2xl bg-white border border-[#E8DDD0] text-xs font-bold text-[#6E6259] flex items-center justify-between shadow-xs"
                      >
                        <span>{inc}</span>
                        <Check className="w-3.5 h-3.5 text-[#A17B5E]" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Apply Button */}
          <div className="p-4 sm:p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-[#E8DDD0] bg-[#F8F6F2] sticky bottom-0 z-20 shadow-lg flex items-center gap-3">
            <button
              type="button"
              onClick={handleApplyClick}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#730C0F] via-[#560406] to-[#3A0204] text-[#F5E6D3] font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#A17B5E]/40"
            >
              <Sparkles className="w-4 h-4 text-[#D8B486]" />
              <span>Apply Filters &amp; Discover</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
