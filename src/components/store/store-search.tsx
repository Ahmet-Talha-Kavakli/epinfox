"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n/provider";

/** Mağaza içi arama kutusu — mevcut filtreleri (kategori/sıralama/stok) korur. */
export function StoreSearch({ initial = "" }: { initial?: string }) {
  const { t } = useI18n();
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(initial);

  function submit(value: string) {
    const next = new URLSearchParams(params.toString());
    const t = value.trim();
    if (t) next.set("q", t);
    else next.delete("q");
    router.push(`/store?${next.toString()}`);
  }

  function clear() {
    setQ("");
    const next = new URLSearchParams(params.toString());
    next.delete("q");
    router.push(`/store?${next.toString()}`);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(q);
      }}
      className="relative"
    >
      <MagnifyingGlass
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
      />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("store.searchPlaceholder")}
        className="h-12 w-full rounded-2xl border border-ink-200 bg-white pl-11 pr-24 text-[15px] text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />
      {q && (
        <button
          type="button"
          onClick={clear}
          aria-label={t("store.searchClear")}
          className="absolute right-[4.5rem] top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-ink-400 hover:bg-ink-100"
        >
          <X size={15} />
        </button>
      )}
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
      >
        {t("store.searchSubmit")}
      </button>
    </form>
  );
}
