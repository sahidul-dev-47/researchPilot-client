"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  Tag,
  FolderOpen,
  MoreVertical,
  ExternalLink,
  RefreshCw,
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
import type { AIResearch } from "@/types/ai";
import { cn } from "@/lib/utils";

interface AIHistoryCardProps {
  item: AIResearch;
  onRegenerate: (id: string) => void;
  onDelete: (id: string) => void;
  isRegenerating?: boolean;
  isDeleting?: boolean;
  className?: string;
}

/**
 * History card for a single AI research entry.
 * Shows title, date, category info, and action menu.
 */
export function AIHistoryCard({
  item,
  onRegenerate,
  onDelete,
  isRegenerating = false,
  isDeleting = false,
  className,
}: AIHistoryCardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const formattedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const wordCount = item.generatedContent.split(/\s+/).length;

  function handleOpen() {
    router.push(`/ai/result/${item._id}`);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative rounded-xl border bg-card p-4 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all duration-200",
        isDeleting && "opacity-50 pointer-events-none",
        className
      )}
    >
      {/* Title */}
      <button
        onClick={handleOpen}
        className="text-left w-full mb-3 focus-visible:outline-none"
        aria-label={`Open research: ${item.generatedTitle}`}
      >
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          {item.generatedTitle}
        </h3>
      </button>

      {/* Summary preview */}
      {item.summary && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {item.summary}
        </p>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mb-3">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" aria-hidden="true" />
          {formattedDate}
        </span>
        <span className="flex items-center gap-1">
          <FolderOpen className="h-3 w-3" aria-hidden="true" />
          {wordCount.toLocaleString()} words
        </span>
        <span className="flex items-center gap-1">
          <Tag className="h-3 w-3" aria-hidden="true" />
          {item.model}
        </span>
      </div>

      {/* Keywords */}
      {item.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {item.keywords.slice(0, 3).map((kw) => (
            <span
              key={kw}
              className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
            >
              {kw}
            </span>
          ))}
          {item.keywords.length > 3 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              +{item.keywords.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleOpen}
          className="h-7 text-xs px-2 gap-1.5 text-muted-foreground hover:text-foreground"
          aria-label="Open full result"
        >
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
          Open
        </Button>

        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger
            className="h-7 w-7 p-0 inline-flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="More actions"
            id={`history-card-menu-${item._id}`}
          >
            <MoreVertical className="h-3.5 w-3.5" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onClick={() => { setMenuOpen(false); handleOpen(); }}
              id={`history-open-${item._id}`}
            >
              <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
              Open Result
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => { setMenuOpen(false); onRegenerate(item._id); }}
              disabled={isRegenerating}
              id={`history-regen-${item._id}`}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isRegenerating && "animate-spin")} aria-hidden="true" />
              Regenerate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => { setMenuOpen(false); onDelete(item._id); }}
              disabled={isDeleting}
              className="text-destructive focus:text-destructive"
              id={`history-delete-${item._id}`}
            >
              <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
