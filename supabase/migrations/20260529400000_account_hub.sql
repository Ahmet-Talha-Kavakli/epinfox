-- ════════════════════════════════════════════════════════════════════════════
-- KodKasa — hesap merkezi: faturalar, destek talepleri, referans
-- ════════════════════════════════════════════════════════════════════════════
-- Tüm erişim app-code'da (requireMember) kontrol edilir; service-role kullanılır.

-- ─── FATURALAR ──────────────────────────────────────────────────────────────
-- Her tamamlanmış sipariş için basit fatura kaydı. (Yasal e-fatura DEĞİL —
-- F6'da ETBİS/e-fatura entegrasyonu gelene kadar "satış belgesi" niteliğinde.)
do $$ begin
  create type invoice_status as enum ('issued','paid','cancelled');
exception when duplicate_object then null; end $$;

create table if not exists invoices (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  order_id      uuid references orders(id) on delete set null,
  number        text not null unique,        -- KK-2026-000123
  description   text not null,               -- "Valorant VP (475 VP)"
  amount        numeric(12,2) not null,
  status        invoice_status not null default 'paid',
  created_at    timestamptz not null default now()
);
create index if not exists idx_invoices_user on invoices (user_id, created_at desc);

-- ─── DESTEK TALEPLERİ ─────────────────────────────────────────────────────────
do $$ begin
  create type ticket_status as enum ('open','answered','resolved','closed');
exception when duplicate_object then null; end $$;

create table if not exists support_tickets (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  subject       text not null,
  category      text not null default 'general',  -- general | order | wallet | other
  status        ticket_status not null default 'open',
  order_id      uuid references orders(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists idx_tickets_user on support_tickets (user_id, updated_at desc);

create table if not exists support_messages (
  id            uuid primary key default gen_random_uuid(),
  ticket_id     uuid not null references support_tickets(id) on delete cascade,
  author_id     uuid references profiles(id) on delete set null,
  is_staff      boolean not null default false,   -- destek ekibi mi
  body          text not null,
  created_at    timestamptz not null default now()
);
create index if not exists idx_ticket_messages on support_messages (ticket_id, created_at asc);

-- ─── REFERANS ─────────────────────────────────────────────────────────────────
-- Her kullanıcının benzersiz davet kodu + kimi davet ettiği kaydı.
alter table profiles
  add column if not exists referral_code text unique,
  add column if not exists referred_by uuid references profiles(id);

create table if not exists referrals (
  id            uuid primary key default gen_random_uuid(),
  referrer_id   uuid not null references profiles(id) on delete cascade,
  referred_id   uuid not null references profiles(id) on delete cascade,
  reward_amount numeric(12,2) not null default 0,
  created_at    timestamptz not null default now(),
  unique (referred_id)   -- bir kişi yalnız bir kez davet edilebilir
);
create index if not exists idx_referrals_referrer on referrals (referrer_id, created_at desc);

-- Mevcut kullanıcılara referans kodu üret (8 haneli, base36 benzeri).
update profiles
set referral_code = upper(substr(md5(id::text || 'kodkasa'), 1, 8))
where referral_code is null;
