import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, User, Mail, LogIn, X, ChevronRight, Plus } from 'lucide-react';
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
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);

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

  // Google Account Select Handler
  const handleSelectGoogleAccount = (selectedEmail: string, selectedName: string, avatarUrl: string) => {
    setLoading(true);
    setShowGoogleModal(false);
    const user = authService.setUserSession(selectedEmail, selectedName, avatarUrl);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(user);
    }, 100);
  };

  // Custom Google Account Submit
  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail.trim()) return;
    const gName = customGoogleName.trim() || customGoogleEmail.split('@')[0];
    handleSelectGoogleAccount(
      customGoogleEmail.trim(),
      gName,
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    );
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] flex flex-col justify-start p-5 select-none max-w-md mx-auto relative font-sans text-[#111111] text-left gap-3.5">
      {/* Top Branding */}
      <div className="pt-2 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="font-instrument text-4xl lowercase text-[#B89552] block tracking-tight">mannat</span>
          <span className="text-[10px] font-black text-[#B89552] bg-[#F4EFE6] px-3 py-1 rounded-full border border-[#E8E1D5] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B89552]" />
            <span>DISCREET & VERIFIED</span>
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-[#111111] leading-tight pt-0.5">
          Sign In to Your Account
        </h1>
        <p className="text-xs text-[#777777] font-medium leading-relaxed">
          The intention-first Indian matrimonial network with verified bio-datas.
        </p>
      </div>

      {/* Main Interactive Login Section */}
      <div className="bg-[#F4EFE6] border border-[#E8E1D5] rounded-3xl p-5 space-y-3.5 shadow-sm w-full">
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
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none focus:border-[#B89552] transition-colors shadow-xs"
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
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-white border border-[#E8E1D5] text-xs font-bold text-[#111111] outline-none focus:border-[#B89552] transition-colors shadow-xs"
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
        <div className="flex items-center gap-3 pt-0.5">
          <div className="flex-1 h-px bg-[#E8E1D5]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#999999]">OR</span>
          <div className="flex-1 h-px bg-[#E8E1D5]" />
        </div>

        {/* 1-Tap Google Sign In Option */}
        <div>
          <button
            type="button"
            disabled={loading}
            onClick={() => setShowGoogleModal(true)}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-[#FAF8F5] active:scale-98 text-xs font-bold text-[#333333] border border-[#E8E1D5] flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            <span>Continue with Google Account</span>
          </button>
        </div>
      </div>

      {/* Footer Assurance */}
      <div className="text-center pt-2">
        <p className="text-[11px] text-[#999999] font-medium">
          Strict BlurShield privacy & verified matchmaking protocols.
        </p>
      </div>

      {/* Google Account Chooser Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-[#E8E1D5] text-left relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => {
                setShowGoogleModal(false);
                setShowCustomGoogleInput(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Google Header */}
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
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
              <div>
                <h3 className="text-sm font-bold text-gray-900">Sign in with Google</h3>
                <p className="text-[11px] text-gray-500">Choose an account to continue to Mannat</p>
              </div>
            </div>

            {/* Quick Google Account Options */}
            <div className="space-y-2">
              {/* Account 1 */}
              <button
                type="button"
                onClick={() =>
                  handleSelectGoogleAccount(
                    'ananya.sharma@gmail.com',
                    'Ananya Sharma',
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                  )
                }
                className="w-full p-3 rounded-2xl border border-gray-200 hover:border-[#B89552] hover:bg-[#FBF9F4] flex items-center justify-between transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="Ananya Sharma"
                    className="w-9 h-9 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-900 block group-hover:text-[#B89552]">Ananya Sharma</span>
                    <span className="text-[11px] text-gray-500">ananya.sharma@gmail.com</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#B89552]" />
              </button>

              {/* Account 2 */}
              <button
                type="button"
                onClick={() =>
                  handleSelectGoogleAccount(
                    'kabir.singhania@gmail.com',
                    'Kabir Singhania',
                    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80'
                  )
                }
                className="w-full p-3 rounded-2xl border border-gray-200 hover:border-[#B89552] hover:bg-[#FBF9F4] flex items-center justify-between transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
                    alt="Kabir Singhania"
                    className="w-9 h-9 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-900 block group-hover:text-[#B89552]">Kabir Singhania</span>
                    <span className="text-[11px] text-gray-500">kabir.singhania@gmail.com</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#B89552]" />
              </button>

              {/* Use Another Google Account Toggle */}
              {!showCustomGoogleInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomGoogleInput(true)}
                  className="w-full p-3 rounded-2xl border border-dashed border-gray-300 hover:border-[#B89552] hover:bg-gray-50 flex items-center gap-3 transition-all text-left cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-700">Use another Google Account</span>
                </button>
              ) : (
                <form onSubmit={handleCustomGoogleSubmit} className="pt-2 space-y-2 border-t border-gray-100">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Your Google Email</label>
                    <input
                      type="email"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      placeholder="your.email@gmail.com"
                      className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-bold outline-none focus:border-[#B89552]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={customGoogleName}
                      onChange={(e) => setCustomGoogleName(e.target.value)}
                      placeholder="e.g. Rahul Verma"
                      className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-bold outline-none focus:border-[#B89552]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#111111] hover:bg-[#B89552] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Continue with this Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

            {/* Privacy notice */}
            <div className="pt-2 text-center text-[10px] text-gray-400">
              <span>To continue, Google will share your name and email with Mannat.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
