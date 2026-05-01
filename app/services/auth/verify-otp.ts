import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

export type VerifyOtpUserRole = {
  id: number;
  name: string;
};

export type VerifyOtpUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  role: VerifyOtpUserRole;
};

export type VerifyOtpResponse = {
  message: string;
  token: string;
  user: VerifyOtpUser;
};

export async function verifyOtp(
  email: string,
  otp: number,
): Promise<VerifyOtpResponse> {
  if (
    !Number.isFinite(otp) ||
    !Number.isInteger(otp) ||
    otp < 0 ||
    otp > 999_999
  ) {
    throw new Error("Invalid OTP");
  }

  try {
    const response = await axios.post<VerifyOtpResponse>(
      `${API_URL}/auth/verify-otp`,
      {
        email,
        otp,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Verify OTP Error:", error);

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(String(error.response.data.message));
    }

    throw error;
  }
}

export default verifyOtp;
