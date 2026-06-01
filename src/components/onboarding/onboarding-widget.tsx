"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Rocket,
  UserCircle,
  Wallet,
  ShoppingBag,
  Gift,
  Check,
  CaretRight,
  X,
  Confetti,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";
import type { OnboardingProgress } from "@/lib/actions/onboarding";

const ICONS: Record<string, Icon> = {
  UserCircle,
  Wallet,
  ShoppingBag,
  Gift,
};

// Tüm adımlar bitince bu sürüm localStorage'a yazılır → widget bir daha çıkmaz.
const DISMISS_KEY = "epinfox_onboarding_dismissed";

export function OnboardingWidget({ progress }: { progress: OnboardingProgress }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(true); // SSR'de gizli başla (hydration)

  // localStorage'ı yalnız client'ta oku.
  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  // Tamamlanınca kısa bir kutlama açılışı (yalnız bir kez).
  useEffect(() => {
    if (progress.complete && !dismissed) setOpen(true);
  }, [progress.complete, dismissed]);

  // Admin/hesap iç sayfalarında gizleme gibi bir kısıt istemiyoruz; her yerde görünür.
  if (dismissed) return null;
  // Hiç adım yoksa (teorik) gösterme.
  if (progress.total === 0) return null;

  const pct = Math.round((progress.doneCount / progress.total) * 100);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  return (
    <div className="fixed bottom-5 left-5 z-40 print:hidden">
      {/* Açık panel */}
      {open && (
        <div className="mb-3 w-[min(340px,calc(100vw-2.5rem))] overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-float">
          {/* Başlık — dekoratif görsel bant + soldan koyu gradyan (yazı okunur) */}
          <div className="relative overflow-hidden p-5 text-white">
            <Image
              src="/onboarding/onboarding-banner.webp"
              alt=""
              fill
              sizes="340px"
              className="object-cover object-right"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#0d1326]/95 via-[#0d1326]/70 to-transparent"
              aria-hidden
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("c2.onb.minimize")}
              className="absolute right-3 top-3 z-10 grid h-7 w-7 place-items-center rounded-full bg-black/20 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
            >
              <X size={16} weight="bold" />
            </button>
            <div className="relative">
              <div className="flex items-center gap-2">
                {progress.complete && (
                  <Confetti size={22} weight="fill" className="text-accent-300" />
                )}
                <h3 className="text-base font-bold">
                  {progress.complete ? t("c2.onb.allReady") : t("c2.onb.guide")}
                </h3>
              </div>
              <p className="mt-1 text-sm text-white/85">
                {progress.complete
                  ? t("c2.onb.allDone")
                  : t("c2.onb.progress")
                      .replace("{n}", String(progress.doneCount))
                      .replace("{total}", String(progress.total))}
              </p>
              {/* İlerleme çubuğu */}
              <div className="mt-3 h-2 w-full max-w-[180px] overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-accent-400 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Adımlar */}
          <ul className="divide-y divide-ink-100 p-2">
            {progress.steps.map((step) => {
              const Ico = ICONS[step.icon] ?? UserCircle;
              const isHere = pathname.startsWith(step.href) && step.href !== "/";
              return (
                <li key={step.key}>
                  <Link
                    href={step.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors",
                      step.done ? "opacity-70" : "hover:bg-ink-50",
                    )}
                  >
                    {/* Durum ikonu */}
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-full",
                        step.done
                          ? "bg-success-100 text-success-600"
                          : "bg-brand-50 text-brand-600",
                      )}
                    >
                      {step.done ? (
                        <Check size={18} weight="bold" />
                      ) : (
                        <Ico size={18} weight="duotone" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block text-sm font-semibold text-ink-900",
                          step.done && "line-through decoration-success-400",
                        )}
                      >
                        {step.title}
                      </span>
                      <span className="block truncate text-xs text-ink-500">
                        {step.description}
                      </span>
                    </span>
                    {!step.done && (
                      <CaretRight
                        size={16}
                        weight="bold"
                        className={cn(
                          "shrink-0 text-ink-300",
                          isHere && "text-brand-500",
                        )}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Tamamlandıysa kapat butonu */}
          {progress.complete && (
            <div className="border-t border-ink-100 p-3">
              <button
                type="button"
                onClick={dismiss}
                className="w-full rounded-2xl bg-brand-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-700"
              >
                {t("c2.onb.close")}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tetikleyici buton (her zaman görünür) */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("c2.onb.guide")}
        className={cn(
          "group flex items-center gap-2 rounded-full py-3 pl-3 pr-4 text-white shadow-float transition-all hover:-translate-y-0.5",
          progress.complete
            ? "bg-success-500 hover:bg-success-600"
            : "bg-brand-600 hover:bg-brand-700",
        )}
      >
        <span className="relative grid h-7 w-7 place-items-center">
          {progress.complete ? (
            <Confetti size={20} weight="fill" />
          ) : (
            <Rocket size={20} weight="fill" />
          )}
          {/* Kalan adım rozeti */}
          {!progress.complete && (
            <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white ring-2 ring-brand-600">
              {progress.total - progress.doneCount}
            </span>
          )}
        </span>
        <span className="text-sm font-bold">
          {progress.complete
            ? t("c2.onb.completed")
            : t("c2.onb.guidePct").replace("{pct}", String(pct))}
        </span>
      </button>
    </div>
  );
}
