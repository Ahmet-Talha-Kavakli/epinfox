// Yeni eklenen ham AI görsellerini (10-34 MB PNG) web için optimize eder:
// 800x800 içine sığdır (kare, contain değil cover-merkez), webp q82.
// Çıktı: public/products/<slug>.webp  + orijinal büyük dosyayı siler.
// Sonra DB image_path'lerini .webp'ye çeken SQL'i konsola basar.
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "..", "public", "products");

// slug -> mevcut kaynak uzantı (kopyalanan ham dosya)
const ITEMS = {
  "pubg-mobile-uc": "png", "lol-rp": "png", "free-fire-diamond": "png",
  "mobile-legends-diamond": "png", "genshin-genesis-crystals": "png",
  "genshin-welkin-moon": "png", "honkai-star-rail-oneiric": "png",
  "cod-mobile-cp": "png", "apex-legends-coins": "png", "fortnite-vbucks": "png",
  "ea-fc-mobile-points": "png", "wuthering-waves-lunite": "png", "metin2-ep": "png",
  "clash-royale-gems": "png", "cs2-prime": "jpg", "roblox-robux": "webp",
  "valorant-vp": "jpg", "zepeto-zem": "png", "brawl-stars-brawl-pass": "webp",
  "brawl-stars-pro-pass": "webp",
  "knight-online-cash": "png", "knight-online-premium": "png",
  "brawlhalla-mammoth-coins": "png", "marvel-rivals-lattice": "png",
  "world-of-warcraft-game-time": "png", "playstation-store": "png",
  "xbox-microsoft": "png", "amazon-gift-card": "png", "netflix-gift-card": "png",
  "google-play": "png", "itunes-app-store": "png", "nintendo-eshop": "png",
  "spotify-gift-card": "png", "playstation-plus-card": "png", "razer-gold-tr": "png",
  "steam-wallet-usd": "png", "netflix": "png", "discord-nitro": "png",
  "paysafecard": "png",
  "spotify-premium": "png", "youtube-premium": "png", "ps-plus": "png",
  "hbo-max": "png", "amazon-prime-video": "png", "crunchyroll": "png",
  "apple-music": "png", "apple-tv-plus": "png", "tinder-gold": "png",
  "twitch-turbo": "png", "duolingo-super": "png", "chatgpt-plus": "png",
  "canva-pro": "png", "disney-plus": "png", "instagram-begeni": "png",
  "instagram-otomatik-begeni": "png", "instagram-reels-izlenme": "png",
  "instagram-yorum": "png", "xbox-game-pass": "png",
  "tiktok-takipci": "png", "tiktok-izlenme": "png", "youtube-izlenme": "png",
  "youtube-abone": "png", "twitter-takipci": "png", "twitter-begeni": "png",
  "twitter-retweet": "png", "telegram-uye": "png", "facebook-takipci": "png",
  "facebook-sayfa-begeni": "png", "twitch-takipci": "png", "twitch-izleyici": "png",
  "discord-uye": "png", "spotify-dinlenme": "png", "spotify-aylik-dinleyici": "png",
  "kick-takipci": "png", "snapchat-takipci": "png", "windows-11-pro": "png",
  "windows-10-pro": "png", "office-2021-pro": "png",
  "office-365": "png", "mcafee-total": "png", "kaspersky": "png",
  "bitdefender": "png", "malwarebytes": "png", "adobe-creative-cloud": "png",
  "ea-play": "png", "ubisoft-plus": "png", "nordvpn": "png",
  "game-pass-pc": "png", "eset-antivirus": "png",
};

(async () => {
  let ok = 0, totalIn = 0, totalOut = 0;
  const sqls = [];
  for (const [slug, ext] of Object.entries(ITEMS)) {
    const srcPath = path.join(DIR, `${slug}.${ext}`);
    const outPath = path.join(DIR, `${slug}.webp`);
    if (!fs.existsSync(srcPath)) {
      console.error(`✗ kaynak yok: ${slug}.${ext}`);
      continue;
    }
    const inSize = fs.statSync(srcPath).size;
    // Karenin içine sığdır: 800x800, cover + merkez (kareye kırp), webp q82.
    const buf = await sharp(srcPath)
      .resize(800, 800, { fit: "cover", position: "centre" })
      .webp({ quality: 82 })
      .toBuffer();
    // src .webp ise üstüne yazmadan önce sil (aynı path olabilir)
    if (ext !== "webp" && fs.existsSync(srcPath)) fs.unlinkSync(srcPath);
    fs.writeFileSync(outPath, buf);
    const outSize = buf.length;
    totalIn += inSize; totalOut += outSize; ok++;
    sqls.push(`update products set image_path = '/products/${slug}.webp' where slug = '${slug}';`);
    console.log(`✓ ${slug}  ${(inSize/1e6).toFixed(1)}MB → ${(outSize/1e3).toFixed(0)}KB`);
  }
  console.log(`\n${ok} görsel. Toplam ${(totalIn/1e6).toFixed(0)}MB → ${(totalOut/1e6).toFixed(1)}MB`);
  fs.writeFileSync(
    path.join(__dirname, "..", "supabase", "migrations", "20260531130000_webp_product_images.sql"),
    "-- Optimize edilmiş webp görsellere geç (800x800, q82).\n" + sqls.join("\n") + "\n",
  );
  console.log("SQL yazıldı: supabase/migrations/20260531130000_webp_product_images.sql");
})().catch((e) => { console.error(e); process.exit(1); });
