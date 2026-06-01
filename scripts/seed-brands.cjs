// Markaları oluşturur, mevcut ürünleri markalara bağlar ve seçili popüler
// oyunlara ek ürün çeşitleri ekler (marka sayfasının dolu olması için).
// Idempotent: tekrar çalıştırılabilir (slug/onconflict ile).
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
const dbUrl = fs
  .readFileSync(path.join(__dirname, "..", ".env.local"), "utf8")
  .match(/^DATABASE_URL=(.+)$/m)[1]
  .trim()
  .replace(/^["']|["']$/g, "");

// Marka tanımları: slug, ad, açıklama + hangi ürünlerin bu markaya ait olduğu
// (productSlugs). İlk ürünün görseli/tone'u markaya miras kalır.
const BRANDS = [
  { slug: "pubg-mobile", name: "PUBG Mobile", desc: "PUBG Mobile için UC ve popülerlik ürünleri.", products: ["pubg-mobile-uc"] },
  { slug: "valorant", name: "Valorant", desc: "Valorant VP ve oyun içi ürünler.", products: ["valorant-vp"] },
  { slug: "league-of-legends", name: "League of Legends", desc: "LoL RP ve oyun içi içerik.", products: ["lol-rp"] },
  { slug: "free-fire", name: "Free Fire", desc: "Free Fire elmas ve üyelikler.", products: ["free-fire-diamond"] },
  { slug: "mobile-legends", name: "Mobile Legends", desc: "MLBB elmas ve pas ürünleri.", products: ["mobile-legends-diamond"] },
  { slug: "brawl-stars", name: "Brawl Stars", desc: "Brawl Stars gems ve pas ürünleri.", products: ["brawl-stars-gems"] },
  { slug: "clash-of-clans", name: "Clash of Clans", desc: "CoC elmas ve altın geçiş.", products: ["clash-of-clans-gems"] },
  { slug: "genshin-impact", name: "Genshin Impact", desc: "Genshin crystals ve Welkin.", products: ["genshin-genesis-crystals"] },
  { slug: "roblox", name: "Roblox", desc: "Robux paketleri.", products: ["roblox-robux"] },
  { slug: "steam", name: "Steam", desc: "Steam cüzdan kodları ve oyun keyleri.", products: ["steam-wallet", "steam-game-key"] },
];

// Eklenecek ek ürün çeşitleri: bir oyuna ikinci/üçüncü ürün.
// referenceSlug: görsel/tone/category miras alınacak mevcut ürün.
const EXTRA_PRODUCTS = [
  { slug: "brawl-stars-brawl-pass", name: "Brawl Stars Brawl Pass", desc: "Sezonluk Brawl Pass; ödüller ve özel kostümler.", brand: "brawl-stars", ref: "brawl-stars-gems",
    variants: [{ label: "Brawl Pass", price: 169 }, { label: "Brawl Pass Plus", price: 299 }] },
  { slug: "brawl-stars-pro-pass", name: "Brawl Stars Pro Pass", desc: "En üst seviye sezon geçişi.", brand: "brawl-stars", ref: "brawl-stars-gems",
    variants: [{ label: "Pro Pass", price: 449 }] },
  { slug: "pubg-mobile-popularity", name: "PUBG Mobile Popülerlik", desc: "PUBG Mobile popülerlik puanı.", brand: "pubg-mobile", ref: "pubg-mobile-uc",
    variants: [{ label: "3.000 Popülerlik", price: 49.99 }, { label: "10.000 Popülerlik", price: 149.99 }] },
  { slug: "valorant-battle-pass", name: "Valorant Battle Pass", desc: "Sezonluk savaş bileti.", brand: "valorant", ref: "valorant-vp",
    variants: [{ label: "Battle Pass", price: 109.99 }] },
  { slug: "genshin-welkin-moon", name: "Genshin Welkin Moon", desc: "Aylık Welkin Moon avantajı.", brand: "genshin-impact", ref: "genshin-genesis-crystals",
    variants: [{ label: "Blessing of the Welkin Moon", price: 89.99 }] },
];

(async () => {
  const c = new Client({ connectionString: dbUrl });
  await c.connect();
  await c.query("begin");

  // 1) Markaları oluştur (ilk ürünün tone/image/category'sini miras al)
  let pos = 10;
  for (const b of BRANDS) {
    const ref = await c.query(
      "select tone, image_path, category_id from products where slug = $1",
      [b.products[0]],
    );
    const meta = ref.rows[0] ?? { tone: "brand", image_path: null, category_id: null };
    await c.query(
      `insert into brands (slug, name, description, tone, image_path, category_id, position)
       values ($1,$2,$3,$4,$5,$6,$7)
       on conflict (slug) do update set name=excluded.name, description=excluded.description,
         tone=excluded.tone, image_path=excluded.image_path, category_id=excluded.category_id`,
      [b.slug, b.name, b.desc, meta.tone, meta.image_path, meta.category_id, pos],
    );
    pos += 10;
    // Ürünleri bu markaya bağla
    const { rows: brow } = await c.query("select id from brands where slug=$1", [b.slug]);
    const brandId = brow[0].id;
    for (const ps of b.products) {
      await c.query("update products set brand_id=$1 where slug=$2", [brandId, ps]);
    }
  }

  // 2) Ek ürünleri ekle (referans üründen tone/image/category, kendi varyantları)
  for (const ep of EXTRA_PRODUCTS) {
    const ref = await c.query(
      "select tone, image_path, category_id from products where slug=$1",
      [ep.ref],
    );
    if (!ref.rows.length) { console.log("ref yok:", ep.ref); continue; }
    const { tone, image_path, category_id } = ref.rows[0];
    const { rows: brow } = await c.query("select id from brands where slug=$1", [ep.brand]);
    const brandId = brow[0].id;
    const minPrice = Math.min(...ep.variants.map((v) => v.price));
    const ins = await c.query(
      `insert into products (slug, name, description, price, image_path, tone, category_id, brand_id, is_active, position)
       values ($1,$2,$3,$4,$5,$6,$7,$8,true,500)
       on conflict (slug) do update set name=excluded.name, description=excluded.description,
         brand_id=excluded.brand_id, image_path=excluded.image_path, tone=excluded.tone,
         category_id=excluded.category_id, price=excluded.price
       returning id`,
      [ep.slug, ep.name, ep.desc, minPrice, image_path, tone, category_id, brandId],
    );
    const productId = ins.rows[0].id;
    // Varyantları ekle (yoksa)
    let vpos = 10;
    for (const v of ep.variants) {
      await c.query(
        `insert into product_variants (product_id, label, price, position, is_active)
         values ($1,$2,$3,$4,true)
         on conflict do nothing`,
        [productId, v.label, v.price, vpos],
      );
      vpos += 10;
    }
  }

  await c.query("commit");

  const bcount = await c.query("select count(*) c from brands");
  const linked = await c.query("select count(*) c from products where brand_id is not null");
  console.log("Markalar:", bcount.rows[0].c, "| markaya bağlı ürün:", linked.rows[0].c);
  await c.end();
})().catch((e) => { console.error(e.message); process.exit(1); });
