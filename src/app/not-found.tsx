"use client";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

// Metadata cannot be exported from a client-side component in Next.js App Router
// export const metadata = {
//   title: "404 — Page Not Found",
//   description: "The page you are looking for does not exist.",
// };

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background gradient-hero px-4 text-center">
      {/* Decorative glow */}
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full blur-3xl opacity-20"
        style={{
          background:
            "radial-gradient(circle, hsl(238 84% 60%) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-md">
        {/* 404 number */}
        <div className="heading-xl gradient-text select-none" aria-hidden="true">
          404
        </div>

        {/* Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-lg">
          <Home className="h-8 w-8 text-white" aria-hidden="true" />
        </div>

        {/* Copy */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Page Not Found
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Let&apos;s get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 px-5 py-2.5 rounded-lg gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
            id="not-found-home-btn"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Go Home
          </Link>
          <button
            onClick={() => history.back()}
            className="flex flex-1 items-center justify-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
            id="not-found-back-btn"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
