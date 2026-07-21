"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Bookmark, ExternalLink, Calendar, Tag, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRemoveBookmark } from "@/features/user/hooks/useUser";
import type { Research } from "@/types/research";

interface BookmarkCardProps {
  research: Research;
}

export function BookmarkCard({ research }: BookmarkCardProps) {
  const removeBookmark = useRemoveBookmark();

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeBookmark.mutate(research._id);
  };

  const statusColors: Record<string, string> = {
    Completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "In Progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Draft: "bg-muted text-muted-foreground border-border",
  };

  const priorityColors: Record<string, string> = {
    High: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Low: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col justify-between overflow-hidden border-border bg-card/60 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
        <div>
          {/* Card Header with Badges */}
          <CardHeader className="pb-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                {research.category || "General"}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={removeBookmark.isPending}
                className="h-7 w-7 text-primary hover:text-destructive hover:bg-destructive/10 rounded-full"
                aria-label="Remove bookmark"
              >
                <Bookmark className="h-4 w-4 fill-primary text-primary transition-colors hover:fill-transparent" aria-hidden="true" />
              </Button>
            </div>
            
            <CardTitle className="text-base font-bold tracking-tight text-foreground line-clamp-1">
              {research.title}
            </CardTitle>
          </CardHeader>

          {/* Card Content */}
          <CardContent className="pb-4 space-y-3.5">
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {research.shortDescription || "No description provided."}
            </p>

            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${statusColors[research.status] || ''}`}>
                {research.status}
              </Badge>
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${priorityColors[research.priority] || ''}`}>
                {research.priority} Priority
              </Badge>
            </div>
          </CardContent>
        </div>

        {/* Card Footer */}
        <CardFooter className="pt-3 pb-4 border-t border-border/40 flex items-center justify-between gap-3 text-muted-foreground">
          <div className="flex items-center gap-1 text-[10px]">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            <span>
              {new Date(research.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <Link
            href={`/research/${research._id}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8 text-xs font-semibold px-3 cursor-pointer")}
          >
            <ExternalLink className="h-3 w-3 mr-1.5" aria-hidden="true" />
            Open Details
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
