import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Help Center",
  description:
    "Find answers to common questions about ResearchPilot features and usage.",
};

const helpItems = [
  {
    question: "How do I generate an AI research report?",
    answer:
      'Navigate to the AI Assistant section, click "Generate Report", fill in the research details including title, topic, category, and settings, then submit. The AI will generate a comprehensive report in seconds.',
  },
  {
    question: "What AI model does ResearchPilot use?",
    answer:
      "ResearchPilot uses Google Gemini 2.5 Flash — Google's latest and most capable AI model — for both research report generation and the interactive chat assistant.",
  },
  {
    question: "Can I export my research reports?",
    answer:
      "Yes! Research projects can be exported in three formats: JSON (structured data), Markdown (rich text), and PDF (publication-ready document).",
  },
  {
    question: "Is my research data private?",
    answer:
      "You control your data. Research projects default to Private visibility. You can set individual projects to Public to share them with the community.",
  },
  {
    question: "How does the AI chat assistant work?",
    answer:
      "The AI chat assistant is context-aware. You can start a general conversation or attach a research project for context-injected responses specific to your research.",
  },
  {
    question: "Are there rate limits on AI generation?",
    answer:
      "AI report generation is limited to 5 requests per 15 minutes per account. Chat messages are limited to 30 per 15 minutes. These limits ensure fair usage for all researchers.",
  },
];

export default function HelpPage() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary mx-auto">
            <HelpCircle className="h-7 w-7 text-white" aria-hidden="true" />
          </div>
          <h1 className="heading-lg text-foreground">Help Center</h1>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions about ResearchPilot.
          </p>
        </div>

        <Accordion className="space-y-2">
          {helpItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border rounded-xl px-5 bg-card"
            >
              <AccordionTrigger className="text-left text-sm font-semibold py-4 hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
