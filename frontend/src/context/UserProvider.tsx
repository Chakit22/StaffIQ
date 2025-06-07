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

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
