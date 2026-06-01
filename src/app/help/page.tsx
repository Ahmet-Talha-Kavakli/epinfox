import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Receipt,
  Wallet,
  ShieldCheck,
  Gift,
  Question,
  Headset,
  ArrowRight,
  ArrowUUpLeft,
  UserCircle,
  Plugs,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { HelpBrowser } from "@/components/help/help-browser";
import { getHelpSections } from "@/lib/content";
import { getServerT, getServerLocale } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Yardım Merkezi",
  description: "EpinFox kullanımı hakkında sık sorulan sorular ve rehberler.",
};

const ICONS: Record<string, Icon> = {
  Receipt,
  Wallet,
  ShieldCheck,
  Gift,
  ArrowUUpLeft,
  UserCircle,
  Plugs,
};

export default async function HelpPage() {
  const [t, locale] = await Promise.all([getServerT(), getServerLocale()]);
  const helpSections = getHelpSections(locale);
  return (
    <div className="bg-[#f8fafc]">
      {/* ───────── HERO (tam genişlik · görsel arka planda · yazı sol overlay) ───────── */}
      <section className="relative overflow-hidden border-b border-ink-200/60">
        <Image
          src="/help/help-hero.png"
          alt={t("sup.help.heroAlt")}
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/10 sm:to-transparent"
          aria-hidden
        />
        <div className="container-page relative py-12 sm:py-14 lg:py-16">
          <div className="max-w-xl text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
              <Question size={15} weight="fill" /> {t("sup.help.chip")}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              {t("sup.help.heroTitle")}
            </h1>
            <p className="mt-3 max-w-md text-ink-600">
              {t("sup.help.heroLead")}
            </p>

            {/* Kategori hızlı geçiş çipleri */}
            <div className="mt-6 flex flex-wrap gap-2">
              {helpSections.map((s) => {
                const Ico = ICONS[s.icon] ?? Question;
                return (
                  <a
                    key={s.slug}
                    href={`#${s.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-ink-700 shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700"
                  >
                    <Ico size={15} weight="duotone" className="text-brand-600" />
                    {s.title}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Arama + bölümler ───────── */}
      <section className="container-page max-w-4xl py-12">
        <HelpBrowser sections={helpSections} />
      </section>

      {/* ───────── Hâlâ yardım gerekiyorsa ───────── */}
      <section className="container-page max-w-4xl pb-16">
        <Card className="relative overflow-hidden border-ink-200 bg-gradient-to-br from-brand-600 to-brand-700 p-8 text-center text-white">
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-500/30 blur-3xl"
            aria-hidden
          />
          <Headset size={32} weight="duotone" className="mx-auto text-white" />
          <h2 className="mt-3 text-xl font-bold">{t("sup.help.stillNeedTitle")}</h2>
          <p className="mt-1.5 text-sm text-white/85">
            {t("sup.help.stillNeedDesc")}
          </p>
          <Link
            href="/support"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-700 shadow-soft transition-colors hover:bg-ink-50"
          >
            <Headset size={16} weight="fill" /> {t("sup.help.createTicket")}
            <ArrowRight size={15} weight="bold" />
          </Link>
        </Card>
      </section>
    </div>
  );
}
