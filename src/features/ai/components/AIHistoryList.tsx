"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, History, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AIHistoryCard } from "./AIHistoryCard";
import { CardSkeleton } from "@/components/skeletons/CardSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { useAIHistory, useDeleteAIHistory, useRegenerateAI } from "../hooks/useAI";
import { DEFAULT_PAGE, DEFAULT_LIMIT } from "@/constants";
import type { AIHistoryQueryParams } from "@/types/ai";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
] as const;

/**
 * Full AI history list with search, sort, pagination, skeleton loading,
 * and empty state.
 */
export function AIHistoryList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(DEFAULT_PAGE);

  // Debounce search
  let debounceTimer: ReturnType<typeof setTimeout>;
  function handleSearch(value: string) {
    setSearch(value);
    setPage(DEFAULT_PAGE);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => setDebouncedSearch(value), 350);
  }

  const params: AIHistoryQueryParams = {
    page,
    limit: DEFAULT_LIMIT,
    sort,
    searchTerm: debouncedSearch || undefined,
  };

  const { data, isLoading, isError } = useAIHistory(params);
  const { mutate: deleteEntry, isPending: isDeleting, variables: deletingId } = useDeleteAIHistory();
  const { mutate: regenerate, isPending: isRegenerating, variables: regeneratingId } = useRegenerateAI();

  const items = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  function handleRegenerate(historyId: string) {
    regenerate(historyId, {
      onSuccess: (newResult) => {
        router.push(`/ai/result/${newResult._id}`);
      },
    });
  }

  return (
    <div className="space-y-5">
      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search history by title or keyword…"
            className="pl-10"
            aria-label="Search AI history"
            id="ai-history-search"
          />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground" aria-hidden="true">
          <SlidersHorizontal className="h-4 w-4" />
        </div>
        <Select
          value={sort}
          onValueChange={(v) => { setSort(v as "newest" | "oldest"); setPage(DEFAULT_PAGE); }}
        >
          <SelectTrigger className="w-full sm:w-44 h-9 text-sm" id="ai-history-sort" aria-label="Sort history">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} lines={3} />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          title="Failed to load history"
          description="An error occurred while fetching your AI history. Please try refreshing."
          icon={History}
        />
      ) : items.length === 0 ? (
        <EmptyState
          title={debouncedSearch ? "No results found" : "No AI history yet"}
          description={
            debouncedSearch
              ? `No history matches "${debouncedSearch}". Try a different search.`
              : "Generate your first AI research report to see it here."
          }
          icon={History}
          action={
            !debouncedSearch
              ? { label: "Generate Research", href: "/ai" }
              : undefined
          }
        />
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {items.map((item) => (
              <AIHistoryCard
                key={item._id}
                item={item}
                onRegenerate={handleRegenerate}
                onDelete={(id) => deleteEntry(id)}
                isRegenerating={isRegenerating && regeneratingId === item._id}
                isDeleting={isDeleting && deletingId === item._id}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page <= 1}
            aria-label="Previous page"
            id="ai-history-prev"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page >= totalPages}
            aria-label="Next page"
            id="ai-history-next"
          >
            Next
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      )}

      {/* Total count */}
      {meta && (
        <p className="text-xs text-center text-muted-foreground">
          {meta.total} total {meta.total === 1 ? "entry" : "entries"}
        </p>
      )}
    </div>
  );
}
