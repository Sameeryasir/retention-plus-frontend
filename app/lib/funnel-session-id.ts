const SESSION_ID_KEY = "funnelSessionId";

export function getOrCreateFunnelSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = window.sessionStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}
