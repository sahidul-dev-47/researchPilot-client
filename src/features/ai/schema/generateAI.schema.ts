import { z } from "zod";
import {
  AI_DIFFICULTY_OPTIONS,
  AI_RESEARCH_TYPE_OPTIONS,
  AI_WRITING_STYLE_OPTIONS,
} from "@/constants";

export const generateAISchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must not exceed 150 characters"),
  topic: z
    .string()
    .trim()
    .min(5, "Topic must be at least 5 characters")
    .max(300, "Topic must not exceed 300 characters"),
  category: z.string().trim().min(1, "Category is required"),
  difficulty: z.enum(AI_DIFFICULTY_OPTIONS as unknown as [string, string, ...string[]], {
    message: "Difficulty is required",
  }),
  researchType: z.enum(AI_RESEARCH_TYPE_OPTIONS as unknown as [string, string, ...string[]], {
    message: "Research type is required",
  }),
  writingStyle: z.enum(AI_WRITING_STYLE_OPTIONS as unknown as [string, string, ...string[]], {
    message: "Writing style is required",
  }),
  minimumWords: z
    .number()
    .int()
    .min(100, "Minimum 100 words")
    .max(5000, "Maximum 5000 words"),
  additionalInstructions: z
    .string()
    .trim()
    .max(1000, "Max 1000 characters")
    .optional(),
});

export type GenerateAIFormValues = z.infer<typeof generateAISchema>;
