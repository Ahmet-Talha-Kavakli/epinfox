-- ════════════════════════════════════════════════════════════════════════════
-- EpinFox — "Oyuncu ID / Kayıtlı Hesaplar"
-- Kullanıcı platform/oyun hesap bilgilerini (Instagram profil URL, Mobile Legends
-- hesap ID, TikTok kullanıcı adı vb.) bir kez kaydeder. Sipariş verirken ilgili
-- platformun kayıtlı değeri otomatik dolu gelir (kullanıcı yine değiştirebilir).
--
-- platform: serbest anahtar (kategori/marka slug'ı ile eşleşir — instagram, tiktok,
--           youtube, x, mobile-legends, pubg-mobile, valorant ...). value: ID/URL.
-- ════════════════════════════════════════════════════════════════════════════

create table if not exists player_accounts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  platform    text not null,                 -- slug (kategori/marka ile eşleşir)
  label       text,                          -- görünen ad (örn "Mobile Legends")
  value       text not null,                 -- hesap ID'si / profil linki / kullanıcı adı
  updated_at  timestamptz not null default now(),
  created_at  timestamptz not null default now(),
  unique (user_id, platform)                 -- platform başına tek kayıt
);
create index if not exists idx_player_accounts_user on player_accounts (user_id);
-- Erişim sunucu tarafı admin client ile; RLS kullanılmıyor (diğer tablolar gibi).
