import { api } from "@/api";
import { Message, MessageContext } from "@/context/messageContext";
import { useState } from "react";

interface MessageHook {
  token: string;
  chatId: string;
}

export default function useMessage({
  token,
  chatId,
}: MessageHook): MessageContext {
  // state
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // actions
  const getMessages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/messages/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages(data);
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const createMessage = async (content: Message["message"]) => {
    setLoading(true);
    try {
      await api.post(
        `/messages`,
        {
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      getMessages();
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateMessage = async (
    id: Message["_id"],
    content: Message["message"]
  ) => {
    setLoading(true);
    try {
      await api.put(
        `/messages/${chatId}/${id}`,
        {
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      getMessages();
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: Message["_id"]) => {
    setLoading(true);
    try {
      await api.delete(`/messages/${chatId}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      getMessages();
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = (message: string, chatId: string) => {};

  const editMessage = (message: string, chatId: string) => {};

  return {
    messages,
    loading,
    error,
    getMessages,
    createMessage,
    updateMessage,
    deleteMessage,
    sendMessage,
    editMessage,
  };
}
