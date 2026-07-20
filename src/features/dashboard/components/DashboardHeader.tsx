"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { signOut } from "@/lib/auth-client";
import { Menu, LogOut, ChevronDown, User, LayoutDashboard, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { ROUTES } from "@/constants";

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
}

export function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  async function handleSignOut() {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out successfully");
          window.location.href = ROUTES.home;
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to sign out");
        },
      },
    });
  }

  // Determine breadcrumb labels
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = pathSegments.map((seg, idx) => {
    const isLast = idx === pathSegments.length - 1;
    const label = seg.charAt(0).toUpperCase() + seg.slice(1);
    return { label, isLast };
  });

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
      {/* Sidebar toggle & breadcrumbs */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="md:hidden text-muted-foreground hover:text-foreground"
          aria-label="Toggle navigation menu"
          id="mobile-nav-toggle"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="hidden sm:block">
          <ol className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            {breadcrumbs.map((crumb, idx) => (
              <li key={idx} className="flex items-center gap-1.5">
                {idx > 0 && <span aria-hidden="true">/</span>}
                <span className={crumb.isLast ? "text-foreground font-semibold" : ""}>
                  {crumb.label}
                </span>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* User profile actions */}
      <div className="flex items-center gap-4">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted/80 transition-colors cursor-pointer text-left focus:outline-none"
              id="dashboard-user-menu-trigger"
              aria-label="User navigation menu"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback className="text-xs gradient-primary text-white font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-semibold max-w-[120px] truncate hidden md:inline text-foreground">
                {user.name}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden md:inline" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48" id="dashboard-user-menu">
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => (window.location.href = "/dashboard")}
              >
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive flex items-center gap-2 cursor-pointer focus:text-destructive focus:bg-destructive/10"
                id="dashboard-logout-btn"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
