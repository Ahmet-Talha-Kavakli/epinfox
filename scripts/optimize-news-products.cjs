// ~/Desktop/Logolar/news/ içindeki 12 YENİLENEN ürün görselini optimize eder
// (klasör adı 'news' ama içerik 12 ürün). 800x800 webp q82 -> public/products/<slug>.webp
// + DB image_path günceller. (clash/instagram için brand image_path de güncellenir.)
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const SRC = "/Users/aysegulcadircioglu/Desktop/Logolar/news";
const DEST = path.join(__dirname, "..", "public", "products");
const dbUrl = fs
  .readFileSync(path.join(__dirname, "..", ".env.local"), "utf8")
  .match(/^DATABASE_URL=(.+)$/m)[1].trim().replace(/^["']|["']$/g, "");

// kaynak dosya -> ürün slug
const MAP = {
  "hf_20260531_110649_d14b488e-d5de-4f36-a695-7f2912446d74.png": "netflix",
  "hf_20260531_110719_ada8f613-41d9-46e3-80b6-857fc3e72ee2.png": "instagram-takipci",
  "hf_20260531_110729_f01f019d-81f3-4b47-9fb6-c97712ffb564.png": "instagram-izlenme",
  "hf_20260531_110806_371f215a-dc1f-4df8-82cc-32879f9cfdb3.png": "clash-of-clans-gems",
  "hf_20260531_110831_ab7fdc30-8f8b-489c-bedd-ab19b6ec47fa.png": "telegram-uye",
  "hf_20260531_110902_b84acb1b-53ad-4cf5-b8ce-ffa6a3bb80b0.png": "facebook-sayfa-begeni",
  "hf_20260531_110930_c7038a09-9436-4063-8056-d67d87416a00.png": "discord-uye",
  "hf_20260531_111019_ae097de9-6918-45b9-a9bc-6f27e93384a2.png": "spotify-premium",
  "hf_20260531_111040_629ac05e-4a1d-4765-9928-166fd2a62fd7.png": "office-2021-pro",
  "hf_20260531_111104_e9413971-11b9-40c9-88f9-2a7c6be77b4d.png": "steam-wallet",
  "hf_20260531_111224_494dd118-86c4-4b15-8561-257d335f2559.png": "playstation-store",
  "hf_20260531_111316_f0f40d6f-ecce-495e-8590-ac46eecb224b.png": "steam-game-key",
};

// markası bu ürün görseline bakanlar (logo da güncellensin)
const BRAND_SYNC = { "clash-of-clans-gems": "clash-of-clans", "instagram-takipci": "instagram" };

(async () => {
  const c = new Client({ connectionString: dbUrl });
  await c.connect();
  let ok = 0, totalIn = 0, totalOut = 0;
  for (const [file, slug] of Object.entries(MAP)) {
    const src = path.join(SRC, file);
    if (!fs.existsSync(src)) { console.error(`✗ kaynak yok: ${file}`); continue; }
    const inSize = fs.statSync(src).size;
    const buf = await sharp(src)
      .resize(800, 800, { fit: "cover", position: "centre" })
      .webp({ quality: 82 })
      .toBuffer();
    const out = path.join(DEST, `${slug}.webp`);
    fs.writeFileSync(out, buf);
    await c.query("update products set image_path = $1 where slug = $2",
      [`/products/${slug}.webp`, slug]);
    if (BRAND_SYNC[slug]) {
      await c.query("update brands set image_path = $1 where slug = $2",
        [`/products/${slug}.webp`, BRAND_SYNC[slug]]);
    }
    totalIn += inSize; totalOut += buf.length; ok++;
    console.log(`✓ ${slug}  ${(inSize/1e6).toFixed(1)}MB → ${(buf.length/1e3).toFixed(0)}KB`);
  }
  console.log(`\n${ok} ürün. ${(totalIn/1e6).toFixed(0)}MB → ${(totalOut/1e6).toFixed(1)}MB`);
  await c.end();
})().catch((e) => { console.error(e); process.exit(1); });
