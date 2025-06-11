// utils/handleApi.ts

import { AxiosError } from "axios";
import { ApiResponse } from "@/types/Api";

export function handleApiError(error: unknown): ApiResponse {
  const axiosError = error as AxiosError<ApiResponse>;

  return {
    success: axiosError.response?.data?.success || false,
    message: axiosError.response?.data?.message || "An unknown error occurred",
    body: axiosError.response?.data?.body,
  };
}
