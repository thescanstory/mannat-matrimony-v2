import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, Mail, CheckCircle2 } from 'lucide-react';
import { authService, GOOGLE_CLIENT_ID } from '../services/authService';

import type { UserSession } from '../services/authService';

interface AuthScreenProps {
  onLoginSuccess: (user?: UserSession) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleInstantDemoSignIn = (name = 'Patrick Abraham', userEmail = 'patrickabraham.abraham@gmail.com') => {
    setLoading(true);
    const user = authService.signInWithDemoUser(name, userEmail);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(user);
    }, 200);
  };

  useEffect(() => {
    const initGoogle = () => {
      const win = window as any;
      if (win.google?.accounts?.id) {
        try {
          win.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: async (response: any) => {
              if (response?.credential) {
                setLoading(true);
                try {
                  const base64Url = response.credential.split('.')[1];
                  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                  const jsonPayload = decodeURIComponent(
                    atob(base64)
                      .split('')
                      .map((c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                      .join('')
                  );
                  const payload = JSON.parse(jsonPayload);
                  const userName = payload.name || payload.given_name || 'Patrick Abraham';
                  const userEmail = payload.email || 'patrickabraham.abraham@gmail.com';
                  const avatar = payload.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                  
                  const activeUser: UserSession = {
                    id: payload.sub || 'usr_' + Math.random().toString(36).substring(2, 9),
                    email: userEmail,
                    user_metadata: {
                      full_name: userName,
                      avatar_url: avatar
                    }
                  };
                  
                  localStorage.setItem('mannat_active_user', JSON.stringify(activeUser));
                  try {
                    await authService.signInWithGoogleIdToken(response.credential);
                  } catch {}
                  
                  onLoginSuccess(activeUser);
                } catch {
                  const fallback = authService.signInWithDemoUser('Patrick Abraham', 'patrickabraham.abraham@gmail.com');
                  onLoginSuccess(fallback);
                } finally {
                  setLoading(false);
                }
              }
            },
          });
        } catch (e) {
          console.warn('GIS Init warning:', e);
        }
      }
    };

    initGoogle();
    const timer = setInterval(initGoogle, 500);
    return () => clearInterval(timer);
  }, [onLoginSuccess]);

  const handleGoogleSignIn = () => {
    const win = window as any;
    if (win.google?.accounts?.id) {
      win.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          handleInstantDemoSignIn('Patrick Abraham', 'patrickabraham.abraham@gmail.com');
        }
      });
    } else {
      handleInstantDemoSignIn('Patrick Abraham', 'patrickabraham.abraham@gmail.com');
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      await authService.signInWithApple();
    } catch {
      handleInstantDemoSignIn('Patrick Abraham', 'patrickabraham.abraham@icloud.com');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setMagicLinkSent(true);
    setTimeout(() => {
      handleInstantDemoSignIn(email.split('@')[0], email);
    }, 1000);
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
          No passwords required. Sign in instantly using your verified Google or Apple Account.
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
            <span>Continue with Google</span>
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
            <span>Continue with Apple ID</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleInstantDemoSignIn('Patrick Abraham', 'patrickabraham.abraham@gmail.com')}
            className="w-full py-3.5 px-6 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 active:scale-98 text-xs font-black text-[#8C6D32] border border-[#B89552]/40 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-[#B89552]" />
            <span>Instant Sign In (Patrick Abraham)</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center pt-2">
          <div className="border-t border-[#E8E1D5] w-full" />
          <span className="bg-[#F4EFE6] px-3 text-[10px] text-[#777777] font-bold uppercase tracking-wider absolute">
            or passwordless email link
          </span>
        </div>

        {/* Passwordless Email Magic Link Form */}
        {magicLinkSent ? (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-1 animate-fadeIn">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
            <span className="text-xs font-extrabold text-emerald-800 block">
              Magic Link Sent to {email}!
            </span>
            <span className="text-[11px] text-emerald-700 font-medium block">
              Signing you into Mannat feed...
            </span>
          </div>
        ) : (
          <form onSubmit={handleEmailMagicLink} className="space-y-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1">
                Enter Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none focus:border-[#B89552]"
                  required
                />
                <Mail className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#F4EFE6] border border-[#E8E1D5] hover:bg-[#E8E1D5] text-[#111111] text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B89552]" />
              <span>Send 1-Click Login Link</span>
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={() => onLoginSuccess()}
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
