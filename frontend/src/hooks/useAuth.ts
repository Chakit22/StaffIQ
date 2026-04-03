import apiClient from "@/api/client";
import { RegisterUserSchema } from "@/schemas/auth/register.schema";
import { useAuthContext } from "@/context/UserProvider";
import { LoginUserSchema } from "@/schemas/auth/login.schema";
import { ApiResponse } from "@/types/Api";
import { handleApiError } from "@/utils/handleApiError";

// Custom Hooks to handle all the authentication logic
export default function useAuth() {
  const { setUser } = useAuthContext();

  // Hook to register a user
  const registerUser = async (
    userData: RegisterUserSchema,
    captchaToken: string,
  ): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post("/api/auth/register", {
        ...userData,
        captchaToken,
      });

      return {
        success: response.data.success,
        message: response.data.message,
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error registering user", error);
      return handleApiError(error);
    }
  };

  // Hook to login a user
  const loginUser = async (
    userData: LoginUserSchema,
    captchaToken: string,
  ): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post("/api/auth/login", {
        ...userData,
        captchaToken,
      });
      // Update context with the user data
      setUser(response.data.body.user);
      return {
        success: response.data.success,
        message: response.data.message,
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error logging in user", error);
      return handleApiError(error);
    }
  };

  // Hook to logout a user
  const logoutUser = async (): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post("/api/auth/logout");
      // Clear user from context
      setUser(null);
      return {
        success: response.data.success,
        message: response.data.message,
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error logging out user", error);
      return handleApiError(error);
    }
  };

  return {
    registerUser,
    loginUser,
    logoutUser,
  };
}
