"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getApiErrorMessage } from "@/app/lib/toast-api-error";

export function usePaginatedAsyncResource<T, M extends { page: number }>(
  enabled: boolean,
  fetchPage: (page: number) => Promise<{ data: T[]; meta: M }>,
  deps: readonly unknown[],
  options?: {
    fallbackError?: string;
    resetWhenDisabled?: { data: T[]; meta: M | null };
  },
) {
  const fallbackError = options?.fallbackError ?? "Could not load data.";
  const fetchPageRef = useRef(fetchPage);
  fetchPageRef.current = fetchPage;

  const resetWhenDisabledRef = useRef(options?.resetWhenDisabled);
  resetWhenDisabledRef.current = options?.resetWhenDisabled;

  const emptyListRef = useRef<T[]>([]);

  const [data, setData] = useState<T[]>(
    () => options?.resetWhenDisabled?.data ?? emptyListRef.current,
  );
  const [meta, setMeta] = useState<M | null>(
    () => options?.resetWhenDisabled?.meta ?? null,
  );
  const [page, setPageState] = useState(1);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const applyDisabledReset = useCallback(() => {
    const reset = resetWhenDisabledRef.current;
    const nextData = reset?.data ?? emptyListRef.current;
    setData((prev) => (prev === nextData ? prev : nextData));
    setMeta((prev) => {
      const nextMeta = reset?.meta ?? null;
      return prev === nextMeta ? prev : nextMeta;
    });
    setLoading(false);
  }, []);

  const loadPage = useCallback(async (targetPage: number) => {
    if (!enabled) {
      applyDisabledReset();
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetchPageRef.current(targetPage);
      if (!mountedRef.current) return;
      setData(response.data);
      setMeta(response.meta);
      setPageState(response.meta.page);
    } catch (e) {
      if (!mountedRef.current) return;
      setError(getApiErrorMessage(e, fallbackError));
      const reset = resetWhenDisabledRef.current;
      const nextData = reset?.data ?? emptyListRef.current;
      setData((prev) => (prev === nextData ? prev : nextData));
      setMeta((prev) => {
        const nextMeta = reset?.meta ?? null;
        return prev === nextMeta ? prev : nextMeta;
      });
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [enabled, fallbackError, applyDisabledReset]);

  const refetch = useCallback(async () => {
    await loadPage(page);
  }, [loadPage, page]);

  const setPage = useCallback(
    (nextPage: number) => {
      void loadPage(nextPage);
    },
    [loadPage],
  );

  useEffect(() => {
    mountedRef.current = true;

    if (!enabled) {
      applyDisabledReset();
      return () => {
        mountedRef.current = false;
      };
    }

    let cancelled = false;

    const run = async () => {
      setError(null);
      setLoading(true);
      try {
        const response = await fetchPageRef.current(1);
        if (cancelled || !mountedRef.current) return;
        setData(response.data);
        setMeta(response.meta);
        setPageState(response.meta.page);
      } catch (e) {
        if (cancelled || !mountedRef.current) return;
        setError(getApiErrorMessage(e, fallbackError));
        const reset = resetWhenDisabledRef.current;
        const nextData = reset?.data ?? emptyListRef.current;
        setData((prev) => (prev === nextData ? prev : nextData));
        setMeta((prev) => {
          const nextMeta = reset?.meta ?? null;
          return prev === nextMeta ? prev : nextMeta;
        });
      } finally {
        if (!cancelled && mountedRef.current) {
          setLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller supplies deps; fetchPage via ref
  }, [enabled, fallbackError, applyDisabledReset, ...deps]);

  return {
    data,
    meta,
    page,
    setPage,
    loading,
    error,
    refetch,
    loadPage,
  };
}
