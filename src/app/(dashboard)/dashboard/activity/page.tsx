"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Activity, Loader2, CalendarDays } from "lucide-react";

import { useDashboardOverview } from "@/features/dashboard/hooks/useDashboard";
import { useAIHistory } from "@/features/ai/hooks/useAI";
import { ActivityTimeline } from "@/features/dashboard/components/ActivityTimeline";
import type { AIResearch } from "@/types/ai";
import type { Research } from "@/types/research";
import type { Conversation } from "@/types/chat";

// ─── Filter Options ───────────────────────────────────────────────────────
type FilterPeriod = "today" | "7d" | "30d" | "all";

const FILTER_OPTIONS: { label: string; value: FilterPeriod }[] = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "All Time", value: "all" },
];

function getStartDate(period: FilterPeriod): Date | null {
  const now = new Date();
  switch (period) {
    case "today": {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      return start;
    }
    case "7d": {
      const start = new Date(now);
      start.setDate(now.getDate() - 7);
      return start;
    }
    case "30d": {
      const start = new Date(now);
      start.setDate(now.getDate() - 30);
      return start;
    }
    case "all":
    default:
      return null;
  }
}

export default function ActivityPage() {
  const [filter, setFilter] = useState<FilterPeriod>("all");

  const { data: overview, isLoading: isOverviewLoading } = useDashboardOverview();
  const { data: aiHistoryData, isLoading: isAILoading } = useAIHistory({
    page: 1,
    limit: 50,
  });

  const isLoading = isOverviewLoading || isAILoading;

  // Derive typed arrays
  const researchItems: Research[] = overview?.recentResearch ?? [];
  const chatItems: Conversation[] = overview?.recentChats ?? [];
  const aiItems: AIResearch[] = aiHistoryData?.data ?? [];

  // Apply date filter
  const startDate = getStartDate(filter);

  const filteredResearch = useMemo(
    () =>
      startDate
        ? researchItems.filter((r) => new Date(r.updatedAt) >= startDate)
        : researchItems,
    [researchItems, startDate]
  );

  const filteredAI = useMemo(
    () =>
      startDate
        ? aiItems.filter((a) => new Date(a.createdAt) >= startDate)
        : aiItems,
    [aiItems, startDate]
  );

  const filteredChats = useMemo(
    () =>
      startDate
        ? chatItems.filter((c) => new Date(c.updatedAt) >= startDate)
        : chatItems,
    [chatItems, startDate]
  );

  const totalItems =
    filteredResearch.length + filteredAI.length + filteredChats.length;

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
          <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" aria-hidden="true" />
            Activity
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            A complete timeline of your research, AI, and chat activity
          </p>
        </div>

        {/* Filter buttons */}
        <div
          className="flex items-center bg-card border border-border rounded-lg p-1 gap-1"
          role="tablist"
          aria-label="Filter activity by time period"
        >
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              role="tab"
              aria-selected={filter === opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
                filter === opt.value
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
              id={`filter-tab-${opt.value}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Item count badge */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2"
        >
          <CalendarDays className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-xs text-muted-foreground font-medium">
            {totalItems === 0
              ? "No activity found for this period."
              : `Showing ${totalItems} activity item${totalItems !== 1 ? "s" : ""}`}
          </span>
        </motion.div>
      )}

      {/* ─── Timeline ─────────────────────────────────────────────────────── */}
      <section aria-label="Activity timeline">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2
                className="h-6 w-6 animate-spin text-muted-foreground"
                aria-label="Loading activity"
              />
            </div>
          ) : (
            <ActivityTimeline
              researchItems={filteredResearch}
              aiItems={filteredAI}
              chatItems={filteredChats}
            />
          )}
        </div>
      </section>
    </div>
  );
}
