import type { Metadata } from "next";
import { AIResultClient } from "@/features/ai/components/AIResultClient";

export const metadata: Metadata = {
  title: "AI Research Result",
  description: "View the full AI-generated research report.",
};

interface AIResultPageProps {
  params: Promise<{ id: string }>;
}

export default async function AIResultPage({ params }: AIResultPageProps) {
  const { id } = await params;
  return <AIResultClient id={id} />;
}
