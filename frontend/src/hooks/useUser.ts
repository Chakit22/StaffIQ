import apiClient from "@/api/client";
import { ApiResponse } from "@/types/Api";
import { handleApiError } from "@/utils/handleApiError";

export default function useUser() {
  // Hook to get details of a particular user
  const getUserDetails = async (userId: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get(`/api/users/${userId}`);
      return {
        success: response.data.success,
        message: response.data.message,
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error fetching user details", error);
      return handleApiError(error);
    }
  };

  // Hook to get all experiences of a candidate
  const getAllExperiences = async (userId: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get(`/api/users/${userId}/experiences`);
      return {
        success: response.data.success,
        message: response.data.message,
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error fetching experiences", error);
      return handleApiError(error);
    }
  };

  // Hook to get all courses assigned to the current lecturer
  const getAllCoursesAssigned = async (
    lecturerId: string
  ): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get(
        `/api/users/lecturer/${lecturerId}/assigned-courses`
      );
      return {
        success: response.data.success,
        message: response.data.message,
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error fetching courses for lecturer", error);
      return handleApiError(error);
    }
  };

  // Hook to get all applications of a candidate
  const getAllApplicationsOfCandidate = async (
    userId: string
  ): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get(`/api/users/${userId}/applications`);
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching applications of candidate", error);
      return handleApiError(error);
    }
  };

  return {
    getUserDetails,
    getAllExperiences,
    getAllCoursesAssigned,
    getAllApplicationsOfCandidate,
  };
}
