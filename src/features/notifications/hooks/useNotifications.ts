"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  deleteNotification,
} from "@/services/api/notification.service";
import { QUERY_KEYS } from "@/constants";
import type { Notification } from "@/types/notification";

// ─── Fetch all notifications ─────────────────────────────────────────────────
export function useNotifications() {
  return useQuery({
    queryKey: QUERY_KEYS.notifications,
    queryFn: getNotifications,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// ─── Fetch unread count from backend (for badge accuracy) ───────────────────
export function useNotificationUnreadCount() {
  return useQuery({
    queryKey: QUERY_KEYS.notificationUnreadCount,
    queryFn: getUnreadCount,
    staleTime: 1000 * 60 * 1, // 1 minute
    refetchInterval: 1000 * 60 * 2, // poll every 2 minutes
  });
}

// ─── Derived unread count from cached notifications list ────────────────────
export function useUnreadNotificationCount() {
  const { data, ...rest } = useNotifications();
  const unreadCount = (data ?? []).filter((n) => !n.isRead).length;
  return { unreadCount, ...rest };
}

// ─── Mark single notification as read ───────────────────────────────────────
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.notifications });
      const previous = queryClient.getQueryData<Notification[]>(QUERY_KEYS.notifications);
      // Optimistic update: mark as read immediately
      queryClient.setQueryData<Notification[]>(QUERY_KEYS.notifications, (old) =>
        (old ?? []).map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificationUnreadCount });
    },
    onError: (error: Error, _id, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(QUERY_KEYS.notifications, ctx.previous);
      }
      toast.error(error.message ?? "Failed to mark notification as read.");
    },
  });
}

// ─── Delete single notification ──────────────────────────────────────────────
export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.notifications });
      const previous = queryClient.getQueryData<Notification[]>(QUERY_KEYS.notifications);
      // Optimistic update: remove immediately
      queryClient.setQueryData<Notification[]>(QUERY_KEYS.notifications, (old) =>
        (old ?? []).filter((n) => n._id !== id)
      );
      return { previous };
    },
    onSuccess: () => {
      toast.success("Notification deleted.");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificationUnreadCount });
    },
    onError: (error: Error, _id, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(QUERY_KEYS.notifications, ctx.previous);
      }
      toast.error(error.message ?? "Failed to delete notification.");
    },
  });
}
