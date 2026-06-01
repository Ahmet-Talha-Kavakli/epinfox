// ~/Desktop/Logolar/guncel/ içindeki 10 yeni pazarlama görselini optimize + yerleştir.
// hero/side/bento -> public/promo & public/campaign, footer -> public/footer-bg.webp
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC = "/Users/aysegulcadircioglu/Desktop/Logolar/guncel";
const PUB = path.join(__dirname, "..", "public");

// [dosya, çıktı yolu (public'e göre), genişlik, yükseklik]
const ITEMS = [
  ["hf_20260531_120822_09a3cdf1-e8df-48a6-8282-a10f6bee1758.png", "promo/promo-hero.webp", 1600, 900],
  ["hf_20260531_120829_6d9792c7-356c-4795-9414-c67d80216805.png", "promo/promo-abonelik.webp", 1600, 900],
  ["hf_20260531_120835_dffbf037-ef5a-4449-867d-29e5bc57d163.png", "promo/promo-komisyon.webp", 1600, 900],
  ["hf_20260531_122313_17101c45-004b-4093-915e-2623cb29d7c3.png", "promo/promo-bayram.webp", 1600, 900],
  ["hf_20260531_120850_834195f4-1e77-4330-b5e7-42b916d5a698.png", "promo/side-sosyal.webp", 800, 600],
  ["hf_20260531_122016_4c52f436-aee3-4b89-b266-df1dcce5eb07.png", "promo/side-cuzdan.webp", 800, 600],
  ["hf_20260531_120933_acaff7fa-e062-40ce-a327-efb3cdcc18c4.png", "campaign/camp-hediye.webp", 900, 560],
  ["hf_20260531_120951_64568533-ecf5-45c6-a44b-050a81201f3a.png", "campaign/camp-cekilis.webp", 900, 560],
  ["hf_20260531_120926_6ccfd5e5-e96f-4134-8823-eb35190af418.png", "campaign/camp-sosyal.webp", 1400, 540],
  ["hf_20260531_121002_0f50e754-d5a1-403d-a663-e80e99e08155.png", "footer-bg.webp", 1920, 540],
];

(async () => {
  let ok = 0, totalIn = 0, totalOut = 0;
  for (const [file, out, w, h] of ITEMS) {
    const src = path.join(SRC, file);
    if (!fs.existsSync(src)) { console.error(`✗ kaynak yok: ${file}`); continue; }
    const inSize = fs.statSync(src).size;
    const buf = await sharp(src).resize(w, h, { fit: "cover", position: "centre" }).webp({ quality: 82 }).toBuffer();
    const outPath = path.join(PUB, out);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, buf);
    totalIn += inSize; totalOut += buf.length; ok++;
    console.log(`✓ ${out}  ${(inSize/1e6).toFixed(1)}MB → ${(buf.length/1e3).toFixed(0)}KB`);
  }
  console.log(`\n${ok} görsel. ${(totalIn/1e6).toFixed(0)}MB → ${(totalOut/1e6).toFixed(1)}MB`);
})().catch((e) => { console.error(e); process.exit(1); });
