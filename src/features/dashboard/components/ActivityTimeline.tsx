"use client";

import { motion } from "framer-motion";
import { type LucideIcon, FileText, Sparkles, MessageSquare, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Research } from "@/types/research";
import type { Conversation } from "@/types/chat";
import type { AIResearch } from "@/types/ai";

// ─── Activity Item type ───────────────────────────────────────────────────
type ActivityType = "research" | "ai" | "chat";

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  subtitle?: string;
  date: string;
  href: string;
}

// ─── Type icon mapping ────────────────────────────────────────────────────
const TYPE_CONFIG: Record<
  ActivityType,
  { icon: LucideIcon; label: string; color: string; bgColor: string }
> = {
  research: {
    icon: FileText,
    label: "Research",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10 border-blue-500/20",
  },
  ai: {
    icon: Sparkles,
    label: "AI Report",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10 border-purple-500/20",
  },
  chat: {
    icon: MessageSquare,
    label: "Conversation",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10 border-emerald-500/20",
  },
};

// ─── Single Timeline Item ─────────────────────────────────────────────────
function TimelineItem({
  item,
  index,
  isLast,
}: {
  item: ActivityItem;
  index: number;
  isLast: boolean;
}) {
  const config = TYPE_CONFIG[item.type];
  const Icon = config.icon;

  const formattedDate = new Date(item.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="relative flex gap-4"
    >
      {/* Vertical line connector */}
      {!isLast && (
        <div
          className="absolute left-5 top-10 bottom-0 w-px bg-border"
          aria-hidden="true"
        />
      )}

      {/* Icon badge */}
      <div
        className={cn(
          "flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border",
          config.bgColor
        )}
        aria-hidden="true"
      >
        <Icon className={cn("h-4.5 w-4.5", config.color)} />
      </div>

      {/* Content */}
      <a
        href={item.href}
        className="group flex-1 pb-4 min-w-0 hover:opacity-90 transition-opacity"
        aria-label={`${config.label}: ${item.title}`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {item.title}
            </p>
            {item.subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {item.subtitle}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 flex flex-col items-end gap-1">
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border",
                config.bgColor,
                config.color
              )}
            >
              {config.label}
            </span>
            <time
              className="text-[10px] text-muted-foreground whitespace-nowrap"
              dateTime={item.date}
            >
              {formattedDate}
            </time>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────
function EmptyTimeline() {
  return (
    <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted border border-border">
        <FileText className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <p className="text-sm font-semibold text-foreground">No activity yet</p>
      <p className="text-xs text-muted-foreground max-w-[220px]">
        Your recent research, AI reports, and conversations will appear here.
      </p>
    </div>
  );
}

// ─── Public Props ─────────────────────────────────────────────────────────
interface ActivityTimelineProps {
  researchItems?: Research[];
  aiItems?: AIResearch[];
  chatItems?: Conversation[];
  isLoading?: boolean;
  className?: string;
}

export function ActivityTimeline({
  researchItems = [],
  aiItems = [],
  chatItems = [],
  isLoading = false,
  className,
}: ActivityTimelineProps) {
  // Build unified timeline and sort by date descending
  const items: ActivityItem[] = [
    ...researchItems.map((r) => ({
      id: r._id,
      type: "research" as const,
      title: r.title,
      subtitle: `${r.category} · ${r.status}`,
      date: r.updatedAt,
      href: `/research/${r._id}`,
    })),
    ...aiItems.map((a) => ({
      id: a._id,
      type: "ai" as const,
      title: a.generatedTitle,
      subtitle: `Model: ${a.model} · ${a.tokensUsed.toLocaleString()} tokens`,
      date: a.createdAt,
      href: `/ai/result/${a._id}`,
    })),
    ...chatItems.map((c) => ({
      id: c._id,
      type: "chat" as const,
      title: c.title,
      subtitle: c.lastMessage ?? undefined,
      date: c.updatedAt,
      href: `/chat/${c._id}`,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div
      className={cn("space-y-0", className)}
      role="feed"
      aria-label="Activity timeline"
      aria-busy={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2
            className="h-6 w-6 animate-spin text-muted-foreground"
            aria-label="Loading activity"
          />
        </div>
      ) : items.length === 0 ? (
        <EmptyTimeline />
      ) : (
        items.map((item, i) => (
          <TimelineItem
            key={`${item.type}-${item.id}`}
            item={item}
            index={i}
            isLast={i === items.length - 1}
          />
        ))
      )}
    </div>
  );
}
