"use client";

import { useState } from "react";
import Link from "next/link";
import { Megaphone, X, Sparkle, Lightning, Gift } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n/provider";

export interface TickerItem {
  icon: "spark" | "bolt" | "gift";
  text: string;
  href: string;
}

const ICONS = {
  spark: Sparkle,
  bolt: Lightning,
  gift: Gift,
} as const;

/**
 * Anasayfa üstü kampanya/indirim şeridi — dikkat çeken, kapatılabilir, kayan
 * (marquee) bant. Sabit kampanya mesajları + (varsa) aktif promo kodu.
 * Mesajlar sürekli soldan sağa kayar; hover'da durur; X ile kapatılır.
 */
export function PromoTicker({ items }: { items: TickerItem[] }) {
  const [open, setOpen] = useState(true);
  const { t } = useI18n();
  if (!open || items.length === 0) return null;

  // Kesintisiz kayma için listeyi iki kez bas (marquee).
  const loop = [...items, ...items];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 text-white">
      <div className="container-page flex items-center gap-3 py-2">
        <span className="hidden shrink-0 items-center gap-1.5 text-xs font-bold uppercase tracking-wide sm:inline-flex">
          <Megaphone size={15} weight="fill" />
          {t("home.ticker.label")}
        </span>

        {/* Kayan içerik */}
        <div className="group relative flex-1 overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-8 group-hover:[animation-play-state:paused]">
            {loop.map((it, i) => {
              const Icon = ICONS[it.icon];
              return (
                <Link
                  key={i}
                  href={it.href}
                  className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-white/95 transition-opacity hover:opacity-100 hover:underline"
                >
                  <Icon size={16} weight="fill" className="text-white/90" />
                  {it.text}
                </Link>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={t("common.close")}
          className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-white/70 transition-colors hover:bg-white/15 hover:text-white"
        >
          <X size={15} weight="bold" />
        </button>
      </div>
    </div>
  );
}
