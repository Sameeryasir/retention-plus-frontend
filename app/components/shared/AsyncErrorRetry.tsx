"use client";

import { AlertCircle } from "lucide-react";
import { inlineErrorAlertClass } from "@/app/lib/panel-styles";

export function AsyncErrorRetry({
  message,
  onRetry,
  title,
  layout = "center",
  className = "",
  retryLabel = "Try again",
}: {
  message: string;
  onRetry: () => void;
  title?: string;
  layout?: "center" | "inline";
  className?: string;
  retryLabel?: string;
}) {
  if (layout === "inline") {
    return (
      <div
        role="alert"
        className={`${inlineErrorAlertClass} ${className}`}
      >
        <div className="flex gap-3">
          <AlertCircle
            className="mt-0.5 size-5 shrink-0 text-red-600"
            aria-hidden
            strokeWidth={2.25}
          />
          <div>
            {title ? <p className="font-semibold">{title}</p> : null}
            <p className={title ? "mt-1 text-red-800/90" : ""}>{message}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 rounded-lg bg-red-900/90 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-950"
            >
              {retryLabel}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-red-200 bg-red-50 px-4 py-8 text-center text-sm text-red-800 ${className}`}
    >
      <AlertCircle
        className="mx-auto size-8 text-red-600"
        aria-hidden
        strokeWidth={2.25}
      />
      {title ? <p className="mt-3 font-semibold">{title}</p> : null}
      <p className={title ? "mt-1" : "mt-3"}>{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 cursor-pointer font-semibold underline"
      >
        {retryLabel}
      </button>
    </div>
  );
}
