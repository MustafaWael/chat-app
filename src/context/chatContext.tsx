import { createContext, type ReactNode } from "react";
import useChat from "@/hooks/chat";
import useAuth from "@/hooks/auth";
import { getCookie } from "cookies-next";
import { Message } from "./messageContext";

export interface Participant {
  _id: string;
  name: string;
  email: string;
}

export interface Chat {
  _id: string;
  participants: Participant[];
  messages: Message["_id"][];
}

export interface ChatContext {
  chats: Chat[];
  chat: Chat | null;
  loading: boolean;
  error: string | null;
  getChats: () => void;
  getChat: (id: string) => void;
  createChat: (participants: Participant["_id"][]) => void;
  deleteChat: (id: string) => void;
}

export const initialChatContext: ChatContext = {
  chats: [],
  chat: null,
  loading: false,
  error: null,
  getChats: () => {},
  getChat: () => {},
  createChat: () => {},
  deleteChat: () => {},
};

export const ChatContext = createContext<ChatContext>(initialChatContext);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const token = (user?.token || getCookie("token")) as string;
  const value = useChat(token);
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
