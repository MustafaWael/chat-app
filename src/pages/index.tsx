import LoadingIcon from "@/components/LoadingIcon";
import { AuthContext } from "@/context/authContext";
import { Inter } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { login, user, loading, error } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    login({ email, password });
  };

  useEffect(() => {
    if (user) {
      router.replace("/app");
    }
  }, [user, router]);

  return (
    <main
      className={`${inter.className} w-screen min-h-screen grid place-content-center bg-gray-50 p-4`}
    >
      <div className="w-full md:w-96 p-6 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center">
        <h1 className="text-3xl text-center mb-6">Login</h1>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full md:w-80 h-12 border border-gray-300 rounded-lg px-3 mb-3"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full md:w-80 h-12 border border-gray-300 rounded-lg px-3 mb-3"
          />
          <button
            type="submit"
            className="w-full md:w-80 h-12 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-x-4"
            disabled={loading}
          >
            <span>Login</span>
            {!user && loading && <LoadingIcon />}
          </button>
        </form>
      </div>
      <h2 className="text-center">
        Did not have an account?{" "}
        <Link href="/signup" className="text-blue-500">
          Signup
        </Link>
      </h2>
    </main>
  );
}
