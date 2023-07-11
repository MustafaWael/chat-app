import { AuthProvider } from "@/context/authContext";
import { ChatProvider } from "@/context/chatContext";
import { MessageProvider } from "@/context/messageContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ChatProvider>
        <MessageProvider>
          <Component {...pageProps} />
        </MessageProvider>
      </ChatProvider>
    </AuthProvider>
  );
}
