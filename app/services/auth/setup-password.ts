import axios from "axios";
import { parseApiMessage } from "@/app/lib/api";
import { authAxios } from "@/app/lib/auth-axios";

export type SetupPasswordResponse = {
  message: string;
};

export async function setupPassword(
  accessToken: string,
  currentPassword: string,
  newPassword: string,
): Promise<SetupPasswordResponse> {
  if (!accessToken.trim()) {
    throw new Error("Missing access token. Sign in again.");
  }

  try {
    const response = await authAxios.put<SetupPasswordResponse>(
      "/auth/setup-password",
      { currentPassword, newPassword },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Setup password error:", error);
    if (axios.isAxiosError(error) && error.response?.data?.message != null) {
      throw new Error(
        parseApiMessage(error.response.data.message, "Could not update password."),
      );
    }
    throw error;
  }
}
