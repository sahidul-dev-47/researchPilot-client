"use client";

import { cn } from "@/lib/utils";

interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export function NotificationBadge({ count, className }: NotificationBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className={cn(
        "absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center",
        "rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground",
        "shadow-md shadow-primary/30 ring-2 ring-background",
        "animate-in zoom-in-75 duration-200",
        className
      )}
      aria-label={`${count} unread notification${count !== 1 ? "s" : ""}`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
