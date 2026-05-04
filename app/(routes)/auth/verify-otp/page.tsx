"use client";

import OtpForm from "@/app/components/OtpForm";
import { useCredentialContext } from "@/app/contexts/credential-context";
import { setSetupAccessToken } from "@/app/lib/setup-access-token";
import { setSetupUser } from "@/app/lib/setup-user";
import { verifyOtp } from "@/app/services/auth/verify-otp";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function VerifyOtpPage() {
  const router = useRouter();
  const { email } = useCredentialContext();

  const onVerifyOtp = useCallback(
    async (otp: number) => {
      const { token, user } = await verifyOtp(email, otp);
      setSetupAccessToken(token);
      setSetupUser(user);
      router.push("/auth/new-password");
    },
    [email, router],
  );

  const onResendOtp = useCallback(async () => {
    if (!email) {
      throw new Error("Missing email. Go back to log in and try again.");
    }
  }, [email]);

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
          email={email}
          onVerifyOtp={onVerifyOtp}
          onResendOtp={onResendOtp}
        />
      </main>
    </div>
  );
}
