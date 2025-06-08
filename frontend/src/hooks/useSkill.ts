import apiClient from "@/api/client";
import { AxiosError } from "axios";

export default function useSkill() {
  // Hook to get all skills
  const getAllSkills = async () => {
    try {
      const response = await apiClient.get("/api/skills");
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching skills", error);
      const axiosError = error as AxiosError;
      return axiosError.response?.data;
    }
  };

  return { getAllSkills };
}
