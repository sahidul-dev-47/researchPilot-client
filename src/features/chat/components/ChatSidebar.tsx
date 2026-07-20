"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  MessageSquarePlus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConversationCard } from "./ConversationCard";
import { useChatHistory, useDeleteConversation } from "../hooks/useChat";
import { DEFAULT_PAGE } from "@/constants";
import type { Conversation, ConversationQueryParams } from "@/types/chat";

interface ChatSidebarProps {
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onRenameRequest: (conv: Conversation) => void;
  onDeleteRequest: (conv: Conversation) => void;
  className?: string;
}

/**
 * Chat sidebar: search, conversation list, pagination, new chat button.
 * Used in both desktop (persistent) and mobile (drawer) layouts.
 */
export function ChatSidebar({
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onRenameRequest,
  onDeleteRequest,
  className,
}: ChatSidebarProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(DEFAULT_PAGE);

  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  let debounceTimer: ReturnType<typeof setTimeout>;
  function handleSearch(value: string) {
    setSearch(value);
    setPage(DEFAULT_PAGE);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => setDebouncedSearch(value), 350);
  }

  const params: ConversationQueryParams = {
    page,
    limit: 20,
  };

  const { data, isLoading } = useChatHistory(params);
  const { mutate: deleteConv, isPending: isDeleting, variables: deletingId } =
    useDeleteConversation();

  const rawConversations = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  // Reactively filter and sort conversations client-side
  const filteredAndSorted = rawConversations
    .filter((c) =>
      c.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
    .sort((a, b) => {
      const timeA = new Date(a.updatedAt).getTime();
      const timeB = new Date(b.updatedAt).getTime();
      return sortBy === "newest" ? timeB - timeA : timeA - timeB;
    });

  return (
    <div className={`flex flex-col h-full bg-sidebar border-r border-sidebar-border ${className ?? ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-4 pb-2 flex-shrink-0">
        <h2 className="text-sm font-semibold text-sidebar-foreground">
          Conversations
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNewConversation}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
          aria-label="Start new conversation"
          id="new-conversation-btn"
        >
          <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      {/* Search & Sort */}
      <div className="px-3 pb-3 flex flex-col gap-2 flex-shrink-0">
        <div className="relative">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search conversations…"
            className="pl-8 h-8 text-xs bg-muted border-0 focus-visible:ring-1"
            aria-label="Search conversations"
            id="conv-search"
          />
        </div>
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
            className="text-[11px] bg-transparent border-0 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer font-medium"
            aria-label="Sort order"
          >
            <option value="newest" className="bg-background">Newest first</option>
            <option value="oldest" className="bg-background">Oldest first</option>
          </select>
        </div>
      </div>

      {/* Conversations list */}
      <div
        className="flex-1 overflow-y-auto px-2 space-y-0.5"
        role="listbox"
        aria-label="Conversation list"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Loading conversations" />
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
              <MessageSquarePlus className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <p className="text-xs text-muted-foreground">
              {debouncedSearch
                ? `No conversations matching "${debouncedSearch}"`
                : "No conversations yet. Start a new chat!"}
            </p>
            {!debouncedSearch && (
              <Button
                size="sm"
                onClick={onNewConversation}
                className="h-8 text-xs gradient-primary border-0 text-white"
                id="empty-new-conv-btn"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                New Chat
              </Button>
            )}
          </div>
        ) : (
          <AnimatePresence initial={false} mode="popLayout">
            {filteredAndSorted.map((conv) => (
              <ConversationCard
                key={conv._id}
                conversation={conv}
                isActive={activeConversationId === conv._id}
                onClick={() => onSelectConversation(conv._id)}
                onRename={onRenameRequest}
                onDelete={onDeleteRequest}
                isDeleting={isDeleting && deletingId === conv._id}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 px-3 py-2 border-t border-sidebar-border flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page <= 1}
            className="h-7 w-7 p-0"
            aria-label="Previous page"
            id="conv-prev-page"
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
          <span className="text-[10px] text-muted-foreground">
            {page}/{totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page >= totalPages}
            className="h-7 w-7 p-0"
            aria-label="Next page"
            id="conv-next-page"
          >
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </div>
      )}

      {/* New Chat footer button */}
      <div className="px-3 py-3 border-t border-sidebar-border flex-shrink-0">
        <Button
          onClick={onNewConversation}
          className="w-full h-9 gradient-primary border-0 text-white text-xs font-medium hover:opacity-90 transition-opacity"
          id="sidebar-new-chat-btn"
          aria-label="Start a new chat"
        >
          <Plus className="h-4 w-4 mr-1.5" aria-hidden="true" />
          New Chat
        </Button>
      </div>
    </div>
  );
}
