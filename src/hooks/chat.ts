import { api } from "@/api";
import {
  Chat,
  ChatContext,
  ChatMapped,
  Participant,
} from "@/context/chatContext";
import { chatsMapper } from "@/utils";
import { useState, useEffect, useCallback } from "react";
import { User } from "@/context/authContext";
import { useRouter } from "next/router";

export default function useChat(token: string, user: User): ChatContext {
  // state
  const [chats, setChats] = useState<ChatMapped[]>([]);
  const [chat, setChat] = useState<ChatMapped | null>(null);
  const [filteredChats, setFilteredChats] = useState<ChatMapped[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { chatId } = router.query;

  // actions
  const getChats = async () => {
    setLoading(true);
    try {
      const { data }: { data: Chat[] } = await api.get(`/chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const chatsMapped = chatsMapper(data, user.email);
      setChats(chatsMapped);
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getChat = useCallback(async () => {
    setLoading(true);
    try {
      if (!chatId) return;
      const { data } = await api.get(`/chats/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const ChatMapped = chatsMapper([data], user.email)[0];
      setChat(ChatMapped);
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [token, chatId, user.email]);

  const createChat = async (participants: Participant["_id"][]) => {
    setLoading(true);
    try {
      await api.post(
        `/chats`,
        {
          participants,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      getChats();
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const deleteChat = async () => {};

  const searchChats = (participantName: string): void => {
    const filteredChats = chats.filter((chat) =>
      chat.participant.name
        .toLowerCase()
        .includes(participantName.toLowerCase())
    );
    setFilteredChats(filteredChats);
  };

  useEffect(() => {
    if (!chatId) {
      setChat(null);
      return;
    }
  }, [chatId]);

  return {
    chats: filteredChats.length ? filteredChats : chats,
    chat,
    loading,
    error,
    getChats,
    getChat,
    createChat,
    deleteChat,
    searchChats,
  };
}
