import Link from "next/link";
import {
  GameController,
  Wallet,
  Crown,
  Sparkle,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { TONE_STYLES, getToneTextureStyle, type Tone } from "@/lib/card-tones";
import type { Category } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

const ICONS: Record<string, Icon> = {
  "oyun-epin": GameController,
  "platform-bakiye": Wallet,
  abonelik: Crown,
  "dijital-hizmet": Sparkle,
};

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((cat) => {
        const tone = (cat.tone as Tone) ?? "brand";
        const t = TONE_STYLES[tone];
        const CatIcon = ICONS[cat.slug] ?? Sparkle;
        return (
          <Link
            key={cat.id}
            href={`/store?category=${cat.slug}`}
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-2xl border border-l-[3px] border-ink-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1",
              t.stripe,
              t.hoverShadow,
            )}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-90"
              style={getToneTextureStyle(tone)}
              aria-hidden
            />
            <div className="relative flex flex-1 flex-col">
              <div
                className={cn(
                  "mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ring-1",
                  t.iconBg,
                  t.iconRing,
                )}
              >
                <CatIcon size={24} weight="duotone" className={t.iconColor} />
              </div>
              <h3 className="text-base font-semibold text-ink-900">{cat.name}</h3>
              {cat.description && (
                <p className="mt-1 line-clamp-2 text-sm text-ink-500">
                  {cat.description}
                </p>
              )}
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600">
                Keşfet
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
