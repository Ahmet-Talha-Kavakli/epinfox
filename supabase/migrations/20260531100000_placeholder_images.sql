-- Kullanıcının belirttiği ürünlerin görsellerini placeholder'a çevir.
-- Gerçek görseller üretilince image_path tekrar güncellenecek.
-- Placeholder: /products/placeholder.svg

update products
set image_path = '/products/placeholder.svg'
where slug in (
  'pubg-mobile-uc',
  'lol-rp',
  'netflix',
  'valorant-vp',
  'tiktok-takipci',
  'google-play',
  'instagram-begeni',
  'instagram-izlenme',
  'free-fire-diamond',
  'mobile-legends-diamond',
  'tiktok-izlenme',
  'youtube-izlenme',
  'genshin-genesis-crystals',
  'youtube-abone',
  'roblox-robux',
  'cs2-prime',
  'playstation-store',
  'xbox-microsoft',
  'itunes-app-store',
  'amazon-gift-card',
  'discord-nitro',
  'spotify-premium',
  'youtube-premium',
  'xbox-game-pass',
  'ps-plus',
  'windows-11-pro',
  'office-2021-pro',
  'eset-antivirus',
  'twitter-takipci',
  'knight-online-cash',
  'telegram-uye'
);
