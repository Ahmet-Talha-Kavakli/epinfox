"use client";

import { useState, useEffect, useTransition } from "react";
import { usePathname } from "next/navigation";
import { Star, X, CheckCircle, Heart } from "@phosphor-icons/react";
import { submitSatisfaction } from "@/lib/actions/satisfaction";
import { useI18n } from "@/lib/i18n/provider";

const SEEN_KEY = "epinfox_satisfaction_seen";
const DELAY_MS = 35_000; // sayfada ~35 sn sonra (promo'dan sonra gelsin)
const COOLDOWN_MS = 1000 * 60 * 60 * 24 * 7; // haftada 1 kez

const LABEL_KEYS = [
  "",
  "c2.sat.veryBad",
  "c2.sat.bad",
  "c2.sat.ok",
  "c2.sat.good",
  "c2.sat.great",
];

/** Seçili puana göre yıldız rengi: 1 kırmızı, 2 sarı, 3 yeşil, 4-5 turuncu. */
function starColor(level: number): string {
  if (level <= 1) return "text-danger-500";
  if (level === 2) return "text-yellow-400";
  if (level === 3) return "text-success-500";
  return "text-accent-500"; // 4-5 turuncu
}

/**
 * Rastgele beliren memnuniyet anketi (promo-popup tarzı). 1-5 yıldız + opsiyonel
 * yorum. Haftada bir kez gösterilir (localStorage cooldown). Tilki maskotlu.
 */
export function SatisfactionPopup() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);
  const [imgOk, setImgOk] = useState(true);
  const [pending, start] = useTransition();

  useEffect(() => {
    try {
      const seen = Number(localStorage.getItem(SEEN_KEY) || 0);
      if (Date.now() - seen < COOLDOWN_MS) return;
    } catch {
      return;
    }
    const t = setTimeout(() => {
      setOpen(true);
      try {
        localStorage.setItem(SEEN_KEY, String(Date.now()));
      } catch {
        /* ignore */
      }
    }, DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;

  function close() {
    setOpen(false);
  }

  function submit() {
    if (rating < 1 || pending) return;
    start(async () => {
      await submitSatisfaction({ rating, comment, path: pathname });
      setDone(true);
      setTimeout(() => setOpen(false), 1800);
    });
  }

  const shown = hover || rating;

  return (
    <div className="fixed bottom-4 right-4 z-[150] w-[calc(100%-2rem)] max-w-sm animate-scale-in sm:bottom-6 sm:right-6">
      <div className="relative overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-float">
        <div className="animate-rgb h-1.5 w-full" />

        <button
          type="button"
          onClick={close}
          aria-label={t("c2.loc.close")}
          className="absolute right-3 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/5 text-ink-500 transition-colors hover:bg-black/10"
        >
          <X size={16} />
        </button>

        <div className="p-6">
          {done ? (
            <div className="flex flex-col items-center py-4 text-center">
              <Heart size={40} weight="fill" className="text-accent-500" />
              <p className="mt-3 text-lg font-extrabold text-ink-900">
                {t("c2.sat.thanks")}
              </p>
              <p className="mt-1 text-sm text-ink-600">{t("c2.sat.valued")}</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                {/* Tilki maskotu — görsel yoksa emoji fallback */}
                {imgOk ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="/promo/feedback-fox.webp"
                    alt="EpinFox"
                    onError={() => setImgOk(false)}
                    className="h-14 w-14 shrink-0 object-contain"
                  />
                ) : (
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-2xl shadow-soft">
                    🦊
                  </span>
                )}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-accent-600">
                    {t("c2.sat.gotSecond")}
                  </p>
                  <h3 className="text-lg font-extrabold leading-tight text-ink-900">
                    {t("c2.sat.howFind")}
                  </h3>
                </div>
              </div>

              {/* Yıldızlar */}
              <div className="mt-4 flex items-center justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    aria-label={t("c2.sat.starAria").replace("{n}", String(n))}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={34}
                      weight={n <= shown ? "fill" : "regular"}
                      className={n <= shown ? starColor(shown) : "text-ink-300"}
                    />
                  </button>
                ))}
              </div>
              <p className="mt-1.5 h-4 text-center text-xs font-medium text-ink-500">
                {shown ? t(LABEL_KEYS[shown]) : ""}
              </p>

              {/* Yorum (puan seçilince) */}
              {rating > 0 && (
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={2}
                  maxLength={1000}
                  placeholder={t("c2.sat.commentPlaceholder")}
                  className="mt-3 w-full resize-none rounded-xl border border-ink-200 bg-ink-50 px-3.5 py-2.5 text-sm text-ink-700 placeholder:text-ink-400 focus:border-brand-300 focus:bg-white focus:outline-none"
                />
              )}

              <button
                type="button"
                onClick={submit}
                disabled={rating < 1 || pending}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
              >
                <CheckCircle size={16} weight="fill" />
                {pending ? t("c2.sat.sending") : t("c2.sat.send")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
