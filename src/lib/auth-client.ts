import { createAuthClient } from "better-auth/react";
import { API_BASE_URL } from "@/constants";

/**
 * better-auth client pointing at the Express backend.
 * Exports signIn, signUp, signOut, useSession — no custom endpoints invented.
 */
export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
});

export const { signIn, signUp, signOut, useSession } = authClient;
