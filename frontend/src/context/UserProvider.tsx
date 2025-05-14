"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types/User";
import { useLoading } from "./LoadingProvider";
import { login as loginApi } from "@/services/auth"; // Axios-based login

interface AuthContextType {
  user: User | null;
  userLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { loadingStates, setLoading } = useLoading();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
  const storedUser = localStorage.getItem("currentUser");

  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      if (["candidate", "lecturer"].includes(parsed.role)) {
        setUser(parsed);
      } else {
        localStorage.removeItem("currentUser");
      }
    } catch {
      localStorage.removeItem("currentUser");
    }
  }

  setLoading("userLoading", false);
}, []);


  const login = async (email: string, password: string): Promise<boolean> => {
    const res = await loginApi(email, password); // call backend API
    if (res.success) {
      setUser(res.user);
      localStorage.setItem("currentUser", JSON.stringify(res.user)); // store for persistence
      return true;
    } else {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userLoading: loadingStates["userLoading"],
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
