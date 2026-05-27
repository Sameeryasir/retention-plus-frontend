import { fetchWithTimeout, getApiBaseUrl } from "@/app/lib/api";
import { clearAuthSession } from "@/app/lib/auth-session";
import { getSetupRefreshToken } from "@/app/lib/setup-refresh-token";

export async function logoutSession(): Promise<void> {
  const refreshToken = getSetupRefreshToken().trim();

  if (refreshToken) {
    try {
      await fetchWithTimeout(`${getApiBaseUrl()}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // Local session is cleared even if the server revoke fails.
    }
  }

  clearAuthSession();
}
