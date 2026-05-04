"use client";

import RestaurantDashboardCard from "@/app/components/RestaurantDashboardCard";
import { getSetupAccessToken } from "@/app/lib/setup-access-token";
import {
  fetchMyRestaurants,
  type AdminRestaurant,
} from "@/app/services/restaurant/get-my-restaurant";
import { AlertCircle, Loader2, Store } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function DashboardRestaurantsPage() {
  const router = useRouter();
  const [tokenReady, setTokenReady] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<
    AdminRestaurant[] | undefined
  >(undefined);

  useEffect(() => {
    queueMicrotask(() => {
      setAccessToken(getSetupAccessToken());
      setTokenReady(true);
    });
  }, []);

  useEffect(() => {
    if (!tokenReady) return;
    if (!accessToken) {
      router.replace("/auth/login");
    }
  }, [tokenReady, accessToken, router]);

  const loadRestaurants = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchMyRestaurants(accessToken);
      setRestaurants(data);
    } catch (e) {
      setRestaurants(undefined);
      setErrorMessage(
        e instanceof Error ? e.message : "Could not load restaurants.",
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!tokenReady || !accessToken) return;
    queueMicrotask(() => {
      void loadRestaurants();
    });
  }, [tokenReady, accessToken, loadRestaurants]);

  if (!tokenReady || !accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-sm text-zinc-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 py-8 sm:px-8 lg:px-10">
      <header className="mb-8 flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Restaurants
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            All venues on your account and their details.
          </p>
        </div>
        <Link
          href="/restaurant/register"
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-black"
        >
          <Store className="h-4 w-4" aria-hidden strokeWidth={2} />
          Add restaurant
        </Link>
      </header>

      <div className="mx-auto max-w-6xl">
        {loading ? (
          <div
            className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-zinc-200 bg-white/80 py-20 text-zinc-500"
            role="status"
            aria-live="polite"
          >
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" aria-hidden />
            <p className="text-sm font-medium">Loading your restaurants…</p>
          </div>
        ) : errorMessage ? (
          <div
            className="rounded-2xl border border-red-200 bg-red-50/90 px-4 py-4 text-sm text-red-900 shadow-sm"
            role="alert"
          >
            <div className="flex gap-3">
              <AlertCircle
                className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
                aria-hidden
              />
              <div>
                <p className="font-semibold">Something went wrong</p>
                <p className="mt-1 text-red-800/90">{errorMessage}</p>
                <button
                  type="button"
                  onClick={() => void loadRestaurants()}
                  className="mt-3 rounded-lg bg-red-900/90 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-950"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        ) : restaurants !== undefined && restaurants.length === 0 ? (
          <div className="rounded-3xl border border-zinc-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 ring-1 ring-zinc-200">
              <Store className="h-7 w-7" strokeWidth={1.75} aria-hidden />
            </div>
            <p className="mt-4 text-base font-semibold text-zinc-900">
              No restaurant yet
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500">
              We could not find a restaurant on your account. Create one to get
              started.
            </p>
            <Link
              href="/restaurant/register"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-black"
            >
              Create restaurant
            </Link>
          </div>
        ) : restaurants !== undefined && restaurants.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {restaurants.map((r, index) => (
              <RestaurantDashboardCard
                key={r.id ?? `restaurant-${index}`}
                restaurant={r}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
