-- Ürüne özel içerik: "Nasıl Kullanılır" adımları, "Önemli/Gereksinimler" notu
-- ve ürüne özel SSS. Hepsi opsiyonel — boşsa sayfa generic fallback gösterir.

alter table products
  add column if not exists how_to      text[],   -- sıralı adım listesi
  add column if not exists requirements text,     -- "Önemli" kutusu (ürüne özel not)
  add column if not exists faq         jsonb;     -- [{ "q": "...", "a": "..." }, ...]

comment on column products.how_to is 'Ürüne özel "Nasıl Kullanılır" adımları (sıralı). Boşsa generic adımlar gösterilir.';
comment on column products.requirements is 'Ürün detayındaki "Önemli" kutusu metni. Boşsa generic uyarı gösterilir.';
comment on column products.faq is 'Ürüne özel SSS: [{"q":"soru","a":"cevap"}]. Boşsa generic SSS gösterilir.';
