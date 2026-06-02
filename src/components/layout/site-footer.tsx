"use client";

import Link from "next/link";
import Image from "next/image";
import {
  DiscordLogo,
  InstagramLogo,
  XLogo,
  EnvelopeSimple,
  SealCheck,
} from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/brand/logo";
import { SITE } from "@/config/site";
import { useI18n } from "@/lib/i18n/provider";

const SUPPORT_EMAIL = "info@epinfox.com";

/** Footer link kolonları — başlık + linkler i18n anahtarlarıyla. */
const COLUMNS = [
  {
    titleKey: "footer.col.corporate",
    links: [
      { href: "/about", key: "footer.about" },
      { href: "/contact", key: "footer.contact" },
      { href: "/terms", key: "footer.terms" },
      { href: "/privacy", key: "footer.privacy" },
      { href: "/refund", key: "footer.refund" },
      { href: "/distance-sales", key: "footer.distanceSales" },
    ],
  },
  {
    titleKey: "footer.col.brand",
    links: [
      { href: "/wallet", key: "footer.walletTopup" },
      { href: "/store", key: "footer.logos" },
      { href: "/reseller", key: "footer.aboutReseller" },
      { href: "/publisher/apply", key: "footer.publisherApply" },
      { href: "/earn", key: "footer.earn" },
    ],
  },
  {
    titleKey: "footer.col.membership",
    links: [
      { href: "/account", key: "footer.account" },
      { href: "/wallet/transactions", key: "footer.transactions" },
      { href: "/support", key: "footer.support" },
      { href: "/sign-in", key: "footer.forgotPassword" },
    ],
  },
];

const SOCIALS = [
  { href: SITE.socials.discord, label: "Discord", icon: DiscordLogo },
  { href: SITE.socials.instagram, label: "Instagram", icon: InstagramLogo },
  { href: SITE.socials.x, label: "X", icon: XLogo },
];

/** Blog kategorileri — alt şerit. */
const BLOG_CATS = [
  "Haberler",
  "Oyun Haberleri",
  "PC Gaming",
  "PS5",
  "PS4",
  "Xbox Series X",
  "Xbox One",
  "Switch",
];

/** Ödeme yöntemi logoları — public/payments/ içindeki görseller. */
const PAYMENTS = [
  { src: "/payments/visa.png", alt: "Visa" },
  { src: "/payments/mastercard.png", alt: "Mastercard" },
  { src: "/payments/maestro.png", alt: "Maestro" },
  { src: "/payments/troy.jpg", alt: "Troy" },
  { src: "/payments/paypal.png", alt: "PayPal" },
  { src: "/payments/bkm.svg", alt: "BKM Express" },
];

export function SiteFooter({ year }: { year: number }) {
  const { t } = useI18n();
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-white/10 bg-[#10162b] text-white">
      {/* Tam görünür desenli arka plan */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          src="/footer-pattern.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-70"
        />
        {/* Karartma tülü — desen seçilsin ama yazılar net okunsun */}
        <div className="absolute inset-0 bg-[#0d1326]/65" />
      </div>

      {/* Ana grid: sol marka + 3 kolon */}
      <div className="relative container-page grid grid-cols-1 gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        {/* Sol — logo + iletişim */}
        <div>
          <Logo variant="light" />
          <p className="mt-5 text-sm font-medium text-white/80">
            {t("footer.contactQuestion")}
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="mt-2 inline-flex items-center gap-2 text-lg font-bold text-white transition-colors hover:text-brand-300"
          >
            <EnvelopeSimple size={20} weight="duotone" className="text-brand-400" />
            {SUPPORT_EMAIL}
          </a>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
            {t("footer.contactSub")}
          </p>
          {/* Sosyal */}
          <div className="mt-5 flex gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white/80 ring-1 ring-white/15 transition-all hover:-translate-y-0.5 hover:text-white hover:ring-brand-400"
              >
                <s.icon size={20} weight="fill" />
              </a>
            ))}
          </div>
        </div>

        {/* 3 link kolonu */}
        {COLUMNS.map((col) => (
          <div key={col.titleKey}>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">
              {t(col.titleKey)}
            </h3>
            <ul className="mt-5 space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/65 transition-colors hover:text-brand-300"
                  >
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Blog kategori şeridi + ETBİS */}
      <div className="relative border-t border-white/10">
        <div className="container-page flex flex-col items-start justify-between gap-5 py-6 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <span className="font-bold text-white">{t("footer.blogCategory")}</span>
            {BLOG_CATS.map((c, i) => (
              <span key={c} className="flex items-center gap-3">
                <Link
                  href="/news"
                  className="text-white/55 transition-colors hover:text-brand-300"
                >
                  {c}
                </Link>
                {i < BLOG_CATS.length - 1 && (
                  <span className="text-white/20">|</span>
                )}
              </span>
            ))}
          </div>
          {/* ETBİS rozeti */}
          <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white/85">
            <SealCheck size={18} weight="fill" className="text-success-400" />
            {t("footer.etbis")}
          </span>
        </div>
      </div>

      {/* Alt bar: telif + ödeme logoları */}
      <div className="relative border-t border-white/10 bg-black/20">
        <div className="container-page flex flex-col items-center justify-between gap-5 py-6 lg:flex-row">
          <p className="text-center text-xs text-white/55 lg:text-left">
            © {year} {SITE.name} {t("footer.company")} — {t("footer.rights")}
          </p>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
            <span className="text-xs font-medium text-white/55">
              {t("footer.securePayment")}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {PAYMENTS.map(({ src, alt }) => (
                <span
                  key={src}
                  className="grid h-9 w-12 place-items-center overflow-hidden rounded-md bg-white ring-1 ring-ink-200"
                >
                  <Image
                    src={src}
                    alt={alt}
                    width={40}
                    height={28}
                    className="h-6 w-auto object-contain"
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
