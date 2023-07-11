import { api } from "@/api";
import { Chat, ChatContext, Participant } from "@/context/chatContext";
import { useState } from "react";

export default function useChat(token: string): ChatContext {
  // state
  const [chats, setChats] = useState<Chat[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // actions
  const getChats = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setChats(data);
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getChat = async (id: string) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/chats/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setChat(data);
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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

  return {
    chats,
    chat,
    loading,
    error,
    getChats,
    getChat,
    createChat,
    deleteChat,
  };
}
