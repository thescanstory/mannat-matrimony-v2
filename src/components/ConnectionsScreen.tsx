import React, { useState, useEffect, useRef } from 'react';
import { SlidersHorizontal, MessageSquare, Send, X, ShieldCheck, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Profile, ChatMessage } from '../types';
import { chatService } from '../services/chatService';
import { Toast } from './Toast';

interface ConnectionsScreenProps {
  profiles: Profile[];
  onOpenProfile: (profile: Profile) => void;
  onOpenFilters: () => void;
}

export const ConnectionsScreen: React.FC<ConnectionsScreenProps> = ({
  profiles,
  onOpenProfile,
  onOpenFilters
}) => {
  const [activeTab, setActiveTab] = useState<'Accepted' | 'Sent' | 'Received'>('Accepted');
  const [activeChatProfile, setActiveChatProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'heart' | 'sparkle'>('success');
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Dynamic state for connections loaded from persistence and live data
  const [acceptedList, setAcceptedList] = useState<Profile[]>(() => {
    try {
      const stored = localStorage.getItem('mannat_accepted_connections');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  });

  const [sentList, setSentList] = useState<Profile[]>(() => {
    try {
      const stored = localStorage.getItem('mannat_sent_waves');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  });

  const [receivedList, setReceivedList] = useState<Profile[]>(() => {
    try {
      const stored = localStorage.getItem('mannat_received_connections');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  });

  useEffect(() => {
    if (profiles && profiles.length > 0) {
      // If user has no existing state, initialize healthy defaults and persist
      const savedAccepted = localStorage.getItem('mannat_accepted_connections');
      const savedSent = localStorage.getItem('mannat_sent_waves');
      const savedReceived = localStorage.getItem('mannat_received_connections');

      if (!savedAccepted && profiles.length >= 1) {
        const initAccepted = profiles.slice(0, 1);
        setAcceptedList(initAccepted);
        try { localStorage.setItem('mannat_accepted_connections', JSON.stringify(initAccepted)); } catch {}
      }
      if (!savedSent && profiles.length >= 3) {
        const initSent = profiles.slice(1, 3);
        setSentList(initSent);
        try { localStorage.setItem('mannat_sent_waves', JSON.stringify(initSent)); } catch {}
      }
      if (!savedReceived && profiles.length >= 4) {
        const initReceived = profiles.slice(3, 5);
        setReceivedList(initReceived);
        try { localStorage.setItem('mannat_received_connections', JSON.stringify(initReceived)); } catch {}
      }
    }
  }, [profiles]);

  const triggerToast = (msg: string, type: 'success' | 'heart' | 'sparkle' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (!activeChatProfile) {
      setMessages([]);
      return;
    }

    const matchId = `match-${activeChatProfile.id}`;
    let unsubscribe: (() => void) | undefined;

    async function loadChat() {
      const msgs = await chatService.getMessages(matchId, 'current-user');
      setMessages(msgs);

      // Subscribe to live incoming messages
      unsubscribe = chatService.subscribeToMatchChats(
        matchId,
        'current-user',
        (newMsg) => {
          setMessages((prev) => [...prev, newMsg]);
        }
      );
    }

    loadChat();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [activeChatProfile]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeChatProfile]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !activeChatProfile || isSending) return;

    const matchId = `match-${activeChatProfile.id}`;
    const text = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    try {
      const newMsg = await chatService.sendMessage(matchId, 'current-user', text);
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    } catch (err) {
      console.warn('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleAcceptReceived = (profile: Profile, e: React.MouseEvent) => {
    e.stopPropagation();
    const newReceived = receivedList.filter((p) => p.id !== profile.id);
    const newAccepted = [profile, ...acceptedList.filter(p => p.id !== profile.id)];
    setReceivedList(newReceived);
    setAcceptedList(newAccepted);
    try {
      localStorage.setItem('mannat_received_connections', JSON.stringify(newReceived));
      localStorage.setItem('mannat_accepted_connections', JSON.stringify(newAccepted));
    } catch (err) {
      console.warn('Persistence error:', err);
    }
    setActiveTab('Accepted');
    setActiveChatProfile(profile);
    triggerToast(`Accepted wave from ${profile.display_name}! 💬`, 'sparkle');
  };

  const handleDeclineReceived = (profile: Profile, e: React.MouseEvent) => {
    e.stopPropagation();
    const newReceived = receivedList.filter((p) => p.id !== profile.id);
    setReceivedList(newReceived);
    try {
      localStorage.setItem('mannat_received_connections', JSON.stringify(newReceived));
    } catch (err) {
      console.warn('Persistence error:', err);
    }
    triggerToast(`Declined wave from ${profile.display_name}`, 'success');
  };

  const handleCancelSent = (profile: Profile, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSent = sentList.filter((p) => p.id !== profile.id);
    setSentList(newSent);
    try {
      localStorage.setItem('mannat_sent_waves', JSON.stringify(newSent));
    } catch (err) {
      console.warn('Persistence error:', err);
    }
    triggerToast(`Cancelled wave to ${profile.display_name}`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#111111] w-full max-w-xl mx-auto flex flex-col justify-between pb-28 select-none font-sans">
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />

      {/* Top Header */}
      <div className="bg-[#FBF9F4] px-5 pt-6 pb-4 border-b border-[#E8E1D5] flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div>
          <h1 className="text-2xl font-serif-editorial font-bold text-[#111111] tracking-tight">Connections</h1>
          <p className="text-[11px] text-[#777777] font-semibold">Mutual Waves & Direct Discussions</p>
        </div>
        <button
          type="button"
          onClick={onOpenFilters}
          className="p-2.5 rounded-full bg-[#F4EFE6] hover:bg-[#E8E1D5] text-[#111111] transition-colors border border-[#E8E1D5] cursor-pointer shadow-xs"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#111111]" />
        </button>
      </div>

      {/* Tabs Row */}
      <div className="bg-[#FBF9F4] px-5 border-b border-[#E8E1D5] flex items-center justify-around sticky top-[69px] z-20">
        {(['Accepted', 'Sent', 'Received'] as const).map((tab) => {
          const isActive = activeTab === tab;
          const count = tab === 'Accepted' ? acceptedList.length : tab === 'Sent' ? sentList.length : receivedList.length;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`py-3.5 text-xs font-extrabold uppercase tracking-wider transition-all relative cursor-pointer flex items-center gap-1.5 ${
                isActive ? 'text-[#B89552]' : 'text-[#777777] hover:text-[#111111]'
              }`}
            >
              <span>{tab}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                isActive ? 'bg-[#B89552] text-white' : 'bg-[#E8E1D5] text-[#777777]'
              }`}>
                {count}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B89552] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content List */}
      <div className="p-4 space-y-4 flex-1 bg-[#FBF9F4]">
        {activeTab === 'Accepted' && (
          <div className="space-y-4">
            {acceptedList.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-xs font-medium">
                No accepted connections yet. Accept interest waves to start conversations.
              </div>
            ) : (
              acceptedList.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => onOpenProfile(profile)}
                  className="bg-[#F4EFE6] rounded-3xl p-4 border border-[#E8E1D5] shadow-xs space-y-3 cursor-pointer hover:shadow-md transition-all text-left"
                >
                  {/* Photo Header */}
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#2D2824]">
                    <img
                      src={profile.photos?.[0] || profile.creator_vouch?.creator_avatar_url}
                      alt={profile.display_name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 right-3 text-[11px] font-extrabold text-[#B89552] bg-white px-3 py-1 rounded-full shadow-xs border border-[#E8E1D5] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#B89552]" />
                      <span>Accepted Connection</span>
                    </span>
                  </div>

                  {/* Profile Brief */}
                  <div>
                    <h3 className="text-xl font-serif-editorial font-bold text-[#111111]">{profile.display_name}</h3>
                    <p className="text-xs text-[#777777] font-semibold mt-0.5">
                      {profile.age}yrs, {profile.height || "5'6\""} • {profile.religion} ({profile.sub_community || profile.community})
                    </p>
                    <p className="text-xs text-[#999999] mt-0.5">{profile.occupation} • {profile.city}</p>
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveChatProfile(profile);
                      }}
                      className="py-3 px-3 rounded-2xl bg-[#B89552] text-white text-xs font-extrabold uppercase tracking-wider hover:bg-[#9A7B3E] active:scale-98 transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Live Chat</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenProfile(profile);
                      }}
                      className="py-3 px-3 rounded-2xl bg-[#2D2824] text-white text-xs font-extrabold uppercase tracking-wider hover:bg-gray-800 active:scale-98 transition-all cursor-pointer shadow-xs"
                    >
                      View Bio-data
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'Sent' && (
          <div className="space-y-4">
            {sentList.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-xs font-medium">
                No outgoing waves sent yet. Send waves to profiles from the main feed.
              </div>
            ) : (
              sentList.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => onOpenProfile(profile)}
                  className="bg-[#F4EFE6] rounded-3xl p-4 border border-[#E8E1D5] shadow-xs space-y-3 cursor-pointer text-left"
                >
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#2D2824]">
                    <img
                      src={profile.photos?.[0] || profile.creator_vouch?.creator_avatar_url}
                      alt={profile.display_name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 right-3 text-[11px] font-extrabold text-[#777777] bg-white px-3 py-1 rounded-full shadow-xs border border-[#E8E1D5]">
                      Pending Response
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif-editorial font-bold text-[#111111]">{profile.display_name}</h3>
                    <p className="text-xs text-[#777777] font-semibold mt-0.5">
                      {profile.age}yrs • {profile.occupation} • {profile.city}
                    </p>
                  </div>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={(e) => handleCancelSent(profile, e)}
                      className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-98"
                    >
                      Withdraw Interest Wave
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'Received' && (
          <div className="space-y-4">
            {receivedList.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-xs font-medium">
                No pending received requests.
              </div>
            ) : (
              receivedList.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => onOpenProfile(profile)}
                  className="bg-[#F4EFE6] rounded-3xl p-4 border border-[#E8E1D5] shadow-xs space-y-3 cursor-pointer text-left"
                >
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#2D2824]">
                    <img
                      src={profile.photos?.[0] || profile.creator_vouch?.creator_avatar_url}
                      alt={profile.display_name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 right-3 text-[11px] font-extrabold text-[#B89552] bg-white px-3 py-1 rounded-full shadow-xs border border-[#E8E1D5]">
                      New Interest Request
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif-editorial font-bold text-[#111111]">{profile.display_name}</h3>
                    <p className="text-xs text-[#777777] font-semibold mt-0.5">
                      {profile.age}yrs • {profile.occupation} • {profile.city}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={(e) => handleDeclineReceived(profile, e)}
                      className="py-3 px-4 rounded-2xl bg-[#E8E1D5] text-[#111111] text-xs font-extrabold uppercase tracking-wider hover:bg-gray-300 active:scale-98 transition-all cursor-pointer shadow-xs"
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleAcceptReceived(profile, e)}
                      className="py-3 px-4 rounded-2xl bg-[#2D2824] text-white text-xs font-extrabold uppercase tracking-wider hover:bg-[#B89552] active:scale-98 transition-all cursor-pointer shadow-sm"
                    >
                      Accept Wave
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Real-time Interactive Chat Modal */}
      <AnimatePresence>
        {activeChatProfile && (
          <div className="fixed inset-0 z-50 bg-[#2D2824]/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full max-w-lg h-[90vh] sm:h-[750px] bg-[#FBF9F4] text-[#111111] rounded-t-[36px] sm:rounded-[36px] overflow-hidden flex flex-col justify-between select-none font-sans border border-[#E8E1D5] shadow-2xl relative"
            >
              {/* Chat Header */}
              <div className="px-5 py-4 bg-[#FBF9F4] border-b border-[#E8E1D5] flex items-center justify-between shadow-xs shrink-0">
                <div className="flex items-center gap-3">
                  <img
                    src={activeChatProfile.photos?.[0] || activeChatProfile.creator_vouch?.creator_avatar_url}
                    alt={activeChatProfile.display_name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#B89552]"
                  />
                  <div>
                    <h3 className="font-serif-editorial text-lg font-bold text-[#111111] leading-tight">
                      {activeChatProfile.display_name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-extrabold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Online • End-to-End Encrypted</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveChatProfile(null)}
                  className="p-2 rounded-full hover:bg-[#F4EFE6] text-gray-400 hover:text-[#111111] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F4EFE6]/60">
                <div className="text-center my-2">
                  <span className="text-[10px] font-bold text-[#777777] bg-white px-3 py-1 rounded-full border border-[#E8E1D5] shadow-xs">
                    🌟 Connected via Mannat Matchmaker Engine
                  </span>
                </div>

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.is_self ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                        msg.is_self
                          ? 'bg-[#2D2824] text-white rounded-br-none'
                          : 'bg-white text-[#111111] border border-[#E8E1D5] rounded-bl-none'
                      }`}
                    >
                      <p>{msg.message}</p>
                      <div
                        className={`text-[9px] mt-1 flex items-center justify-end gap-1 ${
                          msg.is_self ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        <span>
                          {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {msg.is_self && <CheckCheck className="w-3 h-3 text-[#B89552]" />}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input Footer */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-[#FBF9F4] border-t border-[#E8E1D5] flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Message ${activeChatProfile.display_name}...`}
                  className="flex-1 bg-white border border-[#E8E1D5] rounded-full px-4 py-3 text-xs text-[#111111] placeholder:text-gray-400 focus:outline-none focus:border-[#B89552] shadow-xs"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isSending}
                  className="w-10 h-10 rounded-full bg-[#2D2824] text-white hover:bg-[#B89552] disabled:opacity-40 transition-colors flex items-center justify-center cursor-pointer shrink-0 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
