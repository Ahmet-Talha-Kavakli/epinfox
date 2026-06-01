"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { useUser, useAuth } from "@clerk/nextjs";
import type { UserResource } from "@clerk/shared/types";
import {
  ShieldCheck,
  ShieldStar,
  CircleNotch,
  Check,
  CheckCircle,
  XCircle,
  DeviceMobile,
  Desktop,
  SignOut,
  Copy,
  Clock,
  Globe,
  LinkSimple,
  GoogleLogo,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/provider";
import { cn, intlLocale } from "@/lib/utils";

// Clerk resource tiplerini UserResource üzerinden türet (paketten doğrudan
// re-export edilmediği için).
type SessionWithActivitiesResource = Awaited<
  ReturnType<UserResource["getSessions"]>
>[number];

function Msg({ ok, text }: { ok: boolean; text: string }) {
  return (
    <p
      className={cn(
        "mt-3 text-sm font-medium",
        ok ? "text-success-600" : "text-danger-600",
      )}
    >
      {text}
    </p>
  );
}

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: typeof ShieldCheck;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6">
      <div className="flex items-center gap-2.5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-200">
          <Icon size={20} weight="duotone" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-ink-900">{title}</h2>
          <p className="text-xs text-ink-500">{description}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

/* ─────────────────────── Güvenlik Durumu (skor özeti) ──────────────────────── */

export function SecurityScore() {
  const { user, isLoaded } = useUser();
  const { t } = useI18n();

  if (!isLoaded) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-white p-6 text-sm text-ink-400">
        {t("acct.common.loading")}
      </div>
    );
  }

  const emailVerified =
    user?.primaryEmailAddress?.verification?.status === "verified";
  const twoFactor = user?.twoFactorEnabled ?? false;
  const hasPassword = user?.passwordEnabled ?? false;
  const hasBackup = user?.backupCodeEnabled ?? false;

  const checks = [
    { label: t("acct.security.score.emailVerified"), done: emailVerified },
    { label: t("acct.security.score.passwordSet"), done: hasPassword },
    { label: t("acct.security.score.twoFactorOn"), done: twoFactor },
    { label: t("acct.security.score.backupCodes"), done: hasBackup },
  ];
  const done = checks.filter((c) => c.done).length;
  const score = Math.round((done / checks.length) * 100);

  const tone =
    score >= 75
      ? { ring: "text-success-500", label: t("acct.security.score.strong"), chip: "bg-success-50 text-success-700" }
      : score >= 50
        ? { ring: "text-warning-500", label: t("acct.security.score.medium"), chip: "bg-warning-50 text-warning-700" }
        : { ring: "text-danger-500", label: t("acct.security.score.weak"), chip: "bg-danger-50 text-danger-700" };

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Dairesel skor */}
        <div className="relative grid h-28 w-28 shrink-0 place-items-center">
          <svg viewBox="0 0 36 36" className="h-28 w-28 -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              className="stroke-ink-100"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              className={cn("transition-all", tone.ring)}
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 97.4} 97.4`}
            />
          </svg>
          <div className="absolute text-center">
            <p className="text-2xl font-extrabold text-ink-900">%{score}</p>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-ink-900">
              {t("acct.security.score.title")}
            </h2>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-bold",
                tone.chip,
              )}
            >
              {tone.label}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-ink-500">
            {t("acct.security.score.desc")}
          </p>
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {checks.map((c) => (
              <li
                key={c.label}
                className="flex items-center gap-2 text-sm text-ink-600"
              >
                {c.done ? (
                  <CheckCircle
                    size={18}
                    weight="fill"
                    className="shrink-0 text-success-500"
                  />
                ) : (
                  <XCircle size={18} className="shrink-0 text-ink-300" />
                )}
                <span className={c.done ? "text-ink-700" : ""}>{c.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Bağlı Hesaplar (OAuth) ───────────────────────────── */

export function ConnectedAccounts() {
  const { user, isLoaded } = useUser();
  const { t } = useI18n();

  const accounts = user?.externalAccounts ?? [];

  return (
    <SectionCard
      title={t("acct.security.connected.title")}
      description={t("acct.security.connected.desc")}
      icon={LinkSimple}
    >
      {!isLoaded ? (
        <p className="text-sm text-ink-400">{t("acct.common.loading")}</p>
      ) : accounts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink-200 px-4 py-6 text-center">
          <LinkSimple size={26} weight="duotone" className="mx-auto text-ink-300" />
          <p className="mt-2 text-sm text-ink-500">
            {t("acct.security.connected.empty")}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-ink-100">
          {accounts.map((acc) => (
            <li key={acc.id} className="flex items-center gap-3 py-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink-100 text-ink-600">
                <GoogleLogo size={18} weight="bold" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium capitalize text-ink-900">
                  {acc.provider.replace("oauth_", "")}
                </p>
                <p className="truncate text-xs text-ink-400">
                  {acc.emailAddress || acc.username || t("acct.common.connected")}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-[10px] font-bold text-success-700">
                <Check size={11} weight="bold" /> {t("acct.common.connected")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}

/* ─────────────────────── İki Adımlı Doğrulama (2FA / TOTP) ─────────────────── */

export function TwoFactorSection() {
  const { user, isLoaded } = useUser();
  const { t } = useI18n();
  const [stage, setStage] = useState<"idle" | "setup">("idle");
  const [uri, setUri] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  const enabled = user?.twoFactorEnabled ?? false;

  function begin() {
    setMsg(null);
    start(async () => {
      try {
        const totp = await user!.createTOTP();
        setUri(totp.uri ?? null);
        setSecret(totp.secret ?? null);
        setStage("setup");
      } catch {
        setMsg({ ok: false, text: t("acct.security.2fa.startError") });
      }
    });
  }

  function verify() {
    setMsg(null);
    start(async () => {
      try {
        await user!.verifyTOTP({ code });
        const bc = await user!.createBackupCode();
        setBackupCodes(bc.codes ?? null);
        setCode("");
        setStage("idle");
        setMsg({ ok: true, text: t("acct.security.2fa.enabled") });
      } catch {
        setMsg({ ok: false, text: t("acct.security.2fa.codeError") });
      }
    });
  }

  function disable() {
    setMsg(null);
    start(async () => {
      try {
        await user!.disableTOTP();
        setBackupCodes(null);
        setMsg({ ok: true, text: t("acct.security.2fa.disabled") });
      } catch {
        setMsg({ ok: false, text: t("acct.security.2fa.disableError") });
      }
    });
  }

  const qrSrc = uri
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(uri)}`
    : null;

  return (
    <SectionCard
      title={t("acct.security.2fa.title")}
      description={t("acct.security.2fa.desc")}
      icon={ShieldStar}
    >
      {!isLoaded ? (
        <p className="text-sm text-ink-400">{t("acct.common.loading")}</p>
      ) : enabled ? (
        <div>
          <div className="flex items-center gap-2.5 rounded-xl border border-success-200 bg-success-50/50 px-4 py-3 text-sm text-success-700">
            <ShieldCheck size={18} weight="fill" /> {t("acct.security.2fa.active")}
          </div>
          {backupCodes && <BackupCodes codes={backupCodes} />}
          <Button
            onClick={disable}
            disabled={pending}
            variant="outline"
            size="sm"
            className="mt-4"
          >
            {pending ? <CircleNotch size={16} className="animate-spin" /> : null}
            {t("acct.security.2fa.turnOff")}
          </Button>
        </div>
      ) : stage === "setup" ? (
        <div className="space-y-4">
          <p className="text-sm text-ink-600">
            {t("acct.security.2fa.scanHint")}
          </p>
          {qrSrc && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-ink-200 bg-white p-4 sm:flex-row sm:items-start">
              <Image
                src={qrSrc}
                alt="2FA QR"
                width={150}
                height={150}
                unoptimized
                className="rounded-lg"
              />
              {secret && (
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-ink-400">
                    {t("acct.security.2fa.manualHint")}
                  </p>
                  <code className="mt-1 block break-all rounded-lg bg-ink-50 px-2 py-1.5 font-mono text-xs text-ink-700">
                    {secret}
                  </code>
                </div>
              )}
            </div>
          )}
          <div>
            <Label htmlFor="totp">{t("acct.security.2fa.code")}</Label>
            <Input
              id="totp"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              disabled={pending}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={verify} disabled={pending || code.length < 6} size="sm">
              {pending ? (
                <CircleNotch size={16} className="animate-spin" />
              ) : (
                <Check size={16} weight="bold" />
              )}
              {t("acct.security.2fa.verifyOpen")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStage("idle")}
              disabled={pending}
            >
              {t("acct.common.cancel")}
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-ink-600">
            {t("acct.security.2fa.intro")}
          </p>
          <Button onClick={begin} disabled={pending} size="sm" className="mt-4">
            {pending ? (
              <CircleNotch size={16} className="animate-spin" />
            ) : (
              <ShieldStar size={16} weight="bold" />
            )}
            {t("acct.security.2fa.setup")}
          </Button>
        </div>
      )}
      {msg && <Msg ok={msg.ok} text={msg.text} />}
    </SectionCard>
  );
}

function BackupCodes({ codes }: { codes: string[] }) {
  const { t } = useI18n();
  function copyAll() {
    navigator.clipboard.writeText(codes.join("\n")).catch(() => {});
  }
  return (
    <div className="mt-4 rounded-xl border border-warning-200 bg-warning-50/50 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-warning-800">
          {t("acct.security.2fa.backupTitle")}
        </p>
        <button
          onClick={copyAll}
          className="inline-flex items-center gap-1 text-xs font-medium text-warning-700 hover:text-warning-800"
        >
          <Copy size={13} /> {t("acct.common.copy")}
        </button>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {codes.map((c) => (
          <code
            key={c}
            className="rounded bg-white px-2 py-1 text-center font-mono text-xs text-ink-700"
          >
            {c}
          </code>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────── Aktif Oturumlar + Giriş Geçmişi ──────────────────────── */

export function SessionsSection() {
  // locale eklenir; tarih client locale'ine göre biçimlenir.
  const { user, isLoaded } = useUser();
  const { t, locale } = useI18n();
  const { sessionId } = useAuth();
  const [sessions, setSessions] = useState<SessionWithActivitiesResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    user
      .getSessions()
      .then((s) => setSessions(s))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  async function revoke(s: SessionWithActivitiesResource) {
    setRevoking(s.id);
    try {
      await s.revoke();
      setSessions((list) => list.filter((x) => x.id !== s.id));
    } catch {
      /* no-op */
    } finally {
      setRevoking(null);
    }
  }

  return (
    <SectionCard
      title={t("acct.security.sessions.title")}
      description={t("acct.security.sessions.desc")}
      icon={Desktop}
    >
      {!isLoaded || loading ? (
        <p className="text-sm text-ink-400">{t("acct.common.loading")}</p>
      ) : sessions.length === 0 ? (
        <p className="text-sm text-ink-500">{t("acct.security.sessions.empty")}</p>
      ) : (
        <ul className="divide-y divide-ink-100">
          {sessions.map((s) => {
            const a = s.latestActivity;
            const isCurrent = s.id === sessionId;
            const isMobile = a?.isMobile;
            return (
              <li key={s.id} className="flex items-center gap-3 py-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink-100 text-ink-500">
                  {isMobile ? (
                    <DeviceMobile size={18} weight="duotone" />
                  ) : (
                    <Desktop size={18} weight="duotone" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-900">
                    {a?.browserName ?? t("acct.security.sessions.unknownBrowser")}
                    {a?.deviceType ? ` · ${a.deviceType}` : ""}
                    {isCurrent && (
                      <span className="ml-2 rounded-full bg-success-50 px-2 py-0.5 text-[10px] font-bold text-success-700">
                        {t("acct.security.sessions.thisDevice")}
                      </span>
                    )}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-ink-400">
                    <Clock size={12} />
                    {[a?.city, a?.country].filter(Boolean).join(", ") ||
                      t("acct.security.sessions.unknownLocation")}
                    {" · "}
                    {s.lastActiveAt.toLocaleString(intlLocale(locale), {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {/* IP adresi — güven için her oturumda ayrıca göster */}
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-400">
                    <Globe size={12} weight="duotone" />
                    <span className="font-mono text-ink-500">
                      {a?.ipAddress ?? t("acct.security.sessions.unknownIp")}
                    </span>
                  </p>
                </div>
                {!isCurrent && (
                  <button
                    onClick={() => revoke(s)}
                    disabled={revoking === s.id}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full border border-ink-200 px-2.5 py-1 text-xs font-medium text-ink-600 transition-colors hover:bg-danger-50 hover:text-danger-700 disabled:opacity-50"
                  >
                    {revoking === s.id ? (
                      <CircleNotch size={13} className="animate-spin" />
                    ) : (
                      <SignOut size={13} />
                    )}
                    {t("acct.security.sessions.signOut")}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}
