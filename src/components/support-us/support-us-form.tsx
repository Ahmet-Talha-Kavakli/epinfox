"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Heart, CircleNotch, Wallet, Check, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { makeDonation } from "@/lib/actions/account-extras";
import { formatTL } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Confetti } from "@/components/support-us/confetti";
import { useI18n } from "@/lib/i18n/provider";

/* Platforma karşılıksız destek — cüzdandan bağış, karşılığında rozet.
   Bağış mevcut donations altyapısına 'epinfox-platform' alıcısıyla kaydedilir. */

const PLATFORM_SLUG = "epinfox-platform";
const PLATFORM_NAME = "EpinFox";

export interface Badge {
  key: string;
  labelKey: string; // i18n anahtarı
  threshold: number; // toplam destek (₺) eşiği
  img: string; // madalya görseli
}

const BADGES: Badge[] = [
  { key: "bronze", labelKey: "sup.donate.badge.bronze", threshold: 25, img: "/support-us/badge-bronze.png" },
  { key: "silver", labelKey: "sup.donate.badge.silver", threshold: 100, img: "/support-us/badge-silver.png" },
  { key: "gold", labelKey: "sup.donate.badge.gold", threshold: 250, img: "/support-us/badge-gold.png" },
  { key: "diamond", labelKey: "sup.donate.badge.diamond", threshold: 500, img: "/support-us/badge-diamond.png" },
  { key: "legend", labelKey: "sup.donate.badge.legend", threshold: 1000, img: "/support-us/badge-legend.png" },
];

const PRESETS = [25, 50, 100, 250, 500];

export function SupportUsForm({
  loggedIn,
  balance,
  totalSupport,
}: {
  loggedIn: boolean;
  balance: number;
  totalSupport: number;
}) {
  const router = useRouter();
  const { t } = useI18n();
  const [amount, setAmount] = useState<number>(50);
  const [custom, setCustom] = useState("");
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  // Teşekkür pop-up + konfeti
  const [thanks, setThanks] = useState<{ amount: number; badge: Badge | null } | null>(null);
  const [confettiKey, setConfettiKey] = useState(0);

  const value = custom ? Number(custom) : amount;
  const valid = value >= 10 && value <= balance;

  // Mevcut + sıradaki rozet
  const earned = BADGES.filter((b) => totalSupport >= b.threshold);
  const current = earned[earned.length - 1] ?? null;
  const next = BADGES.find((b) => totalSupport < b.threshold) ?? null;
  const prevThreshold = current?.threshold ?? 0;
  const progress = next
    ? Math.min(100, ((totalSupport - prevThreshold) / (next.threshold - prevThreshold)) * 100)
    : 100;

  function support() {
    setMsg(null);
    start(async () => {
      const r = await makeDonation({
        publisherSlug: PLATFORM_SLUG,
        publisherName: PLATFORM_NAME,
        amount: value,
        displayName: null,
        message: "Platforma destek",
        anonymous: false,
      });
      if (r.ok) {
        // Yeni toplamla kazanılan en yüksek rozeti hesapla
        const newTotal = totalSupport + value;
        const newlyEarned = [...BADGES].reverse().find((b) => newTotal >= b.threshold) ?? null;
        setThanks({ amount: value, badge: newlyEarned });
        setConfettiKey((k) => k + 1); // konfeti patlat
        setMsg(null);
        setCustom("");
        router.refresh();
      } else {
        setMsg({ ok: false, text: r.error });
      }
    });
  }

  return (
    <>
      {/* Konfeti + teşekkür pop-up */}
      <Confetti fire={confettiKey} />
      {thanks && (
        <ThanksModal data={thanks} onClose={() => setThanks(null)} t={t} />
      )}

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      {/* Sol: bağış formu */}
      <div className="space-y-6">
        {/* Hero — banner görseli arka plan, yazı üstte (diğer sayfalarla aynı düzen) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 to-red-700 p-7 text-white">
          {/* Banner görseli — sağa yaslı maskot */}
          <Image
            src="/support-us/hero-fox-heart.png"
            alt=""
            fill
            priority
            aria-hidden
            className="pointer-events-none object-contain object-right opacity-90"
          />
          {/* Okunabilirlik için soldan karartma */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-rose-700/90 via-rose-600/60 to-transparent" />
          <div className="relative max-w-md">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15">
              <Heart size={26} weight="fill" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold">{t("sup.donate.heroTitle")}</h1>
            <p className="mt-2 text-white/90">
              {t("sup.donate.heroLead1")}{" "}
              <strong>{t("sup.donate.heroLeadBadges")}</strong>{" "}
              {t("sup.donate.heroLead2")} 🦊
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-ink-200 bg-white p-6">
          {!loggedIn ? (
            <div className="py-6 text-center">
              <p className="text-sm text-ink-600">
                {t("sup.donate.loginPrompt")}
              </p>
              <Button asChild className="mt-3">
                <Link href="/sign-in?next=/support-us">{t("sup.donate.loginCta")}</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between rounded-xl bg-ink-50 px-4 py-2.5">
                <span className="flex items-center gap-2 text-sm text-ink-600">
                  <Wallet size={16} weight="duotone" /> {t("sup.donate.walletBalance")}
                </span>
                <span className="text-sm font-bold text-ink-900">{formatTL(balance)}</span>
              </div>

              <p className="mb-2 text-sm font-medium text-ink-800">{t("sup.donate.amountLabel")}</p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => { setAmount(p); setCustom(""); }}
                    className={cn(
                      "rounded-xl border px-4 py-2 text-sm font-semibold transition-colors",
                      !custom && amount === p
                        ? "border-rose-400 bg-rose-50 text-rose-700"
                        : "border-ink-200 text-ink-600 hover:bg-ink-50",
                    )}
                  >
                    {formatTL(p)}
                  </button>
                ))}
                <div className="flex items-center gap-1 rounded-xl border border-ink-200 px-3 focus-within:border-rose-400">
                  <input
                    type="number"
                    min={10}
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    placeholder={t("sup.donate.customPlaceholder")}
                    className="w-20 bg-transparent py-2 text-sm font-semibold text-ink-900 focus:outline-none"
                  />
                  <span className="text-sm text-ink-400">₺</span>
                </div>
              </div>

              {value > balance && (
                <p className="mt-2 text-xs font-medium text-danger-600">{t("sup.donate.insufficient")}</p>
              )}

              <Button onClick={support} disabled={pending || !valid} className="mt-5 bg-rose-600 hover:bg-rose-700">
                {pending ? <CircleNotch size={16} className="animate-spin" /> : <Heart size={16} weight="fill" />}
                {t("sup.donate.supportCta").replace("{amount}", formatTL(value || 0))}
              </Button>
              <p className="mt-2 text-xs text-ink-400">{t("sup.donate.disclaimer")}</p>

              {msg && (
                <p className={cn("mt-3 text-sm font-medium", msg.ok ? "text-success-600" : "text-danger-600")}>
                  {msg.text}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Sağ: rozetler */}
      <div className="space-y-4">
        {loggedIn && (
          <div className="rounded-2xl border border-ink-200 bg-white p-5">
            <p className="text-xs text-ink-500">{t("sup.donate.totalSupport")}</p>
            <p className="text-2xl font-extrabold text-rose-600">{formatTL(totalSupport)}</p>
            {current && (
              <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-ink-900">
                <Image src={current.img} alt="" width={20} height={20} className="h-5 w-5 object-contain" />
                {t("sup.donate.haveBadge").replace("{badge}", t(current.labelKey))}
              </p>
            )}
            {next && (
              <>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-500" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-1.5 text-xs text-ink-500">
                  {t("sup.donate.nextRemaining").replace("{amount}", formatTL(next.threshold - totalSupport))} → <strong>{t(next.labelKey)}</strong>
                </p>
              </>
            )}
          </div>
        )}

        <div className="rounded-2xl border border-ink-200 bg-white p-5">
          <h2 className="mb-3 font-bold text-ink-900">{t("sup.donate.badgesTitle")}</h2>
          <div className="space-y-2.5">
            {BADGES.map((b) => {
              const has = loggedIn && totalSupport >= b.threshold;
              return (
                <div
                  key={b.key}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3 transition-colors",
                    has ? "border-rose-200 bg-rose-50/50" : "border-ink-200",
                  )}
                >
                  <Image
                    src={b.img}
                    alt={t(b.labelKey)}
                    width={64}
                    height={64}
                    className={cn(
                      "h-16 w-12 shrink-0 object-contain",
                      !has && "opacity-40 grayscale",
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink-900">{t(b.labelKey)}</p>
                    <p className="text-xs text-ink-500">{t("sup.donate.badgeThreshold").replace("{amount}", formatTL(b.threshold))}</p>
                  </div>
                  {has && <Check size={18} weight="bold" className="shrink-0 text-rose-500" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

/* Teşekkür pop-up — bağış sonrası konfetiyle birlikte açılır. */
function ThanksModal({
  data,
  onClose,
  t,
}: {
  data: { amount: number; badge: Badge | null };
  onClose: () => void;
  t: (key: string) => string;
}) {
  return (
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="animate-scale-in w-full max-w-sm overflow-hidden rounded-3xl border border-ink-200 bg-white text-center shadow-float">
        {/* Üst — kutlama görseli, rose gradyan zemin */}
        <div className="relative bg-gradient-to-br from-rose-500 to-red-600 px-6 pt-6">
          <button
            type="button"
            onClick={onClose}
            aria-label={t("sup.donate.close")}
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
          >
            <X size={18} />
          </button>
          <Image
            src="/support-us/thanks-fox.png"
            alt={t("sup.donate.thanksTitle")}
            width={200}
            height={200}
            className="mx-auto h-44 w-44 object-contain drop-shadow-xl"
          />
        </div>

        <div className="px-6 py-6">
          <h2 className="text-xl font-extrabold text-ink-900">{t("sup.donate.thanksTitle")} ❤️</h2>
          <p className="mt-1.5 text-sm text-ink-600">
            <span className="font-bold text-rose-600">{formatTL(data.amount)}</span>{" "}
            {t("sup.donate.thanksBody")}
          </p>

          {data.badge && (
            <div className="mt-4 inline-flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50/60 px-4 py-2.5">
              <Image src={data.badge.img} alt="" width={36} height={36} className="h-9 w-9 object-contain" />
              <div className="text-left">
                <p className="text-[11px] text-ink-500">{t("sup.donate.yourBadge")}</p>
                <p className="text-sm font-bold text-ink-900">{t(data.badge.labelKey)}</p>
              </div>
            </div>
          )}

          <Button onClick={onClose} className="mt-5 w-full bg-rose-600 hover:bg-rose-700">
            {t("sup.donate.thanksOk")}
          </Button>
        </div>
      </div>
    </div>
  );
}
