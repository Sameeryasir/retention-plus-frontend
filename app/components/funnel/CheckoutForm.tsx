"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";

export type CheckoutFormProps = {
  submitLabel?: string;
};

export function CheckoutForm({
  submitLabel = "Complete Payment",
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if (!stripe || !elements) return;

    setBusy(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });
      if (error?.message) {
        setFormError(error.message);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
      <PaymentElement />
      {formError ? (
        <p className="text-xs font-medium text-red-600" role="alert">
          {formError}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy || !stripe}
        className="mt-1 w-full cursor-pointer rounded-lg bg-zinc-900 py-3 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Confirming payment…
          </span>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}
