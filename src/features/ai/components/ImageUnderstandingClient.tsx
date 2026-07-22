"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon,
  UploadCloud,
  X,
  Sparkles,
  Eye,
  Tag,
  Receipt,
  Leaf,
  Monitor,
  HelpCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeImage } from "@/services/api/ai.service";
import type { ImageAnalysisType, ImageUnderstandingResult } from "@/types/ai";
import { toast } from "sonner";
import { MarkdownRenderer } from "./MarkdownRenderer";

const ANALYSIS_PRESETS: Array<{
  id: ImageAnalysisType;
  label: string;
  description: string;
  icon: any;
  color: string;
}> = [
  {
    id: "general",
    label: "General Vision",
    description: "Full visual analysis of image content",
    icon: Sparkles,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  },
  {
    id: "captioning",
    label: "Image Captioning",
    description: "Detailed description & summary",
    icon: Eye,
    color: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  },
  {
    id: "object_recognition",
    label: "Object Recognition",
    description: "Identify all items & objects",
    icon: Tag,
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  },
  {
    id: "receipt_analysis",
    label: "Receipt Analysis",
    description: "Extract items, total, tax & merchant",
    icon: Receipt,
    color: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  },
  {
    id: "plant_identification",
    label: "Plant Identification",
    description: "Species, care & plant health",
    icon: Leaf,
    color: "bg-green-500/10 text-green-500 border-green-500/30",
  },
  {
    id: "ui_explanation",
    label: "UI Screenshot",
    description: "UX analysis & layout breakdown",
    icon: Monitor,
    color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/30",
  },
];

export function ImageUnderstandingClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<ImageAnalysisType>("general");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ImageUnderstandingResult | null>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error("Please upload an image to analyze.");
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("analysisType", analysisType);
      if (customPrompt.trim()) {
        formData.append("prompt", customPrompt.trim());
      }

      const res = await analyzeImage(formData);
      setResult(res);
      toast.success("Multimodal image analysis completed!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to analyze image.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Info Banner */}
      <div className="rounded-2xl gradient-primary-subtle p-6 border border-primary/20 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                Multimodal AI Vision
              </span>
              <span className="text-xs text-muted-foreground">Powered by OpenRouter Vision Models</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              AI Image Understanding
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Upload images for deep visual analysis: receipt auditing, object detection, plant species identification, or UI screenshot evaluation.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Category Pills */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 block">
          Select Analysis Mode
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ANALYSIS_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isSelected = analysisType === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setAnalysisType(preset.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-md shadow-primary/10 ring-2 ring-primary/20"
                    : "border-border bg-card/60 hover:bg-muted/80"
                }`}
                id={`preset-${preset.id}`}
              >
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-2 border ${preset.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{preset.label}</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{preset.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload & Preview Dropzone */}
        <div className="lg:col-span-6 space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 rounded-2xl p-6 text-center glass transition-all cursor-pointer relative overflow-hidden min-h-[220px] flex flex-col items-center justify-center"
          >
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              id="image-file-input"
            />
            {previewUrl ? (
              <div className="relative group w-full flex flex-col items-center">
                <img
                  src={previewUrl}
                  alt="Uploaded preview"
                  className="max-h-56 rounded-xl object-contain shadow-md border border-border"
                />
                <div className="mt-3 flex items-center justify-between w-full px-2">
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {selectedFile?.name}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="z-20 text-xs text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileChange(null);
                    }}
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Remove Image
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 py-4">
                <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Upload image for AI analysis
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports PNG, JPG, WEBP (up to 10MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Prompt & Submit */}
        <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Specific Question or Prompt (Optional)
            </label>
            <Textarea
              placeholder="e.g. What is the total price on this receipt? Is this plant healthy? How can I improve this UI layout?"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="rounded-xl border-border resize-none h-32 text-sm"
            />
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!selectedFile || isProcessing}
            className="w-full h-12 rounded-xl gradient-primary text-white font-semibold shadow-lg shadow-primary/20 hover:opacity-95 transition-opacity mt-auto"
            id="analyze-image-btn"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Image Vision...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Analyze Image with Multimodal AI
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Loading indicator */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-8 rounded-2xl glass border border-primary/20 text-center space-y-4"
          >
            <div className="mx-auto h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center text-white shadow-lg animate-pulse">
              <Sparkles className="h-7 w-7 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Running Multimodal Vision Models...</h3>
              <p className="text-sm text-muted-foreground mt-1">
                OpenRouter vision model is examining pixels, identifying objects, and generating visual insights.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Presentation */}
      {result && !isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Header Bar */}
          <div className="p-6 rounded-2xl glass border border-border">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase">
                {result.analysisType} Mode
              </span>
              <span className="text-xs text-muted-foreground">Model: {result.model}</span>
              <span className="text-xs text-muted-foreground">Tokens: {result.tokensUsed}</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">{result.title}</h3>
            {result.caption && (
              <p className="text-sm text-muted-foreground mt-2 italic bg-muted/40 p-3 rounded-xl border border-border">
                "{result.caption}"
              </p>
            )}
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <div className="p-6 rounded-2xl glass border border-border space-y-4">
                <h4 className="text-lg font-bold text-foreground border-b border-border/50 pb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Detailed Visual Explanation
                </h4>
                <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-foreground/90">
                  <MarkdownRenderer content={result.detailedAnalysis} />
                </div>
              </div>
            </div>

            {/* Side Column: Detected Items, Metadata, Recommendations */}
            <div className="lg:col-span-4 space-y-6">
              {/* Detected Items */}
              {result.detectedItems && result.detectedItems.length > 0 && (
                <div className="p-6 rounded-2xl glass border border-border space-y-3">
                  <h4 className="text-sm font-bold text-foreground border-b border-border/50 pb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-emerald-500" />
                    Detected Objects & Tags
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.detectedItems.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-muted border border-border text-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Metadata Table */}
              {result.keyMetadata && Object.keys(result.keyMetadata).length > 0 && (
                <div className="p-6 rounded-2xl glass border border-border space-y-3">
                  <h4 className="text-sm font-bold text-foreground border-b border-border/50 pb-2 flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-amber-500" />
                    Extracted Metadata
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(result.keyMetadata).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-center text-xs py-1 border-b border-border/40 last:border-0">
                        <span className="font-semibold text-muted-foreground">{key}</span>
                        <span className="font-medium text-foreground text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="p-6 rounded-2xl glass border border-border space-y-3">
                  <h4 className="text-sm font-bold text-foreground border-b border-border/50 pb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                    AI Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-foreground/90">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
