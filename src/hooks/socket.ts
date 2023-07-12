import { SocketContext } from "@/context/socket";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useSocket(token: string): SocketContext {
  const [socket, setSocket] = useState<SocketContext["socket"]>(null);

  useEffect(() => {
    const socket = io("http://localhost:4000", {
      auth: { token },
    });

    setSocket(socket);
  }, [token]);

  return { socket };
}
