"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { SpinnerGap } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n/provider";

/**
 * Steam callback'inden gelen sign-in token (ticket) ile Clerk session'ı açar.
 * Backend (/api/auth/steam/callback) token üretip buraya ?token= ile yönlendirir.
 */
function SteamFinish() {
  const { isLoaded, signIn, setActive } = useSignIn() as unknown as {
    isLoaded: boolean;
    signIn?: {
      create: (p: { strategy: "ticket"; ticket: string }) => Promise<{ status: string; createdSessionId: string | null }>;
    };
    setActive?: (p: { session: string | null }) => Promise<void>;
  };
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useI18n();
  const [error, setError] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    // Clerk (clerk.browser.js) henüz yüklenmediyse bekle — yoksa yarış durumuyla
    // signIn undefined gelir ve haksız yere "bir şeyler ters gitti" gösterilir.
    if (!isLoaded || !signIn || !setActive) return;
    if (ran.current) return;
    ran.current = true;
    const ticket = params.get("token");
    if (!ticket) {
      setError(true);
      return;
    }
    (async () => {
      try {
        const res = await signIn.create({ strategy: "ticket", ticket });
        if (res.status === "complete" && res.createdSessionId) {
          await setActive({ session: res.createdSessionId });
          router.push("/");
        } else {
          setError(true);
        }
      } catch (e) {
        console.error("Steam finish error:", e);
        setError(true);
      }
    })();
  }, [isLoaded, params, signIn, setActive, router]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      {error ? (
        <>
          <p className="text-lg font-semibold text-ink-900">{t("auth.err.generic")}</p>
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
