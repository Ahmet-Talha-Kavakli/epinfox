// Her ürün için SimpleIcons'tan resmi marka logosunu (beyaz) çekip, markanın
// renginde kart zeminli bir kompozit SVG üretir → public/products/<slug>.svg
// SimpleIcons MIT lisanslı; logolar ilgili markaların ticari markasıdır (tanıtım amaçlı).
// Çalıştır: npx tsx scripts/fetch-logos.ts
import { config } from "dotenv";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { CATALOG } from "./catalog";

config({ path: ".env.local" });
const OUT = resolve(process.cwd(), "public", "products");

// SimpleIcons CDN — beyaz logo path'i (sadece <path d=...> kısmını çıkaracağız)
async function fetchIconPath(slug: string): Promise<string | null> {
  try {
    const res = await fetch(`https://cdn.simpleicons.org/${slug}/white`);
    if (!res.ok) return null;
    const svg = await res.text();
    // viewBox ve path'i al
    const path = svg.match(/<path[^>]*d="([^"]+)"/)?.[1];
    return path ?? null;
  } catch {
    return null;
  }
}

// Kompozit kart SVG'si: brand renkli yuvarlak köşeli zemin + ortada beyaz logo (24x24 viewBox)
function composeCard(brand: string, iconPath: string | null): string {
  const logo = iconPath
    ? `<g transform="translate(76,76) scale(7.83)"><path d="${iconPath}" fill="#ffffff"/></g>`
    : `<g transform="translate(150,150)"><circle r="44" fill="#ffffff" opacity="0.9"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${brand}"/>
      <stop offset="100%" stop-color="${shade(brand, -28)}"/>
    </linearGradient>
    <radialGradient id="glow" cx="30%" cy="25%" r="70%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="300" height="300" rx="28" fill="url(#bg)"/>
  <rect width="300" height="300" rx="28" fill="url(#glow)"/>
  ${logo}
</svg>`;
}

// Hex rengi koyulaştır/aydınlat
function shade(hex: string, amt: number): string {
  const h = hex.replace("#", "");
  const num = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  let r = (num >> 16) + amt;
  let g = ((num >> 8) & 0xff) + amt;
  let b = (num & 0xff) + amt;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  let ok = 0;
  let fallback = 0;
  for (const p of CATALOG) {
    let iconPath: string | null = null;
    if (p.icon) {
      iconPath = await fetchIconPath(p.icon);
      if (!iconPath) {
        console.warn(`⚠ ${p.slug}: logo bulunamadı (${p.icon}), fallback`);
        fallback++;
      }
    } else {
      fallback++;
    }
    const svg = composeCard(p.brand, iconPath);
    await writeFile(resolve(OUT, `${p.slug}.svg`), svg, "utf8");
    if (iconPath) ok++;
    console.log(`✓ ${p.slug}${iconPath ? "" : " (logo yok, renkli kart)"}`);
  }
  console.log(`\n${ok} logo + ${fallback} renkli-kart yazıldı.`);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
