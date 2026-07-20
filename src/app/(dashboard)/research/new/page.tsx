import type { Metadata } from "next";
import { ResearchCreateClient } from "@/features/research/components/ResearchCreateClient";

export const metadata: Metadata = {
  title: "Create Research",
  description: "Start a new research project.",
};

export default function ResearchNewPage() {
  return <ResearchCreateClient />;
}
