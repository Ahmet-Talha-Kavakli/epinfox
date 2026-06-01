import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CaretRight, Lightning } from "@phosphor-icons/react/dist/ssr";
import { getBrandBySlug } from "@/lib/store";
import { TONE_STYLES, type Tone } from "@/lib/card-tones";
import { ProductCard } from "@/components/store/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getServerT } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBrandBySlug(slug);
  if (!data) {
    const tt = await getServerT();
    return { title: tt("nf.brand") };
  }
  return {
    title: data.brand.name,
    description: data.brand.description ?? undefined,
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = await getServerT();
  const { slug } = await params;
  const data = await getBrandBySlug(slug);
  if (!data) notFound();

  const { brand, products } = data;
  const tone = (brand.tone as Tone) ?? "brand";
  const toneStyle = TONE_STYLES[tone];

  return (
    <section className="container-page py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-ink-500">
        <Link href="/store" className="hover:text-brand-600">
          {t("p2.brand.store")}
        </Link>
        <CaretRight size={13} />
        <span className="text-ink-700">{brand.name}</span>
      </nav>

      {/* Marka banner */}
      <div className="relative min-h-[180px] overflow-hidden rounded-3xl border border-ink-200 bg-gradient-to-br from-brand-600 to-accent-600 shadow-card sm:min-h-[220px]">
        {/* Geniş banner görseli varsa tam kaplar; yoksa kare logodan hafif renk vurgusu */}
        {brand.banner_path ? (
          <Image
            src={brand.banner_path}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
            aria-hidden
          />
        ) : (
          brand.image_path && (
            <Image
              src={brand.image_path}
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-25"
              aria-hidden
            />
          )
        )}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20"
          aria-hidden
        />
        <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
          {/* Görsel */}
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white/20">
            {brand.image_path ? (
              <Image
                src={brand.image_path}
                alt={brand.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <div
                className={cn(
                  "grid h-full w-full place-items-center bg-gradient-to-br",
                  toneStyle.iconBg,
                )}
              >
                <Lightning size={36} weight="fill" className={toneStyle.iconColor} />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{brand.name}</h1>
            {brand.description && (
              <p className="mt-1.5 max-w-xl text-sm text-white/85">
                {brand.description}
              </p>
            )}
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/25 backdrop-blur-sm">
              {t("p2.brand.productCount").replace(
                "{n}",
                String(products.length),
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Ürün çeşitleri */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-ink-900">
          {t("p2.brand.productTypes")}
        </h2>
        {products.length === 0 ? (
          <EmptyState
            title={t("p2.brand.emptyTitle")}
            description={t("p2.brand.emptyDesc")}
            cta={{ label: t("p2.brand.emptyCta"), href: "/store" }}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} forceProduct />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
