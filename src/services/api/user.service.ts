import apiClient from "@/services/axios";
import type { ApiResponse } from "@/types/api";
import type { User, UpdateUserInput, UpdateSettingsInput } from "@/types/user";
import type { Research } from "@/types/research";

// ─── GET /api/users/me ─────────────────────────────────────────────────────
export async function getMe(): Promise<User> {
  const response = await apiClient.get<ApiResponse<User>>("/users/me");
  return response.data.data;
}

// ─── PATCH /api/users/me ───────────────────────────────────────────────────
export async function updateMe(body: UpdateUserInput): Promise<User> {
  const response = await apiClient.patch<ApiResponse<User>>("/users/me", body);
  return response.data.data;
}

// ─── PATCH /api/users/settings ────────────────────────────────────────────
export async function updateSettings(body: UpdateSettingsInput): Promise<User> {
  const response = await apiClient.patch<ApiResponse<User>>(
    "/users/settings",
    body
  );
  return response.data.data;
}

// ─── GET /api/users/bookmarks ─────────────────────────────────────────────
export async function getBookmarks(): Promise<Research[]> {
  const response = await apiClient.get<ApiResponse<Research[]>>(
    "/users/bookmarks"
  );
  return response.data.data;
}

// ─── POST /api/users/bookmarks/:researchId ────────────────────────────────
export async function addBookmark(researchId: string): Promise<User> {
  const response = await apiClient.post<ApiResponse<User>>(
    `/users/bookmarks/${researchId}`
  );
  return response.data.data;
}

// ─── DELETE /api/users/bookmarks/:researchId ──────────────────────────────
export async function removeBookmark(researchId: string): Promise<User> {
  const response = await apiClient.delete<ApiResponse<User>>(
    `/users/bookmarks/${researchId}`
  );
  return response.data.data;
}

// ─── POST /api/users/favorites/ai/:historyId ─────────────────────────────
export async function addFavoriteAI(historyId: string): Promise<User> {
  const response = await apiClient.post<ApiResponse<User>>(
    `/users/favorites/ai/${historyId}`
  );
  return response.data.data;
}

// ─── DELETE /api/users/favorites/ai/:historyId ───────────────────────────
export async function removeFavoriteAI(historyId: string): Promise<User> {
  const response = await apiClient.delete<ApiResponse<User>>(
    `/users/favorites/ai/${historyId}`
  );
  return response.data.data;
}

// ─── POST /api/users/favorites/chats/:conversationId ─────────────────────
export async function addFavoriteChat(conversationId: string): Promise<User> {
  const response = await apiClient.post<ApiResponse<User>>(
    `/users/favorites/chats/${conversationId}`
  );
  return response.data.data;
}

// ─── DELETE /api/users/favorites/chats/:conversationId ───────────────────
export async function removeFavoriteChat(
  conversationId: string
): Promise<User> {
  const response = await apiClient.delete<ApiResponse<User>>(
    `/users/favorites/chats/${conversationId}`
  );
  return response.data.data;
}

// ─── GET /api/users (admin only) ──────────────────────────────────────────
export async function getUsers(): Promise<User[]> {
  const response = await apiClient.get<ApiResponse<User[]>>("/users");
  return response.data.data;
}
