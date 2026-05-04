"use client";

import {
  Activity,
  Gift,
  Home,
  LayoutTemplate,
  Library,
  Megaphone,
  MessageSquare,
  ScanLine,
  ShoppingBag,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HOME_HREF = "/restaurant/dashboard" as const;

const nav = [
  { href: HOME_HREF, label: "Home", icon: Home },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { href: "/dashboard/activity", label: "Activity", icon: Activity },
  {
    href: "/dashboard/website-builder",
    label: "Website builder",
    icon: LayoutTemplate,
  },
  { href: "/dashboard/scanning", label: "Scanning", icon: ScanLine },
  { href: "/restaurant/dashboard/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/dashboard/ad-library", label: "Ad library", icon: Library },
  { href: "/dashboard/members", label: "Members", icon: Users },
  { href: "/dashboard/program", label: "Program", icon: Gift },
  { href: "/dashboard/chats", label: "Chats", icon: MessageSquare },
] as const;

export default function AdminPanelSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="relative flex min-h-0 w-[17rem] shrink-0 flex-col border-r border-zinc-200 bg-gradient-to-b from-white via-zinc-50/40 to-white shadow-[6px_0_32px_-8px_rgba(0,0,0,0.06)]"
      aria-label="Admin navigation"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent"
        aria-hidden
      />

      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-3 pb-4 pt-7">
        {nav.map(({ href, label, icon: Icon }) => {
          // Home is only `/restaurant/dashboard`; deeper routes (e.g. campaigns) use their own nav item.
          const active =
            href === HOME_HREF
              ? pathname === HOME_HREF
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-xl py-2.5 pl-3 pr-3 text-sm font-medium transition-all duration-200 outline-none ring-offset-2 ring-offset-white focus-visible:ring-2 focus-visible:ring-black/20 ${
                active
                  ? "bg-black text-white shadow-sm shadow-black/25 ring-1 ring-white/15"
                  : "text-zinc-600 hover:bg-black hover:text-white hover:shadow-sm hover:shadow-black/20 active:bg-black active:text-white"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-white/15 text-white ring-1 ring-white/20"
                    : "bg-transparent text-zinc-500 group-hover:bg-white/15 group-hover:text-white group-active:text-white"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden strokeWidth={2} />
              </span>
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
