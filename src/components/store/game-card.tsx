"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GameController } from "@phosphor-icons/react/dist/ssr";
import { TONE_STYLES, getToneTextureStyle, type Tone } from "@/lib/card-tones";
import type { Brand } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

const MAX_TILT = 9; // derece — 3D eğim şiddeti

/**
 * Tek büyük oyun kartı (Hipopotamya düzeni):
 * - Üstte key-art görsel (hafif karartılmış), altta AYRI koyu bant + isim
 * - Hover: mouse'u takip eden parlak spotlight dairesi (o bölge aydınlanır)
 * - Mouse hareketiyle 3D tilt (eğim)
 */
export function GameCard({ brand }: { brand: Brand }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hover, setHover] = useState(false);
  // mouse pozisyonu (kart içi yüzde) — spotlight için
  const [pos, setPos] = useState({ x: 50, y: 40 });
  // 3D tilt açıları
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const tone = (brand.tone as Tone) ?? "brand";
  const t = TONE_STYLES[tone];

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0..1
    const py = (e.clientY - r.top) / r.height; // 0..1
    setPos({ x: px * 100, y: py * 100 });
    // merkeze göre eğim: sol/üst negatif, sağ/alt pozitif
    setTilt({
      rx: (0.5 - py) * MAX_TILT * 2, // üst→pozitif (geriye yatar)
      ry: (px - 0.5) * MAX_TILT * 2, // sağ→pozitif
    });
  }

  function onLeave() {
    setHover(false);
    setTilt({ rx: 0, ry: 0 });
  }

  return (
    <div className="[perspective:1000px]">
      <Link
        ref={ref}
        href={`/brand/${brand.slug}`}
        onMouseEnter={() => setHover(true)}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        title={brand.name}
        className="group relative block overflow-hidden rounded-2xl border border-ink-200 bg-[#1c1f26] shadow-card transition-[transform,box-shadow] duration-200 ease-out will-change-transform hover:shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45)]"
        style={{
          transform: hover
            ? `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(0) scale(1.02)`
            : "rotateX(0) rotateY(0) scale(1)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* GÖRSEL ALANI (dim) */}
        <div className="relative aspect-[4/5] overflow-hidden">
          {brand.image_path ? (
            <Image
              src={brand.image_path}
              alt={brand.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0" style={getToneTextureStyle(tone)}>
              <div className="grid h-full w-full place-items-center">
                <div
                  className={cn(
                    "grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br",
                    t.iconBg,
                  )}
                >
                  <GameController size={28} weight="fill" className={t.iconColor} />
                </div>
              </div>
            </div>
          )}

          {/* Karartma katmanı — normalde görseli dimler, hover'da hafifler */}
          <div
            className="pointer-events-none absolute inset-0 bg-black/35 transition-opacity duration-300 group-hover:bg-black/20"
          />

          {/* SPOTLIGHT — mouse'u takip eden parlak daire (o bölge aydınlanır) */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-200"
            style={{
              opacity: hover ? 1 : 0,
              background: `radial-gradient(circle 130px at ${pos.x}% ${pos.y}%, rgba(255,255,255,0.28), rgba(255,255,255,0.10) 40%, transparent 70%)`,
            }}
          />
        </div>

        {/* ALT KOYU BANT + İSİM (görselin üstünde değil, ayrı alan) */}
        <div className="bg-[#23262e] px-3 py-3 text-center">
          <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-white">
            {brand.name}
          </p>
        </div>
      </Link>
    </div>
  );
}
