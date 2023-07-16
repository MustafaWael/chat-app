import { api } from "@/api";
import { User } from "@/context/authContext";
import { Chat, ChatContext } from "@/context/chatContext";
import { Message, MessageContext } from "@/context/messageContext";
import { SocketContext } from "@/context/socket";
import { useState } from "react";
import { useContext, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { formatDate } from "@/utils";

interface MessageHook {
  token: string;
  chatId: string;
  user: User;
}

export default function useMessage({
  token,
  chatId,
  user,
}: MessageHook): MessageContext {
  // state
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { chat } = useContext(ChatContext);

  const { socket } = useContext(SocketContext);

  // actions
  const getMessages = useCallback(async () => {
    setLoading(true);
    try {
      if (!chatId) return;
      const { data } = await api.get(`/messages/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages(data);
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [chatId, token]);

  const getMessageById = useCallback(
    async (
      messageId: Message["_id"],
      chatId: Chat["_id"]
    ): Promise<Message | undefined> => {
      try {
        const { data } = await api.get(`/messages/${chatId}/${messageId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        return data;
      } catch (error) {
        setError("Something went wrong");
      }
    },
    [token]
  );

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

  const sendMessage = (message: string) => {
    const newMessage: Message = {
      _id: uuidv4(),
      chatId,
      receiver: { _id: chat?.participant._id as string },
      sender: { _id: user._id as string },
      status: "pending",
      timeStamp: new Date(),
      message,
    };

    socket?.emit("message", {
      message,
      chatId,
      timeStamp: newMessage.timeStamp,
    });
    
    setMessages((messages) => [...messages, newMessage]);
  };

  const editMessage = (message: string, chatId: string) => {};

  const onReceiveMessage = useCallback(() => {
    socket?.on("message", (message) => {
      chatId === message.chatId &&
        setMessages((messages) => [...messages, { ...message, _id: uuidv4() }]);
    });
  }, [socket, chatId]);

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
    onReceiveMessage,
    getMessageById,
  };
}
