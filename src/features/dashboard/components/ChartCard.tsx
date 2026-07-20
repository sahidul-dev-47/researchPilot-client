"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
  action?: ReactNode;
}

// ─── Skeleton Loading State ───────────────────────────────────────────────
function ChartSkeleton() {
  return (
    <div className="flex items-end justify-between gap-2 h-48 pt-4">
      {[40, 70, 55, 85, 60, 90, 75, 50, 80, 65, 45, 70].map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-muted animate-pulse rounded-t-sm"
          style={{ height: `${h}%` }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function ChartCard({
  title,
  description,
  children,
  isLoading = false,
  className,
  action,
}: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "rounded-xl border bg-card p-5 shadow-sm hover:border-primary/20 transition-all duration-200",
        className
      )}
      role="region"
      aria-label={`${title} chart`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="space-y-0.5">
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>

      {/* Content or loading state */}
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <div className="w-full">{children}</div>
      )}
    </motion.div>
  );
}

// ─── Loading spinner overlay for re-fetching ─────────────────────────────
export function ChartRefetchIndicator() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-card/60 rounded-xl z-10">
      <Loader2 className="h-6 w-6 animate-spin text-primary" aria-label="Refreshing chart data" />
    </div>
  );
}
