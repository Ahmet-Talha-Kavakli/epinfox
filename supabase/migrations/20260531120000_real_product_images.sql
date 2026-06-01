-- Üretilen gerçek ürün görsellerini bağla (placeholder'dan çıkar).
-- Dosyalar public/products/<slug>.<ext> olarak eklendi.

-- Grup 1 (oyun e-pin)
update products set image_path = '/products/pubg-mobile-uc.png'            where slug = 'pubg-mobile-uc';
update products set image_path = '/products/lol-rp.png'                    where slug = 'lol-rp';
update products set image_path = '/products/free-fire-diamond.png'         where slug = 'free-fire-diamond';
update products set image_path = '/products/mobile-legends-diamond.png'    where slug = 'mobile-legends-diamond';
update products set image_path = '/products/genshin-genesis-crystals.png'  where slug = 'genshin-genesis-crystals';
update products set image_path = '/products/genshin-welkin-moon.png'       where slug = 'genshin-welkin-moon';
update products set image_path = '/products/honkai-star-rail-oneiric.png'  where slug = 'honkai-star-rail-oneiric';
update products set image_path = '/products/cod-mobile-cp.png'             where slug = 'cod-mobile-cp';
update products set image_path = '/products/apex-legends-coins.png'        where slug = 'apex-legends-coins';
update products set image_path = '/products/fortnite-vbucks.png'           where slug = 'fortnite-vbucks';
update products set image_path = '/products/ea-fc-mobile-points.png'       where slug = 'ea-fc-mobile-points';
update products set image_path = '/products/wuthering-waves-lunite.png'    where slug = 'wuthering-waves-lunite';
update products set image_path = '/products/metin2-ep.png'                 where slug = 'metin2-ep';
update products set image_path = '/products/clash-royale-gems.png'         where slug = 'clash-royale-gems';
update products set image_path = '/products/cs2-prime.jpg'                 where slug = 'cs2-prime';
update products set image_path = '/products/roblox-robux.webp'             where slug = 'roblox-robux';
update products set image_path = '/products/valorant-vp.jpg'               where slug = 'valorant-vp';
update products set image_path = '/products/zepeto-zem.png'                where slug = 'zepeto-zem';
update products set image_path = '/products/brawl-stars-brawl-pass.webp'   where slug = 'brawl-stars-brawl-pass';
update products set image_path = '/products/brawl-stars-pro-pass.webp'     where slug = 'brawl-stars-pro-pass';

-- Grup 2 (oyun + platform bakiye)
update products set image_path = '/products/knight-online-cash.png'          where slug = 'knight-online-cash';
update products set image_path = '/products/knight-online-premium.png'       where slug = 'knight-online-premium';
update products set image_path = '/products/brawlhalla-mammoth-coins.png'    where slug = 'brawlhalla-mammoth-coins';
update products set image_path = '/products/marvel-rivals-lattice.png'       where slug = 'marvel-rivals-lattice';
update products set image_path = '/products/world-of-warcraft-game-time.png' where slug = 'world-of-warcraft-game-time';
update products set image_path = '/products/playstation-store.png'           where slug = 'playstation-store';
update products set image_path = '/products/xbox-microsoft.png'              where slug = 'xbox-microsoft';
update products set image_path = '/products/amazon-gift-card.png'            where slug = 'amazon-gift-card';
update products set image_path = '/products/netflix-gift-card.png'           where slug = 'netflix-gift-card';
update products set image_path = '/products/google-play.png'                 where slug = 'google-play';
update products set image_path = '/products/itunes-app-store.png'            where slug = 'itunes-app-store';
update products set image_path = '/products/nintendo-eshop.png'              where slug = 'nintendo-eshop';
update products set image_path = '/products/spotify-gift-card.png'           where slug = 'spotify-gift-card';
update products set image_path = '/products/playstation-plus-card.png'       where slug = 'playstation-plus-card';
update products set image_path = '/products/razer-gold-tr.png'               where slug = 'razer-gold-tr';
update products set image_path = '/products/steam-wallet-usd.png'            where slug = 'steam-wallet-usd';
update products set image_path = '/products/netflix.png'                     where slug = 'netflix';
update products set image_path = '/products/discord-nitro.png'               where slug = 'discord-nitro';
update products set image_path = '/products/paysafecard.png'                 where slug = 'paysafecard';

-- Grup 3 (abonelik + instagram smm)
update products set image_path = '/products/spotify-premium.png'             where slug = 'spotify-premium';
update products set image_path = '/products/youtube-premium.png'             where slug = 'youtube-premium';
update products set image_path = '/products/ps-plus.png'                     where slug = 'ps-plus';
update products set image_path = '/products/hbo-max.png'                     where slug = 'hbo-max';
update products set image_path = '/products/amazon-prime-video.png'          where slug = 'amazon-prime-video';
update products set image_path = '/products/crunchyroll.png'                 where slug = 'crunchyroll';
update products set image_path = '/products/apple-music.png'                 where slug = 'apple-music';
update products set image_path = '/products/apple-tv-plus.png'               where slug = 'apple-tv-plus';
update products set image_path = '/products/tinder-gold.png'                 where slug = 'tinder-gold';
update products set image_path = '/products/twitch-turbo.png'                where slug = 'twitch-turbo';
update products set image_path = '/products/duolingo-super.png'              where slug = 'duolingo-super';
update products set image_path = '/products/chatgpt-plus.png'                where slug = 'chatgpt-plus';
update products set image_path = '/products/canva-pro.png'                   where slug = 'canva-pro';
update products set image_path = '/products/disney-plus.png'                 where slug = 'disney-plus';
update products set image_path = '/products/instagram-begeni.png'            where slug = 'instagram-begeni';
update products set image_path = '/products/instagram-otomatik-begeni.png'   where slug = 'instagram-otomatik-begeni';
update products set image_path = '/products/instagram-reels-izlenme.png'     where slug = 'instagram-reels-izlenme';
update products set image_path = '/products/instagram-yorum.png'             where slug = 'instagram-yorum';
update products set image_path = '/products/xbox-game-pass.png'              where slug = 'xbox-game-pass';

-- Grup 4 (smm + yazılım)
update products set image_path = '/products/tiktok-takipci.png'              where slug = 'tiktok-takipci';
update products set image_path = '/products/tiktok-izlenme.png'              where slug = 'tiktok-izlenme';
update products set image_path = '/products/youtube-izlenme.png'             where slug = 'youtube-izlenme';
update products set image_path = '/products/youtube-abone.png'               where slug = 'youtube-abone';
update products set image_path = '/products/twitter-takipci.png'             where slug = 'twitter-takipci';
update products set image_path = '/products/twitter-begeni.png'              where slug = 'twitter-begeni';
update products set image_path = '/products/twitter-retweet.png'             where slug = 'twitter-retweet';
update products set image_path = '/products/telegram-uye.png'                where slug = 'telegram-uye';
update products set image_path = '/products/facebook-takipci.png'            where slug = 'facebook-takipci';
update products set image_path = '/products/facebook-sayfa-begeni.png'       where slug = 'facebook-sayfa-begeni';
update products set image_path = '/products/twitch-takipci.png'              where slug = 'twitch-takipci';
update products set image_path = '/products/twitch-izleyici.png'             where slug = 'twitch-izleyici';
update products set image_path = '/products/discord-uye.png'                 where slug = 'discord-uye';
update products set image_path = '/products/spotify-dinlenme.png'            where slug = 'spotify-dinlenme';
update products set image_path = '/products/spotify-aylik-dinleyici.png'     where slug = 'spotify-aylik-dinleyici';
update products set image_path = '/products/kick-takipci.png'                where slug = 'kick-takipci';
update products set image_path = '/products/snapchat-takipci.png'            where slug = 'snapchat-takipci';
update products set image_path = '/products/windows-11-pro.png'              where slug = 'windows-11-pro';
update products set image_path = '/products/windows-10-pro.png'              where slug = 'windows-10-pro';
update products set image_path = '/products/office-2021-pro.png'             where slug = 'office-2021-pro';

-- Grup 5 (yazılım + güvenlik)
update products set image_path = '/products/office-365.png'                  where slug = 'office-365';
update products set image_path = '/products/mcafee-total.png'                where slug = 'mcafee-total';
update products set image_path = '/products/kaspersky.png'                   where slug = 'kaspersky';
update products set image_path = '/products/bitdefender.png'                 where slug = 'bitdefender';
update products set image_path = '/products/malwarebytes.png'                where slug = 'malwarebytes';
update products set image_path = '/products/adobe-creative-cloud.png'        where slug = 'adobe-creative-cloud';
update products set image_path = '/products/ea-play.png'                     where slug = 'ea-play';
update products set image_path = '/products/ubisoft-plus.png'                where slug = 'ubisoft-plus';
update products set image_path = '/products/nordvpn.png'                     where slug = 'nordvpn';
update products set image_path = '/products/game-pass-pc.png'                where slug = 'game-pass-pc';
update products set image_path = '/products/eset-antivirus.png'              where slug = 'eset-antivirus';
