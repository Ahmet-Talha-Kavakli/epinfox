import Link from "next/link";
import Image from "next/image";
import { Megaphone } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

export interface PromoCard {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  /** public yolu; null ise placeholder. */
  image: string | null;
  /** bento yerleşim: büyük kart 2x2 kaplar. */
  big?: boolean;
}

/**
 * Promosyon/kampanya banner grid (Hipopotamya bento düzeni):
 * 1 büyük (sol) + küçük kartlar (sağ). Görseller placeholder olarak işaretli.
 */
export function PromoGrid({ cards }: { cards: PromoCard[] }) {
  if (!cards.length) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((c) => (
        <Link
          key={c.id}
          href={c.href}
          className={cn(
            "group relative overflow-hidden rounded-2xl border border-ink-200 shadow-card transition-all duration-300 hover:-translate-y-1",
            c.big
              ? "col-span-2 row-span-2 aspect-[16/10] lg:aspect-auto"
              : "aspect-[16/9]",
          )}
        >
          {c.image ? (
            <Image
              src={c.image}
              alt={c.title}
              fill
              sizes={c.big ? "(max-width:1024px) 100vw, 50vw" : "(max-width:1024px) 50vw, 25vw"}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-brand-500/20 to-accent-600/20">
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-500/20 ring-1 ring-brand-400/30">
                  <Megaphone size={22} weight="fill" className="text-brand-400" />
                </span>
                <span className="rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white/70">
                  görsel: {c.id}
                </span>
              </div>
            </div>
          )}

          {/* Metin overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 pt-10">
            <p
              className={cn(
                "font-bold text-white",
                c.big ? "text-xl" : "text-sm",
              )}
            >
              {c.title}
            </p>
            {c.subtitle && (
              <p className="mt-0.5 line-clamp-1 text-xs text-white/70">
                {c.subtitle}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
