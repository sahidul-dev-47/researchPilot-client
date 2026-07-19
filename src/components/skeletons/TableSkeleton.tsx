import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: TableSkeletonProps) {
  return (
    <div
      className={cn("w-full rounded-xl border bg-card overflow-hidden", className)}
      role="status"
      aria-label="Loading table"
      aria-busy="true"
    >
      {/* Header */}
      <div className="border-b bg-muted/30 px-5 py-3.5">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-3 rounded-full bg-muted animate-shimmer" style={{ width: i === 0 ? "60%" : "80%" }} />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="px-5 py-4">
            <div className="grid gap-4 items-center" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIdx) => (
                <div key={colIdx} className="flex items-center gap-2">
                  {colIdx === 0 && (
                    <div className="h-7 w-7 rounded-lg bg-muted animate-shimmer shrink-0" />
                  )}
                  <div
                    className="h-3 rounded-full bg-muted animate-shimmer"
                    style={{ width: `${50 + (colIdx * 15) % 40}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
