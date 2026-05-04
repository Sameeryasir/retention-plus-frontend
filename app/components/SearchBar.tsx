"use client";

import { Search } from "lucide-react";

export type SearchBarProps = {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmitSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchBar({
  id = "search-bar",
  name = "q",
  value,
  onChange,
  onSubmitSearch,
  placeholder = "Search…",
  className = "",
}: SearchBarProps) {
  return (
    <form
      className={className}
      role="search"
      aria-label="Search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmitSearch?.(value.trim());
      }}
    >
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
          aria-hidden
          strokeWidth={2}
        />
        <input
          id={id}
          name={name}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="h-11 w-full rounded-xl border border-zinc-300 bg-white py-2 pl-10 pr-4 text-left text-sm text-zinc-900 shadow-sm outline-none ring-zinc-900/10 placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2"
        />
      </div>
    </form>
  );
}
