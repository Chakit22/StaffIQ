import apiClient from "@/api/client";
import { CreateApplicationSchema } from "@/schemas/applications/create-application.schema";
import { AxiosError } from "axios";
import { UpdateApplicationRankingSchema } from "@/schemas/applications/update-application-ranking.schema";
import { UpdateApplicationCommentSchema } from "@/schemas/applications/update-application-comment.schema";

// Custom Hooks to handle all the application logic
export default function useApplication() {
  // Hook to create an application
  const createNewApplication = async (
    applicationData: CreateApplicationSchema
  ) => {
    try {
      const response = await apiClient.post(
        "/api/applications",
        applicationData
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error creating application", error);
      const axiosError = error as AxiosError;
      return axiosError.response?.data;
    }
  };

  // Hook for selecting a candidate / updating a rank
  // Basically if a rank is updated for a candidate he is selected by default
  const selectCandidate = async (rankings: UpdateApplicationRankingSchema) => {
    try {
      const response = await apiClient.patch(
        `/api/applications/rankings/batch`,
        rankings
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error updating application ranking", error);
      const axiosError = error as AxiosError;
      return axiosError.response?.data;
    }
  };

  // Hook to update comments on an application
  const updateComment = async (comment: UpdateApplicationCommentSchema) => {
    try {
      const response = await apiClient.put(
        `/api/applications/comment`,
        comment
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error updating comment", error);
      const axiosError = error as AxiosError;
      return axiosError.response?.data;
    }
  };

  return {
    createNewApplication,
    selectCandidate,
    updateComment,
  };
}
