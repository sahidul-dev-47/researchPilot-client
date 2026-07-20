"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertCircle } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { CardSkeleton } from "@/components/skeletons/CardSkeleton";
import type { ChatMessage } from "@/types/chat";

const SUGGESTED_PROMPTS = [
  "Summarize this research paper for me",
  "Explain quantum computing in simple terms",
  "Generate a research outline for machine learning",
  "Create a literature review on climate change",
  "Analyze the impact of AI on healthcare",
] as const;

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isError: boolean;
  isSending: boolean;
  /** suggestedQuestions from the last backend response */
  lastSuggestedQuestions: string[];
  onSuggestionClick: (question: string) => void;
  hasConversation: boolean;
}

/**
 * The main chat message area.
 * - Empty state: welcome screen with suggested prompt chips.
 * - Loading: skeletons.
 * - Error: error state.
 * - Messages: scrollable list with MessageBubble + TypingIndicator.
 */
export function ChatWindow({
  messages,
  isLoading,
  isError,
  isSending,
  lastSuggestedQuestions,
  onSuggestionClick,
  hasConversation,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages or sending state changes
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isSending, scrollToBottom]);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <CardSkeleton lines={3} />
        <CardSkeleton lines={5} className="max-w-[70%] ml-auto" />
        <CardSkeleton lines={4} />
        <CardSkeleton lines={2} className="max-w-[60%] ml-auto" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
          <AlertCircle className="h-7 w-7 text-destructive" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-foreground">
          Failed to load messages
        </p>
        <p className="text-xs text-muted-foreground max-w-xs">
          Something went wrong. Please refresh or select another conversation.
        </p>
      </div>
    );
  }

  if (!hasConversation && messages.length === 0) {
    // Welcome / Empty state
    return (
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-6 py-12 text-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="flex h-20 w-20 items-center justify-center rounded-3xl gradient-primary shadow-lg shadow-primary/30"
        >
          <Sparkles className="h-9 w-9 text-white" aria-hidden="true" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-foreground mb-2">
            ResearchPilot AI Chat
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            Your expert academic research assistant. Ask anything about your
            research, get summaries, explanations, outlines, and more.
          </p>
        </motion.div>

        {/* Suggested prompts */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg"
          aria-label="Suggested prompts to start a conversation"
        >
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => onSuggestionClick(prompt)}
              className="text-left px-4 py-3 rounded-xl border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all duration-150 text-xs text-muted-foreground hover:text-foreground"
              aria-label={`Start chat with: ${prompt}`}
              id={`welcome-prompt-${i}`}
            >
              {prompt}
            </button>
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-6 space-y-5"
      role="log"
      aria-label="Chat conversation"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {messages.map((msg, idx) => {
          const isLastAI =
            msg.role === "Assistant" &&
            idx === messages.length - 1 &&
            !isSending;
          return (
            <MessageBubble
              key={msg._id}
              message={msg}
              isLast={isLastAI}
              suggestedQuestions={isLastAI ? lastSuggestedQuestions : []}
              onSuggestionClick={onSuggestionClick}
            />
          );
        })}
      </AnimatePresence>

      {isSending && <TypingIndicator />}

      {/* Scroll anchor */}
      <div ref={bottomRef} aria-hidden="true" />
    </div>
  );
}
