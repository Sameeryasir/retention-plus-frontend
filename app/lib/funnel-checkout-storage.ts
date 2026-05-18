const EMAIL_KEY = "retention:funnel-checkout-email";
const CUSTOMER_ID_KEY = "retention:funnel-checkout-customer-id";
const PAYMENT_ID_KEY = "retention:funnel-checkout-payment-id";
const FUNNEL_ID_KEY = "retention:funnel-checkout-funnel-id";

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

export function setFunnelCheckoutCustomerId(customerId: number): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(CUSTOMER_ID_KEY, String(customerId));
  } catch {
    void 0;
  }
}

export function getFunnelCheckoutCustomerId(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(CUSTOMER_ID_KEY);
    if (!raw) return null;
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) && n >= 1 ? n : null;
  } catch {
    return null;
  }
}

export function setFunnelPaymentId(paymentId: number): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(PAYMENT_ID_KEY, String(paymentId));
  } catch {
    void 0;
  }
}

export function getFunnelPaymentId(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(PAYMENT_ID_KEY);
    if (!raw) return null;
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) && n >= 1 ? n : null;
  } catch {
    return null;
  }
}

export function setFunnelCheckoutFunnelId(funnelId: number): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(FUNNEL_ID_KEY, String(funnelId));
  } catch {
    void 0;
  }
}

export function getFunnelCheckoutFunnelId(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(FUNNEL_ID_KEY);
    if (!raw) return null;
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) && n >= 1 ? n : null;
  } catch {
    return null;
  }
}
