import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Crown, 
  Search, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  RefreshCw, 
  Users, 
  Award, 
  Flame,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';
import type { Profile } from '../types';
import { MOCK_PROFILES } from '../services/mockData';

interface AdminDashboardProps {
  profiles: Profile[];
  onUpdateProfiles: (updated: Profile[]) => void;
  onBackToApp: () => void;
  onResetAllData: () => void;
  onTriggerToast: (msg: string, type?: 'success' | 'heart' | 'sparkle') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  profiles,
  onUpdateProfiles,
  onBackToApp,
  onResetAllData,
  onTriggerToast
}) => {
  const [activeTab, setActiveTab] = useState<'candidates' | 'analytics' | 'vouches' | 'database'>('candidates');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterReligion, setFilterReligion] = useState<string>('all');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // New Candidate Form State
  const [newCandidate, setNewCandidate] = useState({
    display_name: '',
    age: 26,
    city: 'Mumbai',
    religion: 'Hindu',
    community: 'Brahmin',
    occupation: 'Software Engineer',
    company_name: 'Tech Corp',
    salary_bracket: '₹35L - ₹50L',
    bio_text: 'Passionate about culture, art and technology.',
    photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'],
    bio_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-smiling-at-the-camera-40150-large.mp4',
    is_vouched: true,
    is_spotlight: false,
    compatibility_score: 96
  });

  // Filtered Candidates
  const filteredCandidates = useMemo(() => {
    return profiles.filter((p) => {
      const matchSearch = p.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.occupation.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchReligion = filterReligion === 'all' || p.religion.toLowerCase() === filterReligion.toLowerCase();
      
      const matchVerified = filterVerified === 'all' || 
        (filterVerified === 'verified' && p.is_vouched) || 
        (filterVerified === 'unverified' && !p.is_vouched);

      return matchSearch && matchReligion && matchVerified;
    });
  }, [profiles, searchTerm, filterReligion, filterVerified]);

  // Candidate Actions
  const toggleVerified = (profileId: string) => {
    const updated = profiles.map((p) => 
      p.id === profileId ? { ...p, is_vouched: !p.is_vouched } : p
    );
    onUpdateProfiles(updated);
    onTriggerToast('Candidate Verification Status Updated!', 'success');
  };

  const toggleSpotlight = (profileId: string) => {
    const updated = profiles.map((p) => 
      p.id === profileId ? { ...p, is_spotlight: !p.is_spotlight } : p
    );
    onUpdateProfiles(updated);
    onTriggerToast('Candidate Spotlight Status Toggled! 🌟', 'sparkle');
  };

  const deleteCandidate = (profileId: string) => {
    if (window.confirm('Are you sure you want to remove this candidate bio-data?')) {
      const updated = profiles.filter((p) => p.id !== profileId);
      onUpdateProfiles(updated);
      onTriggerToast('Candidate bio-data removed from platform', 'success');
    }
  };

  const handleCreateCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidate.display_name) return;

    const created: Profile = {
      id: 'cand_' + Math.random().toString(36).substring(2, 9),
      user_id: 'usr_' + Math.random().toString(36).substring(2, 9),
      display_name: newCandidate.display_name,
      age: Number(newCandidate.age),
      marital_status: 'Never Married',
      religion: newCandidate.religion,
      community: newCandidate.community,
      city: newCandidate.city,
      salary_bracket: newCandidate.salary_bracket,
      bio_video_url: newCandidate.bio_video_url,
      credits: 10,
      is_vouched: newCandidate.is_vouched,
      is_spotlight: newCandidate.is_spotlight,
      compatibility_score: Number(newCandidate.compatibility_score),
      is_unlocked: true,
      bio_text: newCandidate.bio_text,
      occupation: newCandidate.occupation,
      company_name: newCandidate.company_name,
      family_background: 'Reputed cultural family based in ' + newCandidate.city,
      marriage_expectations: 'Looking for a thoughtful partner with shared values.',
      photos: newCandidate.photos
    };

    onUpdateProfiles([created, ...profiles]);
    setShowAddModal(false);
    onTriggerToast(`Candidate "${created.display_name}" published live! ✨`, 'sparkle');
  };

  const handleReseedDefaults = () => {
    onUpdateProfiles(MOCK_PROFILES);
    onTriggerToast('Re-seeded 6 Vouched Candidates! 🚀', 'sparkle');
  };

  return (
    <div className="w-full min-h-screen bg-[#F4EFE6] text-[#111111] font-sans pb-28 select-none">
      {/* Top Header Bar */}
      <header className="w-full bg-[#111111] text-white px-5 py-4 border-b border-[#B89552]/40 sticky top-0 z-40 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToApp}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Return to Feed"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-instrument text-2xl lowercase text-[#B89552] leading-none">mannat</span>
              <span className="text-[10px] font-black text-black bg-[#B89552] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Admin Console
              </span>
            </div>
            <p className="text-[10px] text-gray-400">Matchmaker Operations & Verification Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-1.5 rounded-full bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 border border-rose-700/50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reset All Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Data</span>
          </button>
          <button
            type="button"
            onClick={onBackToApp}
            className="px-3.5 py-1.5 rounded-full bg-[#B89552] text-[#111111] hover:bg-white hover:text-[#111111] text-xs font-extrabold transition-all cursor-pointer"
          >
            Live App Feed
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* KPI Analytics Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-3xl border border-[#E8E1D5] shadow-xs">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Candidates</span>
              <Users className="w-4 h-4 text-[#B89552]" />
            </div>
            <div className="text-2xl font-serif-editorial font-bold text-[#111111]">
              {profiles.length}
            </div>
            <span className="text-[10px] text-emerald-700 font-bold">100% In Discovery</span>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-[#E8E1D5] shadow-xs">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Verified Rate</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-serif-editorial font-bold text-[#111111]">
              {Math.round((profiles.filter(p => p.is_vouched).length / (profiles.length || 1)) * 100)}%
            </div>
            <span className="text-[10px] text-gray-500 font-medium">Govt ID & Video Vetted</span>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-[#E8E1D5] shadow-xs">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Spotlight Boosted</span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-serif-editorial font-bold text-[#111111]">
              {profiles.filter(p => p.is_spotlight).length}
            </div>
            <span className="text-[10px] text-amber-700 font-bold">Top of Discovery Stream</span>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-[#E8E1D5] shadow-xs">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Monthly MRR</span>
              <Crown className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-serif-editorial font-bold text-[#111111]">
              ₹1,45,000
            </div>
            <span className="text-[10px] text-purple-700 font-bold">42 Gold Subscribers</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E8E1D5] pb-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('candidates')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
              activeTab === 'candidates' ? 'bg-[#111111] text-white shadow-xs' : 'bg-white text-[#111111] hover:bg-[#E8E1D5]'
            }`}
          >
            Candidate Bio-data ({filteredCandidates.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vouches')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
              activeTab === 'vouches' ? 'bg-[#111111] text-white shadow-xs' : 'bg-white text-[#111111] hover:bg-[#E8E1D5]'
            }`}
          >
            Matchmaker Vouches
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
              activeTab === 'database' ? 'bg-[#111111] text-white shadow-xs' : 'bg-white text-[#111111] hover:bg-[#E8E1D5]'
            }`}
          >
            Data & Database Engine
          </button>
        </div>

        {/* Tab 1: Candidates Management */}
        {activeTab === 'candidates' && (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-3xl border border-[#E8E1D5] shadow-xs flex items-center justify-between gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search candidate name, city or role..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F4EFE6] border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none focus:border-[#B89552]"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={filterReligion}
                  onChange={(e) => setFilterReligion(e.target.value)}
                  className="px-3 py-2.5 rounded-2xl bg-[#F4EFE6] border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
                >
                  <option value="all">All Faiths</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Jain">Jain</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Christian">Christian</option>
                </select>

                <select
                  value={filterVerified}
                  onChange={(e) => setFilterVerified(e.target.value as any)}
                  className="px-3 py-2.5 rounded-2xl bg-[#F4EFE6] border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="verified">Verified Only</option>
                  <option value="unverified">Unverified Only</option>
                </select>

                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2.5 rounded-2xl bg-[#111111] hover:bg-[#B89552] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Plus className="w-4 h-4 text-[#B89552]" />
                  <span>Add Candidate</span>
                </button>
              </div>
            </div>

            {/* Candidates Table / Grid */}
            <div className="space-y-3">
              {filteredCandidates.map((c) => (
                <div 
                  key={c.id}
                  className="bg-white rounded-3xl p-4 border border-[#E8E1D5] shadow-xs flex items-center justify-between gap-4 flex-wrap hover:border-[#B89552]/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-[240px]">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#E8E1D5] shrink-0 bg-[#F4EFE6]">
                      <img 
                        src={c.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                        alt={c.display_name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-sm font-bold font-serif-editorial text-[#111111] truncate">{c.display_name} · {c.age}</h4>
                        {c.is_vouched && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                            <Check className="w-2.5 h-2.5" />
                            <span>VOUCHED</span>
                          </span>
                        )}
                        {c.is_spotlight && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
                            <Flame className="w-2.5 h-2.5" />
                            <span>BOOSTED</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#777777] truncate">{c.occupation} @ {c.company_name || 'Independent'}</p>
                      <p className="text-[11px] text-[#8C6D32] font-semibold">{c.city} • {c.religion} ({c.community}) • {c.salary_bracket}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => toggleVerified(c.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        c.is_vouched 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100' 
                          : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                      }`}
                      title="Toggle Vouch Verification"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{c.is_vouched ? 'Verified ✓' : 'Unverified'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleSpotlight(c.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        c.is_spotlight 
                          ? 'bg-amber-500 text-white shadow-xs' 
                          : 'bg-[#F4EFE6] text-[#111111] border border-[#E8E1D5] hover:bg-[#E8E1D5]'
                      }`}
                      title="Toggle Spotlight Feed Placement"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>{c.is_spotlight ? 'Boosted' : 'Spotlight'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteCandidate(c.id)}
                      className="p-2 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                      title="Remove Candidate"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Matchmaker Vouches */}
        {activeTab === 'vouches' && (
          <div className="bg-white rounded-3xl p-6 border border-[#E8E1D5] space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif-editorial font-bold text-[#111111]">Certified Matchmaker Vouches</h3>
                <p className="text-xs text-[#777777]">Expert curator video commentary & trust ratings</p>
              </div>
              <span className="text-xs font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                4.9 / 5.0 Average Trust Score
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E1D5] space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#111111]">Sima Taparia Certified Vouch</span>
                  <Award className="w-4 h-4 text-[#B89552]" />
                </div>
                <p className="text-xs text-[#666666]">
                  "Family background and values align with premier cultural standards. Exceptional candidate suitability."
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#8C6D32] font-bold">
                  <span>Trust Score: 4.9 ★</span>
                  <span>Video Verified ✓</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E1D5] space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#111111]">Ananya Vetting Commission</span>
                  <Award className="w-4 h-4 text-[#B89552]" />
                </div>
                <p className="text-xs text-[#666666]">
                  "Government ID, educational degree, and salary verification passed with 100% authenticity."
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#8C6D32] font-bold">
                  <span>Trust Score: 5.0 ★</span>
                  <span>Degree Verified ✓</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Database & Testing Utilities */}
        {activeTab === 'database' && (
          <div className="bg-white rounded-3xl p-6 border border-[#E8E1D5] space-y-6 shadow-xs">
            <div className="space-y-1">
              <h3 className="text-lg font-serif-editorial font-bold text-[#111111]">Database & Testing Tools</h3>
              <p className="text-xs text-[#777777]">Manage platform state, clear browser cache, and re-seed profiles</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-[#F4EFE6] border border-[#E8E1D5] space-y-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#B89552]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">Re-seed Sample Candidates</h4>
                </div>
                <p className="text-xs text-[#666666]">
                  Instantly populates 6 high-quality, verified candidate bio-data profiles with photos and videos.
                </p>
                <button
                  type="button"
                  onClick={handleReseedDefaults}
                  className="px-4 py-2.5 rounded-full bg-[#111111] hover:bg-[#B89552] text-white text-xs font-bold cursor-pointer transition-all active:scale-95"
                >
                  Re-seed 6 Default Profiles
                </button>
              </div>

              <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">Purge All Testing Data & Cache</h4>
                </div>
                <p className="text-xs text-rose-700">
                  Wipes active login session, unauthenticates current user, and resets local storage for pristine testing.
                </p>
                <button
                  type="button"
                  onClick={onResetAllData}
                  className="px-4 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer transition-all active:scale-95"
                >
                  Wipe & Reset Everything
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-[32px] p-6 space-y-4 max-h-[90vh] overflow-y-auto border border-[#E8E1D5] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-3">
              <h3 className="text-xl font-serif-editorial font-bold text-[#111111]">Publish New Candidate Bio-data</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCandidate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#111111] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newCandidate.display_name}
                    onChange={(e) => setNewCandidate({ ...newCandidate, display_name: e.target.value })}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full px-3 py-2 rounded-xl bg-[#F4EFE6] border border-[#E8E1D5] text-xs font-bold outline-none focus:border-[#B89552]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111111] mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={newCandidate.age}
                    onChange={(e) => setNewCandidate({ ...newCandidate, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F4EFE6] border border-[#E8E1D5] text-xs font-bold outline-none focus:border-[#B89552]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#111111] mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newCandidate.city}
                    onChange={(e) => setNewCandidate({ ...newCandidate, city: e.target.value })}
                    placeholder="e.g. Mumbai / Delhi"
                    className="w-full px-3 py-2 rounded-xl bg-[#F4EFE6] border border-[#E8E1D5] text-xs font-bold outline-none focus:border-[#B89552]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111111] mb-1">Religion</label>
                  <select
                    value={newCandidate.religion}
                    onChange={(e) => setNewCandidate({ ...newCandidate, religion: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F4EFE6] border border-[#E8E1D5] text-xs font-bold outline-none"
                  >
                    <option value="Hindu">Hindu</option>
                    <option value="Sikh">Sikh</option>
                    <option value="Jain">Jain</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Christian">Christian</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#111111] mb-1">Occupation</label>
                  <input
                    type="text"
                    required
                    value={newCandidate.occupation}
                    onChange={(e) => setNewCandidate({ ...newCandidate, occupation: e.target.value })}
                    placeholder="e.g. Investment Banker"
                    className="w-full px-3 py-2 rounded-xl bg-[#F4EFE6] border border-[#E8E1D5] text-xs font-bold outline-none focus:border-[#B89552]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#111111] mb-1">Salary Bracket</label>
                  <select
                    value={newCandidate.salary_bracket}
                    onChange={(e) => setNewCandidate({ ...newCandidate, salary_bracket: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F4EFE6] border border-[#E8E1D5] text-xs font-bold outline-none"
                  >
                    <option value="₹20L - ₹35L">₹20L - ₹35L</option>
                    <option value="₹35L - ₹50L">₹35L - ₹50L</option>
                    <option value="₹50L - ₹1Cr">₹50L - ₹1Cr</option>
                    <option value="₹1Cr+ HNI">₹1Cr+ HNI</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#111111] mb-1">Photo URL</label>
                <input
                  type="url"
                  required
                  value={newCandidate.photos[0]}
                  onChange={(e) => setNewCandidate({ ...newCandidate, photos: [e.target.value] })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4EFE6] border border-[#E8E1D5] text-xs font-bold outline-none focus:border-[#B89552]"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#111111]">
                  <input
                    type="checkbox"
                    checked={newCandidate.is_vouched}
                    onChange={(e) => setNewCandidate({ ...newCandidate, is_vouched: e.target.checked })}
                    className="w-4 h-4 accent-[#B89552]"
                  />
                  <span>Mark as Verified Vouched Candidate</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-[#111111] hover:bg-[#B89552] text-white text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                Publish to Discovery Stream 🚀
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center space-y-4 border border-[#E8E1D5] shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-serif-editorial font-bold text-[#111111]">Confirm Data Wipe?</h3>
              <p className="text-xs text-[#777777] mt-1">
                This will clear all active sessions, local caches, and reset the app to an unauthenticated pristine state.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-bold text-[#111111] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetAllData();
                }}
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
              >
                Wipe & Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
