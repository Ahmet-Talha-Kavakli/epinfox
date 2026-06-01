// KodKasa logo — gpt-image-2 ile, çanta+gamepad konsepti (flat 3D).
// Çalıştır: npx tsx scripts/generate-logo.ts
// Çıktı: public/brand/new-logo-1.png ... (seçim için varyantlar)
import { config } from "dotenv";
import { fal } from "@fal-ai/client";
import { generateImage, FLAT_3D_STYLE } from "./lib/generate-image";

config({ path: ".env.local" });
fal.config({ credentials: process.env.FAL_API_KEY! });

// Çanta + gamepad + altın konsepti — birkaç varyasyon.
const VARIANTS: Record<string, string> = {
  "new-logo-1":
    `a colorful shopping bag full of a glowing game controller and gold coins spilling out, ${FLAT_3D_STYLE}`,
  "new-logo-2":
    `a vibrant shopping bag with a game controller and shiny gold coins, a small star sparkle, ${FLAT_3D_STYLE}`,
  "new-logo-3":
    `a cute glossy shopping bag with a blue game controller on top and gold coins, purple and red bag, ${FLAT_3D_STYLE}`,
  "new-logo-4":
    `a playful shopping bag overflowing with a game controller, gold coins and a gift card, ${FLAT_3D_STYLE}`,
};

async function main() {
  for (const [slug, prompt] of Object.entries(VARIANTS)) {
    process.stdout.write(`→ ${slug} ... `);
    const t0 = Date.now();
    try {
      await generateImage({ prompt, out: `public/brand/${slug}.png`, engine: "gpt-image-2" });
      console.log(`✓ ${Math.round((Date.now() - t0) / 1000)}s`);
    } catch (e) {
      console.log(`✗ ${(e as Error).message?.slice(0, 80)}`);
    }
  }
  console.log("\nBitti — /logo-preview sayfasına bak.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
