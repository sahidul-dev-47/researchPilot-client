"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";
import { SIDEBAR_ITEMS } from "./DashboardSidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface DashboardMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardMobileDrawer({
  isOpen,
  onClose,
}: DashboardMobileDrawerProps) {
  const pathname = usePathname();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="w-64 p-0 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
        {/* Brand logo */}
        <SheetHeader className="flex h-16 items-center px-6 border-b border-sidebar-border gap-2.5 flex-row py-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shadow-sm" aria-hidden="true">
            <Zap className="h-4.5 w-4.5 text-white" />
          </div>
          <SheetTitle className="text-md font-bold tracking-tight text-foreground">
            Research<span className="gradient-text">Pilot</span>
          </SheetTitle>
        </SheetHeader>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1" aria-label="Main menu">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
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
      </SheetContent>
    </Sheet>
  );
}
