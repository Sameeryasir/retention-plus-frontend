"use client";

import SetupPasswordForm from "@/app/components/SetupPasswordForm";
import { useAuth } from "@/app/contexts/auth-context";
import { useAuthFlow } from "@/app/contexts/auth-flow-context";
import { setupPassword } from "@/app/services/auth/setup-password";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export default function NewPasswordPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { pendingLoginPassword, setPendingLoginPassword } = useAuthFlow();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingLoginPassword) {
      router.replace("/auth/login");
    }
  }, [pendingLoginPassword, router]);

  const onSavePasswords = useCallback(
    async (currentPassword: string, newPassword: string) => {
      setErrorMessage(null);
      setSubmitting(true);
      try {
        const data = await setupPassword(currentPassword, newPassword);
        setPendingLoginPassword(null);
        login(data.token, data.user);
      } catch (err) {
        setErrorMessage(getErrorMessage(err));
      } finally {
        setSubmitting(false);
      }
    },
    [login, setPendingLoginPassword],
  );

  if (!pendingLoginPassword) {
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
        <SetupPasswordForm
          currentPasswordFromLogin={pendingLoginPassword}
          submitting={submitting}
          errorMessage={errorMessage}
          onSavePasswords={onSavePasswords}
        />
      </main>
    </div>
  );
}
