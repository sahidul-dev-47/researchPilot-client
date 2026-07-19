// ─── Notification Type ────────────────────────────────────────────────────
export type NotificationType = "Info" | "Alert" | "System";

// ─── Notification ─────────────────────────────────────────────────────────
export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: NotificationType;
  createdAt: string;
}

// ─── Unread Count Response ────────────────────────────────────────────────
export interface UnreadCountResponse {
  count: number;
}
