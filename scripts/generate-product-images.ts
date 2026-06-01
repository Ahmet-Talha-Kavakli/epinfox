// Ürünler için fal.ai (flux) ile sembolik/soyut görseller üretir.
// Telif riskine girmemek için GERÇEK marka logosu DEĞİL; her ürünün temasına
// uygun soyut dijital "gift card / kod kartı" görselleri üretilir.
//
// Çalıştır:
//   npx tsx scripts/generate-product-images.ts            (eksikleri üret)
//   npx tsx scripts/generate-product-images.ts --all      (hepsini yeniden üret)
//   npx tsx scripts/generate-product-images.ts <slug>     (tek ürün)
import { config } from "dotenv";
import { fal } from "@fal-ai/client";
import { createClient } from "@supabase/supabase-js";
import { mkdir, writeFile, access } from "node:fs/promises";
import { resolve } from "node:path";

config({ path: ".env.local" });

// fal client FAL_KEY bekler; biz .env.local'de FAL_API_KEY tutuyoruz.
fal.config({ credentials: process.env.FAL_API_KEY! });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const OUT_DIR = resolve(process.cwd(), "public", "products");

// Ortak stil: dark, neon, premium gift-card hissi; metin/marka YOK.
const STYLE =
  "premium digital gift card concept art, glossy 3D card floating on a dark background, " +
  "neon glow, soft studio lighting, depth of field, high detail, modern fintech aesthetic, " +
  "no text, no words, no logos, no brand names, centered composition, square";

// slug -> temaya uygun sembolik prompt (marka adı YOK)
const PROMPTS: Record<string, string> = {
  "pubg-mobile-660-uc":
    "a battle-royale themed neon orange and gold game currency card with abstract coin symbols, parachute motifs, " +
    STYLE,
  "valorant-1000-vp":
    "a tactical shooter themed red and magenta game points card with sharp geometric energy shards, " +
    STYLE,
  "lol-1380-rp":
    "a fantasy MOBA themed blue and teal game points card with magical runes and glowing crystals, " +
    STYLE,
  "free-fire-530-elmas":
    "a vibrant orange and amber game diamond card with glowing gem crystals, " + STYLE,
  "steam-100-tl":
    "a sleek dark steel and blue digital wallet card with abstract gaming controller silhouette, " +
    STYLE,
  "google-play-50-tl":
    "a clean green and white digital store wallet card with abstract play triangle motif, " +
    STYLE,
  "psn-100-tl":
    "a deep blue and indigo console wallet card with abstract geometric shapes, " + STYLE,
  "discord-nitro-1-ay":
    "a purple and violet premium subscription card with abstract chat bubble and rocket motifs, " +
    STYLE,
  "spotify-premium-1-ay":
    "a green and black music subscription card with abstract sound wave motifs, " + STYLE,
  "game-pass-ultimate-1-ay":
    "a green and emerald gaming subscription card with abstract infinity and controller motifs, " +
    STYLE,
  "windows-11-pro-key":
    "a cyan and sky-blue software license card with abstract window pane motif, glossy, " +
    STYLE,
};

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function generate(slug: string, prompt: string, force: boolean) {
  const out = resolve(OUT_DIR, `${slug}.jpg`);
  if (!force && (await exists(out))) {
    console.log(`⊙ ${slug} (atlandı — zaten var)`);
    await updateDb(slug);
    return;
  }
  console.log(`→ ${slug} üretiliyor...`);
  const t0 = Date.now();
  const result = await fal.subscribe("fal-ai/flux/dev", {
    input: {
      prompt,
      image_size: "square_hd",
      num_images: 1,
      output_format: "jpeg",
      num_inference_steps: 28,
    },
    logs: false,
  });
  const url = (result.data as { images?: { url: string }[] })?.images?.[0]?.url;
  if (!url) {
    console.error(`✗ ${slug} — görsel dönmedi`);
    return;
  }
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  await writeFile(out, buf);
  console.log(
    `✓ ${slug} (${Math.round((Date.now() - t0) / 1000)}s, ${Math.round(buf.length / 1024)}KB)`,
  );
  await updateDb(slug);
}

async function updateDb(slug: string) {
  const { error } = await supabase
    .from("products")
    .update({ image_path: `/products/${slug}.jpg` })
    .eq("slug", slug);
  if (error) console.error(`  DB güncelleme hatası (${slug}):`, error.message);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const args = process.argv.slice(2);
  const force = args.includes("--all");
  const single = args.find((a) => !a.startsWith("--"));

  const entries = single
    ? Object.entries(PROMPTS).filter(([s]) => s === single)
    : Object.entries(PROMPTS);

  if (single && entries.length === 0) {
    console.error(`Bilinmeyen slug: ${single}`);
    console.error(`Mevcut: ${Object.keys(PROMPTS).join(", ")}`);
    process.exit(1);
  }

  for (const [slug, prompt] of entries) {
    try {
      await generate(slug, prompt, force);
    } catch (e) {
      console.error(`✗ ${slug}:`, (e as Error).message);
    }
  }
  console.log("Bitti.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
