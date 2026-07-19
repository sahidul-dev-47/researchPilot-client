import type { ReactNode } from "react";

/**
 * Dashboard layout stub — Phase 2 will build the full sidebar shell.
 * For now this simply renders children so protected routes work correctly.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
