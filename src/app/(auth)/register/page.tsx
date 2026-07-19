import type { Metadata } from "next";
import { RegisterForm } from "@/components/forms/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create your free ResearchPilot account to start generating AI-powered research reports.",
};

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="text-muted-foreground">
          Join thousands of researchers using AI to accelerate their work
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
