import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about ResearchPilot — the AI-powered research management platform built for modern researchers.",
};

export default function AboutPage() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h1 className="heading-lg text-foreground">About ResearchPilot</h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          ResearchPilot is an AI-powered research management platform that
          helps academics, students, and professionals generate comprehensive
          research reports, manage projects, and collaborate with an intelligent
          assistant — all powered by Google Gemini 2.5 Flash.
        </p>
      </div>
    </section>
  );
}
