import Link from "next/link";
import Image from "next/image";
import { Newspaper, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { NewsItem } from "@/lib/content";
import { intlLocale } from "@/lib/utils";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";

/** Görseli olan haber slug'ları (public/news/<slug>.png mevcut). */
const HAS_IMAGE = new Set([
  "hesap-merkezi-yenilendi",
  "referans-programi-basladi",
  "bildirim-sistemi",
  "hafta-sonu-bonus",
]);

/**
 * "Blogumuzdan" (Hipopotamya birebir düzen):
 * - görsel üstte (16:9), tam kaplar
 * - altında: tarih (küçük gri) → başlık (koyu, 2 satır) → "Devamını Oku →"
 * - beyaz kart, ince kenarlık, kompakt
 */
export function BlogStrip({
  items,
  locale = DEFAULT_LOCALE,
}: {
  items: NewsItem[];
  locale?: Locale;
}) {
  if (!items.length) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((n) => (
        <Link
          key={n.slug}
          href={`/news#${n.slug}`}
          className="group flex flex-col overflow-hidden rounded-xl border border-ink-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card"
        >
          {/* Görsel (varsa) / placeholder */}
          <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-brand-500/15 to-accent-600/15">
            {HAS_IMAGE.has(n.slug) ? (
              <Image
                src={`/news/${n.slug}.png`}
                alt={n.title}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="grid h-full w-full place-items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <Newspaper size={20} weight="duotone" className="text-brand-400" />
                  <span className="rounded bg-black/30 px-1.5 py-0.5 text-[10px] font-medium text-white/70">
                    görsel: news/{n.slug}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col p-3.5">
            <span className="text-[11px] text-ink-400">
              {new Date(n.date).toLocaleDateString(intlLocale(locale))}
            </span>
            <h3 className="mt-1 line-clamp-2 flex-1 text-[13px] font-semibold leading-snug text-ink-900 group-hover:text-brand-700">
              {n.title}
            </h3>
            <span className="mt-3 inline-flex items-center gap-1 text-[12px] text-ink-500 group-hover:text-brand-600">
              {DICTIONARIES[locale]["sup.news.readMore"] ??
                DICTIONARIES[DEFAULT_LOCALE]["sup.news.readMore"]}{" "}
              <ArrowRight size={12} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
