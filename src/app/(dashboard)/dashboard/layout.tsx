"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { DashboardMobileDrawer } from "@/features/dashboard/components/DashboardMobileDrawer";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleToggleSidebar() {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setMobileOpen(true);
    } else {
      setSidebarOpen((prev) => !prev);
    }
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden bg-background">
      {/* Desktop Sidebar — hidden on mobile, visible on md+ */}
      {sidebarOpen && (
        <DashboardSidebar className="hidden md:flex" />
      )}

      {/* Mobile Drawer */}
      <DashboardMobileDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader onToggleSidebar={handleToggleSidebar} />

        <main
          id="dashboard-main-content"
          className="flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6 bg-muted/20"
          tabIndex={-1}
          aria-label="Dashboard main content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
