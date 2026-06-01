"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  MagnifyingGlass,
  Storefront,
  Receipt,
  Wallet,
  Headset,
  Question,
  Newspaper,
  Trophy,
  Package,
  ArrowRight,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

export interface PaletteProduct {
  slug: string;
  name: string;
  image: string | null;
  minPrice: number;
}

const PAGES = [
  { labelKey: "misc.palette.store", href: "/store", icon: Storefront, kw: "ürün store alışveriş" },
  { labelKey: "misc.palette.orders", href: "/orders", icon: Receipt, kw: "sipariş kod order" },
  { labelKey: "misc.palette.wallet", href: "/wallet", icon: Wallet, kw: "bakiye para yükle cüzdan" },
  { labelKey: "misc.palette.help", href: "/help", icon: Question, kw: "yardım sss destek nasıl" },
  { labelKey: "misc.palette.news", href: "/news", icon: Newspaper, kw: "haber duyuru güncelleme" },
  { labelKey: "misc.palette.raffles", href: "/raffles", icon: Trophy, kw: "çekiliş ödül kazan etkinlik" },
  { labelKey: "misc.palette.support", href: "/support", icon: Headset, kw: "destek talep ticket" },
];

function formatTL(n: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(n);
}

export function CommandPalette({ products }: { products: PaletteProduct[] }) {
  const { t } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl+K aç-kapa
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Header'daki arama düğmesinden de açılabilsin (custom event)
  useEffect(() => {
    function openHandler() {
      setOpen(true);
    }
    window.addEventListener("open-command-palette", openHandler);
    return () => window.removeEventListener("open-command-palette", openHandler);
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const query = q.trim().toLowerCase();

  const pageResults = useMemo(
    () =>
      PAGES.filter(
        (p) =>
          !query ||
          t(p.labelKey).toLowerCase().includes(query) ||
          p.kw.includes(query),
      ),
    [query, t],
  );

  const productResults = useMemo(() => {
    if (!query) return products.slice(0, 5);
    return products
      .filter((p) => p.name.toLowerCase().includes(query))
      .slice(0, 6);
  }, [products, query]);

  // Düz liste (klavye gezinmesi için)
  const flat = useMemo(
    () => [
      ...pageResults.map((p) => ({ type: "page" as const, href: p.href })),
      ...productResults.map((p) => ({
        type: "product" as const,
        href: `/product/${p.slug}`,
      })),
    ],
    [pageResults, productResults],
  );

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(flat.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flat[active];
      if (item) go(item.href);
    }
  }

  if (!open) return null;

  let idx = -1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 p-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="w-full max-w-xl animate-scale-in overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-float">
        {/* Arama girişi */}
        <div className="flex items-center gap-3 border-b border-ink-200 px-4">
          <MagnifyingGlass size={20} className="text-ink-400" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder={t("misc.palette.searchPlaceholder")}
            className="h-14 flex-1 bg-transparent text-[15px] text-ink-900 placeholder:text-ink-400 focus:outline-none"
          />
          <kbd className="hidden rounded-md border border-ink-200 bg-ink-50 px-1.5 py-0.5 text-[11px] font-medium text-ink-400 sm:block">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {flat.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-ink-400">
              {t("misc.palette.noResults")}
            </p>
          )}

          {/* Sayfalar */}
          {pageResults.length > 0 && (
            <div className="mb-1">
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                {t("misc.palette.pages")}
              </p>
              {pageResults.map((p) => {
                idx++;
                const i = idx;
                return (
                  <button
                    key={p.href}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(p.href)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                      active === i ? "bg-brand-50" : "hover:bg-ink-50",
                    )}
                  >
                    <p.icon size={18} weight="duotone" className="text-ink-500" />
                    <span className="flex-1 font-medium text-ink-800">
                      {t(p.labelKey)}
                    </span>
                    <ArrowRight size={14} className="text-ink-300" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Ürünler */}
          {productResults.length > 0 && (
            <div>
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                {t("misc.palette.products")}
              </p>
              {productResults.map((p) => {
                idx++;
                const i = idx;
                return (
                  <button
                    key={p.slug}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(`/product/${p.slug}`)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                      active === i ? "bg-brand-50" : "hover:bg-ink-50",
                    )}
                  >
                    <span className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-ink-100 text-ink-400">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt=""
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      ) : (
                        <Package size={16} weight="duotone" />
                      )}
                    </span>
                    <span className="flex-1 font-medium text-ink-800">
                      {p.name}
                    </span>
                    <span className="text-xs text-ink-400">
                      {formatTL(p.minPrice)}+
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
