import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Trophy,
  Ticket,
  Users,
  Wallet,
  Confetti,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Clock,
} from "@phosphor-icons/react/dist/ssr";
import { getRaffles, type RaffleItem } from "@/lib/content";
import { RaffleCountdown } from "@/components/raffles/raffle-countdown";
import { getServerT, getServerLocale } from "@/lib/i18n/server";
import { intlLocale, formatNumber } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerT();
  return {
    title: t("pages.raffles.meta.title"),
    description: t("pages.raffles.meta.desc"),
  };
}

const STATUS_CLS: Record<RaffleItem["status"], string> = {
  active: "bg-success-500 text-white",
  upcoming: "bg-warning-500 text-white",
  ended: "bg-ink-500/90 text-white",
};

function fmt(iso: string, locale: Locale) {
  return new Date(iso).toLocaleDateString(intlLocale(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function RafflesPage() {
  const [t, locale] = await Promise.all([getServerT(), getServerLocale()]);
  const raffles = getRaffles(locale);
  const active = raffles.filter((r) => r.status === "active");
  const upcoming = raffles.filter((r) => r.status === "upcoming");
  const ended = raffles.filter((r) => r.status === "ended");

  const totalParticipants = raffles.reduce((s, r) => s + r.participants, 0);

  return (
    <div className="bg-[#f8fafc]">
      {/* ───────── HERO (tam genişlik · görsel arka planda · yazı sol overlay) ───────── */}
      <section className="relative overflow-hidden border-b border-ink-200/60">
        {/* Arka plan görseli — tam genişlik */}
        <Image
          src="/raffles/raffles-hero.png"
          alt={t("pages.raffles.heroImageAlt")}
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        {/* Soldan sağa karartma — sol taraftaki yazıyı okunur kılar */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/10 sm:to-transparent"
          aria-hidden
        />

        <div className="container-page relative py-8 sm:py-10 lg:py-12">
          <div className="max-w-xl text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-200 bg-accent-50 px-3.5 py-1.5 text-sm font-semibold text-accent-700">
              <Confetti size={16} weight="fill" /> {t("pages.raffles.badge")}
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
              {t("pages.raffles.heroTitle.pre")}{" "}
              <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
                {t("pages.raffles.heroTitle.accent")}
              </span>{" "}
              {t("pages.raffles.heroTitle.post")}
            </h1>
            <p className="mt-4 max-w-md text-ink-600">
              {t("pages.raffles.heroDesc")}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <Stat
                icon={Trophy}
                value={`${raffles.length}`}
                label={t("pages.raffles.stat.raffles")}
              />
              <Stat
                icon={Users}
                value={formatNumber(totalParticipants, locale)}
                label={t("pages.raffles.stat.participants")}
              />
              <Stat
                icon={Ticket}
                value={t("pages.raffles.stat.free.value")}
                label={t("pages.raffles.stat.free.label")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ───────── ÇEKİLİŞLER (hepsi tam genişlik · tek tip) ───────── */}
      <section className="container-page space-y-12 py-14">
        {active.length > 0 && (
          <RaffleSection
            icon={Ticket}
            title={t("pages.raffles.section.active.title")}
            subtitle={t("pages.raffles.section.active.subtitle")}
            raffles={active}
            t={t}
            locale={locale}
          />
        )}

        {upcoming.length > 0 && (
          <RaffleSection
            icon={Clock}
            title={t("pages.raffles.section.upcoming.title")}
            subtitle={t("pages.raffles.section.upcoming.subtitle")}
            raffles={upcoming}
            t={t}
            locale={locale}
          />
        )}

        {ended.length > 0 && (
          <RaffleSection
            icon={Trophy}
            title={t("pages.raffles.section.ended.title")}
            subtitle={t("pages.raffles.section.ended.subtitle")}
            raffles={ended}
            t={t}
            locale={locale}
          />
        )}

        <HowItWorks t={t} />
      </section>
    </div>
  );
}

/* ─────────────────────────── Alt bileşenler ─────────────────────────────── */

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Trophy;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-ink-200 bg-white px-4 py-2.5 shadow-soft">
      <Icon size={20} weight="duotone" className="text-brand-600" />
      <div className="text-left">
        <p className="text-sm font-bold leading-none text-ink-900">{value}</p>
        <p className="mt-0.5 text-[11px] text-ink-400">{label}</p>
      </div>
    </div>
  );
}

function RaffleSection({
  icon: Icon,
  title,
  subtitle,
  raffles,
  t,
  locale,
}: {
  icon: typeof Trophy;
  title: string;
  subtitle: string;
  raffles: RaffleItem[];
  t: (key: string) => string;
  locale: Locale;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-soft">
          <Icon size={22} weight="duotone" />
        </span>
        <div>
          <h2 className="text-xl font-bold text-ink-900">{title}</h2>
          <p className="text-sm text-ink-500">{subtitle}</p>
        </div>
      </div>
      <div className="mt-6 space-y-6">
        {raffles.map((r) => (
          <RaffleCard key={r.slug} raffle={r} t={t} locale={locale} />
        ))}
      </div>
    </div>
  );
}

/** Tam genişlik çekiliş kartı — solda büyük 16:9 görsel, sağda bilgi + aksiyon. */
function RaffleCard({
  raffle,
  t,
  locale,
}: {
  raffle: RaffleItem;
  t: (key: string) => string;
  locale: Locale;
}) {
  const stCls = STATUS_CLS[raffle.status];
  const isEnded = raffle.status === "ended";
  const isUpcoming = raffle.status === "upcoming";

  return (
    <div className="group grid grid-cols-1 overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-card transition-shadow hover:shadow-lg lg:grid-cols-[1fr_1.15fr]">
      {/* Bilgi — sol */}
      <div className="order-2 flex flex-col justify-center p-7 sm:p-9 lg:order-1">
        <h3 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
          {raffle.title}
        </h3>
        <p className="mt-2 inline-flex items-center gap-2 text-lg font-bold text-accent-600">
          <Trophy size={20} weight="fill" /> {raffle.prize}
        </p>
        <p className="mt-3 max-w-md text-ink-600">{raffle.summary}</p>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-500">
          {raffle.participants > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Users size={16} weight="duotone" className="text-brand-500" />
              {formatNumber(raffle.participants, locale)}{" "}
              {t("pages.raffles.card.participantsSuffix")}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Ticket size={16} weight="duotone" className="text-brand-500" />
            {raffle.ticketCost === 0
              ? t("pages.raffles.card.free")
              : `${raffle.ticketCost}₺ ${t("pages.raffles.card.perTicket")}`}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={16} weight="duotone" className="text-brand-500" />
            {fmt(raffle.endsAt, locale)}
          </span>
        </div>

        {/* Aksiyon alanı — duruma göre */}
        <div className="mt-6">
          {isEnded ? (
            <div className="flex w-fit items-center gap-2 rounded-xl border border-ink-200 bg-ink-50/70 px-4 py-3 text-sm">
              <CheckCircle size={18} weight="fill" className="text-success-500" />
              <span className="text-ink-600">
                {t("pages.raffles.card.winnerLabel")}{" "}
                <span className="font-bold text-ink-900">
                  {raffle.winner ?? t("pages.raffles.card.winnerAnnounced")}
                </span>
              </span>
            </div>
          ) : isUpcoming ? (
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  {t("pages.raffles.card.startsIn")}
                </p>
                <RaffleCountdown endsAt={raffle.startsAt} />
              </div>
              <button
                type="button"
                disabled
                className="inline-flex w-fit cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border border-ink-200 bg-ink-50 px-5 py-2.5 text-sm font-semibold text-ink-400"
              >
                <Clock size={16} weight="duotone" /> {t("pages.raffles.card.upcomingBtn")}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  {t("pages.raffles.card.timeLeft")}
                </p>
                <RaffleCountdown endsAt={raffle.endsAt} />
              </div>
              <Link
                href="/wallet"
                className="inline-flex w-fit items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-soft transition-colors hover:bg-brand-700"
              >
                <Ticket size={18} weight="fill" />
                {t("pages.raffles.card.joinCta")}
                <ArrowRight size={16} weight="bold" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Görsel — sağ */}
      <div className="relative order-1 aspect-[16/9] overflow-hidden bg-gradient-to-b from-ink-50/60 to-white lg:order-2">
        <Image
          src={raffle.image}
          alt={raffle.prize}
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${isEnded ? "opacity-80 grayscale-[0.25]" : ""}`}
        />
        <span
          className={`absolute left-4 top-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-soft ${stCls}`}
        >
          {t(`pages.raffles.status.${raffle.status}`)}
        </span>
      </div>
    </div>
  );
}

function HowItWorks({ t }: { t: (key: string) => string }) {
  const steps = [
    {
      icon: Wallet,
      title: t("pages.raffles.how.step1.title"),
      text: t("pages.raffles.how.step1.text"),
    },
    {
      icon: Ticket,
      title: t("pages.raffles.how.step2.title"),
      text: t("pages.raffles.how.step2.text"),
    },
    {
      icon: Confetti,
      title: t("pages.raffles.how.step3.title"),
      text: t("pages.raffles.how.step3.text"),
    },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-ink-200 bg-white p-8 shadow-card">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-ink-900">
          {t("pages.raffles.how.title")}
        </h2>
        <p className="mt-2 text-ink-500">{t("pages.raffles.how.subtitle")}</p>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="relative rounded-2xl border border-ink-200 bg-ink-50/50 p-6 text-center"
          >
            <span className="absolute right-4 top-4 text-3xl font-extrabold text-ink-100">
              {i + 1}
            </span>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-soft">
              <s.icon size={26} weight="duotone" />
            </span>
            <h3 className="mt-4 font-bold text-ink-900">{s.title}</h3>
            <p className="mt-1.5 text-sm text-ink-500">{s.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-2 border-t border-ink-200 pt-6 text-center sm:flex-row sm:gap-3">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600">
          <ShieldCheck size={18} weight="fill" className="text-success-600" />
          {t("pages.raffles.how.disclaimer")}
        </span>
      </div>
    </div>
  );
}
