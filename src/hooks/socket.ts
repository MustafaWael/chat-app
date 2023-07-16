import { SocketContext } from "@/context/socket";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useSocket(token: string): SocketContext {
  const [socket, setSocket] = useState<SocketContext["socket"]>(null);

  useEffect(() => {
    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000",
      {
        auth: { token },
        autoConnect: false,
      }
    );

    setSocket(socket);
  }, [token]);

  return { socket };
}
