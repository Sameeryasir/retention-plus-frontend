import { getApiBaseUrl, parseApiErrorMessage } from "@/app/lib/api";
import { hasAuthSession } from "@/app/lib/auth-session";
import { authenticatedFetch } from "@/app/lib/authenticated-fetch";
import { isPositiveInt } from "@/app/lib/numbers";

export async function deleteCustomer(customerId: number): Promise<void> {
  if (!hasAuthSession()) {
    throw new Error("Missing access token. Sign in again.");
  }
  if (!isPositiveInt(customerId)) {
    throw new Error("Valid guest id is required.");
  }

  const res = await authenticatedFetch(
    `${getApiBaseUrl()}/customer/${encodeURIComponent(String(customerId))}`,
    {
      method: "DELETE",
      headers: { Accept: "application/json" },
    },
  );

  if (!res.ok) {
    throw new Error(
      await parseApiErrorMessage(res, "Could not delete this guest."),
    );
  }
}
