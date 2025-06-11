import apiClient from "@/api/client";
import { ApiResponse } from "@/types/Api";
import { handleApiError } from "@/utils/handleApiError";

export default function useSkill() {
  // Hook to get all skills
  const getAllSkills = async (): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get("/api/skills");
      return {
        success: response.data.success,
        message: response.data.message,
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error fetching skills", error);
      return handleApiError(error);
    }
  };

  return { getAllSkills };
}
