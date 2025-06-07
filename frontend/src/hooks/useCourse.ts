import apiClient from "@/api/client";
import { AxiosError } from "axios";

export default function useCourse() {
  // Hook to get all applications for a course
  const getAllApplicationsForCourse = async (courseId: string) => {
    try {
      const response = await apiClient.get(
        `/api/courses/${courseId}/applications`
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching applications for course", error);
      const axiosError = error as AxiosError;
      return axiosError.response?.data;
    }
  };

  // Hook to get the statistics of a course
  const getStats = async (courseId: string) => {
    try {
      const response = await apiClient.get(
        `/api/courses/${courseId}/statistics`
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching statistics for course", error);
      const axiosError = error as AxiosError;
      return axiosError.response?.data;
    }
  };

  // Hook to get all preferences set by a lecturer
  const getPreferences = async (courseId: string, lecturerId: string) => {
    try {
      const response = await apiClient.get(
        `/api/courses/${courseId}/lecturer/${lecturerId}/preferences`
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching preferences", error);
      const axiosError = error as AxiosError;
      return axiosError.response?.data;
    }
  };

  return {
    getAllApplicationsForCourse,
    getPreferences,
    getStats,
  };
}
