"use client";

import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  Info,
  AlertTriangle,
  Settings,
  CheckCircle2,
  Trash2,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMarkNotificationAsRead } from "@/features/notifications/hooks/useNotifications";
import type { Notification, NotificationType } from "@/types/notification";

interface NotificationCardProps {
  notification: Notification;
  /** Compact mode: used in the navbar dropdown */
  compact?: boolean;
  /** Called when user clicks Delete — parent handles confirmation dialog */
  onDelete?: (id: string) => void;
}

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: React.ElementType; iconClass: string; badgeClass: string; bgClass: string }
> = {
  Info: {
    icon: Info,
    iconClass: "text-blue-500",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    bgClass: "bg-blue-500/8",
  },
  Alert: {
    icon: AlertTriangle,
    iconClass: "text-amber-500",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    bgClass: "bg-amber-500/8",
  },
  System: {
    icon: Settings,
    iconClass: "text-purple-500",
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    bgClass: "bg-purple-500/8",
  },
};

export function NotificationCard({ notification, compact = false, onDelete }: NotificationCardProps) {
  const markRead = useMarkNotificationAsRead();

  const config = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.Info;
  const Icon = config.icon;

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.22 }}
      className={cn(
        "group relative flex items-start gap-4 rounded-xl border transition-all duration-200",
        compact ? "p-3 gap-3" : "p-4",
        notification.isRead
          ? "border-border bg-card/40 opacity-75 hover:opacity-100"
          : "border-primary/20 bg-card shadow-sm",
        "hover:shadow-md hover:border-primary/30"
      )}
      role="article"
      aria-label={`${notification.type} notification: ${notification.title}`}
    >
      {/* Unread dot */}
      {!notification.isRead && (
        <span
          className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary animate-pulse"
          aria-label="Unread"
        />
      )}

      {/* Type Icon */}
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full border",
          compact ? "h-8 w-8" : "h-10 w-10",
          config.bgClass,
          "border-current/10"
        )}
        aria-hidden="true"
      >
        <Icon className={cn(compact ? "h-4 w-4" : "h-5 w-5", config.iconClass)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("font-semibold text-foreground truncate", compact ? "text-xs" : "text-sm")}>
            {notification.title}
          </span>
          <Badge
            variant="outline"
            className={cn("text-[10px] px-1.5 py-0 font-semibold shrink-0", config.badgeClass)}
          >
            {notification.type}
          </Badge>
        </div>

        <p className={cn("text-muted-foreground leading-relaxed line-clamp-2", compact ? "text-[11px]" : "text-xs")}>
          {notification.message}
        </p>

        <p className="text-[10px] text-muted-foreground/60 font-medium">{timeAgo}</p>
      </div>

      {/* Full-mode actions (hover-reveal) */}
      {!compact && (
        <div className="flex flex-col gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {!notification.isRead && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={() => markRead.mutate(notification._id)}
              disabled={markRead.isPending}
              aria-label="Mark as read"
              title="Mark as read"
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete?.(notification._id)}
            aria-label="Delete notification"
            title="Delete notification"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Compact mode: mark-read dot button */}
      {compact && !notification.isRead && (
        <button
          onClick={() => markRead.mutate(notification._id)}
          disabled={markRead.isPending}
          className="shrink-0 h-5 w-5 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          aria-label="Mark as read"
        >
          <Circle className="h-3.5 w-3.5 fill-primary text-primary" />
        </button>
      )}
    </motion.div>
  );
}
