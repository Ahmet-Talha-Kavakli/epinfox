-- ════════════════════════════════════════════════════════════════════════════
-- KodKasa — init şeması (Faz 1 MVP)
-- ════════════════════════════════════════════════════════════════════════════
-- Strateji: Clerk auth + Supabase service-role. Auth kontrolü app-code'da yapılır
-- (requireAdmin / requireMember). RLS açık ama service-role bypass eder; product_codes
-- için anon/auth erişimi tamamen kapalı (kodlar gizli).

create extension if not exists pgcrypto;

-- ─── ENUMS ──────────────────────────────────────────────────────────────────
do $$ begin
  create type user_role as enum ('owner','admin','member');
exception when duplicate_object then null; end $$;

do $$ begin
  create type code_status as enum ('available','sold','reserved','disabled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('completed','refunded','failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type wallet_txn_type as enum ('topup','purchase','refund','adjustment');
exception when duplicate_object then null; end $$;

-- ─── PROFILES ───────────────────────────────────────────────────────────────
create table if not exists profiles (
  id              uuid primary key default gen_random_uuid(),
  clerk_user_id   text unique,
  email           text not null,
  nickname        text unique not null,
  role            user_role not null default 'member',
  balance         numeric(12,2) not null default 0 check (balance >= 0),
  avatar_path     text,
  joined_at       timestamptz not null default now(),
  last_active_at  timestamptz
);
create index if not exists idx_profiles_clerk on profiles (clerk_user_id);
create index if not exists idx_profiles_role on profiles (role);

-- ─── CATEGORIES ─────────────────────────────────────────────────────────────
create table if not exists categories (
  id           serial primary key,
  slug         text unique not null,
  name         text not null,
  description  text,
  tone         text not null default 'brand',
  icon_path    text,
  position     int not null default 100,
  is_active    boolean not null default true
);

-- ─── PRODUCTS ───────────────────────────────────────────────────────────────
create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  category_id  int not null references categories(id),
  slug         text unique not null,
  name         text not null,
  description  text,
  price        numeric(12,2) not null check (price >= 0),
  image_path   text,
  tone         text not null default 'brand',
  is_active    boolean not null default true,
  position     int not null default 100,
  created_at   timestamptz not null default now()
);
create index if not exists idx_products_category on products (category_id);
create index if not exists idx_products_active on products (is_active, position);

-- ─── ORDERS ─────────────────────────────────────────────────────────────────
create table if not exists orders (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references profiles(id),
  product_id        uuid not null references products(id),
  code_id           uuid,  -- product_codes(id); FK aşağıda deferrable eklenir
  product_name      text not null,        -- snapshot
  price             numeric(12,2) not null, -- snapshot
  status            order_status not null default 'completed',
  payment_provider  text not null default 'wallet',  -- Faz 2 hazırlık
  created_at        timestamptz not null default now()
);
create index if not exists idx_orders_user on orders (user_id, created_at desc);

-- ─── PRODUCT_CODES (HASSAS — kod şifreli, gizli) ────────────────────────────
create table if not exists product_codes (
  id              uuid primary key default gen_random_uuid(),
  product_id      uuid not null references products(id) on delete cascade,
  code_encrypted  bytea not null,                      -- pgp_sym_encrypt çıktısı
  status          code_status not null default 'available',
  order_id        uuid references orders(id),
  created_at      timestamptz not null default now(),
  sold_at         timestamptz
);
-- Race-safe kod atama için kritik index:
create index if not exists idx_codes_avail on product_codes (product_id, status);

-- orders.code_id -> product_codes(id) (her ikisi de var olduktan sonra)
do $$ begin
  alter table orders
    add constraint orders_code_id_fkey
    foreign key (code_id) references product_codes(id);
exception when duplicate_object then null; end $$;

-- ─── WALLET_TRANSACTIONS (denetim izi + Faz 2 hazırlık) ─────────────────────
create table if not exists wallet_transactions (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references profiles(id),
  type           wallet_txn_type not null,
  amount         numeric(12,2) not null,   -- topup/refund +, purchase -
  balance_after  numeric(12,2) not null,
  order_id       uuid references orders(id),
  payment_ref    text,                     -- Faz 2: PayTR transaction id
  note           text,
  created_at     timestamptz not null default now()
);
create index if not exists idx_wallet_user on wallet_transactions (user_id, created_at desc);

-- ════════════════════════════════════════════════════════════════════════════
-- RLS — service-role bypass eder; anon/auth için kapalı.
-- product_codes: HİÇBİR rol için select policy yok → kodlar gizli.
-- ════════════════════════════════════════════════════════════════════════════
alter table profiles            enable row level security;
alter table categories          enable row level security;
alter table products            enable row level security;
alter table orders              enable row level security;
alter table product_codes       enable row level security;
alter table wallet_transactions enable row level security;

-- Kategoriler ve aktif ürünler herkese açık (vitrin). Geri kalan tablolar kapalı.
do $$ begin
  create policy "categories_public_read" on categories
    for select using (is_active = true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "products_public_read" on products
    for select using (is_active = true);
exception when duplicate_object then null; end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- RPC: wallet_topup — mock bakiye yükleme (Faz 2'de PayTR callback'i çağırır)
-- ════════════════════════════════════════════════════════════════════════════
create or replace function wallet_topup(
  p_user_id uuid,
  p_amount numeric,
  p_payment_ref text default null
)
returns numeric  -- yeni bakiye
language plpgsql
security definer
as $$
declare
  v_new_balance numeric(12,2);
begin
  if p_amount is null or p_amount <= 0 then
    raise exception 'INVALID_AMOUNT';
  end if;

  update profiles
    set balance = balance + p_amount
    where id = p_user_id
    returning balance into v_new_balance;

  if v_new_balance is null then
    raise exception 'USER_NOT_FOUND';
  end if;

  insert into wallet_transactions (user_id, type, amount, balance_after, payment_ref, note)
    values (p_user_id, 'topup', p_amount, v_new_balance, p_payment_ref, 'Bakiye yükleme');

  return v_new_balance;
end;
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- RPC: purchase_product — atomik, race-safe satın alma
-- Tek transaction: ürün kilidi → bakiye kontrol → race-safe kod atama
-- (for update skip locked) → order → kod sold → bakiye düş → txn → kod decrypt.
-- ════════════════════════════════════════════════════════════════════════════
create or replace function purchase_product(
  p_user_id uuid,
  p_product_id uuid,
  p_enc_key text
)
returns table (order_id uuid, code text)
language plpgsql
security definer
as $$
declare
  v_price        numeric(12,2);
  v_is_active    boolean;
  v_name         text;
  v_balance      numeric(12,2);
  v_code_id      uuid;
  v_code_enc     bytea;
  v_order_id     uuid;
  v_new_balance  numeric(12,2);
begin
  -- 1) Ürünü kilitle ve oku
  select price, is_active, name
    into v_price, v_is_active, v_name
    from products
    where id = p_product_id
    for update;

  if v_price is null then
    raise exception 'PRODUCT_NOT_FOUND';
  end if;
  if not v_is_active then
    raise exception 'PRODUCT_INACTIVE';
  end if;

  -- 2) Bakiye kontrol (satır kilidi)
  select balance into v_balance
    from profiles
    where id = p_user_id
    for update;

  if v_balance is null then
    raise exception 'USER_NOT_FOUND';
  end if;
  if v_balance < v_price then
    raise exception 'INSUFFICIENT_BALANCE';
  end if;

  -- 3) RACE-SAFE kod atama — eşzamanlı alımlar farklı koda gider, çift teslim olmaz
  select id, code_encrypted
    into v_code_id, v_code_enc
    from product_codes
    where product_id = p_product_id and status = 'available'
    order by created_at
    for update skip locked
    limit 1;

  if v_code_id is null then
    raise exception 'OUT_OF_STOCK';
  end if;

  -- 4) Order oluştur (snapshot)
  insert into orders (user_id, product_id, code_id, product_name, price, status, payment_provider)
    values (p_user_id, p_product_id, v_code_id, v_name, v_price, 'completed', 'wallet')
    returning id into v_order_id;

  -- 5) Kodu sold işaretle
  update product_codes
    set status = 'sold', order_id = v_order_id, sold_at = now()
    where id = v_code_id;

  -- 6) Bakiye düş
  update profiles
    set balance = balance - v_price
    where id = p_user_id
    returning balance into v_new_balance;

  -- 7) Wallet transaction
  insert into wallet_transactions (user_id, type, amount, balance_after, order_id, note)
    values (p_user_id, 'purchase', -v_price, v_new_balance, v_order_id, v_name);

  -- 8) Kodu decrypt edip dön
  order_id := v_order_id;
  code := pgp_sym_decrypt(v_code_enc, p_enc_key);
  return next;
end;
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- RPC: reveal_order_code — kullanıcı kendi siparişinin kodunu tekrar görür
-- ════════════════════════════════════════════════════════════════════════════
create or replace function reveal_order_code(
  p_user_id uuid,
  p_order_id uuid,
  p_enc_key text
)
returns text
language plpgsql
security definer
as $$
declare
  v_code_enc bytea;
begin
  select pc.code_encrypted
    into v_code_enc
    from orders o
    join product_codes pc on pc.id = o.code_id
    where o.id = p_order_id and o.user_id = p_user_id;

  if v_code_enc is null then
    raise exception 'ORDER_NOT_FOUND';
  end if;

  return pgp_sym_decrypt(v_code_enc, p_enc_key);
end;
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- RPC: add_product_codes — admin toplu kod ekleme (şifreli insert)
-- ════════════════════════════════════════════════════════════════════════════
create or replace function add_product_codes(
  p_product_id uuid,
  p_codes text[],
  p_enc_key text
)
returns int  -- eklenen adet
language plpgsql
security definer
as $$
declare
  v_code text;
  v_count int := 0;
begin
  foreach v_code in array p_codes loop
    if length(trim(v_code)) > 0 then
      insert into product_codes (product_id, code_encrypted, status)
        values (p_product_id, pgp_sym_encrypt(trim(v_code), p_enc_key), 'available');
      v_count := v_count + 1;
    end if;
  end loop;
  return v_count;
end;
$$;
