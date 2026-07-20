"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ResearchForm } from "@/features/research/components/ResearchForm";
import { useCreateResearch } from "@/features/research/hooks/useResearch";
import { ROUTES } from "@/constants";
import type { ResearchFormValues } from "@/features/research/schema/research.schema";

export function ResearchCreateClient() {
  const router = useRouter();
  const createMutation = useCreateResearch();

  function onSubmit(values: ResearchFormValues) {
    createMutation.mutate(values, {
      onSuccess: (data) => {
        router.push(`/research/${data._id}`);
      },
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href={ROUTES.research}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Research
      </Link>

      <div className="mt-4 mb-8 space-y-2">
        <h1 className="heading-md text-foreground">Create Research Project</h1>
        <p className="text-sm text-muted-foreground">
          Fill in the details below to start a new research project.
        </p>
      </div>

      <ResearchForm
        onSubmit={onSubmit}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}
