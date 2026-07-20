"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Renders rich Markdown with comprehensive prose styling.
 * Supports headings, lists, tables, code blocks, blockquotes, and links.
 */
export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        // Base prose styles
        "prose prose-sm sm:prose-base max-w-none",
        // Headings
        "prose-headings:font-bold prose-headings:text-foreground prose-headings:tracking-tight",
        "prose-h1:text-2xl prose-h1:mt-6 prose-h1:mb-4 prose-h1:pb-2 prose-h1:border-b prose-h1:border-border",
        "prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3",
        "prose-h3:text-lg prose-h3:mt-5 prose-h3:mb-2",
        "prose-h4:text-base prose-h4:mt-4 prose-h4:mb-2",
        // Paragraphs
        "prose-p:text-foreground/90 prose-p:leading-7",
        // Links
        "prose-a:text-primary prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-primary/80",
        // Lists
        "prose-ul:text-foreground/90 prose-li:my-1",
        "prose-ol:text-foreground/90",
        // Blockquotes
        "prose-blockquote:border-l-4 prose-blockquote:border-primary/40 prose-blockquote:bg-primary/5 prose-blockquote:px-4 prose-blockquote:py-1 prose-blockquote:rounded-r-md prose-blockquote:text-muted-foreground prose-blockquote:not-italic",
        // Code inline
        "prose-code:before:content-none prose-code:after:content-none prose-code:bg-muted prose-code:text-primary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono",
        // Code blocks
        "prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-pre:p-4 prose-pre:overflow-x-auto",
        "prose-pre:prose-code:bg-transparent prose-pre:prose-code:text-foreground",
        // Tables
        "prose-table:border-collapse prose-table:w-full",
        "prose-thead:bg-muted/60",
        "prose-th:border prose-th:border-border prose-th:px-4 prose-th:py-2.5 prose-th:text-left prose-th:font-semibold prose-th:text-foreground",
        "prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2 prose-td:text-foreground/90",
        "prose-tr:even:bg-muted/20",
        // Strong / em
        "prose-strong:text-foreground prose-em:text-foreground/80",
        // HR
        "prose-hr:border-border",
        className
      )}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
