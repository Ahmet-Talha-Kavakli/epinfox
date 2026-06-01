"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlass,
  CaretDown,
  CaretLeft,
  Check,
  Plus,
  CircleNotch,
  Gift,
  CheckCircle,
  Copy,
  Info,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { topUpBalance } from "@/lib/actions/wallet";
import { bonusFor } from "@/lib/wallet-bonus";
import { useI18n } from "@/lib/i18n/provider";
import { PAYMENT_METHODS, type PaymentMethodDef } from "@/lib/payment-methods";
import { cn } from "@/lib/utils";

const PRESETS = [50, 100, 250, 500, 1000];

const COUNTRIES = [
  { code: "TR", labelKey: "account.wallet.country.tr", flag: "🇹🇷" },
  { code: "GLOBAL", labelKey: "account.wallet.country.global", flag: "🌍" },
] as const;

export function TopUpFlow() {
  const router = useRouter();
  const { money, t } = useI18n();

  const [selected, setSelected] = useState<PaymentMethodDef | null>(null);
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<(typeof COUNTRIES)[number]>(COUNTRIES[0]);
  const [countryOpen, setCountryOpen] = useState(false);

  const [amount, setAmount] = useState<number>(100);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return PAYMENT_METHODS.filter((m) => {
      const regionOk =
        country.code === "GLOBAL" ? true : m.regions.includes("TR") || m.regions.includes("GLOBAL");
      const queryOk =
        q === "" ||
        t(m.titleKey).toLocaleLowerCase("tr").includes(q) ||
        t(m.descKey).toLocaleLowerCase("tr").includes(q);
      return regionOk && queryOk;
    });
  }, [query, country, t]);

  const effective = custom !== "" ? Number(custom) : amount;
  const valid = Number.isFinite(effective) && effective >= 10 && effective <= 5000;
  const { pct, bonus } = valid ? bonusFor(effective) : { pct: 0, bonus: 0 };
  const total = valid ? effective + bonus : 0;

  function selectPreset(p: number) {
    setAmount(p);
    setCustom("");
    setSuccess(null);
    setError(null);
  }

  function submit() {
    if (!valid || !selected) return;
    setError(null);
    setSuccess(null);
    start(async () => {
      const res = await topUpBalance({ amount: effective, method: selected.key });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setSuccess(
        res.bonus > 0
          ? t("account.wallet.successBonus")
              .replace("{amount}", money(effective))
              .replace("{bonus}", money(res.bonus))
          : t("account.wallet.success").replace("{amount}", money(effective)),
      );
      setCustom("");
      router.refresh();
    });
  }

  /* ─── ADIM 2: yöntem seçildi — talimat + tutar + özet ─── */
  if (selected) {
    const ins = selected.instruction;
    return (
      <div className="rounded-3xl border border-ink-200 bg-white p-6 sm:p-8">
        <button
          type="button"
          onClick={() => {
            setSelected(null);
            setSuccess(null);
            setError(null);
          }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-800"
        >
          <CaretLeft size={15} weight="bold" /> {t("account.wallet.changeMethod")}
        </button>

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Sol: seçili yöntem + talimat */}
          <div>
            <div className="flex items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50/50 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selected.image}
                alt={t(selected.titleKey)}
                className="h-14 w-14 shrink-0 object-contain"
              />
              <div className="min-w-0">
                <p className="text-sm font-bold text-ink-900">{t(selected.titleKey)}</p>
                <p className="text-xs text-ink-500">{t(selected.descKey)}</p>
              </div>
            </div>

            {/* Talimat */}
            <div className="mt-4 rounded-2xl border border-ink-200 p-4">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-ink-900">
                <Info size={16} weight="duotone" className="text-brand-600" />
                {t(ins.titleKey)}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                {t(ins.noteKey)}
              </p>
              {ins.detail && (
                <dl className="mt-3 space-y-2">
                  {ins.detail.map((d) => (
                    <CopyRow key={d.label} label={d.label} value={d.value} />
                  ))}
                </dl>
              )}
            </div>
          </div>

          {/* Sağ: tutar + özet + yükle */}
          <div>
            <p className="mb-2 text-sm font-medium text-ink-700">{t("account.wallet.amount")}</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-3">
              {PRESETS.map((p) => {
                const b = bonusFor(p);
                const active = custom === "" && amount === p;
                return (
                  <button
                    key={p}
                    type="button"
                    disabled={pending}
                    onClick={() => selectPreset(p)}
                    className={cn(
                      "relative rounded-xl border px-2 py-3 text-sm font-semibold transition-all disabled:opacity-50",
                      active
                        ? "border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500/30"
                        : "border-ink-200 bg-white text-ink-800 hover:border-brand-400",
                    )}
                  >
                    {p}₺
                    {b.pct > 0 && (
                      <span className="absolute -right-1.5 -top-1.5 rounded-full bg-accent-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        +%{b.pct}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-3">
              <Input
                type="number"
                min={10}
                max={5000}
                step={1}
                placeholder={t("account.wallet.customPlaceholder")}
                value={custom}
                onChange={(e) => {
                  setCustom(e.target.value);
                  setSuccess(null);
                  setError(null);
                }}
                disabled={pending}
              />
            </div>

            {/* Özet */}
            <div className="mt-4 rounded-2xl border border-ink-200 bg-ink-50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">{t("account.wallet.amountToLoad")}</span>
                <span className="font-medium text-ink-900">
                  {valid ? money(effective) : "—"}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-1 text-accent-600">
                  <Gift size={14} weight="fill" /> {t("account.wallet.bonus")} {pct > 0 && `(+%${pct})`}
                </span>
                <span className="font-medium text-accent-600">
                  {bonus > 0 ? `+${money(bonus)}` : "—"}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-ink-200 pt-3">
                <span className="font-semibold text-ink-900">{t("account.wallet.willReceive")}</span>
                <span className="text-lg font-extrabold text-brand-600">
                  {valid ? money(total) : "—"}
                </span>
              </div>
            </div>

            <Button onClick={submit} disabled={pending || !valid} className="mt-4 w-full">
              {pending ? (
                <CircleNotch size={18} className="animate-spin" />
              ) : (
                <Plus size={18} weight="bold" />
              )}
              {valid
                ? t("account.wallet.topUp").replace("{amount}", money(effective))
                : t("account.wallet.selectAmount")}
            </Button>

            {error && (
              <p className="mt-2 text-sm font-medium text-danger-600">{error}</p>
            )}
            {success && (
              <p className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-success-600">
                <CheckCircle size={15} weight="fill" /> {success}
              </p>
            )}
            <p className="mt-3 text-xs text-ink-400">
              {t("account.wallet.bonusInfo")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ─── ADIM 1: ödeme yöntemi seç ─── */
  return (
    <div className="rounded-3xl border border-ink-200 bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-ink-900">{t("account.wallet.title.topup")}</h2>
          <p className="mt-1 text-sm text-ink-500">
            {t("account.wallet.subtitle.topup")}
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-3 sm:flex-row lg:max-w-xl lg:justify-end">
          <div className="relative flex-1 lg:max-w-xs">
            <MagnifyingGlass
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("account.wallet.searchMethod")}
              className="h-12 w-full rounded-xl border border-ink-200 bg-white pl-11 pr-4 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setCountryOpen((v) => !v)}
              className="flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-ink-200 bg-white px-4 text-sm font-medium text-ink-900 transition-colors hover:border-brand-300 sm:w-40"
            >
              <span className="flex items-center gap-2">
                <span className="text-base">{country.flag}</span>
                {t(country.labelKey)}
              </span>
              <CaretDown
                size={14}
                weight="bold"
                className={cn("text-ink-400 transition-transform", countryOpen && "rotate-180")}
              />
            </button>
            {countryOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setCountryOpen(false)} />
                <ul className="absolute right-0 z-20 mt-2 w-full min-w-40 origin-top-right animate-scale-in overflow-hidden rounded-xl border border-ink-200 bg-white py-1 shadow-float sm:w-40">
                  {COUNTRIES.map((c) => (
                    <li key={c.code}>
                      <button
                        type="button"
                        onClick={() => {
                          setCountry(c);
                          setCountryOpen(false);
                        }}
                        className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-ink-700 transition-colors hover:bg-ink-50"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{c.flag}</span>
                          {t(c.labelKey)}
                        </span>
                        {c.code === country.code && (
                          <Check size={15} weight="bold" className="text-brand-600" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-ink-500">
          {t("account.wallet.noMethod").replace("{query}", query)}
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => {
                setSelected(m);
                setSuccess(null);
                setError(null);
              }}
              className="group flex flex-col rounded-2xl border border-ink-200 bg-white p-4 text-center transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-card focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            >
              <div className="mx-auto grid h-28 w-full place-items-center overflow-hidden rounded-xl bg-ink-50/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.image}
                  alt={t(m.titleKey)}
                  className="h-24 w-24 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-3 flex min-h-[2.5rem] items-center justify-center text-sm font-bold leading-snug text-ink-900">
                {t(m.titleKey)}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">{t(m.descKey)}</p>
              <span className="mt-3 inline-flex items-center justify-center gap-1 rounded-full bg-ink-100 py-1.5 text-xs font-semibold text-ink-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                {t("account.wallet.select")}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});
  }
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-ink-50 px-3 py-2">
      <div className="min-w-0">
        <dt className="text-[11px] text-ink-400">{label}</dt>
        <dd className="truncate font-mono text-sm text-ink-900">{value}</dd>
      </div>
      <button
        onClick={copy}
        aria-label={t("account.wallet.copy")}
        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
      >
        {copied ? (
          <Check size={15} weight="bold" className="text-success-600" />
        ) : (
          <Copy size={15} />
        )}
      </button>
    </div>
  );
}
