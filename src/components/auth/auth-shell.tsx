"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Lightning,
  ShieldCheck,
  Wallet,
  Star,
  Users,
} from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n/provider";

/** Maskot görseli — dosya yoksa (henüz üretilmediyse) kendini gizler. */
function AuthHeroImage({ src }: { src: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    <div className="relative flex justify-center">
      {/* tabandaki yumuşak ışık halkası */}
      <div className="pointer-events-none absolute inset-x-0 bottom-2 mx-auto h-24 w-48 rounded-full bg-accent-500/25 blur-2xl" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="relative h-auto w-60 drop-shadow-2xl"
        onError={() => setOk(false)}
      />
    </div>
  );
}

/**
 * Auth ekranları için ortak split layout: sol marka paneli (gradient + maskot +
 * güven/sosyal kanıt rozetleri), sağ form alanı. Form içeriği children olarak
 * gelir (sign-in / sign-up custom formları). Mantık değişmez, yalnızca görünüm.
 */
export function AuthShell({
  title,
  subtitle,
  children,
  heroImage = "/auth/auth-hero.webp",
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  heroImage?: string;
}) {
  const { t } = useI18n();

  const trust = [
    { icon: Lightning, label: t("auth.trust.instant") },
    { icon: ShieldCheck, label: t("auth.trust.secure") },
    { icon: Wallet, label: t("auth.trust.bonus") },
  ];

  return (
    <section className="relative flex flex-1 items-center justify-center overflow-hidden py-10">
      {/* Sayfa arka planı — yumuşak marka glow'ları */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accent-200/40 blur-3xl" />
      </div>

      <div className="container-page">
        <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-ink-200 bg-white shadow-float lg:grid-cols-[1.05fr_1fr]">
          {/* ─── Sol marka paneli ─── */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0b1220] via-[#152038] to-[#16223b] p-10 text-white lg:flex">
            {/* dekoratif: grid pattern + glow */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="pointer-events-none absolute -right-16 top-8 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-56 w-56 rounded-full bg-accent-500/25 blur-3xl" />

            {/* üst: logo + başlık */}
            <div className="relative">
              <Link href="/" className="inline-flex items-center gap-2">
                <Image
                  src="/brand/logo-fox.png"
                  alt="EpinFox"
                  width={44}
                  height={44}
                  className="rounded-xl ring-1 ring-white/15"
                />
                <span className="text-xl font-extrabold tracking-tight">
                  Epin<span className="text-accent-400">Fox</span>
                </span>
              </Link>

              {/* sosyal kanıt rozeti */}
              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/85 backdrop-blur">
                <span className="flex -space-x-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="grid h-5 w-5 place-items-center rounded-full bg-accent-500/90 ring-2 ring-[#0b1220]"
                    >
                      <Users size={11} weight="fill" />
                    </span>
                  ))}
                </span>
                {t("auth.panel.socialProof")}
              </div>

              <h2 className="mt-5 text-[28px] font-extrabold leading-tight">
                {t("auth.panel.title")}
              </h2>
              <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-white/70">
                {t("auth.panel.subtitle")}
              </p>
            </div>

            {/* orta: maskot */}
            <AuthHeroImage src={heroImage} />

            {/* alt: güven rozetleri + yıldız */}
            <div className="relative">
              <div className="mb-4 flex items-center gap-1.5 text-sm text-white/85">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={15} weight="fill" className="text-accent-400" />
                ))}
                <span className="ml-1.5 font-semibold">{t("auth.panel.rating")}</span>
              </div>
              <ul className="space-y-2.5">
                {trust.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-3 text-sm text-white/90"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/10">
                      <Icon size={18} weight="duotone" className="text-accent-400" />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ─── Sağ form alanı ─── */}
          <div className="flex flex-col justify-center px-6 py-10 sm:px-12">
            {/* mobil logo */}
            <Link href="/" className="mb-6 inline-flex items-center gap-2 lg:hidden">
              <Image
                src="/brand/logo-fox.png"
                alt="EpinFox"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="text-lg font-extrabold tracking-tight text-ink-900">
                Epin<span className="text-accent-500">Fox</span>
              </span>
            </Link>

            <h1 className="text-[26px] font-extrabold tracking-tight text-ink-900">
              {title}
            </h1>
            <p className="mt-1.5 text-[15px] text-ink-500">{subtitle}</p>

            <div className="mt-7">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
