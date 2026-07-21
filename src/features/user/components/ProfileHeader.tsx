"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Edit,
  FileText,
  Sparkles,
  MessageSquare,
  Bookmark,
  Heart,
  CalendarDays,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { User } from "@/types/user";

interface ProfileHeaderProps {
  user: User;
  researchCount: number;
  aiCount: number;
  chatCount: number;
}

export function ProfileHeader({
  user,
  researchCount,
  aiCount,
  chatCount,
}: ProfileHeaderProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border bg-card shadow-sm overflow-hidden"
    >
      {/* Banner gradient */}
      <div className="h-28 bg-gradient-to-br from-primary/30 via-primary/10 to-purple-500/20 relative">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 50%), radial-gradient(circle at 80% 20%, #a855f7 0%, transparent 40%)",
          }}
          aria-hidden="true"
        />
      </div>

      <div className="px-6 pb-6">
        {/* Avatar + actions row */}
        <div className="flex items-end justify-between -mt-12 mb-4 flex-wrap gap-3">
          <Avatar className="h-24 w-24 ring-4 ring-background shadow-xl">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="text-2xl font-bold gradient-primary text-white">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-2 pb-1">
            <Link
              href="/profile/edit"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "cursor-pointer")}
            >
              <Edit className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Name, role, email */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              {user.name}
            </h1>
            <Badge
              variant={user.role === "admin" ? "default" : "secondary"}
              className="text-[10px] px-2 py-0.5 capitalize"
            >
              {user.role === "admin" && (
                <ShieldCheck className="h-3 w-3 mr-1" aria-hidden="true" />
              )}
              {user.role}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          {user.bio && (
            <p className="text-sm text-foreground/80 leading-relaxed max-w-lg">
              {user.bio}
            </p>
          )}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Joined {joinedDate}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Research", value: researchCount, icon: FileText, href: "/research" },
            { label: "AI Reports", value: aiCount, icon: Sparkles, href: "/ai/history" },
            { label: "Chats", value: chatCount, icon: MessageSquare, href: "/chat" },
            { label: "Bookmarks", value: user.bookmarks.length, icon: Bookmark, href: "/profile/bookmarks" },
            { label: "Favorites", value: user.favoriteAI.length + user.favoriteChats.length, icon: Heart, href: "/profile/favorites" },
          ].map(({ label, value, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="group flex flex-col items-center gap-1 rounded-xl border bg-muted/30 p-3 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 text-center"
              aria-label={`${value} ${label}`}
            >
              <Icon
                className="h-4 w-4 text-primary group-hover:scale-110 transition-transform"
                aria-hidden="true"
              />
              <span className="text-lg font-bold text-foreground leading-none">
                {value}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">
                {label}
              </span>
            </Link>
          ))}
        </div>

        {/* Quick action links */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
          {[
            { label: "My Research", href: "/research" },
            { label: "AI History", href: "/ai/history" },
            { label: "Chat History", href: "/chat" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              aria-label={label}
            >
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
