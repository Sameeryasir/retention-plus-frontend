"use client";

import { Calendar, Hash, Mail, Phone, UserRound, Users } from "lucide-react";
import { motion } from "framer-motion";
import { OverviewAlertDialog } from "@/app/components/campaign/OverviewAlertDialog";
import { OffsetPagination } from "@/app/components/shared/OffsetPagination";
import { PanelEmptyState } from "@/app/components/shared/PanelEmptyState";
import { ReportTable } from "@/app/components/shared/ReportTable";
import { TableColumnHeader } from "@/app/components/TableColumnHeader";
import { Skeleton } from "@/app/components/skeleton";
import { useCustomers } from "@/app/hooks/use-customers";
import { formatDateTimeShort } from "@/app/lib/datetime";
import { standardEase } from "@/app/lib/motion";
import { CUSTOMERS_PAGE_SIZE } from "@/app/services/customer/get-customers";
import { useEffect, useMemo, useState } from "react";

const thClass =
  "whitespace-nowrap px-4 py-4 text-left align-middle sm:px-5";
const tdClass = "px-4 py-4 text-left align-middle text-sm sm:px-5";

const tableHeaderReveal = {
  hidden: { opacity: 0, y: -14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: standardEase },
  },
};

const tableRowReveal = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: standardEase },
  },
};

const tableBodyStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const AVATAR_COLORS = [
  "from-violet-500 to-purple-600",
  "from-sky-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-fuchsia-500 to-purple-600",
  "from-cyan-500 to-sky-600",
  "from-lime-500 to-green-600",
  "from-red-500 to-rose-600",
  "from-indigo-500 to-violet-600",
] as const;

function GuestsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] ring-1 ring-zinc-950/[0.04]">
      <div className="border-b border-zinc-200/90 px-5 py-4">
        <div className="flex items-center gap-3">
          <Skeleton funnel className="size-10 shrink-0 rounded-xl" />
          <div className="space-y-2">
            <Skeleton funnel className="h-4 w-20" />
            <Skeleton funnel className="h-3 w-48" />
          </div>
        </div>
      </div>
      <div className="border-b border-zinc-200 bg-zinc-50/95 px-5 py-3.5">
        <div className="flex gap-6">
          <Skeleton funnel className="h-3 w-8" />
          <Skeleton funnel className="h-3 w-16" />
          <Skeleton funnel className="h-3 w-20" />
          <Skeleton funnel className="h-3 w-16" />
          <Skeleton funnel className="h-3 w-16" />
        </div>
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-6 border-b border-zinc-100 px-5 py-4 last:border-0"
        >
          <Skeleton funnel className="size-8 shrink-0 rounded-lg" />
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Skeleton funnel className="size-10 shrink-0 rounded-full" />
            <Skeleton funnel className="h-4 w-28" />
          </div>
          <Skeleton funnel className="h-4 w-36" />
          <Skeleton funnel className="h-4 w-24" />
          <Skeleton funnel className="h-4 w-28" />
        </div>
      ))}
    </div>
  );
}

function guestInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function guestAvatarColor(seed: number): string {
  return AVATAR_COLORS[Math.abs(seed) % AVATAR_COLORS.length];
}

export function CampaignGuestsPanel() {
  const { data: customers, meta, page, setPage, loading, error } =
    useCustomers(true);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertDismissed, setAlertDismissed] = useState(false);

  const pageSize = meta?.limit ?? CUSTOMERS_PAGE_SIZE;
  const rowOffset = useMemo(
    () => (page - 1) * pageSize,
    [page, pageSize],
  );

  useEffect(() => {
    if (loading || !error || alertDismissed) return;
    setAlertMessage(error);
  }, [error, loading, alertDismissed]);

  const showEmpty = !loading && !error && (meta?.total ?? 0) === 0;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-zinc-50">
      <OverviewAlertDialog
        open={alertMessage != null}
        message={alertMessage ?? ""}
        onClose={() => {
          setAlertMessage(null);
          setAlertDismissed(true);
        }}
      />

      <div className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {loading && customers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: standardEase }}
          >
            <GuestsTableSkeleton />
          </motion.div>
        ) : null}

        {showEmpty ? (
          <PanelEmptyState
            icon={Users}
            title="No guests yet"
            description="Customers who sign up through your funnel will appear here."
          />
        ) : null}

        {!loading && !error && customers.length > 0 ? (
          <motion.div
            key={`guests-page-${page}`}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: standardEase }}
          >
            <ReportTable
              className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_12px_40px_rgba(88,28,135,0.08)] ring-1 ring-violet-100/80"
              header={
                <motion.div
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: standardEase }}
                  className="relative overflow-hidden border-b border-violet-100/80 bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700 px-5 py-5 sm:px-6"
                >
                  <div
                    className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-white/10 blur-2xl"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute -bottom-12 left-1/3 size-32 rounded-full bg-indigo-400/20 blur-2xl"
                    aria-hidden
                  />
                  <div className="relative flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <span className="flex size-11 items-center justify-center rounded-2xl bg-white/15 text-white shadow-lg shadow-violet-900/20 ring-1 ring-white/20 backdrop-blur-sm">
                        <Users className="size-5" aria-hidden />
                      </span>
                      <div>
                        <h3 className="text-lg font-bold tracking-tight text-white">
                          Guests
                        </h3>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-bold tabular-nums text-violet-700 shadow-lg shadow-violet-900/10 ring-1 ring-white/60">
                      <Users className="size-4 text-violet-600" aria-hidden />
                      {meta?.total ?? customers.length} total
                    </span>
                  </div>
                </motion.div>
              }
              footer={
                meta && meta.totalPages > 1 ? (
                  <OffsetPagination
                    page={page}
                    totalPages={meta.totalPages}
                    total={meta.total}
                    limit={meta.limit}
                    loading={loading}
                    onPageChange={setPage}
                    itemLabel="guests"
                  />
                ) : null
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[44rem] border-collapse">
                  <thead>
                    <motion.tr
                      variants={tableHeaderReveal}
                      initial="hidden"
                      animate="show"
                      className="border-b border-zinc-200/90 bg-gradient-to-b from-zinc-50 via-white to-white"
                    >
                      <th className={`${thClass} w-16`}>
                        <TableColumnHeader
                          variant="boxed"
                          icon={Hash}
                          label="#"
                          iconClassName="text-violet-600"
                          iconBoxClassName="border-violet-200/80 bg-violet-50"
                        />
                      </th>
                      <th className={thClass}>
                        <TableColumnHeader
                          variant="boxed"
                          icon={UserRound}
                          label="Guest"
                          iconClassName="text-indigo-600"
                          iconBoxClassName="border-indigo-200/80 bg-indigo-50"
                        />
                      </th>
                      <th className={thClass}>
                        <TableColumnHeader
                          variant="boxed"
                          icon={Mail}
                          label="Email"
                          iconClassName="text-blue-600"
                          iconBoxClassName="border-blue-200/80 bg-blue-50"
                        />
                      </th>
                      <th className={thClass}>
                        <TableColumnHeader
                          variant="boxed"
                          icon={Phone}
                          label="Phone"
                          iconClassName="text-emerald-600"
                          iconBoxClassName="border-emerald-200/80 bg-emerald-50"
                        />
                      </th>
                      <th className={thClass}>
                        <TableColumnHeader
                          variant="boxed"
                          icon={Calendar}
                          label="Joined"
                          iconClassName="text-orange-600"
                          iconBoxClassName="border-orange-200/80 bg-orange-50"
                        />
                      </th>
                    </motion.tr>
                  </thead>
                  <motion.tbody
                    variants={tableBodyStagger}
                    initial="hidden"
                    animate="show"
                  >
                    {customers.map((customer, index) => {
                      const rowNumber = rowOffset + index + 1;
                      const initials = guestInitials(customer.name);
                      const avatarColor = guestAvatarColor(
                        customer.id * 13 + index * 7,
                      );

                      return (
                        <motion.tr
                          key={customer.id}
                          variants={tableRowReveal}
                          className="group border-b border-zinc-100/90 bg-white transition-[background-color,box-shadow] duration-200 last:border-0 hover:bg-violet-50/50 hover:shadow-[inset_4px_0_0_0_rgb(124_58_237)]"
                        >
                          <td className={tdClass}>
                            <span className="inline-flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 text-xs font-bold tabular-nums text-violet-700 ring-1 ring-violet-200/70 transition group-hover:from-violet-200 group-hover:to-indigo-200">
                              {rowNumber}
                            </span>
                          </td>
                          <td className={tdClass}>
                            <div className="flex items-center gap-3">
                              <span
                                className={`flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarColor} text-xs font-bold tracking-wide text-white shadow-md shadow-black/10 ring-2 ring-white transition duration-200 group-hover:scale-105 group-hover:shadow-lg`}
                              >
                                {initials}
                              </span>
                              <div className="min-w-0">
                                <span className="block truncate font-semibold text-zinc-900">
                                  {customer.name}
                                </span>
                                <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                                  Guest
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className={`${tdClass} max-w-[14rem] sm:max-w-none`}>
                            <a
                              href={`mailto:${customer.email}`}
                              className="block truncate font-medium text-blue-600 underline-offset-2 transition hover:text-blue-700 hover:underline"
                              title={customer.email}
                            >
                              {customer.email}
                            </a>
                          </td>
                          <td className={tdClass}>
                            {customer.phone?.trim() ? (
                              <a
                                href={`tel:${customer.phone.trim()}`}
                                className="font-medium text-blue-600 underline-offset-2 transition hover:text-blue-700 hover:underline"
                              >
                                {customer.phone}
                              </a>
                            ) : (
                              <span className="text-zinc-300">—</span>
                            )}
                          </td>
                          <td className={`${tdClass} whitespace-nowrap`}>
                            <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100/90 px-3 py-1.5 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200/80 transition group-hover:bg-white group-hover:ring-violet-200/80">
                              <Calendar
                                className="size-3.5 shrink-0 text-orange-500"
                                aria-hidden
                              />
                              {formatDateTimeShort(customer.createdAt)}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </motion.tbody>
                </table>
              </div>
            </ReportTable>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
