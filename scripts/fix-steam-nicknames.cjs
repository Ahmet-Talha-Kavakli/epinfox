// Mevcut Steam kullanıcılarının nickname'ini "steam_<id>" yerine gerçek Steam
// ismine (Clerk unsafeMetadata.steamName) günceller. Bir kez çalıştırılır.
// Kullanım: node scripts/fix-steam-nicknames.cjs
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const envText = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
const get = (k) => {
  const m = envText.match(new RegExp("^" + k + "=(.+)$", "m"));
  return m ? m[1].trim().replace(/^["']|["']$/g, "") : null;
};
const dbUrl = get("DATABASE_URL");
// process.env önceliklidir (sk_live'i .env.local'i değiştirmeden geçici verebilmek için).
const clerkSk = process.env.CLERK_SECRET_KEY || get("CLERK_SECRET_KEY");

function sanitize(raw) {
  const clean = String(raw)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
  return clean.length >= 3 ? clean : "";
}

(async () => {
  if (!clerkSk) {
    console.error("CLERK_SECRET_KEY yok (.env.local). Bu script CANLI için sk_live ister.");
    process.exit(1);
  }
  const c = new Client({ connectionString: dbUrl });
  await c.connect();

  // steam_ ile başlayan nickname'li profiller
  const { rows } = await c.query(
    `select id, clerk_user_id, nickname from profiles where nickname like 'steam\\_%' escape '\\'`,
  );
  console.log(`${rows.length} steam_ nickname'li profil bulundu.`);

  let updated = 0;
  for (const p of rows) {
    if (!p.clerk_user_id) continue;
    try {
      const r = await fetch(`https://api.clerk.com/v1/users/${p.clerk_user_id}`, {
        headers: { Authorization: "Bearer " + clerkSk },
      });
      if (!r.ok) {
        console.log(`  ${p.nickname}: Clerk user alınamadı (${r.status})`);
        continue;
      }
      const u = await r.json();
      const steamName =
        u.unsafe_metadata?.steamName || u.unsafe_metadata?.fullName || "";
      const base = sanitize(steamName);
      if (!base) {
        console.log(`  ${p.nickname}: steamName boş/uygunsuz, atlandı`);
        continue;
      }
      // Çakışma kontrolü → gerekiyorsa suffix
      let nick = base;
      for (let i = 0; i < 5; i++) {
        const { rows: clash } = await c.query(
          "select 1 from profiles where nickname = $1 and id <> $2",
          [nick, p.id],
        );
        if (clash.length === 0) break;
        nick = `${base}-${Math.random().toString(36).slice(2, 5)}`.slice(0, 32);
      }
      await c.query("update profiles set nickname = $1 where id = $2", [nick, p.id]);
      console.log(`  ${p.nickname} → ${nick} (steam: "${steamName}")`);
      updated++;
    } catch (e) {
      console.log(`  ${p.nickname}: hata ${e.message}`);
    }
  }

  console.log(`\nTamam. ${updated} profil güncellendi.`);
  await c.end();
})();
