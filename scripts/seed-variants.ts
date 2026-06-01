// Belirli ürünlere çok denominasyonlu varyant ekler (varyant seçici demosu için).
// Çalıştır: npx tsx scripts/seed-variants.ts
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

// slug -> varyant listesi (label, price, compare_at, bonus_pct)
const VARIANTS: Record<
  string,
  { label: string; price: number; compare_at?: number; bonus_pct?: number; position: number }[]
> = {
  "pubg-mobile-660-uc": [
    { label: "60 UC", price: 44.9, compare_at: 49.9, position: 10 },
    { label: "325 UC", price: 124.9, compare_at: 139.9, bonus_pct: 1, position: 20 },
    { label: "660 UC", price: 249.9, compare_at: 279.9, bonus_pct: 1, position: 30 },
    { label: "1800 UC", price: 649.9, compare_at: 699.9, bonus_pct: 2, position: 40 },
    { label: "3850 UC", price: 1299.9, compare_at: 1399.9, bonus_pct: 3, position: 50 },
  ],
  "valorant-1000-vp": [
    { label: "475 VP", price: 159.9, position: 10 },
    { label: "1000 VP", price: 299.9, compare_at: 329.9, bonus_pct: 1, position: 20 },
    { label: "2050 VP", price: 599.9, compare_at: 649.9, bonus_pct: 2, position: 30 },
    { label: "3650 VP", price: 999.9, compare_at: 1099.9, bonus_pct: 2, position: 40 },
  ],
  "free-fire-530-elmas": [
    { label: "115 Elmas", price: 39.9, position: 10 },
    { label: "240 Elmas", price: 79.9, position: 20 },
    { label: "530 Elmas", price: 159.9, compare_at: 174.9, bonus_pct: 1, position: 30 },
    { label: "1080 Elmas", price: 309.9, compare_at: 339.9, bonus_pct: 2, position: 40 },
  ],
  "discord-nitro-1-ay": [
    { label: "1 Aylık", price: 129.9, position: 10 },
    { label: "3 Aylık", price: 349.9, compare_at: 389.9, bonus_pct: 1, position: 20 },
    { label: "12 Aylık", price: 1199.9, compare_at: 1499.9, bonus_pct: 3, position: 30 },
  ],
  "steam-100-tl": [
    { label: "50 TL", price: 54.9, position: 10 },
    { label: "100 TL", price: 109.9, position: 20 },
    { label: "250 TL", price: 269.9, compare_at: 279.9, position: 30 },
    { label: "500 TL", price: 529.9, compare_at: 549.9, bonus_pct: 1, position: 40 },
  ],
};

async function main() {
  for (const [slug, variants] of Object.entries(VARIANTS)) {
    const { data: product } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!product) {
      console.warn(`Ürün yok, atlandı: ${slug}`);
      continue;
    }

    // Bu ürünün otomatik oluşturulan "Standart" varyantını ve mevcut çok-varyantları temizle
    // (kodlar henüz yok; FK cascade ile temizlenir)
    await supabase.from("product_variants").delete().eq("product_id", product.id);

    const rows = variants.map((v) => ({
      product_id: product.id,
      label: v.label,
      price: v.price,
      compare_at: v.compare_at ?? null,
      bonus_pct: v.bonus_pct ?? 0,
      position: v.position,
      is_active: true,
    }));
    const { error } = await supabase.from("product_variants").insert(rows);
    if (error) {
      console.error(`${slug}:`, error.message);
      continue;
    }
    // products.price'ı en düşük varyanta eşitle (kart "X TL'den başlayan")
    const minPrice = Math.min(...variants.map((v) => v.price));
    await supabase.from("products").update({ price: minPrice }).eq("id", product.id);
    console.log(`${slug}: ${variants.length} varyant`);
  }
  console.log("Varyant seed tamam.");
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
