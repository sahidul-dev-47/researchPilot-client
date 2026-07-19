"use client";

import { useSession } from "@/lib/auth-client";
import type { User } from "@/types/user";

/**
 * Wraps better-auth's useSession to expose a clean interface.
 * Never exposes `any` — session.user is typed via better-auth's inference.
 */
export function useAuth(): {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
} {
  const { data: session, isPending } = useSession();

  // better-auth session.user is the Better Auth user object.
  // We cast it to our frontend User type for consistency.
  const user = session?.user
    ? ({
        _id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        emailVerified: session.user.emailVerified,
        image: session.user.image ?? undefined,
        role: ((session.user as unknown as { role?: string }).role === "admin"
          ? "admin"
          : "user") as User["role"],
        bio: undefined,
        bookmarks: [],
        favoriteAI: [],
        favoriteChats: [],
        settings: {
          theme: "light",
          language: "en",
          notificationPreference: true,
        },
        createdAt: session.user.createdAt?.toString() ?? "",
        updatedAt: session.user.updatedAt?.toString() ?? "",
      } satisfies User)
    : null;

  return {
    user,
    isLoading: isPending,
    isAuthenticated: !!session?.user,
  };
}
