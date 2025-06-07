import apiClient from "@/api/client";
import { AxiosError } from "axios";

export default function useUser() {
  // Hook to get details of a particular user
  const getUserDetails = async (userId: string) => {
    try {
      const response = await apiClient.get(`/api/users/${userId}`);
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching user details", error);
      const axiosError = error as AxiosError;
      return axiosError.response?.data;
    }
  };

  // Hook to get all experiences of a candidate
  const getAllExperiences = async (userId: string) => {
    try {
      const response = await apiClient.get(`/api/users/${userId}/experiences`);
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching experiences", error);
      const axiosError = error as AxiosError;
      return axiosError.response?.data;
    }
  };

  // Hook to get all courses assigned to the current lecturer
  const getAllCoursesAssigned = async (lecturerId: string) => {
    try {
      const response = await apiClient.get(
        `/api/users/lecturer/${lecturerId}/assigned-courses`
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching courses for lecturer", error);
      const axiosError = error as AxiosError;
      return axiosError.response?.data;
    }
  };

  // Hook to get all applications of a candidate
  const getAllApplicationsOfCandidate = async (userId: string) => {
    try {
      const response = await apiClient.get(`/api/users/${userId}/applications`);
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching applications of candidate", error);
      const axiosError = error as AxiosError;
      return axiosError.response?.data;
    }
  };

  return {
    getUserDetails,
    getAllExperiences,
    getAllCoursesAssigned,
    getAllApplicationsOfCandidate,
  };
}
