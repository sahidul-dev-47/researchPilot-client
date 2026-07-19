"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Zap,
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  User,
  LogOut,
  Home,
  Info,
  Phone,
  HelpCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import type { User as UserType } from "@/types/user";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  user: UserType | null;
  onSignOut: () => void;
}

const publicLinks = [
  { label: "Home", href: ROUTES.home, icon: Home },
  { label: "About", href: ROUTES.about, icon: Info },
  { label: "Contact", href: ROUTES.contact, icon: Phone },
  { label: "Help", href: ROUTES.help, icon: HelpCircle },
];

const authLinks = [
  { label: "Research", href: ROUTES.research, icon: BookOpen },
  { label: "AI Assistant", href: ROUTES.ai, icon: Zap },
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Chat", href: ROUTES.chat, icon: MessageSquare },
  { label: "Profile", href: ROUTES.profile, icon: User },
];

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const drawerVariants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
};

export function MobileMenu({
  isOpen,
  onClose,
  isAuthenticated,
  user,
  onSignOut,
}: MobileMenuProps) {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[90vw] bg-card border-l shadow-2xl md:hidden flex flex-col"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shadow">
                  <Zap className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
                <span className="font-bold text-foreground">
                  Research<span className="gradient-text">Pilot</span>
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close navigation menu"
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User info */}
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 px-5 py-4 bg-muted/50">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback className="text-sm gradient-primary text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <nav
              className="flex-1 overflow-y-auto py-4 px-3"
              aria-label="Mobile navigation links"
            >
              <div className="space-y-1">
                {(isAuthenticated ? authLinks : publicLinks).map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </nav>

            <Separator />

            {/* Bottom Actions */}
            <div className="p-4 space-y-2">
              {isAuthenticated ? (
                <button
                  className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  onClick={() => {
                    onClose();
                    onSignOut();
                  }}
                  id="mobile-logout-btn"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Sign Out
                </button>
              ) : (
                <div className="space-y-2">
                  <Link
                    href={ROUTES.login}
                    id="mobile-login-link"
                    className="flex w-full items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium border hover:bg-muted transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href={ROUTES.register}
                    id="mobile-register-link"
                    className="flex w-full items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold gradient-primary text-white hover:opacity-90 transition-opacity"
                  >
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
