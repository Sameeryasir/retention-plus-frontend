"use client";

import { useCallback } from "react";
import { useAsyncResource } from "@/app/hooks/use-async-resource";
import { isPositiveInt } from "@/app/lib/numbers";

export function useTokenGatedResource<T>({
  resourceId,
  token,
  fetch,
  noTokenError,
  invalidIdError = "Invalid resource.",
  fallbackError,
  minLoadingMs,
  resetWhenDisabled,
  initialLoading,
}: {
  resourceId: number | null | undefined;
  token: string;
  fetch: (authToken: string, id: number) => Promise<T>;
  noTokenError: string;
  invalidIdError?: string;
  fallbackError: string;
  minLoadingMs?: boolean;
  resetWhenDisabled?: T;
  initialLoading?: boolean;
}) {
  const enabled = isPositiveInt(resourceId);
  const hasToken = Boolean(token.trim());

  const fetcher = useCallback(async () => {
    if (!isPositiveInt(resourceId)) {
      throw new Error(invalidIdError);
    }
    if (!token.trim()) {
      throw new Error(noTokenError);
    }
    return fetch(token, resourceId);
  }, [resourceId, token, fetch, invalidIdError, noTokenError]);

  const result = useAsyncResource<T>(
    enabled && hasToken,
    fetcher,
    [resourceId, token],
    {
      minLoadingMs,
      fallbackError,
      resetWhenDisabled,
      initialLoading,
    },
  );

  if (enabled && !hasToken) {
    return {
      ...result,
      data: resetWhenDisabled ?? null,
      isLoading: false,
      error: noTokenError,
    };
  }

  return result;
}
