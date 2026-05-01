import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

export type LoginResponse = string;

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/auth/login`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Login Error:", error);

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(String(error.response.data.message));
    }

    throw error;
  }
}

export default login;
