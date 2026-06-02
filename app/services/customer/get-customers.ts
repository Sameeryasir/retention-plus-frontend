import { getApiBaseUrl, parseApiErrorMessage } from "@/app/lib/api";
import { hasAuthSession } from "@/app/lib/auth-session";
import { authenticatedFetch } from "@/app/lib/authenticated-fetch";

export const CUSTOMERS_PAGE_SIZE = 10;

export type CustomerRecord = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedCustomersResponse = {
  data: CustomerRecord[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function getCustomers(
  page = 1,
  limit = CUSTOMERS_PAGE_SIZE,
): Promise<PaginatedCustomersResponse> {
  if (!hasAuthSession()) {
    throw new Error("Missing access token. Sign in again.");
  }

  const q = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const res = await authenticatedFetch(
    `${getApiBaseUrl()}/customer?${q.toString()}`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
    },
  );

  if (!res.ok) {
    throw new Error(
      await parseApiErrorMessage(res, "Could not load customers."),
    );
  }

  return (await res.json()) as PaginatedCustomersResponse;
}
