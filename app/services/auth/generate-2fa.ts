import axios from "axios";
import { parseApiMessage } from "@/app/lib/api";
import { authAxios } from "@/app/lib/auth-axios";

export type Generate2faResponse = {
  qrCode: string;
  message: string;
};

export async function generate2fa(accessToken: string): Promise<Generate2faResponse> {
  if (!accessToken.trim()) {
    throw new Error("Missing access token. Sign in again.");
  }

  try {
    const response = await authAxios.post<Generate2faResponse>(
      "/auth/2fa/generate",
      undefined,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Generate 2FA error:", error);
    if (axios.isAxiosError(error) && error.response?.data?.message != null) {
      throw new Error(
        parseApiMessage(error.response.data.message, "Could not generate 2FA."),
      );
    }
    throw error;
  }
}
