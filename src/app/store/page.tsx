import type { Metadata } from "next";
import { Suspense } from "react";
import { Lightning, ShieldCheck, Gift } from "@phosphor-icons/react/dist/ssr";
import {
  getCategories,
  getCategoryCounts,
  getProducts,
  getMultiProductBrands,
  type SortKey,
} from "@/lib/store";
import { ProductCard } from "@/components/store/product-card";
import { getMyFavoriteIds } from "@/lib/actions/favorites";
import { getCurrentUser } from "@/lib/auth/current-user";
import { StoreSidebar } from "@/components/store/store-sidebar";
import { StoreSearch } from "@/components/store/store-search";
import { BrandStrip } from "@/components/store/brand-strip";
import { EmptyState } from "@/components/ui/empty-state";
import { getServerT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerT();
  return { title: t("store.metaTitle") };
}

const VALID_SORTS: SortKey[] = ["popular", "cheap", "expensive", "new"];

export default async function MagazaPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    stock?: string;
    q?: string;
  }>;
}) {
  const sp = await searchParams;
  const t = await getServerT();
  const sort = (VALID_SORTS as string[]).includes(sp.sort ?? "")
    ? (sp.sort as SortKey)
    : "popular";

  // Marka şeridi yalnız varsayılan görünümde (filtre/arama yokken)
  const isDefaultView = !sp.category && !sp.q && !sp.stock;

  const [categories, allProducts, featuredBrands, counts, favoriteIds, current] =
    await Promise.all([
      getCategories(),
      getProducts({
        categorySlug: sp.category,
        sort,
        inStockOnly: sp.stock === "1",
      }),
      isDefaultView ? getMultiProductBrands() : Promise.resolve([]),
      getCategoryCounts(),
      getMyFavoriteIds(),
      getCurrentUser(),
    ]);
  const isSignedIn = current !== null;

  const query = (sp.q ?? "").trim().toLowerCase();
  const filtered = query
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.description ?? "").toLowerCase().includes(query),
      )
    : allProducts;

  // Giriş yapan kullanıcının favorileri listenin EN ÜSTÜNE (stable sort).
  // getProducts'ın kendi sırasını bozmadan, sadece favori olanları öne alırız.
  const products =
    favoriteIds.size > 0
      ? [...filtered].sort((a, b) => {
          const fa = favoriteIds.has(a.id) ? 0 : 1;
          const fb = favoriteIds.has(b.id) ? 0 : 1;
          return fa - fb;
        })
      : filtered;

  const activeCat = categories.find((c) => c.slug === sp.category);

  return (
    <section className="container-page py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-ink-900">
          {query
            ? `${t("store.resultsForPrefix")}${sp.q}${t("store.resultsForSuffix")}`
            : activeCat
              ? activeCat.name
              : t("store.title")}
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          {activeCat?.description ?? t("store.subtitle")}
        </p>

        {/* Güven bandı — anında teslim, güvenli ödeme, bonus */}
        {isDefaultView && (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                icon: Lightning,
                title: t("store.trustInstantTitle"),
                desc: t("store.trustInstantDesc"),
                bg: "bg-brand-50 text-brand-600 ring-brand-200",
              },
              {
                icon: ShieldCheck,
                title: t("store.trustSecureTitle"),
                desc: t("store.trustSecureDesc"),
                bg: "bg-success-50 text-success-600 ring-success-200",
              },
              {
                icon: Gift,
                title: t("store.trustBonusTitle"),
                desc: t("store.trustBonusDesc"),
                bg: "bg-accent-50 text-accent-600 ring-accent-200",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-white p-3.5"
              >
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 ${f.bg}`}
                >
                  <f.icon size={20} weight="duotone" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink-900">{f.title}</p>
                  <p className="truncate text-xs text-ink-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        {/* Sol sidebar */}
        <StoreSidebar
          categories={categories}
          activeSlug={sp.category}
          counts={counts}
        />

        {/* Ürünler */}
        <div>
          <div className="mb-5">
            <Suspense fallback={null}>
              <StoreSearch initial={sp.q ?? ""} />
            </Suspense>
          </div>
          {featuredBrands.length > 0 && <BrandStrip brands={featuredBrands} />}
          <p className="mb-4 text-sm text-ink-500">
            <span className="font-semibold text-ink-900">{products.length}</span>{" "}
            {t("store.productCountSuffix")}
          </p>
          {products.length === 0 ? (
            <EmptyState
              title={t("store.emptyTitle")}
              description={t("store.emptyDesc")}
              cta={{ label: t("store.emptyCta"), href: "/store" }}
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  favorited={favoriteIds.has(p.id)}
                  isSignedIn={isSignedIn}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
