// 2026'nın en iyi modelleri + kullanıcının beğendikleri — aynı prompt.
// Çalıştır: npx tsx scripts/compare-models-v2.ts
import { config } from "dotenv";
import { fal } from "@fal-ai/client";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

config({ path: ".env.local" });
fal.config({ credentials: process.env.FAL_API_KEY! });

const OUT = resolve(process.cwd(), "public", "brand", "model-test");

const PROMPT =
  "a colorful shopping bag with a glowing game controller and gold coins, " +
  "colorful flat 3D illustration icon, vibrant cartoon style, playful, " +
  "rounded composition, bright colors red yellow blue green purple, " +
  "soft shadows, glossy, clean, modern flat 3D icon, freepik flaticon style, " +
  "centered, white background, high detail, cute, friendly, " +
  "NO text, no words, no letters, single icon";

// Yeni nesil + kullanıcının beğendikleri. Birkaç olası endpoint denenir.
const MODELS: { id: string; label: string; input?: Record<string, unknown> }[] = [
  { id: "openai/gpt-image-2", label: "11-gpt-image-2", input: { quality: "high", image_size: "1024x1024" } },
  { id: "fal-ai/flux-2-pro", label: "12-flux-2-pro" },
  { id: "fal-ai/flux-2", label: "13-flux-2-dev" },
  { id: "fal-ai/nano-banana-2", label: "14-nano-banana-2" },
  { id: "fal-ai/nano-banana", label: "15-nano-banana" },
  { id: "fal-ai/imagen4", label: "16-imagen4" },
  { id: "fal-ai/imagen4/preview/ultra", label: "17-imagen4-ultra" },
  { id: "fal-ai/ideogram/v3", label: "18-ideogram-v3" },
];

async function gen(model: { id: string; label: string; input?: Record<string, unknown> }) {
  const input: Record<string, unknown> = {
    prompt: PROMPT,
    num_images: 1,
    ...(model.input ?? {}),
  };
  if (!("image_size" in input)) input.image_size = "square_hd";
  const res = await fal.subscribe(model.id, { input, logs: false });
  const data = res.data as { images?: { url: string }[] };
  const url = data?.images?.[0]?.url;
  if (!url) throw new Error("görsel dönmedi");
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  await writeFile(resolve(OUT, `${model.label}.png`), buf);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  for (const m of MODELS) {
    process.stdout.write(`→ ${m.label} (${m.id}) ... `);
    const t0 = Date.now();
    try {
      await gen(m);
      console.log(`✓ ${Math.round((Date.now() - t0) / 1000)}s`);
    } catch (e) {
      console.log(`✗ ${(e as Error).message?.slice(0, 90)}`);
    }
  }
  console.log("\nBitti — /model-test sayfasına bak.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
