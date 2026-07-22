"use client";

import { motion } from "framer-motion";
import {
  Target,
  Compass,
  Sparkles,
  Layers,
  Shield,
  Heart,
  ChevronRight,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const easeOut = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const coreValues = [
  {
    icon: Shield,
    title: "Academic Integrity",
    description: "Built-in anti-hallucination protocols and automatic APA reference collating ensure that research outputs are factual, traceable, and ready for peer evaluation.",
  },
  {
    icon: Sparkles,
    title: "Inference Velocity",
    description: "Leveraging Google OpenAI guarantees fast inference, processing long-context prompts and generating multi-section reports in seconds.",
  },
  {
    icon: Heart,
    title: "Accessibility",
    description: "Designing toolsets that are simple, responsive, and universally accessible. No steep learning curves, just structured results.",
  },
  {
    icon: Layers,
    title: "Data Sovereignty",
    description: "Your files and papers remain private by default. We respect IP rights and safeguard user data with enterprise-level encryption.",
  },
];

export default function AboutClient() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ─── HERO HEADER ────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-16 overflow-hidden bg-muted/20 border-b" aria-label="About Hero">
        <div className="absolute inset-0 gradient-primary opacity-5 pointer-events-none" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="px-4 py-1.5 text-sm border-primary/30 bg-primary/10 text-primary hover:bg-primary/10" variant="outline">
              Our Mission
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="heading-xl text-foreground font-extrabold"
          >
            Redefining Academic <br />
            <span className="gradient-text">Research Acceleration</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            ResearchPilot is built to dismantle the research bottlenecks that researchers face. 
            We combine high-speed generative AI with comprehensive workflow structures.
          </motion.p>
        </div>
      </section>

      {/* ─── MISSION & VISION ───────────────────────────────────────────────── */}
      <section className="py-20 border-b" aria-label="Mission and Vision">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="flex flex-col gap-4 p-8 rounded-3xl border bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary text-white shadow">
                <Target className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="heading-md text-foreground">Our Mission</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                To democratize the research landscape by providing students, professors, and business leaders with 
                advanced context-aware generation tools. We strive to reduce literature review overhead, enabling scholars 
                to invest their time where it matters most: reasoning, debating, and discovering.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="flex flex-col gap-4 p-8 rounded-3xl border bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary text-white shadow">
                <Compass className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="heading-md text-foreground">Our Vision</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                We envision a future where high-fidelity, peer-ready academic templates are available in seconds. 
                By pairing deep database search structures with generative model parameters, we pave the way for 
                hyper-personalized educational and empirical intelligence on a global scale.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── THE STORY ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-muted/20 border-b" aria-label="Our Story">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center space-y-3"
          >
            <h2 className="heading-lg text-foreground">The Origin Story</h2>
            <p className="text-muted-foreground">How ResearchPilot evolved into a reliable research assistant.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="prose dark:prose-invert max-w-none text-muted-foreground space-y-6 text-sm sm:text-base leading-relaxed"
          >
            <p>
              Academic exploration is one of humanity&apos;s most crucial endeavors, yet the administrative overhead of sourcing 
              methodologies, cross-referencing information sources, formatting citations, and compiling massive draft reviews 
              often eclipses the scientific breakthrough itself. Founded in late 2025, ResearchPilot was built by a collaborative 
              group of data scientists and researchers who grew frustrated by these repetitive processes.
            </p>
            <p>
              The challenge was twofold: language models were fast but prone to logical hallucinations and poor formatting, 
              while static databases were secure but sluggish and required manual assembly. We set out to bridge these gaps. 
              By designing a context-injection layer that seamlessly pairs active data models with the large-context capability 
              of OpenAI, we built a tool that provides structured, publication-grade frameworks.
            </p>
            <p>
              Today, ResearchPilot supports thousands of researchers globally. Whether it is a graduate student structuring their 
              thesis outline, or an enterprise team analyzing product trends, our system provides clean, structured, and citation-backed 
              templates, transforming the pace of information synthesis.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── TECHNOLOGY ───────────────────────────────────────────────────── */}
      <section className="py-20 border-b" aria-label="Technology Stack">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="space-y-6"
          >
            <h2 className="heading-lg text-foreground font-bold">
              Powered by <span className="gradient-text">OpenAI</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              ResearchPilot couples modern frontend engineering with state-of-the-art AI. 
              By calling Google&apos;s latest large-context model, the platform processes complex subject parameters, 
              formats output across 8 structured sections, and compiles dynamic APA citations instantly.
            </p>
            <ul className="space-y-3.5 text-sm font-medium text-foreground">
              {[
                "Large context processing window",
                "Advanced JSON schemas for structural integrity",
                "Asynchronous streaming for optimal client performance",
                "Lightweight rendering with Next.js App Router",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <ChevronRight className="h-3 w-3" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="glass-card rounded-3xl p-6 sm:p-8 border shadow-xl relative overflow-hidden"
          >
            {/* Tech details mockup */}
            <div className="flex items-center gap-2 mb-6 text-xs text-muted-foreground font-mono">
              <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />
              SYSTEM INFRASTRUCTURE OVERVIEW
            </div>
            <div className="space-y-4 font-mono text-xs text-muted-foreground">
              <div className="flex justify-between border-b pb-2">
                <span>Core Framework</span>
                <span className="text-foreground">Next.js 16 (App Router)</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Inference Engine</span>
                <span className="text-foreground">Google OpenAI API</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Styling / UI Component System</span>
                <span className="text-foreground">Tailwind CSS 4 / Radix Primitives</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Animation Library</span>
                <span className="text-foreground">Framer Motion 12</span>
              </div>
              <div className="flex justify-between">
                <span>Authentication Layer</span>
                <span className="text-foreground">Better Auth Integration</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CORE VALUES ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-muted/20" aria-label="Core Values">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="heading-lg text-foreground font-bold">Our Core Values</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              These simple guidelines represent our commitment to our users and the research community.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {coreValues.map((value) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  variants={fadeUp}
                  className="flex flex-col gap-3 p-6 rounded-2xl border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-foreground text-base">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
