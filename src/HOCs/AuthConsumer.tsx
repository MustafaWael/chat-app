import { AuthContext } from "@/context/authContext";
import { ChatProvider } from "@/context/chatContext";
import { MessageProvider } from "@/context/messageContext";
import { SocketProvider } from "@/context/socket";
import { getCookie } from "cookies-next";
import { ReactNode, useContext } from "react";

export default function AuthConsumer({ children }: { children: ReactNode }) {
  const { user } = useContext(AuthContext);
  const token = (user?.token || getCookie("token")) as string;

  return (
    <SocketProvider token={token}>
      <ChatProvider token={token}>
        <MessageProvider token={token}>{children}</MessageProvider>
      </ChatProvider>
    </SocketProvider>
  );
}
