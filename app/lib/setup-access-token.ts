const STORAGE_KEY = "accessToken";

function assertClient(): boolean {
  return typeof window !== "undefined";
}

export function setSetupAccessToken(token: string): void {
  if (!assertClient()) return;
  localStorage.setItem(STORAGE_KEY, token);
}

export function getSetupAccessToken(): string {
  if (!assertClient()) return "";
  return localStorage.getItem(STORAGE_KEY) ?? "";
}

export function clearSetupAccessToken(): void {
  if (!assertClient()) return;
  localStorage.removeItem(STORAGE_KEY);
}
