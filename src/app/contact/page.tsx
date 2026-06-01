import type { Metadata } from "next";
import Link from "next/link";
import {
  EnvelopeSimple,
  ChatCircleDots,
  Clock,
  Phone,
  Headset,
  Buildings,
  ArrowRight,
  Question,
} from "@phosphor-icons/react/dist/ssr";
import { LegalInfoTable } from "@/components/legal/legal-layout";
import { SITE } from "@/config/site";
import { getServerT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerT();
  return {
    title: t("pages.contact.meta.title"),
    description: t("pages.contact.meta.desc"),
  };
}

export default async function ContactPage() {
  const t = await getServerT();

  const channels = [
    {
      icon: ChatCircleDots,
      title: t("pages.contact.channel.live.title"),
      value: t("pages.contact.channel.live.value"),
      desc: t("pages.contact.channel.live.desc"),
    },
    {
      icon: Headset,
      title: t("pages.contact.channel.support.title"),
      value: t("pages.contact.channel.support.value"),
      href: "/support",
      desc: t("pages.contact.channel.support.desc"),
    },
    {
      icon: EnvelopeSimple,
      title: t("pages.contact.channel.email.title"),
      value: SITE.legal.email,
      desc: t("pages.contact.channel.email.desc"),
    },
    {
      icon: Phone,
      title: t("pages.contact.channel.phone.title"),
      value: SITE.legal.phone,
      desc: t("pages.contact.channel.phone.desc"),
    },
  ];

  return (
    <div className="bg-[#f8fafc]">
      {/* HERO */}
      <section className="border-b border-ink-200/60 bg-white">
        <div className="container-page py-12 text-center sm:py-14">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-sm font-semibold text-brand-700">
            <ChatCircleDots size={16} weight="fill" /> {t("pages.contact.badge")}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            {t("pages.contact.heroTitle")}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-ink-500">
            {t("pages.contact.heroDesc")}
          </p>
        </div>
      </section>

      <section className="container-page max-w-4xl py-12">
        {/* Kanallar */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {channels.map((c) => {
            const inner = (
              <>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-soft">
                  <c.icon size={24} weight="duotone" />
                </span>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-ink-900">{c.title}</p>
                  <p className="text-sm font-bold text-brand-600">{c.value}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                    {c.desc}
                  </p>
                </div>
              </>
            );
            return c.href ? (
              <Link
                key={c.title}
                href={c.href}
                className="group rounded-2xl border border-ink-200 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
              >
                {inner}
              </Link>
            ) : (
              <div
                key={c.title}
                className="rounded-2xl border border-ink-200 bg-white p-5 shadow-soft"
              >
                {inner}
              </div>
            );
          })}
        </div>

        {/* Çalışma saatleri şeridi */}
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-ink-200 bg-white p-5 shadow-soft">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
            <Clock size={22} weight="duotone" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink-900">
              {t("pages.contact.hours.title")}
            </p>
            <p className="text-sm text-ink-500">
              {t("pages.contact.hours.pre")}{" "}
              <strong className="text-ink-700">
                {t("pages.contact.hours.strong")}
              </strong>
              {t("pages.contact.hours.post")}
            </p>
          </div>
        </div>

        {/* Kurumsal bilgiler */}
        <div className="mt-10">
          <h2 className="flex items-center gap-2 text-xl font-bold text-ink-900">
            <Buildings size={22} weight="duotone" className="text-brand-600" />
            {t("pages.contact.corp.title")}
          </h2>
          <p className="mt-1.5 text-sm text-ink-500">
            {t("pages.contact.corp.subtitle")}
          </p>
          <div className="mt-4">
            <LegalInfoTable
              rows={[
                [t("pages.contact.corp.company"), SITE.legal.company],
                [t("pages.contact.corp.address"), SITE.legal.address],
                [
                  t("pages.contact.corp.tax"),
                  `${SITE.legal.taxOffice} / ${SITE.legal.taxNumber}`,
                ],
                [t("pages.contact.corp.mersis"), SITE.legal.mersis],
                [t("pages.contact.corp.etbis"), SITE.legal.etbis],
                [t("pages.contact.corp.email"), SITE.legal.email],
                [t("pages.contact.corp.phone"), SITE.legal.phone],
                [t("pages.contact.corp.kep"), SITE.legal.kep],
              ]}
            />
          </div>
        </div>

        {/* SSS yönlendirmesi */}
        <Link
          href="/help"
          className="group mt-8 flex items-center justify-between gap-4 rounded-2xl border border-ink-200 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
              <Question size={22} weight="duotone" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink-900">
                {t("pages.contact.faq.title")}
              </p>
              <p className="text-sm text-ink-500">
                {t("pages.contact.faq.desc")}
              </p>
            </div>
          </div>
          <ArrowRight
            size={18}
            weight="bold"
            className="shrink-0 text-ink-400 transition-colors group-hover:text-brand-600"
          />
        </Link>
      </section>
    </div>
  );
}
