import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

function normalizeMessage(message: unknown): string {
  if (Array.isArray(message)) return message.join(" ");
  if (typeof message === "string") return message;
  return "Request failed";
}

export type Generate2faResponse = {
  qrCode: string;
  message: string;
};

export async function generate2fa(accessToken: string): Promise<Generate2faResponse> {
  if (!accessToken.trim()) {
    throw new Error("Missing access token. Sign in again.");
  }

  try {
    const response = await axios.post<Generate2faResponse>(
      `${API_URL}/auth/2fa/generate`,
      undefined,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Generate 2FA error:", error);
    if (axios.isAxiosError(error) && error.response?.data?.message != null) {
      throw new Error(normalizeMessage(error.response.data.message));
    }
    throw error;
  }
}
