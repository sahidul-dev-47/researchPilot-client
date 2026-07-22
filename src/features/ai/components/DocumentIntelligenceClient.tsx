"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  UploadCloud,
  X,
  Sparkles,
  Download,
  CheckCircle2,
  FileCheck,
  Table as TableIcon,
  ListTodo,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeDocument } from "@/services/api/ai.service";
import type { DocIntelligenceResult } from "@/types/ai";
import { toast } from "sonner";
import { MarkdownRenderer } from "./MarkdownRenderer";

export function DocumentIntelligenceClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<DocIntelligenceResult | null>(null);
  const [completedItems, setCompletedItems] = useState<Record<number, boolean>>({});

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error("Please select a document file to analyze.");
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (customPrompt.trim()) {
        formData.append("customPrompt", customPrompt.trim());
      }

      const res = await analyzeDocument(formData);
      setResult(res);
      toast.success("Document intelligence analysis complete!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to process document.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;

    let content = `# Document Intelligence Report: ${result.documentTitle}\n\n`;
    content += `**File Type:** ${result.fileType}\n`;
    content += `**AI Model:** ${result.model}\n\n`;
    content += `--- \n\n## 📝 Executive Summary\n\n${result.summary}\n\n`;

    if (result.keyPoints.length > 0) {
      content += `## 🎯 Key Points\n\n`;
      result.keyPoints.forEach((kp) => {
        content += `- ${kp}\n`;
      });
      content += `\n`;
    }

    if (result.tables.length > 0) {
      content += `## 📊 Table Extraction\n\n`;
      result.tables.forEach((tbl) => {
        content += `${tbl}\n\n`;
      });
    }

    if (result.actionItems.length > 0) {
      content += `## ✅ Action Items\n\n`;
      result.actionItems.forEach((act) => {
        content += `- [ ] ${act}\n`;
      });
      content += `\n`;
    }

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${result.documentTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}_summary.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Summary downloaded as Markdown file.");
  };

  const toggleActionItem = (index: number) => {
    setCompletedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="space-y-8">
      {/* Header Info Banner */}
      <div className="rounded-2xl gradient-primary-subtle p-6 border border-primary/20 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                AI Powered
              </span>
              <span className="text-xs text-muted-foreground">Supports PDF, DOCX, TXT & Images</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              AI Document Intelligence
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Upload complex research documents, reports, or articles for instant executive summarization, key point extraction, table parsing, and action item generation.
            </p>
          </div>
        </div>
      </div>

      {/* Upload & Setup Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dropzone & Inputs */}
        <div className="lg:col-span-7 space-y-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 rounded-2xl p-8 text-center glass transition-all cursor-pointer group relative overflow-hidden"
          >
            <input
              type="file"
              accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.webp"
              onChange={handleFileSelect}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              id="document-file-input"
            />
            {selectedFile ? (
              <div className="flex items-center justify-between p-4 bg-muted/60 rounded-xl border border-border">
                <div className="flex items-center gap-3 text-left">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground truncate max-w-[240px] sm:max-w-xs">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type || "Document"}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="z-20 hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-3 py-4">
                <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Drag and drop your document here, or <span className="text-primary underline">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports PDF, DOCX, TXT, PNG, JPG (up to 10MB)
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Custom Prompt or Specific Focus (Optional)
            </label>
            <Textarea
              placeholder="e.g. Focus on extracting key financial metrics and bullet points on methodology..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="rounded-xl border-border resize-none h-20 text-sm"
            />
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!selectedFile || isProcessing}
            className="w-full h-12 rounded-xl gradient-primary text-white font-semibold shadow-lg shadow-primary/20 hover:opacity-95 transition-opacity"
            id="analyze-document-btn"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing Document Intelligence...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Analyze Document & Extract Insights
              </>
            )}
          </Button>
        </div>

        {/* Feature Capabilities Quick Cards */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          <div className="p-4 rounded-xl border border-border bg-card/50 flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
              <FileCheck className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Executive Summarization</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Generates a clean abstract summarizing core findings and key context.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card/50 flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Key Point Extraction</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Identifies top takeaways and key arguments automatically.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card/50 flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 mt-0.5">
              <TableIcon className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Table Extraction</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Parses embedded tabular data into Markdown structured tables.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card/50 flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
              <ListTodo className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Action Item Generation</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Lists interactive tasks and next steps extracted from the text.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Loader State */}
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
              <h3 className="text-lg font-bold text-foreground">Parsing & Extracting Document Insights...</h3>
              <p className="text-sm text-muted-foreground mt-1">
                OpenRouter AI models are processing text, parsing structure, and extracting key points.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Results View */}
      {result && !isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass border border-border">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  {result.fileType}
                </span>
                <span className="text-xs text-muted-foreground">Model: {result.model}</span>
                <span className="text-xs text-muted-foreground">Tokens: {result.tokensUsed}</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mt-1.5">{result.documentTitle}</h3>
            </div>

            <Button
              onClick={handleDownload}
              variant="outline"
              className="rounded-xl border-primary/30 text-primary hover:bg-primary/10 flex items-center gap-2 self-start sm:self-auto"
              id="download-summary-btn"
            >
              <Download className="h-4 w-4" />
              Download Summary
            </Button>
          </div>

          {/* Main Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Executive Summary */}
            <div className="lg:col-span-8 space-y-6">
              <div className="p-6 rounded-2xl glass border border-border space-y-3">
                <div className="flex items-center gap-2 text-foreground font-bold text-lg border-b border-border/50 pb-3">
                  <FileText className="h-5 w-5 text-primary" />
                  Executive Summary
                </div>
                <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-foreground/90">
                  <MarkdownRenderer content={result.summary} />
                </div>
              </div>

              {/* Table Extraction */}
              {result.tables && result.tables.length > 0 && (
                <div className="p-6 rounded-2xl glass border border-border space-y-4">
                  <div className="flex items-center gap-2 text-foreground font-bold text-lg border-b border-border/50 pb-3">
                    <TableIcon className="h-5 w-5 text-purple-500" />
                    Table Extraction
                  </div>
                  {result.tables.map((tableMarkdown, idx) => (
                    <div key={idx} className="overflow-x-auto rounded-xl border border-border p-4 bg-muted/30">
                      <MarkdownRenderer content={tableMarkdown} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Side Column: Key Points & Action Items */}
            <div className="lg:col-span-4 space-y-6">
              {/* Key Points */}
              {result.keyPoints && result.keyPoints.length > 0 && (
                <div className="p-6 rounded-2xl glass border border-border space-y-4">
                  <div className="flex items-center gap-2 text-foreground font-bold text-lg border-b border-border/50 pb-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    Key Points
                  </div>
                  <ul className="space-y-2.5">
                    {result.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-foreground/90 leading-relaxed">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Items */}
              {result.actionItems && result.actionItems.length > 0 && (
                <div className="p-6 rounded-2xl glass border border-border space-y-4">
                  <div className="flex items-center gap-2 text-foreground font-bold text-lg border-b border-border/50 pb-3">
                    <ListTodo className="h-5 w-5 text-amber-500" />
                    Action Items
                  </div>
                  <div className="space-y-2">
                    {result.actionItems.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleActionItem(idx)}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          completedItems[idx]
                            ? "bg-emerald-500/10 border-emerald-500/30 text-muted-foreground line-through"
                            : "bg-muted/40 border-border text-foreground hover:bg-muted/80"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={!!completedItems[idx]}
                          onChange={() => {}}
                          className="mt-0.5 rounded border-muted-foreground text-primary focus:ring-primary"
                        />
                        <span className="text-xs font-medium leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
