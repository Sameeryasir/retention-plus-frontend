import type { VerifyOtpUser } from "@/app/services/auth/verify-otp";

export const ACCESS_TOKEN_STORAGE_KEY = "accessToken";

export const USER_STORAGE_KEY = "user";

const LEGACY_TOKEN_STORAGE_KEY = "token";

export function getAccessTokenFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) ??
    localStorage.getItem(LEGACY_TOKEN_STORAGE_KEY) ??
    null
  );
}

export function getUserFromStorage(): VerifyOtpUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as VerifyOtpUser;
  } catch {
    return null;
  }
}
