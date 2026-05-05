import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

export type Funnel = {
  id: number;
  restaurantId?: number;
  campaignName?: string;
  websiteUrl?: string;
  imageUrl?: string;
  offer?: string;
  price?: number;
  published?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

function normalizeMessage(message: unknown): string {
  if (Array.isArray(message)) return message.join(" ");
  if (typeof message === "string") return message;
  return "Request failed";
}

function parseId(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && /^\d+$/.test(value.trim())) {
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function pickNonEmptyString(
  o: Record<string, unknown>,
  ...keys: string[]
): string | undefined {
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string") {
      const t = v.trim();
      if (t.length > 0) return t;
    }
  }
  return undefined;
}

function normalizeImageUrl(raw: string | undefined): string | undefined {
  if (raw == null) return undefined;
  const t = raw.trim();
  if (!t) return undefined;
  if (!t.startsWith("data:")) return t;
  const comma = t.indexOf(",");
  if (comma === -1) return t;
  const head = t.slice(0, comma + 1);
  const b64 = t.slice(comma + 1).replace(/\s+/g, "");
  return head + b64;
}

function parsePublished(o: Record<string, unknown>): boolean {
  const raw =
    o.published ?? o.isPublished ?? o.is_published ?? o.Published;
  if (typeof raw === "boolean") return raw;
  if (raw === 1 || raw === "1" || raw === "true") return true;
  if (raw === 0 || raw === "0" || raw === "false") return false;
  const status = o.status ?? o.Status;
  if (typeof status === "string") {
    const s = status.toLowerCase();
    if (["published", "live", "active"].includes(s)) return true;
    if (["draft", "unpublished", "inactive", "pending"].includes(s))
      return false;
  }
  return false;
}

function unwrapFunnelList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    for (const key of ["data", "funnels", "items", "results", "rows"]) {
      const v = o[key];
      if (Array.isArray(v)) return v;
    }
  }
  return [];
}

function coerceFunnel(value: unknown): Funnel | null {
  if (!value || typeof value !== "object") return null;
  const o = value as Record<string, unknown>;
  const id = parseId(o.id);
  if (id == null) return null;
  const priceRaw = o.price;
  let price: number | undefined;
  if (typeof priceRaw === "number" && Number.isFinite(priceRaw)) {
    price = priceRaw;
  } else if (typeof priceRaw === "string") {
    const n = Number.parseFloat(priceRaw);
    if (Number.isFinite(n)) price = n;
  }
  const imageRaw = pickNonEmptyString(
    o,
    "imageUrl",
    "image_url",
    "image_Url",
    "ImageUrl",
    "bannerUrl",
    "banner_url",
    "image",
  );
  return {
    id,
    restaurantId: parseId(o.restaurantId ?? o.restaurant_id),
    campaignName:
      typeof o.campaignName === "string"
        ? o.campaignName
        : typeof o.campaign_name === "string"
          ? o.campaign_name
          : undefined,
    websiteUrl:
      typeof o.websiteUrl === "string"
        ? o.websiteUrl
        : typeof o.website_url === "string"
          ? o.website_url
          : undefined,
    imageUrl: normalizeImageUrl(imageRaw),
    offer: typeof o.offer === "string" ? o.offer : undefined,
    price: Number.isFinite(price) ? price : undefined,
    published: parsePublished(o),
    status:
      typeof o.status === "string"
        ? o.status.trim()
        : typeof o.Status === "string"
          ? o.Status.trim()
          : undefined,
    createdAt:
      typeof o.createdAt === "string"
        ? o.createdAt
        : typeof o.created_at === "string"
          ? o.created_at
          : undefined,
    updatedAt:
      typeof o.updatedAt === "string"
        ? o.updatedAt
        : typeof o.updated_at === "string"
          ? o.updated_at
          : undefined,
  };
}

export async function fetchFunnelsByRestaurant(
  accessToken: string,
  restaurantId: number,
): Promise<Funnel[]> {
  if (!accessToken.trim()) {
    throw new Error("Missing access token. Sign in again.");
  }
  if (!Number.isFinite(restaurantId) || restaurantId < 1) {
    throw new Error("Invalid restaurant.");
  }

  try {
    const response = await axios.get<unknown>(
      `${API_URL}/funnel/restaurant/${restaurantId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const list = unwrapFunnelList(response.data);
    return list
      .map((item) => coerceFunnel(item))
      .filter((f): f is Funnel => f != null);
  } catch (error) {
    console.error("Fetch funnels by restaurant error:", error);
    if (axios.isAxiosError(error) && error.response?.data?.message != null) {
      throw new Error(normalizeMessage(error.response.data.message));
    }
    throw error;
  }
}
