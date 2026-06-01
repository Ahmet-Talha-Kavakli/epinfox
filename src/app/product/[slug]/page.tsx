import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Lightning,
  CaretRight,
  Info,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import {
  getProductBySlug,
  getProducts,
  getProductBrandInfo,
} from "@/lib/store";
import { getProductReviews, getMyReviewState } from "@/lib/actions/reviews";
import { getPlayerAccountFor } from "@/lib/actions/player-accounts";
import { getPlatformMeta } from "@/lib/player-platforms";
import { getCurrentUser } from "@/lib/auth/current-user";
import { TONE_STYLES, getToneTextureStyle, type Tone } from "@/lib/card-tones";
import { VariantTable } from "@/components/store/variant-table";
import { PurchasePanel } from "@/components/store/purchase-panel";
import { ProductTabs } from "@/components/store/product-tabs";
import { ProductFaq } from "@/components/store/product-faq";
import { ReviewSection } from "@/components/store/review-section";
import { ProductSummarySidebar } from "@/components/store/product-summary-sidebar";
import { getHowToSteps, getProductFaq } from "@/lib/content";
import { getServerT, getServerLocale } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    const tt = await getServerT();
    return { title: tt("product.notFound") };
  }
  return { title: product.name, description: product.description ?? undefined };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [tt, locale] = await Promise.all([getServerT(), getServerLocale()]);
  const tone = (product.tone as Tone) ?? "brand";
  const t = TONE_STYLES[tone];
  const variants = product.variants ?? [];

  const [related, reviewData, reviewState, currentUser, brandSiblings] =
    await Promise.all([
      product.category
        ? getProducts({ categorySlug: product.category.slug, limit: 6 }).then(
            (l) => l.filter((p) => p.id !== product.id).slice(0, 5),
          )
        : Promise.resolve([]),
      getProductReviews(product.id),
      getMyReviewState(product.id),
      getCurrentUser().catch(() => null),
      product.brand_id
        ? getProductBrandInfo(product.brand_id, product.id)
        : Promise.resolve(null),
    ]);

  // Teslim tipine göre satın alma arayüzü seçilir:
  //  - code         : sepete ekleme tablosu (VariantTable) — bilgi gerekmez.
  //  - topup/service : PurchasePanel (oyuncu ID / hedef link iste + "Hemen Al").
  const deliveryType = (product.delivery_type ?? "code") as
    | "code"
    | "topup"
    | "service";
  const needsInfo = deliveryType === "topup" || deliveryType === "service";

  // Marka slug'ı = platform anahtarı (player_accounts + platform meta).
  // enrich() product.brandSlug verir; yedek olarak brandSiblings.slug.
  const brandSlug =
    (product as { brandSlug?: string | null }).brandSlug ??
    brandSiblings?.slug ??
    null;
  const platformMeta = needsInfo ? getPlatformMeta(brandSlug, locale) : null;
  // Kullanıcının bu platform için kayıtlı değeri (giriş yoksa null).
  const savedValue =
    needsInfo && brandSlug ? await getPlayerAccountFor(brandSlug) : null;

  // Etiketler: kategori + ürün adındaki anlamlı kelimeler.
  const tags = Array.from(
    new Set(
      [
        product.category?.name,
        ...product.name.split(/\s+/).filter((w) => w.length > 2),
      ].filter(Boolean) as string[],
    ),
  ).slice(0, 6);

  return (
    <section className="container-page py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
        <Link href="/store" className="hover:text-brand-600">
          {tt("product.breadcrumbStore")}
        </Link>
        {product.category && (
          <>
            <CaretRight size={13} />
            <Link
              href={`/store?category=${product.category.slug}`}
              className="hover:text-brand-600"
            >
              {product.category.name}
            </Link>
          </>
        )}
        {brandSiblings && (
          <>
            <CaretRight size={13} />
            <Link
              href={`/brand/${brandSiblings.slug}`}
              className="hover:text-brand-600"
            >
              {brandSiblings.name}
            </Link>
          </>
        )}
        <CaretRight size={13} />
        <span className="text-ink-700">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[300px_1fr]">
        {/* SOL SİDEBAR — logo + benzer ürünler + yorum özeti + etiketler */}
        <ProductSummarySidebar
          product={{
            name: product.name,
            imagePath: product.image_path,
            categoryName: product.category?.name ?? null,
            variantCount: variants.length,
          }}
          tone={tone}
          related={related.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            imagePath: p.image_path,
            minPrice: p.minPrice ?? p.price,
          }))}
          summary={reviewData.summary}
          tags={tags}
        />

        {/* SAĞ — sekmeli içerik */}
        <ProductTabs
          reviewCount={reviewData.summary.count}
          products={
            <div>
              <h2 className="mb-4 text-lg font-bold text-ink-900">
                {product.name} {tt("product.productsSuffix")}
              </h2>
              {needsInfo ? (
                <PurchasePanel
                  variants={variants}
                  product={{
                    slug: product.slug,
                    name: product.name,
                    imagePath: product.image_path,
                    deliveryType,
                    autoSupply: product.supply_source !== "manual",
                  }}
                  savedValue={savedValue}
                  platformSlug={brandSlug}
                  platformLabel={platformMeta?.label ?? null}
                  inputPlaceholder={platformMeta?.placeholder ?? null}
                  inputHint={platformMeta?.hint ?? null}
                />
              ) : (
                <VariantTable
                  variants={variants}
                  product={{
                    slug: product.slug,
                    name: product.name,
                    imagePath: product.image_path,
                    description: product.description,
                    autoSupply: product.supply_source !== "manual",
                  }}
                />
              )}
              {/* Hızlı güven notu */}
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700">
                  <Lightning size={13} weight="fill" /> {tt("product.instantDelivery")}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-3 py-1.5 text-xs font-medium text-success-700">
                  <ShieldCheck size={13} weight="fill" /> {tt("product.securePayment")}
                </span>
              </div>
            </div>
          }
          description={
            <div>
              <h2 className="mb-3 text-lg font-bold text-ink-900">
                {product.name} {tt("product.whatIsSuffix")}
              </h2>
              <p className="leading-relaxed text-ink-600">
                {product.description ??
                  `${product.name}${tt("product.defaultDescription")}`}
              </p>
              {/* Görsel */}
              <div className="relative mt-5 aspect-[16/7] overflow-hidden rounded-2xl border border-ink-200">
                <div
                  className="absolute inset-0"
                  style={getToneTextureStyle(tone)}
                  aria-hidden
                />
                {product.image_path ? (
                  <Image
                    src={product.image_path}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <div
                      className={cn(
                        "grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br ring-1",
                        t.iconBg,
                        t.iconRing,
                      )}
                    >
                      <Lightning size={40} weight="fill" className={t.iconColor} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          }
          howto={
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
              <div>
                <h2 className="text-lg font-bold text-ink-900">
                  {tt("product.howToUse")}
                </h2>
                <ol className="mt-4 space-y-3">
                  {(product.how_to?.length
                    ? product.how_to
                    : getHowToSteps(locale)
                  ).map(
                    (step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                          {i + 1}
                        </span>
                        <span className="text-sm text-ink-600">{step}</span>
                      </li>
                    ),
                  )}
                </ol>
                <div className="mt-6">
                  <h3 className="mb-3 text-base font-bold text-ink-900">
                    {tt("product.faqTitle")}
                  </h3>
                  <ProductFaq
                    items={product.faq?.length ? product.faq : getProductFaq(locale)}
                  />
                </div>
              </div>
              <div className="h-fit rounded-2xl border border-warning-200 bg-warning-50/60 p-5">
                <div className="flex items-center gap-2 text-warning-700">
                  <Info size={20} weight="fill" />
                  <h3 className="font-semibold">{tt("product.important")}</h3>
                </div>
                <p className="mt-3 whitespace-pre-line text-sm text-ink-600">
                  {product.requirements ?? tt("product.defaultRequirements")}
                </p>
              </div>
            </div>
          }
          reviews={
            <ReviewSection
              productId={product.id}
              reviews={reviewData.reviews}
              summary={reviewData.summary}
              canReview={reviewState.canReview}
              mine={reviewState.mine}
              isSignedIn={!!currentUser}
              embedded
            />
          }
        />
      </div>
    </section>
  );
}
