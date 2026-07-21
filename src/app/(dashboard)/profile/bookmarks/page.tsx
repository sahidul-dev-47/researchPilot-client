"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, BookOpen, AlertCircle, ChevronLeft, Bookmark } from "lucide-react";
import { useBookmarks } from "@/features/user/hooks/useUser";
import { BookmarkCard } from "@/features/user/components/BookmarkCard";
import { BookmarksSkeleton } from "@/features/user/components/ProfileSkeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function BookmarksPage() {
  const { data: bookmarks, isLoading, error, refetch } = useBookmarks();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="h-9 w-48 bg-muted animate-pulse rounded-md" />
        <div className="flex gap-4 items-center">
          <div className="h-10 flex-grow bg-muted animate-pulse rounded-md" />
          <div className="h-10 w-40 bg-muted animate-pulse rounded-md" />
        </div>
        <BookmarksSkeleton count={6} />
      </div>
    );
  }

  if (error || !bookmarks) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
          <AlertCircle className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">Failed to load bookmarks</h1>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          There was an issue fetching your bookmarked research papers.
        </p>
        <Button onClick={() => refetch()} className="cursor-pointer">
          Try Again
        </Button>
      </div>
    );
  }

  // Filter & Sort Bookmarks
  const filteredBookmarks = bookmarks
    .filter((b) => {
      const matchSearch =
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.shortDescription && b.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (b.category && b.category.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back to Profile and Title */}
      <div className="space-y-2">
        <Link
          href="/profile"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "pl-1 flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground")}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back to Profile
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Bookmark className="h-6 w-6 text-primary fill-primary/10" aria-hidden="true" />
          Bookmarked Research
        </h1>
        <p className="text-sm text-muted-foreground">
          Quickly access your saved projects and research summaries.
        </p>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/40 backdrop-blur-md p-4 rounded-xl border border-border/50">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Search by title, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background/50 border-border"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Sort By</span>
          </div>
          <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
            <SelectTrigger className="w-[140px] bg-background/50 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest Added</SelectItem>
              <SelectItem value="oldest">Oldest Added</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bookmarks Grid / Empty State */}
      <AnimatePresence mode="popLayout">
        {filteredBookmarks.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {filteredBookmarks.map((research) => (
              <BookmarkCard key={research._id} research={research} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-border/80 rounded-2xl bg-card/25"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 animate-bounce">
              <BookOpen className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-1.5">No Bookmarks Found</h2>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              {searchTerm
                ? "No matching bookmarks found. Try adjusting your search query."
                : "You haven't bookmarked any research projects yet. Saved projects will appear here."}
            </p>
            {!searchTerm && (
              <Link href="/research" className={cn(buttonVariants({ variant: "default" }), "cursor-pointer")}>
                Explore Research
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
