"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Conversation } from "@/types/chat";

interface RenameConversationDialogProps {
  conversation: Conversation | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (conversationId: string, newTitle: string) => void;
  isLoading?: boolean;
}

/**
 * Modal dialog for renaming a conversation.
 * Pre-fills with the current title and focuses the input on open.
 */
export function RenameConversationDialog({
  conversation,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: RenameConversationDialogProps) {
  const [title, setTitle] = useState(conversation?.title ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync title when conversation changes
  useEffect(() => {
    if (conversation) setTitle(conversation.title);
  }, [conversation]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  function handleConfirm() {
    if (!conversation || !title.trim()) return;
    onConfirm(conversation._id, title.trim());
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleConfirm();
    if (e.key === "Escape") onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="rename-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            key="rename-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rename-dialog-title"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md rounded-2xl border bg-card shadow-xl p-6"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            <h2 id="rename-dialog-title" className="text-base font-semibold text-foreground mb-4">
              Rename Conversation
            </h2>

            <div className="space-y-2 mb-5">
              <Label htmlFor="rename-title-input">New Title</Label>
              <Input
                ref={inputRef}
                id="rename-title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter a new title…"
                maxLength={100}
                aria-describedby="rename-char-count"
              />
              <p
                id="rename-char-count"
                className={`text-xs text-right ${title.length > 90 ? "text-destructive" : "text-muted-foreground"}`}
              >
                {title.length}/100
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isLoading}
                id="rename-cancel-btn"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirm}
                disabled={!title.trim() || title.trim() === conversation?.title || isLoading}
                className="gradient-primary border-0 text-white"
                id="rename-confirm-btn"
                aria-label="Confirm rename"
              >
                {isLoading ? "Saving…" : "Rename"}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
