"use client";

import { cn } from "@/lib/utils";

function Bone({ className }: { className?: string }) {
  return (
    <div
      className={cn("bg-muted animate-pulse rounded-lg", className)}
      aria-hidden="true"
    />
  );
}

export function NotificationCardSkeleton() {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card/50" aria-hidden="true">
      <Bone className="h-10 w-10 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <Bone className="h-4 w-40" />
          <Bone className="h-3 w-20" />
        </div>
        <Bone className="h-3 w-full" />
        <Bone className="h-3 w-3/4" />
      </div>
    </div>
  );
}

export function NotificationListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading notifications">
      {Array.from({ length: count }).map((_, i) => (
        <NotificationCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function NotificationDropdownSkeleton() {
  return (
    <div className="space-y-2 p-2" aria-busy="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-lg" aria-hidden="true">
          <Bone className="h-8 w-8 shrink-0 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Bone className="h-3 w-32" />
            <Bone className="h-2.5 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
