import { PaginationParams, SortParam } from "./api";

// ─── Research Status / Priority / Visibility enums ────────────────────────
export type ResearchStatus = "Draft" | "In Progress" | "Completed";
export type ResearchPriority = "Low" | "Medium" | "High";
export type ResearchVisibility = "Public" | "Private";
export type ExportFormat = "json" | "markdown" | "pdf";

// ─── Research ─────────────────────────────────────────────────────────────
export interface Research {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  researchField: string;
  status: ResearchStatus;
  priority: ResearchPriority;
  tags: string[];
  coverImage?: string;
  attachments: string[];
  estimatedDuration: string;
  visibility: ResearchVisibility;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Create / Update Inputs ───────────────────────────────────────────────
export interface CreateResearchInput {
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  researchField: string;
  status?: ResearchStatus;
  priority?: ResearchPriority;
  tags?: string[];
  coverImage?: string;
  attachments?: string[];
  estimatedDuration: string;
  visibility?: ResearchVisibility;
}

export type UpdateResearchInput = Partial<CreateResearchInput>;

// ─── Research Query Params ────────────────────────────────────────────────
export interface ResearchQueryParams extends PaginationParams, SortParam {
  searchTerm?: string;
  status?: ResearchStatus;
  priority?: ResearchPriority;
  visibility?: ResearchVisibility;
  category?: string;
  researchField?: string;
}
