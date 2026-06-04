"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

/** @deprecated Redirects to /facebook/success so old OAuth return URLs keep working. */
function MetaSuccessRedirectInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams.toString();
    const target = qs ? `/facebook/success?${qs}` : "/facebook/success";
    window.location.replace(target);
  }, [searchParams]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-zinc-50">
      <p className="text-sm text-zinc-600">Loading…</p>
    </main>
  );
}

export default function MetaSuccessRedirectPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center bg-zinc-50">
          <p className="text-sm text-zinc-600">Loading…</p>
        </main>
      }
    >
      <MetaSuccessRedirectInner />
    </Suspense>
  );
}
