import Link from "next/link";
import Image from "next/image";
import { Lightning, Handbag } from "@phosphor-icons/react/dist/ssr";
import { TONE_STYLES, getToneTextureStyle, type Tone } from "@/lib/card-tones";
import { Price } from "@/components/store/price";
import { FavoriteButton } from "@/components/store/favorite-button";
import type { ProductWithMeta } from "@/lib/supabase/types";
import { getServerT } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

/**
 * Ürün kartı (Hipopotamya düzeni):
 * - üstte kare görsel (tam kaplar), indirim/satış rozetleri, hover'da sepet
 * - görselin ALTINDA, ortalı: isim + (indirimliyse eski fiyat üstü çizili) fiyat
 */
export async function ProductCard({
  product,
  forceProduct = false,
  favorited = false,
  isSignedIn = false,
}: {
  product: ProductWithMeta;
  /** Marka sayfasında: kart daima ürün detayına gitsin (markaya geri dönmesin). */
  forceProduct?: boolean;
  /** Bu ürün giriş yapan kullanıcının favorisi mi (kalp dolu gösterilir). */
  favorited?: boolean;
  /** Kullanıcı giriş yapmış mı (favori tıklayınca /sign-in yerine toggle). */
  isSignedIn?: boolean;
}) {
  const tt = await getServerT();
  const tone = (product.tone as Tone) ?? "brand";
  const t = TONE_STYLES[tone];
  const inStock = (product.stock ?? 0) > 0;
  const minPrice = product.minPrice ?? product.price;

  // İndirim: maxCompareAt (eski referans fiyat) > güncel fiyat ise.
  const compareAt = product.maxCompareAt ?? null;
  const hasDiscount = compareAt != null && compareAt > minPrice;
  const discountPct = hasDiscount
    ? Math.round(((compareAt - minPrice) / compareAt) * 100)
    : 0;

  // Markası olan ürün kartı marka sayfasına (tek tür bile olsa), yoksa ürüne
  // gider. forceProduct ise (marka sayfasındaki çeşit kartları) daima ürüne.
  const href =
    !forceProduct && product.brandSlug
      ? `/brand/${product.brandSlug}`
      : `/product/${product.slug}`;

  return (
    <Link href={href} className="group flex flex-col">
      {/* Görsel kart (kare) */}
      <div
        className={cn(
          "relative aspect-square overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card transition-all duration-300 group-hover:-translate-y-1",
          t.hoverShadow,
        )}
      >
        <div
          className="absolute inset-0"
          style={getToneTextureStyle(tone)}
          aria-hidden
        />
        {product.image_path ? (
          <Image
            src={product.image_path}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="relative object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <div
              className={cn(
                "grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br ring-1",
                t.iconBg,
                t.iconRing,
              )}
            >
              <Lightning size={24} weight="fill" className={t.iconColor} />
            </div>
          </div>
        )}

        {/* İndirim rozeti — sol üst, turuncu accent */}
        {hasDiscount && inStock && (
          <span
            className="absolute left-2.5 top-2.5 rounded-md bg-accent-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm"
            aria-label={`%${discountPct} ${tt("product.discountAria")}`}
          >
            %{discountPct}
          </span>
        )}

        {/* Favori kalp — sağ ÜSTTE, daima görünür (favoriyse dolu turuncu). */}
        <FavoriteButton
          productId={product.id}
          initialFavorited={favorited}
          isSignedIn={isSignedIn}
        />

        {/* Sepet ikonu — sağ ALTTA beyaz yuvarlak buton, SADECE kart hover'ında
            belirir (favori kalbiyle çakışmasın). Üstüne gelince mavi zemin. */}
        <span
          className="absolute bottom-2.5 right-2.5 grid h-10 w-10 translate-y-1 place-items-center rounded-full bg-white text-ink-600 opacity-0 shadow-soft ring-1 ring-ink-200/80 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-105 hover:bg-brand-600 hover:text-white hover:ring-brand-600"
          aria-label={tt("product.addToCartAria")}
        >
          <Handbag size={18} weight="fill" />
        </span>

        {/* Tükendi rozeti */}
        {!inStock && (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-ink-900/80 px-2 py-0.5 text-[11px] font-semibold text-white">
            {tt("product.outOfStockBadge")}
          </span>
        )}
      </div>

      {/* İsim + fiyat — kartın ALTINDA, ortalı */}
      <div className="mt-2.5 px-1 text-center">
        <h3 className="line-clamp-1 text-[13px] font-medium text-ink-700">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center justify-center gap-1.5">
          {hasDiscount && (
            <Price
              amountTRY={compareAt}
              className="text-xs font-medium text-ink-400 line-through"
            />
          )}
          <Price
            amountTRY={minPrice}
            className={cn(
              "block text-[15px] font-bold",
              hasDiscount ? "text-accent-600" : "text-ink-900",
            )}
          />
        </div>
      </div>
    </Link>
  );
}
