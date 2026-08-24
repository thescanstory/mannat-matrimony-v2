import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  UserCheck,
  LogOut,
  LogIn,
  User,
  ChevronRight,
  ChevronDown,
  Lock,
  CheckCircle2,
  Edit3,
  Check,
  Mail,
  Trash2,
  AlertTriangle,
  MapPin,
  Briefcase,
  Wallet,
  Sparkles,
  Utensils,
  Home,
  Camera,
  Upload
} from 'lucide-react';
import { NudgeBanner } from './NudgeBanner';
import { authService } from '../services/authService';
import type { UserSession } from '../services/authService';
import type { Profile, PrivacySettings } from '../types';
import { CITY_OPTIONS } from '../cityOptions';

interface ProfileScreenProps {
  currentUser: UserSession | null;
  candidateProfile?: Profile | null;
  privacySettings: PrivacySettings;
  isParentView: boolean;
  onToggleParentView: () => void;
  onOpenPrivacySettings: () => void;
  onOpenPaywall: () => void;
  onEditBioData?: () => void;
  onUpdateProfile?: (updated: Profile) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onDeleteAllData?: () => void;
  onUpdateUser?: (updated: UserSession) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  candidateProfile,
  privacySettings,
  isParentView,
  onToggleParentView,
  onOpenPrivacySettings,
  onOpenPaywall,
  onEditBioData,
  onUpdateProfile,
  onOpenAuth,
  onLogout,
  onDeleteAllData,
  onUpdateUser
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  // Editable Bio-Data State initialized from candidateProfile or defaults
  const [editName, setEditName] = useState(candidateProfile?.display_name || currentUser?.user_metadata?.full_name || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [editGender, setEditGender] = useState<'male' | 'female'>(candidateProfile?.gender === 'male' ? 'male' : 'female');
  const [editManagedBy, setEditManagedBy] = useState<string>(candidateProfile?.managed_by || 'self');
  const [editAge, setEditAge] = useState(candidateProfile?.age ? String(candidateProfile.age) : '27');
  const [editHeight, setEditHeight] = useState(candidateProfile?.height || '5\'7" (170 cm)');
  const [editCity, setEditCity] = useState(candidateProfile?.city || 'Mumbai');
  const [editReligion, setReligion] = useState(candidateProfile?.religion || 'Hindu');
  const [editSubCommunity, setSubCommunity] = useState(candidateProfile?.sub_community || '');
  const [editEducation, setEducation] = useState(candidateProfile?.education || 'MBA');

  const rawOcc = candidateProfile?.occupation || 'Product Specialist';
  const initialEmpType = rawOcc.includes('Self-Employed') || rawOcc.includes('Business') ? 'Self-Employed / Business' : 'Salaried';
  const cleanOcc = rawOcc.replace(/\s*\((Salaried|Self-Employed \/ Business|Self-Employed|Business)\)/i, '');
  
  const [editEmploymentType, setEmploymentType] = useState<'Salaried' | 'Self-Employed / Business'>(initialEmpType);
  const [editOccupation, setOccupation] = useState(cleanOcc);
  const [editCompany, setCompany] = useState(candidateProfile?.company_name || '');
  const [editIncomeBracket, setIncomeBracket] = useState(candidateProfile?.salary_bracket || '');
  const [editFinancialStance, setFinancialStance] = useState('');
  const [editDiet, setDiet] = useState(candidateProfile?.diet || '');
  const [editFamilyType, setFamilyType] = useState('');
  const [editFamilyValues, setFamilyValues] = useState('');

  const [editPhotos, setEditPhotos] = useState<string[]>(candidateProfile?.photos || []);
  const [editVideoUrl, setEditVideoUrl] = useState<string>(candidateProfile?.bio_video_url || '');

  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const displayName = candidateProfile?.display_name || currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || 'Member Candidate';
  const email = currentUser?.email || 'Not signed in';

  const toggleAccordion = (sectionKey: string) => {
    setActiveAccordion(prev => prev === sectionKey ? null : sectionKey);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editEmail.trim()) return;
    const updated = authService.setUserSession(editEmail, editName, currentUser?.user_metadata?.avatar_url);
    if (onUpdateUser) {
      onUpdateUser(updated);
    }
    setShowEditModal(false);
  };

  const handleSaveSection = () => {
    if (!candidateProfile && !currentUser) return;
    const updated: Profile = {
      ...(candidateProfile || ({} as Profile)),
      id: candidateProfile?.id || currentUser?.id || 'custom-user-prof',
      user_id: currentUser?.id || candidateProfile?.user_id || 'custom-user-id',
      display_name: editName.trim() || displayName,
      gender: editGender,
      managed_by: (editManagedBy as 'self' | 'parent') || 'self',
      age: parseInt(editAge, 10) || 27,
      height: editHeight,
      city: editCity.trim(),
      religion: editReligion,
      community: editReligion === 'Hindu' ? 'North Indian' : editReligion,
      sub_community: editSubCommunity.trim() || undefined,
      marital_status: candidateProfile?.marital_status || 'Never Married',
      credits: candidateProfile?.credits ?? 10,
      compatibility_score: candidateProfile?.compatibility_score ?? 95,
      is_vouched: candidateProfile?.is_vouched ?? true,
      is_unlocked: candidateProfile?.is_unlocked ?? true,
      education: editEducation.trim(),
      occupation: `${editOccupation.trim()} (${editEmploymentType})`,
      company_name: editCompany.trim(),
      salary_bracket: editIncomeBracket,
      diet: editDiet,
      photos: editPhotos,
      bio_video_url: editVideoUrl,
      family_background: `${editFamilyType} family with ${editFamilyValues.toLowerCase()} values. Settled in ${editCity}.`,
      marriage_expectations: `Looking for a compatible partner who values ${editFinancialStance.toLowerCase()} financial harmony and mutual respect.`,
      bio_text: `Hi! I am a ${editOccupation} (${editEmploymentType}) based in ${editCity}. Value deep mutual respect, family values, and progressive growth.`,
      lifestyle_details: {
        net_worth: editIncomeBracket.includes('50L') ? '₹10Cr+' : '₹5Cr - ₹10Cr',
        private_clubs: 'City Golf & Country Club',
        second_home: true
      },
      horoscope: {
        manglik: 'No'
      }
    };

    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }
    setActiveAccordion(null);
  };

  const handleConfirmDeleteAll = () => {
    setShowDeleteConfirmModal(false);
    if (onDeleteAllData) {
      onDeleteAllData();
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FBF9F4] text-[#111111] pb-28 select-none font-sans">

      <div className="p-5 space-y-5">
        {/* User Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E1D5] shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#F4EFE6] border-2 border-[#B89552]/40 flex items-center justify-center text-[#B89552] text-xl font-serif-editorial font-bold shadow-inner overflow-hidden">
              {editPhotos && editPhotos.length > 0 ? (
                <img 
                  src={editPhotos[0]} 
                  alt={displayName} 
                  className="w-full h-full rounded-full object-cover" 
                />
              ) : currentUser?.user_metadata?.avatar_url ? (
                <img 
                  src={currentUser.user_metadata.avatar_url} 
                  alt={displayName} 
                  className="w-full h-full rounded-full object-cover" 
                />
              ) : (
                <User className="w-8 h-8 text-[#B89552]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-serif-editorial font-bold text-[#111111] truncate">{displayName}</h2>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified</span>
                </span>
              </div>
              <p className="text-xs text-[#777777] truncate">
                {editOccupation} · {editCity} · {editIncomeBracket}
              </p>
              <p className="text-[11px] text-[#999999] truncate">{email}</p>
            </div>

            {currentUser && (
              <button
                type="button"
                onClick={() => {
                  setEditName(currentUser.user_metadata?.full_name || '');
                  setEditEmail(currentUser.email || '');
                  setShowEditModal(true);
                }}
                className="p-2 rounded-full hover:bg-[#F4EFE6] text-[#B89552] border border-[#E8E1D5] transition-all cursor-pointer"
                title="Edit Account Credentials"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Auth & Bio-Data Action Buttons */}
          <div className="mt-5 pt-4 border-t border-[#E8E1D5] space-y-2">
            {currentUser && onEditBioData && (
              <button
                type="button"
                onClick={onEditBioData}
                className="w-full py-3 px-4 rounded-2xl bg-[#2D2824] hover:bg-[#B89552] text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-[#B89552]" />
                <span>Launch Full Step-by-Step Bio-Data Wizard</span>
              </button>
            )}

            {currentUser ? (
              <button
                type="button"
                onClick={onLogout}
                className="w-full py-2.5 px-4 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border border-rose-200 active:scale-98"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of Account</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full py-2.5 px-4 rounded-full bg-[#2D2824] hover:bg-[#B89552] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
              >
                <LogIn className="w-4 h-4 text-[#B89552]" />
                <span>Sign In to Account</span>
              </button>
            )}
          </div>
        </div>

        {/* Onboarding Bio-Data Overview & Dropdown Accordion Editors */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#8C6D32] block">
              Candidate Bio-Data & Onboarding Details
            </span>
            <span className="text-[10px] text-[#777777] font-semibold">
              Tap any section to edit
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8E1D5] divide-y divide-[#E8E1D5] shadow-xs overflow-hidden">
            
            {/* 1. Vitals & Identity Accordion */}
            <div className="transition-colors">
              <button
                type="button"
                onClick={() => toggleAccordion('vitals')}
                className="w-full p-4 flex items-center justify-between hover:bg-[#F4EFE6] transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-2xl bg-amber-50 text-[#B89552] border border-[#B89552]/20">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111111]">1. Candidate Vitals & Identity</h4>
                    <p className="text-[11px] text-[#777777]">
                      {editName || 'Candidate'}, {editAge} yrs · {editHeight} · {editGender === 'male' ? 'Man' : 'Woman'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#B89552] font-bold">
                  <span>{activeAccordion === 'vitals' ? 'Close' : 'Edit'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeAccordion === 'vitals' ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {activeAccordion === 'vitals' && (
                <div className="p-4 bg-[#FBF9F4] border-t border-[#E8E1D5] space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#777777] mb-1">Full Candidate Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-[#E8E1D5] font-bold text-[#111111] outline-none focus:border-[#B89552]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#777777] mb-1">Age (Years)</label>
                      <input
                        type="number"
                        min="18"
                        max="80"
                        value={editAge}
                        onChange={(e) => setEditAge(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white border border-[#E8E1D5] font-bold text-[#111111] outline-none focus:border-[#B89552]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#777777] mb-1">Height (ft/in & cm)</label>
                      <input
                        type="text"
                        value={editHeight}
                        onChange={(e) => setEditHeight(e.target.value)}
                        placeholder="e.g. 5'9&quot; (175 cm)"
                        className="w-full p-2.5 rounded-xl bg-white border border-[#E8E1D5] font-bold text-[#111111] outline-none focus:border-[#B89552]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#777777] mb-1">Gender</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditGender('male')}
                          className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${editGender === 'male' ? 'bg-[#2D2824] text-white border-[#111111]' : 'bg-white text-[#555555] border-[#E8E1D5]'}`}
                        >
                          Man
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditGender('female')}
                          className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${editGender === 'female' ? 'bg-[#2D2824] text-white border-[#111111]' : 'bg-white text-[#555555] border-[#E8E1D5]'}`}
                        >
                          Woman
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#777777] mb-1">Managed By</label>
                      <select
                        value={editManagedBy}
                        onChange={(e) => setEditManagedBy(e.target.value)}
                        className="w-full p-2 rounded-lg bg-white border border-[#E8E1D5] font-bold text-[#111111] outline-none focus:border-[#B89552] cursor-pointer"
                      >
                        <option value="self">Self Candidate</option>
                        <option value="parent">Parent</option>
                        <option value="sibling">Sibling</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveSection}
                    className="w-full py-2.5 rounded-xl bg-[#2D2824] hover:bg-[#B89552] text-white font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-98 mt-2"
                  >
                    <Check className="w-4 h-4 text-[#B89552]" />
                    <span>Save Vitals</span>
                  </button>
                </div>
              )}
            </div>

            {/* 2. Cultural Roots Accordion */}
            <div className="transition-colors">
              <button
                type="button"
                onClick={() => toggleAccordion('roots')}
                className="w-full p-4 flex items-center justify-between hover:bg-[#F4EFE6] transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111111]">2. Location & Cultural Roots</h4>
                    <p className="text-[11px] text-[#777777]">
                      {editCity} · {editReligion} {editSubCommunity ? `(${editSubCommunity})` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#B89552] font-bold">
                  <span>{activeAccordion === 'roots' ? 'Close' : 'Edit'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeAccordion === 'roots' ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {activeAccordion === 'roots' && (
                <div className="p-4 bg-[#FBF9F4] border-t border-[#E8E1D5] space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#777777] mb-1">Settled City</label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-[#B89552] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={editCity && !CITY_OPTIONS.includes(editCity) ? 'other' : editCity}
                        onChange={(e) => setEditCity(e.target.value === 'other' ? '' : e.target.value)}
                        className="w-full p-2.5 pl-9 pr-2 rounded-xl bg-white border border-[#E8E1D5] font-bold text-[#111111] outline-none focus:border-[#B89552] cursor-pointer appearance-none"
                      >
                        <option value="" disabled>Select a city</option>
                        {CITY_OPTIONS.map((cityName) => (
                          <option key={cityName} value={cityName}>{cityName}</option>
                        ))}
                        <option value="other">Other / NRI city</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#888888] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {editCity && !CITY_OPTIONS.includes(editCity) && (
                      <input
                        type="text"
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        placeholder="Type your city / NRI location"
                        className="w-full p-2.5 rounded-xl bg-white border border-[#E8E1D5] font-bold text-[#111111] outline-none focus:border-[#B89552] mt-1.5"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#777777] mb-1">Religion</label>
                      <select
                        value={editReligion}
                        onChange={(e) => setReligion(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white border border-[#E8E1D5] font-bold text-[#111111] outline-none focus:border-[#B89552] cursor-pointer"
                      >
                        {['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Parsi', 'Atheist', 'Agnostic', 'Spiritual', 'Buddhist', 'Jewish', 'Other'].map((rel) => (
                          <option key={rel} value={rel}>{rel}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#777777] mb-1">Community / Caste (Optional)</label>
                      <input
                        type="text"
                        value={editSubCommunity}
                        onChange={(e) => setSubCommunity(e.target.value)}
                        placeholder="e.g. Brahmin, Khatri"
                        className="w-full p-2.5 rounded-xl bg-white border border-[#E8E1D5] font-bold text-[#111111] outline-none focus:border-[#B89552]"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveSection}
                    className="w-full py-2.5 rounded-xl bg-[#2D2824] hover:bg-[#B89552] text-white font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-98 mt-2"
                  >
                    <Check className="w-4 h-4 text-[#B89552]" />
                    <span>Save Cultural Roots</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Career & Education Accordion */}
            <div className="transition-colors">
              <button
                type="button"
                onClick={() => toggleAccordion('career')}
                className="w-full p-4 flex items-center justify-between hover:bg-[#F4EFE6] transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111111]">3. Career & Education</h4>
                    <p className="text-[11px] text-[#777777]">
                      {editOccupation} ({editEmploymentType}) · {editCompany} · {editEducation}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#B89552] font-bold">
                  <span>{activeAccordion === 'career' ? 'Close' : 'Edit'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeAccordion === 'career' ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {activeAccordion === 'career' && (
                <div className="p-4 bg-[#FBF9F4] border-t border-[#E8E1D5] space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#777777] mb-1">Employment Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setEmploymentType('Salaried')}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${editEmploymentType === 'Salaried' ? 'bg-[#2D2824] text-white border-[#111111]' : 'bg-white text-[#555555] border-[#E8E1D5]'}`}
                      >
                        Salaried
                      </button>
                      <button
                        type="button"
                        onClick={() => setEmploymentType('Self-Employed / Business')}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${editEmploymentType === 'Self-Employed / Business' ? 'bg-[#2D2824] text-white border-[#111111]' : 'bg-white text-[#555555] border-[#E8E1D5]'}`}
                      >
                        Self-Employed / Business
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#777777] mb-1">Highest Education Degree</label>
                    <input
                      type="text"
                      value={editEducation}
                      onChange={(e) => setEducation(e.target.value)}
                      placeholder="e.g. MBA, B.Tech, MS"
                      className="w-full p-2.5 rounded-xl bg-white border border-[#E8E1D5] font-bold text-[#111111] outline-none focus:border-[#B89552]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#777777] mb-1">Current Role / Title</label>
                      <input
                        type="text"
                        value={editOccupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        placeholder="e.g. Vice President"
                        className="w-full p-2.5 rounded-xl bg-white border border-[#E8E1D5] font-bold text-[#111111] outline-none focus:border-[#B89552]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#777777] mb-1">Company / Firm Name</label>
                      <input
                        type="text"
                        value={editCompany}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Google, Own Venture"
                        className="w-full p-2.5 rounded-xl bg-white border border-[#E8E1D5] font-bold text-[#111111] outline-none focus:border-[#B89552]"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveSection}
                    className="w-full py-2.5 rounded-xl bg-[#2D2824] hover:bg-[#B89552] text-white font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-98 mt-2"
                  >
                    <Check className="w-4 h-4 text-[#B89552]" />
                    <span>Save Career Details</span>
                  </button>
                </div>
              )}
            </div>

            {/* 4. Annual Income & Financial Harmony Accordion */}
            <div className="transition-colors">
              <button
                type="button"
                onClick={() => toggleAccordion('income')}
                className="w-full p-4 flex items-center justify-between hover:bg-[#F4EFE6] transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111111]">4. Annual Income & Financial Harmony</h4>
                    <p className="text-[11px] text-[#777777]">
                      {editIncomeBracket} · {editFinancialStance}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#B89552] font-bold">
                  <span>{activeAccordion === 'income' ? 'Close' : 'Edit'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeAccordion === 'income' ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {activeAccordion === 'income' && (
                <div className="p-4 bg-[#FBF9F4] border-t border-[#E8E1D5] space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#777777] mb-1.5">Annual Income Bracket</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['₹5L - ₹10L', '₹10L - ₹15L', '₹15L - ₹25L', '₹25L - ₹35L', '₹35L - ₹50L', '₹50L+ HNI'].map((inc) => (
                        <button
                          key={inc}
                          type="button"
                          onClick={() => setIncomeBracket(inc)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${editIncomeBracket === inc ? 'bg-[#2D2824] text-white border-[#111111]' : 'bg-white text-[#555555] border-[#E8E1D5]'}`}
                        >
                          {inc}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#777777] mb-1.5">Financial Management Preference</label>
                    <div className="space-y-1.5">
                      {[
                        { id: 'Total Pooling', label: 'Total Joint Account Pooling' },
                        { id: 'Hybrid Balance', label: 'Shared Joint Account + Separate Savings' },
                        { id: 'Independent', label: '100% Independent Accounts' }
                      ].map((fin) => (
                        <button
                          key={fin.id}
                          type="button"
                          onClick={() => setFinancialStance(fin.id)}
                          className={`w-full p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${editFinancialStance === fin.id ? 'bg-[#2D2824] text-white border-[#111111]' : 'bg-white text-[#555555] border-[#E8E1D5]'}`}
                        >
                          <span>{fin.label}</span>
                          {editFinancialStance === fin.id && <Check className="w-4 h-4 text-[#B89552]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveSection}
                    className="w-full py-2.5 rounded-xl bg-[#2D2824] hover:bg-[#B89552] text-white font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-98 mt-2"
                  >
                    <Check className="w-4 h-4 text-[#B89552]" />
                    <span>Save Income & Finances</span>
                  </button>
                </div>
              )}
            </div>

            {/* 5. Lifestyle & Diet Accordion */}
            <div className="transition-colors">
              <button
                type="button"
                onClick={() => toggleAccordion('lifestyle')}
                className="w-full p-4 flex items-center justify-between hover:bg-[#F4EFE6] transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-2xl bg-green-50 text-green-600 border border-green-200">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111111]">5. Daily Lifestyle & Diet</h4>
                    <p className="text-[11px] text-[#777777]">Diet Preference: {editDiet}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#B89552] font-bold">
                  <span>{activeAccordion === 'lifestyle' ? 'Close' : 'Edit'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeAccordion === 'lifestyle' ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {activeAccordion === 'lifestyle' && (
                <div className="p-4 bg-[#FBF9F4] border-t border-[#E8E1D5] space-y-3 text-xs">
                  <label className="block text-[10px] font-bold uppercase text-[#777777]">Select Diet Preference</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {['Veg', 'Eggetarian', 'Non-Veg', 'Vegan', 'Jain Veg'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDiet(d)}
                        className={`px-3.5 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${editDiet === d ? 'bg-[#2D2824] text-white shadow-sm' : 'bg-white text-[#555555] border border-[#E8E1D5]'}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveSection}
                    className="w-full py-2.5 rounded-xl bg-[#2D2824] hover:bg-[#B89552] text-white font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-98 mt-2"
                  >
                    <Check className="w-4 h-4 text-[#B89552]" />
                    <span>Save Diet Preference</span>
                  </button>
                </div>
              )}
            </div>

            {/* 6. Family & Heritage Accordion */}
            <div className="transition-colors">
              <button
                type="button"
                onClick={() => toggleAccordion('family')}
                className="w-full p-4 flex items-center justify-between hover:bg-[#F4EFE6] transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111111]">6. Family Heritage & Values</h4>
                    <p className="text-[11px] text-[#777777]">
                      {editFamilyType} Family · {editFamilyValues} Values
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#B89552] font-bold">
                  <span>{activeAccordion === 'family' ? 'Close' : 'Edit'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeAccordion === 'family' ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {activeAccordion === 'family' && (
                <div className="p-4 bg-[#FBF9F4] border-t border-[#E8E1D5] space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#777777] mb-1">Family Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Nuclear', 'Joint Family'].map((fam) => (
                        <button
                          key={fam}
                          type="button"
                          onClick={() => setFamilyType(fam)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${editFamilyType === fam ? 'bg-[#2D2824] text-white border-[#111111]' : 'bg-white text-[#555555] border-[#E8E1D5]'}`}
                        >
                          {fam}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#777777] mb-1">Family Values</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Traditional', 'Moderate', 'Progressive'].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setFamilyValues(val)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${editFamilyValues === val ? 'bg-[#2D2824] text-white border-[#111111]' : 'bg-white text-[#555555] border-[#E8E1D5]'}`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveSection}
                    className="w-full py-2.5 rounded-xl bg-[#2D2824] hover:bg-[#B89552] text-white font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-98 mt-2"
                  >
                    <Check className="w-4 h-4 text-[#B89552]" />
                    <span>Save Family Values</span>
                  </button>
                </div>
              )}
            </div>

            {/* 7. Photos & 30s Video Intro Accordion */}
            <div className="transition-colors">
              <button
                type="button"
                onClick={() => toggleAccordion('media')}
                className="w-full p-4 flex items-center justify-between hover:bg-[#F4EFE6] transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111111]">7. Photos & 30s Video Intro</h4>
                    <p className="text-[11px] text-[#777777]">
                      {editPhotos.length} Photos uploaded · Video Intro active
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#B89552] font-bold">
                  <span>{activeAccordion === 'media' ? 'Close' : 'Edit'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeAccordion === 'media' ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {activeAccordion === 'media' && (
                <div className="p-4 bg-[#FBF9F4] border-t border-[#E8E1D5] space-y-3 text-xs">
                  <div>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const url = URL.createObjectURL(e.target.files[0]);
                          setEditPhotos(prev => [...prev, url].slice(0, 3));
                        }
                      }}
                      className="hidden"
                    />
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[10px] font-bold uppercase text-[#777777]">
                        Profile Photos ({editPhotos.length} / 3)
                      </label>
                      {editPhotos.length < 3 && (
                        <button
                          type="button"
                          onClick={() => photoInputRef.current?.click()}
                          className="text-[10px] font-bold text-[#B89552] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Add Photo</span>
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {editPhotos.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-[#E8E1D5]">
                          <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setEditPhotos(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 p-1 rounded-full bg-[#2D2824]/70 hover:bg-red-600 text-white cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const url = URL.createObjectURL(e.target.files[0]);
                          setEditVideoUrl(url);
                        }
                      }}
                      className="hidden"
                    />
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[10px] font-bold uppercase text-[#777777]">30s Video Intro</label>
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        className="text-[10px] font-bold text-[#B89552] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Replace Video</span>
                      </button>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden aspect-[9/12] max-h-[180px] bg-[#2D2824] mx-auto">
                      <video src={editVideoUrl} controls playsInline className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveSection}
                    className="w-full py-2.5 rounded-xl bg-[#2D2824] hover:bg-[#B89552] text-white font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-98 mt-2"
                  >
                    <Check className="w-4 h-4 text-[#B89552]" />
                    <span>Save Media</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

<NudgeBanner
          title="MEMBERSHIP STATUS"
          subtitle="Mannat Gold Membership"
          className="bg-gradient-to-br from-[#1A1A1A] to-[#2C261E] text-white border-[#B89552]/40"
          onClick={onOpenPaywall}
        >
          <p className="text-xs text-gray-300">
            Unlock unlimited verified contact direct requests & phone invites
          </p>
        </NudgeBanner>

        {/* Privacy & Security Section */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#8C6D32] px-1 block">
            Privacy & Trust Center
          </span>
          <div className="bg-white rounded-3xl border border-[#E8E1D5] divide-y divide-[#E8E1D5] shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={onOpenPrivacySettings}
              className="w-full p-4 flex items-center justify-between hover:bg-[#F4EFE6] transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-2xl bg-amber-50 text-[#B89552] border border-[#B89552]/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111111]">Privacy Controls & Blur Shield</h4>
                  <p className="text-[11px] text-[#777777]">Photo visibility, discovery mode & financial badges</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#888888]" />
            </button>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111111]">Photo Blur Shield</h4>
                  <p className="text-[11px] text-[#777777]">
                    {privacySettings.photo_privacy === 'visible_to_everyone' ? 'Public (Visible)' : 'Protected (Request to view)'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#8C6D32] bg-[#F4EFE6] px-2.5 py-1 rounded-full border border-[#E8E1D5]">
                {privacySettings.photo_privacy === 'visible_to_everyone' ? 'Standard' : 'Private'}
              </span>
            </div>
          </div>
        </div>

        {/* Discovery & App Modes */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#8C6D32] px-1 block">
            App Modes & Discovery
          </span>
          <div className="bg-white rounded-3xl border border-[#E8E1D5] divide-y divide-[#E8E1D5] shadow-xs overflow-hidden">
            {/* Parent Mode Toggle */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-2xl border ${isParentView ? 'bg-amber-600 text-white border-amber-600' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111111]">Parent View Mode</h4>
                  <p className="text-[11px] text-[#777777]">Large text & family bio-data oriented interface</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onToggleParentView}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer shadow-xs ${
                  isParentView ? 'bg-amber-600 text-white' : 'bg-[#F4EFE6] text-[#111111] hover:bg-[#E8E1D5]'
                }`}
              >
                {isParentView ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone: Delete All Profile Data */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 px-1 block">
            Account Management & Data Reset
          </span>
          <div className="bg-white rounded-3xl border border-rose-200 p-4 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>Delete All Profile Data</span>
                </h4>
                <p className="text-[11px] text-[#777777] leading-relaxed">
                  Permanently erase your bio-data, candidate persona, photos, video intro, and wave history.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteConfirmModal(true)}
                className="py-2 px-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-extrabold transition-all cursor-pointer shadow-sm shrink-0"
              >
                Delete Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Account Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-[#2D2824]/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#FBF9F4] rounded-3xl p-6 border border-[#E8E1D5] shadow-2xl space-y-4 text-left">
            <h3 className="text-base font-serif-editorial font-bold text-[#111111]">
              Edit Account Identity
            </h3>
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                                        placeholder="Enter full name"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none focus:border-[#B89552]"
                  />
                  <User className="w-4 h-4 text-[#B89552] absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none focus:border-[#B89552]"
                    required
                  />
                  <Mail className="w-4 h-4 text-[#B89552] absolute left-3 top-3" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#555555] text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2D2824] hover:bg-[#B89552] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 z-50 bg-[#2D2824]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-rose-200 shadow-2xl space-y-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-serif-editorial font-bold text-[#111111]">
                Delete All Profile Data?
              </h3>
              <p className="text-xs text-[#777777] leading-relaxed">
                This will permanently erase your verified bio-data, photos, intro video, saved matches, and account session. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirmModal(false)}
                className="flex-1 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-[#555555] text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAll}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete All</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
