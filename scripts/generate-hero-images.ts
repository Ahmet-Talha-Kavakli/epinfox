// Hero carousel için geniş (16:9) banner görselleri üretir (fal.ai flux).
// Çalıştır: npx tsx scripts/generate-hero-images.ts
import { config } from "dotenv";
import { fal } from "@fal-ai/client";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

config({ path: ".env.local" });
fal.config({ credentials: process.env.FAL_API_KEY! });

const OUT = resolve(process.cwd(), "public", "hero");

const STYLE =
  "cinematic wide banner, dark navy and indigo background, neon glow, premium gaming fintech aesthetic, " +
  "soft volumetric lighting, depth, high detail, no text, no words, no logos, no brand names";

const SCENES: Record<string, string> = {
  "hero-1":
    "floating glossy neon game currency cards and golden coins streaming through dark space, purple and blue glow, " +
    STYLE,
  "hero-2":
    "an abstract digital wallet with glowing energy lines and floating gift cards, violet and indigo neon, " +
    STYLE,
  "hero-3":
    "a controller silhouette surrounded by floating neon gift cards and sparkling particles, dark cinematic, " +
    STYLE,
  "hero-4":
    "stacks of glowing digital code cards rising like a vault, blue and purple light beams, futuristic, " +
    STYLE,
};

async function main() {
  await mkdir(OUT, { recursive: true });
  for (const [slug, prompt] of Object.entries(SCENES)) {
    console.log(`→ ${slug}...`);
    const t0 = Date.now();
    const res = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt,
        image_size: "landscape_16_9",
        num_images: 1,
        output_format: "jpeg",
        num_inference_steps: 28,
      },
      logs: false,
    });
    const url = (res.data as { images?: { url: string }[] })?.images?.[0]?.url;
    if (!url) {
      console.error(`✗ ${slug} — görsel yok`);
      continue;
    }
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    await writeFile(resolve(OUT, `${slug}.jpg`), buf);
    console.log(`✓ ${slug} (${Math.round((Date.now() - t0) / 1000)}s)`);
  }
  console.log("Bitti.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
