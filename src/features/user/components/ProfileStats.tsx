"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Sparkles, MessageSquare, Bookmark, Heart, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileStatsProps {
  researchCount: number;
  aiCount: number;
  chatCount: number;
  bookmarksCount: number;
  favoritesCount: number;
}

export function ProfileStats({
  researchCount,
  aiCount,
  chatCount,
  bookmarksCount,
  favoritesCount,
}: ProfileStatsProps) {
  const stats = [
    {
      label: "Research Projects",
      value: researchCount,
      icon: FileText,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      href: "/research",
    },
    {
      label: "AI Reports",
      value: aiCount,
      icon: Sparkles,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
      href: "/ai/history",
    },
    {
      label: "Chats Conducted",
      value: chatCount,
      icon: MessageSquare,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      href: "/chat",
    },
    {
      label: "Bookmarked Research",
      value: bookmarksCount,
      icon: Bookmark,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      href: "/profile/bookmarks",
    },
    {
      label: "Favorites (AI & Chats)",
      value: favoritesCount,
      icon: Heart,
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
      href: "/profile/favorites",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120 } },
  };

  return (
    <Card className="overflow-hidden border-border bg-card/60 backdrop-blur-md shadow-lg">
      <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5">
        <CardTitle className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
          Platform Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} variants={item}>
                <Link
                  href={stat.href}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
                  aria-label={`${stat.value} ${stat.label}`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${stat.color} transition-transform group-hover:scale-105`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-2xl font-extrabold text-foreground tracking-tight leading-none">
                      {stat.value}
                    </span>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
}
