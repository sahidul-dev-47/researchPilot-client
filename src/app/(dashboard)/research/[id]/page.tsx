import type { Metadata } from "next";
import { ResearchDetailClient } from "@/features/research/components/ResearchDetailClient";

export const metadata: Metadata = {
  title: "Research Details",
  description: "View a single research project.",
};

export default async function ResearchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ResearchDetailClient id={id} />;
}
