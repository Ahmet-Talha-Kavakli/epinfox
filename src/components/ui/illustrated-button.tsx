import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { Tone } from "@/lib/card-tones";
import { TONE_STYLES } from "@/lib/card-tones";

interface IllustratedButtonProps {
  href: string;
  illustration: string;
  title: string;
  description?: string;
  tone?: Tone;
  badge?: string;
  /** Yükseklik: sm = 96px, md = 128px, lg = 160px */
  size?: "sm" | "md" | "lg";
  external?: boolean;
  className?: string;
}

/**
 * Card-style button: küçük karakter görseli + başlık + açıklama.
 * Çok basit CTA'larda (tamam/iptal/devam et) kullanılmaz —
 * sadece "Şikayet Et", "Lobi Aç", "Üyelik" gibi anlamlı yönlendirmelerde.
 */
export function IllustratedButton({
  href,
  illustration,
  title,
  description,
  tone = "brand",
  badge,
  size = "md",
  external,
  className,
}: IllustratedButtonProps) {
  const t = TONE_STYLES[tone];

  const imgSize = size === "sm" ? 64 : size === "lg" ? 112 : 88;
  const padding = size === "sm" ? "p-3" : size === "lg" ? "p-5" : "p-4";

  const inner = (
    <article
      className={`group relative h-full rounded-2xl bg-white border border-ink-900 border-l-[3px] ${t.stripe} shadow-soft ${t.hoverShadow} overflow-hidden transition-all hover:-translate-y-0.5 ${padding} ${className ?? ""}`}
      style={{ backgroundImage: t.texture }}
    >
      <div className="relative flex items-center gap-3 md:gap-4">
        <div
          className={`shrink-0 rounded-xl overflow-hidden ring-1 ring-black/5 bg-white/70 backdrop-blur`}
          style={{ width: imgSize, height: imgSize }}
        >
          <Image
            src={illustration}
            alt=""
            width={imgSize}
            height={imgSize}
            className="object-cover h-full w-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`font-bold text-ink-900 leading-tight ${size === "sm" ? "text-sm" : "text-base"}`}
            >
              {title}
            </h3>
            {badge && (
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/70 ${t.iconColor} border border-current/30`}
              >
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p
              className={`mt-0.5 text-ink-600 leading-snug line-clamp-2 ${size === "sm" ? "text-xs" : "text-sm"}`}
            >
              {description}
            </p>
          )}
        </div>
        <ArrowRight
          size={16}
          weight="bold"
          className={`shrink-0 ${t.iconColor} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all`}
        />
      </div>
    </article>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className="block">
      {inner}
    </Link>
  );
}
