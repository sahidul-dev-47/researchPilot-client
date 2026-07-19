"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Zap,
  Brain,
  BookOpen,
  BarChart3,
  MessageSquare,
  Download,
  Bell,
  ArrowRight,
  CheckCircle2,
  Star,
  ChevronDown,
  Search,
  FileText,
  Sparkles,
  Users,
  TrendingUp,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

// ─── Animation Variants ───────────────────────────────────────────────────
const easeOut = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: easeOut } },
};

// ─── Section wrapper with scroll trigger ──────────────────────────────────
function AnimatedSection({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"section"> & { className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
      {...(props as object)}
    >
      {children}
    </motion.section>
  );
}

// ─── Data ──────────────────────────────────────────────────────────────────
const features = [
  {
    icon: Brain,
    title: "AI Report Generation",
    description:
      "Generate publication-grade research reports with Gemini 2.5 Flash. Choose difficulty, style, methodology, and word count.",
    badge: "Powered by Gemini",
  },
  {
    icon: BookOpen,
    title: "Research Management",
    description:
      "Organize projects by status, priority, and category. Track progress from Draft to Completed with full version history.",
    badge: "Full CRUD",
  },
  {
    icon: MessageSquare,
    title: "Smart AI Chat",
    description:
      "Chat with a context-aware research assistant. Inject any research project for deeply relevant, academic responses.",
    badge: "Context-aware",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Visualize your research activity with Recharts-powered graphs. Track tokens, reports, and productivity over time.",
    badge: "Real-time",
  },
  {
    icon: Download,
    title: "Export & Share",
    description:
      "Export research in JSON, Markdown, or PDF format. Share public projects with the research community.",
    badge: "3 Formats",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Get notified when AI reports complete, chats start, and system events occur. Track reads and manage your inbox.",
    badge: "In-app",
  },
];

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Define Your Research",
    description:
      "Create a research project with title, category, field, and objectives. Set visibility to public or private.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Generate with AI",
    description:
      "Configure the AI parameters — topic, difficulty, methodology, writing style — and let Gemini generate your report.",
  },
  {
    number: "03",
    icon: FileText,
    title: "Review & Export",
    description:
      "Review the structured 8-section report with executive summary, findings, and APA references. Export in your format.",
  },
];

const workflowSteps = [
  { label: "Create Project", color: "bg-primary", icon: BookOpen },
  { label: "Configure AI", color: "bg-secondary", icon: Brain },
  { label: "Generate Report", color: "bg-accent", icon: Sparkles },
  { label: "Review & Edit", color: "bg-primary", icon: FileText },
  { label: "Export & Share", color: "bg-secondary", icon: Download },
];

const stats = [
  { value: "50K+", label: "Reports Generated", icon: FileText, color: "text-primary" },
  { value: "10K+", label: "Active Researchers", icon: Users, color: "text-secondary" },
  { value: "98%", label: "Accuracy Rate", icon: TrendingUp, color: "text-accent" },
  { value: "256-bit", label: "Data Encryption", icon: Shield, color: "text-primary" },
];

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "Research Director, Stanford",
    avatar: "SC",
    rating: 5,
    quote:
      "ResearchPilot cut my literature review time by 70%. The AI generates reports I'd spend days writing manually — with proper APA citations.",
  },
  {
    name: "Marcus Williams",
    role: "PhD Candidate, MIT",
    avatar: "MW",
    rating: 5,
    quote:
      "The chat assistant is genuinely impressive. I inject my research context and get deeply relevant academic answers. It's like having a research partner available 24/7.",
  },
  {
    name: "Prof. Aisha Patel",
    role: "Associate Professor, Oxford",
    avatar: "AP",
    rating: 5,
    quote:
      "I recommend ResearchPilot to all my students. The structured reports with methodology, findings, and references are exactly what peer review demands.",
  },
];

const faqs = [
  {
    q: "What AI model powers the report generation?",
    a: "ResearchPilot uses Google Gemini 2.5 Flash — Google's fastest and most capable model — for both report generation and the interactive chat assistant.",
  },
  {
    q: "How long does it take to generate a research report?",
    a: "Report generation typically takes 15–45 seconds depending on the requested word count and complexity. You'll receive a notification when it's ready.",
  },
  {
    q: "Can I export reports in PDF format?",
    a: "Yes. Every research report can be exported as JSON, Markdown, or a formatted PDF. PDF exports are professionally structured with a title page and section headings.",
  },
  {
    q: "Is my research data private?",
    a: "Absolutely. Research projects default to Private. Only projects you explicitly set to Public are visible to other users. Your data is encrypted at rest.",
  },
  {
    q: "What are the AI generation rate limits?",
    a: "To ensure fair usage, AI report generation is limited to 5 requests per 15 minutes. Chat messages allow up to 30 per 15 minutes.",
  },
  {
    q: "Do I need a credit card to get started?",
    a: "No. Create your account for free and start generating AI research reports immediately. No credit card required.",
  },
];

// ─── Component ─────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 1. HERO SECTION                                                    */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[65vh] flex flex-col items-center justify-center text-center px-4 pt-28 pb-20 gradient-hero overflow-hidden"
        aria-label="Hero section"
      >
        {/* Background decorative orbs */}
        <div
          className="pointer-events-none absolute top-1/4 left-1/4 h-72 w-72 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, hsl(238 84% 60%), transparent 70%)" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full blur-3xl opacity-15"
          style={{ background: "radial-gradient(circle, hsl(262 80% 63%), transparent 70%)" }}
          aria-hidden="true"
        />

        <motion.div
          className="relative z-10 max-w-4xl mx-auto space-y-6"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <Badge
              className="gap-2 px-4 py-1.5 text-sm border-primary/30 bg-primary/10 text-primary hover:bg-primary/10"
              variant="outline"
            >
              <Zap className="h-3.5 w-3.5" aria-hidden="true" />
              Powered by Google Gemini 2.5 Flash
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp} className="heading-xl text-foreground">
            AI-Powered Research{" "}
            <span className="gradient-text block sm:inline">
              Made Effortless
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={fadeUp}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Generate publication-grade research reports in seconds. Manage your
            projects, chat with an intelligent AI assistant, and export in any
            format you need.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <Link
              href={ROUTES.register}
              className="inline-flex items-center gap-2 px-8 h-12 rounded-lg gradient-primary text-white text-base font-semibold hover:opacity-90 shadow-xl shadow-primary/30 transition-opacity"
              id="hero-cta-primary"
            >
              Start Researching Free
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/#how-it-works"
              className="inline-flex items-center gap-2 px-8 h-12 rounded-lg border text-base font-medium hover:bg-muted transition-colors"
              id="hero-cta-secondary"
            >
              See How It Works
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>


          {/* Trust indicators */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm text-muted-foreground"
          >
            {[
              "No credit card required",
              "Free to get started",
              "Cancel anytime",
            ].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" aria-hidden="true" />
                {item}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating preview card */}
        <motion.div
          className="relative z-10 mt-16 w-full max-w-3xl mx-auto px-4"
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <div className="glass-card rounded-2xl p-5 shadow-2xl border">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-3 w-3 rounded-full bg-red-400" aria-hidden="true" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" aria-hidden="true" />
              <div className="h-3 w-3 rounded-full bg-green-400" aria-hidden="true" />
              <div className="flex-1 mx-3 h-6 rounded-md bg-muted flex items-center px-3">
                <span className="text-xs text-muted-foreground">
                  ResearchPilot AI — Generating report...
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                  <Brain className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-3/4 rounded-full bg-muted animate-shimmer" />
                  <div className="h-3 w-full rounded-full bg-muted animate-shimmer" />
                  <div className="h-3 w-5/6 rounded-full bg-muted animate-shimmer" />
                  <div className="h-3 w-2/3 rounded-full bg-muted animate-shimmer" />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Badge variant="secondary" className="text-xs">Executive Summary ✓</Badge>
                <Badge variant="secondary" className="text-xs">Methodology ✓</Badge>
                <Badge variant="secondary" className="text-xs">Key Findings...</Badge>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 2. FEATURES SECTION                                                */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <AnimatedSection
        id="features"
        className="section-padding bg-muted/30"
        aria-label="Features"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} className="text-center mb-14 space-y-4">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
              Everything you need
            </Badge>
            <h2 className="heading-lg text-foreground">
              Built for{" "}
              <span className="gradient-text">Serious Researchers</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete research toolkit — from AI report generation to project
              management, analytics, and intelligent chat.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={scaleIn}
                  custom={i}
                  className="group relative rounded-2xl border bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300 overflow-hidden"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute top-0 left-0 right-0 h-px gradient-primary" />
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-primary shadow-md shadow-primary/20">
                      <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground text-sm">
                          {feature.title}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-2 py-0.5 font-medium"
                        >
                          {feature.badge}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 3. HOW IT WORKS SECTION                                            */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <AnimatedSection
        id="how-it-works"
        className="section-padding"
        aria-label="How it works"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} className="text-center mb-14 space-y-4">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
              Simple Process
            </Badge>
            <h2 className="heading-lg text-foreground">
              Research in{" "}
              <span className="gradient-text">Three Steps</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              From idea to publication-ready report in minutes, not weeks.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div
              className="hidden md:block absolute top-14 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/50 via-secondary/50 to-accent/50"
              aria-hidden="true"
            />

            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  variants={fadeUp}
                  custom={i}
                  className="flex flex-col items-center text-center gap-4"
                >
                  <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-lg shadow-primary/25">
                      <Icon className="h-7 w-7 text-white" aria-hidden="true" />
                    </div>
                    <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">
                      {i + 1}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-mono text-muted-foreground tracking-widest">
                      {step.number}
                    </p>
                    <h3 className="text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div variants={fadeUp} className="mt-12 text-center">
            <Link
              href={ROUTES.register}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg gradient-primary text-white font-semibold hover:opacity-90 shadow-lg shadow-primary/25 transition-opacity"
              id="how-it-works-cta"
            >
              Get Started Now
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 4. RESEARCH WORKFLOW SECTION                                       */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <AnimatedSection
        className="section-padding bg-muted/30"
        aria-label="Research workflow"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} className="text-center mb-14 space-y-4">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
              Streamlined Workflow
            </Badge>
            <h2 className="heading-lg text-foreground">
              Your Research{" "}
              <span className="gradient-text">Workflow</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              A structured pipeline from project creation to final export.
            </p>
          </motion.div>

          {/* Pipeline visualization */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0 relative">
            {workflowSteps.map((step, i) => {
              const Icon = step.icon;
              const isLast = i === workflowSteps.length - 1;
              return (
                <motion.div
                  key={step.label}
                  variants={scaleIn}
                  custom={i}
                  className="flex flex-col md:flex-row items-center"
                >
                  <div className="flex flex-col items-center gap-2 z-10">
                    <div
                      className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg text-white",
                        step.color
                      )}
                    >
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="text-xs font-semibold text-center text-foreground whitespace-nowrap">
                      {step.label}
                    </p>
                  </div>
                  {!isLast && (
                    <div className="hidden md:flex items-center mx-3" aria-hidden="true">
                      <div className="h-0.5 w-10 bg-border" />
                      <ArrowRight className="h-4 w-4 text-muted-foreground -ml-1" />
                    </div>
                  )}
                  {!isLast && (
                    <div className="md:hidden h-6 w-0.5 bg-border my-1" aria-hidden="true" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Feature checklist */}
          <motion.div
            variants={staggerContainer}
            className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto"
          >
            {[
              "8-section structured reports",
              "APA citations included",
              "Configurable word count",
              "Research context injection",
              "Multi-format export",
              "Regeneration history",
            ].map((item) => (
              <motion.div
                key={item}
                variants={fadeUp}
                className="flex items-center gap-2.5 text-sm text-muted-foreground"
              >
                <CheckCircle2
                  className="h-4 w-4 text-green-500 shrink-0"
                  aria-hidden="true"
                />
                {item}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 5. STATISTICS SECTION                                              */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <AnimatedSection
        className="section-padding relative overflow-hidden"
        aria-label="Platform statistics"
      >
        {/* Background */}
        <div className="absolute inset-0 gradient-primary opacity-5 pointer-events-none" aria-hidden="true" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div variants={fadeUp} className="text-center mb-14 space-y-3">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
              By the numbers
            </Badge>
            <h2 className="heading-lg text-foreground">
              Trusted by{" "}
              <span className="gradient-text">Researchers Worldwide</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={scaleIn}
                  className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                    <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className={cn("text-3xl font-extrabold tracking-tight", stat.color)}>
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 6. TESTIMONIALS SECTION                                            */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <AnimatedSection
        className="section-padding bg-muted/30"
        aria-label="Testimonials"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} className="text-center mb-14 space-y-4">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
              Testimonials
            </Badge>
            <h2 className="heading-lg text-foreground">
              Loved by{" "}
              <span className="gradient-text">Researchers</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              See what academics and professionals say about their experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                custom={i}
                className="flex flex-col gap-4 rounded-2xl border bg-card p-6 hover:shadow-lg transition-shadow"
              >
                {/* Stars */}
                <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-sm text-muted-foreground leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-white text-sm font-bold shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 7. FAQ SECTION                                                     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <AnimatedSection
        className="section-padding"
        aria-label="Frequently asked questions"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} className="text-center mb-14 space-y-4">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
              FAQ
            </Badge>
            <h2 className="heading-lg text-foreground">
              Frequently Asked{" "}
              <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Everything you need to know before getting started.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Accordion className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border rounded-xl px-5 bg-card hover:border-primary/30 transition-colors"
                >
                  <AccordionTrigger className="text-left text-sm font-semibold py-4 hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* 8. CALL TO ACTION SECTION                                          */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <AnimatedSection
        className="section-padding"
        aria-label="Call to action"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={scaleIn}
            className="relative overflow-hidden rounded-3xl gradient-primary p-10 sm:p-14 text-center text-white shadow-2xl shadow-primary/30"
          >
            {/* Pattern overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }}
              aria-hidden="true"
            />
            <div
              className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-2xl -translate-y-1/2 translate-x-1/2"
              aria-hidden="true"
            />
            <div
              className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white/10 blur-2xl translate-y-1/2 -translate-x-1/2"
              aria-hidden="true"
            />

            <div className="relative z-10 space-y-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mx-auto">
                <Sparkles className="h-8 w-8 text-white" aria-hidden="true" />
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Ready to Accelerate Your Research?
                </h2>
                <p className="text-lg text-white/80 max-w-xl mx-auto">
                  Join 10,000+ researchers using AI to generate publication-grade reports in minutes. No credit card required.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={ROUTES.register}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-white text-primary text-base font-semibold hover:bg-white/90 shadow-lg transition-colors"
                  id="cta-section-primary"
                >
                  Create Free Account
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href={ROUTES.login}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg border border-white/30 text-white bg-transparent text-base font-medium hover:bg-white/10 transition-colors"
                  id="cta-section-secondary"
                >
                  Sign In
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm text-white/70">
                {[
                  "Free to start",
                  "AI-powered reports",
                  "Export in 3 formats",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-white/90" aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
}
