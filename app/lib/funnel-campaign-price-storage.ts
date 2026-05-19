const PRICE_KEY = "retention:funnel-campaign-price";

export function setFunnelCampaignPrice(amount: number): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(PRICE_KEY, String(amount));
  } catch {
    void 0;
  }
}

export function getFunnelCampaignPrice(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(PRICE_KEY);
    if (!raw) return null;
    const n = Number.parseFloat(raw);
    return Number.isFinite(n) && n >= 0 ? n : null;
  } catch {
    return null;
  }
}
