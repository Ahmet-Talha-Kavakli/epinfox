import type { Metadata } from "next";
import Link from "next/link";
import { Broadcast, ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { PublisherApplyForm } from "@/components/publisher/apply-form";
import { getServerT } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Yayıncı Başvuru",
  description:
    "EpinFox yayıncı programına başvur. Platform, takipçi kademesi ve komisyon oranını seç, bağış sayfanı oluştur.",
};

const HERO_IMG = "/publisher-apply-hero.png";

export default async function PublisherApplyPage() {
  const t = await getServerT();
  return (
    <div className="bg-[#f8fafc]">
      {/* ───────── ÜST BANNER (16:9 görsel + overlay metin) ───────── */}
      <section className="container-page pt-6">
        <div className="relative h-[clamp(200px,30vw,360px)] w-full overflow-hidden rounded-3xl border border-ink-200 shadow-card">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMG})` }}
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/30"
            aria-hidden
          />
          <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-semibold text-white backdrop-blur-sm ring-1 ring-white/30">
              <Broadcast size={16} weight="fill" /> {t("sup.publisher.applyChip")}
            </span>
            <h1 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-4xl">
              {t("sup.publisher.applyTitle")}
            </h1>
            <p className="mt-2 max-w-md text-sm text-white/80 sm:text-base">
              {t("sup.publisher.applyLead")}
            </p>
          </div>
        </div>
      </section>

      {/* ───────── FORM ───────── */}
      <section className="container-page max-w-3xl pb-12 pt-8">
        {/* Geri linki */}
        <Link
          href="/publisher"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft size={16} weight="bold" />
          {t("sup.publisher.allPublishers")}
        </Link>

        <div className="mt-6">
          <PublisherApplyForm />
        </div>
      </section>
    </div>
  );
}
