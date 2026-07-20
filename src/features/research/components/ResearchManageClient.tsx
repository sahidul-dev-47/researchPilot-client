"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Eye, Pencil, Trash2, SlidersHorizontal, FileQuestion, Lock, Globe } from "lucide-react";
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
import { ResearchHeader } from "@/features/research/components/ResearchHeader";
import { useResearchList, useDeleteResearch } from "@/features/research/hooks/useResearch";
import { EmptyState } from "@/components/common/EmptyState";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { DeleteDialog } from "@/features/research/components/DeleteDialog";
import {
  statusBadge,
  visibilityLabel,
} from "@/features/research/utils/research.ui";
import {
  RESEARCH_STATUS_OPTIONS,
  RESEARCH_VISIBILITY_OPTIONS,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  ROUTES,
} from "@/constants";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Research, ResearchQueryParams } from "@/types/research";
import { cn } from "@/lib/utils";

export function ResearchManageClient() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const deleteMutation = useDeleteResearch();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("");
  const [page, setPage] = useState(DEFAULT_PAGE);

  // Delete modal state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Research | null>(null);

  // Redirect to login if unauthenticated after loading finishes
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`${ROUTES.login}?callbackUrl=/research/manage`);
    }
  }, [authLoading, isAuthenticated, router]);

  // Debounce search input
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
    visibility: (visibility || undefined) as ResearchQueryParams["visibility"],
    sort: "newest", // Most recent first for management
    authorId: user?._id || undefined,
  };

  const { data, isLoading: listLoading, isError, refetch } = useResearchList(
    user?._id ? params : undefined
  );

  const items = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const handleDeleteOpen = (project: Research) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    try {
      await deleteMutation.mutateAsync(projectToDelete._id);
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch {
      // Errors are handled inside hook
    }
  };

  if (authLoading || (!isAuthenticated && !user)) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="h-10 w-48 bg-muted animate-shimmer rounded-lg" />
        <TableSkeleton rows={6} columns={6} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <ResearchHeader
        title="Manage Research"
        description="Edit, publish, or delete your research projects."
        count={meta?.total}
      />

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search projects..."
            className="pl-10"
            aria-label="Search my projects"
            id="manage-research-search"
          />
        </div>

        <SlidersHorizontal className="hidden sm:block h-4 w-4 text-muted-foreground" aria-hidden="true" />

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
      </div>

      {/* Table view */}
      <div className="mt-8">
        {listLoading ? (
          <TableSkeleton rows={DEFAULT_LIMIT} columns={6} />
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
            title="No projects found"
            description={
              debouncedSearch || status || visibility
                ? "Try adjusting your search filters."
                : "You haven't created any research projects yet."
            }
            action={
              !debouncedSearch && !status && !visibility
                ? { label: "New Research", href: "/research/new" }
                : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-lg shadow-primary/5">
            <table className="w-full text-left border-collapse text-sm" role="table">
              <thead>
                <tr className="border-b border-border/60 bg-muted/20 text-muted-foreground font-semibold">
                  <th className="p-4" role="columnheader">Title</th>
                  <th className="p-4 hidden md:table-cell" role="columnheader">Category</th>
                  <th className="p-4 hidden sm:table-cell" role="columnheader">Visibility</th>
                  <th className="p-4 hidden lg:table-cell" role="columnheader">Created Date</th>
                  <th className="p-4" role="columnheader">Status</th>
                  <th className="p-4 text-right" role="columnheader">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {items.map((project) => {
                  const s = statusBadge(project.status);
                  const isPrivate = project.visibility === "Private";
                  const createdDate = new Date(project.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <tr key={project._id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-semibold text-foreground max-w-[200px] sm:max-w-[300px] truncate" role="cell">
                        {project.title}
                      </td>
                      <td className="p-4 hidden md:table-cell text-muted-foreground" role="cell">
                        {project.category}
                      </td>
                      <td className="p-4 hidden sm:table-cell" role="cell">
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
                          {isPrivate ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                          {visibilityLabel(project.visibility)}
                        </span>
                      </td>
                      <td className="p-4 hidden lg:table-cell text-muted-foreground" role="cell">
                        {createdDate}
                      </td>
                      <td className="p-4" role="cell">
                        <Badge variant={s.variant} className="text-[10px] uppercase font-semibold py-0.5 tracking-wider">
                          {s.label}
                        </Badge>
                      </td>
                      <td className="p-4 text-right" role="cell">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/research/${project._id}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/research/${project._id}/edit`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                            title="Edit project"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all border border-transparent hover:border-destructive/10"
                            onClick={() => handleDeleteOpen(project)}
                            title="Delete project"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2" aria-label="Pagination">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            id="manage-research-prev-page"
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
            id="manage-research-next-page"
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        title={projectToDelete?.title || ""}
        isDeleting={deleteMutation.isPending}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
