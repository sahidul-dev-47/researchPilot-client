"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Conversation } from "@/types/chat";

interface DeleteConversationDialogProps {
  conversation: Conversation | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (conversationId: string) => void;
  isLoading?: boolean;
}

/**
 * Confirmation dialog before deleting a conversation.
 */
export function DeleteConversationDialog({
  conversation,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteConversationDialogProps) {
  function handleConfirm() {
    if (!conversation) return;
    onConfirm(conversation._id);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="delete-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            key="delete-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
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

            {/* Warning icon */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-destructive/10">
                <AlertTriangle
                  className="h-5 w-5 text-destructive"
                  aria-hidden="true"
                />
              </div>
              <h2
                id="delete-dialog-title"
                className="text-base font-semibold text-foreground"
              >
                Delete Conversation
              </h2>
            </div>

            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-foreground">
                &quot;{conversation?.title}&quot;
              </strong>
              ? This will permanently remove all messages in this conversation. This
              action cannot be undone.
            </p>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isLoading}
                id="delete-conv-cancel-btn"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirm}
                disabled={isLoading}
                variant="destructive"
                className="gap-1.5"
                id="delete-conv-confirm-btn"
                aria-label="Confirm delete conversation"
              >
                {isLoading ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
