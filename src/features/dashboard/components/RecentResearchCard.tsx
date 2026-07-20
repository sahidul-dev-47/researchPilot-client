"use client";

import Link from "next/link";
import { ArrowRight, FileText, Calendar } from "lucide-react";
import type { Research } from "@/types/research";
import { cn } from "@/lib/utils";

interface RecentResearchCardProps {
  items: Research[];
  className?: string;
}

export function RecentResearchCard({ items, className }: RecentResearchCardProps) {
  return (
    <div className={cn("rounded-xl border bg-card p-5 shadow-sm space-y-4", className)}>
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <FileText className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
          Recent Research
        </h4>
        <Link
          href="/research"
          className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
        >
          View all
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-6 text-xs text-muted-foreground">
          No research projects yet.
        </div>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 5).map((project) => {
            const formattedDate = new Date(project.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });

            return (
              <Link
                key={project._id}
                href={`/research/${project._id}`}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/40 group text-left"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {project.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                    {project.category} · {project.researchField}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 text-[10px] text-muted-foreground">
                  <Calendar className="h-3 w-3" aria-hidden="true" />
                  <span>{formattedDate}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
