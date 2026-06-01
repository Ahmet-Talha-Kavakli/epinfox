"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Gift, X, Sparkle, CheckCircle, Copy } from "@phosphor-icons/react";
import { applyPromoCode, getFeaturedPromo, type FeaturedPromo } from "@/lib/actions/promo";
import { useI18n } from "@/lib/i18n/provider";

const SEEN_KEY = "epinfox_promo_popup_seen";
const DELAY_MS = 12_000; // sayfa açıldıktan ~12 sn sonra
const COOLDOWN_MS = 1000 * 60 * 60 * 20; // 20 saat: günde ~1 kez

/**
 * Rastgele anlarda beliren indirim kuponu popup'ı (bu tarz sitelerdeki gibi).
 * - Sayfa açıldıktan kısa süre sonra, gün içinde bir kez gösterilir (localStorage).
 * - Aktif bir promo kodunu cazip bir kartta sunar; "Hemen Kullan" kodu uygular.
 */
export function PromoPopup() {
  const router = useRouter();
  const { t } = useI18n();
  const [promo, setPromo] = useState<FeaturedPromo>(null);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [applied, setApplied] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Cooldown kontrolü
    try {
      const seen = Number(localStorage.getItem(SEEN_KEY) || 0);
      if (Date.now() - seen < COOLDOWN_MS) return;
    } catch {
      return;
    }

    const timer = setTimeout(async () => {
      const featured = await getFeaturedPromo();
      if (featured) {
        setPromo(featured);
        setOpen(true);
        try {
          localStorage.setItem(SEEN_KEY, String(Date.now()));
        } catch {
          /* ignore */
        }
      }
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  if (!open || !promo) return null;

  const headline =
    promo.type === "bonus_balance"
      ? t("c2.promo.bonus").replace("{n}", String(promo.value))
      : promo.type === "percent"
        ? t("c2.promo.percent").replace("{n}", String(promo.value))
        : t("c2.promo.free");

  function close() {
    setOpen(false);
  }

  function use() {
    if (!promo || pending) return;
    startTransition(async () => {
      const res = await applyPromoCode(promo.code);
      if (res.ok) {
        setApplied(res.message);
        router.refresh();
      } else {
        setApplied(res.error);
      }
    });
  }

  function copy() {
    if (!promo) return;
    navigator.clipboard?.writeText(promo.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="fixed bottom-4 right-4 z-[150] w-[calc(100%-2rem)] max-w-sm animate-scale-in sm:bottom-6 sm:right-6">
      <div className="relative overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-float">
        {/* Canlı üst şerit */}
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
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-soft">
              <Gift size={26} weight="duotone" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-accent-600">
                {t("c2.promo.special")}
              </p>
              <h3 className="text-xl font-extrabold leading-tight text-ink-900">
                {headline}
              </h3>
            </div>
          </div>

          {promo.description && (
            <p className="mt-3 text-sm text-ink-600">{promo.description}</p>
          )}

          {/* Kod kutusu */}
          <button
            type="button"
            onClick={copy}
            className="mt-4 flex w-full items-center justify-between gap-2 rounded-xl border-2 border-dashed border-brand-300 bg-brand-50 px-4 py-3 transition-colors hover:bg-brand-100"
          >
            <span className="font-mono text-base font-bold tracking-widest text-brand-700">
              {promo.code}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-600">
              {copied ? (
                <>
                  <CheckCircle size={14} weight="fill" /> {t("c2.promo.copied")}
                </>
              ) : (
                <>
                  <Copy size={14} /> {t("c2.promo.copy")}
                </>
              )}
            </span>
          </button>

          {applied ? (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-success-50 px-3.5 py-3 text-sm text-success-700">
              <CheckCircle size={18} weight="fill" className="mt-0.5 shrink-0" />
              <span className="font-medium">{applied}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={use}
              disabled={pending}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
            >
              <Sparkle size={16} weight="fill" />
              {pending ? t("c2.promo.applying") : t("c2.promo.use")}
            </button>
          )}

          <p className="mt-2.5 text-center text-[11px] text-ink-400">
            {applied ? t("c2.promo.enjoy") : t("c2.promo.copyHint")}
          </p>
        </div>
      </div>
    </div>
  );
}
