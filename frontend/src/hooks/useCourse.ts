import apiClient from "@/api/client";
import { ApiResponse } from "@/types/Api";
import { handleApiError } from "@/utils/handleApiError";

export default function useCourse() {
  // Hook to get all courses
  const getAllCourses = async (): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get("/api/courses");
      return {
        success: response.data.success,
        message: response.data.message,
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error fetching courses", error);
      return handleApiError(error);
    }
  };

  // Hook to get all applications for a course
  const getAllApplicationsForCourse = async (
    courseId: string
  ): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get(
        `/api/courses/${courseId}/applications`
      );
      return {
        success: response.data.success,
        message: response.data.message,
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error fetching applications for course", error);
      return handleApiError(error);
    }
  };

  // Hook to get the statistics of a course
  const getStats = async (courseId: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get(
        `/api/courses/${courseId}/statistics`
      );
      return {
        success: response.data.success,
        message: response.data.message,
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error fetching statistics for course", error);
      return handleApiError(error);
    }
  };

  // Hook to get all preferences set by a lecturer
  const getPreferences = async (
    courseId: string,
    lecturerId: string
  ): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get(
        `/api/courses/${courseId}/lecturer/${lecturerId}/preferences`
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching preferences", error);
      return handleApiError(error);
    }
  };

  return {
    getAllCourses,
    getAllApplicationsForCourse,
    getPreferences,
    getStats,
  };
}
