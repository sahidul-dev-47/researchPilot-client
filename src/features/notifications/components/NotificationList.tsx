"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BellOff } from "lucide-react";
import { NotificationCard } from "./NotificationCard";
import { NotificationListSkeleton } from "./NotificationSkeleton";
import { DeleteDialog } from "./DeleteDialog";
import { useDeleteNotification } from "@/features/notifications/hooks/useNotifications";
import type { Notification } from "@/types/notification";

interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  emptyMessage?: string;
}

export function NotificationList({
  notifications,
  isLoading,
  emptyMessage = "No notifications found.",
}: NotificationListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const deleteN = useDeleteNotification();

  function handleDeleteConfirm() {
    if (!deletingId) return;
    deleteN.mutate(deletingId, { onSettled: () => setDeletingId(null) });
  }

  if (isLoading) {
    return <NotificationListSkeleton count={6} />;
  }

  return (
    <>
      <div
        id="notification-list"
        role="tabpanel"
        aria-label="Notifications"
        className="space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {notifications.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-20 px-4 text-center gap-4"
            >
              {/* Illustration */}
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent border border-border shadow-inner">
                  <BellOff className="h-9 w-9 text-muted-foreground/50" aria-hidden="true" />
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-muted border border-border text-sm" aria-hidden="true">
                  ✨
                </span>
              </div>
              <div className="space-y-1.5 max-w-xs">
                <h3 className="text-base font-bold text-foreground">You're all caught up!</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{emptyMessage}</p>
              </div>
            </motion.div>
          ) : (
            notifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                onDelete={() => setDeletingId(notification._id)}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      <DeleteDialog
        open={!!deletingId}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
        isPending={deleteN.isPending}
      />
    </>
  );
}
