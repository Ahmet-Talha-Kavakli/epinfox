-- Markaların image_path'i, optimize sırasında SİLİNEN eski uzantılara (.jpg/.png)
-- bakıyordu → kırık. Hepsini ilgili ürünün yeni .webp'sine bağla.
-- Ayrıca eski .svg / null / placeholder kalan birkaç ürünü düzelt.

-- ── MARKALAR (brand sayfaları) ──
update brands set image_path = '/products/pubg-mobile-uc.webp'           where slug = 'pubg-mobile';
update brands set image_path = '/products/lol-rp.webp'                   where slug = 'league-of-legends';
update brands set image_path = '/products/free-fire-diamond.webp'        where slug = 'free-fire';
update brands set image_path = '/products/mobile-legends-diamond.webp'   where slug = 'mobile-legends';
update brands set image_path = '/products/genshin-genesis-crystals.webp' where slug = 'genshin-impact';
update brands set image_path = '/products/valorant-vp.webp'              where slug = 'valorant';
update brands set image_path = '/products/tiktok-takipci.webp'           where slug = 'tiktok';
update brands set image_path = '/products/twitter-takipci.webp'          where slug = 'twitter';
update brands set image_path = '/products/youtube-izlenme.webp'          where slug = 'youtube';
update brands set image_path = '/products/steam-wallet-usd.webp'         where slug = 'steam';
update brands set image_path = '/products/instagram-begeni.webp'         where slug = 'instagram';
update brands set image_path = '/products/clash-of-clans-gems.png'       where slug = 'clash-of-clans';
update brands set image_path = '/products/brawl-stars-gems.webp'         where slug = 'brawl-stars';
update brands set image_path = '/products/roblox-robux.webp'             where slug = 'roblox';
update brands set image_path = '/products/telegram-uye.webp'             where slug = 'telegram';

-- ── ÜRÜNLER (eski .svg / null / placeholder) ──
update products set image_path = '/products/razer-gold-tr.webp'    where slug = 'razer-gold';        -- eski .svg
update products set image_path = '/products/brawl-stars-gems.webp' where slug = 'brawl-stars-gems';  -- eski .svg
update products set image_path = '/products/zula-gold.jpg'         where slug = 'zula-gold';          -- null idi
update products set image_path = '/products/tiktok-begeni.webp'    where slug = 'tiktok-begeni';      -- placeholder idi
