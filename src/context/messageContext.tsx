import { createContext, type ReactNode } from "react";
import useMessage from "@/hooks/message";
import useAuth from "@/hooks/auth";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";

export interface Message {
  _id: string;
  sender: string;
  receiver: string;
  chatId: string;
  message: string;
  status: "pending" | "sent" | "read";
  timeStamp: Date;
}

export interface MessageContext {
  messages: Message[];
  loading: boolean;
  error: string | null;
  getMessages: () => void;
  sendMessage: (message: string, chatId: string) => void;
  deleteMessage: (id: string) => void;
  editMessage: (id: string, message: string) => void;
  createMessage: (message: Message["message"]) => void;
  updateMessage: (id: string, message: Message["message"]) => void;
}

export const initialMessageContext: MessageContext = {
  messages: [],
  loading: false,
  error: null,
  getMessages: () => {},
  sendMessage: () => {},
  deleteMessage: () => {},
  editMessage: () => {},
  createMessage: () => {},
  updateMessage: () => {},
};

export const MessageContext = createContext<MessageContext>(
  initialMessageContext
);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const token = (user?.token || getCookie("token")) as string;
  const { chatId } = router.query as { chatId: string };

  const value = useMessage({ token, chatId });

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};