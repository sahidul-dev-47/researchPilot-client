"use client";

import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/services/api/notification.service";
import { QUERY_KEYS } from "@/constants";

/**
 * Hook to fetch all notifications for the current user.
 */
export function useNotifications() {
  return useQuery({
    queryKey: QUERY_KEYS.notifications,
    queryFn: getNotifications,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to get unread notification count derived from full list.
 */
export function useUnreadNotificationCount() {
  const { data, ...rest } = useNotifications();
  const unreadCount = (data ?? []).filter((n) => !n.isRead).length;
  return { unreadCount, ...rest };
}
