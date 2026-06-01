// KodKasa — SMM platformlarını MARKA olarak kurar ve mevcut SMM ürünlerini bağlar.
// Yapı (Brawl Stars gibi):  Marka: Instagram → ürünler: Takipçi/Beğeni/İzlenme → varyantlar.
// Idempotent: slug/onconflict ile tekrar çalıştırılabilir.
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
const dbUrl = fs
  .readFileSync(path.join(__dirname, "..", ".env.local"), "utf8")
  .match(/^DATABASE_URL=(.+)$/m)[1]
  .trim()
  .replace(/^["']|["']$/g, "");

// Marka: slug, ad, açıklama, ton, görsel (varsa public/logos altı), bağlı ürün slug'ları.
// image_path null bırakılırsa marka kartı ada/tona göre render olur; logo gelince güncellenir.
const BRANDS = [
  {
    slug: "instagram", name: "Instagram", tone: "brand",
    desc: "Instagram takipçi, beğeni ve izlenme hizmetleri. Hızlı ve güvenli teslim.",
    image: "/logos/instagram.png",
    products: ["instagram-takipci", "instagram-begeni", "instagram-izlenme"],
  },
  {
    slug: "tiktok", name: "TikTok", tone: "neutral",
    desc: "TikTok takipçi, izlenme ve beğeni hizmetleri. Videolarını öne çıkar.",
    image: "/logos/tiktok.png",
    products: ["tiktok-takipci", "tiktok-izlenme", "tiktok-begeni"],
  },
  {
    slug: "youtube", name: "YouTube", tone: "danger",
    desc: "YouTube izlenme ve abone hizmetleri. Kanalını büyüt.",
    image: "/logos/youtube.png",
    products: ["youtube-izlenme", "youtube-abone"],
  },
  {
    slug: "twitter", name: "Twitter / X", tone: "info",
    desc: "X (Twitter) takipçi hizmetleri. Profilini güçlendir.",
    image: "/logos/twitter.png",
    products: ["twitter-takipci"],
  },
  {
    slug: "telegram", name: "Telegram", tone: "info",
    desc: "Telegram kanal/grup üye hizmetleri. Topluluğunu büyüt.",
    image: "/logos/telegram.png",
    products: ["telegram-uye"],
  },
];

(async () => {
  const c = new Client({ connectionString: dbUrl });
  await c.connect();
  await c.query("begin");

  const { rows: catRows } = await c.query(
    "select id from categories where slug = 'sosyal-medya'",
  );
  if (!catRows.length) throw new Error("'sosyal-medya' kategorisi yok.");
  const categoryId = catRows[0].id;

  // Logo dosyası gerçekten var mı? Yoksa image_path'i null bırak (kart yine render olur).
  const logosDir = path.join(__dirname, "..", "public");

  let pos = 100; // mevcut oyun markalarının altında
  for (const b of BRANDS) {
    const hasLogo = b.image && fs.existsSync(path.join(logosDir, b.image.replace(/^\//, "")));
    const imagePath = hasLogo ? b.image : null;

    await c.query(
      `insert into brands (slug, name, description, tone, image_path, category_id, position, is_active)
       values ($1,$2,$3,$4,$5,$6,$7,true)
       on conflict (slug) do update set
         name=excluded.name, description=excluded.description, tone=excluded.tone,
         image_path=coalesce(excluded.image_path, brands.image_path),
         category_id=excluded.category_id`,
      [b.slug, b.name, b.desc, b.tone, imagePath, categoryId, pos],
    );
    pos += 10;

    const { rows: brow } = await c.query("select id from brands where slug=$1", [b.slug]);
    const brandId = brow[0].id;

    // Ürünleri bu markaya bağla + markanın görselini ürünlere de miras ver (boşsa).
    for (const ps of b.products) {
      await c.query(
        `update products
           set brand_id = $1,
               image_path = coalesce(image_path, $2)
         where slug = $3`,
        [brandId, imagePath, ps],
      );
    }
    console.log(b.name + (hasLogo ? " (logo ✓)" : " (logo yok, sonra)") + " → " + b.products.length + " ürün");
  }

  await c.query("commit");
  const { rows: linked } = await c.query(
    `select count(*) c from products where supply_source='smm' and brand_id is not null`,
  );
  console.log("\nMarkaya bağlı SMM ürünü:", linked[0].c);
  await c.end();
})().catch((e) => { console.error("HATA:", e.message); process.exit(1); });
