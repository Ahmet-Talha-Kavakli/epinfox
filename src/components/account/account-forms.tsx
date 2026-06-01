"use client";

import { useState, useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { CircleNotch, Check } from "@phosphor-icons/react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserAvatar, FOX_AVATAR_IDS } from "@/components/account/user-avatar";
import {
  updateNickname,
  updateAvatar,
  updateProfileFields,
} from "@/lib/actions/profile";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

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

/** Hesap Ayarlarım — avatar + kullanıcı adı. */
export function SettingsForm({
  initialNickname,
  initialAvatar,
}: {
  initialNickname: string;
  initialAvatar: string | null;
}) {
  const router = useRouter();
  const { t } = useI18n();
  const [nickname, setNickname] = useState(initialNickname);
  const [avatar, setAvatar] = useState<string | null>(initialAvatar);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  function saveNick() {
    setMsg(null);
    start(async () => {
      const r = await updateNickname({ nickname });
      setMsg(
        r.ok
          ? { ok: true, text: t("acct.settings.general.saved") }
          : { ok: false, text: r.error },
      );
      if (r.ok) router.refresh();
    });
  }

  function pickAvatar(path: string) {
    setAvatar(path);
    start(async () => {
      const r = await updateAvatar({ avatarPath: path });
      if (r.ok) router.refresh();
      else setMsg({ ok: false, text: r.error });
    });
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-ink-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-ink-900">{t("acct.settings.general.title")}</h2>
      <p className="mt-1 text-sm text-ink-500">
        {t("acct.settings.general.desc")}
      </p>

      {/* Avatar önizleme — büyük + isim/üye etiketi */}
      <div className="mt-5 flex items-center gap-4 rounded-2xl bg-ink-50 p-4">
        <UserAvatar name={nickname} avatarPath={avatar} size={72} />
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-ink-900">
            {nickname || t("acct.settings.general.defaultUser")}
          </p>
          <p className="text-xs text-ink-500">
            {t("acct.settings.general.avatarHint")}
          </p>
        </div>
      </div>

      {/* Tilki avatar seçici — 8 hazır tilki */}
      <div className="mt-5">
        <Label>{t("acct.settings.general.avatarFox")}</Label>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {FOX_AVATAR_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => pickAvatar(`fox:${id}`)}
              aria-label={`Tilki ${id}`}
              className={cn(
                "grid aspect-square place-items-center rounded-full ring-2 ring-offset-2 ring-offset-white transition-all hover:scale-105",
                avatar === `fox:${id}` ? "ring-brand-500" : "ring-transparent",
              )}
            >
              <UserAvatar
                name={nickname}
                avatarPath={`fox:${id}`}
                size={44}
                className="h-full w-full"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Label htmlFor="nickname">{t("acct.settings.general.nickname")}</Label>
        <div className="flex gap-2">
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            disabled={pending}
          />
          <Button
            onClick={saveNick}
            disabled={pending || nickname === initialNickname}
          >
            {pending ? (
              <CircleNotch size={18} className="animate-spin" />
            ) : (
              t("acct.common.save")
            )}
          </Button>
        </div>
        <p className="mt-1.5 text-xs text-ink-400">
          {t("acct.settings.general.nicknameHint")}
        </p>
      </div>

      {msg && <Msg ok={msg.ok} text={msg.text} />}
    </div>
  );
}

/** Hesap Ayarlarım — kişisel bilgiler (ad soyad, telefon, doğum, tercihler). */
export function ProfileFieldsForm({
  initial,
}: {
  initial: {
    fullName: string | null;
    phone: string | null;
    birthDate: string | null;
    marketingOptIn: boolean;
  };
}) {
  const router = useRouter();
  const { t } = useI18n();
  const [fullName, setFullName] = useState(initial.fullName ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [birthDate, setBirthDate] = useState(initial.birthDate ?? "");
  const [marketing, setMarketing] = useState(initial.marketingOptIn);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  function save() {
    setMsg(null);
    start(async () => {
      const r = await updateProfileFields({
        fullName: fullName.trim() || null,
        phone: phone.trim() || null,
        birthDate: birthDate || null,
        marketingOptIn: marketing,
      });
      setMsg(
        r.ok
          ? { ok: true, text: t("acct.settings.personal.saved") }
          : { ok: false, text: r.error },
      );
      if (r.ok) router.refresh();
    });
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-ink-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-ink-900">{t("acct.settings.personal.title")}</h2>
      <p className="mt-1 text-sm text-ink-500">
        {t("acct.settings.personal.desc")}
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <Label htmlFor="fullName">{t("acct.settings.personal.fullName")}</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t("acct.settings.personal.fullNamePlaceholder")}
            disabled={pending}
          />
        </div>
        <div>
          <Label htmlFor="phone">{t("acct.settings.personal.phone")}</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+90 5xx xxx xx xx"
            disabled={pending}
          />
        </div>
        <div>
          <Label htmlFor="birthDate">{t("acct.settings.personal.birthDate")}</Label>
          <Input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            disabled={pending}
          />
        </div>

        {/* Pazarlama tercihi */}
        <button
          type="button"
          onClick={() => setMarketing((v) => !v)}
          disabled={pending}
          className="flex w-full items-center justify-between rounded-xl border border-ink-200 px-4 py-3 text-left transition-colors hover:bg-ink-50"
        >
          <div>
            <p className="text-sm font-medium text-ink-900">
              {t("acct.settings.personal.marketing")}
            </p>
            <p className="text-xs text-ink-500">
              {t("acct.settings.personal.marketingHint")}
            </p>
          </div>
          <span
            className={cn(
              "relative h-6 w-11 shrink-0 rounded-full transition-colors",
              marketing ? "bg-brand-600" : "bg-ink-300",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                marketing ? "translate-x-[22px]" : "translate-x-0.5",
              )}
            />
          </span>
        </button>

        <Button onClick={save} disabled={pending}>
          {pending ? (
            <CircleNotch size={18} className="animate-spin" />
          ) : (
            <>
              <Check size={16} weight="bold" /> {t("acct.common.save")}
            </>
          )}
        </Button>
      </div>

      {msg && <Msg ok={msg.ok} text={msg.text} />}
    </div>
  );
}

/** Güvenlik — şifre değiştirme. */
export function PasswordForm() {
  const { user } = useUser();
  const { t } = useI18n();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  function changePassword() {
    setMsg(null);
    start(async () => {
      try {
        await user?.updatePassword({
          currentPassword: current,
          newPassword: next,
        });
        setMsg({ ok: true, text: t("acct.security.password.saved") });
        setCurrent("");
        setNext("");
      } catch (e: unknown) {
        const err = e as { errors?: { message?: string }[] };
        setMsg({
          ok: false,
          text:
            err?.errors?.[0]?.message ??
            t("acct.security.password.error"),
        });
      }
    });
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-ink-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-ink-900">{t("acct.security.password.title")}</h2>
      <div className="mt-5 space-y-4">
        <div>
          <Label htmlFor="cur">{t("acct.security.password.current")}</Label>
          <Input
            id="cur"
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            disabled={pending}
          />
        </div>
        <div>
          <Label htmlFor="new">{t("acct.security.password.new")}</Label>
          <Input
            id="new"
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            disabled={pending}
          />
        </div>
        <Button
          onClick={changePassword}
          disabled={pending || !current || next.length < 8}
        >
          {pending ? (
            <CircleNotch size={18} className="animate-spin" />
          ) : (
            t("acct.security.password.update")
          )}
        </Button>
      </div>
      {msg && <Msg ok={msg.ok} text={msg.text} />}
    </div>
  );
}

/** Güvenlik — e-posta değiştirme (Clerk doğrulamalı). */
export function EmailForm({ currentEmail }: { currentEmail: string }) {
  const { user } = useUser();
  const { t } = useI18n();
  const [newEmail, setNewEmail] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"input" | "verify">("input");
  const [emailIdState, setEmailIdState] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  function addEmail() {
    setMsg(null);
    start(async () => {
      try {
        const e = await user?.createEmailAddress({ email: newEmail });
        await e?.prepareVerification({ strategy: "email_code" });
        setEmailIdState(e?.id ?? null);
        setStage("verify");
        setMsg({ ok: true, text: t("acct.security.email.codeSent") });
      } catch (err: unknown) {
        const e = err as { errors?: { message?: string }[] };
        setMsg({
          ok: false,
          text: e?.errors?.[0]?.message ?? t("acct.security.email.addError"),
        });
      }
    });
  }

  function verify() {
    setMsg(null);
    start(async () => {
      try {
        const emailObj = user?.emailAddresses.find(
          (e) => e.id === emailIdState,
        );
        await emailObj?.attemptVerification({ code });
        await user?.update({ primaryEmailAddressId: emailIdState! });
        setMsg({ ok: true, text: t("acct.security.email.updated") });
        setStage("input");
        setNewEmail("");
        setCode("");
      } catch (err: unknown) {
        const e = err as { errors?: { message?: string }[] };
        setMsg({
          ok: false,
          text: e?.errors?.[0]?.message ?? t("acct.security.email.verifyError"),
        });
      }
    });
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-ink-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-ink-900">{t("acct.security.email.title")}</h2>
      <p className="mt-1 text-sm text-ink-500">
        {t("acct.security.email.current")} <span className="font-medium text-ink-700">{currentEmail}</span>
      </p>

      {stage === "input" ? (
        <div className="mt-5 space-y-4">
          <div>
            <Label htmlFor="email">{t("acct.security.email.new")}</Label>
            <Input
              id="email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={pending}
              placeholder="yeni@eposta.com"
            />
          </div>
          <Button onClick={addEmail} disabled={pending || !newEmail.includes("@")}>
            {pending ? (
              <CircleNotch size={18} className="animate-spin" />
            ) : (
              t("acct.security.email.sendVerify")
            )}
          </Button>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <div>
            <Label htmlFor="code">{t("acct.security.email.code")}</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={pending}
              placeholder="000000"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={verify} disabled={pending || code.length < 4}>
              {pending ? (
                <CircleNotch size={18} className="animate-spin" />
              ) : (
                t("acct.security.email.verify")
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setStage("input")}
              disabled={pending}
            >
              {t("acct.common.cancel")}
            </Button>
          </div>
        </div>
      )}
      {msg && <Msg ok={msg.ok} text={msg.text} />}
    </div>
  );
}
