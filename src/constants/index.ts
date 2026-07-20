// ─── API ───────────────────────────────────────────────────────────────────
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ─── Routes ───────────────────────────────────────────────────────────────
export const ROUTES = {
  home: "/",
  about: "/about",
  contact: "/contact",
  help: "/help",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  research: "/research",
  ai: "/ai",
  chat: "/chat",
  profile: "/profile",
  settings: "/settings",
  unauthorized: "/unauthorized",
} as const;

// ─── Public nav links ─────────────────────────────────────────────────────
export const PUBLIC_NAV_LINKS = [
  { label: "Home", href: ROUTES.home },
  { label: "About", href: ROUTES.about },
  { label: "Contact", href: ROUTES.contact },
  { label: "Help", href: ROUTES.help },
] as const;

// ─── Authenticated nav links ──────────────────────────────────────────────
export const AUTH_NAV_LINKS = [
  { label: "Research", href: ROUTES.research },
  { label: "AI Assistant", href: ROUTES.ai },
  { label: "Dashboard", href: ROUTES.dashboard },
] as const;

// ─── Protected route prefixes (used by middleware) ────────────────────────
export const PROTECTED_PREFIXES = [
  "/dashboard",
  "/research",
  "/ai",
  "/chat",
  "/profile",
  "/settings",
] as const;

// ─── Auth route prefixes (redirect away when authenticated) ───────────────
export const AUTH_PREFIXES = ["/login", "/register"] as const;

// ─── Query Keys ───────────────────────────────────────────────────────────
export const QUERY_KEYS = {
  me: ["me"] as const,
  research: ["research"] as const,
  researchById: (id: string) => ["research", id] as const,
  aiHistory: ["ai-history"] as const,
  aiHistoryById: (id: string) => ["ai-history", id] as const,
  chatHistory: ["chat-history"] as const,
  chatMessages: (id: string) => ["chat-messages", id] as const,
  dashboardOverview: ["dashboard-overview"] as const,
  dashboardAnalytics: (range: string) => ["dashboard-analytics", range] as const,
  notifications: ["notifications"] as const,
  notificationUnreadCount: ["notifications-unread-count"] as const,
  bookmarks: ["bookmarks"] as const,
} as const;

// ─── Pagination defaults ──────────────────────────────────────────────────
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;

// ─── Research field options ───────────────────────────────────────────────
export const RESEARCH_STATUS_OPTIONS = ["Draft", "In Progress", "Completed"] as const;
export const RESEARCH_PRIORITY_OPTIONS = ["Low", "Medium", "High"] as const;
export const RESEARCH_VISIBILITY_OPTIONS = ["Public", "Private"] as const;

// ─── AI generation field options ─────────────────────────────────────────
export const AI_DIFFICULTY_OPTIONS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
] as const;

export const AI_RESEARCH_TYPE_OPTIONS = [
  "Quantitative",
  "Qualitative",
  "Mixed Methods",
  "Literature Review",
  "Case Study",
  "Experimental",
] as const;

export const AI_WRITING_STYLE_OPTIONS = [
  "Academic",
  "Technical",
  "Narrative",
  "Analytical",
  "Descriptive",
] as const;

// ─── Dashboard analytics range options ───────────────────────────────────
export const ANALYTICS_RANGE_OPTIONS = ["daily", "weekly", "monthly", "yearly"] as const;
