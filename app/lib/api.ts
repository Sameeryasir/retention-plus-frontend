export const API_REQUEST_TIMEOUT_MS = 5_000;
export const API_MIN_LOADING_MS = 500;

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs: number = API_REQUEST_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw e;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function parseApiMessage(message: unknown, fallback: string): string {
  if (Array.isArray(message)) return message.join(" ");
  if (typeof message === "string" && message.trim()) return message.trim();
  return fallback;
}

export async function parseApiErrorMessage(
  res: Response,
  fallback: string,
): Promise<string> {
  try {
    const errBody = (await res.json()) as { message?: unknown };
    return parseApiMessage(errBody?.message, fallback);
  } catch {
    return fallback;
  }
}
