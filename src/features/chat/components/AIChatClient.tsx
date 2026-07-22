"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ChatSidebar } from "./ChatSidebar";
import { ChatHeader } from "./ChatHeader";
import { ChatWindow } from "./ChatWindow";
import { ChatInput } from "./ChatInput";
import { RenameConversationDialog } from "./RenameConversationDialog";
import { DeleteConversationDialog } from "./DeleteConversationDialog";
import {
  useChatMessages,
  useSendMessage,
  useRenameConversation,
  useDeleteConversation,
} from "../hooks/useChat";
import { Button } from "@/components/ui/button";
import type { Conversation, ChatMessage, SendMessageResponse } from "@/types/chat";

interface AIChatClientProps {
  /** Pre-select a conversation from the URL (e.g. /chat/[id]) */
  initialConversationId?: string;
}

/**
 * Root orchestrator for the AI Chat module.
 * Handles:
 * - Active conversation state
 * - Optimistic user message display before backend responds
 * - Sidebar open/close on desktop and mobile drawer
 * - Rename / Delete dialog lifecycle
 * - Send message flow (new & existing conversations)
 */
export function AIChatClient({ initialConversationId }: AIChatClientProps) {
  // ── Active conversation ──────────────────────────────────────────────────
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    initialConversationId ?? null
  );
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  // ── Layout state ─────────────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // ── Message draft ────────────────────────────────────────────────────────
  const [draft, setDraft] = useState("");

  // ── Optimistic messages (user message shown immediately) ─────────────────
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>([]);

  // ── Suggested questions from last AI response ──────────────────────────
  const [lastSuggestedQuestions, setLastSuggestedQuestions] = useState<string[]>([]);

  // ── Dialog state ─────────────────────────────────────────────────────────
  const [renameTarget, setRenameTarget] = useState<Conversation | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Conversation | null>(null);

  // ── Data hooks ────────────────────────────────────────────────────────────
  const {
    data: serverMessages = [],
    isLoading: messagesLoading,
    isError: messagesError,
  } = useChatMessages(activeConversationId);

  const { mutate: sendMsg, isPending: isSending } = useSendMessage();
  const { mutate: rename, isPending: isRenaming } = useRenameConversation();
  const { mutate: deleteConv, isPending: isDeleting } = useDeleteConversation();

  // Merge server messages + optimistic messages, deduplicating by _id
  const allMessages: ChatMessage[] = [...serverMessages];
  for (const opt of optimisticMessages) {
    if (!allMessages.find((m) => m._id === opt._id)) {
      allMessages.push(opt);
    }
  }

  // Clear optimistic messages once server messages update
  useEffect(() => {
    if (serverMessages.length > 0 && optimisticMessages.length > 0) {
      setOptimisticMessages([]);
    }
  }, [serverMessages.length]);

  // ── Send message ──────────────────────────────────────────────────────────
  const handleSend = useCallback(
    (text: string, file?: File) => {
      const trimmed = text.trim();
      if ((!trimmed && !file) || isSending) return;

      setDraft("");
      setLastSuggestedQuestions([]);

      // Optimistic user message
      const optimisticUserMsg: ChatMessage = {
        _id: `opt-${Date.now()}`,
        userId: "",
        conversationId: activeConversationId ?? "",
        role: "User",
        message: trimmed || `[Attached File: ${file?.name}]`,
        attachment: file ? { fileName: file.name, fileType: file.type } : undefined,
        tokens: 0,
        createdAt: new Date().toISOString(),
      };
      setOptimisticMessages((prev) => [...prev, optimisticUserMsg]);

      sendMsg(
        {
          message: trimmed || `Please read and analyze the attached file: ${file?.name}`,
          conversationId: activeConversationId ?? undefined,
          file,
        },
        {
          onSuccess: (data: SendMessageResponse) => {
            // If this was a new conversation, set it as active
            if (!activeConversationId) {
              setActiveConversationId(data.conversation._id);
            }
            setActiveConversation(data.conversation);
            setLastSuggestedQuestions(data.suggestedQuestions);
            setOptimisticMessages([]);
          },
          onError: () => {
            // Remove optimistic message on error
            setOptimisticMessages([]);
          },
        }
      );
    },
    [activeConversationId, isSending, sendMsg]
  );

  function handleSuggestionClick(question: string) {
    handleSend(question);
  }

  function handleNewConversation() {
    setActiveConversationId(null);
    setActiveConversation(null);
    setOptimisticMessages([]);
    setLastSuggestedQuestions([]);
    setDraft("");
    setMobileDrawerOpen(false);
  }

  function handleSelectConversation(id: string) {
    setActiveConversationId(id);
    setOptimisticMessages([]);
    setLastSuggestedQuestions([]);
    setDraft("");
    setMobileDrawerOpen(false);
  }

  // ── Rename ────────────────────────────────────────────────────────────────
  function handleRenameConfirm(conversationId: string, newTitle: string) {
    rename(
      { conversationId, body: { title: newTitle } },
      {
        onSuccess: (conv) => {
          if (activeConversation?._id === conv._id) {
            setActiveConversation(conv);
          }
          setRenameTarget(null);
        },
      }
    );
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  function handleDeleteConfirm(conversationId: string) {
    deleteConv(conversationId, {
      onSuccess: () => {
        if (activeConversationId === conversationId) {
          handleNewConversation();
        }
        setDeleteTarget(null);
      },
    });
  }

  const sidebarProps = {
    activeConversationId,
    onSelectConversation: handleSelectConversation,
    onNewConversation: handleNewConversation,
    onRenameRequest: (conv: Conversation) => setRenameTarget(conv),
    onDeleteRequest: (conv: Conversation) => setDeleteTarget(conv),
  };

  return (
    <div
      className="flex h-[calc(100vh-5rem)] overflow-hidden bg-background"
      aria-label="AI Chat Assistant"
    >
      {/* ── Desktop Sidebar ──────────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            key="desktop-sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="hidden md:block flex-shrink-0 overflow-hidden"
            aria-label="Conversation sidebar"
          >
            <ChatSidebar {...sidebarProps} className="h-full w-[280px]" />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Mobile Drawer Backdrop ───────────────────────────────────────── */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMobileDrawerOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              key="mobile-sidebar"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 md:hidden"
              aria-label="Mobile conversation sidebar"
            >
              <div className="relative h-full">
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="absolute right-3 top-3 z-10 p-1.5 rounded-lg bg-muted/80 text-muted-foreground hover:text-foreground"
                  aria-label="Close sidebar"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
                <ChatSidebar {...sidebarProps} className="h-full" />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Chat Panel ──────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <ChatHeader
          conversation={activeConversation}
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => {
            // Desktop: toggle sidebar panel
            // Mobile: toggle drawer
            if (window.innerWidth < 768) {
              setMobileDrawerOpen((v) => !v);
            } else {
              setSidebarOpen((v) => !v);
            }
          }}
          onRenameRequest={() => activeConversation && setRenameTarget(activeConversation)}
          onDeleteRequest={() => activeConversation && setDeleteTarget(activeConversation)}
          onNewConversation={handleNewConversation}
        />

        <ChatWindow
          messages={allMessages}
          isLoading={messagesLoading && Boolean(activeConversationId)}
          isError={messagesError}
          isSending={isSending}
          lastSuggestedQuestions={lastSuggestedQuestions}
          onSuggestionClick={handleSuggestionClick}
          hasConversation={Boolean(activeConversationId)}
        />

        <ChatInput
          value={draft}
          onChange={setDraft}
          onSubmit={(file?: File) => handleSend(draft, file)}
          onClear={() => setDraft("")}
          isDisabled={false}
          isSending={isSending}
        />
      </div>

      {/* ── Dialogs ────────────────────────────────────────────────────── */}
      <RenameConversationDialog
        conversation={renameTarget}
        isOpen={Boolean(renameTarget)}
        onClose={() => setRenameTarget(null)}
        onConfirm={handleRenameConfirm}
        isLoading={isRenaming}
      />
      <DeleteConversationDialog
        conversation={deleteTarget}
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}
