"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { OverviewChartShell } from "@/app/components/campaign/overview/charts/OverviewChartShell";
import { OverviewChartTooltip } from "@/app/components/campaign/overview/charts/OverviewChartTooltip";
import {
  hasSignupBreakdownData,
  OVERVIEW_CHART_COLORS,
  OVERVIEW_MONTH_COUNT,
  type ChartNameValue,
} from "@/app/components/campaign/overview/charts/overview-chart-config";

const SLICE_COLORS = [OVERVIEW_CHART_COLORS.amber, OVERVIEW_CHART_COLORS.emerald];

export function SignupBreakdownPieChart({ data }: { data: ChartNameValue[] }) {
  const hasData = hasSignupBreakdownData(data);

  return (
    <OverviewChartShell
      title="Signup breakdown"
      subtitle={`Month view · last ${OVERVIEW_MONTH_COUNT} months combined`}
      minHeightClass="min-h-[280px]"
    >
      {hasData ? (
        <div className="h-full w-full min-h-[240px] flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="52%"
                outerRadius="78%"
                paddingAngle={2}
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                labelLine={{ stroke: "#a1a1aa", strokeWidth: 1 }}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={SLICE_COLORS[index] ?? SLICE_COLORS[0]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<OverviewChartTooltip />} />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                formatter={(value) => (
                  <span className="text-zinc-600">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="flex flex-1 items-center justify-center text-sm text-zinc-500">
          No signup breakdown in this period.
        </p>
      )}
    </OverviewChartShell>
  );
}
