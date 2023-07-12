import { api } from "@/api";
import { Message, MessageContext } from "@/context/messageContext";
import { SocketContext } from "@/context/socket";
import { useState } from "react";
import { useContext, useEffect } from "react";

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

  const { socket } = useContext(SocketContext);

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

  const sendMessage = (message: string, chatId: string) => {
    socket?.emit("message", { message, chatId });
  };

  const editMessage = (message: string, chatId: string) => {};

  // Call onReceiveMessage when socket is ready
  useEffect(() => {
    const onReceiveMessage = () => {
      socket?.on("message", (message) => {
        console.log(message);
      });
    };

    onReceiveMessage();
  }, [socket]);

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
