import type { Research } from "./research";
import type { Conversation } from "./chat";

// ─── Dashboard Overview ───────────────────────────────────────────────────
export interface DashboardOverview {
  stats: {
    totalResearch: number;
    totalAIGenerations: number;
    totalConversations: number;
  };
  aiUsage: {
    totalTokens: number;
    averageTimeMs: number;
    totalGenerations: number;
  };
  recentResearch: Research[];
  recentChats: Conversation[];
}

// ─── Analytics Range ──────────────────────────────────────────────────────
export type AnalyticsRange = "daily" | "weekly" | "monthly" | "yearly";

// ─── Analytics Data Point (matches backend AnalyticsBucket) ───────────────
export interface AnalyticsBucket {
  label: string;
  research: number;
  aiGenerations: number;
  chats: number;
}
