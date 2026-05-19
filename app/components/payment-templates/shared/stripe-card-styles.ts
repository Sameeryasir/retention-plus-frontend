import type { StripeCardElementOptions } from "@stripe/stripe-js";

export const stripeCardElementStyle: StripeCardElementOptions["style"] = {
  base: {
    fontSize: "15px",
    color: "#18181b",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    "::placeholder": { color: "#a1a1aa" },
  },
  invalid: { color: "#dc2626" },
};

export const stripeCardDarkStyle: StripeCardElementOptions["style"] = {
  base: {
    fontSize: "15px",
    color: "#fafafa",
    "::placeholder": { color: "#71717a" },
  },
  invalid: { color: "#f87171" },
};
