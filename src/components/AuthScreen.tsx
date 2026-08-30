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
  const [name, setName] = useState('Rahul Sharma');
  const [email, setEmail] = useState('rahul@mannat.vip');

  // Sign In with Specific Email & Name
  const handleCustomSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const finalEmail = email.trim() || 'rahul@mannat.vip';
    const finalName = name.trim() || 'Rahul Sharma';
    setLoading(true);
    const user = authService.setUserSession(finalEmail, finalName);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(user);
    }, 100);
  };

  // Direct 1-Click Google OAuth Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const res = await authService.signInWithGoogle();
      if (res?.data) {
        onLoginSuccess(res.data);
      }
    } catch (err) {
      console.warn('Google sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Direct 1-Click Apple Sign In
  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      const res = await authService.signInWithApple();
      if (res?.data) {
        onLoginSuccess(res.data);
      }
    } catch (err) {
      console.warn('Apple sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#FBF9F4] flex flex-col justify-start pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))] px-4 select-none max-w-sm mx-auto relative font-sans text-[#111111] text-left gap-4">
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
        <form onSubmit={handleCustomSignIn} className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none focus:border-[#B89552] transition-colors"
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
            className="w-full py-3 px-5 rounded-2xl bg-[#2D2824] hover:bg-[#B89552] active:scale-95 text-xs font-extrabold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm mt-1 whitespace-nowrap"
          >
            <LogIn className="w-3.5 h-3.5 text-[#B89552]" />
            <span className="whitespace-nowrap">{loading ? 'Signing in...' : 'Sign In with Email'}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2.5 pt-0.5">
          <div className="flex-1 h-px bg-[#E8E1D5]" />
          <span className="text-[9px] font-black uppercase tracking-wider text-[#999999]">OR</span>
          <div className="flex-1 h-px bg-[#E8E1D5]" />
        </div>

        {/* 1-Tap Native Social Logins */}
        <div className="space-y-2">
          {/* Apple Sign In (Native iOS Standard) */}
          <button
            type="button"
            disabled={loading}
            onClick={handleAppleSignIn}
            className="w-full py-3 px-4 rounded-2xl bg-black hover:bg-[#1f1f1f] active:scale-95 text-xs font-bold text-white flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xs whitespace-nowrap"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.59-7.71-11.72-14.01-6.42-9.79-11.48-20.76-15.17-32.91-3.69-12.16-5.54-23.77-5.54-34.84 0-14.45 3.63-26.47 10.9-36.06 7.27-9.59 16.51-14.44 27.71-14.56 4.91 0 10.42 1.34 16.53 4.02 6.11 2.68 10.15 4.02 12.11 4.02 1.63 0 5.86-1.4 12.69-4.2 6.83-2.8 12.71-4.04 17.65-3.73 13.06.66 23.36 5.62 30.9 14.89-11.54 6.96-17.19 16.64-16.96 29.04.22 9.68 3.86 17.81 10.93 24.39 7.07 6.58 15.46 10.22 25.17 10.92-2.18 6.53-4.8 12.87-7.85 19.01zM119.22 33.64c0-7.39 2.66-14.17 7.99-20.33 5.33-6.17 11.95-10.15 19.86-11.94 1.09 7.61-1.2 14.7-6.87 21.27-5.67 6.57-12.66 10.57-20.98 12-.02-.33-.04-.67-.04-1z" />
            </svg>
            <span className="whitespace-nowrap">{loading ? 'Authenticating...' : 'Continue with Apple'}</span>
          </button>

          {/* Google Sign In */}
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-[#FAF8F5] active:scale-95 text-xs font-bold text-[#333333] border border-[#E8E1D5] flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xs whitespace-nowrap"
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
            <span className="whitespace-nowrap">{loading ? 'Opening Google...' : 'Continue with Google'}</span>
          </button>
        </div>
      </div>

      {/* Footer Assurance */}
      <div className="text-center pt-1 mt-auto">
        <p className="text-[10px] text-[#999999] font-medium">
          Strict BlurShield privacy & verified matchmaking protocols.
        </p>
      </div>
    </div>
  );
};
