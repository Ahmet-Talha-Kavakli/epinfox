import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Newspaper,
  MagnifyingGlass,
  ArrowRight,
  Tag,
  CalendarBlank,
} from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/components/ui/card";
import { getAllNews, type NewsItem } from "@/lib/content";
import { getServerT, getServerLocale } from "@/lib/i18n/server";
import { intlLocale } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

/** NewsItem.tag (TR sabit) → i18n anahtarı. */
const TAG_KEY: Record<NewsItem["tag"], string> = {
  Güncelleme: "news.tag.update",
  Duyuru: "news.tag.announcement",
  Kampanya: "news.tag.campaign",
};

export const metadata: Metadata = {
  title: "Blog",
  description: "EpinFox güncellemeleri, duyurular, kampanyalar ve oyun haberleri.",
};

const TAG_META: Record<
  string,
  { chip: string; gradient: string }
> = {
  Güncelleme: {
    chip: "bg-brand-50 text-brand-700",
    gradient: "from-brand-500 to-brand-700",
  },
  Duyuru: {
    chip: "bg-ink-100 text-ink-600",
    gradient: "from-ink-600 to-ink-800",
  },
  Kampanya: {
    chip: "bg-accent-50 text-accent-700",
    gradient: "from-accent-500 to-accent-600",
  },
};

// Etiket çipleri — key varsa çevrilir, yoksa raw label gösterilir (marka/ortak terimler).
const TAGS: { label: string; key?: string }[] = [
  { label: "Steam Türkiye" },
  { label: "Oyun Haberleri", key: "news.tagchip.gameNews" },
  { label: "E-Pin" },
  { label: "Bonus", key: "news.tagchip.bonus" },
  { label: "Kampanya", key: "news.tagchip.campaign" },
  { label: "Güncelleme", key: "news.tagchip.update" },
];

function formatDate(iso: string, locale: Locale) {
  return new Date(iso).toLocaleDateString(intlLocale(locale), {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export default async function BlogPage() {
  const [t, locale] = await Promise.all([getServerT(), getServerLocale()]);
  const news = getAllNews(locale);
  // Kategorileri tag'lerden türet + sayıları hesapla (tag TR sabit kalır; etiket render'da çevrilir)
  const categories = Array.from(
    news.reduce(
      (m, n) => m.set(n.tag, (m.get(n.tag) ?? 0) + 1),
      new Map<NewsItem["tag"], number>(),
    ),
  );

  return (
    <div className="bg-[#f8fafc]">
      {/* ───────── HERO (tam genişlik · görsel arka planda · yazı sol overlay) ───────── */}
      <section className="relative overflow-hidden border-b border-ink-200/60">
        <Image
          src="/news/news-hero.png"
          alt={t("sup.news.heroAlt")}
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/10 sm:to-transparent"
          aria-hidden
        />
        <div className="container-page relative py-10 sm:py-12 lg:py-14">
          <div className="max-w-xl text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-sm font-medium text-accent-700">
              <Newspaper size={15} weight="fill" /> {t("sup.news.chip")}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              {t("sup.news.heroTitle")}
            </h1>
            <p className="mt-2 max-w-md text-ink-600">
              {t("sup.news.heroLead")}
            </p>
          </div>
        </div>
      </section>

      <section className="container-page grid grid-cols-1 gap-8 py-10 lg:grid-cols-[1fr_320px]">
        {/* SOL — haber kartları grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {news.map((n) => (
            <BlogCard key={n.slug} item={n} t={t} locale={locale} />
          ))}
        </div>

        {/* SAĞ — sidebar */}
        <aside className="space-y-6">
          {/* Arama */}
          <Card className="border-ink-200 p-4">
            <div className="flex items-center gap-2 rounded-xl border border-ink-200 bg-ink-50 px-3.5 py-2.5">
              <MagnifyingGlass size={18} weight="bold" className="text-ink-400" />
              <input
                type="text"
                placeholder={t("sup.news.searchPlaceholder")}
                className="w-full bg-transparent text-sm text-ink-700 placeholder:text-ink-400 focus:outline-none"
              />
            </div>
          </Card>

          {/* Kategoriler */}
          <Card className="border-ink-200 p-5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-900">
              {t("sup.news.categories")}
            </h2>
            <ul className="mt-3 space-y-2">
              {categories.map(([cat, count]) => {
                const meta = TAG_META[cat] ?? TAG_META["Duyuru"];
                return (
                  <li key={cat}>
                    <Link
                      href="/news"
                      className="flex items-center justify-between rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-ink-700 shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700 hover:shadow-float"
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className={`h-2.5 w-2.5 rounded-full bg-gradient-to-br ${meta.gradient}`}
                          aria-hidden
                        />
                        {t(TAG_KEY[cat])}
                      </span>
                      <span
                        className={`inline-flex min-w-[1.5rem] items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${meta.chip}`}
                      >
                        {count}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>

          {/* Etiketler */}
          <Card className="border-ink-200 p-5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-900">
              {t("sup.news.tags")}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <Link
                  key={tag.label}
                  href="/news"
                  className="inline-flex items-center gap-1 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                >
                  <Tag size={11} weight="fill" />
                  {tag.key ? t(tag.key) : tag.label}
                </Link>
              ))}
            </div>
          </Card>
        </aside>
      </section>
    </div>
  );
}

function BlogCard({ item, t, locale }: { item: NewsItem; t: (key: string) => string; locale: Locale }) {
  const meta = TAG_META[item.tag] ?? TAG_META["Duyuru"];
  return (
    <Link href={`/news/${item.slug}`} className="group block">
      <Card className="h-full overflow-hidden border-ink-200 p-0 transition-shadow hover:shadow-float">
        {/* Görsel alanı — gerçek 16:9 haber görseli */}
        <div className="relative aspect-[16/9] overflow-hidden bg-ink-50">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <span
            className={`absolute left-3 top-3 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold shadow-soft ${meta.chip}`}
          >
            {t(TAG_KEY[item.tag])}
          </span>
        </div>

        {/* İçerik */}
        <div className="p-5">
          <h2 className="text-base font-bold leading-snug text-ink-900 transition-colors group-hover:text-brand-700">
            {item.title}
          </h2>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-500">
            {item.summary}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-xs text-ink-400">
              <CalendarBlank size={13} weight="duotone" />
              {formatDate(item.date, locale)}
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-colors group-hover:text-brand-700">
              {t("sup.news.readMore")}
              <ArrowRight size={14} weight="bold" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
