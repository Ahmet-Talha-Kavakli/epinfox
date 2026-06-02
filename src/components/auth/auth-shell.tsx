"use client";

import { useEffect, useState } from "react";
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

/**
 * Auth ekranları için TAM EKRAN split layout:
 *  - Sol: full-height kapak görseli (üstte marka + altta güven rozetleri overlay).
 *  - Sağ: kaydırılabilir form alanı.
 *  - Tüm ekranı kaplar (fixed inset-0), sayfa scroll'u KİLİTLİ (body overflow hidden).
 * Form içeriği children olarak gelir (sign-in / sign-up). Mantık değişmez.
 */
export function AuthShell({
  title,
  subtitle,
  children,
  // Varsayılan: dikey hazine görseli (auth-hero henüz 9:16 üretilmedi; üretilince
  // sign-in sayfasına heroImage="/auth/auth-hero.webp" geçilir).
  heroImage = "/auth/auth-signup.webp",
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  heroImage?: string;
}) {
  const { t } = useI18n();
  const [imgOk, setImgOk] = useState(true);

  // Sayfa scroll'unu kilitle (yalnızca bu sayfa açıkken).
  useEffect(() => {
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  const trust = [
    { icon: Lightning, label: t("auth.trust.instant") },
    { icon: ShieldCheck, label: t("auth.trust.secure") },
    { icon: Wallet, label: t("auth.trust.bonus") },
  ];

  return (
    <div className="fixed inset-0 z-[60] grid bg-white lg:grid-cols-[1.1fr_1fr]">
      {/* ─── SOL: full görsel ─── */}
      <div className="relative hidden overflow-hidden bg-[#0b1220] lg:block">
        {imgOk ? (
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            sizes="55vw"
            className="object-cover"
            onError={() => setImgOk(false)}
          />
        ) : (
          // Görsel yoksa marka gradyanı + grid pattern fallback.
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b1220] via-[#152038] to-[#16223b]">
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="absolute -right-16 top-10 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
            <div className="absolute -left-10 bottom-0 h-64 w-64 rounded-full bg-accent-500/25 blur-3xl" />
          </div>
        )}

        {/* okunabilirlik için alttan koyu degrade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />

        {/* üst: logo */}
        <div className="absolute inset-x-0 top-0 p-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white">
            <Image
              src="/brand/logo-fox.png"
              alt="EpinFox"
              width={42}
              height={42}
              className="rounded-xl ring-1 ring-white/15"
            />
            <span className="text-xl font-extrabold tracking-tight">
              Epin<span className="text-accent-400">Fox</span>
            </span>
          </Link>
        </div>

        {/* alt: başlık + sosyal kanıt + güven rozetleri */}
        <div className="absolute inset-x-0 bottom-0 p-8 text-white">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur">
            <span className="flex -space-x-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="grid h-5 w-5 place-items-center rounded-full bg-accent-500/90 ring-2 ring-black/40"
                >
                  <Users size={11} weight="fill" />
                </span>
              ))}
            </span>
            {t("auth.panel.socialProof")}
          </div>

          <h2 className="max-w-md text-[28px] font-extrabold leading-tight drop-shadow">
            {t("auth.panel.title")}
          </h2>
          <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-white/85 drop-shadow">
            {t("auth.panel.subtitle")}
          </p>

          <div className="mt-4 flex items-center gap-1.5 text-sm">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} size={15} weight="fill" className="text-accent-400" />
            ))}
            <span className="ml-1.5 font-semibold">{t("auth.panel.rating")}</span>
          </div>

          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {trust.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-white/90">
                <Icon size={16} weight="duotone" className="text-accent-400" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ─── SAĞ: form (kendi içinde kaydırılır) ─── */}
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-10 sm:px-10">
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
  );
}
