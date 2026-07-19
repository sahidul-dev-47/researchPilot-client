import { PaginationParams, SortParam } from "./api";

// ─── AI Research History Entry ────────────────────────────────────────────
export interface AIResearch {
  _id: string;
  researchId?: string;
  userId: string;
  prompt: string;
  generatedTitle: string;
  generatedContent: string;
  summary: string;
  keywords: string[];
  references: string[];
  model: string;
  tokensUsed: number;
  generationTime: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Generate Input (matches backend generateResearchValidator) ───────────
export interface GenerateResearchInput {
  title: string;
  topic: string;
  category: string;
  difficulty: string;
  researchType: string;
  writingStyle: string;
  minimumWords: number;
  additionalInstructions?: string;
  researchId?: string;
}

// ─── Regenerate Input ─────────────────────────────────────────────────────
export interface RegenerateResearchInput {
  historyId: string;
}

// ─── AI History Query Params ──────────────────────────────────────────────
export interface AIHistoryQueryParams extends PaginationParams, SortParam {
  searchTerm?: string;
}
