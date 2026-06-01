"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Receipt,
  Wallet,
  ShieldCheck,
  Gift,
  Question,
  ArrowUUpLeft,
  UserCircle,
  Plugs,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { Accordion } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import type { HelpSection } from "@/lib/content";
import { useI18n } from "@/lib/i18n/provider";

const ICONS: Record<string, Icon> = {
  Receipt,
  Wallet,
  ShieldCheck,
  Gift,
  ArrowUUpLeft,
  UserCircle,
  Plugs,
};

// Görseli olmayan bölümler için başlık bandı gradyanı (mavi/turuncu temaya uygun, mor yok).
const TONE_BANNER: Record<string, string> = {
  brand: "from-brand-600 to-brand-800",
  accent: "from-accent-500 to-accent-700",
  success: "from-success-600 to-success-700",
  danger: "from-danger-500 to-danger-700",
  info: "from-brand-500 to-brand-700",
  neutral: "from-ink-700 to-ink-900",
};

function highlight(text: string, q: string) {
  if (!q) return text;
  const idx = text.toLocaleLowerCase("tr").indexOf(q.toLocaleLowerCase("tr"));
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-accent-100 px-0.5 text-accent-800">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export function HelpBrowser({ sections }: { sections: HelpSection[] }) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const q = query.trim();

  // Aramaya göre filtrelenmiş bölümler (soru veya cevapta geçenler).
  const filtered = useMemo(() => {
    if (!q) return sections;
    const needle = q.toLocaleLowerCase("tr");
    return sections
      .map((s) => ({
        ...s,
        items: s.items.filter(
          (it) =>
            it.q.toLocaleLowerCase("tr").includes(needle) ||
            it.a.toLocaleLowerCase("tr").includes(needle),
        ),
      }))
      .filter((s) => s.items.length > 0);
  }, [sections, q]);

  const totalHits = filtered.reduce((n, s) => n + s.items.length, 0);

  return (
    <div className="space-y-8">
      {/* Arama kutusu */}
      <div className="sticky top-20 z-20 -mx-1 px-1">
        <div className="relative">
          <MagnifyingGlass
            size={20}
            weight="bold"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("sup.help.searchPlaceholder")}
            className="w-full rounded-2xl border border-ink-200 bg-white py-3.5 pl-12 pr-12 text-[15px] text-ink-900 shadow-card outline-none transition-colors placeholder:text-ink-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={t("sup.help.clearSearch")}
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
            >
              <X size={16} weight="bold" />
            </button>
          )}
        </div>
        {q && (
          <p className="mt-2 px-1 text-sm text-ink-500">
            {totalHits > 0
              ? t("sup.help.resultsCount").replace("{q}", q).replace("{count}", String(totalHits))
              : t("sup.help.noResultsFor").replace("{q}", q)}
          </p>
        )}
      </div>

      {/* Sonuç yok */}
      {q && filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-ink-200 bg-white p-10 text-center">
          <Question size={36} weight="duotone" className="mx-auto text-ink-300" />
          <p className="mt-3 font-semibold text-ink-800">
            {t("sup.help.noResultsTitle")}
          </p>
          <p className="mt-1 text-sm text-ink-500">
            {t("sup.help.noResultsDesc")}
          </p>
        </div>
      ) : (
        filtered.map((section) => {
          const Ico = ICONS[section.icon] ?? Question;
          return (
            <div
              key={section.slug}
              id={section.slug}
              className="scroll-mt-28 overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-card"
            >
              {/* Başlık bandı — görsel varsa görsel, yoksa tone gradyan */}
              <div className="relative h-24 w-full overflow-hidden sm:h-28">
                {section.image ? (
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                  />
                ) : (
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br",
                      TONE_BANNER[section.tone ?? "brand"],
                    )}
                  >
                    <Ico
                      size={120}
                      weight="duotone"
                      className="absolute -right-4 -top-3 text-white/15"
                    />
                  </div>
                )}
                {section.image && (
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-ink-900/80 via-ink-900/40 to-transparent"
                    aria-hidden
                  />
                )}
                <h2 className="absolute inset-y-0 left-0 flex items-center gap-2.5 p-5 text-xl font-extrabold tracking-tight text-white sm:p-6 sm:text-2xl">
                  <Ico size={24} weight="fill" className="text-white/90" />
                  {section.title}
                </h2>
              </div>

              <div className="p-5 sm:p-6">
                <Accordion
                  // arama varken eşleşmeleri vurgula ve hepsini aç; yoksa hepsi kapalı
                  key={q ? `q-${q}` : "all"}
                  items={section.items.map((it) => ({
                    q: highlight(it.q, q),
                    a: highlight(it.a, q),
                  }))}
                  defaultOpen={null}
                  allOpen={Boolean(q)}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
