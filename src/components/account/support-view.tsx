"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CaretRight,
  Tray,
  CheckCircle,
  Package,
  Wallet,
  ChatCircleDots,
  Question,
} from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar, NoMatch } from "@/components/account/filter-bar";
import { formatDateTime, cn } from "@/lib/utils";
import { TICKET_STATUS_META, TICKET_CATEGORIES } from "@/lib/support-meta";
import type { SupportTicket, TicketStatus } from "@/lib/supabase/types";
import { useI18n } from "@/lib/i18n/provider";

const CATEGORY_LABEL_KEY = Object.fromEntries(
  TICKET_CATEGORIES.map((c) => [c.value, c.labelKey]),
) as Record<string, string>;

/** Kategoriye göre duotone ikon + açık zeminli rozet — talep türü ayrışsın. */
const CATEGORY_META: Record<
  string,
  { icon: typeof Package; cls: string }
> = {
  order: { icon: Package, cls: "bg-brand-50 text-brand-600 ring-brand-200" },
  wallet: { icon: Wallet, cls: "bg-accent-50 text-accent-600 ring-accent-200" },
  general: { icon: ChatCircleDots, cls: "bg-ink-100 text-ink-500 ring-ink-200" },
  other: { icon: Question, cls: "bg-ink-100 text-ink-500 ring-ink-200" },
};

type Filter = "all" | TicketStatus;

const FILTER_LABEL_KEY: Record<Filter, string> = {
  all: "sup.tickets.filter.all",
  open: "sup.tickets.status.open",
  answered: "sup.tickets.status.answered",
  resolved: "sup.tickets.status.resolved",
  closed: "sup.tickets.status.closed",
};

export function SupportView({ tickets }: { tickets: SupportTicket[] }) {
  const { t, locale } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: tickets.length };
    for (const ticket of tickets) c[ticket.status] = (c[ticket.status] ?? 0) + 1;
    return c;
  }, [tickets]);

  const chips = useMemo(() => {
    const order: Filter[] = ["all", "open", "answered", "resolved", "closed"];
    return order
      .filter((k) => k === "all" || (counts[k] ?? 0) > 0)
      .map((k) => ({ key: k, label: t(FILTER_LABEL_KEY[k]), count: counts[k] ?? 0 }));
  }, [counts, t]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets.filter((ticket) => {
      if (filter !== "all" && ticket.status !== filter) return false;
      if (!q) return true;
      return ticket.subject.toLowerCase().includes(q);
    });
  }, [tickets, filter, query]);

  // Aktif (kapanmamış) ve çözülmüş talep sayıları.
  const openCount = useMemo(
    () => tickets.filter((t) => t.status === "open" || t.status === "answered").length,
    [tickets],
  );
  const doneCount = useMemo(
    () => tickets.filter((t) => t.status === "resolved" || t.status === "closed").length,
    [tickets],
  );

  if (tickets.length === 0) {
    return (
      <EmptyState
        title={t("sup.tickets.emptyTitle")}
        description={t("sup.tickets.emptyDesc")}
      />
    );
  }

  return (
    <>
      {/* Özet bandı */}
      <div className="mb-5 grid grid-cols-3 gap-4">
        <div className="flex items-center gap-3.5 rounded-2xl border border-ink-200 bg-white p-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink-100 text-ink-500 ring-1 ring-ink-200">
            <ChatCircleDots size={20} weight="duotone" />
          </span>
          <div>
            <p className="text-xs text-ink-500">{t("sup.tickets.totalLabel")}</p>
            <p className="text-lg font-bold text-ink-900">{tickets.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5 rounded-2xl border border-ink-200 bg-white p-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-200">
            <Tray size={20} weight="duotone" />
          </span>
          <div>
            <p className="text-xs text-ink-500">{t("sup.tickets.openLabel")}</p>
            <p className="text-lg font-bold text-ink-900">{openCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5 rounded-2xl border border-ink-200 bg-white p-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-success-50 text-success-600 ring-1 ring-success-200">
            <CheckCircle size={20} weight="duotone" />
          </span>
          <div>
            <p className="text-xs text-ink-500">{t("sup.tickets.doneLabel")}</p>
            <p className="text-lg font-bold text-ink-900">{doneCount}</p>
          </div>
        </div>
      </div>

      <FilterBar
        chips={chips}
        active={filter}
        onChange={setFilter}
        query={query}
        onQuery={setQuery}
        searchPlaceholder={t("sup.tickets.searchPlaceholder")}
      />
      {visible.length === 0 ? (
        <NoMatch />
      ) : (
        <Card className="divide-y divide-ink-100 border-ink-200">
          {visible.map((ticket) => {
            const st = TICKET_STATUS_META[ticket.status];
            const cat = CATEGORY_META[ticket.category] ?? CATEGORY_META.general;
            const CatIcon = cat.icon;
            return (
              <Link
                key={ticket.id}
                href={`/support/${ticket.id}`}
                className="flex items-center gap-3.5 p-4 transition-colors hover:bg-ink-50"
              >
                <span
                  className={cn(
                    "grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1",
                    cat.cls,
                  )}
                >
                  <CatIcon size={20} weight="duotone" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-900">
                    {ticket.subject}
                  </p>
                  <p className="mt-0.5 flex items-center gap-2 text-xs text-ink-400">
                    <span className="rounded bg-ink-100 px-1.5 py-0.5 font-medium text-ink-500">
                      {t(CATEGORY_LABEL_KEY[ticket.category] ?? "sup.tickets.cat.general")}
                    </span>
                    <span>{formatDateTime(ticket.updated_at, locale)}</span>
                  </p>
                </div>
                <span
                  className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ${st.cls}`}
                >
                  {t(st.statusKey)}
                </span>
                <CaretRight size={16} className="shrink-0 text-ink-300" />
              </Link>
            );
          })}
        </Card>
      )}
    </>
  );
}
