import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, ShieldCheck, CheckCheck, Video, Sparkles, Mic, User, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Profile, ChatMessage } from '../types';
import { chatService } from '../services/chatService';
import { Toast } from './Toast';
import { FamilyCallModal } from './FamilyCallModal';
import { ReportBlockModal } from './ReportBlockModal';
import { nativeService } from '../services/nativeService';

interface ConnectionsScreenProps {
  profiles: Profile[];
  onOpenProfile: (profile: Profile) => void;
  onOpenFilters?: () => void;
}

export const ConnectionsScreen: React.FC<ConnectionsScreenProps> = ({
  profiles: _profiles,
  onOpenProfile,
  onOpenFilters: _onOpenFilters
}) => {
  const [activeTab, setActiveTab] = useState<'Accepted' | 'Sent' | 'Received'>('Accepted');
  const [activeChatProfile, setActiveChatProfile] = useState<Profile | null>(null);
  const [reportModalProfile, setReportModalProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'heart' | 'sparkle'>('success');
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const [acceptedList, setAcceptedList] = useState<Profile[]>(() => {
    try {
      const stored = localStorage.getItem('mannat_accepted_connections');
      if (stored) {
        const parsed: Profile[] = JSON.parse(stored);
        return parsed.filter(p => p && p.id && !p.id.startsWith('11111') && !p.id.startsWith('22222') && !p.id.startsWith('33333'));
      }
    } catch {}
    return [];
  });

  const [sentList, setSentList] = useState<Profile[]>(() => {
    try {
      const stored = localStorage.getItem('mannat_sent_waves');
      if (stored) {
        const parsed: Profile[] = JSON.parse(stored);
        return parsed.filter(p => p && p.id && !p.id.startsWith('11111') && !p.id.startsWith('22222') && !p.id.startsWith('33333'));
      }
    } catch {}
    return [];
  });

  const [receivedList, setReceivedList] = useState<Profile[]>(() => {
    try {
      const stored = localStorage.getItem('mannat_received_connections');
      if (stored) {
        const parsed: Profile[] = JSON.parse(stored);
        return parsed.filter(p => p && p.id && !p.id.startsWith('11111') && !p.id.startsWith('22222') && !p.id.startsWith('33333'));
      }
    } catch {}
    return [];
  });

  const triggerToast = (msg: string, type: 'success' | 'heart' | 'sparkle' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (!activeChatProfile) {
      setMessages([]);
      setIsTyping(false);
      return;
    }

    const matchId = `match-${activeChatProfile.id}`;
    let unsubscribe: (() => void) | undefined;

    async function loadChat() {
      if (!activeChatProfile) return;
      const msgs = await chatService.getMessages(matchId, 'current-user', activeChatProfile);
      setMessages(msgs);

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

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, activeChatProfile]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || !activeChatProfile || isSending) return;

    const matchId = `match-${activeChatProfile.id}`;
    setInputMessage('');
    setIsSending(true);

    try {
      const newMsg = await chatService.sendMessage(matchId, 'current-user', text);
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });

      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          if (!activeChatProfile) return;

          let replyText = `Thank you so much! It's truly a pleasure connecting. I would love to know more about your family background and what you value most in a partner. ✨`;
          const lower = text.toLowerCase();
          if (lower.includes('namaste') || lower.includes('hello') || lower.includes('hi')) {
            replyText = `Namaste! 🙏 So glad we connected. How is your day going?`;
          } else if (lower.includes('profile') || lower.includes('lovely') || lower.includes('photo')) {
            replyText = `Thank you for the kind words! I also really appreciated your profile and values. 😊`;
          } else if (lower.includes('hobbies') || lower.includes('work') || lower.includes('profession')) {
            replyText = `I am very passionate about my work in ${activeChatProfile.occupation || 'my career'} in ${activeChatProfile.city || 'the city'}, and outside of work I enjoy family time and travel. What about you? 🌟`;
          } else if (lower.includes('call') || lower.includes('video') || lower.includes('speak')) {
            replyText = `I'd love that! You can tap the Video Call icon at the top of our chat to set up a private family or one-on-one session! 📹✨`;
          } else if (lower.includes('kundli') || lower.includes('horoscope') || lower.includes('gotra')) {
            replyText = `Our family is happy to share horoscope details! I have verified our family background with the Mannat Concierge team. 🕊️`;
          }

          const replyMsg = chatService.receiveCandidateMessage(matchId, activeChatProfile.id, replyText);
          setMessages((prev) => [...prev, replyMsg]);
        }, 1800);
      }, 600);

    } catch (err) {
      console.warn('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleVoiceNoteSimulate = () => {
    triggerToast('Recording voice note...', 'sparkle');
    setTimeout(() => {
      handleSendMessage('🎵 [Audio Note: 0:14 - Family Introduction & Values]');
    }, 1000);
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
    <div className="min-h-screen bg-[#F8F6F2] text-[#161412] w-full max-w-7xl mx-auto flex flex-col justify-start pb-32 md:pb-20 select-none font-sans px-4 sm:px-6 lg:px-8 space-y-4">
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />

      {/* Sticky Fixed Header & Segmented Pill Controls */}
      <div className="sticky top-16 sm:top-20 z-20 bg-[#F8F6F2]/98 backdrop-blur-xl border-b border-[#E8DDD0] py-3 -mx-4 px-4 sm:mx-0 sm:px-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
        <div className="px-1">
          <h1 className="text-xl sm:text-2xl font-bold text-[#161412] tracking-tight leading-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Connections</h1>
          <p className="text-[11px] text-[#6E6259] font-medium">Mutual Waves &amp; Direct Discussions</p>
        </div>

        <div className="bg-white/90 p-1 rounded-full border border-[#E8DDD0] flex items-center justify-between gap-1 shadow-xs shrink-0 max-w-xs sm:max-w-sm w-full sm:w-auto">
          {(['Accepted', 'Sent', 'Received'] as const).map((tab) => {
            const isActive = activeTab === tab;
            const count = tab === 'Accepted' ? acceptedList.length : tab === 'Sent' ? sentList.length : receivedList.length;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  nativeService.haptic.light();
                  setActiveTab(tab);
                }}
                className={`flex-1 py-1.5 px-3 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95 ${
                  isActive ? 'bg-[#560406] text-[#F5E6D3] shadow-xs' : 'text-[#6E6259] hover:text-[#161412]'
                }`}
              >
                <span>{tab}</span>
                <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-[#A17B5E] text-[#260102]' : 'bg-[#F8F6F2] text-[#6E6259] border border-[#E8DDD0]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {activeTab === 'Accepted' && (
          <div>
            {acceptedList.length === 0 ? (
              <div className="py-16 text-center text-[#6E6259] text-sm font-medium bg-white rounded-3xl p-8 border border-[#E8DDD0] max-w-xl mx-auto shadow-xs">
                No accepted connections yet. Accept interest waves or express interest in profiles to start conversations.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {acceptedList.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => onOpenProfile(profile)}
                  className="bg-white rounded-[28px] p-5 border border-[#E8DDD0] shadow-xs space-y-4 cursor-pointer hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[#260102] shrink-0 shadow-xs border border-[#E8DDD0]">
                      <img
                        src={profile.photos?.[0] || profile.creator_vouch?.creator_avatar_url}
                        alt={profile.display_name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs">
                        <ShieldCheck className="w-3 h-3" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-serif-editorial font-bold text-[#161412] truncate" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{profile.display_name}</h3>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                          Connected
                        </span>
                      </div>
                      <p className="text-xs text-[#6E6259] font-semibold mt-0.5 truncate">
                        {profile.age} yrs • {profile.height || "5'7\""} • {profile.religion}
                      </p>
                      <p className="text-xs text-[#161412] font-bold mt-0.5 truncate">{profile.occupation} • {profile.city}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#E8DDD0]">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveChatProfile(profile);
                      }}
                      className="py-3 px-3.5 rounded-xl bg-gradient-to-r from-[#730C0F] to-[#560406] text-[#F5E6D3] text-xs font-extrabold uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5 whitespace-nowrap border border-[#A17B5E]/40"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#D8B486]" />
                      <span>Live Chat</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenProfile(profile);
                      }}
                      className="py-3 px-3.5 rounded-xl bg-[#F8F6F2] border border-[#E8DDD0] text-[#161412] text-xs font-extrabold uppercase tracking-wider hover:bg-white active:scale-98 transition-all cursor-pointer shadow-xs whitespace-nowrap flex items-center justify-center gap-1.5"
                    >
                      <User className="w-3.5 h-3.5 text-[#6E6259]" />
                      <span>View Profile</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

        {activeTab === 'Sent' && (
          <div>
            {sentList.length === 0 ? (
              <div className="py-16 text-center text-[#6E6259] text-sm font-medium bg-white rounded-3xl p-8 border border-[#E8DDD0] max-w-xl mx-auto shadow-xs">
                You haven't sent any interest waves yet. Explore candidate profiles in the feed to send a wave.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {sentList.map((profile) => (
                  <div
                    key={profile.id}
                    onClick={() => onOpenProfile(profile)}
                    className="bg-white rounded-[28px] p-5 border border-[#E8DDD0] shadow-xs space-y-4 cursor-pointer hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-18 h-18 rounded-2xl overflow-hidden bg-[#260102] shrink-0 shadow-xs border border-[#E8DDD0]">
                        <img
                          src={profile.photos?.[0] || profile.creator_vouch?.creator_avatar_url}
                          alt={profile.display_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-serif-editorial font-bold text-[#161412] truncate" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{profile.display_name}</h3>
                          <span className="text-[10px] text-[#A17B5E] bg-[#560406]/5 font-bold px-2.5 py-0.5 rounded-full border border-[#A17B5E]/30 shrink-0">
                            Wave Pending
                          </span>
                        </div>
                        <p className="text-xs text-[#6E6259] font-medium mt-0.5 truncate">{profile.age} yrs • {profile.occupation}</p>
                        <p className="text-xs text-[#161412] font-semibold mt-0.5 truncate">{profile.city}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E8DDD0]">
                      <span className="text-[11px] text-[#6E6259]">Sent 2 days ago</span>
                      <button
                        type="button"
                        onClick={(e) => handleCancelSent(profile, e)}
                        className="text-xs text-rose-700 hover:text-rose-800 font-bold px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        Withdraw Wave
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Received' && (
          <div>
            {receivedList.length === 0 ? (
              <div className="py-16 text-center text-[#6E6259] text-sm font-medium bg-white rounded-3xl p-8 border border-[#E8DDD0] max-w-xl mx-auto shadow-xs">
                No pending interest waves at the moment. Keep your profile updated to attract compatible matches!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {receivedList.map((profile) => (
                  <div
                    key={profile.id}
                    onClick={() => onOpenProfile(profile)}
                    className="bg-white rounded-[28px] p-5 border border-[#E8DDD0] shadow-xs space-y-4 cursor-pointer hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-18 h-18 rounded-2xl overflow-hidden bg-[#260102] shrink-0 shadow-xs border border-[#E8DDD0]">
                        <img
                          src={profile.photos?.[0] || profile.creator_vouch?.creator_avatar_url}
                          alt={profile.display_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-serif-editorial font-bold text-[#161412] truncate" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{profile.display_name}</h3>
                          <span className="text-[10px] text-emerald-800 bg-emerald-50 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                            New Wave ✨
                          </span>
                        </div>
                        <p className="text-xs text-[#6E6259] font-medium mt-0.5 truncate">{profile.age} yrs • {profile.occupation}</p>
                        <p className="text-xs text-[#161412] font-semibold mt-0.5 truncate">{profile.city}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#E8DDD0]">
                      <button
                        type="button"
                        onClick={(e) => handleDeclineReceived(profile, e)}
                        className="py-2.5 px-3 rounded-xl bg-[#F8F6F2] hover:bg-white text-[#6E6259] text-xs font-bold transition-all border border-[#E8DDD0] cursor-pointer"
                      >
                        Pass
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleAcceptReceived(profile, e)}
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#730C0F] to-[#560406] text-[#F5E6D3] text-xs font-black uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all cursor-pointer shadow-xs border border-[#A17B5E]/40"
                      >
                        Accept Wave
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {activeChatProfile && (
          <div className="fixed inset-0 z-[999] bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full max-w-lg h-[94vh] sm:h-[820px] bg-[#F8F6F2] text-[#161412] rounded-t-[36px] sm:rounded-[36px] overflow-hidden flex flex-col justify-between select-none font-sans border border-[#E8DDD0] shadow-2xl relative"
            >
              <div className="px-5 py-4 bg-white border-b border-[#E8DDD0] flex items-center justify-between shadow-xs shrink-0">
                <div 
                  onClick={() => onOpenProfile(activeChatProfile)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#A17B5E] shadow-sm bg-[#260102] shrink-0">
                    <img
                      src={activeChatProfile.photos?.[0] || activeChatProfile.creator_vouch?.creator_avatar_url}
                      alt={activeChatProfile.display_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-serif-editorial text-lg font-bold text-[#161412] leading-tight group-hover:text-[#560406] transition-colors truncate" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                        {activeChatProfile.display_name}
                      </h3>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </div>
                    <p className="text-[11px] text-[#6E6259] truncate font-medium">
                      {activeChatProfile.occupation} • {activeChatProfile.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCallModal(true)}
                    className="p-2.5 rounded-full bg-[#560406]/5 hover:bg-[#560406]/10 text-[#560406] transition-colors cursor-pointer border border-[#A17B5E]/30 shadow-xs"
                    title="Start VIP Family Call"
                  >
                    <Video className="w-4 h-4 text-[#560406]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenProfile(activeChatProfile)}
                    className="p-2.5 rounded-full bg-[#F8F6F2] hover:bg-white text-[#560406] transition-colors cursor-pointer border border-[#E8DDD0] shadow-xs"
                    title="View Bio-Data Dossier"
                  >
                    <User className="w-4 h-4 text-[#560406]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      nativeService.haptic.light();
                      setReportModalProfile(activeChatProfile);
                    }}
                    className="p-2.5 rounded-full bg-[#F8F6F2] hover:bg-white text-rose-700 transition-colors cursor-pointer border border-[#E8DDD0] shadow-xs"
                    title="Report or Block Candidate"
                  >
                    <Flag className="w-4 h-4 text-rose-700" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveChatProfile(null)}
                    className="p-2.5 rounded-full bg-[#F8F6F2] hover:bg-white text-[#6E6259] hover:text-[#161412] transition-colors cursor-pointer border border-[#E8DDD0]"
                    title="Close Chat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-[#F8F6F2]">
                <div className="text-center my-2">
                  <span className="text-[10px] font-bold text-[#560406] bg-white px-4 py-1.5 rounded-full border border-[#E8DDD0] shadow-xs inline-flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#A17B5E]" />
                    <span>Connected via Mannat Bespoke Matchmaking • 256-Bit Encrypted Circle</span>
                  </span>
                </div>

                <div className="text-center py-2 space-y-2">
                  <p className="text-[11px] text-[#6E6259] font-medium">Quick Prompts & Icebreakers:</p>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {[
                      'Namaste! 🙏',
                      'Loved your profile ✨',
                      `Tell me about your work in ${activeChatProfile.city || 'the city'} 💼`,
                      'Would love to schedule a family video call! 📹',
                      'Share horoscope / kundli 🔮'
                    ].map((starter) => (
                      <button
                        key={starter}
                        type="button"
                        onClick={() => handleSendMessage(starter)}
                        className="text-[11px] font-bold text-[#560406] bg-white px-3.5 py-1.5 rounded-full border border-[#E8DDD0] hover:bg-[#F8F6F2] hover:border-[#A17B5E] transition-all cursor-pointer shadow-xs active:scale-95"
                      >
                        {starter}
                      </button>
                    ))}
                  </div>
                </div>

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.is_self ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[82%] px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                        msg.is_self
                          ? 'bg-gradient-to-r from-[#730C0F] to-[#560406] text-[#F5E6D3] rounded-br-none border border-[#A17B5E]/30'
                          : 'bg-white text-[#161412] border border-[#E8DDD0] rounded-bl-none'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.message}</p>
                      <div
                        className={`text-[9px] mt-1.5 flex items-center justify-end gap-1 ${
                          msg.is_self ? 'text-[#D8B486]/80' : 'text-[#6E6259]'
                        }`}
                      >
                        <span>
                          {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {msg.is_self && <CheckCheck className="w-3.5 h-3.5 text-[#D8B486]" />}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-[#6E6259] bg-white border border-[#E8DDD0] px-4 py-2.5 rounded-2xl rounded-bl-none w-fit shadow-xs animate-pulse">
                    <span className="font-semibold text-[#560406]">{activeChatProfile.display_name} is typing</span>
                    <span className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#560406] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#560406] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#560406] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-4 bg-white border-t border-[#E8DDD0] flex items-center gap-2 shrink-0 shadow-lg"
              >
                <button
                  type="button"
                  onClick={handleVoiceNoteSimulate}
                  className="p-2.5 rounded-full bg-[#F8F6F2] hover:bg-white text-[#560406] border border-[#E8DDD0] transition-colors cursor-pointer"
                  title="Send Audio Note"
                >
                  <Mic className="w-4 h-4 text-[#560406]" />
                </button>

                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Message ${activeChatProfile.display_name}...`}
                  className="flex-1 bg-[#F8F6F2] border border-[#E8DDD0] rounded-full px-4 py-3 text-xs text-[#161412] placeholder:text-[#6E6259] focus:outline-none focus:border-[#560406] shadow-xs"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isSending}
                  className="w-11 h-11 rounded-full bg-gradient-to-r from-[#730C0F] to-[#560406] text-[#F5E6D3] hover:brightness-110 disabled:opacity-40 transition-all flex items-center justify-center cursor-pointer shrink-0 shadow-md active:scale-95 border border-[#A17B5E]/40"
                >
                  <Send className="w-4 h-4 text-[#D8B486]" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showCallModal && activeChatProfile && (
        <FamilyCallModal
          isOpen={showCallModal}
          onClose={() => setShowCallModal(false)}
          targetProfile={activeChatProfile}
          onScheduleSuccess={(scheduledAt) => {
            setShowCallModal(false);
            triggerToast(`VIP Video Call confirmed for ${scheduledAt}! 📹`, 'sparkle');
            handleSendMessage(`📹 I have scheduled our Mannat VIP Video Session for ${scheduledAt}. Looking forward!`);
          }}
        />
      )}

      {/* Safety & Moderation Report / Block Modal (Apple Guideline 1.2 Compliance) */}
      <ReportBlockModal
        isOpen={!!reportModalProfile}
        profile={reportModalProfile}
        onClose={() => setReportModalProfile(null)}
        onBlockSuccess={(blockedId) => {
          setAcceptedList((prev) => prev.filter((p) => p.id !== blockedId));
          setSentList((prev) => prev.filter((p) => p.id !== blockedId));
          setReceivedList((prev) => prev.filter((p) => p.id !== blockedId));
          if (activeChatProfile?.id === blockedId) {
            setActiveChatProfile(null);
          }
          triggerToast('Candidate blocked and removed from connections', 'success');
        }}
        onReportSuccess={(_id, _reason) => {
          triggerToast('Report submitted to Trust & Safety', 'sparkle');
        }}
      />
    </div>
  );
};
