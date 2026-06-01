"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n/provider";

const POPULAR = ["PUBG", "Valorant", "Steam", "Discord", "Free Fire", "Spotify"];

export function SearchBar() {
  const { t } = useI18n();
  const router = useRouter();
  const [q, setQ] = useState("");

  function go(term: string) {
    const trimmed = term.trim();
    if (!trimmed) return;
    router.push(`/store?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="mx-auto mt-8 max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go(q);
        }}
        className="relative"
      >
        <MagnifyingGlass
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
        />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("c3.search.placeholder")}
          className="h-13 w-full rounded-full border border-ink-200 bg-white/90 pl-12 pr-28 text-[15px] text-ink-900 shadow-soft backdrop-blur placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          {t("c3.search.button")}
        </button>
      </form>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-ink-400">{t("c3.search.popular")}</span>
        {POPULAR.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => go(term)}
            className="rounded-full border border-ink-200 bg-white/70 px-3 py-1 text-xs font-medium text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-600"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
