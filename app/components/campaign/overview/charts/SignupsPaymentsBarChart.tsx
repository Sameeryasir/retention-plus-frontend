"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { OverviewChartShell } from "@/app/components/campaign/overview/charts/OverviewChartShell";
import { OverviewChartTooltip } from "@/app/components/campaign/overview/charts/OverviewChartTooltip";
import {
  OVERVIEW_CHART_COLORS,
  OVERVIEW_CHART_MARGIN,
  OVERVIEW_MONTH_COUNT,
  type MonthlySignupsPaymentsPoint,
} from "@/app/components/campaign/overview/charts/overview-chart-config";

export function SignupsPaymentsBarChart({
  data,
}: {
  data: MonthlySignupsPaymentsPoint[];
}) {
  return (
    <OverviewChartShell
      title="Signups vs payments"
      subtitle={`Month view · last ${OVERVIEW_MONTH_COUNT} months`}
      minHeightClass="min-h-[280px]"
    >
      <div className="h-full w-full min-h-[240px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ ...OVERVIEW_CHART_MARGIN, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#71717a", fontSize: 11 }}
              axisLine={{ stroke: "#e4e4e7" }}
              tickLine={false}
              interval={0}
              angle={-25}
              textAnchor="end"
              height={56}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "#71717a", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              content={<OverviewChartTooltip />}
              cursor={{ fill: "#f4f4f5" }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              formatter={(value) => (
                <span className="text-zinc-600">{value}</span>
              )}
            />
            <Bar
              dataKey="signups"
              name="Signups"
              fill={OVERVIEW_CHART_COLORS.emerald}
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="payments"
              name="Payments"
              fill={OVERVIEW_CHART_COLORS.blue}
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </OverviewChartShell>
  );
}
