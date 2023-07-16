import { createContext, type ReactNode } from "react";
import useMessage from "@/hooks/message";
import { useRouter } from "next/router";
import { User } from "./authContext";

export interface Message {
  _id: string;
  sender: { _id: string };
  receiver: { _id: string };
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
  getMessageById: (messageId: string, chatId: string) => Promise<Message | undefined>;
  sendMessage: (message: string) => void;
  deleteMessage: (id: string) => void;
  editMessage: (id: string, message: string) => void;
  createMessage: (message: Message["message"]) => void;
  updateMessage: (id: string, message: Message["message"]) => void;
  onReceiveMessage: () => void;
}

export const initialMessageContext: MessageContext = {
  messages: [],
  loading: false,
  error: null,
  getMessages: () => {},
  getMessageById: () => Promise.resolve(undefined),
  sendMessage: () => {},
  deleteMessage: () => {},
  editMessage: () => {},
  createMessage: () => {},
  updateMessage: () => {},
  onReceiveMessage: () => {},
};

interface MessageProviderProps {
  children: ReactNode;
  token: string;
  user: User;
}

export const MessageContext = createContext<MessageContext>(
  initialMessageContext
);

export const MessageProvider = ({
  children,
  token,
  user,
}: MessageProviderProps) => {
  const router = useRouter();
  const { chatId } = router.query as { chatId: string };

  const value = useMessage({ token, chatId, user });

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};
