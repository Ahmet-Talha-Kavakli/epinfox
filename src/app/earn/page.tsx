import type { Metadata } from "next";
import Image from "next/image";
import { CurrencyCircleDollar } from "@phosphor-icons/react/dist/ssr";
import { getCurrentUser } from "@/lib/auth/current-user";
import { createAdminClient } from "@/lib/supabase/server";
import { Accordion } from "@/components/ui/accordion";
import { EarnSubmitForm } from "@/components/earn/earn-submit-form";
import { EarnHistory } from "@/components/earn/earn-history";
import { getServerT, getServerLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerT();
  return {
    title: t("pages.earn.meta.title"),
    description: t("pages.earn.meta.desc"),
  };
}

export default async function EarnPage() {
  const [t, locale] = await Promise.all([getServerT(), getServerLocale()]);
  const current = await getCurrentUser();

  const STEPS = [
    {
      img: "/earn/earn-step-share.png",
      title: t("pages.earn.step1.title"),
      desc: t("pages.earn.step1.desc"),
    },
    {
      img: "/earn/earn-step-submit.png",
      title: t("pages.earn.step2.title"),
      desc: t("pages.earn.step2.desc"),
    },
    {
      img: "/earn/earn-step-reward.png",
      title: t("pages.earn.step3.title"),
      desc: t("pages.earn.step3.desc"),
    },
  ];

  const FAQ = [
    { q: t("pages.earn.faq1.q"), a: t("pages.earn.faq1.a") },
    { q: t("pages.earn.faq2.q"), a: t("pages.earn.faq2.a") },
    { q: t("pages.earn.faq3.q"), a: t("pages.earn.faq3.a") },
    { q: t("pages.earn.faq4.q"), a: t("pages.earn.faq4.a") },
    { q: t("pages.earn.faq5.q"), a: t("pages.earn.faq5.a") },
    { q: t("pages.earn.faq6.q"), a: t("pages.earn.faq6.a") },
    { q: t("pages.earn.faq7.q"), a: t("pages.earn.faq7.a") },
  ];

  // Giriş yapan kullanıcının kendi başvuruları + imzalı kanıt URL'leri.
  let submissions: import("@/components/earn/earn-history").EarnRow[] = [];
  if (current) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from("earn_submissions")
      .select("id, platform, content_url, status, reward, reject_reason, created_at")
      .eq("user_id", current.user.id)
      .order("created_at", { ascending: false });
    submissions = (data ?? []) as typeof submissions;
  }

  return (
    <div className="bg-[#f8fafc]">
      {/* ───────── Başlık + tanıtım videosu ───────── */}
      <section className="container-page max-w-4xl pt-10 sm:pt-12">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-sm font-medium text-accent-700">
            <CurrencyCircleDollar size={15} weight="fill" /> {t("pages.earn.badge")}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            {t("pages.earn.heroTitle")}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-ink-600">
            {t("pages.earn.heroDesc")}
          </p>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-3xl border border-ink-200 bg-ink-900 shadow-card ring-1 ring-black/5">
          <video
            className="aspect-video w-full object-cover"
            src="/earn/earn-promo.mp4"
            poster="/earn/earn-promo-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>
      </section>

      {/* ───────── Nasıl çalışır ───────── */}
      <section className="container-page max-w-5xl py-12">
        <h2 className="text-center text-xl font-bold text-ink-900">
          {t("pages.earn.howTitle")}
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="relative rounded-3xl border border-ink-200 bg-white p-6 text-center shadow-card"
            >
              <span className="absolute left-5 top-5 grid h-7 w-7 place-items-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                {i + 1}
              </span>
              <div className="relative mx-auto h-20 w-20">
                <Image
                  src={s.img}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </div>
              <h3 className="mt-3 font-bold text-ink-900">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── Form + Geçmiş ───────── */}
      <section className="container-page max-w-5xl pb-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <EarnSubmitForm isLoggedIn={Boolean(current)} />
          <EarnHistory
            submissions={submissions}
            isLoggedIn={Boolean(current)}
            t={t}
            locale={locale}
          />
        </div>
      </section>

      {/* ───────── SSS (kritik) ───────── */}
      <section className="container-page max-w-3xl py-12">
        <h2 className="mb-5 text-xl font-bold text-ink-900">
          {t("pages.earn.faqTitle")}
        </h2>
        <Accordion items={FAQ} defaultOpen={0} />
      </section>
    </div>
  );
}
