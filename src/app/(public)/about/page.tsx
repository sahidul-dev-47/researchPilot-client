import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about ResearchPilot — our mission, our story, our core values, and the technologies powering modern research.",
};

export default function AboutPage() {
  return <AboutClient />;
}
