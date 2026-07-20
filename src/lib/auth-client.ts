import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client.
 *
 * Uses the Next.js app origin as baseURL so that session cookies are scoped
 * to the frontend. Next.js rewrites proxy /api/auth/* to the Express backend,
 * which keeps cookies consistent across client, middleware, and server.
 */
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: APP_URL,
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;
