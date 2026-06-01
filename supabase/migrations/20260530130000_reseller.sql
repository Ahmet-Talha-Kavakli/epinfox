-- ════════════════════════════════════════════════════════════════════════════
-- Bayilik (reseller) sistemi
--  1) profiles: bayilik durumu + kademe + indirim + mağaza + API/webhook
--  2) reseller_applications: başvuru kayıtları (pending/approved/rejected)
-- Onay admin tarafından verilir; onayda profil alanları doldurulur.
-- ════════════════════════════════════════════════════════════════════════════

-- Bayilik durumu: none = başvuru yok; pending = beklemede;
-- approved = aktif bayi; rejected = reddedildi.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'reseller_status') then
    create type reseller_status as enum ('none', 'pending', 'approved', 'rejected');
  end if;
end $$;

-- Bayilik kademesi (indirim oranını belirler).
do $$
begin
  if not exists (select 1 from pg_type where typname = 'reseller_tier') then
    create type reseller_tier as enum ('bronze', 'silver', 'gold', 'platinum');
  end if;
end $$;

alter table profiles
  add column if not exists reseller_status   reseller_status not null default 'none',
  add column if not exists reseller_tier     reseller_tier,
  add column if not exists reseller_discount numeric(5,2) not null default 0,  -- toptan indirim %
  add column if not exists reseller_store    text,        -- bayi mağaza/işletme adı
  add column if not exists reseller_api_key  text,        -- hash'lenmemiş; bayiye özel (demo)
  add column if not exists reseller_webhook  text,        -- sipariş bildirimleri için
  add column if not exists reseller_since    timestamptz; -- onay tarihi

create unique index if not exists profiles_reseller_api_key_idx
  on profiles (reseller_api_key)
  where reseller_api_key is not null;

-- ── Başvurular ──────────────────────────────────────────────────────────────
create table if not exists reseller_applications (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  -- başvuru türü
  company_type  text not null default 'individual' check (company_type in ('individual','company')),
  company_name  text not null,                 -- firma / şahıs adı
  contact_name  text not null,                 -- yetkili ad soyad
  phone         text not null,
  tax_number    text,                          -- VKN/TCKN (opsiyonel)
  -- satış profili
  channel       text not null default 'web' check (channel in ('web','social','physical','other')),
  monthly_volume text,                          -- tahmini aylık alım hacmi (serbest metin / aralık)
  message       text,                           -- başvuru notu
  status        reseller_status not null default 'pending',
  reject_reason text,
  reviewed_at   timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists reseller_applications_user_idx
  on reseller_applications (user_id, created_at desc);
create index if not exists reseller_applications_status_idx
  on reseller_applications (status, created_at desc);
