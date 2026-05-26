"use client";

import type { LucideIcon } from "lucide-react";
import { useId } from "react";

export const contentEditorInputClass =
  "w-full rounded-xl border-0 bg-zinc-50 px-3.5 py-2.5 text-[0.8125rem] leading-relaxed text-zinc-900 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] ring-1 ring-inset ring-zinc-200/90 outline-none transition placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-900/10";

export function ContentFieldsStack({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-3">{children}</div>;
}

export function ContentEditorField({
  label,
  icon: Icon,
  input,
  colorPicker,
}: {
  label: string;
  icon: LucideIcon;
  input: React.ReactNode;
  colorPicker?: React.ReactNode;
}) {
  const labelId = useId();

  return (
    <section
      className="overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.05)] ring-1 ring-zinc-950/[0.03]"
      aria-labelledby={labelId}
    >
      <header
        id={labelId}
        className="flex items-center gap-3 border-b border-zinc-100 bg-gradient-to-b from-zinc-50 to-white px-4 py-3"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-sm">
          <Icon className="size-4" strokeWidth={2} aria-hidden />
        </span>
        <h4 className="min-w-0 flex-1 text-sm font-semibold tracking-tight text-zinc-900">
          {label}
        </h4>
      </header>

      <div className="p-4">{input}</div>

      {colorPicker ? (
        <footer className="border-t border-zinc-100 bg-zinc-50/80 px-4 py-2.5">
          {colorPicker}
        </footer>
      ) : null}
    </section>
  );
}
