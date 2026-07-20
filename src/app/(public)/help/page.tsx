"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  HelpCircle,
  BookOpen,
  Brain,
  FlaskConical,
  UserCog,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ── Animation ───────────────────────────────────────────────────────────────
const easeOut = [0.25, 0.1, 0.25, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ── Category data ───────────────────────────────────────────────────────────
type Category = "all" | "getting-started" | "research" | "ai" | "account";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: Category;
}

const FAQ_ITEMS: FaqItem[] = [
  // Getting Started
  {
    id: "gs-1",
    question: "How do I create a ResearchPilot account?",
    answer:
      "Click the 'Get Started' button on the home page and fill out the registration form with your name, email, and a secure password. You will receive a confirmation email. Once verified, you can immediately access all ResearchPilot features.",
    category: "getting-started",
  },
  {
    id: "gs-2",
    question: "Is ResearchPilot free to use?",
    answer:
      "ResearchPilot offers a free tier that includes up to 5 AI-generated research reports per month, access to the AI chat assistant, and unlimited research project storage. Premium plans unlock unlimited report generation, priority processing, and advanced export formats.",
    category: "getting-started",
  },
  {
    id: "gs-3",
    question: "What browsers are supported?",
    answer:
      "ResearchPilot runs on all modern browsers: Chrome 100+, Firefox 100+, Safari 16+, and Edge 100+. We recommend Chrome or Edge for the best experience with real-time streaming AI features.",
    category: "getting-started",
  },
  {
    id: "gs-4",
    question: "How do I navigate the dashboard?",
    answer:
      "After logging in, the Dashboard shows your research overview, recent activity, and quick-access shortcuts. Use the sidebar to navigate to Research Projects, AI Assistant, Chat History, and Profile Settings.",
    category: "getting-started",
  },
  // Research
  {
    id: "r-1",
    question: "How do I create a new research project?",
    answer:
      "Go to the Research section and click 'New Research'. Provide a title, topic description, category, priority, and visibility setting. Projects are saved automatically as drafts until you are ready to publish or generate an AI report.",
    category: "research",
  },
  {
    id: "r-2",
    question: "Can I export research in different formats?",
    answer:
      "Yes. Research projects can be exported as JSON (structured data for developers), Markdown (rich text for documentation), or PDF (publication-ready document with APA citations). Export options appear in the project detail view.",
    category: "research",
  },
  {
    id: "r-3",
    question: "How do I edit an existing research project?",
    answer:
      "Open any research project and click the 'Edit' button at the top right. You can update the title, description, category, status, priority, and visibility. Changes are saved in real time.",
    category: "research",
  },
  {
    id: "r-4",
    question: "Is my research data private by default?",
    answer:
      "Yes. All new research projects are set to Private visibility by default. Only you can access private projects. You can switch a project to Public at any time to share it with the ResearchPilot community.",
    category: "research",
  },
  // AI
  {
    id: "ai-1",
    question: "How do I generate an AI research report?",
    answer:
      "Navigate to the AI Assistant section and click 'Generate Report'. Fill in the research title, topic, category, writing style, difficulty level, and research type, then submit. Gemini 2.5 Flash will generate a structured multi-section report in seconds.",
    category: "ai",
  },
  {
    id: "ai-2",
    question: "What AI model does ResearchPilot use?",
    answer:
      "ResearchPilot uses Google Gemini 2.5 Flash — Google's latest and most capable large-context AI model. It handles both research report generation (with APA citation formatting) and the interactive chat assistant.",
    category: "ai",
  },
  {
    id: "ai-3",
    question: "Are there rate limits on AI generation?",
    answer:
      "Yes. AI report generation is rate-limited to 5 requests per 15 minutes per account. Chat messages are limited to 30 per 15 minutes. These limits ensure fair usage for all researchers and maintain platform performance.",
    category: "ai",
  },
  {
    id: "ai-4",
    question: "How does the AI chat assistant remember context?",
    answer:
      "The chat assistant uses conversation memory. Each new chat session starts fresh, but within a session it retains full message history. You can also attach a research project to a chat session for context-injected responses specific to your work.",
    category: "ai",
  },
  // Account
  {
    id: "acc-1",
    question: "How do I update my profile information?",
    answer:
      "Go to the Profile page from the top navigation. You can update your display name, profile photo, and contact details. Changes are saved immediately.",
    category: "account",
  },
  {
    id: "acc-2",
    question: "How do I reset my password?",
    answer:
      "On the login page, click 'Forgot password'. Enter your registered email address and we will send you a secure reset link valid for 60 minutes.",
    category: "account",
  },
  {
    id: "acc-3",
    question: "Can I delete my account and all data?",
    answer:
      "Yes. Go to Profile → Settings → Danger Zone and click 'Delete Account'. This permanently removes your account, all research projects, chat history, and personal data. This action cannot be undone.",
    category: "account",
  },
];

const CATEGORIES = [
  { id: "all" as Category, label: "All Topics", icon: HelpCircle, count: FAQ_ITEMS.length },
  { id: "getting-started" as Category, label: "Getting Started", icon: BookOpen, count: FAQ_ITEMS.filter((f) => f.category === "getting-started").length },
  { id: "research" as Category, label: "Research", icon: FlaskConical, count: FAQ_ITEMS.filter((f) => f.category === "research").length },
  { id: "ai" as Category, label: "AI Features", icon: Brain, count: FAQ_ITEMS.filter((f) => f.category === "ai").length },
  { id: "account" as Category, label: "Account", icon: UserCog, count: FAQ_ITEMS.filter((f) => f.category === "account").length },
];

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      const matchesQuery =
        query.trim() === "" ||
        item.question.toLowerCase().includes(query.toLowerCase()) ||
        item.answer.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden bg-muted/20 border-b" aria-label="Help Center hero">
        <div className="pointer-events-none absolute inset-0 gradient-hero opacity-60" aria-hidden="true" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-lg mx-auto">
              <HelpCircle className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="heading-lg text-foreground font-extrabold"
          >
            Help <span className="gradient-text">Center</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto"
          >
            Find answers to common questions about ResearchPilot features, AI tools, and account management.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative max-w-lg mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
            <Input
              id="help-search"
              type="search"
              placeholder="Search for answers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-11 h-12 rounded-xl shadow-sm"
              aria-label="Search help articles"
            />
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 border-b" aria-label="Help categories">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-5 gap-3"
            role="tablist"
            aria-label="Filter help by category"
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  variants={fadeUp}
                  role="tab"
                  aria-selected={isActive}
                  id={`tab-${cat.id}`}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all duration-200 cursor-pointer",
                    isActive
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border bg-card hover:border-primary/30 hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span className="text-xs font-semibold leading-tight">{cat.label}</span>
                  <Badge variant={isActive ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
                    {cat.count}
                  </Badge>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16" aria-label="Frequently asked questions">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 space-y-3"
            >
              <Search className="h-10 w-10 text-muted-foreground mx-auto" aria-hidden="true" />
              <p className="text-foreground font-semibold">No results found</p>
              <p className="text-sm text-muted-foreground">
                Try a different search term or browse another category.
              </p>
              <Button variant="outline" onClick={() => { setQuery(""); setActiveCategory("all"); }} className="mt-2">
                Clear filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <Accordion className="space-y-3">
                {filtered.map((item) => (
                  <motion.div key={item.id} variants={fadeUp}>
                    <AccordionItem
                      value={item.id}
                      className="border rounded-xl px-5 bg-card hover:border-primary/30 transition-colors"
                    >
                      <AccordionTrigger className="text-left text-sm font-semibold py-4 hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </motion.div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-muted/20 border-t" aria-label="Still need help">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-4"
          >
            <motion.div variants={fadeUp} className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-lg mx-auto">
              <MessageSquare className="h-7 w-7 text-white" aria-hidden="true" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="heading-md text-foreground font-bold">
              Still need help?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground text-sm leading-relaxed">
              Our support team is available Monday through Friday, 9 AM – 6 PM EST. We aim to respond to all inquiries within one business day.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={ROUTES.contact}>
                <Button className="gradient-primary text-white hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 w-full sm:w-auto" id="help-contact-btn">
                  <ChevronRight className="h-4 w-4 mr-1.5" aria-hidden="true" />
                  Contact Support
                </Button>
              </Link>
              <Button variant="outline" className="w-full sm:w-auto" id="help-email-btn" render={<a href="mailto:support@researchpilot.ai" />}>
                Email Us Directly
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
