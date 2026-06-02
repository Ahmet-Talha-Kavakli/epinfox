"use client";

import { useState, useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import {
  EnvelopeSimple,
  Phone,
  CheckCircle,
  WarningCircle,
  SpinnerGap,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { syncPhoneVerified } from "@/lib/actions/phone";

type ClerkErr = { code?: string; message?: string } | undefined;

/** E-posta ve telefon doğrulama durumu + telefon doğrulama akışı (Clerk SMS). */
export function ContactVerification({ phone }: { phone: string | null }) {
  const { user, isLoaded } = useUser();
  const { t } = useI18n();

  const emailVerified =
    user?.primaryEmailAddress?.verification?.status === "verified";
  const phoneVerified =
    (user?.phoneNumbers?.length ?? 0) > 0 &&
    user?.primaryPhoneNumber?.verification?.status === "verified";

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-ink-900">
        {t("c3.contact.title")}
      </h2>
      <p className="mt-1 text-sm text-ink-500">{t("c3.contact.desc")}</p>

      <div className="mt-4 space-y-3">
        {/* E-posta satırı (salt durum) */}
        <ContactRow
          icon={EnvelopeSimple}
          label={t("c3.contact.email")}
          value={user?.primaryEmailAddress?.emailAddress ?? "—"}
          verified={emailVerified}
          loaded={isLoaded}
        />

        {/* Telefon satırı (durum + doğrulama akışı) */}
        <div className="rounded-xl border border-ink-200 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink-100 text-ink-500">
                <Phone size={18} weight="duotone" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-ink-400">{t("c3.contact.phone")}</p>
                <p className="truncate text-sm font-medium text-ink-900">
                  {user?.primaryPhoneNumber?.phoneNumber ??
                    phone ??
                    t("c3.contact.notAdded")}
                </p>
              </div>
            </div>
            <StatusBadge verified={phoneVerified} loaded={isLoaded} />
          </div>

          {isLoaded && !phoneVerified && <PhoneVerifyFlow />}
        </div>
      </div>
    </div>
  );
}

/** Telefon ekle + SMS kodu ile doğrula akışı. */
function PhoneVerifyFlow() {
  const { user } = useUser();
  const { t } = useI18n();
  const [stage, setStage] = useState<"idle" | "input" | "verify">("idle");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [phoneId, setPhoneId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  function mapError(err: ClerkErr): string {
    const map: Record<string, string> = {
      form_identifier_exists: t("c3.contact.errPhoneExists"),
      form_param_format_invalid: t("c3.contact.errPhoneInvalid"),
      form_code_incorrect: t("c3.contact.errCode"),
      verification_failed: t("c3.contact.errCode"),
    };
    return (err?.code && map[err.code]) || err?.message || t("c3.contact.errGeneric");
  }

  function sendCode() {
    setMsg(null);
    start(async () => {
      try {
        const ph = await user?.createPhoneNumber({ phoneNumber: phone });
        await ph?.prepareVerification();
        setPhoneId(ph?.id ?? null);
        setStage("verify");
        setMsg({ ok: true, text: t("c3.contact.codeSent") });
      } catch (err: unknown) {
        setMsg({ ok: false, text: mapError((err as { errors?: ClerkErr[] })?.errors?.[0]) });
      }
    });
  }

  function verify() {
    setMsg(null);
    start(async () => {
      try {
        const ph = user?.phoneNumbers.find((p) => p.id === phoneId);
        await ph?.attemptVerification({ code });
        if (phoneId) await user?.update({ primaryPhoneNumberId: phoneId });
        await syncPhoneVerified();
        await user?.reload();
        // reload sonrası phoneVerified true olur → bu blok kaybolur.
      } catch (err: unknown) {
        setMsg({ ok: false, text: mapError((err as { errors?: ClerkErr[] })?.errors?.[0]) });
      }
    });
  }

  if (stage === "idle") {
    return (
      <button
        type="button"
        onClick={() => setStage("input")}
        className="mt-3 text-sm font-semibold text-brand-600 hover:text-brand-700"
      >
        {t("c3.contact.verifyPhone")}
      </button>
    );
  }

  return (
    <div className="mt-3 space-y-3 border-t border-ink-100 pt-3">
      {stage === "input" ? (
        <div className="space-y-2">
          <Label htmlFor="cv-phone">{t("c3.contact.phone")}</Label>
          <div className="flex gap-2">
            <Input
              id="cv-phone"
              type="tel"
              autoComplete="tel"
              placeholder={t("c3.contact.phonePlaceholder")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button onClick={sendCode} disabled={pending || phone.trim().length < 7}>
              {pending ? <SpinnerGap size={16} className="animate-spin" /> : t("c3.contact.sendCode")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="cv-code">{t("c3.contact.codeLabel")}</Label>
          <div className="flex gap-2">
            <Input
              id="cv-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder={t("c3.contact.codePlaceholder")}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button onClick={verify} disabled={pending || code.trim().length < 4}>
              {pending ? <SpinnerGap size={16} className="animate-spin" /> : t("c3.contact.verifySubmit")}
            </Button>
          </div>
        </div>
      )}
      {msg && (
        <p className={cn("text-xs", msg.ok ? "text-success-700" : "text-danger-600")}>
          {msg.text}
        </p>
      )}
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  verified,
  loaded,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  verified: boolean | undefined;
  loaded: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-ink-200 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink-100 text-ink-500">
          <Icon size={18} weight="duotone" />
        </span>
        <div className="min-w-0">
          <p className="text-xs text-ink-400">{label}</p>
          <p className="truncate text-sm font-medium text-ink-900">{value}</p>
        </div>
      </div>
      <StatusBadge verified={verified} loaded={loaded} />
    </div>
  );
}

function StatusBadge({ verified, loaded }: { verified: boolean | undefined; loaded: boolean }) {
  const { t } = useI18n();
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        !loaded
          ? "bg-ink-100 text-ink-400"
          : verified
            ? "bg-success-50 text-success-700"
            : "bg-warning-50 text-warning-700",
      )}
    >
      {!loaded ? (
        "…"
      ) : verified ? (
        <>
          <CheckCircle size={13} weight="fill" /> {t("c3.contact.verified")}
        </>
      ) : (
        <>
          <WarningCircle size={13} weight="fill" /> {t("c3.contact.unverified")}
        </>
      )}
    </span>
  );
}
