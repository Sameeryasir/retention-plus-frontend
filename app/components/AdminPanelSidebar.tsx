"use client";

import { useCredentialContext } from "@/app/contexts/credential-context";
import { clearSetupAccessToken } from "@/app/lib/setup-access-token";
import { clearSetupUser, getSetupUser } from "@/app/lib/setup-user";
import type { VerifyOtpUser } from "@/app/services/auth/verify-otp";
import { LayoutDashboard, LogOut, Settings, Store, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/restaurants", label: "Restaurants", icon: Store },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

function initialsFromUser(user: VerifyOtpUser | null): string {
  if (!user?.name?.trim()) return "?";
  const parts = user.name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const a = parts[0][0];
  const b = parts[parts.length - 1][0];
  return `${a}${b}`.toUpperCase();
}

export default function AdminPanelSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { clearPassword } = useCredentialContext();

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<VerifyOtpUser | null>(null);
  const menuRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(getSetupUser());
  }, []);

  const initials = useMemo(() => initialsFromUser(user), [user]);
  const displayName = useMemo(() => {
    const n = user?.name?.trim();
    if (n) return n;
    return "Admin";
  }, [user]);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const el = menuRootRef.current;
      if (el && !el.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menuOpen]);

  const handleLogout = useCallback(() => {
    clearSetupAccessToken();
    clearSetupUser();
    clearPassword();
    setMenuOpen(false);
    router.push("/auth/login");
  }, [clearPassword, router]);

  return (
    <aside
      className="relative flex min-h-0 w-[17rem] shrink-0 flex-col border-r border-zinc-200 bg-gradient-to-b from-white via-zinc-50/40 to-white shadow-[6px_0_32px_-8px_rgba(0,0,0,0.06)]"
      aria-label="Admin navigation"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent"
        aria-hidden
      />

      <div className="border-b border-zinc-100 px-5 pb-6 pt-7">
        <Link
          href="/dashboard"
          className="group flex items-center gap-3.5 outline-none ring-offset-2 ring-offset-white focus-visible:ring-2 focus-visible:ring-black/20"
        >
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-800 to-black text-sm font-semibold uppercase tracking-tight text-white shadow-md shadow-black/20 ring-1 ring-white/10 transition-transform duration-200 group-hover:scale-[1.03] group-hover:shadow-lg group-hover:shadow-black/25"
            aria-hidden
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-black">
              {displayName}
            </p>
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 transition-colors group-hover:text-zinc-700">
              Admin panel
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex items-center gap-3 rounded-xl py-2.5 pl-3 pr-3 text-sm font-medium transition-all duration-200 outline-none ring-offset-2 ring-offset-white focus-visible:ring-2 focus-visible:ring-black/20 ${
                active
                  ? "bg-white text-black shadow-sm shadow-black/[0.04] ring-1 ring-zinc-200 before:absolute before:left-0 before:top-1/2 before:h-8 before:w-[3px] before:-translate-y-1/2 before:rounded-full before:bg-black before:content-['']"
                  : "text-zinc-600 hover:bg-white/80 hover:text-black hover:shadow-sm hover:shadow-black/[0.03] active:text-black"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-zinc-100 text-black ring-1 ring-zinc-200"
                    : "bg-transparent text-zinc-500 group-hover:bg-zinc-100 group-hover:text-black group-active:text-black"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden strokeWidth={2} />
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-100 bg-gradient-to-t from-zinc-100/30 to-transparent px-3 py-4">
        <div ref={menuRootRef} className="relative ml-3 w-fit">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className={`flex size-11 shrink-0 items-center justify-center rounded-full border bg-gradient-to-b from-white to-zinc-50 text-black shadow-sm outline-none ring-1 ring-zinc-100 transition-all hover:border-zinc-400 hover:bg-zinc-100 hover:shadow-md focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.98] ${
              menuOpen
                ? "border-zinc-900 bg-zinc-100 shadow-md"
                : "border-zinc-200"
            }`}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label="Account menu"
          >
            <User
              className="size-[1.15rem] translate-y-px text-zinc-700"
              aria-hidden
              strokeWidth={2}
            />
          </button>

          {menuOpen ? (
            <div
              role="menu"
              aria-label="Account actions"
              className="absolute bottom-full left-0 z-50 mb-2 w-44 overflow-hidden rounded-xl border border-zinc-200/80 bg-white/95 py-1 shadow-xl shadow-zinc-900/10 ring-1 ring-zinc-900/[0.04] backdrop-blur-sm"
            >
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="group/logout flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-black active:text-black"
              >
                <LogOut
                  className="h-4 w-4 shrink-0 text-zinc-500 transition-colors group-hover/logout:text-black group-active/logout:text-black"
                  aria-hidden
                  strokeWidth={2}
                />
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
