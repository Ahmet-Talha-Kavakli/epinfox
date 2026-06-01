"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkle,
  X,
  Ticket,
  CheckCircle,
  WarningCircle,
  Gift,
} from "@phosphor-icons/react";
import { applyPromoCode } from "@/lib/actions/promo";
import { useI18n } from "@/lib/i18n/provider";

/** Sparkle (4-köşeli parıltı) ikonu — RGB gradient maskelemek için data-URI. */
const SPARKLE_MASK =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cpath fill='%23000' d='M208 144a15.78 15.78 0 0 1-10.42 14.94l-51.65 19l-19 51.61a15.92 15.92 0 0 1-29.88 0l-19-51.61l-51.65-19a15.92 15.92 0 0 1 0-29.88l51.65-19l19-51.61a15.92 15.92 0 0 1 29.88 0l19 51.61l51.65 19A15.78 15.78 0 0 1 208 144M152 48h16v16a8 8 0 0 0 16 0V48h16a8 8 0 0 0 0-16h-16V16a8 8 0 0 0-16 0v16h-16a8 8 0 0 0 0 16m88 32h-8v-8a8 8 0 0 0-16 0v8h-8a8 8 0 0 0 0 16h8v8a8 8 0 0 0 16 0v-8h8a8 8 0 0 0 0-16'/%3E%3C/svg%3E\")";

export function PromoCodeButton() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Diğer nav linkleri gibi sade — sadece ikon RGB */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-100 hover:text-ink-900"
        aria-label={t("c2.code.aria")}
      >
        {/* RGB ikon — gradient, ikon şekliyle maskelenir */}
        <span
          className="animate-rgb h-[17px] w-[17px] shrink-0 transition-transform group-hover:rotate-12"
          style={{
            WebkitMaskImage: SPARKLE_MASK,
            maskImage: SPARKLE_MASK,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
          }}
          aria-hidden
        />
        {t("c2.code.button")}
      </button>

      {open && <PromoModal onClose={() => setOpen(false)} />}
    </>
  );
}

function PromoModal({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [code, setCode] = useState("");
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<
    { ok: boolean; text: string } | null
  >(null);

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onEsc);
    const id = setTimeout(() => inputRef.current?.focus(), 60);
    return () => {
      document.removeEventListener("keydown", onEsc);
      clearTimeout(id);
    };
  }, [onClose]);

  function apply() {
    const key = code.trim();
    if (!key || pending) return;
    startTransition(async () => {
      const res = await applyPromoCode(key);
      if (res.ok) {
        setResult({ ok: true, text: res.message });
        router.refresh(); // bonus bakiye yüklendiyse header güncellensin
      } else {
        setResult({ ok: false, text: res.error });
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (ref.current && !ref.current.contains(e.target as Node)) onClose();
      }}
    >
      <div
        ref={ref}
        className="w-full max-w-md animate-scale-in overflow-hidden rounded-t-3xl border border-ink-200 bg-white shadow-float sm:rounded-3xl"
      >
        {/* RGB üst şerit */}
        <div className="animate-rgb h-1.5 w-full" />

        <div className="p-6">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-soft">
                <Gift size={22} weight="duotone" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-ink-900">
                  {t("c2.code.title")}
                </h2>
                <p className="text-xs text-ink-500">{t("c2.code.subtitle")}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={t("c2.loc.close")}
              className="grid h-9 w-9 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink-100"
            >
              <X size={18} />
            </button>
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 rounded-xl border-2 border-ink-200 bg-ink-50 px-3.5 py-1 focus-within:border-brand-400">
            <Ticket size={18} weight="duotone" className="text-brand-500" />
            <input
              ref={inputRef}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setResult(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && apply()}
              placeholder={t("c2.code.placeholder")}
              className="w-full bg-transparent py-2.5 text-sm font-semibold uppercase tracking-wide text-ink-900 placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-ink-400 focus:outline-none"
            />
          </div>

          {/* Sonuç */}
          {result && (
            <div
              className={`mt-3 flex items-start gap-2 rounded-xl px-3.5 py-3 text-sm ${
                result.ok
                  ? "bg-success-50 text-success-700"
                  : "bg-danger-50 text-danger-700"
              }`}
            >
              {result.ok ? (
                <CheckCircle size={18} weight="fill" className="mt-0.5 shrink-0" />
              ) : (
                <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0" />
              )}
              <span className="font-medium">{result.text}</span>
            </div>
          )}

          {/* Uygula */}
          <button
            type="button"
            onClick={apply}
            disabled={!code.trim() || pending}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkle size={16} weight="fill" />
            {pending ? t("c2.code.applying") : t("c2.code.apply")}
          </button>

          {/* Ayrıcalık ipucu */}
          <p className="mt-3 text-center text-xs text-ink-400">
            {t("c2.code.hint")}
          </p>
        </div>
      </div>
    </div>
  );
}
