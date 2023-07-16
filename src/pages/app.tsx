import AuthConsumer from "@/HOCs/AuthConsumer";
import Layout from "@/components/Layout";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function App() {
  return (
    <AuthConsumer>
      <main
        className={`${inter.className} bg-gray-300 h-screen w-full md:p-4 flex gap-x-4 overflow-hidden`}
      >
        <Layout />
      </main>
    </AuthConsumer>
  );
}
