import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Megaphone } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { getServerT } from "@/lib/i18n/server";

export interface CampaignCard {
  id: string;
  title: string;
  subtitle?: string;
  cta?: string; // "SATIN AL"
  href: string;
  image: string | null;
}

interface CampaignBentoProps {
  /** [büyük-sol, geniş-sağ-üst, küçük-1, küçük-2] sırasıyla 4 kart. */
  cards: [CampaignCard, CampaignCard, CampaignCard, CampaignCard];
}

/**
 * Kampanya bento (Hipopotamya düzeni):
 * - sol: 1 büyük kart (metin solda overlay + CTA)
 * - sağ üst: 1 geniş kart
 * - sağ alt: 2 küçük kart yan yana
 * Görsel yoksa şık placeholder ("görsel: <id>").
 */
export async function CampaignBento({ cards }: CampaignBentoProps) {
  const [big, wide, s1, s2] = cards;
  const t = await getServerT();
  const labels = {
    buy: t("misc.campaign.buy"),
    image: t("misc.campaign.imagePlaceholder"),
  };

  return (
    <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
      {/* SOL — büyük kart */}
      <Card card={big} variant="big" labels={labels} />

      {/* SAĞ — üst geniş + alt 2 küçük */}
      <div className="grid gap-3 sm:gap-4">
        <Card card={wide} variant="wide" labels={labels} />
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Card card={s1} variant="small" labels={labels} />
          <Card card={s2} variant="small" labels={labels} />
        </div>
      </div>
    </div>
  );
}

function Card({
  card,
  variant,
  labels,
}: {
  card: CampaignCard;
  variant: "big" | "wide" | "small";
  labels: { buy: string; image: string };
}) {
  return (
    <Link
      href={card.href}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-ink-200 shadow-card transition-all duration-300 hover:-translate-y-1",
        variant === "big" && "aspect-[16/11] lg:aspect-auto lg:h-full",
        variant === "wide" && "aspect-[21/8]",
        variant === "small" && "aspect-[16/10]",
      )}
    >
      {/* Görsel / placeholder */}
      {card.image ? (
        <Image
          src={card.image}
          alt={card.title}
          fill
          sizes={
            variant === "big"
              ? "(max-width:1024px) 100vw, 50vw"
              : variant === "wide"
                ? "(max-width:1024px) 100vw, 50vw"
                : "(max-width:1024px) 50vw, 25vw"
          }
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#1c1f26] to-[#2a2f3a]">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-500/20 ring-1 ring-brand-400/30">
              <Megaphone size={22} weight="fill" className="text-brand-400" />
            </span>
            <span className="rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white/70">
              {labels.image} {card.id}
            </span>
          </div>
        </div>
      )}

      {/* Metin — soldan okunur gradient (Hipopotamya: metin solda) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-center",
          variant === "small" ? "p-4" : "p-5 sm:p-7",
        )}
      >
        <p
          className={cn(
            "font-extrabold leading-tight text-white",
            variant === "big" && "max-w-[60%] text-2xl sm:text-3xl",
            variant === "wide" && "max-w-[55%] text-xl sm:text-2xl",
            variant === "small" && "max-w-[70%] text-base",
          )}
        >
          {card.title}
        </p>
        {card.subtitle && variant !== "small" && (
          <p className="mt-1.5 max-w-[55%] text-sm text-white/75">
            {card.subtitle}
          </p>
        )}
        <span
          className={cn(
            "mt-3 inline-flex w-fit items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white",
            variant === "big" &&
              "rounded-md bg-white/95 px-4 py-2 text-ink-900 transition-colors group-hover:bg-white",
          )}
        >
          {card.cta ?? labels.buy}
          <ArrowRight size={14} weight="bold" />
        </span>
      </div>
    </Link>
  );
}
