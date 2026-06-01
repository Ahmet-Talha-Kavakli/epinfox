-- ════════════════════════════════════════════════════════════════════════════
-- Sosyal bağlantılar + adres/fatura + bağış altyapısı
--  1) profiles: sosyal medya kullanıcı adları (Instagram/TikTok/Steam/Discord/X)
--  2) billing_addresses: bireysel/kurumsal fatura adresleri (CRUD)
--  3) wallet_txn_type enum'a 'donation'
--  4) donations tablosu + wallet_donate RPC (cüzdandan atomik düşüm)
-- ════════════════════════════════════════════════════════════════════════════

-- ── 1) Sosyal medya alanları ────────────────────────────────────────────────
alter table profiles
  add column if not exists social_instagram text,
  add column if not exists social_tiktok    text,
  add column if not exists social_steam      text,
  add column if not exists social_discord    text,
  add column if not exists social_x          text;

-- ── 2) Fatura adresleri ─────────────────────────────────────────────────────
create table if not exists billing_addresses (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  -- 'individual' = bireysel, 'corporate' = kurumsal
  kind          text not null default 'individual' check (kind in ('individual','corporate')),
  title         text not null,                 -- adres etiketi (Ev, İş…)
  full_name     text not null,                 -- ad soyad / yetkili
  phone         text,
  -- kurumsal alanlar (bireyselde boş)
  company_name  text,
  tax_office    text,
  tax_number    text,                          -- VKN / TCKN
  -- adres
  country       text not null default 'Türkiye',
  city          text not null,
  district      text,
  zip_code      text,
  address_line  text not null,
  is_default    boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists billing_addresses_user_idx
  on billing_addresses (user_id, created_at desc);

-- Kullanıcı başına yalnızca tek varsayılan adres.
create unique index if not exists billing_addresses_one_default
  on billing_addresses (user_id)
  where is_default;

-- ── 3) Bağış tipi ───────────────────────────────────────────────────────────
do $$
begin
  if not exists (
    select 1 from pg_enum
    where enumlabel = 'donation'
      and enumtypid = 'wallet_txn_type'::regtype
  ) then
    alter type wallet_txn_type add value 'donation';
  end if;
end $$;

-- ── 4) Bağışlar ─────────────────────────────────────────────────────────────
create table if not exists donations (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  campaign    text not null,                   -- destek olunan kampanya/kurum
  amount      numeric(12,2) not null check (amount > 0),
  message     text,                            -- bağışçı notu (opsiyonel)
  anonymous   boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists donations_user_idx
  on donations (user_id, created_at desc);
