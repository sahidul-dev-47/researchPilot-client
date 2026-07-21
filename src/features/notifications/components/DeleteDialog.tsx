"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DeleteDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
}

export function DeleteDialog({
  open,
  title = "Delete Notification",
  description = "Are you sure you want to delete this notification? This action cannot be undone.",
  onConfirm,
  onCancel,
  isPending = false,
}: DeleteDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onCancel}
            aria-hidden="true"
          />
          {/* Dialog */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <motion.div
              key="dialog"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "relative w-full max-w-sm rounded-2xl border border-border bg-card shadow-2xl p-6",
                "flex flex-col gap-4"
              )}
            >
              {/* Close button */}
              <button
                onClick={onCancel}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Icon */}
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              </div>

              {/* Text */}
              <div className="space-y-1.5">
                <h2
                  id="delete-dialog-title"
                  className="text-base font-bold text-foreground"
                >
                  {title}
                </h2>
                <p
                  id="delete-dialog-description"
                  className="text-sm text-muted-foreground leading-relaxed"
                >
                  {description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-1">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={isPending}
                  id="delete-dialog-cancel"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={onConfirm}
                  disabled={isPending}
                  id="delete-dialog-confirm"
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  {isPending ? "Deleting…" : "Delete"}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
