"use client";

import { useState, useRef, useEffect } from "react";
import { CaretDown, Check, X, Translate, Coins } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n/provider";
import {
  LOCALES,
  CURRENCIES,
  LOCALE_META,
  CURRENCY_META,
  type CurrencyCode,
} from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

const CURRENCY_NAME_KEY: Record<CurrencyCode, string> = {
  TRY: "c2.loc.try",
  USD: "c2.loc.usd",
  EUR: "c2.loc.eur",
  SAR: "c2.loc.sar",
  RUB: "c2.loc.rub",
};

export function LocaleSwitcher() {
  const { locale, currency, setLocale, setCurrency, t } = useI18n();
  const [open, setOpen] = useState(false);

  // Modal açıkken body scroll'u kilitle
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // ESC ile kapat
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:border-brand-300"
      >
        <span className="text-base leading-none">{LOCALE_META[locale].flag}</span>
        <span className="hidden sm:inline">{currency}</span>
        <CaretDown size={13} />
      </button>

      {open && (
        <Modal onClose={() => setOpen(false)} title={t("c2.loc.title")} closeLabel={t("c2.loc.close")}>
          {/* Dil */}
          <Section icon={<Translate size={15} weight="duotone" />} title={t("c2.loc.language")}>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {LOCALES.map((l) => {
                const active = locale === l;
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLocale(l)}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                      active
                        ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500/30"
                        : "border-ink-200 bg-white hover:border-brand-300",
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-xl leading-none">
                        {LOCALE_META[l].flag}
                      </span>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          active ? "text-brand-700" : "text-ink-800",
                        )}
                      >
                        {LOCALE_META[l].label}
                      </span>
                    </span>
                    {active && (
                      <Check size={18} weight="bold" className="text-brand-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Para birimi */}
          <Section
            icon={<Coins size={15} weight="duotone" />}
            title={t("c2.loc.currency")}
          >
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {CURRENCIES.map((c) => {
                const active = currency === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                      active
                        ? "border-accent-500 bg-accent-50 ring-1 ring-accent-500/30"
                        : "border-ink-200 bg-white hover:border-accent-300",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={cn(
                          "grid h-9 w-9 place-items-center rounded-lg text-base font-bold",
                          active
                            ? "bg-accent-100 text-accent-700"
                            : "bg-ink-100 text-ink-600",
                        )}
                      >
                        {CURRENCY_META[c].symbol}
                      </span>
                      <span>
                        <span
                          className={cn(
                            "block text-sm font-semibold",
                            active ? "text-accent-700" : "text-ink-900",
                          )}
                        >
                          {c}
                        </span>
                        <span className="block text-xs text-ink-400">
                          {t(CURRENCY_NAME_KEY[c])}
                        </span>
                      </span>
                    </span>
                    {active && (
                      <Check size={18} weight="bold" className="text-accent-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </Section>
        </Modal>
      )}
    </>
  );
}

function Modal({
  children,
  onClose,
  title,
  closeLabel,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
  closeLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (ref.current && !ref.current.contains(e.target as Node)) onClose();
      }}
    >
      <div
        ref={ref}
        className="w-full max-w-md animate-scale-in rounded-t-3xl border border-ink-200 bg-white p-5 shadow-float sm:rounded-3xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="grid h-9 w-9 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink-100"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 last:mb-0">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-400">
        {icon} {title}
      </p>
      {children}
    </div>
  );
}
