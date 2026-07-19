import type { ReactNode } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import { ROUTES } from "@/constants";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 gradient-primary opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />

        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <Link
            href={ROUTES.home}
            className="flex items-center gap-2.5 w-fit"
            aria-label="ResearchPilot home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Zap className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              ResearchPilot
            </span>
          </Link>

          <div className="space-y-6">
            <blockquote className="text-2xl font-semibold leading-relaxed">
              &ldquo;Accelerate your research with AI-powered insights and
              publication-grade reports.&rdquo;
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                JP
              </div>
              <div>
                <p className="text-sm font-semibold">Dr. James Parker</p>
                <p className="text-sm text-white/70">
                  Senior Research Fellow, MIT
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { value: "50K+", label: "Reports Generated" },
              { value: "10K+", label: "Researchers" },
              { value: "98%", label: "Accuracy Rate" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col min-h-screen bg-background">
        {/* Mobile logo */}
        <div className="lg:hidden p-5 border-b">
          <Link
            href={ROUTES.home}
            className="flex items-center gap-2"
            aria-label="ResearchPilot home"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shadow">
              <Zap className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <span className="font-bold text-foreground">
              Research<span className="gradient-text">Pilot</span>
            </span>
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
