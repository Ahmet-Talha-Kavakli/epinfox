"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  HandHeart,
  CheckCircle,
  Wallet,
  CircleNotch,
} from "@phosphor-icons/react";
import { makeDonation } from "@/lib/actions/account-extras";
import { useI18n } from "@/lib/i18n/provider";

const PRESETS = [25, 50, 100, 250];

/** Yayıncıya bağış formu — hazır tutarlar + özel tutar + mesaj.
 *  Cüzdandan gerçek düşüm yapar (wallet_donate RPC) ve donations'a kaydeder. */
export function DonationForm({
  publisherSlug,
  publisherName,
}: {
  publisherSlug: string;
  publisherName: string;
}) {
  const router = useRouter();
  const { t } = useI18n();
  const [amount, setAmount] = useState<number>(50);
  const [custom, setCustom] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const value = custom ? Number(custom) : amount;
  const valid = value >= 10;

  function submit() {
    setError(null);
    start(async () => {
      const r = await makeDonation({
        publisherSlug,
        publisherName,
        amount: value,
        displayName: displayName.trim() || null,
        message: message.trim() || null,
        anonymous: false,
      });
      if (r.ok) {
        setDone(true);
        router.refresh();
      } else {
        setError(r.error);
      }
    });
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-success-200 bg-success-50/60 p-6 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success-500 text-white shadow-soft">
          <CheckCircle size={30} weight="fill" />
        </span>
        <h3 className="mt-4 text-lg font-bold text-ink-900">{t("sup.publisher.thanksTitle")} 💙</h3>
        <p className="mt-1 text-sm text-ink-600">
          {t("sup.publisher.thanksBody")
            .replace("{publisher}", publisherName)
            .replace("{amount}", value.toLocaleString("tr-TR"))
            .replace("{name}", displayName.trim() || t("sup.publisher.anonymous"))}
        </p>
        <button
          type="button"
          onClick={() => {
            setDone(false);
            setMessage("");
            setCustom("");
            setDisplayName("");
          }}
          className="mt-4 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          {t("sup.publisher.newDonation")}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-soft">
      <h3 className="flex items-center gap-2 text-lg font-bold text-ink-900">
        <HandHeart size={20} weight="duotone" className="text-brand-600" />
        {t("sup.publisher.donate")}
      </h3>
      <p className="mt-1 text-sm text-ink-500">
        {t("sup.publisher.formSub").replace("{publisher}", publisherName)}
      </p>

      {/* Hazır tutarlar */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setAmount(p);
              setCustom("");
            }}
            className={`rounded-xl border-2 py-2.5 text-sm font-bold transition-colors ${
              !custom && amount === p
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-ink-200 text-ink-600 hover:border-brand-300"
            }`}
          >
            {p}₺
          </button>
        ))}
      </div>

      {/* Özel tutar */}
      <div className="mt-3">
        <label className="text-xs font-medium text-ink-500">{t("sup.publisher.customAmount")}</label>
        <input
          type="number"
          min={10}
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder={t("sup.publisher.customPlaceholder")}
          className="mt-1 w-full rounded-xl border border-ink-200 bg-ink-50 px-3.5 py-2.5 text-sm font-semibold text-ink-900 placeholder:font-normal placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
        />
      </div>

      {/* Görünecek isim */}
      <div className="mt-3">
        <label className="text-xs font-medium text-ink-500">
          {t("sup.publisher.displayName")}
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          maxLength={30}
          placeholder={t("sup.publisher.anonymous")}
          className="mt-1 w-full rounded-xl border border-ink-200 bg-ink-50 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
        />
        <p className="mt-1 text-[11px] text-ink-400">
          {t("sup.publisher.displayNameHint")}
        </p>
      </div>

      {/* Mesaj */}
      <div className="mt-3">
        <label className="text-xs font-medium text-ink-500">
          {t("sup.publisher.messageLabel")}
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          maxLength={120}
          placeholder={t("sup.publisher.messagePlaceholder")}
          className="mt-1 w-full resize-none rounded-xl border border-ink-200 bg-ink-50 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
        />
      </div>

      {/* Onayla */}
      <button
        type="button"
        disabled={!valid || pending}
        onClick={submit}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? (
          <CircleNotch size={17} className="animate-spin" />
        ) : (
          <Wallet size={17} weight="fill" />
        )}
        {valid
          ? t("sup.publisher.donateAmount").replace("{amount}", value.toLocaleString("tr-TR"))
          : t("sup.publisher.minAmount")}
      </button>
      {error && (
        <p className="mt-2 text-center text-sm font-medium text-danger-600">
          {error}
        </p>
      )}
      <p className="mt-2 text-center text-xs text-ink-400">
        {t("sup.publisher.deductNote")}
      </p>
    </div>
  );
}
