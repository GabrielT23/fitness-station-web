"use client"

import { createContext, useContext, useEffect, useState, ReactNode, SetStateAction, Dispatch } from "react";
import Cookies from "js-cookie";

interface User {
  userId: string;
  companyId: string;
}

interface UseAuthReturn {
  user: User | null;
  token: string | null;
  setToken: Dispatch<SetStateAction<string>>
}

const AuthContext = createContext<UseAuthReturn | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const userId = Cookies.get("userId");
    const companyId = Cookies.get("companyId");
    const cookieToken = Cookies.get("access_token");
    setToken(cookieToken ? cookieToken : '');
    if (userId && companyId) {
      setUser({ userId, companyId });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): UseAuthReturn => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};