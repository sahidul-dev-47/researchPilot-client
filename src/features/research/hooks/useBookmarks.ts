"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getBookmarks, addBookmark, removeBookmark } from "@/services/api/user.service";
import { QUERY_KEYS } from "@/constants";
import type { Research } from "@/types/research";

/**
 * Hook to retrieve user bookmarked research projects.
 */
export function useBookmarkedResearch() {
  return useQuery({
    queryKey: QUERY_KEYS.bookmarks,
    queryFn: getBookmarks,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Mutation hook to toggle a research project bookmark.
 * Implements optimistic updates on the "bookmarks" query key for snappy interaction.
 */
export function useToggleBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      researchId,
      isBookmarked,
    }: {
      researchId: string;
      isBookmarked: boolean;
    }) => {
      if (isBookmarked) {
        return removeBookmark(researchId);
      } else {
        return addBookmark(researchId);
      }
    },
    onMutate: async ({ researchId, isBookmarked }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.bookmarks });

      // Snapshot previous bookmarks state
      const previousBookmarks = queryClient.getQueryData<Research[]>(
        QUERY_KEYS.bookmarks
      );

      // Optimistically update the list if bookmarks are already loaded
      if (previousBookmarks) {
        if (isBookmarked) {
          queryClient.setQueryData<Research[]>(
            QUERY_KEYS.bookmarks,
            previousBookmarks.filter((item) => item._id !== researchId)
          );
        } else {
          // If we are adding, we don't have the full research object here,
          // but we can trigger invalidation or just do list mutation later.
        }
      }

      return { previousBookmarks };
    },
    onError: (error: Error, _, context) => {
      // Rollback to previous state
      if (context?.previousBookmarks) {
        queryClient.setQueryData(QUERY_KEYS.bookmarks, context.previousBookmarks);
      }
      toast.error(error.message || "Failed to update bookmark status.");
    },
    onSuccess: (_, { isBookmarked }) => {
      toast.success(
        isBookmarked
          ? "Removed project from bookmarks."
          : "Saved project to bookmarks."
      );
      // Invalidate queries to sync with backend database
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookmarks });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me });
    },
  });
}
