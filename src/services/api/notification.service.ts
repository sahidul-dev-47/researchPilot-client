import apiClient from "@/services/axios";
import type { ApiResponse } from "@/types/api";
import type { Notification, UnreadCountResponse } from "@/types/notification";

// ─── GET /api/notifications ───────────────────────────────────────────────
export async function getNotifications(): Promise<Notification[]> {
  const response = await apiClient.get<ApiResponse<Notification[]>>(
    "/notifications"
  );
  return response.data.data;
}

// ─── GET /api/notifications/unread-count ─────────────────────────────────
export async function getUnreadCount(): Promise<UnreadCountResponse> {
  const response = await apiClient.get<ApiResponse<UnreadCountResponse>>(
    "/notifications/unread-count"
  );
  return response.data.data;
}

// ─── PATCH /api/notifications/:id/read ───────────────────────────────────
export async function markNotificationAsRead(
  id: string
): Promise<Notification> {
  const response = await apiClient.patch<ApiResponse<Notification>>(
    `/notifications/${id}/read`
  );
  return response.data.data;
}

// ─── DELETE /api/notifications/:id ───────────────────────────────────────
export async function deleteNotification(id: string): Promise<Notification> {
  const response = await apiClient.delete<ApiResponse<Notification>>(
    `/notifications/${id}`
  );
  return response.data.data;
}
