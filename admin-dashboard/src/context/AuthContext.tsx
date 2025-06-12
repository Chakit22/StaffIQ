import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useMutation, gql } from "@apollo/client";

const ADMIN_LOGIN_MUTATION = gql`
  mutation AdminLogin($email: String!, $password: String!) {
    adminLogin(input: { email: $email, password: $password }) {
      token
      admin {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  user: {
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
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
    firstName?: string;
    lastName?: string;
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
        firstName: savedFirstName || undefined,
        lastName: savedLastName || undefined,
        id: savedId || undefined,
      });
    }
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      // Simple validation for "admin", "admin" credentials
      if (username === "admin" && password === "admin") {
        // Use these hardcoded values for now
        const role = "admin";
        const token = "mock-token";

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("email", username);

        setAuthenticated(true);
        setRole(role);
        setUser({ email: username, role });
        return true;
      }

      // Use real GraphQL login as fallback if simple credentials don't match
      try {
        const res = await loginMutation({
          variables: {
            email: username,
            password: password,
          },
        });

        if (res.data?.adminLogin?.token) {
          const { token, admin } = res.data.adminLogin;

          localStorage.setItem("token", token);
          localStorage.setItem("role", admin.role);
          localStorage.setItem("email", admin.email);

          if (admin.firstName)
            localStorage.setItem("firstName", admin.firstName);
          if (admin.lastName) localStorage.setItem("lastName", admin.lastName);
          if (admin.id) localStorage.setItem("id", admin.id);

          setAuthenticated(true);
          setRole(admin.role);
          setUser({
            email: admin.email,
            role: admin.role,
            firstName: admin.firstName,
            lastName: admin.lastName,
            id: admin.id,
          });

          return true;
        }
      } catch (graphqlError) {
        console.error("GraphQL login error:", graphqlError);
      }

      // fallback if incorrect credentials
      return false;
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
