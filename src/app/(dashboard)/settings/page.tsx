"use client";

import Link from "next/link";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { SettingsCard } from "@/features/user/components/SettingsCard";
import { useUserProfile } from "@/features/user/hooks/useUser";
import { ProfileHeaderSkeleton } from "@/features/user/components/ProfileSkeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { data: user, isLoading, error, refetch } = useUserProfile();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="h-9 w-48 bg-muted animate-pulse rounded-md" />
        <ProfileHeaderSkeleton />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
          <AlertCircle className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">Failed to load settings</h1>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          Could not retrieve your user preferences. Please check your network connection.
        </p>
        <Button onClick={() => refetch()} className="cursor-pointer">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back to Profile Link */}
      <div className="flex items-center gap-2">
        <Link
          href="/profile"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "pl-1 flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground")}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back to Profile
        </Link>
      </div>

      {/* Settings Options Card */}
      <SettingsCard user={user} />
    </div>
  );
}
