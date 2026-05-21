import {
  fetchWithTimeout,
  getApiBaseUrl,
  parseApiErrorMessage,
} from "@/app/lib/api";
import {
  clearSetupAccessToken,
  getSetupAccessToken,
} from "@/app/lib/setup-access-token";

export class AutomationApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AutomationApiError";
    this.status = status;
  }
}

function redirectToLogin(): void {
  if (typeof window === "undefined") return;
  clearSetupAccessToken();
  window.location.href = "/auth/login";
}

export async function automationFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getSetupAccessToken();
  if (!token.trim()) {
    redirectToLogin();
    throw new AutomationApiError("Missing access token. Sign in again.", 401);
  }

  const res = await fetchWithTimeout(`${getApiBaseUrl()}/automation${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    redirectToLogin();
    throw new AutomationApiError("Session expired. Please sign in again.", 401);
  }

  if (!res.ok) {
    const message = await parseApiErrorMessage(
      res,
      `Request failed: ${res.status}`,
    );
    throw new AutomationApiError(message, res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
