"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Bell, CheckCheck, SlidersHorizontal } from "lucide-react";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { NotificationList } from "@/features/notifications/components/NotificationList";
import { NotificationFilter } from "@/features/notifications/components/NotificationFilter";
import type { NotificationFilterValue } from "@/features/notifications/components/NotificationFilter";
import type { NotificationType } from "@/types/notification";

// ─── Pagination ────────────────────────────────────────────────────────────
const PAGE_SIZE = 8;

// ─── Sort ──────────────────────────────────────────────────────────────────
type SortOrder = "newest" | "oldest";

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useNotifications();

  // ── State ─────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<NotificationFilterValue>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Filter counts ─────────────────────────────────────────────────────────
  const counts = useMemo(() => ({
    all: notifications.length,
    unread: notifications.filter((n) => !n.isRead).length,
    read: notifications.filter((n) => n.isRead).length,
    Info: notifications.filter((n) => n.type === "Info").length,
    Alert: notifications.filter((n) => n.type === "Alert").length,
    System: notifications.filter((n) => n.type === "System").length,
  }), [notifications]);

  // ── Derived list: search → filter → sort → paginate ──────────────────────
  const filtered = useMemo(() => {
    let list = [...notifications];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.message.toLowerCase().includes(q)
      );
    }

    // Filter
    if (activeFilter === "unread") list = list.filter((n) => !n.isRead);
    else if (activeFilter === "read") list = list.filter((n) => n.isRead);
    else if (activeFilter === "Info" || activeFilter === "Alert" || activeFilter === "System") {
      list = list.filter((n) => n.type === (activeFilter as NotificationType));
    }

    // Sort
    list.sort((a, b) => {
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sortOrder === "newest" ? diff : -diff;
    });

    return list;
  }, [notifications, searchQuery, activeFilter, sortOrder]);

  // ── Pagination ────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Reset to page 1 on filter/search change
  function handleFilterChange(value: NotificationFilterValue) {
    setActiveFilter(value);
    setCurrentPage(1);
  }
  function handleSearch(value: string) {
    setSearchQuery(value);
    setCurrentPage(1);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-1"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent border border-border shadow-inner">
              <Bell className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                Notifications
              </h1>
              <p className="text-sm text-muted-foreground">
                {counts.unread > 0
                  ? `${counts.unread} unread notification${counts.unread !== 1 ? "s" : ""}`
                  : "You're all caught up"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Toolbar: Search + Sort ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          {/* Search */}
          <label className="relative flex-1" htmlFor="notification-search">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="notification-search"
              type="search"
              placeholder="Search notifications…"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-card pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
              aria-label="Search notifications by title or message"
            />
          </label>

          {/* Sort */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
            <select
              id="notification-sort"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as SortOrder);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
              aria-label="Sort notifications"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </motion.div>

        {/* ── Filters ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <NotificationFilter
            activeFilter={activeFilter}
            onChange={handleFilterChange}
            counts={counts}
          />
        </motion.div>

        {/* ── List ──────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          <NotificationList
            notifications={paginated}
            isLoading={isLoading}
            emptyMessage={
              searchQuery
                ? `No notifications matched "${searchQuery}". Try a different search.`
                : activeFilter === "all"
                  ? "No notifications available yet."
                  : `No ${activeFilter} notifications.`
            }
          />
        </motion.div>

        {/* ── Pagination ────────────────────────────────────────────────── */}
        {!isLoading && filtered.length > PAGE_SIZE && (
          <motion.nav
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-1.5 pt-2"
            aria-label="Notifications pagination"
          >
            {/* Previous */}
            <PaginationButton
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              aria-label="Previous page"
              id="pagination-prev"
            >
              ← Prev
            </PaginationButton>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (
                page === 1 ||
                page === totalPages ||
                (page >= safePage - 1 && page <= safePage + 1)
              ) {
                return (
                  <PaginationButton
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    isActive={safePage === page}
                    aria-label={`Go to page ${page}`}
                    aria-current={safePage === page ? "page" : undefined}
                    id={`pagination-page-${page}`}
                  >
                    {page}
                  </PaginationButton>
                );
              }
              if (page === safePage - 2 || page === safePage + 2) {
                return (
                  <span key={`ellipsis-${page}`} className="px-1 text-muted-foreground text-sm">
                    …
                  </span>
                );
              }
              return null;
            })}

            {/* Next */}
            <PaginationButton
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              aria-label="Next page"
              id="pagination-next"
            >
              Next →
            </PaginationButton>
          </motion.nav>
        )}

        {/* ── Result summary ────────────────────────────────────────────── */}
        {!isLoading && filtered.length > 0 && (
          <p className="text-center text-xs text-muted-foreground/60" aria-live="polite">
            Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} notification{filtered.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Pagination Button ────────────────────────────────────────────────────────
interface PaginationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  children: React.ReactNode;
}

function PaginationButton({ isActive, children, className, ...props }: PaginationButtonProps) {
  return (
    <button
      type="button"
      className={`
        flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-2.5 text-sm font-medium transition-all cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
        disabled:opacity-40 disabled:cursor-not-allowed
        ${isActive
          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
          : "text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border"
        }
        ${className ?? ""}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
