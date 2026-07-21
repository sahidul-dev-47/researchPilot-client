"use client";

import { motion } from "framer-motion";
import { ProfileHeader } from "@/features/user/components/ProfileHeader";
import { ProfileCard } from "@/features/user/components/ProfileCard";
import { ProfileStats } from "@/features/user/components/ProfileStats";
import { ProfileSkeleton } from "@/features/user/components/ProfileSkeleton";
import { useUserProfile } from "@/features/user/hooks/useUser";
import { useDashboardOverview } from "@/features/dashboard/hooks/useDashboard";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { data: user, isLoading: isLoadingUser, error: userError, refetch: refetchUser } = useUserProfile();
  const { data: overview, isLoading: isLoadingOverview, error: overviewError, refetch: refetchOverview } = useDashboardOverview();

  const handleRetry = () => {
    refetchUser();
    refetchOverview();
  };

  if (isLoadingUser || isLoadingOverview) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <ProfileSkeleton />
      </div>
    );
  }

  if (userError || overviewError || !user) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
          <AlertCircle className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">Failed to load profile</h1>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          There was an issue fetching your profile data from the server. Please check your connection and try again.
        </p>
        <Button onClick={handleRetry} className="cursor-pointer">
          Try Again
        </Button>
      </div>
    );
  }

  // Calculate totals
  const researchCount = overview?.stats?.totalResearch ?? 0;
  const aiCount = overview?.stats?.totalAIGenerations ?? 0;
  const chatCount = overview?.stats?.totalConversations ?? 0;
  const bookmarksCount = user.bookmarks?.length ?? 0;
  const favoritesCount = (user.favoriteAI?.length ?? 0) + (user.favoriteChats?.length ?? 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Profile Header */}
      <ProfileHeader
        user={user}
        researchCount={researchCount}
        aiCount={aiCount}
        chatCount={chatCount}
      />

      {/* Main Grid: Details and Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        <div className="lg:col-span-5">
          <ProfileCard user={user} />
        </div>
        <div className="lg:col-span-7">
          <ProfileStats
            researchCount={researchCount}
            aiCount={aiCount}
            chatCount={chatCount}
            bookmarksCount={bookmarksCount}
            favoritesCount={favoritesCount}
          />
        </div>
      </motion.div>
    </div>
  );
}
