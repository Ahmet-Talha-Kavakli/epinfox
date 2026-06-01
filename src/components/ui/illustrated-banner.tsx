import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { Tone } from "@/lib/card-tones";
import { TONE_STYLES } from "@/lib/card-tones";

interface BannerAction {
  href: string;
  label: string;
  variant?: "primary" | "ghost";
  external?: boolean;
}

interface IllustratedBannerProps {
  illustration: string; // /illustrations/<slug>.jpg
  alt?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: BannerAction[];
  tone?: Tone;
  /** Karakteri solda mı göstereyim (varsayılan: sağ). */
  reverse?: boolean;
  className?: string;
}

/**
 * Karakter görselli, sağa yaslanmış (ya da sola), CTA bandı.
 * Tüm sayfalarda kullanılan generic illustrated banner.
 */
export function IllustratedBanner({
  illustration,
  alt = "",
  eyebrow,
  title,
  description,
  actions = [],
  tone = "brand",
  reverse = false,
  className,
}: IllustratedBannerProps) {
  const t = TONE_STYLES[tone];

  const bgClassByTone: Record<Tone, string> = {
    brand: "from-brand-600 to-brand-500",
    accent: "from-accent-600 to-accent-500",
    success: "from-success-600 to-success-500",
    danger: "from-danger-600 to-danger-500",
    warning: "from-amber-500 to-orange-500",
    info: "from-sky-600 to-cyan-500",
    neutral: "from-ink-700 to-ink-600",
  };

  return (
    <section
      className={`relative overflow-hidden rounded-3xl shadow-card ring-1 ring-black/5 ${className ?? ""}`}
    >
      {/* Gradient base */}
      <div
        aria-hidden
        className={`absolute inset-0 bg-linear-to-br ${bgClassByTone[tone]}`}
      />

      {/* Texture overlay (subtle) */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{ backgroundImage: t.texture }}
      />

      {/* Illustration */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 ${reverse ? "left-0" : "right-0"} w-1/2 md:w-2/5`}
      >
        <Image
          src={illustration}
          alt={alt}
          fill
          sizes="(min-width:768px) 40vw, 50vw"
          className="object-cover object-center"
          priority={false}
        />
        {/* Edge fade so character blends into the band */}
        <div
          aria-hidden
          className={`absolute inset-0 ${
            reverse
              ? "bg-linear-to-r from-transparent to-black/15"
              : "bg-linear-to-l from-transparent to-black/15"
          }`}
        />
      </div>

      {/* Content */}
      <div
        className={`relative px-6 py-8 md:px-10 md:py-12 max-w-2xl ${reverse ? "ml-auto md:pl-10" : ""}`}
      >
        {eyebrow && (
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/80 mb-2">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-base md:text-lg text-white/90 leading-relaxed max-w-lg">
            {description}
          </p>
        )}
        {actions.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {actions.map((a) => (
              <BannerAction key={a.href + a.label} action={a} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function BannerAction({ action }: { action: BannerAction }) {
  const isPrimary = (action.variant ?? "primary") === "primary";
  const cls = isPrimary
    ? "bg-white text-ink-900 hover:bg-white/95 shadow-soft"
    : "border-2 border-white/70 text-white hover:bg-white/10";
  const inner = (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5 ${cls}`}
    >
      {action.label}
      {isPrimary && <ArrowRight size={14} weight="bold" />}
    </span>
  );
  if (action.external) {
    return (
      <a href={action.href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return <Link href={action.href}>{inner}</Link>;
}
