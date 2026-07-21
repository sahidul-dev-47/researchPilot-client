"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff, ArrowRight } from "lucide-react";
import { NotificationCard } from "./NotificationCard";
import { NotificationDropdownSkeleton } from "./NotificationSkeleton";
import { useNotifications, useUnreadNotificationCount } from "@/features/notifications/hooks/useNotifications";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const { data: notifications, isLoading } = useNotifications();
  const { unreadCount } = useUnreadNotificationCount();
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const latest = (notifications ?? []).slice(0, 5);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className={cn(
            "absolute right-0 top-full mt-2 z-50",
            "w-80 sm:w-96 rounded-2xl border border-border shadow-xl",
            "bg-card/95 backdrop-blur-xl overflow-hidden"
          )}
          role="dialog"
          aria-label="Notifications"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="font-semibold text-sm text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors text-xs font-medium cursor-pointer"
              aria-label="Close notifications"
            >
              Close
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[360px] overflow-y-auto overscroll-contain">
            {isLoading ? (
              <NotificationDropdownSkeleton />
            ) : latest.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <BellOff className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {latest.map((n) => (
                  <NotificationCard key={n._id} notification={n} compact />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border/50 p-2">
            <Link
              href="/notifications"
              onClick={onClose}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "w-full justify-between text-primary hover:text-primary hover:bg-primary/10 font-semibold cursor-pointer"
              )}
            >
              View all notifications
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
