"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { SpinnerGap } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n/provider";
import { AuthShell } from "@/components/auth/auth-shell";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthError } from "@/components/auth/sign-up-form";
import { completeSteamEmail } from "@/lib/actions/steam-email";

type ClerkErr = { code?: string; message?: string } | undefined;

/**
 * Steam ile giren YENİ kullanıcı için ZORUNLU e-posta doğrulama ekranı.
 * Steam e-posta vermez → sentetik adres atılır; burada kullanıcı ulaşabileceği
 * gerçek bir mail girip kod ile doğrular. Akış account-forms EmailForm deseniyle
 * aynı: createEmailAddress → prepareVerification → attemptVerification →
 * update({primaryEmailAddressId}) → completeSteamEmail() (sentetiği sil + kilidi aç).
 *
 * Kilit proxy.ts'te (publicMetadata.needsEmail). needsEmail false ise bu sayfa
 * kendini /'a yönlendirir (zaten doğrulanmış kullanıcı buraya düşmesin).
 */
function SteamEmail() {
  const { isLoaded, user } = useUser();
  const { signOut } = useClerk();
  const { t } = useI18n();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"input" | "verify">("input");
  const [emailId, setEmailId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function mapError(err: ClerkErr): string {
    const map: Record<string, string> = {
      form_identifier_exists: t("auth.err.emailExists"),
      form_param_format_invalid: t("auth.err.emailInvalid"),
      form_code_incorrect: t("auth.err.codeWrong"),
      verification_failed: t("auth.err.codeWrong"),
    };
    return (err?.code && map[err.code]) || err?.message || t("auth.err.generic");
  }

  // Clerk yüklenene kadar bekle
  if (!isLoaded) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-24">
        <SpinnerGap size={32} className="animate-spin text-brand-500" />
      </div>
    );
  }

  // Zaten doğrulanmış (ya da Steam dışı) kullanıcı buraya düşmesin
  if (!user || user.publicMetadata?.needsEmail !== true) {
    router.replace("/");
    return null;
  }

  function sendCode() {
    setError(null);
    start(async () => {
      try {
        const ea = await user!.createEmailAddress({ email });
        await ea?.prepareVerification({ strategy: "email_code" });
        setEmailId(ea?.id ?? null);
        setStage("verify");
      } catch (err: unknown) {
        const e = err as { errors?: ClerkErr[] };
        setError(mapError(e?.errors?.[0]));
      }
    });
  }

  function verify() {
    setError(null);
    start(async () => {
      try {
        const ea = user!.emailAddresses.find((e) => e.id === emailId);
        await ea?.attemptVerification({ code });
        await user!.update({ primaryEmailAddressId: emailId! });
        const res = await completeSteamEmail();
        if (!res.ok) {
          setError(t("auth.err.generic"));
          return;
        }
        await user!.reload();
        router.push("/");
      } catch (err: unknown) {
        const e = err as { errors?: ClerkErr[] };
        setError(mapError(e?.errors?.[0]));
      }
    });
  }

  return (
    <div className="space-y-5">
      {stage === "input" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!pending) sendCode();
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="steam-email">{t("auth.steamEmail.emailLabel")}</Label>
            <Input
              id="steam-email"
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
            {pending ? (
              <SpinnerGap size={18} className="animate-spin" />
            ) : (
              t("auth.steamEmail.submit")
            )}
          </Button>
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!pending) verify();
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="steam-code">{t("auth.verify.label")}</Label>
            <Input
              id="steam-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder={t("auth.verify.placeholder")}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
              required
            />
            <p className="mt-2 text-sm text-ink-500">
              {t("auth.verify.sentTo").replace("{email}", email)}
            </p>
          </div>
          {error && <AuthError message={error} />}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
              <SpinnerGap size={18} className="animate-spin" />
            ) : (
              t("auth.verify.submit")
            )}
          </Button>
          <button
            type="button"
            onClick={() => {
              setStage("input");
              setCode("");
              setError(null);
            }}
            className="block w-full text-center text-sm text-ink-500 hover:text-ink-700"
          >
            {t("auth.verify.back")}
          </button>
        </form>
      )}

      <button
        type="button"
        onClick={() => signOut(() => router.push("/sign-in"))}
        className="block w-full text-center text-sm text-ink-400 hover:text-ink-600"
      >
        {t("auth.steamEmail.signOut")}
      </button>
      <div id="clerk-captcha" />
    </div>
  );
}

export default function SteamEmailPage() {
  const { t } = useI18n();
  return (
    <AuthShell title={t("auth.steamEmail.title")} subtitle={t("auth.steamEmail.desc")}>
      <Suspense fallback={null}>
        <SteamEmail />
      </Suspense>
    </AuthShell>
  );
}
