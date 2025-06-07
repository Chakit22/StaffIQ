import { AxiosError } from "axios";
import apiClient from "@/api/client";
import { User } from "@/types/User";
import { useAuthContext } from "@/context/UserProvider";

// Custom Hooks to handle all the authentication logic
export default function useAuth() {
  const { setUser } = useAuthContext();

  // Hook to register a user
  const registerUser = async (userData: User) => {
    try {
      const response = await apiClient.post("/api/auth/register", userData);
      return response.data;
    } catch (error: unknown) {
      console.error("Error registering user", error);
      const axiosError = error as AxiosError;
      return axiosError.response?.data;
    }
  };

  // Hook to login a user
  const loginUser = async (userData: { email: string; password: string }) => {
    try {
      const response = await apiClient.post("/api/auth/login", userData);
      // Update context with the user data
      setUser(response.data.body.user);
      return response.data;
    } catch (error: unknown) {
      console.error("Error logging in user", error);
      const axiosError = error as AxiosError;
      return axiosError.response?.data;
    }
  };

  // Hook to logout a user
  const logoutUser = async () => {
    try {
      const response = await apiClient.post("/api/auth/logout");
      // Clear user from context
      setUser(null);
      return response.data;
    } catch (error: unknown) {
      console.error("Error logging out user", error);
      const axiosError = error as AxiosError;
      return axiosError.response?.data;
    }
  };

  return {
    registerUser,
    loginUser,
    logoutUser,
  };
}
