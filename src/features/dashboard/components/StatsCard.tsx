"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  formatType?: "number" | "tokens" | "time";
  className?: string;
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  description,
  formatType = "number",
  className,
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  // Smooth counter animation
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setDisplayValue(end);
      return;
    }

    const duration = 800; // ms
    const increment = end > start ? Math.ceil(end / 40) : Math.floor(end / 40);
    const stepTime = Math.abs(Math.floor(duration / (end / (increment || 1))));

    const timer = setInterval(() => {
      start += increment || 1;
      if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
        clearInterval(timer);
        setDisplayValue(end);
      } else {
        setDisplayValue(start);
      }
    }, Math.max(stepTime, 16)); // max 60fps refresh rate

    return () => clearInterval(timer);
  }, [value]);

  const formatted = () => {
    if (formatType === "tokens") {
      if (displayValue >= 1_000_000) {
        return `${(displayValue / 1_000_000).toFixed(1)}M`;
      }
      if (displayValue >= 1_000) {
        return `${(displayValue / 1_000).toFixed(1)}K`;
      }
      return displayValue.toLocaleString();
    }
    if (formatType === "time") {
      const seconds = displayValue / 1000;
      return `${seconds.toFixed(1)}s`;
    }
    return displayValue.toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-xl border bg-card p-5 shadow-sm hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-200 flex items-start justify-between gap-4",
        className
      )}
      role="region"
      aria-label={`${label} metric`}
    >
      <div className="space-y-1.5 min-w-0">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
          {label}
        </span>
        <h3 className="text-2xl font-bold text-foreground leading-none tracking-tight">
          {formatted()}
        </h3>
        {description && (
          <p className="text-xs text-muted-foreground/80 leading-relaxed truncate">
            {description}
          </p>
        )}
      </div>
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
    </motion.div>
  );
}
