"use client";

import { cn } from "@/lib/utils";

// ─── Generic Skeleton block ───────────────────────────────────────────────
function SkeletonBlock({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn("rounded-lg bg-muted animate-pulse", className)}
      style={style}
      aria-hidden="true"
    />
  );
}

// ─── Stats grid skeleton ──────────────────────────────────────────────────
export function StatsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border bg-card p-5 flex items-start justify-between gap-4"
          aria-hidden="true"
        >
          <div className="space-y-2 flex-1">
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="h-7 w-16" />
            <SkeletonBlock className="h-2.5 w-32" />
          </div>
          <SkeletonBlock className="h-10 w-10 rounded-xl flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}

// ─── Charts grid skeleton ─────────────────────────────────────────────────
export function ChartsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border bg-card p-5"
          aria-hidden="true"
        >
          <SkeletonBlock className="h-4 w-40 mb-1.5" />
          <SkeletonBlock className="h-3 w-56 mb-5" />
          <div className="flex items-end justify-between gap-1.5 h-44">
            {[60, 40, 75, 55, 90, 65, 80, 45, 70, 85].map((h, j) => (
              <SkeletonBlock
                key={j}
                className="flex-1 rounded-t-sm"
                style={{ height: `${h}%` } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Recent items list skeleton ───────────────────────────────────────────
export function RecentItemsSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-3" aria-hidden="true">
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <SkeletonBlock className="h-4 w-32" />
        <SkeletonBlock className="h-3 w-12" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-2.5 rounded-lg"
        >
          <div className="flex-1 space-y-1.5 pr-3">
            <SkeletonBlock className="h-3 w-4/5" />
            <SkeletonBlock className="h-2.5 w-3/5" />
          </div>
          <SkeletonBlock className="h-3 w-12 flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}

// ─── Dashboard page full skeleton ─────────────────────────────────────────
export function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      {/* Stats row */}
      <StatsGridSkeleton count={6} />

      {/* Charts row */}
      <ChartsGridSkeleton />

      {/* Recent items row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RecentItemsSkeleton />
        <RecentItemsSkeleton />
        <RecentItemsSkeleton />
      </div>
    </div>
  );
}

// ─── Analytics page skeleton ──────────────────────────────────────────────
export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading analytics">
      <StatsGridSkeleton count={4} />
      <ChartsGridSkeleton />
    </div>
  );
}
