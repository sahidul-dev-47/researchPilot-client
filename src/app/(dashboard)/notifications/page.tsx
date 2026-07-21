import type { Metadata } from "next";
import NotificationsPage from "@/features/notifications/components/NotificationsPage";

export const metadata: Metadata = {
  title: "Notifications | ResearchPilot",
  description:
    "View and manage all your ResearchPilot notifications — research updates, AI report alerts, and system messages.",
};

export default function Page() {
  return <NotificationsPage />;
}
