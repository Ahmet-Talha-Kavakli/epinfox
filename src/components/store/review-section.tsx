"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CircleNotch, PencilSimple, Trash, ChatCircle } from "@phosphor-icons/react";
import { Stars, StarPicker } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { UserAvatar } from "@/components/account/user-avatar";
import { submitReview, deleteReview } from "@/lib/actions/reviews";
import type { ReviewSummary } from "@/lib/actions/reviews";
import type { Review, ReviewWithAuthor } from "@/lib/supabase/types";
import { formatDate, cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

export function ReviewSection({
  productId,
  reviews,
  summary,
  canReview,
  mine,
  isSignedIn,
  embedded = false,
}: {
  productId: string;
  reviews: ReviewWithAuthor[];
  summary: ReviewSummary;
  canReview: boolean;
  mine: Review | null;
  isSignedIn: boolean;
  /** Sekme içinde kullanılıyorsa dış boşluk + büyük başlık gizlenir. */
  embedded?: boolean;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(mine?.rating ?? 5);
  const [body, setBody] = useState(mine?.body ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function save() {
    setError(null);
    start(async () => {
      const r = await submitReview({ productId, rating, body });
      if (!r.ok) {
        setError(r.error);
        return;
      }
      setEditing(false);
      router.refresh();
    });
  }

  function remove() {
    start(async () => {
      await deleteReview(productId);
      setEditing(false);
      router.refresh();
    });
  }

  return (
    <div className={embedded ? "" : "mt-12"}>
      {!embedded && (
        <h2 className="text-lg font-semibold text-ink-900">
          {t("c1.review.title")}
          {summary.count > 0 && (
            <span className="ml-2 text-sm font-normal text-ink-400">
              ({summary.count})
            </span>
          )}
        </h2>
      )}

      <div
        className={cn(
          "grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]",
          !embedded && "mt-4",
        )}
      >
        {/* Özet + form */}
        <div className="space-y-4">
          {/* Özet kartı */}
          <div className="rounded-2xl border border-ink-200 bg-white p-5">
            {summary.count === 0 ? (
              <div className="text-center">
                <ChatCircle
                  size={28}
                  weight="duotone"
                  className="mx-auto text-ink-300"
                />
                <p className="mt-2 text-sm text-ink-500">{t("c1.review.empty")}</p>
              </div>
            ) : (
              <>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-extrabold text-ink-900">
                    {summary.average.toFixed(1)}
                  </span>
                  <span className="mb-1.5 text-sm text-ink-400">/ 5</span>
                </div>
                <Stars value={summary.average} size={18} className="mt-1" />
                <p className="mt-1 text-xs text-ink-400">
                  {summary.count} {t("c1.review.countLabel")}
                </p>
                {/* Dağılım */}
                <div className="mt-4 space-y-1.5">
                  {([5, 4, 3, 2, 1] as const).map((star) => {
                    const c = summary.distribution[star];
                    const pct = summary.count ? (c / summary.count) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="w-3 text-ink-500">{star}</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                          <div
                            className="h-full rounded-full bg-warning-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-6 text-right text-ink-400">{c}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Yorum yapma / düzenleme */}
          <div className="rounded-2xl border border-ink-200 bg-white p-5">
            {!isSignedIn ? (
              <p className="text-sm text-ink-500">
                {t("c1.review.signInRequired")}
              </p>
            ) : !canReview ? (
              <p className="text-sm text-ink-500">
                {t("c1.review.purchaseRequired")}
              </p>
            ) : mine && !editing ? (
              <div>
                <p className="text-sm font-medium text-ink-900">{t("c1.review.yourReview")}</p>
                <Stars value={mine.rating} size={16} className="mt-1.5" />
                {mine.body && (
                  <p className="mt-2 text-sm text-ink-600">{mine.body}</p>
                )}
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setRating(mine.rating);
                      setBody(mine.body ?? "");
                      setEditing(true);
                    }}
                  >
                    <PencilSimple size={15} /> {t("c1.review.edit")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={remove}
                    disabled={pending}
                    className="text-danger-600"
                  >
                    <Trash size={15} /> {t("c1.review.delete")}
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-ink-900">
                  {mine ? t("c1.review.editTitle") : t("c1.review.createTitle")}
                </p>
                <div className="mt-2">
                  <StarPicker value={rating} onChange={setRating} />
                </div>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={3}
                  placeholder={t("c1.review.placeholder")}
                  className="mt-3"
                  disabled={pending}
                />
                {error && (
                  <p className="mt-2 text-sm font-medium text-danger-600">
                    {error}
                  </p>
                )}
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={save} disabled={pending}>
                    {pending ? (
                      <CircleNotch size={15} className="animate-spin" />
                    ) : (
                      t("c1.review.submit")
                    )}
                  </Button>
                  {(mine || editing) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditing(false)}
                      disabled={pending}
                    >
                      {t("c1.review.cancel")}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Yorum listesi */}
        <div>
          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-200 py-14 text-center text-sm text-ink-400">
              {t("c1.review.beFirst")}
            </div>
          ) : (
            <ul className="space-y-3">
              {reviews.map((r) => (
                <li
                  key={r.id}
                  className={cn(
                    "rounded-2xl border bg-white p-4",
                    mine && r.user_id === mine.user_id
                      ? "border-brand-200 bg-brand-50/30"
                      : "border-ink-200",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <UserAvatar
                      name={r.author?.nickname ?? t("c1.review.userFallback")}
                      avatarPath={r.author?.avatar_path ?? null}
                      size={36}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-ink-900">
                          {r.author?.nickname ?? t("c1.review.userFallback")}
                        </span>
                        <span className="rounded-full bg-success-50 px-1.5 py-0.5 text-[10px] font-medium text-success-700">
                          {t("c1.review.verifiedBuyer")}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <Stars value={r.rating} size={13} />
                        <span className="text-xs text-ink-400">
                          {formatDate(r.created_at)}
                        </span>
                      </div>
                      {r.body && (
                        <p className="mt-2 text-sm leading-relaxed text-ink-600">
                          {r.body}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
