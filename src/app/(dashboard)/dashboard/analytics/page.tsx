"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  TrendingUp,
  BarChart3,
  Loader2,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { useDashboardOverview, useDashboardAnalytics } from "@/features/dashboard/hooks/useDashboard";
import { StatsCard } from "@/features/dashboard/components/StatsCard";
import { ChartCard } from "@/features/dashboard/components/ChartCard";
import { AnalyticsSkeleton } from "@/features/dashboard/components/DashboardSkeleton";
import type { AnalyticsRange } from "@/types/dashboard";

// ─── Colors ───────────────────────────────────────────────────────────────
const COLORS = {
  research: "#6366f1",
  ai: "#a855f7",
  chats: "#10b981",
};

const PIE_COLORS = ["#6366f1", "#a855f7", "#10b981", "#f59e0b"];

// ─── Range Selector ───────────────────────────────────────────────────────
const RANGES: { label: string; value: AnalyticsRange }[] = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState<AnalyticsRange>("daily");

  const { data: overview, isLoading: isOverviewLoading } = useDashboardOverview();
  const {
    data: analyticsData,
    isLoading: isAnalyticsLoading,
    isFetching,
  } = useDashboardAnalytics(range);

  if (isOverviewLoading && isAnalyticsLoading) {
    return <AnalyticsSkeleton />;
  }

  // Calculate growth percentage from analytics data
  const totalBuckets = analyticsData?.length ?? 1;
  const recentHalf = analyticsData?.slice(Math.floor(totalBuckets / 2)) ?? [];
  const prevHalf = analyticsData?.slice(0, Math.floor(totalBuckets / 2)) ?? [];

  const recentTotal = recentHalf.reduce(
    (sum, b) => sum + b.research + b.aiGenerations + b.chats,
    0
  );
  const prevTotal = prevHalf.reduce(
    (sum, b) => sum + b.research + b.aiGenerations + b.chats,
    0
  );

  const growthPct = prevTotal === 0
    ? recentTotal > 0 ? 100 : 0
    : Math.round(((recentTotal - prevTotal) / prevTotal) * 100);

  const totalTokens = overview?.aiUsage.totalTokens ?? 0;
  const avgTimeMs = overview?.aiUsage.averageTimeMs ?? 0;
  const totalGenerations = overview?.stats.totalAIGenerations ?? 0;
  const avgTokensPerGen = totalGenerations > 0
    ? Math.round(totalTokens / totalGenerations)
    : 0;

  // Pie data: overall distribution
  const distributionData = [
    { name: "Research", value: overview?.stats.totalResearch ?? 0 },
    { name: "AI Reports", value: overview?.stats.totalAIGenerations ?? 0 },
    { name: "Chats", value: overview?.stats.totalConversations ?? 0 },
    { name: "Avg Tokens/Gen", value: avgTokensPerGen },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-start justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Analytics</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Deep insights into your research and AI usage
          </p>
        </div>

        {/* Range selector */}
        <div
          className="flex items-center bg-card border border-border rounded-lg p-1 gap-1"
          role="tablist"
          aria-label="Select analytics time range"
        >
          {RANGES.map((r) => (
            <button
              key={r.value}
              role="tab"
              aria-selected={range === r.value}
              onClick={() => setRange(r.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
                range === r.value
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
              id={`range-tab-${r.value}`}
            >
              {r.label}
            </button>
          ))}
          {isFetching && (
            <Loader2
              className="h-3.5 w-3.5 animate-spin text-muted-foreground ml-1"
              aria-label="Refreshing analytics"
            />
          )}
        </div>
      </motion.div>

      {/* ─── Overview Stats Cards ─────────────────────────────────────────── */}
      <section aria-label="Analytics overview metrics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Research"
            value={overview?.stats.totalResearch ?? 0}
            icon={FileText}
            description="All research projects"
          />
          <StatsCard
            label="Total AI Tokens"
            value={totalTokens}
            icon={Sparkles}
            description={`Across ${totalGenerations} generations`}
            formatType="tokens"
          />
          <StatsCard
            label="Avg AI Time"
            value={avgTimeMs}
            icon={BarChart3}
            description="Average generation duration"
            formatType="time"
          />
          <StatsCard
            label="Growth"
            value={Math.abs(growthPct)}
            icon={TrendingUp}
            description={`${growthPct >= 0 ? "+" : "-"}${Math.abs(growthPct)}% vs prior period`}
          />
        </div>
      </section>

      {/* ─── Charts ───────────────────────────────────────────────────────── */}
      <section aria-label="Analytics charts">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Line Chart — Research trend */}
          <ChartCard
            title="Research Trend"
            description={`Research activity over ${range} periods`}
            isLoading={isAnalyticsLoading}
          >
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={analyticsData ?? []} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: 11,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line
                  type="monotone"
                  dataKey="research"
                  stroke={COLORS.research}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: COLORS.research }}
                  activeDot={{ r: 5 }}
                  name="Research"
                />
                <Line
                  type="monotone"
                  dataKey="aiGenerations"
                  stroke={COLORS.ai}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: COLORS.ai }}
                  activeDot={{ r: 5 }}
                  name="AI Reports"
                />
                <Line
                  type="monotone"
                  dataKey="chats"
                  stroke={COLORS.chats}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: COLORS.chats }}
                  activeDot={{ r: 5 }}
                  name="Chats"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Bar Chart — Comparative view */}
          <ChartCard
            title="Comparative Usage"
            description="Side-by-side comparison of research, AI, and chats"
            isLoading={isAnalyticsLoading}
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={analyticsData ?? []} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: 11,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="research" fill={COLORS.research} radius={[4, 4, 0, 0]} name="Research" />
                <Bar dataKey="aiGenerations" fill={COLORS.ai} radius={[4, 4, 0, 0]} name="AI Reports" />
                <Bar dataKey="chats" fill={COLORS.chats} radius={[4, 4, 0, 0]} name="Chats" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Pie Chart — Activity distribution */}
          <ChartCard
            title="Activity Distribution"
            description="Overall breakdown of your platform usage"
            isLoading={isOverviewLoading}
          >
            {distributionData.length === 0 ? (
              <div className="h-[220px] flex items-center justify-center text-xs text-muted-foreground">
                No data to display yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={50}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {distributionData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: 11,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Area Chart — Cumulative activity */}
          <ChartCard
            title="Cumulative Activity"
            description="Running total of all platform actions"
            isLoading={isAnalyticsLoading}
          >
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={analyticsData ?? []} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="analyticsResearch" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.research} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={COLORS.research} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="analyticsAI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.ai} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={COLORS.ai} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="analyticsChats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.chats} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={COLORS.chats} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: 11,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Area
                  type="monotone"
                  dataKey="research"
                  stroke={COLORS.research}
                  strokeWidth={2}
                  fill="url(#analyticsResearch)"
                  name="Research"
                  stackId="1"
                />
                <Area
                  type="monotone"
                  dataKey="aiGenerations"
                  stroke={COLORS.ai}
                  strokeWidth={2}
                  fill="url(#analyticsAI)"
                  name="AI Reports"
                  stackId="1"
                />
                <Area
                  type="monotone"
                  dataKey="chats"
                  stroke={COLORS.chats}
                  strokeWidth={2}
                  fill="url(#analyticsChats)"
                  name="Chats"
                  stackId="1"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </section>
    </div>
  );
}
