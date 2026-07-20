"use client";

import {
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
  type FormEvent,
} from "react";
import { motion } from "framer-motion";
import { Send, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  isDisabled?: boolean;
  isSending?: boolean;
  placeholder?: string;
}

/**
 * Auto-resizing multiline textarea chat input.
 * - Enter sends message (Shift+Enter = newline).
 * - Auto-resizes up to ~6 lines.
 * - Clear button clears draft.
 */
export function ChatInput({
  value,
  onChange,
  onSubmit,
  onClear,
  isDisabled = false,
  isSending = false,
  placeholder = "Ask ResearchPilot AI anything…",
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize: reset to auto then set to scrollHeight
  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const maxH = 6 * 24; // ~6 lines
    el.style.height = `${Math.min(el.scrollHeight, maxH)}px`;
  }, []);

  useEffect(() => {
    resize();
  }, [value, resize]);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isDisabled && !isSending) {
        onSubmit();
      }
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (value.trim() && !isDisabled && !isSending) {
      onSubmit();
    }
  }

  const canSend = value.trim().length > 0 && !isDisabled && !isSending;

  return (
    <form
      onSubmit={handleSubmit}
      className="px-4 py-3 border-t bg-background"
      aria-label="Chat message input"
    >
      <div
        className={cn(
          "flex items-end gap-2 rounded-2xl border bg-card px-3 py-2 shadow-sm",
          "focus-within:ring-2 focus-within:ring-ring focus-within:border-primary/50",
          "transition-all duration-150"
        )}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isDisabled || isSending}
          rows={1}
          id="chat-input"
          aria-label="Message input"
          aria-multiline="true"
          aria-describedby="chat-input-hint"
          className={cn(
            "flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground",
            "focus:outline-none leading-6 py-1 max-h-36 overflow-y-auto",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        />

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0 pb-1">
          {value.trim() && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClear}
              disabled={isDisabled || isSending}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              aria-label="Clear message"
              id="chat-clear-btn"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          )}

          <motion.div
            animate={{ scale: canSend ? 1 : 0.92, opacity: canSend ? 1 : 0.5 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              type="submit"
              size="sm"
              disabled={!canSend}
              className="h-8 w-8 p-0 gradient-primary border-0 text-white shadow-sm hover:opacity-90 transition-opacity"
              aria-label={isSending ? "Sending…" : "Send message"}
              id="chat-send-btn"
            >
              {isSending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Hint */}
      <p
        id="chat-input-hint"
        className="mt-1.5 text-[10px] text-muted-foreground/60 text-center"
      >
        Press <kbd className="font-mono">Enter</kbd> to send ·{" "}
        <kbd className="font-mono">Shift + Enter</kbd> for new line
      </p>
    </form>
  );
}
