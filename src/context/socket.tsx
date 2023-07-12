import useSocket from "@/hooks/socket";
import { ReactNode, createContext } from "react";
import { Socket } from "socket.io-client";

interface Message {
  message: string;
  chatId: string;
}

export interface ServerToClientEvents {
  message(message: Message): void;
  online(userId: string): void;
}

export interface ClientToServerEvents {
  message: (message: Message) => void;
  online: (data: { isOnline: boolean; userId: string }) => void;
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
