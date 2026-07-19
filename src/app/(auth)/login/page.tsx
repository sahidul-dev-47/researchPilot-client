import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your ResearchPilot account to manage your research projects and access AI-powered tools.",
};

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-muted-foreground">
          Sign in to continue to ResearchPilot
        </p>
      </div>
      <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-xl" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
