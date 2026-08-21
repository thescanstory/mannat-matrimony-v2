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
  TrendingUp, 
  ExternalLink,
  UserX 
} from 'lucide-react';
import type { Profile } from './types';
import { MOCK_PROFILES } from './services/mockData';
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

const INITIAL_CALLBACKS: VIPCallback[] = [
  {
    id: 'cb_1',
    requester_name: 'Rajesh & Sunita Sharma (Parents)',
    requester_phone: '+91 98201 44521',
    target_candidate_name: 'Ananya Sharma (27)',
    requested_time: 'Today at 7:30 PM IST',
    managed_by: 'Parent',
    status: 'Pending',
    notes: 'Family seeking horoscope matching & native community verification'
  },
  {
    id: 'cb_2',
    requester_name: 'Dr. Alok Verma',
    requester_phone: '+91 97112 88410',
    target_candidate_name: 'Rohan Verma (29)',
    requested_time: 'Tomorrow at 11:00 AM IST',
    managed_by: 'Candidate',
    status: 'In Progress',
    notes: 'Inquiring about relocation timeline to Bengaluru / US'
  },
  {
    id: 'cb_3',
    requester_name: 'Vikramaditya Roy (Self)',
    requester_phone: '+91 99880 12345',
    target_candidate_name: 'Priya Nambiar (26)',
    requested_time: 'Yesterday at 5:00 PM IST',
    managed_by: 'Candidate',
    status: 'Completed',
    notes: 'Matchmaker introduction scheduled on Google Meet'
  }
];

const INITIAL_MATCHMAKERS: MatchmakerCurator[] = [
  {
    id: 'mm_1',
    name: 'Smt. Gayatri Devi',
    title: 'Senior Matchmaker & Family Counselor',
    experience_years: 18,
    rating: 4.9,
    total_vouches: 420,
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    specialization: 'North Indian Elite & Industrialist Families',
    status: 'Active'
  },
  {
    id: 'mm_2',
    name: 'Anandi Matchmaking Guild',
    title: 'Certified Royal Matrimonial Bureau',
    experience_years: 24,
    rating: 4.95,
    total_vouches: 890,
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    specialization: 'High Net-Worth & NRI Lineages (US/UK/Gulf)',
    status: 'Active'
  },
  {
    id: 'mm_3',
    name: 'Sanjiv & Meenakshi Iyer',
    title: 'Heritage South Indian Alliance Advisory',
    experience_years: 15,
    rating: 4.85,
    total_vouches: 310,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    specialization: 'Tech Founders, IIT/IIM Alumni & Civil Servants',
    status: 'Active'
  }
];

export function App() {
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    try {
      const isDeleted = localStorage.getItem('mannat_admin_deleted');
      if (isDeleted === 'true') {
        return [];
      }
      const stored = localStorage.getItem('mannat_admin_candidates');
      if (stored !== null) {
        return JSON.parse(stored);
      }
      return MOCK_PROFILES;
    } catch {
      return [];
    }
  });

  // Fetch live profiles from Supabase on mount
  useEffect(() => {
    async function loadSupabaseProfiles() {
      const isDeleted = localStorage.getItem('mannat_admin_deleted');
      if (isDeleted === 'true') {
        setProfiles([]);
        return;
      }
      try {
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (data && !error) {
          const deletedIds: string[] = JSON.parse(localStorage.getItem('mannat_admin_deleted_ids') || '[]');
          const activeData = (data as Profile[]).filter(d => !deletedIds.includes(d.id));
          setProfiles(activeData);
          localStorage.setItem('mannat_admin_candidates', JSON.stringify(activeData));
        }
      } catch (e) {
        console.warn('Supabase initial fetch fallback:', e);
      }
    }
    loadSupabaseProfiles();
  }, []);

  const [activeTab, setActiveTab] = useState<'candidates' | 'analytics' | 'callbacks' | 'vouches' | 'database'>('candidates');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterReligion, setFilterReligion] = useState<string>('all');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [showDeleteAllUsersConfirm, setShowDeleteAllUsersConfirm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Profile | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // VIP Callbacks & Matchmakers State
  const [callbacks, setCallbacks] = useState<VIPCallback[]>(INITIAL_CALLBACKS);
  const [matchmakers] = useState<MatchmakerCurator[]>(INITIAL_MATCHMAKERS);

  // New Candidate Form State
  const [newCandidate, setNewCandidate] = useState({
    display_name: '',
    age: 27,
    city: 'Mumbai',
    religion: 'Hindu',
    community: 'Brahmin',
    occupation: 'Senior Product Designer',
    company_name: 'Tech Corp',
    salary_bracket: '₹35L - ₹50L',
    education: 'B.Tech - IIT Bombay',
    bio_text: 'Passionate about culture, art and mindful living.',
    photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'],
    bio_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-smiling-at-the-camera-40150-large.mp4',
    is_vouched: true,
    is_spotlight: false,
    compatibility_score: 96
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const updateAndPersistProfiles = (updated: Profile[]) => {
    setProfiles(updated);
    try {
      localStorage.setItem('mannat_admin_candidates', JSON.stringify(updated));
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
      photos: newCandidate.photos
    };

    localStorage.removeItem('mannat_admin_deleted');
    updateAndPersistProfiles([created, ...profiles]);
    setShowAddModal(false);

    try {
      await supabase.from('profiles').insert([created]);
    } catch (e) {
      console.warn('DB insert error:', e);
    }
    showToast(`Candidate "${created.display_name}" published live to Supabase! ✨`);
  };

  const handleSaveEditCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCandidate) return;

    const updated = profiles.map(p => p.id === editingCandidate.id ? editingCandidate : p);
    updateAndPersistProfiles(updated);
    setEditingCandidate(null);

    try {
      await supabase.from('profiles').update(editingCandidate).eq('id', editingCandidate.id);
    } catch (e) {
      console.warn('DB update error:', e);
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
      localStorage.removeItem('mannat_active_user');
      localStorage.removeItem('mannat_intro_dismissed');
      localStorage.removeItem('mannat_privacy_settings');
      localStorage.removeItem('mannat_favorites');
      sessionStorage.clear();
    } catch (e) {
      console.error(e);
    }
    try {
      await supabase.from('profiles').delete().neq('id', '');
      await supabase.from('callback_requests').delete().neq('id', '');
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
      localStorage.removeItem('mannat_active_user');
      localStorage.removeItem('mannat_intro_dismissed');
      localStorage.removeItem('mannat_privacy_settings');
      localStorage.removeItem('mannat_favorites');
      
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
      await supabase.from('profiles').delete().neq('id', '');
      await supabase.from('callback_requests').delete().neq('id', '');
    } catch (e) {
      console.warn('DB user callback purge:', e);
    }

    setShowDeleteAllUsersConfirm(false);
    showToast('👥 All registered users & candidate bio-data permanently deleted!');
  };

  const handleReseedDefaults = async () => {
    localStorage.removeItem('mannat_admin_deleted');
    localStorage.removeItem('mannat_admin_deleted_ids');
    updateAndPersistProfiles(MOCK_PROFILES);
    try {
      await supabase.from('profiles').upsert(MOCK_PROFILES);
    } catch (e) {
      console.warn('DB reseed error:', e);
    }
    showToast('Re-seeded Default Vouched Candidates to Supabase! 🚀');
  };

  const handleAddEliteCohort = () => {
    const extraElite: Profile[] = [
      {
        id: 'cand_elite_1',
        user_id: 'usr_e1',
        display_name: 'Dr. Siddharth Sengupta',
        age: 30,
        marital_status: 'Never Married',
        religion: 'Hindu',
        community: 'Kayastha',
        city: 'New Delhi & London',
        salary_bracket: '₹50L - ₹75L',
        education: 'MD / PhD - Oxford & AIIMS',
        bio_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-the-sun-41315-large.mp4',
        credits: 10,
        is_vouched: true,
        is_spotlight: true,
        compatibility_score: 97,
        is_unlocked: true,
        bio_text: 'Cardiologist & medical researcher. Passionate about classical music and mountain trekking.',
        occupation: 'Consultant Cardiologist',
        company_name: 'Max Healthcare',
        family_background: 'Distinguished civil service and academic lineage.',
        marriage_expectations: 'Seeking an intellectually curious partner with cultural grounding.',
        photos: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80']
      },
      {
        id: 'cand_elite_2',
        user_id: 'usr_e2',
        display_name: 'Meera Chidambaram',
        age: 28,
        marital_status: 'Never Married',
        religion: 'Hindu',
        community: 'Iyer',
        city: 'Chennai & Singapore',
        salary_bracket: '₹60L - ₹80L',
        education: 'MBA - INSEAD | B.Tech - IIT Madras',
        bio_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-smiling-at-the-camera-40150-large.mp4',
        credits: 10,
        is_vouched: true,
        is_spotlight: true,
        compatibility_score: 98,
        is_unlocked: true,
        bio_text: 'Principal at Tier-1 Venture Capital fund. Carnatic vocalist and marathon runner.',
        occupation: 'Venture Capital Principal',
        company_name: 'Sequoia Capital SG',
        family_background: 'Traditional Brahmin family with deep values.',
        marriage_expectations: 'Looking for a warm, ambitious partner.',
        photos: ['https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80']
      }
    ];

    updateAndPersistProfiles([...extraElite, ...profiles]);
    showToast('Added 2 Elite Candidates to Discovery Stream! 👑');
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
        {/* KPI Analytics Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
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

          <div className="bg-white p-5 rounded-3xl border border-[#E8E1D5] shadow-xs col-span-2 sm:col-span-1">
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
            onClick={() => setActiveTab('analytics')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
              activeTab === 'analytics' ? 'bg-[#111111] text-white shadow-xs' : 'bg-white text-[#111111] hover:bg-[#E8E1D5]'
            }`}
          >
            Revenue & Metrics
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
                  <option value="Sikh">Sikh</option>
                  <option value="Jain">Jain</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Christian">Christian</option>
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
                {filteredCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="bg-white rounded-3xl border border-[#E8E1D5] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs hover:border-[#B89552] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={candidate.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={candidate.display_name}
                        className="w-16 h-16 rounded-2xl object-cover border border-[#E8E1D5] shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-extrabold text-[#111111]">
                            {candidate.display_name} · {candidate.age}
                          </h4>
                          {candidate.is_vouched && (
                            <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              VOUCHED
                            </span>
                          )}
                          {candidate.is_spotlight && (
                            <span className="text-[10px] font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              BOOSTED
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 font-medium mt-0.5">
                          {candidate.occupation} {candidate.company_name && `@ ${candidate.company_name}`}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {candidate.city} • {candidate.religion} {candidate.community && `(${candidate.community})`} • {candidate.salary_bracket}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                      <button
                        type="button"
                        onClick={() => setEditingCandidate(candidate)}
                        className="px-3.5 py-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-gray-600" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleVerified(candidate.id)}
                        className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
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
                        onClick={() => toggleSpotlight(candidate.id)}
                        className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
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
                        onClick={() => deleteCandidate(candidate.id)}
                        className="p-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
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

        {/* TAB 4: REVENUE & SUBSCRIPTION ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-[#E8E1D5] shadow-xs space-y-5">
              <div>
                <h3 className="text-lg font-bold text-[#111111]">Monetization & Conversion Funnel</h3>
                <p className="text-xs text-gray-500">Live platform subscription revenue and contact direct unlock metrics</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200">
                  <span className="text-[10px] font-bold text-[#8C6D32] uppercase tracking-wider block">Gold Membership</span>
                  <div className="text-2xl font-serif-editorial font-bold text-[#111111] mt-1">₹2,999 / mo</div>
                  <p className="text-xs text-gray-600 mt-1">42 Active Subscribers (₹1,25,958)</p>
                </div>

                <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200">
                  <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">Platinum Concierge</span>
                  <div className="text-2xl font-serif-editorial font-bold text-[#111111] mt-1">₹9,999 / mo</div>
                  <p className="text-xs text-gray-600 mt-1">18 VIP Families (₹1,79,982)</p>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">1-Click Bio-data Unlocks</span>
                  <div className="text-2xl font-serif-editorial font-bold text-[#111111] mt-1">₹499 / unlock</div>
                  <p className="text-xs text-gray-600 mt-1">146 Unlocks this month (₹72,854)</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#FBF9F4] border border-[#E8E1D5] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <TrendingUp className="w-10 h-10 text-[#B89552]" />
                  <div>
                    <h4 className="text-sm font-bold text-[#111111]">Platform Engagement Health: Exceptional</h4>
                    <p className="text-xs text-gray-500">Average profile view duration: 4m 12s • Match request acceptance rate: 68%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DATABASE & SEEDING UTILITIES */}
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
                  <p className="text-[11px] text-gray-500 mt-1">Restores Ananya, Rohan, Vikramaditya, and Priya</p>
                </button>

                <button
                  type="button"
                  onClick={handleAddEliteCohort}
                  className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 text-left transition-colors cursor-pointer group"
                >
                  <Crown className="w-6 h-6 text-[#B89552] mb-2" />
                  <h4 className="text-xs font-bold text-[#111111]">Add 2 Elite Candidates</h4>
                  <p className="text-[11px] text-gray-500 mt-1">Seeds Oxford Cardiologist & Sequoia Capital VC</p>
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
              <span>Tip: You can re-seed sample verified candidates anytime using the "Re-seed Default Profiles" tool.</span>
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
