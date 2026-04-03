import apiClient from "@/api/client";
import { ApiResponse } from "@/types/Api";
import { handleApiError } from "@/utils/handleApiError";

interface CandidateSummaryBody {
  summary: string;
}

interface RankingSuggestionBody {
  suggestions: Array<{
    applicationId: string;
    suggestedRank: number;
    reason: string;
  }>;
}

export default function useAI() {
  const getCandidateSummary = async (
    applicationId: string,
  ): Promise<ApiResponse<CandidateSummaryBody>> => {
    try {
      const response = await apiClient.post("/api/ai/candidate-summary", {
        applicationId,
      });
      return {
        success: response.data.success,
        message: response.data.message,
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error getting candidate summary", error);
      return handleApiError(error) as ApiResponse<CandidateSummaryBody>;
    }
  };

  const getRankingSuggestion = async (
    courseId: string,
    applicationIds: string[],
  ): Promise<ApiResponse<RankingSuggestionBody>> => {
    try {
      const response = await apiClient.post("/api/ai/ranking-suggestion", {
        courseId,
        applicationIds,
      });
      return {
        success: response.data.success,
        message: response.data.message,
        body: response.data.body,
      };
    } catch (error: unknown) {
      console.error("Error getting ranking suggestion", error);
      return handleApiError(error) as ApiResponse<RankingSuggestionBody>;
    }
  };

  return {
    getCandidateSummary,
    getRankingSuggestion,
  };
}
