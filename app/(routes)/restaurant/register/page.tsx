"use client";

import RegisterRestaurantForm, {
  type RegisterRestaurantFormValues,
} from "@/app/components/RegisterRestaurantForm";
import { Store } from "lucide-react";
import { getSetupAccessToken } from "@/app/lib/setup-access-token";
import { registerRestaurant } from "@/app/services/restaurant/register-restaurant";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function RegisterRestaurantPage() {
  const router = useRouter();
  const [tokenReady, setTokenReady] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setAccessToken(getSetupAccessToken());
    setTokenReady(true);
  }, []);

  useEffect(() => {
    if (!tokenReady) return;
    if (!accessToken) {
      router.replace("/auth/login");
    }
  }, [tokenReady, accessToken, router]);

  const onSubmit = useCallback(
    async (data: RegisterRestaurantFormValues) => {
      setErrorMessage(null);
      setSubmitting(true);
      try {
        const created = await registerRestaurant(accessToken, {
          name: data.name,
          phoneNumber: data.phoneNumber,
          email: data.email.trim() || undefined,
          cuisineType: data.cuisineType || undefined,
          description: data.description.trim() || undefined,
          websiteUrl: data.websiteUrl || undefined,
          logoUrl: data.logoUrl,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
          branchCount: data.branchCount,
        });
        const rid = created.restaurantId ?? created.id;
        router.push(
          rid != null && Number.isFinite(rid)
            ? `/restaurant/upload-menu?restaurantId=${rid}`
            : "/restaurant/upload-menu",
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Could not register restaurant. Try again.",
        );
        setSubmitting(false);
      }
    },
    [accessToken, router],
  );

  if (!tokenReady || !accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-sm text-zinc-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-zinc-100 via-white to-zinc-50">
      <main className="relative z-10 w-full px-4 py-8 sm:px-8 lg:px-12 xl:px-16">
        <header className="mb-8 flex gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-700 text-white shadow-md shadow-zinc-900/20"
            aria-hidden
          >
            <Store className="h-6 w-6" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Create Restaurant
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Add a new restaurant to the system. Fill in the details below.
            </p>
          </div>
        </header>

        <RegisterRestaurantForm
          submitting={submitting}
          errorMessage={errorMessage}
          onSubmit={onSubmit}
        />
      </main>
    </div>
  );
}
