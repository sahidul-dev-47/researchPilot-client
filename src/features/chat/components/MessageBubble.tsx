"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, CheckCheck, User } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";

interface MessageBubbleProps {
  message: ChatMessage;
  /** Whether this message is the last AI message (show follow-up chips below) */
  isLast?: boolean;
  suggestedQuestions?: string[];
  onSuggestionClick?: (question: string) => void;
}

/**
 * Renders a single chat message bubble.
 * - User messages: right-aligned with muted bg.
 * - Assistant messages: left-aligned with card bg + rich Markdown.
 * - Shows timestamp and copy button on hover.
 */
export function MessageBubble({
  message,
  isLast = false,
  suggestedQuestions = [],
  onSuggestionClick,
}: MessageBubbleProps) {
  const isUser = message.role === "User";
  const [copied, setCopied] = useState(false);

  const formattedTime = new Date(message.createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  async function handleCopy() {
    await navigator.clipboard.writeText(message.message);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "group flex items-end gap-2.5",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm",
          isUser
            ? "bg-muted text-muted-foreground"
            : "gradient-primary text-white"
        )}
        aria-hidden="true"
      >
        {isUser ? <User className="h-4 w-4" /> : "AI"}
      </div>

      {/* Bubble + actions */}
      <div
        className={cn(
          "flex flex-col gap-1 max-w-[75%] md:max-w-[70%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "relative rounded-2xl px-4 py-3 text-sm shadow-sm",
            isUser
              ? "rounded-br-sm bg-primary text-primary-foreground"
              : "rounded-bl-sm bg-card border text-foreground"
          )}
        >
          {isUser ? (
            <p className="leading-relaxed whitespace-pre-wrap break-words">
              {message.message}
            </p>
          ) : (
            <div
              className={cn(
                "prose prose-sm max-w-none",
                // Headings
                "prose-headings:font-semibold prose-headings:text-foreground prose-headings:tracking-tight",
                "prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-h4:text-sm",
                // Paragraphs
                "prose-p:text-foreground/90 prose-p:leading-relaxed",
                // Code inline
                "prose-code:before:content-none prose-code:after:content-none",
                "prose-code:bg-muted prose-code:text-primary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono",
                // Code block
                "prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-pre:p-3 prose-pre:overflow-x-auto",
                "prose-pre:prose-code:bg-transparent prose-pre:prose-code:text-foreground",
                // Lists
                "prose-ul:text-foreground/90 prose-li:my-0.5",
                "prose-ol:text-foreground/90",
                // Blockquotes
                "prose-blockquote:border-l-4 prose-blockquote:border-primary/40 prose-blockquote:bg-primary/5 prose-blockquote:px-3 prose-blockquote:py-1 prose-blockquote:rounded-r-md prose-blockquote:not-italic prose-blockquote:text-muted-foreground",
                // Tables
                "prose-table:w-full prose-th:border prose-th:border-border prose-th:px-3 prose-th:py-2 prose-th:bg-muted/60 prose-th:text-left prose-th:font-semibold prose-td:border prose-td:border-border prose-td:px-3 prose-td:py-2",
                // Links
                "prose-a:text-primary prose-a:underline-offset-2",
                // Strong
                "prose-strong:text-foreground",
              )}
            >
              <ReactMarkdown>{message.message}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Timestamp + copy */}
        <div
          className={cn(
            "flex items-center gap-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity",
            isUser ? "flex-row-reverse" : "flex-row"
          )}
        >
          <span>{formattedTime}</span>
          <button
            onClick={handleCopy}
            className="p-0.5 rounded hover:text-foreground transition-colors"
            aria-label="Copy message"
            title="Copy"
          >
            {copied ? (
              <CheckCheck className="h-3 w-3 text-primary" aria-hidden="true" />
            ) : (
              <Copy className="h-3 w-3" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Suggested follow-up questions (AI messages only, last one) */}
        {!isUser && isLast && suggestedQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.25 }}
            className="flex flex-wrap gap-2 mt-1"
            aria-label="Suggested follow-up questions"
          >
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => onSuggestionClick?.(q)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary",
                  "hover:bg-primary/15 hover:border-primary/50 transition-colors text-left",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
                aria-label={`Ask: ${q}`}
                id={`suggestion-${i}`}
              >
                {q}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
