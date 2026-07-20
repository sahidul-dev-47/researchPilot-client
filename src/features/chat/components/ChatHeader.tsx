"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  MessageSquare,
  PanelLeft,
  PanelLeftClose,
  RefreshCw,
  Trash2,
  MoreVertical,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Conversation } from "@/types/chat";

interface ChatHeaderProps {
  conversation: Conversation | null;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onRenameRequest: () => void;
  onDeleteRequest: () => void;
  onNewConversation: () => void;
  className?: string;
}

/**
 * Top bar of the chat panel: conversation title, sidebar toggle,
 * and action menu (rename/delete/new).
 */
export function ChatHeader({
  conversation,
  isSidebarOpen,
  onToggleSidebar,
  onRenameRequest,
  onDeleteRequest,
  onNewConversation,
  className,
}: ChatHeaderProps) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 border-b bg-background/80 backdrop-blur-sm flex-shrink-0 ${className ?? ""}`}
    >
      {/* Sidebar toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleSidebar}
        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        id="chat-sidebar-toggle"
      >
        {isSidebarOpen ? (
          <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
        ) : (
          <PanelLeft className="h-4 w-4" aria-hidden="true" />
        )}
      </Button>

      {/* AI icon + title */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg gradient-primary shadow-sm"
          aria-hidden="true"
        >
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {conversation ? conversation.title : "ResearchPilot AI Chat"}
          </p>
          {conversation && (
            <p className="text-[10px] text-muted-foreground">
              Started{" "}
              {new Date(conversation.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onNewConversation}
          className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground hidden sm:flex gap-1.5"
          aria-label="Start new conversation"
          id="header-new-conv-btn"
        >
          <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
          New
        </Button>

        {conversation && (
          <DropdownMenu>
            <DropdownMenuTrigger
              className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Conversation options"
              id="chat-header-menu-btn"
            >
              <MoreVertical className="h-4 w-4" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onClick={onRenameRequest}
                id="header-rename-btn"
              >
                <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDeleteRequest}
                className="text-destructive focus:text-destructive"
                id="header-delete-btn"
              >
                <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
