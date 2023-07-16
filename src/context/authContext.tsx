import useAuth from "@/hooks/auth";
import { ReactNode, createContext } from "react";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface AuthentecatedUser {
  user: User;
  token: string;
}

export interface AuthContext {
  login: ({ email, password }: LoginCredentials) => void;
  register: ({ name, email, password }: RegisterCredentials) => void;
  logout: () => void;

  user: AuthentecatedUser | null;
  loading: boolean;
  error: string | null;
}

const initialAuthContext: AuthContext = {
  user: null,
  loading: false,
  error: null,
  login: () => {},
  register: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContext>(initialAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const value = useAuth();

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
