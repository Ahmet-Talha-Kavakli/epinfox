// Her aktif varyanta test stok kodu ekler (geliştirme/test için).
// Çalıştır: npx tsx scripts/seed-stock.ts [adet]   (varsayılan 25)
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);
const encKey = process.env.CODE_ENCRYPTION_KEY!;

function randomCode() {
  const seg = () =>
    Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4).padEnd(4, "X");
  return `${seg()}-${seg()}-${seg()}-${seg()}`;
}

async function main() {
  const perVariant = Number(process.argv[2] ?? 25);

  const { data: variants } = await supabase
    .from("product_variants")
    .select("id, label, product_id, products(name)")
    .eq("is_active", true);

  if (!variants?.length) {
    console.log("Aktif varyant yok.");
    return;
  }

  let total = 0;
  for (const v of variants as any[]) {
    // Mevcut available stok varsa atla (tekrar tekrar şişmesin)
    const { count } = await supabase
      .from("product_codes")
      .select("id", { count: "exact", head: true })
      .eq("variant_id", v.id)
      .eq("status", "available");
    if ((count ?? 0) >= perVariant) {
      console.log(`⊙ ${v.products?.name} · ${v.label} (zaten ${count} stok)`);
      continue;
    }

    const need = perVariant - (count ?? 0);
    const codes = Array.from({ length: need }, randomCode);
    const { data, error } = await supabase.rpc("add_product_codes", {
      p_variant_id: v.id,
      p_codes: codes,
      p_enc_key: encKey,
    });
    if (error) {
      console.error(`✗ ${v.products?.name} · ${v.label}:`, error.message);
      continue;
    }
    total += Number(data);
    console.log(`✓ ${v.products?.name} · ${v.label}: +${data} kod`);
  }
  console.log(`\nToplam ${total} test kodu eklendi.`);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
