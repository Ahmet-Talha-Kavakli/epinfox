// KodKasa görsel üretim motoru — sitenin her yerinde kullanılan tek kaynak.
// Ana model: gpt-image-2 (2026 #1). Alternatif: imagen4-ultra (en temiz 3D).
// Kullanım:
//   import { generateImage, FLAT_3D_STYLE } from "./lib/generate-image";
//   await generateImage({ prompt: `a treasure chest, ${FLAT_3D_STYLE}`, out: "public/x.png" });
import { fal } from "@fal-ai/client";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

export type Engine = "gpt-image-2" | "imagen4-ultra";

const ENDPOINTS: Record<Engine, string> = {
  "gpt-image-2": "fal-ai/gpt-image-2",
  "imagen4-ultra": "fal-ai/imagen4/preview/ultra",
};

/** KodKasa marka görsel stili — flat 3D illustration (Flaticon/freepik). */
export const FLAT_3D_STYLE =
  "colorful flat 3D illustration icon, vibrant cartoon style, playful, " +
  "rounded composition, bright colors, soft shadows, glossy, clean, " +
  "modern flat 3D icon, freepik flaticon style, centered, white background, " +
  "high detail, cute, friendly, NO text, no words, no letters, single icon";

export interface GenOptions {
  prompt: string;
  out: string; // dosya yolu (örn. "public/brand/logo.png")
  engine?: Engine; // varsayılan gpt-image-2
  imageSize?: string; // varsayılan square_hd
  quality?: "auto" | "low" | "medium" | "high"; // sadece gpt-image-2
}

/** Tek görsel üretir ve dosyaya yazar. URL döner. */
export async function generateImage(opts: GenOptions): Promise<string> {
  const engine = opts.engine ?? "gpt-image-2";
  const endpoint = ENDPOINTS[engine];
  const input: Record<string, unknown> = {
    prompt: opts.prompt,
    image_size: opts.imageSize ?? "square_hd",
    num_images: 1,
    output_format: "png",
  };
  if (engine === "gpt-image-2") input.quality = opts.quality ?? "high";

  const res = await fal.subscribe(endpoint, { input, logs: false });
  const data = res.data as { images?: { url: string }[] };
  const url = data?.images?.[0]?.url;
  if (!url) throw new Error(`${engine}: görsel dönmedi`);

  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  await mkdir(dirname(opts.out), { recursive: true });
  await writeFile(opts.out, buf);
  return url;
}
