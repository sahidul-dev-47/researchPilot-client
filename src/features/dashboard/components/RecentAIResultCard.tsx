"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Calendar, Loader2 } from "lucide-react";
import { useAIHistory } from "@/features/ai/hooks/useAI";
import { cn } from "@/lib/utils";

interface RecentAIResultCardProps {
  className?: string;
}

export function RecentAIResultCard({ className }: RecentAIResultCardProps) {
  // Fetch latest 5 AI generated reports directly from backend using TanStack query
  const { data, isLoading, isError } = useAIHistory({
    page: 1,
    limit: 5,
  });

  const items = data?.data ?? [];

  return (
    <div className={cn("rounded-xl border bg-card p-5 shadow-sm space-y-4", className)}>
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
          Recent AI Reports
        </h4>
        <Link
          href="/ai/history"
          className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
        >
          View all
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Loading reports" />
        </div>
      ) : isError ? (
        <div className="text-center py-6 text-xs text-destructive">
          Failed to load AI reports.
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-6 text-xs text-muted-foreground">
          No AI reports generated yet.
        </div>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 5).map((report) => {
            const formattedDate = new Date(report.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });

            return (
              <Link
                key={report._id}
                href={`/ai/result/${report._id}`}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/40 group text-left"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {report.generatedTitle}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                    Model: {report.model} · {report.tokensUsed.toLocaleString()} tokens
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 text-[10px] text-muted-foreground">
                  <Calendar className="h-3 w-3" aria-hidden="true" />
                  <span>{formattedDate}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
