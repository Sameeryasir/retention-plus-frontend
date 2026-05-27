import {
  fetchWithTimeout,
  getApiBaseUrl,
  parseApiErrorMessage,
} from "@/app/lib/api";

export type RefreshTokenResponse = {
  token: string;
  refreshToken: string;
};

export async function refreshAuthTokens(
  refreshToken: string,
): Promise<RefreshTokenResponse> {
  const res = await fetchWithTimeout(`${getApiBaseUrl()}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    throw new Error(
      await parseApiErrorMessage(res, "Could not refresh session."),
    );
  }

  return res.json() as Promise<RefreshTokenResponse>;
}
