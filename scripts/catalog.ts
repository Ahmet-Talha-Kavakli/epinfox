// KodKasa ürün kataloğu — tek kaynak. seed-catalog + logo indirme bunu kullanır.
// icon: SimpleIcons slug'ı (https://simpleicons.org). brand: logo arkaplan rengi (hex).

export type CatalogVariant = {
  label: string;
  price: number;
  compare_at?: number;
  bonus_pct?: number;
};

export type CatalogProduct = {
  slug: string;
  name: string;
  category: "oyun-epin" | "platform-bakiye" | "abonelik" | "dijital-hizmet";
  description: string;
  tone: string;
  icon: string | null; // SimpleIcons slug
  brand: string; // logo kart zemini rengi
  variants: CatalogVariant[];
  /** true ise image_path = /products/placeholder.svg olur (gerçek görsel henüz yok). */
  placeholder?: boolean;
};

/** Gerçek görseli henüz olmayan, placeholder gösterilecek ürün slug'ları.
 *  seed-catalog bunları /products/placeholder.svg ile yazar. Görsel üretilince
 *  buradan çıkar + /products/<slug>.svg ekle. */
export const PLACEHOLDER_SLUGS = new Set<string>([
  // İlk dalga (kullanıcı isteği)
  "pubg-mobile-uc", "lol-rp", "netflix", "valorant-vp", "google-play",
  "free-fire-diamond", "mobile-legends-diamond", "genshin-genesis-crystals",
  "roblox-robux", "cs2-prime", "playstation-store", "xbox-microsoft",
  "itunes-app-store", "amazon-gift-card", "discord-nitro", "spotify-premium",
  "youtube-premium", "xbox-game-pass", "ps-plus", "windows-11-pro",
  "office-2021-pro", "eset-antivirus", "knight-online-cash",
  // Yeni eklenen tüm ürünler (henüz görsel yok)
  "genshin-welkin-moon", "brawl-stars-brawl-pass", "brawl-stars-pro-pass",
  "honkai-star-rail-oneiric", "cod-mobile-cp", "apex-legends-coins",
  "fortnite-vbucks", "clash-royale-gems", "ea-fc-mobile-points",
  "wuthering-waves-lunite", "zepeto-zem", "metin2-ep", "knight-online-premium",
  "valorant-battle-pass", "brawlhalla-mammoth-coins", "marvel-rivals-lattice",
  "world-of-warcraft-game-time", "razer-gold-tr", "nintendo-eshop",
  "steam-wallet-usd", "netflix-gift-card", "spotify-gift-card",
  "playstation-plus-card", "paysafecard", "hbo-max", "amazon-prime-video",
  "crunchyroll", "apple-music", "apple-tv-plus", "tinder-gold", "twitch-turbo",
  "duolingo-super", "chatgpt-plus", "canva-pro", "office-365", "windows-10-pro",
  "mcafee-total", "kaspersky", "bitdefender", "malwarebytes",
  "adobe-creative-cloud", "game-pass-pc", "ea-play", "ubisoft-plus",
]);

export const CATALOG: CatalogProduct[] = [
  // ───────── OYUN E-PIN ─────────
  { slug: "pubg-mobile-uc", name: "PUBG Mobile UC", category: "oyun-epin", description: "PUBG Mobile için anında UC; kasa ve battle pass.", tone: "warning", icon: "pubg", brand: "#F2A900", variants: [
    { label: "60 UC", price: 41.99, compare_at: 44.99 },
    { label: "325 UC", price: 188.99, compare_at: 199.99 },
    { label: "660 UC", price: 374.99, compare_at: 399.99, bonus_pct: 1 },
    { label: "1800 UC", price: 929.99, compare_at: 989.99, bonus_pct: 2 },
    { label: "3850 UC", price: 1849.99, compare_at: 1949.99, bonus_pct: 2 },
    { label: "8100 UC", price: 3749.99, compare_at: 3949.99, bonus_pct: 3 },
  ]},
  { slug: "valorant-vp", name: "Valorant VP", category: "oyun-epin", description: "Valorant silah kaplamaları ve battle pass için VP.", tone: "danger", icon: "valorant", brand: "#FF4655", variants: [
    { label: "475 VP", price: 128.95, compare_at: 134.99 },
    { label: "1000 VP", price: 268.66, compare_at: 279.99 },
    { label: "2050 VP", price: 537.3, compare_at: 559.99, bonus_pct: 1 },
    { label: "3650 VP", price: 913.42, compare_at: 949.99, bonus_pct: 2 },
    { label: "5350 VP", price: 1321.76, compare_at: 1379.99, bonus_pct: 2 },
    { label: "11000 VP", price: 2649.99, compare_at: 2799.99, bonus_pct: 3 },
  ]},
  { slug: "lol-rp", name: "League of Legends RP", category: "oyun-epin", description: "LoL şampiyon, kostüm ve sandık için RP.", tone: "info", icon: "leagueoflegends", brand: "#C28F2C", variants: [
    { label: "200 RP", price: 64.99, compare_at: 69.99 },
    { label: "850 RP", price: 249.99, compare_at: 264.99 },
    { label: "1675 RP", price: 479.99, compare_at: 509.99, bonus_pct: 1 },
    { label: "3125 RP", price: 879.99, compare_at: 929.99, bonus_pct: 2 },
    { label: "5000 RP", price: 1379.99, compare_at: 1449.99, bonus_pct: 2 },
  ]},
  { slug: "free-fire-diamond", name: "Free Fire Elmas", category: "oyun-epin", description: "Free Fire elmas; kostüm, karakter ve elite pass.", tone: "warning", icon: "garena", brand: "#FF6B00", variants: [
    { label: "100 Elmas", price: 39.99, compare_at: 42.99 },
    { label: "310 Elmas", price: 114.99, compare_at: 124.99 },
    { label: "520 Elmas", price: 189.99, compare_at: 199.99, bonus_pct: 1 },
    { label: "1080 Elmas", price: 379.99, compare_at: 399.99, bonus_pct: 2 },
    { label: "2200 Elmas", price: 749.99, compare_at: 789.99, bonus_pct: 2 },
  ]},
  { slug: "mobile-legends-diamond", name: "Mobile Legends Elmas", category: "oyun-epin", description: "MLBB elmas; kahraman, skin ve starlight.", tone: "info", icon: null, brand: "#1E90FF", variants: [
    { label: "86 Elmas", price: 49.99, compare_at: 54.99 },
    { label: "172 Elmas", price: 94.99, compare_at: 99.99 },
    { label: "257 Elmas", price: 139.99, compare_at: 149.99, bonus_pct: 1 },
    { label: "706 Elmas", price: 369.99, compare_at: 389.99, bonus_pct: 2 },
    { label: "1412 Elmas", price: 719.99, compare_at: 759.99, bonus_pct: 2 },
  ]},
  { slug: "brawl-stars-gems", name: "Brawl Stars Gems", category: "oyun-epin", description: "Brawl Stars gems; brawl pass ve skin.", tone: "warning", icon: "supercell", brand: "#7B2FF7", variants: [
    { label: "30 Gems", price: 59.99, compare_at: 64.99 },
    { label: "80 Gems", price: 149.99, compare_at: 159.99 },
    { label: "170 Gems", price: 299.99, compare_at: 319.99, bonus_pct: 1 },
    { label: "360 Gems", price: 599.99, compare_at: 639.99, bonus_pct: 2 },
    { label: "950 Gems", price: 1499.99, compare_at: 1599.99, bonus_pct: 2 },
  ]},
  { slug: "clash-of-clans-gems", name: "Clash of Clans Elmas", category: "oyun-epin", description: "CoC gem; bina, asker ve gold pass.", tone: "success", icon: "supercell", brand: "#8E5A2D", variants: [
    { label: "80 Gems", price: 59.99, compare_at: 64.99 },
    { label: "500 Gems", price: 299.99, compare_at: 319.99 },
    { label: "1200 Gems", price: 599.99, compare_at: 639.99, bonus_pct: 1 },
    { label: "2500 Gems", price: 1199.99, compare_at: 1259.99, bonus_pct: 2 },
  ]},
  { slug: "genshin-genesis-crystals", name: "Genshin Impact Crystals", category: "oyun-epin", description: "Genesis Crystals; tılsım ve dilek.", tone: "info", icon: null, brand: "#4FC3F7", variants: [
    { label: "60 Crystals", price: 39.99, compare_at: 42.99 },
    { label: "330 Crystals", price: 189.99, compare_at: 199.99 },
    { label: "1090 Crystals", price: 599.99, compare_at: 639.99, bonus_pct: 1 },
    { label: "2240 Crystals", price: 1199.99, compare_at: 1259.99, bonus_pct: 2 },
    { label: "3880 Crystals", price: 1999.99, compare_at: 2099.99, bonus_pct: 2 },
  ]},
  { slug: "roblox-robux", name: "Roblox Robux", category: "oyun-epin", description: "Roblox Robux; oyun içi öğe ve premium.", tone: "danger", icon: "roblox", brand: "#E2231A", variants: [
    { label: "400 Robux", price: 159.99, compare_at: 169.99 },
    { label: "800 Robux", price: 299.99, compare_at: 319.99 },
    { label: "1700 Robux", price: 599.99, compare_at: 639.99, bonus_pct: 1 },
    { label: "4500 Robux", price: 1499.99, compare_at: 1579.99, bonus_pct: 2 },
    { label: "10000 Robux", price: 2999.99, compare_at: 3199.99, bonus_pct: 3 },
  ]},
  { slug: "knight-online-cash", name: "Knight Online Cash", category: "oyun-epin", description: "Knight Online premium ve cash (Goldbar).", tone: "brand", icon: null, brand: "#6D4AFF", variants: [
    { label: "400 Cash", price: 99.99, compare_at: 109.99 },
    { label: "800 Cash", price: 189.99, compare_at: 199.99, bonus_pct: 1 },
    { label: "1600 Cash", price: 359.99, compare_at: 379.99, bonus_pct: 2 },
    { label: "3200 Cash", price: 699.99, compare_at: 739.99, bonus_pct: 3 },
  ]},
  { slug: "zula-gold", name: "Zula Altın", category: "oyun-epin", description: "Yerli FPS Zula için altın; silah ve kostüm.", tone: "warning", icon: null, brand: "#E8A317", variants: [
    { label: "3000 Altın", price: 49.99, compare_at: 54.99 },
    { label: "5850 Altın", price: 94.99, compare_at: 99.99, bonus_pct: 1 },
    { label: "16250 Altın", price: 249.99, compare_at: 264.99, bonus_pct: 2 },
    { label: "34000 Altın", price: 499.99, compare_at: 529.99, bonus_pct: 2 },
  ]},
  { slug: "cs2-prime", name: "CS2 Prime Status", category: "oyun-epin", description: "Counter-Strike 2 Prime; matchmaking ve drop.", tone: "brand", icon: "counterstrike", brand: "#F0A92B", variants: [
    { label: "Prime Status Upgrade", price: 549.99, compare_at: 599.99 },
  ]},
  { slug: "genshin-welkin-moon", name: "Genshin Welkin Moon", category: "oyun-epin", description: "Blessing of the Welkin Moon; 30 gün boyunca günlük Primogem.", tone: "info", icon: null, brand: "#4FC3F7", variants: [
    { label: "Welkin Moon (30 Gün)", price: 159.99, compare_at: 179.99 },
    { label: "Welkin Moon x3 (90 Gün)", price: 459.99, compare_at: 509.99, bonus_pct: 2 },
  ]},
  { slug: "brawl-stars-brawl-pass", name: "Brawl Stars Brawl Pass", category: "oyun-epin", description: "Sezon ödülleri, skin ve gems içeren Brawl Pass.", tone: "warning", icon: "supercell", brand: "#7B2FF7", variants: [
    { label: "Brawl Pass", price: 169.99, compare_at: 189.99 },
    { label: "Brawl Pass Plus", price: 299.99, compare_at: 329.99, bonus_pct: 1 },
  ]},
  { slug: "brawl-stars-pro-pass", name: "Brawl Stars Pro Pass", category: "oyun-epin", description: "Brawl Stars Pro Pass; en üst kademe sezon ödülleri.", tone: "warning", icon: "supercell", brand: "#7B2FF7", variants: [
    { label: "Pro Pass", price: 449.99, compare_at: 499.99 },
  ]},
  { slug: "honkai-star-rail-oneiric", name: "Honkai: Star Rail Oneiric Shard", category: "oyun-epin", description: "Honkai: Star Rail Oneiric Shard; Warp ve battle pass.", tone: "brand", icon: null, brand: "#5B7CFA", variants: [
    { label: "60 Shard", price: 39.99, compare_at: 44.99 },
    { label: "330 Shard", price: 189.99, compare_at: 199.99 },
    { label: "1090 Shard", price: 599.99, compare_at: 639.99, bonus_pct: 1 },
    { label: "3880 Shard", price: 1999.99, compare_at: 2099.99, bonus_pct: 2 },
  ]},
  { slug: "cod-mobile-cp", name: "Call of Duty Mobile CP", category: "oyun-epin", description: "COD Mobile CP; battle pass, sandık ve blueprint.", tone: "neutral", icon: "callofduty", brand: "#1A1A1A", variants: [
    { label: "80 CP", price: 39.99, compare_at: 44.99 },
    { label: "400 CP", price: 189.99, compare_at: 199.99 },
    { label: "800 CP", price: 369.99, compare_at: 389.99, bonus_pct: 1 },
    { label: "2000 CP", price: 899.99, compare_at: 949.99, bonus_pct: 2 },
    { label: "5000 CP", price: 2199.99, compare_at: 2299.99, bonus_pct: 2 },
  ]},
  { slug: "apex-legends-coins", name: "Apex Legends Coins", category: "oyun-epin", description: "Apex Coins; battle pass, skin ve apex paketleri.", tone: "danger", icon: "apexlegends", brand: "#DA292A", variants: [
    { label: "1000 Coins", price: 269.99, compare_at: 289.99 },
    { label: "2150 Coins", price: 549.99, compare_at: 579.99, bonus_pct: 1 },
    { label: "4350 Coins", price: 1049.99, compare_at: 1099.99, bonus_pct: 2 },
    { label: "11500 Coins", price: 2599.99, compare_at: 2749.99, bonus_pct: 3 },
  ]},
  { slug: "fortnite-vbucks", name: "Fortnite V-Bucks", category: "oyun-epin", description: "Fortnite V-Bucks; outfit, battle pass ve emote.", tone: "info", icon: "epicgames", brand: "#2A2A6C", variants: [
    { label: "1000 V-Bucks", price: 239.99, compare_at: 259.99 },
    { label: "2800 V-Bucks", price: 619.99, compare_at: 659.99, bonus_pct: 1 },
    { label: "5000 V-Bucks", price: 1049.99, compare_at: 1119.99, bonus_pct: 2 },
    { label: "13500 V-Bucks", price: 2699.99, compare_at: 2849.99, bonus_pct: 3 },
  ]},
  { slug: "clash-royale-gems", name: "Clash Royale Gems", category: "oyun-epin", description: "Clash Royale gem; sandık, pass royale ve kart.", tone: "info", icon: "supercell", brand: "#1E6FB8", variants: [
    { label: "80 Gems", price: 59.99, compare_at: 64.99 },
    { label: "500 Gems", price: 299.99, compare_at: 319.99 },
    { label: "1200 Gems", price: 599.99, compare_at: 639.99, bonus_pct: 1 },
    { label: "2500 Gems", price: 1199.99, compare_at: 1259.99, bonus_pct: 2 },
  ]},
  { slug: "ea-fc-mobile-points", name: "EA FC Mobile Points", category: "oyun-epin", description: "EA SPORTS FC Mobile FC Points; paket ve oyuncu.", tone: "success", icon: "ea", brand: "#0A0A0A", variants: [
    { label: "100 Points", price: 49.99, compare_at: 54.99 },
    { label: "500 Points", price: 229.99, compare_at: 249.99 },
    { label: "1050 Points", price: 449.99, compare_at: 479.99, bonus_pct: 1 },
    { label: "2200 Points", price: 899.99, compare_at: 949.99, bonus_pct: 2 },
  ]},
  { slug: "wuthering-waves-lunite", name: "Wuthering Waves Lunite", category: "oyun-epin", description: "Wuthering Waves Lunite Subscription ve oblique.", tone: "brand", icon: null, brand: "#3FB6D3", variants: [
    { label: "60 Lunite", price: 39.99, compare_at: 44.99 },
    { label: "330 Lunite", price: 189.99, compare_at: 199.99 },
    { label: "1090 Lunite", price: 599.99, compare_at: 639.99, bonus_pct: 1 },
    { label: "3880 Lunite", price: 1999.99, compare_at: 2099.99, bonus_pct: 2 },
  ]},
  { slug: "zepeto-zem", name: "Zepeto Zem", category: "oyun-epin", description: "Zepeto Zem; avatar kıyafet ve item.", tone: "accent", icon: null, brand: "#FF5A8C", variants: [
    { label: "120 Zem", price: 49.99, compare_at: 54.99 },
    { label: "350 Zem", price: 139.99, compare_at: 149.99 },
    { label: "700 Zem", price: 269.99, compare_at: 289.99, bonus_pct: 1 },
  ]},
  { slug: "metin2-ep", name: "Metin2 EP", category: "oyun-epin", description: "Metin2 EP; kostüm, at ve oyun içi item.", tone: "warning", icon: null, brand: "#C0392B", variants: [
    { label: "30 EP", price: 49.99, compare_at: 54.99 },
    { label: "75 EP", price: 119.99, compare_at: 129.99 },
    { label: "150 EP", price: 229.99, compare_at: 249.99, bonus_pct: 1 },
    { label: "300 EP", price: 449.99, compare_at: 479.99, bonus_pct: 2 },
  ]},
  { slug: "knight-online-premium", name: "Knight Online Premium", category: "oyun-epin", description: "Knight Online premium üyelik (Power Up / Premium).", tone: "brand", icon: null, brand: "#6D4AFF", variants: [
    { label: "Premium 7 Gün", price: 49.99, compare_at: 54.99 },
    { label: "Premium 30 Gün", price: 159.99, compare_at: 169.99, bonus_pct: 1 },
    { label: "Premium 90 Gün", price: 429.99, compare_at: 459.99, bonus_pct: 2 },
  ]},
  { slug: "valorant-battle-pass", name: "Valorant Battle Pass", category: "oyun-epin", description: "Valorant sezon savaş bileti; skin ve oyun içi ödül.", tone: "danger", icon: "valorant", brand: "#FF4655", variants: [
    { label: "Sezon Battle Pass", price: 269.99, compare_at: 289.99 },
  ]},
  { slug: "brawlhalla-mammoth-coins", name: "Brawlhalla Mammoth Coins", category: "oyun-epin", description: "Brawlhalla Mammoth Coins; skin, legend ve emote.", tone: "info", icon: null, brand: "#2D9CDB", variants: [
    { label: "300 Coins", price: 89.99, compare_at: 99.99 },
    { label: "700 Coins", price: 189.99, compare_at: 199.99 },
    { label: "1400 Coins", price: 349.99, compare_at: 369.99, bonus_pct: 1 },
  ]},
  { slug: "marvel-rivals-lattice", name: "Marvel Rivals Lattice", category: "oyun-epin", description: "Marvel Rivals Lattice / Units; battle pass ve kostüm.", tone: "danger", icon: null, brand: "#E23636", variants: [
    { label: "500 Lattice", price: 129.99, compare_at: 139.99 },
    { label: "1000 Lattice", price: 249.99, compare_at: 269.99, bonus_pct: 1 },
    { label: "2500 Lattice", price: 599.99, compare_at: 639.99, bonus_pct: 2 },
  ]},
  { slug: "world-of-warcraft-game-time", name: "World of Warcraft Game Time", category: "oyun-epin", description: "WoW oyun süresi; 30/60 günlük abonelik.", tone: "warning", icon: "battlenet", brand: "#148EFF", variants: [
    { label: "30 Gün", price: 549.99, compare_at: 599.99 },
    { label: "60 Gün", price: 1049.99, compare_at: 1149.99, bonus_pct: 1 },
  ]},

  // ───────── PLATFORM BAKİYE ─────────
  { slug: "steam-wallet", name: "Steam Cüzdan Kodu", category: "platform-bakiye", description: "Steam cüzdanına TL; oyun, DLC ve item.", tone: "brand", icon: "steam", brand: "#1B2838", variants: [
    { label: "50 TL", price: 52.99, compare_at: 54.99 },
    { label: "100 TL", price: 104.99, compare_at: 108.99 },
    { label: "250 TL", price: 259.99, compare_at: 269.99 },
    { label: "500 TL", price: 514.99, compare_at: 529.99, bonus_pct: 1 },
    { label: "1000 TL", price: 1019.99, compare_at: 1049.99, bonus_pct: 1 },
  ]},
  { slug: "google-play", name: "Google Play Hediye Kartı", category: "platform-bakiye", description: "Google Play bakiyesi; uygulama, oyun, abonelik.", tone: "success", icon: "googleplay", brand: "#01875F", variants: [
    { label: "50 TL", price: 52.99, compare_at: 54.99 },
    { label: "100 TL", price: 104.99, compare_at: 108.99 },
    { label: "250 TL", price: 259.99, compare_at: 269.99 },
    { label: "500 TL", price: 514.99, compare_at: 529.99, bonus_pct: 1 },
  ]},
  { slug: "playstation-store", name: "PlayStation Store Kartı", category: "platform-bakiye", description: "PSN cüzdanına TL; oyun, DLC ve abonelik.", tone: "info", icon: "playstation", brand: "#003791", variants: [
    { label: "100 TL", price: 104.99, compare_at: 108.99 },
    { label: "250 TL", price: 259.99, compare_at: 269.99 },
    { label: "500 TL", price: 514.99, compare_at: 529.99, bonus_pct: 1 },
    { label: "1000 TL", price: 1019.99, compare_at: 1049.99, bonus_pct: 1 },
  ]},
  { slug: "xbox-microsoft", name: "Xbox / Microsoft Kartı", category: "platform-bakiye", description: "Microsoft Store bakiyesi; Xbox oyun ve uygulama.", tone: "success", icon: "xbox", brand: "#107C10", variants: [
    { label: "100 TL", price: 104.99, compare_at: 108.99 },
    { label: "250 TL", price: 259.99, compare_at: 269.99 },
    { label: "500 TL", price: 514.99, compare_at: 529.99, bonus_pct: 1 },
  ]},
  { slug: "itunes-app-store", name: "iTunes & App Store Kartı", category: "platform-bakiye", description: "Apple bakiyesi; App Store, iCloud ve abonelik.", tone: "brand", icon: "apple", brand: "#555555", variants: [
    { label: "100 TL", price: 104.99, compare_at: 108.99 },
    { label: "250 TL", price: 259.99, compare_at: 269.99 },
    { label: "500 TL", price: 514.99, compare_at: 529.99, bonus_pct: 1 },
  ]},
  { slug: "razer-gold", name: "Razer Gold", category: "platform-bakiye", description: "Binlerce oyun için global Razer Gold bakiyesi.", tone: "success", icon: "razer", brand: "#44D62C", variants: [
    { label: "5 USD", price: 199.99, compare_at: 209.99 },
    { label: "10 USD", price: 389.99, compare_at: 409.99 },
    { label: "20 USD", price: 769.99, compare_at: 799.99, bonus_pct: 1 },
    { label: "50 USD", price: 1899.99, compare_at: 1969.99, bonus_pct: 2 },
  ]},
  { slug: "amazon-gift-card", name: "Amazon Hediye Kartı", category: "platform-bakiye", description: "Amazon bakiyesi; milyonlarca ürün ve içerik.", tone: "warning", icon: "amazon", brand: "#FF9900", variants: [
    { label: "10 USD", price: 389.99, compare_at: 409.99 },
    { label: "25 USD", price: 949.99, compare_at: 989.99 },
    { label: "50 USD", price: 1899.99, compare_at: 1969.99, bonus_pct: 1 },
  ]},
  { slug: "razer-gold-tr", name: "Razer Gold (TR)", category: "platform-bakiye", description: "Türkiye Razer Gold bakiyesi; binlerce oyun.", tone: "success", icon: "razer", brand: "#44D62C", variants: [
    { label: "50 TL", price: 52.99, compare_at: 54.99 },
    { label: "100 TL", price: 104.99, compare_at: 108.99 },
    { label: "250 TL", price: 259.99, compare_at: 269.99 },
    { label: "500 TL", price: 514.99, compare_at: 529.99, bonus_pct: 1 },
  ]},
  { slug: "nintendo-eshop", name: "Nintendo eShop Kartı", category: "platform-bakiye", description: "Nintendo Switch eShop bakiyesi; oyun ve DLC.", tone: "danger", icon: "nintendoswitch", brand: "#E60012", variants: [
    { label: "100 TL", price: 104.99, compare_at: 108.99 },
    { label: "250 TL", price: 259.99, compare_at: 269.99 },
    { label: "500 TL", price: 514.99, compare_at: 529.99, bonus_pct: 1 },
  ]},
  { slug: "steam-wallet-usd", name: "Steam Cüzdan (USD)", category: "platform-bakiye", description: "Global Steam cüzdan kodu (USD); oyun ve item.", tone: "brand", icon: "steam", brand: "#1B2838", variants: [
    { label: "5 USD", price: 209.99, compare_at: 219.99 },
    { label: "10 USD", price: 409.99, compare_at: 429.99 },
    { label: "20 USD", price: 799.99, compare_at: 839.99, bonus_pct: 1 },
    { label: "50 USD", price: 1949.99, compare_at: 2029.99, bonus_pct: 2 },
  ]},
  { slug: "netflix-gift-card", name: "Netflix Hediye Kartı", category: "platform-bakiye", description: "Netflix hesabına yüklenebilen hediye bakiyesi.", tone: "danger", icon: "netflix", brand: "#E50914", variants: [
    { label: "100 TL", price: 104.99, compare_at: 108.99 },
    { label: "250 TL", price: 259.99, compare_at: 269.99 },
    { label: "500 TL", price: 514.99, compare_at: 529.99, bonus_pct: 1 },
  ]},
  { slug: "spotify-gift-card", name: "Spotify Hediye Kartı", category: "platform-bakiye", description: "Spotify Premium için yüklenebilen hediye bakiyesi.", tone: "success", icon: "spotify", brand: "#1DB954", variants: [
    { label: "1 Aylık", price: 79.99, compare_at: 84.99 },
    { label: "3 Aylık", price: 219.99, compare_at: 239.99, bonus_pct: 1 },
    { label: "6 Aylık", price: 419.99, compare_at: 449.99, bonus_pct: 2 },
  ]},
  { slug: "playstation-plus-card", name: "PlayStation Plus Hediye Kartı", category: "platform-bakiye", description: "PS Plus üyeliği için hediye kart kodu.", tone: "info", icon: "playstation", brand: "#003791", variants: [
    { label: "Essential 3 Ay", price: 449.99, compare_at: 489.99 },
    { label: "Essential 12 Ay", price: 1099.99, compare_at: 1199.99, bonus_pct: 1 },
  ]},
  { slug: "paysafecard", name: "Paysafecard (Karekod)", category: "platform-bakiye", description: "Ön ödemeli paysafecard PIN; binlerce sitede geçerli.", tone: "brand", icon: null, brand: "#003D86", variants: [
    { label: "10 USD", price: 419.99, compare_at: 439.99 },
    { label: "25 USD", price: 1019.99, compare_at: 1069.99 },
    { label: "50 USD", price: 1999.99, compare_at: 2079.99, bonus_pct: 1 },
  ]},

  // ───────── ABONELİK ─────────
  { slug: "discord-nitro", name: "Discord Nitro", category: "abonelik", description: "Discord Nitro; HD yayın, büyük yükleme, rozet.", tone: "brand", icon: "discord", brand: "#5865F2", variants: [
    { label: "Nitro Basic 1 Ay", price: 37.99, compare_at: 39.99 },
    { label: "Nitro 1 Ay", price: 104.99, compare_at: 114.99 },
    { label: "Nitro Basic 1 Yıl", price: 379.99, compare_at: 399.99, bonus_pct: 1 },
    { label: "Nitro 1 Yıl", price: 1049.99, compare_at: 1099.99, bonus_pct: 2 },
  ]},
  { slug: "spotify-premium", name: "Spotify Premium", category: "abonelik", description: "Spotify Premium; reklamsız, çevrimdışı müzik.", tone: "success", icon: "spotify", brand: "#1DB954", variants: [
    { label: "Premium 1 Ay", price: 79.99, compare_at: 84.99 },
    { label: "Premium 3 Ay", price: 219.99, compare_at: 239.99, bonus_pct: 1 },
    { label: "Premium 1 Yıl", price: 799.99, compare_at: 859.99, bonus_pct: 2 },
  ]},
  { slug: "netflix", name: "Netflix Üyelik", category: "abonelik", description: "Netflix premium içerik; film ve dizi.", tone: "danger", icon: "netflix", brand: "#E50914", variants: [
    { label: "Standart 1 Ay", price: 199.99, compare_at: 219.99 },
    { label: "Premium 1 Ay", price: 279.99, compare_at: 299.99 },
    { label: "Premium 3 Ay", price: 799.99, compare_at: 849.99, bonus_pct: 1 },
  ]},
  { slug: "youtube-premium", name: "YouTube Premium", category: "abonelik", description: "Reklamsız izleme, arka plan ve Music dahil.", tone: "danger", icon: "youtube", brand: "#FF0000", variants: [
    { label: "Premium 1 Ay", price: 79.99, compare_at: 84.99 },
    { label: "Premium 3 Ay", price: 219.99, compare_at: 239.99, bonus_pct: 1 },
    { label: "Premium 1 Yıl", price: 799.99, compare_at: 859.99, bonus_pct: 2 },
  ]},
  { slug: "xbox-game-pass", name: "Xbox Game Pass Ultimate", category: "abonelik", description: "Yüzlerce oyun; konsol, PC ve bulut dahil.", tone: "success", icon: "xbox", brand: "#107C10", variants: [
    { label: "Ultimate 1 Ay", price: 209.99, compare_at: 229.99 },
    { label: "Ultimate 3 Ay", price: 599.99, compare_at: 649.99, bonus_pct: 1 },
  ]},
  { slug: "ps-plus", name: "PlayStation Plus", category: "abonelik", description: "PS Plus; çevrimiçi oyun, aylık oyunlar, katalog.", tone: "info", icon: "playstation", brand: "#003791", variants: [
    { label: "Essential 12 Ay", price: 1099.99, compare_at: 1199.99 },
    { label: "Extra 12 Ay", price: 1599.99, compare_at: 1749.99, bonus_pct: 1 },
    { label: "Deluxe 12 Ay", price: 1899.99, compare_at: 2099.99, bonus_pct: 2 },
  ]},
  { slug: "disney-plus", name: "Disney+ Üyelik", category: "abonelik", description: "Disney+; Marvel, Star Wars, film ve dizi.", tone: "info", icon: "disneyplus", brand: "#113CCF", variants: [
    { label: "Standart 1 Ay", price: 174.99, compare_at: 189.99 },
    { label: "Premium 1 Ay", price: 219.99, compare_at: 239.99 },
    { label: "Premium 1 Yıl", price: 1799.99, compare_at: 1949.99, bonus_pct: 2 },
  ]},
  { slug: "hbo-max", name: "HBO Max Üyelik", category: "abonelik", description: "HBO Max; orijinal diziler, film ve Warner içerikleri.", tone: "brand", icon: null, brand: "#8A2BE2", variants: [
    { label: "Standart 1 Ay", price: 159.99, compare_at: 174.99 },
    { label: "Standart 3 Ay", price: 429.99, compare_at: 469.99, bonus_pct: 1 },
    { label: "1 Yıl", price: 1499.99, compare_at: 1649.99, bonus_pct: 2 },
  ]},
  { slug: "amazon-prime-video", name: "Amazon Prime Video", category: "abonelik", description: "Prime Video; film, dizi ve orijinal yapımlar.", tone: "info", icon: "primevideo", brand: "#00A8E1", variants: [
    { label: "1 Ay", price: 99.99, compare_at: 109.99 },
    { label: "3 Ay", price: 269.99, compare_at: 289.99, bonus_pct: 1 },
    { label: "1 Yıl", price: 949.99, compare_at: 1049.99, bonus_pct: 2 },
  ]},
  { slug: "crunchyroll", name: "Crunchyroll Premium", category: "abonelik", description: "Crunchyroll; anime simulcast ve reklamsız izleme.", tone: "warning", icon: "crunchyroll", brand: "#F47521", variants: [
    { label: "Fan 1 Ay", price: 89.99, compare_at: 99.99 },
    { label: "Mega Fan 1 Ay", price: 119.99, compare_at: 129.99 },
    { label: "Mega Fan 1 Yıl", price: 1099.99, compare_at: 1199.99, bonus_pct: 2 },
  ]},
  { slug: "apple-music", name: "Apple Music", category: "abonelik", description: "Apple Music; 100M+ şarkı, reklamsız ve çevrimdışı.", tone: "danger", icon: "applemusic", brand: "#FA243C", variants: [
    { label: "Bireysel 1 Ay", price: 79.99, compare_at: 84.99 },
    { label: "Bireysel 3 Ay", price: 219.99, compare_at: 239.99, bonus_pct: 1 },
    { label: "1 Yıl", price: 799.99, compare_at: 859.99, bonus_pct: 2 },
  ]},
  { slug: "apple-tv-plus", name: "Apple TV+", category: "abonelik", description: "Apple TV+; ödüllü orijinal diziler ve filmler.", tone: "brand", icon: "appletv", brand: "#000000", variants: [
    { label: "1 Ay", price: 99.99, compare_at: 109.99 },
    { label: "3 Ay", price: 269.99, compare_at: 289.99, bonus_pct: 1 },
  ]},
  { slug: "tinder-gold", name: "Tinder Gold", category: "abonelik", description: "Tinder Gold; sınırsız beğeni, kim beğendi ve boost.", tone: "danger", icon: "tinder", brand: "#FE3C72", variants: [
    { label: "1 Ay", price: 299.99, compare_at: 329.99 },
    { label: "3 Ay", price: 749.99, compare_at: 819.99, bonus_pct: 1 },
    { label: "6 Ay", price: 1299.99, compare_at: 1429.99, bonus_pct: 2 },
  ]},
  { slug: "twitch-turbo", name: "Twitch Turbo", category: "abonelik", description: "Twitch Turbo; reklamsız izleme ve özel rozet.", tone: "brand", icon: "twitch", brand: "#9146FF", variants: [
    { label: "1 Ay", price: 189.99, compare_at: 209.99 },
  ]},
  { slug: "duolingo-super", name: "Duolingo Super", category: "abonelik", description: "Duolingo Super; reklamsız, sınırsız can ve pratik.", tone: "success", icon: "duolingo", brand: "#58CC02", variants: [
    { label: "1 Ay", price: 129.99, compare_at: 149.99 },
    { label: "1 Yıl", price: 999.99, compare_at: 1199.99, bonus_pct: 2 },
  ]},
  { slug: "chatgpt-plus", name: "ChatGPT Plus", category: "abonelik", description: "ChatGPT Plus; GPT-4o erişimi ve öncelikli kullanım.", tone: "success", icon: "openai", brand: "#10A37F", variants: [
    { label: "1 Aylık Hesap", price: 899.99, compare_at: 999.99 },
  ]},
  { slug: "canva-pro", name: "Canva Pro", category: "abonelik", description: "Canva Pro; premium şablon, içerik ve marka kiti.", tone: "info", icon: "canva", brand: "#00C4CC", variants: [
    { label: "1 Ay", price: 199.99, compare_at: 219.99 },
    { label: "1 Yıl", price: 1499.99, compare_at: 1699.99, bonus_pct: 2 },
  ]},

  // ───────── DİJİTAL HİZMET ─────────
  { slug: "windows-11-pro", name: "Windows 11 Pro Lisans", category: "dijital-hizmet", description: "Windows 11 Pro orijinal dijital lisans; ömür boyu.", tone: "brand", icon: "windows", brand: "#0078D6", variants: [
    { label: "Windows 11 Pro (1 PC)", price: 299.99, compare_at: 349.99 },
    { label: "Windows 11 Home (1 PC)", price: 249.99, compare_at: 289.99 },
  ]},
  { slug: "office-2021-pro", name: "Office 2021 Pro Plus", category: "dijital-hizmet", description: "Office 2021 Pro Plus dijital lisans.", tone: "danger", icon: "microsoftoffice", brand: "#D83B01", variants: [
    { label: "Office 2021 Pro Plus", price: 399.99, compare_at: 459.99 },
    { label: "Office 2019 Pro Plus", price: 299.99, compare_at: 349.99 },
  ]},
  { slug: "nordvpn", name: "NordVPN Abonelik", category: "dijital-hizmet", description: "NordVPN güvenli VPN; gizlilik ve erişim.", tone: "info", icon: "nordvpn", brand: "#4687FF", variants: [
    { label: "1 Yıl (1 Cihaz)", price: 449.99, compare_at: 549.99 },
    { label: "2 Yıl (6 Cihaz)", price: 1299.99, compare_at: 1599.99, bonus_pct: 2 },
  ]},
  { slug: "eset-antivirus", name: "ESET Antivirüs Lisans", category: "dijital-hizmet", description: "ESET orijinal antivirüs lisansı; tam koruma.", tone: "warning", icon: "eset", brand: "#00A4E0", variants: [
    { label: "1 Yıl (1 Cihaz)", price: 249.99, compare_at: 299.99 },
    { label: "1 Yıl (3 Cihaz)", price: 549.99, compare_at: 629.99, bonus_pct: 1 },
  ]},
  { slug: "steam-game-key", name: "Steam Oyun Key", category: "dijital-hizmet", description: "Popüler Steam oyunları için orijinal aktivasyon anahtarı.", tone: "brand", icon: "steam", brand: "#1B2838", variants: [
    { label: "İndie / Bütçe Oyunu", price: 149.99, compare_at: 199.99 },
    { label: "AA Oyun", price: 399.99, compare_at: 499.99 },
    { label: "AAA Yeni Çıkış", price: 999.99, compare_at: 1199.99, bonus_pct: 1 },
  ]},
  { slug: "office-365", name: "Microsoft 365", category: "dijital-hizmet", description: "Microsoft 365; Word, Excel, OneDrive ve bulut.", tone: "danger", icon: "microsoft365", brand: "#D83B01", variants: [
    { label: "Personal 1 Yıl", price: 549.99, compare_at: 649.99 },
    { label: "Family 1 Yıl", price: 749.99, compare_at: 899.99, bonus_pct: 1 },
  ]},
  { slug: "windows-10-pro", name: "Windows 10 Pro Lisans", category: "dijital-hizmet", description: "Windows 10 Pro orijinal dijital lisans; ömür boyu.", tone: "info", icon: "windows", brand: "#0078D6", variants: [
    { label: "Windows 10 Pro (1 PC)", price: 249.99, compare_at: 299.99 },
    { label: "Windows 10 Home (1 PC)", price: 199.99, compare_at: 249.99 },
  ]},
  { slug: "mcafee-total", name: "McAfee Total Protection", category: "dijital-hizmet", description: "McAfee Total Protection; antivirüs ve VPN.", tone: "danger", icon: "mcafee", brand: "#C01818", variants: [
    { label: "1 Yıl (1 Cihaz)", price: 229.99, compare_at: 279.99 },
    { label: "1 Yıl (5 Cihaz)", price: 449.99, compare_at: 529.99, bonus_pct: 1 },
  ]},
  { slug: "kaspersky", name: "Kaspersky Lisans", category: "dijital-hizmet", description: "Kaspersky güvenlik yazılımı; tam koruma.", tone: "success", icon: "kaspersky", brand: "#006D5C", variants: [
    { label: "Standart 1 Yıl (1 Cihaz)", price: 239.99, compare_at: 289.99 },
    { label: "Plus 1 Yıl (3 Cihaz)", price: 449.99, compare_at: 519.99, bonus_pct: 1 },
  ]},
  { slug: "bitdefender", name: "Bitdefender Lisans", category: "dijital-hizmet", description: "Bitdefender Total Security; çok katmanlı koruma.", tone: "danger", icon: "bitdefender", brand: "#ED1C24", variants: [
    { label: "1 Yıl (1 Cihaz)", price: 229.99, compare_at: 279.99 },
    { label: "1 Yıl (5 Cihaz)", price: 429.99, compare_at: 499.99, bonus_pct: 1 },
  ]},
  { slug: "malwarebytes", name: "Malwarebytes Premium", category: "dijital-hizmet", description: "Malwarebytes Premium; zararlı yazılım koruması.", tone: "info", icon: null, brand: "#0078D4", variants: [
    { label: "1 Yıl (1 Cihaz)", price: 219.99, compare_at: 269.99 },
    { label: "1 Yıl (3 Cihaz)", price: 399.99, compare_at: 469.99, bonus_pct: 1 },
  ]},
  { slug: "adobe-creative-cloud", name: "Adobe Creative Cloud", category: "dijital-hizmet", description: "Adobe CC; Photoshop, Illustrator ve tüm uygulamalar.", tone: "danger", icon: "adobe", brand: "#DA1F26", variants: [
    { label: "Photoshop 1 Ay", price: 449.99, compare_at: 519.99 },
    { label: "Tüm Uygulamalar 1 Ay", price: 899.99, compare_at: 999.99, bonus_pct: 1 },
  ]},
  { slug: "game-pass-pc", name: "Xbox Game Pass (PC)", category: "dijital-hizmet", description: "PC Game Pass; yüzlerce PC oyunu kütüphanesi.", tone: "success", icon: "xbox", brand: "#107C10", variants: [
    { label: "PC 1 Ay", price: 179.99, compare_at: 199.99 },
    { label: "PC 3 Ay", price: 499.99, compare_at: 549.99, bonus_pct: 1 },
  ]},
  { slug: "ea-play", name: "EA Play", category: "dijital-hizmet", description: "EA Play; EA oyun kütüphanesi ve erken erişim.", tone: "brand", icon: "ea", brand: "#0A0A0A", variants: [
    { label: "1 Ay", price: 149.99, compare_at: 169.99 },
    { label: "12 Ay", price: 899.99, compare_at: 999.99, bonus_pct: 2 },
  ]},
  { slug: "ubisoft-plus", name: "Ubisoft+", category: "dijital-hizmet", description: "Ubisoft+; Ubisoft oyunlarına sınırsız erişim.", tone: "info", icon: "ubisoft", brand: "#0070FF", variants: [
    { label: "1 Ay", price: 449.99, compare_at: 499.99 },
  ]},
];
