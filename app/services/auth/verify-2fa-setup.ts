import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

function normalizeMessage(message: unknown): string {
  if (Array.isArray(message)) return message.join(" ");
  if (typeof message === "string") return message;
  return "Request failed";
}

export type Verify2faSetupResponse = {
  message: string;
  twoFactorEnabled?: boolean;
};

export async function verify2faSetup(
  accessToken: string,
  otp: number,
): Promise<Verify2faSetupResponse> {
  if (!accessToken.trim()) {
    throw new Error("Missing access token. Sign in again.");
  }

  if (
    !Number.isFinite(otp) ||
    !Number.isInteger(otp) ||
    otp < 0 ||
    otp > 999_999
  ) {
    throw new Error("Invalid code");
  }

  const code = String(otp).padStart(6, "0");

  try {
    const response = await axios.post<Verify2faSetupResponse>(
      `${API_URL}/auth/2fa/verify-setup`,
      { code },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Verify 2FA setup error:", error);
    if (axios.isAxiosError(error) && error.response?.data?.message != null) {
      throw new Error(normalizeMessage(error.response.data.message));
    }
    throw error;
  }
}
