// Örnek kategori + ürün seed'i.
// Çalıştır: npm run seed
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

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
  { slug: "dijital-hizmet", name: "Dijital Hizmet", description: "Lisans anahtarları ve dijital hizmetler", tone: "success", position: 40 },
] as const;

const PRODUCTS = [
  // oyun-epin
  { cat: "oyun-epin", slug: "pubg-mobile-660-uc", name: "PUBG Mobile 660 UC", description: "660 Unknown Cash — anlık teslim.", price: 249.9, tone: "brand", position: 10 },
  { cat: "oyun-epin", slug: "pubg-mobile-1800-uc", name: "PUBG Mobile 1800 UC", description: "1800 Unknown Cash — anlık teslim.", price: 649.9, tone: "brand", position: 11 },
  { cat: "oyun-epin", slug: "valorant-1000-vp", name: "Valorant 1000 VP", description: "1000 Valorant Points — TR sunucu.", price: 299.9, tone: "danger", position: 20 },
  { cat: "oyun-epin", slug: "lol-1380-rp", name: "League of Legends 1380 RP", description: "1380 Riot Points — TR hesap.", price: 279.9, tone: "info", position: 30 },
  { cat: "oyun-epin", slug: "free-fire-530-elmas", name: "Free Fire 530 Elmas", description: "530 elmas — anlık teslim.", price: 159.9, tone: "warning", position: 40 },
  // platform-bakiye
  { cat: "platform-bakiye", slug: "steam-100-tl", name: "Steam 100 TL Cüzdan Kodu", description: "Steam cüzdanına 100 TL.", price: 109.9, tone: "info", position: 10 },
  { cat: "platform-bakiye", slug: "google-play-50-tl", name: "Google Play 50 TL", description: "Google Play bakiye kodu.", price: 54.9, tone: "success", position: 20 },
  { cat: "platform-bakiye", slug: "psn-100-tl", name: "PlayStation 100 TL", description: "PSN cüzdan kodu (TR).", price: 109.9, tone: "brand", position: 30 },
  // abonelik
  { cat: "abonelik", slug: "discord-nitro-1-ay", name: "Discord Nitro 1 Ay", description: "1 aylık Discord Nitro.", price: 129.9, tone: "accent", position: 10 },
  { cat: "abonelik", slug: "spotify-premium-1-ay", name: "Spotify Premium 1 Ay", description: "1 aylık bireysel Premium.", price: 79.9, tone: "success", position: 20 },
  { cat: "abonelik", slug: "game-pass-ultimate-1-ay", name: "Xbox Game Pass Ultimate 1 Ay", description: "1 aylık Ultimate üyelik.", price: 199.9, tone: "brand", position: 30 },
  // dijital-hizmet
  { cat: "dijital-hizmet", slug: "windows-11-pro-key", name: "Windows 11 Pro Lisans", description: "Retail dijital lisans anahtarı.", price: 349.9, tone: "info", position: 10 },
] as const;

async function main() {
  // Kategoriler (upsert by slug)
  const { data: cats, error: catErr } = await supabase
    .from("categories")
    .upsert(CATEGORIES.map((c) => ({ ...c })), { onConflict: "slug" })
    .select("id, slug");
  if (catErr) throw catErr;
  console.log(`Kategoriler: ${cats?.length} adet`);

  const slugToId = new Map((cats ?? []).map((c) => [c.slug, c.id]));

  // Ürünler (upsert by slug)
  const rows = PRODUCTS.map((p) => ({
    category_id: slugToId.get(p.cat)!,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: p.price,
    tone: p.tone,
    position: p.position,
    is_active: true,
  }));
  const { data: prods, error: prodErr } = await supabase
    .from("products")
    .upsert(rows, { onConflict: "slug" })
    .select("id, slug");
  if (prodErr) throw prodErr;
  console.log(`Ürünler: ${prods?.length} adet`);

  console.log("Seed tamam.");
}

main().catch((e) => {
  console.error("Seed hatası:", e.message ?? e);
  process.exit(1);
});
