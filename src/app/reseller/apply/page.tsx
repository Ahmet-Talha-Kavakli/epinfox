import type { Metadata } from "next";
import Link from "next/link";
import {
  Storefront,
  Plugs,
  Tag,
  ShieldCheck,
  Lightning,
  ArrowRight,
  CheckCircle,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { getServerT } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Bayilik Başvuru",
  description:
    "EpinFox e-pin bayilik sistemi — toptan fiyat, API entegrasyonu ve anında teslimat. Bayilik programına başvur.",
};

const HERO_IMG = "/reseller-hero.png";
const BLOCK1_IMG = "/reseller-block-1.png";
const BLOCK2_IMG = "/reseller-block-2.png";
const CTA_IMG = "/reseller-cta.png";

const APPLY_HREF = "/account/reseller";

const ADVANTAGES: { icon: Icon; titleKey: string; textKey: string }[] = [
  { icon: Plugs, titleKey: "sup.reseller.adv1Title", textKey: "sup.reseller.adv1Text" },
  { icon: Tag, titleKey: "sup.reseller.adv2Title", textKey: "sup.reseller.adv2Text" },
  { icon: Lightning, titleKey: "sup.reseller.adv3Title", textKey: "sup.reseller.adv3Text" },
  { icon: Storefront, titleKey: "sup.reseller.adv4Title", textKey: "sup.reseller.adv4Text" },
];

const FAQ: { qKey: string; aKey: string }[] = [
  { qKey: "sup.reseller.faq1Q", aKey: "sup.reseller.faq1A" },
  { qKey: "sup.reseller.faq2Q", aKey: "sup.reseller.faq2A" },
  { qKey: "sup.reseller.faq3Q", aKey: "sup.reseller.faq3A" },
  { qKey: "sup.reseller.faq4Q", aKey: "sup.reseller.faq4A" },
  { qKey: "sup.reseller.faq5Q", aKey: "sup.reseller.faq5A" },
  { qKey: "sup.reseller.faq6Q", aKey: "sup.reseller.faq6A" },
];

export default async function ResellerApplyPage() {
  const t = await getServerT();
  return (
    <div className="bg-[#f8fafc]">
      {/* ───────── ÜST BANNER ───────── */}
      <section className="container-page pt-6">
        <div className="relative h-[clamp(200px,30vw,360px)] w-full overflow-hidden rounded-3xl border border-ink-200 shadow-card">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMG})` }}
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/30"
            aria-hidden
          />
          <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-semibold text-white backdrop-blur-sm ring-1 ring-white/30">
              <Storefront size={16} weight="fill" /> {t("sup.reseller.applyChip")}
            </span>
            <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-4xl">
              {t("sup.reseller.applyHeroTitle")}
            </h1>
            <Link
              href={APPLY_HREF}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-ink-900 shadow-soft transition-transform hover:scale-[1.03]"
            >
              <Storefront size={18} weight="fill" className="text-brand-600" />
              {t("sup.reseller.applyPage")}
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      <div className="container-page space-y-20 py-16">
        {/* ───────── BLOK 1 — E-Pin Bayilik Sistemi (sağda görsel) ───────── */}
        <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-brand-600">
              {t("sup.reseller.block1Kicker")}
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
              {t("sup.reseller.block1Title")}
            </h2>
            <p className="mt-4 leading-relaxed text-ink-600">
              {t("sup.reseller.block1Text")}
            </p>
            <Link
              href={APPLY_HREF}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border-2 border-ink-900 px-6 py-3 text-sm font-bold text-ink-900 transition-colors hover:bg-ink-900 hover:text-white"
            >
              {t("sup.reseller.applyPage")}
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
          <BlockImage src={BLOCK1_IMG} alt={t("sup.reseller.block1Alt")} />
        </section>

        {/* ───────── BLOK 2 — Neden E-Pin Bayiliği (solda görsel) ───────── */}
        <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <BlockImage src={BLOCK2_IMG} alt={t("sup.reseller.block2Alt")} className="lg:order-1" />
          <div className="lg:order-2">
            <p className="text-sm font-bold uppercase tracking-wide text-brand-600">
              {t("sup.reseller.block2Kicker")}
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
              {t("sup.reseller.block2Title")}
            </h2>
            <p className="mt-4 leading-relaxed text-ink-600">
              {t("sup.reseller.block2Text")}
            </p>
            {/* 4 avantaj */}
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              {ADVANTAGES.map((a) => (
                <div key={a.titleKey} className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-200">
                    <a.icon size={20} weight="duotone" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-ink-900">{t(a.titleKey)}</h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-500">
                      {t(a.textKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── İSTATİSTİK ───────── */}
        <section className="text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-brand-600">
            {t("sup.reseller.statsKicker")}
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {t("sup.reseller.statsTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-500">
            {t("sup.reseller.statsText")}
          </p>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2">
            <Stat big="0₺" title={t("sup.reseller.stat1Title")} text={t("sup.reseller.stat1Text")} />
            <Stat big="%100" title={t("sup.reseller.stat2Title")} text={t("sup.reseller.stat2Text")} />
          </div>
        </section>

        {/* ───────── SSS ───────── */}
        <section>
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-brand-600">
              {t("sup.reseller.faqKicker")}
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
              {t("sup.reseller.faqTitle")}
            </h2>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-2">
            {FAQ.map((f) => (
              <div key={f.qKey}>
                <h3 className="flex items-start gap-2 text-base font-bold text-ink-900">
                  <CheckCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-brand-500" />
                  {t(f.qKey)}
                </h3>
                <p className="mt-2 pl-6 text-sm leading-relaxed text-ink-500">
                  {t(f.aKey)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ───────── ALT CTA BANNER ───────── */}
      <section className="relative overflow-hidden">
        <div className="relative h-[clamp(260px,30vw,380px)] w-full">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${CTA_IMG})` }}
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/30"
            aria-hidden
          />
          <div className="container-page relative flex h-full flex-col items-start justify-center text-left">
            <h2 className="max-w-md text-2xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-3xl">
              {t("sup.reseller.ctaTitle")}
            </h2>
            <Link
              href={APPLY_HREF}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border-2 border-white px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-ink-900"
            >
              {t("sup.reseller.applyPage")}
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Alt bileşenler ─── */

function BlockImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-ink-200 bg-ink-100 shadow-card ${className}`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${src})` }}
        role="img"
        aria-label={alt}
      />
    </div>
  );
}

function Stat({
  big,
  title,
  text,
}: {
  big: string;
  title: string;
  text: string;
}) {
  return (
    <div>
      <p className="text-5xl font-extrabold tracking-tight text-ink-200 sm:text-6xl">
        {big}
      </p>
      <h3 className="mt-2 text-lg font-bold text-ink-900">{title}</h3>
      <p className="mt-1 text-sm text-ink-500">{text}</p>
    </div>
  );
}
