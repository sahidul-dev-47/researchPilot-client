"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Clock,
  Hash,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ResultToolbar } from "./ResultToolbar";
import type { AIResearch } from "@/types/ai";
import { cn } from "@/lib/utils";

interface AIResultViewerProps {
  result: AIResearch;
  className?: string;
}

/**
 * Full-featured result viewer: metadata strip, toolbar, markdown body,
 * keywords, and references in collapsible sections.
 */
export function AIResultViewer({ result, className }: AIResultViewerProps) {
  const [showRefs, setShowRefs] = useState(false);

  const genSeconds = Math.round(result.generationTime / 1000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("flex flex-col gap-5", className)}
    >
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <h2 className="text-lg font-bold text-foreground leading-tight">
              {result.generatedTitle}
            </h2>
          </div>
          <ResultToolbar result={result} />
        </div>

        {/* Meta strip */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            Generated in {genSeconds}s
          </span>
          <span className="flex items-center gap-1">
            <Hash className="h-3 w-3" aria-hidden="true" />
            {result.tokensUsed.toLocaleString()} tokens
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" aria-hidden="true" />
            {result.model}
          </span>
          <span>
            {new Date(result.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Summary box */}
      {result.summary && (
        <div className="rounded-xl border bg-primary/5 border-primary/20 px-4 py-3">
          <p className="text-sm font-medium text-primary mb-1">Abstract</p>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {result.summary}
          </p>
        </div>
      )}

      {/* Markdown content */}
      <div className="rounded-xl border bg-card p-5 min-h-[200px] overflow-x-auto">
        <MarkdownRenderer content={result.generatedContent} />
      </div>

      {/* Keywords */}
      {result.keywords.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Keywords
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.keywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* References collapsible */}
      {result.references.length > 0 && (
        <div className="rounded-xl border bg-card overflow-hidden">
          <button
            onClick={() => setShowRefs((v) => !v)}
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors"
            aria-expanded={showRefs}
            id="references-toggle"
          >
            <span>References ({result.references.length})</span>
            {showRefs ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            )}
          </button>
          <AnimatePresence initial={false}>
            {showRefs && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <ol className="px-4 pb-4 pt-1 space-y-2 list-decimal list-inside">
                  {result.references.map((ref, i) => (
                    <li
                      key={i}
                      className="text-xs text-muted-foreground leading-relaxed"
                    >
                      {ref}
                    </li>
                  ))}
                </ol>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
