import Link from "next/link";
import Image from "next/image";
import { Lightning } from "@phosphor-icons/react/dist/ssr";
import { TONE_STYLES, type Tone } from "@/lib/card-tones";
import type { Brand } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

function IconItem({ brand }: { brand: Brand }) {
  const tone = (brand.tone as Tone) ?? "brand";
  const t = TONE_STYLES[tone];
  return (
    <Link
      href={`/brand/${brand.slug}`}
      className="group flex w-[72px] shrink-0 flex-col items-center gap-1.5"
      title={brand.name}
    >
      <span className="relative grid h-14 w-14 place-items-center overflow-hidden rounded-full ring-2 ring-ink-200 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:ring-brand-400 group-hover:shadow-card">
        {brand.image_path ? (
          <Image
            src={brand.image_path}
            alt={brand.name}
            fill
            sizes="56px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <span
            className={cn(
              "grid h-full w-full place-items-center bg-gradient-to-br",
              t.iconBg,
            )}
          >
            <Lightning size={18} weight="fill" className={t.iconColor} />
          </span>
        )}
      </span>
      <span className="line-clamp-1 max-w-full text-center text-[11px] font-medium text-ink-500 transition-colors group-hover:text-brand-600">
        {brand.name}
      </span>
    </Link>
  );
}

/**
 * Ana sayfa üstü — SONSUZ KAYAN dairesel oyun/marka logoları şeridi
 * (Hipopotamya düzeni). Sola kayar, başa sarar; mouse üzerine gelince durur.
 * İçerik 2x kopyalanıp %50 kaydırılarak kesintisiz döngü sağlanır.
 */
export function GameIconStrip({ brands }: { brands: Brand[] }) {
  if (!brands.length) return null;
  // Kesintisiz döngü için listeyi iki kez render et.
  const loop = [...brands, ...brands];

  // Hover'da DURMAZ — kesintisiz akar (duraklama 'takılma' hissi veriyordu).
  // Tek tek ikonlar hover'da yine büyür (group-hover), şerit akmaya devam eder.
  return (
    <div className="overflow-hidden border-y border-ink-200/60 bg-ink-50/40 py-4">
      <div className="animate-marquee flex w-max gap-5">
        {loop.map((b, i) => (
          <IconItem key={`${b.id}-${i}`} brand={b} />
        ))}
      </div>
    </div>
  );
}
