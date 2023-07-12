import AuthConsumer from "@/HOCs/AuthConsumer";
import { AuthProvider } from "@/context/authContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AuthConsumer>
        <Component {...pageProps} />
      </AuthConsumer>
    </AuthProvider>
  );
}
