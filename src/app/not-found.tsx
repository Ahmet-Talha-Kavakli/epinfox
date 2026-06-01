import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FallbackImage } from "@/components/ui/fallback-image";
import { getServerT } from "@/lib/i18n/server";

export default async function NotFound() {
  const t = await getServerT();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <FallbackImage
        src="/auth/404-fox.webp"
        fallback="/brand/logo-fox.png"
        width={180}
        className="mb-2 h-auto w-44 opacity-95 drop-shadow-xl"
      />
      <p className="bg-gradient-to-br from-brand-500 to-accent-500 bg-clip-text text-7xl font-black tracking-tight text-transparent sm:text-8xl">
        {t("nf.code")}
      </p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink-900">
        {t("nf.title")}
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-500">
        {t("nf.desc")}
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button>{t("nf.home")}</Button>
        </Link>
        <Link href="/store">
          <Button variant="outline">{t("nf.store")}</Button>
        </Link>
      </div>
    </div>
  );
}
