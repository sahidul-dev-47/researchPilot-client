import type { Metadata } from "next";
import { ResearchEditClient } from "@/features/research/components/ResearchEditClient";

export const metadata: Metadata = {
  title: "Edit Research",
  description: "Update an existing research project.",
};

export default async function ResearchEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ResearchEditClient id={id} />;
}
