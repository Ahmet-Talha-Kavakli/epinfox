// Referans tilki maskotundan (fox.png) aynı karakteri farklı sahnelerde üretir.
// gpt-image-2 edit API — tutarlı maskot. Higgsfield bakiyesi videolara saklanır.
require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const path = require("path");
const KEY = process.env.OPENAI_API_KEY;
const REF = "public/brand/mascot/fox.png";

async function foxScene({ prompt, out, size = "1024x1024" }) {
  const form = new FormData();
  const buf = fs.readFileSync(REF);
  form.append("model", "gpt-image-2");
  form.append("image", new Blob([buf], { type: "image/png" }), "fox.png");
  form.append("prompt", "the same fox mascot character (keep identical face, fur colors, purple jacket, outfit), " + prompt + ", colorful flat 3D illustration, glossy, no text, no words");
  form.append("size", size);
  const r = await fetch("https://api.openai.com/v1/images/edits", { method: "POST", headers: { Authorization: "Bearer " + KEY }, body: form });
  const j = await r.json();
  if (j.error) throw new Error(j.error.message);
  const item = j.data && j.data[0];
  fs.mkdirSync(path.dirname(out), { recursive: true });
  if (item?.b64_json) fs.writeFileSync(out, Buffer.from(item.b64_json, "base64"));
  else fs.writeFileSync(out, Buffer.from(await (await fetch(item.url)).arrayBuffer()));
  return out;
}
module.exports = { foxScene };
