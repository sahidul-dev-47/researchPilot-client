import { PaginationParams } from "./api";

// ─── Message Role ─────────────────────────────────────────────────────────
export type ChatRole = "User" | "Assistant";

// ─── Conversation ─────────────────────────────────────────────────────────
export interface Conversation {
  _id: string;
  userId: string;
  title: string;
  lastMessage?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Chat Message ─────────────────────────────────────────────────────────
export interface ChatMessage {
  _id: string;
  userId: string;
  conversationId: string;
  role: ChatRole;
  message: string;
  attachment?: {
    fileName: string;
    fileType: string;
  };
  researchId?: string;
  tokens: number;
  createdAt: string;
}

// ─── Send Message Input (matches backend sendMessageValidator) ────────────
export interface SendMessageInput {
  message: string;
  conversationId?: string;
  researchId?: string;
  regenerate?: boolean;
  file?: File;
}

// ─── Send Message Response ────────────────────────────────────────────────
export interface SendMessageResponse {
  message: ChatMessage;
  conversation: Conversation;
  suggestedQuestions: string[];
}

// ─── Rename Conversation Input ────────────────────────────────────────────
export interface RenameConversationInput {
  title: string;
}

// ─── Conversation Query Params ────────────────────────────────────────────
export interface ConversationQueryParams extends PaginationParams {
  searchTerm?: string;
}
