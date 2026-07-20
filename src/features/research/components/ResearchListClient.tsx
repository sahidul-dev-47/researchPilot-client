"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, SlidersHorizontal, FileQuestion } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResearchCard } from "@/features/research/components/ResearchCard";
import { ResearchHeader } from "@/features/research/components/ResearchHeader";
import { useResearchList } from "@/features/research/hooks/useResearch";
import { EmptyState } from "@/components/common/EmptyState";
import { CardSkeletonGrid } from "@/components/skeletons/CardSkeleton";
import { Badge } from "@/components/ui/badge";
import {
  RESEARCH_STATUS_OPTIONS,
  RESEARCH_PRIORITY_OPTIONS,
  RESEARCH_VISIBILITY_OPTIONS,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
} from "@/constants";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { ResearchQueryParams } from "@/types/research";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title", label: "Title" },
  { value: "priority", label: "Priority" },
] as const;

export function ResearchListClient() {
  const router = useRouter();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("");
  const [sort, setSort] = useState<string>("newest");
  const [page, setPage] = useState(DEFAULT_PAGE);

  // Debounce search input so we don't fire a request per keystroke.
  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(DEFAULT_PAGE);
    window.clearTimeout((handleSearchChange as unknown as { t?: number }).t);
    (handleSearchChange as unknown as { t?: number }).t = window.setTimeout(
      () => setDebouncedSearch(value),
      350
    );
  }

  const params: ResearchQueryParams = {
    page,
    limit: DEFAULT_LIMIT,
    searchTerm: debouncedSearch || undefined,
    status: (status || undefined) as ResearchQueryParams["status"],
    priority: (priority || undefined) as ResearchQueryParams["priority"],
    visibility: (visibility || undefined) as ResearchQueryParams["visibility"],
    sort: sort as ResearchQueryParams["sort"],
  };

  const { data, isLoading, isError, refetch } = useResearchList(params);
  const items = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <ResearchHeader
        title="Research Projects"
        description="Browse all visible research projects and access publication-grade summaries."
        count={meta?.total}
      />

      {/* Search + Filters */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto_auto]">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by title, field, tag..."
            className="pl-10"
            aria-label="Search research"
            id="research-search"
          />
        </div>

        <div className="flex items-center gap-2 text-muted-foreground" aria-hidden="true">
          <SlidersHorizontal className="h-4 w-4" />
        </div>

        <Select value={status} onValueChange={(v) => { setStatus(v ?? ""); setPage(DEFAULT_PAGE); }}>
          <SelectTrigger className="w-full sm:w-[150px]" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            {RESEARCH_STATUS_OPTIONS.map((o) => (
              <SelectItem key={o} value={o}>{o}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priority} onValueChange={(v) => { setPriority(v ?? ""); setPage(DEFAULT_PAGE); }}>
          <SelectTrigger className="w-full sm:w-[150px]" aria-label="Filter by priority">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All priorities</SelectItem>
            {RESEARCH_PRIORITY_OPTIONS.map((o) => (
              <SelectItem key={o} value={o}>{o}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={visibility} onValueChange={(v) => { setVisibility(v ?? ""); setPage(DEFAULT_PAGE); }}>
          <SelectTrigger className="w-full sm:w-[150px]" aria-label="Filter by visibility">
            <SelectValue placeholder="Visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All visibility</SelectItem>
            {RESEARCH_VISIBILITY_OPTIONS.map((o) => (
              <SelectItem key={o} value={o}>{o}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => { setSort(v ?? ""); setPage(DEFAULT_PAGE); }}>
          <SelectTrigger className="w-full sm:w-[150px]" aria-label="Sort by">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active filter chips */}
      {(status || priority || visibility || debouncedSearch) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {debouncedSearch && (
            <Badge variant="secondary">Search: {debouncedSearch}</Badge>
          )}
          {status && <Badge variant="outline">Status: {status}</Badge>}
          {priority && <Badge variant="outline">Priority: {priority}</Badge>}
          {visibility && <Badge variant="outline">Visibility: {visibility}</Badge>}
        </div>
      )}

      {/* Content */}
      <div className="mt-8">
        {isLoading ? (
          <CardSkeletonGrid count={DEFAULT_LIMIT} />
        ) : isError ? (
          <EmptyState
            icon={FileQuestion}
            title="Failed to load research"
            description="Something went wrong while fetching your projects."
            action={{ label: "Try again", onClick: () => refetch() }}
          />
        ) : items.length === 0 ? (
          <EmptyState
            icon={FileQuestion}
            title="No research projects found"
            description={
              debouncedSearch || status || priority || visibility
                ? "Try adjusting your search or filters."
                : "Create your first research project to get started."
            }
            action={
              !debouncedSearch && !status && !priority && !visibility
                ? { label: "New Research", href: "/research/new" }
                : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((research) => (
              <ResearchCard key={research._id} research={research} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            id="research-prev-page"
          >
            Previous
          </Button>
          <span className="px-3 text-sm text-muted-foreground" aria-live="polite">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            id="research-next-page"
          >
            Next
          </Button>
        </div>
      )}

      {/* Ownership hint for empty states (not shown) */}
      {user && items.length === 0 && null}
    </div>
  );
}
