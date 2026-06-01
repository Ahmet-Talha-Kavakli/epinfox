-- ════════════════════════════════════════════════════════════════════════════
-- KodKasa — denominasyon varyant sistemi
-- ════════════════════════════════════════════════════════════════════════════
-- Tek "PUBG UC" ürünü altında 60/325/660/1800 UC gibi varyantlar. Kodlar artık
-- varyant bazında. purchase_product RPC'si variant alır.
-- Geriye uyum: products.price kaldırılmaz (taban/gösterim fiyatı), her ürün için
-- en az 1 varyant garanti edilir (migration mevcut ürünlerden varyant türetir).

-- ─── PRODUCT_VARIANTS ───────────────────────────────────────────────────────
create table if not exists product_variants (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  label       text not null,                 -- "660 UC", "1 Aylık", "100 TL"
  price       numeric(12,2) not null check (price >= 0),
  compare_at  numeric(12,2),                 -- üstü çizili eski fiyat (indirim için)
  bonus_pct   numeric(5,2) not null default 0, -- "+%1 bonus" puan
  position    int not null default 100,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists idx_variants_product on product_variants (product_id, position);

-- product_codes'a variant_id ekle (kodlar varyanta ait)
alter table product_codes add column if not exists variant_id uuid references product_variants(id) on delete cascade;
create index if not exists idx_codes_variant_avail on product_codes (variant_id, status);

-- orders'a variant snapshot ekle
alter table orders add column if not exists variant_id uuid references product_variants(id);
alter table orders add column if not exists variant_label text;

-- ─── Mevcut ürünlerden birer varyant türet (idempotent) ─────────────────────
-- Her ürün için, henüz varyantı yoksa, ürünün kendi fiyatından "Standart" varyant oluştur
-- ve o ürünün variant_id'siz kodlarını bu varyanta bağla.
do $$
declare
  p record;
  v_variant_id uuid;
begin
  for p in select id, name, price from products loop
    if not exists (select 1 from product_variants where product_id = p.id) then
      insert into product_variants (product_id, label, price, position)
        values (p.id, 'Standart', p.price, 10)
        returning id into v_variant_id;
      update product_codes
        set variant_id = v_variant_id
        where product_id = p.id and variant_id is null;
    end if;
  end loop;
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- RPC güncellemeleri — variant bazlı
-- ════════════════════════════════════════════════════════════════════════════
-- Eski imzaları düşür (parametre adı değiştiği için create-or-replace yetmez).
drop function if exists purchase_product(uuid, uuid, text);
drop function if exists add_product_codes(uuid, text[], text);

-- purchase_product: artık variant alır
create or replace function purchase_product(
  p_user_id uuid,
  p_variant_id uuid,
  p_enc_key text
)
returns table (order_id uuid, code text)
language plpgsql
security definer
as $$
declare
  v_price       numeric(12,2);
  v_v_active    boolean;
  v_v_label     text;
  v_product_id  uuid;
  v_p_active    boolean;
  v_name        text;
  v_balance     numeric(12,2);
  v_code_id     uuid;
  v_code_enc    bytea;
  v_order_id    uuid;
  v_new_balance numeric(12,2);
begin
  -- 1) Varyant + ürün kilitle
  select pv.price, pv.is_active, pv.label, pv.product_id
    into v_price, v_v_active, v_v_label, v_product_id
    from product_variants pv
    where pv.id = p_variant_id
    for update;
  if v_price is null then raise exception 'VARIANT_NOT_FOUND'; end if;
  if not v_v_active then raise exception 'PRODUCT_INACTIVE'; end if;

  select name, is_active into v_name, v_p_active
    from products where id = v_product_id for update;
  if not v_p_active then raise exception 'PRODUCT_INACTIVE'; end if;

  -- 2) Bakiye kontrol
  select balance into v_balance from profiles where id = p_user_id for update;
  if v_balance is null then raise exception 'USER_NOT_FOUND'; end if;
  if v_balance < v_price then raise exception 'INSUFFICIENT_BALANCE'; end if;

  -- 3) RACE-SAFE kod atama (varyant bazında)
  select id, code_encrypted into v_code_id, v_code_enc
    from product_codes
    where variant_id = p_variant_id and status = 'available'
    order by created_at
    for update skip locked
    limit 1;
  if v_code_id is null then raise exception 'OUT_OF_STOCK'; end if;

  -- 4) Order
  insert into orders (user_id, product_id, variant_id, code_id, product_name, variant_label, price, status, payment_provider)
    values (p_user_id, v_product_id, p_variant_id, v_code_id, v_name, v_v_label, v_price, 'completed', 'wallet')
    returning id into v_order_id;

  -- 5) Kod sold
  update product_codes set status='sold', order_id=v_order_id, sold_at=now() where id=v_code_id;

  -- 6) Bakiye düş
  update profiles set balance = balance - v_price where id = p_user_id returning balance into v_new_balance;

  -- 7) Txn
  insert into wallet_transactions (user_id, type, amount, balance_after, order_id, note)
    values (p_user_id, 'purchase', -v_price, v_new_balance, v_order_id, v_name || ' — ' || v_v_label);

  -- 8) Decrypt + dön
  order_id := v_order_id;
  code := pgp_sym_decrypt(v_code_enc, p_enc_key);
  return next;
end;
$$;

-- NOT: purchase_product ve add_product_codes eski imzalarla aynı tip dizisine
-- (uuid,uuid,text) ve (uuid,text[],text) sahip olduğundan create or replace
-- doğrudan üzerine yazar; ayrı drop gerekmez.

-- add_product_codes: artık variant alır
create or replace function add_product_codes(
  p_variant_id uuid,
  p_codes text[],
  p_enc_key text
)
returns int
language plpgsql
security definer
as $$
declare
  v_code text;
  v_count int := 0;
  v_product_id uuid;
begin
  select product_id into v_product_id from product_variants where id = p_variant_id;
  if v_product_id is null then raise exception 'VARIANT_NOT_FOUND'; end if;

  foreach v_code in array p_codes loop
    if length(trim(v_code)) > 0 then
      insert into product_codes (product_id, variant_id, code_encrypted, status)
        values (v_product_id, p_variant_id, pgp_sym_encrypt(trim(v_code), p_enc_key), 'available');
      v_count := v_count + 1;
    end if;
  end loop;
  return v_count;
end;
$$;

-- RLS: aktif varyantlar herkese açık (vitrin)
alter table product_variants enable row level security;
do $$ begin
  create policy "variants_public_read" on product_variants for select using (is_active = true);
exception when duplicate_object then null; end $$;
