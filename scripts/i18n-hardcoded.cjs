#!/usr/bin/env node
/**
 * Hardcoded TR tarayıcı — t() ile sarılmamış, ekrana çıkan Türkçe metinleri bulur.
 * Kapsam: kullanıcıya görünen sayfalar/bileşenler (admin HARİÇ, dict HARİÇ, data HARİÇ).
 *
 * Heuristik: Türkçe'ye özgü karakter (çğıöşü ÇĞİÖŞÜ) içeren string/JSX-text
 * literalleri. Tamamı kesin değil ama "garip görünen TR" için iyi bir radar.
 *
 * Kullanım: node scripts/i18n-hardcoded.cjs [--all]   (--all admin'i de tarar)
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const INCLUDE_ADMIN = process.argv.includes("--all");

const TR = /[çğıöşüÇĞİÖŞÜ]/;
// Bilinçli çevrilmeyen yollar
const SKIP_DIRS = ["node_modules", ".next", ".git"];
const SKIP_PATH_RE = [
  /\/lib\/i18n\/dict\//,
  /\/lib\/i18n\//, // config/rates içindeki TR label'lar veri
];
const DATA_FILE_RE = /(content|earn-platforms|player-platforms|data|seed|mock)\.tsx?$/i;

const results = [];

function isAdmin(rel) {
  return rel.includes("/admin/") || rel.includes("app/admin");
}

function scanFile(full, rel) {
  const src = fs.readFileSync(full, "utf8");
  const lines = src.split("\n");
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    // yorum satırlarını atla
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) return;
    if (!TR.test(line)) return;
    // import/export from yollarını atla
    if (/^\s*(import|export)\b/.test(line)) return;
    // t("...") çağrısı içindeyse zaten çeviri — ama satırda TR text VE t( yoksa şüpheli
    // dict referansı / aria atlama: çoğu zaten t() ile. Sadece TR literal + JSX/attr arıyoruz.
    // string literal veya JSX text içinde TR mi?
    const hasStringLit = /["'`][^"'`]*[çğıöşüÇĞİÖŞÜ][^"'`]*["'`]/.test(line);
    // JSX text: >...TR...<
    const hasJsxText = />[^<>{}]*[çğıöşüÇĞİÖŞÜ][^<>{}]*</.test(line);
    if (!hasStringLit && !hasJsxText) return;
    // t( ile başlayan ve sadece o satırda olan TR'yi (dict değilse) yine de göster
    results.push({ rel, line: i + 1, text: trimmed.slice(0, 120) });
  });
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.includes(entry.name)) continue;
      walk(path.join(dir, entry.name));
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      const full = path.join(dir, entry.name);
      const rel = path.relative(ROOT, full);
      if (SKIP_PATH_RE.some((re) => re.test("/" + rel))) continue;
      if (DATA_FILE_RE.test(entry.name)) continue;
      if (!INCLUDE_ADMIN && isAdmin(rel)) continue;
      scanFile(full, rel);
    }
  }
}

walk(SRC);

// Dosya bazında grupla
const byFile = new Map();
for (const r of results) {
  if (!byFile.has(r.rel)) byFile.set(r.rel, []);
  byFile.get(r.rel).push(r);
}

const sorted = [...byFile.entries()].sort((a, b) => b[1].length - a[1].length);
console.log("════════════════════════════════════════════════════════");
console.log(`  HARDCODED TR TARAMASI  (admin ${INCLUDE_ADMIN ? "DAHİL" : "hariç"})`);
console.log("════════════════════════════════════════════════════════");
console.log(`Şüpheli satır: ${results.length} | Dosya: ${byFile.size}\n`);
for (const [rel, rows] of sorted) {
  console.log(`\n📄 ${rel}  (${rows.length})`);
  for (const r of rows) console.log(`   ${r.line}: ${r.text}`);
}
