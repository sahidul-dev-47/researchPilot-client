import apiClient from "@/services/axios";
import type { ApiResponse, PaginatedApiResponse } from "@/types/api";
import type {
  Conversation,
  ChatMessage,
  SendMessageInput,
  SendMessageResponse,
  RenameConversationInput,
  ConversationQueryParams,
} from "@/types/chat";

// ─── POST /api/chat ───────────────────────────────────────────────────────
export async function sendMessage(
  body: SendMessageInput
): Promise<SendMessageResponse> {
  if (body.file) {
    const formData = new FormData();
    formData.append("message", body.message);
    if (body.conversationId) formData.append("conversationId", body.conversationId);
    if (body.researchId) formData.append("researchId", body.researchId);
    if (body.regenerate) formData.append("regenerate", "true");
    formData.append("file", body.file);

    const response = await apiClient.post<ApiResponse<SendMessageResponse>>(
      "/chat",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data.data;
  }

  const response = await apiClient.post<ApiResponse<SendMessageResponse>>(
    "/chat",
    body
  );
  return response.data.data;
}

// ─── GET /api/chat/history ────────────────────────────────────────────────
export async function getChatHistory(
  params?: ConversationQueryParams
): Promise<PaginatedApiResponse<Conversation>> {
  const response = await apiClient.get<PaginatedApiResponse<Conversation>>(
    "/chat/history",
    { params }
  );
  return response.data;
}

// ─── GET /api/chat/history/:conversationId ────────────────────────────────
export async function getChatMessages(
  conversationId: string
): Promise<ChatMessage[]> {
  const response = await apiClient.get<ApiResponse<ChatMessage[]>>(
    `/chat/history/${conversationId}`
  );
  return response.data.data;
}

// ─── PATCH /api/chat/:conversationId ─────────────────────────────────────
export async function renameConversation(
  conversationId: string,
  body: RenameConversationInput
): Promise<Conversation> {
  const response = await apiClient.patch<ApiResponse<Conversation>>(
    `/chat/${conversationId}`,
    body
  );
  return response.data.data;
}

// ─── DELETE /api/chat/:conversationId ─────────────────────────────────────
export async function deleteConversation(
  conversationId: string
): Promise<Conversation> {
  const response = await apiClient.delete<ApiResponse<Conversation>>(
    `/chat/${conversationId}`
  );
  return response.data.data;
}

// ─── DELETE /api/chat ─────────────────────────────────────────────────────
export async function clearAllConversations(): Promise<{
  deletedCount: number;
}> {
  const response = await apiClient.delete<
    ApiResponse<{ deletedCount: number }>
  >("/chat");
  return response.data.data;
}
