"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  CaretDown,
  MagnifyingGlass,
  ArrowRight,
  Sparkle,
  Storefront,
} from "@phosphor-icons/react";
import { Price } from "@/components/store/price";
import { useI18n } from "@/lib/i18n/provider";

/** Mega-menü için hafif ürün kaydı (layout'tan beslenir). */
export interface MegaProduct {
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
  minPrice: number;
  categoryId: number;
  featured?: boolean;
}

export interface MegaCategory {
  id: number;
  slug: string;
  name: string;
}

export function StoreMegaMenu({
  products,
  categories,
  label,
}: {
  products: MegaProduct[];
  categories: MegaCategory[];
  label?: string;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | "all">("all");
  const pathname = usePathname();
  const onStore = pathname.startsWith("/store");
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Dış tık + ESC ile kapan — sadece BUTON ve PANEL içi "içeride" sayılır;
  // backdrop dahil her yere tıklama menüyü kapatır.
  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node;
      const insideButton = btnRef.current?.contains(target);
      const insidePanel = panelRef.current?.contains(target);
      if (!insideButton && !insidePanel) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  // Açılınca arama kutusuna odaklan; kapanınca filtreleri sıfırla
  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
    setQuery("");
    setActiveCategory("all");
  }, [open]);

  // Sadece içinde ürün olan kategorileri say
  const catCounts = useMemo(() => {
    const m = new Map<number, number>();
    for (const p of products) m.set(p.categoryId, (m.get(p.categoryId) ?? 0) + 1);
    return m;
  }, [products]);

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== "all") {
      list = list.filter((p) => p.categoryId === activeCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q),
      );
    }
    return list;
  }, [products, activeCategory, query]);

  const featured = useMemo(
    () => products.filter((p) => p.featured).slice(0, 3),
    [products],
  );
  // featured yoksa ilk 3 ürünü öne çıkar
  const featuredList = featured.length ? featured : products.slice(0, 3);

  const activeCatName =
    activeCategory === "all"
      ? t("misc.mega.allProductsTitle")
      : (categories.find((c) => c.id === activeCategory)?.name ?? "");

  return (
    <div className="relative" ref={ref}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("misc.mega.menuAria")}
        aria-current={onStore ? "page" : undefined}
        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
          open
            ? "bg-brand-100 text-brand-800"
            : onStore
              ? "bg-brand-600 text-white shadow-soft"
              : "text-ink-700 hover:bg-ink-100 hover:text-ink-900"
        }`}
      >
        <Storefront size={17} weight="duotone" />
        {label ?? t("c3.megamenu.store")}
        <CaretDown
          size={12}
          weight="bold"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          {/* Tam ekran backdrop — panel dışına tıklayınca kapatır */}
          <div
            className="fixed inset-0 z-[70]"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            ref={panelRef}
            className="fixed inset-x-0 top-20 z-[80] px-4 md:px-6 animate-fade-in"
          >
            <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-float">
            {/* Arama */}
            <div className="flex items-center gap-3 border-b border-ink-200 px-5 py-4">
              <MagnifyingGlass size={18} weight="bold" className="text-ink-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("misc.mega.searchPlaceholder")}
                className="flex-1 bg-transparent text-base text-ink-900 placeholder:text-ink-400 focus:outline-none"
              />
              <kbd className="hidden items-center gap-1 rounded border border-ink-200 bg-ink-50 px-1.5 py-0.5 text-[10px] font-mono text-ink-500 sm:inline-flex">
                ESC
              </kbd>
            </div>

            <div className="grid max-h-[70vh] grid-cols-1 md:grid-cols-[210px_1fr]">
              {/* Kategoriler */}
              <aside className="overflow-y-auto border-b border-ink-200 p-3 md:border-b-0 md:border-r">
                <CategoryButton
                  active={activeCategory === "all"}
                  onClick={() => setActiveCategory("all")}
                  label={t("misc.mega.allProducts")}
                  count={products.length}
                />
                {categories.map((c) => {
                  const count = catCounts.get(c.id) ?? 0;
                  if (count === 0) return null;
                  return (
                    <CategoryButton
                      key={c.id}
                      active={activeCategory === c.id}
                      onClick={() => setActiveCategory(c.id)}
                      label={c.name}
                      count={count}
                    />
                  );
                })}
                <div className="mt-3 border-t border-ink-200 pt-3">
                  <Link
                    href="/store"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50"
                  >
                    {t("misc.mega.fullCatalog")}
                    <ArrowRight size={12} weight="bold" />
                  </Link>
                </div>
              </aside>

              {/* İçerik */}
              <div className="overflow-y-auto p-5">
                {!query && activeCategory === "all" && featuredList.length > 0 && (
                  <section className="mb-6">
                    <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-500">
                      <Sparkle size={12} weight="fill" className="text-accent-500" />
                      {t("misc.mega.featured")}
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {featuredList.map((p) => (
                        <Link
                          key={p.slug}
                          href={`/product/${p.slug}`}
                          onClick={() => setOpen(false)}
                          className="group block"
                        >
                          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-ink-200 bg-ink-50">
                            {p.image && (
                              <Image
                                src={p.image}
                                alt={p.name}
                                fill
                                sizes="(max-width: 640px) 100vw, 220px"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            )}
                          </div>
                          <div className="mt-2">
                            <p className="text-sm font-semibold text-ink-900 group-hover:text-brand-700">
                              {p.name}
                            </p>
                            <p className="line-clamp-1 text-xs text-ink-500">
                              {p.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                <section>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
                    {query
                      ? `${t("misc.mega.results")} (${filtered.length})`
                      : activeCatName}
                  </h3>
                  {filtered.length === 0 ? (
                    <p className="py-8 text-center text-sm text-ink-500">
                      {t("misc.mega.noMatch")}
                    </p>
                  ) : (
                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {filtered.map((p) => (
                        <li key={p.slug}>
                          <Link
                            href={`/product/${p.slug}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-ink-50"
                          >
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-ink-200 bg-ink-50">
                              {p.image && (
                                <Image
                                  src={p.image}
                                  alt={p.name}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-ink-900">
                                {p.name}
                              </p>
                              <p className="line-clamp-1 text-xs text-ink-500">
                                {p.description}
                              </p>
                            </div>
                            <Price
                              amountTRY={p.minPrice}
                              className="shrink-0 text-sm font-bold text-ink-700"
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            </div>
          </div>
          </div>
        </>
      )}
    </div>
  );
}

function CategoryButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
        active
          ? "bg-brand-100 font-semibold text-brand-800"
          : "text-ink-700 hover:bg-ink-50"
      }`}
    >
      <span className="truncate">{label}</span>
      <span
        className={`text-xs tabular-nums ${active ? "text-brand-700" : "text-ink-400"}`}
      >
        {count}
      </span>
    </button>
  );
}
