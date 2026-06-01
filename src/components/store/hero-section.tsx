"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { CaretRight, CaretLeft, ArrowRight } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n/provider";

export interface HeroSlide {
  image: string;
  title: string;
  subtitle?: string;
  href: string;
}

export interface HeroSideCard {
  image: string;
  title: string;
  subtitle?: string;
  href: string;
}

const INTERVAL = 5000;

/**
 * Hero düzeni (Hipopotamya): SOL büyük otomatik slider + SAĞ 2 sabit kart.
 * Slider ileri-geri döner; sağ kartlar sabit (Sosyal Medya / Cüzdan).
 */
export function HeroSection({
  slides,
  sideCards,
}: {
  slides: HeroSlide[];
  sideCards: HeroSideCard[];
}) {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const n = slides.length;

  const next = useCallback(() => setActive((i) => (i + 1) % n), [n]);
  const prev = () => setActive((i) => (i - 1 + n) % n);

  useEffect(() => {
    if (n <= 1) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [next, active, n]);

  return (
    <div className="container-page pt-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_440px]">
        {/* SOL — büyük slider (daha geniş/yüksek) */}
        {/* lg'de aspect-ratio KAPALI: aspect + min-height birlikte genişliği
            yükseklikten türetip grid hücresini şişiriyordu (960px taşma). lg'de
            sabit yükseklik + w-full → hücreye tam oturur, sağ kartlara binmez. */}
        <div className="group relative aspect-[16/9] min-h-[340px] overflow-hidden rounded-3xl border border-ink-200 shadow-card sm:aspect-[16/8] lg:aspect-auto lg:h-[480px] lg:min-h-0 lg:w-full">
          {slides.map((s, i) => (
            <Link
              key={i}
              href={s.href}
              className={
                "absolute inset-0 transition-opacity duration-700 " +
                (i === active ? "opacity-100" : "pointer-events-none opacity-0")
              }
            >
              <Image
                src={s.image}
                alt={s.title}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="object-cover"
              />
              {/* Güçlü sol karartma — metin her görselde okunsun */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent" />
              <div className="absolute inset-y-0 left-0 flex max-w-lg flex-col justify-center p-7 md:p-12">
                <h2 className="text-3xl font-extrabold leading-tight text-white drop-shadow-lg md:text-5xl">
                  {s.title}
                </h2>
                {s.subtitle && (
                  <p className="mt-3 text-base text-white/90 drop-shadow md:text-lg">
                    {s.subtitle}
                  </p>
                )}
                <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg md:text-base">
                  {t("misc.hero.explore")} <ArrowRight size={16} weight="bold" />
                </span>
              </div>
            </Link>
          ))}

          {/* Ok butonları */}
          {n > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label={t("misc.hero.prev")}
                className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100"
              >
                <CaretLeft size={18} weight="bold" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label={t("misc.hero.next")}
                className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100"
              >
                <CaretRight size={18} weight="bold" />
              </button>
              {/* Dot nav */}
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`${t("misc.hero.slide")} ${i + 1}`}
                    className={
                      "h-1.5 rounded-full transition-all " +
                      (i === active ? "w-5 bg-white" : "w-1.5 bg-white/50")
                    }
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* SAĞ — 2 sabit kart (büyütüldü) */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          {sideCards.map((c, i) => (
            <Link
              key={i}
              href={c.href}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-ink-200 shadow-card transition-all hover:-translate-y-0.5 lg:aspect-auto lg:flex-1"
            >
              <Image
                src={c.image}
                alt={c.title}
                fill
                sizes="(max-width: 1024px) 50vw, 400px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-lg font-bold text-white drop-shadow-lg">
                  {c.title}
                </p>
                {c.subtitle && (
                  <p className="mt-0.5 text-[13px] text-white/85 drop-shadow">{c.subtitle}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
