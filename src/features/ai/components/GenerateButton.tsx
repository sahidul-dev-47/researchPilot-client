"use client";

import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GenerateButtonProps {
  isGenerating: boolean;
  label?: string;
  className?: string;
  type?: "submit" | "button";
  onClick?: () => void;
  disabled?: boolean;
  id?: string;
}

/**
 * Animated Generate button with pulse-glow when idle and spinner when loading.
 */
export function GenerateButton({
  isGenerating,
  label = "Generate Research",
  className,
  type = "submit",
  onClick,
  disabled = false,
  id = "generate-btn",
}: GenerateButtonProps) {
  return (
    <Button
      id={id}
      type={type}
      onClick={onClick}
      disabled={isGenerating || disabled}
      className={cn(
        "relative w-full h-11 gradient-primary border-0 text-white font-semibold tracking-wide",
        "hover:opacity-90 transition-opacity shadow-lg shadow-primary/30",
        !isGenerating && !disabled && "animate-pulse-glow",
        className
      )}
      aria-label={isGenerating ? "Generating research, please wait…" : label}
    >
      <motion.span
        className="flex items-center justify-center gap-2"
        animate={isGenerating ? { opacity: [1, 0.7, 1] } : { opacity: 1 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Generating…
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {label}
          </>
        )}
      </motion.span>
    </Button>
  );
}
