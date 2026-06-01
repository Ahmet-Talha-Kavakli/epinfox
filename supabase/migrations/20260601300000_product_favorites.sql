-- ════════════════════════════════════════════════════════════════════════════
-- EpinFox — Ürün favorileri
-- Kullanıcı ürünleri favorileyebilir. Favoriler ürün listesinde en üstte gösterilir.
-- Favori bir ürünün fiyatı veya stok durumu değişince kullanıcıya mail + in-app
-- bildirim gider (server action'lar üzerinden).
-- Erişim sunucu tarafı admin client (service role) ile; diğer tablolar gibi
-- bu tablo da RLS KULLANMAZ.
-- ════════════════════════════════════════════════════════════════════════════

create table if not exists product_favorites (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  product_id  uuid not null references products(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, product_id)
);

-- Kullanıcının favorilerini hızlı çekmek için.
create index if not exists idx_product_favorites_user
  on product_favorites (user_id);

-- Bir ürünü favorileyenleri (fiyat/stok değişiminde) hızlı bulmak için.
create index if not exists idx_product_favorites_product
  on product_favorites (product_id);
