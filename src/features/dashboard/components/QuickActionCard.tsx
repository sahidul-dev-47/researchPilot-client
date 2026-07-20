"use client";

import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  className?: string;
}

export function QuickActionCard({
  title,
  description,
  href,
  icon: Icon,
  className,
}: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative rounded-xl border bg-card p-5 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all duration-200 flex items-start gap-4 text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      aria-label={title}
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="space-y-1 min-w-0">
        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h4>
        <p className="text-xs text-muted-foreground leading-normal">
          {description}
        </p>
      </div>
    </Link>
  );
}
