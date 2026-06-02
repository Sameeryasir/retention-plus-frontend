"use client";

import { Loader2, Play } from "lucide-react";
import { primaryButtonMdClass } from "@/app/lib/panel-styles";

export function ActivateAutomationFirstHint({
  className = "",
}: {
  className?: string;
}) {
  return (
    <p
      className={`rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950 ${className}`}
    >
      Please activate the automation first to run it.
    </p>
  );
}

export function RunAutomationButton({
  busy,
  disabled,
  onClick,
}: {
  busy: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled || busy}
      onClick={onClick}
      className={primaryButtonMdClass}
    >
      {busy ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <Play className="size-4" aria-hidden />
      )}
      {busy ? "Running…" : "Run automation"}
    </button>
  );
}
