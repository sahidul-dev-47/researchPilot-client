import type { Metadata } from "next";
import { History } from "lucide-react";
import { AIHistoryList } from "@/features/ai/components/AIHistoryList";

export const metadata: Metadata = {
  title: "AI Research History",
  description:
    "Browse, search, and manage your AI-generated research report history.",
};

export default function AIHistoryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-md">
          <History className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            AI History
          </h1>
          <p className="text-sm text-muted-foreground">
            All your previously generated AI research reports
          </p>
        </div>
      </div>

      <AIHistoryList />
    </div>
  );
}
