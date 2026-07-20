"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { RefreshCw, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { GenerateButton } from "./GenerateButton";
import { generateAISchema, type GenerateAIFormValues } from "../schema/generateAI.schema";
import {
  AI_DIFFICULTY_OPTIONS,
  AI_RESEARCH_TYPE_OPTIONS,
  AI_WRITING_STYLE_OPTIONS,
} from "@/constants";
import { cn } from "@/lib/utils";
import type { GenerateResearchInput } from "@/types/ai";

const WORD_COUNT_OPTIONS = [
  { label: "Short (~500 words)", value: 500 },
  { label: "Medium (~1000 words)", value: 1000 },
  { label: "Standard (~2000 words)", value: 2000 },
  { label: "Long (~3000 words)", value: 3000 },
  { label: "Extended (~5000 words)", value: 5000 },
] as const;

const CATEGORY_OPTIONS = [
  "Computer Science",
  "Artificial Intelligence",
  "Data Science",
  "Biotechnology",
  "Medicine & Health",
  "Environmental Science",
  "Social Sciences",
  "Business & Economics",
  "Physics",
  "Mathematics",
  "Engineering",
  "Psychology",
  "Education",
  "History",
  "Literature",
  "Other",
] as const;

interface AIGeneratorFormProps {
  onSubmit: (values: GenerateResearchInput) => void;
  onRegenerate?: () => void;
  isGenerating: boolean;
  hasResult: boolean;
  canRegenerate: boolean;
}

/**
 * AI Generator form using React Hook Form + Zod.
 * All fields validated before submission.
 */
export function AIGeneratorForm({
  onSubmit,
  onRegenerate,
  isGenerating,
  hasResult,
  canRegenerate,
}: AIGeneratorFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GenerateAIFormValues>({
    resolver: zodResolver(generateAISchema),
    defaultValues: {
      title: "",
      topic: "",
      category: "",
      difficulty: undefined,
      researchType: undefined,
      writingStyle: undefined,
      minimumWords: 2000,
      additionalInstructions: "",
    },
  });

  const minimumWords = watch("minimumWords");

  function handleFormSubmit(values: GenerateAIFormValues) {
    onSubmit(values as GenerateResearchInput);
  }

  function handleClear() {
    reset();
  }

  const fieldError = (msg?: string) =>
    msg ? <p className="text-xs text-destructive mt-1" role="alert">{msg}</p> : null;

  const labelWithTip = (label: string, tip?: string) => (
    <div className="flex items-center gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {tip && (
        <Tooltip>
          <TooltipTrigger className="inline-flex items-center justify-center p-0 bg-transparent border-0 text-muted-foreground hover:text-foreground cursor-help" type="button">
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-xs">{tip}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );

  const inputClass = (hasErr?: boolean) =>
    cn("h-9 text-sm", hasErr && "border-destructive focus-visible:ring-destructive/50");

  return (
    <motion.form
      onSubmit={handleSubmit(handleFormSubmit)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
      aria-label="AI research generator form"
      noValidate
    >
      {/* Research Title */}
      <div className="space-y-1">
        <Label htmlFor="ai-title">{labelWithTip("Research Title", "A clear, concise title for your research report.")}</Label>
        <Input
          id="ai-title"
          placeholder="e.g. Impact of LLMs on Modern Software Engineering"
          className={inputClass(!!errors.title)}
          disabled={isGenerating}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "ai-title-err" : undefined}
          {...register("title")}
        />
        <div id="ai-title-err">{fieldError(errors.title?.message)}</div>
      </div>

      {/* Research Topic */}
      <div className="space-y-1">
        <Label htmlFor="ai-topic">{labelWithTip("Research Topic", "Describe what specific aspects you want to explore in depth.")}</Label>
        <textarea
          id="ai-topic"
          placeholder="Provide a detailed description of your research focus, key questions, and scope…"
          className={cn(
            "w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[80px] resize-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "placeholder:text-muted-foreground disabled:opacity-50",
            errors.topic && "border-destructive"
          )}
          disabled={isGenerating}
          aria-invalid={!!errors.topic}
          aria-describedby={errors.topic ? "ai-topic-err" : undefined}
          {...register("topic")}
        />
        <div id="ai-topic-err">{fieldError(errors.topic?.message)}</div>
      </div>

      {/* Row: Category + Difficulty */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Category */}
        <div className="space-y-1">
          <Label htmlFor="ai-category">Category</Label>
          <Select
            disabled={isGenerating}
            onValueChange={(v) => setValue("category", v as string, { shouldValidate: true })}
          >
            <SelectTrigger id="ai-category" className={inputClass(!!errors.category)} aria-invalid={!!errors.category}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldError(errors.category?.message)}
        </div>

        {/* Difficulty */}
        <div className="space-y-1">
          <Label htmlFor="ai-difficulty">Difficulty</Label>
          <Select
            disabled={isGenerating}
            onValueChange={(v) => setValue("difficulty", v as GenerateAIFormValues["difficulty"], { shouldValidate: true })}
          >
            <SelectTrigger id="ai-difficulty" className={inputClass(!!errors.difficulty)} aria-invalid={!!errors.difficulty}>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {AI_DIFFICULTY_OPTIONS.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldError(errors.difficulty?.message)}
        </div>
      </div>

      {/* Row: Research Type + Writing Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Research Type */}
        <div className="space-y-1">
          <Label htmlFor="ai-research-type">Research Type</Label>
          <Select
            disabled={isGenerating}
            onValueChange={(v) => setValue("researchType", v as GenerateAIFormValues["researchType"], { shouldValidate: true })}
          >
            <SelectTrigger id="ai-research-type" className={inputClass(!!errors.researchType)} aria-invalid={!!errors.researchType}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {AI_RESEARCH_TYPE_OPTIONS.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldError(errors.researchType?.message)}
        </div>

        {/* Writing Style */}
        <div className="space-y-1">
          <Label htmlFor="ai-writing-style">Writing Style</Label>
          <Select
            disabled={isGenerating}
            onValueChange={(v) => setValue("writingStyle", v as GenerateAIFormValues["writingStyle"], { shouldValidate: true })}
          >
            <SelectTrigger id="ai-writing-style" className={inputClass(!!errors.writingStyle)} aria-invalid={!!errors.writingStyle}>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {AI_WRITING_STYLE_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldError(errors.writingStyle?.message)}
        </div>
      </div>

      {/* Expected Length */}
      <div className="space-y-1">
        <Label htmlFor="ai-words">
          {labelWithTip("Expected Length", "Minimum word count for the generated report. Larger reports take longer.")}
        </Label>
        <div className="flex items-center gap-3">
          <Select
            value={String(minimumWords)}
            disabled={isGenerating}
            onValueChange={(v) => setValue("minimumWords", Number(v as string), { shouldValidate: true })}
          >
            <SelectTrigger id="ai-words" className={cn("flex-1", inputClass(!!errors.minimumWords))}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WORD_COUNT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            ~{minimumWords.toLocaleString()} words
          </span>
        </div>
        {fieldError(errors.minimumWords?.message)}
      </div>

      {/* Additional Instructions */}
      <div className="space-y-1">
        <Label htmlFor="ai-instructions">
          {labelWithTip("Additional Instructions", "Optional extra context or specific requirements for the report.")}
        </Label>
        <textarea
          id="ai-instructions"
          placeholder="e.g. Include a section comparing Python vs. Rust implementations, focus on performance benchmarks…"
          className={cn(
            "w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[64px] resize-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "placeholder:text-muted-foreground disabled:opacity-50",
            errors.additionalInstructions && "border-destructive"
          )}
          disabled={isGenerating}
          {...register("additionalInstructions")}
        />
        {fieldError(errors.additionalInstructions?.message)}
      </div>

      {/* Buttons */}
      <div className="space-y-2 pt-1">
        <GenerateButton isGenerating={isGenerating} />

        <div className="flex gap-2">
          {canRegenerate && onRegenerate && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              disabled={isGenerating}
              id="regenerate-btn"
              aria-label="Regenerate with same settings"
              className="flex-1 h-9 gap-1.5 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Regenerate
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={isGenerating}
            id="clear-form-btn"
            aria-label="Clear form"
            className="flex-1 h-9 gap-1.5 text-xs text-muted-foreground"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Clear Form
          </Button>
        </div>
      </div>
    </motion.form>
  );
}
