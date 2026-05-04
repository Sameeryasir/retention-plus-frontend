"use client";

import {
  BarChart3,
  Building2,
  CreditCard,
  Cog,
  Link2,
  ScanLine,
  User,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

const DASHBOARD_HREF = "/dashboard" as const;

type SectionId =
  | "account"
  | "general"
  | "members"
  | "integrations"
  | "usage"
  | "scanning"
  | "subscription";

type NavItem = { id: SectionId; label: string; icon: typeof User };

const accountNav: NavItem[] = [{ id: "account", label: "Account", icon: User }];

const organizationNav: NavItem[] = [
  { id: "general", label: "General", icon: Cog },
  { id: "members", label: "Members", icon: Users },
  { id: "integrations", label: "Integrations", icon: Link2 },
  { id: "usage", label: "Usage", icon: BarChart3 },
  { id: "scanning", label: "Scanning", icon: ScanLine },
  { id: "subscription", label: "Subscription", icon: CreditCard },
];

const sectionTitles: Record<SectionId, string> = {
  account: "Account",
  general: "General",
  members: "Members",
  integrations: "Integrations",
  usage: "Usage",
  scanning: "Scanning",
  subscription: "Subscription",
};

type RestaurantSettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignOut: () => void;
};

export default function RestaurantSettingsDialog({
  open,
  onOpenChange,
  onSignOut,
}: RestaurantSettingsDialogProps) {
  const router = useRouter();
  const titleId = useId();
  const [section, setSection] = useState<SectionId>("account");

  if (!open) return null;

  const navButton = (item: NavItem) => {
    const Icon = item.icon;
    const selected = section === item.id;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => setSection(item.id)}
        className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
          selected
            ? "bg-sky-500/20 text-sky-100 ring-1 ring-sky-500/40"
            : "text-zinc-300 hover:bg-white/[0.06] hover:text-white"
        }`}
      >
        <Icon className="size-4 shrink-0 opacity-80" aria-hidden strokeWidth={2} />
        {item.label}
      </button>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-pointer bg-black/70 backdrop-blur-sm"
        aria-label="Close settings"
        onClick={() => onOpenChange(false)}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex h-[min(32rem,92dvh)] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl border border-zinc-700/90 bg-zinc-900 shadow-2xl shadow-black/60 sm:max-h-[85vh] sm:rounded-2xl"
        onKeyDown={(e) => {
          if (e.key === "Escape") onOpenChange(false);
        }}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-900/95 px-4 py-3 sm:px-5">
          <h2 id={titleId} className="text-base font-semibold tracking-tight text-white">
            Settings
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            aria-label="Close"
          >
            <X className="size-5" strokeWidth={2} aria-hidden />
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
          <aside className="flex w-full shrink-0 flex-col gap-4 border-b border-zinc-800 bg-zinc-950/80 p-3 sm:w-52 sm:border-b-0 sm:border-r sm:border-zinc-800 sm:py-4">
            <div>
              <p className="mb-1.5 px-3 text-[0.65rem] font-semibold uppercase tracking-wider text-zinc-500">
                Account
              </p>
              <div className="space-y-0.5">{accountNav.map(navButton)}</div>
            </div>
            <div>
              <p className="mb-1.5 px-3 text-[0.65rem] font-semibold uppercase tracking-wider text-zinc-500">
                Organization
              </p>
              <div className="space-y-0.5">{organizationNav.map(navButton)}</div>
            </div>
          </aside>

          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-zinc-950 p-5 sm:p-8">
            <h3 className="text-lg font-semibold text-white">{sectionTitles[section]}</h3>

            {section === "account" ? (
              <div className="mt-8 flex max-w-md flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    router.push(DASHBOARD_HREF);
                  }}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-sky-500/70 bg-transparent px-4 py-3 text-sm font-medium text-sky-400 transition-colors hover:border-sky-400 hover:bg-sky-500/10 hover:text-sky-300"
                >
                  <Building2 className="size-4 shrink-0" aria-hidden strokeWidth={2} />
                  Switch Organization
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSignOut();
                    onOpenChange(false);
                  }}
                  className="w-full cursor-pointer rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-500 active:bg-red-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <p className="mt-6 max-w-md text-sm leading-relaxed text-zinc-500">
                {sectionTitles[section]} settings will be available here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
