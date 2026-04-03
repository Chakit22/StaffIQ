import apiClient from "@/api/client";

interface UpdateProfileData {
  id: string;
  email: string;
  avatarUrl: string;
}

interface UpdateProfileResponse {
  success: boolean;
  message?: string;
  user?: Record<string, unknown>;
}

export async function updateProfile(
  data: UpdateProfileData,
): Promise<UpdateProfileResponse> {
  try {
    const response = await apiClient.put(`/api/users/${data.id}/avatar`, {
      avatarUrl: data.avatarUrl,
    });
    return {
      success: true,
      user: response.data.body,
    };
  } catch (error: unknown) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      message: "Failed to update profile",
    };
  }
}
