// KodKasa görsel üretimi — OpenAI gpt-image-2 (kullanıcının kendi anahtarı).
// Higgsfield bakiyesi videolar için saklansın diye görseller buradan üretilir.
// Kullanım:
//   const { genImage, FLAT_3D } = require('./lib/openai-image.cjs');
//   await genImage({ prompt: `... ${FLAT_3D}`, out: 'public/promo/x.png', size: '1536x1024' });
require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const path = require("path");

const KEY = process.env.OPENAI_API_KEY;

/** Kullanıcının sevdiği flat 3D illustration stil eki — RENGARENK (mor zorlaması yok). */
const FLAT_3D =
  "colorful flat 3D illustration, vibrant cartoon style, playful, glossy, " +
  "soft shadows, freepik flaticon style, bright multicolor palette (red, yellow, blue, green, orange, pink), " +
  "high detail, no text, no words, no letters, no watermark";

/**
 * gpt-image-2 ile tek görsel üretir, PNG olarak yazar.
 * size: '1024x1024' | '1536x1024' (yatay) | '1024x1536' (dikey)
 */
async function genImage({ prompt, out, size = "1024x1024", quality = "high" }) {
  if (!KEY) throw new Error("OPENAI_API_KEY yok");
  const r = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: "Bearer " + KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-image-2", prompt, size, quality, n: 1 }),
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error.message);
  const item = j.data && j.data[0];
  let buf;
  if (item?.b64_json) buf = Buffer.from(item.b64_json, "base64");
  else if (item?.url) buf = Buffer.from(await (await fetch(item.url)).arrayBuffer());
  else throw new Error("görsel dönmedi");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, buf);
  return out;
}

module.exports = { genImage, FLAT_3D };
