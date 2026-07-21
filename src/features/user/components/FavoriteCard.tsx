"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Sparkles, MessageSquare, ExternalLink, Calendar, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToggleFavoriteAI, useToggleFavoriteChat } from "@/features/user/hooks/useUser";
import type { AIResearch } from "@/types/ai";
import type { Conversation } from "@/types/chat";

interface FavoriteCardProps {
  type: "ai" | "chat";
  item: AIResearch | Conversation;
}

export function FavoriteCard({ type, item }: FavoriteCardProps) {
  const toggleFavoriteAI = useToggleFavoriteAI();
  const toggleFavoriteChat = useToggleFavoriteChat();

  const isAI = type === "ai";
  const aiItem = item as AIResearch;
  const chatItem = item as Conversation;

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAI) {
      toggleFavoriteAI.mutate({ historyId: item._id, isFavorited: true });
    } else {
      toggleFavoriteChat.mutate({ conversationId: item._id, isFavorited: true });
    }
  };

  const title = isAI ? aiItem.generatedTitle : chatItem.title;
  const description = isAI ? aiItem.summary : chatItem.lastMessage;
  const date = new Date(item.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const detailUrl = isAI ? `/ai/history/${item._id}` : `/chat?convo=${item._id}`;

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
          {/* Card Header */}
          <CardHeader className="pb-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Badge
                variant="outline"
                className={
                  isAI
                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 text-[10px]"
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]"
                }
              >
                {isAI ? (
                  <Sparkles className="h-3 w-3 mr-1" aria-hidden="true" />
                ) : (
                  <MessageSquare className="h-3 w-3 mr-1" aria-hidden="true" />
                )}
                {isAI ? "AI Report" : "Chat Thread"}
              </Badge>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={toggleFavoriteAI.isPending || toggleFavoriteChat.isPending}
                className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-full"
                aria-label="Remove from favorites"
              >
                <Heart className="h-4 w-4 fill-rose-500 text-rose-500 transition-colors hover:fill-transparent" aria-hidden="true" />
              </Button>
            </div>

            <CardTitle className="text-base font-bold tracking-tight text-foreground line-clamp-1">
              {title}
            </CardTitle>
          </CardHeader>

          {/* Card Content */}
          <CardContent className="pb-4 space-y-3">
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {description || (isAI ? "No summary available." : "No messages in this chat.")}
            </p>

            {isAI && (
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-muted/40 p-2 rounded-lg border border-border/20">
                <Cpu className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="font-medium">Model: {aiItem.model}</span>
                <span>•</span>
                <span>{aiItem.tokensUsed.toLocaleString()} tokens</span>
              </div>
            )}
          </CardContent>
        </div>

        {/* Card Footer */}
        <CardFooter className="pt-3 pb-4 border-t border-border/40 flex items-center justify-between gap-3 text-muted-foreground">
          <div className="flex items-center gap-1 text-[10px]">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            <span>Favorited {date}</span>
          </div>

          <Link
            href={detailUrl}
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
