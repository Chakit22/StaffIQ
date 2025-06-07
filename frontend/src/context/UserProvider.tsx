/**
 * First time the component renders, it will call the useEffect hook and it will set loading to false and loading won't change
 * to true until you refresh the page
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { User } from "../types/User";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Store user data in cookies
  const handleSetUser = (userData: User | null) => {
    setUser(userData);
    if (userData) {
      // logging in
      Cookies.set("user", JSON.stringify(userData), { expires: 7 }); // Store for 7 days
    } else {
      // logging out
      Cookies.remove("user");
    }
  };

  // Load user data from cookies on mount
  useEffect(() => {
    const cookieUser = Cookies.get("user");
    if (cookieUser) {
      try {
        const parsedUser = JSON.parse(cookieUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user from cookie:", error);
        Cookies.remove("user");
      }
    }
    setLoading(false);
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
