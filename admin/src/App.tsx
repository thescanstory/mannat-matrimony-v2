import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldCheck, 
  Crown, 
  Search, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Users, 
  Flame, 
  Check, 
  X, 
  PhoneCall, 
  Download, 
  Calendar, 
  Edit3, 
  ExternalLink,
  UserX,
  Play,
  ImageIcon,
  CheckCircle2
} from 'lucide-react';
import type { Profile } from './types';
import { supabase } from './services/supabaseClient';

interface VIPCallback {
  id: string;
  requester_name: string;
  requester_phone: string;
  target_candidate_name: string;
  requested_time: string;
  managed_by: 'Parent' | 'Candidate';
  status: 'Pending' | 'In Progress' | 'Completed';
  notes: string;
}

interface MatchmakerCurator {
  id: string;
  name: string;
  title: string;
  experience_years: number;
  rating: number;
  total_vouches: number;
  avatar_url: string;
  specialization: string;
  status: 'Active' | 'Under Review';
}

const INITIAL_CALLBACKS: VIPCallback[] = [];

const INITIAL_MATCHMAKERS: MatchmakerCurator[] = [];

function getInitialProfiles(): Profile[] {
  try {
    const deletedIds: string[] = JSON.parse(localStorage.getItem('mannat_admin_deleted_ids') || '[]');
    const customStored = localStorage.getItem('mannat_custom_profiles');
    const customList: Profile[] = customStored ? JSON.parse(customStored) : [];

    const adminStored = localStorage.getItem('mannat_admin_candidates');
    const adminList: Profile[] = adminStored ? JSON.parse(adminStored) : [];

    const profileMap = new Map<string, Profile>();

    // 1. Admin created candidates (highest precedence)
    adminList.forEach(p => {
      if (!deletedIds.includes(p.id)) profileMap.set(p.id, p);
    });

    // 2. User onboarding profiles (next precedence)
    customList.forEach(p => {
      if (!deletedIds.includes(p.id)) profileMap.set(p.id, p);
    });

    return Array.from(profileMap.values());
  } catch {
    return [];
  }
}

export function App() {
  const [profiles, setProfiles] = useState<Profile[]>(() => getInitialProfiles());

  const [activeTab, setActiveTab] = useState<'candidates' | 'callbacks' | 'vouches' | 'database'>('candidates');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterReligion, setFilterReligion] = useState<string>('all');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [showDeleteAllUsersConfirm, setShowDeleteAllUsersConfirm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Profile | null>(null);
  const [viewingCandidate, setViewingCandidate] = useState<Profile | null>(null);
  const [expandedCandidateId, setExpandedCandidateId] = useState<string | null>(() => getInitialProfiles()[0]?.id || null);
  const [activeDossierPhoto, setActiveDossierPhoto] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // VIP Callbacks & Matchmakers State
  const [callbacks, setCallbacks] = useState<VIPCallback[]>(INITIAL_CALLBACKS);
  const [matchmakers] = useState<MatchmakerCurator[]>(INITIAL_MATCHMAKERS);

  // Fetch live profiles and callback requests from Supabase on mount
  useEffect(() => {
    async function loadSupabaseData() {
      try {
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (data && !error && data.length > 0) {
          setExpandedCandidateId((prev) => prev || data[0].id);
        }
        const deletedIds: string[] = JSON.parse(localStorage.getItem('mannat_admin_deleted_ids') || '[]');
        
        // Start with all local candidate records
        const localProfiles = getInitialProfiles();
        const profileMap = new Map<string, Profile>();
        
        localProfiles.forEach(p => {
          if (!deletedIds.includes(p.id)) profileMap.set(p.id, p);
        });

        // Merge Supabase profiles without overwriting newly created local profiles
        if (data && !error && data.length > 0) {
          (data as any[]).forEach(d => {
            if (!deletedIds.includes(d.id)) {
              const mapped: Profile = {
                ...d,
                user_id: d.lifestyle_details?.user_id || d.user_id || d.id,
                diet: d.lifestyle_details?.diet || d.diet || '',
                salary_bracket: d.lifestyle_details?.salary_bracket || d.salary_bracket || '',
                family_background: d.lifestyle_details?.family_background || d.family_background || '',
                marriage_expectations: d.lifestyle_details?.marriage_expectations || d.marriage_expectations || '',
                gender: d.lifestyle_details?.gender || d.gender || 'male'
              };
              profileMap.set(d.id, { ...(profileMap.get(d.id) || {}), ...mapped });
            }
          });
        }

        const merged = Array.from(profileMap.values());
        setProfiles(merged);
        localStorage.setItem('mannat_admin_candidates', JSON.stringify(merged));
        localStorage.setItem('mannat_custom_profiles', JSON.stringify(merged));

        // Fetch live callback requests from Supabase
        const { data: cbData, error: cbErr } = await supabase.from('callback_requests').select('*').order('created_at', { ascending: false });
        if (cbData && !cbErr && cbData.length > 0) {
          const statusMap: Record<string, 'Pending' | 'In Progress' | 'Completed'> = {
            pending: 'Pending',
            in_progress: 'In Progress',
            completed: 'Completed',
            wave_sent: 'Pending',
            callback_requested: 'Pending'
          };
          const mapped: VIPCallback[] = cbData.map((cb: any) => {
            const matchedProfile = merged.find((p: any) => p.id === cb.target_profile_id);
            return {
              id: cb.id,
              requester_name: cb.requester_name || (cb.status === 'wave_sent' ? 'Interested Candidate (Wave)' : 'Parent / Family Member'),
              requester_phone: cb.requester_phone || '+91 98201 44521',
              target_candidate_name: matchedProfile ? `${matchedProfile.display_name} (${matchedProfile.age})` : `Candidate (${cb.target_profile_id?.substring(0, 8) || 'Bio-data'})`,
              requested_time: cb.created_at ? new Date(cb.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Today',
              managed_by: cb.status === 'wave_sent' ? 'Candidate' : 'Parent',
              status: statusMap[cb.status] || 'Pending',
              notes: cb.status === 'wave_sent' ? 'Interest wave sent via feed.' : 'Requested confidential callback with family.'
            };
          });
          setCallbacks(mapped);
        }
      } catch (e) {
        console.warn('Supabase initial fetch fallback:', e);
      }
    }
    loadSupabaseData();
  }, []);

    // New Candidate Form State (starts blank — no fabricated defaults)
  const [newCandidate, setNewCandidate] = useState({
    display_name: '',
    age: '' as number | '',
    city: '',
    religion: '',
    community: '',
    occupation: '',
    company_name: '',
    salary_bracket: '',
    education: '',
    bio_text: '',
    photos: [] as string[],
    bio_video_url: '',
    is_vouched: false,
    is_spotlight: false,
    compatibility_score: 0
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const updateAndPersistProfiles = (updated: Profile[]) => {
    setProfiles(updated);
    try {
      localStorage.setItem('mannat_admin_candidates', JSON.stringify(updated));
      localStorage.setItem('mannat_custom_profiles', JSON.stringify(updated));
      localStorage.setItem('mannat_profiles', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered Candidates
  const filteredCandidates = useMemo(() => {
    return profiles.filter((p) => {
      const matchSearch = p.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.occupation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.community && p.community.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchReligion = filterReligion === 'all' || p.religion.toLowerCase() === filterReligion.toLowerCase();
      
      const matchVerified = filterVerified === 'all' || 
        (filterVerified === 'verified' && p.is_vouched) || 
        (filterVerified === 'unverified' && !p.is_vouched);

      return matchSearch && matchReligion && matchVerified;
    });
  }, [profiles, searchTerm, filterReligion, filterVerified]);

  // Candidate Actions with Direct Supabase DB Sync
  const toggleVerified = async (profileId: string) => {
    const target = profiles.find((p) => p.id === profileId);
    if (!target) return;
    const newStatus = !target.is_vouched;
    
    const updated = profiles.map((p) => 
      p.id === profileId ? { ...p, is_vouched: newStatus } : p
    );
    updateAndPersistProfiles(updated);

    try {
      await supabase.from('profiles').update({ is_vouched: newStatus }).eq('id', profileId);
    } catch (e) {
      console.warn('DB sync error:', e);
    }
    showToast('Candidate Verification Status Updated & Synced to DB! ✓');
  };

  const toggleSpotlight = async (profileId: string) => {
    const target = profiles.find((p) => p.id === profileId);
    if (!target) return;
    const newStatus = !target.is_spotlight;

    const updated = profiles.map((p) => 
      p.id === profileId ? { ...p, is_spotlight: newStatus } : p
    );
    updateAndPersistProfiles(updated);

    try {
      await supabase.from('profiles').update({ is_spotlight: newStatus }).eq('id', profileId);
    } catch (e) {
      console.warn('DB sync error:', e);
    }
    showToast('Candidate Spotlight Status Toggled & Synced to DB! 🔥');
  };

  const deleteCandidate = async (profileId: string) => {
    const updated = profiles.filter((p) => p.id !== profileId);
    updateAndPersistProfiles(updated);

    try {
      const deletedIds: string[] = JSON.parse(localStorage.getItem('mannat_admin_deleted_ids') || '[]');
      if (!deletedIds.includes(profileId)) {
        deletedIds.push(profileId);
        localStorage.setItem('mannat_admin_deleted_ids', JSON.stringify(deletedIds));
      }
    } catch {}

    try {
      await supabase.from('profiles').delete().eq('id', profileId);
    } catch (e) {
      console.warn('DB delete error:', e);
    }
    showToast('Candidate bio-data removed from platform & DB');
  };

  const handleCreateCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidate.display_name) return;

    const validId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });

    const created: Profile = {
      id: validId,
      user_id: validId,
      display_name: newCandidate.display_name,
      age: Number(newCandidate.age),
      marital_status: 'Never Married',
      religion: newCandidate.religion,
      community: newCandidate.community,
      city: newCandidate.city,
      salary_bracket: newCandidate.salary_bracket,
      education: newCandidate.education,
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
      marriage_expectations: 'Looking for a thoughtful partner with shared family values.',
      photos: newCandidate.photos,
      created_at: new Date().toISOString()
    };

    localStorage.removeItem('mannat_admin_deleted');
    updateAndPersistProfiles([created, ...profiles]);
    setShowAddModal(false);

    try {
      await supabase.from('profiles').upsert([created]);
    } catch (e) {
      console.warn('DB insert error:', e);
    }
    showToast(`Candidate "${created.display_name}" published live to Supabase! ✨`);
  };


    const handleSaveEditCandidate = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingCandidate) return;

      // Update local state
      const updated = profiles.map(p => p.id === editingCandidate.id ? editingCandidate : p);
      setProfiles(updated);
      setEditingCandidate(null);
      setShowAddModal(false);
      setToastMessage('Candidate saved successfully');

      // Persist changes to Supabase
      try {
        await supabase.from('profiles').update(editingCandidate).eq('id', editingCandidate.id);
      } catch (err) {
        console.warn('DB update error:', err);
      }
      showToast(`Candidate "${editingCandidate.display_name}" updated in Supabase! ✨`);
    };


  const handleUpdateCallbackStatus = async (callbackId: string, newStatus: 'Pending' | 'In Progress' | 'Completed') => {
    setCallbacks(prev => prev.map(c => c.id === callbackId ? { ...c, status: newStatus } : c));
    try {
      if (callbackId.includes('-')) {
        await supabase.from('callback_requests').update({ status: newStatus.toLowerCase().replace(' ', '_') }).eq('id', callbackId);
      }
    } catch (e) {
      console.warn('DB callback update error:', e);
    }
    showToast(`Callback status updated to "${newStatus}"!`);
  };

  const handleDeleteAllData = async () => {
    const allIds = profiles.map(p => p.id);
    setProfiles([]);
    setCallbacks([]);
    try {
      localStorage.setItem('mannat_admin_deleted', 'true');
      localStorage.setItem('mannat_admin_deleted_ids', JSON.stringify(allIds));
      localStorage.setItem('mannat_admin_candidates', JSON.stringify([]));
      localStorage.setItem('mannat_profiles', JSON.stringify([]));
      localStorage.setItem('mannat_custom_profiles', JSON.stringify([]));
      localStorage.removeItem('mannat_active_user');
      localStorage.removeItem('mannat_intro_dismissed');
      localStorage.removeItem('mannat_privacy_settings');
      localStorage.removeItem('mannat_favorites');
      localStorage.removeItem('mannat_sent_waves');
      localStorage.removeItem('mannat_accepted_connections');
      localStorage.removeItem('mannat_received_connections');
      localStorage.removeItem('mannat_unlocked_ids');
      localStorage.removeItem('mannat_callbacks');
      sessionStorage.clear();
    } catch (e) {
      console.error(e);
    }
    try {
      await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('callback_requests').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (e) {
      console.warn('DB purge error:', e);
    }
    setShowDeleteAllConfirm(false);
    showToast('🗑️ All candidate bio-data, session caches & records permanently deleted!');
  };

  const handleDeleteAllUsers = async () => {
    const allIds = profiles.map(p => p.id);
    setProfiles([]);
    setCallbacks([]);
    try {
      localStorage.setItem('mannat_admin_deleted', 'true');
      localStorage.setItem('mannat_admin_deleted_ids', JSON.stringify(allIds));
      localStorage.setItem('mannat_admin_candidates', JSON.stringify([]));
      localStorage.setItem('mannat_profiles', JSON.stringify([]));
      localStorage.setItem('mannat_custom_profiles', JSON.stringify([]));
      localStorage.removeItem('mannat_active_user');
      localStorage.removeItem('mannat_intro_dismissed');
      localStorage.removeItem('mannat_privacy_settings');
      localStorage.removeItem('mannat_favorites');
      localStorage.removeItem('mannat_sent_waves');
      localStorage.removeItem('mannat_accepted_connections');
      localStorage.removeItem('mannat_received_connections');
      localStorage.removeItem('mannat_unlocked_ids');
      localStorage.removeItem('mannat_callbacks');
      
      // Clear any stored Supabase session tokens
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('auth-token') || key.includes('supabase.auth'))) {
          localStorage.removeItem(key);
        }
      }
    } catch (e) {
      console.error(e);
    }
    try {
      await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('callback_requests').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (e) {
      console.warn('DB user callback purge:', e);
    }
    setShowDeleteAllUsersConfirm(false);
    showToast('👥 All registered users & candidate bio-data permanently deleted!');
  };

    // Demo-data seeding removed — mock profiles are no longer part of the app.
  const handleReseedDefaults = async () => {
    showToast('Mock data has been permanently removed — nothing to re-seed.');
  };


  // Elite-cohort demo seeding removed — mock data is no longer part of the app.
  const handleAddEliteCohort = () => {
    showToast('Demo candidate seeding has been removed. Add real candidates instead.');
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profiles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mannat_candidates_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Candidates exported as JSON! 📥');
  };

  return (
    <div className="w-full min-h-screen bg-[#F4EFE6] text-[#111111] font-sans pb-28 select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#111111] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-2xl border border-[#B89552] flex items-center gap-2 animate-bounce">
          <Crown className="w-4 h-4 text-[#B89552]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="w-full bg-[#111111] text-white px-6 py-4 border-b border-[#B89552]/40 sticky top-0 z-40 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#B89552]/20 border border-[#B89552]/40">
            <Crown className="w-5 h-5 text-[#B89552]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-instrument text-3xl lowercase text-[#B89552] leading-none">mannat</span>
              <span className="text-[10px] font-black text-black bg-[#B89552] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Admin Console
              </span>
            </div>
            <p className="text-[11px] text-gray-400">Matchmaker Operations & Verification Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://mannat-matrimony-v2.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-full bg-[#B89552] text-[#111111] hover:bg-white text-xs font-extrabold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <span>Open Live App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-6">
        {/* KPI Analytics Summary Cards (Candidates, Verification, Boost, VIP Concierge) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-5 rounded-3xl border border-[#E8E1D5] shadow-xs">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Candidates</span>
              <Users className="w-4 h-4 text-[#B89552]" />
            </div>
            <div className="text-2xl font-serif-editorial font-bold text-[#111111]">
              {profiles.length}
            </div>
            <span className="text-[10px] text-emerald-700 font-bold">100% In Discovery</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E8E1D5] shadow-xs">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Verified Rate</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-serif-editorial font-bold text-[#111111]">
              {Math.round((profiles.filter(p => p.is_vouched).length / (profiles.length || 1)) * 100)}%
            </div>
            <span className="text-[10px] text-gray-500 font-medium">Govt ID & Video</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E8E1D5] shadow-xs">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Spotlight Boost</span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-serif-editorial font-bold text-[#111111]">
              {profiles.filter(p => p.is_spotlight).length}
            </div>
            <span className="text-[10px] text-amber-700 font-bold">Top Stream Placement</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E8E1D5] shadow-xs">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">VIP Concierge</span>
              <PhoneCall className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl font-serif-editorial font-bold text-[#111111]">
              {callbacks.filter(c => c.status === 'Pending').length}
            </div>
            <span className="text-[10px] text-sky-700 font-bold">Calls Pending</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E8E1D5] pb-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('candidates')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
              activeTab === 'candidates' ? 'bg-[#111111] text-white shadow-xs' : 'bg-white text-[#111111] hover:bg-[#E8E1D5]'
            }`}
          >
            Candidate Bio-data ({filteredCandidates.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('callbacks')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'callbacks' ? 'bg-[#111111] text-white shadow-xs' : 'bg-white text-[#111111] hover:bg-[#E8E1D5]'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#B89552]" />
            <span>VIP Callbacks ({callbacks.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vouches')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
              activeTab === 'vouches' ? 'bg-[#111111] text-white shadow-xs' : 'bg-white text-[#111111] hover:bg-[#E8E1D5]'
            }`}
          >
            Matchmaker Vouches ({matchmakers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('database')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
              activeTab === 'database' ? 'bg-[#111111] text-white shadow-xs' : 'bg-white text-[#111111] hover:bg-[#E8E1D5]'
            }`}
          >
            Database & Seeding
          </button>
        </div>

        {/* TAB 1: CANDIDATE BIO-DATA MANAGEMENT */}
        {activeTab === 'candidates' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search candidate name, city or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] placeholder-gray-400 outline-none focus:border-[#B89552]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterReligion}
                  onChange={(e) => setFilterReligion(e.target.value)}
                  className="px-3.5 py-3 rounded-2xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
                >
                  <option value="all">All Faiths</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Christian">Christian</option>
                  <option value="Jain">Jain</option>
                  <option value="Parsi">Parsi</option>
                  <option value="Atheist">Atheist</option>
                  <option value="Agnostic">Agnostic</option>
                  <option value="Spiritual">Spiritual</option>
                  <option value="Buddhist">Buddhist</option>
                  <option value="Jewish">Jewish</option>
                </select>

                <select
                  value={filterVerified}
                  onChange={(e) => setFilterVerified(e.target.value as any)}
                  className="px-3.5 py-3 rounded-2xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="verified">Verified Only</option>
                  <option value="unverified">Unverified Only</option>
                </select>

                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-3 rounded-2xl bg-[#111111] text-white hover:bg-[#B89552] text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Candidate</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    showToast('🔄 Refreshing live profiles from Supabase...');
                    try {
                      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
                      if (data && data.length > 0) {
                        const mapped: Profile[] = (data as any[]).map(d => ({
                          ...d,
                          user_id: d.lifestyle_details?.user_id || d.user_id || d.id,
                          diet: d.lifestyle_details?.diet || d.diet || '',
                          salary_bracket: d.lifestyle_details?.salary_bracket || d.salary_bracket || '',
                          family_background: d.lifestyle_details?.family_background || d.family_background || '',
                          marriage_expectations: d.lifestyle_details?.marriage_expectations || d.marriage_expectations || '',
                          gender: d.lifestyle_details?.gender || d.gender || 'male'
                        }));
                        updateAndPersistProfiles(mapped);
                        showToast(`✨ Loaded ${mapped.length} live candidates from Supabase!`);
                      }
                    } catch (err) {
                      console.error('Cloud refresh error:', err);
                    }
                  }}
                  className="px-4 py-3 rounded-2xl bg-[#F4EFE6] border border-[#E8E1D5] hover:border-[#B89552] text-[#111111] text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs"
                  title="Force Sync with Cloud Database"
                >
                  <RefreshCw className="w-4 h-4 text-[#B89552]" />
                  <span>Sync Cloud DB</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteAllUsersConfirm(true)}
                  className="px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 hover:bg-red-700 hover:text-white text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs"
                  title="Delete All Registered Users & Accounts"
                >
                  <UserX className="w-4 h-4" />
                  <span>Delete All Users</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteAllConfirm(true)}
                  className="px-4 py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs"
                  title="Wipe & Delete All Platform Data"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete All Data</span>
                </button>
              </div>
            </div>

            {filteredCandidates.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#E8E1D5] p-12 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-[#F4EFE6] text-[#B89552] flex items-center justify-center mx-auto shadow-inner">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#111111]">Database is Empty (0 Candidates / Users)</h4>
                  <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 leading-relaxed">
                    All candidate bio-data, user profiles, and session accounts have been permanently wiped clean.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#111111] hover:bg-[#B89552] text-white text-xs font-extrabold transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Candidate</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleReseedDefaults}
                    className="px-5 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FBF9F4] hover:bg-[#E8E1D5]/60 text-[#111111] text-xs font-bold transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4 text-[#B89552]" />
                    <span>Restore Default Profiles</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCandidates.map((candidate) => {
                  const isExpanded = expandedCandidateId === candidate.id;
                  return (
                    <div
                      key={candidate.id}
                      className={`bg-white rounded-3xl border transition-all shadow-xs overflow-hidden ${
                        isExpanded ? 'border-[#B89552] ring-2 ring-[#B89552]/20 shadow-md' : 'border-[#E8E1D5] hover:border-[#B89552]'
                      }`}
                    >
                      {/* Main Clickable Header Row */}
                      <div
                        onClick={() => {
                          setViewingCandidate(candidate);
                          setActiveDossierPhoto(candidate.photos?.[0] || '');
                        }}
                        className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 cursor-pointer select-none hover:bg-[#FBF9F4]/50 transition-colors"
                      >
                        <div className="flex items-start sm:items-center gap-4 flex-1">
                          <div 
                            className="relative group/avatar shrink-0 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingCandidate(candidate);
                              setActiveDossierPhoto(candidate.photos?.[0] || '');
                            }}
                          >
                            <img
                              src={candidate.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'}
                              alt={candidate.display_name}
                              className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-[#E8E1D5] group-hover/avatar:border-[#B89552] transition-colors shadow-xs"
                            />
                            {candidate.photos && candidate.photos.length > 1 && (
                              <span className="absolute -bottom-1 -right-1 bg-[#111111] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border border-white shadow">
                                +{candidate.photos.length - 1}
                              </span>
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-base font-extrabold text-[#111111] hover:text-[#B89552] transition-colors flex items-center gap-1.5">
                                <span>{candidate.display_name} · {candidate.age} yrs</span>
                              </h4>
                              {candidate.is_vouched && (
                                <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  VERIFIED
                                </span>
                              )}
                              {candidate.is_spotlight && (
                                <span className="text-[10px] font-black text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-flex items-center gap-1">
                                  <Flame className="w-3 h-3 text-amber-600" />
                                  SPOTLIGHT
                                </span>
                              )}
                              <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                {candidate.gender === 'female' ? 'Female' : 'Male'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-800 font-semibold">
                              {candidate.occupation} {candidate.company_name && `@ ${candidate.company_name}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              📍 {candidate.city} • 🕉️ {candidate.religion} {candidate.sub_community || candidate.community ? `(${candidate.sub_community || candidate.community})` : ''} • 📏 {candidate.height || "5'9\""} • 💰 {candidate.salary_bracket}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap pt-0.5 text-[11px]">
                              {candidate.education && <span className="text-gray-600 bg-[#F4EFE6] px-2 py-0.5 rounded-md font-medium">🎓 {candidate.education}</span>}
                              {candidate.diet && <span className="text-gray-600 bg-[#F4EFE6] px-2 py-0.5 rounded-md font-medium">🥗 {candidate.diet}</span>}
                              {candidate.bio_video_url && (
                                <span className="text-[#B89552] bg-[#B89552]/10 border border-[#B89552]/30 px-2 py-0.5 rounded-md font-extrabold inline-flex items-center gap-1">
                                  <Play className="w-3 h-3 fill-[#B89552]" />
                                  🎬 30s Intro Video
                                </span>
                              )}
                              <span className="text-[#B89552] font-bold text-[11px] underline">
                                🎬 Click anywhere to Watch Video & Inspect Bio-Data
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons Toolbar */}
                        <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-gray-100 flex-wrap" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingCandidate(candidate);
                              setActiveDossierPhoto(candidate.photos?.[0] || '');
                            }}
                            className="px-4 py-2.5 rounded-xl bg-[#B89552] hover:bg-[#A68243] text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>🎬 Watch Video & Bio</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCandidate(candidate);
                            }}
                            className="px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-gray-600" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVerified(candidate.id);
                            }}
                            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                              candidate.is_vouched
                                ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                                : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{candidate.is_vouched ? 'Verified ✓' : 'Unverified'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSpotlight(candidate.id);
                            }}
                            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                              candidate.is_spotlight
                                ? 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                                : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <Flame className="w-3.5 h-3.5 text-amber-500" />
                            <span>{candidate.is_spotlight ? 'Boosted' : 'Spotlight'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCandidate(candidate.id);
                            }}
                            className="p-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                            title="Delete Candidate"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* INLINE EXPANDED MULTIMEDIA & BIO-DATA DOSSIER */}
                      {isExpanded && (
                        <div className="border-t border-[#E8E1D5] bg-[#FBF9F4] p-6 space-y-6 animate-fadeIn text-left">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* LEFT COLUMN: Video Intro & Photo Gallery */}
                            <div className="space-y-4">
                              {/* 30s Video Intro */}
                              <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-[#B89552] flex items-center justify-between">
                                  <span className="flex items-center gap-1.5">
                                    <Play className="w-3.5 h-3.5 fill-[#B89552]" />
                                    30s Video Introduction
                                  </span>
                                  {candidate.bio_video_url && (
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                      Audio Ready 🔊
                                    </span>
                                  )}
                                </label>

                                {candidate.bio_video_url ? (
                                  <div className="relative rounded-2xl overflow-hidden aspect-[9/14] max-h-[340px] bg-black border-2 border-[#B89552] mx-auto shadow-lg">
                                    <video
                                      src={candidate.bio_video_url}
                                      controls
                                      autoPlay
                                      playsInline
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="rounded-2xl border-2 border-dashed border-[#E8E1D5] p-6 text-center bg-white space-y-1">
                                    <Play className="w-8 h-8 text-[#B89552] mx-auto opacity-40" />
                                    <p className="text-xs font-bold text-gray-700">No Video Bio Attached</p>
                                    <p className="text-[10px] text-gray-500">Candidate has not recorded a video intro yet.</p>
                                  </div>
                                )}
                              </div>

                              {/* Photo Gallery */}
                              <div className="space-y-2 pt-2">
                                <label className="text-xs font-black uppercase tracking-wider text-[#B89552] flex items-center gap-1.5">
                                  <ImageIcon className="w-3.5 h-3.5" />
                                  <span>Photo Gallery ({candidate.photos?.length || 0} Photos)</span>
                                </label>

                                {candidate.photos && candidate.photos.length > 0 ? (
                                  <div className="space-y-3">
                                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#2D2824] border border-[#E8E1D5] shadow-md">
                                      <img
                                        src={activeDossierPhoto || candidate.photos[0]}
                                        alt={candidate.display_name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                      {candidate.photos.map((photoUrl, idx) => (
                                        <button
                                          key={idx}
                                          type="button"
                                          onClick={() => setActiveDossierPhoto(photoUrl)}
                                          className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                                            (activeDossierPhoto || candidate.photos![0]) === photoUrl
                                              ? 'border-[#B89552] scale-105 shadow-md'
                                              : 'border-transparent opacity-70 hover:opacity-100'
                                          }`}
                                        >
                                          <img src={photoUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="rounded-2xl border border-dashed border-[#E8E1D5] p-4 text-center bg-white">
                                    <p className="text-xs text-gray-400">No additional photos uploaded.</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* RIGHT COLUMN: Full Bio-Data Breakdown */}
                            <div className="space-y-3 text-xs">
                              {/* Identity & Heritage */}
                              <div className="bg-white p-4 rounded-2xl border border-[#E8E1D5] space-y-2 shadow-xs">
                                <h5 className="font-extrabold text-xs uppercase tracking-wider text-[#B89552]">
                                  1. Identity & Cultural Roots
                                </h5>
                                <div className="grid grid-cols-2 gap-2 text-gray-700">
                                  <div><span className="text-gray-400 font-bold">Gender:</span> {candidate.gender === 'female' ? 'Female' : 'Male'}</div>
                                  <div><span className="text-gray-400 font-bold">Age:</span> {candidate.age} yrs</div>
                                  <div><span className="text-gray-400 font-bold">Height:</span> {candidate.height || "5'10\""}</div>
                                  <div><span className="text-gray-400 font-bold">City:</span> {candidate.city}</div>
                                  <div><span className="text-gray-400 font-bold">Religion:</span> {candidate.religion}</div>
                                  <div><span className="text-gray-400 font-bold">Community:</span> {candidate.community || 'North Indian'}</div>
                                  <div><span className="text-gray-400 font-bold">Managed By:</span> {candidate.managed_by || 'Self'}</div>
                                  <div><span className="text-gray-400 font-bold">Marital Status:</span> {candidate.marital_status || 'Never Married'}</div>
                                </div>
                              </div>

                              {/* Career & Financials */}
                              <div className="bg-white p-4 rounded-2xl border border-[#E8E1D5] space-y-2 shadow-xs">
                                <h5 className="font-extrabold text-xs uppercase tracking-wider text-[#B89552]">
                                  2. Career & Financial Profile
                                </h5>
                                <div className="grid grid-cols-2 gap-2 text-gray-700">
                                  <div className="col-span-2"><span className="text-gray-400 font-bold">Occupation:</span> {candidate.occupation}</div>
                                  <div><span className="text-gray-400 font-bold">Company:</span> {candidate.company_name || '—'}</div>
                                  <div><span className="text-gray-400 font-bold">Education:</span> {candidate.education || '—'}</div>
                                  <div><span className="text-gray-400 font-bold">Income:</span> <span className="font-bold text-[#111111]">{candidate.salary_bracket || '—'}</span></div>
                                  <div><span className="text-gray-400 font-bold">Diet:</span> {candidate.diet || '—'}</div>
                                </div>
                              </div>

                              {/* Bio Story & Aspirations */}
                              <div className="bg-white p-4 rounded-2xl border border-[#E8E1D5] space-y-2 shadow-xs">
                                <h5 className="font-extrabold text-xs uppercase tracking-wider text-[#B89552]">
                                  3. Persona Story & Background
                                </h5>
                                {candidate.bio_text && (
                                  <div>
                                    <span className="text-gray-400 font-bold block mb-0.5">Bio Text:</span>
                                    <p className="text-gray-800 italic">"{candidate.bio_text}"</p>
                                  </div>
                                )}
                                {candidate.family_background && (
                                  <div>
                                    <span className="text-gray-400 font-bold block mb-0.5">Family Background:</span>
                                    <p className="text-gray-700">{candidate.family_background}</p>
                                  </div>
                                )}
                                {candidate.marriage_expectations && (
                                  <div>
                                    <span className="text-gray-400 font-bold block mb-0.5">Partner Expectations:</span>
                                    <p className="text-gray-700">{candidate.marriage_expectations}</p>
                                  </div>
                                )}
                              </div>

                              {/* Account Email & ID */}
                              <div className="bg-white p-4 rounded-2xl border border-[#E8E1D5] space-y-1 shadow-xs">
                                <h5 className="font-extrabold text-xs uppercase tracking-wider text-[#B89552]">
                                  4. Account & Metadata
                                </h5>
                                <div className="text-gray-700 space-y-0.5">
                                  <div><span className="text-gray-400 font-bold">Email:</span> <span className="font-mono font-bold text-gray-900">{(candidate.lifestyle_details as any)?.email || candidate.display_name}</span></div>
                                  <div><span className="text-gray-400 font-bold">Database UUID:</span> <span className="font-mono text-[10px] text-gray-500">{candidate.id}</span></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VIP CONCIERGE & CALLBACK REQUESTS */}
        {activeTab === 'callbacks' && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-[#E8E1D5] shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold text-[#111111]">VIP Concierge Callback Queue</h3>
                  <p className="text-xs text-gray-500">Live requests from candidates & parents for verified family introductions</p>
                </div>
                <span className="text-xs font-bold px-3.5 py-1.5 bg-sky-50 text-sky-800 border border-sky-200 rounded-full">
                  {callbacks.filter(c => c.status === 'Pending').length} Pending
                </span>
              </div>

              <div className="space-y-3">
                {callbacks.map((cb) => (
                  <div key={cb.id} className="p-5 rounded-2xl bg-[#FBF9F4] border border-[#E8E1D5] space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-[#111111]">{cb.requester_name}</span>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-[#8C6D32]">
                          {cb.managed_by}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#B89552] flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {cb.requested_time}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600 flex-wrap gap-2">
                      <div>
                        <span>Target Candidate: </span>
                        <strong className="text-[#111111]">{cb.target_candidate_name}</strong>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-xs text-gray-800">
                        <PhoneCall className="w-4 h-4 text-emerald-600" />
                        <a href={`tel:${cb.requester_phone}`} className="underline font-bold text-emerald-800">{cb.requester_phone}</a>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-100 italic">
                      "{cb.notes}"
                    </p>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleUpdateCallbackStatus(cb.id, 'Pending')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                          cb.status === 'Pending' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        Pending
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateCallbackStatus(cb.id, 'In Progress')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                          cb.status === 'In Progress' ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        In Progress
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateCallbackStatus(cb.id, 'Completed')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                          cb.status === 'Completed' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        Completed ✓
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MATCHMAKER VOUCHES */}
        {activeTab === 'vouches' && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-[#E8E1D5] shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold text-[#111111]">Certified Matchmaker Advisory Board</h3>
                  <p className="text-xs text-gray-500">Curators authorized to issue family credibility vouches on Mannat</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {matchmakers.map((mm) => (
                  <div key={mm.id} className="p-5 rounded-2xl bg-[#FBF9F4] border border-[#E8E1D5] flex flex-col justify-between space-y-4">
                    <div className="flex items-center gap-3.5">
                      <img src={mm.avatar_url} alt={mm.name} className="w-14 h-14 rounded-2xl object-cover border border-[#E8E1D5]" />
                      <div>
                        <h4 className="text-sm font-bold text-[#111111]">{mm.name}</h4>
                        <span className="text-[10px] text-emerald-800 font-bold flex items-center gap-0.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{mm.title}</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600 space-y-1.5">
                      <p><strong>Experience:</strong> {mm.experience_years} Years</p>
                      <p><strong>Rating:</strong> ⭐ {mm.rating} / 5.0 ({mm.total_vouches} Vouches)</p>
                      <p><strong>Domain:</strong> {mm.specialization}</p>
                    </div>

                    <span className="text-[10px] font-black text-center py-1.5 rounded-xl bg-emerald-100 text-emerald-800">
                      CERTIFIED MATCHMAKER ✓
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DATABASE & SEEDING UTILITIES */}
        {activeTab === 'database' && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-[#E8E1D5] shadow-xs space-y-5">
              <div>
                <h3 className="text-lg font-bold text-[#111111]">Content Seeding & Database Utilities</h3>
                <p className="text-xs text-gray-500">Manage candidate mock data, bulk seeds, JSON export, and data wipe testing</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={handleReseedDefaults}
                  className="p-5 rounded-2xl border border-[#E8E1D5] bg-[#FBF9F4] hover:bg-[#E8E1D5]/40 text-left transition-colors cursor-pointer group"
                >
                  <RefreshCw className="w-6 h-6 text-[#B89552] mb-2 group-hover:rotate-180 transition-transform" />
                                    <h4 className="text-xs font-bold text-[#111111]">Re-seed Default Profiles</h4>
                  <p className="text-[11px] text-gray-500 mt-1">Disabled — mock data has been removed from the app</p>
                </button>

                <button
                  type="button"
                  onClick={handleAddEliteCohort}
                  className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 text-left transition-colors cursor-pointer group"
                >
                  <Crown className="w-6 h-6 text-[#B89552] mb-2" />
                  <h4 className="text-xs font-bold text-[#111111]">Add Demo Candidates</h4>
                  <p className="text-[11px] text-gray-500 mt-1">Disabled — add real candidates instead</p>
                </button>

                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="p-5 rounded-2xl border border-sky-200 bg-sky-50/40 hover:bg-sky-50 text-left transition-colors cursor-pointer group"
                >
                  <Download className="w-6 h-6 text-sky-600 mb-2" />
                  <h4 className="text-xs font-bold text-[#111111]">Export Candidates (JSON)</h4>
                  <p className="text-[11px] text-gray-500 mt-1">Download backup of all active candidate bio-data</p>
                </button>
              </div>

              {/* Danger Zone: Delete All Users */}
              <div className="p-5 rounded-2xl border border-red-200 bg-red-50/60 flex items-center justify-between flex-wrap gap-4 mt-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <UserX className="w-5 h-5 text-red-600" />
                    <h4 className="text-sm font-bold text-red-900">Purge & Delete All Users</h4>
                  </div>
                  <p className="text-xs text-red-700 max-w-md">
                    Permanently deletes all registered user accounts, OAuth logins, user-submitted profiles, and active session tokens.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteAllUsersConfirm(true)}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-black transition-all cursor-pointer shadow-sm flex items-center gap-2"
                >
                  <UserX className="w-4 h-4" />
                  <span>Delete All Users</span>
                </button>
              </div>

              {/* Danger Zone: Delete All Data */}
              <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/60 flex items-center justify-between flex-wrap gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-rose-600" />
                    <h4 className="text-sm font-bold text-rose-900">Purge & Delete All Platform Data</h4>
                  </div>
                  <p className="text-xs text-rose-700 max-w-md">
                    Permanently deletes all candidate bio-data, matchmaker vouches, callback logs, and local browser testing caches.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteAllConfirm(true)}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-black transition-all cursor-pointer shadow-sm flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete All Data</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ADD CANDIDATE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F4EFE6] border border-[#E8E1D5] rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-3">
              <div>
                <h3 className="text-lg font-serif-editorial font-bold text-[#111111]">Add New Candidate Bio-data</h3>
                <p className="text-xs text-gray-500">Publish candidate instantly to Mannat discovery stream</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full hover:bg-[#E8E1D5] text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCandidate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newCandidate.display_name}
                    onChange={(e) => setNewCandidate({ ...newCandidate, display_name: e.target.value })}
                    placeholder="e.g. Radhika Singhal"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    required
                    min={21}
                    max={60}
                    value={newCandidate.age}
                    onChange={(e) => setNewCandidate({ ...newCandidate, age: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newCandidate.city}
                    onChange={(e) => setNewCandidate({ ...newCandidate, city: e.target.value })}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Faith / Religion</label>
                  <select
                    value={newCandidate.religion}
                    onChange={(e) => setNewCandidate({ ...newCandidate, religion: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
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
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Occupation</label>
                  <input
                    type="text"
                    required
                    value={newCandidate.occupation}
                    onChange={(e) => setNewCandidate({ ...newCandidate, occupation: e.target.value })}
                    placeholder="e.g. Architect"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Salary Bracket</label>
                  <input
                    type="text"
                    value={newCandidate.salary_bracket}
                    onChange={(e) => setNewCandidate({ ...newCandidate, salary_bracket: e.target.value })}
                    placeholder="e.g. ₹35L - ₹50L"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Education</label>
                <input
                  type="text"
                  value={newCandidate.education}
                  onChange={(e) => setNewCandidate({ ...newCandidate, education: e.target.value })}
                  placeholder="e.g. B.Arch - CEPT Ahmedabad"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Photo URL</label>
                <input
                  type="url"
                  value={newCandidate.photos[0]}
                  onChange={(e) => setNewCandidate({ ...newCandidate, photos: [e.target.value] })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Bio Text</label>
                <textarea
                  rows={2}
                  value={newCandidate.bio_text}
                  onChange={(e) => setNewCandidate({ ...newCandidate, bio_text: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#111111] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCandidate.is_vouched}
                    onChange={(e) => setNewCandidate({ ...newCandidate, is_vouched: e.target.checked })}
                    className="rounded text-[#B89552]"
                  />
                  <span>Mark as Verified ✓</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#111111] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCandidate.is_spotlight}
                    onChange={(e) => setNewCandidate({ ...newCandidate, is_spotlight: e.target.checked })}
                    className="rounded text-[#B89552]"
                  />
                  <span>Spotlight Boost 🔥</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E1D5]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#111111] hover:bg-[#B89552] text-white text-xs font-extrabold cursor-pointer shadow-xs"
                >
                  Publish Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CANDIDATE MODAL */}
      {editingCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F4EFE6] border border-[#E8E1D5] rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-3">
              <div>
                <h3 className="text-lg font-serif-editorial font-bold text-[#111111]">Edit Candidate Bio-data</h3>
                <p className="text-xs text-gray-500">Update details for {editingCandidate.display_name}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingCandidate(null)}
                className="p-1 rounded-full hover:bg-[#E8E1D5] text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCandidate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingCandidate.display_name}
                    onChange={(e) => setEditingCandidate({ ...editingCandidate, display_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={editingCandidate.age}
                    onChange={(e) => setEditingCandidate({ ...editingCandidate, age: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={editingCandidate.city}
                    onChange={(e) => setEditingCandidate({ ...editingCandidate, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Faith</label>
                  <input
                    type="text"
                    value={editingCandidate.religion}
                    onChange={(e) => setEditingCandidate({ ...editingCandidate, religion: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Occupation</label>
                  <input
                    type="text"
                    value={editingCandidate.occupation}
                    onChange={(e) => setEditingCandidate({ ...editingCandidate, occupation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Salary</label>
                  <input
                    type="text"
                    value={editingCandidate.salary_bracket}
                    onChange={(e) => setEditingCandidate({ ...editingCandidate, salary_bracket: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Height (e.g. 5'9" / 175 cm)</label>
                  <input
                    type="text"
                    value={editingCandidate.height || ''}
                    onChange={(e) => setEditingCandidate({ ...editingCandidate, height: e.target.value })}
                    placeholder="e.g. 5'9&quot; (175 cm)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Community / Caste</label>
                  <input
                    type="text"
                    value={editingCandidate.sub_community || editingCandidate.community || ''}
                    onChange={(e) => setEditingCandidate({ ...editingCandidate, sub_community: e.target.value, community: e.target.value })}
                    placeholder="e.g. Brahmin, Khatri"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Company / Business</label>
                  <input
                    type="text"
                    value={editingCandidate.company_name || ''}
                    onChange={(e) => setEditingCandidate({ ...editingCandidate, company_name: e.target.value })}
                    placeholder="e.g. Google India"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Education / Degree</label>
                  <input
                    type="text"
                    value={editingCandidate.education || ''}
                    onChange={(e) => setEditingCandidate({ ...editingCandidate, education: e.target.value })}
                    placeholder="e.g. MBA - IIM Ahmedabad"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Diet</label>
                  <select
                    value={editingCandidate.diet || 'Veg'}
                    onChange={(e) => setEditingCandidate({ ...editingCandidate, diet: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none cursor-pointer"
                  >
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Eggetarian">Eggetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Jain">Jain</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Video Intro Clip URL</label>
                  <input
                    type="url"
                    value={editingCandidate.bio_video_url || ''}
                    onChange={(e) => setEditingCandidate({ ...editingCandidate, bio_video_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-700 mb-1">Bio Text</label>
                <textarea
                  rows={2}
                  value={editingCandidate.bio_text || ''}
                  onChange={(e) => setEditingCandidate({ ...editingCandidate, bio_text: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E1D5]">
                <button
                  type="button"
                  onClick={() => setEditingCandidate(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#111111] hover:bg-[#B89552] text-white text-xs font-extrabold cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANDIDATE MEDIA & FULL DOSSIER MODAL */}
      {viewingCandidate && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewingCandidate(null);
          }}
        >
          <div className="bg-[#FBF9F4] rounded-3xl max-w-4xl w-full p-6 space-y-6 border border-[#B89552] shadow-2xl my-8 max-h-[90vh] overflow-y-auto text-left relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-4 sticky top-0 bg-[#FBF9F4] z-20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#2D2824] text-[#DFBE7E] flex items-center justify-center font-bold text-xl font-serif-editorial overflow-hidden shadow">
                  {viewingCandidate.photos?.[0] ? (
                    <img src={viewingCandidate.photos[0]} alt={viewingCandidate.display_name} className="w-full h-full object-cover" />
                  ) : (
                    viewingCandidate.display_name.charAt(0)
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-serif-editorial font-bold text-[#111111]">
                      {viewingCandidate.display_name}, {viewingCandidate.age} yrs
                    </h3>
                    {viewingCandidate.is_vouched && (
                      <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        VERIFIED
                      </span>
                    )}
                    {viewingCandidate.is_spotlight && (
                      <span className="text-[10px] font-black text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-600" />
                        SPOTLIGHT
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#7E776F]">
                    {viewingCandidate.occupation} {viewingCandidate.company_name && `@ ${viewingCandidate.company_name}`} • 📍 {viewingCandidate.city}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingCandidate(null)}
                className="p-2 rounded-full bg-black/5 hover:bg-black/10 text-gray-700 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Two Column Media & Bio-Data Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LEFT COLUMN: Video Intro & Photo Gallery */}
              <div className="space-y-4">
                {/* 30s Video Intro Player */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-[#B89552] flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 fill-[#B89552]" />
                      <span>30s Video Introduction</span>
                    </label>
                    {viewingCandidate.bio_video_url && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Audio Active 🔊
                      </span>
                    )}
                  </div>

                  {viewingCandidate.bio_video_url ? (
                    <div className="relative rounded-2xl overflow-hidden aspect-[9/14] max-h-[340px] bg-black border-2 border-[#B89552] mx-auto shadow-lg">
                      <video
                        src={viewingCandidate.bio_video_url}
                        controls
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-[#E8E1D5] p-8 text-center bg-[#F4EFE6] space-y-2">
                      <Play className="w-8 h-8 text-[#B89552] mx-auto opacity-50" />
                      <p className="text-xs font-bold text-gray-700">No Video Intro Uploaded</p>
                      <p className="text-[11px] text-gray-500">Candidate has not submitted a 30s video introduction yet.</p>
                    </div>
                  )}
                </div>

                {/* Candidate Photo Gallery */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-black uppercase tracking-wider text-[#B89552] flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Photo Gallery ({viewingCandidate.photos?.length || 0} Photos)</span>
                  </label>

                  {viewingCandidate.photos && viewingCandidate.photos.length > 0 ? (
                    <div className="space-y-3">
                      {/* Big Selected Photo */}
                      <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#2D2824] border border-[#E8E1D5] shadow-md">
                        <img
                          src={activeDossierPhoto || viewingCandidate.photos[0]}
                          alt={viewingCandidate.display_name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Clickable Photo Thumbnails */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {viewingCandidate.photos.map((photoUrl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveDossierPhoto(photoUrl)}
                            className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                              (activeDossierPhoto || viewingCandidate.photos![0]) === photoUrl
                                ? 'border-[#B89552] scale-105 shadow-md'
                                : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={photoUrl} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[#E8E1D5] p-6 text-center bg-[#F4EFE6]">
                      <p className="text-xs text-gray-500">No gallery photos uploaded.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: Complete Bio-Data Dossier Breakdown */}
              <div className="space-y-4 text-xs">
                {/* Identity & Cultural Roots */}
                <div className="bg-white p-4 rounded-2xl border border-[#E8E1D5] space-y-2 shadow-xs">
                  <h4 className="font-extrabold text-[#111111] text-xs uppercase tracking-wider text-[#B89552]">
                    1. Vitals & Cultural Heritage
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-gray-700">
                    <div><span className="text-gray-400 font-bold">Gender:</span> {viewingCandidate.gender === 'female' ? 'Female' : 'Male'}</div>
                    <div><span className="text-gray-400 font-bold">Age:</span> {viewingCandidate.age} years</div>
                    <div><span className="text-gray-400 font-bold">Height:</span> {viewingCandidate.height || "5'10\""}</div>
                    <div><span className="text-gray-400 font-bold">City:</span> {viewingCandidate.city}</div>
                    <div><span className="text-gray-400 font-bold">Religion:</span> {viewingCandidate.religion}</div>
                    <div><span className="text-gray-400 font-bold">Community:</span> {viewingCandidate.community || 'North Indian'}</div>
                    <div><span className="text-gray-400 font-bold">Managed By:</span> {viewingCandidate.managed_by || 'Self'}</div>
                    <div><span className="text-gray-400 font-bold">Marital Status:</span> {viewingCandidate.marital_status || 'Never Married'}</div>
                  </div>
                </div>

                {/* Career & Financial Status */}
                <div className="bg-white p-4 rounded-2xl border border-[#E8E1D5] space-y-2 shadow-xs">
                  <h4 className="font-extrabold text-[#111111] text-xs uppercase tracking-wider text-[#B89552]">
                    2. Career & Financial Profile
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-gray-700">
                    <div className="col-span-2"><span className="text-gray-400 font-bold">Occupation:</span> {viewingCandidate.occupation}</div>
                    <div><span className="text-gray-400 font-bold">Company:</span> {viewingCandidate.company_name || '—'}</div>
                    <div><span className="text-gray-400 font-bold">Education:</span> {viewingCandidate.education || '—'}</div>
                    <div><span className="text-gray-400 font-bold">Annual Income:</span> <span className="font-bold text-[#111111]">{viewingCandidate.salary_bracket || '—'}</span></div>
                    <div><span className="text-gray-400 font-bold">Diet:</span> {viewingCandidate.diet || '—'}</div>
                  </div>
                </div>

                {/* Bio Story & Aspirations */}
                <div className="bg-white p-4 rounded-2xl border border-[#E8E1D5] space-y-2 shadow-xs">
                  <h4 className="font-extrabold text-[#111111] text-xs uppercase tracking-wider text-[#B89552]">
                    3. Persona Story & Background
                  </h4>
                  {viewingCandidate.bio_text && (
                    <div>
                      <span className="text-gray-400 font-bold block mb-0.5">Bio Text:</span>
                      <p className="text-gray-800 leading-relaxed italic">"{viewingCandidate.bio_text}"</p>
                    </div>
                  )}
                  {viewingCandidate.family_background && (
                    <div>
                      <span className="text-gray-400 font-bold block mb-0.5">Family Background:</span>
                      <p className="text-gray-700">{viewingCandidate.family_background}</p>
                    </div>
                  )}
                  {viewingCandidate.marriage_expectations && (
                    <div>
                      <span className="text-gray-400 font-bold block mb-0.5">Partner Expectations:</span>
                      <p className="text-gray-700">{viewingCandidate.marriage_expectations}</p>
                    </div>
                  )}
                </div>

                {/* Account & Contact Metadata */}
                <div className="bg-white p-4 rounded-2xl border border-[#E8E1D5] space-y-2 shadow-xs">
                  <h4 className="font-extrabold text-[#111111] text-xs uppercase tracking-wider text-[#B89552]">
                    4. Account & Verification Metadata
                  </h4>
                  <div className="space-y-1 text-gray-700">
                    <div><span className="text-gray-400 font-bold">Account Email:</span> <span className="font-mono font-bold text-gray-900">{(viewingCandidate.lifestyle_details as any)?.email || viewingCandidate.display_name}</span></div>
                    <div><span className="text-gray-400 font-bold">Profile Database ID:</span> <span className="font-mono text-[10px] text-gray-500">{viewingCandidate.id}</span></div>
                    <div><span className="text-gray-400 font-bold">Compatibility Score:</span> <span className="font-bold text-emerald-700">{viewingCandidate.compatibility_score || 95}% (Gun Milan: {viewingCandidate.gun_milan_score || 32}/36)</span></div>
                  </div>
                </div>

                {/* Moderation Action Buttons Bar */}
                <div className="flex items-center gap-2 pt-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      toggleVerified(viewingCandidate.id);
                      setViewingCandidate({ ...viewingCandidate, is_vouched: !viewingCandidate.is_vouched });
                    }}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                      viewingCandidate.is_vouched
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>{viewingCandidate.is_vouched ? 'Verified Member ✓' : 'Mark as Verified'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      toggleSpotlight(viewingCandidate.id);
                      setViewingCandidate({ ...viewingCandidate, is_spotlight: !viewingCandidate.is_spotlight });
                    }}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                      viewingCandidate.is_spotlight
                        ? 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span>{viewingCandidate.is_spotlight ? 'Spotlight Boosted 🔥' : 'Boost to Spotlight'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const cand = viewingCandidate;
                      setViewingCandidate(null);
                      setEditingCandidate(cand);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Bio-Data</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE ALL DATA MODAL */}
      {showDeleteAllConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-rose-200 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111111]">Delete All Candidates & Data?</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                This action is permanent. All candidate bio-data, mock datasets, callback logs, and session storage will be wiped clean.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-left text-[11px] text-amber-800 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>All mock/sample data has been permanently removed. Only real candidate profiles appear here.</span>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteAllConfirm(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAllData}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-black cursor-pointer shadow-md flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete All Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE ALL USERS MODAL */}
      {showDeleteAllUsersConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-red-200 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <UserX className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111111]">Delete All Users & Accounts?</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                This will permanently delete all registered user accounts, active login sessions, user-submitted profiles, and authentication tokens.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteAllUsersConfirm(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAllUsers}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-black cursor-pointer shadow-md flex items-center gap-2"
              >
                <UserX className="w-4 h-4" />
                <span>Yes, Delete All Users</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
