"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Heart, Sparkles, MessageSquare, AlertCircle, ChevronLeft } from "lucide-react";
import { useUserProfile } from "@/features/user/hooks/useUser";
import { useAIHistory } from "@/features/ai/hooks/useAI";
import { useChatHistory } from "@/features/chat/hooks/useChat";
import { FavoriteCard } from "@/features/user/components/FavoriteCard";
import { BookmarksSkeleton } from "@/features/user/components/ProfileSkeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function FavoritesPage() {
  const { data: user, isLoading: isLoadingUser, error: userError } = useUserProfile();
  // Fetch up to 1000 items to filter locally
  const { data: aiHistory, isLoading: isLoadingAI, error: aiError } = useAIHistory({ limit: 1000 });
  const { data: chatHistory, isLoading: isLoadingChat, error: chatError } = useChatHistory({ limit: 1000 });

  const [activeTab, setActiveTab] = useState<"all" | "ai" | "chat">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  const isLoading = isLoadingUser || isLoadingAI || isLoadingChat;
  const isError = userError || aiError || chatError;

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

  if (isError || !user) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
          <AlertCircle className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">Failed to load favorites</h1>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          Could not retrieve your favorited items. Please try refreshing.
        </p>
      </div>
    );
  }

  // Filter items matching user's favorite list
  const favoritedAIs =
    aiHistory?.data?.filter((item) => user.favoriteAI?.includes(item._id)) || [];
  const favoritedChats =
    chatHistory?.data?.filter((item) => user.favoriteChats?.includes(item._id)) || [];

  // Map to unified shape
  const allFavorites: Array<{ type: "ai" | "chat"; item: any }> = [
    ...favoritedAIs.map((item) => ({ type: "ai" as const, item })),
    ...favoritedChats.map((item) => ({ type: "chat" as const, item })),
  ];

  // Filter by Tab and Search
  const filteredFavorites = allFavorites
    .filter((f) => {
      // Tab filter
      if (activeTab === "ai" && f.type !== "ai") return false;
      if (activeTab === "chat" && f.type !== "chat") return false;

      // Search filter
      const title = f.type === "ai" ? f.item.generatedTitle : f.item.title;
      const desc = f.type === "ai" ? f.item.summary : f.item.lastMessage;
      return (
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (desc && desc.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    })
    .sort((a, b) => {
      // Sort filter
      const aTitle = a.type === "ai" ? a.item.generatedTitle : a.item.title;
      const bTitle = b.type === "ai" ? b.item.generatedTitle : b.item.title;
      const aTime = new Date(a.item.createdAt).getTime();
      const bTime = new Date(b.item.createdAt).getTime();

      if (sortBy === "newest") return bTime - aTime;
      if (sortBy === "oldest") return aTime - bTime;
      if (sortBy === "title") return aTitle.localeCompare(bTitle);
      return 0;
    });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <Link
          href="/profile"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "pl-1 flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground")}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back to Profile
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Heart className="h-6 w-6 text-rose-500 fill-rose-500/10" aria-hidden="true" />
          My Favorites
        </h1>
        <p className="text-sm text-muted-foreground">
          View your favorited AI research summaries and interactive chat threads.
        </p>
      </div>

      {/* Filter Tabs and Sort Controls */}
      <div className="flex flex-col gap-4 bg-card/40 backdrop-blur-md p-4 rounded-xl border border-border/50">
        {/* Tabs Row */}
        <div className="flex border-b border-border/30 pb-2">
          {[
            { id: "all", label: "All Favorites", count: allFavorites.length },
            { id: "ai", label: "AI Reports", count: favoritedAIs.length },
            { id: "chat", label: "Chats", count: favoritedChats.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "relative pb-2 px-4 text-sm font-semibold transition-colors cursor-pointer",
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              <span className="ml-1.5 text-xs bg-muted border border-border/30 px-1.5 py-0.5 rounded-full text-muted-foreground font-bold">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Search favorites by title or text..."
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
      </div>

      {/* Favorites Display */}
      <AnimatePresence mode="popLayout">
        {filteredFavorites.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {filteredFavorites.map(({ type, item }) => (
              <FavoriteCard key={item._id} type={type} item={item} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-border/80 rounded-2xl bg-card/25"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 animate-bounce">
              <Heart className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-1.5">No Favorites Found</h2>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              {searchTerm
                ? "No matching favorites found. Try adjusting your search query."
                : "You haven't favorited any AI reports or chat threads yet."}
            </p>
            {!searchTerm && (
              <div className="flex gap-3">
                <Link href="/ai" className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer")}>
                  <Sparkles className="h-4 w-4 mr-1.5 text-purple-500" aria-hidden="true" />
                  AI Assistant
                </Link>
                <Link href="/chat" className={cn(buttonVariants({ variant: "default" }), "cursor-pointer")}>
                  <MessageSquare className="h-4 w-4 mr-1.5" aria-hidden="true" />
                  Start Chatting
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
