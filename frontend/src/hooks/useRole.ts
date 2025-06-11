import apiClient from "@/api/client";
import { ApiResponse } from "@/types/Api";
import { handleApiError } from "@/utils/handleApiError";

export default function useRole() {
  // Hook to get all roles
  const getAllRoles = async (): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get("/api/roles");
      return {
        success: response.data.success,
        message: response.data.message,
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error fetching roles", error);
      return handleApiError(error);
    }
  };

  return { getAllRoles };
}
