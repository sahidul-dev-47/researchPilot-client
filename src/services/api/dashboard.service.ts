import apiClient from "@/services/axios";
import type { ApiResponse } from "@/types/api";
import type { DashboardOverview, AnalyticsData, AnalyticsRange } from "@/types/dashboard";

// ─── GET /api/dashboard/overview ─────────────────────────────────────────
export async function getDashboardOverview(): Promise<DashboardOverview> {
  const response = await apiClient.get<ApiResponse<DashboardOverview>>(
    "/dashboard/overview"
  );
  return response.data.data;
}

// ─── GET /api/dashboard/analytics?range=daily|weekly|monthly|yearly ───────
export async function getDashboardAnalytics(
  range: AnalyticsRange = "daily"
): Promise<AnalyticsData> {
  const response = await apiClient.get<ApiResponse<AnalyticsData>>(
    "/dashboard/analytics",
    { params: { range } }
  );
  return response.data.data;
}
