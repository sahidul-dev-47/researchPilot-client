"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Globe,
  Lock,
  Pencil,
  Trash2,
  FileText,
  Download,
  User as UserIcon,
  Clock,
  Tag,
  Loader2,
  FileQuestion,
  Bookmark,
  Heart,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useResearch, useDeleteResearch, useExportResearch, useResearchList } from "@/features/research/hooks/useResearch";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useBookmarkedResearch, useToggleBookmark } from "@/features/research/hooks/useBookmarks";
import { useFavorites } from "@/features/research/hooks/useFavorites";
import { generateAISummary } from "@/features/research/utils/aiSummary";
import { ResearchCard } from "@/features/research/components/ResearchCard";
import {
  statusBadge,
  priorityBadge,
  visibilityLabel,
} from "@/features/research/utils/research.ui";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import type { ExportFormat } from "@/types/research";

export function ResearchDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { data: research, isLoading, isError } = useResearch(id);
  const deleteMutation = useDeleteResearch();
  const exportMutation = useExportResearch();
  const { data: bookmarks = [] } = useBookmarkedResearch();
  const toggleBookmarkMutation = useToggleBookmark();
  const { isFavorited, toggleFavorite } = useFavorites();

  const isOwner = Boolean(user && research && research.authorId === user._id);
  const isBookmarked = bookmarks.some((item) => item._id === id);
  const favorited = isFavorited(id);

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this research project? This action cannot be undone.")) {
      return;
    }
    await deleteMutation.mutateAsync(id);
    router.push(ROUTES.research);
  }

  async function handleExport(format: ExportFormat) {
    const result = await exportMutation.mutateAsync({ id, format });
    if (format === "json" && result) {
      const blob = new Blob([JSON.stringify(result, null, 2)], {
        type: "application/json",
      });
      triggerDownload(blob, `research-${id}.json`);
      return;
    }
    if ((format === "pdf" || format === "markdown") && result instanceof Blob) {
      triggerDownload(result, `research-${id}.${format}`);
    }
  }

  function triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-[250px] w-full rounded-2xl" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !research) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={FileQuestion}
          title="Research not found"
          description="This project may have been removed or is private."
          action={{ label: "Back to Research", href: ROUTES.research }}
        />
      </div>
    );
  }

  const status = statusBadge(research.status);
  const priority = priorityBadge(research.priority);
  const isPrivate = research.visibility === "Private";

  const aiSummary = generateAISummary(research.fullDescription, research.title);

  // Modern cover image or premium gradient backgrounds
  const gradientStyles = [
    "from-purple-600/30 via-indigo-600/10 to-transparent",
    "from-emerald-600/30 via-teal-600/10 to-transparent",
    "from-amber-600/30 via-orange-600/10 to-transparent",
    "from-rose-600/30 via-pink-600/10 to-transparent",
  ];
  const charSum = research.title.charCodeAt(0) + research.title.charCodeAt(research.title.length - 1 || 0);
  const gradientClass = gradientStyles[charSum % gradientStyles.length];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <Link
        href={ROUTES.research}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Research
      </Link>

      {/* Hero Banner / Cover Image */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
        {research.coverImage ? (
          <div className="h-[280px] w-full relative">
            <img
              src={research.coverImage}
              alt={research.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </div>
        ) : (
          <div className={cn("h-[200px] w-full bg-gradient-to-tr", gradientClass)} />
        )}

        {/* Floating Quick Action Overlays */}
        <div className="absolute right-6 top-6 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-xl bg-background/80 backdrop-blur-md transition-all hover:bg-background border-border/60",
              favorited ? "text-rose-500 hover:text-rose-600" : "text-muted-foreground hover:text-rose-500"
            )}
            onClick={() => toggleFavorite(research._id)}
            title={favorited ? "Remove from Favorites" : "Add to Favorites"}
            aria-label={favorited ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart className={cn("h-5 w-5", favorited && "fill-current")} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-xl bg-background/80 backdrop-blur-md transition-all hover:bg-background border-border/60",
              isBookmarked ? "text-primary hover:text-primary-foreground" : "text-muted-foreground hover:text-primary"
            )}
            onClick={() =>
              toggleBookmarkMutation.mutate({
                researchId: research._id,
                isBookmarked,
              })
            }
            disabled={toggleBookmarkMutation.isPending}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark Project"}
            aria-label={isBookmarked ? "Remove Bookmark" : "Bookmark Project"}
          >
            <Bookmark className={cn("h-5 w-5", isBookmarked && "fill-current")} />
          </Button>
        </div>
      </div>

      {/* Main Info Columns */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Details, Description, AI Summary */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={status.variant} className="px-3 py-1 font-semibold uppercase tracking-wider text-xs">
                {status.label}
              </Badge>
              <Badge variant="outline" className={cn("px-3 py-1 font-semibold uppercase tracking-wider text-xs", priority.className)}>
                {priority.label} priority
              </Badge>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                {isPrivate ? (
                  <Lock className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Globe className="h-4 w-4" aria-hidden="true" />
                )}
                {visibilityLabel(research.visibility)}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {research.title}
            </h1>

            <p className="text-lg leading-relaxed text-muted-foreground font-medium">
              {research.shortDescription}
            </p>
          </div>

          <Separator className="border-border/60" />

          {/* Description Section */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Full Research Content
            </h2>
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {research.fullDescription}
            </div>
          </section>

          {/* AI Summary Section */}
          <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/[0.02] p-6 space-y-6">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="h-24 w-24 text-primary" />
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">Gemini AI Project Summary</h3>
                <p className="text-xs text-muted-foreground">Automated summary &amp; highlight extraction</p>
              </div>
            </div>

            <div className="space-y-4 relative z-10 text-sm">
              <div className="space-y-1.5">
                <h4 className="font-bold text-foreground/90">Executive Summary</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {aiSummary.executiveSummary}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 pt-2">
                <div className="space-y-1.5">
                  <h5 className="font-bold text-foreground">Key Objectives</h5>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground text-xs leading-relaxed">
                    {aiSummary.keyObjectives.map((o, idx) => (
                      <li key={idx}>{o}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-1.5">
                  <h5 className="font-bold text-foreground">Methodology</h5>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground text-xs leading-relaxed">
                    {aiSummary.methodology.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-1.5">
                  <h5 className="font-bold text-foreground">Potential Impact</h5>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground text-xs leading-relaxed">
                    {aiSummary.potentialImpact.map((i, idx) => (
                      <li key={idx}>{i}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Metadata, Export, Admin Actions */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <Card size="sm" className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base font-bold">Research Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                  <UserIcon className="h-4 w-4" /> Author
                </span>
                <span className="font-semibold text-foreground">{research.authorName}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> Duration
                </span>
                <span className="font-semibold text-foreground">{research.estimatedDuration}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                  <Layers className="h-4 w-4" /> Category
                </span>
                <span className="font-semibold text-foreground">{research.category}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                  <Tag className="h-4 w-4" /> Topic Field
                </span>
                <span className="font-semibold text-foreground truncate max-w-[150px]" title={research.researchField}>
                  {research.researchField}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> Published
                </span>
                <span className="font-semibold text-foreground">
                  {new Date(research.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Export Card */}
          <Card size="sm" className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <Download className="h-4 w-4 text-primary" aria-hidden="true" />
                Export Project
              </CardTitle>
              <CardDescription className="text-xs">
                Download this research report in standard formats.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("json")}
                disabled={exportMutation.isPending}
                className="text-xs py-4"
              >
                <FileText className="h-3.5 w-3.5 mr-1" />
                JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("markdown")}
                disabled={exportMutation.isPending}
                className="text-xs py-4"
              >
                <FileText className="h-3.5 w-3.5 mr-1" />
                MD
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("pdf")}
                disabled={exportMutation.isPending}
                className="text-xs py-4"
              >
                <FileText className="h-3.5 w-3.5 mr-1" />
                PDF
              </Button>
            </CardContent>
          </Card>

          {/* Admin Owner Actions */}
          {isOwner && (
            <Card size="sm" className="border-destructive/20 bg-destructive/[0.01]">
              <CardHeader>
                <CardTitle className="text-base font-bold text-destructive/90">Project Actions</CardTitle>
                <CardDescription className="text-xs">Manage ownership settings &amp; permissions.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Link
                  href={`/research/${research._id}/edit`}
                  id="research-edit-btn"
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-semibold hover:bg-muted transition-all"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit Details
                </Link>
                <Button
                  variant="outline"
                  className="text-destructive hover:bg-destructive hover:text-white border-destructive/30 w-full"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  id="research-delete-btn"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-1" />
                  )}
                  Delete Project
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Separator className="border-border/60" />

      {/* Related Research Section */}
      <RelatedResearchSection category={research.category} currentId={research._id} />
    </div>
  );
}

/**
 * Related Research Section Component.
 * Fetches other research documents belonging to the same category.
 */
function RelatedResearchSection({ category, currentId }: { category: string; currentId: string }) {
  const { data, isLoading } = useResearchList({ category, limit: 10 });
  const items = (data?.data ?? []).filter((item) => item._id !== currentId).slice(0, 4);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Related Research</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground tracking-tight">Related Research</h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <ResearchCard key={item._id} research={item} />
        ))}
      </div>
    </div>
  );
}
