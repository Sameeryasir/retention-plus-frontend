"use client";

import { getSetupAccessToken } from "@/app/lib/setup-access-token";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [tokenReady, setTokenReady] = useState(false);
  const [accessToken, setAccessToken] = useState("");

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

  if (!tokenReady || !accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-sm text-zinc-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-20 sm:px-8">
      <p className="text-center text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
        Welcome to the admin panel
      </p>
    </div>
  );
}
