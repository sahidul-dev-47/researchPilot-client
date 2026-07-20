"use client";

import Link from "next/link";
import {
  Globe,
  Lock,
  Calendar,
  Tag,
  ArrowRight,
  User as UserIcon,
  Bookmark,
  Heart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import type { Research } from "@/types/research";
import {
  statusBadge,
  priorityBadge,
  visibilityLabel,
} from "@/features/research/utils/research.ui";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useBookmarkedResearch, useToggleBookmark } from "@/features/research/hooks/useBookmarks";
import { useFavorites } from "@/features/research/hooks/useFavorites";

interface ResearchCardProps {
  research: Research;
}

export function ResearchCard({ research }: ResearchCardProps) {
  const { isAuthenticated } = useAuth();
  const { data: bookmarks = [] } = useBookmarkedResearch();
  const toggleBookmarkMutation = useToggleBookmark();
  const { isFavorited, toggleFavorite } = useFavorites();

  const status = statusBadge(research.status);
  const priority = priorityBadge(research.priority);
  const isPrivate = research.visibility === "Private";

  const isBookmarked = bookmarks.some((item) => item._id === research._id);
  const favorited = isFavorited(research._id);

  const formattedDate = new Date(research.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.href = `/login?callbackUrl=${window.location.pathname}`;
      return;
    }
    toggleBookmarkMutation.mutate({
      researchId: research._id,
      isBookmarked,
    });
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(research._id);
  };

  // Modern cover image placeholders using harmonious gradient styling
  const gradientStyles = [
    "from-purple-500/20 to-indigo-500/20 border-purple-500/10",
    "from-emerald-500/20 to-teal-500/20 border-emerald-500/10",
    "from-amber-500/20 to-orange-500/20 border-amber-500/10",
    "from-rose-500/20 to-pink-500/20 border-rose-500/10",
  ];
  const charSum = research.title.charCodeAt(0) + research.title.charCodeAt(research.title.length - 1 || 0);
  const gradientClass = gradientStyles[charSum % gradientStyles.length];

  return (
    <Card
      size="sm"
      className="group/card flex flex-col justify-between overflow-hidden border border-border bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20"
    >
      <div>
        {/* Cover Image or Gradient fallback */}
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border/40">
          {research.coverImage ? (
            <img
              src={research.coverImage}
              alt={research.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
              loading="lazy"
            />
          ) : (
            <div className={cn("absolute inset-0 bg-gradient-to-br flex items-center justify-center p-6", gradientClass)}>
              <span className="text-center text-xs font-semibold uppercase tracking-wider text-foreground/40 line-clamp-3">
                {research.researchField}
              </span>
            </div>
          )}

          {/* Quick Actions (Bookmark & Favorite) */}
          <div className="absolute right-3 top-3 flex gap-1.5 opacity-90 transition-opacity group-hover/card:opacity-100">
            <button
              onClick={handleFavoriteClick}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 bg-background/80 backdrop-blur-md transition-all hover:scale-105 hover:bg-background",
                favorited ? "text-rose-500" : "text-muted-foreground hover:text-rose-500"
              )}
              title={favorited ? "Remove from Favorites" : "Add to Favorites"}
              aria-label={favorited ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart className={cn("h-4.5 w-4.5", favorited && "fill-current")} />
            </button>
            <button
              onClick={handleBookmarkClick}
              disabled={toggleBookmarkMutation.isPending}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 bg-background/80 backdrop-blur-md transition-all hover:scale-105 hover:bg-background",
                isBookmarked ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
              title={isBookmarked ? "Remove Bookmark" : "Bookmark Project"}
              aria-label={isBookmarked ? "Remove Bookmark" : "Bookmark Project"}
            >
              <Bookmark className={cn("h-4.5 w-4.5", isBookmarked && "fill-current")} />
            </button>
          </div>
        </div>

        <CardHeader className="space-y-2">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={status.variant} className="text-[10px] tracking-wide font-semibold uppercase shrink-0 py-0.5">
              {status.label}
            </Badge>
            <Badge variant="outline" className={cn("text-[10px] tracking-wide font-semibold uppercase py-0.5", priority.className)}>
              {priority.label}
            </Badge>
            <span
              className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground"
              aria-label={`Visibility: ${visibilityLabel(research.visibility)}`}
            >
              {isPrivate ? (
                <Lock className="h-3 w-3" aria-hidden="true" />
              ) : (
                <Globe className="h-3 w-3" aria-hidden="true" />
              )}
              {visibilityLabel(research.visibility)}
            </span>
          </div>

          {/* Title */}
          <CardTitle className="line-clamp-2 text-base font-bold text-foreground group-hover/card:text-primary transition-colors duration-200">
            {research.title}
          </CardTitle>

          {/* Category & Topic */}
          <div className="flex items-center gap-1.5 text-xs text-primary/80 font-medium">
            <Tag className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="truncate">{research.category}</span>
            <span className="text-border">·</span>
            <span className="truncate text-muted-foreground">{research.researchField}</span>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <CardDescription className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {research.shortDescription}
          </CardDescription>

          {/* Tags */}
          {research.tags && research.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-3">
              {research.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
              {research.tags.length > 2 && (
                <span className="rounded-lg bg-muted/30 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  +{research.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </div>

      <CardFooter className="flex items-center justify-between border-t border-border/40 bg-muted/10 pt-4">
        {/* Author / Date info */}
        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 font-medium">
            <UserIcon className="h-3.5 w-3.5 text-muted-foreground/75" aria-hidden="true" />
            {research.authorName}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" aria-hidden="true" />
            {formattedDate}
          </span>
        </div>

        {/* View details */}
        <Link
          href={`/research/${research._id}`}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary/5 hover:bg-primary px-3 text-sm font-semibold text-primary hover:text-white transition-all duration-200"
          aria-label={`View details of ${research.title}`}
        >
          View
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </CardFooter>
    </Card>
  );
}
