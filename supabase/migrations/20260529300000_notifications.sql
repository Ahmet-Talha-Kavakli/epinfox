-- ════════════════════════════════════════════════════════════════════════════
-- KodKasa — bildirim sistemi
-- ════════════════════════════════════════════════════════════════════════════
-- FairPlay deseninden uyarlandı: tek tablo + app-code'da yazma/okuma.
-- Bildirimler opsiyoneldir; insert hatası akışı (satın alma vb.) kırmamalı.

create table if not exists notifications (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references profiles(id) on delete cascade,
  type        text not null,             -- 'order.completed', 'wallet.topup', vb.
  title       text not null,
  body        text,
  link        text,                       -- tıklanınca gidilecek route (örn. /orders)
  metadata    jsonb not null default '{}'::jsonb,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);

-- Bell/sayfa için ana erişim deseni: kullanıcının en yeni bildirimleri.
create index if not exists idx_notifications_user
  on notifications (user_id, created_at desc);

-- Okunmamış sayacı (head/count sorgusu) için kısmi index.
create index if not exists idx_notifications_unread
  on notifications (user_id)
  where read_at is null;
