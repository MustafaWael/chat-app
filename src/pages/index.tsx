import { AuthContext } from "@/context/authContext";
import { Inter } from "next/font/google";
import { useContext } from "react";

const inter = Inter({ subsets: ["latin"] });

const credientials = {
  email: "mustafa.wael.dev@gmail.com",
  password: "mustafa00000",
};

const registerCredientials = {
  name: "from frontend",
  email: "from.",
  password: "frontend",
};

export default function Home() {
  const { login, register, logout, user, loading, error } =
    useContext(AuthContext);

  return (
    <main className={`${inter.className}`}>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {user && <p>{user.user.name}</p>}
      <button onClick={() => login(credientials)}>Login</button>

      <br />
      <br />

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {user && <p>{user.user.name}</p>}
      <button onClick={() => register(registerCredientials)}>Register</button>

      <br />
      <br />

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {user && <p>{user?.user?.name}</p>}
      <button onClick={logout}>Logout</button>
    </main>
  );
}
