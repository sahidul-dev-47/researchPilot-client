"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardOverview, getDashboardAnalytics } from "@/services/api/dashboard.service";
import { QUERY_KEYS } from "@/constants";
import type { AnalyticsRange } from "@/types/dashboard";

/**
 * Hook to fetch summary statistics, credit metrics, recent research, and chats.
 */
export function useDashboardOverview() {
  return useQuery({
    queryKey: QUERY_KEYS.dashboardOverview,
    queryFn: () => getDashboardOverview(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch structured analytics metrics over time.
 */
export function useDashboardAnalytics(range: AnalyticsRange = "daily") {
  return useQuery({
    queryKey: QUERY_KEYS.dashboardAnalytics(range),
    queryFn: () => getDashboardAnalytics(range),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
