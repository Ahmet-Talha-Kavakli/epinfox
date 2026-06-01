-- ════════════════════════════════════════════════════════════════════════════
-- Admin paneli altyapısı
--  1) profiles: hesap askıya alma (banned_at + ban_reason)
--  2) promo_codes: gerçek promo kod tablosu (mock KNOWN_CODES yerine)
--  3) wallet_adjust RPC: admin manuel bakiye artır/azalt (atomik, race-safe)
-- ════════════════════════════════════════════════════════════════════════════

-- ── 1) Askıya alma ───────────────────────────────────────────────────────────
alter table profiles
  add column if not exists banned_at  timestamptz,
  add column if not exists ban_reason text;

-- ── 2) Promo kodlar ──────────────────────────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'promo_type') then
    create type promo_type as enum ('bonus_balance', 'percent', 'free_shipping');
  end if;
end $$;

create table if not exists promo_codes (
  id           uuid primary key default gen_random_uuid(),
  code         text not null unique,           -- büyük harf saklanır
  type         promo_type not null default 'bonus_balance',
  value        numeric(12,2) not null default 0, -- bonus tutar / yüzde
  description  text,
  max_uses     int,                            -- null = sınırsız
  used_count   int not null default 0,
  expires_at   timestamptz,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

create index if not exists promo_codes_active_idx
  on promo_codes (is_active, code);

-- ── 3) Manuel bakiye düzeltme (admin) ─────────────────────────────────────────
-- p_amount pozitif = ekle, negatif = düş. Atomik; bakiye eksiye düşemez.
create or replace function wallet_adjust(
  p_user_id uuid,
  p_amount  numeric,
  p_note    text default 'Admin düzeltme'
)
returns numeric  -- yeni bakiye
language plpgsql
security definer
as $$
declare
  v_balance     numeric(12,2);
  v_new_balance numeric(12,2);
begin
  if p_amount is null or p_amount = 0 then
    raise exception 'INVALID_AMOUNT';
  end if;

  select balance into v_balance
    from profiles
    where id = p_user_id
    for update;

  if v_balance is null then
    raise exception 'USER_NOT_FOUND';
  end if;
  if v_balance + p_amount < 0 then
    raise exception 'INSUFFICIENT_BALANCE';
  end if;

  update profiles
    set balance = balance + p_amount
    where id = p_user_id
    returning balance into v_new_balance;

  insert into wallet_transactions (user_id, type, amount, balance_after, note)
    values (p_user_id, 'adjustment', p_amount, v_new_balance, p_note);

  return v_new_balance;
end;
$$;

-- Örnek promo kodlar (mock KNOWN_CODES'tan taşındı).
insert into promo_codes (code, type, value, description, is_active)
values
  ('EPINFOX10', 'bonus_balance', 10, '%10 bonus bakiye', true),
  ('HOSGELDIN', 'bonus_balance', 25, 'Hoş geldin paketi: 25₺ bonus', true),
  ('VIP2026',   'percent',       0,  'VIP üyelik avantajı', true)
on conflict (code) do nothing;
