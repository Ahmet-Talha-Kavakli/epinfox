"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  GameController,
  Wallet,
  Crown,
  Sparkle,
  SquaresFour,
  Lightning,
  type Icon,
} from "@phosphor-icons/react";
import type { Category } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

const CAT_ICONS: Record<string, Icon> = {
  "oyun-epin": GameController,
  "platform-bakiye": Wallet,
  abonelik: Crown,
  "dijital-hizmet": Sparkle,
};

const SORT_KEYS: { key: string; labelKey: string }[] = [
  { key: "popular", labelKey: "store.sortPopular" },
  { key: "cheap", labelKey: "store.sortCheap" },
  { key: "expensive", labelKey: "store.sortExpensive" },
  { key: "new", labelKey: "store.sortNew" },
];

export function StoreSidebar({
  categories,
  activeSlug,
  counts,
}: {
  categories: Category[];
  activeSlug?: string;
  counts?: { total: number; byCategory: Record<number, number> };
}) {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const sort = params.get("sort") ?? "popular";
  const inStock = params.get("stock") === "1";

  function update(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value === null) next.delete(key);
    else next.set(key, value);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  // Kategori linki: mevcut sıralama/stok filtrelerini korur
  function catHref(slug?: string) {
    const next = new URLSearchParams();
    if (slug) next.set("category", slug);
    if (sort !== "popular") next.set("sort", sort);
    if (inStock) next.set("stock", "1");
    const qs = next.toString();
    return `/store${qs ? `?${qs}` : ""}`;
  }

  return (
    <aside className="lg:sticky lg:top-24 lg:h-fit lg:self-start">
      {/* Kategoriler kutusu */}
      <div className="rounded-2xl border border-ink-200 bg-white p-4">
        <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-ink-400">
          {t("store.categories")}
        </h3>
        <nav className="space-y-1">
          <CatLink
            href={catHref()}
            icon={SquaresFour}
            label={t("store.allCategories")}
            active={!activeSlug}
            count={counts?.total}
          />
          {categories.map((c) => (
            <CatLink
              key={c.id}
              href={catHref(c.slug)}
              icon={CAT_ICONS[c.slug] ?? Sparkle}
              label={c.name}
              active={activeSlug === c.slug}
              count={counts?.byCategory[c.id]}
            />
          ))}
        </nav>
      </div>

      {/* Filtreler kutusu */}
      <div className="mt-4 rounded-2xl border border-ink-200 bg-white p-4">
        <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-ink-400">
          {t("store.sortHeading")}
        </h3>
        <div className="space-y-1">
          {SORT_KEYS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => update("sort", s.key === "popular" ? null : s.key)}
              className={cn(
                "block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                sort === s.key
                  ? "bg-brand-50 font-medium text-brand-700"
                  : "text-ink-600 hover:bg-ink-100",
              )}
            >
              {t(s.labelKey)}
            </button>
          ))}
        </div>

        <div className="mt-4 border-t border-ink-200 pt-4">
          <button
            type="button"
            onClick={() => update("stock", inStock ? null : "1")}
            className={cn(
              "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              inStock
                ? "bg-success-50 text-success-700"
                : "text-ink-600 hover:bg-ink-100",
            )}
          >
            <Lightning
              size={16}
              weight="fill"
              className={inStock ? "text-success-500" : "text-ink-400"}
            />
            {t("store.inStockOnly")}
          </button>
        </div>
      </div>
    </aside>
  );
}

function CatLink({
  href,
  icon: I,
  label,
  active,
  count,
}: {
  href: string;
  icon: Icon;
  label: string;
  active: boolean;
  count?: number;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active ? "bg-brand-600 text-white" : "text-ink-700 hover:bg-ink-100",
      )}
    >
      <I size={18} weight="duotone" />
      <span className="flex-1">{label}</span>
      {count != null && (
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
            active ? "bg-white/20 text-white" : "bg-ink-100 text-ink-500",
          )}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
