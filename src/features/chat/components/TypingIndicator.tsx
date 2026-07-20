"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  className?: string;
}

/**
 * Animated three-dot typing indicator shown while AI is responding.
 */
export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div
      className={cn("flex items-end gap-3", className)}
      role="status"
      aria-label="AI is typing"
      aria-live="polite"
    >
      {/* AI Avatar */}
      <div className="flex-shrink-0 h-8 w-8 rounded-full gradient-primary flex items-center justify-center shadow-sm">
        <span className="text-white text-xs font-bold" aria-hidden="true">
          AI
        </span>
      </div>

      {/* Bubble */}
      <div className="rounded-2xl rounded-bl-sm bg-card border px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-primary/60"
              animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
