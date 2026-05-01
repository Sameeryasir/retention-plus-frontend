import axios from "axios";
import { getAccessTokenFromStorage } from "@/app/lib/auth-storage";
import type { VerifyOtpResponse } from "@/app/services/auth/verify-otp";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

function normalizeMessage(message: unknown): string {
  if (Array.isArray(message)) return message.join(" ");
  if (typeof message === "string") return message;
  return "Request failed";
}

export async function setupPassword(
  currentPassword: string,
  newPassword: string,
): Promise<VerifyOtpResponse> {
  const accessToken = getAccessTokenFromStorage();
  if (!accessToken) {
    throw new Error("Missing access token. Sign in again.");
  }

  try {
    const response = await axios.put<VerifyOtpResponse>(
      `${API_URL}/auth/setup-password`,
      { currentPassword, newPassword },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Setup password error:", error);
    if (axios.isAxiosError(error) && error.response?.data?.message != null) {
      throw new Error(normalizeMessage(error.response.data.message));
    }
    throw error;
  }
}
