import AuthConsumer from "@/HOCs/AuthConsumer";
import Layout from "@/components/Layout";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function App() {
  return (
    <AuthConsumer>
      <main
        className={`${inter.className} bg-gray-300 w-full md:p-4 flex gap-x-4 overflow-hidden`}
        style={{
          height: "100dvh",
        }}
      >
        <Layout />
      </main>
    </AuthConsumer>
  );
}
