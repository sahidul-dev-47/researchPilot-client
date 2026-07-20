import type { Metadata } from "next";
import { AIChatClient } from "@/features/chat/components/AIChatClient";

export const metadata: Metadata = {
  title: "AI Chat — Conversation",
  description:
    "Continue your conversation with ResearchPilot AI.",
};

interface ConversationPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Deep-linking into a specific conversation: /chat/[id]
 * Passes the conversation ID as the initial active conversation.
 */
export default async function ConversationPage({ params }: ConversationPageProps) {
  const { id } = await params;
  return <AIChatClient initialConversationId={id} />;
}
