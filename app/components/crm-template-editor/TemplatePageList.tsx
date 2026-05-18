"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  CreditCard,
  Home,
  Pencil,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  pageListContainerVariants,
  pageListEditVariants,
  pageListIconVariants,
  pageListLabelVariants,
  pageListRowVariants,
} from "@/app/components/crm-template-editor/editor-animation";
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
    <nav className="bg-white px-2 py-2 [&_button]:cursor-pointer">
      <motion.p
        className="px-1 pb-2 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[#6B7280]"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        Pages
      </motion.p>

      <motion.ul
        className="space-y-1"
        variants={pageListContainerVariants}
        initial="hidden"
        animate="show"
      >
        {FUNNEL_PAGE_ORDER.map((id) => {
          const p = byId[id];
          if (!p) return null;
          const selected = activeId === id;
          const Icon = PAGE_ICONS[id];

          return (
            <motion.li key={id} variants={pageListRowVariants}>
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className={`relative flex items-stretch overflow-hidden rounded-xl transition-colors ${
                  selected
                    ? "bg-black shadow-md shadow-black/15"
                    : "bg-transparent hover:bg-slate-50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(id)}
                  className={`flex min-w-0 flex-1 items-center gap-2.5 px-2.5 py-2.5 text-left ${
                    selected ? "text-white" : "text-[#111827]"
                  }`}
                >
                  <motion.span variants={pageListIconVariants} className="flex shrink-0">
                    <Icon
                      className={`size-4 ${
                        selected ? "text-white/95" : "text-[#6B7280]"
                      }`}
                      strokeWidth={2}
                      aria-hidden
                    />
                  </motion.span>
                  <motion.span
                    variants={pageListLabelVariants}
                    className={`min-w-0 truncate text-[0.8125rem] font-medium leading-tight ${
                      selected ? "text-white" : "text-[#111827]"
                    }`}
                  >
                    {p.label}
                  </motion.span>
                </button>
                <motion.button
                  type="button"
                  variants={pageListEditVariants}
                  aria-label={`Edit ${p.label}`}
                  title="Edit page"
                  onClick={() => onEditPage(id)}
                  className={`flex shrink-0 items-center justify-center rounded-lg px-2 py-2 transition ${
                    selected
                      ? "text-white/90 hover:bg-white/15"
                      : "text-[#6B7280] hover:bg-slate-100 hover:text-[#111827]"
                  }`}
                >
                  <Pencil className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
                </motion.button>
              </motion.div>
            </motion.li>
          );
        })}
      </motion.ul>
    </nav>
  );
}
