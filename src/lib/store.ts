import { createAdminClient } from "@/lib/supabase/server";
import { STORE_LOCKED } from "@/config/site";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { getContentLocale, overlayTranslations } from "@/lib/content-i18n";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import type {
  Brand,
  Category,
  Product,
  ProductVariant,
  ProductWithMeta,
  VariantWithStock,
} from "@/lib/supabase/types";

/** Aktif kategoriler (position sıralı). */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("position", { ascending: true });
  return overlayTranslations(
    "category",
    (data as Category[]) ?? [],
    await getContentLocale(),
  );
}

/** Kategori id → aktif ürün adedi (sidebar sayaçları için). */
export async function getCategoryCounts(): Promise<{
  total: number;
  byCategory: Record<number, number>;
}> {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("products")
    .select("category_id")
    .eq("is_active", true);
  const rows = (data as { category_id: number }[]) ?? [];
  const byCategory: Record<number, number> = {};
  for (const r of rows) {
    byCategory[r.category_id] = (byCategory[r.category_id] ?? 0) + 1;
  }
  return { total: rows.length, byCategory };
}

/** Birden çok ürün çeşidi olan markalar (oyun sayfası için). */
export async function getBrands(): Promise<Brand[]> {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("position", { ascending: true });
  return overlayTranslations(
    "brand",
    (data as Brand[]) ?? [],
    await getContentLocale(),
  );
}

/** En az bir ürünü olan markalar (mağaza "öne çıkan oyunlar" şeridi). */
export async function getMultiProductBrands(): Promise<
  (Brand & { productCount: number })[]
> {
  const supabase = await createAdminClient();
  const [{ data: brands }, { data: prods }] = await Promise.all([
    supabase.from("brands").select("*").eq("is_active", true).order("position"),
    supabase.from("products").select("brand_id").eq("is_active", true),
  ]);
  const counts = new Map<number, number>();
  for (const p of (prods as { brand_id: number | null }[]) ?? []) {
    if (p.brand_id != null)
      counts.set(p.brand_id, (counts.get(p.brand_id) ?? 0) + 1);
  }
  // Tek ürünlü markalar da gösterilir (tek tür bile olsa /brand sayfası açılır).
  const translated = await overlayTranslations(
    "brand",
    (brands as Brand[]) ?? [],
    await getContentLocale(),
  );
  return translated
    .map((b) => ({ ...b, productCount: counts.get(b.id) ?? 0 }))
    .filter((b) => b.productCount > 0);
}

/** Slug ile marka + o markanın tüm ürünleri (enriched). */
export async function getBrandBySlug(
  slug: string,
): Promise<{ brand: Brand; products: ProductWithMeta[] } | null> {
  const supabase = await createAdminClient();
  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (!brand) return null;

  const { data: prods } = await supabase
    .from("products")
    .select("*")
    .eq("brand_id", (brand as Brand).id)
    .eq("is_active", true)
    .order("position", { ascending: true });

  const enriched = await enrich((prods as Product[]) ?? []);
  const [tBrand] = await overlayTranslations(
    "brand",
    [brand as Brand],
    await getContentLocale(),
  );
  return { brand: tBrand, products: enriched };
}

/**
 * Bir ürünün markasını + kendisi dışındaki çeşit sayısını döndürür.
 * Ürün detayında "markanın tüm ürünleri" linki için kullanılır.
 */
export async function getProductBrandInfo(
  brandId: number,
  excludeProductId: string,
): Promise<{ slug: string; name: string; siblingCount: number } | null> {
  const supabase = await createAdminClient();
  const [{ data: brand }, { count }] = await Promise.all([
    supabase
      .from("brands")
      .select("slug, name")
      .eq("id", brandId)
      .eq("is_active", true)
      .maybeSingle(),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("brand_id", brandId)
      .eq("is_active", true)
      .neq("id", excludeProductId),
  ]);
  if (!brand) return null;
  return {
    slug: brand.slug as string,
    name: brand.name as string,
    siblingCount: count ?? 0,
  };
}

export type SortKey = "popular" | "cheap" | "expensive" | "new";

/** Aktif ürünler + (opsiyonel) kategori filtresi + meta (varyant, stok, fiyat, satış). */
export async function getProducts(opts?: {
  categorySlug?: string;
  limit?: number;
  sort?: SortKey;
  inStockOnly?: boolean;
  maxPrice?: number;
}): Promise<ProductWithMeta[]> {
  const supabase = await createAdminClient();

  let categoryId: number | undefined;
  if (opts?.categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", opts.categorySlug)
      .maybeSingle();
    if (!cat) return [];
    categoryId = cat.id;
  }

  let q = supabase.from("products").select("*").eq("is_active", true);
  if (categoryId) q = q.eq("category_id", categoryId);
  const { data: products } = await q;
  let list = (products as Product[]) ?? [];
  if (list.length === 0) return [];

  let enriched = await enrich(list);

  // Filtreler
  if (opts?.inStockOnly) enriched = enriched.filter((p) => (p.stock ?? 0) > 0);
  if (opts?.maxPrice != null)
    enriched = enriched.filter((p) => (p.minPrice ?? p.price) <= opts.maxPrice!);

  // Sıralama
  const sort = opts?.sort ?? "popular";
  enriched.sort((a, b) => {
    if (sort === "cheap") return (a.minPrice ?? a.price) - (b.minPrice ?? b.price);
    if (sort === "expensive") return (b.minPrice ?? b.price) - (a.minPrice ?? a.price);
    if (sort === "new")
      return +new Date(b.created_at) - +new Date(a.created_at);
    // popular: satış sayısı, sonra position
    const s = (b.soldCount ?? 0) - (a.soldCount ?? 0);
    return s !== 0 ? s : a.position - b.position;
  });

  return opts?.limit ? enriched.slice(0, opts.limit) : enriched;
}

/** Slug ile tek ürün + kategori + varyantlar (stoklu) + meta. */
export async function getProductBySlug(
  slug: string,
): Promise<ProductWithMeta | null> {
  const supabase = await createAdminClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (!product) return null;

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("id", (product as Product).category_id)
    .maybeSingle();

  const [enriched] = await enrich([product as Product]);
  const [tCategory] = category
    ? await overlayTranslations("category", [category as Category], await getContentLocale())
    : [null];
  return { ...enriched, category: tCategory ?? null };
}

/**
 * Ürün listesine varyantları, varyant başına stoğu, min fiyat, indirim ve
 * satış sayısını ekler. Toplu sorgularla (N+1 yerine birkaç sorgu).
 */
async function enrich(products: Product[]): Promise<ProductWithMeta[]> {
  const supabase = await createAdminClient();
  // Aktif locale çevirisini ürünlerin üzerine bin (tr → no-op).
  const locale = await getContentLocale();
  products = await overlayTranslations("product", products, locale);
  const productIds = products.map((p) => p.id);

  // 1) Tüm aktif varyantlar
  const { data: variantsData } = await supabase
    .from("product_variants")
    .select("*")
    .in("product_id", productIds)
    .eq("is_active", true)
    .order("position", { ascending: true });
  const variants = await overlayTranslations(
    "variant",
    (variantsData as ProductVariant[]) ?? [],
    locale,
  );
  const variantIds = variants.map((v) => v.id);

  // 2) Varyant başına available stok
  const availByVariant = new Map<string, number>();
  if (variantIds.length) {
    const { data: codes } = await supabase
      .from("product_codes")
      .select("variant_id")
      .in("variant_id", variantIds)
      .eq("status", "available");
    for (const c of (codes as { variant_id: string }[]) ?? []) {
      availByVariant.set(c.variant_id, (availByVariant.get(c.variant_id) ?? 0) + 1);
    }
  }

  // 3) Ürün başına satış sayısı (sold kod)
  const soldByProduct = new Map<string, number>();
  {
    const { data: sold } = await supabase
      .from("orders")
      .select("product_id")
      .in("product_id", productIds);
    for (const o of (sold as { product_id: string }[]) ?? []) {
      soldByProduct.set(o.product_id, (soldByProduct.get(o.product_id) ?? 0) + 1);
    }
  }

  // 4) Marka slug map'i (kart linki /brand/<slug> için).
  const brandSlugById = new Map<number, string>();
  {
    const brandIds = Array.from(
      new Set(products.map((p) => p.brand_id).filter((id): id is number => id != null)),
    );
    if (brandIds.length) {
      const { data: brands } = await supabase
        .from("brands")
        .select("id, slug")
        .in("id", brandIds)
        .eq("is_active", true);
      for (const b of (brands as { id: number; slug: string }[]) ?? []) {
        brandSlugById.set(b.id, b.slug);
      }
    }
  }

  // Grupla. Mağaza kilitliyse (gerçek ödeme yok) tüm varyant stoğu 0 — vitrin
  // görünür kalır ama "Tükendi" gösterilip satın alma engellenir.
  const variantsByProduct = new Map<string, VariantWithStock[]>();
  for (const v of variants) {
    const arr = variantsByProduct.get(v.product_id) ?? [];
    arr.push({ ...v, stock: STORE_LOCKED ? 0 : (availByVariant.get(v.id) ?? 0) });
    variantsByProduct.set(v.product_id, arr);
  }

  // Kod tutmayan kaynaklar (SMM/service, mock, seagm) için stok kavramı yoktur:
  // teslim anında sağlayıcıdan gelir. Bu ürünler her zaman "satışta" sayılır.
  const STOCKLESS_SOURCES = new Set(["smm", "mock", "seagm"]);
  const isStockless = (p: Product) =>
    p.delivery_type === "service" || STOCKLESS_SOURCES.has(p.supply_source ?? "");

  return products.map((p) => {
    const vs = variantsByProduct.get(p.id) ?? [];
    const prices = vs.map((v) => v.price);
    const minPrice = prices.length ? Math.min(...prices) : p.price;
    // Stoksuz kaynaklar sonsuz stoklu sayılır (Tükendi rozeti çıkmaz).
    // Mağaza kilitliyse hepsi 0 — stoksuz (service/smm) ürünler de "Tükendi".
    const stock = STORE_LOCKED
      ? 0
      : isStockless(p)
        ? Number.POSITIVE_INFINITY
        : vs.reduce((sum, v) => sum + v.stock, 0);
    const compares = vs
      .map((v) => v.compare_at)
      .filter((c): c is number => c != null);
    const maxCompareAt = compares.length ? Math.max(...compares) : null;
    return {
      ...p,
      variants: vs,
      minPrice,
      stock,
      maxCompareAt,
      soldCount: soldByProduct.get(p.id) ?? 0,
      brandSlug: p.brand_id != null ? (brandSlugById.get(p.brand_id) ?? null) : null,
    };
  });
}

/** İsmi maskele: "Ahmet Talha" → "A*** T***". */
function maskName(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0].toUpperCase() + "***")
      .join(" ") || "K***"
  );
}

/** "X önce" — kabaca göreli zaman. locale çağırandan geçilir (server: getServerLocale). */
function timeAgo(iso: string, locale: Locale = DEFAULT_LOCALE): string {
  const rt = (key: string) =>
    DICTIONARIES[locale][key] ?? DICTIONARIES[DEFAULT_LOCALE][key] ?? key;
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d >= 30)
    return rt("srv.rt.monthAgo").replace("{n}", String(Math.floor(d / 30)));
  if (d >= 1) return rt("srv.rt.dayAgo").replace("{n}", String(d));
  const h = Math.floor(diff / 3600000);
  if (h >= 1) return rt("srv.rt.hourAgo").replace("{n}", String(h));
  return rt("srv.rt.justNow");
}

export interface RecentReviewRow {
  id: string;
  maskedName: string;
  productName: string;
  rating: number;
  comment: string | null;
  ago: string;
}

/**
 * Sahte yorum havuzu — gerçek yorum azken şeridi doldurur.
 * Gerçek yorum geldikçe getRecentReviews onları öne koyar, fake'ler tamamlar.
 *
 * comment artık locale'e göre çevrilir (commentKey → DICTIONARIES, `rev.fake.*`);
 * göreli zaman da sabit TR string yerine `agoHours` (X saat önce) üzerinden
 * gerçek created_at + timeAgo(locale) ile üretilir.
 */
const FAKE_REVIEWS: {
  maskedName: string;
  productName: string;
  rating: number;
  commentKey: string;
  agoHours: number;
}[] = [
  { maskedName: "A*** Y***", productName: "Valorant VP", rating: 5, commentKey: "rev.fake.0", agoHours: 22 },
  { maskedName: "M*** K***", productName: "PUBG Mobile UC", rating: 5, commentKey: "rev.fake.1", agoHours: 28 },
  { maskedName: "E*** D***", productName: "Steam Cüzdan Kodu", rating: 5, commentKey: "rev.fake.2", agoHours: 34 },
  { maskedName: "S*** Ş***", productName: "Netflix Hediye Kartı", rating: 5, commentKey: "rev.fake.3", agoHours: 50 },
  { maskedName: "B*** A***", productName: "Free Fire Elmas", rating: 4, commentKey: "rev.fake.4", agoHours: 56 },
  { maskedName: "C*** R***", productName: "League of Legends RP", rating: 5, commentKey: "rev.fake.5", agoHours: 74 },
  { maskedName: "H*** T***", productName: "Spotify Premium", rating: 5, commentKey: "rev.fake.6", agoHours: 80 },
  { maskedName: "O*** G***", productName: "Mobile Legends Elmas", rating: 5, commentKey: "rev.fake.7", agoHours: 98 },
  { maskedName: "F*** Ö***", productName: "Discord Nitro", rating: 5, commentKey: "rev.fake.8", agoHours: 104 },
  { maskedName: "İ*** Ç***", productName: "Genshin Impact", rating: 4, commentKey: "rev.fake.9", agoHours: 122 },
  { maskedName: "K*** U***", productName: "Brawl Stars Elmas", rating: 5, commentKey: "rev.fake.10", agoHours: 128 },
  { maskedName: "Z*** B***", productName: "Google Play Kodu", rating: 5, commentKey: "rev.fake.11", agoHours: 146 },
];

function fakeReviewRows(locale: Locale): RecentReviewRow[] {
  const dict = DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
  return FAKE_REVIEWS.map((r, i) => {
    const iso = new Date(Date.now() - r.agoHours * 3600000).toISOString();
    return {
      id: `fake-${i}`,
      maskedName: r.maskedName,
      productName: r.productName,
      rating: r.rating,
      comment:
        dict[r.commentKey] ?? DICTIONARIES[DEFAULT_LOCALE][r.commentKey] ?? null,
      ago: timeAgo(iso, locale),
    };
  });
}

/**
 * Ana sayfa "En Yeni Sipariş Yorumları" şeridi.
 * Gerçek yorumlar önce gelir; eksik kalan sayı sahte yorumlarla tamamlanır
 * (gerçek yorum eklendikçe otomatik öne düşer).
 */
export async function getRecentReviews(
  limit = 12,
  locale: Locale = DEFAULT_LOCALE,
): Promise<RecentReviewRow[]> {
  const real = await getRealReviews(limit, locale);
  if (real.length >= limit) return real;
  // Eksik kalanları fake'lerle tamamla (gerçeklerde geçen ürünleri tekrarlama)
  const fakes = fakeReviewRows(locale).filter(
    (f) => !real.some((r) => r.productName === f.productName),
  );
  return [...real, ...fakes].slice(0, limit);
}

/** Sadece DB'deki gerçek yorumlar. */
async function getRealReviews(
  limit: number,
  locale: Locale,
): Promise<RecentReviewRow[]> {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("reviews")
    .select("id, rating, body, created_at, products(name), profiles(nickname)")
    .order("created_at", { ascending: false })
    .limit(limit);

  type Row = {
    id: string;
    rating: number;
    body: string | null;
    created_at: string;
    products: { name: string } | null;
    profiles: { nickname: string | null } | null;
  };

  return ((data as Row[] | null) ?? []).map((r) => ({
    id: r.id,
    maskedName: maskName(r.profiles?.nickname ?? "Kullanıcı"),
    productName: r.products?.name ?? "Ürün",
    rating: r.rating,
    comment: r.body,
    ago: timeAgo(r.created_at, locale),
  }));
}
