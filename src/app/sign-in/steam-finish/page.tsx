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
  const signInHook = useSignIn() as unknown as {
    isLoaded: boolean;
    signIn?: {
      create?: (p: { strategy: "ticket"; ticket: string }) => Promise<{
        status?: string;
        createdSessionId?: string | null;
      }>;
      ticket?: (p: { ticket: string }) => Promise<{ createdSessionId?: string | null }>;
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
  const { isLoaded, signIn } = signInHook;

  useEffect(() => {
    if (!isLoaded || !signIn) {
      setStep(`waiting clerk (isLoaded=${isLoaded}, signIn=${!!signIn})`);
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

    const timeout = setTimeout(() => {
      setStep("timeout (15s)");
      setError(true);
    }, 15000);

    (async () => {
      try {
        let createdSessionId: string | null | undefined;

        // 1) Klasik create
        if (typeof signIn.create === "function") {
          setStep("signIn.create…");
          const res = await signIn.create({ strategy: "ticket", ticket });
          createdSessionId = res?.createdSessionId;
          setStep(`create done (status=${res?.status}, sid=${!!createdSessionId})`);
        }

        // 2) Olmazsa Future ticket API
        if (!createdSessionId && typeof signIn.ticket === "function") {
          setStep("signIn.ticket…");
          const res = await signIn.ticket({ ticket });
          createdSessionId = res?.createdSessionId;
          setStep(`ticket done (sid=${!!createdSessionId})`);
        }

        if (!createdSessionId) {
          setStep("no session id");
          clearTimeout(timeout);
          setError(true);
          return;
        }

        setStep("setActive…");
        if (clerk.setActive) {
          await clerk.setActive({ session: createdSessionId });
        }
        clearTimeout(timeout);
        setStep("redirecting…");
        window.location.href = "/sign-in/steam-email";
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
  }, [isLoaded, signIn, clerk, params]);

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
