"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { NotificationBadge } from "./NotificationBadge";
import { NotificationDropdown } from "./NotificationDropdown";
import { useUnreadNotificationCount } from "@/features/notifications/hooks/useNotifications";
import { cn } from "@/lib/utils";

/**
 * Self-contained bell button with unread badge and dropdown.
 * Should only be rendered for authenticated users.
 */
export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useUnreadNotificationCount();

  return (
    <div className="relative" id="notification-bell-container">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={
          unreadCount > 0
            ? `Notifications — ${unreadCount} unread`
            : "Notifications"
        }
        id="notification-bell-btn"
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 cursor-pointer",
          "text-muted-foreground hover:text-foreground hover:bg-muted",
          isOpen && "bg-muted text-foreground"
        )}
      >
        <Bell
          className={cn(
            "h-5 w-5 transition-transform duration-200",
            unreadCount > 0 && "animate-[wiggle_1s_ease-in-out_infinite]"
          )}
          aria-hidden="true"
        />
        <NotificationBadge count={unreadCount} />
      </button>

      <NotificationDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
