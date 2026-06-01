#!/usr/bin/env node
/**
 * DB içerik çeviri pipeline'ı. TR içeriği (products/categories/brands/variants/
 * promo_codes) OpenAI ile en/de/ar/ru'ya çevirir ve content_translations'a
 * upsert eder. Dirençli: zaten var olan (entity,locale) çiftini atlar (resume).
 *
 * Kullanım:
 *   node scripts/translate-content.cjs                 # hepsi
 *   node scripts/translate-content.cjs products        # tek entity_type
 *   node scripts/translate-content.cjs --dry           # sadece say, çeviri yok
 *   node scripts/translate-content.cjs --force         # var olanları yeniden çevir
 */
const { Client } = require("pg");
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const env = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
const get = (k) => (env.match(new RegExp("^" + k + "=(.+)$", "m")) || [])[1]?.trim().replace(/^["']|["']$/g, "");
const dbUrl = get("DATABASE_URL");
const openaiKey = get("OPENAI_API_KEY");
if (!dbUrl || !openaiKey) { console.error("DATABASE_URL / OPENAI_API_KEY eksik"); process.exit(1); }

const openai = new OpenAI({ apiKey: openaiKey });
const MODEL = "gpt-4o-mini"; // hızlı + ucuz, çeviri için yeterli
const LOCALES = ["en", "de", "ar", "ru"];
const LOCALE_NAME = { en: "English", de: "German", ar: "Arabic", ru: "Russian" };

const onlyType = process.argv.find((a) => !a.startsWith("--") && a !== process.argv[1] && ["products","categories","brands","variants","promo"].includes(a));
const DRY = process.argv.includes("--dry");
const FORCE = process.argv.includes("--force");

// entity_type → { table, idCol, translatableFields }
const ENTITIES = {
  category: { table: "categories", fields: ["name", "description"] },
  brand: { table: "brands", fields: ["name", "description"] },
  product: { table: "products", fields: ["name", "description", "requirements", "how_to", "faq"] },
  variant: { table: "product_variants", fields: ["label"] },
  promo: { table: "promo_codes", fields: ["description"] },
};
const TYPE_ALIAS = { products: "product", categories: "category", brands: "brand", variants: "variant", promo: "promo" };

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

/** Bir kaydın çevrilebilir alanlarını (dolu olanları) {field: value} olarak topla. */
function pickSource(row, fields) {
  const src = {};
  for (const f of fields) {
    const v = row[f];
    if (v == null) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    src[f] = v;
  }
  return src;
}

/** OpenAI ile bir source objesini hedef dile çevir. JSON yapısı korunur. */
async function translateObj(src, locale, entityType) {
  const sys = `You are a professional localization engine for an e-commerce platform that sells game top-ups, gift cards, digital codes and social-media services. Translate the given JSON values from Turkish to ${LOCALE_NAME[locale]}.
RULES:
- Keep the JSON structure and keys EXACTLY. Only translate string values.
- For arrays (how_to steps) translate each item; keep order/length.
- For faq array of {q,a}, translate q and a, keep structure.
- Do NOT translate: brand names, game names, product proper nouns (e.g. "PUBG Mobile", "Steam", "Instagram", "Valorant"), currency symbols, numbers, URLs.
- Keep a natural, marketing-appropriate tone. For Arabic use correct RTL text.
- Return ONLY valid JSON, no commentary.`;
  const user = JSON.stringify(src);
  const res = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: "system", content: sys }, { role: "user", content: user }],
    temperature: 0.2,
    response_format: { type: "json_object" },
  });
  const txt = res.choices[0].message.content;
  return JSON.parse(txt);
}

(async () => {
  const c = new Client({ connectionString: dbUrl });
  await c.connect();

  const types = onlyType ? [TYPE_ALIAS[onlyType]] : Object.keys(ENTITIES);
  let totalDone = 0, totalSkipped = 0, totalErr = 0;

  for (const entityType of types) {
    const { table, fields } = ENTITIES[entityType];
    const { rows } = await c.query(`select id, ${fields.join(", ")} from ${table}`);
    // mevcut çeviriler (resume)
    const { rows: existing } = await c.query(
      `select entity_id, locale from content_translations where entity_type = $1`, [entityType]
    );
    const have = new Set(existing.map((e) => `${e.entity_id}|${e.locale}`));

    console.log(`\n━━ ${entityType} (${table}) — ${rows.length} kayıt ━━`);
    if (DRY) {
      let pending = 0;
      for (const row of rows) for (const loc of LOCALES) if (FORCE || !have.has(`${String(row.id)}|${loc}`)) pending++;
      console.log(`  bekleyen çeviri: ${pending} (${rows.length} kayıt × 4 dil)`);
      continue;
    }

    for (const row of rows) {
      const src = pickSource(row, fields);
      if (Object.keys(src).length === 0) continue;
      for (const loc of LOCALES) {
        const key = `${String(row.id)}|${loc}`;
        if (!FORCE && have.has(key)) { totalSkipped++; continue; }
        try {
          const payload = await translateObj(src, loc, entityType);
          await c.query(
            `insert into content_translations (entity_type, entity_id, locale, payload)
             values ($1,$2,$3,$4)
             on conflict (entity_type, entity_id, locale)
             do update set payload = excluded.payload, updated_at = now()`,
            [entityType, String(row.id), loc, JSON.stringify(payload)]
          );
          totalDone++;
          if (totalDone % 25 === 0) console.log(`  …${totalDone} çeviri yazıldı`);
          await sleep(120); // rate-limit nezaketi
        } catch (e) {
          totalErr++;
          console.error(`  ✗ ${entityType} ${row.id} ${loc}: ${e.message}`);
          await sleep(500);
        }
      }
    }
  }

  console.log(`\n════ BİTTİ: ${totalDone} yazıldı, ${totalSkipped} atlandı (mevcut), ${totalErr} hata ════`);
  await c.end();
})();
