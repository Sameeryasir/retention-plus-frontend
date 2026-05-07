"use client";

import { SearchX } from "lucide-react";

export type SearchNoMatchFoundProps = {
  className?: string;
};

export default function SearchNoMatchFound({
  className = "",
}: SearchNoMatchFoundProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 px-4 py-12 text-center ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      <SearchX
        className="h-10 w-10 text-zinc-400"
        strokeWidth={1.5}
        aria-hidden
      />
      <p className="text-sm font-medium text-zinc-600">No match found</p>
    </div>
  );
}
