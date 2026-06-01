-- Yayıncı başvuruları — şu ana kadar form dummy idi, artık DB'ye yazılıyor.
-- Admin onaylayınca publishers tablosuna yayıncı eklenir (yayıncı sayfası oluşur).

create table if not exists publisher_applications (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  platform      text not null,                  -- youtube/twitch/kick/tiktok/instagram
  tier          text not null,                  -- takipçi kademesi (t1..t4)
  stream_url    text not null,
  page_title    text not null,
  min_donation  numeric(10,2) not null default 25,
  alert_provider text,
  status        text not null default 'pending', -- pending/approved/rejected
  reject_reason text,
  reviewed_at   timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists publisher_applications_user_idx
  on publisher_applications (user_id, created_at desc);
create index if not exists publisher_applications_status_idx
  on publisher_applications (status, created_at desc);

-- Onaylanan yayıncılar (yayıncı listesi + /publisher/[slug] sayfası buradan gelir).
-- Şu an statik PUBLISHERS array'i var; onaylanınca buraya kayıt eklenir, sayfa
-- DB + statik birleşimi gösterebilir.
create table if not exists publishers (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references profiles(id) on delete set null,
  slug          text unique not null,
  name          text not null,
  platform      text,
  stream_url    text,
  avatar_path   text,
  min_donation  numeric(10,2) not null default 25,
  total_donations numeric(12,2) not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

create index if not exists publishers_active_idx on publishers (is_active, created_at desc);

-- profiles: yayıncı durumu (başvuru takibi)
do $$
begin
  if not exists (select 1 from information_schema.columns
                 where table_name = 'profiles' and column_name = 'publisher_status') then
    alter table profiles add column publisher_status text default 'none';
    -- none / pending / approved / rejected
  end if;
end $$;
