const EMAIL_KEY = "retention:funnel-checkout-email";

export function setFunnelCheckoutEmail(email: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(EMAIL_KEY, email.trim());
  } catch {
    void 0;
  }
}

export function getFunnelCheckoutEmail(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.sessionStorage.getItem(EMAIL_KEY);
    return v?.trim() ? v.trim() : null;
  } catch {
    return null;
  }
}

export function clearFunnelCheckoutEmail(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(EMAIL_KEY);
  } catch {
    void 0;
  }
}
