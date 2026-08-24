import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { ChatMessage, Match } from '../types';

// In-memory fallback messages disabled — app uses real chat data only.
const LOCAL_MESSAGES: Record<string, ChatMessage[]> = {};

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

            // Populate partner profile for each match
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
  getMessages: async (matchId: string, currentUserId?: string): Promise<ChatMessage[]> => {
    if (!isSupabaseConfigured()) {
      return LOCAL_MESSAGES[matchId] || [];
    }

    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('match_id', matchId)
        .order('sent_at', { ascending: true });

            if (error || !data || data.length === 0) {
        return [];
      }

      return data.map((item) => ({
        id: item.id,
        match_id: item.match_id,
        sender_id: item.sender_id,
        message: item.message,
        sent_at: item.sent_at,
        is_self: item.sender_id === (currentUserId || 'current-user'),
      }));
    } catch {
      return LOCAL_MESSAGES[matchId] || [];
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

    if (!LOCAL_MESSAGES[matchId]) {
      LOCAL_MESSAGES[matchId] = [];
    }
    LOCAL_MESSAGES[matchId].push(newMsg);

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
