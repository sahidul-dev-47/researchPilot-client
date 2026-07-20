"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Menu,
  X,
  Zap,
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileMenu } from "./MobileMenu";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { signOut } from "@/lib/auth-client";
import { PUBLIC_NAV_LINKS, AUTH_NAV_LINKS, ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleSignOut() {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out successfully");
          window.location.href = ROUTES.home;
        },
        onError: () => {
          toast.error("Failed to sign out");
        },
      },
    });
  }

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          isScrolled ? "glass border-b shadow-sm py-3" : "bg-transparent py-5"
        )}
        role="banner"
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href={ROUTES.home}
            className="flex items-center gap-2.5 group"
            aria-label="ResearchPilot home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-md transition-transform group-hover:scale-105">
              <Zap className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Research<span className="gradient-text">Pilot</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {(!mounted ? PUBLIC_NAV_LINKS : (isAuthenticated ? AUTH_NAV_LINKS : PUBLIC_NAV_LINKS)).map(
              (link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
                aria-label={
                  resolvedTheme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                id="theme-toggle"
              >
                <AnimatePresence mode="wait">
                  {resolvedTheme === "dark" ? (
                    <motion.span
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex"
                    >
                      <Sun className="h-4 w-4" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex"
                    >
                      <Moon className="h-4 w-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            )}

            {/* Auth section - Desktop */}
            {mounted && !isLoading && (
              <div className="hidden md:flex items-center gap-2">
                {isAuthenticated && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-muted transition-colors cursor-pointer"
                      id="user-menu-trigger"
                      aria-label="User menu"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback className="text-xs gradient-primary text-white">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium max-w-[120px] truncate">
                        {user.name}
                      </span>
                      <ChevronDown
                        className="h-3.5 w-3.5 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52" id="user-menu">
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => (window.location.href = ROUTES.dashboard)}
                      >
                        <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => (window.location.href = ROUTES.profile)}
                      >
                        <User className="h-4 w-4" aria-hidden="true" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="text-destructive flex items-center gap-2 cursor-pointer"
                        id="logout-btn"
                      >
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Link
                      href={ROUTES.login}
                      id="login-link"
                      className="px-3 py-1.5 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href={ROUTES.register}
                      id="register-link"
                      className="px-4 py-1.5 text-sm font-semibold rounded-lg gradient-primary text-white hover:opacity-90 shadow-md shadow-primary/25 transition-opacity"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              id="mobile-menu-toggle"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex"
                  >
                    <X className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex"
                  >
                    <Menu className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </nav>
      </header>

      <MobileMenu
        key={pathname}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        user={user}
        onSignOut={handleSignOut}
      />
    </>
  );
}
