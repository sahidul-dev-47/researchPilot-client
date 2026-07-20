"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  ExternalLink,
  Globe,
  MessageCircle,
  GitBranch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const easeOut = [0.25, 0.1, 0.25, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const contactCards = [
  {
    icon: Mail,
    title: "Email Us",
    value: "hello@researchpilot.ai",
    description: "We typically respond within 24 hours.",
    href: "mailto:hello@researchpilot.ai",
  },
  {
    icon: Phone,
    title: "Phone Support",
    value: "+1 (800) 555-0192",
    description: "Mon-Fri, 9 AM - 6 PM EST",
    href: "tel:+18005550192",
  },
  {
    icon: MapPin,
    title: "Headquarters",
    value: "San Francisco, CA",
    description: "United States - Remote-first company",
    href: null,
  },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com", Icon: GitBranch },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: Globe },
  { label: "Twitter / X", href: "https://twitter.com", Icon: ExternalLink },
  { label: "Discord", href: "https://discord.com", Icon: MessageCircle },
];

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(_data: ContactFormValues) {
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-6 py-16 text-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-10 w-10" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">Message Received!</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            Thank you for reaching out. Our team will get back to you within 24 hours.
          </p>
        </div>
        <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-2" id="contact-send-another">
          Send Another Message
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate aria-label="Contact form">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="contact-name">Full Name</Label>
          <Input
            id="contact-name"
            placeholder="Dr. Jane Smith"
            {...register("name")}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={cn(errors.name && "border-destructive")}
          />
          {errors.name && <p id="name-error" className="text-xs text-destructive" role="alert">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact-email">Email Address</Label>
          <Input
            id="contact-email"
            type="email"
            placeholder="jane@university.edu"
            {...register("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn(errors.email && "border-destructive")}
          />
          {errors.email && <p id="email-error" className="text-xs text-destructive" role="alert">{errors.email.message}</p>}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="contact-subject">Subject</Label>
        <Input
          id="contact-subject"
          placeholder="How does AI report generation work?"
          {...register("subject")}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          className={cn(errors.subject && "border-destructive")}
        />
        {errors.subject && <p id="subject-error" className="text-xs text-destructive" role="alert">{errors.subject.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          rows={5}
          placeholder="Tell us more about your question or feedback..."
          {...register("message")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn("resize-none", errors.message && "border-destructive")}
        />
        {errors.message && <p id="message-error" className="text-xs text-destructive" role="alert">{errors.message.message}</p>}
      </div>
      <Button
        type="submit"
        className="w-full gradient-primary text-white hover:opacity-90 transition-opacity h-11 font-semibold shadow-lg shadow-primary/25"
        disabled={isSubmitting}
        id="contact-submit"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Sending
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="h-4 w-4" aria-hidden="true" />
            Send Message
          </span>
        )}
      </Button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <section className="relative pt-24 pb-16 overflow-hidden bg-muted/20 border-b" aria-label="Contact hero">
        <div className="pointer-events-none absolute inset-0 gradient-hero opacity-60" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <Badge variant="outline" className="px-4 py-1.5 text-sm border-primary/30 bg-primary/10 text-primary hover:bg-primary/10">
              We would love to hear from you
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="heading-lg text-foreground font-extrabold"
          >
            Get in <span className="gradient-text">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
          >
            Have a question about ResearchPilot, need technical support, or want to explore a partnership? Our team is ready to help.
          </motion.p>
        </div>
      </section>

      <section className="py-14 border-b" aria-label="Contact information">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-3 gap-5"
          >
            {contactCards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  variants={fadeUp}
                  className="flex flex-col items-center text-center gap-4 p-7 rounded-2xl border bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-md">
                    <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-base mb-1">{card.title}</p>
                    {card.href ? (
                      <a href={card.href} className="text-sm text-primary font-medium hover:underline">{card.value}</a>
                    ) : (
                      <p className="text-sm text-foreground font-medium">{card.value}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-20" aria-label="Contact form and location">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className="rounded-3xl border bg-card p-7 sm:p-10 shadow-sm"
            >
              <div className="mb-8 space-y-2">
                <h2 className="heading-md text-foreground font-bold">Send Us a Message</h2>
                <p className="text-sm text-muted-foreground">Fill out the form below and we will respond within one business day.</p>
              </div>
              <ContactForm />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className="flex flex-col gap-6"
            >
              <div
                className="relative h-72 lg:h-96 rounded-3xl border overflow-hidden bg-muted/40"
                aria-label="Office location map"
                role="img"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-lg">
                    <MapPin className="h-7 w-7 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">ResearchPilot HQ</p>
                    <p className="text-sm text-muted-foreground mt-1">San Francisco, California, USA</p>
                    <a
                      href="https://maps.google.com/?q=San+Francisco,+CA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage:
                      "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                  aria-hidden="true"
                />
              </div>

              <div className="rounded-2xl border bg-card p-6">
                <p className="text-sm font-semibold text-foreground mb-4">Connect With Us</p>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex items-center gap-3 p-3 rounded-xl border bg-muted/30 hover:bg-muted hover:border-primary/30 transition-all duration-200 group"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                      <span className="text-sm font-medium text-foreground">{label}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Quick Response Guarantee</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Our support team monitors inquiries 7 days a week. For urgent issues, use the live chat icon in the app.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}