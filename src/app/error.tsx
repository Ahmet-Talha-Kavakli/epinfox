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
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <FallbackImage
        src="/auth/error-fox.webp"
        fallback="/brand/logo-fox.png"
        width={160}
        className="mb-2 h-auto w-40 opacity-95 drop-shadow-xl"
      />
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink-900">
        {t("err.title")}
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-500">
        {t("err.desc")}
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => unstable_retry()}>{t("err.retry")}</Button>
        <Link href="/">
          <Button variant="outline">{t("err.home")}</Button>
        </Link>
      </div>
    </div>
  );
}
