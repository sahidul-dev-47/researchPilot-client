import type { Metadata } from "next";
import { Shield, Lock, Eye, Database, Globe, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | ResearchPilot",
  description: "Learn how ResearchPilot collects, uses, and protects your personal data and research content.",
};

const sections = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    icon: Database,
    content: [
      {
        heading: "Account Information",
        text: "When you register, we collect your name, email address, and a securely hashed password. This information is required to create and maintain your account.",
      },
      {
        heading: "Research Content",
        text: "We store all research projects you create, including titles, descriptions, AI-generated content, and export files. This data is tied to your account and defaults to private visibility.",
      },
      {
        heading: "Usage Data",
        text: "We collect anonymized usage metrics such as page views, feature interactions, and session duration to improve platform performance and user experience.",
      },
      {
        heading: "AI Interaction Logs",
        text: "Chat sessions and AI generation requests are stored to provide conversation memory within the platform and to improve AI response quality. Logs are associated with your account.",
      },
    ],
  },
  {
    id: "how-we-use-your-data",
    title: "How We Use Your Data",
    icon: Eye,
    content: [
      {
        heading: "Platform Operation",
        text: "Your data powers the core ResearchPilot features: account authentication, research project management, AI report generation, and chat history retrieval.",
      },
      {
        heading: "Service Improvement",
        text: "Aggregated, anonymized usage data helps us identify performance bottlenecks and prioritize feature development. We do not sell individual usage data.",
      },
      {
        heading: "Communication",
        text: "We may use your email to send transactional notifications (password reset, account alerts) and, with your opt-in consent, product update newsletters.",
      },
    ],
  },
  {
    id: "data-storage-security",
    title: "Data Storage & Security",
    icon: Lock,
    content: [
      {
        heading: "Encryption",
        text: "All data transmitted between your browser and our servers is encrypted using TLS 1.3. Stored passwords are salted and hashed using bcrypt. Sensitive fields are encrypted at rest.",
      },
      {
        heading: "Infrastructure",
        text: "ResearchPilot is hosted on enterprise-grade cloud infrastructure with automatic backups, intrusion detection, and SOC 2-compliant security controls.",
      },
      {
        heading: "Retention",
        text: "Active accounts retain data indefinitely. If you delete your account, all personal data is permanently removed within 30 days. Anonymized aggregate metrics may be retained longer.",
      },
    ],
  },
  {
    id: "third-party-services",
    title: "Third-Party Services",
    icon: Globe,
    content: [
      {
        heading: "Google Gemini API",
        text: "AI report generation and chat responses are powered by Google Gemini 2.5 Flash. Your research prompts are sent to Google's API under their enterprise data processing terms. Google does not retain your prompts for model training without explicit consent.",
      },
      {
        heading: "Analytics",
        text: "We use privacy-first analytics tools that do not track individual users across sites. No third-party advertising networks have access to your data.",
      },
      {
        heading: "No Data Sales",
        text: "ResearchPilot does not sell, rent, or trade your personal information or research content to any third party for commercial purposes.",
      },
    ],
  },
  {
    id: "your-rights",
    title: "Your Rights",
    icon: Shield,
    content: [
      {
        heading: "Access & Portability",
        text: "You may request a complete export of all data associated with your account at any time by contacting support@researchpilot.ai.",
      },
      {
        heading: "Correction",
        text: "You can update your name, email, and profile information at any time through the Profile settings page.",
      },
      {
        heading: "Deletion",
        text: "You have the right to permanently delete your account and all associated data. This option is available in Profile → Settings → Danger Zone.",
      },
      {
        heading: "GDPR & CCPA",
        text: "If you are located in the European Economic Area or California, you have additional rights under GDPR and CCPA respectively. Contact us at privacy@researchpilot.ai to exercise these rights.",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact Us",
    icon: Mail,
    content: [
      {
        heading: "Privacy Inquiries",
        text: "For any questions or concerns about this Privacy Policy or our data practices, email us at privacy@researchpilot.ai. We commit to responding within 5 business days.",
      },
      {
        heading: "Policy Updates",
        text: "We may update this Privacy Policy periodically. When we make material changes, we will notify you by email and update the 'Last Updated' date at the top of this page. Continued use of the platform after notification constitutes acceptance of the updated policy.",
      },
    ],
  },
];

export default function PrivacyPage() {
  const lastUpdated = "July 20, 2025";

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative pt-24 pb-16 border-b bg-muted/20 overflow-hidden" aria-label="Privacy Policy header">
        <div className="pointer-events-none absolute inset-0 gradient-hero opacity-50" aria-hidden="true" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5">
          <Badge variant="outline" className="px-4 py-1.5 text-sm border-primary/30 bg-primary/10 text-primary hover:bg-primary/10">
            Last Updated: {lastUpdated}
          </Badge>
          <h1 className="heading-lg text-foreground font-extrabold">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            We are committed to protecting your privacy and being transparent about how we handle your data. Please read this policy carefully.
          </p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-12 border-b" aria-label="Table of contents">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-5">
            Contents
          </h2>
          <nav aria-label="Privacy policy sections">
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
      <section className="py-16" aria-label="Privacy policy content">
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
            <p className="text-sm font-semibold text-foreground">
              Questions about this policy?
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Contact our privacy team at{" "}
              <a href="mailto:privacy@researchpilot.ai" className="text-primary hover:underline font-medium">
                privacy@researchpilot.ai
              </a>{" "}
              or visit our{" "}
              <Link href={ROUTES.contact} className="text-primary hover:underline font-medium">
                Contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
