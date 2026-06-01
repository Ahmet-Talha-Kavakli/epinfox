// Aynı promptu FAL'daki en iyi görsel modellerine verir — model karşılaştırması.
// Çalıştır: npx tsx scripts/compare-models.ts
// Çıktı: public/brand/model-test/<model>.png + /model-test sayfasında yan yana.
import { config } from "dotenv";
import { fal } from "@fal-ai/client";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

config({ path: ".env.local" });
fal.config({ credentials: process.env.FAL_API_KEY! });

const OUT = resolve(process.cwd(), "public", "brand", "model-test");

// HEPSİNE AYNI PROMPT — sevdiğin flat 3D illustration stili.
const PROMPT =
  "a colorful shopping bag with a glowing game controller and gold coins, " +
  "colorful flat 3D illustration icon, vibrant cartoon style, playful, " +
  "rounded composition, bright colors red yellow blue green purple, " +
  "soft shadows, glossy, clean, modern flat 3D icon, freepik flaticon style, " +
  "centered, white background, high detail, cute, friendly, " +
  "NO text, no words, no letters, single icon";

// FAL endpoint'leri — en güçlü 10 model. Her biri için input şeması biraz farklı.
// label: dosya adı + ekranda gösterilecek isim.
const MODELS: { id: string; label: string; input?: Record<string, unknown> }[] = [
  { id: "fal-ai/flux-pro/v1.1-ultra", label: "01-flux-pro-ultra" },
  { id: "fal-ai/flux-pro/v1.1", label: "02-flux-pro-1.1" },
  { id: "fal-ai/flux/dev", label: "03-flux-dev" },
  { id: "fal-ai/flux/schnell", label: "04-flux-schnell" },
  { id: "fal-ai/recraft-v3", label: "05-recraft-v3" },
  { id: "fal-ai/ideogram/v2", label: "06-ideogram-v2" },
  { id: "fal-ai/imagen3", label: "07-imagen3" },
  { id: "fal-ai/flux-realism", label: "08-flux-realism" },
  { id: "fal-ai/stable-diffusion-v35-large", label: "09-sd-3.5-large" },
  { id: "fal-ai/sana", label: "10-sana" },
];

async function gen(model: { id: string; label: string; input?: Record<string, unknown> }) {
  const input: Record<string, unknown> = {
    prompt: PROMPT,
    num_images: 1,
    ...(model.input ?? {}),
  };
  // Boyut alanı modele göre değişir — ikisini de gönderiyoruz, model ilgisizi yok sayar.
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
  const results: { label: string; ok: boolean; err?: string }[] = [];
  for (const m of MODELS) {
    process.stdout.write(`→ ${m.label} (${m.id}) ... `);
    const t0 = Date.now();
    try {
      await gen(m);
      const s = Math.round((Date.now() - t0) / 1000);
      console.log(`✓ ${s}s`);
      results.push({ label: m.label, ok: true });
    } catch (e) {
      const msg = (e as Error).message?.slice(0, 80);
      console.log(`✗ ${msg}`);
      results.push({ label: m.label, ok: false, err: msg });
    }
  }
  const ok = results.filter((r) => r.ok).length;
  console.log(`\nBitti: ${ok}/${MODELS.length} başarılı. /model-test sayfasına bak.`);
  // Başarısızları özetle
  const failed = results.filter((r) => !r.ok);
  if (failed.length) {
    console.log("Başarısız:");
    failed.forEach((f) => console.log(`  ${f.label}: ${f.err}`));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
