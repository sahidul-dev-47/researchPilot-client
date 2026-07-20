"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  sendMessage,
  getChatHistory,
  getChatMessages,
  renameConversation,
  deleteConversation,
  clearAllConversations,
} from "@/services/api/chat.service";
import { QUERY_KEYS } from "@/constants";
import type {
  Conversation,
  ChatMessage,
  SendMessageInput,
  SendMessageResponse,
  RenameConversationInput,
  ConversationQueryParams,
} from "@/types/chat";

// ─── Conversation History (paginated) ─────────────────────────────────────
export function useChatHistory(params?: ConversationQueryParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.chatHistory, params ?? {}],
    queryFn: () => getChatHistory(params),
    placeholderData: keepPreviousData,
  });
}

// ─── Conversation Messages ─────────────────────────────────────────────────
export function useChatMessages(conversationId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.chatMessages(conversationId ?? ""),
    queryFn: () => getChatMessages(conversationId as string),
    enabled: Boolean(conversationId),
    staleTime: 1000 * 30, // 30s — messages don't change unless we mutate
  });
}

// ─── Send Message ─────────────────────────────────────────────────────────
export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SendMessageInput) => sendMessage(body),
    onSuccess: (data: SendMessageResponse) => {
      // Invalidate conversation history list (may have new title / lastMessage)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chatHistory });
      // Invalidate messages for this conversation
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.chatMessages(data.conversation._id),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to send message. Please try again.");
    },
  });
}

// ─── Rename Conversation ──────────────────────────────────────────────────
export function useRenameConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      conversationId,
      body,
    }: {
      conversationId: string;
      body: RenameConversationInput;
    }) => renameConversation(conversationId, body),
    onMutate: async ({ conversationId, body }) => {
      // Optimistic update: rename in cached list
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.chatHistory });
      const snapshot = queryClient.getQueriesData<{
        data: Conversation[];
        meta: unknown;
      }>({ queryKey: QUERY_KEYS.chatHistory });

      queryClient.setQueriesData<{ data: Conversation[]; meta: unknown }>(
        { queryKey: QUERY_KEYS.chatHistory },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((c) =>
              c._id === conversationId ? { ...c, title: body.title } : c
            ),
          };
        }
      );
      return { snapshot };
    },
    onSuccess: (data: Conversation) => {
      toast.success(`Renamed to "${data.title}"`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chatHistory });
    },
    onError: (error: Error, _vars, ctx) => {
      toast.error(error.message ?? "Failed to rename conversation.");
      if (ctx?.snapshot) {
        for (const [key, value] of ctx.snapshot) {
          queryClient.setQueryData(key, value);
        }
      }
    },
  });
}

// ─── Delete Conversation ──────────────────────────────────────────────────
export function useDeleteConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: string) => deleteConversation(conversationId),
    onMutate: async (conversationId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.chatHistory });
      const snapshot = queryClient.getQueriesData<{
        data: Conversation[];
        meta: unknown;
      }>({ queryKey: QUERY_KEYS.chatHistory });

      // Remove optimistically
      queryClient.setQueriesData<{ data: Conversation[]; meta: unknown }>(
        { queryKey: QUERY_KEYS.chatHistory },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((c) => c._id !== conversationId),
          };
        }
      );
      return { snapshot };
    },
    onSuccess: () => {
      toast.success("Conversation deleted.");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chatHistory });
    },
    onError: (error: Error, _id, ctx) => {
      toast.error(error.message ?? "Failed to delete conversation.");
      if (ctx?.snapshot) {
        for (const [key, value] of ctx.snapshot) {
          queryClient.setQueryData(key, value);
        }
      }
    },
  });
}

// ─── Clear All Conversations ───────────────────────────────────────────────
export function useClearAllConversations() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => clearAllConversations(),
    onSuccess: (data) => {
      toast.success(`Cleared ${data.deletedCount} conversation${data.deletedCount !== 1 ? "s" : ""}.`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chatHistory });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to clear conversations.");
    },
  });
}
