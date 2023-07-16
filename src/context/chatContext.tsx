import { createContext, type ReactNode } from "react";
import useChat from "@/hooks/chat";
import { Message } from "./messageContext";
import { User } from "./authContext";

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

export interface ChatMapped {
  _id: string;
  participant: Participant;
  lastMessage: Message["message"] | undefined;
}

export interface ChatContext {
  chats: ChatMapped[];
  chat: ChatMapped | null;
  loading: boolean;
  error: string | null;
  getChats: () => void;
  getChat: () => void;
  createChat: (participants: Participant["_id"][]) => void;
  deleteChat: (id: string) => void;
  searchChats: (participantName: Participant["name"]) => void;
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
  searchChats: () => {},
};

interface ChatProviderProps {
  children: ReactNode;
  token: string;
  user: User;
}

export const ChatContext = createContext<ChatContext>(initialChatContext);

export const ChatProvider = ({ children, token, user }: ChatProviderProps) => {
  const value = useChat(token, user);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
