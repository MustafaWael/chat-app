import { AuthContext } from "@/context/authContext";
import { Inter } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Signup() {
  const { register, user, loading, error } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    register({ name, email, password });
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <main
      className={`${inter.className} w-screen min-h-screen grid place-content-center bg-gray-50 p-4`}
    >
      <div className="w-full md:w-96 p-6 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center">
        <h1 className="text-3xl text-center mb-6">Create an account</h1>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            type="text"
            name="name"
            placeholder="Username"
            className="w-full md:w-80 h-12 border border-gray-300 rounded-lg px-3 mb-3"
          />
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
            className="w-full md:w-80 h-12 bg-blue-500 text-white rounded-lg"
            disabled={loading}
          >
            Signup {loading && <span className="ml-2">Loading...</span>}
          </button>
        </form>
      </div>
      <h2 className="text-center">
        Did you have an account?{" "}
        <Link href="/" className="text-blue-500">
          Signin
        </Link>
      </h2>
    </main>
  );
}
