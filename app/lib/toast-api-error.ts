import { toast } from "sonner";
import { AutomationApiError } from "@/app/services/automation/automation-fetch";

export function getApiErrorMessage(
  err: unknown,
  fallback: string,
): string {
  if (err instanceof AutomationApiError) return err.message;
  if (err instanceof Error && err.message.trim()) return err.message.trim();
  if (typeof err === "string" && err.trim()) return err.trim();
  return fallback;
}

export function toastApiError(err: unknown, fallback: string): void {
  toast.error(getApiErrorMessage(err, fallback));
}
