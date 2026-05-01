"use client";

import OtpForm from "@/app/components/OtpForm";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
} from "@/app/lib/auth-storage";
import { useAuthFlow } from "@/app/contexts/auth-flow-context";
import { sendOtp } from "@/app/services/auth/send-otp";
import verifyOtp from "@/app/services/auth/verify-otp";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function VerifyOtpPage() {
  const router = useRouter();
  const { pendingLoginEmail, setPendingLoginEmail } = useAuthFlow();

  useEffect(() => {
    if (!pendingLoginEmail) {
      router.replace("/auth/login");
    }
  }, [pendingLoginEmail, router]);

  const onVerifyOtp = useCallback(
    async (otp: number) => {
      if (!pendingLoginEmail) {
        throw new Error("Missing email. Go back to log in and try again.");
      }
      const data = await verifyOtp(pendingLoginEmail, otp);
      if (typeof window !== "undefined") {
        localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, data.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      }
      setPendingLoginEmail(null);
      router.push("/auth/new-password");
    },
    [pendingLoginEmail, router, setPendingLoginEmail],
  );

  const onResendOtp = useCallback(async () => {
    if (!pendingLoginEmail) {
      throw new Error("Missing email. Go back to log in and try again.");
    }
    await sendOtp(pendingLoginEmail);
  }, [pendingLoginEmail]);

  if (!pendingLoginEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-sm text-zinc-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-100 via-white to-zinc-50 px-4 py-12 sm:px-6">
      <div
        className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-violet-200/35 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-px w-[min(100vw,48rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-zinc-200/80 to-transparent"
        aria-hidden
      />

      <main className="relative z-10 flex w-full max-w-lg flex-col items-center">
        <OtpForm
          pendingLoginEmail={pendingLoginEmail}
          onVerifyOtp={onVerifyOtp}
          onResendOtp={onResendOtp}
        />
      </main>
    </div>
  );
}
