import { getPaymentStatus } from "@/app/services/payment/get-payment-status";

/** Poll backend until webhook marks payment paid (source of truth). */
export async function waitForPaymentPaid(
  paymentId: number,
  opts?: { maxAttempts?: number; intervalMs?: number },
): Promise<boolean> {
  const maxAttempts = opts?.maxAttempts ?? 30;
  const intervalMs = opts?.intervalMs ?? 1500;

  for (let i = 0; i < maxAttempts; i++) {
    const res = await getPaymentStatus(paymentId);
    if (res.status === "paid") return true;
    if (
      res.status === "failed" ||
      res.status === "cancelled" ||
      res.status === "refunded"
    ) {
      return false;
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return false;
}
