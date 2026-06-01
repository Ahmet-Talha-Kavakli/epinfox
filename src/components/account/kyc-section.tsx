"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ShieldWarning,
  Clock,
  XCircle,
  CircleNotch,
  UploadSimple,
  CheckCircle,
  IdentificationCard,
} from "@phosphor-icons/react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitKyc } from "@/lib/actions/kyc";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";
import type { KycStatus } from "@/lib/supabase/types";

interface Props {
  status: KycStatus;
  fullName: string | null;
  rejectReason: string | null;
}

const STATUS_META: Record<
  KycStatus,
  { labelKey: string; cls: string; icon: typeof ShieldCheck }
> = {
  none: {
    labelKey: "c1.kyc.status.none",
    cls: "bg-ink-100 text-ink-600",
    icon: ShieldWarning,
  },
  pending: {
    labelKey: "c1.kyc.status.pending",
    cls: "bg-warning-50 text-warning-700",
    icon: Clock,
  },
  approved: {
    labelKey: "c1.kyc.status.approved",
    cls: "bg-success-50 text-success-700",
    icon: ShieldCheck,
  },
  rejected: {
    labelKey: "c1.kyc.status.rejected",
    cls: "bg-danger-50 text-danger-700",
    icon: XCircle,
  },
};

function FileField({
  label,
  name,
  onPick,
  fileName,
  placeholder,
}: {
  label: string;
  name: string;
  onPick: (name: string, file: File | null) => void;
  fileName: string | null;
  placeholder: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <Label>{label}</Label>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-xl border border-dashed px-4 py-3 text-left text-sm transition-colors",
          fileName
            ? "border-success-300 bg-success-50/40 text-success-700"
            : "border-ink-300 text-ink-500 hover:border-brand-400 hover:bg-ink-50",
        )}
      >
        {fileName ? (
          <CheckCircle size={18} weight="fill" />
        ) : (
          <UploadSimple size={18} />
        )}
        <span className="truncate">{fileName ?? placeholder}</span>
      </button>
      <input
        ref={ref}
        type="file"
        name={name}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => onPick(name, e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

export function KycSection({ status, fullName, rejectReason }: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [files, setFiles] = useState<Record<string, File | null>>({
    docFront: null,
    docBack: null,
  });
  const formRef = useRef<HTMLFormElement>(null);

  const meta = STATUS_META[status];
  const Icon = meta.icon;
  const canSubmit = status === "none" || status === "rejected";

  function pick(name: string, file: File | null) {
    setFiles((f) => ({ ...f, [name]: file }));
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const r = await submitKyc(fd);
      if (r.ok) {
        setMsg({ ok: true, text: t("c1.kyc.success") });
        router.refresh();
      } else {
        setMsg({ ok: false, text: r.error });
      }
    });
  }

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-200">
            <IdentificationCard size={20} weight="duotone" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-ink-900">
              {t("c1.kyc.title")}
            </h2>
            <p className="text-xs text-ink-500">{t("c1.kyc.desc")}</p>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
            meta.cls,
          )}
        >
          <Icon size={13} weight="fill" /> {t(meta.labelKey)}
        </span>
      </div>

      {/* Onaylı */}
      {status === "approved" && (
        <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-success-200 bg-success-50/50 px-4 py-3 text-sm text-success-700">
          <ShieldCheck size={18} weight="fill" />
          {t("c1.kyc.approved").replace(
            "{name}",
            fullName ? ` — ${fullName}` : "",
          )}
        </div>
      )}

      {/* İnceleniyor */}
      {status === "pending" && (
        <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-warning-200 bg-warning-50/50 px-4 py-3 text-sm text-warning-700">
          <Clock size={18} weight="fill" />
          {t("c1.kyc.pending")}
        </div>
      )}

      {/* Reddedildi — sebep + yeniden gönder */}
      {status === "rejected" && rejectReason && (
        <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-danger-200 bg-danger-50/50 px-4 py-3 text-sm text-danger-700">
          <XCircle size={18} weight="fill" className="mt-0.5 shrink-0" />
          <span>
            {t("c1.kyc.rejected").replace("{reason}", rejectReason)}
          </span>
        </div>
      )}

      {/* Form (none / rejected) */}
      {canSubmit && (
        <form ref={formRef} onSubmit={submit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="kyc-name">{t("c1.kyc.label.fullName")}</Label>
              <Input
                id="kyc-name"
                name="fullName"
                placeholder={t("c1.kyc.placeholder.fullName")}
                disabled={pending}
              />
            </div>
            <div>
              <Label htmlFor="kyc-tc">{t("c1.kyc.label.nationalId")}</Label>
              <Input
                id="kyc-tc"
                name="nationalId"
                inputMode="numeric"
                maxLength={11}
                placeholder={t("c1.kyc.placeholder.nationalId")}
                disabled={pending}
              />
            </div>
            <div>
              <Label htmlFor="kyc-birth">{t("c1.kyc.label.birthDate")}</Label>
              <Input
                id="kyc-birth"
                name="birthDate"
                type="date"
                disabled={pending}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FileField
              label={t("c1.kyc.label.docFront")}
              name="docFront"
              onPick={pick}
              fileName={files.docFront?.name ?? null}
              placeholder={t("c1.kyc.filePlaceholder")}
            />
            <FileField
              label={t("c1.kyc.label.docBack")}
              name="docBack"
              onPick={pick}
              fileName={files.docBack?.name ?? null}
              placeholder={t("c1.kyc.filePlaceholder")}
            />
          </div>

          <p className="text-xs text-ink-400">{t("c1.kyc.privacy")}</p>

          <Button type="submit" disabled={pending}>
            {pending ? (
              <CircleNotch size={18} className="animate-spin" />
            ) : (
              <ShieldCheck size={16} weight="bold" />
            )}
            {t("c1.kyc.submit")}
          </Button>

          {msg && (
            <p
              className={cn(
                "text-sm font-medium",
                msg.ok ? "text-success-600" : "text-danger-600",
              )}
            >
              {msg.text}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
