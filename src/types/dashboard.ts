// ─── Dashboard Overview ───────────────────────────────────────────────────
export interface DashboardOverview {
  totalResearchProjects: number;
  totalAIReports: number;
  totalConversations: number;
  totalTokensUsed: number;
  recentResearch: RecentResearchItem[];
  recentAIReports: RecentAIReportItem[];
}

export interface RecentResearchItem {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
}

export interface RecentAIReportItem {
  _id: string;
  generatedTitle: string;
  model: string;
  tokensUsed: number;
  createdAt: string;
}

// ─── Analytics Range ──────────────────────────────────────────────────────
export type AnalyticsRange = "daily" | "weekly" | "monthly" | "yearly";

// ─── Analytics Data Point ─────────────────────────────────────────────────
export interface AnalyticsDataPoint {
  date: string;
  research: number;
  aiReports: number;
  messages: number;
}

export interface AnalyticsData {
  range: AnalyticsRange;
  data: AnalyticsDataPoint[];
}
