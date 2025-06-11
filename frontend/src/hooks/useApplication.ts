import apiClient from "@/api/client";
import { CreateApplicationSchema } from "@/schemas/applications/create-application.schema";
import { UpdateApplicationRankingSchema } from "@/schemas/applications/update-application-ranking.schema";
import { UpdateApplicationCommentSchema } from "@/schemas/applications/update-application-comment.schema";
import { GetAllApplicationsSchema } from "@/schemas/applications/get-all-applications.schema";
import { ApiResponse } from "@/types/Api";
import { handleApiError } from "@/utils/handleApiError";

// Custom Hooks to handle all the application logic
export default function useApplication() {
  // Hook to create an application
  const createNewApplication = async (
    applicationData: CreateApplicationSchema
  ): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post(
        "/api/applications",
        applicationData
      );
      return {
        success: response.data.success,
        message: response.data.message,
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error creating application", error);
      return handleApiError(error);
    }
  };

  // Hook to get all applications
  const getAllApplications = async (
    query: GetAllApplicationsSchema
  ): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get(`/api/applications`, {
        params: query,
      });
      return {
        success: response.data.success,
        message: response.data.message,
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error getting all applications", error);
      return handleApiError(error);
    }
  };

  // Hook for selecting a candidate / updating a rank
  // Basically if a rank is updated for a candidate he is selected by default
  const selectCandidate = async (
    rankings: UpdateApplicationRankingSchema
  ): Promise<ApiResponse> => {
    try {
      const response = await apiClient.patch(
        `/api/applications/rankings/batch`,
        rankings
      );
      return {
        success: response.data.success,
        message: response.data.message,
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error updating application ranking", error);
      return handleApiError(error);
    }
  };

  // Hook to update comments on an application
  const updateComment = async (
    comment: UpdateApplicationCommentSchema
  ): Promise<ApiResponse> => {
    try {
      const response = await apiClient.put(
        `/api/applications/comment`,
        comment
      );
      return {
        success: response.data.success,
        message: response.data.message,
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error updating comment", error);
      return handleApiError(error);
    }
  };

  return {
    createNewApplication,
    selectCandidate,
    updateComment,
    getAllApplications,
  };
}
