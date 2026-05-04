import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

export type AdminRestaurant = {
  id?: number;
  name: string;
  description?: string | null;
  cuisineType?: string | null;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  branchCount?: number | null;
};

function normalizeMessage(message: unknown): string {
  if (Array.isArray(message)) return message.join(" ");
  if (typeof message === "string") return message;
  return "Request failed";
}

function pickString(
  o: Record<string, unknown>,
  camel: string,
  snake: string,
): string | null | undefined {
  const a = o[camel];
  const b = o[snake];
  if (typeof a === "string") return a;
  if (typeof b === "string") return b;
  if (a === null || b === null) return null;
  return undefined;
}

function pickNumber(
  o: Record<string, unknown>,
  camel: string,
  snake: string,
): number | null | undefined {
  const a = o[camel];
  const b = o[snake];
  if (typeof a === "number" && Number.isFinite(a)) return a;
  if (typeof b === "number" && Number.isFinite(b)) return b;
  if (a === null || b === null) return null;
  return undefined;
}

function coerceRestaurant(value: unknown): AdminRestaurant | null {
  if (!value || typeof value !== "object") return null;
  const o = value as Record<string, unknown>;
  const name = o.name;
  if (typeof name !== "string" || !name.trim()) return null;

  return {
    id: typeof o.id === "number" ? o.id : undefined,
    name: name.trim(),
    description: pickString(o, "description", "description") ?? null,
    cuisineType: pickString(o, "cuisineType", "cuisine_type") ?? null,
    logoUrl: pickString(o, "logoUrl", "logo_url") ?? null,
    websiteUrl: pickString(o, "websiteUrl", "website_url") ?? null,
    email: pickString(o, "email", "email") ?? null,
    phoneNumber: pickString(o, "phoneNumber", "phone_number") ?? null,
    city: pickString(o, "city", "city") ?? null,
    state: pickString(o, "state", "state") ?? null,
    country: pickString(o, "country", "country") ?? null,
    postalCode: pickString(o, "postalCode", "postal_code") ?? null,
    branchCount: pickNumber(o, "branchCount", "branch_count") ?? null,
  };
}

export async function fetchMyRestaurants(
  accessToken: string,
): Promise<AdminRestaurant[]> {
  if (!accessToken.trim()) {
    throw new Error("Missing access token. Sign in again.");
  }

  try {
    const response = await axios.get<unknown>(`${API_URL}/restaurant/all`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = response.data;
    if (Array.isArray(data)) {
      return data
        .map((item) => coerceRestaurant(item))
        .filter((r): r is AdminRestaurant => r != null);
    }
    const one = coerceRestaurant(data);
    return one ? [one] : [];
  } catch (error) {
    console.error("Fetch my restaurant error:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return [];
      }
      if (error.response?.data?.message != null) {
        throw new Error(normalizeMessage(error.response.data.message));
      }
    }
    throw error;
  }
}
