import type { Metadata } from "next";
import { Mail, MessageSquare, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the ResearchPilot team.",
};

export default function ContactPage() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <h1 className="heading-lg text-foreground">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Have questions, feedback, or need support? We&apos;d love to hear
            from you.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: Mail,
              title: "Email",
              value: "hello@researchpilot.ai",
              href: "mailto:hello@researchpilot.ai",
            },
            {
              icon: MessageSquare,
              title: "Support Chat",
              value: "Open a support ticket",
              href: "#",
            },
            {
              icon: MapPin,
              title: "Location",
              value: "Remote — Worldwide",
              href: null,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl border bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="font-semibold text-foreground">{item.title}</p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
