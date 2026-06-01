// Tüm kataloğu (33 ürün + varyantlar) sıfırdan kurar. ESKİ ürün/varyant/kod/sipariş
// verisini TEMİZLER (test verisi). Kategoriler korunur/oluşturulur.
// Çalıştır: npx tsx scripts/seed-catalog.ts
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

async function main() {
  // 1) Temizlik (FK sırası)
  console.log("Eski veri temizleniyor...");
  await supabase.from("wallet_transactions").delete().not("id", "is", null);
  await supabase.from("product_codes").update({ order_id: null }).not("id", "is", null);
  await supabase.from("orders").delete().not("id", "is", null);
  await supabase.from("product_codes").delete().not("id", "is", null);
  await supabase.from("product_variants").delete().not("id", "is", null);
  await supabase.from("products").delete().not("id", "is", null);

  // 2) Kategoriler
  const { data: cats, error: catErr } = await supabase
    .from("categories")
    .upsert(CATEGORIES, { onConflict: "slug" })
    .select("id, slug");
  if (catErr) throw catErr;
  const catId = new Map((cats ?? []).map((c) => [c.slug, c.id]));
  console.log(`Kategoriler: ${cats?.length}`);

  // 3) Ürünler + varyantlar
  let pCount = 0;
  let vCount = 0;
  for (let i = 0; i < CATALOG.length; i++) {
    const p = CATALOG[i];
    const minPrice = Math.min(...p.variants.map((v) => v.price));
    const { data: prod, error: pErr } = await supabase
      .from("products")
      .insert({
        category_id: catId.get(p.category)!,
        slug: p.slug,
        name: p.name,
        description: p.description,
        price: minPrice,
        tone: p.tone,
        image_path:
          p.placeholder || PLACEHOLDER_SLUGS.has(p.slug)
            ? "/products/placeholder.svg"
            : p.icon
              ? `/products/${p.slug}.svg`
              : null,
        position: (i + 1) * 10,
        is_active: true,
      })
      .select("id")
      .single();
    if (pErr) {
      console.error(`✗ ${p.slug}:`, pErr.message);
      continue;
    }
    pCount++;

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
    vCount += variantRows.length;
    console.log(`✓ ${p.name} (${variantRows.length} varyant)`);
  }

  console.log(`\nToplam: ${pCount} ürün, ${vCount} varyant.`);
  console.log("Şimdi: npx tsx scripts/fetch-logos.ts && npx tsx scripts/seed-stock.ts");
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
