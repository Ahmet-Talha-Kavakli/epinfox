"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { Eye, EyeSlash, SpinnerGap } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n/provider";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthError } from "@/components/auth/sign-up-form";
import { OAuthButtons, type OAuthStrategy } from "@/components/auth/oauth-buttons";

type ClerkErr = { code?: string; message?: string } | null | undefined;

/**
 * Headless Clerk giriş formu (Clerk v7 Signals API). Kendi tasarımımız; auth
 * motoru Clerk (useSignIn → signIn future resource). Akış: password(email+şifre)
 * → finalize. Google OAuth ayrı buton.
 */
export function SignInForm() {
  const { t } = useI18n();
  const { signIn } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Şifre sıfırlama alt-akışı: "signin" → "reset-email" → "reset-code"
  const [mode, setMode] = useState<"signin" | "reset-email" | "reset-code">("signin");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  function mapError(err: ClerkErr): string {
    const code = err?.code;
    const map: Record<string, string> = {
      form_identifier_not_found: t("auth.err.noAccount"),
      form_password_incorrect: t("auth.err.wrongPw"),
      form_param_format_invalid: t("auth.err.emailInvalid"),
      too_many_requests: t("auth.err.tooMany"),
    };
    return (code && map[code]) || err?.message || t("auth.err.generic");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!signIn || pending) return;
    setError(null);
    setPending(true);
    try {
      const { error } = await signIn.password({ identifier: email, password });
      if (error) return setError(mapError(error as ClerkErr));
      await signIn.finalize({ navigate: () => router.push("/") });
    } catch {
      setError(t("auth.err.generic"));
    } finally {
      setPending(false);
    }
  }

  async function handleOAuth(strategy: OAuthStrategy) {
    if (!signIn) {
      setError(t("auth.err.generic"));
      return;
    }
    setError(null);
    try {
      await signIn.sso({
        strategy,
        redirectUrl: "/sign-in/sso-callback",
        redirectCallbackUrl: "/sign-in/sso-callback",
      });
    } catch (e) {
      console.error("OAuth sign-in error:", e);
      setError(t("auth.err.generic"));
    }
  }

  // ─── Şifre sıfırlama: 1) email → kod gönder ───
  async function handleResetSend(e: React.FormEvent) {
    e.preventDefault();
    if (!signIn || pending) return;
    setError(null);
    setPending(true);
    try {
      const { error } = await signIn.create({ identifier: email });
      if (error) return setError(mapError(error as ClerkErr));
      const sent = await signIn.resetPasswordEmailCode.sendCode();
      if (sent.error) return setError(mapError(sent.error as ClerkErr));
      setMode("reset-code");
    } catch {
      setError(t("auth.err.generic"));
    } finally {
      setPending(false);
    }
  }

  // ─── Şifre sıfırlama: 2) kod + yeni şifre → güncelle ───
  async function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!signIn || pending) return;
    setError(null);
    setPending(true);
    try {
      const v = await signIn.resetPasswordEmailCode.verifyCode({ code: resetCode });
      if (v.error) return setError(mapError(v.error as ClerkErr));
      const s = await signIn.resetPasswordEmailCode.submitPassword({ password: newPassword });
      if (s.error) return setError(mapError(s.error as ClerkErr));
      await signIn.finalize({ navigate: () => router.push("/") });
    } catch {
      setError(t("auth.err.generic"));
    } finally {
      setPending(false);
    }
  }

  // ─── Şifre sıfırlama ekranları ───
  if (mode === "reset-email") {
    return (
      <form onSubmit={handleResetSend} className="space-y-5">
        <div>
          <Label htmlFor="reset-email">{t("auth.email")}</Label>
          <Input
            id="reset-email"
            type="email"
            autoComplete="email"
            placeholder={t("auth.emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            required
          />
        </div>
        {error && <AuthError message={error} />}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? <SpinnerGap size={18} className="animate-spin" /> : t("auth.reset.sendCode")}
        </Button>
        <button
          type="button"
          onClick={() => { setMode("signin"); setError(null); }}
          className="block w-full text-center text-sm text-ink-500 hover:text-ink-700"
        >
          {t("auth.reset.backToSignIn")}
        </button>
        <div id="clerk-captcha" />
      </form>
    );
  }

  if (mode === "reset-code") {
    return (
      <form onSubmit={handleResetSubmit} className="space-y-5">
        <p className="text-sm text-ink-500">
          {t("auth.reset.codeSubtitle").replace("{email}", email)}
        </p>
        <div>
          <Label htmlFor="reset-code">{t("auth.verify.label")}</Label>
          <Input
            id="reset-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder={t("auth.verify.placeholder")}
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            autoFocus
          />
        </div>
        <div>
          <Label htmlFor="reset-newpw">{t("auth.reset.newPassword")}</Label>
          <div className="relative">
            <Input
              id="reset-newpw"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              placeholder={t("auth.passwordCreate")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
        </div>
        {error && <AuthError message={error} />}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? <SpinnerGap size={18} className="animate-spin" /> : t("auth.reset.submit")}
        </Button>
        <button
          type="button"
          onClick={() => { setMode("signin"); setError(null); }}
          className="block w-full text-center text-sm text-ink-500 hover:text-ink-700"
        >
          {t("auth.reset.backToSignIn")}
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t("auth.password")}</Label>
            <button
              type="button"
              onClick={() => { setMode("reset-email"); setError(null); }}
              className="mb-2 text-sm text-brand-600 hover:text-brand-700"
            >
              {t("auth.forgotPw")}
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              placeholder={t("auth.passwordEnter")}
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
        </div>
        {error && <AuthError message={error} />}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? <SpinnerGap size={18} className="animate-spin" /> : t("auth.signIn.submit")}
        </Button>
        <div id="clerk-captcha" />
      </form>

      <p className="text-center text-sm text-ink-500">
        {t("auth.noAccount")}{" "}
        <Link href="/sign-up" className="font-semibold text-brand-600 hover:text-brand-700">
          {t("auth.signUpLink")}
        </Link>
      </p>
    </div>
  );
}
