import type { Metadata } from "next";
import Link from "next/link";
import {
  Storefront,
  SealCheck,
  MapPin,
  ArrowUpRight,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { RESELLERS, type Reseller } from "@/lib/content";
import { getServerT } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Bayiler",
  description:
    "EpinFox yetkili bayileri. Güvenilir iş ortaklarımızdan dijital kod ve oyun ürünleri al.",
};

const HERO_IMG = "/reseller-list-hero.png";

function initials(name: string) {
  return name
    .replace(/[^a-zA-ZçğıöşüÇĞİÖŞÜ ]/g, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function ResellerPage() {
  const t = await getServerT();
  return (
    <div className="bg-[#f8fafc]">
      {/* ───────── HERO — banner (overlay metin + buton) ───────── */}
      <section className="container-page pt-6">
        <div className="relative h-[clamp(220px,32vw,400px)] w-full overflow-hidden rounded-3xl border border-ink-200 shadow-card">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMG})` }}
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/30"
            aria-hidden
          />
          <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-semibold text-white backdrop-blur-sm ring-1 ring-white/30">
              <Storefront size={16} weight="fill" /> {t("sup.reseller.chip")}
            </span>
            <h1 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-5xl">
              {t("sup.reseller.heroTitle")}
            </h1>
            <p className="mt-3 max-w-md text-sm text-white/80 sm:text-base">
              {t("sup.reseller.heroLead")}
            </p>
            <Link
              href="/reseller/apply"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-ink-900 shadow-soft transition-transform hover:scale-[1.03]"
            >
              <Storefront size={18} weight="fill" className="text-brand-600" />
              {t("sup.reseller.applyCta")}
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── BAYİ GRID ───────── */}
      <section className="container-page py-12">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-soft">
            <Storefront size={20} weight="duotone" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-ink-900">{t("sup.reseller.gridTitle")}</h2>
            <p className="text-sm text-ink-500">
              {t("sup.reseller.gridSub")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {RESELLERS.map((r) => (
            <ResellerCard key={r.slug} reseller={r} t={t} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ResellerCard({ reseller, t }: { reseller: Reseller; t: (key: string) => string }) {
  return (
    <a
      href={reseller.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col items-center rounded-2xl border border-ink-200 bg-white p-5 text-center shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
    >
      {/* Avatar — baş harfler + doğrulama rozeti */}
      <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-bold text-white shadow-soft">
        {initials(reseller.name)}
        {reseller.verified && (
          <span className="absolute -bottom-1.5 -right-1.5 grid h-6 w-6 place-items-center rounded-full bg-white">
            <SealCheck size={20} weight="fill" className="text-brand-500" />
          </span>
        )}
      </span>

      <h3 className="mt-3 font-bold text-ink-900">{reseller.name}</h3>
      <p className="inline-flex items-center gap-1 text-xs text-ink-400">
        <MapPin size={12} weight="duotone" />
        {reseller.city}
      </p>

      {/* Doğrulanmış etiketi */}
      {reseller.verified ? (
        <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
          <SealCheck size={13} weight="fill" />
          {t("sup.reseller.verified")}
        </span>
      ) : (
        <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-500">
          {t("sup.reseller.badge")}
        </span>
      )}

      {/* Siteye Git — hover'da görünür */}
      <span className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white opacity-0 transition-all duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
        <ArrowUpRight size={15} weight="bold" />
        {t("sup.reseller.visitSite")}
      </span>
    </a>
  );
}
