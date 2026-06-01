import Link from "next/link";
import Image from "next/image";
import { Lightning, CaretRight, Star } from "@phosphor-icons/react/dist/ssr";
import { TONE_STYLES, getToneTextureStyle, type Tone } from "@/lib/card-tones";
import { Stars } from "@/components/ui/star-rating";
import { Price } from "@/components/store/price";
import { cn } from "@/lib/utils";
import { getServerT } from "@/lib/i18n/server";
import type { ReviewSummary } from "@/lib/actions/reviews";

interface RelatedItem {
  id: string;
  name: string;
  slug: string;
  imagePath: string | null;
  minPrice: number;
}

export async function ProductSummarySidebar({
  product,
  tone,
  related,
  summary,
  tags,
}: {
  product: {
    name: string;
    imagePath: string | null;
    categoryName: string | null;
    variantCount: number;
  };
  tone: Tone;
  related: RelatedItem[];
  summary: ReviewSummary;
  tags: string[];
}) {
  const tn = TONE_STYLES[tone];
  const tr = await getServerT();
  // Memnuniyet: 4-5 yıldız oranı.
  const positive =
    summary.count > 0
      ? Math.round(
          ((summary.distribution[5] + summary.distribution[4]) /
            summary.count) *
            1000,
        ) / 10
      : 0;

  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      {/* Ürün logosu + ad */}
      <div className="rounded-2xl border border-ink-200 bg-white p-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-ink-200">
          <div
            className="absolute inset-0"
            style={getToneTextureStyle(tone)}
            aria-hidden
          />
          {product.imagePath ? (
            <Image
              src={product.imagePath}
              alt={product.name}
              fill
              sizes="300px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <div
                className={cn(
                  "grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ring-1",
                  tn.iconBg,
                  tn.iconRing,
                )}
              >
                <Lightning size={32} weight="fill" className={tn.iconColor} />
              </div>
            </div>
          )}
        </div>
        <h1 className="mt-3 text-lg font-bold text-ink-900">{product.name}</h1>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
          {product.categoryName && (
            <span className="rounded-full bg-ink-100 px-2 py-0.5 font-medium text-ink-600">
              {product.categoryName}
            </span>
          )}
          <span className="rounded-full bg-brand-50 px-2 py-0.5 font-medium text-brand-700">
            {product.variantCount} {tr("misc.product.variantCount")}
          </span>
        </div>
      </div>

      {/* Yorum özeti */}
      {summary.count > 0 && (
        <div className="rounded-2xl border border-ink-200 bg-white p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-400">
            {tr("misc.product.reviews")}
          </h3>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-4xl font-extrabold text-brand-600">
              {summary.average.toFixed(1)}
            </span>
            <div>
              <Stars value={summary.average} size={15} />
              <p className="mt-0.5 text-xs text-ink-500">
                {summary.count} {tr("misc.product.ratingsCount")}
              </p>
            </div>
          </div>

          {positive > 0 && (
            <p className="mt-2 text-sm">
              <span className="font-bold text-success-600">%{positive}</span>{" "}
              <span className="text-ink-500">
                {tr("misc.product.satisfaction")}
              </span>
            </p>
          )}

          {/* Dağılım barları */}
          <div className="mt-3 space-y-1.5">
            {([5, 4, 3, 2, 1] as const).map((star) => {
              const c = summary.distribution[star];
              const pct = summary.count ? (c / summary.count) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="flex w-7 items-center gap-0.5 text-ink-500">
                    {star}
                    <Star size={10} weight="fill" className="text-warning-400" />
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full bg-warning-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-9 text-right tabular-nums text-ink-400">
                    %{Math.round(pct)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Benzer ürünler */}
      {related.length > 0 && (
        <div className="rounded-2xl border border-ink-200 bg-white p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">
            {tr("misc.product.related")}
          </h3>
          <ul className="space-y-1">
            {related.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/product/${r.slug}`}
                  className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-ink-50"
                >
                  <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-ink-200 bg-ink-50">
                    {r.imagePath && (
                      <Image
                        src={r.imagePath}
                        alt={r.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink-800 group-hover:text-brand-600">
                      {r.name}
                    </span>
                    <Price
                      amountTRY={r.minPrice}
                      className="block text-xs font-semibold text-ink-500"
                    />
                  </span>
                  <CaretRight size={14} className="shrink-0 text-ink-300" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Etiketler */}
      {tags.length > 0 && (
        <div className="rounded-2xl border border-ink-200 bg-white p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">
            {tr("misc.product.tags")}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-ink-200 px-2 py-1 text-xs font-medium text-ink-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
