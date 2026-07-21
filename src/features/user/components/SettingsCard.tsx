"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  Settings,
  Globe,
  Clock,
  Eye,
  UserCheck,
  ShieldAlert,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { signOut } from "@/lib/auth-client";
import { ROUTES } from "@/constants";
import type { User } from "@/types/user";

interface SettingsCardProps {
  user: User;
}

export function SettingsCard({ user }: SettingsCardProps) {
  const [language, setLanguage] = useState(user.settings.language || "en");
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLanguageChange = (val: string | null) => {
    if (!val) return;
    setLanguage(val);
    toast.success(`Language changed to ${val === "en" ? "English" : val === "es" ? "Spanish" : "German"}.`);
  };

  const handleTimezoneChange = (val: string | null) => {
    if (!val) return;
    setTimezone(val);
    toast.success(`Timezone updated to ${val}.`);
  };

  async function handleSignOut() {
    setIsLoggingOut(true);
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully.");
            window.location.href = ROUTES.home;
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Failed to sign out.");
            setIsLoggingOut(false);
          },
        },
      });
    } catch (err) {
      toast.error("An error occurred during logout.");
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Settings Container */}
      <Card className="border-border bg-card/60 backdrop-blur-md shadow-lg overflow-hidden">
        <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5">
          <CardTitle className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" aria-hidden="true" />
            Account Settings
          </CardTitle>
          <CardDescription>
            Manage your interface language, theme, and authentication settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border/40 p-0">
          
          {/* Section: General */}
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" aria-hidden="true" />
              General Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="language-select" className="text-xs font-semibold text-muted-foreground">
                  Interface Language
                </label>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger id="language-select" className="bg-background/50 border-border">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English (US)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="timezone-select" className="text-xs font-semibold text-muted-foreground">
                  Timezone
                </label>
                <Select value={timezone} onValueChange={handleTimezoneChange}>
                  <SelectTrigger id="timezone-select" className="bg-background/50 border-border">
                    <SelectValue placeholder="Select Timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (EST)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT+1)</SelectItem>
                    <SelectItem value="Asia/Dhaka">Dhaka (GMT+6)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section: Appearance */}
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" aria-hidden="true" />
              Appearance
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-sm font-semibold text-foreground">Visual Theme</span>
                <p className="text-xs text-muted-foreground">
                  Customize the look of the dashboard interface.
                </p>
              </div>
              <ThemeSwitcher />
            </div>
          </div>

          {/* Section: Account */}
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              Account Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Registered Email
                  </span>
                  <span className="text-sm font-medium text-foreground">{user.email}</span>
                </div>
                <Badge variant={user.emailVerified ? "default" : "secondary"} className="text-xs py-0.5 font-semibold">
                  {user.emailVerified ? "Verified Account" : "Pending Verification"}
                </Badge>
              </div>

              <div className="flex items-center justify-between gap-4 flex-wrap pt-2 border-t border-border/20">
                <div>
                  <span className="text-sm font-semibold text-foreground">Connected Google Account</span>
                  <p className="text-xs text-muted-foreground">
                    Enables one-click secure login with Google Identity.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                    Linked to Google Auth
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Security / Logout */}
          <div className="p-6 space-y-4 bg-destructive/5">
            <h3 className="text-sm font-bold text-destructive tracking-tight flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-destructive" aria-hidden="true" />
              Security & Session
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-sm font-semibold text-foreground">Active Session</span>
                <p className="text-xs text-muted-foreground">
                  Safely sign out of your account on this device.
                </p>
              </div>
              <Button
                variant="destructive"
                disabled={isLoggingOut}
                onClick={handleSignOut}
                className="flex items-center gap-1.5 hover:bg-destructive/90 cursor-pointer"
                id="settings-logout-btn"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                {isLoggingOut ? "Signing Out..." : "Sign Out"}
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
