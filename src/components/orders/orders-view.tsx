"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlass, Receipt, Wallet, CalendarBlank } from "@phosphor-icons/react";
import { OrderRow } from "@/components/orders/order-row";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import type { OrderWithProduct } from "@/lib/actions/orders";
import type { OrderStatus } from "@/lib/supabase/types";

type Filter = "all" | OrderStatus;

const FILTERS: { key: Filter; labelKey: string }[] = [
  { key: "all", labelKey: "account.orders.filter.all" },
  { key: "completed", labelKey: "account.orders.filter.completed" },
  { key: "refunded", labelKey: "account.orders.filter.refunded" },
  { key: "failed", labelKey: "account.orders.filter.failed" },
];

export function OrdersView({
  orders,
  newOrderId,
}: {
  orders: OrderWithProduct[];
  newOrderId?: string;
}) {
  const { money, t } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  // Özet metrikler — sadece tamamlanan siparişlerin harcaması sayılır.
  const stats = useMemo(() => {
    const now = new Date();
    let spent = 0;
    let thisMonth = 0;
    for (const o of orders) {
      if (o.status === "completed") spent += o.price;
      const d = new Date(o.created_at);
      if (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth()
      )
        thisMonth += 1;
    }
    return { count: orders.length, spent, thisMonth };
  }, [orders]);

  // Yalnızca gerçekten kullanılan durum sekmelerini göster.
  const availableFilters = useMemo(() => {
    const present = new Set(orders.map((o) => o.status));
    return FILTERS.filter((f) => f.key === "all" || present.has(f.key));
  }, [orders]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== "all" && o.status !== filter) return false;
      if (!q) return true;
      return (
        o.product_name.toLowerCase().includes(q) ||
        (o.variant_label?.toLowerCase().includes(q) ?? false) ||
        o.id.replace(/-/g, "").toLowerCase().includes(q)
      );
    });
  }, [orders, filter, query]);

  return (
    <div className="space-y-6">
      {/* Özet bar */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={<Receipt size={20} weight="duotone" />}
          label={t("account.orders.stat.count")}
          value={String(stats.count)}
        />
        <StatCard
          icon={<Wallet size={20} weight="duotone" />}
          label={t("account.orders.stat.spent")}
          value={money(stats.spent)}
        />
        <StatCard
          icon={<CalendarBlank size={20} weight="duotone" />}
          label={t("account.orders.stat.thisMonth")}
          value={String(stats.thisMonth)}
        />
      </div>

      {/* Filtre + arama */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {availableFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                filter === f.key
                  ? "bg-brand-50 text-brand-700 ring-1 ring-brand-300"
                  : "bg-ink-100 text-ink-600 hover:bg-ink-200",
              )}
            >
              {t(f.labelKey)}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <MagnifyingGlass
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("account.orders.searchPlaceholder")}
            className="h-10 w-full rounded-full border border-ink-200 bg-white pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
        </div>
      </div>

      {/* Liste */}
      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink-200 py-12 text-center text-sm text-ink-400">
          {t("account.orders.noMatch")}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {visible.map((o) => (
            <OrderRow key={o.id} order={o} highlight={o.id === newOrderId} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-4">
      <div className="flex items-center gap-2 text-ink-400">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
        {value}
      </p>
    </div>
  );
}
