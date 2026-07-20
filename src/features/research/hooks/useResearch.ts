"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAllResearch,
  getResearchById,
  createResearch,
  updateResearch,
  deleteResearch,
  exportResearch,
} from "@/services/api/research.service";
import { QUERY_KEYS } from "@/constants";
import type {
  Research,
  ResearchQueryParams,
  CreateResearchInput,
  UpdateResearchInput,
  ExportFormat,
} from "@/types/research";

/**
 * List research projects with search / filter / sort / pagination.
 * Uses `keepPreviousData` so paginated navigation feels seamless.
 */
export function useResearchList(params?: ResearchQueryParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.research, params ?? {}],
    queryFn: () => getAllResearch(params),
    placeholderData: keepPreviousData,
  });
}

/** Fetch a single research project by id. */
export function useResearch(id: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.researchById(id ?? ""),
    queryFn: () => getResearchById(id as string),
    enabled: Boolean(id),
  });
}

/** Create a new research project. */
export function useCreateResearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateResearchInput) => createResearch(body),
    onSuccess: () => {
      toast.success("Research project created successfully");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.research });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Update an existing research project. */
export function useUpdateResearch(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateResearchInput) => updateResearch(id, body),
    onSuccess: (data: Research) => {
      toast.success("Research project updated successfully");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.research });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.researchById(id),
      });
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Delete a research project. */
export function useDeleteResearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteResearch(id),
    onSuccess: () => {
      toast.success("Research project deleted successfully");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.research });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

/** Export a research project in the requested format. */
export function useExportResearch() {
  return useMutation({
    mutationFn: ({ id, format }: { id: string; format: ExportFormat }) =>
      exportResearch(id, format),
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
