import { cn } from "@/lib/utils";

interface CardSkeletonProps {
  className?: string;
  lines?: number;
  showAvatar?: boolean;
}

export function CardSkeleton({
  className,
  lines = 3,
  showAvatar = false,
}: CardSkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 space-y-4 overflow-hidden",
        className
      )}
      role="status"
      aria-label="Loading content"
      aria-busy="true"
    >
      {showAvatar && (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted animate-shimmer" />
          <div className="space-y-2 flex-1">
            <div className="h-3 w-1/3 rounded-full bg-muted animate-shimmer" />
            <div className="h-2.5 w-1/4 rounded-full bg-muted animate-shimmer" />
          </div>
        </div>
      )}
      <div className="space-y-2.5">
        <div className="h-4 w-3/4 rounded-full bg-muted animate-shimmer" />
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 rounded-full bg-muted animate-shimmer"
            style={{ width: `${75 - i * 10}%` }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="h-6 w-16 rounded-full bg-muted animate-shimmer" />
        <div className="h-6 w-20 rounded-full bg-muted animate-shimmer" />
      </div>
    </div>
  );
}

export function CardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
