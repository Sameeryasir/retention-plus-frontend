"use client";

import Link from "next/link";
import { Check } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-zinc-100 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Check className="size-7" strokeWidth={2.5} aria-hidden />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
          Payment submitted
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          Thank you. If your bank needs extra verification, follow any prompts from
          Stripe. You will receive confirmation by email when the payment is finalized.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-zinc-900 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
