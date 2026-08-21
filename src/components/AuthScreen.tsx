import React, { useState } from 'react';
import { ShieldCheck, Sparkles, UserPlus, ArrowRight, User } from 'lucide-react';
import type { UserSession } from '../services/authService';

interface AuthScreenProps {
  onLoginSuccess: (user?: UserSession) => void;
  onOpenOnboarding?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, onOpenOnboarding }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  // 1-Click Instant Direct Access
  const handleInstantAccess = () => {
    setLoading(true);
    const user: UserSession = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: 'member@mannat.vip',
      user_metadata: {
        full_name: 'Verified Candidate',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      }
    };
    try {
      localStorage.setItem('mannat_active_user', JSON.stringify(user));
    } catch {}
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(user);
    }, 100);
  };

  // Custom User Profile Sign In / Sign Up
  const handleCustomSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const candidateName = name.trim() || email.split('@')[0];
    const user: UserSession = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: email.trim().toLowerCase(),
      user_metadata: {
        full_name: candidateName,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      }
    };
    try {
      localStorage.setItem('mannat_active_user', JSON.stringify(user));
    } catch {}
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(user);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] flex flex-col justify-between p-6 select-none max-w-md mx-auto relative font-sans text-[#111111] text-left">
      {/* Top Branding */}
      <div className="pt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-instrument text-4xl lowercase text-[#B89552] block tracking-tight">mannat</span>
          <span className="text-[10px] font-black text-[#B89552] bg-[#F4EFE6] px-3 py-1 rounded-full border border-[#E8E1D5] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B89552]" />
            <span>DISCREET & VERIFIED</span>
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif-editorial font-bold text-[#111111] leading-tight pt-1">
          Values you already hold.
        </h1>
        <p className="text-xs text-[#777777] font-medium leading-relaxed">
          The intention-first Indian matrimonial network with verified bio-datas and discreet family sharing.
        </p>
      </div>

      {/* Main Interactive Login Options */}
      <div className="bg-[#F4EFE6] border border-[#E8E1D5] rounded-3xl p-6 my-auto space-y-4 shadow-sm w-full">
        {/* Primary 1-Click Action */}
        <button
          type="button"
          disabled={loading}
          onClick={handleInstantAccess}
          className="w-full py-4 px-6 rounded-2xl bg-[#111111] hover:bg-[#B89552] active:scale-98 text-xs font-extrabold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <Sparkles className="w-4 h-4 text-[#B89552]" />
          <span>{loading ? 'Entering Mannat...' : '1-Click Direct Access to Feed'}</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>

        {/* Create Profile / Onboarding */}
        {onOpenOnboarding && (
          <button
            type="button"
            onClick={onOpenOnboarding}
            className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-gray-50 active:scale-98 text-xs font-extrabold text-[#111111] border border-[#E8E1D5] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <UserPlus className="w-4 h-4 text-[#B89552]" />
            <span>Create New Candidate Bio-Data</span>
          </button>
        )}

        {/* Toggle Custom Profile Form */}
        <div className="pt-2">
          {!showCustomForm ? (
            <button
              type="button"
              onClick={() => setShowCustomForm(true)}
              className="w-full py-2.5 px-4 text-center text-xs font-bold text-[#777777] hover:text-[#111111] hover:bg-[#E8E1D5]/40 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-[#B89552]" />
              <span>Sign in with Name & Email</span>
            </button>
          ) : (
            <form onSubmit={handleCustomSignIn} className="space-y-3 pt-2 border-t border-[#E8E1D5]">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none focus:border-[#B89552]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none focus:border-[#B89552]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#B89552] hover:bg-[#9A7B3E] text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <span>Continue with Profile</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer Assurance */}
      <div className="text-center py-2">
        <p className="text-[11px] text-[#999999] font-medium">
          Strict BlurShield privacy & verified matchmaking protocols.
        </p>
      </div>
    </div>
  );
};
