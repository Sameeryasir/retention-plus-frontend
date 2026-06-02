import type { FunnelAnalyticsMonthlyPoint } from "@/app/services/funnel/get-analytics-overview-monthly";
import type { FunnelStatsMonthlyPoint } from "@/app/services/funnel/get-funnel-stats-monthly";
import { OVERVIEW_MONTH_COUNT } from "@/app/components/campaign/overview/charts/overview-chart-config";

function buildRecentMonthKeys(monthCount: number): string[] {
  const now = new Date();
  const keys: string[] = [];

  for (let offset = monthCount - 1; offset >= 0; offset -= 1) {
    const start = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1),
    );
    const month = String(start.getUTCMonth() + 1).padStart(2, "0");
    keys.push(`${start.getUTCFullYear()}-${month}`);
  }

  return keys;
}

export function buildMockStatsMonthlyPoints(): FunnelStatsMonthlyPoint[] {
  const months = buildRecentMonthKeys(OVERVIEW_MONTH_COUNT);

  const signups = [14, 19, 17, 24, 31, 28];
  const payments = [5, 8, 7, 11, 15, 13];
  const signupOnly = [9, 11, 10, 13, 16, 15];
  const paidAfterSignup = [5, 8, 7, 11, 15, 13];
  const revenue = [42000, 68000, 56000, 94000, 128000, 112000];

  return months.map((month, index) => ({
    month,
    signups: signups[index] ?? 0,
    payments: payments[index] ?? 0,
    signupOnly: signupOnly[index] ?? 0,
    paidAfterSignup: paidAfterSignup[index] ?? 0,
    revenue: revenue[index] ?? 0,
  }));
}

export function buildMockAnalyticsMonthlyPoints(): FunnelAnalyticsMonthlyPoint[] {
  const months = buildRecentMonthKeys(OVERVIEW_MONTH_COUNT);

  const pageViews = [820, 960, 910, 1180, 1420, 1310];
  const buttonClicks = [210, 245, 230, 310, 368, 342];
  const uniqueVisitors = [540, 620, 590, 760, 890, 840];
  const sessions = [610, 710, 680, 860, 980, 920];

  return months.map((month, index) => ({
    month,
    pageViews: pageViews[index] ?? 0,
    buttonClicks: buttonClicks[index] ?? 0,
    uniqueVisitors: uniqueVisitors[index] ?? 0,
    sessions: sessions[index] ?? 0,
  }));
}

export function hasAnalyticsMonthlyActivity(
  points: FunnelAnalyticsMonthlyPoint[],
): boolean {
  return points.some(
    (row) =>
      row.pageViews > 0 ||
      row.buttonClicks > 0 ||
      row.uniqueVisitors > 0 ||
      row.sessions > 0,
  );
}

function analyticsMonthIsEmpty(row: FunnelAnalyticsMonthlyPoint): boolean {
  return (
    row.pageViews === 0 &&
    row.buttonClicks === 0 &&
    row.uniqueVisitors === 0 &&
    row.sessions === 0
  );
}

function statsMonthIsEmpty(row: FunnelStatsMonthlyPoint): boolean {
  return (
    row.signups === 0 &&
    row.payments === 0 &&
    row.signupOnly === 0 &&
    row.paidAfterSignup === 0 &&
    row.revenue === 0
  );
}

export function mergeAnalyticsWithMockPreview(
  real: FunnelAnalyticsMonthlyPoint[],
): { points: FunnelAnalyticsMonthlyPoint[]; usedMock: boolean } {
  if (!hasAnalyticsMonthlyActivity(real)) {
    return { points: buildMockAnalyticsMonthlyPoints(), usedMock: true };
  }

  const mockByMonth = new Map(
    buildMockAnalyticsMonthlyPoints().map((row) => [row.month, row]),
  );
  let usedMock = false;

  const points = real.map((row) => {
    if (!analyticsMonthIsEmpty(row)) {
      return row;
    }
    const sample = mockByMonth.get(row.month);
    if (!sample) {
      return row;
    }
    usedMock = true;
    return { ...sample };
  });

  return { points, usedMock };
}

export function mergeStatsWithMockPreview(
  real: FunnelStatsMonthlyPoint[],
): { points: FunnelStatsMonthlyPoint[]; usedMock: boolean } {
  const hasActivity = real.some(
    (row) =>
      row.signups > 0 || row.payments > 0 || row.revenue > 0,
  );

  if (!hasActivity) {
    return { points: buildMockStatsMonthlyPoints(), usedMock: true };
  }

  const mockByMonth = new Map(
    buildMockStatsMonthlyPoints().map((row) => [row.month, row]),
  );
  let usedMock = false;

  const points = real.map((row) => {
    if (!statsMonthIsEmpty(row)) {
      return row;
    }
    const sample = mockByMonth.get(row.month);
    if (!sample) {
      return row;
    }
    usedMock = true;
    return { ...sample };
  });

  return { points, usedMock };
}
