import type { Metadata } from "next";
import { AIGeneratorClient } from "@/features/ai/components/AIGeneratorClient";

export const metadata: Metadata = {
  title: "AI Research Generator",
  description:
    "Generate comprehensive, publication-grade research reports instantly with ResearchPilot AI powered by Google OpenAI.",
};

export default function AIGeneratorPage() {
  return <AIGeneratorClient />;
}
