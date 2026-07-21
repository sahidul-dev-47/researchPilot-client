"use client";

import { motion } from "framer-motion";
import { Mail, Calendar, UserCheck, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/types/user";

interface ProfileCardProps {
  user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden border-border bg-card/60 backdrop-blur-md shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5">
          <CardTitle className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" aria-hidden="true" />
            Profile Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <Avatar className="h-20 w-20 ring-4 ring-primary/10 shadow-md">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                  className="text-[10px] px-2 capitalize flex items-center gap-1 font-semibold"
                >
                  {user.role === "admin" ? (
                    <Shield className="h-3 w-3 text-white" aria-hidden="true" />
                  ) : null}
                  {user.role}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                {user.email}
              </p>
              <p className="text-xs text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5 pt-0.5">
                <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Joined {joinedDate}
              </p>
            </div>
          </div>

          {user.bio && (
            <div className="rounded-xl bg-muted/30 p-4 border border-border/40">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Biography
              </h3>
              <p className="text-sm text-foreground/95 leading-relaxed whitespace-pre-wrap">
                {user.bio}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
