import axios from "axios";
import { APP_URL } from "@/constants";

/**
 * Shared Axios instance for all ResearchPilot API calls.
 *
 * - baseURL points to the Next.js frontend origin so that all requests
 *   share the same cookie scope as the auth client.
 * - Next.js rewrites proxy /api/* to the Express backend.
 * - withCredentials: true ensures session cookies are sent with every request
 *   (required by better-auth cookie-based auth)
 * - Interceptor unwraps the nested `data.data` so callers receive the
 *   actual payload directly, not the ApiResponse envelope.
 */
const apiClient = axios.create({
  baseURL: `${APP_URL}/api`,
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
