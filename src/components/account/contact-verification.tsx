"use client";

import { useUser } from "@clerk/nextjs";
import {
  EnvelopeSimple,
  Phone,
  CheckCircle,
  WarningCircle,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

/** E-posta ve telefon doğrulama durumu — Clerk verisinden okunur. */
export function ContactVerification({ phone }: { phone: string | null }) {
  const { user, isLoaded } = useUser();
  const { t } = useI18n();

  const emailVerified =
    user?.primaryEmailAddress?.verification?.status === "verified";
  const phoneVerified =
    (user?.phoneNumbers?.length ?? 0) > 0 &&
    user?.primaryPhoneNumber?.verification?.status === "verified";

  const items = [
    {
      icon: EnvelopeSimple,
      label: t("c3.contact.email"),
      value: user?.primaryEmailAddress?.emailAddress ?? "—",
      verified: emailVerified,
      loaded: isLoaded,
    },
    {
      icon: Phone,
      label: t("c3.contact.phone"),
      value:
        user?.primaryPhoneNumber?.phoneNumber ??
        phone ??
        t("c3.contact.notAdded"),
      verified: phoneVerified,
      loaded: isLoaded,
    },
  ];

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-ink-900">
        {t("c3.contact.title")}
      </h2>
      <p className="mt-1 text-sm text-ink-500">{t("c3.contact.desc")}</p>

      <div className="mt-4 space-y-3">
        {items.map((it) => (
          <div
            key={it.label}
            className="flex items-center justify-between gap-3 rounded-xl border border-ink-200 px-4 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink-100 text-ink-500">
                <it.icon size={18} weight="duotone" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-ink-400">{it.label}</p>
                <p className="truncate text-sm font-medium text-ink-900">
                  {it.value}
                </p>
              </div>
            </div>
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                !it.loaded
                  ? "bg-ink-100 text-ink-400"
                  : it.verified
                    ? "bg-success-50 text-success-700"
                    : "bg-warning-50 text-warning-700",
              )}
            >
              {!it.loaded ? (
                "…"
              ) : it.verified ? (
                <>
                  <CheckCircle size={13} weight="fill" />{" "}
                  {t("c3.contact.verified")}
                </>
              ) : (
                <>
                  <WarningCircle size={13} weight="fill" />{" "}
                  {t("c3.contact.unverified")}
                </>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
