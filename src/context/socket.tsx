import useSocket from "@/hooks/socket";
import { ReactNode, createContext } from "react";
import { Socket } from "socket.io-client";

interface Message {
  _id: string;
  sender: { _id: string };
  receiver: { _id: string };
  chatId: string;
  message: string;
  status: "pending" | "sent" | "read";
  timeStamp: Date;
}

interface MessageFromClient {
  message: string;
  chatId: string;
  timeStamp: Date;
}
export interface ServerToClientEvents {
  message(message: Message): void;
  online({ userId, isOnline }: { userId: string; isOnline: boolean }): void;
  getOnlineSocket({
    userId,
    isOnline,
  }: {
    userId: string;
    isOnline: boolean;
  }): void;
}
export interface ClientToServerEvents {
  message: (message: MessageFromClient) => void;
  online: (data: { isOnline: boolean; userId: string }) => void;
  getOnlineSocket: (
    data: { userId: string },
    response: (data: { isOnline: boolean; userId: string }) => void
  ) => void;
}

export interface SocketContext {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
}

const initialState: SocketContext = {
  socket: null,
};

interface SocketProviderProps {
  children: ReactNode;
  token: string;
}

export const SocketContext = createContext<SocketContext>(initialState);

export const SocketProvider = ({ children, token }: SocketProviderProps) => {
  const value = useSocket(token);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
