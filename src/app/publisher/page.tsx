import type { Metadata } from "next";
import Link from "next/link";
import {
  Broadcast,
  YoutubeLogo,
  TwitchLogo,
  TiktokLogo,
  InstagramLogo,
  GameController,
  HandHeart,
  Users,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { getPublishers, type Publisher } from "@/lib/content";
import { getServerT, getServerLocale } from "@/lib/i18n/server";
import { formatNumber } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Yayıncılar",
  description:
    "EpinFox ile iş birliği yapan içerik üreticileri. Sevdiğin yayıncıya bağış yap, destek ol.",
};

/** Hero 16:9 görseli — public/ içine eklenince otomatik kullanılır. */
const HERO_IMG = "/publisher-hero.png";

/** Platform → ikon + marka rengi. */
const PLATFORM: Record<
  Publisher["platform"],
  { icon: Icon; ring: string; text: string; bg: string }
> = {
  YouTube: {
    icon: YoutubeLogo,
    ring: "ring-red-200",
    text: "text-red-600",
    bg: "from-red-500 to-red-600",
  },
  Twitch: {
    icon: TwitchLogo,
    ring: "ring-purple-200",
    text: "text-purple-600",
    bg: "from-purple-500 to-purple-600",
  },
  Kick: {
    icon: GameController,
    ring: "ring-green-200",
    text: "text-green-600",
    bg: "from-green-500 to-green-600",
  },
  TikTok: {
    icon: TiktokLogo,
    ring: "ring-ink-300",
    text: "text-ink-800",
    bg: "from-ink-700 to-ink-900",
  },
  Instagram: {
    icon: InstagramLogo,
    ring: "ring-pink-200",
    text: "text-pink-600",
    bg: "from-pink-500 to-fuchsia-600",
  },
};

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function PublisherPage() {
  const [t, locale] = await Promise.all([getServerT(), getServerLocale()]);
  const publishers = getPublishers(locale);
  return (
    <div className="bg-[#f8fafc]">
      {/* ───────── HERO — yatay banner (responsive yükseklik; görsel bg-cover ile kırpılır) ───────── */}
      <section className="container-page pt-6">
        <div className="relative h-[clamp(220px,32vw,400px)] w-full overflow-hidden rounded-3xl border border-ink-200 shadow-card">
          {/* Hero görseli */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMG})` }}
            aria-hidden
          />
          {/* Metin okunabilirliği için yumuşak koyu overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/30"
            aria-hidden
          />

          {/* Overlay içerik — ortalanmış */}
          <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-semibold text-white backdrop-blur-sm ring-1 ring-white/30">
              <Broadcast size={16} weight="fill" /> {t("sup.publisher.chip")}
            </span>
            <h1 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-5xl">
              {t("sup.publisher.heroTitle")}
            </h1>
            <p className="mt-3 max-w-md text-sm text-white/80 sm:text-base">
              {t("sup.publisher.heroLead")}
            </p>
            <Link
              href="/publisher/apply"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-ink-900 shadow-soft transition-transform hover:scale-[1.03]"
            >
              <Broadcast size={18} weight="fill" className="text-brand-600" />
              {t("sup.publisher.applyCta")}
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── YAYINCI GRID ───────── */}
      <section className="container-page py-12">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-soft">
            <HandHeart size={20} weight="duotone" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-ink-900">{t("sup.publisher.gridTitle")}</h2>
            <p className="text-sm text-ink-500">{t("sup.publisher.gridSub")}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {publishers.map((p) => (
            <PublisherCard key={p.slug} publisher={p} t={t} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}

function PublisherCard({ publisher, t, locale }: { publisher: Publisher; t: (key: string) => string; locale: Locale }) {
  const meta = PLATFORM[publisher.platform];
  return (
    <Link
      href={`/publisher/${publisher.slug}`}
      className="group relative flex flex-col items-center rounded-2xl border border-ink-200 bg-white p-5 text-center shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
    >
      {/* Avatar — baş harfler, platform renginde */}
      <span
        className={`grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br ${meta.bg} text-lg font-bold text-white shadow-soft`}
      >
        {initials(publisher.name)}
      </span>

      <h3 className="mt-3 font-bold text-ink-900">{publisher.name}</h3>
      <p className="text-xs text-ink-400">{publisher.handle}</p>

      {/* Platform rozeti */}
      <span
        className={`mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-semibold ring-1 ${meta.ring} ${meta.text}`}
      >
        <meta.icon size={14} weight="fill" />
        {publisher.platform}
      </span>

      {/* Destekçi sayısı */}
      <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-ink-400">
        <Users size={12} weight="duotone" />
        {t("sup.publisher.supporters").replace("{count}", formatNumber(publisher.supporters, locale))}
      </span>

      {/* Bağış Yap — sadece kart hover olunca görünür (yumuşak geçiş) */}
      <span className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white opacity-0 transition-all duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
        <HandHeart size={15} weight="fill" />
        {t("sup.publisher.donate")}
      </span>
    </Link>
  );
}
