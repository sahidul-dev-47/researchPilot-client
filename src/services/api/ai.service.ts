import apiClient from "@/services/axios";
import type { ApiResponse, PaginatedApiResponse } from "@/types/api";
import type {
  AIResearch,
  GenerateResearchInput,
  RegenerateResearchInput,
  AIHistoryQueryParams,
  DocIntelligenceResult,
  ImageUnderstandingResult,
} from "@/types/ai";

// ─── POST /api/ai/generate ────────────────────────────────────────────────
export async function generateAIResearch(
  body: GenerateResearchInput
): Promise<AIResearch> {
  const response = await apiClient.post<ApiResponse<AIResearch>>(
    "/ai/generate",
    body
  );
  return response.data.data;
}

// ─── POST /api/ai/document-intelligence ──────────────────────────────────
export async function analyzeDocument(
  formData: FormData
): Promise<DocIntelligenceResult> {
  const response = await apiClient.post<ApiResponse<DocIntelligenceResult>>(
    "/ai/document-intelligence",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data.data;
}

// ─── POST /api/ai/image-understanding ─────────────────────────────────────
export async function analyzeImage(
  formData: FormData
): Promise<ImageUnderstandingResult> {
  const response = await apiClient.post<ApiResponse<ImageUnderstandingResult>>(
    "/ai/image-understanding",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data.data;
}

// ─── POST /api/ai/regenerate ──────────────────────────────────────────────
export async function regenerateAIResearch(
  body: RegenerateResearchInput
): Promise<AIResearch> {
  const response = await apiClient.post<ApiResponse<AIResearch>>(
    "/ai/regenerate",
    body
  );
  return response.data.data;
}

// ─── GET /api/ai/history ──────────────────────────────────────────────────
export async function getAIHistory(
  params?: AIHistoryQueryParams
): Promise<PaginatedApiResponse<AIResearch>> {
  const response = await apiClient.get<PaginatedApiResponse<AIResearch>>(
    "/ai/history",
    { params }
  );
  return response.data;
}

// ─── GET /api/ai/history/:id ──────────────────────────────────────────────
export async function getAIHistoryById(id: string): Promise<AIResearch> {
  const response = await apiClient.get<ApiResponse<AIResearch>>(
    `/ai/history/${id}`
  );
  return response.data.data;
}

// ─── DELETE /api/ai/history/:id ───────────────────────────────────────────
export async function deleteAIHistory(id: string): Promise<AIResearch> {
  const response = await apiClient.delete<ApiResponse<AIResearch>>(
    `/ai/history/${id}`
  );
  return response.data.data;
}
