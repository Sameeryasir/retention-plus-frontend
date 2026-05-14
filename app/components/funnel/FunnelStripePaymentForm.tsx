"use client";

import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";
import { CheckoutForm } from "@/app/components/funnel/CheckoutForm";
import { getSetupAccessToken } from "@/app/lib/setup-access-token";
import { createPaymentIntent } from "@/app/services/payment/create-payment-intent";

export type FunnelStripePaymentContext = {
  funnelId: number;
  restaurantId: number;
  amount: number;
  applicationFeeAmount: number;
  currency: string;
  customerEmail: string;
};

export function FunnelStripePaymentForm({
  context,
}: {
  context: FunnelStripePaymentContext;
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [intentError, setIntentError] = useState<string | null>(null);

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
  const configError = publishableKey
    ? null
    : "Payments are not configured yet. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.";

  const stripePromise = useMemo(() => {
    if (!publishableKey || !clientSecret) return null;
    const acct = stripeAccountId?.trim();
    return loadStripe(
      publishableKey,
      acct ? { stripeAccount: acct } : undefined,
    );
  }, [publishableKey, clientSecret, stripeAccountId]);

  useEffect(() => {
    setClientSecret(null);
    setStripeAccountId(null);
    setIntentError(null);
  }, [
    context.funnelId,
    context.restaurantId,
    context.amount,
    context.applicationFeeAmount,
    context.currency,
    context.customerEmail,
  ]);

  const startPaymentIntent = async () => {
    if (!publishableKey) return;
    setIntentError(null);
    setCreating(true);
    try {
      const res = await createPaymentIntent(
        {
          funnelId: context.funnelId,
          restaurantId: context.restaurantId,
          amount: context.amount,
          applicationFeeAmount: context.applicationFeeAmount,
          currency: context.currency,
          customerEmail: context.customerEmail,
        },
        getSetupAccessToken(),
      );
      const secret = res.clientSecret?.trim();
      if (!secret) {
        throw new Error(
          "The server did not return a payment session. Please try again.",
        );
      }
      setClientSecret(secret);
      setStripeAccountId(res.stripeAccountId?.trim() ?? null);
    } catch (e) {
      setIntentError(
        e instanceof Error
          ? e.message
          : "We could not start checkout. Please try again.",
      );
    } finally {
      setCreating(false);
    }
  };

  if (configError) {
    return (
      <p className="text-xs font-medium text-red-600" role="alert">
        {configError}
      </p>
    );
  }

  if (!clientSecret) {
    return (
      <div className="space-y-3">
        {intentError ? (
          <p className="text-xs font-medium text-red-600" role="alert">
            {intentError}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => void startPaymentIntent()}
          disabled={creating}
          className="w-full cursor-pointer rounded-lg bg-zinc-900 py-3 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {creating ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Preparing checkout…
            </span>
          ) : (
            "Pay Now"
          )}
        </button>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-sm text-zinc-500">
        <Loader2 className="size-5 animate-spin" aria-hidden />
        Loading Stripe…
      </div>
    );
  }

  return (
    <Elements
      key={stripeAccountId ?? "platform"}
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: { theme: "stripe", variables: { borderRadius: "8px" } },
      }}
    >
      <CheckoutForm />
    </Elements>
  );
}
