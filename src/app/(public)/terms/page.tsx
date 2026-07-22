import type { Metadata } from "next";
import { FileText, Users, Ban, Cpu, Gavel, MailOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | ResearchPilot",
  description: "Read the Terms and Conditions governing your use of the ResearchPilot platform.",
};

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    icon: FileText,
    content: [
      {
        heading: "Agreement",
        text: "By creating an account or using ResearchPilot in any capacity, you confirm that you are at least 13 years of age and agree to be bound by these Terms and Conditions. If you are using ResearchPilot on behalf of an organization, you represent that you have the authority to bind that organization to these terms.",
      },
      {
        heading: "Updates to Terms",
        text: "ResearchPilot reserves the right to modify these Terms at any time. Material changes will be communicated via email and/or a prominent in-app notice. Your continued use of the platform following notification constitutes acceptance of the revised Terms.",
      },
    ],
  },
  {
    id: "service-description",
    title: "Service Description",
    icon: Cpu,
    content: [
      {
        heading: "Platform Overview",
        text: "ResearchPilot is an AI-powered research management platform that enables users to create, organize, and export academic and professional research projects. Core features include AI report generation via Google OpenAI, an interactive AI chat assistant, and multi-format export (JSON, Markdown, PDF).",
      },
      {
        heading: "Service Availability",
        text: "We aim to maintain 99.5% uptime for all core features. Scheduled maintenance windows will be communicated with at least 24 hours advance notice. We are not liable for temporary unavailability caused by third-party service disruptions, including Google API outages.",
      },
      {
        heading: "Rate Limits",
        text: "AI report generation is limited to 5 requests per 15 minutes per account. Chat messages are limited to 30 per 15 minutes. These limits may be adjusted for premium plans. Circumventing rate limits through technical means is prohibited.",
      },
    ],
  },
  {
    id: "user-accounts",
    title: "User Accounts",
    icon: Users,
    content: [
      {
        heading: "Account Responsibility",
        text: "You are responsible for maintaining the confidentiality of your login credentials and for all activities conducted under your account. Notify us immediately at support@researchpilot.ai if you suspect unauthorized access.",
      },
      {
        heading: "Accurate Information",
        text: "You agree to provide accurate, current, and complete information during registration and to update your information as needed. Accounts created with false or misleading information may be suspended.",
      },
      {
        heading: "One Account Per User",
        text: "Each individual may maintain one personal ResearchPilot account. Creating multiple accounts to circumvent rate limits, suspensions, or other restrictions is prohibited and may result in all associated accounts being terminated.",
      },
    ],
  },
  {
    id: "prohibited-use",
    title: "Prohibited Use",
    icon: Ban,
    content: [
      {
        heading: "Academic Misconduct",
        text: "ResearchPilot is a productivity and drafting tool. Using AI-generated content without appropriate disclosure in academic submissions may violate your institution's academic integrity policies. Users are solely responsible for complying with their institution's guidelines.",
      },
      {
        heading: "Harmful Content",
        text: "You may not use ResearchPilot to generate, store, or distribute content that is illegal, defamatory, harassing, threatening, or that promotes violence, discrimination, or illegal activities.",
      },
      {
        heading: "System Abuse",
        text: "Reverse engineering, scraping, load-testing, or attempting to breach the security of ResearchPilot's infrastructure is strictly prohibited and may result in immediate account termination and legal action.",
      },
      {
        heading: "Spam and Automation",
        text: "Automated scripts or bots that submit AI generation requests, create accounts, or interact with the platform in ways not intended for human users are prohibited.",
      },
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    icon: Gavel,
    content: [
      {
        heading: "Your Content",
        text: "You retain ownership of all original content you input into ResearchPilot, including research prompts and manually written text. By submitting content, you grant ResearchPilot a limited license to process and store it solely to provide the platform services.",
      },
      {
        heading: "AI-Generated Content",
        text: "AI-generated research reports and chat responses are provided to you for your use. The copyright status of AI-generated content varies by jurisdiction. ResearchPilot makes no warranty about the copyrightability of AI outputs. Users are responsible for verifying compliance with applicable law.",
      },
      {
        heading: "ResearchPilot IP",
        text: "The ResearchPilot brand, logo, interface design, source code, and platform architecture are the exclusive property of ResearchPilot and are protected by copyright, trademark, and other applicable laws. You may not reproduce or distribute these without express written permission.",
      },
    ],
  },
  {
    id: "termination",
    title: "Termination & Liability",
    icon: MailOpen,
    content: [
      {
        heading: "Termination by User",
        text: "You may close your account at any time through Profile → Settings → Danger Zone. Upon closure, all personal data will be permanently deleted within 30 days.",
      },
      {
        heading: "Termination by ResearchPilot",
        text: "We reserve the right to suspend or terminate accounts that violate these Terms, with or without notice, depending on the severity of the violation.",
      },
      {
        heading: "Disclaimer of Warranties",
        text: "ResearchPilot is provided on an 'as-is' basis. We disclaim all warranties, express or implied, including fitness for a particular purpose. We do not guarantee that AI-generated content is accurate, complete, or suitable for submission in academic or professional contexts.",
      },
      {
        heading: "Limitation of Liability",
        text: "To the maximum extent permitted by law, ResearchPilot shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform, including data loss or inaccuracies in AI-generated content.",
      },
    ],
  },
];

export default function TermsPage() {
  const lastUpdated = "July 20, 2025";

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative pt-24 pb-16 border-b bg-muted/20 overflow-hidden" aria-label="Terms and Conditions header">
        <div className="pointer-events-none absolute inset-0 gradient-hero opacity-50" aria-hidden="true" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5">
          <Badge variant="outline" className="px-4 py-1.5 text-sm border-primary/30 bg-primary/10 text-primary hover:bg-primary/10">
            Last Updated: {lastUpdated}
          </Badge>
          <h1 className="heading-lg text-foreground font-extrabold">
            Terms &amp; <span className="gradient-text">Conditions</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Please read these Terms and Conditions carefully before using ResearchPilot. By using the platform, you agree to be bound by these terms.
          </p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-12 border-b" aria-label="Table of contents">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-5">Contents</h2>
          <nav aria-label="Terms sections">
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sections.map((section, idx) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-muted transition-colors group text-sm"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                      {section.title}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {/* Content */}
      <section className="py-16" aria-label="Terms content">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-14">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <article key={section.id} id={section.id} aria-labelledby={`heading-${section.id}`}>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-sm">
                    <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                  </div>
                  <h2 id={`heading-${section.id}`} className="text-xl font-bold text-foreground">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-5 pl-0 sm:pl-2">
                  {section.content.map((item) => (
                    <div key={item.heading} className="space-y-1.5">
                      <h3 className="text-sm font-semibold text-foreground">{item.heading}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}

          {/* Footer note */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center space-y-3">
            <p className="text-sm font-semibold text-foreground">Questions about these Terms?</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Contact our legal team at{" "}
              <a href="mailto:legal@researchpilot.ai" className="text-primary hover:underline font-medium">
                legal@researchpilot.ai
              </a>{" "}
              or visit our{" "}
              <Link href={ROUTES.contact} className="text-primary hover:underline font-medium">
                Contact page
              </Link>
              .
            </p>
            <p className="text-xs text-muted-foreground">
              Also see our{" "}
              <Link href="/privacy" className="text-primary hover:underline font-medium">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
