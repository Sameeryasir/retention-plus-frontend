"use client";

import {
  Activity,
  DollarSign,
  Eye,
  MousePointerClick,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { OverviewAlertDialog } from "@/app/components/campaign/OverviewAlertDialog";
import { AnalyticsMetricMiniChart } from "@/app/components/campaign/overview/charts/AnalyticsMetricMiniChart";
import {
  buildAnalyticsMonthlySeries,
  buildSignupBreakdownFromMonthly,
  buildSignupsPaymentsMonthlyData,
  computeConversionRate,
  OVERVIEW_MONTH_COUNT,
} from "@/app/components/campaign/overview/charts/overview-chart-config";
import { SignupBreakdownPieChart } from "@/app/components/campaign/overview/charts/SignupBreakdownPieChart";
import { SignupsPaymentsBarChart } from "@/app/components/campaign/overview/charts/SignupsPaymentsBarChart";
import { MetricStatCardAccent } from "@/app/components/shared/MetricStatCard";
import { Skeleton } from "@/app/components/skeleton";
import { useAnalyticsOverview } from "@/app/hooks/use-analytics-overview";
import { useAnalyticsOverviewMonthly } from "@/app/hooks/use-analytics-overview-monthly";
import { useFunnelEventStats } from "@/app/hooks/use-funnel-event-stats";
import { useFunnelStatsMonthly } from "@/app/hooks/use-funnel-stats-monthly";
import { formatCents } from "@/app/lib/money";
import { funnelPanelItem, funnelPanelStagger, standardEase } from "@/app/lib/motion";
import { panelCardClass, panelCardPaddingClass } from "@/app/lib/panel-styles";
import { OVERVIEW_CHART_COLORS } from "@/app/components/campaign/overview/charts/overview-chart-config";

function OverviewSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading stats">
      <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-full ${panelCardClass} ${panelCardPaddingClass}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton funnel className="h-3 w-16" />
                <Skeleton funnel className="h-8 w-20" />
                <Skeleton funnel className="h-3 w-28" />
              </div>
              <Skeleton funnel className="size-11 shrink-0 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid auto-rows-fr gap-5 lg:grid-cols-2">
        <div className={`h-full min-h-[280px] ${panelCardClass} ${panelCardPaddingClass}`}>
          <Skeleton funnel className="h-4 w-36" />
          <Skeleton funnel className="mt-2 h-3 w-28" />
          <Skeleton funnel className="mt-6 h-[220px] w-full rounded-xl" />
        </div>
        <div className={`h-full min-h-[280px] ${panelCardClass} ${panelCardPaddingClass}`}>
          <Skeleton funnel className="h-4 w-32" />
          <Skeleton funnel className="mt-2 h-3 w-40" />
          <Skeleton funnel className="mt-6 h-[220px] w-full rounded-full" />
        </div>
      </div>

      <div>
        <Skeleton funnel className="h-4 w-36" />
        <Skeleton funnel className="mt-2 h-3 w-56" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} funnel className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <Skeleton funnel className="h-48 w-full rounded-2xl" />
          <Skeleton funnel className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function NoRecordsFoundCard() {
  return (
    <div
      className={`${panelCardClass} ${panelCardPaddingClass} py-14 text-center`}
    >
      <p className="text-sm font-semibold text-zinc-900">No records found</p>
      <p className="mt-1.5 text-sm text-zinc-500">
        No signups or payments yet for this campaign.
      </p>
    </div>
  );
}

export function FunnelOverviewPanel({
  campaignName,
  funnelId,
  isFunnelIdLoading = false,
}: {
  campaignName?: string;
  price?: number | string;
  funnelId?: number | null;
  isFunnelIdLoading?: boolean;
}) {
  const { stats, isLoading: isStatsLoading, error } =
    useFunnelEventStats(funnelId);
  const {
    overview: analyticsOverview,
    isLoading: isAnalyticsLoading,
    error: analyticsError,
  } = useAnalyticsOverview(funnelId);
  const {
    monthly: statsMonthly,
    isLoading: isStatsMonthlyLoading,
    error: statsMonthlyError,
  } = useFunnelStatsMonthly(funnelId);
  const {
    monthly: analyticsMonthly,
    isLoading: isAnalyticsMonthlyLoading,
    error: analyticsMonthlyError,
  } = useAnalyticsOverviewMonthly(funnelId);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertDismissed, setAlertDismissed] = useState(false);

  const isWaitingForStats =
    funnelId != null && stats == null && error == null;
  const showSkeleton =
    isFunnelIdLoading ||
    isStatsLoading ||
    isWaitingForStats ||
    isAnalyticsLoading ||
    isStatsMonthlyLoading ||
    isAnalyticsMonthlyLoading;
  const showNoFunnelMessage = !showSkeleton && funnelId == null;
  const showNoRecords =
    !showSkeleton &&
    !error &&
    !analyticsError &&
    funnelId != null &&
    (stats == null ||
      (stats.signups === 0 && stats.payments === 0 && stats.revenue === 0));

  useEffect(() => {
    if (showSkeleton) return;

    const message =
      error ??
      statsMonthlyError ??
      analyticsError ??
      analyticsMonthlyError;
    if (message && !alertDismissed) {
      setAlertMessage(message);
    }
  }, [
    error,
    statsMonthlyError,
    analyticsError,
    analyticsMonthlyError,
    showSkeleton,
    alertDismissed,
  ]);

  useEffect(() => {
    setAlertDismissed(false);
    setAlertMessage(null);
  }, [funnelId]);

  const conversionRate = useMemo(
    () => (stats ? computeConversionRate(stats) : 0),
    [stats],
  );

  const signupsPaymentsMonthly = useMemo(
    () =>
      statsMonthly?.data
        ? buildSignupsPaymentsMonthlyData(statsMonthly.data)
        : [],
    [statsMonthly],
  );

  const signupBreakdownMonthly = useMemo(
    () =>
      statsMonthly?.data
        ? buildSignupBreakdownFromMonthly(statsMonthly.data)
        : [],
    [statsMonthly],
  );

  const pageViewsMonthly = useMemo(
    () =>
      analyticsMonthly?.data
        ? buildAnalyticsMonthlySeries(analyticsMonthly.data, "pageViews")
        : [],
    [analyticsMonthly],
  );

  const buttonClicksMonthly = useMemo(
    () =>
      analyticsMonthly?.data
        ? buildAnalyticsMonthlySeries(analyticsMonthly.data, "buttonClicks")
        : [],
    [analyticsMonthly],
  );

  const displayName = campaignName?.trim() ? campaignName : "Campaign";
  const hasMonthlyCharts = signupsPaymentsMonthly.length > 0;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-zinc-50 via-white to-zinc-100/70">
      <OverviewAlertDialog
        open={alertMessage != null}
        message={alertMessage ?? ""}
        onClose={() => {
          setAlertMessage(null);
          setAlertDismissed(true);
        }}
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
        <motion.header
          className="mb-8 rounded-2xl border border-zinc-200/80 bg-white/90 px-5 py-5 shadow-sm ring-1 ring-zinc-950/[0.03] backdrop-blur-sm sm:px-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: standardEase }}
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
              Overview
            </p>
            <h2 className="font-display mt-1 text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
              {displayName}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-600">
              Conversion metrics and live funnel behavior analytics — month
              view (last {OVERVIEW_MONTH_COUNT} months).
            </p>
          </div>
        </motion.header>

        {showNoFunnelMessage ? (
          <p className="rounded-2xl border border-amber-200/90 bg-amber-50 px-4 py-3.5 text-sm text-amber-950 shadow-sm">
            No funnel id yet. Open the Funnel tab and save once to load stats.
          </p>
        ) : null}

        {showSkeleton ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: standardEase }}
          >
            <OverviewSkeleton />
          </motion.div>
        ) : null}

        {showNoRecords ? <NoRecordsFoundCard /> : null}

        {stats && !showSkeleton && !showNoRecords ? (
          <motion.div
            key="overview-content"
            className="space-y-8"
            variants={funnelPanelStagger}
            initial="hidden"
            animate="show"
          >
            <motion.div
              className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-4"
              variants={funnelPanelStagger}
            >
              <motion.div className="h-full" variants={funnelPanelItem}>
                <MetricStatCardAccent
                  label="Signups"
                  value={stats.signups}
                  icon={UserPlus}
                  tone="emerald"
                />
              </motion.div>
              <motion.div className="h-full" variants={funnelPanelItem}>
                <MetricStatCardAccent
                  label="Payments"
                  value={stats.payments}
                  icon={Users}
                  tone="blue"
                  highlight={stats.payments > 0}
                />
              </motion.div>
              <motion.div className="h-full" variants={funnelPanelItem}>
                <MetricStatCardAccent
                  label="Revenue"
                  value={formatCents(stats.revenue, stats.currency ?? "usd")}
                  icon={DollarSign}
                  tone="violet"
                />
              </motion.div>
              <motion.div className="h-full" variants={funnelPanelItem}>
                <MetricStatCardAccent
                  label="Conversion"
                  value={`${conversionRate.toFixed(1)}%`}
                  icon={TrendingUp}
                  tone="zinc"
                  highlight={conversionRate >= 50}
                />
              </motion.div>
            </motion.div>

            {hasMonthlyCharts ? (
              <motion.div
                className="grid auto-rows-fr gap-5 lg:grid-cols-2"
                variants={funnelPanelStagger}
              >
                <motion.div className="h-full min-h-[300px]" variants={funnelPanelItem}>
                  <SignupsPaymentsBarChart data={signupsPaymentsMonthly} />
                </motion.div>
                <motion.div className="h-full min-h-[300px]" variants={funnelPanelItem}>
                  <SignupBreakdownPieChart data={signupBreakdownMonthly} />
                </motion.div>
              </motion.div>
            ) : null}

            {analyticsOverview ? (
              <motion.div className="space-y-5" variants={funnelPanelItem}>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">
                    Behavior analytics
                  </h3>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    Page views, clicks, sessions, and customers — month view
                  </p>
                </div>

                <motion.div
                  className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4"
                  variants={funnelPanelStagger}
                >
                  <motion.div className="h-full" variants={funnelPanelItem}>
                    <MetricStatCardAccent
                      label="Page views"
                      value={analyticsOverview.pageViews}
                      icon={Eye}
                      tone="blue"
                    />
                  </motion.div>
                  <motion.div className="h-full" variants={funnelPanelItem}>
                    <MetricStatCardAccent
                      label="Button clicks"
                      value={analyticsOverview.buttonClicks}
                      icon={MousePointerClick}
                      tone="violet"
                    />
                  </motion.div>
                  <motion.div className="h-full" variants={funnelPanelItem}>
                    <MetricStatCardAccent
                      label="Unique visitors"
                      value={analyticsOverview.uniqueVisitors}
                      icon={Users}
                      tone="emerald"
                    />
                  </motion.div>
                  <motion.div className="h-full" variants={funnelPanelItem}>
                    <MetricStatCardAccent
                      label="Sessions"
                      value={analyticsOverview.sessions}
                      icon={Activity}
                      tone="zinc"
                    />
                  </motion.div>
                </motion.div>

                {analyticsMonthly?.data?.length ? (
                  <motion.div
                    className="grid auto-rows-fr gap-5 lg:grid-cols-2"
                    variants={funnelPanelStagger}
                  >
                    <motion.div className="h-full" variants={funnelPanelItem}>
                      <AnalyticsMetricMiniChart
                        title="Page views by month"
                        subtitle="Total page views"
                        total={analyticsOverview.pageViews}
                        data={pageViewsMonthly}
                        strokeColor={OVERVIEW_CHART_COLORS.blue}
                      />
                    </motion.div>
                    <motion.div className="h-full" variants={funnelPanelItem}>
                      <AnalyticsMetricMiniChart
                        title="Button clicks by month"
                        subtitle="Total button clicks"
                        total={analyticsOverview.buttonClicks}
                        data={buttonClicksMonthly}
                        strokeColor={OVERVIEW_CHART_COLORS.violet}
                      />
                    </motion.div>
                  </motion.div>
                ) : null}
              </motion.div>
            ) : null}
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
