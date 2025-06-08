import apiClient from "@/api/client";
import { AxiosError } from "axios";

export default function useAvailability() {
  // Hook to get all availabilities
  const getAllAvailabilities = async () => {
    try {
      const response = await apiClient.get("/api/skills");
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching skills", error);
      const axiosError = error as AxiosError;
      return axiosError.response?.data;
    }
  };

  return { getAllAvailabilities };
}
