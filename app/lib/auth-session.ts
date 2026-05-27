import {
  clearSetupAccessToken,
  getSetupAccessToken,
  setSetupAccessToken,
} from "@/app/lib/setup-access-token";
import {
  clearSetupRefreshToken,
  getSetupRefreshToken,
  setSetupRefreshToken,
} from "@/app/lib/setup-refresh-token";

export function setAuthTokens(accessToken: string, refreshToken: string): void {
  setSetupAccessToken(accessToken);
  setSetupRefreshToken(refreshToken);
}

export function clearAuthSession(): void {
  clearSetupAccessToken();
  clearSetupRefreshToken();
}

export function hasAuthSession(): boolean {
  return Boolean(
    getSetupAccessToken().trim() || getSetupRefreshToken().trim(),
  );
}

export { getSetupAccessToken, getSetupRefreshToken };
