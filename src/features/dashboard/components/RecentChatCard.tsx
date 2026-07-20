"use client";

import Link from "next/link";
import { ArrowRight, MessageSquare, Calendar } from "lucide-react";
import type { Conversation } from "@/types/chat";
import { cn } from "@/lib/utils";

interface RecentChatCardProps {
  items: Conversation[];
  className?: string;
}

export function RecentChatCard({ items, className }: RecentChatCardProps) {
  return (
    <div className={cn("rounded-xl border bg-card p-5 shadow-sm space-y-4", className)}>
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
          Recent Chats
        </h4>
        <Link
          href="/chat"
          className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
        >
          View all
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-6 text-xs text-muted-foreground">
          No conversations yet.
        </div>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 5).map((chat) => {
            const formattedDate = new Date(chat.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });

            return (
              <Link
                key={chat._id}
                href={`/chat/${chat._id}`}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/40 group text-left"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {chat.title}
                  </p>
                  {chat.lastMessage && (
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5 leading-snug">
                      {chat.lastMessage}
                    </p>
                  )}
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
