import { Star } from "@phosphor-icons/react/dist/ssr";
import { getServerT } from "@/lib/i18n/server";

export interface RecentReview {
  id: string;
  maskedName: string; // "A*** B***"
  productName: string;
  rating: number;
  comment: string | null;
  ago: string; // "1 ay önce"
}

function ReviewCard({
  r,
  boughtLabel,
}: {
  r: RecentReview;
  boughtLabel: string;
}) {
  return (
    <div className="w-[330px] shrink-0 rounded-xl border border-ink-200 bg-white p-4">
      {/* Üst: isim solda, zaman sağda */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-ink-900">
          {r.maskedName}
        </span>
        <span className="text-[11px] text-ink-400">{r.ago}</span>
      </div>

      {/* Yıldızlar — küçük, sıkışık */}
      <div className="mt-1 flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            weight="fill"
            className={i < r.rating ? "text-accent-500" : "text-ink-300"}
          />
        ))}
      </div>

      {/* "<ürün> adlı ürünü satın aldı" */}
      <p className="mt-1.5 text-[12px] leading-snug text-ink-500">
        <span className="text-info-600">{r.productName}</span> {boughtLabel}
      </p>

      {/* Kısa yorum */}
      {r.comment && (
        <p className="mt-1 line-clamp-1 text-[13px] text-ink-700">{r.comment}</p>
      )}
    </div>
  );
}

/**
 * "En Yeni Sipariş Yorumları" — SONSUZ KAYAN şerit (üst logo şeridiyle aynı
 * hareket). Sola kayar, hover'da durur. İçerik 2x kopyalanır.
 * Beslenen liste gerçek + sahte yorum karışımıdır (getRecentReviews).
 */
export async function RecentReviews({ reviews }: { reviews: RecentReview[] }) {
  if (!reviews.length) return null;
  const t = await getServerT();
  const boughtLabel = t("misc.reviews.bought");
  const loop = [...reviews, ...reviews];

  return (
    <div className="marquee-pause overflow-hidden py-1">
      <div className="animate-marquee flex w-max gap-4">
        {loop.map((r, i) => (
          <ReviewCard key={`${r.id}-${i}`} r={r} boughtLabel={boughtLabel} />
        ))}
      </div>
    </div>
  );
}
