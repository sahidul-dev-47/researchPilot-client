"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Calendar,
  MessageCircle,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types/chat";

interface ConversationCardProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  onRename: (conv: Conversation) => void;
  onDelete: (conv: Conversation) => void;
  isDeleting?: boolean;
}

/**
 * Single conversation entry in the sidebar.
 * Shows title, date, last message preview, and action menu.
 */
export function ConversationCard({
  conversation,
  isActive,
  onClick,
  onRename,
  onDelete,
  isDeleting = false,
}: ConversationCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const createdDate = new Date(conversation.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const updatedDate = new Date(conversation.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const mockMessageCount = (conversation._id.charCodeAt(conversation._id.length - 1) % 8) + 2;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: isDeleting ? 0.4 : 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative flex items-start gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150",
        isActive
          ? "bg-primary/10 border border-primary/25"
          : "hover:bg-muted/60 border border-transparent",
        isDeleting && "pointer-events-none"
      )}
      onClick={onClick}
      role="button"
      aria-selected={isActive}
      aria-label={`Open conversation: ${conversation.title}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-lg mt-0.5",
          isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
        )}
        aria-hidden="true"
      >
        <MessageSquare className="h-3.5 w-3.5" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-xs font-medium line-clamp-1 leading-snug",
            isActive ? "text-primary" : "text-foreground"
          )}
        >
          {conversation.title}
        </p>
        {conversation.lastMessage && (
          <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5 leading-snug">
            {conversation.lastMessage}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px] text-muted-foreground/60 mt-1">
          <span>Created: {createdDate}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/20 inline-block" />
          <span>Updated: {updatedDate}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/20 inline-block" />
          <span className="font-semibold text-primary/70">{mockMessageCount} msgs</span>
        </div>
      </div>

      {/* Menu */}
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger
          className={cn(
            "h-6 w-6 p-0 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
            "inline-flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer",
            (isActive || menuOpen) && "opacity-100"
          )}
          onClick={(e) => e.stopPropagation()}
          aria-label="Conversation actions"
          id={`conv-menu-${conversation._id}`}
        >
          <MoreVertical className="h-3 w-3" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
              onRename(conversation);
            }}
            id={`conv-rename-${conversation._id}`}
          >
            <Pencil className="h-4 w-4 mr-2" aria-hidden="true" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
              onDelete(conversation);
            }}
            className="text-destructive focus:text-destructive"
            id={`conv-delete-${conversation._id}`}
          >
            <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
