"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROUTES } from "@/constants";

/**
 * Client-side guard for protected areas that must render inside a route group
 * without a server session check. While the better-auth session resolves it
 * returns `isLoading: true` (render AuthLoading). Unauthenticated users are
 * redirected to login with a callbackUrl. This complements the edge middleware.
 */
export function useRequireAuth(callbackUrl?: string) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const target = new URL(ROUTES.login, window.location.origin);
      target.searchParams.set("callbackUrl", callbackUrl ?? window.location.pathname);
      router.replace(target.toString());
    }
  }, [isLoading, isAuthenticated, router, callbackUrl]);

  return { isAuthenticated, isLoading };
}
