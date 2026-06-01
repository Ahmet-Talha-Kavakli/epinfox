import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  YoutubeLogo,
  TwitchLogo,
  TiktokLogo,
  InstagramLogo,
  GameController,
  Users,
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { getPublisher, PUBLISHERS, type Publisher } from "@/lib/content";
import { DonationForm } from "@/components/publisher/donation-form";
import { getServerT, getServerLocale } from "@/lib/i18n/server";
import { formatNumber } from "@/lib/utils";

export function generateStaticParams() {
  return PUBLISHERS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getServerLocale();
  const p = getPublisher(slug, locale);
  if (!p) {
    const tt = await getServerT();
    return { title: tt("nf.publisher") };
  }
  return { title: `${p.name} — Bağış Yap`, description: p.bio };
}

const PLATFORM: Record<
  Publisher["platform"],
  { icon: Icon; ring: string; text: string; bg: string }
> = {
  YouTube: { icon: YoutubeLogo, ring: "ring-red-200", text: "text-red-600", bg: "from-red-500 to-red-600" },
  Twitch: { icon: TwitchLogo, ring: "ring-purple-200", text: "text-purple-600", bg: "from-purple-500 to-purple-600" },
  Kick: { icon: GameController, ring: "ring-green-200", text: "text-green-600", bg: "from-green-500 to-green-600" },
  TikTok: { icon: TiktokLogo, ring: "ring-ink-300", text: "text-ink-800", bg: "from-ink-700 to-ink-900" },
  Instagram: { icon: InstagramLogo, ring: "ring-pink-200", text: "text-pink-600", bg: "from-pink-500 to-fuchsia-600" },
};

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default async function PublisherDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getServerLocale();
  const publisher = getPublisher(slug, locale);
  if (!publisher) notFound();

  const meta = PLATFORM[publisher.platform];
  const t = await getServerT();

  return (
    <section className="container-page py-8">
      {/* Geri linki */}
      <Link
        href="/publisher"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-brand-600"
      >
        <ArrowLeft size={16} weight="bold" />
        {t("sup.publisher.allPublishers")}
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
        {/* SOL — yayıncı profili */}
        <div>
          <div className="overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-card">
            {/* Kapak gradyanı */}
            <div className={`h-28 bg-gradient-to-br ${meta.bg}`} />
            <div className="px-6 pb-6">
              {/* Avatar (kapağa biner) */}
              <div className="-mt-12 flex items-end gap-4">
                <span
                  className={`grid h-24 w-24 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${meta.bg} text-3xl font-bold text-white shadow-card ring-4 ring-white`}
                >
                  {initials(publisher.name)}
                </span>
                <div className="pb-1">
                  <h1 className="text-2xl font-extrabold text-ink-900">
                    {publisher.name}
                  </h1>
                  <p className="text-sm text-ink-400">{publisher.handle}</p>
                </div>
              </div>

              {/* Rozetler */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold ring-1 ${meta.ring} ${meta.text}`}
                >
                  <meta.icon size={14} weight="fill" />
                  {publisher.platform}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-600">
                  <Users size={13} weight="duotone" />
                  {t("sup.publisher.supporters").replace("{count}", formatNumber(publisher.supporters, locale))}
                </span>
              </div>

              {/* Bio */}
              <p className="mt-4 leading-relaxed text-ink-600">{publisher.bio}</p>

              {/* Kanal linki */}
              <a
                href={publisher.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              >
                <meta.icon size={16} weight="fill" />
                {t("sup.publisher.visitChannel")}
                <ArrowUpRight size={14} weight="bold" />
              </a>
            </div>
          </div>

          {/* Güven notu */}
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-500">
            <ShieldCheck size={18} weight="fill" className="shrink-0 text-success-600" />
            {t("sup.publisher.trustNote")}
          </div>
        </div>

        {/* SAĞ — bağış formu */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <DonationForm
            publisherSlug={publisher.slug}
            publisherName={publisher.name}
          />
        </div>
      </div>
    </section>
  );
}
