"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Crown,
  Receipt,
  TrendUp,
  Coins,
  Storefront,
  Check,
  CircleNotch,
  PencilSimple,
  Plugs,
  ArrowRight,
  Tag,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateResellerStore } from "@/lib/actions/reseller";
import { formatTL } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import { cn, intlLocale } from "@/lib/utils";
import type { ResellerTier } from "@/lib/supabase/types";

const TIER_META: Record<
  ResellerTier,
  { label: string; ring: string; next: ResellerTier | null }
> = {
  bronze: { label: "Bronze", ring: "from-amber-600 to-amber-800", next: "silver" },
  silver: { label: "Silver", ring: "from-slate-400 to-slate-600", next: "gold" },
  gold: { label: "Gold", ring: "from-yellow-400 to-amber-500", next: "platinum" },
  platinum: { label: "Platinum", ring: "from-cyan-400 to-blue-500", next: null },
};

export interface ResellerStats {
  orderCount: number;
  monthRevenue: number;
  totalRevenue: number;
  estimatedCommission: number;
}

export interface WholesaleRow {
  name: string;
  price: number;
  resellerPrice: number;
}

export function ResellerPanel({
  tier,
  discount,
  store,
  since,
  hasApiKey,
  stats,
  wholesale,
}: {
  tier: ResellerTier;
  discount: number;
  store: string;
  since: string | null;
  hasApiKey: boolean;
  stats: ResellerStats;
  wholesale: WholesaleRow[];
}) {
  const router = useRouter();
  const { t, locale } = useI18n();
  const [editStore, setEditStore] = useState(false);
  const [storeName, setStoreName] = useState(store);
  const [pending, start] = useTransition();
  const tm = TIER_META[tier];

  function saveStore() {
    start(async () => {
      const r = await updateResellerStore({ store: storeName });
      if (r.ok) {
        setEditStore(false);
        router.refresh();
      }
    });
  }

  const statCards = [
    { icon: Receipt, label: t("acct.reseller.stat.orders"), value: String(stats.orderCount), tone: "bg-brand-50 text-brand-600 ring-brand-200" },
    { icon: TrendUp, label: t("acct.reseller.stat.monthRevenue"), value: formatTL(stats.monthRevenue), tone: "bg-success-50 text-success-600 ring-success-200" },
    { icon: Coins, label: t("acct.reseller.stat.commission"), value: formatTL(stats.estimatedCommission), tone: "bg-accent-50 text-accent-600 ring-accent-200" },
    { icon: Storefront, label: t("acct.reseller.stat.totalRevenue"), value: formatTL(stats.totalRevenue), tone: "bg-ink-100 text-ink-500 ring-ink-200" },
  ];

  return (
    <div className="space-y-6">
      {/* Bayilik kademe kartı */}
      <div className="relative overflow-hidden rounded-2xl border border-ink-200 bg-gradient-to-br from-ink-900 to-ink-800 p-6 text-white">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/5 blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className={cn(
                "grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-soft",
                tm.ring,
              )}
            >
              <Crown size={28} weight="fill" />
            </span>
            <div>
              <p className="text-sm text-white/70">{t("acct.reseller.tierLabel")}</p>
              <p className="text-2xl font-extrabold">{tm.label}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/70">{t("acct.reseller.discountLabel")}</p>
            <p className="text-3xl font-extrabold text-brand-300">%{discount}</p>
          </div>
        </div>
        {tm.next ? (
          <p className="relative mt-4 rounded-xl bg-white/10 px-3 py-2 text-xs text-white/80">
            {t("acct.reseller.nextTier").replace("{tier}", TIER_META[tm.next].label)}
          </p>
        ) : (
          <p className="relative mt-4 rounded-xl bg-white/10 px-3 py-2 text-xs text-white/80">
            {t("acct.reseller.topTier")}
          </p>
        )}
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl border border-ink-200 bg-white p-4">
            <span className={cn("grid h-10 w-10 place-items-center rounded-xl ring-1", s.tone)}>
              <s.icon size={20} weight="duotone" />
            </span>
            <p className="mt-3 text-xl font-extrabold text-ink-900">{s.value}</p>
            <p className="text-xs text-ink-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Mağaza ayarları + API kısayolu */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-ink-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold text-ink-900">
              <Storefront size={18} weight="duotone" className="text-brand-500" />
              {t("acct.reseller.storeName")}
            </h3>
            {!editStore && (
              <button
                onClick={() => setEditStore(true)}
                className="grid h-8 w-8 place-items-center rounded-lg text-ink-500 hover:bg-ink-100"
                aria-label={t("acct.common.edit")}
              >
                <PencilSimple size={16} />
              </button>
            )}
          </div>
          {editStore ? (
            <div className="mt-3 flex gap-2">
              <Input
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                disabled={pending}
              />
              <Button onClick={saveStore} disabled={pending || storeName.trim().length < 2} size="sm">
                {pending ? <CircleNotch size={16} className="animate-spin" /> : <Check size={16} weight="bold" />}
              </Button>
            </div>
          ) : (
            <p className="mt-2 text-lg font-bold text-ink-900">{store}</p>
          )}
          {since && (
            <p className="mt-2 text-xs text-ink-400">
              {t("acct.reseller.since")}{" "}
              {new Date(since).toLocaleDateString(intlLocale(locale), {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        <Link
          href="/account/api"
          className="flex items-center justify-between rounded-2xl border border-ink-200 bg-white p-5 transition-colors hover:border-brand-300"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-200">
              <Plugs size={20} weight="duotone" />
            </span>
            <div>
              <p className="font-semibold text-ink-900">{t("acct.reseller.apiAccess")}</p>
              <p className="text-xs text-ink-500">
                {hasApiKey ? t("acct.reseller.apiActive") : t("acct.reseller.apiCreate")}
              </p>
            </div>
          </div>
          <ArrowRight size={18} className="text-ink-400" />
        </Link>
      </div>

      {/* Toptan fiyat listesi */}
      <div className="rounded-2xl border border-ink-200 bg-white p-5">
        <h3 className="flex items-center gap-2 font-semibold text-ink-900">
          <Tag size={18} weight="duotone" className="text-accent-500" />
          {t("acct.reseller.wholesaleTitle")}
        </h3>
        <p className="mt-1 text-xs text-ink-500">
          {t("acct.reseller.wholesaleDesc").replace("{discount}", String(discount))}
        </p>
        {wholesale.length === 0 ? (
          <p className="mt-4 text-sm text-ink-400">{t("acct.reseller.wholesaleEmpty")}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-left text-xs text-ink-400">
                  <th className="pb-2 font-medium">{t("acct.reseller.col.product")}</th>
                  <th className="pb-2 text-right font-medium">{t("acct.reseller.col.listPrice")}</th>
                  <th className="pb-2 text-right font-medium">{t("acct.reseller.col.resellerPrice")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {wholesale.map((w) => (
                  <tr key={w.name}>
                    <td className="py-2.5 font-medium text-ink-800">{w.name}</td>
                    <td className="py-2.5 text-right text-ink-400 line-through">
                      {formatTL(w.price)}
                    </td>
                    <td className="py-2.5 text-right font-bold text-success-700">
                      {formatTL(w.resellerPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
