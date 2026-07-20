"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIResultViewer } from "./AIResultViewer";
import { CardSkeleton } from "@/components/skeletons/CardSkeleton";
import { useAIHistoryEntry, useRegenerateAI } from "../hooks/useAI";

interface AIResultClientProps {
  id: string;
}

/**
 * Full-page AI result viewer for a specific history entry.
 * Handles loading, error, and successful states.
 */
export function AIResultClient({ id }: AIResultClientProps) {
  const router = useRouter();

  const { data: result, isLoading, isError } = useAIHistoryEntry(id);
  const { mutate: regenerate, isPending: isRegenerating } = useRegenerateAI();

  function handleRegenerate() {
    regenerate(id, {
      onSuccess: (newResult) => {
        router.push(`/ai/result/${newResult._id}`);
      },
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2 text-muted-foreground hover:text-foreground"
          id="result-back-btn"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/ai")}
            className="gap-1.5 text-xs"
            id="result-new-btn"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            New Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            disabled={isRegenerating || isLoading}
            className="gap-1.5 text-xs"
            id="result-regenerate-btn"
            aria-label="Regenerate this research"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRegenerating ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            {isRegenerating ? "Regenerating…" : "Regenerate"}
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          <CardSkeleton lines={5} />
          <CardSkeleton lines={8} />
        </div>
      ) : isError || !result ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-4 py-24 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">
              Result Not Found
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              This research result could not be loaded. It may have been deleted
              or the link is invalid.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/ai")}
            className="mt-2"
            id="result-go-generate-btn"
          >
            Go to Generator
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-2xl border bg-card p-6 shadow-sm"
        >
          <AIResultViewer result={result} />
        </motion.div>
      )}
    </div>
  );
}
