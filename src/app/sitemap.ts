import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/server";
import { SITE } from "@/config/site";

// Veriye (Supabase) baktığı için dinamik — build anında değil, istekte üretilir.
export const dynamic = "force-dynamic";

/**
 * Arama motorları için site haritası.
 * Statik halka açık sayfalar + dinamik ürün / kategori / marka / yayıncı URL'leri.
 * Hesap, admin, sepet, ödeme gibi özel/dinamik sayfalar DAHİL EDİLMEZ.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();

  // Halka açık statik sayfalar — öncelik/sıklık elle ayarlı.
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/store`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/raffles`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/earn`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/referral`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/reseller`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/publisher`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/news`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/help`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/support-us`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/distance-sales`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/refund`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  // Dinamik içerik — slug'ları tek seferde çek (hafif select).
  let dynamicEntries: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createAdminClient();
    const [products, categories, brands, publishers] = await Promise.all([
      supabase
        .from("products")
        .select("slug, updated_at")
        .eq("is_active", true),
      supabase.from("categories").select("slug"),
      supabase.from("brands").select("slug").eq("is_active", true),
      supabase.from("publishers").select("slug").eq("status", "approved"),
    ]);

    const fromRows = (
      rows: { slug: string | null; updated_at?: string | null }[] | null,
      toUrl: (slug: string) => string,
      priority: number,
      changeFrequency: "daily" | "weekly" | "monthly",
    ): MetadataRoute.Sitemap =>
      (rows ?? [])
        .filter((r) => r.slug)
        .map((r) => ({
          url: toUrl(r.slug!),
          lastModified: r.updated_at ? new Date(r.updated_at) : now,
          changeFrequency,
          priority,
        }));

    dynamicEntries = [
      ...fromRows(products.data, (s) => `${base}/product/${s}`, 0.8, "daily"),
      // Kategoriler mağaza filtresi (query param) ile gösteriliyor.
      ...fromRows(
        categories.data,
        (s) => `${base}/store?category=${s}`,
        0.6,
        "weekly",
      ),
      ...fromRows(brands.data, (s) => `${base}/brand/${s}`, 0.6, "weekly"),
      ...fromRows(
        publishers.data,
        (s) => `${base}/publisher/${s}`,
        0.5,
        "monthly",
      ),
    ];
  } catch {
    // Veritabanı erişilemezse en azından statik harita dönsün.
    dynamicEntries = [];
  }

  return [...staticEntries, ...dynamicEntries];
}
