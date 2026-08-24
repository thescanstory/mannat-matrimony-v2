import React, { useState } from 'react';
import { ArrowRight, User, Mail, LogIn } from 'lucide-react';
import { authService } from '../services/authService';
import type { UserSession } from '../services/authService';

interface AuthScreenProps {
  onLoginSuccess: (user?: UserSession) => void;
  onOpenOnboarding?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Sign In with Specific Email & Name
  const handleCustomSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const user = authService.setUserSession(email, name);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(user);
    }, 100);
  };

  // Direct 1-Click Google OAuth Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await authService.signInWithGoogle();
    } catch (err) {
      console.warn('Google sign in error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] flex flex-col justify-start px-4 py-4 select-none max-w-sm mx-auto relative font-sans text-[#111111] text-left gap-3">
      {/* Top Branding - Clean, Single Logo, Zero Unwanted Badges */}
      <div className="pt-1 space-y-1">
        <span className="font-instrument text-4xl lowercase text-[#B89552] block tracking-tight">
          mannat
        </span>
        <h1 className="text-2xl font-serif-editorial font-bold text-[#111111] leading-tight">
          Sign In to Your Account
        </h1>
        <p className="text-[11px] text-[#777777] font-medium leading-normal">
          The intention-first Indian matrimonial network with verified bio-datas.
        </p>
      </div>

      {/* Main Interactive Login Section - Tightly Aligned for Mobile */}
      <div className="bg-[#F4EFE6] border border-[#E8E1D5] rounded-3xl p-4 space-y-3 shadow-xs w-full">
        {/* Email & Name Sign In Form */}
        <form onSubmit={handleCustomSignIn} className="space-y-2.5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none focus:border-[#B89552] transition-colors"
                required
              />
              <Mail className="w-3.5 h-3.5 text-[#B89552] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] mb-1">
              Full Name (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none focus:border-[#B89552] transition-colors"
              />
              <User className="w-3.5 h-3.5 text-[#B89552] absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-5 rounded-2xl bg-[#2D2824] hover:bg-[#B89552] active:scale-98 text-xs font-extrabold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm mt-1"
          >
            <LogIn className="w-3.5 h-3.5 text-[#B89552]" />
            <span>{loading ? 'Signing in...' : 'Sign In with Email'}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2.5 pt-0.5">
          <div className="flex-1 h-px bg-[#E8E1D5]" />
          <span className="text-[9px] font-black uppercase tracking-wider text-[#999999]">OR</span>
          <div className="flex-1 h-px bg-[#E8E1D5]" />
        </div>

        {/* Only 1 Clean Google Button */}
        <div>
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-[#FAF8F5] active:scale-98 text-xs font-bold text-[#333333] border border-[#E8E1D5] flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xs"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
            <span>{loading ? 'Opening Google...' : 'Continue with Google Account'}</span>
          </button>
        </div>
      </div>

      {/* Footer Assurance */}
      <div className="text-center pt-1">
        <p className="text-[10px] text-[#999999] font-medium">
          Strict BlurShield privacy & verified matchmaking protocols.
        </p>
      </div>
    </div>
  );
};
