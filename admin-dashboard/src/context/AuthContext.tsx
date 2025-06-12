import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useMutation, gql } from "@apollo/client";
import { ADMIN_LOGIN_MUTATION } from "../graphQL/mutations";

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  user: {
    email: string;
    role: string;
    id?: string;
  } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<{
    email: string;
    role: string;
    id?: string;
  } | null>(null);

  const [loginMutation] = useMutation(ADMIN_LOGIN_MUTATION);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const savedEmail = localStorage.getItem("email");
    const savedFirstName = localStorage.getItem("firstName");
    const savedLastName = localStorage.getItem("lastName");
    const savedId = localStorage.getItem("id");

    if (token && savedRole === "admin" && savedEmail) {
      setAuthenticated(true);
      setRole(savedRole);
      setUser({
        email: savedEmail,
        role: savedRole,
        id: savedId || undefined,
      });
    }
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      // Call the GraphQL mutation to login the admin
      const res = await loginMutation({
        variables: {
          input: {
            username,
            password,
          },
        },
      });

      if (res.data?.adminLogin?.token) {
        const { token, admin } = res.data.adminLogin;

        localStorage.setItem("token", token);
        localStorage.setItem("role", "admin"); // Admin role is fixed
        localStorage.setItem("username", admin.username);

        if (admin.id) localStorage.setItem("id", admin.id);

        setAuthenticated(true);
        setRole("admin");
        setUser({
          email: admin.username, // Using username as email for UI consistency
          role: "admin",
          id: admin.id,
        });

        return true;
      } else {
        console.error("Login failed: No token received");
        return false;
      }
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("id");

    setAuthenticated(false);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, role, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
