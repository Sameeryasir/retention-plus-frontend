export type FunnelAnalyticsStepName =
  | "landing"
  | "signup"
  | "checkout"
  | "upsell"
  | "thank_you";

export type FunnelStepContext = {
  stepName: FunnelAnalyticsStepName;
  stepOrder: number;
  pagePath: string;
};

const PAGE_STEP_MAP: Record<string, FunnelStepContext> = {
  landing: { stepName: "landing", stepOrder: 1, pagePath: "/landing" },
  signup: { stepName: "signup", stepOrder: 2, pagePath: "/signup" },
  payment: { stepName: "checkout", stepOrder: 3, pagePath: "/checkout" },
  checkout: { stepName: "checkout", stepOrder: 3, pagePath: "/checkout" },
  upsell: { stepName: "upsell", stepOrder: 4, pagePath: "/upsell" },
  thank_you: { stepName: "thank_you", stepOrder: 5, pagePath: "/thank-you" },
  confirmation: { stepName: "thank_you", stepOrder: 5, pagePath: "/thank-you" },
};

export function resolveFunnelStepContext(pageKey: string): FunnelStepContext {
  const mapped = PAGE_STEP_MAP[pageKey.trim().toLowerCase()];
  if (mapped) return mapped;

  const slug = pageKey.trim().toLowerCase().replace(/\s+/g, "_");
  return {
    stepName: (slug as FunnelAnalyticsStepName) || "landing",
    stepOrder: 0,
    pagePath: typeof window !== "undefined" ? window.location.pathname : `/${slug}`,
  };
}

export function resolvePagePath(fallbackPath: string): string {
  if (typeof window === "undefined") return fallbackPath;
  return window.location.pathname || fallbackPath;
}
