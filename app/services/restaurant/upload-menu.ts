import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

export type CreateMenuPayload = {
  restaurantId: number;
  name: string;
  description: string;
  menuType: string;
  file: File;
};

export type UploadMenuResponse = {
  message: string;
};

function normalizeMessage(message: unknown): string {
  if (Array.isArray(message)) return message.join(" ");
  if (typeof message === "string") return message;
  return "Request failed";
}

export async function uploadRestaurantMenu(
  accessToken: string,
  payload: CreateMenuPayload,
): Promise<UploadMenuResponse> {
  if (!accessToken.trim()) {
    throw new Error("Missing access token. Sign in again.");
  }
  if (!Number.isFinite(payload.restaurantId) || payload.restaurantId < 1) {
    throw new Error("Restaurant ID is required.");
  }
  if (!payload.name.trim()) {
    throw new Error("Menu name is required.");
  }
  if (!(payload.file instanceof File)) {
    throw new Error("Menu file is required.");
  }

  const formData = new FormData();
  formData.append("restaurantId", String(payload.restaurantId));
  formData.append("name", payload.name.trim());
  const description = payload.description.trim();
  if (description.length > 0) {
    formData.append("description", description);
  }
  formData.append("menuType", payload.menuType.trim());
  formData.append("file", payload.file);

  try {
    const response = await axios.post<UploadMenuResponse>(
      `${API_URL}/menu/create`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Upload menu error:", error);
    if (axios.isAxiosError(error) && error.response?.data?.message != null) {
      throw new Error(normalizeMessage(error.response.data.message));
    }
    throw error;
  }
}
