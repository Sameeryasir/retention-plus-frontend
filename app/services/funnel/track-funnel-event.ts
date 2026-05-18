import { getApiBaseUrl } from "@/app/lib/api";

export type TrackSignupEvent = {
  eventType: "signup";
  funnelId: number;
  customerId: number;
  visitorId: string;
};

export type TrackPaymentEvent = {
  eventType: "payment";
  funnelId: number;
  funnelPaymentId: number;
  paymentStatus: string;
  visitorId: string;
  customerId?: number;
};

export type TrackFunnelEventPayload = TrackSignupEvent | TrackPaymentEvent;

export async function trackFunnelEvent(
  payload: TrackFunnelEventPayload,
): Promise<void> {
  const res = await fetch(`${getApiBaseUrl()}/funnel-event/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Funnel event track failed (${res.status})`);
  }
}
