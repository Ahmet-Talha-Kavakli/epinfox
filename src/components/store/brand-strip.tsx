import Link from "next/link";
import Image from "next/image";
import { Lightning } from "@phosphor-icons/react/dist/ssr";
import { TONE_STYLES, getToneTextureStyle, type Tone } from "@/lib/card-tones";
import type { Brand } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { getServerT } from "@/lib/i18n/server";

/** Çok çeşitli oyunlar — mağaza üstünde marka sayfalarına giriş. */
export async function BrandStrip({
  brands,
}: {
  brands: (Brand & { productCount: number })[];
}) {
  if (brands.length === 0) return null;

  const translate = await getServerT();

  return (
    <div className="mb-8">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-400">
        {translate("store.featuredGames")}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {brands.map((b) => {
          const tone = (b.tone as Tone) ?? "brand";
          const t = TONE_STYLES[tone];
          return (
            <Link
              key={b.id}
              href={`/brand/${b.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white transition-all hover:-translate-y-1 hover:shadow-card"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={getToneTextureStyle(tone)}
                  aria-hidden
                />
                {b.image_path ? (
                  <Image
                    src={b.image_path}
                    alt={b.name}
                    fill
                    sizes="160px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <div
                      className={cn(
                        "grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br",
                        t.iconBg,
                      )}
                    >
                      <Lightning size={18} weight="fill" className={t.iconColor} />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-semibold text-ink-900">
                  {b.name}
                </p>
                <p className="text-xs text-ink-400">
                  {b.productCount} {translate("store.brandVariants")}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
