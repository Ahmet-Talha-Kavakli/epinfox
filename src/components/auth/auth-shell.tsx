"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lightning, ShieldCheck, Wallet } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n/provider";

/** Maskot görseli — dosya yoksa (henüz üretilmediyse) kendini gizler. */
function AuthHeroImage({ src }: { src: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) return <div className="my-6" />;
  return (
    <div className="relative my-6 flex justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="h-auto w-64 drop-shadow-2xl"
        onError={() => setOk(false)}
      />
    </div>
  );
}

/**
 * Auth ekranları için ortak split layout: sol marka paneli (gradient + maskot +
 * güven rozetleri), sağ form alanı. Form içeriği children olarak gelir
 * (sign-in / sign-up custom formları).
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
    <section className="container-page flex flex-1 items-center justify-center py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-float lg:grid-cols-2">
        {/* ─── Sol marka paneli ─── */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#16223b] to-[#1e293b] p-10 text-white lg:flex">
          {/* dekoratif glow */}
          <div className="pointer-events-none absolute -right-16 top-10 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-56 w-56 rounded-full bg-accent-500/20 blur-3xl" />

          <div className="relative">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="/brand/logo-fox.png"
                alt="EpinFox"
                width={44}
                height={44}
                className="rounded-xl"
              />
              <span className="text-xl font-extrabold tracking-tight">
                Epin<span className="text-accent-400">Fox</span>
              </span>
            </Link>
            <h2 className="mt-10 text-3xl font-extrabold leading-tight">
              {t("auth.panel.title")}
            </h2>
            <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-white/70">
              {t("auth.panel.subtitle")}
            </p>
          </div>

          {/* maskot görseli — /auth/auth-hero.webp konunca görünür; yoksa
              (henüz üretilmediyse) kırık ikon yerine sade boşluk kalır. */}
          <AuthHeroImage src={heroImage} />

          <ul className="relative space-y-3">
            {trust.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-white/90">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
                  <Icon size={18} weight="duotone" className="text-accent-400" />
                </span>
                {label}
              </li>
            ))}
          </ul>
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

          <h1 className="text-2xl font-extrabold text-ink-900">{title}</h1>
          <p className="mt-1.5 text-[15px] text-ink-500">{subtitle}</p>

          <div className="mt-7">{children}</div>
        </div>
      </div>
    </section>
  );
}
