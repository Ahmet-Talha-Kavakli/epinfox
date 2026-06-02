import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FallbackImage } from "@/components/ui/fallback-image";
import { getServerT } from "@/lib/i18n/server";

export default async function NotFound() {
  const t = await getServerT();

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
            src="/auth/404-fox.webp"
            fallback="/brand/logo-fox.png"
            width={180}
            className="relative h-auto w-44 drop-shadow-xl"
          />
        </div>
        <p className="mt-4 bg-gradient-to-br from-brand-500 to-accent-500 bg-clip-text text-7xl font-black tracking-tight text-transparent sm:text-8xl">
          {t("nf.code")}
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900">
          {t("nf.title")}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-500">
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
    </div>
  );
}
