"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  MessageSquare,
  BarChart3,
  Activity,
  Zap,
} from "lucide-react";
import { ROUTES } from "@/constants";

export const SIDEBAR_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Research", href: ROUTES.research, icon: FileText },
  { label: "AI Generator", href: ROUTES.ai, icon: Sparkles },
  { label: "AI Chat", href: ROUTES.chat, icon: MessageSquare },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Activity", href: "/dashboard/activity", icon: Activity },
] as const;

interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border w-64 flex-shrink-0",
        className
      )}
      aria-label="Dashboard navigation sidebar"
    >
      {/* Brand logo */}
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shadow-sm">
          <Zap className="h-4.5 w-4.5 text-white" aria-hidden="true" />
        </div>
        <span className="text-md font-bold tracking-tight text-foreground">
          Research<span className="gradient-text">Pilot</span>
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1" aria-label="Main menu">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground/80 hover:text-foreground hover:bg-sidebar-accent"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className={cn("h-4.5 w-4.5", isActive ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
