const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const envText = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
const m = envText.match(/^DATABASE_URL=(.+)$/m);
if (!m) {
  console.error("DATABASE_URL not found in .env.local");
  process.exit(1);
}
const dbUrl = m[1].trim().replace(/^["']|["']$/g, "");

const file = process.argv[2];
if (!file) {
  console.error("Usage: node apply-migration.cjs <migration-file.sql>");
  process.exit(1);
}
const sqlPath = path.join(__dirname, "..", "supabase", "migrations", file);
const sql = fs.readFileSync(sqlPath, "utf8");

(async () => {
  const c = new Client({ connectionString: dbUrl });
  await c.connect();
  console.log(`Applying ${file} …`);
  await c.query("begin");
  try {
    await c.query(sql);
    await c.query("commit");
    console.log("OK — committed.");
  } catch (e) {
    await c.query("rollback");
    console.error("ROLLBACK — error:", e.message);
    process.exit(1);
  }
  await c.end();
})().catch((e) => {
  console.error("ERR:", e.message);
  process.exit(1);
});
