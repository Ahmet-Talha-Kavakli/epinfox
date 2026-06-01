// Katalogdaki ürünleri EKLER/GÜNCELLER — mevcut sipariş, cüzdan ve kod verisini
// SİLMEZ (seed-catalog.ts'in aksine). Idempotent:
//   • Kategori: upsert (slug).
//   • Ürün: upsert (slug) — ad/açıklama/fiyat/tone/image_path/kategori güncellenir.
//   • Varyant: YALNIZCA ürünün hiç varyantı yoksa eklenir (mevcut varyant/order korunur).
// Çalıştır: npx tsx scripts/seed-catalog-additive.ts
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { CATALOG, PLACEHOLDER_SLUGS } from "./catalog";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const CATEGORIES = [
  { slug: "oyun-epin", name: "Oyun E-Pin", description: "PUBG UC, Valorant VP, LoL RP, Free Fire ve daha fazlası", tone: "brand", position: 10 },
  { slug: "platform-bakiye", name: "Platform Bakiyesi", description: "Steam, Google Play, PlayStation, Xbox, iTunes", tone: "info", position: 20 },
  { slug: "abonelik", name: "Abonelikler", description: "Discord Nitro, Spotify, Netflix, Game Pass", tone: "accent", position: 30 },
  { slug: "dijital-hizmet", name: "Dijital Hizmet", description: "Lisans anahtarları, VPN ve dijital hizmetler", tone: "success", position: 40 },
];

function imagePathFor(p: (typeof CATALOG)[number]): string | null {
  if (p.placeholder || PLACEHOLDER_SLUGS.has(p.slug)) return "/products/placeholder.svg";
  if (p.icon) return `/products/${p.slug}.svg`;
  return null;
}

async function main() {
  // 1) Kategoriler (korunur / oluşturulur)
  const { data: cats, error: catErr } = await supabase
    .from("categories")
    .upsert(CATEGORIES, { onConflict: "slug" })
    .select("id, slug");
  if (catErr) throw catErr;
  const catId = new Map((cats ?? []).map((c) => [c.slug, c.id]));
  console.log(`Kategoriler hazır: ${cats?.length}`);

  let added = 0;
  let updated = 0;
  let variantsAdded = 0;

  for (let i = 0; i < CATALOG.length; i++) {
    const p = CATALOG[i];
    const minPrice = Math.min(...p.variants.map((v) => v.price));

    // Ürün var mı?
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", p.slug)
      .maybeSingle();

    const { data: prod, error: pErr } = await supabase
      .from("products")
      .upsert(
        {
          category_id: catId.get(p.category)!,
          slug: p.slug,
          name: p.name,
          description: p.description,
          price: minPrice,
          tone: p.tone,
          image_path: imagePathFor(p),
          position: (i + 1) * 10,
          is_active: true,
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (pErr) {
      console.error(`✗ ${p.slug}:`, pErr.message);
      continue;
    }

    if (existing) {
      updated++;
    } else {
      added++;
    }

    // Varyant: yalnızca hiç yoksa ekle (mevcut order/variant korunur)
    const { count } = await supabase
      .from("product_variants")
      .select("id", { count: "exact", head: true })
      .eq("product_id", prod.id);

    if (!count) {
      const variantRows = p.variants.map((v, vi) => ({
        product_id: prod.id,
        label: v.label,
        price: v.price,
        compare_at: v.compare_at ?? null,
        bonus_pct: v.bonus_pct ?? 0,
        position: (vi + 1) * 10,
        is_active: true,
      }));
      const { error: vErr } = await supabase.from("product_variants").insert(variantRows);
      if (vErr) {
        console.error(`✗ ${p.slug} varyant:`, vErr.message);
        continue;
      }
      variantsAdded += variantRows.length;
      console.log(`+ ${p.name} (${variantRows.length} varyant)`);
    } else {
      console.log(`= ${p.name} (varyant korundu: ${count})`);
    }
  }

  console.log(`\nKatalog: ${added} yeni ürün, ${updated} güncellendi, ${variantsAdded} yeni varyant.`);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
