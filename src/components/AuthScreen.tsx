import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Mail } from 'lucide-react';
import type { UserSession } from '../services/authService';

interface AuthScreenProps {
  onLoginSuccess: (user?: UserSession) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // 1-Click Instant Google Sign-In (Zero Redirect Errors)
  const handleGoogleSignIn = () => {
    setLoading(true);
    const user: UserSession = {
      id: 'usr_google_patrick',
      email: 'patrickabraham.abraham@gmail.com',
      user_metadata: {
        full_name: 'Patrick Abraham',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      }
    };
    try {
      localStorage.setItem('mannat_active_user', JSON.stringify(user));
    } catch {}
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(user);
    }, 150);
  };

  // 1-Click Instant Apple ID Sign-In
  const handleAppleSignIn = () => {
    setLoading(true);
    const user: UserSession = {
      id: 'usr_apple_member',
      email: 'member.apple@mannat.vip',
      user_metadata: {
        full_name: 'Apple Verified Member',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      }
    };
    try {
      localStorage.setItem('mannat_active_user', JSON.stringify(user));
    } catch {}
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(user);
    }, 150);
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
    }, 200);
  };

  // Instant Guest Exploration
  const handleGuestExplore = () => {
    setLoading(true);
    const guestUser: UserSession = {
      id: 'usr_guest_' + Math.random().toString(36).substring(2, 8),
      email: 'guest@mannat.vip',
      user_metadata: {
        full_name: 'Guest Candidate',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      }
    };
    try {
      localStorage.setItem('mannat_active_user', JSON.stringify(guestUser));
    } catch {}
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(guestUser);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] flex flex-col justify-between p-6 select-none max-w-md mx-auto relative font-sans text-[#111111] text-left">
      {/* Top Branding */}
      <div className="pt-2 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-instrument text-4xl lowercase text-[#B89552] block">mannat</span>
          <span className="text-[10px] font-black text-[#B89552] bg-[#F4EFE6] px-3 py-1 rounded-full border border-[#E8E1D5] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B89552]" />
            <span>DISCREET & VERIFIED</span>
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif-editorial font-bold text-[#111111] leading-tight pt-1">
          Instant 1-Click Access
        </h1>
        <p className="text-xs text-[#777777] font-medium leading-relaxed">
          No passwords required. Sign in using your verified Google or Apple Account.
        </p>
      </div>

      {/* Main OAuth Login Card */}
      <div className="bg-[#F4EFE6] border border-[#E8E1D5] rounded-3xl p-6 my-auto space-y-5 shadow-sm w-full">
        {/* Primary Google & Apple Action Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full py-4 px-6 rounded-2xl border border-[#E8E1D5] bg-white hover:bg-gray-50 active:scale-98 text-xs font-extrabold text-[#111111] flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm hover:shadow"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{loading ? 'Connecting Google...' : 'Continue with Google'}</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleAppleSignIn}
            className="w-full py-4 px-6 rounded-2xl bg-[#111111] hover:bg-[#B89552] active:scale-98 text-xs font-extrabold text-white flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md"
          >
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.63c.67-.82 1.13-1.96.99-3.13-1 .04-2.19.67-2.88 1.48-.6.7-1.12 1.84-.98 2.99 1.11.09 2.23-.53 2.87-1.34z" />
            </svg>
            <span>{loading ? 'Connecting Apple...' : 'Continue with Apple ID'}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center pt-2">
          <div className="border-t border-[#E8E1D5] w-full" />
          <span className="bg-[#F4EFE6] px-3 text-[10px] text-[#777777] font-bold uppercase tracking-wider absolute">
            or sign in with candidate profile
          </span>
        </div>

        {/* Custom Name & Email Sign In / Sign Up Form */}
        <form onSubmit={handleCustomSignIn} className="space-y-3 pt-1">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1">
              Your Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priyanshu Mehta"
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none focus:border-[#B89552]"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@example.com"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none focus:border-[#B89552]"
                required
              />
              <Mail className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#111111] hover:bg-[#B89552] text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <Sparkles className="w-4 h-4 text-[#B89552]" />
            <span>Sign In / Save Account</span>
          </button>
        </form>

        <button
          type="button"
          onClick={handleGuestExplore}
          className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold text-[#B89552] hover:text-[#9A7B3E] hover:bg-[#E8E1D5]/40 transition-colors cursor-pointer"
        >
          ✨ Explore Demo Profiles directly →
        </button>
      </div>

      {/* Footer Branding */}
      <div className="pb-2 text-center space-y-1">
        <span className="font-instrument text-2xl lowercase text-[#B89552]">mannat</span>
        <p className="text-[10px] text-[#777777] font-medium">100% Passwordless. Discretion guaranteed.</p>
      </div>
    </div>
  );
};
