import { AuthContext } from "@/context/authContext";
import { ChatProvider } from "@/context/chatContext";
import { MessageProvider } from "@/context/messageContext";
import { SocketProvider } from "@/context/socket";
import { getCookie } from "cookies-next";
import { ReactNode, useContext } from "react";

export default function AuthConsumer({ children }: { children: ReactNode }) {
  const { user } = useContext(AuthContext);
  const token = (user?.token || getCookie("token")) as string;

  if (!token) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <SocketProvider token={token}>
      <ChatProvider token={token} user={user.user}>
        <MessageProvider token={token} user={user.user}>{children}</MessageProvider>
      </ChatProvider>
    </SocketProvider>
  );
}
