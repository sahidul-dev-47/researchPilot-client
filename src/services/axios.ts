import axios from "axios";
import { API_BASE_URL } from "@/constants";

/**
 * Shared Axios instance for all ResearchPilot API calls.
 *
 * - baseURL points to the Express 5 backend (port 5000)
 * - withCredentials: true ensures session cookies are sent with every request
 *   (required by better-auth cookie-based auth)
 * - Interceptor unwraps the nested `data.data` so callers receive the
 *   actual payload directly, not the ApiResponse envelope.
 */
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Response Interceptor ─────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message: string =
      error?.response?.data?.message ??
      error?.message ??
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
