"use client";

import { cn } from "@/lib/utils";

// ─── Profile page skeleton ────────────────────────────────────────────────
function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn("bg-muted animate-pulse rounded-lg", className)}
      aria-hidden="true"
    />
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden" aria-hidden="true">
      {/* Banner */}
      <SkeletonBlock className="h-28 rounded-none" />
      <div className="px-6 pb-6">
        <div className="flex items-end justify-between -mt-12 mb-4 flex-wrap gap-3">
          <SkeletonBlock className="h-24 w-24 rounded-full ring-4 ring-background" />
          <SkeletonBlock className="h-8 w-28" />
        </div>
        <div className="space-y-2 mb-4">
          <SkeletonBlock className="h-6 w-48" />
          <SkeletonBlock className="h-4 w-64" />
          <SkeletonBlock className="h-4 w-80" />
        </div>
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading profile">
      <ProfileHeaderSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonBlock className="h-48 rounded-xl" />
        <SkeletonBlock className="h-48 rounded-xl" />
      </div>
    </div>
  );
}

export function BookmarksSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      aria-busy="true"
      aria-label="Loading bookmarks"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-5 space-y-3" aria-hidden="true">
          <div className="flex items-start justify-between gap-3">
            <SkeletonBlock className="h-4 w-3/4" />
            <SkeletonBlock className="h-6 w-6 rounded-full" />
          </div>
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-4/5" />
          <div className="flex gap-2 pt-2">
            <SkeletonBlock className="h-6 w-16 rounded-full" />
            <SkeletonBlock className="h-6 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
