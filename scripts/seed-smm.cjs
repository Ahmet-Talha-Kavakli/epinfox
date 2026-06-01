// KodKasa — Sosyal Medya (SMM) ürünleri + kademeli varyantları seed eder.
// Her ürün: supply_source='smm', delivery_type='service', "Sosyal Medya" kategorisi.
// Her varyant: supplier_service_id = resellerprovider panel servis no,
//              supplier_quantity   = o paketin adedi (örn. 1000 takipçi),
//              price               = makul perakende TL fiyatı (admin'den değiştirilebilir).
// Idempotent: slug/onconflict ile tekrar çalıştırılabilir; varyantları sıfırlayıp yeniden yazar.
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
const dbUrl = fs
  .readFileSync(path.join(__dirname, "..", ".env.local"), "utf8")
  .match(/^DATABASE_URL=(.+)$/m)[1]
  .trim()
  .replace(/^["']|["']$/g, "");

// service: resellerprovider panel servis no (doğrulandı, min/max kontrol edildi)
// Varyant: [adet, TL_fiyat]. Adetler panel min/max sınırları içinde.
const PRODUCTS = [
  {
    slug: "instagram-takipci", name: "Instagram Takipçi", tone: "brand",
    desc: "Profilin için gerçek görünümlü Instagram takipçileri. Hedef link/kullanıcı adını sipariş ekranında girersin.",
    service: 8317, // max 25K
    variants: [[100, 19], [250, 39], [500, 69], [1000, 119], [2500, 269], [5000, 499], [10000, 899]],
  },
  {
    slug: "instagram-begeni", name: "Instagram Beğeni", tone: "danger",
    desc: "Gönderilerine hızlı Instagram beğenisi. Gönderi linkini girersin, dakikalar içinde başlar.",
    service: 7258,
    variants: [[100, 9], [250, 15], [500, 25], [1000, 39], [2500, 79], [5000, 139], [10000, 249]],
  },
  {
    slug: "instagram-izlenme", name: "Instagram İzlenme / Story Görüntülenme", tone: "accent",
    desc: "Reels/Story görüntülenme sayını artır. Hızlı teslim, link bazlı.",
    service: 418, // story views, max 50K, min 100
    variants: [[500, 9], [1000, 15], [2500, 29], [5000, 49], [10000, 89], [25000, 179], [50000, 299]],
  },
  {
    slug: "tiktok-takipci", name: "TikTok Takipçi", tone: "info",
    desc: "TikTok profilin için takipçi. Kullanıcı adı/link ile sipariş ver, kademeli teslim.",
    service: 8176,
    variants: [[100, 29], [250, 59], [500, 99], [1000, 169], [2500, 379], [5000, 699], [10000, 1199]],
  },
  {
    slug: "tiktok-izlenme", name: "TikTok İzlenme", tone: "success",
    desc: "Video izlenme sayını anında yükselt. Video linkini gir, dakikalar içinde başlar.",
    service: 8365,
    variants: [[1000, 9], [5000, 19], [10000, 29], [25000, 59], [50000, 99], [100000, 179], [250000, 349]],
  },
  {
    slug: "tiktok-begeni", name: "TikTok Beğeni", tone: "warning",
    desc: "Videolarına kaliteli TikTok beğenisi. Hızlı teslim, link bazlı.",
    service: 7771,
    variants: [[100, 9], [250, 15], [500, 25], [1000, 39], [2500, 79], [5000, 139], [10000, 249]],
  },
  {
    slug: "youtube-izlenme", name: "YouTube İzlenme", tone: "danger",
    desc: "YouTube videoların için düşük düşüş oranlı izlenme. Video linkini gir.",
    service: 8040, // min 200
    variants: [[1000, 49], [2500, 109], [5000, 199], [10000, 379], [25000, 899], [50000, 1699]],
  },
  {
    slug: "youtube-abone", name: "YouTube Abone", tone: "danger",
    desc: "Kanalın için YouTube abonesi. Kanal linkini sipariş ekranında girersin.",
    service: 8048, // max 50K
    variants: [[50, 39], [100, 69], [250, 149], [500, 279], [1000, 499], [2500, 1149], [5000, 2199]],
  },
  {
    slug: "twitter-takipci", name: "Twitter / X Takipçi", tone: "neutral",
    desc: "X (Twitter) profilin için global takipçi. Kullanıcı adı/link ile sipariş ver.",
    service: 6454, // min 100
    variants: [[100, 49], [250, 99], [500, 179], [1000, 329], [2500, 749], [5000, 1399]],
  },
  {
    slug: "telegram-uye", name: "Telegram Üye", tone: "info",
    desc: "Kanal/grup için Telegram üyesi. Kanal linkini sipariş ekranında girersin.",
    service: 8377,
    variants: [[100, 15], [250, 29], [500, 49], [1000, 89], [2500, 199], [5000, 369], [10000, 649]],
  },
  {
    slug: "instagram-otomatik-begeni", name: "Instagram Otomatik Beğeni", tone: "danger",
    desc: "Yeni gönderilerine otomatik beğeni. Bir kez kur, her paylaşımda otomatik başlasın.",
    service: 7259,
    variants: [[100, 19], [250, 39], [500, 69], [1000, 119], [2500, 269], [5000, 499]],
  },
  {
    slug: "instagram-reels-izlenme", name: "Instagram Reels İzlenme", tone: "accent",
    desc: "Reels videolarının izlenme sayısını yükselt. Hızlı teslim, link bazlı.",
    service: 419,
    variants: [[1000, 9], [5000, 19], [10000, 35], [25000, 69], [50000, 119], [100000, 199]],
  },
  {
    slug: "instagram-yorum", name: "Instagram Yorum", tone: "brand",
    desc: "Gönderilerine gerçek görünümlü Türkçe/global yorum. Etkileşimini artır.",
    service: 6612,
    variants: [[10, 29], [25, 59], [50, 99], [100, 179], [250, 399]],
  },
  {
    slug: "facebook-sayfa-begeni", name: "Facebook Sayfa Beğeni", tone: "info",
    desc: "Facebook sayfan için beğeni/takip. Sayfa linkini sipariş ekranında girersin.",
    service: 5521,
    variants: [[100, 39], [250, 79], [500, 139], [1000, 249], [2500, 549], [5000, 999]],
  },
  {
    slug: "facebook-takipci", name: "Facebook Takipçi", tone: "info",
    desc: "Profil/sayfa için Facebook takipçisi. Link bazlı, kademeli teslim.",
    service: 5530,
    variants: [[100, 39], [250, 79], [500, 139], [1000, 249], [2500, 549], [5000, 999]],
  },
  {
    slug: "twitch-izleyici", name: "Twitch Canlı İzleyici", tone: "brand",
    desc: "Yayınına canlı izleyici (saatlik). Yayın linkini ve süreyi girersin.",
    service: 7901,
    variants: [[50, 49], [100, 89], [250, 199], [500, 379], [1000, 699]],
  },
  {
    slug: "twitch-takipci", name: "Twitch Takipçi", tone: "brand",
    desc: "Twitch kanalın için takipçi. Kanal linkini sipariş ekranında girersin.",
    service: 7910,
    variants: [[100, 39], [250, 79], [500, 139], [1000, 249], [2500, 549], [5000, 999]],
  },
  {
    slug: "discord-uye", name: "Discord Üye", tone: "brand",
    desc: "Sunucun için Discord üyesi. Davet linkini sipariş ekranında girersin.",
    service: 7333,
    variants: [[100, 59], [250, 119], [500, 219], [1000, 399], [2500, 899]],
  },
  {
    slug: "spotify-dinlenme", name: "Spotify Şarkı Dinlenme", tone: "success",
    desc: "Şarkı/çalma listesi dinlenme sayını artır. Track linkini girersin.",
    service: 6201,
    variants: [[1000, 29], [5000, 99], [10000, 179], [25000, 399], [50000, 699], [100000, 1199]],
  },
  {
    slug: "spotify-aylik-dinleyici", name: "Spotify Aylık Dinleyici", tone: "success",
    desc: "Sanatçı profilin için aylık dinleyici. Profil linkini girersin.",
    service: 6215,
    variants: [[500, 99], [1000, 179], [2500, 399], [5000, 749]],
  },
  {
    slug: "twitter-begeni", name: "Twitter / X Beğeni", tone: "neutral",
    desc: "Tweetlerine beğeni. Tweet linkini sipariş ekranında girersin.",
    service: 6470,
    variants: [[100, 19], [250, 39], [500, 69], [1000, 119], [2500, 269], [5000, 499]],
  },
  {
    slug: "twitter-retweet", name: "Twitter / X Retweet", tone: "neutral",
    desc: "Tweetlerine retweet. Tweet linkini girersin, hızlı başlar.",
    service: 6481,
    variants: [[50, 29], [100, 49], [250, 109], [500, 199], [1000, 359]],
  },
  {
    slug: "kick-takipci", name: "Kick Takipçi", tone: "success",
    desc: "Kick yayıncı profilin için takipçi. Kanal linkini girersin.",
    service: 8501,
    variants: [[100, 49], [250, 109], [500, 199], [1000, 369], [2500, 849]],
  },
  {
    slug: "snapchat-takipci", name: "Snapchat Takipçi", tone: "warning",
    desc: "Snapchat hesabın için takipçi. Kullanıcı adı/link ile sipariş ver.",
    service: 8612,
    variants: [[100, 59], [250, 129], [500, 239], [1000, 439]],
  },
];

function fmtLabel(qty) {
  return qty.toLocaleString("tr-TR");
}

(async () => {
  const c = new Client({ connectionString: dbUrl });
  await c.connect();
  await c.query("begin");

  const { rows: catRows } = await c.query(
    "select id from categories where slug = 'sosyal-medya'",
  );
  if (!catRows.length) throw new Error("'sosyal-medya' kategorisi yok — önce migration uygula.");
  const categoryId = catRows[0].id;

  let pos = 10;
  for (const p of PRODUCTS) {
    const minPrice = Math.min(...p.variants.map((v) => v[1]));
    const ins = await c.query(
      `insert into products
         (slug, name, description, price, image_path, tone, category_id,
          is_active, position, delivery_type, supply_source)
       values ($1,$2,$3,$4,'/products/placeholder.svg',$5,$6,true,$7,'service','smm')
       on conflict (slug) do update set
         name=excluded.name, description=excluded.description, price=excluded.price,
         image_path='/products/placeholder.svg',
         tone=excluded.tone, category_id=excluded.category_id,
         delivery_type='service', supply_source='smm', is_active=true
       returning id`,
      [p.slug, p.name, p.desc, minPrice, p.tone, categoryId, pos],
    );
    const productId = ins.rows[0].id;
    pos += 10;

    // Varyant ekleme (order-güvenli, idempotent):
    // Order'a bağlı OLMAYAN mevcut varyantları sil; order'lı varyantlar korunur.
    // Sonra bu üründe HENÜZ olmayan (label bazlı) varyantları ekle.
    await c.query(
      `delete from product_variants pv
       where pv.product_id = $1
         and not exists (select 1 from orders o where o.variant_id = pv.id)`,
      [productId],
    );
    let vpos = 10;
    for (const [qty, price] of p.variants) {
      const label = fmtLabel(qty);
      const { rows: ex } = await c.query(
        "select 1 from product_variants where product_id = $1 and label = $2 limit 1",
        [productId, label],
      );
      if (ex.length) {
        // Order'a bağlı olduğu için korunan varyant — fiyat/servis bilgisini güncelle.
        await c.query(
          `update product_variants
             set price = $3, position = $4, is_active = true,
                 supplier_service_id = $5, supplier_quantity = $6
           where product_id = $1 and label = $2`,
          [productId, label, price, vpos, String(p.service), qty],
        );
      } else {
        await c.query(
          `insert into product_variants
             (product_id, label, price, position, is_active,
              supplier_service_id, supplier_quantity)
           values ($1,$2,$3,$4,true,$5,$6)`,
          [productId, label, price, vpos, String(p.service), qty],
        );
      }
      vpos += 10;
    }
  }

  await c.query("commit");

  const { rows: cnt } = await c.query(
    "select count(*) c from products where supply_source = 'smm'",
  );
  const { rows: vcnt } = await c.query(
    `select count(*) c from product_variants pv
     join products p on p.id = pv.product_id where p.supply_source='smm'`,
  );
  console.log("SMM ürün:", cnt[0].c, "| varyant:", vcnt[0].c);
  await c.end();
})().catch((e) => {
  console.error("HATA:", e.message);
  process.exit(1);
});
