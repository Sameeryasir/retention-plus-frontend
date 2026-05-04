"use client";

import { useCredentialContext } from "@/app/contexts/credential-context";
import { clearSetupAccessToken } from "@/app/lib/setup-access-token";
import { clearSetupUser, getSetupUser } from "@/app/lib/setup-user";
import type { VerifyOtpUser } from "@/app/services/auth/verify-otp";
import { LayoutDashboard, LogOut, Settings, Store, Users } from "lucide-react";
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
      className="relative flex h-screen w-64 shrink-0 flex-col border-r border-zinc-200 bg-white shadow-[4px_0_24px_-4px_rgba(0,0,0,0.06)]"
      aria-label="Admin navigation"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent"
        aria-hidden
      />

      <div className="border-b border-zinc-200 px-5 pb-5 pt-6">
        <Link
          href="/dashboard"
          className="group flex items-center gap-3 outline-none ring-offset-2 ring-offset-white focus-visible:ring-2 focus-visible:ring-black/20"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 transition-transform duration-200 group-hover:scale-[1.02] group-hover:border-zinc-300">
            <LayoutDashboard
              className="h-5 w-5 text-zinc-700 transition-colors group-hover:text-black group-active:text-black"
              aria-hidden
              strokeWidth={2}
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-zinc-800 transition-colors group-hover:text-black group-active:text-black">
              RetentionPlus
            </p>
            <p className="text-xs font-medium text-zinc-500 transition-colors group-hover:text-black group-active:text-black">
              Admin panel
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
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
                  ? "bg-zinc-100 text-black shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9)] ring-1 ring-zinc-200/80 before:absolute before:left-0 before:top-1/2 before:h-7 before:w-[3px] before:-translate-y-1/2 before:rounded-full before:bg-black before:content-['']"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-black active:text-black"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  active
                    ? "bg-zinc-200/90 text-black"
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

      <div className="border-t border-zinc-200 p-3">
        <div ref={menuRootRef} className="relative flex justify-center">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className={`flex h-11 w-11 items-center justify-center rounded-full border bg-zinc-100 text-sm font-semibold uppercase tracking-tight outline-none ring-offset-2 ring-offset-white transition-colors hover:border-zinc-400 hover:bg-zinc-200/80 hover:text-black focus-visible:ring-2 focus-visible:ring-black/20 active:text-black ${
              menuOpen ? "border-zinc-500 text-black" : "border-zinc-200 text-zinc-700"
            }`}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label="Account menu"
          >
            {initials}
          </button>

          {menuOpen ? (
            <div
              role="menu"
              aria-label="Account actions"
              className="absolute bottom-full left-1/2 z-50 mb-2 w-44 -translate-x-1/2 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg shadow-zinc-900/10 ring-1 ring-zinc-900/5"
            >
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="group/logout flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-black active:text-black"
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
