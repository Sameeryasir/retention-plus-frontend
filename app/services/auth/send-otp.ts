import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

export type SendOtpResponse = string;

export async function sendOtp(email: string): Promise<SendOtpResponse> {
  try {
    const response = await axios.post<SendOtpResponse>(
      `${API_URL}/auth/send-otp`,
      {
        email,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Send OTP Error:", error);

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(String(error.response.data.message));
    }

    throw error;
  }
}

export default sendOtp;
