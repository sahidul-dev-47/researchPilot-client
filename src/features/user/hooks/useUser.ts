"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getMe,
  updateMe,
  updateSettings,
  addFavoriteAI,
  removeFavoriteAI,
  addFavoriteChat,
  removeFavoriteChat,
} from "@/services/api/user.service";
import { QUERY_KEYS } from "@/constants";
import type { UpdateUserInput, UpdateSettingsInput, User } from "@/types/user";

// ─── Fetch full profile from /api/users/me ────────────────────────────────
export function useUserProfile() {
  return useQuery({
    queryKey: QUERY_KEYS.me,
    queryFn: getMe,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ─── Update name, image, bio via PATCH /api/users/me ─────────────────────
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateUserInput) => updateMe(body),
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.me });
      const previous = queryClient.getQueryData<User>(QUERY_KEYS.me);
      if (previous) {
        queryClient.setQueryData<User>(QUERY_KEYS.me, {
          ...previous,
          ...body,
        });
      }
      return { previous };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.me, data);
      toast.success("Profile updated successfully.");
    },
    onError: (error: Error, _, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(QUERY_KEYS.me, ctx.previous);
      }
      toast.error(error.message ?? "Failed to update profile.");
    },
  });
}

// ─── Update theme/language/notifications via PATCH /api/users/settings ───
export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateSettingsInput) => updateSettings(body),
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.me });
      const previous = queryClient.getQueryData<User>(QUERY_KEYS.me);
      if (previous) {
        queryClient.setQueryData<User>(QUERY_KEYS.me, {
          ...previous,
          settings: { ...previous.settings, ...body },
        });
      }
      return { previous };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.me, data);
      toast.success("Settings saved.");
    },
    onError: (error: Error, _, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(QUERY_KEYS.me, ctx.previous);
      }
      toast.error(error.message ?? "Failed to save settings.");
    },
  });
}

// ─── Favorite / Unfavorite AI Research ───────────────────────────────────
export function useToggleFavoriteAI() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      historyId,
      isFavorited,
    }: {
      historyId: string;
      isFavorited: boolean;
    }) => (isFavorited ? removeFavoriteAI(historyId) : addFavoriteAI(historyId)),
    onSuccess: (data, { isFavorited }) => {
      queryClient.setQueryData(QUERY_KEYS.me, data);
      toast.success(
        isFavorited ? "Removed from AI favorites." : "Added to AI favorites."
      );
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to update favorite.");
    },
  });
}

// ─── Favorite / Unfavorite Chat Conversation ─────────────────────────────
export function useToggleFavoriteChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      conversationId,
      isFavorited,
    }: {
      conversationId: string;
      isFavorited: boolean;
    }) =>
      isFavorited
        ? removeFavoriteChat(conversationId)
        : addFavoriteChat(conversationId),
    onSuccess: (data, { isFavorited }) => {
      queryClient.setQueryData(QUERY_KEYS.me, data);
      toast.success(
        isFavorited
          ? "Removed from chat favorites."
          : "Added to chat favorites."
      );
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to update chat favorite.");
    },
  });
}
