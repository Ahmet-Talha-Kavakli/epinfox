#!/usr/bin/env node
/**
 * i18n audit — iki sorunu tespit eder:
 *  1) RAW KEY BUG: kodda t("x") ile kullanılan ama HİÇBİR dilde (özellikle tr
 *     fallback'inde) tanımlı OLMAYAN anahtarlar → ekranda ham anahtar görünür.
 *  2) LOCALE EKSİĞİ: tr'de var ama en/de/ar/ru'da YOK → o dilde Türkçe'ye düşer.
 *
 * Kullanım: node scripts/i18n-audit.cjs
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DICT_DIR = path.join(ROOT, "src/lib/i18n/dict");
const SRC_DIR = path.join(ROOT, "src");
const LOCALES = ["tr", "en", "de", "ar", "ru"];

// ── 1. Dict dosyalarından locale bazlı anahtarları çıkar ──
// Her dosyada `export const <locale>: Dict = { ... };` blokları var.
// Blok başlangıçlarını işaretle, sonraki export'a kadar olan kısmı o locale'e ata.
function extractDictKeys() {
  const perLocale = {}; // locale -> Set(keys)
  for (const l of LOCALES) perLocale[l] = new Set();

  for (const file of fs.readdirSync(DICT_DIR)) {
    if (!file.endsWith(".ts")) continue;
    const src = fs.readFileSync(path.join(DICT_DIR, file), "utf8");
    const lines = src.split("\n");
    let current = null;
    const markerRe = /^export const (tr|en|de|ar|ru)\s*:/;
    // Satır başı anahtar: "key": ...  veya  'key': ...
    const keyRe = /^\s*["']([^"']+)["']\s*:/;
    for (const line of lines) {
      const m = line.match(markerRe);
      if (m) {
        current = m[1];
        continue;
      }
      // Başka bir export gelirse locale bloğu bitti
      if (/^export const \w+/.test(line) && !markerRe.test(line)) {
        current = null;
        continue;
      }
      if (!current) continue;
      const k = line.match(keyRe);
      if (k) perLocale[current].add(k[1]);
    }
  }
  return perLocale;
}

// ── 2. Kaynak kodda kullanılan t("...") anahtarlarını topla ──
// t("key"), t('key'), getServerT sonrası t("key"). Dinamik t(var) atlanır.
function extractUsedKeys() {
  const used = new Map(); // key -> Set(files)
  const dynamic = []; // {file, snippet}
  const callRe = /\bt\(\s*(["'`])([^"'`]+?)\1\s*\)/g;
  const dynamicRe = /\bt\(\s*[^"'`)\s]/g; // t( değişken...

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (["node_modules", ".next", ".git"].includes(entry.name)) continue;
        walk(full);
      } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
        // dict dosyalarının kendisini atla
        if (full.startsWith(DICT_DIR)) continue;
        const src = fs.readFileSync(full, "utf8");
        const rel = path.relative(ROOT, full);
        let m;
        while ((m = callRe.exec(src)) !== null) {
          const key = m[2];
          // Template literal interpolasyonu olanları (`${`) atla
          if (key.includes("${")) continue;
          if (!used.has(key)) used.set(key, new Set());
          used.get(key).add(rel);
        }
        // dinamik t( kullanımı (sadece raporlamak için)
        let d;
        while ((d = dynamicRe.exec(src)) !== null) {
          dynamic.push(rel);
          break; // dosya başına bir kez
        }
      }
    }
  }
  walk(SRC_DIR);
  return { used, dynamic };
}

const dict = extractDictKeys();
const { used, dynamic } = extractUsedKeys();

const allDefined = new Set();
for (const l of LOCALES) for (const k of dict[l]) allDefined.add(k);

console.log("════════════════════════════════════════════════════════");
console.log("  i18n AUDIT");
console.log("════════════════════════════════════════════════════════");
console.log("Dict anahtar sayısı (locale bazlı):");
for (const l of LOCALES) console.log(`  ${l}: ${dict[l].size}`);
console.log(`Kodda kullanılan benzersiz t() anahtarı: ${used.size}`);
console.log("");

// ── RAPOR 1: RAW KEY BUG ──
// Kullanılıyor ama tr'de YOK (fallback de yok) → ekranda ham anahtar
const rawKeyBug = [];
for (const [key, files] of used) {
  if (!dict.tr.has(key) && !allDefined.has(key)) {
    rawKeyBug.push({ key, files: [...files] });
  }
}
console.log("────────────────────────────────────────────────────────");
console.log(`🔴 RAW KEY BUG — hiçbir dilde tanımsız (${rawKeyBug.length})`);
console.log("   (ekranda ham anahtar görünür — EN KRİTİK)");
console.log("────────────────────────────────────────────────────────");
if (rawKeyBug.length === 0) console.log("  ✓ yok");
for (const { key, files } of rawKeyBug.sort((a, b) => a.key.localeCompare(b.key))) {
  console.log(`  ✗ ${key}`);
  console.log(`      ${files.join(", ")}`);
}
console.log("");

// ── RAPOR 2: tr'de var, kullanılıyor, ama bazı locale'lerde eksik ──
const localeMissing = {}; // locale -> [keys]
for (const l of LOCALES) localeMissing[l] = [];
for (const [key] of used) {
  if (!dict.tr.has(key)) continue; // raw key bug'da raporlandı
  for (const l of LOCALES) {
    if (l === "tr") continue;
    if (!dict[l].has(key)) localeMissing[l].push(key);
  }
}
console.log("────────────────────────────────────────────────────────");
console.log("🟡 LOCALE EKSİĞİ — tr'de var, kullanılıyor, o dilde YOK");
console.log("   (o dilde Türkçe'ye düşer — yanlış dil)");
console.log("────────────────────────────────────────────────────────");
for (const l of LOCALES) {
  if (l === "tr") continue;
  const arr = localeMissing[l].sort();
  console.log(`  ${l}: ${arr.length} eksik`);
  for (const k of arr) console.log(`      - ${k}`);
}
console.log("");

// ── RAPOR 3: tr'de tanımlı ama kullanılmayan (ölü anahtar) — bilgi amaçlı ──
const unused = [...dict.tr].filter((k) => !used.has(k));
console.log("────────────────────────────────────────────────────────");
console.log(`⚪ KULLANILMAYAN tr anahtarı: ${unused.length} (bilgi amaçlı, dokunma)`);
console.log("────────────────────────────────────────────────────────");
console.log("");

// ── RAPOR 4: dinamik t() kullanan dosyalar (manuel kontrol) ──
const uniqDynamic = [...new Set(dynamic)];
console.log(`ℹ️  Dinamik t(değişken) kullanan dosya: ${uniqDynamic.length} (audit edilemez)`);

// Özet exit
console.log("");
console.log("════════════════════════════════════════════════════════");
console.log(`ÖZET: ${rawKeyBug.length} raw-key bug, ` +
  LOCALES.filter((l) => l !== "tr").map((l) => `${l}:${localeMissing[l].length}`).join(" "));
console.log("════════════════════════════════════════════════════════");
