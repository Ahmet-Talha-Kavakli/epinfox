// Uçtan uca satın alma akışı testi (RPC mantığı). Test verisini sonunda temizler.
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const envText = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
const dbUrl = envText.match(/^DATABASE_URL=(.+)$/m)[1].trim().replace(/^["']|["']$/g, "");
const encKey = envText.match(/^CODE_ENCRYPTION_KEY=(.+)$/m)[1].trim();

const ok = (m) => console.log("  \x1b[32m✓\x1b[0m " + m);
const fail = (m) => { console.log("  \x1b[31m✗ " + m + "\x1b[0m"); process.exitCode = 1; };

(async () => {
  const c = new Client({ connectionString: dbUrl });
  await c.connect();

  // Temiz başla (FK sırası: txn → kod-order bağını kopar → orders → kodlar → ürün → profil)
  await c.query(`delete from wallet_transactions where user_id in (select id from profiles where email='test-purchase@kodkasa.test')`);
  await c.query(`update product_codes set order_id=null where product_id in (select id from products where slug='test-urun-xyz')`);
  await c.query(`delete from orders where user_id in (select id from profiles where email='test-purchase@kodkasa.test')`);
  await c.query(`delete from product_codes where product_id in (select id from products where slug='test-urun-xyz')`);
  await c.query(`delete from products where slug='test-urun-xyz'`);
  await c.query(`delete from profiles where email='test-purchase@kodkasa.test'`);

  // Test profili + ürün
  const { rows: [u] } = await c.query(
    `insert into profiles (clerk_user_id, email, nickname, role, balance) values (null,'test-purchase@kodkasa.test','test-purchase-user','member',0) returning id`,
  );
  const { rows: [cat] } = await c.query(`select id from categories limit 1`);
  const { rows: [p] } = await c.query(
    `insert into products (category_id, slug, name, price, tone) values ($1,'test-urun-xyz','TEST Ürün',100,'brand') returning id`,
    [cat.id],
  );
  const userId = u.id, productId = p.id;

  console.log("\n1) Bakiye yükleme (wallet_topup)");
  const { rows: [tu] } = await c.query(`select wallet_topup($1,$2,'mock') as bal`, [userId, 250]);
  Number(tu.bal) === 250 ? ok("bakiye 250 oldu") : fail("bakiye yanlış: " + tu.bal);

  console.log("\n2) Kod ekleme (add_product_codes, şifreli)");
  const { rows: [ac] } = await c.query(`select add_product_codes($1,$2,$3) as n`, [productId, ["KOD-AAA-111", "KOD-BBB-222"], encKey]);
  Number(ac.n) === 2 ? ok("2 kod eklendi") : fail("kod sayısı yanlış: " + ac.n);
  const { rows: [enc] } = await c.query(`select code_encrypted::text as e from product_codes where product_id=$1 limit 1`, [productId]);
  !enc.e.includes("KOD-AAA") ? ok("kod DB'de şifreli (düz metin görünmüyor)") : fail("kod düz metin saklanmış!");

  console.log("\n3) Satın alma (purchase_product)");
  const { rows: [buy] } = await c.query(`select * from purchase_product($1,$2,$3)`, [userId, productId, encKey]);
  buy.order_id ? ok("order oluştu: " + buy.order_id.slice(0, 8)) : fail("order yok");
  /^KOD-(AAA-111|BBB-222)$/.test(buy.code) ? ok("doğru kod decrypt edildi: " + buy.code) : fail("kod yanlış: " + buy.code);
  const { rows: [b1] } = await c.query(`select balance from profiles where id=$1`, [userId]);
  Number(b1.balance) === 150 ? ok("bakiye 250→150 düştü") : fail("bakiye yanlış: " + b1.balance);
  const { rows: [sold] } = await c.query(`select count(*)::int n from product_codes where product_id=$1 and status='sold'`, [productId]);
  sold.n === 1 ? ok("1 kod 'sold' oldu") : fail("sold sayısı yanlış: " + sold.n);
  const { rows: [wt] } = await c.query(`select count(*)::int n from wallet_transactions where user_id=$1 and type='purchase'`, [userId]);
  wt.n === 1 ? ok("purchase txn kaydedildi") : fail("purchase txn yok");

  console.log("\n4) İkinci satın alma → son kod gider, stok biter");
  await c.query(`select * from purchase_product($1,$2,$3)`, [userId, productId, encKey]);
  const { rows: [avail] } = await c.query(`select count(*)::int n from product_codes where product_id=$1 and status='available'`, [productId]);
  avail.n === 0 ? ok("stok 0'a indi") : fail("stok kaldı: " + avail.n);

  console.log("\n5) Stok bittiğinde satın alma → OUT_OF_STOCK (bakiye değişmez)");
  // Bakiye yeterli olsun ki stok kontrolüne kadar gelsin (bakiye kontrolü önce yapılır)
  await c.query(`update profiles set balance=500 where id=$1`, [userId]);
  const { rows: [bBefore] } = await c.query(`select balance from profiles where id=$1`, [userId]);
  try {
    await c.query(`select * from purchase_product($1,$2,$3)`, [userId, productId, encKey]);
    fail("hata fırlatmadı!");
  } catch (e) {
    e.message.includes("OUT_OF_STOCK") ? ok("OUT_OF_STOCK fırlatıldı") : fail("yanlış hata: " + e.message);
  }
  const { rows: [bAfter] } = await c.query(`select balance from profiles where id=$1`, [userId]);
  Number(bAfter.balance) === Number(bBefore.balance) ? ok("bakiye değişmedi (rollback)") : fail("bakiye değişti!");

  console.log("\n6) Yetersiz bakiye → INSUFFICIENT_BALANCE");
  // Yeni kod ekle ama bakiye 50, fiyat 100
  await c.query(`select add_product_codes($1,$2,$3)`, [productId, ["KOD-CCC-333"], encKey]);
  await c.query(`update profiles set balance=50 where id=$1`, [userId]);
  try {
    await c.query(`select * from purchase_product($1,$2,$3)`, [userId, productId, encKey]);
    fail("hata fırlatmadı!");
  } catch (e) {
    e.message.includes("INSUFFICIENT_BALANCE") ? ok("INSUFFICIENT_BALANCE fırlatıldı") : fail("yanlış hata: " + e.message);
  }
  const { rows: [stillAvail] } = await c.query(`select count(*)::int n from product_codes where product_id=$1 and status='available'`, [productId]);
  stillAvail.n === 1 ? ok("kod satılmadı (stok korundu)") : fail("kod kayboldu!");

  // Temizlik — FK sırası: önce txn, sonra kodların order bağını kopar, sonra orders, sonra kodlar
  await c.query(`delete from wallet_transactions where user_id=$1`, [userId]);
  await c.query(`update product_codes set order_id=null where product_id=$1`, [productId]);
  await c.query(`delete from orders where user_id=$1`, [userId]);
  await c.query(`delete from product_codes where product_id=$1`, [productId]);
  await c.query(`delete from products where id=$1`, [productId]);
  await c.query(`delete from profiles where id=$1`, [userId]);
  await c.end();
  console.log("\nTest verisi temizlendi.");
})().catch((e) => { console.error("TEST HATASI:", e.message); process.exit(1); });
