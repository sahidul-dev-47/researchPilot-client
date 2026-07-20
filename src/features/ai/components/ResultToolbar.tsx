"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Copy,
  Download,
  Printer,
  Share2,
  BookmarkPlus,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { AIResearch } from "@/types/ai";

interface ResultToolbarProps {
  result: AIResearch;
  onSave?: () => void;
  isSaving?: boolean;
}

/**
 * Action toolbar rendered above the AI-generated result.
 * Provides copy, download, print, share, and save actions.
 */
export function ResultToolbar({ result, onSave, isSaving = false }: ResultToolbarProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(result.generatedContent);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([result.generatedContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.generatedTitle.replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Markdown file downloaded");
  }

  function handlePrint() {
    window.print();
  }

  function handleShare() {
    toast.info("Share feature coming soon!");
  }

  const actions = [
    {
      id: "copy",
      label: copied ? "Copied!" : "Copy to clipboard",
      icon: copied ? CheckCheck : Copy,
      onClick: handleCopy,
    },
    {
      id: "download",
      label: "Download Markdown",
      icon: Download,
      onClick: handleDownload,
    },
    {
      id: "print",
      label: "Print",
      icon: Printer,
      onClick: handlePrint,
    },
    {
      id: "share",
      label: "Share (coming soon)",
      icon: Share2,
      onClick: handleShare,
    },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-1.5 flex-wrap"
    >
      {actions.map((action) => (
        <Tooltip key={action.id}>
          <TooltipTrigger
            onClick={action.onClick}
            id={`result-${action.id}-btn`}
            aria-label={action.label}
            className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer"
          >
            <action.icon className="h-3.5 w-3.5" aria-hidden="true" />
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            {action.label}
          </TooltipContent>
        </Tooltip>
      ))}

      {onSave && (
        <Tooltip>
          <TooltipTrigger
            onClick={onSave}
            disabled={isSaving}
            id="result-save-btn"
            aria-label="Save to history"
            className="h-8 px-3 inline-flex items-center justify-center rounded-md text-xs font-semibold gap-1.5 gradient-primary border-0 text-white hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <BookmarkPlus className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            Save
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Save result to history
          </TooltipContent>
        </Tooltip>
      )}
    </motion.div>
  );
}
