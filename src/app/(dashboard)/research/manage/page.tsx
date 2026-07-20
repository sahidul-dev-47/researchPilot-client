import type { Metadata } from "next";
import { ResearchManageClient } from "@/features/research/components/ResearchManageClient";

export const metadata: Metadata = {
  title: "Manage Research Projects",
  description: "Edit, publish, or delete your research projects.",
};

export default function ManageResearchPage() {
  return <ResearchManageClient />;
}
