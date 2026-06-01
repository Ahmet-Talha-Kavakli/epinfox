"use client";

import { useMemo, useState } from "react";
import {
  TrendUp,
  TrendDown,
  ArrowCounterClockwise,
} from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar, NoMatch } from "@/components/account/filter-bar";
import { TransactionList, TXN_LABEL_KEYS } from "@/components/wallet/transaction-list";
import { Price } from "@/components/store/price";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import type { WalletTxnType } from "@/lib/supabase/types";
import type { WalletTransactionWithOrder } from "@/lib/actions/wallet";

type Filter = "all" | WalletTxnType;

export function TransactionsView({ txns }: { txns: WalletTransactionWithOrder[] }) {
  const { t } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: txns.length };
    for (const tx of txns) c[tx.type] = (c[tx.type] ?? 0) + 1;
    return c;
  }, [txns]);

  // Özet: toplam yükleme / toplam harcama / toplam iade
  const summary = useMemo(() => {
    let topup = 0;
    let spend = 0;
    let refund = 0;
    for (const tx of txns) {
      if (tx.type === "topup") topup += tx.amount;
      else if (tx.type === "purchase") spend += Math.abs(tx.amount);
      else if (tx.type === "refund") refund += tx.amount;
    }
    return { topup, spend, refund };
  }, [txns]);

  const chips = useMemo(() => {
    const order: Filter[] = [
      "all",
      "topup",
      "purchase",
      "refund",
      "donation",
      "adjustment",
    ];
    const labels: Record<Filter, string> = {
      all: t("acct.transactions.all"),
      topup: t(TXN_LABEL_KEYS.topup),
      purchase: t(TXN_LABEL_KEYS.purchase),
      refund: t(TXN_LABEL_KEYS.refund),
      donation: t(TXN_LABEL_KEYS.donation),
      adjustment: t(TXN_LABEL_KEYS.adjustment),
    };
    return order
      .filter((k) => k === "all" || (counts[k] ?? 0) > 0)
      .map((k) => ({ key: k, label: labels[k], count: counts[k] ?? 0 }));
  }, [counts, t]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return txns.filter((tx) => {
      if (filter !== "all" && tx.type !== filter) return false;
      if (!q) return true;
      const haystack = [tx.note, tx.product_name, t(TXN_LABEL_KEYS[tx.type])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [txns, filter, query, t]);

  if (txns.length === 0) {
    return (
      <EmptyState
        title={t("acct.transactions.empty.title")}
        description={t("acct.transactions.empty.desc")}
        cta={{ label: t("acct.transactions.empty.cta"), href: "/wallet" }}
      />
    );
  }

  const stats = [
    {
      label: t("acct.transactions.totalTopup"),
      value: summary.topup,
      icon: TrendUp,
      tone: "text-success-700",
      bg: "bg-success-50 ring-success-200 text-success-600",
    },
    {
      label: t("acct.transactions.totalSpend"),
      value: summary.spend,
      icon: TrendDown,
      tone: "text-ink-900",
      bg: "bg-brand-50 ring-brand-200 text-brand-600",
    },
    {
      label: t("acct.transactions.totalRefund"),
      value: summary.refund,
      icon: ArrowCounterClockwise,
      tone: "text-accent-700",
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
              <p className={cn("text-lg font-bold tracking-tight", s.tone)}>
                <Price amountTRY={s.value} />
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
        searchPlaceholder={t("acct.transactions.searchPlaceholder")}
      />
      {visible.length === 0 ? (
        <NoMatch />
      ) : (
        <Card className="border-ink-200">
          <CardContent className="px-4 py-2 sm:px-6">
            <TransactionList txns={visible} />
          </CardContent>
        </Card>
      )}
    </>
  );
}
