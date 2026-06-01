// Enum oluşturma/ekleme — transaction DIŞINDA (ALTER TYPE ADD VALUE gereği).
// Idempotent. Bir kez çalıştırılır; sonra 20260529800000_supply.sql uygulanır.
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
const dbUrl = fs
  .readFileSync(path.join(__dirname, "..", ".env.local"), "utf8")
  .match(/^DATABASE_URL=(.+)$/m)[1]
  .trim()
  .replace(/^["']|["']$/g, "");

(async () => {
  const c = new Client({ connectionString: dbUrl });
  await c.connect();
  // delivery_type enum
  await c.query(`do $$ begin
    create type delivery_type as enum ('code','topup');
  exception when duplicate_object then null; end $$;`);
  // delivery_type'a 'service' (SMM sosyal medya hizmetleri) ekle.
  await c.query("alter type delivery_type add value if not exists 'service'");
  // order_status'a yeni değerler (transaction dışında, autocommit)
  await c.query("alter type order_status add value if not exists 'pending'");
  await c.query("alter type order_status add value if not exists 'processing'");
  console.log("OK — enums hazır.");
  await c.end();
})().catch((e) => {
  console.error("ERR:", e.message);
  process.exit(1);
});
