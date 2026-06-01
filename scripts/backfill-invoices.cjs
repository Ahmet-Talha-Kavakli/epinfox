// Mevcut tamamlanmış siparişler için fatura kaydı üretir (bir kez çalıştırılır).
// Kullanım: node scripts/backfill-invoices.cjs
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const envText = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
const dbUrl = envText
  .match(/^DATABASE_URL=(.+)$/m)[1]
  .trim()
  .replace(/^["']|["']$/g, "");

(async () => {
  const c = new Client({ connectionString: dbUrl });
  await c.connect();
  // Henüz faturası olmayan, tamamlanmış siparişler
  const { rows } = await c.query(`
    select o.id, o.user_id, o.product_name, o.variant_label, o.price, o.created_at,
           extract(year from o.created_at)::int as yr
    from orders o
    left join invoices i on i.order_id = o.id
    where o.status = 'completed' and i.id is null
    order by o.created_at asc
  `);
  console.log(`${rows.length} sipariş için fatura üretilecek…`);

  // Yıl başına sıra numarası
  const seqByYear = {};
  const { rows: maxRows } = await c.query(`
    select substring(number from 'KK-([0-9]{4})-') as yr,
           max(substring(number from 'KK-[0-9]{4}-([0-9]+)')::int) as mx
    from invoices group by 1
  `);
  for (const r of maxRows) if (r.yr) seqByYear[r.yr] = r.mx ?? 0;

  let n = 0;
  for (const o of rows) {
    const yr = o.yr;
    seqByYear[yr] = (seqByYear[yr] ?? 0) + 1;
    const number = `KK-${yr}-${String(seqByYear[yr]).padStart(6, "0")}`;
    const desc = o.variant_label
      ? `${o.product_name} (${o.variant_label})`
      : o.product_name;
    await c.query(
      `insert into invoices (user_id, order_id, number, description, amount, status, created_at)
       values ($1,$2,$3,$4,$5,'paid',$6)`,
      [o.user_id, o.id, number, desc, o.price, o.created_at],
    );
    n++;
  }
  console.log(`OK — ${n} fatura üretildi.`);
  await c.end();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
