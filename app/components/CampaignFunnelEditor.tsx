"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";

export type CampaignFunnelEditorProps = {
  restaurantId: number;
  campaignId: number;
};

type FunnelStep = {
  id: string;
  label: string;
  hasError: boolean;
};

const STEPS: FunnelStep[] = [
  { id: "landing", label: "Landing Page", hasError: true },
  { id: "signup", label: "Sign Up", hasError: false },
  { id: "prepay", label: "Prepay Offer", hasError: false },
  { id: "payment", label: "Payment", hasError: false },
  { id: "confirmation", label: "Payment Confirmation", hasError: true },
];

export default function CampaignFunnelEditor({
  restaurantId,
  campaignId,
}: CampaignFunnelEditorProps) {
  const [activeStepId, setActiveStepId] = useState(STEPS[0].id);

  const experienceHref = useMemo(
    () =>
      `/restaurant/${restaurantId}/dashboard/campaigns/${campaignId}/experience`,
    [restaurantId, campaignId],
  );

  const campaignsHref = useMemo(
    () => `/restaurant/${restaurantId}/dashboard/campaigns`,
    [restaurantId],
  );

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col bg-white lg:flex-row lg:items-stretch">
      <aside className="flex w-full shrink-0 flex-col border-zinc-200/90 bg-zinc-50/40 lg:w-64 lg:border-r lg:bg-white">
        <div className="border-b border-zinc-200/80 px-5 pb-5 pt-5">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Funnel
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link
              href={experienceHref}
              className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition hover:decoration-zinc-900"
            >
              Guest experience
            </Link>
            <Link
              href={campaignsHref}
              className="text-zinc-500 transition hover:text-zinc-900"
            >
              All campaigns
            </Link>
          </div>
        </div>

        <nav
          className="flex flex-1 flex-col gap-1.5 p-3 lg:p-4"
          aria-label="Funnel steps"
        >
          {STEPS.map((step, i) => {
            const selected = step.id === activeStepId;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStepId(step.id)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                  selected
                    ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/90"
                    : "text-zinc-600 hover:bg-white/80 hover:text-zinc-900"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums transition ${
                    selected
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-200/90 text-zinc-600 group-hover:bg-zinc-300/80 group-hover:text-zinc-800"
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  className={`min-w-0 flex-1 text-[0.8125rem] leading-snug ${
                    selected ? "font-semibold" : "font-medium"
                  }`}
                >
                  {step.label}
                </span>
                {step.hasError ? (
                  <AlertCircle
                    className="h-[1.125rem] w-[1.125rem] shrink-0 text-red-600"
                    strokeWidth={2}
                    aria-label="Has issues"
                  />
                ) : null}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto p-6 lg:justify-start lg:pt-8">
        <p className="mb-3 w-full max-w-[20rem] text-xs font-medium text-zinc-500">
          Preview
          {activeStepId === "signup" ? (
            <span className="text-zinc-400"> · Sign up</span>
          ) : null}
        </p>
        <div className="w-full max-w-[20rem] overflow-hidden rounded-2xl border border-zinc-300 bg-white shadow-sm">
          <div
            className={
              activeStepId === "signup"
                ? ""
                : "max-h-[min(36rem,75vh)] overflow-y-auto"
            }
          >
            {activeStepId === "signup" ? (
              <>
                <div className="flex items-center gap-3 bg-zinc-950 px-3 py-3">
                  <div
                    className="h-11 w-11 shrink-0 rounded-md bg-zinc-700 bg-[length:cover] bg-center"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, rgb(161 98 7), rgb(87 83 78))",
                    }}
                    aria-hidden
                  />
                  <div className="min-w-0 text-left text-white">
                    <p className="text-[0.65rem] font-medium leading-tight text-zinc-300">
                      You&apos;re claiming:
                    </p>
                    <p className="text-sm font-semibold leading-tight">test</p>
                  </div>
                </div>
                <div className="space-y-4 bg-white px-4 pb-5 pt-4">
                  <div
                    className="flex h-36 w-full items-center justify-center rounded-lg bg-zinc-100 text-xs text-zinc-400"
                    aria-hidden
                  >
                    Image
                  </div>
                  <div className="space-y-3">
                    <label className="block">
                      <span className="text-xs font-medium text-zinc-700">
                        First name <span className="text-red-600">*</span>
                      </span>
                      <input
                        type="text"
                        readOnly
                        className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-950 focus:ring-2"
                        aria-label="First name"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium text-zinc-700">
                        Last name <span className="text-red-600">*</span>
                      </span>
                      <input
                        type="text"
                        readOnly
                        className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-950 focus:ring-2"
                        aria-label="Last name"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium text-zinc-700">
                        Phone <span className="text-red-600">*</span>
                      </span>
                      <div className="mt-1 flex rounded-md border border-zinc-300 bg-white focus-within:ring-2 focus-within:ring-zinc-950">
                        <span className="flex shrink-0 items-center gap-1 border-r border-zinc-200 px-2 py-2 text-sm text-zinc-700">
                          <span aria-hidden>🇺🇸</span>
                          <span className="font-medium">+1</span>
                        </span>
                        <input
                          type="tel"
                          readOnly
                          className="min-w-0 flex-1 border-0 bg-transparent px-2 py-2 text-sm text-zinc-900 outline-none"
                          aria-label="Phone number"
                        />
                      </div>
                    </label>
                  </div>
                  <label className="flex cursor-pointer gap-2 text-left">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-amber-800 text-amber-800 accent-amber-800"
                    />
                    <span className="text-[0.7rem] leading-snug text-zinc-600">
                      The Pour Market can text me rewards, offers, invites, and
                      more. Message and data rates may apply. Text STOP to opt
                      out.*
                    </span>
                  </label>
                  <div className="flex flex-col items-center gap-1 text-center text-[0.7rem]">
                    <button
                      type="button"
                      className="font-medium text-amber-900 underline-offset-2 hover:underline"
                    >
                      Terms and Conditions
                    </button>
                    <button
                      type="button"
                      className="font-medium text-amber-900 underline-offset-2 hover:underline"
                    >
                      Privacy Policy
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 border-t border-zinc-200 bg-white p-4">
                  <button
                    type="button"
                    className="flex-1 rounded-lg border border-zinc-300 bg-white py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-lg bg-amber-800 py-2.5 text-sm font-medium text-white transition hover:bg-amber-900"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="border-b border-zinc-200 px-4 py-3 text-center">
                  <p className="text-sm text-zinc-800">
                    You&apos;re claiming:{" "}
                    <span className="font-semibold text-zinc-900">test</span>
                  </p>
                </div>
                <div className="flex border-b border-zinc-200 bg-zinc-50/80 px-2 text-xs font-medium text-zinc-500">
                  {["Overview", "Menu", "Photos", "Review"].map((tab, i) => (
                    <span
                      key={tab}
                      className={
                        i === 0
                          ? "flex-1 border-b-2 border-zinc-900 py-2 text-center text-zinc-900"
                          : "flex-1 border-b-2 border-transparent py-2 text-center"
                      }
                    >
                      {tab}
                    </span>
                  ))}
                </div>
                <div className="space-y-4 bg-white px-4 py-5">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-xs font-medium text-zinc-500">
                    Logo
                  </div>
                  <p className="text-center text-sm text-zinc-600">
                    <span className="text-zinc-400">★★★★★</span> 4.7
                  </p>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      How our offer works:
                    </p>
                    <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-xs leading-relaxed text-zinc-600">
                      <li>Tap Claim to reserve your spot.</li>
                      <li>Prepay to lock in today&apos;s price.</li>
                      <li>Show your pass when you visit.</li>
                    </ol>
                  </div>
                  <div className="flex min-h-[5.5rem] items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50">
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white text-lg text-zinc-500 shadow-sm transition hover:border-zinc-400 hover:text-zinc-700"
                      aria-label="Add block"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="border-t border-zinc-200 bg-white p-4">
                  <button
                    type="button"
                    className="w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
                  >
                    Claim
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
