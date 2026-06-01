-- ════════════════════════════════════════════════════════════════════════════
-- EpinFox — İçerik Çevirileri (content_translations)
-- DB'deki kullanıcıya görünen TR metinler (ürün/kategori/marka/varyant/promo)
-- için locale bazlı çeviri overlay'i. Sorgular ham TR satırı çeker, sonra
-- applyTranslations() ile hedef locale'in çevirisi TR alanların üzerine biner.
-- Çeviri yoksa TR fallback (kullanıcı her zaman bir şey görür).
--
-- entity_type: 'product' | 'category' | 'brand' | 'variant' | 'promo'
-- entity_id:   ilgili satırın PK'sı (uuid VEYA int) — text olarak tutulur
-- locale:      'en' | 'de' | 'ar' | 'ru'  (tr kaynak; saklanmaz)
-- payload:     JSONB — çevrilen alanlar, ör {"name": "...", "description": "...",
--              "how_to": [...], "faq": [{"q":"...","a":"..."}]}
-- ════════════════════════════════════════════════════════════════════════════

create table if not exists content_translations (
  id           uuid primary key default gen_random_uuid(),
  entity_type  text not null,
  entity_id    text not null,                 -- uuid veya int → text (tek kolon)
  locale       text not null,                 -- en/de/ar/ru
  payload      jsonb not null default '{}'::jsonb,
  updated_at   timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  unique (entity_type, entity_id, locale)     -- entity+locale başına tek kayıt
);

-- Overlay sorgusu: bir entity_type + locale için tüm çevirileri tek seferde çek.
create index if not exists idx_content_tr_lookup
  on content_translations (entity_type, locale);

-- Erişim sunucu tarafı admin client ile; RLS kullanılmıyor (diğer tablolar gibi).
