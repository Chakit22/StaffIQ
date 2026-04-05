/**
 * First time the component renders, it will call the useEffect hook and it will set loading to false and loading won't change
 * to true until you refresh the page
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types/User";
import apiClient from "../api/client";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const handleSetUser = (userData: User | null) => {
    setUser(userData);
  };

  // Load user data from API on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await apiClient.get("/api/auth/me");
        if (response.data.success) {
          setUser(response.data.body);
        }
      } catch {
        // Expected 401 when not logged in — silently ignore
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: handleSetUser,
        loading,
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
