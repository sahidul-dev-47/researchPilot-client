import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, LogIn } from "lucide-react";
import { ROUTES } from "@/constants";

export const metadata: Metadata = {
  title: "Unauthorized",
  description: "You do not have permission to access this page.",
  robots: { index: false, follow: false },
};

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background gradient-hero px-4 text-center">
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-md">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-lg">
          <ShieldAlert className="h-8 w-8 text-white" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Access Denied
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            You don&apos;t have permission to view this page. If you believe this
            is a mistake, try signing in with an authorized account.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href={ROUTES.login}
            className="flex flex-1 items-center justify-center gap-2 px-5 py-2.5 rounded-lg gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
            id="unauthorized-login-btn"
          >
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Sign In
          </Link>
          <Link
            href={ROUTES.home}
            className="flex flex-1 items-center justify-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
            id="unauthorized-home-btn"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
