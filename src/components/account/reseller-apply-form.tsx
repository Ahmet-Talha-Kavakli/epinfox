"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Storefront,
  CircleNotch,
  PaperPlaneRight,
  User,
  Buildings,
  ShieldWarning,
  ShieldCheck,
} from "@phosphor-icons/react";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { applyForReseller } from "@/lib/actions/reseller";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

const CHANNELS: { value: "web" | "social" | "physical" | "other"; labelKey: string }[] = [
  { value: "web", labelKey: "acct.reseller.apply.channelWeb" },
  { value: "social", labelKey: "acct.reseller.apply.channelSocial" },
  { value: "physical", labelKey: "acct.reseller.apply.channelPhysical" },
  { value: "other", labelKey: "acct.reseller.apply.channelOther" },
];

const VOLUMES = ["0 – 5.000 ₺", "5.000 – 25.000 ₺", "25.000 – 100.000 ₺", "100.000 ₺+"];

export function ResellerApplyForm({
  rejected,
  rejectReason,
  kycApproved,
}: {
  rejected?: boolean;
  rejectReason?: string | null;
  kycApproved: boolean;
}) {
  const router = useRouter();
  const { t } = useI18n();
  const [companyType, setCompanyType] = useState<"individual" | "company">(
    "individual",
  );
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [channel, setChannel] = useState<typeof CHANNELS[number]["value"]>("web");
  const [volume, setVolume] = useState(VOLUMES[1]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit() {
    setError(null);
    start(async () => {
      const r = await applyForReseller({
        companyType,
        companyName,
        contactName,
        phone,
        taxNumber: taxNumber || null,
        channel,
        monthlyVolume: volume,
        message: message || null,
      });
      if (r.ok) router.refresh();
      else setError(r.error);
    });
  }

  return (
    <div className="space-y-6">
      {/* Tanıtım başlığı */}
      <div className="flex items-start gap-4 rounded-2xl border border-brand-200 bg-brand-50/50 p-5">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-brand-600 ring-1 ring-brand-200">
          <Storefront size={24} weight="duotone" />
        </span>
        <div>
          <h2 className="font-bold text-ink-900">{t("acct.reseller.apply.programTitle")}</h2>
          <p className="mt-1 text-sm text-ink-600">
            {t("acct.reseller.apply.programDesc")}
          </p>
        </div>
      </div>

      {rejected && (
        <div className="rounded-2xl border border-danger-200 bg-danger-50/60 p-4 text-sm text-danger-700">
          {t("acct.reseller.apply.rejectedPrefix")}
          {rejectReason ? `: ${rejectReason}` : "."}
          {t("acct.reseller.apply.rejectedSuffix")}
        </div>
      )}

      {/* KYC durumu uyarısı */}
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border p-4 text-sm",
          kycApproved
            ? "border-success-200 bg-success-50/60 text-success-700"
            : "border-warning-200 bg-warning-50/60 text-warning-700",
        )}
      >
        {kycApproved ? (
          <ShieldCheck size={20} weight="fill" className="shrink-0" />
        ) : (
          <ShieldWarning size={20} weight="fill" className="shrink-0" />
        )}
        <p>
          {kycApproved ? (
            t("acct.reseller.apply.kycApproved")
          ) : (
            <>
              {t("acct.reseller.apply.kycNeededPrefix")}
              <Link
                href="/account/settings"
                className="font-semibold underline"
              >
                {t("acct.reseller.apply.kycNeededLink")}
              </Link>
              {t("acct.reseller.apply.kycNeededSuffix")}
            </>
          )}
        </p>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-ink-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-ink-900">{t("acct.reseller.apply.formTitle")}</h3>

        {/* Tür */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {(["individual", "company"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setCompanyType(k)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
                companyType === k
                  ? "border-brand-400 bg-brand-50 text-brand-700"
                  : "border-ink-200 text-ink-600 hover:bg-ink-50",
              )}
            >
              {k === "individual" ? (
                <User size={16} weight="duotone" />
              ) : (
                <Buildings size={16} weight="duotone" />
              )}
              {k === "individual" ? t("acct.reseller.apply.individual") : t("acct.reseller.apply.company")}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>{companyType === "company" ? t("acct.reseller.apply.companyName") : t("acct.reseller.apply.individualName")}<span className="text-danger-500"> *</span></Label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder={companyType === "company" ? t("acct.reseller.apply.companyPlaceholder") : t("acct.reseller.apply.individualPlaceholder")}
              disabled={pending}
            />
          </div>
          <div>
            <Label>{t("acct.reseller.apply.contactName")}<span className="text-danger-500"> *</span></Label>
            <Input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder={t("acct.reseller.apply.contactPlaceholder")}
              disabled={pending}
            />
          </div>
          <div>
            <Label>{t("acct.reseller.apply.phone")}<span className="text-danger-500"> *</span></Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+90 5xx xxx xx xx"
              disabled={pending}
            />
          </div>
          <div>
            <Label>{t("acct.reseller.apply.taxNo")}</Label>
            <Input
              value={taxNumber}
              onChange={(e) => setTaxNumber(e.target.value)}
              placeholder={t("acct.reseller.apply.optional")}
              disabled={pending}
            />
          </div>
          <div>
            <Label>{t("acct.reseller.apply.channel")}</Label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as typeof channel)}
              disabled={pending}
              className="h-11 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-900 focus:border-brand-400 focus:outline-none"
            >
              {CHANNELS.map((c) => (
                <option key={c.value} value={c.value}>
                  {t(c.labelKey)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>{t("acct.reseller.apply.volume")}</Label>
            <select
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              disabled={pending}
              className="h-11 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-900 focus:border-brand-400 focus:outline-none"
            >
              {VOLUMES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <Label>{t("acct.reseller.apply.note")}</Label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder={t("acct.reseller.apply.notePlaceholder")}
            disabled={pending}
          />
        </div>

        {error && (
          <p className="mt-3 text-sm font-medium text-danger-600">{error}</p>
        )}

        <Button
          onClick={submit}
          disabled={pending || !companyName.trim() || !contactName.trim() || phone.trim().length < 7}
          className="mt-5"
        >
          {pending ? (
            <CircleNotch size={18} className="animate-spin" />
          ) : (
            <PaperPlaneRight size={16} weight="fill" />
          )}
          {t("acct.reseller.apply.submit")}
        </Button>
      </div>
    </div>
  );
}
