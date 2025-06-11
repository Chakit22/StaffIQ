import apiClient from "@/api/client";
import { ApiResponse } from "@/types/Api";
import { handleApiError } from "@/utils/handleApiError";

export default function useAvailability() {
  // Hook to get all availabilities
  const getAllAvailabilities = async (): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get("/api/availabilities");
      return {
        success: response.data.success,
        message: response.data.message,
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error fetching availabilities", error);
      return handleApiError(error);
    }
  };

  return { getAllAvailabilities };
}
