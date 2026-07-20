"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Brain,
  Clock,
  Cpu,
  Loader2,
} from "lucide-react";

const STEPS = [
  { icon: Brain, label: "Analyzing your research topic…" },
  { icon: Cpu, label: "Building structured report outline…" },
  { icon: Sparkles, label: "Generating research content with AI…" },
  { icon: Clock, label: "Finalizing and formatting report…" },
] as const;

interface GenerationProgressProps {
  step?: number; // 0-indexed, advances every ~5s
}

/**
 * Progress indicator shown while AI generates a report.
 * Displays animated step list with typing dots.
 */
export function GenerationProgress({ step = 0 }: GenerationProgressProps) {
  const currentStep = Math.min(step, STEPS.length - 1);

  return (
    <div
      className="flex flex-col items-center justify-center gap-8 py-12 px-6 text-center"
      role="status"
      aria-label="AI research generation in progress"
      aria-live="polite"
    >
      {/* Central spinner */}
      <div className="relative">
        <div className="h-20 w-20 rounded-full gradient-primary opacity-20 animate-pulse absolute inset-0" />
        <div className="h-20 w-20 rounded-full flex items-center justify-center border-4 border-primary/30">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-8 w-8 text-primary" aria-hidden="true" />
          </motion.div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2.5 w-full max-w-xs">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isDone = i < currentStep;
          const isCurrent = i === currentStep;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: isCurrent || isDone ? 1 : 0.35, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className={`flex items-center gap-3 text-sm rounded-lg px-4 py-2.5 ${
                isCurrent
                  ? "bg-primary/10 border border-primary/25 text-primary font-medium"
                  : isDone
                  ? "text-muted-foreground"
                  : "text-muted-foreground/50"
              }`}
            >
              {isCurrent ? (
                <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" aria-hidden="true" />
              ) : (
                <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              )}
              <span>{s.label}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Typing dots */}
      <div className="flex gap-1.5 items-center text-xs text-muted-foreground">
        <span>This may take up to 30 seconds</span>
        <span className="flex gap-0.5">
          {[0, 1, 2].map((d) => (
            <motion.span
              key={d}
              className="w-1 h-1 rounded-full bg-primary inline-block"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: d * 0.3 }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
