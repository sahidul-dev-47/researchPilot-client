"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, History, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AIGeneratorForm } from "./AIGeneratorForm";
import { AIResultViewer } from "./AIResultViewer";
import { GenerationProgress } from "./GenerationProgress";
import { useGenerateAI, useRegenerateAI } from "../hooks/useAI";
import type { GenerateResearchInput, AIResearch } from "@/types/ai";
import { cn } from "@/lib/utils";

/**
 * AI Generator split-layout page client.
 * Left: input form | Right: generated result or empty state.
 */
export function AIGeneratorClient() {
  const router = useRouter();
  const [result, setResult] = useState<AIResearch | null>(null);
  const [lastHistoryId, setLastHistoryId] = useState<string | null>(null);
  const [progressStep, setProgressStep] = useState(0);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const { mutate: generate, isPending: isGenerating } = useGenerateAI();
  const { mutate: regenerate, isPending: isRegenerating } = useRegenerateAI();

  const isLoading = isGenerating || isRegenerating;

  // Advance progress step every 6s while loading
  useEffect(() => {
    if (isLoading) {
      setProgressStep(0);
      progressTimer.current = setInterval(() => {
        setProgressStep((s) => Math.min(s + 1, 3));
      }, 6000);
    } else {
      if (progressTimer.current) clearInterval(progressTimer.current);
      setProgressStep(0);
    }
    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  }, [isLoading]);

  // Scroll result into view on mobile after generation
  useEffect(() => {
    if (result && resultRef.current) {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [result]);

  function handleGenerate(values: GenerateResearchInput) {
    generate(values, {
      onSuccess: (data) => {
        setResult(data);
        setLastHistoryId(data._id);
      },
    });
  }

  function handleRegenerate() {
    if (!lastHistoryId) return;
    regenerate(lastHistoryId, {
      onSuccess: (data) => {
        setResult(data);
        setLastHistoryId(data._id);
      },
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-md">
            <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              AI Research Generator
            </h1>
            <p className="text-sm text-muted-foreground">
              Generate publication-grade research reports powered by Gemini AI
            </p>
          </div>
        </div>

        {/* Quick links */}
        <div className="flex items-center gap-4 mt-4">
          <Link
            href="/ai/history"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            id="view-history-link"
          >
            <History className="h-3.5 w-3.5" aria-hidden="true" />
            View History
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 xl:gap-8">
        {/* ── Left: Form Panel ── */}
        <div
          className={cn(
            "rounded-2xl border bg-card p-5 shadow-sm h-fit lg:sticky lg:top-24",
            "transition-opacity duration-200",
            isLoading && "pointer-events-none opacity-75"
          )}
        >
          <div className="flex items-center gap-2 mb-5 pb-4 border-b">
            <Zap className="h-4 w-4 text-primary" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-foreground">Configure Report</h2>
          </div>
          <AIGeneratorForm
            onSubmit={handleGenerate}
            onRegenerate={handleRegenerate}
            isGenerating={isLoading}
            hasResult={!!result}
            canRegenerate={!!lastHistoryId}
          />
        </div>

        {/* ── Right: Result Panel ── */}
        <div ref={resultRef} className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="progress"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border bg-card shadow-sm h-full flex items-center justify-center"
              >
                <GenerationProgress step={progressStep} />
              </motion.div>
            ) : result ? (
              <motion.div
                key={`result-${result._id}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="rounded-2xl border bg-card p-5 shadow-sm"
              >
                <AIResultViewer result={result} />

                {/* Navigate to full result page */}
                <div className="mt-5 pt-4 border-t flex justify-end">
                  <button
                    onClick={() => router.push(`/ai/result/${result._id}`)}
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                    id="open-full-result-btn"
                    aria-label="Open full result page"
                  >
                    Open full page
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-dashed bg-muted/30 h-full min-h-[400px] flex flex-col items-center justify-center gap-4 text-center px-8 py-16"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                  <Sparkles className="h-7 w-7 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    Ready to Generate
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                    Fill in the form on the left and click{" "}
                    <strong className="text-foreground">Generate Research</strong> to
                    create a comprehensive, publication-grade report with AI.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground mt-2">
                  {["Headings & Structure", "Tables & Lists", "References", "Keywords"].map((f) => (
                    <span
                      key={f}
                      className="px-2.5 py-1 rounded-full border bg-background"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
