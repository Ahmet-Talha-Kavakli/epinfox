"use client";

import { useMemo, useState } from "react";
import { FileText, Coins, CalendarBlank } from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar, NoMatch } from "@/components/account/filter-bar";
import { InvoiceRow } from "@/components/account/invoice-row";
import { Price } from "@/components/store/price";
import { cn } from "@/lib/utils";
import type { Invoice, InvoiceStatus } from "@/lib/supabase/types";
import { useI18n } from "@/lib/i18n/provider";

type Filter = "all" | InvoiceStatus;

const FILTER_LABEL_KEY: Record<Filter, string> = {
  all: "sup.invoices.filter.all",
  paid: "sup.invoices.status.paid",
  issued: "sup.invoices.status.issued",
  cancelled: "sup.invoices.status.cancelled",
};

export function InvoicesView({ invoices }: { invoices: Invoice[] }) {
  const { t } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: invoices.length };
    for (const i of invoices) c[i.status] = (c[i.status] ?? 0) + 1;
    return c;
  }, [invoices]);

  // Özet: toplam ödenen tutar + bu yıl kesilen belge sayısı.
  const summary = useMemo(() => {
    const year = new Date().getFullYear();
    let paidTotal = 0;
    let thisYear = 0;
    for (const i of invoices) {
      if (i.status === "paid") paidTotal += i.amount;
      if (new Date(i.created_at).getFullYear() === year) thisYear += 1;
    }
    return { paidTotal, thisYear, year };
  }, [invoices]);

  const chips = useMemo(() => {
    const order: Filter[] = ["all", "paid", "issued", "cancelled"];
    return order
      .filter((k) => k === "all" || (counts[k] ?? 0) > 0)
      .map((k) => ({ key: k, label: t(FILTER_LABEL_KEY[k]), count: counts[k] ?? 0 }));
  }, [counts, t]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return invoices.filter((i) => {
      if (filter !== "all" && i.status !== filter) return false;
      if (!q) return true;
      return (
        i.number.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
      );
    });
  }, [invoices, filter, query]);

  if (invoices.length === 0) {
    return (
      <EmptyState
        title={t("sup.invoices.emptyTitle")}
        description={t("sup.invoices.emptyDesc")}
        cta={{ label: t("sup.invoices.emptyCta"), href: "/store" }}
      />
    );
  }

  const stats = [
    {
      label: t("sup.invoices.statTotal"),
      value: String(invoices.length),
      icon: FileText,
      bg: "bg-brand-50 ring-brand-200 text-brand-600",
    },
    {
      label: t("sup.invoices.statPaid"),
      value: null as string | null,
      amount: summary.paidTotal,
      icon: Coins,
      bg: "bg-success-50 ring-success-200 text-success-600",
    },
    {
      label: t("sup.invoices.statYear").replace("{year}", String(summary.year)),
      value: String(summary.thisYear),
      icon: CalendarBlank,
      bg: "bg-accent-50 ring-accent-200 text-accent-600",
    },
  ];

  return (
    <>
      {/* Özet kartları */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3.5 rounded-2xl border border-ink-200 bg-white p-4"
          >
            <span
              className={cn(
                "grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1",
                s.bg,
              )}
            >
              <s.icon size={20} weight="duotone" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-ink-500">{s.label}</p>
              <p className="text-lg font-bold tracking-tight text-ink-900">
                {s.value ?? <Price amountTRY={s.amount!} />}
              </p>
            </div>
          </div>
        ))}
      </div>

      <FilterBar
        chips={chips}
        active={filter}
        onChange={setFilter}
        query={query}
        onQuery={setQuery}
        searchPlaceholder={t("sup.invoices.searchPlaceholder")}
      />
      {visible.length === 0 ? (
        <NoMatch />
      ) : (
        <Card className="divide-y divide-ink-100 border-ink-200">
          {visible.map((inv) => (
            <InvoiceRow key={inv.id} invoice={inv} />
          ))}
        </Card>
      )}
      <p className="mt-4 text-xs text-ink-400">
        {t("sup.invoices.legalNote")}
      </p>
    </>
  );
}
