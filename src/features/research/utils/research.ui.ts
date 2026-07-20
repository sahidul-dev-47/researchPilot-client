import type {
  ResearchStatus,
  ResearchPriority,
  ResearchVisibility,
} from "@/types/research";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";

/** Maps a research status to a badge variant + label color. */
export function statusBadge(status: ResearchStatus): {
  variant: BadgeVariant;
  label: string;
} {
  switch (status) {
    case "Completed":
      return { variant: "default", label: "Completed" };
    case "In Progress":
      return { variant: "secondary", label: "In Progress" };
    case "Draft":
    default:
      return { variant: "outline", label: "Draft" };
  }
}

/** Maps a research priority to a badge variant + color class. */
export function priorityBadge(priority: ResearchPriority): {
  variant: BadgeVariant;
  label: string;
  className: string;
} {
  switch (priority) {
    case "High":
      return {
        variant: "destructive",
        label: "High",
        className: "bg-destructive/10 text-destructive",
      };
    case "Medium":
      return {
        variant: "secondary",
        label: "Medium",
        className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      };
    case "Low":
    default:
      return {
        variant: "outline",
        label: "Low",
        className: "",
      };
  }
}

/** Returns the display label for a visibility value. */
export function visibilityLabel(visibility: ResearchVisibility): string {
  return visibility === "Public" ? "Public" : "Private";
}
