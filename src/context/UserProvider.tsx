"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types/User";
import { DEFAULT_USERS } from "@/utils/default-users";
import { useLoading } from "./LoadingProvider";

interface AuthContextType {
  user: User | null;
  users: User[];
  userLoading: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { loadingStates, setLoading } = useLoading();
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  // Get the users form local storage and also set the users in the variable accessigble everywhere
  useEffect(() => {
    // Initialize users from localStorage or use defaults
    console.log("Inside useEffect of UserProvider");
    const storedUsers = localStorage.getItem("users");
    if (!storedUsers) {
      localStorage.setItem("users", JSON.stringify(DEFAULT_USERS));
      setUsers(DEFAULT_USERS);
    } else {
      setUsers(JSON.parse(storedUsers));
    }

    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading("userLoading", false);
  }, []);

  const login = (email: string, password: string): boolean => {
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  console.log("Inside User Provider!");

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
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
