import type { Metadata } from "next";
import { AIChatClient } from "@/features/chat/components/AIChatClient";

export const metadata: Metadata = {
  title: "AI Chat Assistant",
  description:
    "Chat with ResearchPilot AI — your expert academic research assistant powered by Google OpenAI.",
};

export default function ChatPage() {
  return <AIChatClient />;
}
