"use client";

import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type CreateCampaignsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: (payload: {
    campaignName: string;
    websiteUrl: string;
  }) => void;
};

function isValidWebsiteUrl(raw: string): boolean {
  const t = raw.trim();
  if (!t) return false;
  try {
    const withProto = t.includes("://") ? t : `https://${t}`;
    const u = new URL(withProto);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function CreateCampaigns({
  open,
  onOpenChange,
  onComplete,
}: CreateCampaignsProps) {
  const nameFieldId = useId();
  const urlFieldId = useId();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [campaignName, setCampaignName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [showNameError, setShowNameError] = useState(false);
  const [showUrlError, setShowUrlError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setCampaignName("");
    setWebsiteUrl("");
    setShowNameError(false);
    setShowUrlError(false);
    queueMicrotask(() => nameInputRef.current?.focus());
  }, [open]);

  useEffect(() => {
    if (!open || step !== 2) return;
    queueMicrotask(() => urlInputRef.current?.focus());
  }, [open, step]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  if (!open || !mounted) return null;

  const continueButtonClassName =
    "min-w-80 cursor-pointer rounded-xl bg-black px-14 py-3 text-sm font-semibold tracking-wide text-white shadow-md shadow-black/40 ring-1 ring-inset ring-white/10 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-black hover:shadow-lg hover:shadow-black/50 active:translate-y-0 active:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2";

  const handleStep1Submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = campaignName.trim();
    if (!trimmed) {
      setShowNameError(true);
      nameInputRef.current?.focus();
      return;
    }
    setShowNameError(false);
    setStep(2);
  };

  const handleStep2Submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = websiteUrl.trim();
    if (!isValidWebsiteUrl(trimmed)) {
      setShowUrlError(true);
      urlInputRef.current?.focus();
      return;
    }
    setShowUrlError(false);
    const normalized = trimmed.includes("://") ? trimmed : `https://${trimmed}`;
    onComplete?.({ campaignName: campaignName.trim(), websiteUrl: normalized });
    onOpenChange(false);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Create campaign"
        onClick={(e) => e.stopPropagation()}
      >
        <nav
          className="mb-8 flex w-full items-center gap-2 sm:gap-4"
          aria-label="Campaign setup steps"
        >
          <div className="flex min-w-0 shrink-0 items-center gap-2">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${
                step === 1 ? "bg-black" : "bg-zinc-300"
              }`}
              aria-current={step === 1 ? "step" : undefined}
            >
              1
            </span>
            <span
              className={`truncate text-sm font-medium ${
                step === 1 ? "text-zinc-900" : "text-zinc-400"
              }`}
            >
              Campaign name
            </span>
          </div>
          <div
            className="h-px min-w-[2rem] flex-1 bg-zinc-800"
            aria-hidden
          />
          <div className="flex min-w-0 shrink-0 items-center gap-2">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${
                step === 2 ? "bg-black" : "bg-zinc-300"
              }`}
              aria-current={step === 2 ? "step" : undefined}
            >
              2
            </span>
            <span
              className={`truncate text-sm font-medium ${
                step === 2 ? "text-zinc-900" : "text-zinc-400"
              }`}
            >
              Host website
            </span>
          </div>
        </nav>

        {step === 1 ? (
          <form onSubmit={handleStep1Submit} noValidate>
            <label
              htmlFor={nameFieldId}
              className="block text-sm font-medium text-zinc-800"
            >
              What is the name of your campaigns?
            </label>
            <input
              ref={nameInputRef}
              id={nameFieldId}
              name="campaignName"
              type="text"
              autoComplete="off"
              placeholder="e.g. Weekend brunch promo"
              value={campaignName}
              onChange={(e) => {
                setCampaignName(e.target.value);
                if (showNameError && e.target.value.trim())
                  setShowNameError(false);
              }}
              aria-invalid={showNameError}
              aria-describedby={
                showNameError ? `${nameFieldId}-error` : undefined
              }
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none ring-zinc-900/0 transition-[box-shadow] focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/15"
            />
            {showNameError ? (
              <p
                id={`${nameFieldId}-error`}
                className="mt-2 text-sm text-red-600"
                role="alert"
              >
                Enter a campaign name to continue.
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                type="submit"
                className={continueButtonClassName}
              >
                Continue
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleStep2Submit} noValidate>
            <label
              htmlFor={urlFieldId}
              className="block text-sm font-medium text-zinc-800"
            >
              Where do you want to host your funnel?
            </label>
            <input
              ref={urlInputRef}
              id={urlFieldId}
              name="websiteUrl"
              type="url"
              inputMode="url"
              autoComplete="url"
              placeholder="e.g. https://yoursite.com or yoursite.com"
              value={websiteUrl}
              onChange={(e) => {
                setWebsiteUrl(e.target.value);
                if (showUrlError && isValidWebsiteUrl(e.target.value))
                  setShowUrlError(false);
              }}
              aria-invalid={showUrlError}
              aria-describedby={
                showUrlError ? `${urlFieldId}-error` : undefined
              }
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none ring-zinc-900/0 transition-[box-shadow] focus:border-zinc-300 focus:ring-2 focus:ring-zinc-900/15"
            />
            {showUrlError ? (
              <p
                id={`${urlFieldId}-error`}
                className="mt-2 text-sm text-red-600"
                role="alert"
              >
                Enter a valid website URL (http or https).
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                type="submit"
                className={continueButtonClassName}
              >
                Continue
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
