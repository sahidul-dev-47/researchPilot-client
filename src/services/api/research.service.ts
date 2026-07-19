import apiClient from "@/services/axios";
import type { ApiResponse, PaginatedApiResponse } from "@/types/api";
import type {
  Research,
  CreateResearchInput,
  UpdateResearchInput,
  ResearchQueryParams,
  ExportFormat,
} from "@/types/research";

// ─── GET /api/research ────────────────────────────────────────────────────
export async function getAllResearch(
  params?: ResearchQueryParams
): Promise<PaginatedApiResponse<Research>> {
  const response = await apiClient.get<PaginatedApiResponse<Research>>(
    "/research",
    { params }
  );
  return response.data;
}

// ─── GET /api/research/:id ────────────────────────────────────────────────
export async function getResearchById(id: string): Promise<Research> {
  const response = await apiClient.get<ApiResponse<Research>>(
    `/research/${id}`
  );
  return response.data.data;
}

// ─── POST /api/research ───────────────────────────────────────────────────
export async function createResearch(
  body: CreateResearchInput
): Promise<Research> {
  const response = await apiClient.post<ApiResponse<Research>>(
    "/research",
    body
  );
  return response.data.data;
}

// ─── PATCH /api/research/:id ──────────────────────────────────────────────
export async function updateResearch(
  id: string,
  body: UpdateResearchInput
): Promise<Research> {
  const response = await apiClient.patch<ApiResponse<Research>>(
    `/research/${id}`,
    body
  );
  return response.data.data;
}

// ─── DELETE /api/research/:id ─────────────────────────────────────────────
export async function deleteResearch(id: string): Promise<Research> {
  const response = await apiClient.delete<ApiResponse<Research>>(
    `/research/${id}`
  );
  return response.data.data;
}

// ─── GET /api/research/:id/export ─────────────────────────────────────────
// format: json | markdown | pdf
export async function exportResearch(
  id: string,
  format: ExportFormat = "json"
): Promise<Blob | Research> {
  if (format === "pdf" || format === "markdown") {
    const response = await apiClient.get(`/research/${id}/export`, {
      params: { format },
      responseType: "blob",
    });
    return response.data as Blob;
  }
  const response = await apiClient.get<ApiResponse<Research>>(
    `/research/${id}/export`,
    { params: { format } }
  );
  return response.data.data;
}
