import type { Metadata } from "next";
import { ResearchListClient } from "@/features/research/components/ResearchListClient";

export const metadata: Metadata = {
  title: "Research Projects",
  description: "Browse and manage your AI-assisted research projects.",
};

export default function ResearchPage() {
  return <ResearchListClient />;
}
