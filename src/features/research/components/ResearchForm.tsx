"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RESEARCH_STATUS_OPTIONS,
  RESEARCH_PRIORITY_OPTIONS,
  RESEARCH_VISIBILITY_OPTIONS,
} from "@/constants";
import { researchFormSchema, type ResearchFormValues, type ResearchFormInput } from "@/features/research/schema/research.schema";
import { cn } from "@/lib/utils";

interface ResearchFormProps {
  defaultValues?: Partial<ResearchFormValues>;
  isEdit?: boolean;
  isSubmitting?: boolean;
  onSubmit: (values: ResearchFormValues) => void;
}

const EMPTY_VALUES: ResearchFormInput = {
  title: "",
  shortDescription: "",
  fullDescription: "",
  category: "",
  researchField: "",
  status: "Draft",
  priority: "Medium",
  tags: [],
  coverImage: undefined,
  attachments: [],
  estimatedDuration: "",
  visibility: "Private",
};

export function ResearchForm({
  defaultValues,
  isEdit = false,
  isSubmitting = false,
  onSubmit,
}: ResearchFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ResearchFormInput>({
    resolver: zodResolver(researchFormSchema),
    defaultValues: { ...EMPTY_VALUES, ...defaultValues },
  });

  const [tagInput, setTagInput] = useState("");
  const [attachmentInput, setAttachmentInput] = useState("");
  const tags = watch("tags") ?? [];
  const attachments = watch("attachments") ?? [];

  function addTag() {
    const value = tagInput.trim();
    if (!value || tags.includes(value)) {
      setTagInput("");
      return;
    }
    setValue("tags", [...tags, value], { shouldValidate: true });
    setTagInput("");
  }

  function removeTag(tag: string) {
    setValue(
      "tags",
      tags.filter((t) => t !== tag),
      { shouldValidate: true }
    );
  }

  function addAttachment() {
    const value = attachmentInput.trim();
    if (!value || attachments.includes(value)) {
      setAttachmentInput("");
      return;
    }
    setValue("attachments", [...attachments, value], { shouldValidate: true });
    setAttachmentInput("");
  }

  function removeAttachment(url: string) {
    setValue(
      "attachments",
      attachments.filter((a) => a !== url),
      { shouldValidate: true }
    );
  }

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values as ResearchFormValues))} noValidate className="space-y-6">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="research-title">Title</Label>
        <Input
          id="research-title"
          placeholder="e.g. Neural Networks in Radiology Diagnostics"
          className={cn(errors.title && "border-destructive")}
          {...register("title")}
          aria-invalid={!!errors.title}
        />
        {errors.title && (
          <p className="text-xs text-destructive" role="alert">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Short description */}
      <div className="space-y-1.5">
        <Label htmlFor="research-short">Short description</Label>
        <Textarea
          id="research-short"
          rows={2}
          placeholder="A brief summary shown in lists and cards."
          className={cn(errors.shortDescription && "border-destructive")}
          {...register("shortDescription")}
          aria-invalid={!!errors.shortDescription}
        />
        {errors.shortDescription && (
          <p className="text-xs text-destructive" role="alert">
            {errors.shortDescription.message}
          </p>
        )}
      </div>

      {/* Full description */}
      <div className="space-y-1.5">
        <Label htmlFor="research-full">Full description</Label>
        <Textarea
          id="research-full"
          rows={6}
          placeholder="Detailed background, objectives, and methodology."
          className={cn(errors.fullDescription && "border-destructive")}
          {...register("fullDescription")}
          aria-invalid={!!errors.fullDescription}
        />
        {errors.fullDescription && (
          <p className="text-xs text-destructive" role="alert">
            {errors.fullDescription.message}
          </p>
        )}
      </div>

      {/* Category + Research field */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="research-category">Category</Label>
          <Input
            id="research-category"
            placeholder="e.g. Healthcare"
            className={cn(errors.category && "border-destructive")}
            {...register("category")}
            aria-invalid={!!errors.category}
          />
          {errors.category && (
            <p className="text-xs text-destructive" role="alert">
              {errors.category.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="research-field">Research field</Label>
          <Input
            id="research-field"
            placeholder="e.g. Machine Learning"
            className={cn(errors.researchField && "border-destructive")}
            {...register("researchField")}
            aria-invalid={!!errors.researchField}
          />
          {errors.researchField && (
            <p className="text-xs text-destructive" role="alert">
              {errors.researchField.message}
            </p>
          )}
        </div>
      </div>

      {/* Status + Priority + Visibility */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="research-status">Status</Label>
          <Select
            onValueChange={(value) =>
              setValue("status", value as ResearchFormValues["status"], {
                shouldValidate: true,
              })
            }
            defaultValue={watch("status")}
          >
            <SelectTrigger id="research-status" className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {RESEARCH_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="research-priority">Priority</Label>
          <Select
            onValueChange={(value) =>
              setValue("priority", value as ResearchFormValues["priority"], {
                shouldValidate: true,
              })
            }
            defaultValue={watch("priority")}
          >
            <SelectTrigger id="research-priority" className="w-full">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {RESEARCH_PRIORITY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="research-visibility">Visibility</Label>
          <Select
            onValueChange={(value) =>
              setValue("visibility", value as ResearchFormValues["visibility"], {
                shouldValidate: true,
              })
            }
            defaultValue={watch("visibility")}
          >
            <SelectTrigger id="research-visibility" className="w-full">
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              {RESEARCH_VISIBILITY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Estimated duration */}
      <div className="space-y-1.5">
        <Label htmlFor="research-duration">Estimated duration</Label>
        <Input
          id="research-duration"
          placeholder="e.g. 3 months"
          className={cn(errors.estimatedDuration && "border-destructive")}
          {...register("estimatedDuration")}
          aria-invalid={!!errors.estimatedDuration}
        />
        {errors.estimatedDuration && (
          <p className="text-xs text-destructive" role="alert">
            {errors.estimatedDuration.message}
          </p>
        )}
      </div>

      {/* Cover image */}
      <div className="space-y-1.5">
        <Label htmlFor="research-cover">Cover image URL (optional)</Label>
        <Input
          id="research-cover"
          type="url"
          placeholder="https://..."
          className={cn(errors.coverImage && "border-destructive")}
          {...register("coverImage")}
          aria-invalid={!!errors.coverImage}
        />
        {errors.coverImage && (
          <p className="text-xs text-destructive" role="alert">
            {errors.coverImage.message}
          </p>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <Label htmlFor="research-tag-input">Tags</Label>
        <div className="flex gap-2">
          <Input
            id="research-tag-input"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag and press Enter"
          />
          <Button type="button" variant="outline" onClick={addTag} className="shrink-0">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-foreground"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  aria-label={`Remove tag ${tag}`}
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        )}
        {errors.tags && (
          <p className="text-xs text-destructive" role="alert">
            {errors.tags.message as string}
          </p>
        )}
      </div>

      {/* Attachments */}
      <div className="space-y-1.5">
        <Label htmlFor="research-attachment-input">Attachments (URLs, optional)</Label>
        <div className="flex gap-2">
          <Input
            id="research-attachment-input"
            value={attachmentInput}
            onChange={(e) => setAttachmentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addAttachment();
              }
            }}
            placeholder="https://... (press Enter to add)"
            className={cn(errors.attachments && "border-destructive")}
          />
          <Button
            type="button"
            variant="outline"
            onClick={addAttachment}
            className="shrink-0"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add
          </Button>
        </div>
        {attachments.length > 0 && (
          <ul className="space-y-1.5 pt-1">
            {attachments.map((url) => (
              <li
                key={url}
                className="flex items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2 text-sm"
              >
                <span className="truncate text-muted-foreground">{url}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(url)}
                  className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  aria-label={`Remove attachment ${url}`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
        {errors.attachments && (
          <p className="text-xs text-destructive" role="alert">
            {errors.attachments.message as string}
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="submit"
          className="gradient-primary border-0 text-white hover:opacity-90"
          disabled={isSubmitting}
          id={isEdit ? "research-update-btn" : "research-create-btn"}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
          {isEdit ? "Save Changes" : "Create Research"}
        </Button>
      </div>
    </form>
  );
}
