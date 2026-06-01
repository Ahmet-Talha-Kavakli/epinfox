"use client";

import { MagnifyingGlass } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export interface FilterChip<T extends string> {
  key: T;
  label: string;
  count?: number;
}

/** Çip filtreleri + opsiyonel arama. Hesap merkezi liste sayfaları için ortak. */
export function FilterBar<T extends string>({
  chips,
  active,
  onChange,
  query,
  onQuery,
  searchPlaceholder,
}: {
  chips: FilterChip<T>[];
  active: T;
  onChange: (key: T) => void;
  query?: string;
  onQuery?: (q: string) => void;
  searchPlaceholder?: string;
}) {
  const { t } = useI18n();
  const placeholder = searchPlaceholder ?? t("acct.filter.searchDefault");
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c.key}
            onClick={() => onChange(c.key)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              active === c.key
                ? "bg-brand-50 text-brand-700 ring-1 ring-brand-300"
                : "bg-ink-100 text-ink-600 hover:bg-ink-200",
            )}
          >
            {c.label}
            {typeof c.count === "number" && (
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs",
                  active === c.key
                    ? "bg-brand-200/60 text-brand-700"
                    : "bg-ink-200 text-ink-500",
                )}
              >
                {c.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {onQuery && (
        <div className="relative sm:w-64">
          <MagnifyingGlass
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <input
            value={query ?? ""}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={placeholder}
            className="h-10 w-full rounded-full border border-ink-200 bg-white pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
        </div>
      )}
    </div>
  );
}

/** Liste boşsa gösterilen "filtreyle eşleşmedi" satırı. */
export function NoMatch({ text }: { text?: string } = {}) {
  const { t } = useI18n();
  return (
    <p className="rounded-2xl border border-dashed border-ink-200 py-12 text-center text-sm text-ink-400">
      {text ?? t("acct.filter.noMatch")}
    </p>
  );
}
