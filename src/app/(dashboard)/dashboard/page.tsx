"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  MessageSquare,
  Bookmark,
  Heart,
  Bell,
  Zap,
  PlusCircle,
  BookOpen,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useDashboardOverview, useDashboardAnalytics } from "@/features/dashboard/hooks/useDashboard";
import { useAIHistory } from "@/features/ai/hooks/useAI";
import { useBookmarkedResearch } from "@/features/research/hooks/useBookmarks";
import { useFavorites } from "@/features/research/hooks/useFavorites";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";

import { StatsCard } from "@/features/dashboard/components/StatsCard";
import { ChartCard } from "@/features/dashboard/components/ChartCard";
import { QuickActionCard } from "@/features/dashboard/components/QuickActionCard";
import { RecentResearchCard } from "@/features/dashboard/components/RecentResearchCard";
import { RecentChatCard } from "@/features/dashboard/components/RecentChatCard";
import { RecentAIResultCard } from "@/features/dashboard/components/RecentAIResultCard";
import { DashboardSkeleton } from "@/features/dashboard/components/DashboardSkeleton";

// ─── Chart Colors ─────────────────────────────────────────────────────────
const CHART_COLORS = {
  research: "#6366f1",
  ai: "#a855f7",
  chats: "#10b981",
};

const PIE_COLORS = ["#6366f1", "#a855f7", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

// ─── Quick Actions Config ─────────────────────────────────────────────────
const QUICK_ACTIONS = [
  {
    title: "Create Research",
    description: "Start a new research project",
    href: "/research/new",
    icon: PlusCircle,
  },
  {
    title: "Generate AI Report",
    description: "Generate AI-powered research",
    href: "/ai",
    icon: Sparkles,
  },
  {
    title: "Open AI Chat",
    description: "Chat with your AI assistant",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Manage Research",
    description: "Browse all your projects",
    href: "/research",
    icon: BookOpen,
  },
];

export default function DashboardPage() {
  const { data: overview, isLoading: isOverviewLoading, isError: isOverviewError } = useDashboardOverview();
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useDashboardAnalytics("daily");
  const { data: aiHistoryData } = useAIHistory({ page: 1, limit: 5 });
  const { data: bookmarks } = useBookmarkedResearch();
  const { favorites } = useFavorites();
  const { data: notifications } = useNotifications();

  const unreadCount = (notifications ?? []).filter((n) => !n.isRead).length;
  const bookmarkCount = (bookmarks ?? []).length;
  const favoriteCount = favorites.length;

  if (isOverviewLoading) {
    return <DashboardSkeleton />;
  }

  if (isOverviewError || !overview) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-24 gap-4 text-center">
        <div className="h-14 w-14 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
          <Zap className="h-6 w-6 text-destructive" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold text-foreground">Failed to load dashboard</p>
        <p className="text-xs text-muted-foreground">Please refresh the page or try again later.</p>
      </div>
    );
  }

  // Derive category distribution from analytics for pie chart
  const categoryData = [
    { name: "Research", value: overview.stats.totalResearch },
    { name: "AI Reports", value: overview.stats.totalAIGenerations },
    { name: "Chats", value: overview.stats.totalConversations },
    { name: "Bookmarks", value: bookmarkCount },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Your research workspace at a glance
        </p>
      </motion.div>

      {/* ─── Stats Cards Grid ──────────────────────────────────────────────── */}
      <section aria-label="Overview statistics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard
            label="Total Research"
            value={overview.stats.totalResearch}
            icon={FileText}
            description="Research projects created"
          />
          <StatsCard
            label="AI Reports"
            value={overview.stats.totalAIGenerations}
            icon={Sparkles}
            description="AI-generated reports"
          />
          <StatsCard
            label="Conversations"
            value={overview.stats.totalConversations}
            icon={MessageSquare}
            description="Total AI chat sessions"
          />
          <StatsCard
            label="Bookmarks"
            value={bookmarkCount}
            icon={Bookmark}
            description="Saved research projects"
          />
          <StatsCard
            label="Favorites"
            value={favoriteCount}
            icon={Heart}
            description="Favorited projects"
          />
          <StatsCard
            label="Unread Notifications"
            value={unreadCount}
            icon={Bell}
            description="Unread notifications"
          />
        </div>
      </section>

      {/* ─── Charts Grid ──────────────────────────────────────────────────── */}
      <section aria-label="Activity charts">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Research Activity Area Chart */}
          <ChartCard
            title="Research Activity"
            description="Daily research and AI generation trends"
            isLoading={isAnalyticsLoading}
          >
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={analyticsData ?? []} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="researchGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.research} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS.research} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.ai} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS.ai} stopOpacity={0} />
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
                  stroke={CHART_COLORS.research}
                  strokeWidth={2}
                  fill="url(#researchGrad)"
                  name="Research"
                />
                <Area
                  type="monotone"
                  dataKey="aiGenerations"
                  stroke={CHART_COLORS.ai}
                  strokeWidth={2}
                  fill="url(#aiGrad)"
                  name="AI Reports"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* AI Usage Bar Chart */}
          <ChartCard
            title="AI Usage"
            description="AI interactions and token usage overview"
            isLoading={isAnalyticsLoading}
          >
            <ResponsiveContainer width="100%" height={200}>
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
                <Bar
                  dataKey="aiGenerations"
                  fill={CHART_COLORS.ai}
                  radius={[4, 4, 0, 0]}
                  name="AI Reports"
                />
                <Bar
                  dataKey="chats"
                  fill={CHART_COLORS.chats}
                  radius={[4, 4, 0, 0]}
                  name="Chats"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Research Categories Pie Chart */}
          <ChartCard
            title="Research Categories"
            description="Distribution of your activity by category"
            isLoading={isOverviewLoading}
          >
            {categoryData.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-xs text-muted-foreground">
                No data to display yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
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

          {/* Weekly Activity Bar Chart */}
          <ChartCard
            title="Weekly Activity"
            description="Total research and chat sessions per period"
            isLoading={isAnalyticsLoading}
          >
            <ResponsiveContainer width="100%" height={200}>
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
                <Bar
                  dataKey="research"
                  fill={CHART_COLORS.research}
                  radius={[4, 4, 0, 0]}
                  name="Research"
                />
                <Bar
                  dataKey="chats"
                  fill={CHART_COLORS.chats}
                  radius={[4, 4, 0, 0]}
                  name="Chats"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </section>

      {/* ─── Recent Items Row ─────────────────────────────────────────────── */}
      <section aria-label="Recent activity items">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RecentResearchCard items={overview.recentResearch} />
          <RecentAIResultCard />
          <RecentChatCard items={overview.recentChats} />
        </div>
      </section>

      {/* ─── Quick Actions Row ────────────────────────────────────────────── */}
      <section aria-label="Quick actions">
        <h2 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <QuickActionCard
              key={action.href}
              title={action.title}
              description={action.description}
              href={action.href}
              icon={action.icon}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
