"use client";

import { useAuth } from "@/app/contexts/auth-context";
import { useSignOut } from "@/app/hooks/use-sign-out";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const signOut = useSignOut();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-sm text-zinc-500">Loading…</p>
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-zinc-100 via-white to-zinc-50 px-6 text-center">
      <div className="flex max-w-md flex-col items-center gap-4">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
          Welcome
        </h1>
        <p className="text-sm leading-relaxed text-zinc-600">
          You&apos;re signed in.
        </p>
        <button
          type="button"
          onClick={() => signOut()}
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-800 shadow-sm transition-colors hover:border-zinc-400 hover:bg-zinc-50"
        >
          <LogOut className="size-4 shrink-0" aria-hidden strokeWidth={2} />
          Log out
        </button>
      </div>
    </main>
  );
}
