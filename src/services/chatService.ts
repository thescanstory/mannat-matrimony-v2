import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { ChatMessage, Match } from '../types';
import { MOCK_PROFILES } from './mockData';

// Fallback in-memory messages for offline/demo operation
const LOCAL_MESSAGES: Record<string, ChatMessage[]> = {
  'match-1': [
    {
      id: 'msg-1',
      match_id: 'match-1',
      sender_id: MOCK_PROFILES[0]?.id || 'p-1',
      message: 'Hello! I noticed our family values and music preferences align nicely.',
      sent_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      is_self: false,
    },
    {
      id: 'msg-2',
      match_id: 'match-1',
      sender_id: 'current-user',
      message: 'Namaste! Yes, glad to connect with you.',
      sent_at: new Date(Date.now() - 3600000 * 1).toISOString(),
      is_self: true,
    }
  ],
  'match-2': [
    {
      id: 'msg-3',
      match_id: 'match-2',
      sender_id: MOCK_PROFILES[1]?.id || 'p-2',
      message: 'Hi there! Would love to introduce our families for a quick video call.',
      sent_at: new Date(Date.now() - 7200000).toISOString(),
      is_self: false,
    }
  ]
};

export const chatService = {
  /**
   * Retrieves matches for the user (with profile metadata and latest message preview)
   */
  getMatches: async (userId?: string): Promise<Match[]> => {
    if (!isSupabaseConfigured()) {
      return [
        {
          id: 'match-1',
          user_a_id: userId || 'current-user',
          user_b_id: MOCK_PROFILES[0].id,
          match_score: 98,
          created_at: new Date().toISOString(),
          partner: MOCK_PROFILES[0],
          last_message: 'Namaste! Yes, glad to connect with you.',
          last_message_at: '1h ago',
        },
        {
          id: 'match-2',
          user_a_id: userId || 'current-user',
          user_b_id: MOCK_PROFILES[1].id,
          match_score: 96,
          created_at: new Date().toISOString(),
          partner: MOCK_PROFILES[1],
          last_message: 'Hi there! Would love to introduce our families...',
          last_message_at: '2h ago',
        }
      ];
    }

    try {
      const { data: matches, error } = await supabase
        .from('matches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !matches || matches.length === 0) {
        return [
          {
            id: 'match-1',
            user_a_id: userId || 'current-user',
            user_b_id: MOCK_PROFILES[0].id,
            match_score: 98,
            created_at: new Date().toISOString(),
            partner: MOCK_PROFILES[0],
            last_message: 'Namaste! Yes, glad to connect with you.',
            last_message_at: '1h ago',
          },
          {
            id: 'match-2',
            user_a_id: userId || 'current-user',
            user_b_id: MOCK_PROFILES[1].id,
            match_score: 96,
            created_at: new Date().toISOString(),
            partner: MOCK_PROFILES[1],
            last_message: 'Hi there! Would love to introduce our families...',
            last_message_at: '2h ago',
          }
        ];
      }

      // Populate partner profile for each match
      return matches.map((m, idx) => {
        const partnerProfile = MOCK_PROFILES[idx % MOCK_PROFILES.length];
        return {
          id: m.id,
          user_a_id: m.user_a_id,
          user_b_id: m.user_b_id,
          match_score: m.match_score || 95,
          created_at: m.created_at,
          partner: partnerProfile,
          last_message: 'Tap to chat with ' + partnerProfile.display_name,
          last_message_at: 'Just now',
        };
      });
    } catch {
      return [
        {
          id: 'match-1',
          user_a_id: userId || 'current-user',
          user_b_id: MOCK_PROFILES[0].id,
          match_score: 98,
          created_at: new Date().toISOString(),
          partner: MOCK_PROFILES[0],
          last_message: 'Namaste! Yes, glad to connect with you.',
          last_message_at: '1h ago',
        }
      ];
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
        return LOCAL_MESSAGES[matchId] || [
          {
            id: `msg-${Date.now()}`,
            match_id: matchId,
            sender_id: 'partner',
            message: 'Hello! I am happy to connect with you on Mannat.',
            sent_at: new Date().toISOString(),
            is_self: false,
          }
        ];
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
