"use client";

import { useState, useRef, useTransition } from "react";
import { applyForPublisher } from "@/lib/actions/publisher";
import {
  YoutubeLogo,
  TwitchLogo,
  TiktokLogo,
  InstagramLogo,
  GameController,
  Link as LinkIcon,
  TextT,
  HandHeart,
  BellRinging,
  Camera,
  CheckCircle,
  PaperPlaneTilt,
  Check,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n/provider";

/* ─── Sabitler ─── */

const PLATFORMS: { id: string; label: string; icon: Icon; color: string }[] = [
  { id: "youtube", label: "YouTube", icon: YoutubeLogo, color: "text-red-600" },
  { id: "twitch", label: "Twitch", icon: TwitchLogo, color: "text-purple-600" },
  { id: "kick", label: "Kick", icon: GameController, color: "text-green-600" },
  { id: "tiktok", label: "TikTok", icon: TiktokLogo, color: "text-ink-800" },
  { id: "instagram", label: "Instagram", icon: InstagramLogo, color: "text-pink-600" },
];

/** Takipçi kademesi → komisyon oranı (takipçi arttıkça komisyon düşer). */
const TIERS = [
  { id: "t1", label: "0 – 10.000", commission: 10 },
  { id: "t2", label: "10.000 – 50.000", commission: 7 },
  { id: "t3", label: "50.000 – 200.000", commission: 5 },
  { id: "t4", label: "200.000+", commission: 3 },
];

const MIN_DONATIONS = [10, 25, 50, 100];

const ALERT_PROVIDERS: { value: string; labelKey?: string }[] = [
  { value: "StreamElements" },
  { value: "Streamlabs" },
  { value: "OBS", labelKey: "sup.publisher.obsBrowserSource" },
];

/* ─── Alt bileşenler ─── */

function FieldLabel({
  icon: Icon,
  children,
  hint,
}: {
  icon: Icon;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-2">
      <label className="flex items-center gap-1.5 text-sm font-bold text-ink-900">
        <Icon size={16} weight="duotone" className="text-brand-600" />
        {children}
      </label>
      {hint && <p className="mt-0.5 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}

/* ─── Ana form ─── */

export function PublisherApplyForm() {
  const { t } = useI18n();
  const [platform, setPlatform] = useState<string>("");
  const [tier, setTier] = useState<string>("");
  const [streamUrl, setStreamUrl] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const [minDonation, setMinDonation] = useState<number>(25);
  const [customMin, setCustomMin] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [alertOn, setAlertOn] = useState(true);
  const [alertProvider, setAlertProvider] = useState(ALERT_PROVIDERS[0].value);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const minValue = customMin ? Number(customMin) : minDonation;
  const valid =
    platform && tier && streamUrl.trim() && pageTitle.trim() && minValue >= 5;

  function submit() {
    if (!valid || pending) return;
    setError(null);
    startTransition(async () => {
      const res = await applyForPublisher({
        platform,
        tier,
        streamUrl: streamUrl.trim(),
        pageTitle: pageTitle.trim(),
        minDonation: minValue,
        alertProvider: alertOn ? alertProvider : null,
      });
      if (res.ok) setSubmitted(true);
      else setError(res.error);
    });
  }

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setPhoto(URL.createObjectURL(f));
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-success-200 bg-success-50/60 p-10 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-500 text-white shadow-soft">
          <CheckCircle size={32} weight="fill" />
        </span>
        <h2 className="mt-5 text-xl font-bold text-ink-900">{t("sup.publisher.applyDoneTitle")} 🎉</h2>
        <p className="mx-auto mt-2 max-w-md text-ink-600">
          {t("sup.publisher.applyDoneBody")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1 — Platform */}
      <section className="rounded-2xl border border-ink-200 bg-white p-6 shadow-soft">
        <FieldLabel icon={BellRinging} hint={t("sup.publisher.platformHint")}>
          {t("sup.publisher.platformLabel")}
        </FieldLabel>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {PLATFORMS.map((p) => {
            const active = platform === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlatform(p.id)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-ink-200 text-ink-600 hover:border-brand-300"
                }`}
              >
                <p.icon size={24} weight="fill" className={active ? "text-brand-600" : p.color} />
                {p.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 2 — Takipçi + komisyon tablosu */}
      <section className="rounded-2xl border border-ink-200 bg-white p-6 shadow-soft">
        <FieldLabel icon={HandHeart} hint={t("sup.publisher.tierHint")}>
          {t("sup.publisher.tierLabel")}
        </FieldLabel>

        {/* Tablo başlığı */}
        <div className="mt-2 overflow-hidden rounded-xl border border-ink-200">
          <div className="grid grid-cols-[1.6fr_1fr_1fr] gap-2 bg-ink-50 px-4 py-2.5 text-xs font-bold text-ink-500">
            <span>{t("sup.publisher.tierColRange")}</span>
            <span className="text-center">{t("sup.publisher.tierColCommission")}</span>
            <span className="text-center">{t("sup.publisher.tierColBlock")}</span>
          </div>
          {TIERS.map((tier_) => {
            const active = tier === tier_.id;
            return (
              <button
                key={tier_.id}
                type="button"
                onClick={() => setTier(tier_.id)}
                className={`grid w-full grid-cols-[1.6fr_1fr_1fr] items-center gap-2 border-t border-ink-100 px-4 py-3 text-left transition-colors ${
                  active ? "bg-brand-50" : "hover:bg-ink-50"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
                      active ? "border-brand-600 bg-brand-600" : "border-ink-300"
                    }`}
                  >
                    {active && <Check size={12} weight="bold" className="text-white" />}
                  </span>
                  <span className="text-sm font-semibold text-ink-900">{tier_.label}</span>
                </span>
                <span className="text-center">
                  <span className="inline-block rounded-md bg-ink-100 px-2.5 py-1 text-sm font-bold text-ink-900">
                    %{tier_.commission}
                  </span>
                </span>
                <span className="text-center">
                  <span className="inline-block rounded-md bg-success-50 px-2.5 py-1 text-sm font-semibold text-success-700">
                    {t("sup.publisher.noBlock")}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3 & 4 — Yayın adresi + Sayfa başlığı */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-soft">
          <FieldLabel icon={LinkIcon}>{t("sup.publisher.streamUrlLabel")}</FieldLabel>
          <input
            type="url"
            value={streamUrl}
            onChange={(e) => setStreamUrl(e.target.value)}
            placeholder="https://twitch.tv/kullaniciadi"
            className="w-full rounded-xl border border-ink-200 bg-ink-50 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
          />
        </div>
        <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-soft">
          <FieldLabel icon={TextT} hint={t("sup.publisher.pageTitleHint")}>
            {t("sup.publisher.pageTitleLabel")}
          </FieldLabel>
          <input
            type="text"
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            maxLength={50}
            placeholder={t("sup.publisher.pageTitlePlaceholder")}
            className="w-full rounded-xl border border-ink-200 bg-ink-50 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
          />
        </div>
      </section>

      {/* 5 — Minimum bağış */}
      <section className="rounded-2xl border border-ink-200 bg-white p-6 shadow-soft">
        <FieldLabel icon={HandHeart} hint={t("sup.publisher.minDonationHint")}>
          {t("sup.publisher.minDonationLabel")}
        </FieldLabel>
        <div className="flex flex-wrap items-center gap-2">
          {MIN_DONATIONS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMinDonation(m);
                setCustomMin("");
              }}
              className={`rounded-xl border-2 px-4 py-2 text-sm font-bold transition-colors ${
                !customMin && minDonation === m
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-ink-200 text-ink-600 hover:border-brand-300"
              }`}
            >
              {m}₺
            </button>
          ))}
          <div className="flex items-center gap-1.5 rounded-xl border-2 border-ink-200 px-3 py-1 focus-within:border-brand-400">
            <input
              type="number"
              min={5}
              value={customMin}
              onChange={(e) => setCustomMin(e.target.value)}
              placeholder={t("sup.publisher.custom")}
              className="w-20 bg-transparent py-1 text-sm font-semibold text-ink-900 placeholder:font-normal placeholder:text-ink-400 focus:outline-none"
            />
            <span className="text-sm text-ink-400">₺</span>
          </div>
        </div>
      </section>

      {/* 6 — Profil fotoğrafı */}
      <section className="rounded-2xl border border-ink-200 bg-white p-6 shadow-soft">
        <FieldLabel icon={Camera} hint={t("sup.publisher.photoHint")}>
          {t("sup.publisher.photoLabel")}
        </FieldLabel>
        <div className="flex items-center gap-4">
          <span className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-ink-300 bg-ink-50 text-ink-400">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt={t("sup.publisher.preview")} className="h-full w-full object-cover" />
            ) : (
              <Camera size={26} weight="duotone" />
            )}
          </span>
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onPhoto}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-xl border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            >
              {photo ? t("sup.publisher.changePhoto") : t("sup.publisher.uploadPhoto")}
            </button>
            <p className="mt-1.5 text-xs text-ink-400">{t("sup.publisher.photoTip")}</p>
          </div>
        </div>
      </section>

      {/* 7 — Yayın içi alert */}
      <section className="rounded-2xl border border-ink-200 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <FieldLabel icon={BellRinging} hint={t("sup.publisher.alertHint")}>
            {t("sup.publisher.alertLabel")}
          </FieldLabel>
          {/* Toggle */}
          <button
            type="button"
            onClick={() => setAlertOn((v) => !v)}
            role="switch"
            aria-checked={alertOn}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
              alertOn ? "bg-brand-600" : "bg-ink-300"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                alertOn ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>

        {alertOn && (
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {ALERT_PROVIDERS.map((prov) => {
              const active = alertProvider === prov.value;
              return (
                <button
                  key={prov.value}
                  type="button"
                  onClick={() => setAlertProvider(prov.value)}
                  className={`rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
                    active
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-ink-200 text-ink-600 hover:border-brand-300"
                  }`}
                >
                  {prov.labelKey ? t(prov.labelKey) : prov.value}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Gönder */}
      <button
        type="button"
        disabled={!valid || pending}
        onClick={submit}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-6 py-4 text-base font-bold text-white shadow-soft transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <PaperPlaneTilt size={18} weight="fill" />
        {pending ? t("sup.publisher.submitting") : t("sup.publisher.submitApply")}
      </button>
      {error && (
        <p className="text-center text-sm font-medium text-danger-600">{error}</p>
      )}
      {!valid && !error && (
        <p className="text-center text-xs text-ink-400">
          {t("sup.publisher.fillRequired")}
        </p>
      )}
    </div>
  );
}
