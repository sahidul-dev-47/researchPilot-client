"use client";

import {
  useRef,
  useEffect,
  useCallback,
  useState,
  type KeyboardEvent,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Trash2, Loader2, Paperclip, X, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (file?: File) => void;
  onClear: () => void;
  isDisabled?: boolean;
  isSending?: boolean;
  placeholder?: string;
}

/**
 * Auto-resizing multiline textarea chat input with File & Document upload support.
 * Allows attaching PDF, DOCX, TXT, and Images directly into chat.
 */
export function ChatInput({
  value,
  onChange,
  onSubmit,
  onClear,
  isDisabled = false,
  isSending = false,
  placeholder = "Ask ResearchPilot AI anything or upload a document…",
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

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

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if ((value.trim() || attachedFile) && !isDisabled && !isSending) {
        onSubmit(attachedFile || undefined);
        setAttachedFile(null);
      }
    }
  }

  function handleSubmitForm(e: FormEvent) {
    e.preventDefault();
    if ((value.trim() || attachedFile) && !isDisabled && !isSending) {
      onSubmit(attachedFile || undefined);
      setAttachedFile(null);
    }
  }

  const canSend = (value.trim().length > 0 || attachedFile !== null) && !isDisabled && !isSending;

  return (
    <form
      onSubmit={handleSubmitForm}
      className="px-4 py-3 border-t bg-background space-y-2"
      aria-label="Chat message input"
    >
      {/* Attached File Preview Badge */}
      <AnimatePresence>
        {attachedFile && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center justify-between p-2 rounded-xl bg-primary/10 border border-primary/20 text-xs"
          >
            <div className="flex items-center gap-2 truncate">
              {attachedFile.type.startsWith("image/") ? (
                <ImageIcon className="h-4 w-4 text-purple-500 shrink-0" />
              ) : (
                <FileText className="h-4 w-4 text-blue-500 shrink-0" />
              )}
              <span className="font-semibold text-foreground truncate max-w-[240px]">
                {attachedFile.name}
              </span>
              <span className="text-muted-foreground text-[10px]">
                ({(attachedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-destructive"
              onClick={() => setAttachedFile(null)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={cn(
          "flex items-end gap-2 rounded-2xl border bg-card px-3 py-2 shadow-sm",
          "focus-within:ring-2 focus-within:ring-ring focus-within:border-primary/50",
          "transition-all duration-150"
        )}
      >
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.webp"
          onChange={handleFileSelect}
          className="hidden"
          id="chat-file-upload-input"
        />

        {/* Paperclip Upload Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isDisabled || isSending}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/80 pb-1"
          aria-label="Attach document or image"
          id="chat-attach-btn"
        >
          <Paperclip className="h-4 w-4" />
        </Button>

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
        <kbd className="font-mono">Shift + Enter</kbd> for new line · Attach PDF, DOCX, TXT or Images
      </p>
    </form>
  );
}
