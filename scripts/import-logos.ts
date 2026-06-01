// ~/Desktop/logolar/E-Pin içindeki gerçek ürün görsellerini public/products/'a
// kopyalar ve DB'de products.image_path'i günceller.
// Çalıştır: npx tsx scripts/import-logos.ts
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { copyFile, mkdir, access } from "node:fs/promises";
import { resolve } from "node:path";
import { homedir } from "node:os";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const SRC = resolve(homedir(), "Desktop", "logolar", "E-Pin");
const DST = resolve(process.cwd(), "public", "products");

// slug -> kaynak dosya adı
const MAP: Record<string, string> = {
  "pubg-mobile-uc": "pubg.jpg",
  "valorant-vp": "valo2.jpg",
  "lol-rp": "lol.png",
  "free-fire-diamond": "freefire.jpg",
  "mobile-legends-diamond": "mobilelegends.jpg",
  "brawl-stars-gems": "brawlstars.webp",
  "clash-of-clans-gems": "clashofclans.png",
  "genshin-genesis-crystals": "genshin.jpg",
  "roblox-robux": "roblox.webp",
  "knight-online-cash": "knightonline.jpg",
  "zula-gold": "zula.jpg",
  "cs2-prime": "cs2.jpg",
  "steam-wallet": "steam.webp",
  "google-play": "googleplay.jpg",
  "playstation-store": "playstation.webp",
  "xbox-microsoft": "xbox.avif",
  "itunes-app-store": "appstore.jpg",
  "razer-gold": "razergold.jpg",
  "amazon-gift-card": "amazongiftcard.jpg",
  "discord-nitro": "discordnitro.png",
  "spotify-premium": "spotify.webp",
  "netflix": "netflix.webp",
  "youtube-premium": "youtubepremium.webp",
  "xbox-game-pass": "xbox.avif",
  "ps-plus": "playstationplus.avif",
  "disney-plus": "disney+.jpeg",
  "windows-11-pro": "windows11.avif",
  "office-2021-pro": "office365.webp",
  "nordvpn": "nordvpn.svg",
  "eset-antivirus": "ESET.png",
  "steam-game-key": "steamgames.webp",
};

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await mkdir(DST, { recursive: true });
  let ok = 0;
  let missing = 0;

  for (const [slug, file] of Object.entries(MAP)) {
    const srcPath = resolve(SRC, file);
    if (!(await exists(srcPath))) {
      console.warn(`⚠ kaynak yok: ${file} (${slug})`);
      missing++;
      continue;
    }
    const ext = file.split(".").pop()!.toLowerCase();
    const destName = `${slug}.${ext}`;
    await copyFile(srcPath, resolve(DST, destName));

    const { error } = await supabase
      .from("products")
      .update({ image_path: `/products/${destName}` })
      .eq("slug", slug);
    if (error) {
      console.error(`✗ DB (${slug}):`, error.message);
      continue;
    }
    ok++;
    console.log(`✓ ${slug} → /products/${destName}`);
  }

  console.log(`\n${ok} görsel kopyalandı + DB güncellendi. ${missing} eksik.`);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
