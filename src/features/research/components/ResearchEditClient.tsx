"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { ResearchForm } from "@/features/research/components/ResearchForm";
import { useResearch, useUpdateResearch } from "@/features/research/hooks/useResearch";
import { EmptyState } from "@/components/common/EmptyState";
import { ROUTES } from "@/constants";
import type { ResearchFormValues } from "@/features/research/schema/research.schema";

export function ResearchEditClient({ id }: { id: string }) {
  const router = useRouter();
  const { data: research, isLoading, isError } = useResearch(id);
  const updateMutation = useUpdateResearch(id);

  function onSubmit(values: ResearchFormValues) {
    updateMutation.mutate(values, {
      onSuccess: () => {
        router.push(`/research/${id}`);
      },
    });
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  if (isError || !research) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          title="Research not found"
          description="This project may have been removed or is private."
          action={{ label: "Back to Research", href: ROUTES.research }}
        />
      </div>
    );
  }

  const defaultValues: Partial<ResearchFormValues> = {
    title: research.title,
    shortDescription: research.shortDescription,
    fullDescription: research.fullDescription,
    category: research.category,
    researchField: research.researchField,
    status: research.status,
    priority: research.priority,
    tags: research.tags,
    coverImage: research.coverImage,
    attachments: research.attachments,
    estimatedDuration: research.estimatedDuration,
    visibility: research.visibility,
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href={`/research/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Research
      </Link>

      <div className="mt-4 mb-8 space-y-2">
        <h1 className="heading-md text-foreground">Edit Research Project</h1>
        <p className="text-sm text-muted-foreground">
          Update the details for &ldquo;{research.title}&rdquo;.
        </p>
      </div>

      <ResearchForm
        key={research._id}
        defaultValues={defaultValues}
        isEdit
        isSubmitting={updateMutation.isPending}
        onSubmit={onSubmit}
      />
    </div>
  );
}
