"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, FileQuestion } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ResearchCard } from "@/features/research/components/ResearchCard";
import { ResearchHeader } from "@/features/research/components/ResearchHeader";
import { useResearchList } from "@/features/research/hooks/useResearch";
import { EmptyState } from "@/components/common/EmptyState";
import { CardSkeletonGrid } from "@/components/skeletons/CardSkeleton";
import {
  RESEARCH_STATUS_OPTIONS,
  RESEARCH_PRIORITY_OPTIONS,
  RESEARCH_VISIBILITY_OPTIONS,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  ROUTES,
} from "@/constants";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { ResearchQueryParams } from "@/types/research";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title", label: "Title" },
  { value: "priority", label: "Priority" },
] as const;

export function ResearchMyClient() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("");
  const [sort, setSort] = useState<string>("newest");
  const [page, setPage] = useState(DEFAULT_PAGE);

  // Redirect to login if unauthenticated after loading finishes
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`${ROUTES.login}?callbackUrl=/research/my`);
    }
  }, [authLoading, isAuthenticated, router]);

  // Debounce search input so we don't spam queries
  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(DEFAULT_PAGE);
    window.clearTimeout((handleSearchChange as unknown as { t?: number }).t);
    (handleSearchChange as unknown as { t?: number }).t = window.setTimeout(
      () => setDebouncedSearch(value),
      350
    );
  }

  const params: ResearchQueryParams & { authorId?: string } = {
    page,
    limit: DEFAULT_LIMIT,
    searchTerm: debouncedSearch || undefined,
    status: (status || undefined) as ResearchQueryParams["status"],
    priority: (priority || undefined) as ResearchQueryParams["priority"],
    visibility: (visibility || undefined) as ResearchQueryParams["visibility"],
    sort: sort as ResearchQueryParams["sort"],
    // Restrict query results to only current user's documents
    authorId: user?._id || undefined,
  };

  const { data, isLoading: listLoading, isError, refetch } = useResearchList(
    user?._id ? params : undefined
  );

  const items = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  if (authLoading || (!isAuthenticated && !user)) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="h-10 w-48 bg-muted animate-shimmer rounded-lg" />
        <CardSkeletonGrid count={DEFAULT_LIMIT} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <ResearchHeader
        title="My Research"
        description="Manage and review the research projects authored by you."
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
            placeholder="Search my projects..."
            className="pl-10"
            aria-label="Search my research"
            id="my-research-search"
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

      {/* Active filters display */}
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

      {/* Grid Content */}
      <div className="mt-8">
        {listLoading ? (
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
                ? "Try adjusting your search filters."
                : "You haven't created any research projects yet."
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
            id="my-research-prev-page"
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
            id="my-research-next-page"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
