import type { Metadata } from "next";
import Link from "next/link";
import {
  Lightning,
  ShieldCheck,
  Wallet,
  Headset,
  Gift,
  Lock,
  Storefront,
  Trophy,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { LegalLayout, LegalH2 } from "@/components/legal/legal-layout";
import { getServerT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerT();
  return {
    title: t("pages.about.meta.title"),
    description: t("pages.about.meta.desc"),
  };
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-5 text-center shadow-soft">
      <p className="text-3xl font-extrabold text-brand-600">{value}</p>
      <p className="mt-1 text-sm text-ink-500">{label}</p>
    </div>
  );
}

export default async function AboutPage() {
  const t = await getServerT();

  const VALUES = [
    { icon: Lightning, title: t("pages.about.value1.title"), text: t("pages.about.value1.text") },
    { icon: ShieldCheck, title: t("pages.about.value2.title"), text: t("pages.about.value2.text") },
    { icon: Wallet, title: t("pages.about.value3.title"), text: t("pages.about.value3.text") },
    { icon: Headset, title: t("pages.about.value4.title"), text: t("pages.about.value4.text") },
    { icon: Gift, title: t("pages.about.value5.title"), text: t("pages.about.value5.text") },
    { icon: Lock, title: t("pages.about.value6.title"), text: t("pages.about.value6.text") },
  ];

  const STEPS = [
    { n: "01", icon: Wallet, title: t("pages.about.step1.title"), text: t("pages.about.step1.text") },
    { n: "02", icon: Storefront, title: t("pages.about.step2.title"), text: t("pages.about.step2.text") },
    { n: "03", icon: Lightning, title: t("pages.about.step3.title"), text: t("pages.about.step3.text") },
  ];

  return (
    <div className="bg-[#f8fafc]">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-ink-200/60 bg-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(55% 70% at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 60%), radial-gradient(40% 50% at 85% 20%, rgba(249,115,22,0.10) 0%, transparent 70%)",
          }}
          aria-hidden
        />
        <div className="container-page relative py-14 text-center sm:py-16">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-sm font-semibold text-brand-700">
            <Storefront size={16} weight="fill" /> {t("pages.about.badge")}
          </span>
          <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            {t("pages.about.heroTitle.pre")}{" "}
            <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
              {t("pages.about.heroTitle.accent")}
            </span>{" "}
            {t("pages.about.heroTitle.post")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-ink-500">
            {t("pages.about.heroDesc")}
          </p>

          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat value={t("pages.about.stat1.value")} label={t("pages.about.stat1.label")} />
            <Stat value={t("pages.about.stat2.value")} label={t("pages.about.stat2.label")} />
            <Stat value={t("pages.about.stat3.value")} label={t("pages.about.stat3.label")} />
            <Stat value={t("pages.about.stat4.value")} label={t("pages.about.stat4.label")} />
          </div>
        </div>
      </section>

      {/* DEĞERLER */}
      <section className="container-page py-14">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
            {t("pages.about.valuesTitle")}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-ink-500">
            {t("pages.about.valuesSubtitle")}
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-ink-200 bg-white p-6 shadow-soft transition-shadow hover:shadow-card"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-soft">
                <v.icon size={24} weight="duotone" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-ink-900">{v.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                {v.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section className="border-y border-ink-200/60 bg-white py-14">
        <div className="container-page">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
              {t("pages.about.stepsTitle")}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-ink-500">
              {t("pages.about.stepsSubtitle")}
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="relative rounded-2xl border border-ink-200 bg-ink-50/50 p-6"
              >
                <span className="absolute right-5 top-4 text-4xl font-extrabold text-ink-100">
                  {s.n}
                </span>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-brand-600 shadow-soft ring-1 ring-brand-100">
                  <s.icon size={24} weight="duotone" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink-900">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MİSYON metni — LegalLayout yapısı korunur */}
      <LegalLayout title={t("pages.about.mission.title")}>
        <p>{t("pages.about.mission.intro")}</p>

        <LegalH2>{t("pages.about.mission.h1")}</LegalH2>
        <p>{t("pages.about.mission.p1")}</p>

        <LegalH2>{t("pages.about.mission.h2")}</LegalH2>
        <p>{t("pages.about.mission.p2")}</p>

        <LegalH2>{t("pages.about.mission.h3")}</LegalH2>
        <p>{t("pages.about.mission.p3")}</p>
      </LegalLayout>

      {/* CTA */}
      <section className="container-page pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-8 text-center text-white shadow-card sm:p-10">
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-accent-500/30 blur-3xl"
            aria-hidden
          />
          <Trophy size={34} weight="duotone" className="mx-auto text-white" />
          <h2 className="mt-3 text-2xl font-bold">{t("pages.about.cta.title")}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/85">
            {t("pages.about.cta.desc")}
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/store"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-700 shadow-soft transition-colors hover:bg-ink-50"
            >
              <Storefront size={16} weight="fill" /> {t("pages.about.cta.store")}
              <ArrowRight size={15} weight="bold" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              <Headset size={16} weight="fill" /> {t("pages.about.cta.contact")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
