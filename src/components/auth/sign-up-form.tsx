"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSignUp } from "@clerk/nextjs";
import { Eye, EyeSlash, SpinnerGap, Check } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n/provider";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OAuthButtons, type OAuthStrategy } from "@/components/auth/oauth-buttons";
import { PasswordStrength, scorePassword } from "@/components/auth/password-strength";

type ClerkErr = { code?: string; message?: string } | null | undefined;

/**
 * Headless Clerk kayıt formu (Clerk v7 Signals API). Ad soyad + e-posta +
 * telefon + şifre (+tekrar) + güç göstergesi + sözleşme/bildirim onayı.
 * Akış: create → sendEmailCode → verifyEmailCode → finalize. Sosyal: OAuth.
 */
export function SignUpForm() {
  const { t } = useI18n();
  const { signUp } = useSignUp();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");

  function mapError(err: ClerkErr): string {
    const code = err?.code;
    const map: Record<string, string> = {
      form_identifier_exists: t("auth.err.emailExists"),
      form_password_pwned: t("auth.err.pwWeak"),
      form_password_length_too_short: t("auth.err.pwShort"),
      form_param_format_invalid: t("auth.err.emailInvalid"),
      form_code_incorrect: t("auth.err.codeWrong"),
      verification_failed: t("auth.err.codeWrong"),
    };
    return (code && map[code]) || err?.message || t("auth.err.generic");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!signUp || pending) return;
    setError(null);
    // Client-side doğrulamalar
    if (password !== confirm) return setError(t("auth.err.pwMismatch"));
    if (scorePassword(password) < 2) return setError(t("auth.err.pwShort"));
    if (!acceptTerms) return setError(t("auth.err.mustAccept"));

    setPending(true);
    try {
      const { error } = await signUp.create({
        emailAddress: email,
        password,
        unsafeMetadata: {
          ...(fullName.trim() ? { fullName: fullName.trim() } : {}),
          ...(phone.trim() ? { phone: phone.trim() } : {}),
          marketingOptIn: acceptMarketing,
        },
      });
      if (error) return setError(mapError(error as ClerkErr));
      const sent = await signUp.verifications.sendEmailCode();
      if (sent.error) return setError(mapError(sent.error as ClerkErr));
      setVerifying(true);
    } catch {
      setError(t("auth.err.generic"));
    } finally {
      setPending(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!signUp || pending) return;
    setError(null);
    setPending(true);
    try {
      const { error } = await signUp.verifications.verifyEmailCode({ code });
      if (error) return setError(mapError(error as ClerkErr));
      await signUp.finalize({ navigate: () => router.push("/") });
    } catch {
      setError(t("auth.err.generic"));
    } finally {
      setPending(false);
    }
  }

  async function handleOAuth(strategy: OAuthStrategy) {
    if (!signUp) return;
    setError(null);
    try {
      await signUp.sso({
        strategy,
        redirectUrl: "/sign-up/sso-callback",
        redirectCallbackUrl: "/sign-up/sso-callback",
      });
    } catch {
      setError(t("auth.err.generic"));
    }
  }

  if (verifying) {
    return (
      <form onSubmit={handleVerify} className="space-y-5">
        <div>
          <Label htmlFor="code">{t("auth.verify.label")}</Label>
          <Input
            id="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder={t("auth.verify.placeholder")}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoFocus
          />
          <p className="mt-2 text-sm text-ink-500">
            {t("auth.verify.sentTo").replace("{email}", email)}
          </p>
        </div>
        {error && <AuthError message={error} />}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? <SpinnerGap size={18} className="animate-spin" /> : t("auth.verify.submit")}
        </Button>
        <button
          type="button"
          onClick={() => setVerifying(false)}
          className="block w-full text-center text-sm text-ink-500 hover:text-ink-700"
        >
          {t("auth.verify.back")}
        </button>
        <div id="clerk-captcha" />
      </form>
    );
  }

  return (
    <div className="space-y-5">
      <OAuthButtons onProvider={handleOAuth} />

      <div className="flex items-center gap-3 text-sm text-ink-400">
        <span className="h-px flex-1 bg-ink-200" />
        {t("auth.or")}
        <span className="h-px flex-1 bg-ink-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="fullName">
            {t("auth.fullName")}{" "}
            <span className="font-normal text-ink-400">{t("auth.optional")}</span>
          </Label>
          <Input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder={t("auth.fullNamePlaceholder")}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t("auth.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">
            {t("auth.phone")}{" "}
            <span className="font-normal text-ink-400">{t("auth.optional")}</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+90 5xx xxx xx xx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">{t("auth.password")}</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              placeholder={t("auth.passwordCreate")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-11"
              required
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
              aria-label={showPw ? t("auth.hidePw") : t("auth.showPw")}
            >
              {showPw ? <EyeSlash size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <PasswordStrength pw={password} />
        </div>
        <div>
          <Label htmlFor="confirm">{t("auth.passwordConfirm")}</Label>
          <Input
            id="confirm"
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            placeholder={t("auth.passwordConfirmPlaceholder")}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          {confirm.length > 0 && confirm !== password && (
            <p className="mt-1 text-xs text-danger-600">{t("auth.err.pwMismatch")}</p>
          )}
        </div>

        {/* Onay kutuları */}
        <div className="space-y-2.5 pt-1">
          <Checkbox checked={acceptTerms} onChange={setAcceptTerms}>
            {t("auth.acceptTerms")}
          </Checkbox>
          <Checkbox checked={acceptMarketing} onChange={setAcceptMarketing}>
            {t("auth.acceptMarketing")}
          </Checkbox>
        </div>

        {error && <AuthError message={error} />}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? <SpinnerGap size={18} className="animate-spin" /> : t("auth.signUp.submit")}
        </Button>
        <div id="clerk-captcha" />
      </form>

      <p className="text-center text-sm text-ink-500">
        {t("auth.haveAccount")}{" "}
        <Link href="/sign-in" className="font-semibold text-brand-600 hover:text-brand-700">
          {t("auth.signInLink")}
        </Link>
      </p>
    </div>
  );
}

/** Markalı onay kutusu. */
function Checkbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 text-sm text-ink-600">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors ${
          checked ? "border-brand-500 bg-brand-500 text-white" : "border-ink-300 bg-white"
        }`}
      >
        {checked && <Check size={13} weight="bold" />}
      </button>
      <span className="leading-snug">{children}</span>
    </label>
  );
}

export function AuthError({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
      {message}
    </div>
  );
}
