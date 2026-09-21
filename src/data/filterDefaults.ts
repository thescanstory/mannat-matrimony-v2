import type { FilterCriteria } from '../types';

export const DEFAULT_FILTERS: FilterCriteria = {
  ageMin: 22,
  ageMax: 35,
  selectedReligion: ['Hindu'],
  selectedSubCommunity: ['Brahmin', 'Kayastha'],
  manglikPref: "Doesn't Matter",
  gunMilanMin: 24,
  selectedRashi: [],
  selectedNakshatraGroup: [],
  kundliRequirement: "Doesn't Matter",
  doshaFilters: [],
  locationIntent: ['Open to Relocate to US', 'Only Same City'],
  selectedNetWorth: ['₹5Cr - ₹10Cr'],
  secondHomePref: false
};
