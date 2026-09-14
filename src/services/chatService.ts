import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { ChatMessage, Match, Profile } from '../types';

function getStoredMessages(matchId: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(`mannat_chat_${matchId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function setStoredMessages(matchId: string, msgs: ChatMessage[]) {
  try {
    localStorage.setItem(`mannat_chat_${matchId}`, JSON.stringify(msgs));
  } catch {}
}

export const chatService = {
  /**
   * Retrieves matches for the user (with profile metadata and latest message preview)
   */
  getMatches: async (_userId?: string): Promise<Match[]> => {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      const { data: matches, error } = await supabase
        .from('matches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !matches || matches.length === 0) {
        return [];
      }

      return matches.map((m) => {
        const partnerProfile = m.partner_profile || null;
        return {
          id: m.id,
          user_a_id: m.user_a_id,
          user_b_id: m.user_b_id,
          match_score: m.match_score || 95,
          created_at: m.created_at,
          partner: partnerProfile,
          last_message: m.last_message || 'No messages yet',
          last_message_at: m.last_message_at || 'Just now',
        };
      });
    } catch {
      return [];
    }
  },

  /**
   * Fetches messages for a specific match
   */
  getMessages: async (matchId: string, currentUserId?: string, candidate?: Profile): Promise<ChatMessage[]> => {
    const local = getStoredMessages(matchId);
    if (local.length > 0) {
      return local;
    }

    if (!isSupabaseConfigured()) {
      // Create initial welcoming greeting from candidate if first time
      if (candidate) {
        const initialGreeting: ChatMessage = {
          id: `msg-init-${matchId}`,
          match_id: matchId,
          sender_id: candidate.id,
          message: `Namaste! 🙏 Delighted to connect with you on Mannat. Looking forward to our conversation!`,
          sent_at: new Date(Date.now() - 3600000).toISOString(),
          is_self: false,
        };
        const initial = [initialGreeting];
        setStoredMessages(matchId, initial);
        return initial;
      }
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('match_id', matchId)
        .order('sent_at', { ascending: true });

      if (error || !data || data.length === 0) {
        return local;
      }

      const msgs = data.map((item) => ({
        id: item.id,
        match_id: item.match_id,
        sender_id: item.sender_id,
        message: item.message,
        sent_at: item.sent_at,
        is_self: item.sender_id === (currentUserId || 'current-user'),
      }));

      setStoredMessages(matchId, msgs);
      return msgs;
    } catch {
      return local;
    }
  },

  /**
   * Sends a new chat message
   */
  sendMessage: async (
    matchId: string,
    senderId: string,
    messageText: string
  ): Promise<ChatMessage> => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      match_id: matchId,
      sender_id: senderId,
      message: messageText.trim(),
      sent_at: new Date().toISOString(),
      is_self: true,
    };

    const current = getStoredMessages(matchId);
    const updated = [...current, newMsg];
    setStoredMessages(matchId, updated);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('chats').insert([
          {
            match_id: matchId,
            sender_id: senderId,
            message: messageText.trim(),
          }
        ]);
      } catch (err) {
        console.warn('Supabase message insert fallback:', err);
      }
    }

    return newMsg;
  },

  /**
   * Adds an incoming reply from candidate
   */
  receiveCandidateMessage: (
    matchId: string,
    candidateId: string,
    text: string
  ): ChatMessage => {
    const newMsg: ChatMessage = {
      id: `msg-reply-${Date.now()}`,
      match_id: matchId,
      sender_id: candidateId,
      message: text,
      sent_at: new Date().toISOString(),
      is_self: false,
    };

    const current = getStoredMessages(matchId);
    const updated = [...current, newMsg];
    setStoredMessages(matchId, updated);
    return newMsg;
  },

  /**
   * Realtime subscription for live chats
   */
  subscribeToMatchChats: (
    matchId: string,
    currentUserId: string,
    onNewMessage: (msg: ChatMessage) => void
  ) => {
    if (!isSupabaseConfigured()) {
      return () => {};
    }

    const channel = supabase
      .channel(`chats:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chats',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const raw = payload.new as any;
          if (raw) {
            onNewMessage({
              id: raw.id,
              match_id: raw.match_id,
              sender_id: raw.sender_id,
              message: raw.message,
              sent_at: raw.sent_at,
              is_self: raw.sender_id === currentUserId,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
