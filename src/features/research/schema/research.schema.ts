import { z } from "zod";

/**
 * Client-side schema for the research create/edit form.
 * Mirrors the backend `createResearchValidator` (research.validator.ts).
 * Keeping both in sync prevents round-trips on avoidable validation errors.
 */
export const researchFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters long")
    .max(150, "Title must not exceed 150 characters"),
  shortDescription: z
    .string()
    .trim()
    .min(10, "Short description must be at least 10 characters long")
    .max(500, "Short description must not exceed 500 characters"),
  fullDescription: z
    .string()
    .trim()
    .min(20, "Full description must be at least 20 characters long"),
  category: z.string().trim().min(1, "Category is required"),
  researchField: z.string().trim().min(1, "Research field is required"),
  status: z.enum(["Draft", "In Progress", "Completed"]).default("Draft"),
  priority: z.enum(["Low", "Medium", "High"]).default("Medium"),
  tags: z
    .array(z.string().trim().min(1, "Tag cannot be empty"))
    .default([]),
  coverImage: z
    .string()
    .url("Cover image must be a valid URL")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  attachments: z
    .array(z.string().url("Attachment must be a valid URL"))
    .default([]),
  estimatedDuration: z
    .string()
    .trim()
    .min(1, "Estimated duration is required"),
  visibility: z.enum(["Public", "Private"]).default("Private"),
});

export type ResearchFormValues = z.infer<typeof researchFormSchema>;
export type ResearchFormInput = z.input<typeof researchFormSchema>;
