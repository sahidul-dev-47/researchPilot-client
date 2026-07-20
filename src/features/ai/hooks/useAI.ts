"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  generateAIResearch,
  regenerateAIResearch,
  getAIHistory,
  getAIHistoryById,
  deleteAIHistory,
} from "@/services/api/ai.service";
import { QUERY_KEYS } from "@/constants";
import type {
  AIResearch,
  GenerateResearchInput,
  AIHistoryQueryParams,
} from "@/types/ai";

// ─── Generate AI Research ─────────────────────────────────────────────────
export function useGenerateAI() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: GenerateResearchInput) => generateAIResearch(body),
    onSuccess: (data: AIResearch) => {
      toast.success(`"${data.generatedTitle}" generated successfully!`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.aiHistory });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "AI generation failed. Please try again.");
    },
  });
}

// ─── Regenerate AI Research from history ─────────────────────────────────
export function useRegenerateAI() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (historyId: string) =>
      regenerateAIResearch({ historyId }),
    onSuccess: (data: AIResearch) => {
      toast.success(`"${data.generatedTitle}" regenerated successfully!`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.aiHistory });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Regeneration failed. Please try again.");
    },
  });
}

// ─── Fetch paginated AI history ───────────────────────────────────────────
export function useAIHistory(params?: AIHistoryQueryParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.aiHistory, params ?? {}],
    queryFn: () => getAIHistory(params),
    placeholderData: keepPreviousData,
  });
}

// ─── Fetch single AI history entry ───────────────────────────────────────
export function useAIHistoryEntry(id: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.aiHistoryById(id ?? ""),
    queryFn: () => getAIHistoryById(id as string),
    enabled: Boolean(id),
  });
}

// ─── Delete AI history entry ──────────────────────────────────────────────
export function useDeleteAIHistory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAIHistory(id),
    onMutate: async (id: string) => {
      // Optimistic: cancel in-flight queries and snapshot current data
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.aiHistory });
      const snapshot = queryClient.getQueriesData<{
        data: AIResearch[];
      }>({ queryKey: QUERY_KEYS.aiHistory });
      // Remove deleted item optimistically from all cached pages
      queryClient.setQueriesData<{ data: AIResearch[]; meta: unknown }>(
        { queryKey: QUERY_KEYS.aiHistory },
        (old) => {
          if (!old) return old;
          return { ...old, data: old.data.filter((h) => h._id !== id) };
        }
      );
      return { snapshot };
    },
    onSuccess: () => {
      toast.success("History entry deleted.");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.aiHistory });
    },
    onError: (error: Error, _id, ctx) => {
      toast.error(error.message ?? "Failed to delete entry.");
      // Rollback optimistic update
      if (ctx?.snapshot) {
        for (const [key, value] of ctx.snapshot) {
          queryClient.setQueryData(key, value);
        }
      }
    },
  });
}
