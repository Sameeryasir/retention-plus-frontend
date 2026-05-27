const STORAGE_KEY = "refreshToken";

function assertClient(): boolean {
  return typeof window !== "undefined";
}

export function setSetupRefreshToken(token: string): void {
  if (!assertClient()) return;
  localStorage.setItem(STORAGE_KEY, token);
}

export function getSetupRefreshToken(): string {
  if (!assertClient()) return "";
  return localStorage.getItem(STORAGE_KEY) ?? "";
}

export function clearSetupRefreshToken(): void {
  if (!assertClient()) return;
  localStorage.removeItem(STORAGE_KEY);
}
