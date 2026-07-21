"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-full bg-muted animate-pulse rounded-lg" />;
  }

  const themes = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Laptop },
  ] as const;

  return (
    <div className="inline-flex p-1 bg-muted/50 border border-border/50 rounded-xl w-full sm:w-auto" role="group" aria-label="Theme options">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setTheme(t.id)}
            className={cn(
              "flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer",
              isActive
                ? "bg-background text-primary shadow-sm border border-border/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
            )}
            aria-pressed={isActive}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
