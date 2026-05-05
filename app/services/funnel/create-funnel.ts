import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

export type CreateFunnelPayload = {
  restaurantId: number;
  campaignName: string;
  websiteUrl: string;
  imageUrl: string;
  offer: string;
  price: number;
};

function normalizeMessage(message: unknown): string {
  if (Array.isArray(message)) return message.join(" ");
  if (typeof message === "string") return message;
  return "Request failed";
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result;
      if (typeof r === "string") resolve(r);
      else reject(new Error("Could not read image file."));
    };
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });
}

export function parseOfferPrice(raw: string): number {
  const n = Number.parseFloat(String(raw).replace(/[^0-9.-]/g, ""));
  if (!Number.isFinite(n)) {
    throw new Error("Enter a valid price.");
  }
  return n;
}

export async function createFunnel(
  accessToken: string,
  payload: CreateFunnelPayload,
): Promise<unknown> {
  if (!accessToken.trim()) {
    throw new Error("Missing access token. Sign in again.");
  }
  if (!Number.isFinite(payload.restaurantId) || payload.restaurantId < 1) {
    throw new Error("Restaurant is required.");
  }
  if (!payload.campaignName.trim()) {
    throw new Error("Campaign name is required.");
  }
  if (!payload.websiteUrl.trim()) {
    throw new Error("Website URL is required.");
  }
  if (!payload.imageUrl.trim()) {
    throw new Error("Image URL is required.");
  }
  if (!payload.offer.trim()) {
    throw new Error("Offer is required.");
  }
  if (!Number.isFinite(payload.price)) {
    throw new Error("Price is required.");
  }

  const body = {
    restaurantId: payload.restaurantId,
    campaignName: payload.campaignName.trim(),
    websiteUrl: payload.websiteUrl.trim(),
    imageUrl: payload.imageUrl.trim(),
    offer: payload.offer.trim(),
    price: payload.price,
  };

  try {
    const response = await axios.post(`${API_URL}/funnel/create`, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Create funnel error:", error);
    if (axios.isAxiosError(error) && error.response?.data?.message != null) {
      throw new Error(normalizeMessage(error.response.data.message));
    }
    throw error;
  }
}
