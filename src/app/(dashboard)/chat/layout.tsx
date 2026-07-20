"use client";

import type { ReactNode } from "react";
import { useRequireAuth } from "@/features/auth/hooks/useRequireAuth";
import { AuthLoading } from "@/components/auth/AuthLoading";
import { Navbar } from "@/components/layout/Navbar";

/**
 * Chat-specific layout:
 * - Keeps Navbar at the top.
 * - Removes footer so the chat can occupy full remaining viewport height.
 * - Still enforces authentication guard.
 */
export default function ChatLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useRequireAuth();

  if (isLoading) {
    return <AuthLoading label="Verifying session..." fullScreen={true} />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
