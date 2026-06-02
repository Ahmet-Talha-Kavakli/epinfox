"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FallbackImage } from "@/components/ui/fallback-image";
import { useI18n } from "@/lib/i18n/provider";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-20 text-center">
      {/* yumuşak marka glow'ları */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-accent-200/40 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-lg rounded-[28px] border border-ink-200 bg-white/80 px-8 py-12 shadow-float backdrop-blur">
        <div className="relative mx-auto w-fit">
          <div className="pointer-events-none absolute inset-x-0 bottom-1 mx-auto h-16 w-32 rounded-full bg-accent-500/20 blur-2xl" />
          <FallbackImage
            src="/auth/error-fox.webp"
            fallback="/brand/logo-fox.png"
            width={160}
            className="relative h-auto w-40 drop-shadow-xl"
          />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-ink-900">
          {t("err.title")}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-500">
          {t("err.desc")}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => unstable_retry()}>{t("err.retry")}</Button>
          <Link href="/">
            <Button variant="outline">{t("err.home")}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
