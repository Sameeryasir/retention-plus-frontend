import { getApiBaseUrl, parseApiErrorMessage } from "@/app/lib/api";
import { hasAuthSession } from "@/app/lib/auth-session";
import { authenticatedFetch } from "@/app/lib/authenticated-fetch";
import { isPositiveInt } from "@/app/lib/numbers";

export type ScanRedemptionSuccess = {
  success: true;
  customerName: string;
  campaignName: string;
  couponStatus: string;
  redeemedAt: string;
  totalVisits: number;
  rewardsAvailable: number;
  previouslyRedeemedCount: number;
};

export type RedeemableReward = {
  couponId: number;
  label: string;
  paymentLabel: "PREPAID" | "UNPAID";
  isScannedCoupon: boolean;
  canSelect: boolean;
};

export type ScanPreviewSuccess = {
  success: true;
  customerName: string;
  campaignName: string;
  totalVisits: number;
  rewardsAvailable: number;
  upcomingRewardsCount: number;
  previouslyRedeemedCount: number;
  previousRedemptions: Array<{
    campaignName: string;
    redeemedAt: string;
  }>;
  canRedeem: boolean;
  redeemBlockedReason: string | null;
  qrToken: string;
  scannedCouponId: number;
  availableRewards: RedeemableReward[];
};

export type ScanPreviewFailure = {
  success: false;
  message: string;
};

export type ScanPreviewResponse = ScanPreviewSuccess | ScanPreviewFailure;

export type ScanRedemptionFailure = {
  success: false;
  message: string;
};

export type ScanRedemptionResponse =
  | ScanRedemptionSuccess
  | ScanRedemptionFailure;

async function postScanPayload(
  restaurantId: number,
  qrToken: string,
  pathSuffix: "" | "/preview",
  couponIds?: number[],
  orderSubtotal?: number,
): Promise<Response> {
  if (!hasAuthSession()) {
    throw new Error("Missing access token. Sign in again.");
  }
  if (!isPositiveInt(restaurantId)) {
    throw new Error("Valid restaurant id is required.");
  }
  if (!qrToken.trim()) {
    throw new Error("QR token is required.");
  }

  return authenticatedFetch(
    `${getApiBaseUrl()}/redemption/scan/${encodeURIComponent(String(restaurantId))}${pathSuffix}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        qrToken: qrToken.trim(),
        couponIds: couponIds?.length ? couponIds : undefined,
        orderSubtotal,
        deviceInfo:
          typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      }),
    },
  );
}

export async function previewRedemptionQr(
  restaurantId: number,
  qrToken: string,
): Promise<ScanPreviewResponse> {
  const res = await postScanPayload(restaurantId, qrToken, "/preview");

  if (!res.ok) {
    throw new Error(
      await parseApiErrorMessage(res, "Could not read this QR code."),
    );
  }

  return (await res.json()) as ScanPreviewResponse;
}

export async function scanRedemptionQr(
  restaurantId: number,
  qrToken: string,
  couponIds?: number[],
  orderSubtotal?: number,
): Promise<ScanRedemptionResponse> {
  const res = await postScanPayload(
    restaurantId,
    qrToken,
    "",
    couponIds,
    orderSubtotal,
  );

  if (!res.ok) {
    throw new Error(
      await parseApiErrorMessage(res, "Could not redeem this QR code."),
    );
  }

  return (await res.json()) as ScanRedemptionResponse;
}

export type RedemptionStats = {
  couponsIssued: number;
  couponsRedeemed: number;
  restaurantVisits: number;
  redemptionRate: number;
};

export async function getRedemptionStats(
  restaurantId: number,
): Promise<RedemptionStats> {
  if (!hasAuthSession()) {
    throw new Error("Missing access token. Sign in again.");
  }

  const res = await authenticatedFetch(
    `${getApiBaseUrl()}/redemption/restaurant/${encodeURIComponent(String(restaurantId))}/stats`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
    },
  );

  if (!res.ok) {
    throw new Error(
      await parseApiErrorMessage(res, "Could not load redemption stats."),
    );
  }

  return (await res.json()) as RedemptionStats;
}

export type GuestProfile = {
  customerId: number;
  customerName: string;
  email: string;
  phone: string | null;
  totalVisits: number;
  rewardsAvailable: number;
  upcomingRewardsCount: number;
  previouslyRedeemedCount: number;
  previousRedemptions: Array<{
    campaignName: string;
    redeemedAt: string;
  }>;
};

export async function getGuestProfile(
  restaurantId: number,
  customerId: number,
): Promise<GuestProfile | null> {
  if (!hasAuthSession()) {
    throw new Error("Missing access token. Sign in again.");
  }
  if (!isPositiveInt(restaurantId) || !isPositiveInt(customerId)) {
    throw new Error("Valid restaurant and guest ids are required.");
  }

  const res = await authenticatedFetch(
    `${getApiBaseUrl()}/redemption/restaurant/${encodeURIComponent(String(restaurantId))}/guests/${encodeURIComponent(String(customerId))}/profile`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
    },
  );

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(
      await parseApiErrorMessage(res, "Could not load guest profile."),
    );
  }

  return (await res.json()) as GuestProfile;
}

export type GuestCouponResponse = {
  id: number;
  status: string;
  paymentStatus: string;
  paymentConfirmed: boolean;
  issuedAt: string;
  expiresAt: string | null;
  campaignName: string | null;
  customerName: string | null;
  qr: {
    couponId: number;
    token: string;
    qrDataUrl: string;
  };
};

export async function getGuestCouponByPayment(
  funnelPaymentId: number,
): Promise<GuestCouponResponse> {
  const res = await fetch(
    `${getApiBaseUrl()}/redemption/coupon/payment/${encodeURIComponent(String(funnelPaymentId))}`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
    },
  );

  if (!res.ok) {
    throw new Error(
      await parseApiErrorMessage(res, "Could not load your pass."),
    );
  }

  return (await res.json()) as GuestCouponResponse;
}
