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
 * Bu Clerk v7 (Signals API) fork'unda:
 *  - useSignIn().isLoaded undefined gelebiliyor → signIn objesinin varlığına bakarız.
 *  - create/ticket {error} döndürür; status & createdSessionId signIn objesinin
 *    KENDİ alanlarındadır (metot dönüşünde değil).
 *  - Akış: create({strategy:"ticket"}) → finalize() (session'ı aktive eder + navigate).
 *  - Backend session'ı zaten açtıysa Clerk 'session_exists' verir → başarı sayıp geçeriz.
 */
function SteamFinish() {
  type ClerkErr = { longMessage?: string; message?: string } | null;
  const signInHook = useSignIn() as unknown as {
    signIn?: {
      status?: string | null;
      createdSessionId?: string | null;
      create?: (p: { strategy: "ticket"; ticket: string }) => Promise<{ error: ClerkErr }>;
      ticket?: (p: { ticket: string }) => Promise<{ error: ClerkErr }>;
      finalize?: (p?: { navigate?: () => void }) => Promise<{ error: ClerkErr }>;
    };
  };
  const clerk = useClerk() as unknown as {
    setActive?: (p: { session: string | null }) => Promise<void>;
    user?: unknown;
    session?: unknown;
  };
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useI18n();
  const [error, setError] = useState(false);
  const ran = useRef(false);

  const { signIn } = signInHook;

  useEffect(() => {
    const hasMethod =
      typeof signIn?.ticket === "function" || typeof signIn?.create === "function";
    if (!signIn || !hasMethod) return; // Clerk henüz hazır değil
    if (ran.current) return;
    ran.current = true;

    const ticket = params.get("token");
    if (!ticket) {
      setError(true);
      return;
    }

    const go = () => {
      window.location.href = "/sign-in/steam-email";
    };

    // Backend session'ı zaten açmış olabilir → ticket denemeden geç (yoksa
    // 'session_exists' hatası). steam-email needsEmail'e göre karar verir.
    if (clerk.user || clerk.session) {
      go();
      return;
    }

    const timeout = setTimeout(() => setError(true), 15000);

    (async () => {
      try {
        if (typeof signIn.create === "function") {
          const cr = await signIn.create({ strategy: "ticket", ticket });
          if (cr?.error) throw cr.error;
        }
        if (signIn.status !== "complete" && typeof signIn.ticket === "function") {
          const tk = await signIn.ticket({ ticket });
          if (tk?.error) throw tk.error;
        }

        const sid = signIn.createdSessionId;

        // status=complete → finalize ile session'ı aktive et + yönlendir.
        if (signIn.status === "complete" && typeof signIn.finalize === "function") {
          const fin = await signIn.finalize({ navigate: go });
          if (fin?.error) throw fin.error;
          clearTimeout(timeout);
          go();
          return;
        }

        // finalize yoksa setActive ile (session id varsa).
        if (sid && clerk.setActive) {
          await clerk.setActive({ session: sid });
          clearTimeout(timeout);
          go();
          return;
        }

        clearTimeout(timeout);
        setError(true);
      } catch (e) {
        clearTimeout(timeout);
        const errObj = e as { code?: string; errors?: { code?: string }[] };
        const code = errObj?.code || errObj?.errors?.[0]?.code;
        // 'session_exists' = zaten giriş yapılmış → hata değil, başarı.
        if (code === "session_exists") {
          go();
          return;
        }
        console.error("Steam finish error:", e);
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
