import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, UserPlus, ArrowRight, User, Mail, LogIn, Trash2 } from 'lucide-react';
import { authService } from '../services/authService';
import type { UserSession } from '../services/authService';

interface AuthScreenProps {
  onLoginSuccess: (user?: UserSession) => void;
  onOpenOnboarding?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, onOpenOnboarding }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [savedAccounts, setSavedAccounts] = useState<UserSession[]>([]);

  useEffect(() => {
    setSavedAccounts(authService.getSavedAccounts());
  }, []);

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

  // Sign In with a previously saved account
  const handleSelectSavedAccount = (account: UserSession) => {
    if (!account.email) return;
    setLoading(true);
    const user = authService.setUserSession(account.email, account.user_metadata?.full_name, account.user_metadata?.avatar_url);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(user);
    }, 100);
  };

  const handleRemoveAccount = (e: React.MouseEvent, accountEmail: string) => {
    e.stopPropagation();
    authService.removeSavedAccount(accountEmail);
    setSavedAccounts(authService.getSavedAccounts());
  };

  // Google OAuth Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await authService.signInWithGoogle();
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] flex flex-col justify-between p-5 select-none max-w-md mx-auto relative font-sans text-[#111111] text-left">
      {/* Top Branding */}
      <div className="pt-2 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-instrument text-4xl lowercase text-[#B89552] block tracking-tight">mannat</span>
          <span className="text-[10px] font-black text-[#B89552] bg-[#F4EFE6] px-3 py-1 rounded-full border border-[#E8E1D5] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B89552]" />
            <span>DISCREET & VERIFIED</span>
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-[#111111] leading-tight pt-1">
          Sign In to Your Account
        </h1>
        <p className="text-xs text-[#777777] font-medium leading-relaxed">
          Enter any email to sign in or switch account instantly.
        </p>
      </div>

      {/* Main Interactive Login Section */}
      <div className="bg-[#F4EFE6] border border-[#E8E1D5] rounded-3xl p-5 my-auto space-y-4 shadow-sm w-full">
        
        {/* Saved Accounts List if available */}
        {savedAccounts.length > 0 && (
          <div className="space-y-2 pb-2 border-b border-[#E8E1D5]">
            <span className="text-[10px] font-black text-[#8C6D32] uppercase tracking-wider block">
              Switch to Recent Account
            </span>
            <div className="space-y-1.5">
              {savedAccounts.map((acc) => (
                <div
                  key={acc.email}
                  onClick={() => handleSelectSavedAccount(acc)}
                  className="p-2.5 rounded-2xl bg-white border border-[#E8E1D5] hover:border-[#B89552] flex items-center justify-between cursor-pointer transition-all hover:bg-amber-50/50 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#F4EFE6] border border-[#B89552]/40 flex items-center justify-center text-[#B89552] font-bold text-xs shrink-0">
                      {(acc.user_metadata?.full_name || acc.email || 'M').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#111111] truncate">
                        {acc.user_metadata?.full_name || acc.email?.split('@')[0]}
                      </p>
                      <p className="text-[10px] text-[#777777] truncate">{acc.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleRemoveAccount(e, acc.email!)}
                      className="p-1 text-gray-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors"
                      title="Remove from list"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ArrowRight className="w-4 h-4 text-[#B89552] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Email & Name Sign In Form */}
        <form onSubmit={handleCustomSignIn} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none focus:border-[#B89552] transition-colors"
                required
              />
              <Mail className="w-4 h-4 text-[#B89552] absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1">
              Full Name (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ananya Sharma"
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none focus:border-[#B89552] transition-colors"
              />
              <User className="w-4 h-4 text-[#B89552] absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#111111] hover:bg-[#B89552] active:scale-98 text-xs font-extrabold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <LogIn className="w-4 h-4 text-[#B89552]" />
            <span>{loading ? 'Signing in...' : 'Sign In with Email'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 pt-1">
          <div className="flex-1 h-px bg-[#E8E1D5]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#999999]">OR</span>
          <div className="flex-1 h-px bg-[#E8E1D5]" />
        </div>

        {/* 1-Click Guest & Google Options */}
        <div className="space-y-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setLoading(true);
              const user = authService.signInWithDemoUser('Verified Candidate', 'member@mannat.vip');
              setTimeout(() => {
                setLoading(false);
                onLoginSuccess(user);
              }, 100);
            }}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-amber-50/50 active:scale-98 text-xs font-extrabold text-[#111111] border border-[#E8E1D5] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-[#B89552]" />
            <span>1-Click VIP Demo Access</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-gray-50 active:scale-98 text-xs font-bold text-[#555555] border border-[#E8E1D5] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <span>Continue with Google Account</span>
          </button>
        </div>

        {/* Create Profile / Onboarding */}
        {onOpenOnboarding && (
          <div className="pt-2 border-t border-[#E8E1D5]">
            <button
              type="button"
              onClick={onOpenOnboarding}
              className="w-full py-2.5 px-4 text-center text-xs font-bold text-[#8C6D32] hover:text-[#111111] hover:bg-[#E8E1D5]/40 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#B89552]" />
              <span>Create New Candidate Bio-Data</span>
            </button>
          </div>
        )}
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
