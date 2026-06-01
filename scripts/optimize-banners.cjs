// ~/Desktop/Logolar/banners/*.png ham banner'larını (13-28 MB) web için optimize eder:
// 1600px genişlik (16:9 -> 1600x900), webp q82. Çıktı: public/brands/<slug>-banner.webp
// Sonra DB brands.banner_path günceller (inline pg).
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const SRC = "/Users/aysegulcadircioglu/Desktop/Logolar/banners";
const DEST = path.join(__dirname, "..", "public", "brands");
const dbUrl = fs
  .readFileSync(path.join(__dirname, "..", ".env.local"), "utf8")
  .match(/^DATABASE_URL=(.+)$/m)[1].trim().replace(/^["']|["']$/g, "");

// kaynak dosya adı -> marka slug
const MAP = {
  "brawlstars.png": "brawl-stars",
  "freefire.png": "free-fire",
  "genshin.png": "genshin-impact",
  "inst.png": "instagram",
  "lol.png": "league-of-legends",
  "mlbb.png": "mobile-legends",
  "pubg.png": "pubg-mobile",
  "roblox.png": "roblox",
  "steam.png": "steam",
  "telegram.png": "telegram",
  "tiktok.png": "tiktok",
  "valorant.png": "valorant",
  "x.png": "twitter",
  "youtube.png": "youtube",
};

(async () => {
  if (!fs.existsSync(DEST)) fs.mkdirSync(DEST, { recursive: true });
  const c = new Client({ connectionString: dbUrl });
  await c.connect();
  let ok = 0, totalIn = 0, totalOut = 0;
  for (const [file, slug] of Object.entries(MAP)) {
    const src = path.join(SRC, file);
    if (!fs.existsSync(src)) { console.error(`✗ kaynak yok: ${file}`); continue; }
    const inSize = fs.statSync(src).size;
    const buf = await sharp(src)
      .resize(1600, 900, { fit: "cover", position: "centre" })
      .webp({ quality: 82 })
      .toBuffer();
    const out = path.join(DEST, `${slug}-banner.webp`);
    fs.writeFileSync(out, buf);
    await c.query("update brands set banner_path = $1 where slug = $2",
      [`/brands/${slug}-banner.webp`, slug]);
    totalIn += inSize; totalOut += buf.length; ok++;
    console.log(`✓ ${slug}  ${(inSize/1e6).toFixed(1)}MB → ${(buf.length/1e3).toFixed(0)}KB`);
  }
  console.log(`\n${ok} banner. ${(totalIn/1e6).toFixed(0)}MB → ${(totalOut/1e6).toFixed(1)}MB`);
  await c.end();
})().catch((e) => { console.error(e); process.exit(1); });
