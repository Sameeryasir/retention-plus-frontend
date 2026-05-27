import { setAuthTokens } from "@/app/lib/auth-session";
import { getSetupRefreshToken } from "@/app/lib/setup-refresh-token";
import { refreshAuthTokens } from "@/app/services/auth/refresh-token";

let refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = getSetupRefreshToken().trim();
    if (!refreshToken) return null;

    try {
      const data = await refreshAuthTokens(refreshToken);
      setAuthTokens(data.token, data.refreshToken);
      return data.token;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
