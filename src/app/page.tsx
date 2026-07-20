"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useInView, animate } from "framer-motion";
import {
  Zap,
  Brain,
  BookOpen,
  BarChart3,
  MessageSquare,
  Download,
  ArrowRight,
  CheckCircle2,
  Star,
  ChevronDown,
  Search,
  FileText,
  Sparkles,
  Users,
  History,
  Globe,
  ArrowDown,
} from "lucide-react";
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

// ─── Animated Counter Component ───────────────────────────────────────────
function Counter({
  target,
  suffix = "",
  decimals = 0,
}: {
  target: number;
  suffix?: string;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (value) => {
        setCount(value);
      },
    });
    return () => controls.stop();
  }, [target, inView]);

  return (
    <span ref={ref}>
      {decimals === 0
        ? Math.floor(count).toLocaleString()
        : count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

// ─── Interactive Mock Report Builder (Hero Illustration) ────────────────
function AnimatedHeroIllustration() {
  const [step, setStep] = useState(0);
  const stepsText = [
    { label: "Define Project", value: "Neural Networks in Radiology Diagnostics" },
    { label: "Configure AI", value: "Academic Style, Expert Difficulty, Case Study Method" },
    { label: "Generating Report", value: "Drafting Section 3: Key Research Findings & APA Citations..." },
    { label: "Report Saved", value: "Generation complete. Ready to export PDF, Markdown & JSON." },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % stepsText.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [stepsText.length]);

  return (
    <div className="glass-card rounded-2xl p-5 shadow-2xl border text-left font-sans max-w-full">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500/80" aria-hidden="true" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" aria-hidden="true" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" aria-hidden="true" />
        </div>
        <div className="text-[10px] text-muted-foreground font-mono">
          workflow_demo.json
        </div>
      </div>
      <div className="space-y-4">
        {/* Step Indicator */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wider">
            Step {step + 1} of 4: {stepsText[step].label}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary animate-pulse font-mono">
            {step === 3 ? "Ready" : "Running"}
          </span>
        </div>

        {/* Input area mockup */}
        <div className="p-3.5 rounded-xl bg-muted/60 border space-y-2">
          <div className="text-[9px] text-muted-foreground uppercase font-mono tracking-wider">Parameters Active</div>
          <div className="text-xs sm:text-sm font-medium text-foreground min-h-[40px] transition-all duration-300 leading-relaxed">
            {stepsText[step].value}
          </div>
        </div>

        {/* Status bars */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Gemini report generation</span>
            <span className="font-semibold text-foreground font-mono">
              {step === 0 && "15%"}
              {step === 1 && "45%"}
              {step === 2 && "80%"}
              {step === 3 && "100%"}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full gradient-primary"
              initial={{ width: "15%" }}
              animate={{
                width: step === 0 ? "15%" : step === 1 ? "45%" : step === 2 ? "80%" : "100%",
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Section Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          <Badge variant={step >= 0 ? "default" : "secondary"} className="text-[9px] sm:text-[10px] transition-all">
            1. Executive Summary {step >= 0 && "✓"}
          </Badge>
          <Badge variant={step >= 1 ? "default" : "secondary"} className="text-[9px] sm:text-[10px] transition-all">
            2. Methodology {step >= 1 && "✓"}
          </Badge>
          <Badge variant={step >= 2 ? "default" : "secondary"} className="text-[9px] sm:text-[10px] transition-all">
            3. Key Findings {step >= 2 && "✓"}
          </Badge>
          <Badge variant={step >= 3 ? "default" : "secondary"} className="text-[9px] sm:text-[10px] transition-all">
            4. APA References {step >= 3 && "✓"}
          </Badge>
        </div>
      </div>
    </div>
  );
}

// ─── Data ──────────────────────────────────────────────────────────────────
const features = [
  {
    icon: Sparkles,
    title: "AI Research Generator",
    description:
      "Generate publication-grade, professionally structured research reports with Gemini 2.5 Flash in seconds.",
    badge: "Gemini 2.5 Flash",
  },
  {
    icon: MessageSquare,
    title: "AI Chat",
    description:
      "Engage with an intelligent chat assistant built for academic contexts. Query, explore concepts, and get references.",
    badge: "Interactive",
  },
  {
    icon: Brain,
    title: "Conversation Memory",
    description:
      "Seamless context tracking. The AI remembers preceding ideas, project parameters, and notes throughout your session.",
    badge: "Context-aware",
  },
  {
    icon: BookOpen,
    title: "Research Dashboard",
    description:
      "Organize all research projects in a clean grid. Track status, set low/high priorities, and change visibility easily.",
    badge: "Full CRUD",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Visualize research activities, token counts, and generation counts over daily, weekly, or monthly periods.",
    badge: "Visual Graphs",
  },
  {
    icon: History,
    title: "Research History",
    description:
      "Maintain a robust, version-controlled history of reports. Access drafts, past revisions, and export options.",
    badge: "Versioned",
  },
];

const workflowSteps = [
  {
    number: "01",
    icon: Search,
    title: "Create Research",
    description: "Start by entering your topic details, priority parameters, and visibility settings.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Generate AI",
    description: "Specify writing style, difficulty level, and methodology, then let Gemini draft your report.",
  },
  {
    number: "03",
    icon: FileText,
    title: "Review",
    description: "Read the structured sections, evaluate generated citations, and edit sections inline.",
  },
  {
    number: "04",
    icon: Download,
    title: "Save",
    description: "Save final drafts to your dashboard, download in Markdown, PDF, or JSON, and share.",
  },
];

const stats = [
  { target: 54200, suffix: "+", label: "Research Generated", icon: FileText, color: "text-primary" },
  { target: 1.2, suffix: "M+", decimals: 1, label: "AI Responses", icon: Sparkles, color: "text-secondary" },
  { target: 15800, suffix: "+", label: "Active Users", icon: Users, color: "text-accent" },
  { target: 120, suffix: "+", label: "Countries", icon: Globe, color: "text-primary" },
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
    q: "How does the AI Research Generator work?",
    a: "Specify your research topic, target academic level, writing style, and research methodology. Our platform uses Google Gemini 2.5 Flash to write structured, multi-section reports with citations.",
  },
  {
    q: "What AI model is used for generating reports?",
    a: "ResearchPilot is powered by Google Gemini 2.5 Flash, providing state-of-the-art inference speeds, deep context reasoning, and excellent structured writing performance.",
  },
  {
    q: "Can I chat directly with my research project context?",
    a: "Yes. The context-aware chat assistant allows you to import any of your projects directly into the conversation stream to generate hyper-contextualized research suggestions.",
  },
  {
    q: "How does the Conversation Memory feature work?",
    a: "The chat assistant automatically retains references, messages, and key facts across the conversation history so you don't have to re-explain context at each step.",
  },
  {
    q: "What export formats are supported?",
    a: "You can download any generated research project in three industry-standard configurations: PDF (publication-ready design), Markdown (for rich text editors), or JSON (for data integrations).",
  },
  {
    q: "Are there limits on how many reports I can generate?",
    a: "To ensure fair usage and robust API response rates, accounts are set to a baseline rate limit of 5 reports per 15 minutes and 30 chat requests per 15 minutes.",
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
          className="relative z-10 mt-16 w-full max-w-2xl mx-auto px-4"
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <AnimatedHeroIllustration />
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
      {/* 3. RESEARCH WORKFLOW SECTION                                       */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <AnimatedSection
        id="how-it-works"
        className="section-padding bg-muted/30"
        aria-label="Research workflow"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
              Streamlined Pipeline
            </Badge>
            <h2 className="heading-lg text-foreground">
              Research <span className="gradient-text">Workflow</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              A structured, four-step timeline from initial creation to final output.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative items-start">
            {workflowSteps.map((step, i) => {
              const Icon = step.icon;
              const isLast = i === workflowSteps.length - 1;
              return (
                <div key={step.number} className="relative flex flex-col items-center">
                  <motion.div
                    variants={fadeUp}
                    custom={i}
                    className="flex flex-col items-center text-center gap-4 group relative z-10 w-full"
                  >
                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform duration-300">
                        <Icon className="h-7 w-7 text-white" aria-hidden="true" />
                      </div>
                      <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold font-mono">
                        {step.number}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>

                  {/* Connectors */}
                  {!isLast && (
                    <>
                      {/* Desktop connector arrow (right) */}
                      <div className="hidden md:flex absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] items-center justify-center pointer-events-none" aria-hidden="true">
                        <ArrowRight className="h-5 w-5 text-muted-foreground/50 animate-pulse" />
                      </div>
                      {/* Mobile connector arrow (down) */}
                      <div className="md:hidden flex my-6 items-center justify-center pointer-events-none" aria-hidden="true">
                        <ArrowDown className="h-5 w-5 text-muted-foreground/50 animate-pulse" />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <motion.div variants={fadeUp} className="mt-16 text-center">
            <Link
              href={ROUTES.register}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg gradient-primary text-white font-semibold hover:opacity-90 shadow-lg shadow-primary/25 transition-opacity"
              id="how-it-works-cta"
            >
              Start Your First Project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
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
                    <p className={cn("text-3xl font-extrabold tracking-tight font-mono", stat.color)}>
                      <Counter target={stat.target} suffix={stat.suffix} decimals={stat.decimals || 0} />
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
