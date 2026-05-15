const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

const PAYMENT_INTENT_FUNNEL_ID = 11;

export type CreatePaymentIntentPayload = {
  funnelId?: number;
  restaurantId: number;
  applicationFeeAmount: number;
  currency: string;
  customerEmail: string;
};

export type CreatePaymentIntentResponse = {
  clientSecret?: string;
  paymentIntentId?: string;
  stripePaymentIntentId?: string;
  paymentId?: number;
  status?: string;
  stripeAccountId?: string;
};

function normalizePaymentIntentId(
  res: CreatePaymentIntentResponse,
): string | undefined {
  return (
    res.paymentIntentId?.trim() ||
    res.stripePaymentIntentId?.trim() ||
    undefined
  );
}

export async function createPaymentIntent(
  payload: CreatePaymentIntentPayload,
  accessToken?: string,
): Promise<CreatePaymentIntentResponse> {
  if (!Number.isFinite(payload.restaurantId) || payload.restaurantId < 1) {
    throw new Error("Restaurant is required.");
  }
  if (
    !Number.isFinite(payload.applicationFeeAmount) ||
    payload.applicationFeeAmount < 0
  ) {
    throw new Error("Application fee amount is required.");
  }
  if (!payload.currency?.trim()) {
    throw new Error("Currency is required.");
  }
  if (!payload.customerEmail?.trim()) {
    throw new Error("Customer email is required.");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (accessToken?.trim()) {
    headers.Authorization = `Bearer ${accessToken.trim()}`;
  }

  const body: Record<string, unknown> = {
    funnelId: PAYMENT_INTENT_FUNNEL_ID,
    restaurantId: payload.restaurantId,
    applicationFeeAmount: payload.applicationFeeAmount,
    currency: payload.currency.trim().toLowerCase(),
    customerEmail: payload.customerEmail.trim(),
  };

  const res = await fetch(`${API_URL}/payment/intent`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = "Could not create payment intent.";
    try {
      const errBody = (await res.json()) as { message?: unknown };
      const m = errBody?.message;
      if (Array.isArray(m)) message = m.join(" ");
      else if (typeof m === "string") message = m;
    } catch {
      void 0;
    }
    throw new Error(message);
  }

  const json = (await res.json()) as CreatePaymentIntentResponse;
  const paymentIntentId = normalizePaymentIntentId(json);
  return { ...json, paymentIntentId };
}
