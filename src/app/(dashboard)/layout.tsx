"use client";

import type { ReactNode } from "react";
import { useRequireAuth } from "@/features/auth/hooks/useRequireAuth";
import { AuthLoading } from "@/components/auth/AuthLoading";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

/**
 * Dashboard layout — Phase 2 will build the full sidebar shell.
 * For now this renders children wrapped in the useRequireAuth client-side guard.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useRequireAuth();

  if (isLoading) {
    return <AuthLoading label="Verifying session..." fullScreen={true} />;
  }

  if (!isAuthenticated) {
    return null; // Will trigger redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">{children}</main>
      <Footer />
    </div>
  );
}

