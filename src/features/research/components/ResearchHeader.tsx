"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plus, List, FolderHeart, ShieldAlert, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface ResearchHeaderProps {
  title: string;
  description: string;
  count?: number;
}

export function ResearchHeader({ title, description, count }: ResearchHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const tabs = [
    {
      label: "All Research",
      href: "/research",
      icon: List,
    },
    ...(isAuthenticated
      ? [
        {
          label: "My Research",
          href: "/research/my",
          icon: FolderHeart,
        },
        {
          label: "Manage",
          href: "/research/manage",
          icon: Table,
        },
      ]
      : []),
  ];

  return (
    <div className="space-y-6">
      {/* Header Title & CTA */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl bg-gradient-to-r from-primary to-primary-foreground bg-clip-text">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            {description}
            {count !== undefined && (
              <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {count} project{count === 1 ? "" : "s"}
              </span>
            )}
          </p>
        </div>

        {isAuthenticated && (
          <Button
            className="gradient-primary border-0 text-white hover:opacity-90 shadow-md shadow-primary/20 transition-all font-medium py-5 px-5 rounded-xl shrink-0 gap-2"
            onClick={() => router.push("/research/new")}
            id="research-create-link"
          >
            <Plus className="h-4.5 w-4.5" aria-hidden="true" />
            New Research
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-border/60">
        <div className="flex space-x-8" role="tablist">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "relative flex items-center gap-2 border-b-2 py-4 px-1 text-sm font-semibold transition-all hover:text-foreground/90",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
                role="tab"
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
