-- ════════════════════════════════════════════════════════════════════════════
-- KodKasa — ürün yorumları (yıldız + metin)
-- ════════════════════════════════════════════════════════════════════════════
-- Sadece o ürünü satın almış kullanıcı yorum yapabilir (app-code'da doğrulanır).
-- Kullanıcı başına ürün başına TEK yorum (unique).

create table if not exists reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  user_id     uuid not null references profiles(id) on delete cascade,
  rating      smallint not null check (rating between 1 and 5),
  body        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (product_id, user_id)
);
create index if not exists idx_reviews_product on reviews (product_id, created_at desc);
