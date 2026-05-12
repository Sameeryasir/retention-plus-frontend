"use client";

import {
  CheckCircle2,
  CreditCard,
  Home,
  Pencil,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TemplatePageId } from "@/app/components/crm-template-editor/template-types";

export const FUNNEL_PAGE_ORDER: TemplatePageId[] = [
  "landing",
  "signup",
  "payment",
  "confirmation",
];

const PAGE_ICONS: Record<TemplatePageId, LucideIcon> = {
  landing: Home,
  signup: UserPlus,
  payment: CreditCard,
  confirmation: CheckCircle2,
};

export function TemplatePageList({
  pages,
  activeId,
  onSelect,
  onEditPage,
}: {
  pages: { id: TemplatePageId; label: string }[];
  activeId: TemplatePageId;
  onSelect: (id: TemplatePageId) => void;
  onEditPage: (id: TemplatePageId) => void;
}) {
  const byId = Object.fromEntries(pages.map((p) => [p.id, p])) as Record<
    TemplatePageId,
    { id: TemplatePageId; label: string }
  >;

  return (
    <nav className="border-b border-zinc-200 bg-white px-2 py-2 [&_button]:cursor-pointer">
      <p className="px-2 pb-2 text-[0.65rem] font-semibold uppercase tracking-wide text-zinc-500">
        Pages
      </p>
      <ul className="space-y-0.5">
        {FUNNEL_PAGE_ORDER.map((id) => {
          const p = byId[id];
          if (!p) return null;
          const selected = activeId === id;
          return (
            <li key={id}>
              <div
                className={`flex items-stretch overflow-hidden rounded-lg ${
                  selected ? "bg-zinc-900 shadow-sm" : "bg-transparent"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(id)}
                  className={`flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 px-3 py-2.5 text-left text-sm font-medium transition ${
                    selected ? "text-white" : "text-zinc-700"
                  }`}
                >
                  {(() => {
                    const Icon = PAGE_ICONS[id];
                    return (
                      <Icon
                        className={`size-4 shrink-0 ${
                          selected ? "text-white" : "text-zinc-500"
                        }`}
                        strokeWidth={2}
                        aria-hidden
                      />
                    );
                  })()}
                  <span className="min-w-0 truncate">{p.label}</span>
                </button>
                <button
                  type="button"
                  aria-label={`Edit ${p.label}`}
                  title="Edit page"
                  onClick={() => onEditPage(id)}
                  className={`flex shrink-0 cursor-pointer items-center justify-center rounded-md px-2.5 py-2 transition ${
                    selected
                      ? "text-white/90 hover:bg-white/15 hover:text-white"
                      : "text-zinc-500 hover:bg-zinc-200/90 hover:text-zinc-900"
                  }`}
                >
                  <Pencil className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
