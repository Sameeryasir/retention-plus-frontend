import {
  getApiBaseUrl,
  parseApiErrorMessage,
} from "@/app/lib/api";
import { hasAuthSession } from "@/app/lib/auth-session";
import { authenticatedFetch } from "@/app/lib/authenticated-fetch";
import { isPositiveInt } from "@/app/lib/numbers";

export type FunnelStatsMonthlyPoint = {
  month: string;
  signups: number;
  payments: number;
  signupOnly: number;
  paidAfterSignup: number;
  revenue: number;
};

export type FunnelStatsMonthly = {
  funnelId: number;
  months: number;
  currency: string | null;
  data: FunnelStatsMonthlyPoint[];
};

export async function getFunnelStatsMonthly(
  funnelId: number,
  months = 6,
): Promise<FunnelStatsMonthly> {
  if (!hasAuthSession()) {
    throw new Error("Missing access token. Sign in again.");
  }
  if (!isPositiveInt(funnelId)) {
    throw new Error("Valid funnel id is required.");
  }

  const res = await authenticatedFetch(
    `${getApiBaseUrl()}/funnel-event/funnel/${encodeURIComponent(String(funnelId))}/stats/monthly?months=${encodeURIComponent(String(months))}`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
    },
  );

  if (!res.ok) {
    throw new Error(
      await parseApiErrorMessage(res, "Could not load monthly funnel stats."),
    );
  }

  return (await res.json()) as FunnelStatsMonthly;
}
