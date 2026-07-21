"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/types/notification";

export type NotificationFilterValue = "all" | "unread" | "read" | NotificationType;

interface FilterTab {
  value: NotificationFilterValue;
  label: string;
  count?: number;
}

interface NotificationFilterProps {
  activeFilter: NotificationFilterValue;
  onChange: (filter: NotificationFilterValue) => void;
  counts: {
    all: number;
    unread: number;
    read: number;
    Info: number;
    Alert: number;
    System: number;
  };
}

const FILTER_TABS: FilterTab[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
  { value: "Info", label: "Info" },
  { value: "Alert", label: "Alert" },
  { value: "System", label: "System" },
];

export function NotificationFilter({ activeFilter, onChange, counts }: NotificationFilterProps) {
  return (
    <div
      className="flex flex-wrap gap-1.5"
      role="tablist"
      aria-label="Notification filters"
    >
      {FILTER_TABS.map((tab) => {
        const isActive = activeFilter === tab.value;
        const count = counts[tab.value as keyof typeof counts] ?? 0;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={isActive}
            aria-controls="notification-list"
            id={`filter-tab-${tab.value}`}
            onClick={() => onChange(tab.value)}
            className={cn(
              "relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
              isActive
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-lg bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
            {count > 0 && (
              <span
                className={cn(
                  "relative z-10 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[10px] font-bold transition-colors",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-muted-foreground/15 text-muted-foreground"
                )}
              >
                {count > 99 ? "99+" : count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
