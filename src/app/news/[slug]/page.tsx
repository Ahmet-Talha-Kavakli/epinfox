import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarBlank,
  Tag,
  ArrowRight,
  Eye,
} from "@phosphor-icons/react/dist/ssr";
import { getNews, getAllNews, NEWS, type NewsItem } from "@/lib/content";
import { NewsReactions } from "@/components/news/news-reactions";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getServerT, getServerLocale } from "@/lib/i18n/server";
import { intlLocale } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

/** NewsItem.tag (TR sabit) → i18n anahtarı. */
const TAG_KEY: Record<NewsItem["tag"], string> = {
  Güncelleme: "news.tag.update",
  Duyuru: "news.tag.announcement",
  Kampanya: "news.tag.campaign",
};

/** slug + tarihten deterministik, gerçekçi bir görüntülenme sayısı üret. */
function viewCount(item: NewsItem): number {
  let h = 0;
  for (let i = 0; i < item.slug.length; i++) {
    h = (h * 33 + item.slug.charCodeAt(i)) % 9973;
  }
  const daysOld = Math.max(
    1,
    Math.round(
      (new Date("2026-05-30").getTime() - new Date(item.date).getTime()) /
        86_400_000,
    ),
  );
  return 1200 + h * 3 + daysOld * 540;
}

export function generateStaticParams() {
  return NEWS.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getServerLocale();
  const n = getNews(slug, locale);
  if (!n) {
    const tt = await getServerT();
    return { title: tt("nf.news") };
  }
  return { title: n.title, description: n.summary };
}

const TAG_CHIP: Record<NewsItem["tag"], string> = {
  Güncelleme: "bg-brand-50 text-brand-700",
  Duyuru: "bg-ink-100 text-ink-600",
  Kampanya: "bg-accent-50 text-accent-700",
};

function formatDate(iso: string, locale: Locale) {
  return new Date(iso).toLocaleDateString(intlLocale(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getServerLocale();
  const item = getNews(slug, locale);
  if (!item) notFound();

  const currentUser = await getCurrentUser().catch(() => null);
  const t = await getServerT();

  // İlgili diğer haberler (kendisi hariç, en fazla 2) — çevirili liste
  const related = getAllNews(locale)
    .filter((n) => n.slug !== item.slug)
    .slice(0, 2);

  return (
    <article className="bg-[#f8fafc]">
      <div className="container-page max-w-3xl py-10">
        {/* Geri */}
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft size={16} weight="bold" /> {t("sup.news.backToBlog")}
        </Link>

        {/* Başlık bloğu */}
        <header className="mt-5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${TAG_CHIP[item.tag]}`}
          >
            <Tag size={12} weight="fill" />
            {t(TAG_KEY[item.tag])}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            {item.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-400">
            <span className="inline-flex items-center gap-1.5">
              <CalendarBlank size={15} weight="duotone" />
              {formatDate(item.date, locale)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye size={15} weight="duotone" />
              {t("sup.news.views").replace("{count}", viewCount(item).toLocaleString("tr-TR"))}
            </span>
          </div>
        </header>

        {/* Kapak görseli */}
        <div className="mt-7 overflow-hidden rounded-3xl ring-1 ring-ink-200/70">
          <Image
            src={item.image}
            alt={item.title}
            width={1280}
            height={720}
            priority
            className="h-auto w-full"
          />
        </div>

        {/* Gövde */}
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-700">
          <p className="text-xl font-medium text-ink-800">{item.summary}</p>
          <p>{item.body}</p>
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-2xl border border-ink-200 bg-white p-6 text-center shadow-soft">
          <p className="font-semibold text-ink-900">
            {t("sup.news.ctaTitle")}
          </p>
          <Link
            href="/store"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-soft transition-colors hover:bg-brand-700"
          >
            {t("sup.news.ctaButton")}
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>

        {/* Nasıl buldun? + Yorumlar */}
        <NewsReactions slug={item.slug} userName={currentUser?.nickname ?? null} />

        {/* İlgili haberler */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-bold text-ink-900">{t("sup.news.related")}</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {related.map((n) => (
                <Link
                  key={n.slug}
                  href={`/news/${n.slug}`}
                  className="group flex gap-4 rounded-2xl border border-ink-200 bg-white p-3 transition-shadow hover:shadow-soft"
                >
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={n.image}
                      alt={n.title}
                      fill
                      sizes="120px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${TAG_CHIP[n.tag]}`}
                    >
                      {t(TAG_KEY[n.tag])}
                    </span>
                    <h3 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-ink-900 transition-colors group-hover:text-brand-700">
                      {n.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
