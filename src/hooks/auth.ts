import {
  AuthContext,
  AuthentecatedUser,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/context/authContext";
import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { api } from "@/api";
import { setCookie, deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";

export default function useAuth(): AuthContext {
  // state
  const [user, setUser] = useState<AuthentecatedUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // actions
  const login = async ({ email, password }: LoginCredentials) => {
    setLoading(true);
    try {
      const { data } = await api.post("/users/login", {
        email,
        password,
      });

      setUser(data);
      setCookie("token", data.token, { maxAge: 30 * 24 * 60 * 60 });
    } catch (error) {
      if (error instanceof AxiosError) {
        return setError(error.response?.data.error);
      }

      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password }: RegisterCredentials) => {
    setLoading(true);
    try {
      const { data } = await api.post("/users/signup", {
        name,
        email,
        password,
      });

      setUser(data);
      setCookie("token", data.token, { maxAge: 30 * 24 * 60 * 60 });
    } catch (error) {
      if (error instanceof AxiosError) {
        return setError(error.response?.data.error);
      }

      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const token = getCookie("token");

    if (!token) {
      return setError("You are not logged in");
    }

    setLoading(true);
    try {
      await api.post("/users/logout", null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(null);
      deleteCookie("token");
      router.replace("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        return setError(error.response?.data.error);
      }

      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getUser = async () => {
    const token = getCookie("token");

    if (!token) {
      return setError("You are not logged in");
    }

    setLoading(true);
    try {
      const { data }: { data: User } = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser({
        user: data,
        token: token as string,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        return setError(error.response?.data.error);
      }

      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = (getCookie("token") as string) || null;

    if (token) {
      getUser();
    }
  }, []);

  return {
    login,
    logout,
    register,
    user,
    loading,
    error,
  };
}
