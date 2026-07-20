import type { Metadata } from "next";
import { ResearchMyClient } from "@/features/research/components/ResearchMyClient";

export const metadata: Metadata = {
  title: "My Research Projects",
  description: "View and filter research projects authored by you.",
};

export default function MyResearchPage() {
  return <ResearchMyClient />;
}
