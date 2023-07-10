import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Signup() {
  return <main className={`${inter.className}`}>Signup</main>;
}
