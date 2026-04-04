import apiClient from "@/api/client";
import { ApiResponse } from "@/types/Api";
import { handleApiError } from "@/utils/handleApiError";

export default function usePosition() {
  const getAllPositions = async (): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get("/api/positions");
      return {
        success: response.data.success,
        message: response.data.message,
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error getting positions", error);
      return handleApiError(error);
    }
  };

  const getPositionById = async (id: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get(`/api/positions/${id}`);
      return {
        success: response.data.success,
        message: response.data.message,
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error getting position", error);
      return handleApiError(error);
    }
  };

  return {
    getAllPositions,
    getPositionById,
  };
}
