"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isDeleting?: boolean;
}

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  isDeleting = false,
}: DeleteDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors rounded-lg p-1"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Icon & Title */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <AlertTriangle className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h3
                  id="delete-dialog-title"
                  className="text-lg font-bold text-foreground"
                >
                  Delete Research Project
                </h3>
                <p className="text-xs text-muted-foreground">This action is permanent</p>
              </div>
            </div>

            {/* Content text */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to delete the project{" "}
              <span className="font-semibold text-foreground">&ldquo;{title}&rdquo;</span>?
              All of its content, descriptions, and metadata will be permanently erased.
              This cannot be undone.
            </p>

            {/* CTAs */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={onClose}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="w-full sm:w-auto font-medium gap-2"
                onClick={onConfirm}
                disabled={isDeleting}
                id="confirm-delete-btn"
              >
                {isDeleting ? (
                  <motion.div
                    className="h-4 w-4 rounded-full border-2 border-background border-t-transparent animate-spin"
                    layout
                  />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Confirm Delete
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
