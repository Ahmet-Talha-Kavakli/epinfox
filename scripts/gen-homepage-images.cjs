// Ana sayfa görselleri — promosyon + blog (gpt-image-2, kullanıcı OpenAI anahtarı).
// Çalıştır: node scripts/gen-homepage-images.cjs
const { genImage, FLAT_3D } = require("./lib/openai-image.cjs");

const JOBS = [
  // Promosyon kartları (public/promo/)
  { out: "public/promo/promo-hero.png", size: "1536x1024",
    prompt: `a treasure chest overflowing with glowing game controllers, gold coins and gift cards, celebration sparkles, energetic banner, dark navy background, ${FLAT_3D}` },
  { out: "public/promo/promo-abonelik.png", size: "1536x1024",
    prompt: `a stack of glowing subscription cards with a play button and music notes, streaming theme, floating, dark navy background, ${FLAT_3D}` },
  { out: "public/promo/promo-sosyal.png", size: "1536x1024",
    prompt: `a smartphone with glowing social media heart and follower icons floating around it, dark navy background, ${FLAT_3D}` },
  { out: "public/promo/promo-komisyon.png", size: "1536x1024",
    prompt: `a glowing digital wallet with coins flowing into it and an upward arrow, low fee concept, dark navy background, ${FLAT_3D}` },

  // Blog görselleri (public/news/)
  { out: "public/news/hesap-merkezi-yenilendi.png", size: "1536x1024",
    prompt: `a modern dashboard interface with panels, wallet and profile icons, dashboard renovation concept, dark navy background, ${FLAT_3D}` },
  { out: "public/news/referans-programi-basladi.png", size: "1536x1024",
    prompt: `two cartoon hands exchanging a glowing gift box with bonus coins, referral reward concept, celebration, dark navy background, ${FLAT_3D}` },
  { out: "public/news/bildirim-sistemi.png", size: "1536x1024",
    prompt: `a glowing bell icon with red notification badges floating around, alert concept, dark navy background, ${FLAT_3D}` },
];

(async () => {
  for (const j of JOBS) {
    process.stdout.write(`→ ${j.out} ... `);
    const t0 = Date.now();
    try {
      await genImage(j);
      console.log(`✓ ${Math.round((Date.now() - t0) / 1000)}s`);
    } catch (e) {
      console.log(`✗ ${(e.message || "").slice(0, 90)}`);
    }
  }
  console.log("\nBitti.");
})();
