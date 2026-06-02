"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignIn, useClerk } from "@clerk/nextjs";
import { SpinnerGap } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n/provider";

/**
 * Steam callback'inden gelen sign-in token (ticket) ile Clerk session'ı açar.
 * Backend (/api/auth/steam/callback) token üretip buraya ?token= ile yönlendirir.
 *
 * Bu Clerk v7 (Signals API) fork'unda ticket sign-in iki yolla yapılabilir:
 *  - signIn.create({ strategy: "ticket", ticket }) → SignInResource
 *  - signIn.ticket({ ticket }) → Future API
 * İkisini de deneriz; setActive useClerk()'ten alınır (useSignIn'inki Signals
 * API'de farklı davranabiliyor). Hata/aşama ekrana yazılır (debug=1 ile).
 */
function SteamFinish() {
  type ClerkErr = { longMessage?: string; message?: string } | null;
  const signInHook = useSignIn() as unknown as {
    signIn?: {
      // Future API (bu fork): ticket + finalize. finalize session'ı aktif eder
      // ve navigate callback'i ile yönlendirir (sign-up-form ile aynı desen).
      ticket?: (p: { ticket: string }) => Promise<{ error: ClerkErr }>;
      finalize?: (p?: { navigate?: () => void }) => Promise<{ error: ClerkErr }>;
      // Klasik fallback
      create?: (p: { strategy: "ticket"; ticket: string }) => Promise<{
        status?: string;
        createdSessionId?: string | null;
      }>;
    };
  };
  const clerk = useClerk() as unknown as {
    setActive?: (p: { session: string | null }) => Promise<void>;
  };
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useI18n();
  const [error, setError] = useState(false);
  const [step, setStep] = useState("init");
  const ran = useRef(false);

  const debug = params.get("debug") === "1";
  const { signIn } = signInHook;

  useEffect(() => {
    // Bu Clerk v7 Signals fork'unda useSignIn().isLoaded undefined gelebiliyor;
    // signIn objesinin (ve ticket metotlarının) varlığını esas alıyoruz.
    const hasMethod =
      typeof signIn?.ticket === "function" || typeof signIn?.create === "function";
    if (!signIn || !hasMethod) {
      setStep(`waiting clerk (signIn=${!!signIn})`);
      return;
    }
    if (ran.current) return;
    ran.current = true;

    const ticket = params.get("token");
    if (!ticket) {
      setStep("no token");
      setError(true);
      return;
    }

    const go = () => {
      window.location.href = "/sign-in/steam-email";
    };

    const timeout = setTimeout(() => {
      setStep("timeout (15s)");
      setError(true);
    }, 15000);

    (async () => {
      try {
        // Future API (bu fork'un yolu): ticket → finalize. finalize session'ı
        // aktive eder ve navigate ile yönlendirir.
        if (typeof signIn.ticket === "function" && typeof signIn.finalize === "function") {
          setStep("signIn.ticket…");
          const tk = await signIn.ticket({ ticket });
          if (tk?.error) throw tk.error;
          setStep("signIn.finalize…");
          const fin = await signIn.finalize({ navigate: go });
          if (fin?.error) throw fin.error;
          clearTimeout(timeout);
          setStep("redirecting…");
          // finalize navigate'i çağırmadıysa biz yönlendirelim (emniyet).
          go();
          return;
        }

        // Klasik fallback: create + setActive
        if (typeof signIn.create === "function") {
          setStep("signIn.create…");
          const res = await signIn.create({ strategy: "ticket", ticket });
          const sid = res?.createdSessionId;
          setStep(`create done (status=${res?.status}, sid=${!!sid})`);
          if (sid && clerk.setActive) {
            setStep("setActive…");
            await clerk.setActive({ session: sid });
          }
          clearTimeout(timeout);
          setStep("redirecting…");
          go();
          return;
        }

        setStep("no usable method");
        clearTimeout(timeout);
        setError(true);
      } catch (e) {
        console.error("Steam finish error:", e);
        clearTimeout(timeout);
        const msg = e instanceof Error ? e.message : String(e);
        const errObj = e as { errors?: { longMessage?: string; message?: string }[] };
        const detail = errObj?.errors?.[0]?.longMessage || errObj?.errors?.[0]?.message || msg;
        setStep(`error: ${detail}`);
        setError(true);
      }
    })();

    return () => clearTimeout(timeout);
  }, [signIn, clerk, params]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      {error ? (
        <>
          <p className="text-lg font-semibold text-ink-900">{t("auth.err.generic")}</p>
          {debug && <p className="max-w-md text-xs text-danger-600">{step}</p>}
          <button
            onClick={() => router.push("/sign-in")}
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            {t("auth.reset.backToSignIn")}
          </button>
        </>
      ) : (
        <>
          <SpinnerGap size={32} className="animate-spin text-brand-500" />
          <p className="text-sm text-ink-500">{t("auth.steam")}…</p>
          {debug && <p className="max-w-md text-xs text-ink-400">{step}</p>}
        </>
      )}
    </div>
  );
}

export default function SteamFinishPage() {
  return (
    <Suspense fallback={null}>
      <SteamFinish />
    </Suspense>
  );
}
