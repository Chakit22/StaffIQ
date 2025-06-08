import apiClient from "@/api/client";
import { AxiosError } from "axios";

export default function useRole() {
  // Hook to get all roles
  const getAllRoles = async () => {
    try {
      const response = await apiClient.get("/api/roles");
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching roles", error);
      const axiosError = error as AxiosError;
      return axiosError.response?.data;
    }
  };

  return {
    getAllRoles,
  };
}
