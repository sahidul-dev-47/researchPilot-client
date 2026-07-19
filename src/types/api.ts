// ─── Generic API Envelope ────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// ─── Pagination Meta ─────────────────────────────────────────────────────
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── Paginated API Envelope ───────────────────────────────────────────────
export interface PaginatedApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

// ─── Generic query params ─────────────────────────────────────────────────
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParam {
  sort?: "newest" | "oldest" | "title" | "priority";
}
