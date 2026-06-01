"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  MapPinLine,
  Plus,
  PencilSimple,
  Trash,
  CircleNotch,
  Check,
  User,
  Buildings,
  Star,
  X,
} from "@phosphor-icons/react";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  saveBillingAddress,
  deleteBillingAddress,
} from "@/lib/actions/account-extras";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import type { BillingAddress, BillingKind } from "@/lib/supabase/types";

type Draft = {
  id?: string;
  kind: BillingKind;
  title: string;
  fullName: string;
  phone: string;
  companyName: string;
  taxOffice: string;
  taxNumber: string;
  country: string;
  city: string;
  district: string;
  zipCode: string;
  addressLine: string;
  isDefault: boolean;
};

const EMPTY: Draft = {
  kind: "individual",
  title: "",
  fullName: "",
  phone: "",
  companyName: "",
  taxOffice: "",
  taxNumber: "",
  country: "Türkiye",
  city: "",
  district: "",
  zipCode: "",
  addressLine: "",
  isDefault: false,
};

function toDraft(a: BillingAddress): Draft {
  return {
    id: a.id,
    kind: a.kind,
    title: a.title,
    fullName: a.full_name,
    phone: a.phone ?? "",
    companyName: a.company_name ?? "",
    taxOffice: a.tax_office ?? "",
    taxNumber: a.tax_number ?? "",
    country: a.country,
    city: a.city,
    district: a.district ?? "",
    zipCode: a.zip_code ?? "",
    addressLine: a.address_line,
    isDefault: a.is_default,
  };
}

export function BillingManager({
  addresses,
}: {
  addresses: BillingAddress[];
}) {
  const router = useRouter();
  const { t } = useI18n();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [deleting, setDeleting] = useState<string | null>(null);

  function open(a?: BillingAddress) {
    setError(null);
    setDraft(a ? toDraft(a) : { ...EMPTY });
  }

  function save() {
    if (!draft) return;
    setError(null);
    start(async () => {
      const r = await saveBillingAddress({
        id: draft.id,
        kind: draft.kind,
        title: draft.title,
        fullName: draft.fullName,
        phone: draft.phone || null,
        companyName: draft.companyName || null,
        taxOffice: draft.taxOffice || null,
        taxNumber: draft.taxNumber || null,
        country: draft.country,
        city: draft.city,
        district: draft.district || null,
        zipCode: draft.zipCode || null,
        addressLine: draft.addressLine,
        isDefault: draft.isDefault,
      });
      if (r.ok) {
        setDraft(null);
        router.refresh();
      } else {
        setError(r.error);
      }
    });
  }

  function remove(id: string) {
    setDeleting(id);
    start(async () => {
      await deleteBillingAddress({ id });
      setDeleting(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {/* Liste */}
      {addresses.length === 0 && !draft ? (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-12 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-200">
            <MapPinLine size={26} weight="duotone" />
          </span>
          <p className="mt-3 font-semibold text-ink-900">
            {t("acct.billing.empty.title")}
          </p>
          <p className="mt-1 text-sm text-ink-500">
            {t("acct.billing.empty.desc")}
          </p>
          <Button onClick={() => open()} className="mt-4">
            <Plus size={16} weight="bold" /> {t("acct.billing.addAddress")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <div
              key={a.id}
              className={cn(
                "relative rounded-2xl border bg-white p-5",
                a.is_default ? "border-brand-300 ring-1 ring-brand-200" : "border-ink-200",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink-100 text-ink-500 ring-1 ring-ink-200">
                  {a.kind === "corporate" ? (
                    <Buildings size={18} weight="duotone" />
                  ) : (
                    <User size={18} weight="duotone" />
                  )}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => open(a)}
                    aria-label={t("acct.common.edit")}
                    className="grid h-8 w-8 place-items-center rounded-lg text-ink-500 transition-colors hover:bg-ink-100"
                  >
                    <PencilSimple size={16} />
                  </button>
                  <button
                    onClick={() => remove(a.id)}
                    disabled={deleting === a.id}
                    aria-label={t("acct.common.delete")}
                    className="grid h-8 w-8 place-items-center rounded-lg text-ink-500 transition-colors hover:bg-danger-50 hover:text-danger-600 disabled:opacity-50"
                  >
                    {deleting === a.id ? (
                      <CircleNotch size={16} className="animate-spin" />
                    ) : (
                      <Trash size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <p className="font-semibold text-ink-900">{a.title}</p>
                {a.is_default && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                    <Star size={10} weight="fill" /> {t("acct.billing.default")}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm font-medium text-ink-700">
                {a.full_name}
              </p>
              {a.kind === "corporate" && a.company_name && (
                <p className="text-xs text-ink-500">
                  {a.company_name}
                  {a.tax_number ? ` · ${t("acct.billing.taxNo")} ${a.tax_number}` : ""}
                </p>
              )}
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                {a.address_line}
                <br />
                {[a.district, a.city, a.zip_code].filter(Boolean).join(", ")}
                {a.country ? ` / ${a.country}` : ""}
              </p>
              {a.phone && (
                <p className="mt-1 text-xs text-ink-400">{a.phone}</p>
              )}
            </div>
          ))}

          {/* Yeni ekle kutusu */}
          {!draft && (
            <button
              onClick={() => open()}
              className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink-200 text-ink-400 transition-colors hover:border-brand-300 hover:text-brand-600"
            >
              <Plus size={26} />
              <span className="text-sm font-medium">{t("acct.billing.addNew")}</span>
            </button>
          )}
        </div>
      )}

      {/* Form paneli */}
      {draft && (
        <div className="animate-scale-in rounded-2xl border border-brand-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink-900">
              {draft.id ? t("acct.billing.editTitle") : t("acct.billing.newTitle")}
            </h2>
            <button
              onClick={() => setDraft(null)}
              aria-label={t("acct.common.close")}
              className="grid h-9 w-9 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink-100"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tür seçici */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {(["individual", "corporate"] as BillingKind[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setDraft((d) => d && { ...d, kind: k })}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
                  draft.kind === k
                    ? "border-brand-400 bg-brand-50 text-brand-700"
                    : "border-ink-200 text-ink-600 hover:bg-ink-50",
                )}
              >
                {k === "individual" ? (
                  <User size={16} weight="duotone" />
                ) : (
                  <Buildings size={16} weight="duotone" />
                )}
                {k === "individual" ? t("acct.billing.individual") : t("acct.billing.corporate")}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t("acct.billing.field.title")} required>
              <Input
                value={draft.title}
                onChange={(e) => setDraft((d) => d && { ...d, title: e.target.value })}
                placeholder={t("acct.billing.field.titlePlaceholder")}
                disabled={pending}
              />
            </Field>
            <Field label={draft.kind === "corporate" ? t("acct.billing.field.contactName") : t("acct.billing.field.fullName")} required>
              <Input
                value={draft.fullName}
                onChange={(e) => setDraft((d) => d && { ...d, fullName: e.target.value })}
                placeholder={t("acct.billing.field.fullNamePlaceholder")}
                disabled={pending}
              />
            </Field>

            {draft.kind === "corporate" && (
              <>
                <Field label={t("acct.billing.field.company")} required>
                  <Input
                    value={draft.companyName}
                    onChange={(e) => setDraft((d) => d && { ...d, companyName: e.target.value })}
                    placeholder={t("acct.billing.field.companyPlaceholder")}
                    disabled={pending}
                  />
                </Field>
                <Field label={t("acct.billing.field.taxOffice")}>
                  <Input
                    value={draft.taxOffice}
                    onChange={(e) => setDraft((d) => d && { ...d, taxOffice: e.target.value })}
                    placeholder={t("acct.billing.field.taxOfficePlaceholder")}
                    disabled={pending}
                  />
                </Field>
                <Field label={t("acct.billing.field.taxNumber")} required>
                  <Input
                    value={draft.taxNumber}
                    onChange={(e) => setDraft((d) => d && { ...d, taxNumber: e.target.value })}
                    placeholder={t("acct.billing.field.taxNumberPlaceholder")}
                    disabled={pending}
                  />
                </Field>
              </>
            )}

            <Field label={t("acct.billing.field.phone")}>
              <Input
                value={draft.phone}
                onChange={(e) => setDraft((d) => d && { ...d, phone: e.target.value })}
                placeholder="+90 5xx xxx xx xx"
                disabled={pending}
              />
            </Field>
            <Field label={t("acct.billing.field.city")} required>
              <Input
                value={draft.city}
                onChange={(e) => setDraft((d) => d && { ...d, city: e.target.value })}
                placeholder={t("acct.billing.field.cityPlaceholder")}
                disabled={pending}
              />
            </Field>
            <Field label={t("acct.billing.field.district")}>
              <Input
                value={draft.district}
                onChange={(e) => setDraft((d) => d && { ...d, district: e.target.value })}
                placeholder={t("acct.billing.field.districtPlaceholder")}
                disabled={pending}
              />
            </Field>
            <Field label={t("acct.billing.field.zip")}>
              <Input
                value={draft.zipCode}
                onChange={(e) => setDraft((d) => d && { ...d, zipCode: e.target.value })}
                placeholder={t("acct.billing.field.zipPlaceholder")}
                disabled={pending}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label={t("acct.billing.field.address")} required>
                <Textarea
                  value={draft.addressLine}
                  onChange={(e) => setDraft((d) => d && { ...d, addressLine: e.target.value })}
                  rows={2}
                  placeholder={t("acct.billing.field.addressPlaceholder")}
                  disabled={pending}
                />
              </Field>
            </div>
          </div>

          {/* Varsayılan */}
          <button
            type="button"
            onClick={() => setDraft((d) => d && { ...d, isDefault: !d.isDefault })}
            disabled={pending}
            className="mt-4 flex items-center gap-2 text-sm text-ink-700"
          >
            <span
              className={cn(
                "grid h-5 w-5 place-items-center rounded-md border transition-colors",
                draft.isDefault
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-ink-300",
              )}
            >
              {draft.isDefault && <Check size={13} weight="bold" />}
            </span>
            {t("acct.billing.makeDefault")}
          </button>

          {error && (
            <p className="mt-3 text-sm font-medium text-danger-600">{error}</p>
          )}

          <div className="mt-5 flex gap-2">
            <Button onClick={save} disabled={pending}>
              {pending ? (
                <CircleNotch size={18} className="animate-spin" />
              ) : (
                <>
                  <Check size={16} weight="bold" /> {t("acct.common.save")}
                </>
              )}
            </Button>
            <Button variant="ghost" onClick={() => setDraft(null)} disabled={pending}>
              {t("acct.common.giveUp")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label>
        {label}
        {required && <span className="text-danger-500"> *</span>}
      </Label>
      {children}
    </div>
  );
}
